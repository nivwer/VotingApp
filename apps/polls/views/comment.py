# Standard.
from datetime import datetime
# BSON.
from bson import json_util
from bson.objectid import ObjectId
# Django.
from django.core.paginator import Paginator
from django.contrib.auth.models import User
# Rest Framework.
from rest_framework import status
from rest_framework.exceptions import ValidationError, PermissionDenied, NotFound
from rest_framework.response import Response
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import TokenAuthentication
# Async Rest Framework support.
from adrf.decorators import api_view
# MongoDB connection.
from utils.mongo_connection import MongoDBSingleton
# PyMongo.
from pymongo import DESCENDING
from pymongo.errors import PyMongoError
# Models and Serializers.
from ..serializers import CommentSerializer


# Views.


# Handle the process of creating comments in a poll.
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
async def comment_add(request, id):
    session = None

    # If poll ID is invalid.
    if len(id) != 24:
        raise ValidationError(
            detail={'message': 'Invalid poll ID'})

    try:
        # Connect to the MongoDB databases.
        polls_db = MongoDBSingleton().client['polls_db']

        # Find the poll in the polls collection.
        poll_bson = await polls_db.polls.find_one(
            {'_id': ObjectId(id)})

        # If poll is not found.
        if not poll_bson:
            raise NotFound(
                detail={'message': 'Poll not found'})

        # Initialize a Comment Serializer instance.
        comment_serializer = CommentSerializer(data=request.data)
        comment_serializer.is_valid(raise_exception=True)
        comment = comment_serializer.validated_data.get('comment')

        # Initialize a MongoDB session.
        async with await MongoDBSingleton().client.start_session() as session:
            # Initialize a MongoDB transaccion.
            async with session.start_transaction():

                # Add the comment in comments document.
                comment = await polls_db.comments.insert_one(
                    {
                        'user_id': request.user.id,
                        'comment': comment,
                        'created_at': datetime.now(),
                        'poll_id': ObjectId(id),
                    },
                    session=session
                )

                comment_id = comment.inserted_id

                # Add comment in comment counter.
                await polls_db.polls.update_one(
                    {'_id': ObjectId(id)},
                    {
                        '$inc': {'comments_counter': 1}
                    },
                    session=session
                )

                # Save transaction.
                await session.commit_transaction()

                # Response.
                return Response(
                    data={
                        'message': 'Comment created successfully',
                        'comment_id' : comment_id,
                        'id': id
                    },
                    status=status.HTTP_201_CREATED)

    # Handle validation errors.
    except ValidationError as error:
        return Response(
            data=error.detail,
            status=status.HTTP_400_BAD_REQUEST)

    # Handle permission denied.
    except PermissionDenied as error:
        return Response(
            data=error.detail,
            status=status.HTTP_403_FORBIDDEN)

    # Handle validation errors.
    except NotFound as error:
        return Response(
            data=error.detail,
            status=status.HTTP_404_NOT_FOUND)

    # Handle MongoDB errors.
    except PyMongoError as error:
        if session:
            await session.abort_transaction()
        return Response(
            data={'message': 'Internal Server Error'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Handle other exceptions.
    except Exception as error:
        if session:
            await session.abort_transaction()
        return Response(
            data={'message': 'Internal Server Error'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # End session.
    finally:
        if session:
            await session.end_session()


# Handles the process of updating a comment in a poll.
@api_view(['PATCH'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
async def comment_update(request, id, comment_id):
    session = None
    try:
        # Connect to the MongoDB databases.
        polls_db = MongoDBSingleton().client['polls_db']

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
                    {'_id': ObjectId(comment_id)},
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
        # Connect to the MongoDB databases.
        polls_db = MongoDBSingleton().client['polls_db']

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
                rm_comment_result = await polls_db.comments.delete_one(
                    {'_id': ObjectId(comment_id)},
                    session=session
                )

                # Remove comment in comment counter.
                await polls_db.polls.update_one(
                    {'_id': ObjectId(id)},
                    {
                        '$inc': {'comments_counter': -1}
                    },
                    session=session
                )

                isNotRemoved = rm_comment_result.deleted_count == 0

                # If not removed.
                if isNotRemoved:
                    await session.abort_transaction()
                    raise PyMongoError(
                        'An error occurred while processing your request.',
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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


# View: "Comments Read"

# View to retrieve and display comments for a specific poll.
# This view supports GET requests and is open to any user (no authentication required).

# --- Purpose ---
# Retrieves and displays comments for a given poll, with optional pagination.
# Returns a JSON response with a list of items, each containing details of a comment.

# --- Path Parameters ---
# - id (required): The ID of the poll for which comments are requested.

# --- Query Parameters ---
# - page (optional, default=1): The page number for pagination.
# - page_size (optional, default=4): The number of comments to display per page.

# --- Access Control ---
# Open to any user; no authentication required.

# --- Responses ---
# - 200 OK: List of items, each containing details of a comment, with pagination details.
#   Additionally, includes a message if the current page has no next page.
# - 400 Bad Request: Invalid poll ID.
# - 403 Forbidden: Permission issues (private poll access).
# - 404 Not Found: Poll not found or no comments found.
# - 500 Internal Server Error: MongoDB errors or other unexpected exceptions.

# --- Pagination ---
# Supports paginating through the comments with details like total pages, total items, etc.

# --- Error Handling ---
# Handles different scenarios with appropriate HTTP response codes.
# Specific handling for invalid poll ID, permission issues, poll not found, and MongoDB errors.
# Other exceptions result in a 500 Internal Server Error.

# --- Authorship and Date ---
# Author: nivwer
# Last Updated: 2023-11-15

@api_view(['GET'])
@permission_classes([AllowAny])
async def comments_read(request, id):
    # Get query parameters.
    page = request.GET.get('page') or '1'
    page_size = request.GET.get('page_size') or '4'

    # If poll ID is invalid.
    if len(id) != 24:
        raise ValidationError(
            detail={'message': 'Invalid poll ID'})

    try:
        # Connect to the MongoDB databases.
        polls_db = MongoDBSingleton().client['polls_db']

        # Find the poll in the polls collection.
        poll_bson = await polls_db.polls.find_one(
            {'_id': ObjectId(id)})

        # If poll is not found.
        if not poll_bson:
            raise NotFound(
                detail={'message': 'Poll not found'})

        # Convert BSON to JSON.
        poll_json = json_util._json_convert(poll_bson)

        # Poll privacy.
        is_private = poll_json['privacy'] == 'private'
        is_owner = poll_json['user_id'] == request.user.id

        # If poll private.
        if (not is_owner) and is_private:
            raise PermissionDenied(
                detail={'message': 'This poll is private'})

        # Find the poll comments in comments collection.
        comments_bson = await polls_db.comments.find(
            {'poll_id': ObjectId(id)},
            sort=[('created_at', DESCENDING)]
        ).to_list(length=None)

        # Convert BSON to JSON.
        comments_json = json_util._json_convert(comments_bson)

        ### PAGINATION. ###

        if page:
            page_number = int(page)
            page_size_number = int(page_size)
            paginator = Paginator(comments_json, page_size_number)

            total_pages = paginator.num_pages
            total_items = paginator.count

            if total_items == 0:
                raise NotFound(
                    detail={
                        'message': 'No comment found',
                        'paginator':
                        {
                            'page': page_number,
                            'total_pages':  total_pages,
                            'total_items': total_items,
                            'has_previous': False,
                            'has_next': False,
                        }
                    })

            page_obj = paginator.get_page(page_number)
            has_previous = page_obj.has_previous()
            has_next = page_obj.has_next()

            message = ''
            if not has_next:
                message = 'No more comments'

        ### PAGINATION. ###

        # Polls list.
        comments_list = page_obj.object_list if page else comments_json

        # Extract relevant information for each comment.
        items = []
        for comment in comments_list:

            # Simplify poll data.
            comment['id'] = comment['_id']['$oid']
            del comment['_id']
            comment['created_at'] = comment['created_at']['$date']
            comment['poll_id'] = comment['poll_id']['$oid']

            # Get comment user data.
            user_data = await User.objects.filter(
                id=comment['user_id']
            ).values(
                'username',
                'userprofile__profile_picture',
                'userprofile__profile_name'
            ).afirst()

            if user_data:
                comment['user_profile'] = {
                    'username': user_data['username'],
                    'profile_picture': user_data['userprofile__profile_picture'],
                    'profile_name': user_data['userprofile__profile_name']
                }

        item = {}
        item['comment'] = comment

        items.append(item)

        # Response.
        return Response(
            data={
                'items': items,
                'message': message,
                'paginator': {
                    'page': page_number,
                    'total_items': total_items,
                    'total_pages':  total_pages,
                    'has_previous': has_previous,
                    'has_next': has_next,
                },
            },
            status=status.HTTP_200_OK)

    # Handle validation errors.
    except ValidationError as error:
        return Response(
            data=error.detail,
            status=status.HTTP_400_BAD_REQUEST)

    # Handle permission denied.
    except PermissionDenied as error:
        return Response(
            data=error.detail,
            status=status.HTTP_403_FORBIDDEN)

    # Handle validation errors.
    except NotFound as error:
        return Response(
            data=error.detail,
            status=status.HTTP_404_NOT_FOUND)

    # Handle MongoDB errors.
    except PyMongoError as error:
        return Response(
            data={'message': 'Internal Server Error'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Handle other exceptions.
    except Exception as error:
        return Response(
            data={'message': 'Internal Server Error'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
