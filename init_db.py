# Standard.
import os
# Virtualenv.
from dotenv import load_dotenv
# MongoDB connection.
from pymongo import MongoClient

# Load the virtual environment.
load_dotenv()
# Environment variable for MongoDB database.
MONGO_URI = os.getenv('MONGO_URI')

# Get database.
client = MongoClient(MONGO_URI)
db = client['polls_db']


def create_index_text():
    # Retrieve the list of indexes before creating the new index.
    before_indexes = db.polls.index_information()
    # Check if exist.
    text_index_exists = before_indexes['title_text_description_text_category_text']

    if not text_index_exists:
        # Create index.
        db.polls.create_index([
            ('title', 'text'),
            ('description', 'text'),
            ('category', 'text')
        ])
        print('Text index created successfully.')
    else:
        print('The text index already exists. No action was taken.')


create_index_text()
