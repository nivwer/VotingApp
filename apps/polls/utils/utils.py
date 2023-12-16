from bson import json_util, BSON

from django.contrib.auth.models import User

from rest_framework.exceptions import ValidationError


class Utils:
    async def bson_to_json(self, bson: BSON) -> dict:
        json = json_util._json_convert(bson)
        return json

    async def validate_id(self, id: str, raise_exception: bool = True):
        if len(id) != 24:
            if raise_exception:
                raise ValidationError(detail={"message": "Invalid poll ID"})
            return False
        return True

    async def get_owner(self, user_id: int):
        f = ["username", "userprofile__profile_picture", "userprofile__profile_name"]
        data = await User.objects.filter(id=user_id).values(*f).afirst()

        user_data: dict = {
            "username": data["username"],
            "profile_picture": data["userprofile__profile_picture"],
            "profile_name": data["userprofile__profile_name"],
        }

        return user_data
