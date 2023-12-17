from django.contrib.auth.models import User


class UserListRepository:
    async def get_user_list_by_keyword(self, keyword: str):
        users: list[dict] = (
            User.objects.filter(username__icontains=keyword)
            .order_by("-date_joined")
            .values("id")
        )
        return users
