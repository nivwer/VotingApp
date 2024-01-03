from bson.objectid import ObjectId

from rest_framework import status
from rest_framework.exceptions import ValidationError, PermissionDenied, NotFound
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication

from adrf.views import APIView

from apps.polls.services.poll_service import PollService


class OptionAPIView(APIView):
    """
    Allows authenticated users to add and remove options from a polls.

    Authentication:
        Requires session-based authentication using SessionAuthentication.
    """

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    service = PollService()

    async def post(self, request, id: str):
        """
        Allows authenticated users to add new options to a poll.

        Path Parameters:
            id (required): The ID of the poll for which options are being added.

        User Option Limitation:
            Restricts users to add only one option if they are not the owner of the poll.

        Responses:
            - 200 OK: Option added successfully, includes the ID of the poll.
            - 400 Bad Request: Invalid poll ID or other validation errors.
            - 403 Forbidden: Permission denied if the poll is private and the user is not the owner.
            - 404 Not Found: Poll not found.
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

    async def delete(self, request, id: str):
        """
        Allows authenticated users to remove options from a poll.

        Path Parameters:
            id (required): The ID of the poll from which options are being removed.

        Poll Privacy:
            Ensures that only the owner of the poll is authorized to remove options.

        - 200 OK: Option removed successfully, includes the ID of the poll.
        - 400 Bad Request: Invalid poll ID, option not found, or other validation errors.
        - 403 Forbidden: Permission denied if the poll is private and the user is not the owner.
        - 404 Not Found: Poll not found.
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
