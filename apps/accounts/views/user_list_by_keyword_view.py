from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import ValidationError
from adrf.views import APIView

from apps.accounts.services.user_list_service import UserListService


class UserListByKeywordAPIView(APIView):
    """
    API view for retrieving a list of users based on a keyword search.

    This view allows any user, authenticated or not, to retrieve a list of users whose usernames contain the specified keyword.

    Endpoint:
    - GET /users/search: Retrieve a list of users based on a keyword search.

    Permissions:
    - AllowAny: Any user, authenticated or not, is allowed to access this endpoint.

    Usage:
    - To retrieve a list of users based on a keyword search, send a GET request to /users/search with the 'query' parameter.

    Request Query Parameters:
    - query (str): The keyword used for searching users.

    Optional Query Parameters:
    - page (int): The page number for paginated results (default: 1).
    - page_size (int): The number of items per page in the result set (default: 4).

    Response:
    - A JSON response containing the paginated list of users based on the keyword search.

    Example Usage:
    ```
    # Retrieve a list of users by keyword
    GET /users/search?query=john

    # Retrieve a list of users with custom pagination settings (page=2, page_size=10)
    GET /users/search?query=john&page=2&page_size=10
    ```

    Note: This endpoint allows any user to search for users by providing a keyword.
    """

    permission_classes = [AllowAny]

    service = UserListService()

    def get(self, request, *args, **kwargs):
        """
        Retrieve a list of users based on a keyword search.

        Args:
            request: The HTTP request object.

        Returns:
            Response: A response containing the paginated list of users based on the keyword search.
        """
        keyword: str = request.GET.get("query")
        page: int = int(request.GET.get("page", "1"))
        page_size: int = int(request.GET.get("page_size", "4"))

        try:
            if not keyword:
                message: str = "Keyword is not provided"
                raise ValidationError({"message": message})

        except ValidationError as error:
            return Response(data=error.detail, status=status.HTTP_400_BAD_REQUEST)

        data: dict = self.service.get_by_keyword(keyword=keyword, page=page, page_size=page_size)

        return Response(data=data, status=status.HTTP_200_OK)
