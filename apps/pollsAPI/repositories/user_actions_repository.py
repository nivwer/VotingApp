from datetime import datetime

from bson import BSON
from bson.objectid import ObjectId

from pymongo import UpdateOne

from mdb_singleton import MongoDBSingletonAsync


class UserActionsRepository:
    """
    Repository for managing user actions related to polls.

    This class provides methods to interact with the 'user_actions' collection in the database,
    allowing for the retrieval and storage of user-specific actions such as voting, sharing, and bookmarking.
    """

    client = MongoDBSingletonAsync().client
    polls_db = client["polls_db"]

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
        async with await self.client.start_session() as session:
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
        async with await self.client.start_session() as session:
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
        async with await self.client.start_session() as session:
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

    async def share(self, id: str, user_id: int):
        async with await self.client.start_session() as session:
            async with session.start_transaction():
                # Update share action if user actions document exist.
                await self.polls_db.user_actions.update_one(
                    {"user_id": user_id, "poll_id": ObjectId(id)},
                    {"$set": {"has_shared": {"shared_at": datetime.now()}}},
                    upsert=True,
                    session=session,
                )

                # Add count to shared counter in the poll document.
                await self.polls_db.polls.update_one(
                    {"_id": ObjectId(id)},
                    {"$inc": {"shares_counter": 1}},
                    session=session,
                )

                await session.commit_transaction()
            await session.end_session()
        return ObjectId(id)

    async def unshare(self, id: str, user_id: int):
        async with await self.client.start_session() as session:
            async with session.start_transaction():
                # Remove share action if user actions document exist.
                await self.polls_db.user_actions.update_one(
                    {"user_id": user_id, "poll_id": ObjectId(id)},
                    {"$unset": {"has_shared": ""}},
                    session=session,
                )

                # Remove count to shared counter in the poll document.
                await self.polls_db.polls.update_one(
                    {"_id": ObjectId(id)},
                    {"$inc": {"shares_counter": -1}},
                    session=session,
                )

                await session.commit_transaction()
            await session.end_session()
        return ObjectId(id)

    async def bookmark(self, id: str, user_id: int):
        async with await self.client.start_session() as session:
            async with session.start_transaction():
                # Update bookmark action if user actions document exist.
                await self.polls_db.user_actions.update_one(
                    {"user_id": user_id, "poll_id": ObjectId(id)},
                    {"$set": {"has_bookmarked": {"bookmarked_at": datetime.now()}}},
                    upsert=True,
                    session=session,
                )

                # Add count to bookmarked counter in the poll document.
                await self.polls_db.polls.update_one(
                    {"_id": ObjectId(id)},
                    {"$inc": {"bookmarks_counter": 1}},
                    session=session,
                )

                await session.commit_transaction()
            await session.end_session()
        return ObjectId(id)

    async def unbookmark(self, id: str, user_id: int):
        async with await self.client.start_session() as session:
            async with session.start_transaction():
                # Remove bookmark action if user actions document exist.
                await self.polls_db.user_actions.update_one(
                    {"user_id": user_id, "poll_id": ObjectId(id)},
                    {"$unset": {"has_bookmarked": ""}},
                    session=session,
                )

                # Remove count to bookmarked counter in the poll document.
                await self.polls_db.polls.update_one(
                    {"_id": ObjectId(id)},
                    {"$inc": {"bookmarks_counter": -1}},
                    session=session,
                )

                await session.commit_transaction()
            await session.end_session()
        return ObjectId(id)
