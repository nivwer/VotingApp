from bson import BSON

from django.contrib.auth.models import User

from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.request import Request

from apps.polls.utils.utils import Utils


class PollUtils(Utils):
    async def simplify_poll_data(self, poll: dict):
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
        is_owner = poll["user_id"] == user_id
        is_private = poll["privacy"] == "private"

        if (not is_owner) and (ownerOnly or is_private):
            if raise_exception:
                raise PermissionDenied(detail={"message": "Not Authorized."})
            return False

        return True

    async def process_add_options(
        self,
        user_id: int,
        options: list,
        add_options: list,
        raise_exception: bool = True,
    ):
        list_options = []
        for option in add_options or []:
            if any(o["option_text"] == option for o in options):
                if raise_exception:
                    raise ValidationError(
                        detail={"message": f"This options '{option}' already exist."}
                    )
                return None
            list_options.append({"user_id": user_id, "option_text": option, "votes": 0})

        return list_options

    async def process_del_options(
        self, options: list, del_options: list, raise_exception: bool = True
    ):
        for option in del_options or []:
            if not any(o["option_text"] == option for o in options):
                if raise_exception:
                    raise ValidationError(
                        detail={"message": f"This option '{option}' not exist."}
                    )
                return None

        return del_options
