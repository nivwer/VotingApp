from rest_framework.exceptions import NotFound

from asgiref.sync import sync_to_async

from apps.accountsAPI.repositories.user_profile_repository import UserProfileRepository
from apps.accountsAPI.models.user_profile_model import UserProfile
from apps.accountsAPI.serializers.user_profile_serializers import UserProfileSerializer


class UserProfileService:
    """
    Service class for user profile-related operations.

    This class encapsulates business logic related to user profile management.
    """

    repository = UserProfileRepository()

    def create(self, data: dict, raise_exception: bool = True):
        """
        Creates a user profile using the provided data.
        """
        serializer = UserProfileSerializer(data=data)
        is_valid: bool = serializer.is_valid(raise_exception=raise_exception)

        if (not raise_exception) and (not is_valid):
            return None

        fields: dict = serializer.validated_data
        instance: UserProfile = self.repository.create(**fields)

        return instance

    def get_by_user_id(self, id: int, raise_exception: bool = True):
        """
        Retrieves a user profile by user ID.
        """
        try:
            instance: UserProfile = self.repository.get_by_user_id(id=id)

        except UserProfile.DoesNotExist:
            if raise_exception:
                message: str = f"User profile with ID {id} does not exist."
                raise NotFound(detail=message)

            return None

        return instance

    def get_by_username(self, username: str, raise_exception: bool = True):
        """
        Retrieves a user profile by username.
        """
        try:
            instance: UserProfile = self.repository.get_by_username(username=username)

        except UserProfile.DoesNotExist:
            if raise_exception:
                message: str = f"User with username {username} does not exist."
                raise NotFound(detail=message)

            return None

        return instance

    def update(self, instance: UserProfile, data: dict, raise_exception: bool = True):
        """
        Updates a user profile using the provided data.
        """
        serializer = UserProfileSerializer(instance=instance, data=data, partial=True)
        is_valid: bool = serializer.is_valid(raise_exception=raise_exception)

        if (not raise_exception) and (not is_valid):
            return None

        instance: UserProfile = self.repository.update(serializer=serializer)

        return instance

    def get_owner(self, user_id: int):
        """
        Retrieves and formats information about the owner of an object (e.g., poll or comment).

        Args:
            user_id (int): The ID of the user (owner) for whom to retrieve information.

        Returns:
            dict: A dictionary containing the formatted user data including username,
            profile picture, and name.
        """

        data: dict = self.repository.get_owner(user_id=user_id)

        return data

    async def a_get_owner(self, user_id: int):
        return await sync_to_async(self.get_owner)(user_id=user_id)
