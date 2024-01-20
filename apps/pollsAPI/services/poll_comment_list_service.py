from bson import BSON
from bson.objectid import ObjectId

from apps.pollsAPI.repositories.poll_comment_list_repository import PollCommentListRepository
from apps.pollsAPI.repositories.poll_repository import PollRepository
from apps.pollsAPI.utils.poll_comment_utils import PollCommentUtils
from apps.accountsAPI.services.user_profile_service import UserProfileService

from utils.pagination import Pagination


class PollCommentListService:
    repository = PollCommentListRepository()
    user_profile_service = UserProfileService()
    utils = PollCommentUtils()
    pagination = Pagination()
    poll_repository = PollRepository()

    async def filter_poll_comment_list(self, comments: list[dict]):
        items: list[dict] = []
        for comment in comments:
            comment: dict = await self.utils.simplify_poll_comment_data(comment=comment)
            profile: dict = await self.user_profile_service.a_get_owner(user_id=comment["user_id"])
            comment["user_profile"] = profile

            item: dict = {}
            item["comment"] = comment
            items.append(item)

        return items

    async def get_by_poll_id(self, poll_id: str, page: int, page_size: int, user_id: int):
        await self.utils.validate_id(id=poll_id)
        poll: BSON = await self.poll_repository.get_by_id(id=poll_id)
        await self.utils.check_poll_privacy(poll=poll, user_id=user_id)

        comments: list[BSON] = await self.repository.get_by_poll_id(id=poll_id)
        comments: list[dict] = await self.utils.bson_to_json(bson=comments)

        data: dict = await self.pagination.a_paginate(
            object_list=comments, page=page, page_size=page_size
        )

        items = await self.filter_poll_comment_list(comments=data["items"])
        data["items"] = items

        return data
