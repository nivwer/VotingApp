from bson import BSON

from apps.accounts.repositories.user_list_repository import UserListRepository
from apps.polls.repositories.user_actions_repository import UserActionsRepository
from utils.utils import Utils
from utils.pagination import Pagination


class UserListService:
    repository = UserListRepository()
    user_actions_repository = UserActionsRepository()
    utils = Utils()
    pagination = Pagination()

    async def get_user_list_by_keyword(self, keyword: str, page: int, page_size: int):
        user_id_list: list[dict] = await self.repository.get_user_list_by_keyword(
            keyword=keyword
        )

        data: dict = await self.pagination.paginate(
            object_list=user_id_list, page=page, page_size=page_size
        )

        items: list[dict] = []
        for user in data.items:
            item: dict = []
            item["user"] = await self.utils.get_owner(user_id=user["id"])
            items.append(item)

        data.items = items
        return data

    async def get_user_list_by_actions(
        self, page: int, page_size: int, user_id: int | None = None
    ):
        user_id_list: list[BSON] = await self.user_actions_repository.get_user_id_list()
        user_id_list = [user for user in user_id_list if user["_id"] != user_id]
        user_id_list: list[dict] = await self.utils.bson_to_json(bson=user_id_list)

        data: dict = await self.pagination.paginate(
            object_list=user_id_list, page=page, page_size=page_size
        )

        items: list[dict] = []
        for user in data.items:
            item: dict = {}
            item["user"] = await self.utils.get_owner(user_id=user["_id"])
            items.append(item)

        data.items = items

        return data
