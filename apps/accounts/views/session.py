from datetime import datetime, timedelta
from django.contrib.auth import authenticate, login, logout
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import ValidationError, AuthenticationFailed
from rest_framework.authtoken.models import Token
from apps.profiles.models import UserProfile
from apps.accounts.serializers import UserSerializer
from apps.profiles.serializers import UserProfileSerializer
from apps.accounts.services.user_service import UserService
from apps.accounts.services.user_profile_service import ProfileService


# Views.

# Endpoint: "Sign Up"

# Endpoint that allows users to sign up for a new account.
# This view supports POST requests and is open to any user, requiring no specific authentication.

# --- Purpose ---
# Enables users to create a new account by providing a unique username and password.

# --- Request Data ---
# Expects a JSON payload containing:
# - username: The desired unique username for the new account.
# - password: The password for the new account.

# --- Cookies ---
# - Sets an HTTP cookie with the session key for subsequent authenticated requests.

# --- Response ---
#   - 200 OK: Successful account creation.
#   - 400 Bad Request: Validation errors in the request payload.
#   - 401 Unauthorized: Authentication failed during the sign-up process.

# --- Authorship and Date ---
# Author: nivwer
# Last Updated: 2023-11-21


class SignUp(APIView):
    permission_classes = [AllowAny]
    user_service = UserService()
    profile_service = ProfileService()

    def post(self, request):
        try:
            user_serializer = UserSerializer(data=request.data)
            user_serializer.is_valid(raise_exception=True)
            user = self.user_service.create_user(user_serializer.validated_data)

            profile_serializer = UserProfileSerializer(
                data={"user": user.pk, "profile_name": user.username}
            )
            profile_serializer.is_valid(raise_exception=True)
            self.profile_service.create(profile_serializer.validated_data)

            user = authenticate(
                request=request,
                username=request.data["username"],
                password=request.data["password"],
            )

            if user is None:
                raise AuthenticationFailed(
                    detail={"password": ["Failed authentication."]}
                )

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

        except ValidationError as error:
            return Response(data=error.detail, status=status.HTTP_400_BAD_REQUEST)

        except AuthenticationFailed as error:
            return Response(data=error.detail, status=status.HTTP_401_UNAUTHORIZED)


# Endpoint: "Sign In"

# Endpoint that allows users to sign in and authenticate their credentials.
# This view supports POST requests and is open to any user, requiring no specific authentication.

# --- Purpose ---
# Enables users to sign in to their accounts by providing their username and password.

# --- Request Data ---
# Expects a JSON payload containing:
# - username: The username associated with the user's account.
# - password: The password for the user's account.

# --- Cookies ---
# - Sets an HTTP cookie with the session key for subsequent authenticated requests.

# --- Response ---
#   - 200 OK: Successful login.
#   - 400 Bad Request: Validation errors in the request payload.
#   - 401 Unauthorized: Authentication failed during the sign-in process.

# --- Authorship and Date ---
# Author: nivwer
# Last Updated: 2023-11-21


class SignIn(APIView):
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

            login(request=request, user=user)

            if not request.session.session_key:
                request.session.save()

            response = Response(status=status.HTTP_200_OK)

            response.set_cookie(
                key="session",
                value=request.session.session_key,
                httponly=True,
                secure=False,
                samesite="Lax",
                max_age=30 * 24 * 60 * 60,  # d*h*m*seconds
            )

            return response

        except AuthenticationFailed as error:
            return Response(data=error.detail, status=status.HTTP_401_UNAUTHORIZED)


# Endpoint: "Sign Out"

# Endpoint that allows authenticated users to sign out and terminate their session.
# This view supports POST requests and requires the user to be authenticated with a valid session.

# --- Purpose ---
# Enables authenticated users to sign out, terminating their session and logging them out.

# --- Authentication ---
# - Requires Session Authentication: Users must be authenticated through an active session.
# - Permission is restricted to authenticated users only.

# --- Response ---
#   - 200 OK: Successful logout.

# --- Authorship and Date ---
# Author: nivwer
# Last Updated: 2023-11-21


class SignOut(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request=request)
        return Response(status=status.HTTP_200_OK)


# Endpoint: "User Session Check"

# Endpoint that allows authenticated users to check their session details.
# This view supports GET requests and requires the user to be authenticated with a valid session.

# --- Purpose ---
# Enables authenticated users to check their session details, including user information and associated token.

# --- Authentication ---
# - Requires Session Authentication: Users must be authenticated through an active session.
# - Permission is restricted to authenticated users only.


# --- Caching Details ---
# - TTL: Time To Live for the cache is set to 1 day.
# - Cache Control Headers: Utilizes headers to control caching behavior, specifying the maximum age and expiration date of the cache.

# --- Response ---
#   - 200 OK: Returns a JSON response with the user's token, user details (excluding password), and user profile information.
#   - 400 Bad Request: Validation errors in the request.
#   - 401 Unauthorized: Authentication failed.
#   - 500 Internal Server Error: Other unexpected errors.

# --- Error Handling ---
# - Handles validation errors, authentication failures, and unexpected exceptions.
# - Returns relevant error responses with appropriate status codes.

# --- Authorship and Date ---
# Author: nivwer
# Last Updated: 2023-11-21


class SessionCheck(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user

            token, created = Token.objects.get_or_create(user=user)

            user_serializer = UserSerializer(instance=user)
            user_data = user_serializer.data
            user_data.pop("password")

            user_profile = UserProfile.objects.get(user=user)
            profile_data = UserProfileSerializer(instance=user_profile).data

            TTL = timedelta(days=1)
            expiration_date = datetime.utcnow() + TTL

            response = Response(
                data={
                    "token": token.key,
                    "user": user_data,
                    "profile": profile_data,
                },
                content_type="application/json",
                status=status.HTTP_200_OK,
            )
            response["Cache-Control"] = f"max-age={int(TTL.total_seconds())}"
            response["Expires"] = expiration_date.strftime("%a, %d %b %Y %H:%M:%S GMT")

            return response

        except ValidationError as error:
            return Response(data=error.detail, status=status.HTTP_400_BAD_REQUEST)

        except AuthenticationFailed as error:
            return Response(data=error.detail, status=status.HTTP_401_UNAUTHORIZED)

        except Exception as error:
            print(error)
            return Response(
                data={"message": "Internal Server Error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
