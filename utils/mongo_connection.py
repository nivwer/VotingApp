import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import errors

load_dotenv()


class MongoDBSingleton:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialize_connection()
        return cls._instance

    def _initialize_connection(self):
        MONGO_URI = os.getenv("MONGO_URI")

        try:
            self.client = AsyncIOMotorClient(MONGO_URI)

            print('"MongoDB connection successful..."')

        except errors.ServerSelectionTimeoutError as e:
            print(
                f"{self._get_current_timestamp()} MongoDB server selection timeout error: {e}"
            )

        except errors.ConnectionFailure as e:
            print(f"{self._get_current_timestamp()} MongoDB connection error: {e}")

        except errors.InvalidURI as e:
            print(f"{self._get_current_timestamp()} MongoDB Invalid URI error: {e}")

        except errors.ConfigurationError as e:
            print(f"{self._get_current_timestamp()} MongoDB configuration error: {e}")
