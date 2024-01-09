import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import errors

# environment
load_dotenv()


class MongoDBSingleton:
    """
    Singleton class for managing a single MongoDB connection instance.

    This class ensures that only one instance of the MongoDB connection is created and
    provides a centralized point for accessing the connection throughout the application.

    Usage:
    ```
    mongo_singleton = MongoDBSingleton()
    mongo_client = mongo_singleton.client
    ```

    Note: The MongoDB connection URI is expected to be provided as an environment variable 'MONGO_URI'.
    """

    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialize_connection()
        return cls._instance

    def _initialize_connection(self):
        MONGO_URI: str = os.getenv("MONGO_URI")

        try:
            self.client = AsyncIOMotorClient(MONGO_URI)
            message: str = "MongoDB connection successful..."
            print(f"{message}")

        except errors.ServerSelectionTimeoutError as e:
            message: str = "MongoDB server selection timeout error: "
            print(f"{message}{e}")

        except errors.ConnectionFailure as e:
            message: str = "MongoDB connection error: "
            print(f"{message}{e}")

        except errors.InvalidURI as e:
            message: str = "MongoDB Invalid URI error: "
            print(f"{message}{e}")

        except errors.ConfigurationError as e:
            message: str = "MongoDB configuration error: "
            print(f"{message}{e}")
