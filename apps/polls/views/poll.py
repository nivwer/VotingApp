# Standard.
from datetime import datetime
# BSON.
from bson import json_util
from bson.objectid import ObjectId
# Django.
from django.contrib.auth.models import User
# Rest Framework.
from rest_framework import status
from rest_framework.exceptions import ValidationError, PermissionDenied, NotFound
from rest_framework.response import Response
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import TokenAuthentication
# Async Rest Framework support.
from adrf.decorators import api_view
# MongoDB connection.
from utils.mongo_connection import MongoDBSingleton
# PyMongo.
from pymongo.errors import PyMongoError
# Models and Serializers.
from ..serializers import PollSerializer, OptionsSerializer


# Views.


# View: "Poll Create"

# View to handle the creation of a new poll.
# This view supports POST requests and requires token-based authentication.

# --- Purpose ---
# Allows authenticated users to create a new poll with specified options.

# --- Authentication ---
# Requires token-based authentication using TokenAuthentication.
# Only authenticated users are allowed to create polls.

# --- Request Data ---
# Expects JSON data with the following structure:
# {
#   "title": "Poll Title",
#   "description": "Poll Description",
#   "privacy": "public/private",
#   "category": "Poll Category",
#   "options": {
#     "add_options": ["Option 1", "Option 2", ...]
#   }
# }

# --- Responses ---
# - 201 Created: Poll created successfully. Includes the ID of the created poll.
# - 400 Bad Request: Validation errors in the request data.
# - 500 Internal Server Error: MongoDB errors or other unexpected exceptions.

# --- Validations ---
# Validates the poll data using PollSerializer.
# Validates the options data using OptionsSerializer.

# --- MongoDB Session and Transaction ---
# Initializes a MongoDB session and transaction for atomicity.

# --- Error Handling ---
# Handles validation errors, MongoDB errors, and other unexpected exceptions with appropriate HTTP response codes.

# --- Authorship and Date ---
# Author: nivwer
# Last Updated: 2023-11-18

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
async def poll_create(request):
    session = None
    options_object = {'options': request.data['options']['add_options']}

    try:
        # Initialize a Poll Serializer instance.
        poll_serializer = PollSerializer(data=request.data)
        poll_serializer.is_valid(raise_exception=True)
        poll_data = poll_serializer.validated_data

        # Initialize a Options Serializer instance.
        options_serializer = OptionsSerializer(data=options_object)
        options_serializer.is_valid(raise_exception=True)
        list_options = options_serializer.validated_data.get('options')

        # Create options objects.
        options = []
        for option in list_options:
            options.append(
                {
                    'user_id': request.user.id,
                    'option_text': option,
                    'votes': 0
                }
            )

        # Connect to the MongoDB databases.
        polls_db = MongoDBSingleton().client['polls_db']

        # Initialize a MongoDB session.
        async with await MongoDBSingleton().client.start_session() as session:
            # Initialize a MongoDB transaccion.
            async with session.start_transaction():

                # Create poll document in polls collection.
                poll = await polls_db.polls.insert_one(
                    {
                        'user_id': request.user.id,
                        'title': poll_data['title'],
                        'description': poll_data['description'],
                        'created_at': datetime.now(),
                        'privacy': poll_data['privacy'],
                        'category': poll_data['category'],
                        'options': options,
                        'voters': [],
                        'votes_counter': 0,
                        'shares_counter': 0,
                        'bookmarks_counter': 0,
                        'comments_counter': 0,
                    },
                    session=session
                )

                poll_id = poll.inserted_id

                # Save transaction.
                await session.commit_transaction()

                # Response.
                return Response(
                    data={
                        'message': 'Poll created successfully',
                        'id': str(poll_id)
                    },
                    status=status.HTTP_201_CREATED)

    # Handle validation errors.
    except ValidationError as error:
        return Response(
            data=error.detail,
            status=status.HTTP_400_BAD_REQUEST)

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


# View: "Poll Read"

# View to retrieve and display details of a poll.
# This view supports GET requests and is open to any user (no authentication required).

# --- Purpose ---
# Fetches and displays details of a poll using the provided poll ID.
# Returns a JSON response with poll details and user actions.

# --- Path Parameters ---
# - id (required): The ID of the poll.

# --- Access Control ---
# For private polls, only the owner can access the information.

# --- Responses ---
# - 200 OK: Poll details and actions of the authenticated user.
# - 400 Bad Request: Invalid poll ID.
# - 404 Not Found: Poll not found.
# - 403 Forbidden: Permission issues (private poll access).
# - 500 Internal Server Error: MongoDB errors or other unexpected exceptions.

# --- Error Handling ---
# Handles different scenarios with appropriate HTTP response codes.
# Specific handling for invalid poll ID, poll not found, and permission issues.
# MongoDB errors and other exceptions result in a 500 Internal Server Error.

# --- Authorship and Date ---
# Author: nivwer
# Last Updated: 2023-11-15

@api_view(['GET'])
@permission_classes([AllowAny])
async def poll_read(request, id):
    # Check if the current user is authenticated.
    is_authenticated = True if request.user else False

    # If poll ID is invalid.
    if len(id) != 24:
        raise ValidationError(
            detail={'message': 'Invalid poll ID'})

    try:
        # Connect to the MongoDB databases.
        polls_db = MongoDBSingleton().client['polls_db']

        # Find the poll document in the polls collection.
        poll_bson = await polls_db.polls.find_one(
            {'_id': ObjectId(id)})

        # If poll document is not found.
        if not poll_bson:
            raise NotFound(
                detail={'message': 'Poll not found'})

        # Convert BSON to JSON.
        poll_json = json_util._json_convert((poll_bson))

        # Poll privacy.
        is_private = poll_bson['privacy'] == 'private'
        is_owner = poll_bson['user_id'] == request.user.id

        # If the poll is private.
        if (not is_owner) and is_private:
            raise PermissionDenied(
                detail={'message': 'This poll is private'})

        # Simplify poll data.
        poll_json['id'] = poll_json['_id']['$oid']
        del poll_json['_id']
        poll_json['created_at'] = poll_json['created_at']['$date']

        # Get poll user data.
        user_data = await User.objects.filter(
            id=poll_json['user_id']
        ).values(
            'username',
            'userprofile__profile_picture',
            'userprofile__profile_name'
        ).afirst()

        poll_json['user_profile'] = {
            'username': user_data['username'],
            'profile_picture': user_data['userprofile__profile_picture'],
            'profile_name': user_data['userprofile__profile_name']
        }

        # If the current user is authenticated.
        if is_authenticated:
            # Find user actions of the authenticated user. ( Current user )
            user_actions_bson = await polls_db.user_actions.find_one(
                {'user_id': request.user.id, 'poll_id': ObjectId(id)},
                projection={
                    '_id': 0,
                    'has_voted': 1,
                    'has_shared': 1,
                    'has_bookmarked': 1
                },
            )

            # Convert BSON to JSON.
            user_actions_json = json_util._json_convert((user_actions_bson))

            authenticated_user_actions = user_actions_json or {}

        # Response.
        return Response(
            data={
                'poll': poll_json,
                'authenticated_user_actions': authenticated_user_actions
            },
            status=status.HTTP_200_OK)

    # Handle validation errors.
    except ValidationError as error:
        return Response(
            data=error.detail,
            status=status.HTTP_400_BAD_REQUEST)

    # Handle permission denied.
    except PermissionDenied as error:
        return Response(
            data=error.detail,
            status=status.HTTP_403_FORBIDDEN)

    # Handle validation errors.
    except NotFound as error:
        return Response(
            data=error.detail,
            status=status.HTTP_404_NOT_FOUND)

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


# View: "Poll Update"

# View to handle the update of an existing poll.
# This view supports PATCH requests and requires token-based authentication.

# --- Purpose ---
# Allows authenticated users who own a poll to update its details, including adding or removing options.

# --- Authentication ---
# Requires token-based authentication using TokenAuthentication.
# Only the owner of the poll is authorized to update it.

# --- Request Data ---
# Expects JSON data with the following structure:
# {
#   "title": "Updated Poll Title",
#   "description": "Updated Poll Description",
#   "privacy": "public/private",
#   "category": "Updated Poll Category",
#   "options": {
#     "add_options": ["New Option 1", "New Option 2", ...],
#     "del_options": ["Option to Remove 1", "Option to Remove 2", ...]
#   }
# }

# --- Responses ---
# - 200 OK: Poll updated successfully. Includes the ID of the updated poll.
# - 400 Bad Request: Validation errors in the request data.
# - 403 Forbidden: Permission denied if the authenticated user is not the owner.
# - 404 Not Found: Poll not found.
# - 500 Internal Server Error: MongoDB errors or other unexpected exceptions.

# --- Validations ---
# Validates the poll data using PollSerializer.
# Validates the options data using OptionsSerializer.

# --- MongoDB Session and Transaction ---
# Initializes a MongoDB session and transaction for atomicity.

# --- Add and Remove Options ---
# Adds new options to the poll document.
# Removes specified options from the poll document.

# --- Error Handling ---
# Handles validation errors, permission denied, poll not found, MongoDB errors, and other unexpected exceptions.

# --- Authorship and Date ---
# Author: nivwer
# Last Updated: 2023-11-18

@api_view(['PATCH'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
async def poll_update(request, id):
    session = None

    # If poll ID is invalid.
    if len(id) != 24:
        raise ValidationError(
            detail={'message': 'Invalid poll ID'})

    try:
        # Connect to the MongoDB databases.
        polls_db = MongoDBSingleton().client['polls_db']

        # Find the poll document in the polls collection.
        poll_bson = await polls_db.polls.find_one(
            {'_id': ObjectId(id)})

        # If poll document is not found.
        if not poll_bson:
            raise NotFound(
                detail={'message': 'Poll not found'})

        # If the authenticated user is not authorized.
        is_owner = poll_bson['user_id'] == request.user.id
        if not is_owner:
            raise PermissionDenied(
                detail={'message':  'Not Authorized.'})

        # Initialize a Poll Serializers instance.
        poll_serializer = PollSerializer(data=request.data, partial=True)
        poll_serializer.is_valid(raise_exception=True)
        data = poll_serializer.validated_data

        # Options.
        poll_json = json_util._json_convert((poll_bson))
        options = poll_json['options']

        # Generate the list of options with the previous options.
        validate_options = {'options': []}
        for option in options:
            validate_options['options'].append(option['option_text'])

        # If there options to add or remove in the options document.
        add_options = request.data['options']['add_options']
        del_options = request.data['options']['del_options']

        # Add o Remove the options to validate options.
        if add_options:
            for option in add_options:
                validate_options['options'].append(option)

        if del_options:
            for option in del_options:
                validate_options['options'].remove(option)

        # Initialize a Options Serializers instance.
        options_serializer = OptionsSerializer(data=validate_options)
        options_serializer.is_valid(raise_exception=True)

        # Validate if the options to add do not exist, and generate the option object.
        add_options_object = []
        if request.data['options']['add_options']:
            for option in add_options:
                # If the option already exist.
                exist = any(o['option_text'] == option for o in options)

                if exist:
                    raise ValidationError(
                        detail={'message': f"This options '{option}' already exist."})

                add_options_object.append(
                    {
                        'user_id': request.user.id,
                        'option_text': option,
                        'votes': 0
                    })

        # validates if the options to eliminate exist.
        if request.data['options']['del_options']:
            for option in del_options:
                # If the option already exist.
                exist = any(o['option_text'] == option for o in options)

                if not exist:
                    raise ValidationError(
                        detail={'message':  f"This option '{option}' not exist."})

        # Initialize a MongoDB session.
        async with await MongoDBSingleton().client.start_session() as session:
            # Initialize a MongoDB transaccion.
            async with session.start_transaction():

                # Update poll document in polls collection.
                await polls_db.polls.update_one(
                    {'_id': ObjectId(id)},
                    {
                        '$set': data
                    },
                    session=session)

                # Add options.
                if request.data['options']['add_options']:
                    await polls_db.polls.update_one(
                        {'_id': ObjectId(id)},
                        {
                            '$addToSet': {'options': {'$each': add_options_object}}
                        },
                        session=session)

                # Remove options.
                if request.data['options']['del_options']:
                    await polls_db.polls.update_one(
                        {'_id': ObjectId(id)},
                        {
                            '$pull': {'options': {'option_text': {'$in': del_options}}}
                        },
                        session=session)

                # Save transaction.
                await session.commit_transaction()

                # Response.
                return Response(
                    data={
                        'message': 'Poll updated successfully.',
                        'id': id
                    },
                    status=status.HTTP_200_OK)

    # Handle validation errors.
    except ValidationError as error:
        return Response(
            data=error.detail,
            status=status.HTTP_400_BAD_REQUEST)

    # Handle permission denied.
    except PermissionDenied as error:
        return Response(
            data=error.detail,
            status=status.HTTP_403_FORBIDDEN)

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


# View: "Poll Delete"

# View to handle the deletion of an existing poll.
# This view supports DELETE requests and requires token-based authentication.

# --- Purpose ---
# Allows authenticated users who own a poll to delete it, along with its associated comments.

# --- Authentication ---
# Requires token-based authentication using TokenAuthentication.
# Only the owner of the poll is authorized to delete it.

# --- Responses ---
# - 200 OK: Poll and associated comments removed successfully. Includes the ID of the deleted poll.
# - 400 Bad Request: Validation errors in the request data.
# - 403 Forbidden: Permission denied if the authenticated user is not the owner.
# - 404 Not Found: Poll not found.
# - 500 Internal Server Error: MongoDB errors or other unexpected exceptions.

# --- MongoDB Session and Transaction ---
# Initializes a MongoDB session and transaction for atomicity.

# --- Remove Comment Documents ---
# Deletes comment documents associated with the poll from the comments collection.

# --- Error Handling ---
# Handles validation errors, permission denied, poll not found, MongoDB errors, and other unexpected exceptions.

# --- Authorship and Date ---
# Author: nivwer
# Last Updated: 2023-11-18

@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
async def poll_delete(request, id):
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
        
        # If the authenticated user is not authorized.
        is_owner = poll['user_id'] == request.user.id
        if not is_owner:
            raise PermissionDenied(
                detail={'message':  'Not Authorized.'})

        # Initialize a MongoDB session.
        async with await MongoDBSingleton().client.start_session() as session:
            # Initialize a MongoDB transaccion.
            async with session.start_transaction():

                # Remove the poll document in the polls collection.
                rm_poll_result = await polls_db.polls.delete_one(
                    {'_id': poll['_id']},
                    session=session)

                comments_is_not_removed = True
                # Remove the comment documents of the poll in the comments collection.
                if poll['comments_counter'] > 0:
                    rm_comments_result = await polls_db.comments.delete_many(
                        {'poll_id': id},
                        session=session)

                    comments_is_not_removed = rm_comments_result.deleted_count != poll[
                        'comments_counter']

                else:
                    comments_is_not_removed = False

                poll_is_not_removed = rm_poll_result.deleted_count == 0

                # If the poll document is not removed.
                if poll_is_not_removed or comments_is_not_removed:
                    await session.abort_transaction()
                    raise PyMongoError()

                # Save transaction.
                await session.commit_transaction()

                # Response.
                return Response(
                    data={
                        'message': 'Poll removed successfully.',
                        'id': id
                    },
                    status=status.HTTP_200_OK)

    # Handle validation errors.
    except ValidationError as error:
        return Response(
            data=error.detail,
            status=status.HTTP_400_BAD_REQUEST)

    # Handle permission denied.
    except PermissionDenied as error:
        return Response(
            data=error.detail,
            status=status.HTTP_403_FORBIDDEN)

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
