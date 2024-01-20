from django.contrib.auth.models import User


class UserListRepository:
    """
    Repository class for retrieving user lists based on different criteria.

    This class interacts with the 'User' model to retrieve user lists.
    """

    def get_all(self):
        """
        Retrieves a list of all users ordered by date joined.

        Returns:
            list: A list of user IDs.
        """
        users: list = User.objects.all().order_by("-date_joined").values("id")

        return users

    def get_by_keyword(self, keyword: str):
        """
        Retrieves a list of users based on a keyword search.

        Args:
            keyword (str): The keyword for the user search.

        Returns:
            list: A list of user IDs matching the keyword.
        """
        users: list = (
            User.objects.filter(username__icontains=keyword).order_by("-date_joined").values("id")
        )

        return users
