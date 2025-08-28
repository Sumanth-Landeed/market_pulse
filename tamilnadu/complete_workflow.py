#!/usr/bin/env python3
"""
Complete Tamil Nadu PDF Processing Workflow

This script demonstrates the complete end-to-end workflow:
1. Trigger PDF generation with registration details
2. Get the UUID from the response
3. Download the PDF using the UUID
4. Extract data from the PDF
5. Save results to processed/unprocessed folders

Usage:
    python3 complete_workflow.py --sro-name 'Chathirapatti' --sro-code '20271:1' --doc-no '10' --reg-year '2018'
"""

import json
import time
import sys
from typing import Dict, Any

try:
    from trigger_pdf_file_generation import trigger_pdf_generation
    from download_pdf_file import download_and_process_pdf
except ImportError as e:
    print(f"❌ Error importing modules: {e}")
    print("Make sure trigger_pdf_file_generation.py and download_pdf_file.py are in the same directory.")
    sys.exit(1)


def complete_pdf_workflow(
    sro_name: str,
    sro_code: str,
    doc_no: str,
    reg_year: str,
    doc_type: str = "1",
    doc_type_name: str = "Regular Document",
    wait_time: int = 5
) -> Dict[str, Any]:
    """
    Execute the complete PDF processing workflow
    
    Args:
        sro_name (str): SRO office name
        sro_code (str): SRO code
        doc_no (str): Document number
        reg_year (str): Registration year
        doc_type (str): Document type code
        doc_type_name (str): Document type name
        wait_time (int): Time to wait between trigger and download (seconds)
        
    Returns:
        Dict[str, Any]: Complete workflow result
    """
    
    print("🚀 STARTING COMPLETE TAMIL NADU PDF WORKFLOW")
    print("=" * 70)
    
    workflow_result = {
        "workflow_success": False,
        "trigger_result": None,
        "download_result": None,
        "steps_completed": [],
        "errors": []
    }
    
    try:
        # Step 1: Trigger PDF generation
        print("📋 STEP 1: Triggering PDF Generation...")
        print("-" * 40)
        
        trigger_result = trigger_pdf_generation(
            sro_name=sro_name,
            sro_code=sro_code,
            doc_no=doc_no,
            reg_year=reg_year,
            doc_type=doc_type,
            doc_type_name=doc_type_name
        )
        
        workflow_result["trigger_result"] = trigger_result
        
        if not trigger_result["success"]:
            error_msg = f"PDF generation trigger failed: {trigger_result.get('error', 'Unknown error')}"
            workflow_result["errors"].append(error_msg)
            print(f"❌ {error_msg}")
            return workflow_result
        
        workflow_result["steps_completed"].append("trigger_pdf_generation")
        uuid_to_use = trigger_result["request_uuid"]
        
        print(f"✅ PDF generation triggered successfully!")
        print(f"   UUID: {uuid_to_use}")
        
        # Step 2: Wait for PDF to be ready
        print(f"\n⏳ STEP 2: Waiting {wait_time} seconds for PDF to be ready...")
        print("-" * 40)
        time.sleep(wait_time)
        print("✅ Wait completed!")
        
        # Step 3: Download and process PDF
        print("\n📥 STEP 3: Downloading and Processing PDF...")
        print("-" * 40)
        
        download_result = download_and_process_pdf(uuid_to_use)
        
        workflow_result["download_result"] = download_result
        workflow_result["steps_completed"].append("download_and_process")
        
        if download_result["success"]:
            workflow_result["workflow_success"] = True
            print("\n🎉 COMPLETE WORKFLOW SUCCESSFUL!")
        else:
            error_msg = f"Download/processing failed: {download_result.get('error', 'Unknown error')}"
            workflow_result["errors"].append(error_msg)
            print(f"\n⚠️ Workflow completed with errors: {error_msg}")
        
        return workflow_result
        
    except Exception as e:
        error_msg = f"Workflow exception: {str(e)}"
        workflow_result["errors"].append(error_msg)
        print(f"\n❌ {error_msg}")
        return workflow_result


def print_workflow_summary(result: Dict[str, Any]):
    """Print a formatted summary of the workflow results"""
    
    print("\n" + "=" * 70)
    print("WORKFLOW SUMMARY")
    print("=" * 70)
    
    print(f"Overall Success: {'✅ Yes' if result['workflow_success'] else '❌ No'}")
    print(f"Steps Completed: {', '.join(result['steps_completed'])}")
    
    if result['errors']:
        print(f"Errors: {len(result['errors'])}")
        for i, error in enumerate(result['errors'], 1):
            print(f"  {i}. {error}")
    
    # Trigger details
    if result['trigger_result']:
        trigger = result['trigger_result']
        print(f"\n📋 PDF Generation Trigger:")
        print(f"   Success: {'✅ Yes' if trigger['success'] else '❌ No'}")
        print(f"   UUID: {trigger.get('request_uuid', 'N/A')}")
        if 'request_params' in trigger:
            params = trigger['request_params']
            print(f"   Document: {params.get('docNo', 'N/A')}/{params.get('regYear', 'N/A')}")
            print(f"   SRO: {params.get('sroName', 'N/A')} ({params.get('sroCode', 'N/A')})")
    
    # Download/processing details
    if result['download_result']:
        download = result['download_result']
        print(f"\n📥 PDF Download & Processing:")
        print(f"   Success: {'✅ Yes' if download['success'] else '❌ No'}")
        print(f"   Workflow Status: {download.get('workflow_status', 'N/A')}")
        
        if download['success']:
            if 'processed_json_path' in download:
                print(f"   Processed JSON: {download['processed_json_path']}")
            if 'extraction_data' in download:
                data = download['extraction_data']
                print(f"   Document ID: {data.get('document_id', 'N/A')}")
                print(f"   Market Value: {data.get('market_value', 'N/A')}")
        else:
            if 'unprocessed_pdf_path' in download:
                print(f"   Unprocessed PDF: {download['unprocessed_pdf_path']}")


def main():
    """Main function for command-line usage"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Complete Tamil Nadu PDF processing workflow')
    parser.add_argument('--sro-name', required=True, help='SRO office name')
    parser.add_argument('--sro-code', required=True, help='SRO code')
    parser.add_argument('--doc-no', required=True, help='Document number')
    parser.add_argument('--reg-year', required=True, help='Registration year')
    parser.add_argument('--doc-type', default='1', help='Document type code (default: 1)')
    parser.add_argument('--doc-type-name', default='Regular Document', help='Document type name')
    parser.add_argument('--wait-time', type=int, default=5, help='Wait time between steps in seconds (default: 5)')
    parser.add_argument('--output', help='Save complete workflow result to JSON file (optional)')
    
    args = parser.parse_args()
    
    try:
        # Run the complete workflow
        result = complete_pdf_workflow(
            sro_name=args.sro_name,
            sro_code=args.sro_code,
            doc_no=args.doc_no,
            reg_year=args.reg_year,
            doc_type=args.doc_type,
            doc_type_name=args.doc_type_name,
            wait_time=args.wait_time
        )
        
        # Print summary
        print_workflow_summary(result)
        
        # Save result if requested
        if args.output:
            with open(args.output, 'w', encoding='utf-8') as f:
                json.dump(result, f, indent=2, ensure_ascii=False)
            print(f"\n💾 Complete workflow result saved to: {args.output}")
        
        # Exit with appropriate code
        sys.exit(0 if result['workflow_success'] else 1)
        
    except KeyboardInterrupt:
        print("\n⏹️ Workflow interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    # Example usage if run directly
    if len(sys.argv) == 1:
        print("Complete Tamil Nadu PDF Processing Workflow")
        print("=" * 45)
        print("\nExample usage:")
        print("python3 complete_workflow.py \\")
        print("  --sro-name 'Chathirapatti' \\")
        print("  --sro-code '20271:1' \\") 
        print("  --doc-no '10' \\")
        print("  --reg-year '2018'")
        print("\nThis will:")
        print("1. 📋 Trigger PDF generation")
        print("2. ⏳ Wait for PDF to be ready")
        print("3. 📥 Download PDF from S3")
        print("4. 🔧 Extract data using PDF extractor")
        print("5. 📁 Save results to processed/unprocessed folders")
        sys.exit(1)
    else:
        main()
