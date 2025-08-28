from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["mydatabase"]  # replace with your DB name
collection = db["market-value"]

# Remove specified fields from each document
result = collection.update_many(
    {},
    {
        "$unset": {
            "Boundires": "",
            "EXTENT": "",
            "VILL_COL": ""
        }
    }
)

print(f"Modified documents count: {result.modified_count}")
