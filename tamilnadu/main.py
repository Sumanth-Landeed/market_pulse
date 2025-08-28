#!/usr/bin/env python3
"""
Main Tamil Nadu PDF Processing Interface

This module provides a clean interface to the complete Tamil Nadu PDF workflow
that returns JSON responses without printing to console.

Usage:
    from main import process_tamil_nadu_document
    
    result = process_tamil_nadu_document(
        sro_name="Chathirapatti",
        sro_code="20271:1", 
        doc_no="10",
        reg_year="2018"
    )
    
    print(json.dumps(result, indent=2))
"""

import json
import time
import sys
from typing import Dict, Any, Optional

try:
    from .trigger_pdf_file_generation import trigger_pdf_generation
    from .download_pdf_file import download_and_process_pdf
except ImportError as e:
    raise ImportError(f"Required modules not found: {e}. Make sure trigger_pdf_file_generation.py and download_pdf_file.py are available.")


def process_tamil_nadu_document(
    sro_name: str,
    sro_code: str,
    doc_no: str,
    reg_year: str,
    doc_type: str = "1",
    doc_type_name: str = "Regular Document",
    wait_time: int = 5,
    silent: bool = True
) -> Dict[str, Any]:
    """
    Process a Tamil Nadu document through the complete workflow
    
    This function provides a clean interface to the complete workflow:
    1. Trigger PDF generation
    2. Wait for PDF to be ready  
    3. Download and extract data from PDF
    4. Return structured JSON response
    
    Args:
        sro_name (str): SRO office name (e.g., "Chathirapatti")
        sro_code (str): SRO code (e.g., "20271:1")
        doc_no (str): Document number (e.g., "10")
        reg_year (str): Registration year (e.g., "2018")
        doc_type (str): Document type code (default: "1")
        doc_type_name (str): Document type name (default: "Regular Document")
        wait_time (int): Wait time between API calls in seconds (default: 5)
        silent (bool): If True, suppress console output (default: True)
        
    Returns:
        Dict[str, Any]: Complete workflow result containing:
        {
            "success": bool,                    # Overall workflow success
            "document_id": str,                 # Extracted document ID (if successful)
            "extraction_data": dict,            # Complete extracted data (if successful)
            "processed_json_path": str,         # Path to processed JSON file (if successful)  
            "source_pdf_path": str,            # Path to source PDF file
            "workflow_steps": list,             # Steps completed successfully
            "errors": list,                     # Any errors encountered
            "trigger_result": dict,             # Raw trigger API result
            "download_result": dict,            # Raw download/extraction result
            "processing_time": float            # Total processing time in seconds
        }
    """
    
    start_time = time.time()
    
    # Initialize result structure
    result = {
        "success": False,
        "documentId": None,
        "extractionData": None,
        "processedJsonPath": None,
        "sourcePdfPath": None,
        "workflowSteps": [],
        "errors": [],
        "triggerResult": None,
        "downloadResult": None,
        "processingTime": 0.0
    }
    
    try:
        if not silent:
            print("🚀 Starting Tamil Nadu PDF processing workflow...")
        
        # Step 1: Trigger PDF generation
        if not silent:
            print("📋 Step 1: Triggering PDF generation...")
            
        trigger_result = trigger_pdf_generation(
            sro_name=sro_name,
            sro_code=sro_code,
            doc_no=doc_no,
            reg_year=reg_year,
            doc_type=doc_type,
            doc_type_name=doc_type_name
        )
        
        result["triggerResult"] = trigger_result
        
        if not trigger_result["success"]:
            error_msg = f"PDF generation trigger failed: {trigger_result.get('error', 'Unknown error')}"
            result["errors"].append(error_msg)
            if not silent:
                print(f"❌ {error_msg}")
            return result
        
        result["workflowSteps"].append("triggerPdfGeneration")
        uuid_to_use = trigger_result["request_uuid"]
        
        if not silent:
            print(f"✅ PDF generation triggered (UUID: {uuid_to_use})")
        
        # Step 2: Wait for PDF to be ready
        if not silent:
            print(f"⏳ Step 2: Waiting {wait_time} seconds for PDF processing...")
        time.sleep(wait_time)
        result["workflowSteps"].append("waitForPdf")
        
        # Step 3: Download and process PDF
        if not silent:
            print("📥 Step 3: Downloading and extracting data...")
            
        download_result = download_and_process_pdf(uuid_to_use, sro_name, doc_no, reg_year)
        result["downloadResult"] = download_result
        result["workflowSteps"].append("downloadAndProcess")
        
        if download_result["success"]:
            result["success"] = True
            result["extractionData"] = download_result.get("extraction_data")
            result["processedJsonPath"] = download_result.get("processed_json_path")
            result["sourcePdfPath"] = download_result.get("source_pdf_path")
            
            # Extract document ID for easy access
            if result["extractionData"]:
                result["documentId"] = result["extractionData"].get("documentId")
            
            if not silent:
                print("✅ Workflow completed successfully!")
        else:
            error_msg = f"Download/processing failed: {download_result.get('error', 'Unknown error')}"
            result["errors"].append(error_msg)
            if not silent:
                print(f"⚠️ {error_msg}")
        
    except Exception as e:
        error_msg = f"Workflow exception: {str(e)}"
        result["errors"].append(error_msg)
        if not silent:
            print(f"❌ {error_msg}")
    
    finally:
        result["processingTime"] = round(time.time() - start_time, 2)
    
    return result


def main():
    """
    Command-line interface for the Tamil Nadu PDF processor
    
    Example usage:
        python3 main.py
    """
    
    # Example configuration - modify these values or use command line args
    config = {
        "sro_name": "Chathirapatti",
        "sro_code": "20271:1",
        "doc_no": "17",  # Change this to the document you want to process
        "reg_year": "2018"
    }
    
    print("🇮🇳 Tamil Nadu Document Processor")
    print("=" * 40)
    print(f"Processing document: {config['doc_no']}/{config['reg_year']}")
    print(f"SRO: {config['sro_name']} ({config['sro_code']})")
    print()
    
    try:
        # Process the document
        result = process_tamil_nadu_document(
            sro_name=config["sro_name"],
            sro_code=config["sro_code"],
            doc_no=config["doc_no"],
            reg_year=config["reg_year"],
            silent=False  # Show progress when run from command line
        )
        
        print("\n" + "=" * 60)
        print("📋 FINAL RESULT (JSON)")
        print("=" * 60)
        
        # Print the JSON response
        print(json.dumps(result, indent=2, ensure_ascii=False))
        
        # Exit with success/failure code
        sys.exit(0 if result["success"] else 1)
        
    except KeyboardInterrupt:
        print("\n⏹️ Process interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    main()
