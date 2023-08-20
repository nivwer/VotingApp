# Standard.
import os
from datetime import datetime
# Virtualenv.
from dotenv import load_dotenv
# Django.
from django.http import HttpResponse
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
from .serializers import PollSerializer, OptionsSerializer


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

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
async def read_poll(request):
    poll_id = request.data["poll_id"]
    # If poll_id is undefined.
    if not poll_id:
        raise ValidationError(
            {'poll_id': ["This field is required."]})
    try:
        # Get collections from the polls database.
        polls_db = GetCollectionsMongoDB('polls_db', ["polls"])
        # Find the poll in the polls collection.
        poll_bson = await polls_db.polls.find_one({"_id": ObjectId(poll_id)})

        # If poll is not found.
        if not poll_bson:
            raise ValidationError(
                {'poll_id': ["Poll is not found."]})

        # If user is not authorized.
        if poll_bson["created_by"]["user_id"] != request.user.id:
            raise ValidationError(
                {"error": "You are not authorized to read this poll."})

        # If privacy of poll is private. ?
        # If privacy of poll is friends_only. ?

        # Convert the BSON response to a JSON response.
        poll_json = json_util._json_convert((poll_bson))
        # Fix data.
        poll_json["_id"] = str(poll_bson["_id"])
        poll_json["creation_date"] = str(poll_bson["creation_date"])

        # Return a JSON with the poll.
        return Response({"poll": poll_json})

    # Handle validation errors.
    except ValidationError as e:
        return Response({"error": e.detail}, status=status.HTTP_400_BAD_REQUEST)

    # Handle permission denied.
    except PermissionDenied as e:
        return Response({"error": e.detail}, status=status.HTTP_403_FORBIDDEN)

    # Handle MongoDB errors.
    except PyMongoError as e:
        print(f'MongoDB Error: {e}')
        return Response({"error": "An error occurred while processing your request."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Handle other exceptions.
    except Exception as e:
        print(f'Error: {e}')
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Handles the creation procces for a news polls.
@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
async def create_poll(request):
    session = None
    try:
        # Initialize a Serializers instance with the provided data.
        poll_serializer = PollSerializer(data=request.data)
        options_serializer = OptionsSerializer(data=request.data)
        # Throws ValidationError if not valid.
        poll_serializer.is_valid(raise_exception=True)
        options_serializer.is_valid(raise_exception=True)

        # Fields requireds.
        title = poll_serializer.validated_data.get('title')
        options = options_serializer.validated_data.get('options')
        # If the value is undefined, the value is null.
        description = poll_serializer.validated_data.get('description')
        privacy = poll_serializer.validated_data.get('privacy')
        category = poll_serializer.validated_data.get('category')

        # If the list options do not have a length of two or more items.
        if len(options) <= 1:
            raise ValidationError(
                {'options': ["This field expects a list with two or more items."]})
        elif len(options) >= 18:
            raise ValidationError(
                {'options': ["This field expects a list with less than 18 elements."]})

        # If privacy is not valid or undefined.
        privacy_list = ["public", "private", "friends_only"]
        if not privacy in privacy_list:
            privacy = "public"

        # Initialize a MongoDB session.
        async with await MongoDBSingleton().client.start_session() as session:
            # Initialize a MongoDB transaccion.
            async with session.start_transaction():

                # Get collections from the polls database.
                polls_db = GetCollectionsMongoDB(
                    'polls_db', ['polls', 'options', 'comments', 'categories'])

                # Create poll document in polls collection.
                poll = await polls_db.polls.insert_one(
                    {
                        "created_by": {
                            "user_id": request.user.id,
                            "username": request.user.username
                        },
                        "title": title,
                        "description": description,
                        "creation_date": datetime.now(),
                        "total_votes": 0,
                        "voters": [],
                        "privacy": privacy,
                        "category": category
                    },
                    session=session
                )

                # Get poll ID.
                poll_id = poll.inserted_id

                # Add the initial options in the options document.
                list_options = []
                for option in options:
                    list_options.append({
                        "created_by": {
                            "user_id": request.user.id,
                            "username": request.user.username
                        },
                        "option_text": option,
                        "votes": 0
                    })

                # Create options document in options collection.
                await polls_db.options.insert_one(
                    {
                        "poll_id": poll_id,
                        "options": list_options
                    },
                    session=session
                )

                # Create comments document in comments collection.
                await polls_db.comments.insert_one(
                    {
                        "poll_id": poll_id,
                        "comments": []
                    },
                    session=session
                )

                # Save transaction.
                await session.commit_transaction()

                # Response.
                return Response({"poll_id": str(poll_id)}, status=status.HTTP_201_CREATED)

    # Handle validation errors.
    except ValidationError as e:
        return Response({"error": e.detail}, status=status.HTTP_400_BAD_REQUEST)

    # Handle MongoDB errors.
    except PyMongoError as e:
        print(f'MongoDB Error: {e}')
        if session:
            await session.abort_transaction()
        return Response({"error": "An error occurred while processing your request."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Handle other exceptions.
    except Exception as e:
        print(f'Error: {e}')
        if session:
            await session.abort_transaction()
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    finally:
        if session:
            await session.end_session()


@api_view(['PATCH'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
async def update_poll(request):
    poll_id = request.data["poll_id"]
    # If poll_id is undefined.
    if not poll_id:
        raise ValidationError(
            {'poll_id': ["This field is required."]})
    try:
        # Get collections from the polls database.
        polls_db = GetCollectionsMongoDB('polls_db', ["polls"])
        # Find the poll in the polls collection.
        poll_bson = await polls_db.polls.find_one({"_id": ObjectId(poll_id)})

        # If poll is not found.
        if not poll_bson:
            raise ValidationError(
                {'poll_id': ["Poll is not found."]})

        # If user is not authorized.
        if poll_bson["created_by"]["user_id"] != request.user.id:
            raise ValidationError(
                {"error": "You are not authorized to read this poll."})

        # Initialize a PollSerializer instance with the provided data.
        serializer = PollSerializer(data=request.data, partial=True)
        # Throws ValidationError if not valid.
        serializer.is_valid(raise_exception=True)

        # Get the updated fields.
        data = serializer.validated_data
        # Update poll document in polls collection.
        await polls_db.polls.update_one(
            {"_id": ObjectId(poll_id)}, {"$set": data})

        # Response.
        return Response({"message": "Poll updated successfully."}, status=status.HTTP_200_OK)

    # Handle validation errors.
    except ValidationError as e:
        return Response({"error": e.detail}, status=status.HTTP_400_BAD_REQUEST)

    # Handle MongoDB errors.
    except PyMongoError as e:
        print(f'MongoDB Error: {e}')
        return Response({"error": "An error occurred while processing your request."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Handle other exceptions.
    except Exception as e:
        print(f'Error: {e}')
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


async def delete_poll(request):
    return Response("Poll removed")
