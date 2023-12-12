from apps.accounts.models.user_profile_model import UserProfile
from apps.accounts.serializers.user_profile_serializers import UserProfileSerializer
from rest_framework.exceptions import NotFound


class UserProfileRepository:
    def create(self, data: dict, raise_exception: bool = True):
        serializer = UserProfileSerializer(data=data)

        if raise_exception:
            serializer.is_valid(raise_exception=raise_exception)
        elif not serializer.is_valid():
            return None

        user = serializer.validated_data.get("user")
        profile_name = serializer.validated_data.get("profile_name")
        profile = UserProfile.objects.create(user=user, profile_name=profile_name)
        return profile

    def get_profile_by_user_id(self, id: int, raise_exception: bool = False):
        try:
            return UserProfile.objects.get(user=id)
        except UserProfile.DoesNotExist:
            if raise_exception:
                raise NotFound(detail=f"User profile with ID {id} does not exist.")
            return None

    def update(
        self, instance: UserProfile, data: dict, raise_exception: bool = True
    ) -> UserProfile | None:
        serializer = UserProfileSerializer(instance=instance, data=data, partial=True)

        if raise_exception:
            serializer.is_valid(raise_exception=raise_exception)
        elif not serializer.is_valid():
            return None

        profile = serializer.save()
        return profile
