from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from adrf.views import APIView

from apps.polls.services.poll_list_service import PollListService


class PollListByCategoryAPIView(APIView):
    """
    API view for retrieving a paginated list of polls based on a category.

    This view allows both authenticated and unauthenticated users to retrieve a paginated list of polls
    based on a provided category.

    Endpoint:
    - GET /polls/category/{category}/: Retrieve a paginated list of polls based on a category.

    Permissions:
    - AllowAny: Both authenticated and unauthenticated users are allowed.

    Path Parameters:
    - category (str): The category used to filter polls.

    Query Parameters:
    - page (int): The page number for pagination (default is 1).
    - page_size (int): The number of items per page (default is 4).

    Usage:
    - To retrieve a list of polls based on a category, send a GET request to /polls/category/{category}/.
    - Include the path parameter 'category' with the desired category.
    - Optionally, include the query parameters 'page' and 'page_size' to control pagination.

    Example Usage:
    ```
    # Retrieve polls based on the category 'technology'
    GET /polls/category/technology/

    # Retrieve polls with custom pagination settings (page=2, page_size=10)
    GET /polls/category/technology/?page=2&page_size=10
    ```

    Note: The 'category' parameter in the URL represents the category used to filter polls.
    """


    permission_classes = [AllowAny]

    service = PollListService()

    async def get(self, request, category: str, *args, **kwargs):
        """
        Retrieve a paginated list of polls based on a category.

        Args:
            request: The HTTP request object.
            category (str): The category used to filter polls.

        Returns:
            Response: A response containing the paginated list of polls based on the provided category.
        """
        page: int = int(request.GET.get("page", "1"))
        page_size: int = int(request.GET.get("page_size", "4"))
        user_id: int = request.user.id

        data: dict = await self.service.get_by_category(
            category=category, page=page, page_size=page_size, user_id=user_id
        )

        return Response(data=data, status=status.HTTP_200_OK)
