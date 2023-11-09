# Django.
from django.contrib.auth.models import User
from django.core.paginator import Paginator
# Rest Framework.
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import api_view,  permission_classes
from rest_framework.permissions import AllowAny


# Create your views here.


# Handles the users searches.
@api_view(['GET'])
@permission_classes([AllowAny])
def search_users(request):
    keyword = request.GET.get('query')

    try:
        # Get the users.
        if keyword:
            users = User.objects.filter(
                username__icontains=keyword
            ).order_by(
                '-date_joined'
            ).values(
                'username', 'id')
        else:
            users = User.objects.all()

        # Pagination.
        if request.GET.get('page'):
            page_number = int(request.GET.get('page'))
            paginator = Paginator(users, 6)

            total_pages = paginator.num_pages
            total_items = paginator.count

            if page_number > total_pages or total_items == 0:
                return Response({
                    'message': 'No result found',
                    'paginator':
                    {
                        'has_next': False,
                        'total_pages':  total_pages,
                        'total_items': total_items,
                    }
                })

            page_obj = paginator.get_page(page_number)
            has_next = page_obj.has_next()

        # Users list.
        users_list = page_obj.object_list if request.GET.get('page') else users

        profiles_list = []
        for user in users_list:
            # Get the user profile.
            user_data = User.objects.filter(
                id=user['id']
            ).values(
                'username',
                'userprofile__profile_picture',
                'userprofile__profile_name',
                'userprofile__bio'
            ).first()

            profiles_list.append(
                {
                    'username': user_data['username'],
                    'profile_picture': user_data['userprofile__profile_picture'],
                    'profile_name': user_data['userprofile__profile_name'],
                    'bio': user_data['userprofile__bio']
                })

        return Response({
            'users': profiles_list,
            'paginator': {
                'has_next': has_next,
                'total_pages':  total_pages,
                'total_items': total_items,
            },
        })

    # Handle validation errors.
    except ValidationError as e:
        return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

    # Handle other exceptions.
    except Exception as e:
        print(str(e))
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
