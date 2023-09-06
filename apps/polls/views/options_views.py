# Virtualenv.
from dotenv import load_dotenv
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
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
async def option_manager(request, poll_id):
    try:
        # Get collections from the polls database.
        polls_db = GetCollectionsMongoDB('polls_db', ["polls", "options"])
        # Find the poll in the polls collection.
        poll_bson = await polls_db.polls.find_one({"_id": ObjectId(poll_id)})
        # If poll is not found.
        if not poll_bson:
            raise ValidationError("Poll is not found.")

        # If privacy of poll is private.
        if poll_bson["privacy"] == "private" and poll_bson["created_by"]["user_id"] != request.user.id:
            raise PermissionDenied("This poll is private.")

        # If privacy of poll is friends_only. ?

        # Initialize a OptionSerializer instance with the provided data.
        option_serializer = OptionSerializer(data=request.data, partial=True)
        # Throws ValidationError if not valid.
        option_serializer.is_valid(raise_exception=True)
        # Get the option text.
        option = option_serializer.validated_data
        # Create the option object.

        # Find the poll options.
        options = await polls_db.options.find_one({"poll_id": ObjectId(poll_id)})

        # If the option already exist.
        exist = option['option_text'] in options['options']
        is_owner = poll_bson['created_by']['user_id'] == request.user.id

        # Method POST.
        if request.method == 'POST':
            if exist:
                raise ValidationError('Option already exist.')

            new_option = {
                "created_by": {
                    "user_id": request.user.id,
                    "username": request.user.username
                },
                "option_text": option["option_text"],
                "votes": 0
            }
            # Save the option object.
            await polls_db.options.update_one(
                {"poll_id": ObjectId(poll_id)},
                {"$push": {"options": new_option}})

            # Response.
            return Response("Option added successfully")

        # Method DELETE.
        if request.method == 'DELETE':
            if not exist:
                raise ValidationError('Option not exist.')

            # If the user not authorized.
            if poll_bson["created_by"]["user_id"] != request.user.id:
                raise PermissionDenied("Not Authorized.")

            # Remove the option.
            await polls_db.options.update_one(
                {"poll_id": ObjectId(poll_id)},
                {"$pull": {"options":
                           {"option_text": option["option_text"]}}})

            # Response.
            return Response("Option removed successfully")

    # Handle validation errors.
    except ValidationError as e:
        return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

    # Handle permission denied.
    except PermissionDenied as e:
        return Response(e.detail, status=status.HTTP_403_FORBIDDEN)

    # Handle MongoDB errors.
    except PyMongoError as e:
        print(f'MongoDB Error: {e}')
        return Response({"error": "An error occurred while processing your request."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Handle other exceptions.
    except Exception as e:
        print(f'Error: {e}')
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




# Handles the getting options document.
@api_view(['GET'])
async def get_options(request, poll_id):
    try:
        # Get collections from the polls database.
        polls_db = GetCollectionsMongoDB('polls_db', ["polls", "options"])
        # Find the poll in the polls collection.
        poll_bson = await polls_db.polls.find_one({"_id": ObjectId(poll_id)})
        # If poll is not found.
        if not poll_bson:
            raise ValidationError("Poll is not found.")

        # If the user is not the owner of the poll.
        is_owner = False
        # If the user is the owner of the poll.
        if poll_bson["created_by"]["user_id"] == request.user.id:
            is_owner = True

        # If privacy of poll is private.
        if poll_bson["privacy"] == "private" and poll_bson["created_by"]["user_id"] != request.user.id:
            raise PermissionDenied("This poll is private.")

        # If privacy of poll is friends_only. ?

        # Method GET.
        if request.method == 'GET':
            # Find the poll options in the options collection.
            options_bson = await polls_db.options.find_one({"poll_id": ObjectId(poll_id)})
            # If options is not found.
            if not options_bson:
                raise ValidationError("Options not found.")

            # Convert the BSON response to a JSON response.
            options_json = json_util._json_convert((options_bson))

            return Response({
                "is_owner": is_owner,
                "options": options_json
            })

    # Handle validation errors.
    except ValidationError as e:
        return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

    # Handle permission denied.
    except PermissionDenied as e:
        return Response(e.detail, status=status.HTTP_403_FORBIDDEN)

    # Handle MongoDB errors.
    except PyMongoError as e:
        print(f'MongoDB Error: {e}')
        return Response({"error": "An error occurred while processing your request."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Handle other exceptions.
    except Exception as e:
        print(f'Error: {e}')
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
