from datetime import datetime, timedelta

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny

from apps.accounts.utils.countries import COUNTRIES


class CountriesAPIView(APIView):
    """
    API view for retrieving a list of countries.

    This view provides a list of countries, allowing unrestricted access.

    Endpoint:
    - GET /countries: Retrieve a list of countries.

    Permissions:
    - AllowAny: No authentication is required; the endpoint is accessible by anyone.

    Usage:
    - To retrieve a list of countries, send a GET request to /countries.

    Response:
    - A JSON response containing a list of countries.

    Example Usage:
    ```
    # Retrieve a list of countries
    GET /countries
    ```

    Note: This endpoint provides public access to a static list of countries and sets appropriate caching headers.
    """

    permission_classes = [AllowAny]

    def get(self, request):
        """
        Retrieve a list of countries.

        Args:
            request: The HTTP request object.

        Returns:
            Response: A response containing a list of countries and setting caching headers.
        """
        TTL = timedelta(weeks=1)
        expiration_date = datetime.utcnow() + TTL

        response = Response(data=COUNTRIES, status=status.HTTP_200_OK)
        response["Cache-Control"] = f"max-age={int(TTL.total_seconds())}"
        response["Expires"] = expiration_date.strftime("%a, %d %b %Y %H:%M:%S GMT")

        return response
