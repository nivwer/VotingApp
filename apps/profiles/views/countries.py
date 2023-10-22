# Standard.
from datetime import datetime, timedelta
import json
# Django.
from django.http import HttpResponse
# Rest Framework.
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
# Async Rest Framework support.
from adrf.decorators import api_view
# Utils.
from apps.profiles.utils.countries import COUNTRIES


# Views.

# Get poll categories.
@api_view(['GET'])
@permission_classes([AllowAny])
def countries(request):

    # Time To Live.
    TTL = timedelta(weeks=1)
    expiration_date = datetime.utcnow() + TTL

    # Cache Control.
    res = HttpResponse(json.dumps(COUNTRIES), content_type='application/json')
    res['Cache-Control'] = f'max-age={int(TTL.total_seconds())}'
    res['Expires'] = expiration_date.strftime('%a, %d %b %Y %H:%M:%S GMT')

    # Response.
    return res
