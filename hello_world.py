
import os
from pymongo import MongoClient
from dotenv import load_dotenv
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def read_root():
    return {"Hello": "World"}

@app.get("/items/{state}")
async def read_item(state: str):
    load_dotenv()
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
    database_name = os.getenv("MONGO_DB_NAME", "mydatabase")

    client = None
    try:
        client = MongoClient(mongo_uri)
        db = client[database_name]
        collection = db["market-value-processed"]  # Changed collection here

        pipeline = [
            {"$match": {"state": state, "deedType": "Sale Deed"}},  # Added deedType filter
            {"$sort": {"considerationVal": -1}},
            {"$limit": 20}
        ]

        documents = list(collection.aggregate(pipeline))

        # Convert ObjectId to string for JSON serialization
        for doc in documents:
            if "_id" in doc:
                doc["_id"] = str(doc["_id"])

        return {"state": state, "top_documents": documents}
    except Exception as e:
        return {"error": str(e)}
    finally:
        if client:
            client.close()

