# db.py
import os
from pymongo import MongoClient, ASCENDING
from dotenv import load_dotenv

load_dotenv()
client = MongoClient(os.getenv("MONGODB_URI"))
db = client[os.getenv("MONGO_DB", "exam_modules")]
modules_coll = db[os.getenv("MONGO_COLLECTION", "modules")]


# One doc per department
modules_coll.create_index([("category", ASCENDING)], unique=True)


# from pymongo.mongo_client import MongoClient
# from pymongo.server_api import ServerApi

# uri = "mongodb+srv://lquincypitsi_db_user:QHozskq3m31vopv0@cluster0.ywmyjre.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# # Create a new client and connect to the server
# client = MongoClient(uri, server_api=ServerApi("1"))

# # Send a ping to confirm a successful connection
# try:
#     client.admin.command("ping")
#     print("Pinged your deployment. You successfully connected to MongoDB!")
# except Exception as e:
#     print(e)
