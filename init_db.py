import os
from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.database import Database

load_dotenv()

MONGO_URI: str = os.getenv("MONGO_URI")
client: MongoClient = MongoClient(MONGO_URI)
polls_db: Database = client["polls_db"]


def create_collection():
    if "polls" not in polls_db.list_collection_names():
        polls_db.create_collection(name="polls")

    if "comments" not in polls_db.list_collection_names():
        polls_db.create_collection(name="comments")

    if "user_actions" not in polls_db.list_collection_names():
        polls_db.create_collection(name="user_actions")


def create_index_text():
    before_indexes = polls_db.polls.index_information()
    print("Índices existentes:", before_indexes)

    clave_text_index = "title_text_description_text_category_text"
    text_index_exists = clave_text_index in before_indexes

    if not text_index_exists:
        polls_db.polls.create_index(
            [("title", "text"), ("description", "text"), ("category", "text")]
        )
        print("Text index created successfully.")


create_collection()
create_index_text()
