from bson import BSON
from bson.objectid import ObjectId

from apps.pollsAPI.repositories.poll_comment_repository import PollCommentRepository
from apps.pollsAPI.repositories.poll_repository import PollRepository
from apps.pollsAPI.utils.poll_comment_utils import PollCommentUtils
from apps.pollsAPI.serializers.poll_comment_serializer import PollCommentSerializer


class PollCommentService:
    repository = PollCommentRepository()
    poll_repository = PollRepository()
    utils = PollCommentUtils()

    async def create(self, poll_id: str, user_id: int, data: dict):
        await self.utils.validate_id(id=poll_id)
        poll: BSON = await self.poll_repository.get_by_id(id=poll_id)
        await self.utils.check_poll_privacy(user_id=user_id, poll=poll)

        serializer = PollCommentSerializer(data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        comment: str = serializer.validated_data.get("comment")

        object_id: ObjectId = await self.repository.create(
            poll_id=poll_id, user_id=user_id, comment=comment
        )

        return object_id, ObjectId(poll_id)

    async def update(self, id: str, poll_id: str, user_id: int, data: dict):
        await self.utils.validate_id(id=poll_id)
        poll: BSON = await self.poll_repository.get_by_id(id=poll_id)
        await self.utils.check_poll_privacy(user_id=user_id, poll=poll)

        await self.utils.validate_id(id=id)
        comment: BSON = await self.repository.get_by_id(id=id)
        await self.utils.is_owner(object=comment, user_id=user_id)

        serializer = PollCommentSerializer(data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        comment: str = serializer.validated_data.get("comment")

        object_id: ObjectId = await self.repository.update(id=id, comment=comment)

        return object_id, ObjectId(poll_id)

    async def delete(self, id: str, poll_id: str, user_id: int):
        await self.utils.validate_id(id=poll_id)
        poll: BSON = await self.poll_repository.get_by_id(id=poll_id)
        await self.utils.check_poll_privacy(user_id=user_id, poll=poll)

        await self.utils.validate_id(id=id)
        comment: BSON = await self.repository.get_by_id(id=id)
        await self.utils.is_owner(object=comment, user_id=user_id)

        object_id: ObjectId = await self.repository.delete(id=id, poll_id=poll_id)

        return object_id, ObjectId(poll_id)
