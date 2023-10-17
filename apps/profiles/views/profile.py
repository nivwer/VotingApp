# Standard.
from datetime import datetime, timedelta
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


# Handles the reading of the user's own profile. (public and private data)
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

        # Time To Live.
        TTL = timedelta(hours=3)
        expiration_date = datetime.utcnow() + TTL

        # Cache Control.
        res = Response({'profile': profile_data}, content_type='application/json',
                       status=status.HTTP_200_OK)
        res['Cache-Control'] = f'max-age={int(TTL.total_seconds())}'
        res['Expires'] = expiration_date.strftime('%a, %d %b %Y %H:%M:%S GMT')

        # Response.
        return res

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


# Handles updating the user profile.
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
