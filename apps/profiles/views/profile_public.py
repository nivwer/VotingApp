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

# Handles the getting user public profiles by username. (public data)
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
