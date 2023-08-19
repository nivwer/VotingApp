# Standard.
import os
from datetime import datetime
# Virtualenv.
from dotenv import load_dotenv
# Django.
from django.http import HttpResponse
# Rest Framework.
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
# Async Rest Framework support.
from adrf.decorators import api_view
from asgiref.sync import async_to_sync, sync_to_async
# MongoDB.
from pymongo.errors import PyMongoError 
# MongoDB connection.
from utils.mongo_connection import MongoDBSingleton
# Serializers.
from .serializers import PollSerializer

# Load the virtual environment.
load_dotenv()

async def ruta(request):
    # async_serializer = sync_to_async(UserSerializer)(request.user)
    # serialized_user = await async_serializer
    # user = await User.objects.aget(username=request.data['username'])
    return HttpResponse('res')

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

# Handles the creation procces for a news polls.
@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
async def new_poll(request):
    session = None
    try:
        # Initialize a PollSerializer instance with the provided data.
        serializer = PollSerializer(data=request.data)
        # Throws ValidationError if not valid.
        serializer.is_valid(raise_exception=True)

        # Fields requireds.
        title = serializer.validated_data.get('title')
        options = serializer.validated_data.get('options')
        # If the value is undefined, the value is null.
        description = serializer.validated_data.get('description')
        category = serializer.validated_data.get('category')

        # If the list options do not have a length of two or more items.
        if len(options) <= 1:
            raise ValidationError(
                {'options': ["This field expects a list with two or more items."]})
        
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
                        "privacy": "public",
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
                return Response('res', status=status.HTTP_201_CREATED)

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
