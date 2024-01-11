from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import ValidationError
from adrf.views import APIView

from apps.polls.services.poll_comment_list_service import PollCommentListService


class PollCommentListAPIVIew(APIView):
    """
    API view for retrieving a list of comments associated with a poll.

    This view allows any user to retrieve a paginated list of comments associated with a specific poll.

    Endpoint:
    - GET /poll/{id}/comments/: Retrieve a paginated list of comments for a poll.

    Permissions:
    - AllowAny: Accessible to any user, even unauthenticated.

    Path Parameters:
    - id (str): The unique identifier of the poll associated with the comments.

    Query Parameters:
    - page (int): The page number for paginated results (default is 1).
    - page_size (int): The number of comments to include per page (default is 4).

    Usage:
    - To retrieve a list of comments for a poll, send a GET request to /poll/{id}/comments/.
    - Optionally, include the query parameters 'page' and 'page_size' to control pagination.

    Example Usage:
    ```
    # Retrieve a list of comments for poll with ID '6123456789abcdef01234567'
    GET /poll/6123456789abcdef01234567/comments/

    # Retrieve a list of comments for poll with ID with custom pagination settings (page=2, page_size=10)
    GET /poll/6123456789abcdef01234567/comments/?page=2&page_size=10
    ```

    Note: The 'id' parameter in the URL represents the unique identifier of the poll associated with the comments.
    The 'page' and 'page_size' parameters are optional and control the pagination of the results.
    """

    permission_classes = [AllowAny]

    service = PollCommentListService()

    async def get(self, request, id: str, *args, **kwargs):
        """
        Retrieve a paginated list of comments associated with a poll.

        Args:
            request: The HTTP request object.
            id (str): The unique identifier of the poll associated with the comments.

        Returns:
            Response: A response containing the paginated list of comments for the specified poll.
        """
        page: int = int(request.GET.get("page", "1"))
        page_size: int = int(request.GET.get("page_size", "4"))
        user_id: int = request.user.id

        data: dict = await self.service.get_by_poll_id(
            poll_id=id, page=page, page_size=page_size, user_id=user_id
        )

        return Response(data=data, status=status.HTTP_200_OK)
