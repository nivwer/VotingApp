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


# Handles the creation process for the polls.
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
async def poll_create(request):
    session = None
    options_object = {'options': request.data['options']['add_options']}

    try:
        # Initialize a Poll Serializer instance.
        poll_serializer = PollSerializer(data=request.data)
        poll_serializer.is_valid(raise_exception=True)
        poll_data = poll_serializer.validated_data

        # Initialize a Options Serializer instance.
        options_serializer = OptionsSerializer(data=options_object)
        options_serializer.is_valid(raise_exception=True)
        list_options = options_serializer.validated_data.get('options')

        # Create options objects.
        options = []
        for option in list_options:
            options.append(
                {
                    'created_by': {'user_id': request.user.id},
                    'option_text': option,
                    'votes': 0
                }
            )

        # Get collections from the polls database.
        polls_db = GetCollectionsMongoDB(
            'polls_db', ['polls', 'comments'])

        # Initialize a MongoDB session.
        async with await MongoDBSingleton().client.start_session() as session:
            # Initialize a MongoDB transaccion.
            async with session.start_transaction():

                # Create poll document in polls collection.
                poll = await polls_db.polls.insert_one(
                    {
                        'created_by': {'user_id': request.user.id},
                        'title': poll_data['title'],
                        'description': poll_data['description'],
                        'creation_date': datetime.now(),
                        'total_votes': 0,
                        'voters': [],
                        'privacy': poll_data['privacy'],
                        'category': poll_data['category'],
                        'options': options,
                        'share_counter': 0,
                        'comment_counter': 0,
                    },
                    session=session
                )

                # Get poll ID.
                # poll_id = poll.inserted_id

                # # Create comments document in comments collection.
                # await polls_db.comments.insert_one(
                #     {
                #         'poll_id': str(poll_id),
                #         'comments': []
                #     },
                #     session=session
                # )

                # Save transaction.
                await session.commit_transaction()

                # poll_json = json_util._json_convert((poll_id))

                # Response.
                return Response(
                    {'message': 'Poll created successfully'},
                    status=status.HTTP_201_CREATED)

    # Handle validation errors.
    except ValidationError as e:
        return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

    # Handle MongoDB errors.
    except PyMongoError as e:
        if session:
            await session.abort_transaction()
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Handle other exceptions.
    except Exception as e:
        if session:
            await session.abort_transaction()
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    finally:
        if session:
            await session.end_session()


# Handles the read to a polls.
@api_view(['GET'])
@permission_classes([AllowAny])
async def poll_read(request, id):
    # If user is login.
    is_login = True if request.user else False

    try:
        # Get the user in the User table.
        user = await User.objects.aget(
            username=request.user.username)

        # Get collections from the polls database.
        polls_db = GetCollectionsMongoDB(
            'polls_db', ['polls', 'user_votes'])

        # Find the poll in the polls collection.
        poll_bson = await polls_db.polls.find_one(
            {'_id': ObjectId(id)})

        # If poll is not found.
        if not poll_bson:
            raise ValidationError('Poll is not found.')

        # Convert the BSON response to a JSON response.
        poll_json = json_util._json_convert((poll_bson))

        # If privacy of poll is private.
        is_private = poll_bson['privacy'] == 'private'
        is_owner = poll_bson['created_by']['user_id'] == request.user.id
        if (not is_owner) and is_private:
            raise PermissionDenied('This poll is private.')

        # If privacy of poll is friends_only. ?

        # Fix data.
        poll_json['_id'] = poll_json['_id']['$oid']
        poll_json['creation_date'] = poll_json['creation_date']['$date']
        poll_json['is_owner'] = is_owner

        # Get the user data.
        user_data = await User.objects.aget(
            id=poll_json['created_by']['user_id'])
        user_profile = await UserProfile.objects.aget(
            pk=user_data.pk)
        # Initialize a UserProfileSerializer instance.
        profile_data = UserProfileSerializer(
            instance=user_profile).data
        # Add user data to user profile data.
        profile_data['username'] = user_data.username
        # Add user profile data in the poll object.
        poll_json['profile'] = profile_data

        # Get user vote.
        vote = ''
        if is_login:
            is_voter = request.user.id in poll_json['voters']
            if is_voter:
                # Find the vote in the user_votes collection.
                user_vote = await polls_db.user_votes.find_one(
                    {
                        'user_id': request.user.id,
                        'voted_polls.poll_id': poll_json['_id']
                    },
                    projection={'voted_polls.$': 1})

                # If the user has voted a poll.
                if user_vote:
                    vote = user_vote['voted_polls'][0]['vote']

            # Add the vote in the poll.
            poll_json['user_vote'] = vote if vote else ''

        # Response.
        return Response(poll_json)

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


# Handles the update process for the polls.
@api_view(['PATCH'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
async def poll_update(request, id):
    session = None
    try:
        # Get collections from the polls database.
        polls_db = GetCollectionsMongoDB('polls_db', ['polls'])

        # Find the poll in the polls collection.
        poll_bson = await polls_db.polls.find_one(
            {'_id': ObjectId(id)})

        # If poll is not found.
        if not poll_bson:
            raise ValidationError('Poll is not found.')

        # If user is not authorized.
        is_owner = poll_bson['created_by']['user_id'] == request.user.id
        if not is_owner:
            raise PermissionDenied(
                'You are not authorized to update this poll.')

        # Initialize a Poll Serializers instance.
        poll_serializer = PollSerializer(data=request.data, partial=True)
        poll_serializer.is_valid(raise_exception=True)
        data = poll_serializer.validated_data

        # Get poll options.
        poll_json = json_util._json_convert((poll_bson))
        options = poll_json['options']

        # Generate the list of options with the previous options.
        validate_options = {'options': []}
        for option in options:
            validate_options['options'].append(option['option_text'])

        # If there options to add or remove in the options document.
        add_options = request.data['options']['add_options']
        del_options = request.data['options']['del_options']

        # Add o Remove the options to validate options.
        if add_options:
            for option in add_options:
                validate_options['options'].append(option)

        if del_options:
            for option in del_options:
                validate_options['options'].remove(option)

        # Initialize a Options Serializers instance.
        options_serializer = OptionsSerializer(data=validate_options)
        options_serializer.is_valid(raise_exception=True)

        # Validate if the options to add do not exist, and generate the option object.
        add_options_object = []
        if request.data['options']['add_options']:
            for option in add_options:
                # If the option already exist.
                exist = any(o['option_text'] == option for o in options)

                if exist:
                    raise ValidationError(
                        f"This options '{option}' already exist.")

                add_options_object.append(
                    {
                        'created_by': {'user_id': request.user.id},
                        'option_text': option,
                        'votes': 0
                    })

        # validates if the options to eliminate exist.
        if request.data['options']['del_options']:
            for option in del_options:
                # If the option already exist.
                exist = any(o['option_text'] == option for o in options)

                if not exist:
                    raise ValidationError(
                        f"This option '{option}' not exist.")

        # Initialize a MongoDB session.
        async with await MongoDBSingleton().client.start_session() as session:
            # Initialize a MongoDB transaccion.
            async with session.start_transaction():

                # Update poll document in polls collection.
                await polls_db.polls.update_one(
                    {'_id': ObjectId(id)},
                    {
                        '$set': data
                    },
                    session=session)

                # Add options.
                if request.data['options']['add_options']:
                    await polls_db.polls.update_one(
                        {'_id': ObjectId(id)},
                        {
                            '$addToSet': {'options': {'$each': add_options_object}}
                        },
                        session=session)

                # Remove options.
                if request.data['options']['del_options']:
                    await polls_db.polls.update_one(
                        {'_id': ObjectId(id)},
                        {
                            '$pull': {'options': {'option_text': {'$in': del_options}}}
                        },
                        session=session)

                # Save transaction.
                await session.commit_transaction()

                # Response.
                return Response(
                    {'message': 'Poll updated successfully.'},
                    status=status.HTTP_200_OK)

    # Handle validation errors.
    except ValidationError as e:
        return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

    # Handle permission denied.
    except PermissionDenied as e:
        return Response(e.detail, status=status.HTTP_403_FORBIDDEN)

    # Handle MongoDB errors.
    except PyMongoError as e:
        if session:
            await session.abort_transaction()
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Handle other exceptions.
    except Exception as e:
        if session:
            await session.abort_transaction()
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    finally:
        if session:
            await session.end_session()


# Handles the remove process for the polls.
@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
async def poll_delete(request, id):
    session = None
    try:
        # Get collections from the polls database.
        polls_db = GetCollectionsMongoDB(
            'polls_db', ['polls', 'comments'])

        # Find the poll in the polls collection.
        poll = await polls_db.polls.find_one(
            {'_id': ObjectId(id)})

        # If poll is not found.
        if not poll:
            raise ValidationError(
                'Poll is not found.',
                status=status.HTTP_404_NOT_FOUND)

        # If user is not authorized.
        is_owner = poll['created_by']['user_id'] == request.user.id
        if not is_owner:
            raise PermissionDenied(
                'You are not authorized to remove this poll.')

        # Initialize a MongoDB session.
        async with await MongoDBSingleton().client.start_session() as session:
            # Initialize a MongoDB transaccion.
            async with session.start_transaction():

                # Remove the poll.
                poll_result = await polls_db.polls.delete_one(
                    {'_id': poll['_id']},
                    session=session)

                # Remove the poll.
                comments_result = await polls_db.comments.delete_one(
                    {'poll_id': id},
                    session=session)

                isRemoved = poll_result.deleted_count == 0 or comments_result.deleted_count == 0

                # If not removed.
                if isRemoved:
                    await session.abort_transaction()
                    raise PyMongoError(
                        'An error occurred while processing your request.',
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                # Save transaction.
                await session.commit_transaction()

                # Response.
                return Response(
                    {'message': 'Poll removed successfully.'},
                    status=status.HTTP_200_OK)

    # Handle validation errors.
    except ValidationError as e:
        return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

    # Handle permission denied.
    except PermissionDenied as e:
        return Response(e.detail, status=status.HTTP_403_FORBIDDEN)

    # Handle MongoDB errors.
    except PyMongoError as e:
        if session:
            await session.abort_transaction()
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Handle other exceptions.
    except Exception as e:
        if session:
            await session.abort_transaction()
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    finally:
        if session:
            await session.end_session()
