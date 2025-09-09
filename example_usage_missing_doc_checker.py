#!/usr/bin/env python3
"""
Example Usage of Missing Document Checker

This script demonstrates how to use the MissingDocChecker class
to find and update missing document numbers in the market-value database.
"""

from missing_doc_checker import MissingDocChecker


def example_basic_usage():
    """Basic usage example"""
    print("🔍 Example: Basic Missing Document Check")
    print("=" * 50)
    
    # Create checker instance
    checker = MissingDocChecker()
    
    # Run with default settings (50 docs per SRO)
    checker.run_missing_doc_check(max_docs_per_sro=50)


def example_custom_usage():
    """Custom usage example with specific parameters"""
    print("🔍 Example: Custom Missing Document Check")
    print("=" * 50)
    
    # Create checker instance
    checker = MissingDocChecker()
    
    # Run with custom settings
    checker.run_missing_doc_check(max_docs_per_sro=100)  # Check more documents per SRO


def example_single_sro_check():
    """Example of checking a single SRO (modify the class to support this)"""
    print("🔍 Example: Single SRO Check")
    print("=" * 50)
    
    # This would require modifying the MissingDocChecker class
    # to support filtering by specific SRO
    print("Note: Single SRO filtering requires class modification")


if __name__ == "__main__":
    print("🚀 Missing Document Checker Examples")
    print("=" * 60)
    
    # Run basic example
    example_basic_usage()
    
    print("\n" + "=" * 60)
    print("✅ Examples completed!")
    print("\nTo run the script directly:")
    print("python missing_doc_checker.py --max-docs 50")
    print("python missing_doc_checker.py --max-docs 100 --state 'Tamil Nadu'")
