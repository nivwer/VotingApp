from bson.objectid import ObjectId

from rest_framework import status
from rest_framework.exceptions import ValidationError, PermissionDenied, NotFound
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication

from adrf.views import APIView

from apps.polls.services.poll_service import PollService


class PollOptionAPIView(APIView):
    """
    API view for managing options in a poll.

    This view allows authenticated users to add or delete options for a specific poll.

    Endpoints:
    - POST /poll/{id}/option: Add an option to a poll.
    - DELETE /poll/{id}/option: Delete an option from a poll.
    
    Authentication:
    - SessionAuthentication: Users must be authenticated.

    Permissions:
    - IsAuthenticated: Only accessible to authenticated users.

    Path Parameters:
    - id (str): The unique identifier of the poll to which the options belong.

    Request Format:
    - POST: Send a JSON object with the option details.
    - DELETE: Send a JSON object with the option details to be deleted.

    Usage:
    - To add an option to a poll, send a POST request to /poll/{id}/option with the option details.
    - To delete an option from a poll, send a DELETE request to /poll/{id}/option with the option details.

    Example Usage:
    ```
    # Add an option to a poll with ID '6123456789abcdef01234567'
    POST /poll/6123456789abcdef01234567/option
    headers: { "X-CSRFToken": csrftoken }
    body: { "option_text": "Option A" }

    # Delete an option with text 'Option A' from a poll with ID '6123456789abcdef01234567'
    DELETE /poll/6123456789abcdef01234567/option
    headers: { "X-CSRFToken": csrftoken }
    body: { "option_text": "Option A" }
    ```

    Note: The 'id' parameter in the URL represents the unique identifier of the poll to which the options belong.
    """

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    service = PollService()

    async def post(self, request, id: str, *args, **kwargs):
        """
        Add an option to a specific poll.

        Args:
            request: The HTTP request object.
            id (str): The unique identifier of the poll to which the option will be added.

        Returns:
            Response: A response indicating the success of the option addition.
        """
        user_id: int = request.user.id
        data: dict = request.data

        try:
            id: ObjectId = await self.service.add_option(id=id, user_id=user_id, data=data)

        except ValidationError as error:
            return Response(data=error.detail, status=status.HTTP_400_BAD_REQUEST)

        except PermissionDenied as error:
            return Response(data=error.detail, status=status.HTTP_403_FORBIDDEN)

        except NotFound as error:
            return Response(data=error.detail, status=status.HTTP_404_NOT_FOUND)

        return Response({"id": str(id)}, status=status.HTTP_200_OK)

    async def delete(self, request, id: str, *args, **kwargs):
        """
        Delete an option from a specific poll.

        Args:
            request: The HTTP request object.
            id (str): The unique identifier of the poll from which the option will be deleted.

        Returns:
            Response: A response indicating the success of the option deletion.
        """
        user_id: int = request.user.id
        data: dict = request.data

        try:
            id: ObjectId = await self.service.del_option(id=id, user_id=user_id, data=data)

        except ValidationError as error:
            return Response(data=error.detail, status=status.HTTP_400_BAD_REQUEST)

        except PermissionDenied as error:
            return Response(data=error.detail, status=status.HTTP_403_FORBIDDEN)

        except NotFound as error:
            return Response(data=error.detail, status=status.HTTP_404_NOT_FOUND)

        return Response({"id": str(id)}, status=status.HTTP_200_OK)
