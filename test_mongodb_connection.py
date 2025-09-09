#!/usr/bin/env python3
"""
Test script to verify MongoDB Atlas connection
"""
import os
from pymongo import MongoClient
from dotenv import load_dotenv

def test_mongodb_connection():
    # Load environment variables
    load_dotenv()
    
    mongo_uri = os.getenv("MONGO_URI")
    database_name = os.getenv("MONGO_DB_NAME", "market_pulse_db")
    
    if not mongo_uri:
        print("❌ MONGO_URI not found in environment variables")
        print("Please update your .env file with the correct connection string")
        return False
    
    print(f"🔗 Testing connection to: {mongo_uri[:50]}...")
    print(f"📊 Database: {database_name}")
    
    try:
        # Test connection
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
        
        # Test server connection
        client.server_info()
        print("✅ Successfully connected to MongoDB Atlas!")
        
        # Test database access
        db = client[database_name]
        collections = db.list_collection_names()
        print(f"📁 Available collections: {collections}")
        
        # Test collection access
        if "market-value-processed" in collections:
            collection = db["market-value-processed"]
            count = collection.count_documents({})
            print(f"📈 Found {count} documents in market-value-processed collection")
        else:
            print("⚠️  market-value-processed collection not found")
            print("   You may need to import your data")
        
        client.close()
        return True
        
    except Exception as e:
        print(f"❌ Connection failed: {str(e)}")
        print("\n🔧 Troubleshooting tips:")
        print("1. Check your username and password in the connection string")
        print("2. Ensure your IP address is whitelisted in MongoDB Atlas")
        print("3. Verify the connection string format")
        return False

if __name__ == "__main__":
    print("🚀 Testing MongoDB Atlas Connection...")
    print("=" * 50)
    test_mongodb_connection()
