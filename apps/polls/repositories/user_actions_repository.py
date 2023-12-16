from bson import BSON
from bson.objectid import ObjectId

from django.contrib.auth.models import User

from utils.mongo_connection import MongoDBSingleton


class UserActionsRepository:
    polls_db = MongoDBSingleton().client["polls_db"]

    async def get_user_actions(self, id: str, user_id: int) -> BSON | None:
        user_actions: BSON = await self.polls_db.user_actions.find_one(
            {"user_id": user_id, "poll_id": ObjectId(id)},
            projection={"_id": 0, "has_voted": 1, "has_shared": 1, "has_bookmarked": 1},
        )

        return user_actions or None
