#!/usr/bin/env python3
"""
Debug MongoDB Atlas connection issues
"""
import urllib.parse
from pymongo import MongoClient

def test_connection_debug():
    print("🔍 MongoDB Atlas Connection Debugger")
    print("=" * 50)
    
    # Test with different connection string formats
    username = "sumanthkotha_db_user"
    password = "fAQ1w107D2YkGNZ2"  # From your input
    
    print(f"Username: {username}")
    print(f"Password: {password}")
    print()
    
    # Test 1: Basic connection string
    print("1. Testing basic connection string...")
    basic_uri = f"mongodb+srv://{username}:{password}@market-pulse.cbd2sr3.mongodb.net/?retryWrites=true&w=majority&appName=market-pulse"
    
    try:
        client = MongoClient(basic_uri)
        client.admin.command('ismaster')
        print("✅ Basic connection works!")
        return True
    except Exception as e:
        print(f"❌ Basic connection failed: {e}")
    
    # Test 2: URL-encoded password (in case of special characters)
    print("\n2. Testing with URL-encoded password...")
    encoded_password = urllib.parse.quote_plus(password)
    encoded_uri = f"mongodb+srv://{username}:{encoded_password}@market-pulse.cbd2sr3.mongodb.net/?retryWrites=true&w=majority&appName=market-pulse"
    
    try:
        client = MongoClient(encoded_uri)
        client.admin.command('ismaster')
        print("✅ URL-encoded connection works!")
        return True
    except Exception as e:
        print(f"❌ URL-encoded connection failed: {e}")
    
    # Test 3: Without app name
    print("\n3. Testing without app name...")
    simple_uri = f"mongodb+srv://{username}:{encoded_password}@market-pulse.cbd2sr3.mongodb.net/"
    
    try:
        client = MongoClient(simple_uri)
        client.admin.command('ismaster')
        print("✅ Simple connection works!")
        return True
    except Exception as e:
        print(f"❌ Simple connection failed: {e}")
    
    print("\n🔧 Troubleshooting suggestions:")
    print("1. Check if your IP address is whitelisted in MongoDB Atlas")
    print("2. Verify your password is correct")
    print("3. Try resetting your database user password")
    print("4. Make sure your cluster is running")
    
    return False

if __name__ == "__main__":
    test_connection_debug()
