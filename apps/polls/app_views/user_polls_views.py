# Virtualenv.
from dotenv import load_dotenv
# Django.
from django.core.paginator import Paginator
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
from pymongo import DESCENDING
from pymongo.errors import PyMongoError
from bson import json_util
from bson.objectid import ObjectId
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
async def user_polls(request, username):
    # If user is login.
    is_login = True if request.user else False

    try:
        # Get the user data.
        user = await User.objects.aget(username=username)
        user_profile = await UserProfile.objects.aget(pk=user.pk)
        # Initialize a UserProfileSerializer instance.
        profile_data = UserProfileSerializer(instance=user_profile).data
        # Add user data to user profile data.
        profile_data['username'] = user.username

        # Get collections from the polls database.
        polls_db = GetCollectionsMongoDB(
            'polls_db', ['polls', 'user_votes'])

        # Find the polls in the polls collection.
        polls_list = await polls_db.polls.find(
            {'created_by.user_id': user.id},
            sort=[('creation_date', DESCENDING)]
        ).to_list(length=None)

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

            # If poll is public or private and is owner.
            if is_public or (is_private and is_owner):
                # Fix poll data.
                poll['_id'] = poll['_id']['$oid']
                poll['creation_date'] = poll['creation_date']['$date']
                # Add user profile data in the poll object.
                poll['profile'] = profile_data

                # Get user vote.
                vote = ''
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

                # Add the poll in polls.
                polls.append(poll)
            else:
                continue

        # If polls not found.
        if not polls:
            return Response(
                {'message': 'This user does not have polls.'})

        # In case the frontend has pagination or an integrated infinite scroll.
        if request.GET.get('page'):
            page_number = request.GET.get('page')
            paginator = Paginator(polls, 10)
            page_obj = paginator.get_page(page_number)

            page_values_json = json_util._json_convert(page_obj.object_list)

        # Polls res.
        res = page_values_json if request.GET.get('page') else polls

        # Response.
        return Response(
            {'polls':  res},
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
        print(str(e))
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
            'polls_db', ['polls', 'user_votes'])

        # Find the user voted polls in the voted_polls collection.
        user_votes_object = await polls_db.user_votes.find_one(
            {'user_id': user.id})

        # If user has not voted in a poll.
        if not user_votes_object:
            raise ValidationError(
                'The user has not voted in a poll.')

        # Convert the BSON object to a JSON object.
        user_votes_object_json = json_util._json_convert((user_votes_object))

        # Filter the polls.
        polls = []
        # If the user has already voted in this poll.
        for vote_object in user_votes_object_json['voted_polls']:
            # / REFACTOR ?
            # Get poll.
            poll_bson = await polls_db.polls.find_one(
                {'_id': ObjectId(vote_object['poll_id'])})

            # If poll not exist.
            if not poll_bson:
                # Remove the user vote in the votes object.
                await polls_db.user_votes.update_one(
                    {'user_id': request.user.id},
                    {
                        '$pull': {'voted_polls': {
                            'poll_id': ObjectId(vote_object['poll_id'])}}
                    },
                )
                continue

            # Convert the BSON object to a JSON object.
            poll = json_util._json_convert((poll_bson))
            # REFACTOR / ?

            # Verify the privacy of polls.
            is_public = poll['privacy'] == 'public'
            is_private = poll['privacy'] == 'private'
            is_owner = poll['created_by']['user_id'] == request.user.id
            # Add if is owner in the poll object.
            poll['is_owner'] = is_owner

            # If poll is public or is private and is owner.
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
                vote = ''
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
                {'message': 'This user has not voted for a poll.'})

        # In case the frontend has pagination or an integrated infinite scroll.
        if request.GET.get('page'):
            page_number = request.GET.get('page')
            paginator = Paginator(polls, 10)
            page_obj = paginator.get_page(page_number)

            page_values_json = json_util._json_convert(page_obj.object_list)

        # Polls res.
        res = page_values_json if request.GET.get('page') else polls
        res.reverse()

        # Response.
        return Response(
            {'polls': res},
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
