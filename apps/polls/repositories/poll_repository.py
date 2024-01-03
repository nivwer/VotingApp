from bson import BSON
from bson.objectid import ObjectId

from rest_framework.exceptions import NotFound

from pymongo import DESCENDING

from utils.mongo_connection import MongoDBSingleton


class PollRepository:
    """
    A repository class for managing polls in the database.

    This class provides methods to interact with the 'polls_db' MongoDB collection,
    allowing the application to fetch, create, update, and delete poll data.
    """

    polls_db = MongoDBSingleton().client["polls_db"]

    async def create(self, data: dict) -> ObjectId | None:
        """
        Creates a new poll.
        """
        result = await self.polls_db.polls.insert_one(data)
        return result.inserted_id

    async def get_by_id(self, id: str, raise_exception: bool = True) -> BSON | None:
        """
        Retrieves a poll based on its ID.
        """
        poll: BSON = await self.polls_db.polls.find_one({"_id": ObjectId(id)})

        if not poll:
            if raise_exception:
                raise NotFound(detail={"message": "Poll not found"})
            return None

        return poll

    async def update(self, id: str, data: dict, add_options: list, del_options: list):
        """
        Updates a poll.

        Args
            id (str): The ID of the poll to update.
            data (dict): A dictionary containing the data to update in the poll.
            add_options (list): A list of options (objects) to add to the poll.
            del_options (list): A list of option texts to remove from the poll.

        Option object example: { user_id: int, option_text: str, votes: 0 }
        """
        async with await MongoDBSingleton().client.start_session() as session:
            async with session.start_transaction():
                # Update poll document in polls collection.
                await self.polls_db.polls.update_one(
                    {"_id": ObjectId(id)},
                    {"$set": data},
                    session=session,
                )

                # Add options in the poll document.
                if add_options:
                    await self.polls_db.polls.update_one(
                        {"_id": ObjectId(id)},
                        {"$addToSet": {"options": {"$each": add_options}}},
                        session=session,
                    )

                # Remove options from the poll document.
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
        """
        Deletes a poll and its associated comments.
        """
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

    async def add_option(self, id: str, option: dict):
        # Add the option in the poll document.
        await self.polls_db.polls.update_one({"_id": ObjectId(id)}, {"$push": {"options": option}})

        return ObjectId(id)

    async def del_option(self, id: str, option: str):
        # Remove the option from the poll document.
        await self.polls_db.polls.update_one(
            {"_id": ObjectId(id)},
            {"$pull": {"options": {"option_text": option}}},
        )

        return ObjectId(id)

    async def get_user_poll_list(self, id: int, user_id: int) -> list[BSON]:
        polls: list = await self.polls_db.polls.find(
            {
                "user_id": id,
                "$or": [
                    {"privacy": "public"},
                    {"privacy": "private", "user_id": user_id},
                ],
            },
            sort=[("created_at", DESCENDING)],
        ).to_list(length=None)

        return polls
