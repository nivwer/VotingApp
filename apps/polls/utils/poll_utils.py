from bson import BSON

from rest_framework.exceptions import PermissionDenied, ValidationError

from apps.polls.utils.utils import Utils


class PollUtils(Utils):
    """
    Utility class with poll-specific helper methods.

    This class extends the base 'Utils' class and adds additional utility methods that are specifically
    tailored for tasks related to polls. It inherits common utility methods from the 'Utils' class.
    """

    async def simplify_poll_data(self, poll: dict):
        """
        Simplifies poll data by converting MongoDB-specific fields.
        """
        poll["id"] = poll["_id"]["$oid"]
        del poll["_id"]
        poll["created_at"] = poll["created_at"]["$date"]

        return poll

    async def check_poll_privacy(
        self,
        user_id: int,
        poll: dict | BSON,
        raise_exception: bool = True,
        ownerOnly: bool = False,
    ):
        """
        Checks if a user has permission to access a poll based on privacy settings.
        """
        is_owner = poll["user_id"] == user_id
        is_private = poll["privacy"] == "private"

        if (not is_owner) and (ownerOnly or is_private):
            if raise_exception:
                raise PermissionDenied(detail={"message": "Not Authorized."})
            return False

        return True
