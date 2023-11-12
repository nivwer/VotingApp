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
from bson import json_util
from bson.objectid import ObjectId
# MongoDB.
from pymongo import DESCENDING
from pymongo.errors import PyMongoError


# Get databases.
polls_db = MongoDBSingleton().client['polls_db']


# Views.

# Handles the users searches.
@api_view(['GET'])
@permission_classes([AllowAny])
async def search_polls(request):
    # If user is login.
    is_login = True if request.user else False

    keyword = request.GET.get('query')

    try:
        # Get the polls.
        if keyword:
            polls_bson = await polls_db.polls.find(
                {
                    '$text': {'$search': keyword},
                    '$or': [
                        {
                            'privacy': 'public'
                        },
                        {
                            'privacy': 'private',
                            'user_id': request.user.id
                        }
                    ]},
            ).to_list(None)
        else:
            raise ValidationError('Keyword not exist')

        # Convert the BSON response to a JSON response.
        polls_json = json_util._json_convert(polls_bson)

        # Pagination.
        if request.GET.get('page'):
            page_number = int(request.GET.get('page'))
            paginator = Paginator(polls_json, 3)

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

        # Polls list.
        polls_list = page_obj.object_list if request.GET.get(
            'page') else polls_json

        # Filter the polls.
        polls = []
        for poll in polls_list:

            # Fix poll data.
            poll['_id'] = poll['_id']['$oid']
            poll['created_at'] = poll['created_at']['$date']

            # Get the user data.
            user_data = await User.objects.filter(
                id=poll['user_id']
            ).values(
                'username',
                'userprofile__profile_picture',
                'userprofile__profile_name'
            ).afirst()

            if user_data:
                poll['profile'] = {
                    'username': user_data['username'],
                    'profile_picture': user_data['userprofile__profile_picture'],
                    'profile_name': user_data['userprofile__profile_name']
                }

            # If is login.
            if is_login:
                # Find the user actions.
                user_actions_doc = await polls_db.user_actions.find_one(
                    {
                        'user_id': request.user.id,
                        'poll_id': ObjectId(poll['_id'])
                    },
                    projection={
                        '_id': 0,
                        'has_voted': 1,
                        'has_shared': 1,
                        'has_bookmarked': 1
                    }
                )

                # Convert the BSON to a JSON.
                user_actions_json = json_util._json_convert((user_actions_doc))

                poll['user_actions'] = user_actions_json if user_actions_json is not None else {}

            polls.append(poll)

        return Response({
            'items': polls,
            'paginator': {
                'has_next': has_next,
                'total_pages':  total_pages,
                'total_items': total_items,
            },
        })

    # Handle validation errors.
    except ValidationError as e:
        return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

    # Handle MongoDB errors.
    except PyMongoError as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Handle other exceptions.
    except Exception as e:
        print(str(e))
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
