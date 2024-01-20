from rest_framework import status
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound, PermissionDenied, ValidationError
from adrf.views import APIView

from apps.pollsAPI.services.poll_comment_service import PollCommentService


class PollCommentAPIView(APIView):
    """
    API view for managing comments on polls.

    This view allows authenticated users to perform CRUD operations on comments associated with polls.

    Endpoints:
    - POST /poll/{id}/comment/: Create a new comment on a poll.
    - PATCH /poll/{id}/comment/{comment_id}/: Update an existing comment on a poll.
    - DELETE /poll/{id}/comment/{comment_id}/: Delete an existing comment on a poll.

    Authentication:
    - SessionAuthentication: Users must be authenticated.

    Permissions:
    - IsAuthenticated: Only authenticated users are allowed.

    Path Parameters:
    - id (str): The unique identifier of the poll associated with the comments.
    - comment_id (str): The unique identifier of the comment.

    Usage:
    - To create a new comment on a poll, send a POST request to /poll/{id}/comment/.
    - To update an existing comment, send a PATCH request to /poll/{id}/comment/{comment_id}/.
    - To delete an existing comment, send a DELETE request to /poll/{id}/comment/{comment_id}/.

    Example Usage:
    ```
    # Create a new comment on poll with ID '6123456789abcdef01234567'
    POST /polls/6123456789abcdef01234567/comment
    headers: { "X-CSRFToken": csrftoken }
    Body: { "comment": "comment_text" }

    # Update comment with ID '6123456789abcdef01234567' on poll with ID '6123456789abcdef01abc123'
    PATCH /poll/6123456789abcdef01234567/comment/6123456789abcdef01abc123
    headers: { "X-CSRFToken": csrftoken }
    Body: {"comment": "new_comment_text"}

    # Delete comment with ID '6123456789abcdef01234567' on poll with ID '6123456789abcdef01abc123'
    DELETE /poll/6123456789abcdef01234567/comment/6123456789abcdef01abc123
    headers: { "X-CSRFToken": csrftoken }
    ```

    Note: The 'id' parameter in the URL represents the unique identifier of the poll associated with the comments.
    The 'comment_id' parameter represents the unique identifier of the comment.
    """

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    service = PollCommentService()

    async def post(self, request, id: str, *args, **kwargs):
        """
        Create a new comment on a poll.

        Args:
            request: The HTTP request object.
            id (str): The unique identifier of the poll associated with the comments.

        Returns:
            Response: A response containing the ID of the created comment and the associated poll.
        """
        user_id: int = request.user.id
        data: dict = request.data

        try:
            comment_id, poll_id = await self.service.create(poll_id=id, user_id=user_id, data=data)

        except ValidationError as error:
            return Response(data=error.detail, status=status.HTTP_400_BAD_REQUEST)

        except PermissionDenied as error:
            return Response(data=error.detail, status=status.HTTP_403_FORBIDDEN)

        except NotFound as error:
            return Response(data=error.detail, status=status.HTTP_404_NOT_FOUND)

        return Response(
            data={"id": str(poll_id), "comment_id": str(comment_id)},
            status=status.HTTP_201_CREATED,
        )

    async def patch(self, request, id: str, comment_id: str, *args, **kwargs):
        """
        Update an existing comment on a poll.

        Args:
            request: The HTTP request object.
            id (str): The unique identifier of the poll associated with the comments.
            comment_id (str): The unique identifier of the comment.

        Returns:
            Response: A response containing the ID of the updated comment and the associated poll.
        """
        user_id: int = request.user.id
        data: dict = request.data

        try:
            comment_id, poll_id = await self.service.update(
                id=comment_id, poll_id=id, user_id=user_id, data=data
            )

        except ValidationError as error:
            return Response(data=error.detail, status=status.HTTP_400_BAD_REQUEST)

        except PermissionDenied as error:
            return Response(data=error.detail, status=status.HTTP_403_FORBIDDEN)

        except NotFound as error:
            return Response(data=error.detail, status=status.HTTP_404_NOT_FOUND)

        return Response(
            data={"id": str(poll_id), "comment_id": str(comment_id)},
            status=status.HTTP_200_OK,
        )

    async def delete(self, request, id: str, comment_id: str, *args, **kwargs):
        """
        Delete an existing comment on a poll.

        Args:
            request: The HTTP request object.
            id (str): The unique identifier of the poll associated with the comments.
            comment_id (str): The unique identifier of the comment.

        Returns:
            Response: A response containing the ID of the deleted comment and the associated poll.
        """
        user_id: int = request.user.id

        try:
            comment_id, poll_id = await self.service.delete(
                id=comment_id, poll_id=id, user_id=user_id
            )

        except ValidationError as error:
            return Response(data=error.detail, status=status.HTTP_400_BAD_REQUEST)

        except PermissionDenied as error:
            return Response(data=error.detail, status=status.HTTP_403_FORBIDDEN)

        except NotFound as error:
            return Response(data=error.detail, status=status.HTTP_404_NOT_FOUND)

        return Response(
            data={"id": str(poll_id), "comment_id": str(comment_id)},
            status=status.HTTP_200_OK,
        )
