from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import ValidationError
from adrf.views import APIView

from apps.polls.services.poll_list_service import PollListService


class SearchPollListAPIView(APIView):
    permission_classes = [AllowAny]

    service = PollListService()

    async def get(self, request):
        keyword: str = request.GET.get("query")
        page: int = int(request.GET.get("page", "1"))
        page_size: int = int(request.GET.get("page_size", "4"))
        user_id: int = request.user.id

        try:
            if not keyword:
                message: str = "Keyword is not provided"
                raise ValidationError({"message": message})

        except ValidationError as error:
            return Response(data=error.detail, status=status.HTTP_400_BAD_REQUEST)

        data: dict = await self.service.get_by_keyword(
            keyword=keyword, page=page, page_size=page_size, user_id=user_id
        )

        return Response(data=data, status=status.HTTP_200_OK)
