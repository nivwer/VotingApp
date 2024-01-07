from bson.objectid import ObjectId

from rest_framework import status
from rest_framework.exceptions import ValidationError, PermissionDenied, NotFound
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication

from adrf.views import APIView

from apps.polls.services.user_actions_service import UserActionsService

class PollBookmarkAPIView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    service = UserActionsService()

    async def post(self, request, id: str):
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

    async def delete(self, request, id: str):
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
