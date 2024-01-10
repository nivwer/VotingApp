from django.contrib.auth.models import User

from apps.accounts.models.user_profile_model import UserProfile
from apps.accounts.serializers.user_profile_serializers import UserProfileSerializer


class UserProfileRepository:
    """
    Repository class for user profile-related database operations.

    This class encapsulates database interactions related to user profiles.
    """

    def create(self, user: int, name: str, **kwargs):
        """
        Creates a user profile.
        """
        instance: UserProfile = UserProfile.objects.create(user=user, name=name, **kwargs)
        return instance

    def get_by_user_id(self, id: int):
        """
        Retrieves a user profile by user ID.
        """
        instance: UserProfile = UserProfile.objects.get(user=id)
        return instance

    def get_by_username(self, username: str):
        """
        Retrieves a user profile by username.
        """
        instance: UserProfile = UserProfile.objects.get(user__username=username)
        return instance

    def update(self, serializer: UserProfileSerializer):
        """
        Updates a user profile.
        """
        instance: UserProfile = serializer.save()
        return instance

    def get_owner(self, user_id: int):
        """
        Retrieves owner details based on user ID.
        """
        f = ["username", "userprofile__profile_picture", "userprofile__name"]
        result: dict = User.objects.filter(id=user_id).values(*f).first()

        data: dict = {
            "username": result["username"],
            "profile_picture": result["userprofile__profile_picture"],
            "name": result["userprofile__name"],
        }

        return data
