# Django.
from django.contrib.auth.models import User
# Rest Framework.
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
# Serializers.
from apps.profiles.models import UserProfile
from apps.profiles.serializers import UserProfileSerializer


# Views.

# Endpoint: "Profile by Username"

# Endpoint that retrieves the profile information for a user based on their username.
# This view supports GET requests and is open to any user, requiring no specific authentication.

# --- Purpose ---
# Retrieves and returns the profile information for a user specified by their username.

# --- Permissions ---
# Allows any user, regardless of authentication status, to access the profile information.

# --- Response ---
# Returns a JSON response containing the profile information, including username and date joined.

# --- Error Handling ---
# - Handles validation errors, returning a 400 Bad Request response with error details.
# - Handles cases where the specified user or profile is not found, returning a 404 Not Found response.

# --- Authorship and Date ---
# Author: nivwer
# Last Updated: 2023-11-21

@api_view(['GET'])
@permission_classes([AllowAny])
def profile_by_username(request, username):
    try:
        # Get the user object.
        user = User.objects.get(username=username)

        # Get the profile instance based on user pk.
        profile_object = UserProfile.objects.get(user=user.pk)
        profile_data = UserProfileSerializer(instance=profile_object).data

        profile_data['username'] = user.username
        profile_data['date_joined'] = user.date_joined

        # Response.
        return Response(
            {
                'profile': profile_data
            },
            status=status.HTTP_200_OK)

    # Handle validation errors.
    except ValidationError as error:
        return Response(
            data=error.detail,
            status=status.HTTP_400_BAD_REQUEST)

    # Handle if the user is not found.
    except User.DoesNotExist:
        return Response(
            data={'username': ['User is not found.']},
            status=status.HTTP_404_NOT_FOUND)

    # Handle if the user is not found.
    except UserProfile.DoesNotExist:
        return Response(
            data={'username': ['Profile is not found.']},
            status=status.HTTP_404_NOT_FOUND)

    # Handle other exceptions.
    except Exception as error:
        return Response(
            data={'message': 'Internal Server Error'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
