from django.contrib.auth.models import User
from asgiref.sync import sync_to_async

class UserListRepository:
    def get_by_keyword(self, keyword: str):
        users: list = (
            User.objects.filter(username__icontains=keyword).order_by("-date_joined").values("id")
        )

        return users
