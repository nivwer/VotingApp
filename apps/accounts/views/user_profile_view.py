from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError, NotFound

from apps.accounts.models.user_profile_model import UserProfile
from apps.accounts.serializers.user_profile_serializers import UserProfileSerializer
from apps.accounts.services.user_profile_service import UserProfileService


class UserProfileAPIView(APIView):
    """
    API view for managing user profiles.

    Requires session-based authentication using SessionAuthentication.
    """

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    service = UserProfileService()

    def get(self, request):
        """
        Allows authenticated users to retrieve their user profile information.

        Example Request:
        ```
        GET /user/profile/
        ```

        Responses:
            - 200 OK:
            - 401 Unauthorized: Authentication failed.
            - 404 Not Found: User profile not found.
        """

        user_pk: int = request.user.pk

        try:
            instance: UserProfile = self.service.get_by_user_id(id=user_pk)

        except NotFound as error:
            return Response(data=error.detail, status=status.HTTP_400_BAD_REQUEST)

        profile: dict = UserProfileSerializer(instance=instance).data
        return Response(data={"profile": profile}, status=status.HTTP_200_OK)

    def post(self, request):
        """
        Allows users to create a user profile.

        Usage:
            - To create a new user profile: Send a POST request with user profile data. ( Optional )
            - To return profile information: Include 'return_profile' in the request data. ( Optional )

        Example Request:
        ```
        POST /user/profile/
        {
            "name": "example_name",
            "bio": "example_bio",
            "return_profile": true
        }
        ```

        Responses:
            - 200 OK: Successful user profile creation.
            - 400 Bad Request: Validation errors in the request payload.
        """

        return_profile: bool = request.data.get("return_profile", False)

        user_pk: int = request.user.pk
        name: str = request.data.get("name", request.user.username)
        profile_data: dict = {"user": user_pk, "name": name, **request.data}

        data: dict = {}

        try:
            instance: UserProfile = self.service.create(data=profile_data)

        except ValidationError as error:
            return Response(data=error.detail, status=status.HTTP_400_BAD_REQUEST)

        if return_profile:
            profile: dict = UserProfileSerializer(instance=instance).data
            data["profile"] = profile

        response = Response(status=status.HTTP_201_CREATED)
        response.data = data
        return response

    def put(self, request):
        """
        Allows users to update their user profile.

        Usage:
            - To update user profile information: Send a PUT request to the '/profile/' endpoint.
            - To return profile information: Include 'return_profile' in the request data. ( Optional )

        Example Request:
        ```
        PUT /profile/
        {
            "name": "new_name",
            "profile_picture": "new_profile_picture_url",
            "return_profile": true
        }
        ```

        Responses:
            - 200 OK: Successful user profile updated.
            - 400 Bad Request: Validation errors in the request payload.
            - 404 Not Found: User profile not found.
        """

        return_profile: bool = request.data.get("return_profile", False)

        user_pk: int = request.user.pk
        profile_data: dict = request.data

        data: dict = {}

        try:
            instance: UserProfile = self.service.get_by_user_id(id=user_pk)
            instance: UserProfile = self.service.update(instance=instance, data=profile_data)

        except ValidationError as error:
            return Response(data=error.detail, status=status.HTTP_400_BAD_REQUEST)

        except NotFound as error:
            return Response(data=error.detail, status=status.HTTP_400_BAD_REQUEST)

        if return_profile:
            profile: dict = UserProfileSerializer(instance=instance).data
            data["profile"] = profile

        response = Response(status=status.HTTP_201_CREATED)
        response.data = data
        return response
