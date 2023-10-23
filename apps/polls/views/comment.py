# Standard.
from datetime import datetime
# Virtualenv.
from dotenv import load_dotenv
# Django.
from django.core.paginator import Paginator
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
from pymongo import DESCENDING
from pymongo.errors import PyMongoError
from bson import json_util
from bson.objectid import ObjectId
# Models and Serializers.
from ..serializers import PollSerializer, OptionsSerializer, CommentSerializer
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

# Handle the process of creating comments in a poll.


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
async def comment_add(request, id):
    session = None
    try:
        # Get collections from the polls database.
        polls_db = GetCollectionsMongoDB(
            'polls_db', ['polls', 'comments'])

        # Find the poll in the polls collection.
        poll_bson = await polls_db.polls.find_one(
            {'_id': ObjectId(id)})

        # If poll is not found.
        if not poll_bson:
            raise ValidationError('Poll is not found.')

        # Initialize a Comment Serializer instance.
        comment_serializer = CommentSerializer(data=request.data)
        comment_serializer.is_valid(raise_exception=True)
        comment = comment_serializer.validated_data.get('comment')

        # Initialize a MongoDB session.
        async with await MongoDBSingleton().client.start_session() as session:
            # Initialize a MongoDB transaccion.
            async with session.start_transaction():

                # # Add the comment in comments document.
                # await polls_db.comments.update_one(
                #     {'poll_id': id},
                #     {
                #         '$push': {
                #             'comments': {
                #                 'user_id': request.user.id,
                #                 'creation_date': datetime.now(),
                #                 'comment': comment
                #             }
                #         }
                #     },
                #     session=session
                # )

                # Add the comment in comments document.
                await polls_db.comments.insert_one(
                    {
                        'user_id': request.user.id,
                        'comment': comment,
                        'created_at': datetime.now(),
                        'poll_id': id,
                    },
                    session=session
                )

                # Add comment in comment counter.
                await polls_db.polls.update_one(
                    {'_id': ObjectId(id)},
                    {
                        '$inc': {'comment_counter': 1}
                    },
                    session=session
                )

                # Save transaction.
                await session.commit_transaction()

                # Response.
                return Response('Comment created successfully')

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


# Handles the process of updating a comment in a poll.
@api_view(['UPDATE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
async def comment_update(request, id, comment_id):
    session = None
    try:
        # Get collections from the polls database.
        polls_db = GetCollectionsMongoDB(
            'polls_db', ['polls', 'comments'])

        # Find the poll in the polls collection.
        poll_bson = await polls_db.polls.find_one(
            {'_id': ObjectId(id)})

        # If poll is not found.
        if not poll_bson:
            raise ValidationError('Poll is not found.')

         # If user is not authorized.
        is_owner = poll_bson['user_id'] == request.user.id
        if not is_owner:
            raise PermissionDenied(
                'You are not authorized to update this comment.')

        # Initialize a Comment Serializer instance.
        comment_serializer = CommentSerializer(data=request.data)
        comment_serializer.is_valid(raise_exception=True)
        comment = comment_serializer.validated_data.get('comment')

        # Initialize a MongoDB session.
        async with await MongoDBSingleton().client.start_session() as session:
            # Initialize a MongoDB transaccion.
            async with session.start_transaction():

                # Update the comment in comments document.
                await polls_db.comments.update_one(
                    {'_id': comment_id},
                    {
                        '$set': {'comment': comment}
                    },
                    session=session
                )

                # Save transaction.
                await session.commit_transaction()

                # Response.
                return Response('Comment updated successfully')

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


# Handles the process of removing a comment in a poll.
@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
async def comment_delete(request, id, comment_id):
    session = None
    try:
        # Get collections from the polls database.
        polls_db = GetCollectionsMongoDB(
            'polls_db', ['polls', 'comments'])

        # Find the poll in the polls collection.
        poll_bson = await polls_db.polls.find_one(
            {'_id': ObjectId(id)})

        # If poll is not found.
        if not poll_bson:
            raise ValidationError('Poll is not found.')

         # If user is not authorized.
        is_owner = poll_bson['user_id'] == request.user.id
        if not is_owner:
            raise PermissionDenied(
                'You are not authorized to remove this comment.')

        # Initialize a MongoDB session.
        async with await MongoDBSingleton().client.start_session() as session:
            # Initialize a MongoDB transaccion.
            async with session.start_transaction():

                # Remove the comment in comments document.
                await polls_db.comments.delete_one(
                    {'_id': comment_id},
                    session=session
                )

                # Save transaction.
                await session.commit_transaction()

                # Response.
                return Response('Comment updated successfully')

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


# Handles the process of obtaining comments.
@api_view(['GET'])
@permission_classes([AllowAny])
async def comments_read(request, id):
    try:
        # Get collections from the polls database.
        polls_db = GetCollectionsMongoDB(
            'polls_db', ['polls', 'comments'])

        # Find the poll in the polls collection.
        poll_bson = await polls_db.polls.find_one(
            {'_id': ObjectId(id)})

        # If poll is not found.
        if not poll_bson:
            raise ValidationError('Poll is not found.')

        # Convert the BSON to a JSON.
        poll_json = json_util._json_convert(poll_bson)

        # Verify the privacy of polls.
        is_private = poll_json['privacy'] == 'private'
        is_owner = poll_json['user_id'] == request.user.id

        # If poll private.
        if (not is_owner) and is_private:
            raise PermissionDenied('This poll is private.')

        # If privacy of poll is friends_only. ?

        # # Find the poll comments in comments collection.
        # comments_bson = await polls_db.comments.find(
        #     {'poll_id': id})

        # Find the poll comments document in comments collection.
        comments_bson = await polls_db.comments.find(
            {'poll_id': id},
            sort=[('created_at', DESCENDING)]
        ).to_list(length=None)

        # Convert the BSON to a JSON.
        comments_json = json_util._json_convert(comments_bson)

        comments = []
        for comment in comments_json:
            # Fix data.
            comment['created_at'] = comment['created_at']['$date']

            # Get the user data.
            user_data = await User.objects.filter(id=comment['user_id']).values(
                'username', 'userprofile__profile_picture', 'userprofile__profile_name').afirst()

            # Get the user data.
            # user_data = await User.objects.aget(id=comment['user_id'])
            # user_profile = await UserProfile.objects.aget(pk=comment['user_id'])

            # # Initialize a UserProfileSerializer instance.
            # profile_data = UserProfileSerializer(
            #     instance=user_profile).data
            # Add user data to user profile data.
            # profile_data['username'] = profile_data
            # # Add user profile data in the poll object.
            # comment['user_profile'] = profile_data

            if user_data:
                comment['user_profile'] = {
                    'username': user_data['username'],
                    'profile_picture': user_data['userprofile__profile_picture'],
                    'profile_name': user_data['userprofile__profile_name']
                }

            comments.append(comment)

        # If polls not found.
        if not comments:
            return Response(
                {'message': 'Comments not found.'})

        # In case the frontend has pagination or an integrated infinite scroll.
        if request.GET.get('page'):
            page_number = request.GET.get('page')
            paginator = Paginator(comments, 10)
            page_obj = paginator.get_page(page_number)

            page_values_json = json_util._json_convert(page_obj.object_list)

        # Polls res.
        res = page_values_json if request.GET.get('page') else comments

        # Response.
        return Response(
            {'comments':  res},
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
