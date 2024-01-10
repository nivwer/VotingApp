from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from adrf.views import APIView

from apps.accounts.services.user_list_service import UserListService


class UserListAllAPIView(APIView):
    """
    API view for retrieving a paginated list of all users.
    """

    permission_classes = [AllowAny]

    service = UserListService()

    def get(self, request):
        """
        Handles the retrieval of a paginated list of all users.

        Usage:
            - To retrieve a paginated list of all users: Send a GET request to the '/users/all/' endpoint.
            Optional parameters: 'page' for pagination and 'page_size' to set the number of results per page.

        Example Request:
            ```
            GET /users/all/?page=1&page_size=4
            ```

        Responses:
            - 200 OK:
        """

        page: int = int(request.GET.get("page", "1"))
        page_size: int = int(request.GET.get("page_size", "4"))
        user_id: int = request.user.id

        data: dict = self.service.get_all(user_id=user_id, page=page, page_size=page_size)

        return Response(data=data, status=status.HTTP_200_OK)
