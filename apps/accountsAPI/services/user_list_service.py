from apps.accountsAPI.repositories.user_list_repository import UserListRepository
from apps.accountsAPI.repositories.user_profile_repository import UserProfileRepository
from utils.pagination import Pagination


class UserListService:
    """
    Service class for retrieving user lists based on different criteria.
    """

    repository = UserListRepository()
    user_profile_repository = UserProfileRepository()
    pagination = Pagination()

    def get_by_keyword(self, keyword: str, page: int, page_size: int):
        """
        Retrieves a paginated user list based on a keyword search.
        """

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
        """
        Retrieves a paginated list of all users.
        """

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
