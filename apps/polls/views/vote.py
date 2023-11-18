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
from pymongo import UpdateOne
from pymongo.errors import PyMongoError


# Views.


# View: "Vote Add"

# View to handle the addition of votes to a specific poll.
# This view supports POST requests and requires token-based authentication.

# --- Purpose ---
# Allows users to add their votes to a poll, updating relevant counters and timestamps.
# Returns a JSON response indicating the success of the vote creation.

# --- Path Parameter ---
# - id (required): The ID of the poll where the vote is added.

# --- Authentication ---
# Requires token-based authentication using TokenAuthentication.
# Only authenticated users are allowed to add votes.

# --- Request Data ---
# Expects a JSON payload with the user's vote value. Example: {"vote": "Option A"}.

# --- Responses ---
# - 200 OK: Vote created successfully, includes the ID of the poll.
# - 400 Bad Request: Invalid poll ID, user has already voted, or other validation errors.
# - 404 Not Found: Poll not found.
# - 500 Internal Server Error: MongoDB errors or other unexpected exceptions.

# --- MongoDB Transaction ---
# Uses a MongoDB transaction to ensure atomicity while updating user actions and poll counters.

# --- User Actions Update ---
# Checks and updates the user's vote action status if it exists.

# --- Poll Counters Update ---
# Updates the votes_counter in the poll document and increments the votes for the chosen option.

# --- Error Handling ---
# Handles different scenarios with appropriate HTTP response codes.
# Specific handling for invalid poll ID, user already voted, poll not found, MongoDB errors, and other exceptions.
# Rolls back the MongoDB transaction in case of errors.

# --- Authorship and Date ---
# Author: nivwer
# Last Updated: 2023-11-17

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
async def vote_add(request, id):
    session = None
    add_vote_value = request.data['vote']

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
            {'_id': 0, 'poll_id': 1, 'has_voted': 1})

        create_user_actions_doc = False
        add_user_vote_action = False

        if user_actions_doc is None:
            create_user_actions_doc = True
        else:
            if 'has_vote' in user_actions_doc:
                raise ValidationError(
                    detail={'message':  'The user has already voted in this poll.'})
            else:
                add_user_vote_action = True

        # Initialize a MongoDB session.
        async with await MongoDBSingleton().client.start_session() as session:
            # Initialize a MongoDB transaccion.
            async with session.start_transaction():

                if create_user_actions_doc:
                    # Create a user actions document if it doesn't exist.
                    await polls_db.user_actions.insert_one(
                        {
                            'has_voted': {
                                'vote': add_vote_value,
                                'voted_at': datetime.now(),
                            },
                            'poll_id': ObjectId(id),
                            'user_id': request.user.id
                        },
                        session=session
                    )

                if add_user_vote_action:
                    # Update vote action if user actions document exist.
                    await polls_db.user_actions.update_one(
                        {'user_id': request.user.id, 'poll_id': ObjectId(id)},
                        {
                            '$set': {'has_voted': {
                                'vote': add_vote_value,
                                'voted_at': datetime.now(),
                            }}
                        },
                        upsert=True,
                        session=session
                    )

                await polls_db.polls.bulk_write([
                    # Add user ID to voters list in the poll document.
                    UpdateOne(
                        {'_id': ObjectId(id)},
                        {
                            '$push': {'voters': request.user.id},
                            '$inc': {'votes_counter': 1}
                        }
                    ),
                    # Add count to voted counter in the poll document.
                    UpdateOne(
                        {
                            '_id': ObjectId(id),
                            'options.option_text': add_vote_value
                        },
                        {
                            '$inc': {'options.$.votes': 1}
                        }
                    )
                ], session=session)

                # Save transaction.
                await session.commit_transaction()

                # Response.
                return Response(
                    data={
                        'message': 'Vote created successfully',
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


# View: "Vote Read"

# View to retrieve the vote information of the authenticated user for a specific poll.
# This view supports GET requests and requires token-based authentication.

# --- Purpose ---
# Allows users to check their vote status for a particular poll.
# Returns a JSON response indicating the user's vote or an empty string if the user has not voted.

# --- Path Parameter ---
# - id (required): The ID of the poll for which the user's vote is being queried.

# --- Authentication ---
# Requires token-based authentication using TokenAuthentication.
# Only authenticated users are allowed to check their vote status.

# --- Responses ---
# - 200 OK: Vote information retrieved successfully, includes the ID of the poll and the user's vote.
# - 400 Bad Request: Invalid poll ID or other validation errors.
# - 500 Internal Server Error: MongoDB errors or other unexpected exceptions.

# --- User Vote Information ---
# Checks if the user has voted and returns the user's vote or an empty string accordingly.

# --- Error Handling ---
# Handles different scenarios with appropriate HTTP response codes.
# Specific handling for invalid poll ID, MongoDB errors, and other exceptions.

# --- Authorship and Date ---
# Author: nivwer
# Last Updated: 2023-11-17

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
async def vote_read(request, id):

    # If poll ID is invalid.
    if len(id) != 24:
        raise ValidationError(
            detail={'message': 'Invalid poll ID'})

    try:
        # Connect to the MongoDB databases.
        polls_db = MongoDBSingleton().client['polls_db']

        # Find the user actions document in the user_actions collection.
        user_has_voted = await polls_db.user_actions.find_one(
            {'user_id': request.user.id, 'poll_id': ObjectId(id)},
            {'_id': 0, 'has_voted': 1})

        vote = user_has_voted['has_voted']['vote'] if user_has_voted else ''

        # Response.
        return Response(
            data={
                'vote': vote,
                'id': id
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


# View: "Vote Update"

# View to handle the update of a user's vote in a specific poll.
# This view supports PATCH requests and requires token-based authentication.

# --- Purpose ---
# Allows users to update their votes in a poll, adjusting relevant counters and timestamps.
# Returns a JSON response indicating the success of the vote update.

# --- Path Parameter ---
# - id (required): The ID of the poll where the vote is updated.

# --- Authentication ---
# Requires token-based authentication using TokenAuthentication.
# Only authenticated users are allowed to update their votes.

# --- Request Data ---
# Expects a JSON payload with the new vote value. Example: {"vote": "Option B"}.

# --- Responses ---
# - 200 OK: Vote updated successfully, includes the ID of the poll.
# - 400 Bad Request: Invalid poll ID, user has not voted, or other validation errors.
# - 404 Not Found: Poll not found.
# - 500 Internal Server Error: MongoDB errors or other unexpected exceptions.

# --- MongoDB Transaction ---
# Uses a MongoDB transaction to ensure atomicity while updating user actions and poll counters.

# --- User Actions Update ---
# Checks and updates the user's voted action status if it exists.

# --- Poll Counters Update ---
# Updates the votes for the previous vote and increments the votes for the new vote option.

# --- Error Handling ---
# Handles different scenarios with appropriate HTTP response codes.
# Specific handling for invalid poll ID, user not voted, poll not found, MongoDB errors, and other exceptions.
# Rolls back the MongoDB transaction in case of errors.

# --- Authorship and Date ---
# Author: nivwer
# Last Updated: 2023-11-17

@api_view(['PATCH'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
async def vote_update(request, id):
    session = None
    add_vote_value = request.data['vote']
    del_vote_value = None

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
            {'_id': 0, 'poll_id': 1, 'has_voted': 1})

        update_user_voted_action = False

        if user_actions_doc is not None and user_actions_doc['has_voted']:
            update_user_voted_action = True
        else:
            raise ValidationError(
                detail={'message':  'The user has not voted in this poll.'})

        # If the user has voted on any poll.
        del_vote_value = user_actions_doc['has_voted']['vote']

        # Initialize a MongoDB session.
        async with await MongoDBSingleton().client.start_session() as session:
            # Initialize a MongoDB transaccion.
            async with session.start_transaction():

                if update_user_voted_action:
                    # Update vote action if user actions document exist.
                    await polls_db.user_actions.update_one(
                        {'user_id': request.user.id, 'poll_id': ObjectId(id)},
                        {
                            '$set': {'has_voted': {
                                'vote': add_vote_value,
                                'voted_at': datetime.now(),
                            }}
                        },
                        session=session
                    )

                await polls_db.polls.bulk_write([
                    # Remove the previous vote in poll document.
                    UpdateOne(
                        {
                            '_id': ObjectId(id),
                            'options.option_text': del_vote_value
                        },
                        {
                            '$inc': {'options.$.votes': -1}
                        }
                    ),
                    # Add the new vote in poll document.
                    UpdateOne(
                        {
                            '_id': ObjectId(id),
                            'options.option_text': add_vote_value
                        },
                        {
                            '$inc': {'options.$.votes': 1}
                        }
                    )
                ], session=session)

                # Save transaction.
                await session.commit_transaction()

                # Response.
                return Response(
                    data={
                        'message': 'Vote updated successfully',
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


# View: "Vote Delete"

# View to handle the removal of a user's vote from a specific poll.
# This view supports DELETE requests and requires token-based authentication.

# --- Purpose ---
# Allows users to remove their votes from a poll, adjusting relevant counters and timestamps.
# Returns a JSON response indicating the success of the vote removal.

# --- Path Parameter ---
# - id (required): The ID of the poll where the vote is removed.

# --- Authentication ---
# Requires token-based authentication using TokenAuthentication.
# Only authenticated users are allowed to remove their votes.

# --- Responses ---
# - 200 OK: Vote removed successfully, includes the ID of the poll.
# - 400 Bad Request: Invalid poll ID, user has not voted, or other validation errors.
# - 404 Not Found: Poll not found.
# - 500 Internal Server Error: MongoDB errors or other unexpected exceptions.

# --- MongoDB Transaction ---
# Uses a MongoDB transaction to ensure atomicity while updating user actions and poll counters.

# --- User Actions Update ---
# Checks and removes the user's voted action status if it exists.

# --- Poll Counters Update ---
# Removes the user ID from the voters list and decrements the votes for the removed vote option.

# --- Error Handling ---
# Handles different scenarios with appropriate HTTP response codes.
# Specific handling for invalid poll ID, user not voted, poll not found, MongoDB errors, and other exceptions.
# Rolls back the MongoDB transaction in case of errors.

# --- Authorship and Date ---
# Author: nivwer
# Last Updated: 2023-11-17

@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
async def vote_delete(request, id):
    session = None
    del_vote_value = None

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
            {'_id': 0, 'poll_id': 1, 'has_voted': 1})

        remove_user_voted_action = False

        if user_actions_doc is not None and user_actions_doc['has_voted']:
            remove_user_voted_action = True
        else:
            raise ValidationError(
                detail={'message': 'The user has not voted in this poll.'})

        # If the user has voted on any poll.
        del_vote_value = user_actions_doc['has_voted']['vote']

        # Initialize a MongoDB session.
        async with await MongoDBSingleton().client.start_session() as session:
            # Initialize a MongoDB transaccion.
            async with session.start_transaction():

                if remove_user_voted_action:
                    # Remove vote action if user actions document exist.
                    await polls_db.user_actions.update_one(
                        {'user_id': request.user.id, 'poll_id': ObjectId(id)},
                        {
                            '$unset': {'has_voted': ''}
                        },
                        session=session
                    )

                await polls_db.polls.bulk_write([
                    # Remove user ID to voters list in the poll document.
                    UpdateOne(
                        {'_id': ObjectId(id)},
                        {
                            '$pull': {'voters': request.user.id},
                            '$inc': {'votes_counter': -1}
                        }
                    ),
                    # Remove the previous vote in poll document.
                    UpdateOne(
                        {
                            '_id': ObjectId(id),
                            'options.option_text': del_vote_value
                        },
                        {
                            '$inc': {'options.$.votes': -1}
                        },
                    )
                ], session=session)

                # Save transaction.
                await session.commit_transaction()

                # Response.
                return Response(
                    data={
                        'message': 'Vote removed successfully',
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
