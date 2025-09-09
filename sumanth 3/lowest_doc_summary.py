from pymongo import MongoClient

# -------------------------
# MongoDB setup
# -------------------------
client = MongoClient("mongodb://localhost:27017/")
db = client["mydatabase"]

# Collections
sro_collection = db["sro_codes"]
market_collection = db["market-value"]

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
    print("\n📊 SEQUENTIAL START POINTS BY SRO:")
    print("=" * 90)
    print(f"{'SRO Code':<10} {'Min Doc':<10} {'Max Doc':<10} {'Start Point':<12} {'Total Docs':<12} {'SRO Name':<20}")
    print("=" * 90)
    
    # Get SRO names for better display
    sro_names = {}
    for sro_doc in sro_collection.find():
        sro_names[sro_doc["sro_code"]] = sro_doc["sro_name"]
    
    for result in results:
        sro_code = result["_id"]
        min_docno = result["min_docno"]
        max_docno = result["max_docno"]
        count = result["count"]
        sro_name = sro_names.get(sro_code, "Unknown")
        
        # Find sequential start point
        start_point = find_sequential_start_point(sro_code, min_docno, max_docno)
        start_points[sro_code] = start_point
        
        print(f"{sro_code:<10} {min_docno:<10} {max_docno:<10} {start_point:<12} {count:<12} {sro_name:<20}")
    
    return start_points

def get_last_doc_numbers():
    """
    Get the last_doc_number flag from sro_codes collection for each SRO.
    """
    print("\n🔍 LAST DOCUMENT NUMBER FLAGS FROM SRO_CODES:")
    print("=" * 60)
    print(f"{'SRO Code':<10} {'Last Flag':<12} {'SRO Name':<20}")
    print("=" * 60)
    
    last_docs = {}
    for sro_doc in sro_collection.find():
        sro_code = sro_doc["sro_code"]
        last_docno = sro_doc.get("last_doc_number", 1)
        sro_name = sro_doc["sro_name"]
        last_docs[sro_code] = last_docno
        print(f"{sro_code:<10} {last_docno:<12} {sro_name:<20}")
    
    return last_docs

def show_missing_summary():
    """
    Show summary of missing documents without fetching them.
    """
    print("\n🔍 MISSING DOCUMENTS SUMMARY:")
    print("=" * 80)
    
    start_points = get_sequential_start_points()
    last_docs = get_last_doc_numbers()
    
    print(f"\n{'SRO Code':<10} {'Range':<20} {'Total Range':<12} {'Missing':<10} {'% Missing':<10}")
    print("=" * 80)
    
    total_missing = 0
    total_range = 0
    
    for sro_code in start_points:
        if sro_code not in last_docs:
            continue
            
        start_docno = start_points[sro_code]
        last_docno = last_docs[sro_code]
        range_size = last_docno - start_docno + 1
        
        # Count existing documents in range
        existing_count = market_collection.count_documents({
            "sroCode": sro_code, 
            "docno": {"$gte": start_docno, "$lte": last_docno}
        })
        
        missing_count = range_size - existing_count
        missing_percent = (missing_count / range_size * 100) if range_size > 0 else 0
        
        total_missing += missing_count
        total_range += range_size
        
        print(f"{sro_code:<10} {start_docno}-{last_docno:<15} {range_size:<12} {missing_count:<10} {missing_percent:.1f}%")
    
    print("=" * 80)
    print(f"TOTAL: {total_missing:,} missing out of {total_range:,} total range ({total_missing/total_range*100:.1f}% missing)")

if __name__ == "__main__":
    show_missing_summary()
