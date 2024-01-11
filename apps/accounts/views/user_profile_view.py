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

    This view allows authenticated users to retrieve, create, and update their user profiles.

    Endpoints:
    - GET /user/profile: Retrieve the user's profile.
    - POST /user/profile: Create a new user profile.
    - PUT /user/profile: Update the existing user profile.

    Authentication:
    - SessionAuthentication: Users must be authenticated.

    Permissions:
    - IsAuthenticated: Only authenticated users are allowed to access these endpoints.

    Usage:
    - To retrieve the user's profile, send a GET request to /user/profile with valid authentication.
    - To create a new user profile, send a POST request to /user/profile with valid authentication and required data.
    - To update the user profile, send a PUT request to /user/profile with valid authentication and the data to update.

    Request Data for POST:
    - return_profile (bool, optional): If true, includes the updated profile in the response.
    - name (str, optional): The name to set for the user profile.
    - Other profile-related data as needed.

    Request Data for PUT:
    - return_profile (bool, optional): If true, includes the updated profile in the response.
    - Other profile-related data as needed.

    Example Usage:
    ```
    # Retrieve user profile
    GET /user/profile

    # Create user profile
    POST /user/profile
    headers: { "X-CSRFToken": csrftoken }
    body: {
        "name": "example_name",
        "bio": "example_bio",
        "return_profile": true
    }

    # Update user profile
    PUT /user/profile
    headers: { "X-CSRFToken": csrftoken }
    body: {
        "name": "new_name",
        "profile_picture": "new_profile_picture_url",
        "return_profile": true
    }
    ```
    
    Note: Authentication is required to access these endpoints.
    """
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    service = UserProfileService()

    def get(self, request):
        """
        Retrieve the user's profile.

        Args:
            request: The HTTP request object.

        Returns:
            Response: A response containing the user's profile data.
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
        Create a new user profile.

        Args:
            request: The HTTP request object.

        Returns:
            Response: A response indicating the success or failure of the profile creation.
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
        Update the existing user profile.

        Args:
            request: The HTTP request object.

        Returns:
            Response: A response indicating the success or failure of the profile update.
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
