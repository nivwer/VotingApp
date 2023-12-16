from apps.polls.repositories.user_actions_repository import UserActionsRepository
from apps.polls.serializerss.poll_serializers import PollSerializer, OptionsSerializer
from apps.polls.repositories.poll_repository import PollRepository
from apps.polls.utils.poll_utils import PollUtils


class PollService:
    repository = PollRepository()
    utils = PollUtils()
    user_actions_repository = UserActionsRepository()

    async def create(self, data: dict, user_id: int, raise_exception: bool = True):
        options = {"options": data["options"]["add_options"]}
        poll_serializer = PollSerializer(data=data, context={"user_id": user_id})
        options_serializer = OptionsSerializer(data=options)

        if raise_exception:
            poll_serializer.is_valid(raise_exception=raise_exception)
            options_serializer.is_valid(raise_exception=raise_exception)
        elif not poll_serializer.is_valid() or not options_serializer.is_valid():
            return None

        add_options = []
        for option in options_serializer.validated_data.get("options"):
            add_options.append({"user_id": user_id, "option_text": option, "votes": 0})

        poll_serializer.validated_data["options"] = add_options
        poll = poll_serializer.save()

        return await self.repository.create(data=poll)

    async def get_by_id(self, id: str, user_id: int, raise_exception: bool = True):
        if not await self.utils.validate_id(id=id, raise_exception=raise_exception):
            return None

        poll = await self.repository.get_by_id(id=id, raise_exception=raise_exception)
        if not poll:
            return None

        if not await self.utils.check_poll_privacy(
            user_id=user_id, poll=poll, raise_exception=raise_exception
        ):
            return None

        poll: dict = await self.utils.bson_to_json(bson=poll)
        poll = await self.utils.simplify_poll_data(poll=poll)
        poll["user_profile"] = await self.utils.get_owner(user_id=poll["user_id"])

        if user_id:
            result = await self.user_actions_repository.get_user_actions(
                id=id, user_id=user_id
            )
            if result:
                result: dict = await self.utils.bson_to_json(bson=result)

        user_actions = result or {}

        return poll, user_actions

    async def update(
        self, id: str, data: dict, user_id: int, raise_exception: bool = True
    ):
        if not await self.utils.validate_id(id=id, raise_exception=raise_exception):
            return None

        poll = await self.repository.get_by_id(id=id, raise_exception=raise_exception)
        if not poll:
            return None

        if not await self.utils.check_poll_privacy(
            user_id=user_id, poll=poll, raise_exception=raise_exception, ownerOnly=True
        ):
            return None

        add_options: list = await self.utils.process_add_options(
            user_id=user_id,
            options=poll["options"],
            add_options=data["options"]["add_options"],
            raise_exception=True,
        )

        del_options: list = await self.utils.process_del_options(
            options=poll["options"],
            del_options=data["options"]["del_options"],
            raise_exception=True,
        )

        options = {"options": []}
        options["options"].extend(o["option_text"] for o in poll["options"])
        options["options"].extend(data["options"]["add_options"] or [])
        for option in data["options"]["del_options"] or []:
            options["options"].remove(option)

        poll_serializer = PollSerializer(data=data)
        options_serializer = OptionsSerializer(data=options)

        if raise_exception:
            poll_serializer.is_valid(raise_exception=raise_exception)
            options_serializer.is_valid(raise_exception=raise_exception)
        elif not poll_serializer.is_valid() or not options_serializer.is_valid():
            return None

        return await self.repository.update(
            id=id,
            data=poll_serializer.validated_data,
            add_options=add_options,
            del_options=del_options,
        )

    async def delete(self, id: str, user_id: int, raise_exception: bool = True):
        if not await self.utils.validate_id(id=id, raise_exception=raise_exception):
            return None

        poll = await self.repository.get_by_id(id=id, raise_exception=raise_exception)
        if not poll:
            return None

        if not await self.utils.check_poll_privacy(
            user_id=user_id, poll=poll, raise_exception=raise_exception, ownerOnly=True
        ):
            return None

        return await self.repository.delete(id=id, poll=poll)
