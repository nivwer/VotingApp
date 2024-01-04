from bson import BSON
from bson.objectid import ObjectId

from rest_framework.exceptions import ValidationError

from apps.polls.repositories.user_actions_repository import UserActionsRepository
from apps.polls.repositories.poll_repository import PollRepository
from apps.polls.utils.poll_utils import PollUtils
from utils.mongo_connection import MongoDBSingleton


class UserActionsService:
    polls_db = MongoDBSingleton().client["polls_db"]
    repository = UserActionsRepository()
    poll_repository = PollRepository()
    utils = PollUtils()

    async def vote_add(self, id: str, user_id: int, vote: str):
        id_is_valid: bool = await self.utils.validate_id(id=id)
        if not id_is_valid:
            return None

        poll: BSON = await self.poll_repository.get_by_id(id=id)
        if not poll:
            return None

        has_permissions: bool = await self.utils.check_poll_privacy(user_id=user_id, poll=poll)
        if not has_permissions:
            return None

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

        id: ObjectId = await self.repository.insert_vote(id=id, user_id=user_id, vote=vote)

        return id

    async def vote_read(self, id: str, user_id: int):
        id_is_valid: bool = await self.utils.validate_id(id=id)
        if not id_is_valid:
            return None

        projection: dict = {"_id": 0, "has_voted": 1}
        result: BSON = await self.repository.get_user_actions(
            id=ObjectId(id), user_id=user_id, projection=projection
        )

        vote: str = result["has_voted"]["vote"] if result else ""

        return vote

    async def vote_update(self, id: str, user_id: int, vote: str):
        id_is_valid: bool = await self.utils.validate_id(id=id)
        if not id_is_valid:
            return None

        poll: BSON = await self.poll_repository.get_by_id(id=id)
        if not poll:
            return None

        has_permissions: bool = await self.utils.check_poll_privacy(user_id=user_id, poll=poll)
        if not has_permissions:
            return None

        projection: dict = {"_id": 0, "poll_id": 1, "has_voted": 1}
        result: BSON = await self.repository.get_user_actions(
            id=ObjectId(id), user_id=user_id, projection=projection
        )

        if (result is None) or (not result["has_voted"]):
            message: str = "The user has not voted in this poll."
            raise ValidationError(detail={"message": message})

        del_vote: str = result["has_voted"]["vote"]

        id: ObjectId = await self.repository.update_vote(
            id=id, user_id=user_id, vote=vote, del_vote=del_vote
        )

        return id

    async def vote_delete(self, id: str, user_id: int):
        id_is_valid: bool = await self.utils.validate_id(id=id)
        if not id_is_valid:
            return None

        poll: BSON = await self.poll_repository.get_by_id(id=id)
        if not poll:
            return None

        has_permissions: bool = await self.utils.check_poll_privacy(user_id=user_id, poll=poll)
        if not has_permissions:
            return None

        projection: dict = {"_id": 0, "poll_id": 1, "has_voted": 1}
        result: BSON = await self.repository.get_user_actions(
            id=ObjectId(id), user_id=user_id, projection=projection
        )

        if (result is None) or (not result["has_voted"]):
            message: str = "The user has not voted in this poll."
            raise ValidationError(detail={"message": message})

        del_vote: str = result["has_voted"]["vote"]

        id: ObjectId = await self.repository.delete_vote(id=id, user_id=user_id, del_vote=del_vote)

        return id
