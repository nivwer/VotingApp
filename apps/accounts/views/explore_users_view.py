from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from adrf.views import APIView

from apps.accounts.services.user_list_service import UserListService


class ExploreUsersAPIView(APIView):
    permission_classes = [AllowAny]
    service = UserListService()

    async def get(self, request):
        page: int = int(request.GET.get("page")) or 1
        page_size: int = int(request.GET.get("page_size")) or 4

        data: dict = await self.service.explore_user_list(
            user_id=request.user.id, page=page, page_size=page_size
        )

        return Response(data=data, status=status.HTTP_200_OK)
