from bson import json_util, BSON

from rest_framework.exceptions import ValidationError, PermissionDenied


class Utils:
    """
    Utility class with helper methods.
    """

    async def bson_to_json(self, bson: BSON) -> dict:
        """
        Converts a BSON document to a JSON-formatted dictionary.
        """
        json: dict = json_util._json_convert(bson)
        return json

    async def validate_id(self, id: str, raise_exception: bool = True):
        """
        Validates the format of a poll ID.
        """
        if len(id) != 24:
            if raise_exception:
                message: str = "Invalid poll ID"
                raise ValidationError(detail={"message": message})

            return False

        return True

    async def is_owner(self, object: dict | BSON, user_id: int, raise_exception: bool = True):
        is_owner: bool = object["user_id"] == user_id
        if not is_owner:
            if raise_exception:
                message: str = "Not authorized."
                raise PermissionDenied(detail={"message": message})

            return False

        return True
