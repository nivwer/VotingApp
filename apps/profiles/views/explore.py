# Standard.
from datetime import datetime
# BSON.
from bson import json_util
from bson.objectid import ObjectId
# Django.
from django.contrib.auth.models import User
from django.core.paginator import Paginator
# Rest Framework.
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError, NotFound
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny
# Async Rest Framework support.
from adrf.decorators import api_view
# MongoDB connection.
from utils.mongo_connection import MongoDBSingleton
# PyMongo.
from pymongo.errors import PyMongoError


# Views.


@api_view(['GET'])
@permission_classes([AllowAny])
async def explore_users(request):
    # Check if the current user is authenticated.
    is_authenticated = True if request.user else False

    # Get query parameters.
    page = request.GET.get('page') or '1'
    page_size = request.GET.get('page_size') or '4'

    try:
        if is_authenticated:
            # Connect to the MongoDB databases.
            polls_db = MongoDBSingleton().client['polls_db']

            # Find the users that interacted with the same polls that the authenticated user interacted.
            users_bson = await polls_db.user_actions.aggregate([
                {
                    '$match': {'user_id': request.user.id}
                },
                {
                    '$lookup': {
                        'from': 'user_actions',
                        'localField': 'poll_id',
                        'foreignField': 'poll_id',
                        'as': 'interactions'
                    }
                },
                {
                    '$group': {
                        '_id': '$interactions.user_id',
                        'user_id': {'$first': '$interactions.user_id'}
                    }
                },
                {
                    '$unwind': '$interactions'
                },
                {
                    '$project': {'_id': 0, 'interactions.user_id': 1}
                }
            ]).to_list(None)
        else:
            # If the user is not authenticated, find all the users
            users_bson = await polls_db.user_actions.aggregate([
                {
                    '$group': {
                        '_id': None,
                        'unique_user_ids': {'$addToSet': '$user_id'}
                    }
                },
                {
                    '$unwind': '$unique_user_ids'
                },
                {
                    '$project': {'_id': 0, 'user_id': '$unique_user_ids'}
                }
            ]).to_list(None)

        # Convert BSON to JSON.
        users_json = json_util._json_convert(users_json)

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
                id=user['user_id']
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
        return Response(
            data={'message': 'Internal Server Error'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Handle other exceptions.
    except Exception as error:
        return Response(
            data={'message': 'Internal Server Error'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
