#!/usr/bin/env python3
"""
Interactive MongoDB Atlas connection tester
"""
import os
from pymongo import MongoClient
from dotenv import load_dotenv

def test_connection_interactive():
    print("🔧 MongoDB Atlas Connection Troubleshooter")
    print("=" * 50)
    
    # Load current .env
    load_dotenv()
    current_uri = os.getenv("MONGO_URI")
    
    print(f"Current connection string: {current_uri[:50]}...")
    print()
    
    # Test current connection
    print("1. Testing current connection...")
    try:
        client = MongoClient(current_uri)
        client.admin.command('ismaster')
        print("✅ Current connection works!")
        return True
    except Exception as e:
        print(f"❌ Current connection failed: {e}")
    
    print()
    print("2. Let's try to fix this step by step...")
    print()
    
    # Get user input for testing
    print("Please provide your MongoDB Atlas credentials:")
    username = input("Username: ").strip()
    password = input("Password: ").strip()
    
    # Test with new credentials
    test_uri = f"mongodb+srv://{username}:{password}@market-pulse.cbd2sr3.mongodb.net/?retryWrites=true&w=majority&appName=market-pulse"
    
    print(f"\n3. Testing with new credentials...")
    print(f"Connection string: {test_uri[:50]}...")
    
    try:
        client = MongoClient(test_uri)
        client.admin.command('ismaster')
        print("✅ New credentials work!")
        
        # Update .env file
        print("\n4. Updating .env file...")
        with open('.env', 'w') as f:
            f.write(f"# MongoDB Atlas Configuration\n")
            f.write(f"MONGO_URI={test_uri}\n")
            f.write(f"MONGO_DB_NAME=market_pulse_db\n")
        
        print("✅ .env file updated successfully!")
        return True
        
    except Exception as e:
        print(f"❌ New credentials also failed: {e}")
        print("\n🔧 Troubleshooting suggestions:")
        print("1. Double-check your username and password")
        print("2. Make sure your IP is whitelisted in MongoDB Atlas")
        print("3. Try resetting your database user password")
        return False

if __name__ == "__main__":
    test_connection_interactive()
