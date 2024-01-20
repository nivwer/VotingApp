from bson.objectid import ObjectId

from rest_framework import status
from rest_framework.exceptions import ValidationError, PermissionDenied, NotFound
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.authentication import SessionAuthentication

from adrf.views import APIView

from apps.pollsAPI.services.poll_service import PollService


class PollAPIView(APIView):
    """
    API view for managing polls.

    This view allows users to create, retrieve, update, or delete polls. Authenticated users
    can perform all CRUD operations, while unauthenticated users can only view polls.

    Endpoints:
    - POST /poll: Create a new poll.
    - GET /poll/{id}: Retrieve details of a specific poll.
    - PATCH /poll/{id}: Update details of a specific poll.
    - DELETE /poll/{id}: Delete a specific poll.

    Authentication:
    - SessionAuthentication: Users must be authenticated.

    Permissions:
    - IsAuthenticatedOrReadOnly: Authenticated users have full access, while unauthenticated users have read-only access.

    Path Parameters:
    - id (str): The unique identifier of the poll.

    Request Format:
    - POST: Send a JSON object with the poll details.
    - PATCH: Send a JSON object with the updated poll details.

    Usage:
    - To create a new poll, send a POST request to /poll with the poll details.
    - To retrieve details of a poll, send a GET request to /poll/{id}.
    - To update details of a poll, send a PATCH request to /poll/{id} with the updated poll details.
    - To delete a poll, send a DELETE request to /poll/{id}.

    Example Usage:
    ```
    # Create a new poll
    POST /poll
    headers: { "X-CSRFToken": csrftoken }
    body: {
        "title": "Title",
        "description": "Description",
        "privacy": "public/private",
        "category": "Category",
        "options": {
            "add_options": ["Option 1", "Option 2", ...]
        }
    }


    # Retrieve details of a poll with ID '/poll/6123456789abcdef01234567'
    GET /poll/6123456789abcdef01234567

    # Update details of a poll with ID '/poll/6123456789abcdef01234567'
    PATCH /poll/6123456789abcdef01234567
    headers: { "X-CSRFToken": csrftoken }
    body: {
        "title": "Updated Poll Title",
        "description": "Updated Poll Description",
        "privacy": "public/private",
        "category": "Updated Poll Category",
        "options": {
            "add_options": ["New Option 1", "New Option 2", ...],
            "del_options": ["Option to Remove 1", "Option to Remove 2", ...]
        }
    }

    # Delete a poll with ID '/poll/6123456789abcdef01234567'
    DELETE /poll/6123456789abcdef01234567
    headers: { "X-CSRFToken": csrftoken }
    ```

    Note: The 'id' parameter in the URL represents the unique identifier of the poll.
    """

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]

    service = PollService()

    async def post(self, request, *args, **kwargs):
        """
        Create a new poll.

        Args:
            request: The HTTP request object.

        Returns:
            Response: A response indicating the success of the poll creation.
        """
        user_id: int = request.user.id
        data: dict = request.data

        try:
            id: ObjectId = await self.service.create(user_id=user_id, data=data)

        except ValidationError as error:
            return Response(data=error.detail, status=status.HTTP_400_BAD_REQUEST)

        return Response(data={"id": str(id)}, status=status.HTTP_201_CREATED)

    async def get(self, request, id: str, *args, **kwargs):
        """
        Retrieve details of a specific poll.

        Args:
            request: The HTTP request object.
            id (str): The unique identifier of the poll to be retrieved.

        Returns:
            Response: A response containing the poll details.
        """
        user_id: int = request.user.id

        try:
            poll, user_actions = await self.service.get_by_id(id=id, user_id=user_id)

        except ValidationError as error:
            return Response(data=error.detail, status=status.HTTP_400_BAD_REQUEST)

        except PermissionDenied as error:
            return Response(data=error.detail, status=status.HTTP_403_FORBIDDEN)

        except NotFound as error:
            return Response(data=error.detail, status=status.HTTP_404_NOT_FOUND)

        return Response(
            data={"poll": poll, "authenticated_user_actions": user_actions},
            status=status.HTTP_200_OK,
        )

    async def patch(self, request, id: str, *args, **kwargs):
        """
        Update details of a specific poll.

        Args:
            request: The HTTP request object.
            id (str): The unique identifier of the poll to be updated.

        Returns:
            Response: A response indicating the success of the poll update.
        """
        user_id: int = request.user.id
        data: dict = request.data

        try:
            id: ObjectId = await self.service.update(id=id, user_id=user_id, data=data)

        except ValidationError as error:
            return Response(data=error.detail, status=status.HTTP_400_BAD_REQUEST)

        except PermissionDenied as error:
            return Response(data=error.detail, status=status.HTTP_403_FORBIDDEN)

        except NotFound as error:
            return Response(data=error.detail, status=status.HTTP_404_NOT_FOUND)

        return Response(data={"id": str(id)}, status=status.HTTP_200_OK)

    async def delete(self, request, id: str, *args, **kwargs):
        """
        Delete a specific poll.

        Args:
            request: The HTTP request object.
            id (str): The unique identifier of the poll to be deleted.

        Returns:
            Response: A response indicating the success of the poll deletion.
        """
        user_id: int = request.user.id

        try:
            id: ObjectId = await self.service.delete(id=id, user_id=user_id)

        except ValidationError as error:
            return Response(data=error.detail, status=status.HTTP_400_BAD_REQUEST)

        except PermissionDenied as error:
            return Response(data=error.detail, status=status.HTTP_403_FORBIDDEN)

        except NotFound as error:
            return Response(data=error.detail, status=status.HTTP_404_NOT_FOUND)

        return Response(data={"id": str(id)}, status=status.HTTP_200_OK)
