from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from adrf.views import APIView

from apps.polls.services.poll_list_service import PollListService


class UserPollListAPIView(APIView):
    permission_classes = [AllowAny]

    service = PollListService()

    async def get(self, request, id: str):
        page: int = int(request.GET.get("page", "1"))
        page_size: int = int(request.GET.get("page_size", "4"))
        user_id: int = request.user.id

        data: dict = await self.service.get_user_poll_list(
            id=int(id), page=page, page_size=page_size, user_id=user_id
        )

        return Response(data=data, status=status.HTTP_200_OK)


class UserVotedPollListAPIView(APIView):
    pass


class UserSharedPollListAPIView(APIView):
    pass


class UserBookmarkedPollListAPIView(APIView):
    pass
