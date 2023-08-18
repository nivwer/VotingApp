# Standard.
import os
from datetime import datetime
# Virtualenv.
from dotenv import load_dotenv
# Django.
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse

from django.contrib.auth.models import User
# MongoDB connection.
from utils.mongo_connection import MongoDBSingleton

# Rest Framework.
from rest_framework import status
from rest_framework import exceptions
from rest_framework.response import Response
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework import serializers
# Async Rest Framework support .
from adrf.decorators import api_view
from asgiref.sync import async_to_sync, sync_to_async

# Serializers.
from .serializers import PollSerializer



# Load the virtual environment.
load_dotenv()


# Helpers.

# Connection to MongoDB databases.
class conn_mongoDBS:
    def __init__(self, database, collections):
        mongo_connection = MongoDBSingleton()
        client = mongo_connection.client
        db = client[database]

        for collection in collections:
            setattr(self, collection, db[collection])


# Views.

async def ruta(request):
    return HttpResponse('res')


@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
async def new_poll(request):
    try:
        # Get collections of the polls database.
        polls_db = conn_mongoDBS(
            'polls_db', ['polls', 'options', 'comments', 'categories'])
        
        # async_serializer = sync_to_async(UserSerializer)(request.user)
        # serialized_user = await async_serializer
        # user = await User.objects.aget(username=request.data['username'])

        # data = request.data
        # category = request.data['category']


        # Initialize a PollSerializer instance with the provided data.
        serializer = PollSerializer(data=request.data)
        # Throws ValidationError if not valid.
        serializer.is_valid(raise_exception=True)

        # If not category, category is none.
        title = serializer.validated_data.get('title')
        category = serializer.validated_data.get('category')
        description = serializer.validated_data.get('description')

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
                "privacy": "public",
                "category": category
            }
        )

        # Get poll ID.
        poll_id = poll.inserted_id

        # Create options document in options collection.
        options = request.data['options']
        if len(options) <= 1:
            return Response({"error": "options list expects two or more items."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
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

        await polls_db.options.insert_one(
            {
                "poll_id": poll_id,
                "options": list_options
            }
        )

        # Create comments document in comments collection.
        await polls_db.comments.insert_one({
            "poll_id": poll_id,
            "comments": []
        })

        return Response('res')

    # Handle validation errors.
    except serializers.ValidationError as e:
        print(f'Error: {e}')
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # Handle other exceptions.
    except Exception as e:
        print(f'Error: {e}')
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
