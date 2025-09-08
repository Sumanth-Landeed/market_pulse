from pymongo import MongoClient
import requests
from bs4 import BeautifulSoup
import time

# -------------------------
# MongoDB setup
# -------------------------
client = MongoClient("mongodb://localhost:27017/")
db = client["mydatabase"]

sro_collection = db["sro_codes"]                # source collection
sro_lastdoc_collection = db["sro_last_doc_no"]  # existing collection to update

# -------------------------
# Utils
# -------------------------
def has_data(response_text):
    """Check if the response contains valid deed data."""
    no_data_phrase = "Details of the document not found in the Records, contact SRO"
    return no_data_phrase not in response_text

def parse_document(html_text):
    """Quick check to ensure table is valid (no need full parse)."""
    soup = BeautifulSoup(html_text, "html.parser")
    return bool(soup.find("table", {"class": "table"}))

def is_valid_doc(districtCode, sro_code, docno, headers, cookies):
    """Check if a document exists."""
    url = "https://registration.telangana.gov.in/getDeedDetails.htm"
    payload = {
        "deedsel": "1",
        "districtCode": districtCode,
        "sroCode": sro_code,
        "doctno": str(docno),
        "regyear": "2025",
    }
    response = requests.post(url, headers=headers, cookies=cookies, data=payload)
    return has_data(response.text) and parse_document(response.text)

# -------------------------
# Main execution with binary search
# -------------------------
def find_last_docno_for_sros_binary_search():
    headers = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Content-Type": "application/x-www-form-urlencoded",
        "Origin": "https://registration.telangana.gov.in",
        "Referer": "https://registration.telangana.gov.in/districtList.htm",
        "User-Agent": "Mozilla/5.0",
    }
    cookies = {
        "JSESSIONID": "Dfs0yvPTGSkt1pmP7g3PhJWpCD885yvK22LKLHL0g66ppvJdQtS8!-490224720!1756303182069"
    }

    MAX_DOCNO = 100000  # upper limit for binary search

    for sro_doc in sro_collection.find():
        district = sro_doc["district"]
        districtCode = sro_doc["districtCode"]
        sro_name = sro_doc["sro_name"]
        sro_code = sro_doc["sro_code"]

        print(f"\n📌 Checking last docno for {district} {districtCode} - {sro_name} ({sro_code})")

        low, high = 1, MAX_DOCNO
        last_valid_docno = 0

        while low <= high:
            mid = (low + high) // 2
            if is_valid_doc(districtCode, sro_code, mid, headers, cookies):
                last_valid_docno = mid
                low = mid + 1  # try higher
            else:
                high = mid - 1  # try lower

        # store next doc number
        next_docno = last_valid_docno + 1
        now_millis = int(time.time() * 1000)

        result = sro_lastdoc_collection.update_one(
            {"sro_code": sro_code},  # only update existing
            {
                "$set": {
                    "last_doc_number": next_docno,
                    "last_update_time": now_millis,
                }
            }
        )
        print(f"\n ✅ Done for {district} {districtCode} - {sro_name} ({sro_code})")

        if result.matched_count:
            print(f"📌 Updated {sro_code} → last_doc_number={next_docno}")
        else:
            print(f"⚠️ SRO {sro_code} not found in 'sro_last_doc_no'. Skipped.")

if __name__ == "__main__":
    find_last_docno_for_sros_binary_search()
    print("\n🎯 Completed! Updated 'sro_last_doc_no' collection using binary search.")
