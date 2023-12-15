from django.contrib.auth import logout

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import ValidationError, AuthenticationFailed

from apps.accounts.repositories.user_profile_repository import UserProfileRepository
from apps.accounts.repositories.user_repository import UserRepository
from apps.accounts.services.auth_service import AuthService


# Endpoint: "UserRegisterAPIView"

# --- Purpose ---
# Create a new account by providing a unique username and password.

# --- Request Data ---
# Expects a JSON payload containing:
# - username: The desired unique username for the new account.
# - password: The password for the new account.

# --- Response ---
#   - 200 OK: Successful account creation.
#   - 400 Bad Request: Validation errors in the request payload.

# --- Authorship and Date ---
# Author: nivwer
# Last Updated: 2023-11-21


class UserRegisterAPIView(APIView):
    permission_classes = [AllowAny]
    user_repository = UserRepository()
    user_profile_repository = UserProfileRepository()
    auth_service = AuthService()

    def post(self, request):
        login_user = request.data.get("login_user", False)

        try:
            user = self.user_repository.create_user(request.data)
            self.user_profile_repository.create(
                data={"user": user.pk, "profile_name": user.username}
            )

        except ValidationError as error:
            return Response(data=error.detail, status=status.HTTP_400_BAD_REQUEST)

        if login_user:
            try:
                user = self.auth_service.authenticateAndLogin(request=request)

            except AuthenticationFailed as error:
                return Response(data=error.detail, status=status.HTTP_401_UNAUTHORIZED)

        return Response(status=status.HTTP_201_CREATED)


class UserLoginAPIView(APIView):
    permission_classes = [AllowAny]
    auth_service = AuthService()

    def post(self, request):
        try:
            self.auth_service.authenticateAndLogin(request=request)

        except AuthenticationFailed as error:
            return Response(data=error.detail, status=status.HTTP_401_UNAUTHORIZED)

        return Response(status=status.HTTP_200_OK)


class UserLogoutAPIView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request=request)
        return Response(status=status.HTTP_200_OK)
