#!/usr/bin/env python3
"""
Test MongoDB Atlas with new credentials
"""
from pymongo import MongoClient

def test_new_credentials():
    print("🧪 Testing MongoDB Atlas with New Credentials")
    print("=" * 50)
    
    # Try with the new user credentials
    username = "marketpulse_user"  # New user
    password = "MarketPulse123!"   # New password
    
    print(f"Testing with new user: {username}")
    
    # Test connection
    uri = f"mongodb+srv://{username}:{password}@market-pulse.cbd2sr3.mongodb.net/?retryWrites=true&w=majority&appName=market-pulse"
    
    try:
        client = MongoClient(uri)
        client.admin.command('ismaster')
        print("✅ New credentials work!")
        
        # Test database access
        db = client["market_pulse_db"]
        collections = db.list_collection_names()
        print(f"📦 Collections found: {collections}")
        
        # Update .env file
        with open('.env', 'w') as f:
            f.write(f"# MongoDB Atlas Configuration\n")
            f.write(f"MONGO_URI={uri}\n")
            f.write(f"MONGO_DB_NAME=market_pulse_db\n")
        
        print("✅ .env file updated with new credentials!")
        return True
        
    except Exception as e:
        print(f"❌ New credentials failed: {e}")
        print("\nPlease make sure:")
        print("1. Your IP is whitelisted in MongoDB Atlas")
        print("2. The new user 'marketpulse_user' exists")
        print("3. The user has 'Read and write to any database' permissions")
        return False

if __name__ == "__main__":
    test_new_credentials()
