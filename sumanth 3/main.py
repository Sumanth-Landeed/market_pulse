from pymongo import MongoClient
import requests
from bs4 import BeautifulSoup
import re
import time
import datetime

# -------------------------
# MongoDB setup
# -------------------------
client = MongoClient("mongodb://localhost:27017/")
db = client["mydatabase"]

# SRO master collection (stores last_doc_number and last_update_time)
sro_collection = db["sro_codes"]

# Collection to store fetched deed/market data
market_collection = db["market-value"]

# -------------------------
# Utility functions
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
# Main execution function
# -------------------------
def fetch_documents_continuous():
    """
    Iterates through all SROs, fetches documents continuously,
    and updates last_doc_number and last_update_time in sro_codes after each successful write.
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

    for sro_doc in sro_collection.find():
        district = sro_doc["district"]
        districtCode = sro_doc["districtCode"]
        state = sro_doc["state"]
        sro_name = sro_doc["sro_name"]
        sro_code = sro_doc["sro_code"]

        # Start from last_doc_number in MongoDB or 1
        start_docno = sro_doc.get("last_doc_number", 1)
        print(f"\n📌 Fetching docs for {district} {districtCode} - {sro_name} ({sro_code}) starting from docno {start_docno}")

        docno = start_docno
        consecutive_empty = 0
        first_no_data_docno = None

        while True:
            payload = {
                "deedsel": "1",
                "districtCode": districtCode,
                "sroCode": sro_code,
                "doctno": str(docno),
                "regyear": str(current_year)
            }

            response = requests.post(url, headers=headers, cookies=cookies, data=payload)

            if has_data(response.text):
                parsed = parse_document(response.text, district, districtCode, state, sro_name, sro_code, docno)
                if parsed:
                    market_collection.insert_one(parsed)
                    print(f"        ✅ Saved docno {docno}")

                    # Update last_doc_number in MongoDB to the last successful doc
                    now_millis = int(time.time() * 1000)
                    sro_collection.update_one(
                        {"sro_code": sro_code},
                        {"$set": {"last_doc_number": docno+1, "last_update_time": now_millis}}
                    )
                    # //TODO make it docno+1
                    print(f"        📌 Updated {sro_code} → last_doc_number={docno+1}")
                time.sleep(1)
                docno += 1
                consecutive_empty = 0  # reset counter after successful fetch
            else:
                if first_no_data_docno is None:
                    first_no_data_docno = docno
                consecutive_empty += 1
                print(f"        ❌ No data at docno {docno} ({consecutive_empty}/10)")

                if consecutive_empty >= 10:
                    print(f"        ⚠️ No data found for 10 consecutive doc numbers, stopping SRO.")
                    docno = first_no_data_docno  # last_doc_number will be the first missing doc
                    break
                docno += 1  # try next docno anyway
                time.sleep(1)

            time.sleep(1)  # throttle requests to avoid being blocked

# -------------------------
# Entry point
# -------------------------
if __name__ == "__main__":
    fetch_documents_continuous()
    print("\n🎯 Completed! Data inserted into 'market-value' and last_doc_number updated incrementally in 'sro_codes'.")
