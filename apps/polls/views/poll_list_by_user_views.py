from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from adrf.views import APIView

from apps.polls.services.poll_list_service import PollListService


class PollListByUserIdAPIView(APIView):
    """
    API view for retrieving a list of polls created by a specific user.

    This view allows both authenticated and unauthenticated users to retrieve a paginated list of polls
    created by a specific user.

    Endpoint:
    - GET /polls/user/{id}: Retrieve a paginated list of polls created by the user.

    Permissions:
    - AllowAny: Both authenticated and unauthenticated users are allowed.

    Query Parameters:
    - page (int): The page number for pagination (default is 1).
    - page_size (int): The number of items per page (default is 4).

    Usage:
    - To retrieve a list of polls created by a user, send a GET request to /polls/user/{id}.
    - Optionally, include the query parameters 'page' and 'page_size' to control pagination.

    Example Usage:
    ```
    # Retrieve polls created by the user with ID 123
    GET /polls/user/123

    # Retrieve polls with custom pagination settings (page=2, page_size=10)
    GET /polls/user/123?page=2&page_size=10
    ```

    Note: The 'id' in the URL represents the ID of the user whose polls are being retrieved.
    """

    permission_classes = [AllowAny]

    service = PollListService()

    async def get(self, request, id: int, *args, **kwargs):
        """
        Retrieve a paginated list of polls created by the user.

        Args:
            request: The HTTP request object.
            id (int): The ID of the user whose polls are being retrieved.

        Returns:
            Response: A response containing the paginated list of polls created by the user.
        """
        page: int = int(request.GET.get("page", "1"))
        page_size: int = int(request.GET.get("page_size", "4"))
        user_id: int = request.user.id

        data: dict = await self.service.get_by_user_id(
            id=id, page=page, page_size=page_size, user_id=user_id
        )

        return Response(data=data, status=status.HTTP_200_OK)


class PollListByUserVotesAPIView(APIView):
    """
    API view for retrieving a paginated list of polls voted on by a specific user.

    This view allows both authenticated and unauthenticated users to retrieve a paginated list of polls
    voted on by a specific user.

    Endpoint:
    - GET /polls/user/{id}/votes: Retrieve a paginated list of polls voted on by the user.

    Permissions:
    - AllowAny: Both authenticated and unauthenticated users are allowed.

    Query Parameters:
    - page (int): The page number for pagination (default is 1).
    - page_size (int): The number of items per page (default is 4).

    Usage:
    - To retrieve a list of polls voted on by a user, send a GET request to /polls/user/{id}/votes.
    - Optionally, include the query parameters 'page' and 'page_size' to control pagination.

    Example Usage:
    ```
    # Retrieve polls voted on by the user with ID 123
    GET /polls/user/123/votes

    # Retrieve polls with custom pagination settings (page=2, page_size=10)
    GET /polls/user/123/votes?page=2&page_size=10
    ```

    Note: The 'id' in the URL represents the ID of the user whose voted polls are being retrieved.
    """

    permission_classes = [AllowAny]

    service = PollListService()

    async def get(self, request, id: int, *args, **kwargs):
        """
        Retrieve a paginated list of polls voted on by the user.

        Args:
            request: The HTTP request object.
            id (int): The ID of the user whose voted polls are being retrieved.

        Returns:
            Response: A response containing the paginated list of polls voted on by the user.
        """

        page: int = int(request.GET.get("page", "1"))
        page_size: int = int(request.GET.get("page_size", "4"))
        user_id: int = request.user.id

        data: dict = await self.service.get_by_user_votes(
            id=id, page=page, page_size=page_size, user_id=user_id
        )

        return Response(data=data, status=status.HTTP_200_OK)


class PollListByUserSharesAPIView(APIView):
    """
    API view for retrieving a paginated list of polls shared by a specific user.

    This view allows both authenticated and unauthenticated users to retrieve a paginated list of polls
    shared by a specific user.

    Endpoint:
    - GET /polls/user/{id}/shares: Retrieve a paginated list of polls shared by the user.

    Permissions:
    - AllowAny: Both authenticated and unauthenticated users are allowed.

    Query Parameters:
    - page (int): The page number for pagination (default is 1).
    - page_size (int): The number of items per page (default is 4).

    Usage:
    - To retrieve a list of polls shared by a user, send a GET request to /polls/user/{id}/shares.
    - Optionally, include the query parameters 'page' and 'page_size' to control pagination.

    Example Usage:
    ```
    # Retrieve polls shared by the user with ID 123
    GET /polls/user/123/shares

    # Retrieve polls with custom pagination settings (page=2, page_size=10)
    GET /polls/user/123/shares?page=2&page_size=10
    ```

    Note: The 'id' in the URL represents the ID of the user whose shared polls are being retrieved.
    """

    permission_classes = [AllowAny]

    service = PollListService()

    async def get(self, request, id: int, *args, **kwargs):
        """
        Retrieve a paginated list of polls shared by the user.

        Args:
            request: The HTTP request object.
            id (int): The ID of the user whose shared polls are being retrieved.

        Returns:
            Response: A response containing the paginated list of polls shared by the user.
        """
        page: int = int(request.GET.get("page", "1"))
        page_size: int = int(request.GET.get("page_size", "4"))
        user_id: int = request.user.id

        data: dict = await self.service.get_by_user_shares(
            id=id, page=page, page_size=page_size, user_id=user_id
        )

        return Response(data=data, status=status.HTTP_200_OK)


class PollListByUserBookmarksAPIView(APIView):
    """
    API view for retrieving a paginated list of polls bookmarked by a specific user.

    This view allows both authenticated and unauthenticated users to retrieve a paginated list of polls
    bookmarked by a specific user.

    Endpoint:
    - GET /polls/user/{id}/bookmarks: Retrieve a paginated list of polls bookmarked by the user.

    Permissions:
    - AllowAny: Both authenticated and unauthenticated users are allowed.

    Query Parameters:
    - page (int): The page number for pagination (default is 1).
    - page_size (int): The number of items per page (default is 4).

    Usage:
    - To retrieve a list of polls bookmarked by a user, send a GET request to /polls/user/{id}/bookmarks.
    - Optionally, include the query parameters 'page' and 'page_size' to control pagination.

    Example Usage:
    ```
    # Retrieve polls bookmarked by the user with ID 123
    GET /polls/user/123/bookmarks

    # Retrieve polls with custom pagination settings (page=2, page_size=10)
    GET /polls/user/123/bookmarks?page=2&page_size=10
    ```

    Note: The 'id' in the URL represents the ID of the user whose bookmarked polls are being retrieved.
    """

    permission_classes = [AllowAny]

    service = PollListService()

    async def get(self, request, id: int, *args, **kwargs):
        """
        Retrieve a paginated list of polls bookmarked by the user.

        Args:
            request: The HTTP request object.
            id (int): The ID of the user whose shared polls are being retrieved.

        Returns:
            Response: A response containing the paginated list of polls bookmarked by the user.
        """
        page: int = int(request.GET.get("page", "1"))
        page_size: int = int(request.GET.get("page_size", "4"))
        user_id: int = request.user.id

        data: dict = await self.service.get_by_user_bookmarks(
            id=id, page=page, page_size=page_size, user_id=user_id
        )

        return Response(data=data, status=status.HTTP_200_OK)
