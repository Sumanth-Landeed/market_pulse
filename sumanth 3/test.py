from pymongo import MongoClient
import requests
from bs4 import BeautifulSoup
import re
import json

# -------------------------
# MongoDB setup
# -------------------------
client = MongoClient("mongodb://localhost:27017/")
db = client["mydatabase"]
sro_collection = db["sro_codes"]   
market_collection = db["market-value"]

# -------------------------
# Utils
# -------------------------
def has_data(response_text):
    """Check if the response contains valid deed data."""
    no_data_phrase = "Details of the document not found in the Records, contact SRO"
    return no_data_phrase not in response_text

def parse_document(html_text, district, districtCode, state, sro_name, sro_code, docno):
    """Extract table values into structured dict."""
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

    nature_value_text = data_row[3].get_text(" ", strip=True)

    # Extract Market & Consideration values
    market_match = re.search(r"Mkt\.Value:Rs\.?\s*([\d,]+)", nature_value_text)
    cons_match = re.search(r"Cons\.Value:Rs\.?\s*([\d,]+)", nature_value_text)

    market_value = int(market_match.group(1).replace(",", "")) if market_match else 0
    cons_value = int(cons_match.group(1).replace(",", "")) if cons_match else 0

    return {
        "district": district,
        "districtCode": districtCode,
        "state": state,
        "sroName": sro_name,
        "sroCode": sro_code,
        "docno": docno,
        "sno": data_row[0].get_text(strip=True),
        "property_description": data_row[1].get_text(" ", strip=True),
        "dates": data_row[2].get_text(" ", strip=True),
        "nature_and_value": nature_value_text,
        "marketValue": market_value,
        "considerationVal": cons_value,
        "parties": data_row[4].get_text(" ", strip=True),
        "doc_info": data_row[5].get_text(" ", strip=True),
    }

# -------------------------
# Main execution
# -------------------------
def fetch_all_documents():
    url = "https://registration.telangana.gov.in/getDeedDetails.htm"
    headers = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Content-Type": "application/x-www-form-urlencoded",
        "Origin": "https://registration.telangana.gov.in",
        "Referer": "https://registration.telangana.gov.in/districtList.htm",
        "User-Agent": "Mozilla/5.0",
    }
    cookies = {
        # ⚠️ Replace this JSESSIONID periodically
        "JSESSIONID": "Dfs0yvPTGSkt1pmP7g3PhJWpCD885yvK22LKLHL0g66ppvJdQtS8!-490224720!1756303182069"
    }

    start_docno = 2675
    max_attempts = 5  # per SRO

    # -------------------------
    # CHANGE: each document in sro_collection is one SRO entry
    # -------------------------
    for sro_doc in sro_collection.find():
        district = sro_doc["district"]       # ✅ direct from document
        districtCode = sro_doc["districtCode"]
        state = sro_doc["state"]
        sro_name = sro_doc["sro_name"]       # ✅ flat field (was inside sro_list earlier)
        sro_code = sro_doc["sro_code"]       # ✅ flat field (was inside sro_list earlier)

        print(f"\n📌 Fetching docs for {district} {districtCode} - {sro_name} ({sro_code})")

        for docno in range(start_docno, start_docno + max_attempts):
            payload = {
                "deedsel": "1",
                "districtCode": districtCode,
                "sroCode": sro_code,
                "doctno": str(docno),
                "regyear": "2025",
            }

            response = requests.post(url, headers=headers, cookies=cookies, data=payload)

            if has_data(response.text):
                parsed = parse_document(response.text, district, districtCode, state, sro_name, sro_code, docno)
                print(parsed)
                if parsed:
                    market_collection.insert_one(parsed)  # ✅ Save to Mongo
                    print(f"✅ Saved docno {docno}")
            else:
                print(f"❌ ❌ No data for docno {docno} → stopping this SRO")
                break
        
        print(f"\n📌 Completed for {district} {districtCode} - {sro_name} ({sro_code})")

if __name__ == "__main__":
    fetch_all_documents()
    print("\n🎯 Data collection completed! All results are in 'market-value' collection.")
