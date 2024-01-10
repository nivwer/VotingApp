from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import ValidationError
from adrf.views import APIView

from apps.accounts.services.user_list_service import UserListService


class UserListByKeywordAPIView(APIView):
    """
    API view for retrieving a list of users based on a keyword search.

    This view allows any user to search for users based on a provided keyword.
    """

    permission_classes = [AllowAny]

    service = UserListService()

    def get(self, request):
        """
        Handles the retrieval of a list of users based on a keyword search.

        Usage:
            - To retrieve a list of users by keyword: Send a GET request to the '/users/search/' endpoint.
            Include the 'query' parameter in the URL to specify the keyword.
            Optional parameters: 'page' for pagination and 'page_size' to set the number of results per page.

        Example Request:
        ```
        GET /users/search/?query=john&page=1&page_size=4
        ```

        Responses:
            - 200 OK:
            - 400 Bad Request: Keyword is not provided.
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
