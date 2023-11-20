# BSON.
from bson import json_util
from bson.objectid import ObjectId
# Django.
from django.core.paginator import Paginator
from django.contrib.auth.models import User
# Rest Framework.
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny
# Async Rest Framework support.
from adrf.decorators import api_view
# MongoDB connection.
from utils.mongo_connection import MongoDBSingleton
# PyMongo.
from pymongo import DESCENDING
from pymongo.errors import PyMongoError


# Views.

# View: "User Polls"

# View to retrieve polls associated with a specific user.
# This view supports GET requests and allows both authenticated and unauthenticated users.

# --- Purpose ---
# Retrieves a list of polls associated with a user, with optional pagination.
# Returns a JSON response with a list of items, each containing details of a poll.

# --- Request Parameters ---
# - id: The user ID for whom to retrieve the polls.

# --- Query Parameters ---
# - page (optional, default=1): The page number for pagination.
# - page_size (optional, default=4): The number of polls to display per page.

# --- Access Control ---
# Open to any user; no authentication required.

# --- Responses ---
# - 200 OK: List of items, each containing details of a poll, with pagination details.
#   Additionally, includes for each item the actions of the authenticated user (if applicable).
#   Additionally, includes a message if the current page has no next page.
# - 400 Bad Request: Validation errors in the request data.
# - 404 Not Found: User with the specified ID does not exist.
# - 500 Internal Server Error: MongoDB errors or other unexpected exceptions.

# --- Pagination ---
# Supports paginating through the search results with details like total pages, total items, etc.

# --- User Actions ---
# If the user is authenticated, includes information about the user's actions on each poll (voted, shared, bookmarked).

# --- Error Handling ---
# Handles validation errors, user not found, MongoDB errors, and other unexpected exceptions.
# Other exceptions result in a 500 Internal Server Error.

# --- Authorship and Date ---
# Author: nivwer
# Last Updated: 2023-11-19

@api_view(['GET'])
@permission_classes([AllowAny])
async def user_polls(request, id):
    # Check if the current user is authenticated.
    is_authenticated = True if request.user else False

    # Get query parameters.
    page = request.GET.get('page') or '1'
    page_size = request.GET.get('page_size') or '4'

    try:
        # Get user data.
        user_data = await User.objects.filter(
            id=id
        ).values(
            'username',
            'userprofile__profile_picture',
            'userprofile__profile_name'
        ).afirst()

        # Connect to the MongoDB databases.
        polls_db = MongoDBSingleton().client['polls_db']

        # Find the polls document based on the user id in the polls collection.
        polls_bson = await polls_db.polls.find(
            {
                'user_id': int(id),
                '$or': [
                    {
                        'privacy': 'public'
                    },
                    {
                        'privacy': 'private',
                        'user_id': request.user.id
                    }
                ]},
            sort=[('created_at', DESCENDING)]
        ).to_list(length=None)

        # Convert BSON to JSON.
        polls_json = json_util._json_convert(polls_bson)

        ### PAGINATION. ###

        if page:
            page_number = int(page)
            page_size_number = int(page_size)
            paginator = Paginator(polls_json, page_size_number)

            total_pages = paginator.num_pages
            total_items = paginator.count

            if total_items == 0:
                return Response(
                    data={
                        'items': [],
                        'message': 'No result found',
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
                message = 'No more results'

        ### PAGINATION. ###

        # Polls list.
        polls_list = page_obj.object_list if page else polls_json

        # Extract relevant information for each poll.
        items = []
        for poll in polls_list:
            # Simplify poll data.
            poll['id'] = poll['_id']['$oid']
            del poll['_id']
            poll['created_at'] = poll['created_at']['$date']

            # Add user profile data in the poll document.
            poll['user_profile'] = {
                'username': user_data['username'],
                'profile_picture': user_data['userprofile__profile_picture'],
                'profile_name': user_data['userprofile__profile_name']
            }

            # If the current user is authenticated.
            if is_authenticated:
                # Find user actions of the authenticated user. ( Current user )
                user_actions_bson = await polls_db.user_actions.find_one(
                    {
                        'user_id': request.user.id,
                        'poll_id': ObjectId(poll['id'])
                    },
                    projection={
                        '_id': 0,
                        'has_voted': 1,
                        'has_shared': 1,
                        'has_bookmarked': 1
                    }
                )

                # Convert BSON to JSON.
                user_actions_json = json_util._json_convert(
                    (user_actions_bson))

            item = {}
            item['poll'] = poll
            item['authenticated_user_actions'] = user_actions_json or {}

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

    # Handle if the user is not found.
    except User.DoesNotExist:
        return Response(
            data={'message': 'User does not exist.'},
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


# View: "User Voted Polls"

# View to retrieve polls for which a specific user has voted.
# This view supports GET requests and allows both authenticated and unauthenticated users.

# --- Purpose ---
# Retrieves a list of polls for which the specified user has voted, with optional pagination.
# Returns a JSON response with a list of items, each containing details of a poll.

# --- Request Parameters ---
# - id: The user ID for whom to retrieve the voted polls.

# --- Query Parameters ---
# - page (optional, default=1): The page number for pagination.
# - page_size (optional, default=4): The number of polls to display per page.

# --- Access Control ---
# Open to any user; no authentication required.

# --- Responses ---
# - 200 OK: List of items, each containing details of a poll, with pagination details.
#   Additionally, includes for each item the actions of the authenticated user (if applicable).
#   Additionally, includes a message if the current page has no next page.
# - 400 Bad Request: Validation errors in the request data.
# - 404 Not Found: User with the specified ID does not exist.
# - 500 Internal Server Error: MongoDB errors or other unexpected exceptions.

# --- Pagination ---
# Supports paginating through the search results with details like total pages, total items, etc.

# --- User Actions ---
# If the user is authenticated, includes information about the user's actions on each poll (voted, shared, bookmarked).

# --- Error Handling ---
# Handles validation errors, user not found, MongoDB errors, and other unexpected exceptions.
# Other exceptions result in a 500 Internal Server Error.

# --- Authorship and Date ---
# Author: nivwer
# Last Updated: 2023-11-20

@api_view(['GET'])
@permission_classes([AllowAny])
async def user_voted_polls(request, id):
    # Check if the current user is authenticated.
    is_authenticated = True if request.user else False

    # Get query parameters.
    page = request.GET.get('page') or '1'
    page_size = request.GET.get('page_size') or '4'

    try:
        # Connect to the MongoDB databases.
        polls_db = MongoDBSingleton().client['polls_db']

        # Find the polls document based on the votes of the user in the polls collection.
        polls_bson = await polls_db.user_actions.aggregate([
            {
                '$match': {
                    'user_id': int(id),
                    'has_voted': {'$exists': True}
                }
            },
            {
                '$project': {
                    '_id': 0,
                    'poll_id': 1,
                    'has_voted': 1
                }
            },
            {
                '$sort': {'has_voted.voted_at': DESCENDING}
            },
            # {
            #     '$skip': 10,
            # },
            # {
            #     '$limit': 10
            # },
            {
                '$lookup': {
                    'from': 'polls',
                    'localField': 'poll_id',
                    'foreignField': '_id',
                    'as': 'poll'
                }
            },
            {
                '$unwind': '$poll'
            },
            {
                '$match': {
                    '$or': [
                        {
                            'poll.privacy': 'public'
                        },
                        {
                            'poll.privacy': 'private',
                            'poll.user_id': request.user.id
                        }
                    ]
                }
            },
            {
                '$replaceRoot': {'newRoot': '$poll'}
            }
        ]).to_list(length=None)

        # Convert BSON to JSON.
        polls_json = json_util._json_convert(polls_bson)

        ### PAGINATION. ###

        if page:
            page_number = int(page)
            page_size_number = int(page_size)
            paginator = Paginator(polls_json, page_size_number)

            total_pages = paginator.num_pages
            total_items = paginator.count

            if total_items == 0:
                return Response(
                    data={
                        'items': [],
                        'message': 'No result found',
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
                message = 'No more results'

        ### PAGINATION. ###

        # Polls list.
        polls_list = page_obj.object_list if page else polls_json

        # Extract relevant information for each poll.
        items = []
        for poll in polls_list:

            # Simplify poll data.
            poll['id'] = poll['_id']['$oid']
            del poll['_id']
            poll['created_at'] = poll['created_at']['$date']

            # Get poll user data.
            user_data = await User.objects.filter(
                id=poll['user_id']
            ).values(
                'username',
                'userprofile__profile_picture',
                'userprofile__profile_name'
            ).afirst()

            if user_data:
                poll['user_profile'] = {
                    'username': user_data['username'],
                    'profile_picture': user_data['userprofile__profile_picture'],
                    'profile_name': user_data['userprofile__profile_name']
                }

            # If the current user is authenticated.
            if is_authenticated:
                # Find user actions of the authenticated user. ( Current user )
                user_actions_bson = await polls_db.user_actions.find_one(
                    {
                        'user_id': request.user.id,
                        'poll_id': ObjectId(poll['id'])
                    },
                    projection={
                        '_id': 0,
                        'has_voted': 1,
                        'has_shared': 1,
                        'has_bookmarked': 1
                    }
                )

                # Convert BSON to JSON.
                user_actions_json = json_util._json_convert(
                    (user_actions_bson))

            item = {}
            item['poll'] = poll
            item['authenticated_user_actions'] = user_actions_json or {}

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

    # Handle if the user is not found.
    except User.DoesNotExist:
        return Response(
            data={'message': 'User does not exist.'},
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


# View: "User Shared Polls"

# View to retrieve polls that a specific user has shared.
# This view supports GET requests and allows both authenticated and unauthenticated users.

# --- Purpose ---
# Retrieves a list of polls that the specified user has shared, with optional pagination.
# Returns a JSON response with a list of items, each containing details of a poll.

# --- Request Parameters ---
# - id: The user ID for whom to retrieve the shared polls.

# --- Query Parameters ---
# - page (optional, default=1): The page number for pagination.
# - page_size (optional, default=4): The number of polls to display per page.

# --- Access Control ---
# Open to any user; no authentication required.

# --- Responses ---
# - 200 OK: List of items, each containing details of a poll, with pagination details.
#   Additionally, includes for each item the actions of the authenticated user (if applicable).
#   Additionally, includes a message if the current page has no next page.
# - 400 Bad Request: Validation errors in the request data.
# - 404 Not Found: User with the specified ID does not exist.
# - 500 Internal Server Error: MongoDB errors or other unexpected exceptions.

# --- Pagination ---
# Supports paginating through the search results with details like total pages, total items, etc.

# --- User Actions ---
# If the user is authenticated, includes information about the user's actions on each poll (voted, shared, bookmarked).

# --- Error Handling ---
# Handles validation errors, user not found, MongoDB errors, and other unexpected exceptions.
# Other exceptions result in a 500 Internal Server Error.

# --- Authorship and Date ---
# Author: nivwer
# Last Updated: 2023-11-20

@api_view(['GET'])
@permission_classes([AllowAny])
async def user_shared_polls(request, id):
    # Check if the current user is authenticated.
    is_authenticated = True if request.user else False

    # Get query parameters.
    page = request.GET.get('page') or '1'
    page_size = request.GET.get('page_size') or '4'

    try:
        # Connect to the MongoDB databases.
        polls_db = MongoDBSingleton().client['polls_db']

        # Find the polls document based on the shares of the user in the polls collection.
        polls_bson = await polls_db.user_actions.aggregate([
            {
                '$match': {
                    'user_id': int(id),
                    'has_shared': {'$exists': True}
                }
            },
            {
                '$project': {
                    '_id': 0,
                    'poll_id': 1,
                    'has_shared': 1
                }
            },
            {
                '$sort': {'has_shared.shared_at': DESCENDING}
            },
            # {
            #     '$skip': 10,
            # },
            # {
            #     '$limit': 10
            # },
            {
                '$lookup': {
                    'from': 'polls',
                    'localField': 'poll_id',
                    'foreignField': '_id',
                    'as': 'poll'
                }
            },
            {
                '$unwind': '$poll'
            },
            {
                '$match': {
                    '$or': [
                        {
                            'poll.privacy': 'public'
                        },
                        {
                            'poll.privacy': 'private',
                            'poll.user_id': request.user.id
                        }
                    ]
                }
            },
            {
                '$replaceRoot': {'newRoot': '$poll'}
            }
        ]).to_list(length=None)

        # Convert BSON to JSON.
        polls_json = json_util._json_convert(polls_bson)

        ### PAGINATION. ###

        if page:
            page_number = int(page)
            page_size_number = int(page_size)
            paginator = Paginator(polls_json, page_size_number)

            total_pages = paginator.num_pages
            total_items = paginator.count

            if total_items == 0:
                return Response(
                    data={
                        'items': [],
                        'message': 'No result found',
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
                message = 'No more results'

        ### PAGINATION. ###

        # Polls list.
        polls_list = page_obj.object_list if page else polls_json

        # Extract relevant information for each poll.
        items = []
        for poll in polls_list:

            # Simplify poll data.
            poll['id'] = poll['_id']['$oid']
            del poll['_id']
            poll['created_at'] = poll['created_at']['$date']

            # Get poll user data.
            user_data = await User.objects.filter(
                id=poll['user_id']
            ).values(
                'username',
                'userprofile__profile_picture',
                'userprofile__profile_name'
            ).afirst()

            if user_data:
                poll['user_profile'] = {
                    'username': user_data['username'],
                    'profile_picture': user_data['userprofile__profile_picture'],
                    'profile_name': user_data['userprofile__profile_name']
                }

             # If the current user is authenticated.
            if is_authenticated:
                # Find user actions of the authenticated user. ( Current user )
                user_actions_bson = await polls_db.user_actions.find_one(
                    {
                        'user_id': request.user.id,
                        'poll_id': ObjectId(poll['id'])
                    },
                    projection={
                        '_id': 0,
                        'has_voted': 1,
                        'has_shared': 1,
                        'has_bookmarked': 1
                    }
                )

                # Convert BSON to JSON.
                user_actions_json = json_util._json_convert(
                    (user_actions_bson))

            item = {}
            item['poll'] = poll
            item['authenticated_user_actions'] = user_actions_json or {}

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

    # Handle if the user is not found.
    except User.DoesNotExist:
        return Response(
            data={'message': 'User does not exist.'},
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


# View: "User Bookmarked Polls"

# View to retrieve polls that a specific user has bookmarked.
# This view supports GET requests and allows both authenticated and unauthenticated users.

# --- Purpose ---
# Retrieves a list of polls that the specified user has bookmarked, with optional pagination.
# Returns a JSON response with a list of items, each containing details of a poll.

# --- Request Parameters ---
# - id: The user ID for whom to retrieve the bookmarked polls.

# --- Query Parameters ---
# - page (optional, default=1): The page number for pagination.
# - page_size (optional, default=4): The number of polls to display per page.

# --- Access Control ---
# Open to any user; no authentication required.


# --- Responses ---
# - 200 OK: List of items, each containing details of a poll, with pagination details.
#   Additionally, includes for each item the actions of the authenticated user (if applicable).
#   Additionally, includes a message if the current page has no next page.
# - 400 Bad Request: Validation errors in the request data.
# - 404 Not Found: User with the specified ID does not exist.
# - 500 Internal Server Error: MongoDB errors or other unexpected exceptions.

# --- Pagination ---
# Supports paginating through the search results with details like total pages, total items, etc.

# --- User Actions ---
# If the user is authenticated, includes information about the user's actions on each poll (voted, shared, bookmarked).

# --- Error Handling ---
# Handles validation errors, user not found, MongoDB errors, and other unexpected exceptions.
# Other exceptions result in a 500 Internal Server Error.

# --- Authorship and Date ---
# Author: nivwer
# Last Updated: 2023-11-20

@api_view(['GET'])
@permission_classes([AllowAny])
async def user_bookmarked_polls(request, id):
    # Check if the current user is authenticated.
    is_authenticated = True if request.user else False

    # Get query parameters.
    page = request.GET.get('page') or '1'
    page_size = request.GET.get('page_size') or '4'

    try:
        # Connect to the MongoDB databases.
        polls_db = MongoDBSingleton().client['polls_db']

        # Find the polls document based on the bookmarks of the user in the polls collection.
        polls_bson = await polls_db.user_actions.aggregate([
            {
                '$match': {
                    'user_id': int(id),
                    'has_bookmarked': {'$exists': True}
                }
            },
            {
                '$project': {
                    '_id': 0,
                    'poll_id': 1,
                    'has_bookmarked': 1
                }
            },
            {
                '$sort': {'has_bookmarked.bookmarked_at': DESCENDING}
            },
            # {
            #     '$skip': 10,
            # },
            # {
            #     '$limit': 10
            # },
            {
                '$lookup': {
                    'from': 'polls',
                    'localField': 'poll_id',
                    'foreignField': '_id',
                    'as': 'poll'
                }
            },
            {
                '$unwind': '$poll'
            },
            {
                '$match': {
                    '$or': [
                        {
                            'poll.privacy': 'public'
                        },
                        {
                            'poll.privacy': 'private',
                            'poll.user_id': request.user.id
                        }
                    ]
                }
            },
            {
                '$replaceRoot': {'newRoot': '$poll'}
            }
        ]).to_list(length=None)

        # Convert BSON to JSON.
        polls_json = json_util._json_convert(polls_bson)

        ### PAGINATION. ###

        if page:
            page_number = int(page)
            page_size_number = int(page_size)
            paginator = Paginator(polls_json, page_size_number)

            total_pages = paginator.num_pages
            total_items = paginator.count

            if total_items == 0:
                return Response(
                    data={
                        'items': [],
                        'message': 'No result found',
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
                message = 'No more results'

        ### PAGINATION. ###

        # Polls list.
        polls_list = page_obj.object_list if page else polls_json

        # Extract relevant information for each poll.
        items = []
        for poll in polls_list:

            # Simplify poll data.
            poll['id'] = poll['_id']['$oid']
            del poll['_id']
            poll['created_at'] = poll['created_at']['$date']

            # Get poll user data.
            user_data = await User.objects.filter(
                id=poll['user_id']
            ).values(
                'username',
                'userprofile__profile_picture',
                'userprofile__profile_name'
            ).afirst()

            if user_data:
                poll['user_profile'] = {
                    'username': user_data['username'],
                    'profile_picture': user_data['userprofile__profile_picture'],
                    'profile_name': user_data['userprofile__profile_name']
                }

            # If the current user is authenticated.
            if is_authenticated:
                # Find user actions of the authenticated user. ( Current user )
                user_actions_bson = await polls_db.user_actions.find_one(
                    {
                        'user_id': request.user.id,
                        'poll_id': ObjectId(poll['id'])
                    },
                    projection={
                        '_id': 0,
                        'has_voted': 1,
                        'has_shared': 1,
                        'has_bookmarked': 1
                    }
                )

                # Convert BSON to JSON.
                user_actions_json = json_util._json_convert(
                    (user_actions_bson))

            item = {}
            item['poll'] = poll
            item['authenticated_user_actions'] = user_actions_json or {}

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

    # Handle if the user is not found.
    except User.DoesNotExist:
        return Response(
            data={'message': 'User does not exist.'},
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
