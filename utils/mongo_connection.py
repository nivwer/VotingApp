# Standard.
import os
from datetime import datetime
# Virtualenv.
from dotenv import load_dotenv
# MongoDB.
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import errors

# Load the virtual environment.
load_dotenv()


# MongoDB connection using Singleton.
class MongoDBSingleton:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialize_connection()
        return cls._instance

    # Initialize the connection to the MongoDB databases.
    def _initialize_connection(self):
        # Enviroment variable for MongoDB database.
        MONGO_URI = os.getenv('MONGO_URI')

        # Try to connect to the MongoDB databases.
        try:
            self.client = AsyncIOMotorClient(MONGO_URI)

            # If the connection is successful.
            print(f'{self._get_current_timestamp()} "MongoDB connection successful"')

        # Handle MongoDB server selection timeout error.
        except errors.ServerSelectionTimeoutError as e:
            print(f'{self._get_current_timestamp()} MongoDB server selection timeout error: {e}')

        # Handle MongoDB connection error.
        except errors.ConnectionFailure as e:
            print(f'{self._get_current_timestamp()} MongoDB connection error: {e}')

        # Handle MongoDB invalid URI error.
        except errors.InvalidURI as e:
            print(f'{self._get_current_timestamp()} MongoDB Invalid URI error: {e}')

        # Handle MongoDB configuration error.
        except errors.ConfigurationError as e:
            print(f'{self._get_current_timestamp()} MongoDB configuration error: {e}')

    def _get_current_timestamp(self):
        return datetime.now().strftime("[%d/%b/%Y %H:%M:%S]")
