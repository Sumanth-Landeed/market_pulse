#!/usr/bin/env python3
"""
Example of how to use main.py to get JSON responses from Tamil Nadu PDF processing

This demonstrates how to integrate the Tamil Nadu PDF processor into your own application.
"""

import json
from main import process_tamil_nadu_document


def example_usage():
    """Demonstrate how to use the Tamil Nadu PDF processor and handle JSON responses"""
    
    print("📋 Example: Processing Tamil Nadu Document")
    print("=" * 50)
    
    # Process a document and get JSON response
    # This runs silently by default (no console output from the workflow)
    result = process_tamil_nadu_document(
        sro_name="Chathirapatti",
        sro_code="20271:1", 
        doc_no="10",
        reg_year="2018",
        silent=True  # No console output from workflow (default behavior)
    )
    
    # Now you have the complete JSON response to work with
    print("🎯 Processing completed!")
    print(f"Success: {'✅ Yes' if result['success'] else '❌ No'}")
    print(f"Processing time: {result['processingTime']} seconds")
    
    if result['success']:
        print(f"Document ID: {result['documentId']}")
        print(f"Processed JSON: {result['processedJsonPath']}")
        
        # Access specific extracted data
        data = result['extractionData']
        print(f"Nature: {data['nature']}")
        print(f"Consideration Value: {data['considerationValue']}")
        print(f"Execution Date: {data['dateOfExecution']}")
    
    # Print the complete JSON (this is what you wanted!)
    print("\n" + "=" * 60)
    print("📊 COMPLETE JSON RESPONSE")
    print("=" * 60)
    print(json.dumps(result, indent=2, ensure_ascii=False))
    
    return result


def process_multiple_documents():
    """Example of processing multiple documents"""
    
    documents = [
        {"sro_name": "Chathirapatti", "sro_code": "20271:1", "doc_no": "10", "reg_year": "2018"},
        {"sro_name": "Chathirapatti", "sro_code": "20271:1", "doc_no": "17", "reg_year": "2018"}
    ]
    
    results = []
    
    print("\n📋 Processing Multiple Documents")
    print("=" * 40)
    
    for i, doc in enumerate(documents, 1):
        print(f"\n🔄 Processing document {i}/{len(documents)}: {doc['doc_no']}/{doc['reg_year']}")
        
        result = process_tamil_nadu_document(
            sro_name=doc["sro_name"],
            sro_code=doc["sro_code"],
            doc_no=doc["doc_no"], 
            reg_year=doc["reg_year"],
            silent=True
        )
        
        results.append({
            "documentReference": f"{doc['doc_no']}/{doc['reg_year']}",
            "success": result["success"],
            "documentId": result["documentId"],
            "processingTime": result["processingTime"],
            "fullResult": result
        })
        
        print(f"   {'✅ Success' if result['success'] else '❌ Failed'}")
    
    print(f"\n📊 Batch Results: {sum(1 for r in results if r['success'])}/{len(results)} successful")
    
    return results


if __name__ == "__main__":
    # Run the example
    example_usage()
