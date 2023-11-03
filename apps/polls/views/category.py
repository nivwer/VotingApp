# Virtualenv.
from dotenv import load_dotenv
# Django.
from django.core.paginator import Paginator
from django.contrib.auth.models import User
# Rest Framework.
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import ValidationError, PermissionDenied
from rest_framework.permissions import AllowAny
# Async Rest Framework support.
from adrf.decorators import api_view
# MongoDB connection.
from utils.mongo_connection import MongoDBSingleton
# MongoDB.
from pymongo import DESCENDING
from pymongo.errors import PyMongoError
from bson import json_util
from bson.objectid import ObjectId


# Load the virtual environment.
load_dotenv()


# Helpers.

# Get collections from a database in MongoDB.
class GetCollectionsMongoDB:
    def __init__(self, database, collections):
        # Get database.
        db = MongoDBSingleton().client[database]
        # Get collections.
        for collection in collections:
            setattr(self, collection, db[collection])


# Views.

# Handles the get process for a category polls.
@api_view(['GET'])
@permission_classes([AllowAny])
async def category_polls(request, category):
    # If user is login.
    is_login = True if request.user else False

    try:
        # Get collections from the polls database.
        polls_db = GetCollectionsMongoDB(
            'polls_db', ['polls', 'user_actions'])

        # Find the polls in the polls collection.
        polls_list = await polls_db.polls.find(
            {
                'category': category,
                '$or': [
                    {
                        'privacy': 'public'
                    },
                    {
                        'privacy': 'private',
                        'user_id': request.user.id
                    }
                ]},
            sort=[('created_at', DESCENDING)]
        ).to_list(length=None)

        # Convert the BSON response to a JSON response.
        polls_list_json = json_util._json_convert(polls_list)

        # Filter the polls.
        polls = []
        for poll in polls_list_json:
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
                user_actions_json = json_util._json_convert(
                    (user_actions_doc))

                poll['user_actions'] = user_actions_json if user_actions_json is not None else {}

            polls.append(poll)

        # If polls not found.
        if not polls:
            return Response(
                {'message': 'Polls not found.'})

        # In case the frontend has pagination or an integrated infinite scroll.
        if request.GET.get('page'):
            page_number = request.GET.get('page')
            paginator = Paginator(polls, 10)
            page_obj = paginator.get_page(page_number)

            page_values_json = json_util._json_convert(page_obj.object_list)

        # Polls res.
        res = page_values_json if request.GET.get('page') else polls

        # Response.
        return Response(
            {'polls':  res},
            status=status.HTTP_200_OK)

    # Handle validation errors.
    except ValidationError as e:
        return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

    # Handle if the user is not found.
    except User.DoesNotExist:
        return Response(
            {'username': ['User is not found.']},
            status=status.HTTP_404_NOT_FOUND)

    # Handle permission denied.
    except PermissionDenied as e:
        return Response(e.detail, status=status.HTTP_403_FORBIDDEN)

    # Handle MongoDB errors.
    except PyMongoError as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Handle other exceptions.
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
