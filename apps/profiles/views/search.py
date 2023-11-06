# Standard.
from bson import json_util
# Django.
from django.contrib.auth.models import User
from django.core.paginator import Paginator
from django.db import transaction
from django.contrib.auth import update_session_auth_hash
# Rest Framework.
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError, AuthenticationFailed
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
# Models and Serializers.
from apps.accounts.serializers import UserSerializer
from apps.profiles.models import UserProfile


# Create your views here.


# Handles the users searches.
@api_view(['GET'])
@authentication_classes([AllowAny])
@permission_classes([IsAuthenticated])
def search_users(request):
    keyword = request.GET.get('query')

    try:
        # Get the users.
        if keyword:
            users = User.objects.filter(
                username__icontains=keyword
            ).values(
                'username', 'id')
        else:
            users = User.objects.all()

        # Pagination.
        if request.GET.get('page'):
            page_number = request.GET.get('page')
            paginator = Paginator(users, 10)
            page_obj = paginator.get_page(page_number)

            page_values_json = json_util._json_convert(page_obj.object_list)

        # Users res.
        users_list = page_values_json if request.GET.get('page') else users

        profiles_list = []
        for user in users_list:
            # Get the user profile.
            user_profile = User.objects.filter(id=user.id).values(
                'username', 'userprofile__profile_picture', 'userprofile__profile_name').first()

            profiles_list.append(user_profile)

        return Response(users_list)

    # Handle validation errors.
    except ValidationError as e:
        return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

    # Handle other exceptions.
    except Exception as e:
        print(str(e))
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
