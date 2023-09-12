# Standard.
import os
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

# Handles the get process for the polls.
@api_view(['GET'])
async def read_poll(request, poll_id):
    try:
        # Get collections from the polls database.
        polls_db = GetCollectionsMongoDB('polls_db', ['polls', 'options'])
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

        # Find the poll options in the options collection.
        options_bson = await polls_db.options.find_one(
            {'poll_id': ObjectId(poll_id)})

        # If options is not found.
        if not options_bson:
            raise ValidationError('Options not found.')

        # Convert the BSON response to a JSON response.
        poll_json = json_util._json_convert((poll_bson))
        options_json = json_util._json_convert((options_bson))
        # Add the options in the poll object.
        poll_json['options'] = options_json['options']
        # Fix data.
        poll_json['_id'] = poll_json['_id']['$oid']
        poll_json['creation_date'] = poll_json['creation_date']['$date']

        # Response.
        return Response(
            {
                'is_owner': is_owner,
                'poll': poll_json,
            }
        )

    # Handle validation errors.
    except ValidationError as e:
        return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

    # Handle permission denied.
    except PermissionDenied as e:
        return Response(e.detail, status=status.HTTP_403_FORBIDDEN)

    # Handle MongoDB errors.
    except PyMongoError as e:
        print(f'MongoDB Error: {e}')
        return Response(
            {'error': 'An error occurred while processing your request.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Handle other exceptions.
    except Exception as e:
        print(f'Error: {e}')
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Handles the creation process for a news polls.
@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
async def create_poll(request):
    session = None
    options_object = {
        'options': request.data['options']['add_options']
    }
    try:
        # Initialize a Serializers instance with the provided data.
        poll_serializer = PollSerializer(data=request.data)
        options_serializer = OptionsSerializer(data=options_object)
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
                        'created_by': {'user_id': request.user.id, },
                        'title': poll_data['title'],
                        'description': poll_data['description'],
                        'creation_date': datetime.now(),
                        'total_votes': 0,
                        'voters': [],
                        'privacy': poll_data['privacy'],
                        'category': poll_data['category']
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
                            'created_by': {'user_id': request.user.id, },
                            'option_text': option,
                            'votes': 0
                        })

                # Create options document in options collection.
                await polls_db.options.insert_one(
                    {
                        'poll_id': poll_id,
                        'options': options
                    },
                    session=session
                )

                # Create comments document in comments collection.
                await polls_db.comments.insert_one(
                    {
                        'poll_id': poll_id,
                        'comments': []
                    },
                    session=session
                )

                # Save transaction.
                await session.commit_transaction()

                # Response.
                return Response(
                    {
                        'message': 'Poll created successfully',
                        'poll_id': str(poll_id)
                    },
                    status=status.HTTP_201_CREATED)

    # Handle validation errors.
    except ValidationError as e:
        return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

    # Handle MongoDB errors.
    except PyMongoError as e:
        print(f'MongoDB Error: {e}')
        if session:
            await session.abort_transaction()
        return Response(
            {'error': 'An error occurred while processing your request.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Handle other exceptions.
    except Exception as e:
        print(f'Error: {e}')
        if session:
            await session.abort_transaction()
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    finally:
        if session:
            await session.end_session()


# Handles the update process for the polls.
@api_view(['PATCH'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
async def update_poll(request, poll_id):
    session = None
    try:
        # Get collections from the polls database.
        polls_db = GetCollectionsMongoDB('polls_db', ['polls', 'options'])
        # Find the poll in the polls collection.
        poll_bson = await polls_db.polls.find_one(
            {'_id': ObjectId(poll_id)})
        # If poll is not found.
        if not poll_bson:
            raise ValidationError('Poll is not found.')
        # If user is not authorized.
        if poll_bson['created_by']['user_id'] != request.user.id:
            raise PermissionDenied(
                'You are not authorized to update this poll.')

        # Initialize a Serializers instance with the provided data.
        poll_serializer = PollSerializer(data=request.data, partial=True)
        # Throws ValidationError if not valid.
        poll_serializer.is_valid(raise_exception=True)
        # Get the updated fields.
        data = poll_serializer.validated_data

        # Find the poll options.
        options = await polls_db.options.find_one(
            {'poll_id': ObjectId(poll_id)}
        )

        validate_options = {'options': []}
        for option in options['options']:
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

        # Initialize a Serializers instance with the provided data.
        options_serializer = OptionsSerializer(data=validate_options)
        # Throws ValidationError if not valid.
        options_serializer.is_valid(raise_exception=True)

        # Initialize a MongoDB session.
        async with await MongoDBSingleton().client.start_session() as session:
            # Initialize a MongoDB transaccion.
            async with session.start_transaction():

                # Update poll document in polls collection.
                await polls_db.polls.update_one(
                    {'_id': ObjectId(poll_id)},
                    {'$set': data}, session=session)

                # If there options to add in the options document.
                if request.data['options']['add_options']:
                    for option in add_options:
                        # If the option already exist.
                        exist = False
                        for o in options['options']:
                            if o['option_text'] == option:
                                exist = True

                        if exist:
                            await session.abort_transaction()
                            raise ValidationError(
                                f"This options '{option}' already exist.")

                        new_option = {
                            'created_by': {
                                'user_id': request.user.id,
                            },
                            'option_text': option,
                            'votes': 0
                        }

                        # Save the option object.
                        await polls_db.options.update_one(
                            {'poll_id': ObjectId(poll_id)},
                            {'$push': {'options': new_option}},
                            session=session)

                # If there options to remove in the options document.
                if request.data['options']['del_options']:
                    for option in del_options:
                        # If the option already exist.
                        exist = False
                        for o in options['options']:
                            if o['option_text'] == option:
                                exist = True

                        if not exist:
                            await session.abort_transaction()
                            raise ValidationError(
                                f"This option '{option}' not exist.")

                        # Remove the option.
                        await polls_db.options.update_one(
                            {'poll_id': ObjectId(poll_id)},
                            {'$pull': {'options':
                                       {'option_text': option}}},
                            session=session)

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
        print(f'MongoDB Error: {e}')
        if session:
            await session.abort_transaction()
        return Response(
            {'error': 'An error occurred while processing your request.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Handle other exceptions.
    except Exception as e:
        print(f'Error: {e}')
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
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
async def delete_poll(request, poll_id):
    try:
        # Get collections from the polls database.
        polls_db = GetCollectionsMongoDB('polls_db', ['polls', 'options'])
        # Find the poll in the polls collection.
        poll = await polls_db.polls.find_one({'_id': ObjectId(poll_id)})

        # If poll is not found.
        if not poll:
            raise ValidationError(
                'Poll is not found.',
                status=status.HTTP_404_NOT_FOUND)

        # If user is not authorized.
        if poll['created_by']['user_id'] != request.user.id:
            raise PermissionDenied(
                'You are not authorized to remove this poll.')

        # Initialize a MongoDB session.
        async with await MongoDBSingleton().client.start_session() as session:
            # Initialize a MongoDB transaccion.
            async with session.start_transaction():

                # Remove the poll.
                poll_result = await polls_db.polls.delete_one(
                    {'_id': poll['_id']},
                    session=session
                )
                is_poll_removed = poll_result.deleted_count == 0

                # Remove the options.
                options_result = await polls_db.options.delete_one(
                    {'poll_id': poll['_id']},
                    session=session
                )
                is_options_removed = options_result.deleted_count == 0

                # If not removed.
                if is_options_removed or is_poll_removed:
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
        print(f'MongoDB Error: {e}')
        if session:
            await session.abort_transaction()
        return Response(
            {'error': 'An error occurred while processing your request.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Handle other exceptions.
    except Exception as e:
        print(f'Error: {e}')
        if session:
            await session.abort_transaction()
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    finally:
        if session:
            await session.end_session()


# Handles the get process for a user polls.
@api_view(['GET'])
async def user_polls(request, username):
    try:
        # Get the user in the User table.
        user = await User.objects.aget(username=username)

        # Get collections from the polls database.
        polls_db = GetCollectionsMongoDB('polls_db', ['polls', 'options'])

        # Find the polls in the polls collection.
        polls_cursor = polls_db.polls.find(
            {'created_by.user_id': user.id})
        polls_list = await polls_cursor.to_list(length=None)

        # Convert the BSON response to a JSON response.
        polls_list_json = json_util._json_convert(polls_list)

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
        print(f'MongoDB Error: {e}')
        return Response(
            {'error': 'An error occurred while processing your request.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Handle other exceptions.
    except Exception as e:
        print(f'Error: {e}')
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
