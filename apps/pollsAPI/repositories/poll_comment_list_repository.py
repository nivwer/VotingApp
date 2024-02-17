from bson import BSON
from bson.objectid import ObjectId

from pymongo import DESCENDING

from mdb_singleton import MongoDBSingletonAsync


class PollCommentListRepository:
    client = MongoDBSingletonAsync().client
    polls_db = client["polls_db"]

    async def get_by_poll_id(self, id: str):
        comments: list[BSON] = await self.polls_db.comments.find(
            {"poll_id": ObjectId(id)},
            sort=[("created_at", DESCENDING)],
        ).to_list(length=None)

        return comments
