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
    API view for user registration and optional profile creation.
    """

    permission_classes = [AllowAny]

    auth_service = AuthService()
    user_service = UserService()
    user_profile_service = UserProfileService()

    def post(self, request):
        """
        Allows users to register, and optionally create a user profile.

        Supports custom parameters in the request data to control the registration process.

        Usage:
            - To register a new user: Send a POST request with user data.
            - To log in the registered user: Include 'login_user' in the request data. ( Optional )
            - To create a user profile: Include 'create_profile' in the request data. ( Optional )
            - To return user information: Include 'return_user' in the request data. ( Optional )
            - To return profile information: Include 'return_profile' in the request data. ( Optional )

        Example Request:
        ```
        POST /register/
        {
            "username": "example_user",
            "password": "secure_password",
            "login_user": true,
            "create_profile": true,
            "return_user": true,
            "return_profile": true
        }
        ```

        Responses:
            - 200 OK: Successful account creation.
            - 400 Bad Request: Validation errors in the request payload.
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
    """

    permission_classes = [AllowAny]

    auth_service = AuthService()
    user_service = UserService()
    user_profile_service = UserProfileService()

    def post(self, request):
        """
        Allows users to log in.

        Supports custom parameters in the request data.

        Usage:
            - To log in a user: Send a POST request with user credentials.
            - To return user information: Include 'return_user' in the request data. ( Optional )
            - To return profile information: Include 'return_profile' in the request data. ( Optional )

        Example Request:
        ```
        POST /login/
        {
            "username": "example_user",
            "password": "secure_password",
            "return_user": true,
            "return_profile": true
        }
        ```

        Responses:
            - 200 OK: Successful login.
            - 400 Bad Request: Validation errors in the request payload.
            - 401 Unauthorized: Authentication failed during the log-in process.
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

    Requires session-based authentication using SessionAuthentication.
    """

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Allows authenticated users to log out.

        Usage:
            - To log out a user: Send a POST request to the '/logout/' endpoint.

        Example Request:
        ```
        POST /logout/
        ```

        Responses:
            - 200 OK: Successful logout.
            - 401 Unauthorized:  Authentication failed during the log-out process.
            - 403 Forbidden: Authentication credentials were not provided.
        """

        logout(request=request)
        return Response(data={"data_example": "dataexampletext"}, status=status.HTTP_202_ACCEPTED)


class UserSessionCheckAPIView(APIView):
    """
    API view for checking the validity of the user session.
    """

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Allows authenticated users to check if their session is still valid.

        Usage:
            - To check session validity: Send a GET request to the '/session_check/' endpoint.

        Example Request:
        ```
        GET /user/session/check/
        ```

        Responses:
            - 200 OK:
            - 401 Unauthorized: Authentication failed.
            - 403 Forbidden: Authentication credentials were not provided.
        """
        if request.user:
            TTL = timedelta(hours=1)
            expiration_date = datetime.utcnow() + TTL

            response = Response(data={"is_authenticated": True}, status=status.HTTP_200_OK)
            response["Cache-Control"] = f"max-age={int(TTL.total_seconds())}"
            response["Expires"] = expiration_date.strftime("%a, %d %b %Y %H:%M:%S GMT")

            return response
