
import os
from pymongo import MongoClient
from dotenv import load_dotenv
from tamilnadu.main import process_tamil_nadu_document


def main():
    # Load environment variables from .env file
    load_dotenv()

    # MongoDB connection details
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
    database_name = os.getenv("MONGO_DB_NAME", "analytics")

    client = None  # Initialize client to None

    try:
        # Connect to MongoDB
        client = MongoClient(mongo_uri)
        db = client[database_name]

        print(f"Connected to database: {database_name}")
        print("Available databases:", client.list_database_names())
        print(f"Collections in '{database_name}':", db.list_collection_names())

        # Get the "states" collection
        states_collection = db["states"]

        # Get all state documents
        states = list(states_collection.find({}))

        if not states:
            print("No states found in the 'states' collection.")
            return

        # Get the "sro_details" collection
        sro_details_collection = db["sro_details"]

        for state_doc in states:
            state_name = state_doc.get("name", "Unknown State")
            print(f"State started: {state_name}")

            # Get all documents from "sro_details" for the current state
            # Assuming there is a field in sro_details that links to the state, e.g., "state_id"
            # For this example, let's assume sro_details documents have a "state_name" field
            sro_details = list(sro_details_collection.find({"state": state_name}))

            if sro_details:
                print(f"SRO Details for {state_name}:")
                for sro_doc in sro_details:
                    print(sro_doc)
                    if state_name == "Tamil Nadu":
                        print(f"    Processing Tamil Nadu document for SRO: {sro_doc.get("sroName")}")
                        tamil_nadu_result = process_tamil_nadu_document(
                            sro_name=sro_doc.get("sroName"),
                            sro_code=sro_doc.get("sroCode"),
                            doc_no="16",
                            reg_year="2018",
                            silent=True  # Suppress internal prints of the TN workflow
                        )
                        print(f"    Tamil Nadu process result: {tamil_nadu_result.get("success")}")
                        
                        # Insert the result into the market-value collection
                        if tamil_nadu_result:
                            market-value_collection = db["market-value"]
                            try:
                                insert_result = market-value_collection.insert_one(tamil_nadu_result)
                                print(f"    Inserted into market-value collection with ID: {insert_result.inserted_id}")
                            except Exception as insert_e:
                                print(f"    Error inserting into market-value: {insert_e}")
            else:
                print(f"No SRO details found for {state_name}.")
            
            print(f"State completed: {state_name}\n")

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if client:
            client.close()
            print("MongoDB connection closed.")

if __name__ == "__main__":
    main()
