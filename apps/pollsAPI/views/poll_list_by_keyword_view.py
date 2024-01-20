from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import ValidationError
from adrf.views import APIView

from apps.pollsAPI.services.poll_list_service import PollListService


class PollListByKeywordAPIView(APIView):
    """
    API view for retrieving a paginated list of polls based on a keyword.

    This view allows both authenticated and unauthenticated users to retrieve a paginated list of polls
    based on a provided keyword.

    Endpoint:
    - GET /polls/search: Retrieve a paginated list of polls based on a keyword.

    Permissions:
    - AllowAny: Both authenticated and unauthenticated users are allowed.

    Query Parameters:
    - query (str): The keyword used to filter polls.
    - page (int): The page number for pagination (default is 1).
    - page_size (int): The number of items per page (default is 4).

    Usage:
    - To retrieve a list of polls based on a keyword, send a GET request to /polls/search.
    - Include the query parameter 'query' with the desired keyword.
    - Optionally, include the query parameters 'page' and 'page_size' to control pagination.

    Example Usage:
    ```
    # Retrieve polls based on the keyword 'technology'
    GET /polls/search?query=technology

    # Retrieve polls with custom pagination settings (page=2, page_size=10)
    GET /polls/search?query=technology&page=2&page_size=10
    ```

    Note: The 'query' parameter in the URL represents the keyword used to filter polls.
    """

    permission_classes = [AllowAny]

    service = PollListService()

    async def get(self, request, *args, **kwargs):
        """
        Retrieve a paginated list of polls based on a keyword.

        Args:
            request: The HTTP request object.

        Returns:
            Response: A response containing the paginated list of polls based on the provided keyword.
        """
        keyword: str = request.GET.get("query")
        page: int = int(request.GET.get("page", "1"))
        page_size: int = int(request.GET.get("page_size", "4"))
        user_id: int = request.user.id

        try:
            if not keyword:
                message: str = "Keyword is not provided"
                raise ValidationError({"message": message})

        except ValidationError as error:
            return Response(data=error.detail, status=status.HTTP_400_BAD_REQUEST)

        data: dict = await self.service.get_by_keyword(
            keyword=keyword, page=page, page_size=page_size, user_id=user_id
        )

        return Response(data=data, status=status.HTTP_200_OK)
