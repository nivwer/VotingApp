# Standard.
import os
# Virtualenv.
from dotenv import load_dotenv
# MongoDB connection.
from pymongo import MongoClient

# Load the virtual environment.
load_dotenv()
# Enviroment variable for MongoDB database.
MONGO_URI = os.getenv('MONGO_URI')

# Get database.
client = MongoClient(MONGO_URI)
db = client['polls_db']


# Check if the index already exists.
if 'text' not in db.polls.index_information():
    # Create index.
    db.polls.create_index([
        ('title', 'text'),
        ('description', 'text'),
        ('category', 'text')
    ])
    print('Index "text" created successfully.')
else:
    print(f'The index "text" already exists. No action was taken.')
