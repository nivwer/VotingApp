# Standard.
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
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import TokenAuthentication
# Async Rest Framework support.
from adrf.decorators import api_view
# MongoDB connection.
from utils.mongo_connection import MongoDBSingleton
# MongoDB.
from pymongo.errors import PyMongoError
from bson import json_util
from bson.objectid import ObjectId
# Models and Serializers.
from ..serializers import PollSerializer, OptionsSerializer
from apps.profiles.models import UserProfile
from apps.profiles.serializers import UserProfileSerializer


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


# Handles the sharing process in a poll.
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
async def share_action(request, id):
    session = None
    try:
        # Get collections from the polls database.
        polls_db = GetCollectionsMongoDB(
            'polls_db', ['polls', 'user_actions'])

        # Find the poll in the polls collection.
        poll = await polls_db.polls.find_one(
            {'_id': ObjectId(id)})

        # If poll is not found.
        if not poll:
            raise ValidationError('Poll is not found.')

        # Find the user actions in the user_actions collection.
        user_has_shared = await polls_db.user_actions.find_one(
            {'user_id': request.user.id, 'poll_id': id},
            {'_id': 0, 'poll_id': 1, 'has_shared': 1})

        create_user_actions_doc = False
        update_user_share_action = False

        if user_has_shared is None:
            create_user_actions_doc = True
        else:
            if user_has_shared['has_shared']:
                raise ValidationError(
                    'The user has already shared in this poll.')
            else:
                update_user_share_action = True

        # Initialize a MongoDB session.
        async with await MongoDBSingleton().client.start_session() as session:
            # Initialize a MongoDB transaccion.
            async with session.start_transaction():

                if create_user_actions_doc:
                    # Insert the user action.
                    await polls_db.user_actions.insert_one(
                        {
                            'has_shared': {
                                'shared_at': datetime.now(),
                            },
                            'poll_id': id,
                            'user_id': request.user.id
                        },
                        session=session
                    )

                if update_user_share_action:
                    # Update the user share action.
                    await polls_db.user_actions.update_one(
                        {'user_id': request.user.id, 'poll_id': id},
                        {
                            '$set': {'has_share': {
                                'shared_at': datetime.now(),
                            }}
                        },
                        session=session
                    )

                # Add count to shared counter.
                await polls_db.polls.update_one(
                    {'_id': ObjectId(id)},
                    {
                        '$inc': {'share_counter': 1}
                    },
                    session=session)

                # Save transaction.
                await session.commit_transaction()

                # Response.
                return Response('Poll shared successfully')

    # Handle validation errors.
    except ValidationError as e:
        if session:
            await session.abort_transaction()
        return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

    # Handle MongoDB errors.
    except PyMongoError as e:
        if session:
            await session.abort_transaction()
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Handle other exceptions.
    except Exception as e:
        if session:
            await session.abort_transaction()
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    finally:
        if session:
            await session.end_session()


# Handles the unsharing process in a poll.
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
async def unshare_action(request, id):
    return Response('res')
