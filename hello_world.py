
import os
from pymongo import MongoClient
from dotenv import load_dotenv
from fastapi import FastAPI
from datetime import datetime, timedelta
from typing import Optional
import logging
from starlette.staticfiles import StaticFiles

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# @app.get("/")
# async def read_root():
#     return {"Hello": "World"}

# @app.get("/market/value/service/top10")
# async def read_item(state: str):
#     load_dotenv()
#     mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
#     database_name = os.getenv("MONGO_DB_NAME", "mydatabase")

#     client = None
#     try:
#         client = MongoClient(mongo_uri)
#         db = client[database_name]
#         collection = db["market-value-processed"]  # Changed collection here

#         pipeline = [
#             {"$match": {"state": state, "deedType": "Sale Deed"}},  # Added deedType filter
#             {"$sort": {"considerationVal": -1}},
#             {"$limit": 20}
#         ]

#         documents = list(collection.aggregate(pipeline))

#         # Convert ObjectId to string for JSON serialization
#         for doc in documents:
#             if "_id" in doc:
#                 doc["_id"] = str(doc["_id"])

#         return {"state": state, "top_documents": documents}
#     except Exception as e:
#         return {"error": str(e)}
#     finally:
#         if client:
#             client.close()


@app.get("/market/value/top10")
async def get_top10_market_value(date: Optional[str] = None):
    load_dotenv()
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
    database_name = os.getenv("MONGO_DB_NAME", "mydatabase")

    client = None
    try:
        client = MongoClient(mongo_uri)
        db = client[database_name]
        collection = db["market-value-processed"]

        # Get today's date in the format used in the database
        if date:
            target_date_str = date
        else:
            target_date_str = datetime.now().strftime("%d-%m-%Y") # Changed format to DD-MM-YYYY
        
        # Parse the target_date_str into a datetime object
        target_date_obj = datetime.strptime(target_date_str, "%d-%m-%Y")
        start_of_day = target_date_obj.replace(hour=0, minute=0, second=0, microsecond=0)
        end_of_day = target_date_obj.replace(hour=23, minute=59, second=59, microsecond=999999)

        match_query_log = {
            "dateOfRegistration_date": {
                "$gte": start_of_day,
                "$lte": end_of_day
            }
        }
        logger.info(f"Match Query for top10: {match_query_log}") # Log the match query

        pipeline = [
            {
                "$addFields": {
                    "dateOfRegistration_date": {
                        "$dateFromString": {
                            "dateString": "$dateOfRegistration",
                            "format": "%d-%m-%Y"
                        }
                    },
                    "considerationValue_numeric": {"$convert": {"input": "$considerationVal", "to": "double", "onError": 0, "onNull": 0}}
                }
            },
            {"$match": {"dateOfRegistration_date": {"$gte": start_of_day, "$lte": end_of_day}}}, # Match by converted date object
            {"$sort": {"considerationValue_numeric": -1}},
            {"$limit": 10},
            {
                "$project": {
                    "_id": {"$toString": "$_id"},
                    "sroCode": "$sroCode",
                    "considerationValue": "$considerationValue_numeric",
                    "pricePerExtent": {
                        "$cond": {
                            "if": {"$ne": ["$extent", 0]},
                            "then": {"$divide": ["$considerationValue_numeric", {"$convert": {"input": "$extent", "to": "double", "onError": 0, "onNull": 0}}]},
                            "else": 0
                        }
                    },
                    "unitOfExtent": "$extentUnit",
                    "village": "$village"
                }
            }
        ]
        logger.info(f"Pipeline for top10: {pipeline}") # Log the pipeline

        documents = list(collection.aggregate(pipeline))
        return {"today": target_date_str, "top_documents": documents}
    except Exception as e:
        return {"error": str(e)}
    finally:
        if client:
            client.close()


@app.get("/market/value/summary")
async def get_market_value_summary(
    startDate: Optional[str] = None,
    endDate: Optional[str] = None,
    sroCode: Optional[str] = None
):
    load_dotenv()
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
    database_name = os.getenv("MONGO_DB_NAME", "mydatabase")

    client = None
    try:
        client = MongoClient(mongo_uri)
        db = client[database_name]
        collection = db["market-value-processed"]

        today = datetime.now()
        if not startDate or not endDate:
            end_date_obj = today.replace(hour=23, minute=59, second=59, microsecond=999999)
            start_date_obj = (today - timedelta(days=7)).replace(hour=0, minute=0, second=0, microsecond=0)
        else:
            start_date_obj = datetime.strptime(startDate, "%d-%m-%Y").replace(hour=0, minute=0, second=0, microsecond=0)
            end_date_obj = datetime.strptime(endDate, "%d-%m-%Y").replace(hour=23, minute=59, second=59, microsecond=999999)

        # Build match query
        match_query = {
            "dateOfRegistration_date": {
                "$gte": start_date_obj,
                "$lte": end_date_obj
            }
        }
        if sroCode:
            match_query["sroCode"] = sroCode

        pipeline = [
            {
                "$addFields": {
                    "dateOfRegistration_date": {
                        "$dateFromString": {
                            "dateString": "$dateOfRegistration",
                            "format": "%d-%m-%Y"
                        }
                    }
                }
            },
            {"$match": match_query},
            {
                "$addFields": {
                    "considerationVal_numeric": {"$convert": {"input": "$considerationVal", "to": "double", "onError": 0, "onNull": 0}},
                    "extent_numeric": {"$convert": {"input": "$extent", "to": "double", "onError": 0, "onNull": 0}}
                }
            },
            
            {
                "$addFields": {
                    "pricePerExtent": {
                        "$cond": {
                            "if": {"$ne": ["$extent_numeric", 0]},
                            "then": {"$divide": ["$considerationVal_numeric", "$extent_numeric"]},
                            "else": 0
                        }
                    }
                }
            },
            {
                "$group": {
                    "_id": None,  # Group all documents together
                    "totalTransactions": {"$sum": 1},
                    "totalMarketValue": {"$sum": "$considerationVal_numeric"},
                    "sumPricePerExtent": {"$sum": "$pricePerExtent"}
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "totalTransactions": "$totalTransactions",
                    "totalMarketValue": "$totalMarketValue",
                    "averagePricePerTransaction": {
                        "$cond": {
                            "if": {"$ne": ["$totalTransactions", 0]},
                            "then": {"$divide": ["$totalMarketValue", "$totalTransactions"]},
                            "else": 0
                        }
                    },
                    "averagePricePerExtent": {
                        "$cond": {
                            "if": {"$ne": ["$totalTransactions", 0]},
                            "then": {"$divide": ["$sumPricePerExtent", "$totalTransactions"]},
                            "else": 0
                        }
                    }
                }
            }
        ]

        result = list(collection.aggregate(pipeline))
        if result:
            return result[0]
        else:
            return {
                "totalTransactions": 0,
                "totalMarketValue": 0,
                "averagePricePerTransaction": 0,
                "averagePricePerExtent": 0
            }

    except Exception as e:
        return {"error": str(e)}
    finally:
        if client:
            client.close()


@app.get("/market/value/top10_detailed")
async def get_top10_detailed_market_value(
    startDate: Optional[str] = None,
    endDate: Optional[str] = None,
    sroCode: Optional[str] = None
):
    load_dotenv()
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
    database_name = os.getenv("MONGO_DB_NAME", "mydatabase")

    client = None
    try:
        client = MongoClient(mongo_uri)
        db = client[database_name]
        collection = db["market-value-processed"]

        today = datetime.now()
        if not startDate or not endDate:
            end_date_obj = today.replace(hour=23, minute=59, second=59, microsecond=999999)
            start_date_obj = (today - timedelta(days=7)).replace(hour=0, minute=0, second=0, microsecond=0)
        else:
            start_date_obj = datetime.strptime(startDate, "%d-%m-%Y").replace(hour=0, minute=0, second=0, microsecond=0)
            end_date_obj = datetime.strptime(endDate, "%d-%m-%Y").replace(hour=23, minute=59, second=59, microsecond=999999)

        match_query = {
            "dateOfRegistration_date": {
                "$gte": start_date_obj,
                "$lte": end_date_obj
            }
        }
        if sroCode:
            match_query["sroCode"] = sroCode

        pipeline = [
            {
                "$addFields": {
                    "dateOfRegistration_date": {
                        "$dateFromString": {
                            "dateString": "$dateOfRegistration",
                            "format": "%d-%m-%Y"
                        }
                    }
                }
            },
            {"$match": match_query},
            {
                "$addFields": {
                    "considerationValue_numeric": {"$convert": {"input": "$considerationVal", "to": "double", "onError": 0, "onNull": 0}},
                    "extent_numeric": {"$convert": {"input": "$extent", "to": "double", "onError": 0, "onNull": 0}}
                }
            },
            {
                "$addFields": {
                    "pricePerExtent": {
                        "$cond": {
                            "if": {"$ne": ["$extent_numeric", 0]},
                            "then": {"$divide": ["$considerationValue_numeric", "$extent_numeric"]},
                            "else": 0
                        }
                    }
                }
            },
            {"$sort": {"considerationValue_numeric": -1}}, # Sort by numeric consideration value
            {"$limit": 10},
            {
                "$project": {
                    "_id": 0,  # Exclude _id from the final output
                    "sroCode": "$sroCode",
                    "village": "$village",
                    "considerationValue": "$considerationValue_numeric",
                    "pricePerExtent": "$pricePerExtent",
                    "unitOfExtent": "$extentUnit",
                    "dateOfRegistration": "$dateOfRegistration",
                    "extent": "$extent_numeric"
                }
            }
        ]

        documents = list(collection.aggregate(pipeline))

        # Add ranking to each document
        for i, doc in enumerate(documents):
            doc["ranking"] = i + 1

        return {"startDate": startDate, "endDate": endDate, "sroCode": sroCode, "top_documents": documents}

    except Exception as e:
        return {"error": str(e)}
    finally:
        if client:
            client.close()


@app.get("/debug/sample_document")
async def get_sample_document():
    load_dotenv()
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
    database_name = os.getenv("MONGO_DB_NAME", "mydatabase")

    client = None
    try:
        client = MongoClient(mongo_uri)
        db = client[database_name]
        collection = db["market-value-processed"]
        
        sample_doc = collection.find_one({}) # Fetch one document
        if sample_doc:
            # Convert ObjectId to string for JSON serialization
            sample_doc["_id"] = str(sample_doc["_id"])
        return {"sample_document": sample_doc}
    except Exception as e:
        return {"error": str(e)}
    finally:
        if client:
            client.close()

@app.get("/market/value/data_range")
async def get_data_range():
    load_dotenv()
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
    database_name = os.getenv("MONGO_DB_NAME", "mydatabase")

    client = None
    try:
        client = MongoClient(mongo_uri)
        db = client[database_name]
        collection = db["market-value-processed"]

        pipeline = [
            {
                "$addFields": {
                    "dateOfRegistration_date": {
                        "$dateFromString": {
                            "dateString": "$dateOfRegistration",
                            "format": "%d-%m-%Y"
                        }
                    }
                }
            },
            {
                "$group": {
                    "_id": None,
                    "minDate": {"$min": "$dateOfRegistration_date"},
                    "maxDate": {"$max": "$dateOfRegistration_date"}
                }
            }
        ]

        result = list(collection.aggregate(pipeline))

        if result:
            min_date = result[0]["minDate"].strftime("%d-%m-%Y")
            max_date = result[0]["maxDate"].strftime("%d-%m-%Y")
            return {"min_date": min_date, "max_date": max_date}
        else:
            return {"min_date": None, "max_date": None}



    except Exception as e:
        return {"error": str(e)}
    finally:
        if client:
            client.close()

@app.get("/debug/db_info")
async def get_db_info():
    load_dotenv()
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
    database_name = os.getenv("MONGO_DB_NAME", "mydatabase")
    return {"mongo_uri": mongo_uri, "database_name": database_name}

@app.get("/market/value/timeseries_top10_sum")
async def get_timeseries_top10_sum(
    startDate: Optional[str] = None,
    endDate: Optional[str] = None,
    sroCode: Optional[str] = None
):
    load_dotenv()
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
    database_name = os.getenv("MONGO_DB_NAME", "mydatabase")

    client = None
    try:
        client = MongoClient(mongo_uri)
        db = client[database_name]
        collection = db["market-value-processed"]

        today = datetime.now()
        if not startDate or not endDate:
            end_date_obj = today.replace(hour=23, minute=59, second=59, microsecond=999999)
            start_date_obj = (today - timedelta(days=7)).replace(hour=0, minute=0, second=0, microsecond=0)
        else:
            start_date_obj = datetime.strptime(startDate, "%d-%m-%Y").replace(hour=0, minute=0, second=0, microsecond=0)
            end_date_obj = datetime.strptime(endDate, "%d-%m-%Y").replace(hour=23, minute=59, second=59, microsecond=999999)

        match_query = {
            "dateOfRegistration_date": {
                "$gte": start_date_obj,
                "$lte": end_date_obj
            }
        }
        if sroCode:
            match_query["sroCode"] = sroCode

        pipeline = [
            {
                "$addFields": {
                    "dateOfRegistration_date": {
                        "$dateFromString": {
                            "dateString": "$dateOfRegistration",
                            "format": "%d-%m-%Y"
                            
                        }
                    },
                    "considerationValue_numeric": {"$convert": {"input": "$considerationVal", "to": "double", "onError": 0, "onNull": 0}}
                }
            },
            {"$match": match_query},
            # {"$count": "documentsAfterMatch"} # Temporary debug stage
            # Commented out for debugging
            {
                "$group": {
                    "_id": "$dateOfRegistration_date",
                    "dailyConsiderationValues": {"$push": "$considerationValue_numeric"}
                }
            },
            {"$sort": {"_id": 1}}, # Sort by date ascending for time-series
            {
                "$project": {
                    "_id": 0,
                    "date": {"$dateToString": {"format": "%d-%m-%Y", "date": "$_id"}},
                    "sumTop10ConsiderationValue": {
                        "$sum": {
                            "$slice": [
                                {"$sortArray": {"input": "$dailyConsiderationValues", "sortBy": -1}},
                                10
                            ]
                        }
                    }
                }
            }
        ]
        logger.info(f"Match Query for timeseries_top10_sum: {match_query}") # Log the match query
        logger.info(f"Pipeline for timeseries_top10_sum: {pipeline}") # Log the pipeline

        result = list(collection.aggregate(pipeline))

        return {"timeseries_data": result}

    except Exception as e:
        return {"error": str(e)}
    finally:
        if client:
            client.close()




app.mount("/", StaticFiles(directory="frontend/build", html=True), name="static")



