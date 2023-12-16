from bson import json_util, BSON

from django.contrib.auth.models import User

from rest_framework.exceptions import ValidationError


class Utils:
    """
    Utility class with miscellaneous helper methods.

    This class contains various utility methods that can be used across the application for
    common tasks or functionalities.
    """

    async def bson_to_json(self, bson: BSON) -> dict:
        """
        Converts a BSON document to a JSON-formatted dictionary.
        """
        json = json_util._json_convert(bson)
        return json

    async def validate_id(self, id: str, raise_exception: bool = True):
        """
        Validates the format of a poll ID.
        """
        if len(id) != 24:
            if raise_exception:
                raise ValidationError(detail={"message": "Invalid poll ID"})
            return False
        return True

    async def get_owner(self, user_id: int):
        """
        Retrieves and formats information about the owner of an object (e.g., poll or comment).

        Args:
            user_id (int): The ID of the user (owner) for whom to retrieve information.

        Returns:
            dict: A dictionary containing the formatted user data including username,
            profile picture, and profile name.
        """
        f = ["username", "userprofile__profile_picture", "userprofile__profile_name"]
        data = await User.objects.filter(id=user_id).values(*f).afirst()

        user_data: dict = {
            "username": data["username"],
            "profile_picture": data["userprofile__profile_picture"],
            "profile_name": data["userprofile__profile_name"],
        }

        return user_data
