# PDF Data Extractor - Usage Examples

## Installation

```bash
pip3 install PyPDF2
```

## Workflow-Based Usage (Default)

### 1. Extract data with automated workflow
```bash
python3 pdf_extractor.py source/456_2025.pdf
```

**Successful processing result:**
- ✅ JSON saved to `processed/456_2025_extracted_data.json`
- 🗑️ Original PDF removed from `source/`

**Failed processing result:**
- ❌ PDF moved to `unprocessed/456_2025.pdf`
- 📝 Error log created at `unprocessed/456_2025_error.txt`

Output:
```
📄 Document ID: 456/2025
📅 Certificate Date: 27-Aug-2025

📋 Transaction Dates:
   📝 Date of Execution: 02-Apr-2025
   📤 Date of Presentation: 02-Apr-2025
   📋 Date of Registration: 02-Apr-2025

💰 Market Value: 40,00,000
💵 Consideration Value: 2,71,000
📋 Nature: Deposit Of Title Deeds
```

### 2. JSON output only (no file workflow)
```bash
python3 pdf_extractor.py source/456_2025.pdf --json-only
```

### 3. Disable workflow (traditional behavior)
```bash
python3 pdf_extractor.py source/456_2025.pdf --no-workflow --output my_data.json
```

## Traditional Usage (No Workflow)

### 4. Extract without moving files
```bash
python3 pdf_extractor.py source/456_2025.pdf --no-workflow
```

### 5. Custom output location
```bash
python3 pdf_extractor.py source/456_2025.pdf --no-workflow --output custom/location.json
```

## Extracted Fields

- **Document ID**: Document number and year
- **Certificate Date**: Date when certificate was issued
- **Date of Execution**: Date when document was executed
- **Date of Presentation**: Date when document was presented
- **Date of Registration**: Date when document was registered
- **Market Value**: Property market value (optional - numeric only, cleaned of currency symbols)
- **Consideration Value**: Transaction consideration value (optional - numeric only)
- **Nature**: Document type/nature (optional - e.g., "Deposit Of Title Deeds", "Sale Deed", "Gift Deed")
- **Additional Info**: SRO office, property type, location details

## Example Output JSON

```json
{
  "document_id": "456/2025",
  "certificate_date": "27-Aug-2025",
  "date_of_execution": "02-Apr-2025",
  "date_of_presentation": "02-Apr-2025", 
  "date_of_registration": "02-Apr-2025",
  "market_value": "40,00,000",
  "additional_info": {
    "sro_office": "Chennai Central Joint I",
    "property_type": "Flats",
    "village_street": "Mylapore Part 2, Nandanam",
    "survey_extent": "3884/64 - 604.63 SQUARE FEET"
  },
  "extraction_success": true
}
```
