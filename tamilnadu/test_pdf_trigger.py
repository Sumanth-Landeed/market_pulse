#!/usr/bin/env python3
"""
Test script for trigger_pdf_file_generation.py

This script demonstrates how to use the PDF generation trigger function
both for single requests and batch processing.
"""

from trigger_pdf_file_generation import trigger_pdf_generation, trigger_pdf_generation_batch
import json

def test_single_request():
    """Test a single PDF generation request"""
    print("=" * 60)
    print("TESTING SINGLE PDF GENERATION REQUEST")
    print("=" * 60)
    
    result = trigger_pdf_generation(
        sro_name="Chathirapatti",
        sro_code="20271:1",
        doc_no="10", 
        reg_year="2018",
        doc_type="1",
        doc_type_name="Regular Document"
    )
    
    print(f"\nResult: {json.dumps(result, indent=2, ensure_ascii=False)}")
    return result

def test_batch_requests():
    """Test multiple PDF generation requests in batch"""
    print("\n" + "=" * 60)
    print("TESTING BATCH PDF GENERATION REQUESTS")
    print("=" * 60)
    
    # Example batch requests
    batch_requests = [
        {
            'sro_name': 'Chathirapatti',
            'sro_code': '20271:1',
            'doc_no': '10',
            'reg_year': '2018'
        },
        {
            'sro_name': 'Chathirapatti',
            'sro_code': '20271:1', 
            'doc_no': '11',
            'reg_year': '2018'
        },
        {
            'sro_name': 'Chathirapatti',
            'sro_code': '20271:1',
            'doc_no': '12',
            'reg_year': '2018'
        }
    ]
    
    results = trigger_pdf_generation_batch(batch_requests)
    
    print(f"\nBatch Results Summary:")
    for i, result in enumerate(results, 1):
        print(f"  Request {i}: {'✅ Success' if result['success'] else '❌ Failed'}")
    
    return results

def test_custom_parameters():
    """Test with custom parameters and error handling"""
    print("\n" + "=" * 60) 
    print("TESTING CUSTOM PARAMETERS")
    print("=" * 60)
    
    # Test with custom UUID
    custom_uuid = "12345678-1234-5678-9abc-123456789abc"
    
    result = trigger_pdf_generation(
        sro_name="CustomSRO",
        sro_code="99999:1",
        doc_no="999",
        reg_year="2023",
        doc_type="2",
        doc_type_name="Special Document",
        custom_uuid=custom_uuid
    )
    
    print(f"Custom UUID used: {result['request_uuid']}")
    return result

if __name__ == "__main__":
    print("Tamil Nadu PDF Generation Trigger - Test Suite")
    print("=" * 60)
    
    try:
        # Test single request
        single_result = test_single_request()
        
        # Test batch requests
        batch_results = test_batch_requests()
        
        # Test custom parameters
        custom_result = test_custom_parameters()
        
        print("\n" + "=" * 60)
        print("ALL TESTS COMPLETED")
        print("=" * 60)
        
        # Summary
        total_success = sum([
            1 if single_result['success'] else 0,
            sum(1 for r in batch_results if r['success']),
            1 if custom_result['success'] else 0
        ])
        total_requests = 1 + len(batch_results) + 1
        
        print(f"Total Successful Requests: {total_success}/{total_requests}")
        
    except Exception as e:
        print(f"❌ Test failed with error: {str(e)}")
