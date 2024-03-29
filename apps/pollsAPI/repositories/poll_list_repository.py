from bson import BSON

from pymongo import DESCENDING

from mdb_singleton import MongoDBSingletonAsync


class PollListRepository:
    client = MongoDBSingletonAsync().client
    polls_db = client["polls_db"]

    async def get_all(self):
        polls: list = await self.polls_db.polls.find(
            {"privacy": "public"},
            sort=[("created_at", DESCENDING)],
        ).to_list(None)

        return polls

    async def get_by_keyword(self, keyword: str, user_id: int) -> list[BSON]:
        polls: list = await self.polls_db.polls.find(
            {
                "$text": {"$search": keyword},
                "$or": [{"privacy": "public"}, {"privacy": "private", "user_id": user_id}],
            },
            sort=[("votes", DESCENDING)],
        ).to_list(None)

        return polls

    async def get_by_user_id(self, id: int, user_id: int) -> list[BSON]:
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

    async def get_by_user_votes(self, id: int, user_id: int) -> list[BSON]:
        polls: list = await self.polls_db.user_actions.aggregate(
            [
                {"$match": {"user_id": id, "has_voted": {"$exists": True}}},
                {"$project": {"_id": 0, "poll_id": 1, "has_voted": 1}},
                {"$sort": {"has_voted.voted_at": DESCENDING}},
                {
                    "$lookup": {
                        "from": "polls",
                        "localField": "poll_id",
                        "foreignField": "_id",
                        "as": "poll",
                    }
                },
                {"$unwind": "$poll"},
                {
                    "$match": {
                        "$or": [
                            {"poll.privacy": "public"},
                            {"poll.privacy": "private", "poll.user_id": user_id},
                        ]
                    }
                },
                {"$replaceRoot": {"newRoot": "$poll"}},
            ]
        ).to_list(length=None)

        return polls

    async def get_by_user_shares(self, id: int, user_id: int) -> list[BSON]:
        polls: list = await self.polls_db.user_actions.aggregate(
            [
                {"$match": {"user_id": int(id), "has_shared": {"$exists": True}}},
                {"$project": {"_id": 0, "poll_id": 1, "has_shared": 1}},
                {"$sort": {"has_shared.shared_at": DESCENDING}},
                {
                    "$lookup": {
                        "from": "polls",
                        "localField": "poll_id",
                        "foreignField": "_id",
                        "as": "poll",
                    }
                },
                {"$unwind": "$poll"},
                {
                    "$match": {
                        "$or": [
                            {"poll.privacy": "public"},
                            {"poll.privacy": "private", "poll.user_id": user_id},
                        ]
                    }
                },
                {"$replaceRoot": {"newRoot": "$poll"}},
            ]
        ).to_list(length=None)

        return polls

    async def get_by_user_bookmarks(self, id: int, user_id: int) -> list[BSON]:
        polls: list = await self.polls_db.user_actions.aggregate(
            [
                {"$match": {"user_id": int(id), "has_bookmarked": {"$exists": True}}},
                {"$project": {"_id": 0, "poll_id": 1, "has_bookmarked": 1}},
                {"$sort": {"has_bookmarked.bookmarked_at": DESCENDING}},
                {
                    "$lookup": {
                        "from": "polls",
                        "localField": "poll_id",
                        "foreignField": "_id",
                        "as": "poll",
                    }
                },
                {"$unwind": "$poll"},
                {
                    "$match": {
                        "$or": [
                            {"poll.privacy": "public"},
                            {"poll.privacy": "private", "poll.user_id": user_id},
                        ]
                    }
                },
                {"$replaceRoot": {"newRoot": "$poll"}},
            ]
        ).to_list(length=None)

        return polls

    async def get_by_category(self, category: str, user_id: int) -> list[BSON]:
        polls: list = await self.polls_db.polls.find(
            {
                "category": category,
                "$or": [{"privacy": "public"}, {"privacy": "private", "user_id": user_id}],
            },
            sort=[("created_at", DESCENDING)],
        ).to_list(length=None)

        return polls
