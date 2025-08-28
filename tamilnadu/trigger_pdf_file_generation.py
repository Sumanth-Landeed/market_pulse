#!/usr/bin/env python3
"""
Tamil Nadu PDF File Generation Trigger

This script triggers PDF file generation from the Tamil Nadu registration API
using the same request structure as the provided curl command.

Requirements:
- requests library for HTTP requests
- Install with: pip3 install requests

Usage:
    from trigger_pdf_file_generation import trigger_pdf_generation
    
    result = trigger_pdf_generation(
        sro_name="Chathirapatti",
        sro_code="20271:1", 
        doc_no="10",
        reg_year="2018",
        doc_type="1",
        doc_type_name="Regular Document"
    )
"""

import requests
import json
import uuid
from typing import Dict, Optional, Any
import sys


def trigger_pdf_generation(
    sro_name: str,
    sro_code: str,
    doc_no: str,
    reg_year: str,
    doc_type: str = "1",
    doc_type_name: str = "Regular Document",
    custom_uuid: Optional[str] = None,
    authorization_token: str = "a396f456d8ab0c8747a2a8510e4c6ebf8f2721a2310077d24c61ddd09a390de1"
) -> Dict[str, Any]:
    """
    Trigger PDF file generation for Tamil Nadu registration documents
    
    Args:
        sro_name (str): Name of the SRO office (e.g., "Chathirapatti")
        sro_code (str): SRO code (e.g., "20271:1") 
        doc_no (str): Document number (e.g., "10")
        reg_year (str): Registration year (e.g., "2018")
        doc_type (str): Document type code (default: "1")
        doc_type_name (str): Document type name (default: "Regular Document")
        custom_uuid (str, optional): Custom UUID, generates random if None
        authorization_token (str): API authorization token
        
    Returns:
        Dict[str, Any]: API response containing success/error information
        
    Raises:
        requests.exceptions.RequestException: If the HTTP request fails
        ValueError: If required parameters are missing or invalid
    """
    
    # Validate required parameters
    if not all([sro_name, sro_code, doc_no, reg_year]):
        raise ValueError("sro_name, sro_code, doc_no, and reg_year are required parameters")
    
    # Generate UUID if not provided
    if custom_uuid is None:
        custom_uuid = str(uuid.uuid4())
    
    # API endpoint
    url = "https://rust-api.landeed.com/tamil_nadu/tnreginet/v1/ec_by_doc_no_search"
    
    # Headers (matching the curl request)
    headers = {
        'sec-ch-ua-platform': '"macOS"',
        'Authorization': authorization_token,
        'Referer': 'https://web.landeed.com/',
        'sec-ch-ua': '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
        'sec-ch-ua-mobile': '?0',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Platform': 'Web'
    }
    
    # Request payload (matching the curl request structure)
    payload = {
        "uuid": custom_uuid,
        "detailParts": {
            "sroName": sro_name,
            "sroCode": sro_code,
            "docNo": doc_no,
            "regYear": reg_year,
            "docType": doc_type,
            "docTypeName": doc_type_name
        }
    }
    
    try:
        print(f"🚀 Triggering PDF generation...")
        print(f"   SRO: {sro_name} ({sro_code})")
        print(f"   Document: {doc_no}/{reg_year}")
        print(f"   Type: {doc_type_name} ({doc_type})")
        print(f"   UUID: {custom_uuid}")
        
        # Make the HTTP request
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        
        # Check if request was successful
        response.raise_for_status()
        
        # Parse JSON response
        result = response.json()
        
        print(f"✅ Request successful!")
        print(f"   Status Code: {response.status_code}")
        
        return {
            "success": True,
            "status_code": response.status_code,
            "data": result,
            "request_uuid": custom_uuid,
            "request_params": payload["detailParts"]
        }
        
    except requests.exceptions.Timeout:
        error_msg = "Request timed out after 30 seconds"
        print(f"❌ {error_msg}")
        return {
            "success": False,
            "error": error_msg,
            "request_uuid": custom_uuid
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
            "request_uuid": custom_uuid
        }
        
    except requests.exceptions.RequestException as e:
        error_msg = f"Request failed: {e}"
        print(f"❌ {error_msg}")
        return {
            "success": False,
            "error": error_msg,
            "request_uuid": custom_uuid
        }
        
    except json.JSONDecodeError:
        error_msg = "Failed to parse JSON response"
        print(f"❌ {error_msg}")
        print(f"   Raw Response: {response.text}")
        return {
            "success": False,
            "error": error_msg,
            "status_code": response.status_code,
            "request_uuid": custom_uuid
        }


def trigger_pdf_generation_batch(requests_list: list) -> list:
    """
    Trigger PDF generation for multiple documents in batch
    
    Args:
        requests_list (list): List of dictionaries containing request parameters
        
    Returns:
        list: List of results for each request
    """
    results = []
    
    print(f"📦 Processing batch of {len(requests_list)} requests...")
    
    for i, request_params in enumerate(requests_list, 1):
        print(f"\n--- Processing {i}/{len(requests_list)} ---")
        result = trigger_pdf_generation(**request_params)
        results.append(result)
        
        # Add small delay between requests to be respectful
        if i < len(requests_list):
            import time
            time.sleep(1)
    
    return results


def main():
    """Main function for command-line usage"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Trigger Tamil Nadu PDF file generation')
    parser.add_argument('--sro-name', required=True, help='SRO office name')
    parser.add_argument('--sro-code', required=True, help='SRO code') 
    parser.add_argument('--doc-no', required=True, help='Document number')
    parser.add_argument('--reg-year', required=True, help='Registration year')
    parser.add_argument('--doc-type', default='1', help='Document type code')
    parser.add_argument('--doc-type-name', default='Regular Document', help='Document type name')
    parser.add_argument('--uuid', help='Custom UUID (optional)')
    parser.add_argument('--auth-token', help='Custom authorization token (optional)')
    parser.add_argument('--output', help='Save response to JSON file (optional)')
    
    args = parser.parse_args()
    
    # Prepare parameters
    params = {
        'sro_name': args.sro_name,
        'sro_code': args.sro_code,
        'doc_no': args.doc_no,
        'reg_year': args.reg_year,
        'doc_type': args.doc_type,
        'doc_type_name': args.doc_type_name
    }
    
    if args.uuid:
        params['custom_uuid'] = args.uuid
        
    if args.auth_token:
        params['authorization_token'] = args.auth_token
    
    try:
        # Trigger PDF generation
        result = trigger_pdf_generation(**params)
        
        # Print formatted result
        print("\n" + "="*50)
        print("RESULT SUMMARY")
        print("="*50)
        print(f"Success: {result['success']}")
        print(f"UUID: {result['request_uuid']}")
        
        if result['success']:
            print(f"Status Code: {result['status_code']}")
            print("API Response:")
            print(json.dumps(result['data'], indent=2, ensure_ascii=False))
        else:
            print(f"Error: {result['error']}")
            if 'status_code' in result:
                print(f"Status Code: {result['status_code']}")
        
        # Save to file if requested
        if args.output:
            with open(args.output, 'w', encoding='utf-8') as f:
                json.dump(result, f, indent=2, ensure_ascii=False)
            print(f"\n💾 Result saved to: {args.output}")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    # Example usage if run directly
    if len(sys.argv) == 1:
        print("Example usage:")
        print("python3 trigger_pdf_file_generation.py --sro-name 'Chathirapatti' --sro-code '20271:1' --doc-no '10' --reg-year '2018'")
        print("\nOr import and use in your code:")
        print("from trigger_pdf_file_generation import trigger_pdf_generation")
        print("result = trigger_pdf_generation('Chathirapatti', '20271:1', '10', '2018')")
    else:
        main()
