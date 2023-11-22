# Django.
from django.contrib.auth.models import User
from django.db import transaction
from django.contrib.auth import update_session_auth_hash
# Rest Framework.
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError, AuthenticationFailed
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
# Models and Serializers.
from apps.accounts.serializers import UserSerializer


# Views.


# Endpoint: "User Me"

# Endpoint that retrieves the user information of the authenticated user.
# This view supports GET requests and requires the user to be authenticated with a valid session or token.

# --- Purpose ---
# Allows authenticated users to retrieve their user information.

# --- Authentication ---
# - Supports both Session and Token Authentication: Users can be authenticated using a valid session or token.
# - Permission is restricted to authenticated users only.

# --- Response ---
# - Returns a JSON response containing the serialized user information of the authenticated user.
# - The response includes relevant details such as username, email, and any additional user information.

# --- Error Handling ---
# - Handles authentication failures, ensuring that only authenticated users can access the profile.

# --- Authorship and Date ---
# Author: nivwer
# Last Updated: 2023-11-22

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def user_me(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


# Endpoint: "Update User Username"

# Endpoint that allows authenticated users to update their username.
# This view supports PUT requests and requires the user to be authenticated with a valid token.

# --- Purpose ---
# Enables authenticated users to change their username to a new, unique value.

# --- Authentication ---
# - Requires Token Authentication: Users must be authenticated using a valid token.
# - Permission is restricted to authenticated users only.

# --- Request Data ---
# - Expects a JSON payload with the key "new_username" containing the desired new username.

# --- Response ---
#   - 200 OK: Successful username update.
#   - 400 Bad Request: Validation errors in the request (e.g., missing or non-unique username).
#   - 401 Unauthorized: Authentication failed.
#   - 500 Internal Server Error: Other unexpected errors.

# --- Error Handling ---
# - Handles validation errors, authentication failures, and unexpected exceptions.
# - Returns relevant error responses with appropriate status codes.

# --- Authorship and Date ---
# Author: nivwer
# Last Updated: 2023-11-22

@api_view(['PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def user_me_update_username(request):
    try:
        new_username = request.data['new_username']

        if not new_username:
            raise ValidationError(
                detail={'new_username': ['This field is required.']})

        # If the new username is not unique.
        if User.objects.filter(username=new_username).exists():
            raise ValidationError(
                detail={'new_username': ['Username is already taken.']})

        # Save the new username.
        user = request.user
        user.username = new_username
        user.save()

        # Update the session auth hash to prevent logout.
        update_session_auth_hash(request, user)

        # Response.
        return Response(
            data={'message': 'Username updated successfully.'},
            status=status.HTTP_200_OK)

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


# Endpoint: "Update User Password"

# Endpoint that allows authenticated users to update their password.
# This view supports PUT requests and requires the user to be authenticated with a valid token.

# --- Purpose ---
# Enables authenticated users to change their password by providing their current password and a new one.

# --- Authentication ---
# - Requires Token Authentication: Users must be authenticated using a valid token.
# - Permission is restricted to authenticated users only.

# --- Request Data ---
# - Expects a JSON payload with the keys "current_password" and "new_password".
#   - "current_password": The user's current password for verification.
#   - "new_password": The desired new password.

# --- Response ---
#   - 200 OK: Successful password update.
#   - 400 Bad Request: Validation errors in the request (e.g., missing current or new password, incorrect current password).
#   - 401 Unauthorized: Authentication failed.
#   - 500 Internal Server Error: Other unexpected errors.

# --- Error Handling ---
# - Handles validation errors, authentication failures, and unexpected exceptions.
# - Returns relevant error responses with appropriate status codes.

# --- Transactional Operation ---
# - Uses a database transaction to ensure the atomicity of the password update operation.

# --- Authorship and Date ---
# Author: nivwer
# Last Updated: 2023-11-21

@api_view(['PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@transaction.atomic
def user_me_update_password(request):
    try:
        current_password = request.data['current_password']
        new_password = request.data['new_password']

        if not current_password:
            raise ValidationError(
                detail={'current_password': ['This field is required.']})

        if not new_password:
            raise ValidationError(
                detail={'new_password': ['This field is required.']},)

        user = request.user

        # Check if the current password is correct.
        if not user.check_password(current_password):
            raise ValidationError(
                detail={'current_password': ['Current password is incorrect.']})

        # Save the password.
        user.set_password(new_password)
        user.save()

        # Update the session auth hash to prevent logout.
        update_session_auth_hash(request, user)

        return Response(
            data={'message': 'Password updated successfully.'},
            status=status.HTTP_200_OK)

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
