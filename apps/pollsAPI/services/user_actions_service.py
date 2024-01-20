from bson import BSON
from bson.objectid import ObjectId

from rest_framework.exceptions import ValidationError

from apps.pollsAPI.repositories.user_actions_repository import UserActionsRepository
from apps.pollsAPI.repositories.poll_repository import PollRepository
from apps.pollsAPI.utils.poll_utils import PollUtils
from utils.mongo_connection import MongoDBSingleton


class UserActionsService:
    polls_db = MongoDBSingleton().client["polls_db"]
    repository = UserActionsRepository()
    poll_repository = PollRepository()
    utils = PollUtils()

    async def vote_add(self, id: str, user_id: int, vote: str):
        await self.utils.validate_id(id=id)
        poll: BSON = await self.poll_repository.get_by_id(id=id)
        await self.utils.check_poll_privacy(user_id=user_id, poll=poll)

        projection: dict = {"_id": 0, "poll_id": 1, "has_voted": 1}
        result: BSON = await self.repository.get_user_actions(
            id=ObjectId(id), user_id=user_id, projection=projection
        )

        if result is None:
            # Create a user actions document if it doesn't exist.
            await self.repository.create(id=id, user_id=user_id)

        elif "has_vote" in result:
            message: str = "The user has already voted in this poll."
            raise ValidationError(detail={"message": message})

        object_id: ObjectId = await self.repository.insert_vote(id=id, user_id=user_id, vote=vote)
        return object_id

    async def vote_read(self, id: str, user_id: int):
        await self.utils.validate_id(id=id)

        projection: dict = {"_id": 0, "has_voted": 1}
        result: BSON = await self.repository.get_user_actions(
            id=ObjectId(id), user_id=user_id, projection=projection
        )

        vote: str = result["has_voted"]["vote"] if result else ""
        return vote

    async def vote_update(self, id: str, user_id: int, vote: str):
        await self.utils.validate_id(id=id)
        poll: BSON = await self.poll_repository.get_by_id(id=id)
        await self.utils.check_poll_privacy(user_id=user_id, poll=poll)

        projection: dict = {"_id": 0, "poll_id": 1, "has_voted": 1}
        result: BSON = await self.repository.get_user_actions(
            id=ObjectId(id), user_id=user_id, projection=projection
        )

        if (result is None) or (not result["has_voted"]):
            message: str = "The user has not voted in this poll."
            raise ValidationError(detail={"message": message})

        del_vote: str = result["has_voted"]["vote"]

        object_id: ObjectId = await self.repository.update_vote(
            id=id, user_id=user_id, vote=vote, del_vote=del_vote
        )

        return object_id

    async def vote_delete(self, id: str, user_id: int):
        await self.utils.validate_id(id=id)
        poll: BSON = await self.poll_repository.get_by_id(id=id)
        await self.utils.check_poll_privacy(user_id=user_id, poll=poll)

        projection: dict = {"_id": 0, "poll_id": 1, "has_voted": 1}
        result: BSON = await self.repository.get_user_actions(
            id=ObjectId(id), user_id=user_id, projection=projection
        )

        if (result is None) or (not result["has_voted"]):
            message: str = "The user has not voted in this poll."
            raise ValidationError(detail={"message": message})

        del_vote: str = result["has_voted"]["vote"]

        object_id: ObjectId = await self.repository.delete_vote(
            id=id, user_id=user_id, del_vote=del_vote
        )

        return object_id

    async def share(self, id: str, user_id: int):
        await self.utils.validate_id(id=id)
        poll: BSON = await self.poll_repository.get_by_id(id=id)
        await self.utils.check_poll_privacy(user_id=user_id, poll=poll)

        projection: dict = {"_id": 0, "poll_id": 1, "has_shared": 1}
        result: BSON = await self.repository.get_user_actions(
            id=ObjectId(id), user_id=user_id, projection=projection
        )

        if result is None:
            # Create a user actions document if it doesn't exist.
            await self.repository.create(id=id, user_id=user_id)

        elif "has_shared" in result:
            message: str = "The user has already shared in this poll."
            raise ValidationError(detail={"message": message})

        object_id: ObjectId = await self.repository.share(id=id, user_id=user_id)
        return object_id

    async def unshare(self, id: str, user_id: int):
        await self.utils.validate_id(id=id)
        poll: BSON = await self.poll_repository.get_by_id(id=id)
        await self.utils.check_poll_privacy(user_id=user_id, poll=poll)

        projection: dict = {"_id": 0, "poll_id": 1, "has_shared": 1}
        result: BSON = await self.repository.get_user_actions(
            id=ObjectId(id), user_id=user_id, projection=projection
        )

        if (result is None) or (not result["has_shared"]):
            message: str = "The user has not shared in this poll."
            raise ValidationError(detail={"message": message})

        object_id: ObjectId = await self.repository.unshare(id=id, user_id=user_id)
        return object_id

    async def bookmark(self, id: str, user_id: int):
        await self.utils.validate_id(id=id)
        poll: BSON = await self.poll_repository.get_by_id(id=id)
        await self.utils.check_poll_privacy(user_id=user_id, poll=poll)

        projection: dict = {"_id": 0, "poll_id": 1, "has_bookmarked": 1}
        result: BSON = await self.repository.get_user_actions(
            id=ObjectId(id), user_id=user_id, projection=projection
        )

        if result is None:
            # Create a user actions document if it doesn't exist.
            await self.repository.create(id=id, user_id=user_id)

        elif "has_bookmarked" in result:
            message: str = "The user has already bookmarked this poll."
            raise ValidationError(detail={"message": message})

        object_id: ObjectId = await self.repository.bookmark(id=id, user_id=user_id)
        return object_id

    async def unbookmark(self, id: str, user_id: int):
        await self.utils.validate_id(id=id)
        poll: BSON = await self.poll_repository.get_by_id(id=id)
        await self.utils.check_poll_privacy(user_id=user_id, poll=poll)

        projection: dict = {"_id": 0, "poll_id": 1, "has_bookmarked": 1}
        result: BSON = await self.repository.get_user_actions(
            id=ObjectId(id), user_id=user_id, projection=projection
        )

        if (result is None) or (not result["has_bookmarked"]):
            message: str = "The user has not bookmarked in this poll."
            raise ValidationError(detail={"message": message})

        object_id: ObjectId = await self.repository.unbookmark(id=id, user_id=user_id)
        return object_id
