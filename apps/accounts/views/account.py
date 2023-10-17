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

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def user_me(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


# Handles the username update process.
@api_view(['PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def user_me_update_username(request):
    try:
        new_username = request.data['new_username']

        if not new_username:
            raise ValidationError(
                {'new_username': ['This field is required.']})

        # If the new username is not unique.
        if User.objects.filter(username=new_username).exists():
            raise ValidationError(
                {'new_username': ['Username is already taken.']})

        # Save the new username.
        user = request.user
        user.username = new_username
        user.save()

        # Update the session auth hash to prevent logout.
        update_session_auth_hash(request, user)

        # Response.
        return Response(
            {'message': 'Username updated successfully.'},
            status=status.HTTP_200_OK)

    # Handle validation errors.
    except ValidationError as e:
        return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

    # Handle Authentication errors.
    except AuthenticationFailed as e:
        return Response(e.detail, status=status.HTTP_401_UNAUTHORIZED)

    except Exception as e:
        print({"error": str(e)})
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Handles the password update process.
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
                {'current_password': ['This field is required.']})

        if not new_password:
            raise ValidationError(
                {'new_password': ['This field is required.']},)

        user = request.user

        # Check if the current password is correct.
        if not user.check_password(current_password):
            raise ValidationError(
                {'current_password': ['Current password is incorrect.']})

        # Save the password.
        user.set_password(new_password)
        user.save()

        # Update the session auth hash to prevent logout.
        update_session_auth_hash(request, user)

        return Response(
            {'message': 'Password updated successfully.'},
            status=status.HTTP_200_OK)

    # Handle validation errors.
    except ValidationError as e:
        return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

    # Handle Authentication errors.
    except AuthenticationFailed as e:
        return Response(e.detail, status=status.HTTP_401_UNAUTHORIZED)

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
