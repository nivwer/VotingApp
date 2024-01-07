from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from adrf.views import APIView

from apps.polls.services.poll_list_service import PollListService


class UserPollListAPIView(APIView):
    permission_classes = [AllowAny]

    service = PollListService()

    async def get(self, request, id: int):
        page: int = int(request.GET.get("page", "1"))
        page_size: int = int(request.GET.get("page_size", "4"))
        user_id: int = request.user.id

        data: dict = await self.service.get_by_user_id(
            id=id, page=page, page_size=page_size, user_id=user_id
        )

        return Response(data=data, status=status.HTTP_200_OK)


class UserVotedPollListAPIView(APIView):
    permission_classes = [AllowAny]

    service = PollListService()

    async def get(self, request, id: int):
        page: int = int(request.GET.get("page", "1"))
        page_size: int = int(request.GET.get("page_size", "4"))
        user_id: int = request.user.id

        data: dict = await self.service.get_by_user_votes(
            id=id, page=page, page_size=page_size, user_id=user_id
        )

        return Response(data=data, status=status.HTTP_200_OK)


class UserSharedPollListAPIView(APIView):
    permission_classes = [AllowAny]

    service = PollListService()

    async def get(self, request, id: int):
        page: int = int(request.GET.get("page", "1"))
        page_size: int = int(request.GET.get("page_size", "4"))
        user_id: int = request.user.id

        data: dict = await self.service.get_by_user_shares(
            id=id, page=page, page_size=page_size, user_id=user_id
        )

        return Response(data=data, status=status.HTTP_200_OK)


class UserBookmarkedPollListAPIView(APIView):
    permission_classes = [AllowAny]

    service = PollListService()

    async def get(self, request, id: int):
        page: int = int(request.GET.get("page", "1"))
        page_size: int = int(request.GET.get("page_size", "4"))
        user_id: int = request.user.id

        data: dict = await self.service.get_by_user_bookmarks(
            id=id, page=page, page_size=page_size, user_id=user_id
        )

        return Response(data=data, status=status.HTTP_200_OK)
