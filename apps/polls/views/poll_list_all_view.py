from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from adrf.views import APIView

from apps.polls.services.poll_list_service import PollListService


class PollListAllAPIView(APIView):
    """
    API view for retrieving a list of all polls.

    This view provides a paginated list of all polls, allowing unrestricted access.

    Endpoint:
    - GET /polls/all: Retrieve a paginated list of all polls.

    Query Parameters:
    - page (optional): The page number for paginated results (default is 1).
    - page_size (optional): The number of polls to include per page (default is 4).

    Permissions:
    - AllowAny: No authentication is required; the endpoint is accessible by anyone.

    Usage:
    - To retrieve a paginated list of all polls, send a GET request to /polls/all.
    - Optionally, include the page and page_size parameters in the query string.

    Response:
    - A JSON response containing paginated poll data.

    Example Usage:
    ```
    # Retrieve the first page of all polls with 4 polls per page
    GET /polls/all

    # Retrieve the second page of all polls with 10 polls per page
    GET /polls/all?page=2&page_size=10
    ```

    Note: This endpoint provides public access to all polls and supports pagination.
    """

    permission_classes = [AllowAny]

    service = PollListService()

    async def get(self, request, *args, **kwargs):
        """
        Retrieve a paginated list of all polls.

        Args:
            request: The HTTP request object.

        Returns:
            Response: A response containing paginated poll data.
        """
        page: int = int(request.GET.get("page", "1"))
        page_size: int = int(request.GET.get("page_size", "4"))
        user_id: int = request.user.id

        data: dict = await self.service.get_all(page=page, page_size=page_size, user_id=user_id)

        return Response(data=data, status=status.HTTP_200_OK)
