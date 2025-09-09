
import os
from pymongo import MongoClient
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from typing import Optional
import logging
from starlette.staticfiles import StaticFiles

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
                    "sroName": "$sroName", # Directly using sroName from market-value-processed
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
            sro_list = [code.strip() for code in sroCode.split(',') if code.strip()]
            if len(sro_list) == 1:
                match_query["sroCode"] = sro_list[0]
            elif len(sro_list) > 1:
                match_query["sroCode"] = {"$in": sro_list}

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
                    "totalAreaSold": {"$sum": "$extent_numeric"},
                    "sumPricePerExtent": {"$sum": "$pricePerExtent"}
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "totalTransactions": "$totalTransactions",
                    "totalMarketValue": "$totalMarketValue",
                    "totalAreaSold": "$totalAreaSold",
                    "averagePropertySize": {
                        "$cond": {
                            "if": {"$ne": ["$totalTransactions", 0]},
                            "then": {"$divide": ["$totalAreaSold", "$totalTransactions"]},
                            "else": 0
                        }
                    },
                    "averagePricePerExtent": {
                        "$cond": {
                            "if": {"$ne": ["$totalAreaSold", 0]},
                            "then": {"$divide": ["$totalMarketValue", "$totalAreaSold"]},
                            "else": 0
                        }
                    }
                }
            }
        ]

        # Get current period data
        current_result = list(collection.aggregate(pipeline))
        current_data = current_result[0] if current_result else {
            "totalTransactions": 0,
            "totalMarketValue": 0,
            "totalAreaSold": 0,
            "averagePropertySize": 0,
            "averagePricePerExtent": 0
        }

        # Calculate previous period dates
        period_length = (end_date_obj - start_date_obj).days + 1
        previous_end_date = start_date_obj - timedelta(days=1)
        previous_start_date = previous_end_date - timedelta(days=period_length - 1)

        # Build previous period match query
        previous_match_query = {
            "dateOfRegistration_date": {
                "$gte": previous_start_date,
                "$lte": previous_end_date
            }
        }
        if sroCode:
            sro_list = [code.strip() for code in sroCode.split(',') if code.strip()]
            if len(sro_list) == 1:
                previous_match_query["sroCode"] = sro_list[0]
            elif len(sro_list) > 1:
                previous_match_query["sroCode"] = {"$in": sro_list}

        # Get previous period data
        previous_pipeline = [
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
            {"$match": previous_match_query},
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
                    "_id": None,
                    "totalTransactions": {"$sum": 1},
                    "totalMarketValue": {"$sum": "$considerationVal_numeric"},
                    "totalAreaSold": {"$sum": "$extent_numeric"},
                    "sumPricePerExtent": {"$sum": "$pricePerExtent"}
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "totalTransactions": "$totalTransactions",
                    "totalMarketValue": "$totalMarketValue",
                    "totalAreaSold": "$totalAreaSold",
                    "averagePropertySize": {
                        "$cond": {
                            "if": {"$ne": ["$totalTransactions", 0]},
                            "then": {"$divide": ["$totalAreaSold", "$totalTransactions"]},
                            "else": 0
                        }
                    },
                    "averagePricePerExtent": {
                        "$cond": {
                            "if": {"$ne": ["$totalAreaSold", 0]},
                            "then": {"$divide": ["$totalMarketValue", "$totalAreaSold"]},
                            "else": 0
                        }
                    }
                }
            }
        ]

        previous_result = list(collection.aggregate(previous_pipeline))
        previous_data = previous_result[0] if previous_result else {
            "totalTransactions": 0,
            "totalMarketValue": 0,
            "totalAreaSold": 0,
            "averagePropertySize": 0,
            "averagePricePerExtent": 0
        }

        # Calculate comparisons
        def calculate_comparison(current, previous, is_higher_better=True):
            if previous == 0:
                return 0
            diff = current - previous
            if is_higher_better:
                return diff
            else:
                return -diff  # For price, lower is better

        return {
            **current_data,
            "previousPeriod": {
                "totalTransactions": previous_data["totalTransactions"],
                "totalAreaSold": previous_data["totalAreaSold"],
                "averagePropertySize": previous_data["averagePropertySize"],
                "averagePricePerExtent": previous_data["averagePricePerExtent"]
            },
            "comparisons": {
                "transactionsChange": calculate_comparison(current_data["totalTransactions"], previous_data["totalTransactions"], True),
                "areaChange": calculate_comparison(current_data["totalAreaSold"], previous_data["totalAreaSold"], True),
                "propertySizeChange": calculate_comparison(current_data["averagePropertySize"], previous_data["averagePropertySize"], True),
                "priceChange": calculate_comparison(current_data["averagePricePerExtent"], previous_data["averagePricePerExtent"], False)
            }
        }

    except Exception as e:
        return {"error": str(e)}
    finally:
        if client:
            client.close()


@app.get("/market/value/transactions_by_date")
async def get_transactions_by_date(
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
            sro_list = [code.strip() for code in sroCode.split(',') if code.strip()]
            if len(sro_list) == 1:
                match_query["sroCode"] = sro_list[0]
            elif len(sro_list) > 1:
                match_query["sroCode"] = {"$in": sro_list}

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
                "$group": {
                    "_id": "$dateOfRegistration_date",
                    "totalTransactions": {"$sum": 1}
                }
            },
            {"$sort": {"_id": 1}},
            {
                "$project": {
                    "_id": 0,
                    "date": {"$dateToString": {"format": "%d-%m-%Y", "date": "$_id"}},
                    "totalTransactions": 1
                }
            }
        ]

        logger.info(f"Match Query for transactions_by_date: {match_query}")
        logger.info(f"Pipeline for transactions_by_date: {pipeline}")

        result = list(collection.aggregate(pipeline))
        return {"transactions_by_date": result}

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
            sro_list = [code.strip() for code in sroCode.split(',') if code.strip()]
            if len(sro_list) == 1:
                match_query["sroCode"] = sro_list[0]
            elif len(sro_list) > 1:
                match_query["sroCode"] = {"$in": sro_list}

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
                    "sroName": "$sroName", # Directly using sroName from market-value-processed
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
            sro_list = [code.strip() for code in sroCode.split(',') if code.strip()]
            if len(sro_list) == 1:
                match_query["sroCode"] = sro_list[0]
            elif len(sro_list) > 1:
                match_query["sroCode"] = {"$in": sro_list}

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


@app.get("/market/value/price_per_extent_timeseries")
async def get_price_per_extent_timeseries(
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
            sro_list = [code.strip() for code in sroCode.split(',') if code.strip()]
            if len(sro_list) == 1:
                match_query["sroCode"] = sro_list[0]
            elif len(sro_list) > 1:
                match_query["sroCode"] = {"$in": sro_list}

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
                "$match": {
                    "pricePerExtent": {"$gt": 0}  # Only include transactions with valid price per extent
                }
            },
            {
                "$group": {
                    "_id": "$dateOfRegistration_date",
                    "avgPricePerExtent": {"$avg": "$pricePerExtent"},
                    "totalTransactions": {"$sum": 1},
                    "totalValue": {"$sum": "$considerationVal_numeric"}
                }
            },
            {"$sort": {"_id": 1}},
            {
                "$project": {
                    "_id": 0,
                    "date": {"$dateToString": {"format": "%d-%m-%Y", "date": "$_id"}},
                    "avgPricePerExtent": 1,
                    "totalTransactions": 1,
                    "totalValue": 1
                }
            }
        ]

        result = list(collection.aggregate(pipeline))
        return {"timeseries_data": result}

    except Exception as e:
        return {"error": str(e)}
    finally:
        if client:
            client.close()


@app.get("/market/value/daily-intelligence")
async def get_daily_market_intelligence():
    load_dotenv()
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
    database_name = os.getenv("MONGO_DB_NAME", "mydatabase")

    client = None
    try:
        client = MongoClient(mongo_uri)
        db = client[database_name]
        collection = db["market-value-processed"]

        # Find the most recent date with data in the database
        pipeline_find_date = [
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
                    "maxDate": {"$max": "$dateOfRegistration_date"}
                }
            }
        ]
        
        date_result = list(collection.aggregate(pipeline_find_date))
        if not date_result or not date_result[0]["maxDate"]:
            return {"error": "No data found in database"}
        
        target_date = date_result[0]["maxDate"]

        start_of_day = target_date.replace(hour=0, minute=0, second=0, microsecond=0)
        end_of_day = target_date.replace(hour=23, minute=59, second=59, microsecond=999999)

        # Pipeline to get all required metrics for the target day
        pipeline = [
            {
                "$addFields": {
                    "dateOfRegistration_date": {
                        "$dateFromString": {
                            "dateString": "$dateOfRegistration",
                            "format": "%d-%m-%Y"
                        }
                    },
                    "considerationVal_numeric": {"$convert": {"input": "$considerationVal", "to": "double", "onError": 0, "onNull": 0}},
                    "extent_numeric": {"$convert": {"input": "$extent", "to": "double", "onError": 0, "onNull": 0}}
                }
            },
            {"$match": {"dateOfRegistration_date": {"$gte": start_of_day, "$lte": end_of_day}}},
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
                    "_id": None,
                    "totalTransactions": {"$sum": 1},
                    "allTransactions": {
                        "$push": {
                            "considerationVal": "$considerationVal_numeric",
                            "pricePerExtent": "$pricePerExtent",
                            "sroName": "$sroName",
                            "extent": "$extent_numeric"
                        }
                    },
                    "largestAreaSold": {
                        "$max": {
                            "extent": "$extent_numeric",
                            "sroName": "$sroName"
                        }
                    },
                    "regionStats": {
                        "$push": {
                            "sroName": "$sroName",
                            "sroCode": "$sroCode"
                        }
                    }
                }
            }
        ]

        result = list(collection.aggregate(pipeline))
        
        if not result:
            return {"error": "No data found for the target date"}

        data = result[0]
        
        # Find most active region
        region_counts = {}
        for region in data["regionStats"]:
            sro_name = region["sroName"]
            region_counts[sro_name] = region_counts.get(sro_name, 0) + 1
        
        most_active_region = max(region_counts.items(), key=lambda x: x[1]) if region_counts else ("N/A", 0)
        
        # Find costliest and most affordable transactions (filter out 0 values)
        valid_transactions = [t for t in data["allTransactions"] if t["pricePerExtent"] > 0 and t["considerationVal"] > 0]
        
        if valid_transactions:
            costliest = max(valid_transactions, key=lambda x: x["pricePerExtent"])
            most_affordable = min(valid_transactions, key=lambda x: x["pricePerExtent"])
        else:
            # Fallback to consideration value if no valid price per extent
            valid_by_value = [t for t in data["allTransactions"] if t["considerationVal"] > 0]
            if valid_by_value:
                costliest = max(valid_by_value, key=lambda x: x["considerationVal"])
                most_affordable = min(valid_by_value, key=lambda x: x["considerationVal"])
            else:
                costliest = {"sroName": "N/A", "pricePerExtent": 0, "considerationVal": 0}
                most_affordable = {"sroName": "N/A", "pricePerExtent": 0, "considerationVal": 0}

        # Format the response
        response = {
            "date": target_date.strftime("%d-%m-%Y"),
            "costliestTransaction": {
                "region": costliest["sroName"],
                "pricePerSqYd": costliest["pricePerExtent"],
                "totalPrice": costliest["considerationVal"]
            },
            "mostAffordableTransaction": {
                "region": most_affordable["sroName"],
                "pricePerSqYd": most_affordable["pricePerExtent"],
                "totalPrice": most_affordable["considerationVal"]
            },
            "mostActiveRegion": {
                "region": most_active_region[0],
                "transactionCount": most_active_region[1]
            },
            "totalTransactionsToday": data["totalTransactions"],
            "largestAreaSold": {
                "region": data["largestAreaSold"]["sroName"],
                "areaSqYd": data["largestAreaSold"]["extent"]
            }
        }

        return response

    except Exception as e:
        return {"error": str(e)}
    finally:
        if client:
            client.close()


@app.get("/market/sro_codes")
async def get_sro_codes():
    load_dotenv()
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
    database_name = os.getenv("MONGO_DB_NAME", "mydatabase")

    client = None
    try:
        client = MongoClient(mongo_uri)
        db = client[database_name]
        collection = db["market-value-processed"]

        pipeline = [
            {"$group": {"_id": {"sroCode": "$sroCode", "sroName": "$sroName"}}},
            {"$project": {"_id": 0, "sroCode": "$_id.sroCode", "sroName": "$_id.sroName"}},
            {"$sort": {"sroName": 1}} # Sort by sroName for readability
        ]


        sro_codes = list(collection.aggregate(pipeline))
        return {"sro_codes": sro_codes}
    except Exception as e:
        return {"error": str(e)}
    finally:
        if client:
            client.close()

# Static files are served by Vercel (frontend deployment)
# app.mount("/", StaticFiles(directory="frontend/build", html=True), name="static")

@app.get("/market/value/summary/by-sro")
async def get_summary_by_sro(
    startDate: Optional[str] = None,
    endDate: Optional[str] = None,
):
    """
    Returns per-SRO summary in a single call for the given date range:
    - sroCode, sroName
    - totalTransactions
    - totalConsideration
    - totalArea
    - averagePricePerExtent = totalConsideration / totalArea (0 if area==0)
    """
    load_dotenv()
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
    database_name = os.getenv("MONGO_DB_NAME", "mydatabase")

    client = None
    try:
        client = MongoClient(mongo_uri)
        db = client[database_name]
        collection = db["market-value-processed"]

        # Date range handling (default last 30 days)
        today = datetime.now()
        if not startDate or not endDate:
            end_date_obj = today.replace(hour=23, minute=59, second=59, microsecond=999999)
            start_date_obj = (today - timedelta(days=30)).replace(hour=0, minute=0, second=0, microsecond=0)
        else:
            start_date_obj = datetime.strptime(startDate, "%d-%m-%Y").replace(hour=0, minute=0, second=0, microsecond=0)
            end_date_obj = datetime.strptime(endDate, "%d-%m-%Y").replace(hour=23, minute=59, second=59, microsecond=999999)

        match_query = {
            "dateOfRegistration_date": {
                "$gte": start_date_obj,
                "$lte": end_date_obj,
            }
        }

        pipeline = [
            {
                "$addFields": {
                    "dateOfRegistration_date": {
                        "$cond": [
                            {"$ifNull": ["$dateOfRegistration_date", False]},
                            "$dateOfRegistration_date",
                            {"$dateFromString": {"dateString": "$dateOfRegistration", "format": "%d-%m-%Y"}},
                        ]
                    },
                    "considerationValue_numeric": {
                        "$convert": {"input": "$considerationVal", "to": "double", "onError": 0, "onNull": 0}
                    },
                    "extent_numeric": {
                        "$convert": {"input": "$extent", "to": "double", "onError": 0, "onNull": 0}
                    },
                }
            },
            {"$match": match_query},
            {
                "$group": {
                    "_id": {"sroCode": "$sroCode", "sroName": "$sroName"},
                    "totalTransactions": {"$sum": 1},
                    "totalConsideration": {"$sum": "$considerationValue_numeric"},
                    "totalArea": {"$sum": "$extent_numeric"},
                }
            },
            {
                "$addFields": {
                    "averagePricePerExtent": {
                        "$cond": [
                            {"$gt": ["$totalArea", 0]},
                            {"$divide": ["$totalConsideration", "$totalArea"]},
                            0,
                        ]
                    }
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "sroCode": "$_id.sroCode",
                    "sroName": "$_id.sroName",
                    "totalTransactions": 1,
                    "totalConsideration": 1,
                    "totalArea": 1,
                    "averagePricePerExtent": 1,
                }
            },
            {"$sort": {"averagePricePerExtent": -1}},
        ]

        data = list(collection.aggregate(pipeline))
        return {"startDate": startDate, "endDate": endDate, "regions": data}

    except Exception as e:
        return {"error": str(e)}
    finally:
        if client:
            client.close()



