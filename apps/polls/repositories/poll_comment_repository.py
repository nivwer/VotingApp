from datetime import datetime

from bson import BSON
from bson.objectid import ObjectId

from rest_framework.exceptions import NotFound

from utils.mongo_connection import MongoDBSingleton


class PollCommentRepository:
    polls_db = MongoDBSingleton().client["polls_db"]

    async def create(self, poll_id: str, user_id: int, comment: str):
        """
        Creates a new poll comment.
        """
        async with await MongoDBSingleton().client.start_session() as session:
            async with session.start_transaction():
                # Add the comment document in comments collection.
                result: BSON = await self.polls_db.comments.insert_one(
                    {
                        "user_id": user_id,
                        "comment": comment,
                        "created_at": datetime.now(),
                        "poll_id": ObjectId(poll_id),
                    },
                    session=session,
                )

                # Add count to comment counter in the poll document.
                await self.polls_db.polls.update_one(
                    {"_id": ObjectId(poll_id)},
                    {"$inc": {"comments_counter": 1}},
                    session=session,
                )

                await session.commit_transaction()
            await session.end_session()

        object_id: ObjectId = result.inserted_id
        return object_id

    async def get_by_id(self, id: str, raise_exception: bool = True) -> BSON | None:
        """
        Retrieves a poll comment based on its ID.
        """
        comment: BSON = await self.polls_db.comments.find_one({"_id": ObjectId(id)})

        if not comment:
            if raise_exception:
                message: str = "Comment not found"
                raise NotFound(detail={"message": message})
            return None

        return comment

    async def update(self, id: str, comment: str):
        await self.polls_db.comments.update_one(
            {"_id": ObjectId(id)},
            {"$set": {"comment": comment}},
        )

        return ObjectId(id)

    async def delete(self, id: str, poll_id: str):
        async with await MongoDBSingleton().client.start_session() as session:
            async with session.start_transaction():
                # Remove the comment document in comments collection.
                await self.polls_db.comments.delete_one(
                    {"_id": ObjectId(id)},
                    session=session,
                )

                # Remove count to comment counter in the poll document.
                await self.polls_db.polls.update_one(
                    {"_id": ObjectId(poll_id)},
                    {"$inc": {"comments_counter": -1}},
                    session=session,
                )

                await session.commit_transaction()
            await session.end_session()
        return ObjectId(id)
