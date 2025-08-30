import requests
from bs4 import BeautifulSoup
import json


def has_data(response_text):
    """Check if the response contains data or 'no data' message."""
    no_data_phrase = "Details of the document not found in the Records, contact SRO"
    return no_data_phrase not in response_text


def parse_document(html_text):
    """Extract table values into a structured dict."""
    soup = BeautifulSoup(html_text, "html.parser")
    table = soup.find("table", {"class": "table"})
    if not table:
        return None

    rows = table.find_all("tr")
    if len(rows) < 2:
        return None

    # Second row has the actual data
    data_row = rows[1].find_all("td")
    if len(data_row) < 6:
        return None

    return {
        "sno": data_row[0].get_text(strip=True),
        "property_description": data_row[1].get_text(" ", strip=True),
        "dates": data_row[2].get_text(" ", strip=True),
        "nature_and_value": data_row[3].get_text(" ", strip=True),
        "parties": data_row[4].get_text(" ", strip=True),
        "doc_info": data_row[5].get_text(" ", strip=True),
    }


def fetch_documents():
    url = "https://registration.telangana.gov.in/getDeedDetails.htm"

    headers = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Content-Type": "application/x-www-form-urlencoded",
        "Origin": "https://registration.telangana.gov.in",
        "Referer": "https://registration.telangana.gov.in/districtList.htm",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    }

    cookies = {
        # ⚠️ This will expire. You must refresh session cookies periodically.
        "JSESSIONID": "Dfs0yvPTGSkt1pmP7g3PhJWpCD885yvK22LKLHL0g66ppvJdQtS8!-490224720!1756303182069"
    }

    start_docno = 2675
    max_attempts = 5
    all_data = []

    for docno in range(start_docno, start_docno + max_attempts):
        payload = {
            "deedsel": "1",
            "districtCode": "16_1",
            "sroCode": "1604",
            "doctno": str(docno),
            "regyear": "2025"
        }

        response = requests.post(url, headers=headers, cookies=cookies, data=payload)

        if has_data(response.text):
            parsed = parse_document(response.text)
            if parsed:
                parsed["docno"] = docno  # add docno as a field
                all_data.append(parsed)
                print(f"✅ Data found for docno {docno}: {parsed}")
        else:
            print(f"❌ No data for docno {docno}. Stopping.")
            break
    
    print("\n📋 Final collected data:")
    print(json.dumps(all_data, indent=4, ensure_ascii=False))

    # Save all to JSON file
    if all_data:
        with open("documents.json", "w", encoding="utf-8") as f:
            json.dump(all_data, f, ensure_ascii=False, indent=4)
        print("📂 Data saved to documents.json")


if __name__ == "__main__":
    fetch_documents()
