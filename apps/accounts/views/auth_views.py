from datetime import datetime, timedelta

from django.contrib.auth import logout
from django.contrib.auth.models import User

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import ValidationError, AuthenticationFailed

from apps.accounts.models.user_profile_model import UserProfile
from apps.accounts.services.auth_service import AuthService
from apps.accounts.services.user_service import UserService
from apps.accounts.services.user_profile_service import UserProfileService
from apps.accounts.serializers.user_serialziers import UserSerializer
from apps.accounts.serializers.user_profile_serializers import UserProfileSerializer


class UserRegisterAPIView(APIView):
    """
    API view for user registration.

    This view allows users to register with the system. Users can choose to log in immediately
    after registration and, optionally, create a user profile.

    Endpoint:
    - POST /register: Register a new user.

    Permissions:
    - AllowAny: Any user, authenticated or not, is allowed to access this endpoint.

    Usage:
    - To register a new user, send a POST request to /register.

    Request Body Parameters:
    - username (str): The username for the new user.
    - password (str): The password for the new user.

    Optional Request Body Parameters:
    - login_user (bool): If true, automatically log in the user after registration (default: False).
    - create_profile (bool): If true, create a user profile after registration (default: False).
    - return_user (bool): If true, include the user data in the response (default: False).
    - return_profile (bool): If true, include the user profile data in the response (default: False).

    Response:
    - A JSON response containing the registered user data and, if requested, the user profile data.

    Example Usage:
    ```
    # Register a new user and automatically log in
    POST /register
    headers: { "X-CSRFToken": csrftoken }
    body: {
        "username": "example_user",
        "password": "secure_password",
        "login_user": true
    }

    # Register a new user, create a profile, and return user and profile data
    POST /register
    headers: { "X-CSRFToken": csrftoken }
    body: {
        "username": "example_user",
        "password": "secure_password",
        "create_profile": true,
        "return_user": true,
        "return_profile": true
    }
    ```

    Note: This endpoint allows any user to register, and additional options are available for login and profile creation.
    """

    permission_classes = [AllowAny]

    auth_service = AuthService()
    user_service = UserService()
    user_profile_service = UserProfileService()

    def post(self, request, *args, **kwargs):
        """
        Register a new user.

        Args:
            request: The HTTP request object.

        Returns:
            Response: A response containing the registered user data and, if requested, the user profile data.
        """
        login_user: bool = request.data.get("login_user", False)
        create_profile: bool = request.data.get("create_profile", False)
        return_user: bool = request.data.get("return_user", False)
        return_profile: bool = request.data.get("return_profile", False)

        data: dict = {}

        try:
            user_data: dict = request.data
            user: User = self.user_service.create_user(data=user_data)

            if create_profile:
                profile_data: dict = {"user": user.pk, "name": user.username}
                self.user_profile_service.create(data=profile_data)

        except ValidationError as error:
            return Response(data=error.detail, status=status.HTTP_400_BAD_REQUEST)

        if login_user:
            try:
                user_instance: User = self.auth_service.authenticateAndLogin(request=request)

            except AuthenticationFailed as error:
                return Response(data=error.detail, status=status.HTTP_401_UNAUTHORIZED)

            if return_user:
                user: dict = UserSerializer(instance=user_instance).data
                data["user"] = user

            if create_profile and return_profile:
                profile_instance: UserProfile = self.user_profile_service.get_by_user_id(id=user.id)
                profile: dict = UserProfileSerializer(instance=profile_instance).data
                data["user_profile"] = profile

        response = Response(status=status.HTTP_201_CREATED)
        response.data = data
        return response


class UserLoginAPIView(APIView):
    """
    API view for user login.

    This view allows users to log in and, optionally, retrieve user and user profile data.

    Endpoint:
    - POST /login: Log in an existing user.

    Permissions:
    - AllowAny: Any user, authenticated or not, is allowed to access this endpoint.

    Usage:
    - To log in an existing user, send a POST request to /login.

    Request Body Parameters:
    - username (str): The username of the user attempting to log in.
    - password (str): The password of the user attempting to log in.

    Optional Request Body Parameters:
    - return_user (bool): If true, include the user data in the response (default: False).
    - return_profile (bool): If true, include the user profile data in the response (default: False).

    Response:
    - A JSON response containing the user data and, if requested, the user profile data.

    Example Usage:
    ```
    # Log in an existing user and return user and profile data
    POST /login
    headers: { "X-CSRFToken": csrftoken }
    body: {
        "username": "existing_user",
        "password": "existing_password",
        "return_user": true,
        "return_profile": true
    }
    ```

    Note: This endpoint allows any user to log in, and additional options are available for returning user and profile data.
    """

    permission_classes = [AllowAny]

    auth_service = AuthService()
    user_service = UserService()
    user_profile_service = UserProfileService()

    def post(self, request, *args, **kwargs):
        """
        Log in an existing user.

        Args:
            request: The HTTP request object.

        Returns:
            Response: A response containing the user data and, if requested, the user profile data.
        """

        return_user: bool = request.data.get("return_user", False)
        return_profile: bool = request.data.get("return_profile", False)

        data: dict = {}

        try:
            user_instance: User = self.auth_service.authenticateAndLogin(request=request)

        except AuthenticationFailed as error:
            return Response(data=error.detail, status=status.HTTP_401_UNAUTHORIZED)

        if return_user:
            user: dict = UserSerializer(instance=user_instance).data
            data["user"] = user

        if return_profile:
            profile_instance: UserProfile = self.user_profile_service.get_by_user_id(id=user.id)
            profile: dict = UserProfileSerializer(instance=profile_instance).data
            data["user_profile"] = profile

        response = Response(status=status.HTTP_200_OK)
        response.data = data
        return response


class UserLogoutAPIView(APIView):
    """
    API view for user logout.

    This view allows an authenticated user to log out, ending their session.

    Endpoint:
    - POST /logout: Log out the authenticated user.

    Permissions:
    - IsAuthenticated: Only authenticated users are allowed to access this endpoint.

    Usage:
    - To log out the authenticated user, send a POST request to /logout.

    Response:
    - A JSON response indicating a successful logout.

    Example Usage:
    ```
    # Log out the authenticated user
    POST /logout
    headers: { "X-CSRFToken": csrftoken }
    ```

    Note: This endpoint requires the user to be authenticated, and it will end the user's current session.
    """

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        """
        Log out the authenticated user.

        Args:
            request: The HTTP request object.

        Returns:
            Response: A response indicating a successful logout.
        """
        logout(request=request)
        return Response(status=status.HTTP_202_ACCEPTED)


class UserSessionCheckAPIView(APIView):
    """
    API view for checking user session status.

    This view allows an authenticated user to check the status of their session.

    Endpoint:
    - GET /user/session/check: Check the status of the authenticated user's session.

    Permissions:
    - IsAuthenticated: Only authenticated users are allowed to access this endpoint.

    Usage:
    - To check the status of the authenticated user's session, send a GET request to /user/session/check.

    Response:
    - A JSON response indicating the authentication status and setting session-related headers.

    Example Usage:
    ```
    # Check the status of the authenticated user's session
    GET /user/session/check
    ```

    Note: This endpoint requires the user to be authenticated and provides information about the current session's status.
    """

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        """
        Check the status of the authenticated user's session.

        Args:
            request: The HTTP request object.

        Returns:
            Response: A response indicating the authentication status and setting session-related headers.
        """
        TTL = timedelta(hours=1)
        expiration_date = datetime.utcnow() + TTL

        response = Response(data={"is_authenticated": True}, status=status.HTTP_200_OK)
        response["Cache-Control"] = f"max-age={int(TTL.total_seconds())}"
        response["Expires"] = expiration_date.strftime("%a, %d %b %Y %H:%M:%S GMT")

        return response
