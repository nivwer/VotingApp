# Standard.
from datetime import datetime, timedelta
# Django.
from django.contrib.auth.models import User
from django.db import transaction
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
# Rest Framework.
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError, AuthenticationFailed
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import SessionAuthentication
from rest_framework.authtoken.models import Token
# Models and Serializers.
from apps.profiles.models import UserProfile
from apps.accounts.serializers import UserSerializer
from apps.profiles.serializers import UserProfileSerializer


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

# --- Authentication ---
# - Authenticates the user after successful account creation.
# - Uses the Django authentication system, including session and cookie management.

# --- Cookies ---
# - Sets an HTTP cookie with the session key for subsequent authenticated requests.

# --- Response ---
#   - 200 OK: Successful account creation.
#   - 400 Bad Request: Validation errors in the request payload.
#   - 401 Unauthorized: Authentication failed during the sign-up process.
#   - 500 Internal Server Error: Other unexpected errors.

# --- Error Handling ---
# - Handles validation errors, returning a 400 Bad Request response with error details.
# - Handles authentication failures, returning a 401 Unauthorized response with error details.
# - Handles other exceptions, returning a 500 Internal Server Error response.

# --- Authorship and Date ---
# Author: nivwer
# Last Updated: 2023-11-21

@api_view(['POST'])
@permission_classes([AllowAny])
@transaction.atomic
def sign_up(request):
    try:
        # Create the user data object.
        user_object = {
            'username': request.data['username'],
            'password': request.data['password'],
        }

        # Initialize a UserSerializer instance with the provided data.
        user_serializer = UserSerializer(data=user_object)
        user_serializer.is_valid(raise_exception=True)
        user_instance = user_serializer.save()

        # Set the password for the user using the provided password.
        user_object = User.objects.get(
            username=user_serializer.data['username'])
        user_object.set_password(user_serializer.data['password'])
        user_object.save()

        # Create user profile data object.
        profile_object = {
            'user': user_instance.pk,
            'profile_name': request.data['username']
        }

        # Initialize a ProfileSerializer instance.
        profile_serializer = UserProfileSerializer(data=profile_object)
        profile_serializer.is_valid(raise_exception=True)
        profile_serializer.save()

        # Authentication.
        user = authenticate(
            request=request,
            username=request.data['username'],
            password=request.data['password'])

        if user is not None:
            # Login.
            login(request, user)

            # Create or update the session in the cookie.
            session_key = request.session.session_key
            if not session_key:
                request.session.save()
                session_key = request.session.session_key

            # Response.
            response = JsonResponse(
                data={'message': "Account created successfully."},
                status=status.HTTP_200_OK)

            # Associate the session with the cookie.
            response.set_cookie(
                key='session',
                value=session_key,
                httponly=True,
                secure=False,
                samesite='Lax',
                max_age=30*24*60*60  # d*h*m*seconds
            )

            # Return.
            return response

        # Handle authentication failed.
        raise AuthenticationFailed(
            detail={'password': ['Failed authentication.']})

    # Handle validation errors.
    except ValidationError as error:
        return Response(
            data=error.detail,
            status=status.HTTP_400_BAD_REQUEST)

    # Handle autentication failed.
    except AuthenticationFailed as error:
        return Response(
            data=error.detail,
            status=status.HTTP_401_UNAUTHORIZED)

    # Handle other exceptions.
    except Exception as error:
        return Response(
            data={'message': 'Internal Server Error'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Endpoint: "Sign In"

# Endpoint that allows users to sign in and authenticate their credentials.
# This view supports POST requests and is open to any user, requiring no specific authentication.

# --- Purpose ---
# Enables users to sign in to their accounts by providing their username and password.

# --- Request Data ---
# Expects a JSON payload containing:
# - username: The username associated with the user's account.
# - password: The password for the user's account.

# --- Authentication ---
# - Authenticates the user using the provided username and password.
# - Utilizes the Django authentication system, including session and cookie management.

# --- Cookies ---
# - Sets an HTTP cookie with the session key for subsequent authenticated requests.

# --- Response ---
#   - 200 OK: Successful login.
#   - 400 Bad Request: Validation errors in the request payload.
#   - 401 Unauthorized: Authentication failed during the sign-in process.
#   - 500 Internal Server Error: Other unexpected errors.

# --- Error Handling ---
# - Handles validation errors, returning a 400 Bad Request response with error details.
# - Handles authentication failures, returning a 401 Unauthorized response with error details.
# - Handles other exceptions, returning a 500 Internal Server Error response.

# --- Authorship and Date ---
# Author: nivwer
# Last Updated: 2023-11-21

@api_view(['POST'])
@permission_classes([AllowAny])
def sign_in(request):
    try:
        # Authentication.
        user = authenticate(
            request=request,
            username=request.data['username'],
            password=request.data['password'])

        if user is not None:
            # Login.
            login(request, user)

            # Create or update the session in the cookie.
            session_key = request.session.session_key
            if not session_key:
                request.session.save()
                session_key = request.session.session_key

            # Response.
            response = JsonResponse(
                data={'message': "Successful login."},
                status=status.HTTP_200_OK)

            # Associate the session with the cookie
            response.set_cookie(
                key='session',
                value=session_key,
                httponly=True,
                secure=False,
                samesite='Lax',
                max_age=30*24*60*60  # d*h*m*seconds
            )

            # Return.
            return response

        # Handle authentication failed.
        raise AuthenticationFailed(
            detail={'password': ['Invalid username or password.']})

    # Handle validation errors.
    except ValidationError as error:
        return Response(
            data=error.detail,
            status=status.HTTP_400_BAD_REQUEST)

    # Handle autentication failed.
    except AuthenticationFailed as error:
        return Response(
            data=error.detail,
            status=status.HTTP_401_UNAUTHORIZED)

    # Handle other exceptions.
    except Exception as error:
        return Response(
            data={'message': 'Internal Server Error'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
#   - 500 Internal Server Error: Other unexpected errors.

# --- Error Handling ---
# - Handles unexpected exceptions, returning a 500 Internal Server Error response.

# --- Authorship and Date ---
# Author: nivwer
# Last Updated: 2023-11-21

@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def sign_out(request):
    try:
        # Logout.
        logout(request)

        # Response.
        return Response(
            data={'message': 'Successful logout.'},
            status=status.HTTP_200_OK)

    # Handle other exceptions.
    except Exception as error:
        return Response(
            data={'message': 'Internal Server Error'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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

@api_view(['GET'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def user_me_session_check(request):
    try:
        # The user is authenticated due to the 'IsAuthenticated' decorator.
        user = request.user

        # Get token associated with the user, or create a new token.
        token, created = Token.objects.get_or_create(user=user)

        # Get user data.
        user_serializer = UserSerializer(instance=user)
        user_data = user_serializer.data
        user_data.pop('password')

        # Get user profile data.
        user_profile = UserProfile.objects.get(user=user)
        profile_data = UserProfileSerializer(instance=user_profile).data

        # Time To Live.
        TTL = timedelta(days=1)
        expiration_date = datetime.utcnow() + TTL

        # Response.
        res = Response(
            data={
                'token': token.key,
                'user': user_data,
                'profile': profile_data,
            },
            content_type='application/json',
            status=status.HTTP_200_OK)

        # Cache Control.
        res['Cache-Control'] = f'max-age={int(TTL.total_seconds())}'
        res['Expires'] = expiration_date.strftime('%a, %d %b %Y %H:%M:%S GMT')

        # Return.
        return res

    # Handle validation errors.
    except ValidationError as error:
        return Response(
            data=error.detail,
            status=status.HTTP_400_BAD_REQUEST)

    # Handle autentication failed.
    except AuthenticationFailed as error:
        return Response(
            data=error.detail,
            status=status.HTTP_401_UNAUTHORIZED)

    # Handle other exceptions.
    except Exception as error:
        return Response(
            data={'message': 'Internal Server Error'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
