from bson import BSON
from bson.objectid import ObjectId

from pymongo import DESCENDING

from utils.mongo_connection import MongoDBSingleton


class PollCommentListRepository:
    polls_db = MongoDBSingleton().client["polls_db"]

    async def get_by_poll_id(self, id: str):
        comments: list[BSON] = await self.polls_db.comments.find(
            {"poll_id": ObjectId(id)},
            sort=[("created_at", DESCENDING)],
        ).to_list(length=None)

        return comments
