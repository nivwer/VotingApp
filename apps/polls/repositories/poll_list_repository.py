from bson import BSON
from bson.objectid import ObjectId

from pymongo import DESCENDING

from utils.mongo_connection import MongoDBSingleton


class PollListRepository:
    polls_db = MongoDBSingleton().client["polls_db"]

    async def get_user_poll_list(self, id: int, user_id: int) -> list[BSON]:
        polls: list = await self.polls_db.polls.find(
            {
                "user_id": int(id),
                "$or": [
                    {"privacy": "public"},
                    {"privacy": "private", "user_id": user_id},
                ],
            },
            sort=[("created_at", DESCENDING)],
        ).to_list(length=None)

        return polls
