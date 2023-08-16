# MongoDB connection using Singleton.
from utils.mongo_connection import MongoDBSingleton

# MongoDB Middleware.
class MongoDBMiddleware:
    def __init__(self, get_res):
        self.get_res = get_res
        self.mongo_conn = MongoDBSingleton()

    def __call__(self, request):
        res = self.get_res(request)
        return res