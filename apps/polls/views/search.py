# Bson.
from bson import json_util
from bson.objectid import ObjectId
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
from pymongo import DESCENDING
from pymongo.errors import PyMongoError


# Views.


# Handles the polls searches.
@api_view(['GET'])
@permission_classes([AllowAny])
async def search_polls(request):
    # If user is login.
    is_login = True if request.user else False

    # Get Params.
    keyword = request.GET.get('query')
    page = request.GET.get('page') or '1'
    page_size = request.GET.get('page_size') or '4'

    try:
        # Get databases.
        polls_db = MongoDBSingleton().client['polls_db']

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
                    ]
                },
                sort=[('votes', DESCENDING)]
            ).to_list(None)
        else:
            raise ValidationError('Keyword not exist')

        # Convert the BSON  to a JSON.
        polls_json = json_util._json_convert(polls_bson)

        ### PAGINATION. ###

        if page:
            page_number = int(page)
            page_size_number = int(page_size)
            paginator = Paginator(polls_json, page_size_number)

            total_pages = paginator.num_pages
            total_items = paginator.count

            if total_items == 0 or page_number > total_pages:
                return Response({
                    'message': 'No result found',
                    'paginator':
                    {
                        'total_pages':  total_pages,
                        'total_items': total_items,
                        'has_previous': False,
                        'has_next': False,
                    }
                })

            page_obj = paginator.get_page(page_number)
            has_previous = page_obj.has_previous()
            has_next = page_obj.has_next()

        ### PAGINATION. ###

        # Polls list.
        polls_list = page_obj.object_list if page else polls_json

        # Filter the polls.
        polls = []
        for poll in polls_list:

            # Simplify poll data.
            poll['id'] = poll['_id']['$oid']
            del poll['_id']
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

            # Find the user actions..
            if is_login:
                user_actions_bson = await polls_db.user_actions.find_one(
                    {
                        'user_id': request.user.id,
                        'poll_id': ObjectId(poll['id'])
                    },
                    projection={
                        '_id': 0,
                        'has_voted': 1,
                        'has_shared': 1,
                        'has_bookmarked': 1
                    }
                )

                # Convert the BSON to a JSON.
                user_actions_json = json_util._json_convert(
                    (user_actions_bson))

                poll['user_actions'] = user_actions_json or {}

            polls.append(poll)

        return Response({
            'polls': polls,
            'paginator': {
                'total_items': total_items,
                'total_pages':  total_pages,
                'has_previous': has_previous,
                'has_next': has_next,
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
        return Response(
            {'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
