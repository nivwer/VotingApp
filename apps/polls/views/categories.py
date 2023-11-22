# Standard.
from datetime import datetime, timedelta
# JSON.
import json
# Django.
from django.http import HttpResponse
# Rest Framework.
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny
# Async Rest Framework support.
from adrf.decorators import api_view
# MongoDB connection.
from utils.mongo_connection import MongoDBSingleton
# PyMongo.
from pymongo.errors import PyMongoError
# Utils.
from apps.polls.utils.categorys import CATEGORIES


# Views.

# Endpoint: "Categories"

# Endpoint to retrieve a list of poll categories.
# This view supports GET requests and allows any user (authenticated or unauthenticated) to access the categories.

# --- Purpose ---
# Retrieves a predefined list of poll categories. The response is cached for a specified time period to enhance
# performance and reduce the load on the server.

# --- Cache Configuration ---
# - TTL: Time To Live for the cache set to one week.
# - Cache-Control: Specifies the maximum age of the cache in seconds.
# - Expires: Indicates the expiration date and time of the cache.

# --- Response ---
# Returns a JSON object containing a list of predefined poll categories.

# --- Authorship and Date ---
# Author: nivwer
# Last Updated: 2023-11-16

@api_view(['GET'])
@permission_classes([AllowAny])
def categories(request):

    # Time To Live.
    TTL = timedelta(weeks=1)
    expiration_date = datetime.utcnow() + TTL

    # Cache Control.
    res = HttpResponse(json.dumps(CATEGORIES), content_type='application/json')
    res['Cache-Control'] = f'max-age={int(TTL.total_seconds())}'
    res['Expires'] = expiration_date.strftime('%a, %d %b %Y %H:%M:%S GMT')

    # Response.
    return res


# Endpoint: "Categories Data"

# Endpoint to retrieve aggregated data on poll categories.
# This view supports GET requests and allows any user (authenticated or unauthenticated) to access the categories data.

# --- Purpose ---
# Retrieves aggregated data on poll categories, including the total number of polls and votes for each category.
# The response is cached for a specified time period to enhance performance and reduce the load on the server.

# --- Cache Configuration ---
# - TTL: Time To Live for the cache set to one day.
# - Cache-Control: Specifies the maximum age of the cache in seconds.
# - Expires: Indicates the expiration date and time of the cache.

# --- Response ---
# Returns a JSON object containing aggregated data on poll categories, including total polls and votes for each category.

# --- Error Handling ---
# Handles validation errors, MongoDB errors, and other exceptions, providing appropriate responses and status codes.

# --- Authorship and Date ---
# Author: nivwer
# Last Updated: 2023-11-16

@api_view(['GET'])
@permission_classes([AllowAny])
async def categories_data(request):
    try:
        # Connect to the MongoDB databases.
        polls_db = MongoDBSingleton().client['polls_db']

        # Get the categories data.
        aggregated_data = await polls_db.polls.aggregate(
            [
                {
                    '$group': {
                        '_id': '$category',
                        'total_polls': {'$sum': 1},
                        'total_votes': {'$sum': '$total_votes'}
                    }
                },
                {
                    '$project': {
                        '_id': 0,
                        'category': '$_id',
                        'total_polls': 1,
                        'total_votes': 1
                    }
                }
            ]
        ).to_list(None)

        # Add category data in data categories.
        data_categories = []
        for category in CATEGORIES['list']:
            in_aggregated_data = False
            for category_data in aggregated_data:
                if category['value'] == category_data['category']:
                    data_categories.append({
                        'text': category['text'],
                        'value': category['value'],
                        'total_polls': category_data['total_polls'],
                        'total_votes': category_data['total_votes']
                    })
                    in_aggregated_data = True

            if not in_aggregated_data:
                data_categories.append({
                    'text': category['text'],
                    'value': category['value'],
                    'total_polls': 0,
                    'total_votes': 0
                })

        # Time To Live.
        TTL = timedelta(days=1)
        expiration_date = datetime.utcnow() + TTL

        # Cache Control.
        res = Response(data_categories, content_type='application/json')
        res['Cache-Control'] = f'max-age={int(TTL.total_seconds())}'
        res['Expires'] = expiration_date.strftime('%a, %d %b %Y %H:%M:%S GMT')

        # Response.
        return res

    # Handle validation errors.
    except ValidationError as error:
        return Response(
            data=error.detail,
            status=status.HTTP_400_BAD_REQUEST)

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
