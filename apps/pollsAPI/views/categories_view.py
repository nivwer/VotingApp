from datetime import datetime, timedelta

from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from adrf.views import APIView

from apps.pollsAPI.utils.categorys import CATEGORIES


class CategoriesAPIView(APIView):
    """
    API view for retrieving a list of categories.

    This view provides a list of categories, allowing unrestricted access.

    Endpoint:
    - GET /categories: Retrieve a list of categories.

    Permissions:
    - AllowAny: No authentication is required; the endpoint is accessible by anyone.

    Usage:
    - To retrieve a list of categories, send a GET request to /categories.

    Response:
    - A JSON response containing a list of categories.

    Example Usage:
    ```
    # Retrieve a list of categories
    GET /categories
    ```

    Note: This endpoint provides public access to a static list of categories and sets appropriate caching headers.
    """

    permission_classes = [AllowAny]

    async def get(self, request, *args, **kwargs):
        """
        Retrieve a list of categories.

        Args:
            request: The HTTP request object.

        Returns:
            Response: A response containing a list of categories and setting caching headers.
        """
        TTL = timedelta(weeks=1)
        expiration_date = datetime.utcnow() + TTL

        response = Response(data=CATEGORIES, status=status.HTTP_200_OK)
        response["Cache-Control"] = f"max-age={int(TTL.total_seconds())}"
        response["Expires"] = expiration_date.strftime("%a, %d %b %Y %H:%M:%S GMT")

        return response
