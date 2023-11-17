# Standard.
from datetime import datetime
# BSON.
from bson.objectid import ObjectId
# Rest Framework.
from rest_framework import status
from rest_framework.exceptions import ValidationError, NotFound
from rest_framework.response import Response
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
# Async Rest Framework support.
from adrf.decorators import api_view
# MongoDB connection.
from utils.mongo_connection import MongoDBSingleton
# PyMongo.
from pymongo.errors import PyMongoError


# Views.


# View: "Bookmark Action"

# View to perform bookmark actions on a specific poll.
# This view supports POST requests and requires token-based authentication.

# --- Purpose ---
# Allows users to bookmark a poll, updating counters and timestamps.
# Returns a JSON response indicating the success of the bookmark action.

# --- Path Parameter ---
# - id (required): The ID of the poll to be bookmarked.

# --- Authentication ---
# Requires token-based authentication using TokenAuthentication.
# Only authenticated users are allowed to perform bookmark actions.

# --- Responses ---
# - 200 OK: Poll bookmarked successfully, includes the ID of the poll.
# - 400 Bad Request: Invalid poll ID, user has already bookmarked this poll, or other validation errors.
# - 404 Not Found: Poll not found.
# - 500 Internal Server Error: MongoDB errors or other unexpected exceptions.

# --- MongoDB Transaction ---
# Uses a MongoDB transaction to ensure atomicity while updating user actions and poll counters.

# --- User Actions Update ---
# Checks and adds the user's bookmark action status, if it exists.

# --- Poll Counters Update ---
# Increments the bookmarks_counter in the poll document.

# --- Error Handling ---
# Handles different scenarios with appropriate HTTP response codes.
# Specific handling for invalid poll ID, user already bookmarked, poll not found, MongoDB errors, and other exceptions.
# Rolls back the MongoDB transaction in case of errors.

# --- Authorship and Date ---
# Author: nivwer
# Last Updated: 2023-11-17

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
async def bookmark_action(request, id):
    session = None

    # If poll ID is invalid.
    if len(id) != 24:
        raise ValidationError(
            detail={'message': 'Invalid poll ID'})

    try:
        # Connect to the MongoDB databases.
        polls_db = MongoDBSingleton().client['polls_db']

        # Find the poll document in the polls collection.
        poll = await polls_db.polls.find_one(
            {'_id': ObjectId(id)})

        # If poll document is not found.
        if not poll:
            raise NotFound(
                detail={'message': 'Poll not found'})

        # Find the user actions document in the user_actions collection.
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
                    # Create a user actions document if it doesn't exist.
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
                    # Update bookmark action if user actions document exist.
                    await polls_db.user_actions.update_one(
                        {'user_id': request.user.id, 'poll_id': ObjectId(id)},
                        {
                            '$set': {
                                'has_bookmarked': {
                                    'bookmarked_at': datetime.now()
                                }
                            }
                        },
                        upsert=True,
                        session=session
                    )

                # Add count to bookmarked counter in the poll document.
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
                    data={
                        'message': 'Poll bookmarked successfully',
                        'id': id,
                    },
                    status=status.HTTP_200_OK)

    # Handle validation errors.
    except ValidationError as error:
        return Response(
            data=error.detail,
            status=status.HTTP_400_BAD_REQUEST)

    # Handle validation errors.
    except NotFound as error:
        return Response(
            data=error.detail,
            status=status.HTTP_404_NOT_FOUND)

    # Handle MongoDB errors.
    except PyMongoError as error:
        if session:
            await session.abort_transaction()
        return Response(
            data={'message': 'Internal Server Error'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Handle other exceptions.
    except Exception as error:
        if session:
            await session.abort_transaction()
        return Response(
            data={'message': 'Internal Server Error'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # End Session.
    finally:
        if session:
            await session.end_session()


# View: "Unbookmark Action"

# View to perform unbookmark actions on a specific poll.
# This view supports DELETE requests and requires token-based authentication.

# --- Purpose ---
# Allows users to unbookmark a previously bookmarked poll, updating counters and timestamps.
# Returns a JSON response indicating the success of the unbookmark action.

# --- Path Parameter ---
# - id (required): The ID of the poll to be unbookmarked.

# --- Authentication ---
# Requires token-based authentication using TokenAuthentication.
# Only authenticated users are allowed to perform unbookmark actions.

# --- Responses ---
# - 200 OK: Poll unbookmarked successfully, includes the ID of the poll.
# - 400 Bad Request: Invalid poll ID, user has not bookmarked this poll, or other validation errors.
# - 404 Not Found: Poll not found.
# - 500 Internal Server Error: MongoDB errors or other unexpected exceptions.

# --- MongoDB Transaction ---
# Uses a MongoDB transaction to ensure atomicity while updating user actions and poll counters.

# --- User Actions Update ---
# Checks and removes the user's bookmark action status if it exists.

# --- Poll Counters Update ---
# Decrements the bookmarks_counter in the poll document.

# --- Error Handling ---
# Handles different scenarios with appropriate HTTP response codes.
# Specific handling for invalid poll ID, user not bookmarked, poll not found, MongoDB errors, and other exceptions.
# Rolls back the MongoDB transaction in case of errors.

# --- Authorship and Date ---
# Author: nivwer
# Last Updated: 2023-11-17

@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
async def unbookmark_action(request, id):
    session = None

    # If poll ID is invalid.
    if len(id) != 24:
        raise ValidationError(
            detail={'message': 'Invalid poll ID'})

    try:
        # Connect to the MongoDB databases.
        polls_db = MongoDBSingleton().client['polls_db']

        # Find the poll document in the polls collection.
        poll = await polls_db.polls.find_one(
            {'_id': ObjectId(id)})

        # If poll document is not found.
        if not poll:
            raise NotFound(
                detail={'message': 'Poll not found'})

        # Find the user actions document in the user_actions collection.
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
                    # Remove bookmark action if user actions document exist.
                    await polls_db.user_actions.update_one(
                        {'user_id': request.user.id, 'poll_id': ObjectId(id)},
                        {
                            '$unset': {'has_bookmarked': ''}
                        },
                        session=session
                    )

                # Remove count to bookmarked counter in the poll document.
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
                    data={
                        'message': 'Poll unbookmarked successfully',
                        'id': id,
                    },
                    status=status.HTTP_200_OK)

    # Handle validation errors.
    except ValidationError as error:
        return Response(
            data=error.detail,
            status=status.HTTP_400_BAD_REQUEST)

    # Handle validation errors.
    except NotFound as error:
        return Response(
            data=error.detail,
            status=status.HTTP_404_NOT_FOUND)

    # Handle MongoDB errors.
    except PyMongoError as error:
        if session:
            await session.abort_transaction()
        return Response(
            data={'message': 'Internal Server Error'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Handle other exceptions.
    except Exception as error:
        if session:
            await session.abort_transaction()
        return Response(
            data={'message': 'Internal Server Error'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # End Session.
    finally:
        if session:
            await session.end_session()
