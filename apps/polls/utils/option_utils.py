from rest_framework.exceptions import PermissionDenied, ValidationError

from .utils import Utils


class OptionUtils(Utils):
    async def process_add_one_option(
        self, user_id: int, is_owner: bool, options: list, option: str, raise_exception: bool = True
    ):
        if any(o["option_text"] == option for o in options):
            if raise_exception:
                message: str = "Option already exist."
                raise ValidationError(detail={"option_text": [message]})

            return None

        if not is_owner:
            if any(o["user_id"] == user_id for o in options):
                if raise_exception:
                    message: str = "You can only add one option."
                    raise ValidationError(detail={"option_text": [message]})

                return None

        option_obj: dict = {"user_id": user_id, "option_text": option, "votes": 0}
        return option_obj

    async def process_del_one_option(
        self, is_owner: bool, options: list, option: str, raise_exception: bool = True
    ):
        if not any(o["option_text"] == option for o in options):
            if raise_exception:
                message: str = "Option not exist."
                raise ValidationError(detail={"message": message})

            return None

        if not is_owner:
            if raise_exception:
                message: str = "Not Authorized."
                raise PermissionDenied(detail={"message": message})

            return None

        return option

    async def process_add_options(
        self, user_id: int, options: list, add_options: list, raise_exception: bool = True
    ):
        """
        Processes the addition of options to a poll.

        Return a list of objects representing the options to be added.

        Option object example: { user_id: int, option_text: str, votes: 0 }
        """
        list_options: list = []

        for option in add_options or []:
            if any(o["option_text"] == option for o in options):
                if raise_exception:
                    message: str = f"This options '{option}' already exist."
                    raise ValidationError(detail={"message": message})

                return None

            option_obj: dict = {"user_id": user_id, "option_text": option, "votes": 0}
            list_options.append(option_obj)

        return list_options

    async def process_del_options(
        self, options: list, del_options: list, raise_exception: bool = True
    ):
        """
        Processes the deletion of options from a poll.
        """
        for option in del_options or []:
            if not any(o["option_text"] == option for o in options):
                if raise_exception:
                    message: str = f"This option '{option}' not exist."
                    raise ValidationError(detail={"message": message})

                return None

        return del_options
