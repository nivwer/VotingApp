from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import ValidationError
from adrf.views import APIView

from apps.accounts.services.user_list_service import UserListService


class UserSearchAPIView(APIView):
    permission_classes = [AllowAny]

    service = UserListService()

    def get(self, request):
        keyword: str = request.GET.get("query")
        page: int = int(request.GET.get("page", "1"))
        page_size: int = int(request.GET.get("page_size", "4"))

        try:
            if not keyword:
                raise ValidationError({"message": "Keyword is not provided"})

        except ValidationError as error:
            return Response(data=error.detail, status=status.HTTP_400_BAD_REQUEST)

        data: dict = self.service.get_by_keyword(keyword=keyword, page=page, page_size=page_size)

        return Response(data=data, status=status.HTTP_200_OK)
