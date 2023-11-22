# Django.
from django.contrib.auth.models import User
from django.core.paginator import Paginator
# Rest Framework.
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import api_view,  permission_classes
from rest_framework.permissions import AllowAny


# Views.


# Endpoint: "Search Users"

# Endpoint that allows searching for users based on a provided keyword.
# This view supports GET requests and is open to any user, requiring no specific authentication.

# --- Purpose ---
# Enables users to search for other users by providing a keyword, returning relevant user profiles.

# --- Query Parameters ---
# - query (required): The keyword used for searching users.
# - page (optional, default=1): The page number for pagination.
# - page_size (optional, default=4): The number of polls to display per page.

# --- Access Control ---
# Open to any user; no authentication required.

# --- Response ---
# # - 200 OK: Returns a JSON response containing a list of user profiles, with pagination details
# - 400 Bad Request: Missing or invalid keyword.
# - 500 Internal Server Error: Unexpected exceptions.

# --- Pagination ---
# Supports paginating through the search results with details like total pages, total items, etc.

# --- Error Handling ---
# - Validates if the required query parameter 'keyword' is provided.
# - Handles validation errors, returning a 400 Bad Request response with error details.
# - Handles other exceptions, returning a 500 Internal Server Error response.

# --- Authorship and Date ---
# Author: nivwer
# Last Updated: 2023-11-21

@api_view(['GET'])
@permission_classes([AllowAny])
def search_users(request):

    # Get query parameters.
    keyword = request.GET.get('query')
    page = request.GET.get('page') or '1'
    page_size = request.GET.get('page_size') or '4'

    # Validate if the query parameter is provided.
    if not keyword:
        raise ValidationError(
            {'message': 'Keyword is not provided'})

    try:
        # Find the users object based on the keyword in the users table.
        users = User.objects.filter(
            username__icontains=keyword
        ).order_by(
            '-date_joined'
        ).values(
            'username', 'id')

        ### PAGINATION. ###

        if page:
            page_number = int(page)
            page_size_number = int(page_size)
            paginator = Paginator(users, page_size_number)

            total_pages = paginator.num_pages
            total_items = paginator.count

            if total_items == 0:
                return Response(
                    data={
                        'items': [],
                        'message': 'No result found',
                        'paginator':
                        {
                            'page': page_number,
                            'total_pages':  total_pages,
                            'total_items': total_items,
                            'has_previous': False,
                            'has_next': False,
                        }
                    })

            page_obj = paginator.get_page(page_number)
            has_previous = page_obj.has_previous()
            has_next = page_obj.has_next()

            message = ''
            if not has_next:
                message = 'No more results'

        ### PAGINATION. ###

        # Users list.
        users_list = page_obj.object_list if page else users

        # Extract relevant information for each user.
        items = []
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

            item = {}

            item['user'] = {
                'username': user_data['username'],
                'profile_picture': user_data['userprofile__profile_picture'],
                'profile_name': user_data['userprofile__profile_name'],
                'bio': user_data['userprofile__bio']
            }

            items.append(item)

        # Response.
        return Response(
            data={
                'items': items,
                'message': message,
                'paginator': {
                    'page': page_number,
                    'total_items': total_items,
                    'total_pages':  total_pages,
                    'has_previous': has_previous,
                    'has_next': has_next,
                },
            },
            status=status.HTTP_200_OK)

    # Handle validation errors.
    except ValidationError as error:
        return Response(
            data=error.detail,
            status=status.HTTP_400_BAD_REQUEST)

    # Handle other exceptions.
    except Exception as error:
        return Response(
            data={'message': 'Internal Server Error'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
