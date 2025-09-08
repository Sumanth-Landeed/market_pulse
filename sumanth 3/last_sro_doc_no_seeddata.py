from pymongo import MongoClient
import time

# -------------------------
# MongoDB setup
# -------------------------
client = MongoClient("mongodb://localhost:27017/")  
db = client["mydatabase"]          # database name
collection = db["sro_last_doc_no"]       # collection name

# -------------------------
# Current Unix timestamp in millis
# -------------------------
now_millis = int(time.time() * 1000)

# -------------------------
# Documents (segregated by sro_code)
# -------------------------
sro_last_doc_no = [
    # Rangareddy
    {"district": "Rangareddy", "districtCode": "15_1", "state": "Telangana", "sro_name": "ABDULLAPURMET", "sro_code": "1531"},
    {"district": "Rangareddy", "districtCode": "15_1", "state": "Telangana", "sro_name": "CHAMPAPET", "sro_code": "1514"},
    {"district": "Rangareddy", "districtCode": "15_1", "state": "Telangana", "sro_name": "CHEVELLA", "sro_code": "1501"},
    {"district": "Rangareddy", "districtCode": "15_1", "state": "Telangana", "sro_name": "FAROOQ NAGAR", "sro_code": "1415"},
    {"district": "Rangareddy", "districtCode": "15_1", "state": "Telangana", "sro_name": "GANDIPET", "sro_code": "1525"},
    {"district": "Rangareddy", "districtCode": "15_1", "state": "Telangana", "sro_name": "HAYATHNAGAR", "sro_code": "1502"},
    {"district": "Rangareddy", "districtCode": "15_1", "state": "Telangana", "sro_name": "IBRAHIMPATNAM", "sro_code": "1503"},
    {"district": "Rangareddy", "districtCode": "15_1", "state": "Telangana", "sro_name": "L.B.NAGAR", "sro_code": "1527"},
    {"district": "Rangareddy", "districtCode": "15_1", "state": "Telangana", "sro_name": "MAHESWARAM", "sro_code": "1519"},
    {"district": "Rangareddy", "districtCode": "15_1", "state": "Telangana", "sro_name": "PEDDA AMBERPET", "sro_code": "1515"},
    {"district": "Rangareddy", "districtCode": "15_1", "state": "Telangana", "sro_name": "RAJENDRA NAGAR", "sro_code": "1518"},
    {"district": "Rangareddy", "districtCode": "15_1", "state": "Telangana", "sro_name": "RANGA REDDY (R.O)", "sro_code": "1510"},
    {"district": "Rangareddy", "districtCode": "15_1", "state": "Telangana", "sro_name": "SAROORNAGAR", "sro_code": "1513"},
    {"district": "Rangareddy", "districtCode": "15_1", "state": "Telangana", "sro_name": "SERILINGAMPALLI", "sro_code": "1522"},
    {"district": "Rangareddy", "districtCode": "15_1", "state": "Telangana", "sro_name": "SHADNAGAR", "sro_code": "1411"},
    {"district": "Rangareddy", "districtCode": "15_1", "state": "Telangana", "sro_name": "SHAMSHABAD", "sro_code": "1520"},
    {"district": "Rangareddy", "districtCode": "15_1", "state": "Telangana", "sro_name": "SHANKARPALLY", "sro_code": "1524"},
    {"district": "Rangareddy", "districtCode": "15_1", "state": "Telangana", "sro_name": "VANASTHALIPURAM", "sro_code": "1528"},

    # Hyderabad
    {"district": "Hyderabad", "districtCode": "16_1", "state": "Telangana", "sro_name": "BANJARAHILLS (R.O)", "sro_code": "1604"},
    {"district": "Hyderabad", "districtCode": "16_1", "state": "Telangana", "sro_name": "BOWENPALLY", "sro_code": "1609"},
    {"district": "Hyderabad", "districtCode": "16_1", "state": "Telangana", "sro_name": "CHARMINAR", "sro_code": "1608"},
    {"district": "Hyderabad", "districtCode": "16_1", "state": "Telangana", "sro_name": "CHIKKADPALLY", "sro_code": "1602"},
    {"district": "Hyderabad", "districtCode": "16_1", "state": "Telangana", "sro_name": "DOODHBOWLI", "sro_code": "1603"},
    {"district": "Hyderabad", "districtCode": "16_1", "state": "Telangana", "sro_name": "GOLCONDA", "sro_code": "1610"},
    {"district": "Hyderabad", "districtCode": "16_1", "state": "Telangana", "sro_name": "HYDERABAD (R.O)", "sro_code": "1607"},
    {"district": "Hyderabad", "districtCode": "16_1", "state": "Telangana", "sro_name": "MAREDPALLY", "sro_code": "1605"},
    {"district": "Hyderabad", "districtCode": "16_1", "state": "Telangana", "sro_name": "S.R.NAGAR", "sro_code": "1611"},
    {"district": "Hyderabad", "districtCode": "16_1", "state": "Telangana", "sro_name": "SECUNDERABAD", "sro_code": "1606"},
    {"district": "Hyderabad", "districtCode": "16_1", "state": "Telangana", "sro_name": "Azampura", "sro_code": "1601"},
]

# -------------------------
# Add extra fields
# -------------------------
for doc in sro_last_doc_no:
    doc["last_doc_number"] = 1
    doc["last_update_time"] = now_millis

# -------------------------
# Insert into MongoDB
# -------------------------
collection.insert_many(sro_last_doc_no)

print(f"✅ Inserted {len(sro_last_doc_no)} SRO records into 'sro_codes'")
