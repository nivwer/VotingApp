from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from apps.profiles.serializers import UserProfileSerializer
from apps.accounts.repositories.user_repository import UserRepository
from apps.accounts.repositories.user_profile_repository import UserProfileRepository


class GetUserProfileByUsernameAPIView(APIView):
    authentication_classes = [AllowAny]
    user_repository = UserRepository()
    user_profile_repository = UserProfileRepository()

    def get(self, request, username: str):
        user = self.user_repository.get_user_by_username(username=username)
        profile = self.user_profile_repository.get_profile_by_user_id(id=user.pk)
        profile = UserProfileSerializer(instance=profile).data
        profile["username"] = user.username
        profile["date_joined"] = user.date_joined

        return Response(data=profile, status=status.HTTP_200_OK)
