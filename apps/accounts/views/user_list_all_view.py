from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from adrf.views import APIView

from apps.accounts.services.user_list_service import UserListService


class UserListAllAPIView(APIView):
    """
    API view for retrieving a paginated list of all users.

    This view allows any user, authenticated or not, to retrieve a paginated list of all users.

    Endpoint:
    - GET /users/all: Retrieve a paginated list of all users.

    Permissions:
    - AllowAny: Any user, authenticated or not, is allowed to access this endpoint.

    Usage:
    - To retrieve a paginated list of all users, send a GET request to /users/all.

    Request Query Parameters:
    - page (int): The page number for paginated results (default: 1).
    - page_size (int): The number of items per page in the result set (default: 4).

    Response:
    - A JSON response containing the paginated list of all users.

    Example Usage:
    ```
    # Retrieve a list of all users
    GET /users/all

    # Retrieve a paginated list of all users with custom pagination settings (page=2, page_size=10)
    GET /users/all?query=john&page=2&page_size=10
    ```

    Note: This endpoint allows any user to retrieve a paginated list of all users.
    """

    permission_classes = [AllowAny]

    service = UserListService()

    def get(self, request):
        page: int = int(request.GET.get("page", "1"))
        page_size: int = int(request.GET.get("page_size", "4"))
        user_id: int = request.user.id

        data: dict = self.service.get_all(user_id=user_id, page=page, page_size=page_size)

        return Response(data=data, status=status.HTTP_200_OK)
