# BSON.
from bson import json_util
# Django.
from django.contrib.auth.models import User
from django.core.paginator import Paginator
# Rest Framework.
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny
# Async Rest Framework support.
from adrf.decorators import api_view
# MongoDB connection.
from utils.mongo_connection import MongoDBSingleton
# PyMongo.
from pymongo.errors import PyMongoError


# Views.


# Endpoint: "Explore Users"

# Endpoint that allows users to explore other users.
# This view supports GET requests and does not require authentication.

# --- Purpose ---
# Allows users to discover and explore profiles of other users.

# --- Query Parameters ---
# - page (optional, default=1): The page number for pagination.
# - page_size (optional, default=4): The number of polls to display per page.

# --- Access Control ---
# Open to any user; no authentication required.

# --- Responses ---
# - 200 OK: List of items, with pagination details.
#   Additionally, includes a message if the current page has no next page.
# - 400 Bad Request: Validation errors.
# - 500 Internal Server Error: MongoDB errors or other unexpected exceptions.

# --- Pagination ---
# Supports paginating through the search results with details like total pages, total items, etc.

# --- Error Handling ---
# - Handles validation errors, MongoDB errors, and other exceptions gracefully.
# - Returns appropriate error responses with status codes:

# --- Authorship and Date ---
# Author: nivwer
# Last Updated: 2023-12-2

@api_view(['GET'])
@permission_classes([AllowAny])
async def explore_users(request):

    # Get query parameters.
    page = request.GET.get('page') or '1'
    page_size = request.GET.get('page_size') or '4'

    try:
        # Connect to the MongoDB databases.
        polls_db = MongoDBSingleton().client['polls_db']

        user_poll_actions = await polls_db.user_actions.find(
            {},
            {'_id': 0, 'poll_id': 1}
        ).to_list(None)

        users_bson = await polls_db.user_actions.aggregate([
            {'$match': {
                'poll_id': {'$in': [x['poll_id'] for x in user_poll_actions]}}
             },
            {'$group': {'_id': '$user_id'}}
        ]).to_list(None)

        new_users_bson = [
            user for user in users_bson if user['_id'] != request.user.id]

        # Convert BSON to JSON.
        users_json = json_util._json_convert(new_users_bson)

        ### PAGINATION. ###

        if page:
            page_number = int(page)
            page_size_number = int(page_size)
            paginator = Paginator(users_json, page_size_number)

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
        users_list = page_obj.object_list if page else users_json

        # Extract relevant information for each poll.
        items = []
        for user in users_list:
            # Get poll user data.
            user_data = await User.objects.filter(
                id=user['_id']
            ).values(
                'username',
                'userprofile__profile_picture',
                'userprofile__profile_name'
            ).afirst()

            item = {}
            item['user'] = {
                'username': user_data['username'],
                'profile_picture': user_data['userprofile__profile_picture'],
                'profile_name': user_data['userprofile__profile_name']
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

    # Handle MongoDB errors.
    except PyMongoError as error:
        
        print(error)
        return Response(
            data={'message': 'Internal Server Error'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Handle other exceptions.
    except Exception as error:
        print(error)
        return Response(
            data={'message': 'Internal Server Error'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
