#!/usr/bin/env python3
"""
Import local MongoDB data to MongoDB Atlas
"""
import os
import subprocess
from dotenv import load_dotenv

def import_to_atlas():
    # Load environment variables
    load_dotenv()
    
    mongo_uri = os.getenv("MONGO_URI")
    database_name = os.getenv("MONGO_DB_NAME", "market_pulse_db")
    
    if not mongo_uri:
        print("❌ MONGO_URI not found in environment variables")
        return False
    
    print(f"🚀 Importing data to MongoDB Atlas...")
    print(f"📊 Target database: {database_name}")
    print(f"🔗 Connection: {mongo_uri[:50]}...")
    
    # Check if backup exists
    backup_path = "./mongodb_backup/mydatabase"
    if not os.path.exists(backup_path):
        print("❌ Backup directory not found. Please run export_data.sh first")
        return False
    
    try:
        # Import market-value-processed collection
        print("📦 Importing market-value-processed collection...")
        cmd = [
            "mongorestore",
            "--uri", mongo_uri,
            "--db", database_name,
            "--collection", "market-value-processed",
            f"{backup_path}/market-value-processed.bson"
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ market-value-processed collection imported successfully!")
        else:
            print(f"❌ Failed to import market-value-processed: {result.stderr}")
            return False
        
        # Import sro_codes collection (if exists)
        sro_codes_path = f"{backup_path}/sro_codes.bson"
        if os.path.exists(sro_codes_path):
            print("📦 Importing sro_codes collection...")
            cmd = [
                "mongorestore",
                "--uri", mongo_uri,
                "--db", database_name,
                "--collection", "sro_codes",
                sro_codes_path
            ]
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            if result.returncode == 0:
                print("✅ sro_codes collection imported successfully!")
            else:
                print(f"⚠️  Failed to import sro_codes: {result.stderr}")
        
        print("\n🎉 Data import completed!")
        print("✅ Your MongoDB Atlas database is ready for deployment")
        return True
        
    except Exception as e:
        print(f"❌ Import failed: {str(e)}")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("📥 MongoDB Atlas Data Import")
    print("=" * 60)
    import_to_atlas()
