from bson.objectid import ObjectId

from rest_framework import status
from rest_framework.exceptions import ValidationError, PermissionDenied, NotFound
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication

from adrf.views import APIView

from apps.polls.services.user_actions_service import UserActionsService


class PollVoteAPIView(APIView):
    """
    API view for voting on a poll.

    This view allows authenticated users to vote on a poll. Users can add, read, update, or delete their votes.

    Endpoints:
    - POST /poll/{id}/vote: Add a vote to the poll.
    - GET /poll/{id}/vote: Read the user's vote on the poll.
    - PATCH /poll/{id}/vote: Update the user's vote on the poll.
    - DELETE /poll/{id}/vote: Delete the user's vote on the poll.

    Authentication:
    - SessionAuthentication: Users must be authenticated.

    Permissions:
    - IsAuthenticated: Only authenticated users are allowed.

    Usage:
    - To add a vote, send a POST request to /poll/{id}/vote with the 'vote' parameter.
    - To read the user's vote, send a GET request to /poll/{id}/vote.
    - To update the user's vote, send a PATCH request to /poll/{id}/vote with the 'vote' parameter.
    - To delete the user's vote, send a DELETE request to /poll/{id}/vote.

    Example Usage:
    ```
    # Add a vote
    POST /poll/6123456789abcdef01234567/vote
    headers: { "X-CSRFToken": csrftoken }
    Body: {"vote": "option_1"}

    # Read the user's vote
    GET /poll/6123456789abcdef01234567/vote

    # Update the user's vote
    PATCH /poll/6123456789abcdef01234567/vote
    headers: { "X-CSRFToken": csrftoken }
    Body: {"vote": "option_2"}

    # Delete the user's vote
    DELETE /poll/6123456789abcdef01234567/vote
    headers: { "X-CSRFToken": csrftoken }
    ```

    Note: The 'id' in the URL represents the ID of the poll to vote on.
    """

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    service = UserActionsService()

    async def post(self, request, id: str):
        """
        Add a vote to the poll.

        Args:
            request: The HTTP request object.
            id (str): The ID of the poll to vote on.

        Returns:
            Response: A response indicating the success or failure of the operation.
        """

        user_id: int = request.user.id
        vote: str = request.data["vote"]

        try:
            id: ObjectId = await self.service.vote_add(id=id, user_id=user_id, vote=vote)

        except ValidationError as error:
            return Response(data=error.detail, status=status.HTTP_400_BAD_REQUEST)

        except PermissionDenied as error:
            return Response(data=error.detail, status=status.HTTP_403_FORBIDDEN)

        except NotFound as error:
            return Response(data=error.detail, status=status.HTTP_404_NOT_FOUND)

        return Response(data={"id": str(id)}, status=status.HTTP_200_OK)

    async def get(self, request, id: str):
        """
        Read the user's vote on the poll.

        Args:
            request: The HTTP request object.
            id (str): The ID of the poll to read the user's vote.

        Returns:
            Response: A response containing the user's vote on the poll.
        """
        user_id: int = request.user.id

        try:
            vote: str = await self.service.vote_read(id=id, user_id=user_id)

        except ValidationError as error:
            return Response(data=error.detail, status=status.HTTP_400_BAD_REQUEST)

        except PermissionDenied as error:
            return Response(data=error.detail, status=status.HTTP_403_FORBIDDEN)

        except NotFound as error:
            return Response(data=error.detail, status=status.HTTP_404_NOT_FOUND)

        return Response(data={"vote": vote, "id": id}, status=status.HTTP_200_OK)

    async def patch(self, request, id: str):
        """
        Update the user's vote on the poll.

        Args:
            request: The HTTP request object.
            id (str): The ID of the poll to update the user's vote.

        Returns:
            Response: A response indicating the success or failure of the operation.
        """
        user_id: int = request.user.id
        vote: str = request.data["vote"]

        try:
            id: ObjectId = await self.service.vote_update(id=id, user_id=user_id, vote=vote)

        except ValidationError as error:
            return Response(data=error.detail, status=status.HTTP_400_BAD_REQUEST)

        except PermissionDenied as error:
            return Response(data=error.detail, status=status.HTTP_403_FORBIDDEN)

        except NotFound as error:
            return Response(data=error.detail, status=status.HTTP_404_NOT_FOUND)

        return Response(data={"id": str(id)}, status=status.HTTP_200_OK)

    async def delete(self, request, id: str):
        """
        Delete the user's vote on the poll.

        Args:
            request: The HTTP request object.
            id (str): The ID of the poll to delete the user's vote.

        Returns:
            Response: A response indicating the success or failure of the operation.
        """
        user_id: int = request.user.id

        try:
            id: ObjectId = await self.service.vote_delete(id=id, user_id=user_id)

        except ValidationError as error:
            return Response(data=error.detail, status=status.HTTP_400_BAD_REQUEST)

        except PermissionDenied as error:
            return Response(data=error.detail, status=status.HTTP_403_FORBIDDEN)

        except NotFound as error:
            return Response(data=error.detail, status=status.HTTP_404_NOT_FOUND)

        return Response(data={"id": str(id)}, status=status.HTTP_200_OK)
