# Virtualenv.
from dotenv import load_dotenv
# Django.
from django.contrib.auth.models import User
# Rest Framework.
from rest_framework import status
from rest_framework.exceptions import ValidationError, PermissionDenied
from rest_framework.response import Response
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny
# Async Rest Framework support.
from adrf.decorators import api_view
# MongoDB connection.
from utils.mongo_connection import MongoDBSingleton
# MongoDB.
from pymongo.errors import PyMongoError
from bson import json_util
# Models and Serializers.
from apps.profiles.models import UserProfile
from apps.profiles.serializers import UserProfileSerializer

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

# Handles the get process for a user polls.
@api_view(['GET'])
@permission_classes([AllowAny])
async def category_polls(request, category):
    # If user is login.
    is_login = True if request.user else False

    try:
        # Get collections from the polls database.
        polls_db = GetCollectionsMongoDB(
            'polls_db', ['polls', 'user_votes'])

        # Find the polls in the polls collection.
        polls_cursor = polls_db.polls.find({'category': category})
        polls_list = await polls_cursor.to_list(length=None)

        # Convert the BSON response to a JSON response.
        polls_list_json = json_util._json_convert(polls_list)

        # Filter the polls.
        polls = []
        for poll in polls_list_json:
            # Verify the privacy of polls.
            is_public = poll['privacy'] == 'public'
            is_private = poll['privacy'] == 'private'
            is_owner = poll['created_by']['user_id'] == request.user.id
            # Add if is owner in the poll object.
            poll['is_owner'] = is_owner

            if is_public or (is_private and is_owner):
                # Fix poll data.
                poll['_id'] = poll['_id']['$oid']
                poll['creation_date'] = poll['creation_date']['$date']

                # Get the user data.
                user_data = await User.objects.aget(id=poll['created_by']['user_id'])
                user_profile = await UserProfile.objects.aget(pk=user_data.pk)
                # Initialize a UserProfileSerializer instance.
                profile_data = UserProfileSerializer(
                    instance=user_profile).data
                # Add user data to user profile data.
                profile_data['username'] = user_data.username
                # Add user profile data in the poll object.
                poll['profile'] = profile_data

                # Get user vote.
                if is_login:
                    is_voter = request.user.id in poll['voters']
                    if is_voter:
                        # Find the vote in the user_votes collection.
                        user_vote = await polls_db.user_votes.find_one(
                            {
                                'user_id': request.user.id,
                                'voted_polls.poll_id': poll['_id']
                            },
                            projection={'voted_polls.$': 1})

                        # If the user has voted a poll.
                        if user_vote:
                            vote = user_vote['voted_polls'][0]['vote']

                # Add the vote in the poll.
                poll['user_vote'] = vote if vote else ''

                polls.append(poll)
            else:
                continue

        # If polls not found.
        if not polls:
            return Response(
                {'message': 'Polls not found.'})

        # Response.
        return Response(
            {'polls': polls},
            status=status.HTTP_200_OK)

    # Handle validation errors.
    except ValidationError as e:
        return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

    # Handle if the user is not found.
    except User.DoesNotExist:
        return Response(
            {'username': ['User is not found.']},
            status=status.HTTP_404_NOT_FOUND)

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
