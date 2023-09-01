# Standard.
import os
from datetime import datetime
# Virtualenv.
from dotenv import load_dotenv
# Django.
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
# Rest Framework.
from rest_framework import status
from rest_framework.exceptions import ValidationError, PermissionDenied
from rest_framework.response import Response
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
# Async Rest Framework support.
from adrf.decorators import api_view
from asgiref.sync import async_to_sync, sync_to_async
# MongoDB connection.
from utils.mongo_connection import MongoDBSingleton
# MongoDB.
from pymongo.errors import PyMongoError
from bson import json_util
from bson.objectid import ObjectId
# Serializers.
from ..serializers import PollSerializer, OptionsSerializer


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

# Handles the get process for the polls.
@api_view(['GET'])
async def read_poll(request, poll_id):
    try:
        # Get collections from the polls database.
        polls_db = GetCollectionsMongoDB('polls_db', ["polls"])
        # Find the poll in the polls collection.
        poll_bson = await polls_db.polls.find_one({"_id": ObjectId(poll_id)})

        # If poll is not found.
        if not poll_bson:
            raise ValidationError("Poll is not found.")

        # If privacy of poll is private.
        if poll_bson["privacy"] == "private" and poll_bson["created_by"]["user_id"] != request.user.id:
            raise PermissionDenied(
                {"error": "This poll is private."})

        # If privacy of poll is friends_only. ?

        # Convert the BSON response to a JSON response.
        poll_json = json_util._json_convert((poll_bson))
        # Fix data.
        poll_json["_id"] = poll_json["_id"]["$oid"]
        poll_json["creation_date"] = poll_json["creation_date"]["$date"]

        # If the user is not the owner of the poll.
        is_owner = False
        # If the user is the owner of the poll.
        if poll_bson["created_by"]["user_id"] == request.user.id:
            is_owner = True

        # Response.
        return Response({
            "is_owner": is_owner,
            "poll": poll_json
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


# Handles the creation process for a news polls.
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
        # Get poll data.
        poll_data = poll_serializer.validated_data
        # Get options list.
        list_options = options_serializer.validated_data.get('options')

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
                            "username": request.user.username,
                            "first_name": request.user.first_name
                        },
                        "title": poll_data['title'],
                        "description": poll_data['description'],
                        "creation_date": datetime.now(),
                        "total_votes": 0,
                        "voters": [],
                        "privacy": poll_data['privacy'],
                        "category": poll_data['category']
                    },
                    session=session
                )

                # Get poll ID.
                poll_id = poll.inserted_id

                # Add the initial options in the options document.
                options = []
                for option in list_options:
                    options.append(
                        {
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
                        "options": options
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
        return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

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


# Handles the update process for the polls.
@api_view(['PATCH'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
async def update_poll(request, poll_id):
    try:
        # Get collections from the polls database.
        polls_db = GetCollectionsMongoDB('polls_db', ["polls"])
        # Find the poll in the polls collection.
        poll_bson = await polls_db.polls.find_one({"_id": ObjectId(poll_id)})

        # If poll is not found.
        if not poll_bson:
            raise ValidationError("Poll is not found.")

        # If user is not authorized.
        if poll_bson["created_by"]["user_id"] != request.user.id:
            raise PermissionDenied(
                "You are not authorized to update this poll.")

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


# Handles the remove process for the polls.
@api_view(['DELETE'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
async def delete_poll(request, poll_id):
    try:
        # Get collections from the polls database.
        polls_db = GetCollectionsMongoDB('polls_db', ["polls"])
        # Find the poll in the polls collection.
        poll = await polls_db.polls.find_one({"_id": ObjectId(poll_id)})

        # If poll is not found.
        if not poll:
            raise ValidationError("Poll is not found.",
                                  status=status.HTTP_404_NOT_FOUND)

        # If user is not authorized.
        if poll["created_by"]["user_id"] != request.user.id:
            raise PermissionDenied(
                "You are not authorized to remove this poll.")

        result = await polls_db.polls.delete_one({"_id": poll["_id"]})

        if result.deleted_count == 0:
            return Response({"message": "error."}, status=status.HTTP_404_NOT_FOUND)

        # Response.
        return Response({"message": "Poll removed successfully."}, status=status.HTTP_200_OK)

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


# Handles the get process for a user polls.
@api_view(['GET'])
async def user_polls(request, username):
    try:
        # If user not found. !!!

        # async_serializer = sync_to_async(UserSerializer)(request.user)
        # serialized_user = await async_serializer

        # Get the user in the User table.
        user = await User.objects.aget(username=username)

        # If user not exist. !!!
        if not user:
            return Response("user not found")

        # Get collections from the polls database.
        polls_db = GetCollectionsMongoDB('polls_db', ["polls"])

        # Find the polls in the polls collection.
        polls_cursor = polls_db.polls.find({"created_by.user_id": user.id})
        polls_list = await polls_cursor.to_list(length=None)

        # Convert the BSON response to a JSON response.
        polls_list_json = json_util._json_convert(polls_list)

        # Verify the privacy of polls.
        polls = []
        for poll in polls_list_json:
            # Fix data.
            poll["_id"] = poll["_id"]["$oid"]
            poll["creation_date"] = poll["creation_date"]["$date"]
            # If poll is public.
            if poll["privacy"] == "public":
                polls.append(poll)
            # If poll is private.
            if poll["privacy"] == "private" and poll["created_by"]["user_id"] == request.user.id:
                polls.append(poll)

            # If privacy of poll is friends_only. ?

        # If polls not found.
        if not polls:
            return Response(
                {'message': "This user does not have polls."})

        # If the user is not the owner of the poll.
        is_owner = False
        # If the user is the owner of the poll.
        if user.id == request.user.id:
            is_owner = True

        # Response.
        return Response({
            "is_owner": is_owner,
            "polls": polls
        })

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
