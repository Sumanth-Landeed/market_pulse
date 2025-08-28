# Tamil Nadu Registration PDF Extractor

A standalone Python script to extract document information from Tamil Nadu Registration Department PDF certificates with automated processing workflow.

## Features

- 📄 Extract Document ID and Year
- 📅 Extract Certificate Date
- 🗓️ Extract Transaction Dates (Execution, Presentation, Registration)
- 💰 Extract Market Value (cleaned numeric format)
- 📋 Extract Property Information
- 🔧 JSON and formatted output options
- 🚀 Standalone script requiring only PyPDF2
- 📁 **Automated Workflow**: Successful extractions → `processed/`, Failed extractions → `unprocessed/`
- 🧹 **Auto-cleanup**: Source files automatically moved after processing

## Quick Start

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run extraction:**
   ```bash
   python3 pdf_extractor.py source/your_pdf_file.pdf
   ```

## Processing Workflow

The script automatically handles file organization:

### ✅ **Successful Extraction**
- ✅ Extracts data successfully
- 📁 Saves JSON to `processed/filename_extracted_data.json`
- 🗑️ Removes original PDF from `source/`

### ❌ **Failed Extraction**
- ❌ Cannot extract data (corrupted PDF, wrong format, etc.)
- 📁 Moves PDF to `unprocessed/filename.pdf`
- 📝 Creates error log `unprocessed/filename_error.txt`
- 🗑️ Removes original PDF from `source/`

## Extracted Data

### Primary Fields
- **Document ID**: `456/2025`
- **Certificate Date**: `27-Aug-2025`
- **Date of Execution**: `02-Apr-2025`
- **Date of Presentation**: `02-Apr-2025`
- **Date of Registration**: `02-Apr-2025`
- **Market Value**: `40,00,000` (optional - numeric only)
- **Consideration Value**: `2,71,000` (optional - numeric only)
- **Nature**: `Deposit Of Title Deeds` (optional - document type)

### Additional Information
- SRO Office details
- Property type
- Location details (village/street)
- Survey number and extent

## Usage Options

### Basic Usage (with workflow)
```bash
python3 pdf_extractor.py source/your_file.pdf
```

### Disable Workflow (traditional behavior)
```bash
python3 pdf_extractor.py source/your_file.pdf --no-workflow
```

### JSON Output Only (no workflow)
```bash
python3 pdf_extractor.py source/your_file.pdf --json-only
```

### Custom Output File (no workflow)
```bash
python3 pdf_extractor.py source/your_file.pdf --no-workflow --output custom_name.json
```

## Output Format

### Console Output
```
📄 Document ID: 456/2025
📅 Certificate Date: 27-Aug-2025

📋 Transaction Dates:
   📝 Date of Execution: 02-Apr-2025
   📤 Date of Presentation: 02-Apr-2025
   📋 Date of Registration: 02-Apr-2025

💰 Market Value: 40,00,000
```

### JSON Output
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

## Files & Folder Structure

```
tamilnadu/
├── pdf_extractor.py              # Main extraction script
├── trigger_pdf_file_generation.py # 🆕 PDF generation trigger
├── download_pdf_file.py          # 🆕 PDF download & processing
├── complete_workflow.py          # 🆕 End-to-end workflow
├── test_pdf_trigger.py           # 🆕 Test scripts
├── requirements.txt              # Dependencies (PyPDF2, requests)
├── README.md                     # This documentation
├── USAGE_EXAMPLE.md              # Detailed usage examples
├── source/                       # 📂 Input PDF files
│   └── your_pdf_files.pdf
├── processed/                    # 📂 Successfully processed files
│   └── filename_extracted_data.json
└── unprocessed/                  # 📂 Failed processing files
    ├── failed_file.pdf
    └── failed_file_error.txt
```

### Folder Purposes
- **`source/`** - Place your PDF files here for processing
- **`processed/`** - Successfully extracted JSON files saved here
- **`unprocessed/`** - Failed PDFs and error logs saved here

## 🆕 PDF Generation & Download Workflow

### 1. PDF Generation Trigger
The `trigger_pdf_file_generation.py` script triggers PDF generation:

```bash
python3 trigger_pdf_file_generation.py --sro-name 'Chathirapatti' --sro-code '20271:1' --doc-no '10' --reg-year '2018'
```

### 2. PDF Download & Processing
The `download_pdf_file.py` script downloads and processes PDFs:

```bash
python3 download_pdf_file.py 'your-uuid-from-trigger'
```

### 3. Complete Workflow
The `complete_workflow.py` script handles the entire process:

```bash
python3 complete_workflow.py --sro-name 'Chathirapatti' --sro-code '20271:1' --doc-no '10' --reg-year '2018'
```

### Python Function Usage
```python
# Step 1: Trigger PDF generation
from trigger_pdf_file_generation import trigger_pdf_generation
result = trigger_pdf_generation("Chathirapatti", "20271:1", "10", "2018")
uuid = result["request_uuid"]

# Step 2: Download and process
from download_pdf_file import download_and_process_pdf
final_result = download_and_process_pdf(uuid)
```

## Requirements

- Python 3.7+
- PyPDF2 library

## License

Educational and personal use only.
