# Django.
from django.contrib.auth.models import User
# Rest Framework.
from rest_framework import status
from rest_framework.exceptions import ValidationError, PermissionDenied
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
# Serializers.
from apps.profiles.models import UserProfile
from apps.profiles.serializers import UserProfileSerializer


# Views.


# Endpoint: "Profile Me"

# Endpoint to retrieve the authenticated user's profile information.
# This view supports GET requests and requires session and token-based authentication, allowing only authenticated users to access their profile information.

# --- Purpose ---
# Retrieves and returns the profile data of the authenticated user. The profile information includes details such as username, profile picture, and profile name.

# --- Permissions ---
# Requires the user to be authenticated (logged in) using either session or token-based authentication.

# --- Response ---
# Returns a JSON object containing the profile data of the authenticated user.

# --- Error Handling ---
# Handles validation errors, user not found errors, profile not found errors, and other exceptions.
# Provides appropriate responses and status codes for different error scenarios.

# --- Authorship and Date ---
# Author: nivwer
# Last Updated: 2023-11-21

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def profile_me(request):
    try:
        # Fetch the user object based on user id.
        user = User.objects.get(id=request.user.id)

        # Get the profile instance based on user pk.
        profile_object = UserProfile.objects.get(user=user.pk)
        profile_data = UserProfileSerializer(instance=profile_object).data

        return Response(
            data={'profile': profile_data},
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


# Endpoint: "Profile Me Update"

# Endpoint to update the authenticated user's profile information.
# This view supports PATCH requests and requires session and token-based authentication, allowing only authenticated users to update their profile.

# --- Purpose ---
# Updates the profile information of the authenticated user based on the provided data. The update is partial, allowing modification of specific fields.

# --- Permissions ---
# Requires the user to be authenticated (logged in) using either session or token-based authentication. Only the owner of the profile can update their own information.

# --- Response ---
# Returns a success message indicating that the profile was updated successfully.

# --- Error Handling ---
# Handles validation errors, permission denied errors, user not found errors, profile not found errors, and other exceptions.
# Provides appropriate responses and status codes for different error scenarios.

# --- Authorship and Date ---
# Author: nivwer
# Last Updated: 2023-11-21

@api_view(['PATCH'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def profile_me_update(request):
    try:
        # Fetch the user object based on user id.
        user = User.objects.get(id=request.user.id)
        # Fetch the profile object based on user pk.
        profile = UserProfile.objects.get(pk=user.pk)

        # Initialize a UserSerializer instance with the provided data.
        profile_serializer = UserProfileSerializer(
            profile, data=request.data, partial=True)
        # Throws ValidationError if not valid.
        profile_serializer.is_valid(raise_exception=True)
        profile_serializer.save()

        # Response.
        return Response('Profile updated successfully')

     # Handle validation errors.
    except ValidationError as error:
        return Response(
            data=error.detail,
            status=status.HTTP_400_BAD_REQUEST)

    # Handle permission denied.
    except PermissionDenied as error:
        return Response(
            data=error.detail,
            status=status.HTTP_403_FORBIDDEN)

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
