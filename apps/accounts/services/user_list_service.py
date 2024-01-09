from apps.accounts.repositories.user_list_repository import UserListRepository
from apps.accounts.repositories.user_profile_repository import UserProfileRepository
from utils.pagination import Pagination


class UserListService:
    repository = UserListRepository()
    user_profile_repository = UserProfileRepository()
    pagination = Pagination()

    def get_by_keyword(self, keyword: str, page: int, page_size: int):
        user_id_list: list[dict] = self.repository.get_by_keyword(keyword=keyword)

        data: dict = self.pagination.paginate(
            object_list=user_id_list, page=page, page_size=page_size
        )

        items: list[dict] = []
        for user in data["items"]:
            item: dict = {}
            item["user"] = self.user_profile_repository.get_owner(user_id=user["id"])
            items.append(item)

        data["items"] = items

        return data

    def get_all(self, page: int, page_size: int, user_id: int | None = None):
        user_id_list: list[dict] = self.repository.get_all()

        data: dict = self.pagination.paginate(
            object_list=user_id_list, page=page, page_size=page_size
        )

        items: list[dict] = []
        for user in data["items"]:
            item: dict = {}
            item["user"] = self.user_profile_repository.get_owner(user_id=user["id"])
            items.append(item)

        data["items"] = items

        return data
