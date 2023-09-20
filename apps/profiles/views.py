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
from .models import UserProfile
from .serializers import UserProfileSerializer


# Views.


# Handles the read to user self profile. (private data)
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def read_profile(request):
    try:
        # Fetch the user object based on user id.
        user = User.objects.get(id=request.user.id)

        # Get the profile instance based on user pk.
        profile_object = UserProfile.objects.get(user=user.pk)
        profile_data = UserProfileSerializer(instance=profile_object).data

        # Response.
        return Response(
            {'profile': profile_data},
            status=status.HTTP_200_OK)

    # Handle validation errors.
    except ValidationError as e:
        return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

    # Handle if the user is not found.
    except User.DoesNotExist:
        return Response(
            {'username': ['User is not found.']},
            status=status.HTTP_404_NOT_FOUND)

    # Handle if the user is not found.
    except UserProfile.DoesNotExist:
        return Response(
            {'username': ['Profile is not found.']},
            status=status.HTTP_404_NOT_FOUND)

    # Handle other exceptions.
    except Exception as e:
        print(str(e))
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Handles the updating users profiles.
@api_view(['PATCH'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def update_profile(request):
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
    except ValidationError as e:
        print(e.detail)
        return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

    # Handle permission denied.
    except PermissionDenied as e:
        return Response(e.detail, status=status.HTTP_403_FORBIDDEN)

    # Handle if the user is not found.
    except User.DoesNotExist:
        return Response(
            {'username': ['User is not found.']},
            status=status.HTTP_404_NOT_FOUND)

    # Handle if the user is not found.
    except UserProfile.DoesNotExist:
        return Response(
            {'username': ['Profile is not found.']},
            status=status.HTTP_404_NOT_FOUND)

    # Handle other exceptions.
    except Exception as e:
        print(str(e))
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Handles the getting user public profiles. (public data)
@api_view(['GET'])
def get_profile(request, username):
    try:
        # Get the user object.
        user = User.objects.get(username=username)

        # Get the profile instance based on user pk.
        profile_object = UserProfile.objects.get(user=user.pk)
        profile_data = UserProfileSerializer(instance=profile_object).data

        profile_data['username'] = user.username
        profile_data['date_joined'] = user.date_joined

        # Is owner.
        is_owner = user.id == request.user.id

        # Response.
        return Response(
            {
                'is_owner': is_owner,
                'profile': profile_data
            },
            status=status.HTTP_200_OK)

    # Handle validation errors.
    except ValidationError as e:
        return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

    # Handle if the user is not found.
    except User.DoesNotExist:
        return Response(
            {'username': ['User is not found.']},
            status=status.HTTP_404_NOT_FOUND)

    # Handle if the user is not found.
    except UserProfile.DoesNotExist:
        return Response(
            {'username': ['Profile is not found.']},
            status=status.HTTP_404_NOT_FOUND)

    # Handle other exceptions.
    except Exception as e:
        print(str(e))
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
