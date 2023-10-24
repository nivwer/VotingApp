# Standard.
from datetime import datetime, timedelta
import json
# Virtualenv.
from dotenv import load_dotenv
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
# MongoDB.
from pymongo.errors import PyMongoError
# Utils.
from apps.polls.utils.categorys import CATEGORIES


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

# Get poll categories.
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


# Handles the get process for categories data.
@api_view(['GET'])
@permission_classes([AllowAny])
async def categories_data(request):
    try:
        # Get collections from the polls database.
        polls_db = GetCollectionsMongoDB('polls_db', ['polls'])

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
                    'value': category_data['category'],
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
    except ValidationError as e:
        return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

    # Handle MongoDB errors.
    except PyMongoError as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Handle other exceptions.
    except Exception as e:
        print(str(e))
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
