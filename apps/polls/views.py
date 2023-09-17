# Standard.
from datetime import datetime, timedelta
import json
# Django.
from django.http import HttpResponse
# Rest Framework.
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
# Utils.
from apps.polls.utils.categorys import CATEGORIES


# Views.

# Get poll categories.
@api_view(['GET'])
@permission_classes([AllowAny])
def polls_categories(request):

    # Time To Live.
    TTL = timedelta(minutes=15)
    expiration_date = datetime.utcnow() + TTL

    # Cache Control.
    res = HttpResponse(json.dumps(CATEGORIES), content_type='application/json')
    res['Cache-Control'] = f'max-age={int(TTL.total_seconds())}'
    res['Expires'] = expiration_date.strftime('%a, %d %b %Y %H:%M:%S GMT')

    # Response.
    return res
