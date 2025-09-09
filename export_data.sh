#!/bin/bash

echo "🚀 Exporting MongoDB data for Atlas import..."
echo "=============================================="

# Create backup directory
mkdir -p ./mongodb_backup

# Export the market-value-processed collection
echo "📦 Exporting market-value-processed collection..."
mongodump --db mydatabase --collection market-value-processed --out ./mongodb_backup

# Export sro_codes collection (if needed)
echo "📦 Exporting sro_codes collection..."
mongodump --db mydatabase --collection sro_codes --out ./mongodb_backup

echo "✅ Export completed!"
echo "📁 Data exported to: ./mongodb_backup/mydatabase/"
echo ""
echo "Next steps:"
echo "1. Update your .env file with MongoDB Atlas credentials"
echo "2. Test the connection with: python test_mongodb_connection.py"
echo "3. Import data to Atlas with: python import_to_atlas.py"
