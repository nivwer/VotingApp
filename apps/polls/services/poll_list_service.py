from bson import BSON
from bson.objectid import ObjectId

from apps.polls.repositories.poll_repository import PollRepository
from apps.polls.repositories.user_actions_repository import UserActionsRepository
from apps.polls.utils.poll_utils import PollUtils

from utils.pagination import Pagination


class PollListService:
    repository = PollRepository()
    user_actions_repository = UserActionsRepository()
    utils = PollUtils()
    pagination = Pagination()

    async def filter_poll_list(self, polls: list[dict], user_id: int | None = None):
        items: list = []
        for poll in polls:
            poll = await self.utils.simplify_poll_data(poll=poll)
            poll["user_profile"] = await self.utils.get_owner(user_id=poll["user_id"])

            if user_id:
                result = await self.user_actions_repository.get_user_actions(
                    id=ObjectId(poll["id"]), user_id=user_id
                )
                if result:
                    result: dict = await self.utils.bson_to_json(bson=result)

            item: dict = {}
            item["poll"] = poll
            item["authenticated_user_actions"] = result or {}
            items.append(item)

        return items

    async def get_user_poll_list(
        self, id: int, page: int, page_size: int, user_id: int | None = None
    ):
        polls: list[BSON] = await self.repository.get_user_poll_list(id=id, user_id=user_id)

        polls: list[dict] = await self.utils.bson_to_json(bson=polls)

        data: dict = await self.pagination.paginate(
            object_list=polls, page=page, page_size=page_size
        )

        items = await self.filter_poll_list(polls=data.items, user_id=user_id)

        data.items = items

        return data
