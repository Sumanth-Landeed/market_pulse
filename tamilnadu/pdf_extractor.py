#!/usr/bin/env python3
"""
PDF Data Extractor - Standalone Script
Extracts document ID, dates (execution/presentation/registration), and market value 
from Tamil Nadu Registration Department PDFs

Requirements:
- PyPDF2 library for PDF text extraction
- Install with: pip3 install PyPDF2

Usage:
    python3 pdf_extractor.py <pdf_file_path>
    python3 pdf_extractor.py source/456_2025.pdf
"""

import PyPDF2
import re
import sys
import json
import os
import shutil
import time
from pathlib import Path
from typing import Dict, Optional
import argparse


class PDFExtractor:
    """Extract specific fields from Tamil Nadu Registration Department PDFs"""
    
    def __init__(self, pdf_path: str, enable_workflow: bool = True):
        self.pdf_path = pdf_path
        self.extracted_data = {}
        self.enable_workflow = enable_workflow
        
        # Create workflow directories if they don't exist
        if self.enable_workflow:
            os.makedirs('processed', exist_ok=True)
            os.makedirs('unprocessed', exist_ok=True)
        
    def extract_text_from_pdf(self) -> str:
        """Extract all text content from the PDF file"""
        try:
            with open(self.pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                
                # Combine text from all pages
                full_text = ""
                for page_num in range(len(pdf_reader.pages)):
                    page = pdf_reader.pages[page_num]
                    full_text += page.extract_text() + "\n"
                
                return full_text
                
        except FileNotFoundError:
            raise FileNotFoundError(f"PDF file not found: {self.pdf_path}")
        except Exception as e:
            raise Exception(f"Error reading PDF: {str(e)}")
    
    def extract_document_id(self, text: str) -> Optional[str]:
        """Extract document ID and year from the text"""
        patterns = [
            r"Document No\.& Year[^:]*:\s*(\d+/\d+)",
            r"ஆவண எ ண் மற்றும் ஆண்டு[^:]*:\s*(\d+/\d+)",
            r"Document No[^:]*:\s*(\d+/\d+)",
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1).strip()
        
        return None
    
    def extract_date(self, text: str) -> Optional[str]:
        """Extract certificate date from the text"""
        patterns = [
            r"Date / நாள்[^:]*:\s*([0-9]{1,2}-[A-Za-z]{3}-[0-9]{4})",
            r"Date[^:]*:\s*([0-9]{1,2}-[A-Za-z]{3}-[0-9]{4})",
            r"நாள்[^:]*:\s*([0-9]{1,2}-[A-Za-z]{3}-[0-9]{4})",
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1).strip()
        
        return None
    
    def extract_transaction_dates(self, text: str) -> Dict[str, Optional[str]]:
        """Extract date of execution, presentation, and registration"""
        transaction_dates = {
            'date_of_execution': None,
            'date_of_presentation': None,
            'date_of_registration': None
        }
        
        # Look for the document number line that contains the three dates
        # Pattern: 456/202502-Apr-2025  02-Apr-2025  02-Apr-2025
        doc_pattern = r"(\d+/\d+)(\d{2}-[A-Za-z]{3}-\d{4})\s*(\d{2}-[A-Za-z]{3}-\d{4})\s*(\d{2}-[A-Za-z]{3}-\d{4})"
        match = re.search(doc_pattern, text)
        
        if match:
            transaction_dates['date_of_execution'] = match.group(2).strip()
            transaction_dates['date_of_presentation'] = match.group(3).strip() 
            transaction_dates['date_of_registration'] = match.group(4).strip()
        else:
            # Alternative approach: find all dates and assume the pattern
            all_dates = re.findall(r'\d{2}-[A-Za-z]{3}-\d{4}', text)
            if len(all_dates) >= 4:  # Certificate date + 3 transaction dates
                # Skip the first date (certificate date) and get the next 3
                transaction_dates['date_of_execution'] = all_dates[1]
                transaction_dates['date_of_presentation'] = all_dates[2] 
                transaction_dates['date_of_registration'] = all_dates[3]
        
        return transaction_dates
    
    def extract_market_value(self, text: str) -> Optional[str]:
        """Extract market value from the text and clean to numeric only (optional field)"""
        patterns = [
            r"Market Value[^:]*:\s*(ரூ\.\s*[\d,]+/-)",
            r"சந்ைத மதிப்பு[^:]*:\s*(ரூ\.\s*[\d,]+/-)",
            r"Market Value[^:]*:\s*Rs\.?\s*([\d,]+)",
            r"சந்ைத மதிப்பு[^:]*:\s*ரூ\.\s*([\d,]+)",
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE | re.UNICODE)
            if match:
                raw_value = match.group(1).strip()
                # Extract only the numeric part (remove ரூ., Rs., /-, and other symbols)
                numeric_match = re.search(r'([\d,]+)', raw_value)
                if numeric_match:
                    return numeric_match.group(1).strip()
                return raw_value
        
        return None
    
    def extract_consideration_value(self, text: str) -> Optional[str]:
        """Extract consideration value from the text (optional field)"""
        patterns = [
            r"Consideration Value[^:]*:\s*(ரூ\.\s*[\d,]+/-)",
            r"ைகமாற்றுத் ெதாைக[^:]*:\s*(ரூ\.\s*[\d,]+/-)",
            r"Consideration Value[^:]*:\s*Rs\.?\s*([\d,]+)",
            r"ைகமாற்றுத் ெதாைக[^:]*:\s*ரூ\.\s*([\d,]+)",
            r"Consideration Value[^:]*:\s*(-)",
            r"ைกமாற্஛ுத् ெதாैக[^:]*:\s*(-)",
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE | re.UNICODE)
            if match:
                raw_value = match.group(1).strip()
                # If it's just a dash, return "Not specified"
                if raw_value == "-":
                    return "Not specified"
                # Extract only the numeric part (remove ரூ., Rs., /-, and other symbols)
                numeric_match = re.search(r'([\d,]+)', raw_value)
                if numeric_match:
                    return numeric_match.group(1).strip()
                return raw_value
        
        return None
    
    def extract_nature(self, text: str) -> Optional[str]:
        """Extract nature/type of the document (optional field)"""
        # Define common nature types to look for
        nature_types = [
            "Deposit Of Title Deeds",
            "Sale Deed", 
            "Gift Deed",
            "Mortgage Deed",
            "Lease Deed",
            "Exchange Deed",
            "Partition Deed",
            "Will",
            "Settlement Deed",
            "Power of Attorney",
            "Relinquishment Deed",
            "Release Deed",
            "Receipt",  # Added Receipt
            "Mortgage Receipt",
            "Loan Receipt",
            "Title Receipt"
        ]
        
        # First, try to find exact matches of common nature types
        for nature_type in nature_types:
            if nature_type.lower() in text.lower():
                return nature_type
        
        # Then try pattern-based extraction for other cases
        patterns = [
            r"Nature/\s*தன்ைம[^:]*:\s*([A-Za-z\s]+?)(?=\s*Name|$|\n)",
            r"தன்ைம/\s*Nature[^:]*:\s*([A-Za-z\s]+?)(?=\s*Name|$|\n)", 
            r"Nature[^:]*:\s*([A-Za-z\s]+?)(?=\s*Name|$|\n)",
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE | re.UNICODE)
            if match:
                nature_value = match.group(1).strip()
                # Clean up and validate
                nature_value = re.sub(r'\s+', ' ', nature_value).strip()
                
                # Filter out invalid matches (numbers, currency symbols, etc.)
                if (len(nature_value) >= 3 and 
                    not re.search(r'[\d,]+', nature_value) and 
                    not re.search(r'[ரூRs\.\/-]', nature_value) and
                    'Market Value' not in nature_value and
                    'Consideration' not in nature_value):
                    return nature_value
        
        return None
    
    def extract_additional_info(self, text: str) -> Dict[str, Optional[str]]:
        """Extract additional useful information"""
        additional_data = {}
        
        # SRO Office
        sro_match = re.search(r"S\.R\.O[^:]*:\s*([^Date\n]+)", text)
        if sro_match:
            additional_data['sroOffice'] = sro_match.group(1).strip()
        
        # Property Type
        prop_type_match = re.search(r"Property Type[^:]*:\s*([^\n]+)", text)
        if prop_type_match:
            additional_data['propertyType'] = prop_type_match.group(1).strip()
        
        # Village & Street
        village_match = re.search(r"Village & Street[^:]*:\s*([^\n]+)", text)
        if village_match:
            additional_data['villageStreet'] = village_match.group(1).strip()
        
        # Survey No & Extent
        survey_match = re.search(r"Survey No-Extent[^:]*:\s*([^\n]+)", text)
        if survey_match:
            additional_data['surveyExtent'] = survey_match.group(1).strip()
        
        return additional_data
    
    def extract_area_in_sqft(self, text: str, additional_info: Dict[str, Optional[str]]) -> Optional[int]:
        """Extract area in square feet from the document - focuses on Extent field"""
        
        # All possible area unit patterns (comprehensive list)
        area_patterns = [
            # Square feet variations
            r'(\d+(?:[,\.]\d+)*)\s*(?:sqft|sq\.?\s*ft\.?|square\s+feet)',
            r'(\d+(?:[,\.]\d+)*)\s*(?:Sq\.?\s*(?:Ft|ft)\.?)',
            
            # Square variations  
            r'(\d+(?:[,\.]\d+)*)\s*(?:square|sq\.?)',
            r'(\d+(?:[,\.]\d+)*)\s*SQUARE',
            
            # Tamil units
            r'(\d+(?:[,\.]\d+)*)\s*(?:சதுரடி)',
            
            # Decimal numbers with area units
            r'(\d+\.\d+)\s*(?:square|sq\.?|sqft|SQUARE)',
        ]
        
        # Priority order: Check extent-related fields first
        search_sources = []
        
        # 1. Survey/Extent specific fields (highest priority)
        if additional_info.get('surveyExtent'):
            search_sources.append(('surveyExtent', additional_info['surveyExtent']))
            
        # 2. Village/Street field which often contains extent info
        if additional_info.get('villageStreet'):
            search_sources.append(('villageStreet', additional_info['villageStreet']))
            
        # 3. Property type field  
        if additional_info.get('propertyType'):
            search_sources.append(('propertyType', additional_info['propertyType']))
            
        # 4. Full document text as fallback
        search_sources.append(('fullText', text))
        
        # Search through each source in priority order
        for source_name, source_text in search_sources:
            if not source_text:
                continue
                
            # Try all area patterns on this source
            for pattern in area_patterns:
                matches = re.finditer(pattern, source_text, re.IGNORECASE)
                for match in matches:
                    area_str = match.group(1).replace(',', '').replace(' ', '')
                    try:
                        # Handle both integers and decimals
                        if '.' in area_str:
                            area_value = float(area_str)
                            # Convert decimal to integer (round to nearest)
                            return int(round(area_value))
                        else:
                            return int(area_str)
                    except ValueError:
                        continue
        
        # Special handling for Extent field patterns in full document
        extent_specific_patterns = [
            r'(?:Extent|விஸ்தீர்ணம்)[^:]*:\s*[^0-9]*(\d+(?:[,\.]\d+)*)\s*(?:சதுரடி|sqft|sq\.?\s*ft\.?|square\s*feet?|square|SQUARE)',
            r'(?:Survey\s+No[^:]*Extent[^:]*:|Extent[^:]*:)[^0-9]*(\d+(?:[,\.]\d+)*)\s*(?:square|sq\.?|sqft|SQUARE|சதுரடி)',
        ]
        
        for pattern in extent_specific_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                area_str = match.group(1).replace(',', '').replace(' ', '')
                try:
                    if '.' in area_str:
                        return int(round(float(area_str)))
                    else:
                        return int(area_str)
                except ValueError:
                    continue
        
        return None
    
    def extract_all_data(self) -> Dict[str, any]:
        """Extract all required data from the PDF"""
        print(f"Processing PDF: {self.pdf_path}")
        
        # Extract text from PDF
        text = self.extract_text_from_pdf()
        
        # Extract main fields
        document_id = self.extract_document_id(text)
        market_value = self.extract_market_value(text)
        consideration_value = self.extract_consideration_value(text)  # Optional field
        nature = self.extract_nature(text)  # Optional field
        
        # Extract transaction dates
        transaction_dates = self.extract_transaction_dates(text)
        
        # Extract additional information
        additional_info = self.extract_additional_info(text)
        
        # Extract area in square feet
        area_in_sqft = self.extract_area_in_sqft(text, additional_info)
        
        # Get current Unix timestamp
        created_at = int(time.time())
        
        # Compile results
        self.extracted_data = {
            'documentId': document_id,
            'createdAt': created_at,
            'dateOfExecution': transaction_dates['date_of_execution'],
            'dateOfPresentation': transaction_dates['date_of_presentation'],
            'dateOfRegistration': transaction_dates['date_of_registration'],
            'marketValue': market_value,
            'considerationValue': consideration_value,  # Optional field
            'nature': nature,  # Optional field
            'areaInSqft': area_in_sqft,  # Optional field
            'additionalInfo': additional_info
        }

        # Determine overall extraction success
        # Basic validation: documentId, marketValue, and at least one transaction date should be present
        self.extracted_data['extraction_success'] = (
            self.extracted_data['documentId'] is not None and
            self.extracted_data['marketValue'] is not None and
            (
                self.extracted_data['dateOfExecution'] is not None or
                self.extracted_data['dateOfPresentation'] is not None or
                self.extracted_data['dateOfRegistration'] is not None
            )
        )
        
        return self.extracted_data
    
    def print_results(self):
        """Print extracted data in a formatted way"""
        print("\n" + "="*60)
        print("PDF EXTRACTION RESULTS")
        print("="*60)
        
        print(f"📄 Document ID: {self.extracted_data.get('documentId', 'Not found')}")
        print(f"🕒 Created At: {self.extracted_data.get('createdAt', 'Not found')} (Unix timestamp)")
        print(f"\n📋 Transaction Dates:")
        print(f"   📝 Date of Execution: {self.extracted_data.get('dateOfExecution', 'Not found')}")
        print(f"   📤 Date of Presentation: {self.extracted_data.get('dateOfPresentation', 'Not found')}")
        print(f"   📋 Date of Registration: {self.extracted_data.get('dateOfRegistration', 'Not found')}")
        print(f"\n💰 Market Value: {self.extracted_data.get('marketValue', 'Not found')}")
        print(f"💵 Consideration Value: {self.extracted_data.get('considerationValue', 'Not found')}")
        print(f"📋 Nature: {self.extracted_data.get('nature', 'Not found')}")
        print(f"📏 Area in Sq.Ft: {self.extracted_data.get('areaInSqft', 'Not found')}")
        
        additional_info = self.extracted_data.get('additionalInfo', {})
        if additional_info:
            print("\n📋 Additional Information:")
            for key, value in additional_info.items():
                if value:
                    # Convert camelCase back to readable format for display
                    readable_key = key.replace('sroOffice', 'Sro Office').replace('propertyType', 'Property Type').replace('villageStreet', 'Village Street').replace('surveyExtent', 'Survey Extent')
                    print(f"   {readable_key}: {value}")
        
        success = self.extracted_data.get('documentId') is not None
        print(f"\n✅ Extraction Status: {'Success' if success else 'Partial/Failed'}")
        print("="*60)
    
    def save_to_json(self, output_file: str = None):
        """Save extracted data to JSON file"""
        if not output_file:
            output_file = self.pdf_path.replace('.pdf', '_extracted_data.json')
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(self.extracted_data, f, indent=2, ensure_ascii=False)
        
        print(f"💾 Data saved to: {output_file}")
    
    def handle_successful_extraction(self) -> str:
        """Handle successful extraction: save JSON to processed folder and keep original PDF in source"""
        if not self.enable_workflow:
            return self.save_to_json()
        
        # Use document ID for naming if available
        document_id = self.extracted_data.get('documentId', 'unknown')
        # Clean document ID for filename (replace / with _)
        clean_doc_id = document_id.replace('/', '_') if document_id else 'unknown'
        
        # Generate output filename using document ID
        json_filename = f"{clean_doc_id}_extracted_data.json"
        processed_json_path = os.path.join('processed', json_filename)
        
        # Save JSON to processed folder
        with open(processed_json_path, 'w', encoding='utf-8') as f:
            json.dump(self.extracted_data, f, indent=2, ensure_ascii=False)
        
        # Rename original PDF in source folder to use document ID
        pdf_filename = Path(self.pdf_path).name
        original_pdf_path = self.pdf_path
        new_pdf_name = f"{clean_doc_id}_source.pdf"
        new_pdf_path = os.path.join('source', new_pdf_name)
        
        # Rename the PDF if it doesn't already have the correct name
        # And ensure the new_pdf_path is unique if needed by appending a timestamp or hash
        if original_pdf_path != new_pdf_path:
            # If a file with new_pdf_name already exists, append a timestamp to make it unique
            if os.path.exists(new_pdf_path):
                timestamp = int(time.time())
                new_pdf_name = f"{clean_doc_id}_source_{timestamp}.pdf"
                new_pdf_path = os.path.join('source', new_pdf_name)
                
            os.rename(original_pdf_path, new_pdf_path)
            print(f"📁 PDF renamed in source: {new_pdf_name}")
            self.pdf_path = new_pdf_path  # Update the path reference
        else:
            print(f"📁 PDF kept in source: {Path(self.pdf_path).name}")
        
        print(f"✅ JSON saved to: {processed_json_path}")
        return processed_json_path
    
    def handle_failed_extraction(self, error_message: str) -> str:
        """Handle failed extraction: keep PDF in source but create error log"""
        if not self.enable_workflow:
            print(f"❌ Extraction failed: {error_message}")
            return None
        
        # Try to get document ID for naming, fallback to filename
        document_id = self.extracted_data.get('documentId', 'unknown')
        clean_doc_id = document_id.replace('/', '_') if document_id else Path(self.pdf_path).stem
        
        # Rename PDF in source folder to use document ID
        original_pdf_path = self.pdf_path
        new_pdf_name = f"{clean_doc_id}_source_failed.pdf"
        new_pdf_path = os.path.join('source', new_pdf_name)

        # If a file with new_pdf_name already exists, append a timestamp to make it unique
        if os.path.exists(new_pdf_path):
            timestamp = int(time.time())
            new_pdf_name = f"{clean_doc_id}_source_failed_{timestamp}.pdf"
            new_pdf_path = os.path.join('source', new_pdf_name)

        if original_pdf_path != new_pdf_path:
            os.rename(original_pdf_path, new_pdf_path)
            print(f"📁 PDF kept in source (failed): {new_pdf_name}")
            self.pdf_path = new_pdf_path
        else:
            print(f"📁 PDF kept in source (failed): {Path(self.pdf_path).name}")
        
        # Create error log in unprocessed folder
        error_log_path = os.path.join('unprocessed', f"{clean_doc_id}_error.txt")
        # If error log already exists, append timestamp
        if os.path.exists(error_log_path):
            timestamp = int(time.time())
            error_log_path = os.path.join('unprocessed', f"{clean_doc_id}_error_{timestamp}.txt")

        with open(error_log_path, 'w', encoding='utf-8') as f:
            f.write(f"Extraction Error: {error_message}\n")
            f.write(f"Document ID: {document_id}\n")
            f.write(f"Original file kept in: {self.pdf_path}\n")
        
        print(f"❌ Extraction failed: {error_message}")
        print(f"📄 Error log saved to: {error_log_path}")
        return self.pdf_path


def main():
    """Main function to run the PDF extractor"""
    parser = argparse.ArgumentParser(description='Extract document ID, date, and market value from PDF')
    parser.add_argument('pdf_file', help='Path to the PDF file to process')
    parser.add_argument('--output', '-o', help='Output JSON file path (optional)')
    parser.add_argument('--json-only', action='store_true', help='Output only JSON data')
    parser.add_argument('--no-workflow', action='store_true', help='Disable workflow (don\'t move files)')
    
    args = parser.parse_args()
    
    try:
        # Create extractor instance with workflow enabled/disabled
        enable_workflow = not args.no_workflow
        extractor = PDFExtractor(args.pdf_file, enable_workflow=enable_workflow)
        
        # Extract data
        data = extractor.extract_all_data()
        
        # Check if extraction was successful
        extraction_success = data.get('extraction_success', False)
        
        if args.json_only:
            # Output only JSON data (no workflow)
            print(json.dumps(data, indent=2, ensure_ascii=False))
            return
        
        # Print formatted results
        extractor.print_results()
        
        if enable_workflow:
            # Use workflow to handle success/failure
            if extraction_success:
                extractor.handle_successful_extraction()
            else:
                extractor.handle_failed_extraction("Extraction validation failed - missing required fields")
        else:
            # Traditional behavior - save to JSON file
            extractor.save_to_json(args.output)
    
    except FileNotFoundError as e:
        error_msg = f"File not found: {str(e)}"
        print(f"❌ Error: {error_msg}")
        
        # If workflow is enabled, try to handle the error
        if not args.no_workflow:
            try:
                extractor = PDFExtractor(args.pdf_file, enable_workflow=True)
                extractor.handle_failed_extraction(error_msg)
            except:
                pass
        
        sys.exit(1)
    
    except Exception as e:
        error_msg = str(e)
        print(f"❌ Error: {error_msg}")
        
        # If workflow is enabled, try to handle the error
        if not args.no_workflow:
            try:
                extractor = PDFExtractor(args.pdf_file, enable_workflow=True)
                extractor.handle_failed_extraction(error_msg)
            except:
                pass
        
        sys.exit(1)


if __name__ == "__main__":
    # If run without arguments, try to process the default PDF file
    if len(sys.argv) == 1:
        # Default file in source directory
        default_file = "source/456_2025.pdf"
        if os.path.exists(default_file):
            sys.argv.append(default_file)
        else:
            print("Usage: python3 pdf_extractor.py <pdf_file_path>")
            print("Example: python3 pdf_extractor.py source/456_2025.pdf")
            sys.exit(1)
    
    main()
