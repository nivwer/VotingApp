from bson.objectid import ObjectId

from rest_framework import status
from rest_framework.exceptions import ValidationError, PermissionDenied, NotFound
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication

from adrf.views import APIView

from apps.polls.services.user_actions_service import UserActionsService


class PollShareAPIView(APIView):
    """
    API view for sharing and unsharing polls.

    This view allows authenticated users to share or unshare a poll. Sharing involves adding the poll to the user's shared polls list, and unsharing involves removing it.

    Endpoints:
    - POST /poll/{id}/share.: Share a poll by adding it to the user's shared polls list.
    - DELETE /poll/{id}/share: Unshare a poll by removing it from the user's shared polls list.

    Authentication:
    - SessionAuthentication: Users must be authenticated.

    Permissions:
    - IsAuthenticated: Only authenticated users are allowed.

    Path Parameters:
    - id (str): The unique identifier of the poll to be shared or unshared.

    Usage:
    - To share a poll, send a POST request to /poll/{id}/share.
    - To unshare a poll, send a DELETE request to /poll/{id}/share.

    Example Usage:
    ```
    # Share a poll
    POST /poll/6123456789abcdef01234567/share
    headers: { "X-CSRFToken": csrftoken }

    # Unshare a poll
    DELETE /poll/6123456789abcdef01234567/share
    headers: { "X-CSRFToken": csrftoken }
    ```

    Note: The 'id' in the URL represents the ID of the poll to be shared or unshared.
    """

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    service = UserActionsService()

    async def post(self, request, id: str):
        """
        Share a poll by adding it to the user's shared polls list.

        Args:
            request: The HTTP request object.
            id (str): The ID of the poll to be shared.

        Returns:
            Response: A response indicating the success or failure of the operation.
        """

        user_id: int = request.user.id

        try:
            id: ObjectId = await self.service.share(id=id, user_id=user_id)

        except ValidationError as error:
            return Response(data=error.detail, status=status.HTTP_400_BAD_REQUEST)

        except PermissionDenied as error:
            return Response(data=error.detail, status=status.HTTP_403_FORBIDDEN)

        except NotFound as error:
            return Response(data=error.detail, status=status.HTTP_404_NOT_FOUND)

        return Response(data={"id": str(id)}, status=status.HTTP_200_OK)

    async def delete(self, request, id: str):
        """
        Unshare a poll by removing it from the user's shared polls list.

        Args:
        request: The HTTP request object.
        id (str): The ID of the poll to be unshared.

        Returns:
        Response: A response indicating the success or failure of the operation.
        """

        user_id: int = request.user.id

        try:
            id: ObjectId = await self.service.unshare(id=id, user_id=user_id)

        except ValidationError as error:
            return Response(data=error.detail, status=status.HTTP_400_BAD_REQUEST)

        except PermissionDenied as error:
            return Response(data=error.detail, status=status.HTTP_403_FORBIDDEN)

        except NotFound as error:
            return Response(data=error.detail, status=status.HTTP_404_NOT_FOUND)

        return Response(data={"id": str(id)}, status=status.HTTP_200_OK)
