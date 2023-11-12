# Standard.
from datetime import datetime
# Virtualenv.
from dotenv import load_dotenv
# Rest Framework.
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
# Async Rest Framework support.
from adrf.decorators import api_view
# MongoDB connection.
from utils.mongo_connection import MongoDBSingleton
# MongoDB.
from pymongo.errors import PyMongoError
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


# Handles the bookmarking process in a poll.
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
async def bookmark_action(request, id):
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
        user_actions_doc = await polls_db.user_actions.find_one(
            {'user_id': request.user.id, 'poll_id': ObjectId(id)},
            {'_id': 0, 'poll_id': 1, 'has_bookmarked': 1})

        create_user_actions_doc = False
        add_user_bookmark_action = False

        if user_actions_doc is None:
            create_user_actions_doc = True
        else:
            if 'has_bookmarked' in user_actions_doc:
                raise ValidationError(
                    'The user has already bookmarked this poll.')
            else:
                add_user_bookmark_action = True

        # Initialize a MongoDB session.
        async with await MongoDBSingleton().client.start_session() as session:
            # Initialize a MongoDB transaccion.
            async with session.start_transaction():

                if create_user_actions_doc:
                    # Insert the user action.
                    await polls_db.user_actions.insert_one(
                        {
                            'has_bookmarked': {
                                'bookmarked_at': datetime.now(),
                            },
                            'poll_id': ObjectId(id),
                            'user_id': request.user.id
                        },
                        session=session
                    )

                if add_user_bookmark_action:
                    # Update the user bookmark action.
                    await polls_db.user_actions.update_one(
                        {'user_id': request.user.id, 'poll_id': ObjectId(id)},
                        {
                            '$set': {'has_bookmarked': {
                                'bookmarked_at': datetime.now(),
                            }}
                        },
                        upsert=True,
                        session=session
                    )

                # Add count to bookmarked counter.
                await polls_db.polls.update_one(
                    {'_id': ObjectId(id)},
                    {
                        '$inc': {'bookmarks_counter': 1}
                    },
                    session=session)

                # Save transaction.
                await session.commit_transaction()

                # Response.
                return Response(
                    {
                        'message': 'Poll bookmarked successfully',
                        'id': id,
                    })

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


# Handles the unbookmarking process in a poll.
@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
async def unbookmark_action(request, id):
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
        user_actions_doc = await polls_db.user_actions.find_one(
            {'user_id': request.user.id, 'poll_id': ObjectId(id)},
            {'_id': 0, 'poll_id': 1, 'has_bookmarked': 1})

        remove_user_bookmark_action = False

        if user_actions_doc is not None and user_actions_doc['has_bookmarked']:
            remove_user_bookmark_action = True
        else:
            raise ValidationError(
                'The user has not bookmarked in this poll.')

        # Initialize a MongoDB session.
        async with await MongoDBSingleton().client.start_session() as session:
            # Initialize a MongoDB transaccion.
            async with session.start_transaction():

                if remove_user_bookmark_action:
                    # Remove the user bookmark action.
                    await polls_db.user_actions.update_one(
                        {'user_id': request.user.id, 'poll_id': ObjectId(id)},
                        {
                            '$unset': {'has_bookmarked': ''}
                        },
                        session=session
                    )

                # Remove count to bookmarked counter.
                await polls_db.polls.update_one(
                    {'_id': ObjectId(id)},
                    {
                        '$inc': {'bookmarks_counter': -1}
                    },
                    session=session)

                # Save transaction.
                await session.commit_transaction()

                # Response.
                return Response(
                    {
                        'message': 'Poll unbookmarked successfully',
                        'id': id,
                    })

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
