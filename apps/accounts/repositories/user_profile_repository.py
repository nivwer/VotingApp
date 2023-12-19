from apps.accounts.models.user_profile_model import UserProfile
from apps.accounts.serializers.user_profile_serializers import UserProfileSerializer
from rest_framework.exceptions import NotFound


class UserProfileRepository:
    def create(self, user_pk: int, name: str, **kwargs):
        instance: UserProfile = UserProfile.objects.create(user=user_pk, name=name, **kwargs)
        return instance

    def get_by_user_id(self, id: int):
        instance: UserProfile = UserProfile.objects.get(user=id)
        return instance

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
