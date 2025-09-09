from pymongo import MongoClient
import requests
from bs4 import BeautifulSoup
import re
import time
import datetime
from collections import defaultdict

# -------------------------
# MongoDB setup
# -------------------------
client = MongoClient("mongodb://localhost:27017/")
db = client["mydatabase"]

# Collections
sro_collection = db["sro_codes"]
market_collection = db["market-value"]

# -------------------------
# Utility functions (copied from main.py)
# -------------------------
def has_data(response_text):
    """
    Check if the response contains valid deed data.
    Returns True if data exists, False otherwise.
    """
    no_data_phrase = "Details of the document not found in the Records, contact SRO"
    return no_data_phrase not in response_text

def parse_document(html_text, district, districtCode, state, sro_name, sro_code, docno):
    """
    Extract table values into structured dictionary for storage.
    """
    soup = BeautifulSoup(html_text, "html.parser")
    table = soup.find("table", {"class": "table"})
    if not table:
        return None

    rows = table.find_all("tr")
    if len(rows) < 2:
        return None

    data_row = rows[1].find_all("td")
    if len(data_row) < 6:
        return None

    # Extract market and consideration values from text
    nature_value_text = data_row[3].get_text(" ", strip=True)
    market_match = re.search(r"Mkt\.Value:Rs\.?\s*([\d,]+)", nature_value_text)
    cons_match = re.search(r"Cons\.Value:Rs\.?\s*([\d,]+)", nature_value_text)
    market_value = int(market_match.group(1).replace(",", "")) if market_match else 0
    cons_value = int(cons_match.group(1).replace(",", "")) if cons_match else 0

    # Extract registration, execution, and presentation dates
    dates_text = data_row[2].get_text(" ", strip=True)
    reg_match = re.search(r"\(R\)\s*([\d-]+)", dates_text)
    exec_match = re.search(r"\(E\)\s*([\d-]+)", dates_text)
    pres_match = re.search(r"\(P\)\s*([\d-]+)", dates_text)
    date_of_registration = reg_match.group(1) if reg_match else ""
    date_of_execution = exec_match.group(1) if exec_match else ""
    date_of_presentation = pres_match.group(1) if pres_match else ""

    return {
        "district": district,
        "districtCode": districtCode,
        "state": state,
        "sroName": sro_name,
        "sroCode": sro_code,
        "docno": docno,
        "sno": data_row[0].get_text(strip=True),
        "propertyDescription": data_row[1].get_text(" ", strip=True),
        "dates": dates_text,
        "natureAndValue": nature_value_text,
        "marketValue": market_value,
        "considerationVal": cons_value,
        "parties": data_row[4].get_text(" ", strip=True),
        "docInfo": data_row[5].get_text(" ", strip=True),
        "dateOfExecution": date_of_execution,
        "dateOfPresentation": date_of_presentation,
        "dateOfRegistration": date_of_registration,
        "creationTime": int(time.time() * 1000)
    }

# -------------------------
# Main functions
# -------------------------
def find_sequential_start_point(sro_code, min_docno, max_docno):
    """
    Find the starting point where we have 10 sequential documents for a given SRO.
    Returns the document number where the sequence of 10 starts.
    """
    # Get all existing docnos for this SRO in the range
    existing_docs = set()
    cursor = market_collection.find(
        {"sroCode": sro_code, "docno": {"$gte": min_docno, "$lte": max_docno}},
        {"docno": 1}
    )
    
    for doc in cursor:
        existing_docs.add(doc["docno"])
    
    # Find the first point where we have 10 sequential documents
    for start_docno in range(min_docno, max_docno - 8):  # -8 because we need 10 consecutive
        sequential_count = 0
        for i in range(10):
            if (start_docno + i) in existing_docs:
                sequential_count += 1
            else:
                break
        
        if sequential_count >= 10:
            return start_docno
    
    # If no 10 sequential found, return the min_docno
    return min_docno

def get_sequential_start_points():
    """
    Find the starting point where we have 10 sequential documents for each SRO.
    Returns a dictionary with sro_code as key and start docno as value.
    """
    print("🔍 Finding sequential start points (10 consecutive docs) for each SRO...")
    
    # First get min/max for each SRO
    pipeline = [
        {"$group": {
            "_id": "$sroCode",
            "min_docno": {"$min": "$docno"},
            "max_docno": {"$max": "$docno"},
            "count": {"$sum": 1}
        }},
        {"$sort": {"_id": 1}}
    ]
    
    results = list(market_collection.aggregate(pipeline))
    
    start_points = {}
    print("\n📊 Sequential start points by SRO:")
    print("=" * 80)
    print(f"{'SRO Code':<10} {'Min Doc':<10} {'Max Doc':<10} {'Start Point':<12} {'Total Docs':<12}")
    print("=" * 80)
    
    for result in results:
        sro_code = result["_id"]
        min_docno = result["min_docno"]
        max_docno = result["max_docno"]
        count = result["count"]
        
        # Find sequential start point
        start_point = find_sequential_start_point(sro_code, min_docno, max_docno)
        start_points[sro_code] = start_point
        
        print(f"{sro_code:<10} {min_docno:<10} {max_docno:<10} {start_point:<12} {count:<12}")
    
    return start_points

def get_last_doc_numbers():
    """
    Get the last_doc_number flag from sro_codes collection for each SRO.
    """
    print("\n🔍 Getting last document number flags from sro_codes...")
    
    last_docs = {}
    for sro_doc in sro_collection.find():
        sro_code = sro_doc["sro_code"]
        last_docno = sro_doc.get("last_doc_number", 1)
        last_docs[sro_code] = last_docno
        print(f"SRO {sro_code}: Last flag = {last_docno}")
    
    return last_docs

def find_missing_documents(sro_code, start_docno, end_docno):
    """
    Find missing document numbers between start_docno and end_docno for a specific SRO.
    """
    print(f"\n🔍 Checking for missing documents in SRO {sro_code} from {start_docno} to {end_docno}")
    
    # Get all existing docnos for this SRO in the range
    existing_docs = set()
    cursor = market_collection.find(
        {"sroCode": sro_code, "docno": {"$gte": start_docno, "$lte": end_docno}},
        {"docno": 1}
    )
    
    for doc in cursor:
        existing_docs.add(doc["docno"])
    
    # Find missing docnos
    missing_docs = []
    for docno in range(start_docno, end_docno + 1):
        if docno not in existing_docs:
            missing_docs.append(docno)
    
    print(f"Found {len(missing_docs)} missing documents: {missing_docs[:10]}{'...' if len(missing_docs) > 10 else ''}")
    return missing_docs

def fetch_missing_document(sro_info, docno):
    """
    Fetch a specific missing document from the server.
    """
    url = "https://registration.telangana.gov.in/getDeedDetails.htm"
    headers = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Content-Type": "application/x-www-form-urlencoded",
        "Origin": "https://registration.telangana.gov.in",
        "Referer": "https://registration.telangana.gov.in/districtList.htm",
        "User-Agent": "Mozilla/5.0",
    }
    cookies = {
        # ⚠️ Replace JSESSIONID periodically
        "JSESSIONID": "Dfs0yvPTGSkt1pmP7g3PhJWpCD885yvK22LKLHL0g66ppvJdQtS8!-490224720!1756303182069"
    }
    current_year = datetime.datetime.now().year
    
    payload = {
        "deedsel": "1",
        "districtCode": sro_info["districtCode"],
        "sroCode": sro_info["sro_code"],
        "doctno": str(docno),
        "regyear": str(current_year)
    }
    
    try:
        response = requests.post(url, headers=headers, cookies=cookies, data=payload)
        
        if has_data(response.text):
            parsed = parse_document(
                response.text, 
                sro_info["district"], 
                sro_info["districtCode"], 
                sro_info["state"], 
                sro_info["sro_name"], 
                sro_info["sro_code"], 
                docno
            )
            if parsed:
                market_collection.insert_one(parsed)
                return True, "Successfully fetched and saved"
            else:
                return False, "Failed to parse document"
        else:
            return False, "No data found on server"
    except Exception as e:
        return False, f"Error: {str(e)}"

def check_and_fetch_missing_documents():
    """
    Main function to check for missing documents and fetch them.
    """
    print("🚀 Starting missing document checker...")
    
    # Get sequential start points and last document numbers
    start_points = get_sequential_start_points()
    last_docs = get_last_doc_numbers()
    
    # Get SRO information
    sro_info_map = {}
    for sro_doc in sro_collection.find():
        sro_info_map[sro_doc["sro_code"]] = sro_doc
    
    print("\n" + "=" * 80)
    print("📋 SUMMARY OF DOCUMENT RANGES BY SRO:")
    print("=" * 80)
    
    total_missing = 0
    total_fetched = 0
    
    for sro_code in start_points:
        if sro_code not in last_docs:
            print(f"⚠️ SRO {sro_code}: No last_doc_number flag found, skipping")
            continue
            
        start_docno = start_points[sro_code]
        last_docno = last_docs[sro_code]
        
        print(f"\nSRO {sro_code}:")
        print(f"  📊 Range: {start_docno} to {last_docno}")
        print(f"  📈 Total range: {last_docno - start_docno + 1} documents")
        
        # Find missing documents
        missing_docs = find_missing_documents(sro_code, start_docno, last_docno)
        total_missing += len(missing_docs)
        
        if missing_docs:
            print(f"  🔍 Missing: {len(missing_docs)} documents")
            
            # Ask user if they want to fetch missing documents
            fetch_choice = input(f"  ❓ Fetch missing documents for SRO {sro_code}? (y/n): ").lower().strip()
            
            if fetch_choice == 'y':
                sro_info = sro_info_map[sro_code]
                print(f"  🔄 Fetching missing documents...")
                
                for i, docno in enumerate(missing_docs[:10]):  # Limit to first 10 for safety
                    success, message = fetch_missing_document(sro_info, docno)
                    if success:
                        total_fetched += 1
                        print(f"    ✅ Docno {docno}: {message}")
                    else:
                        print(f"    ❌ Docno {docno}: {message}")
                    
                    time.sleep(1)  # Rate limiting
                    
                    if i >= 9:  # After 10 attempts
                        print(f"    ⚠️ Limited to first 10 missing documents for safety")
                        break
        else:
            print(f"  ✅ No missing documents found")
    
    print("\n" + "=" * 80)
    print("🎯 FINAL SUMMARY:")
    print("=" * 80)
    print(f"📊 Total missing documents found: {total_missing}")
    print(f"✅ Total documents fetched: {total_fetched}")
    print("🎉 Missing document check completed!")

# -------------------------
# Entry point
# -------------------------
if __name__ == "__main__":
    check_and_fetch_missing_documents()
