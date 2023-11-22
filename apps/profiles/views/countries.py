# Standard.
from datetime import datetime, timedelta
# JSON.
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

# Endpoint: "Countries"

# Endpoint that provides a list of countries.
# This view supports GET requests and is open to any user, requiring no specific authentication.

# --- Purpose ---
# Retrieves and returns a list of countries, allowing any user to access this information.

# --- Access Control ---
# Open to any user; no authentication required.

# --- Data Source ---
# The list of countries is provided by the COUNTRIES data source.

# --- Response ---
# Returns a JSON response containing the list of countries.

# --- Caching Details ---
# - TTL: Time To Live for the cache is set to one week.
# - Cache Control Headers: Utilizes headers to control caching behavior, specifying the maximum age and expiration date of the cache.

# --- Authorship and Date ---
# Author: nivwer
# Last Updated: 2023-11-21

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
