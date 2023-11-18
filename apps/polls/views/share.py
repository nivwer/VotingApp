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


# View: "Share Action"

# View to record a user's share action on a specific poll.
# This view supports POST requests and requires token-based authentication.

# --- Purpose ---
# Records a user's share action on a specified poll, updating counters and timestamps.
# Returns a JSON response indicating the success of the share action.

# --- Path Parameter ---
# - id (required): The ID of the poll on which the user performs the share action.

# --- Authentication ---
# Requires token-based authentication using TokenAuthentication.
# Only authenticated users are allowed to perform share actions.

# --- Responses ---
# - 200 OK: Poll shared successfully, includes the ID of the poll.
# - 400 Bad Request: Invalid poll ID, validation error in the request payload, or user has already shared in this poll.
# - 404 Not Found: Poll not found.
# - 500 Internal Server Error: MongoDB errors or other unexpected exceptions.

# --- MongoDB Transaction ---
# Uses a MongoDB transaction to ensure atomicity while updating user actions and poll counters.

# --- User Actions Update ---
# Checks and updates the user's share action status, creating a user_actions document if it doesn't exist.

# --- Poll Counters Update ---
# Increments the shares_counter in the poll document.

# --- Error Handling ---
# Handles different scenarios with appropriate HTTP response codes.
# Specific handling for invalid poll ID, validation errors, user already shared, poll not found, MongoDB errors, and other exceptions.
# Rolls back the MongoDB transaction in case of errors.

# --- Authorship and Date ---
# Author: nivwer
# Last Updated: 2023-11-17

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
async def share_action(request, id):
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
            {'_id': 0, 'poll_id': 1, 'has_shared': 1})

        create_user_actions_doc = False
        add_user_share_action = False

        if user_actions_doc is None:
            create_user_actions_doc = True
        else:
            if 'has_shared' in user_actions_doc:
                raise ValidationError(
                    detail={'message': 'The user has already shared in this poll.'})
            else:
                add_user_share_action = True

        # Initialize a MongoDB session.
        async with await MongoDBSingleton().client.start_session() as session:
            # Initialize a MongoDB transaccion.
            async with session.start_transaction():

                if create_user_actions_doc:
                    # Create a user actions document if it doesn't exist.
                    await polls_db.user_actions.insert_one(
                        {
                            'has_shared': {
                                'shared_at': datetime.now(),
                            },
                            'poll_id': ObjectId(id),
                            'user_id': request.user.id
                        },
                        session=session
                    )

                if add_user_share_action:
                    # Update share action if user actions document exist.
                    await polls_db.user_actions.update_one(
                        {'user_id': request.user.id, 'poll_id': ObjectId(id)},
                        {
                            '$set': {
                                'has_shared': {
                                    'shared_at': datetime.now()
                                }
                            }
                        },
                        upsert=True,
                        session=session
                    )

                # Add count to shared counter in the poll document.
                await polls_db.polls.update_one(
                    {'_id': ObjectId(id)},
                    {
                        '$inc': {'shares_counter': 1}
                    },
                    session=session)

                # Save transaction.
                await session.commit_transaction()

                # Response.
                return Response(
                    data={
                        'message': 'Poll shared successfully',
                        'id': id
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


# View: "Unshare Action"

# View to undo a user's share action on a specific poll.
# This view supports DELETE requests and requires token-based authentication.

# --- Purpose ---
# Reverses a user's share action on a specified poll, updating counters and removing timestamps.
# Returns a JSON response indicating the success of the unshare action.

# --- Path Parameter ---
# - id (required): The ID of the poll on which the user performed the original share action.

# --- Authentication ---
# Requires token-based authentication using TokenAuthentication.
# Only authenticated users are allowed to perform unshare actions.

# --- Responses ---
# - 200 OK: Poll unshared successfully, includes the ID of the poll.
# - 400 Bad Request: Invalid poll ID, user has not shared in this poll, or other validation errors.
# - 404 Not Found: Poll not found.
# - 500 Internal Server Error: MongoDB errors or other unexpected exceptions.

# --- MongoDB Transaction ---
# Uses a MongoDB transaction to ensure atomicity while updating user actions and poll counters.

# --- User Actions Update ---
# Checks and removes the user's share action status, if it exists.

# --- Poll Counters Update ---
# Decrements the shares_counter in the poll document.

# --- Error Handling ---
# Handles different scenarios with appropriate HTTP response codes.
# Specific handling for invalid poll ID, user not shared, poll not found, MongoDB errors, and other exceptions.
# Rolls back the MongoDB transaction in case of errors.

# --- Authorship and Date ---
# Author: nivwer
# Last Updated: 2023-11-17

@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
async def unshare_action(request, id):
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
            {'_id': 0, 'poll_id': 1, 'has_shared': 1})

        remove_user_share_action = False

        if user_actions_doc is not None and user_actions_doc['has_shared']:
            remove_user_share_action = True
        else:
            raise ValidationError(
                detail={'message': 'The user has not shared in this poll.'})

        # Initialize a MongoDB session.
        async with await MongoDBSingleton().client.start_session() as session:
            # Initialize a MongoDB transaccion.
            async with session.start_transaction():

                if remove_user_share_action:
                    # Remove share action if user actions document exist.
                    await polls_db.user_actions.update_one(
                        {'user_id': request.user.id, 'poll_id': ObjectId(id)},
                        {
                            '$unset': {'has_shared': ''}
                        },
                        session=session
                    )

                # Remove count to shared counter in the poll document.
                await polls_db.polls.update_one(
                    {'_id': ObjectId(id)},
                    {
                        '$inc': {'shares_counter': -1}
                    },
                    session=session)

                # Save transaction.
                await session.commit_transaction()

                # Response.
                return Response(
                    data={
                        'message': 'Poll unshared successfully',
                        'id': id
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
