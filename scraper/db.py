# db.py
import os
from pymongo import MongoClient, ASCENDING
from dotenv import load_dotenv

load_dotenv()
client = MongoClient(os.getenv("MONGODB_URI"))
db = client[os.getenv("MONGO_DB", "uni_scheduler")]
modules_coll = db[os.getenv("MONGO_COLLECTION", "rhodes_modules_timetable")]


modules_coll.create_index([("category", ASCENDING)])
