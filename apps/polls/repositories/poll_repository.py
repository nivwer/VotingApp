from bson import BSON
from bson.objectid import ObjectId
from rest_framework.exceptions import NotFound
from utils.mongo_connection import MongoDBSingleton


class PollRepository:
    polls_db = MongoDBSingleton().client["polls_db"]

    async def create(self, data: dict) -> ObjectId | None:
        result = await self.polls_db.polls.insert_one(data)
        return result.inserted_id

    async def get_by_id(self, id: str, raise_exception: bool = True) -> BSON | None:
        poll: BSON = await self.polls_db.polls.find_one({"_id": ObjectId(id)})

        if not poll:
            if raise_exception:
                raise NotFound(detail={"message": "Poll not found"})
            return None

        return poll

    async def update(self, id: str, data: dict, add_options: list, del_options: list):
        async with await MongoDBSingleton().client.start_session() as session:
            async with session.start_transaction():
                # Update poll document in polls collection.
                await self.polls_db.polls.update_one(
                    {"_id": ObjectId(id)},
                    {"$set": data},
                    session=session,
                )

                # Add options.
                if add_options:
                    await self.polls_db.polls.update_one(
                        {"_id": ObjectId(id)},
                        {"$addToSet": {"options": {"$each": add_options}}},
                        session=session,
                    )

                # Remove options.
                if del_options:
                    await self.polls_db.polls.update_one(
                        {"_id": ObjectId(id)},
                        {"$pull": {"options": {"option_text": {"$in": del_options}}}},
                        session=session,
                    )

                # Save transaction.
                await session.commit_transaction()
                await session.end_session()

        return ObjectId(id)

    async def delete(self, id: str, poll: dict):
        async with await MongoDBSingleton().client.start_session() as session:
            async with session.start_transaction():
                # Remove the poll document in the polls collection.
                await self.polls_db.polls.delete_one(
                    {"_id": ObjectId(id)},
                    session=session,
                )

                # Remove the comment documents of the poll in the comments collection.
                if poll["comments_counter"] > 0:
                    await self.polls_db.comments.delete_many(
                        {"poll_id": ObjectId(id)},
                        session=session,
                    )

                # Save transaction.
                await session.commit_transaction()
                await session.end_session()

        return ObjectId(id)
