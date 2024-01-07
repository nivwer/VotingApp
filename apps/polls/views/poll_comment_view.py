from rest_framework import status
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound, PermissionDenied, ValidationError
from adrf.views import APIView

from apps.polls.services.poll_comment_service import PollCommentService


class PollCommentAPIView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    service = PollCommentService()

    async def post(self, request, id: str):
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

    async def patch(self, request, id: str, comment_id: str):
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

    async def delete(self, request, id: str, comment_id: str):
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
