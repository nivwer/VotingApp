# Standard.
from datetime import datetime
# Virtualenv.
from dotenv import load_dotenv
# Django.
from django.contrib.auth.models import User
# Rest Framework.
from rest_framework import status
from rest_framework.exceptions import ValidationError, PermissionDenied
from rest_framework.response import Response
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import TokenAuthentication
# Async Rest Framework support.
from adrf.decorators import api_view
# MongoDB connection.
from utils.mongo_connection import MongoDBSingleton
# MongoDB.
from pymongo.errors import PyMongoError
from bson import json_util
from bson.objectid import ObjectId
# Models and Serializers.
from ..serializers import PollSerializer, OptionsSerializer
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
async def user_polls(request, username):
    # If user is login.
    is_login = True if request.user else False

    try:
        # Get the user in the User table.
        user = await User.objects.aget(username=username)

        # Get collections from the polls database.
        polls_db = GetCollectionsMongoDB(
            'polls_db', ['polls', 'options', 'users_voted'])

        # Find the polls in the polls collection.
        polls_cursor = polls_db.polls.find(
            {'created_by.user_id': user.id})

        polls_list = await polls_cursor.to_list(length=None)

        # Convert the BSON response to a JSON response.
        polls_list_json = json_util._json_convert(polls_list)

        # Find the user voted polls in the voted_polls collection.
        user_voted_polls = ''
        if is_login:
            user_voted_polls = await polls_db.users_voted.find_one(
                {'user_id': request.user.id})

        # Convert the BSON object to a JSON object.
        user_voted_polls_json = json_util._json_convert(
            (user_voted_polls))

        # Filter the polls.
        polls = []
        for poll in polls_list_json:
            # Get the user in the User table.
            user_data = await User.objects.aget(
                id=poll['created_by']['user_id'])
            # Get the user profile in the UserProfile table.
            user_profile = await UserProfile.objects.aget(
                pk=user_data.pk)
            # Initialize a UserProfileSerializer instance.
            profile_data = UserProfileSerializer(
                instance=user_profile).data
            # Add user data to user profile.
            profile_data['username'] = user_data.username
            # Add user profile in the poll object.
            poll['profile'] = profile_data

            # If the user not voted in this poll.
            is_user_vote = False
            if is_login:
                # If the user has not voted a poll.
                if not user_voted_polls:
                    poll['user_vote'] = ''
                    is_user_vote = True
                else:
                    # Get vote in the user voted polls object.
                    for v in user_voted_polls_json['voted_polls']:
                        if v['poll_id'] == poll['_id']['$oid']:
                            poll['user_vote'] = v['vote']
                            is_user_vote = True
                            break

            if not is_user_vote:
                poll['user_vote'] = ''

            # Find the poll options in the options collection.
            options_bson = await polls_db.options.find_one(
                {'poll_id': ObjectId(poll['_id']['$oid'])})
            # If options is not found.
            if not options_bson:
                raise ValidationError('Options not found.')
            # Convert the BSON response to a JSON response.
            options_json = json_util._json_convert((options_bson))
            # Add options in the poll object.
            poll['options'] = options_json['options']

            # Fix poll data.
            poll['_id'] = poll['_id']['$oid']
            poll['creation_date'] = poll['creation_date']['$date']

            # Verify the privacy of polls.
            is_public = poll['privacy'] == 'public'
            is_private = poll['privacy'] == 'private'
            is_owner = poll['created_by']['user_id'] == request.user.id
            # Add if is owner in the poll object.
            poll['is_owner'] = is_owner

            # If poll is public.
            if is_public:
                polls.append(poll)
            # If poll is private.
            if is_private and is_owner:
                polls.append(poll)

            # If privacy of poll is friends_only. ?

        # If polls not found.
        if not polls:
            return Response(
                {'message': 'This user does not have polls.'})

        # Response.
        return Response(
            {
                'polls': polls
            },
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


# Handles the get process for a user voted polls.
@api_view(['GET'])
@permission_classes([AllowAny])
async def user_voted_polls(request, username):
    # If user is login.
    is_login = True if request.user else False

    try:
        # Get the user in the User table.
        user = await User.objects.aget(username=username)

        # Get collections from the polls database.
        polls_db = GetCollectionsMongoDB(
            'polls_db', ['polls', 'options', 'users_voted'])

        # Find the user voted polls in the voted_polls collection.
        user_votes_object = await polls_db.users_voted.find_one(
            {'user_id': user.id})

        # If user has not voted in a poll.
        if not user_votes_object:
            raise ValidationError(
                'The user has not voted in a poll.')

        # Convert the BSON object to a JSON object.
        user_votes_object_json = json_util._json_convert(
            (user_votes_object))

        # Find the user voted polls in the voted_polls collection.
        user_voted_polls = ''
        if is_login:
            user_voted_polls = await polls_db.users_voted.find_one(
                {'user_id': request.user.id})

        # Convert the BSON object to a JSON object.
        user_voted_polls_json = json_util._json_convert(
            (user_voted_polls))

        # Filter the polls.
        polls = []
        # If the user has already voted in this poll.
        for v in user_votes_object_json['voted_polls']:

            # Get poll.
            poll_bson = await polls_db.polls.find_one(
                {'_id': ObjectId(v['poll_id'])})
            # Convert the BSON object to a JSON object.
            poll = json_util._json_convert((poll_bson))

            # Get the user in the User table.
            user_data = await User.objects.aget(
                id=poll['created_by']['user_id'])
            # Get the user profile in the UserProfile table.
            user_profile = await UserProfile.objects.aget(
                pk=user_data.pk)
            # Initialize a UserProfileSerializer instance.
            profile_data = UserProfileSerializer(
                instance=user_profile).data
            # Add user data to user profile.
            profile_data['username'] = user_data.username
            # Add user profile in the poll object.
            poll['profile'] = profile_data

            # If the user not voted in this poll.
            is_user_vote = False
            if is_login:
                # If the user has not voted a poll.
                if not user_voted_polls:
                    poll['user_vote'] = ''
                    is_user_vote = True
                else:
                    # Get vote in the user voted polls object.
                    for v in user_voted_polls_json['voted_polls']:
                        if v['poll_id'] == poll['_id']['$oid']:
                            poll['user_vote'] = v['vote']
                            is_user_vote = True
                            break

            if not is_user_vote:
                poll['user_vote'] = ''

            # Find the poll options in the options collection.
            options_bson = await polls_db.options.find_one(
                {'poll_id': ObjectId(poll['_id']['$oid'])})
            # If options is not found.
            if not options_bson:
                raise ValidationError('Options not found.')
            # Convert the BSON object to a JSON object.
            options_json = json_util._json_convert((options_bson))
            # Add options in the poll object.
            poll['options'] = options_json['options']

            # Fix poll data.
            poll['_id'] = poll['_id']['$oid']
            poll['creation_date'] = poll['creation_date']['$date']

            # Verify the privacy of polls.
            is_public = poll['privacy'] == 'public'
            is_private = poll['privacy'] == 'private'
            is_owner = poll['created_by']['user_id'] == request.user.id
            # Add if is owner in the poll object.
            poll['is_owner'] = is_owner

            # If poll is public.
            if is_public:
                polls.append(poll)
            # If poll is private.
            if is_private and is_owner:
                polls.append(poll)

        # If polls not found.
        if not polls:
            return Response(
                {'message': 'This user has not voted for a poll.'})

        # Response.
        return Response(
            {
                'polls': polls
            },
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

