# Virtualenv.
from dotenv import load_dotenv
# Rest Framework.
from rest_framework import status
from rest_framework.exceptions import ValidationError, PermissionDenied
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
from bson import json_util
from bson.objectid import ObjectId
# Serializers.
from ..serializers import OptionSerializer


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

# Handles the adding and removing options in a poll.
@api_view(['POST', 'DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
async def option_manager(request, poll_id):
    try:
        # Get collections from the polls database.
        polls_db = GetCollectionsMongoDB('polls_db', ['polls'])
        # Find the poll in the polls collection.
        poll_bson = await polls_db.polls.find_one(
            {'_id': ObjectId(poll_id)})
        # If poll is not found.
        if not poll_bson:
            raise ValidationError('Poll is not found.')

        # If privacy of poll is private.
        is_private = poll_bson['privacy'] == 'private'
        is_owner = poll_bson['created_by']['user_id'] == request.user.id
        if not is_owner and is_private:
            raise PermissionDenied('This poll is private.')

        # If privacy of poll is friends_only. ?

        # Initialize a OptionSerializer instance.
        option_serializer = OptionSerializer(data=request.data, partial=True)
        option_serializer.is_valid(raise_exception=True)
        option = option_serializer.validated_data

        # Convert the BSON response to a JSON response.
        poll_json = json_util._json_convert((poll_bson))
        options = poll_json['options']

        # If the option already exist.
        exist = any(o['option_text'] == option['option_text'] for o in options)

        # Method POST.
        if request.method == 'POST':
            if exist:
                raise ValidationError({
                    'option_text': ['Option already exist.']})

            if not is_owner:
                for o in options:
                    if o['created_by']['user_id'] == request.user.id:
                        raise ValidationError('You can only add one option.')

            new_option = {
                'created_by': {'user_id': request.user.id},
                'option_text': option['option_text'],
                'votes': 0
            }

            # Save the option object.
            await polls_db.polls.update_one(
                {'_id': ObjectId(poll_id)},
                {
                    '$push': {'options': new_option}
                }
            )

            # Response.
            return Response(
                {'message': 'Option added successfully'})

        # Method DELETE.
        if request.method == 'DELETE':
            if not exist:
                raise ValidationError(
                    {'option_text': ['Option not exist.']})

            # If the user not authorized.
            if not is_owner:
                raise PermissionDenied('Not Authorized.')

            # Remove the option.
            await polls_db.polls.update_one(
                {'_id': ObjectId(poll_id)},
                {
                    '$pull': {'options': {'option_text': option['option_text']}}
                }
            )

            # Response.
            return Response(
                {'message': 'Option removed successfully'})

    # Handle validation errors.
    except ValidationError as e:
        return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

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
