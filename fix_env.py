#!/usr/bin/env python3
"""
Fix the .env file by removing angle brackets from credentials
"""
import os

def fix_env_file():
    print("🔧 Fixing .env file...")
    
    # Read current .env file
    with open('.env', 'r') as f:
        content = f.read()
    
    print("Current content:")
    print(content)
    print()
    
    # Fix the MONGO_URI by removing angle brackets
    fixed_content = content.replace('<sumanthkotha_db_user>', 'sumanthkotha_db_user')
    fixed_content = fixed_content.replace('<fAQ1w107D2YkGNZ2>', 'fAQ1w107D2YkGNZ2')
    
    # Write fixed content back
    with open('.env', 'w') as f:
        f.write(fixed_content)
    
    print("Fixed content:")
    print(fixed_content)
    print()
    print("✅ .env file has been fixed!")
    print("The angle brackets have been removed from the credentials.")

if __name__ == "__main__":
    fix_env_file()
