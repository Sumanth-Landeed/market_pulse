#!/usr/bin/env python3
"""
Tamil Nadu PDF File Downloader and Processor

This script downloads PDF files from S3 URLs obtained through the Tamil Nadu registration API
and processes them using the existing PDF extractor workflow.

Requirements:
- requests library for HTTP requests
- pdf_extractor module for processing PDFs
- Install with: pip3 install requests

Usage:
    from download_pdf_file import download_and_process_pdf
    
    result = download_and_process_pdf("d6996ac3-b9a0-42a7-b4b3-0f1bdf720eaf")
"""

import requests
import json
import os
import tempfile
from pathlib import Path
from typing import Dict, Optional, Any
import sys
from urllib.parse import urlparse
import re # Added for filename generation

# Import the PDF extractor
try:
    from .pdf_extractor import PDFExtractor
except ImportError:
    print("❌ Error: pdf_extractor module not found. Make sure pdf_extractor.py is in the same directory.")
    sys.exit(1)


def get_pdf_s3_url(
    search_log_uuid: str,
    authorization_token: str = "a396f456d8ab0c8747a2a8510e4c6ebf8f2721a2310077d24c61ddd09a390de1"
) -> Dict[str, Any]:
    """
    Get PDF S3 URL from the Tamil Nadu registration API using the search log UUID
    
    Args:
        search_log_uuid (str): UUID from the PDF generation trigger
        authorization_token (str): API authorization token
        
    Returns:
        Dict[str, Any]: API response containing S3 URL or error information
        
    Raises:
        requests.exceptions.RequestException: If the HTTP request fails
        ValueError: If required parameters are missing
    """
    
    if not search_log_uuid:
        raise ValueError("search_log_uuid is required")
    
    # API endpoint
    url = "https://rust-api.landeed.com/api/v1/search_log_payment/"
    
    # Headers (matching the curl request)
    headers = {
        'accept': 'application/json',
        'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
        'authorization': authorization_token,
        'content-type': 'application/json',
        'origin': 'https://web.landeed.com',
        'platform': 'Web',
        'priority': 'u=1, i',
        'referer': 'https://web.landeed.com/',
        'sec-ch-ua': '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'
    }
    
    # Request payload
    payload = {
        "search_log_uuid": search_log_uuid
    }
    
    try:
        print(f"🔍 Getting PDF S3 URL for UUID: {search_log_uuid}")
        
        # Make the HTTP request
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        
        # Check if request was successful
        response.raise_for_status()
        
        # Parse JSON response
        result = response.json()
        
        print(f"✅ S3 URL request successful!")
        print(f"   Status Code: {response.status_code}")
        
        return {
            "success": True,
            "status_code": response.status_code,
            "data": result,
            "search_log_uuid": search_log_uuid
        }
        
    except requests.exceptions.Timeout:
        error_msg = "S3 URL request timed out after 30 seconds"
        print(f"❌ {error_msg}")
        return {
            "success": False,
            "error": error_msg,
            "search_log_uuid": search_log_uuid
        }
        
    except requests.exceptions.HTTPError as e:
        error_msg = f"HTTP error occurred: {e}"
        print(f"❌ {error_msg}")
        print(f"   Status Code: {response.status_code}")
        try:
            error_response = response.json()
            print(f"   Error Response: {json.dumps(error_response, indent=2)}")
        except:
            print(f"   Raw Response: {response.text}")
        
        return {
            "success": False,
            "error": error_msg,
            "status_code": response.status_code,
            "search_log_uuid": search_log_uuid
        }
        
    except Exception as e:
        error_msg = f"Request failed: {e}"
        print(f"❌ {error_msg}")
        return {
            "success": False,
            "error": error_msg,
            "search_log_uuid": search_log_uuid
        }


def download_pdf_from_s3(s3_url: str, filename: Optional[str] = None) -> Dict[str, Any]:
    """
    Download PDF file from S3 URL
    
    Args:
        s3_url (str): S3 URL to download the PDF from
        filename (str, optional): Custom filename for the downloaded PDF
        
    Returns:
        Dict[str, Any]: Download result with local file path
    """
    
    if not s3_url:
        raise ValueError("s3_url is required")
    
    try:
        # Parse URL to get filename if not provided
        if not filename:
            parsed_url = urlparse(s3_url)
            filename = os.path.basename(parsed_url.path)
            if not filename or not filename.endswith('.pdf'):
                filename = "downloaded_document.pdf"
        
        # Ensure filename ends with .pdf
        if not filename.endswith('.pdf'):
            filename += '.pdf'
        
        # Create source directory if it doesn't exist
        os.makedirs('source', exist_ok=True)
        
        # Full path for the downloaded file
        local_path = os.path.join('source', filename)
        
        print(f"📥 Downloading PDF from S3...")
        print(f"   URL: {s3_url}")
        print(f"   Saving to: {local_path}")
        
        # Download the file
        response = requests.get(s3_url, timeout=60, stream=True)
        response.raise_for_status()
        
        # Save to local file
        with open(local_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        # Verify file was downloaded
        file_size = os.path.getsize(local_path)
        print(f"✅ PDF downloaded successfully!")
        print(f"   File size: {file_size:,} bytes")
        print(f"   Local path: {local_path}")
        
        return {
            "success": True,
            "local_path": local_path,
            "filename": filename,
            "file_size": file_size,
            "s3_url": s3_url
        }
        
    except requests.exceptions.Timeout:
        error_msg = "PDF download timed out after 60 seconds"
        print(f"❌ {error_msg}")
        return {
            "success": False,
            "error": error_msg,
            "s3_url": s3_url
        }
        
    except Exception as e:
        error_msg = f"PDF download failed: {e}"
        print(f"❌ {error_msg}")
        return {
            "success": False,
            "error": error_msg,
            "s3_url": s3_url
        }


def extract_s3_url_from_response(api_response: Dict[str, Any]) -> Optional[str]:
    """
    Extract S3 URL from the API response
    
    Args:
        api_response (Dict[str, Any]): Response from get_pdf_s3_url function
        
    Returns:
        Optional[str]: S3 URL if found, None otherwise
    """
    
    if not api_response.get('success', False):
        return None
    
    data = api_response.get('data', {})
    
    # Check if data is a list and get the first item
    if isinstance(data, list) and len(data) > 0:
        data = data[0]
    
    # Try to find URL in files array (Tamil Nadu API structure)
    if 'files' in data and isinstance(data['files'], list) and len(data['files']) > 0:
        first_file = data['files'][0]
        if 'document' in first_file and first_file['document']:
            print(f"✅ Found S3 URL in files[0].document")
            return first_file['document']
    
    # Try different possible locations for the S3 URL (fallback)
    possible_keys = [
        's3_url',
        'pdf_url', 
        'url',
        'download_url',
        'file_url',
        'document'
    ]
    
    # Look for S3 URL in various keys
    for key in possible_keys:
        if key in data and data[key]:
            return data[key]
    
    # If not found in direct keys, look deeper in nested objects
    for key, value in data.items():
        if isinstance(value, dict):
            for nested_key in possible_keys:
                if nested_key in value and value[nested_key]:
                    return value[nested_key]
    
    print(f"⚠️ Could not find S3 URL in response. Available keys: {list(data.keys())}")
    print(f"   Response data: {json.dumps(data, indent=2)}")
    return None


def download_and_process_pdf(
    search_log_uuid: str,
    sro_name: str, # Added parameter
    doc_no: str, # Added parameter
    reg_year: str, # Added parameter
    custom_filename: Optional[str] = None,
    authorization_token: str = "a396f456d8ab0c8747a2a8510e4c6ebf8f2721a2310077d24c61ddd09a390de1"
) -> Dict[str, Any]:
    """
    Complete workflow: Get S3 URL, download PDF, and process with PDF extractor
    
    Args:
        search_log_uuid (str): UUID from the PDF generation trigger
        custom_filename (str, optional): Custom filename for the downloaded PDF
        authorization_token (str): API authorization token
        
    Returns:
        Dict[str, Any]: Complete processing result
    """
    
    print("=" * 60)
    print("TAMIL NADU PDF DOWNLOAD AND PROCESSING WORKFLOW")
    print("=" * 60)
    
    try:
        # Step 1: Get S3 URL from API
        print("\n📋 Step 1: Getting S3 URL from API...")
        s3_response = get_pdf_s3_url(search_log_uuid, authorization_token)
        
        if not s3_response['success']:
            return {
                "success": False,
                "error": f"Failed to get S3 URL: {s3_response.get('error', 'Unknown error')}",
                "search_log_uuid": search_log_uuid,
                "step_failed": "get_s3_url"
            }
        
        # Step 2: Extract S3 URL from response
        print("\n🔗 Step 2: Extracting S3 URL from response...")
        s3_url = extract_s3_url_from_response(s3_response)
        
        if not s3_url:
            return {
                "success": False,
                "error": "Could not extract S3 URL from API response",
                "search_log_uuid": search_log_uuid,
                "api_response": s3_response.get('data'),
                "step_failed": "extract_s3_url"
            }
        
        print(f"✅ S3 URL found: {s3_url}")

        # Step 3: Download PDF from S3
        print("\n📥 Step 3: Downloading PDF from S3...")

        # Generate a unique filename based on SRO name, document number, and year
        clean_sro_name = re.sub(r'[^a-zA-Z0-9_ -]', '', sro_name).replace(' ', '_')
        unique_filename = f"{clean_sro_name}_{doc_no}_{reg_year}_source.pdf"

        download_result = download_pdf_from_s3(s3_url, unique_filename)
        
        if not download_result['success']:
            return {
                "success": False,
                "error": f"Failed to download PDF: {download_result.get('error', 'Unknown error')}",
                "search_log_uuid": search_log_uuid,
                "s3_url": s3_url,
                "step_failed": "download_pdf"
            }
        
        # Step 4: Process PDF with extractor
        print("\n🔧 Step 4: Processing PDF with extractor...")
        pdf_path = download_result['local_path']
        
        # Create extractor and process
        extractor = PDFExtractor(pdf_path, enable_workflow=True)
        extraction_data = extractor.extract_all_data()
        
        # Pass original doc_no and reg_year to extractor for consistent naming
        extractor.extracted_data['documentId'] = f"{doc_no}/{reg_year}"
        
        # Print extraction results
        extractor.print_results()
        
        # Handle success/failure with workflow
        extraction_success = extraction_data.get('extraction_success', False)
        
        if extraction_success:
            processed_path = extractor.handle_successful_extraction()
            final_result = {
                "success": True,
                "search_log_uuid": search_log_uuid,
                "s3_url": s3_url,
                "downloaded_pdf": download_result,
                "extraction_data": extraction_data,
                "processed_json_path": processed_path,
                "workflow_status": "processed"
            }
        else:
            unprocessed_path = extractor.handle_failed_extraction("PDF extraction validation failed")
            final_result = {
                "success": False,
                "error": "PDF extraction failed validation",
                "search_log_uuid": search_log_uuid,
                "s3_url": s3_url,
                "downloaded_pdf": download_result,
                "extraction_data": extraction_data,
                "unprocessed_pdf_path": unprocessed_path,
                "workflow_status": "unprocessed"
            }
        
        print("\n" + "=" * 60)
        print("WORKFLOW COMPLETED")
        print("=" * 60)
        print(f"Status: {'✅ Success' if final_result['success'] else '❌ Failed'}")
        print(f"UUID: {search_log_uuid}")
        print(f"Final Location: {final_result.get('processed_json_path') or final_result.get('unprocessed_pdf_path', 'Unknown')}")
        
        return final_result
        
    except Exception as e:
        error_msg = f"Workflow failed: {str(e)}"
        print(f"\n❌ {error_msg}")
        return {
            "success": False,
            "error": error_msg,
            "search_log_uuid": search_log_uuid,
            "step_failed": "workflow_exception"
        }


def main():
    """Main function for command-line usage"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Download and process Tamil Nadu PDF files')
    parser.add_argument('uuid', help='Search log UUID from PDF generation trigger')
    parser.add_argument('--filename', help='Custom filename for downloaded PDF (optional)')
    parser.add_argument('--auth-token', help='Custom authorization token (optional)')
    parser.add_argument('--output', help='Save complete result to JSON file (optional)')
    
    args = parser.parse_args()
    
    # Prepare parameters
    params = {
        'search_log_uuid': args.uuid
    }
    
    if args.filename:
        params['custom_filename'] = args.filename
        
    if args.auth_token:
        params['authorization_token'] = args.auth_token
    
    try:
        # Run the complete workflow
        result = download_and_process_pdf(**params)
        
        # Save complete result if requested
        if args.output:
            with open(args.output, 'w', encoding='utf-8') as f:
                json.dump(result, f, indent=2, ensure_ascii=False)
            print(f"\n💾 Complete result saved to: {args.output}")
        
        # Exit with appropriate code
        sys.exit(0 if result['success'] else 1)
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    # Example usage if run directly
    if len(sys.argv) == 1:
        print("Example usage:")
        print("python3 download_pdf_file.py 'd6996ac3-b9a0-42a7-b4b3-0f1bdf720eaf'")
        print("\nOr import and use in your code:")
        print("from download_pdf_file import download_and_process_pdf")
        print("result = download_and_process_pdf('d6996ac3-b9a0-42a7-b4b3-0f1bdf720eaf')")
        sys.exit(1)
    else:
        main()
