from bson.objectid import ObjectId
from bson import BSON

from apps.polls.repositories.user_actions_repository import UserActionsRepository
from apps.polls.serializerss.poll_serializers import (
    PollSerializer,
    OptionsSerializer,
    OptionSerializer,
)
from apps.polls.repositories.poll_repository import PollRepository
from apps.polls.utils.poll_utils import PollUtils
from apps.polls.utils.option_utils import OptionUtils
from apps.accounts.services.user_profile_service import UserProfileService


class PollService:
    """
    Service class for managing poll-related operations.

    This class acts as a service layer for handling operations related to polls. It uses the 'PollRepository'
    for database interactions, 'PollUtils' for poll-specific utility methods, and 'UserActionsRepository'
    for managing user actions related to polls.
    """

    repository = PollRepository()
    utils = PollUtils()
    option_utils = OptionUtils()
    user_actions_repository = UserActionsRepository()
    user_profile_service = UserProfileService()

    async def create(self, data: dict, user_id: int):
        """
        Creates a new poll, including options provided in the data.

        Args:
            data (dict): The data for creating the poll, including options to add.
            user_id (int): The ID of the user creating the poll.
        """
        options: list = {"options": data["options"]["add_options"]}
        poll_serializer = PollSerializer(data=data, context={"user_id": user_id})
        options_serializer = OptionsSerializer(data=options)

        poll_serializer.is_valid(raise_exception=True)
        options_serializer.is_valid(raise_exception=True)

        add_options: list = []
        for option in options_serializer.validated_data.get("options"):
            option_obj: dict = {"user_id": user_id, "option_text": option, "votes": 0}
            add_options.append(option_obj)

        poll_serializer.validated_data["options"] = add_options
        poll: dict = poll_serializer.save()

        object_id: ObjectId = await self.repository.create(data=poll)
        return object_id

    async def get_by_id(self, id: str, user_id: int | None = None):
        """
        Retrieves detailed information about a poll by its ID, including user-specific actions.

        Args:
            id (str): The ID of the poll to retrieve.
            user_id (int): The ID of the user requesting the poll information.
        """
        id_is_valid: bool = await self.utils.validate_id(id=id)
        if not id_is_valid:
            return None

        poll: BSON = await self.repository.get_by_id(id=id)
        if not poll:
            return None

        has_permissions: bool = await self.utils.check_poll_privacy(user_id=user_id, poll=poll)
        if not has_permissions:
            return None

        poll: dict = await self.utils.bson_to_json(bson=poll)
        poll = await self.utils.simplify_poll_data(poll=poll)
        user_poll_data: dict = await self.user_profile_service.a_get_owner(user_id=poll["user_id"])
        poll["user_profile"] = user_poll_data

        user_actions: dict = {}
        if user_id:
            projection: dict = {"_id": 0, "has_voted": 1, "has_shared": 1, "has_bookmarked": 1}
            result: BSON = await self.user_actions_repository.get_user_actions(
                id=ObjectId(poll["id"]), user_id=user_id, projection=projection
            )

            if result != None:
                result: dict = await self.utils.bson_to_json(bson=result)
                user_actions = result

        return poll, user_actions

    async def update(self, id: str, data: dict, user_id: int):
        """
        Updates a poll, including adding and removing options.

        Args:
            id (str): The ID of the poll to update.
            data (dict): The data for updating the poll, including options to add or remove.
            user_id (int): The ID of the user attempting to update the poll.
        """
        id_is_valid: bool = await self.utils.validate_id(id=id)
        if not id_is_valid:
            return None

        poll: BSON = await self.repository.get_by_id(id=id)
        if not poll:
            return None

        has_permissions: bool = await self.utils.check_poll_privacy(user_id=user_id, poll=poll)
        if not has_permissions:
            return None

        # before serialization.
        del_options: list = await self.option_utils.process_del_options(
            options=poll["options"],
            del_options=data["options"]["del_options"],
        )

        options: dict = {"options": []}
        options["options"].extend(o["option_text"] for o in poll["options"])
        options["options"].extend(data["options"]["add_options"] or [])
        for option in data["options"]["del_options"] or []:
            options["options"].remove(option)

        poll_serializer = PollSerializer(data=data)
        options_serializer = OptionsSerializer(data=options)

        poll_serializer.is_valid(raise_exception=True)
        options_serializer.is_valid(raise_exception=True)

        # after serialization.
        add_options: list = await self.option_utils.process_add_options(
            user_id=user_id,
            options=poll["options"],
            add_options=data["options"]["add_options"],
        )

        object_id: ObjectId = await self.repository.update(
            id=id,
            data=poll_serializer.validated_data,
            add_options=add_options,
            del_options=del_options,
        )

        return object_id

    async def delete(self, id: str, user_id: int):
        """
        Deletes a poll.

        Args:
            id (str): The ID of the poll to delete.
            user_id (int): The ID of the user attempting to delete the poll.
        """
        id_is_valid: bool = await self.utils.validate_id(id=id)
        if not id_is_valid:
            return None

        poll: BSON = await self.repository.get_by_id(id=id)
        if not poll:
            return None

        has_permissions: bool = await self.utils.check_poll_privacy(user_id=user_id, poll=poll)
        if not has_permissions:
            return None

        object_id: ObjectId = await self.repository.delete(id=id, poll=poll)
        return object_id

    async def add_option(self, id: str, user_id: int, data: dict):
        id_is_valid: bool = await self.utils.validate_id(id=id)
        if not id_is_valid:
            return None

        poll: BSON = await self.repository.get_by_id(id=id)
        if not poll:
            return None

        has_permissions: bool = await self.utils.check_poll_privacy(user_id=user_id, poll=poll)
        if not has_permissions:
            return None

        option_serializer = OptionSerializer(data=data, partial=True)
        option_serializer.is_valid(raise_exception=True)

        option: dict = await self.option_utils.process_add_one_option(
            user_id=user_id,
            is_owner=poll["user_id"] == user_id,
            option=data["option_text"],
            options=poll["options"],
        )

        object_id: ObjectId = await self.repository.add_option(id=id, option=option)
        return object_id

    async def del_option(self, id: str, data: dict, user_id: int):
        id_is_valid: bool = await self.utils.validate_id(id=id)
        if not id_is_valid:
            return None

        poll: BSON = await self.repository.get_by_id(id=id)
        if not poll:
            return None

        has_permissions: bool = await self.utils.check_poll_privacy(user_id=user_id, poll=poll)
        if not has_permissions:
            return None

        option: str = await self.option_utils.process_del_one_option(
            user_id=user_id,
            is_owner=poll["user_id"] == user_id,
            option=data["option_text"],
            options=poll["options"],
        )

        option_serializer = OptionSerializer(data=data)
        option_serializer.is_valid(raise_exception=True)

        object_id: ObjectId = await self.repository.del_option(id=id, option=option)
        return object_id
