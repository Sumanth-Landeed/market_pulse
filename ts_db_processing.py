import re
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["mydatabase"]  # replace with your DB name

src_collection = db["market-value"]
dst_collection = db["market-value-processed"]

# Clear the target collection before inserting new documents to avoid duplicates
dst_collection.delete_many({})

# Regex to extract text before W-B:
W_B_SPLIT_REGEX = re.compile(r"(.*?)\s*W-B:")

# Extract extent value (number part)
EXTENT_VALUE_REGEX = re.compile(r"EXTENT:\s*([\d\.]+)")
# Extract extent unit (letters, dots etc. after value)
EXTENT_UNIT_REGEX = re.compile(r"EXTENT:\s*[\d\.]+\s*([A-Za-z\.]+)")
# Extract deedType from natureAndValue (text between first 4-digit code and 'Mkt.Value')
DEED_TYPE_REGEX = re.compile(r"\d{4}\s+(.+?)\s+Mkt\.Value")

for doc in src_collection.find({}):
    prop_desc = doc.get("propertyDescription", "").strip()
    nature_and_value = doc.get("natureAndValue", "").strip()

    village = None

    # Extract substring before 'W-B:'
    w_b_match = W_B_SPLIT_REGEX.search(prop_desc)
    if w_b_match:
        pre_wb_text = w_b_match.group(1).strip()

        # Remove any leading 'VILL/COL:' if present 
        if pre_wb_text.startswith("VILL/COL:"):
            pre_wb_text = pre_wb_text[len("VILL/COL:"):].strip()

        # Check for '/'
        if '/' in pre_wb_text:
            before_slash, after_slash = pre_wb_text.split('/', 1)
            before_slash = before_slash.strip()
            after_slash = after_slash.strip()
            # Use before slash if non-empty, else after slash
            village = before_slash if before_slash else after_slash
        else:
            village = pre_wb_text
    else:
        # If no 'W-B:' present, fallback to full propertyDescription trimmed
        village = prop_desc

    # Extract Extent value and unit separately
    extent_value_match = EXTENT_VALUE_REGEX.search(prop_desc)
    extent_value = extent_value_match.group(1) if extent_value_match else None

    extent_unit_match = EXTENT_UNIT_REGEX.search(prop_desc)
    extent_unit = extent_unit_match.group(1) if extent_unit_match else None

    # Extract deedType from natureAndValue
    deed_type_match = DEED_TYPE_REGEX.search(nature_and_value)
    deed_type = deed_type_match.group(1).strip() if deed_type_match else None

    # Keep only Sale Deed transactions
    if not deed_type or deed_type.lower() != "sale deed":
        continue

    # Build new document with required fields and new columns
    new_doc = {
        "state": doc.get("state"),
        "districtCode": doc.get("districtCode"),
        "sroCode": doc.get("sroCode"),
        "sroName": doc.get("sroName"),
        "docno": doc.get("docno"),
        "dateOfRegistration": doc.get("dateOfRegistration"),
        "marketValue": doc.get("marketValue"),
        "considerationVal": doc.get("considerationVal"),
        "extent": extent_value,
        "extentUnit": extent_unit,
        "village": village,
        "natureAndValue": nature_and_value,
        "deedType": deed_type,
    }

    dst_collection.insert_one(new_doc)

print("Updated data processing and insertion complete.")
