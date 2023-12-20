from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import NotFound

from apps.accounts.serializers.user_profile_serializers import UserProfileSerializer
from apps.accounts.services.user_profile_service import UserProfileService
from apps.accounts.models.user_profile_model import UserProfile


class UserProfileGetByUserIdAPIView(APIView):
    """
    API view for retrieving user profiles by user ID.
    """

    permission_classes = [AllowAny]

    service = UserProfileService()

    def get(self, request, id: int):
        """
        Allows any user to retrieve user profiles by providing the user ID.

        Usage:
            - To retrieve a user profile by user ID: Send a GET request to the '/user/{id}/profile/' endpoint.

        Example Request:
        ```
        GET /user/{id}/profile/
        ```

        Responses:
            - 200 OK:
            - 404 Not Found: User profile not found.
        """

        try:
            instance: UserProfile = self.service.get_by_user_id(id=id)

        except NotFound as error:
            return Response(data=error.detail, status=status.HTTP_400_BAD_REQUEST)

        profile: dict = UserProfileSerializer(instance=instance).data
        profile["username"] = instance.user.username
        profile["date_joined"] = instance.user.date_joined

        return Response(data={"profile": profile}, status=status.HTTP_200_OK)


class UserProfileGetByUsernameAPIView(APIView):
    """
    API view for retrieving user profiles by username.
    """

    permission_classes = [AllowAny]

    service = UserProfileService()

    def get(self, request, username: str):
        """
        Allows any user to retrieve user profiles by providing the username.

        Usage:
            - To retrieve a user profile by username: Send a GET request to the '/user/{username}/profile/' endpoint.

        Example Request:
        ```
        GET /user/{username}/profile/
        ```

        Responses:
            - 200 OK:
            - 404 Not Found: User profile not found.
        """

        try:
            instance: UserProfile = self.service.get_by_username(username=username)

        except NotFound as error:
            return Response(data=error.detail, status=status.HTTP_400_BAD_REQUEST)

        profile: dict = UserProfileSerializer(instance=instance).data
        profile["username"] = instance.user.username
        profile["date_joined"] = instance.user.date_joined

        return Response(data={"profile": profile}, status=status.HTTP_200_OK)
