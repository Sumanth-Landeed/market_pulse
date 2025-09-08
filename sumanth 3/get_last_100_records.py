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
sro_collection = db["sro_codes"]
market_collection = db["market-value"]
sro_lastdoc_collection = db["sro_last_doc_no"]  # store last_doc_number per SRO

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
    market_match = re.search(r"Mkt\.Value:Rs\.?\s*([\d,]+)", nature_value_text)
    cons_match = re.search(r"Cons\.Value:Rs\.?\s*([\d,]+)", nature_value_text)

    market_value = int(market_match.group(1).replace(",", "")) if market_match else 0
    cons_value = int(cons_match.group(1).replace(",", "")) if cons_match else 0
    # Dates: try to parse, else ""
    dates_text = data_row[2].get_text(" ", strip=True).split("/")
    date_of_execution = dates_text[0].strip() if len(dates_text) > 0 else ""
    date_of_presentation = dates_text[1].strip() if len(dates_text) > 1 else ""
    date_of_registration = dates_text[2].strip() if len(dates_text) > 2 else ""
    return {
        "district": district,
        "districtCode": districtCode,
        "state": state,
        "sroName": sro_name,
        "sroCode": sro_code,
        "docno": docno,
        "sno": data_row[0].get_text(strip=True),
        "propertyDescription": data_row[1].get_text(" ", strip=True),
        "dates": data_row[2].get_text(" ", strip=True),
        "natureAndValue": nature_value_text,
        "marketValue": market_value,
        "considerationVal": cons_value,
        "parties": data_row[4].get_text(" ", strip=True),
        "docInfo": data_row[5].get_text(" ", strip=True),
        "dateOfExecution": date_of_execution,
        "dateOfPresentation": date_of_presentation,
        "dateOfRegistration": date_of_registration
    }


# -------------------------
# Main execution
# -------------------------
def fetch_documents_continuous():
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


    sro_docs = list(sro_collection.find())

    # pick only the third SRO
    sro_doc = sro_docs[0]

    district = sro_doc["district"]
    districtCode = sro_doc["districtCode"]
    state = sro_doc["state"]
    sro_name = sro_doc["sro_name"]
    sro_code = sro_doc["sro_code"]

    # fetch last_doc_number from sro_last_doc_no collection
    last_doc_entry = sro_lastdoc_collection.find_one({"sro_code": sro_code})
    start_docno = last_doc_entry["last_doc_number"] if last_doc_entry else 1

    print(f"\n📌 Fetching docs for {district} {districtCode} - {sro_name} ({sro_code}) starting from docno {start_docno}")

    MAX_DOCS = 100  # fetch last 100 records per SRO

    # start_docno minus last 100, but not less than 1
    docno = max(1, start_docno - MAX_DOCS)
    saved_count = 0

    while saved_count < MAX_DOCS and docno<=start_docno:
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
                saved_count += 1
                print(f"        ✅ Saved docno {docno} ({saved_count}/{MAX_DOCS})")
        else:
            print(f"        ⚠️ No data at docno {docno} → skipping")

        docno += 1  # move to next doc number


    # update last_doc_number to the docno where no data was found
    now_millis = int(time.time() * 1000)
    # sro_lastdoc_collection.update_one(
    #     {"sro_code": sro_code},
    #     {"$set": {"last_doc_number": docno, "last_update_time": now_millis}},
    # )
    # print(f"📌 Updated {sro_code} → last_doc_number={docno}")

if __name__ == "__main__":
    fetch_documents_continuous()
    print("\n🎯 Completed! Data inserted into 'market-value' and last_doc_number updated in 'sro_last_doc_no'.")
