from bson.objectid import ObjectId

from rest_framework import status
from rest_framework.exceptions import ValidationError, PermissionDenied, NotFound
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.authentication import SessionAuthentication

from adrf.views import APIView

from apps.polls.services.poll_service import PollService


class PollAPIView(APIView):
    """
    Allows authenticated users to create, read, update, and delete polls.

    Requires session-based authentication using SessionAuthentication.
    Unauthenticated users have read-only permissions.
    """

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]

    service = PollService()

    async def post(self, request):
        """
        Allows authenticated users to create a new poll with specified options.

        Request Data:
            Expects JSON data with the following structure...

            {
                "title": "Title",
                "description": "Description",
                "privacy": "public/private",
                "category": "Category",
                "options": {
                    "add_options": ["Option 1", "Option 2", ...]
                }
            }

        Responses:
            - 201 Created: Poll created successfully. Includes the ID of the created poll.
            - 400 Bad Request: Validation errors in the request data.
        """
        user_id: int = request.user.id
        data: dict = request.data

        try:
            id: ObjectId = await self.service.create(user_id=user_id, data=data)

        except ValidationError as error:
            return Response(data=error.detail, status=status.HTTP_400_BAD_REQUEST)

        return Response(data={"id": str(id)}, status=status.HTTP_201_CREATED)

    async def get(self, request, id: str):
        """
        Fetches and displays details of a poll using the provided poll ID.
         Returns a JSON response with poll details and user actions.

        Path Parameters:
            id (required): The ID of the poll.

        Access Control:
            For private polls, only the owner can access the information.

        Responses:
            - 200 OK: Poll details and actions of the authenticated user.
            - 400 Bad Request: Invalid poll ID.
            - 403 Forbidden: Permission issues (private poll access).
            - 404 Not Found: Poll not found.
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

    async def patch(self, request, id: str):
        """
        Allows authenticated users who own a poll to update its details, including adding or removing options.

        Path Parameters:
            id (required): The ID of the poll.

        Request Data:
            Expects JSON data with the following structure...

            {
                "title": "Updated Poll Title",
                "description": "Updated Poll Description",
                "privacy": "public/private",
                "category": "Updated Poll Category",
                "options": {
                    "add_options": ["New Option 1", "New Option 2", ...],
                    "del_options": ["Option to Remove 1", "Option to Remove 2", ...]
                }
            }

        Add and Remove Options:
            : Adds new options to the poll document.
            : Removes specified options from the poll document.

        Responses:
            - 200 OK: Poll updated successfully. Includes the ID of the updated poll.
            - 400 Bad Request: Validation errors in the request data.
            - 403 Forbidden: Permission denied if the authenticated user is not the owner.
            - 404 Not Found: Poll not found.
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

    async def delete(self, request, id: str):
        """
        Allows authenticated users who own a poll to delete it, along with its associated comments.

        Path Parameters:
            id (required): The ID of the poll.

        Remove Comment Documents:
            Deletes comment documents associated with the poll from the comments collection.

        Responses:
            - 200 OK: Poll and associated comments removed successfully. Includes the ID of the deleted poll.
            - 400 Bad Request: Validation errors in the request data.
            - 403 Forbidden: Permission denied if the authenticated user is not the owner.
            - 404 Not Found: Poll not found.
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
