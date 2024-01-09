from django.contrib.auth.models import User


class UserListRepository:
    def get_all(self):
        users: list = User.objects.all().order_by("-date_joined").values("id")

        return users

    def get_by_keyword(self, keyword: str):
        users: list = (
            User.objects.filter(username__icontains=keyword).order_by("-date_joined").values("id")
        )

        return users
