from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import NotFound

from apps.accounts.serializers.user_profile_serializers import UserProfileSerializer
from apps.accounts.services.user_profile_service import UserProfileService
from apps.accounts.models.user_profile_model import UserProfile


class UserProfileByUserIdAPIView(APIView):
    """
    API view for retrieving user profiles by user ID.

    This view allows any user, authenticated or not, to retrieve a user profile by providing the user ID.

    Endpoint:
    - GET /user/{id}/profile: Retrieve a user's profile by user ID.

    Permissions:
    - AllowAny: Any user, authenticated or not, is allowed to access this endpoint.

    Usage:
    - To retrieve a user's profile by user ID, send a GET request to /user/{id}/profile.

    Request URL Parameters:
    - id (int): The user ID for which the profile needs to be retrieved.

    Response:
    - A JSON response containing the user profile data.

    Example Usage:
    ```
    # Retrieve user profile by user ID
    GET /user/123/profile
    ```

    Note: This endpoint allows any user to access user profiles by providing the user ID.
    """

    permission_classes = [AllowAny]

    service = UserProfileService()

    def get(self, request, id: int, *args, **kwargs):
        """
        Retrieve a user's profile by user ID.

        Args:
            request: The HTTP request object.
            id (int): The user ID for which the profile needs to be retrieved.

        Returns:
            Response: A response containing the user's profile data.
        """

        try:
            instance: UserProfile = self.service.get_by_user_id(id=id)

        except NotFound as error:
            return Response(data=error.detail, status=status.HTTP_404_NOT_FOUND)

        profile: dict = UserProfileSerializer(instance=instance).data
        profile["id"] = instance.user.id
        profile["username"] = instance.user.username
        profile["date_joined"] = instance.user.date_joined

        return Response(data={"profile": profile}, status=status.HTTP_200_OK)


class UserProfileByUsernameAPIView(APIView):
    """
    API view for retrieving user profiles by username.

    This view allows any user, authenticated or not, to retrieve a user profile by providing the username.

    Endpoint:
    - GET /user/{username}/profile: Retrieve a user's profile by username.

    Permissions:
    - AllowAny: Any user, authenticated or not, is allowed to access this endpoint.

    Usage:
    - To retrieve a user's profile by username, send a GET request to /user/{username}/profile.

    Request URL Parameters:
    - username (str): The username for which the profile needs to be retrieved.

    Response:
    - A JSON response containing the user profile data.

    Example Usage:
    ```
    # Retrieve user profile by username
    GET /user/johndoe/profile
    ```

    Note: This endpoint allows any user to access user profiles by providing the username.
    """

    permission_classes = [AllowAny]

    service = UserProfileService()

    def get(self, request, username: str, *args, **kwargs):
        """
        Retrieve a user's profile by username.

        Args:
        request: The HTTP request object.
        username (str): The username for which the profile needs to be retrieved.

        Returns:
        Response: A response containing the user's profile data.
        """

        try:
            instance: UserProfile = self.service.get_by_username(username=username)

        except NotFound as error:
            return Response(data=error.detail, status=status.HTTP_404_NOT_FOUND)

        profile: dict = UserProfileSerializer(instance=instance).data
        profile["id"] = instance.user.id
        profile["username"] = instance.user.username
        profile["date_joined"] = instance.user.date_joined

        return Response(data={"profile": profile}, status=status.HTTP_200_OK)
