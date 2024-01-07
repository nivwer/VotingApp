from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import ValidationError
from adrf.views import APIView

from apps.polls.services.poll_comment_list_service import PollCommentListService


class PollCommentListAPIVIew(APIView):
    permission_classes = [AllowAny]

    service = PollCommentListService()

    async def get(self, request, id: str):
        page: int = int(request.GET.get("page", "1"))
        page_size: int = int(request.GET.get("page_size", "4"))
        user_id: int = request.user.id

        data: dict = await self.service.get_by_poll_id(
            poll_id=id, page=page, page_size=page_size, user_id=user_id
        )

        return Response(data=data, status=status.HTTP_200_OK)
