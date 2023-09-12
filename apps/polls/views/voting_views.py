# Standard.
import os
from datetime import datetime
# Virtualenv.
from dotenv import load_dotenv
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
# MongoDB connection.
from utils.mongo_connection import MongoDBSingleton
# MongoDB.
from pymongo.errors import PyMongoError
from bson import json_util
from bson.objectid import ObjectId
# Serializers.
from ..serializers import PollSerializer


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


@api_view(['GET', 'POST', 'PATCH', 'DELETE'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
async def voting_manager(request, poll_id):

    # Get the user in the User table.
    # user = await User.objects.aget(username=username)

    try:
        # Get collections from the polls database.
        polls_db = GetCollectionsMongoDB(
            'polls_db', ['polls', 'options'])
        # Get collections from the users database.
        users_db = GetCollectionsMongoDB(
            'users_db', ['voted_polls'])

        # Find the poll in the polls collection.
        poll_bson = await polls_db.polls.find_one(
            {'_id': ObjectId(poll_id)})
        # If poll is not found.
        if not poll_bson:
            raise ValidationError('Poll is not found.')

        # Find the user voted polls in the voted_polls collection.
        user_voted_polls = await users_db.voted_polls.find_one(
            {'user_id': request.user.id})
        

        # Method GET.
        if request.method == 'GET':
            # If the user has not voted a poll.
            if not user_voted_polls:
                return Response({'vote': ''})

            # Convert the BSON object to a JSON object.
            user_voted_polls_json = json_util._json_convert((user_voted_polls))

            # Get vote in the user voted polls object.
            for v in user_voted_polls_json['voted_polls']:
               if v['poll_id'] == poll_id:
                   return Response({'vote': v['vote']}) 
            

        # Method POST.
        if request.method == 'POST':
            # If the user has not voted a poll.
            if not user_voted_polls:
                # If poll is found.
                await users_db.voted_polls.insert_one(
                    {
                        'user_id': request.user.id,
                        'voted_polls': [
                            {
                                'poll_id': poll_id,
                                'vote': request.data['vote']
                            }
                        ]
                    })

        # Convert the BSON response to a JSON response.
        poll_json = json_util._json_convert((poll_bson))

        for voter in poll_json['voters']:
            if voter == request.user.username:
                is_voter = True

        if not is_voter:
            # Save the username in poll voters list.
            await polls_db.polls.update_one(
                {'poll_id': ObjectId(poll_id)},
                {'$push': {'voters': request.user.username}})

            # Add a vote in the option.
            await polls_db.options.update_one(
                {'poll_id': ObjectId(poll_id),
                 'options.option_text': request.data['add_vote_option_text']},
                {'$inc': {'options.$.votes': 1}}
            )

        return Response('res')

    # Handle validation errors.
    except ValidationError as e:
        return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

    # Handle MongoDB errors.
    except PyMongoError as e:
        print(f'MongoDB Error: {e}')
        return Response(
            {'error': 'An error occurred while processing your request.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Handle other exceptions.
    except Exception as e:
        print(f'Error: {e}')
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
