# Django.
from django.contrib.auth.models import User
# Rest Framework.
from rest_framework import status
from rest_framework.exceptions import ValidationError, PermissionDenied
from rest_framework.response import Response
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
# Async Rest Framework support.
from adrf.decorators import api_view
# Serializers.
from .models import UserProfile
from .serializers import UserProfileSerializer
from apps.accounts.serializers import UserSerializer
from asgiref.sync import sync_to_async, async_to_sync

# Views.

# Handles the getting users profiles.
@api_view(['GET'])
async def get_profile(request, username):
    try:
        # Get the user instance based on username.
        #user_object = await sync_to_async(User.objects.get)(username=username)
        user = await User.objects.aget(username=username)
        # print(user_object)
        user_serializer = UserSerializer(instance=user).data
        #user_pk = user_serializer.instance.pk
        user_pk = user.pk

        #user_data = user_serializer.data

        print(user_serializer)



        # Get the profile instance based on user pk.
        #profile_object = await sync_to_async(UserProfile.objects.get)(user=user_pk)
        profile_object = await UserProfile.objects.aget(user=user_pk)
        profile_data = UserProfileSerializer(
             instance=profile_object).data

        #profile_data['username'] = user_data.username

        # Is owner.
        #is_owner = user_data.username == request.user.username

        # Response.
        return Response(
            {
               # 'is_owner': is_owner,
                #'profile': profile_data
            },
            status=status.HTTP_200_OK)

    # Handle validation errors.
    except ValidationError as e:
        return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

    # Handle if the user is not found.
    except User.DoesNotExist:
        return Response({'username': ['User is not found.']}, status=status.HTTP_404_NOT_FOUND)
    
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
async def update_profile(request, user_id):
    try:
        # Fetch the user instance based on user_id.
        user = await User.objects.aget(id=user_id)

        # If user is not authorized.
        is_owner = user.id == request.user.id
        if not is_owner:
            raise PermissionDenied('Not Authorized.')

        # Initialize a UserSerializer instance with the provided data.
        profile_serializer = UserProfileSerializer(user, data=request.data)
        # Throws ValidationError if not valid.
        profile_serializer.is_valid(reaise_exception=True)
        await profile_serializer.save()

        # Response.
        return Response('Profile updated successfully')

    # Handle validation errors.
    except ValidationError as e:
        return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

    # Handle permission denied.
    except PermissionDenied as e:
        return Response(e.detail, status=status.HTTP_403_FORBIDDEN)

    # Handle if the user is not found.
    except User.DoesNotExist:
        return Response({'username': ['User is not found.']}, status=status.HTTP_404_NOT_FOUND)

    # Handle other exceptions.
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
