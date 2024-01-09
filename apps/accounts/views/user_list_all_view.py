from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from adrf.views import APIView

from apps.accounts.services.user_list_service import UserListService


class UserListAllAPIView(APIView):
    permission_classes = [AllowAny]

    service = UserListService()

    def get(self, request):
        page: int = int(request.GET.get("page", "1"))
        page_size: int = int(request.GET.get("page_size", "4"))
        user_id: int = request.user.id

        data: dict = self.service.get_all(user_id=user_id, page=page, page_size=page_size)

        return Response(data=data, status=status.HTTP_200_OK)
