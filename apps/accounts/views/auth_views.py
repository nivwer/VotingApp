from django.contrib.auth import authenticate, login, logout
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import ValidationError, AuthenticationFailed
from rest_framework.authtoken.models import Token
from apps.accounts.repositories.user_profile_repository import UserProfileRepository
from apps.accounts.repositories.user_repository import UserRepository


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

    def post(self, request):
        try:
            user = self.user_repository.create_user(request.data)
            self.user_profile_repository.create(
                data={"user": user.pk, "profile_name": user.username}
            )
        except ValidationError as error:
            return Response(data=error.detail, status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_201_CREATED)


class UserRegisterAndLoginAPIView(APIView):
    permission_classes = [AllowAny]
    user_repository = UserRepository()
    user_profile_repository = UserProfileRepository()

    def post(self, request):
        try:
            user = self.user_repository.create_user(request.data)
            profile = self.user_profile_repository.create(
                data={"user": user.pk, "profile_name": user.username}
            )
        except ValidationError as error:
            return Response(data=error.detail, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = authenticate(
                request=request,
                username=request.data["username"],
                password=request.data["password"],
            )

            if user is None:
                raise AuthenticationFailed(
                    detail={"password": ["Failed authentication."]}
                )

        except AuthenticationFailed as error:
            return Response(data=error.detail, status=status.HTTP_401_UNAUTHORIZED)

        login(request=request, user=user)

        if not request.session.session_key:
            request.session.save()

        response = Response(status=status.HTTP_201_CREATED)

        response.set_cookie(
            key="session",
            value=request.session.session_key,
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=30 * 24 * 60 * 60,  # d*h*m*seconds
        )

        return response


class UserLoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            user = authenticate(
                request=request,
                username=request.data["username"],
                password=request.data["password"],
            )

            if user is None:
                raise AuthenticationFailed(
                    detail={"password": ["Failed authentication."]}
                )

        except AuthenticationFailed as error:
            return Response(data=error.detail, status=status.HTTP_401_UNAUTHORIZED)

        login(request=request, user=user)

        if not request.session.session_key:
            request.session.save()

        response = Response(status=status.HTTP_201_CREATED)

        response.set_cookie(
            key="session",
            value=request.session.session_key,
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=30 * 24 * 60 * 60,  # d*h*m*seconds
        )

        return response


class UserLogoutAPIView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request=request)
        return Response(status=status.HTTP_200_OK)
