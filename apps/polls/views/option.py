# BSON.
from bson import json_util
from bson.objectid import ObjectId
# Rest Framework.
from rest_framework import status
from rest_framework.exceptions import ValidationError, PermissionDenied, NotFound
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
# Serializers.
from ..serializers import OptionSerializer


# Views.


# View: "Option Add"

# View to handle the addition of options to a poll.
# This view supports POST requests and requires token-based authentication.

# --- Purpose ---
# Allows authenticated users to add new options to a poll.

# --- Path Parameter ---
# - id (required): The ID of the poll for which options are being added.

# --- Authentication ---
# Requires token-based authentication using TokenAuthentication.
# Only authenticated users are allowed to add options.

# --- Responses ---
# - 200 OK: Option added successfully, includes the ID of the poll.
# - 400 Bad Request: Invalid poll ID or other validation errors.
# - 403 Forbidden: Permission denied if the poll is private and the user is not the owner.
# - 404 Not Found: Poll not found.
# - 500 Internal Server Error: MongoDB errors or other unexpected exceptions.

# --- Poll Privacy ---
# Checks if the poll is private and if the user is the owner to determine permission.

# --- Option Validation ---
# Validates the option data using OptionSerializer.
# Checks if the option already exists in the poll document to prevent duplication.

# --- User Option Limitation ---
# Restricts users to add only one option if they are not the owner of the poll.

# --- Error Handling ---
# Handles various scenarios with appropriate HTTP response codes.
# Specific handling for invalid poll ID, permission denied, not found, MongoDB errors, and other exceptions.

# --- Authorship and Date ---
# Author: nivwer
# Last Updated: 2023-11-17

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
async def option_add(request, id):

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

        # Poll privacy.
        is_private = poll_bson['privacy'] == 'private'
        is_owner = poll_bson['user_id'] == request.user.id

        if (not is_owner) and is_private:
            raise PermissionDenied(
                detail={'message': 'This poll is private.'})

        # Initialize a OptionSerializer instance.
        option_serializer = OptionSerializer(data=request.data, partial=True)
        option_serializer.is_valid(raise_exception=True)
        option = option_serializer.validated_data

        # Convert BSON to JSON.
        poll_json = json_util._json_convert((poll_bson))
        options = poll_json['options']

        # If the option already exist in poll document.
        exist = any(o['option_text'] == option['option_text'] for o in options)

        if exist:
            raise ValidationError(
                detail={'option_text': ['Option already exist.']})

        if not is_owner:
            for o in options:
                if o['user_id'] == request.user.id:
                    raise ValidationError('You can only add one option.')

        # Add the option in the poll document.
        await polls_db.polls.update_one(
            {'_id': ObjectId(id)},
            {
                '$push': {
                    'options': {
                        'user_id': request.user.id,
                        'option_text': option['option_text'],
                        'votes': 0
                    }
                }
            }
        )

        # Response.
        return Response(
            data={
                'message': 'Option added successfully',
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
        return Response(
            data={'message': 'Internal Server Error'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Handle other exceptions.
    except Exception as error:
        return Response(
            data={'message': 'Internal Server Error'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# View: "Option Delete"

# View to handle the removal of options from a poll.
# This view supports DELETE requests and requires token-based authentication.

# --- Purpose ---
# Allows authenticated users to remove options from a poll.

# --- Path Parameter ---
# - id (required): The ID of the poll from which options are being removed.

# --- Authentication ---
# Requires token-based authentication using TokenAuthentication.
# Only authenticated users are allowed to remove options.

# --- Responses ---
# - 200 OK: Option removed successfully, includes the ID of the poll.
# - 400 Bad Request: Invalid poll ID, option not found, or other validation errors.
# - 403 Forbidden: Permission denied if the poll is private and the user is not the owner.
# - 404 Not Found: Poll not found.
# - 500 Internal Server Error: MongoDB errors or other unexpected exceptions.

# --- Poll Privacy ---
# Checks if the poll is private and if the user is the owner to determine permission.

# --- Option Validation ---
# Validates the option data using OptionSerializer.
# Checks if the option exists in the poll document to prevent removal of non-existent options.

# --- User Authorization ---
# Ensures that only the owner of the poll is authorized to remove options.

# --- Error Handling ---
# Handles various scenarios with appropriate HTTP response codes.
# Specific handling for invalid poll ID, option not found, permission denied, MongoDB errors, and other exceptions.

# --- Authorship and Date ---
# Author: nivwer
# Last Updated: 2023-11-17

@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
async def option_delete(request, id):

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

        # Poll privacy.
        is_private = poll_bson['privacy'] == 'private'
        is_owner = poll_bson['user_id'] == request.user.id

        if (not is_owner) and is_private:
            raise PermissionDenied(
                detail={'message': 'This poll is private.'})

        # Initialize a OptionSerializer instance.
        option_serializer = OptionSerializer(data=request.data, partial=True)
        option_serializer.is_valid(raise_exception=True)
        option = option_serializer.validated_data

        # Convert BSON to JSON.
        poll_json = json_util._json_convert((poll_bson))
        options = poll_json['options']

        # If the option already exist in poll document.
        exist = any(o['option_text'] == option['option_text'] for o in options)

        if not exist:
            raise ValidationError(
                detail={'option_text': ['Option not exist.']})

        # If the authenticated user not authorized.
        if not is_owner:
            raise PermissionDenied(
                detail={'message': 'Not Authorized.'})

        # Remove the option in the poll document.
        await polls_db.polls.update_one(
            {'_id': ObjectId(id)},
            {
                '$pull': {
                    'options': {
                        'option_text': option['option_text']
                    }
                }
            }
        )

        # Response.
        return Response(
            data={
                'message': 'Option removed successfully',
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
        return Response(
            data={'message': 'Internal Server Error'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Handle other exceptions.
    except Exception as error:
        return Response(
            data={'message': 'Internal Server Error'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
