from rest_framework import status
from rest_framework.exceptions import ValidationError, PermissionDenied, NotFound
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.authentication import SessionAuthentication

from adrf.views import APIView

from apps.polls.services.poll_services import PollService


class PollAPIView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]
    service = PollService()

    async def post(self, request):
        try:
            id = await self.service.create(user_id=request.user.id, data=request.data)

        except ValidationError as error:
            return Response(data=error.detail, status=status.HTTP_400_BAD_REQUEST)

        return Response(data={"id": str(id)}, status=status.HTTP_201_CREATED)

    async def get(self, request, id):
        try:
            poll, user_actions = await self.service.get_by_id(
                id=id, user_id=request.user.id
            )

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

    async def patch(self, request, id):
        try:
            id = await self.service.update(
                id=id, user_id=request.user.id, data=request.data
            )

        except ValidationError as error:
            return Response(data=error.detail, status=status.HTTP_400_BAD_REQUEST)

        except PermissionDenied as error:
            return Response(data=error.detail, status=status.HTTP_403_FORBIDDEN)

        except NotFound as error:
            return Response(data=error.detail, status=status.HTTP_404_NOT_FOUND)

        return Response(data={"id": str(id)}, status=status.HTTP_200_OK)

    async def delete(self, request, id):
        try:
            id = await self.service.delete(id=id, user_id=request.user.id)

        except ValidationError as error:
            return Response(data=error.detail, status=status.HTTP_400_BAD_REQUEST)

        except PermissionDenied as error:
            return Response(data=error.detail, status=status.HTTP_403_FORBIDDEN)

        except NotFound as error:
            return Response(data=error.detail, status=status.HTTP_404_NOT_FOUND)

        return Response(data={"id": str(id)}, status=status.HTTP_200_OK)
