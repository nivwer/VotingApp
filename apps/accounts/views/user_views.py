from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.models import User

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import ValidationError

from apps.accounts.serializers.user_serialziers import UserSerializer
from apps.accounts.services.user_service import UserService


class UserCreateAPIView(APIView):
    """
    API view for user creation.

    This view allows new users to create by providing necessary information.
    It supports creating a new user account and optionally returning user details.

    Endpoints:
    - POST /user/create: Create a new user.

    Permissions:
    - AllowAny: Unauthenticated users are allowed to access this endpoint.

    Request Format:
    - POST: Send a JSON object with user creation details.

    Query Parameters:
    - return_user (bool, optional): If set to True, the API response includes user details.

    Usage:
    - To create a new user, send a POST request to /user/create with user creation details.

    Example Usage:
    ```
    # Create a new user
    POST /user/create
    headers: { "X-CSRFToken": csrftoken }
    body: {
        "username": "example_user",
        "password": "secure_password",
        "return_user": true
    }
    ```

    Note: The 'return_user' query parameter is optional and can be used to request user details in the response.
    """

    permission_classes = [AllowAny]
    service = UserService()

    def post(self, request):
        """
        Create a new user.

        Args:
            request: The HTTP request object.

        Returns:
            Response: A response indicating the success of the user account creation.
        """
        return_user: bool = request.data.get("return_user", False)
        user_data: dict = request.data

        data: dict = {}

        try:
            instance: User = self.service.create_user(data=user_data)

        except ValidationError as error:
            return Response(data=error.detail, status=status.HTTP_400_BAD_REQUEST)

        if return_user:
            user: dict = UserSerializer(instance=instance).data
            data["user"] = user

        response = Response(status=status.HTTP_201_CREATED)
        response.data = data
        return response


class UserAPIView(APIView):
    """
    API view for retrieving authenticated user details.

    This view allows authenticated users to retrieve their own user details.

    Endpoints:
    - GET /user: Retrieve details of the authenticated user.

    Permissions:
    - IsAuthenticated: Only authenticated users are allowed to access this endpoint.

    Usage:
    - To retrieve user details, send a GET request to /user with valid authentication.

    Example Usage:
    ```
    # Retrieve user details
    GET /user
    ```

    Note: Authentication is required to access this endpoint.
    """

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retrieve details of the authenticated user.

        Args:
            request: The HTTP request object.

        Returns:
            Response: A response containing user details.
        """
        instance: User = request.user
        user: dict = UserSerializer(instance=instance).data
        return Response(data={"user": user}, status=status.HTTP_200_OK)


class UserUpdateUsernameAPIView(APIView):
    """
    API view for updating the username of the authenticated user.

    This view allows authenticated users to update their own usernames.

    Endpoints:
    - PATCH /user/update/username: Update the username of the authenticated user.

    Permissions:
    - IsAuthenticated: Only authenticated users are allowed to access this endpoint.

    Usage:
    - To update the username, send a PATCH request to /user/update/username with valid authentication.

    Request Data:
    - username (str): The new username for the user.

    Example Usage:
    ```
    # Update username
    PATCH /user/update/username
    headers: { "X-CSRFToken": csrftoken }
    body: { "username": "new_username" }
    ```

    Note: Authentication is required to access this endpoint.
    """

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    service = UserService()

    def patch(self, request):
        """
        Update the username of the authenticated user.

        Args:
            request: The HTTP request object.

        Returns:
            Response: A response indicating the success or failure of the update operation.
        """
        instance: User = request.user
        data: dict = request.data

        try:
            user: User = self.service.update_username(instance=instance, data=data)

        except ValidationError as error:
            return Response(data=error.detail, status=status.HTTP_400_BAD_REQUEST)

        update_session_auth_hash(request=request, user=user)

        return Response(status=status.HTTP_200_OK)


class UserUpdatePasswordAPIView(APIView):
    """
    API view for updating the password of the authenticated user.

    This view allows authenticated users to update their own passwords.

    Endpoints:
    - PATCH /user/update/password: Update the password of the authenticated user.

    Permissions:
    - IsAuthenticated: Only authenticated users are allowed to access this endpoint.

    Usage:
    - To update the password, send a PATCH request to /user/update/password with valid authentication.

    Request Data:
    - password (str): The new password for the user.

    Example Usage:
    ```
    # Update password
    PATCH /user/update/password
    headers: { "X-CSRFToken": csrftoken }
    body: {
        "current_password": "current_secure_password",
        "new_password": "new_secure_password"
    }
    ```

    Note: Authentication is required to access this endpoint.
    """

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    service = UserService()

    def patch(self, request):
        """
        Update the password of the authenticated user.

        Args:
            request: The HTTP request object.

        Returns:
            Response: A response indicating the success or failure of the update operation.
        """
        instance: User = request.user
        data: dict = request.data

        try:
            user: User = self.service.update_password(instance=instance, data=data)

        except ValidationError as error:
            return Response(data=error.detail, status=status.HTTP_400_BAD_REQUEST)

        update_session_auth_hash(request=request, user=user)

        return Response(status=status.HTTP_200_OK)
