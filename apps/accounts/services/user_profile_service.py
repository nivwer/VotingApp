from apps.accounts.repositories.user_profile_repository import UserProfileRepository
from apps.accounts.models.user_profile_model import UserProfile
from apps.accounts.serializers.user_profile_serializers import UserProfileSerializer
from rest_framework.exceptions import NotFound


class UserProfileService:
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
