from datetime import datetime

from bson import BSON
from bson.objectid import ObjectId

from pymongo import UpdateOne

from utils.mongo_connection import MongoDBSingleton


class UserActionsRepository:
    """
    Repository for managing user actions related to polls.

    This class provides methods to interact with the 'user_actions' collection in the database,
    allowing for the retrieval and storage of user-specific actions such as voting, sharing, and bookmarking.
    """

    polls_db = MongoDBSingleton().client["polls_db"]

    async def get_user_actions(self, id: str, user_id: int, projection: dict = {"_id": 1}):
        """
        Retrieves user-specific actions related to a poll.

        Args:
            id (str): The ID of the poll.
            user_id (int): The ID of the user for whom to retrieve actions.
        """

        user_actions: BSON = await self.polls_db.user_actions.find_one(
            {"user_id": user_id, "poll_id": ObjectId(id)},
            projection=projection,
        )

        return user_actions or None

    async def create(self, id: str, user_id: int):
        await self.polls_db.user_actions.insert_one(
            {"poll_id": ObjectId(id), "user_id": user_id},
        )

        return ObjectId(id)

    async def insert_vote(self, id: str, user_id: int, vote: str):
        async with await MongoDBSingleton().client.start_session() as session:
            async with session.start_transaction():
                # Update vote action if user actions document exist.
                await self.polls_db.user_actions.update_one(
                    {"user_id": user_id, "poll_id": ObjectId(id)},
                    {"$set": {"has_voted": {"vote": vote, "voted_at": datetime.now()}}},
                    upsert=True,
                    session=session,
                )

                await self.polls_db.polls.bulk_write(
                    [
                        # Add user ID to voters list in the poll document.
                        UpdateOne(
                            {"_id": ObjectId(id)},
                            {"$push": {"voters": user_id}, "$inc": {"votes_counter": 1}},
                        ),
                        # Add count to voted counter in the poll document.
                        UpdateOne(
                            {"_id": ObjectId(id), "options.option_text": vote},
                            {"$inc": {"options.$.votes": 1}},
                        ),
                    ],
                    session=session,
                )

                await session.commit_transaction()
            await session.end_session()
        return ObjectId(id)

    async def update_vote(self, id: str, user_id: int, vote: str, del_vote: str):
        async with await MongoDBSingleton().client.start_session() as session:
            async with session.start_transaction():
                await self.polls_db.user_actions.update_one(
                    {"user_id": user_id, "poll_id": ObjectId(id)},
                    {"$set": {"has_voted": {"vote": vote, "voted_at": datetime.now()}}},
                    session=session,
                )

                await self.polls_db.polls.bulk_write(
                    [
                        # Remove the previous vote in poll document.
                        UpdateOne(
                            {"_id": ObjectId(id), "options.option_text": del_vote},
                            {"$inc": {"options.$.votes": -1}},
                        ),
                        # Add the new vote in poll document.
                        UpdateOne(
                            {"_id": ObjectId(id), "options.option_text": vote},
                            {"$inc": {"options.$.votes": 1}},
                        ),
                    ],
                    session=session,
                )

                await session.commit_transaction()
            await session.end_session()
        return ObjectId(id)

    async def delete_vote(self, id: str, user_id: int, del_vote: str):
        async with await MongoDBSingleton().client.start_session() as session:
            async with session.start_transaction():
                # Remove vote action if user actions document exist.
                await self.polls_db.user_actions.update_one(
                    {"user_id": user_id, "poll_id": ObjectId(id)},
                    {"$unset": {"has_voted": ""}},
                    session=session,
                )

                await self.polls_db.polls.bulk_write(
                    [
                        # Remove user ID to voters list in the poll document.
                        UpdateOne(
                            {"_id": ObjectId(id)},
                            {"$pull": {"voters": user_id}, "$inc": {"votes_counter": -1}},
                        ),
                        # Remove the previous vote in poll document.
                        UpdateOne(
                            {"_id": ObjectId(id), "options.option_text": del_vote},
                            {"$inc": {"options.$.votes": -1}},
                        ),
                    ],
                    session=session,
                )
                await session.commit_transaction()
            await session.end_session()
        return ObjectId(id)
    
    
    ## ??????????

    async def get_user_id_list(self):
        poll_id_list: list[BSON] = await self.polls_db.user_actions.find(
            {},
            {"_id": 0, "poll_id": 1},
        ).to_list(None)

        user_id_list: list[BSON] = await self.polls_db.user_actions.aggregate(
            [
                {"$match": {"poll_id": {"$in": [x["poll_id"] for x in poll_id_list]}}},
                {"$group": {"_id": "$user_id"}},
            ]
        ).to_list(None)

        return user_id_list
