from bson.objectid import ObjectId

from rest_framework import status
from rest_framework.exceptions import ValidationError, PermissionDenied, NotFound
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication

from adrf.views import APIView

from apps.polls.services.user_actions_service import UserActionsService


class PollBookmarkAPIView(APIView):
    """
    API view for bookmarking and unbookmarking polls.

    This view allows authenticated users to bookmark or unbookmark a specific poll. Bookmarking involves adding the poll to the user's bookmarked polls list, and unbookmarking involves removing it.

    Endpoints:
    - POST /poll/{id}/bookmark: Bookmark a poll by adding it to the user's bookmarked polls list.
    - DELETE /poll/{id}/bookmark: Unbookmark a poll by removing it from the user's shared polls list.

    Authentication:
    - SessionAuthentication: Users must be authenticated.

    Permissions:
    - IsAuthenticated: Only accessible to authenticated users.

    Path Parameters:
    - id (str): The unique identifier of the poll to be bookmarked or unbookmarked.

    Usage:
    - To bookmark a poll, send a POST request to /poll/{id}/bookmark.
    - To unbookmark a poll, send a DELETE request to /poll/{id}/bookmark.

    Example Usage:
    ```
    # Bookmark a poll with ID '6123456789abcdef01234567'
    POST /poll/6123456789abcdef01234567/bookmark
    headers: { "X-CSRFToken": csrftoken }

    # Unbookmark a previously bookmarked poll with ID '6123456789abcdef01234567'
    DELETE /poll/6123456789abcdef01234567/bookmark
    headers: { "X-CSRFToken": csrftoken }
    ```

    Note: The 'id' parameter in the URL represents the unique identifier of the poll to be bookmarked or unbookmarked.
    """

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    service = UserActionsService()

    async def post(self, request, id: str, *args, **kwargs):
        """
        Bookmark a specific poll.

        Args:
            request: The HTTP request object.
            id (str): The unique identifier of the poll to be bookmarked.

        Returns:
            Response: A response indicating the success of the bookmark operation.
        """
        user_id: int = request.user.id

        try:
            id: ObjectId = await self.service.bookmark(id=id, user_id=user_id)

        except ValidationError as error:
            return Response(data=error.detail, status=status.HTTP_400_BAD_REQUEST)

        except PermissionDenied as error:
            return Response(data=error.detail, status=status.HTTP_403_FORBIDDEN)

        except NotFound as error:
            return Response(data=error.detail, status=status.HTTP_404_NOT_FOUND)

        return Response(data={"id": str(id)}, status=status.HTTP_200_OK)

    async def delete(self, request, id: str, *args, **kwargs):
        """
        Unbookmark a previously bookmarked poll.

        Args:
            request: The HTTP request object.
            id (str): The unique identifier of the poll to be unbookmarked.

        Returns:
            Response: A response indicating the success of the unbookmark operation.
        """
        user_id: int = request.user.id

        try:
            id: ObjectId = await self.service.unbookmark(id=id, user_id=user_id)

        except ValidationError as error:
            return Response(data=error.detail, status=status.HTTP_400_BAD_REQUEST)

        except PermissionDenied as error:
            return Response(data=error.detail, status=status.HTTP_403_FORBIDDEN)

        except NotFound as error:
            return Response(data=error.detail, status=status.HTTP_404_NOT_FOUND)

        return Response(data={"id": str(id)}, status=status.HTTP_200_OK)
