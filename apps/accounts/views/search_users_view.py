from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import ValidationError
from adrf.views import APIView

from apps.accounts.services.user_list_service import UserListService


class SearchUsersAPIView(APIView):
    permission_classes = [AllowAny]
    service = UserListService()

    async def get(self, request):
        keyword: str = request.GET.get("query")
        page: int = int(request.GET.get("page")) or 1
        page_size: int = int(request.GET.get("page_size")) or 4

        if not keyword:
            raise ValidationError({"message": "Keyword is not provided"})

        data: dict = await self.service.get_user_list_by_keyword(
            keyword=keyword, page=page, page_size=page_size
        )

        return Response(data=data, status=status.HTTP_200_OK)
