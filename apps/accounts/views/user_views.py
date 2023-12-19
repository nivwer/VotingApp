from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.models import User

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import ValidationError

from apps.accounts.serializers.user_serialziers import UserSerializer
from apps.accounts.services.user_service import UserService


class UserCreateAPIView(APIView):
    """
    API view for user creation.
    """

    permission_classes = [AllowAny]
    service = UserService()

    def post(self, request):
        """
        Allows to create users.

        Supports custom parameters in the request data to control the creation process.

        Usage:
            - To create a user: Send a POST request with user data.
            - To return user information: Include 'return_user' in the request. ( Optional )

         Example Request:
        ```
        POST /create_user/
        {
            "username": "example_user",
            "password": "secure_password",
            "return_user": true
        }
        ```

        Responses:
            - 200 OK: Successful account creation.
            - 400 Bad Request: Validation errors in the request payload.
        """

        return_user: bool = request.data.get("return_user", False)
        user_data: dict = request.data
        
        data: dict = {}

        try:
            instance: User = self.service.create_user(data=user_data)

        except ValidationError as error:
            return Response(data=error.detail, status=status.HTTP_400_BAD_REQUEST)

        if return_user:
            user: dict = UserSerializer(instance=instance).data
            data["user"] = user

        response = Response(status=status.HTTP_201_CREATED)
        response.data = data
        return response


class UserAPIView(APIView):
    """
    API view for retrieving authenticated user information.

    Requires session-based authentication using SessionAuthentication.
    """

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Allows authenticated users to retrieve information about themselves.

        Example Request:
        ```
        GET /user/
        ```

        Responses:
            - 200 OK:
            - 401 Unauthorized: Authentication failed.
        """

        instance: User = request.user
        user: dict = UserSerializer(instance=instance).data
        return Response(data={"user": user}, status=status.HTTP_200_OK)


class UserUpdateUsernameAPIView(APIView):
    """
    API view for updating the username of the authenticated user.

    Requires session-based authentication using SessionAuthentication.
    """

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    service = UserService()

    def patch(self, request):
        """
        Allows authenticated users to update their username.

        Usage:
            - To update the username: Send a PATCH request to the '/update_username/' endpoint.

        Example Request:
        ```
        PATCH /update_username/
        {
            "username": "new_username"
        }
        ```

        Responses:
            - 200 OK: Successful username update.
            - 400 Bad Request: Validation errors in the request (e.g., missing or non-unique username).
            - 401 Unauthorized: Authentication failed.
        """

        instance: User = request.user
        data: dict = request.data

        try:
            user: User = self.service.update_username(instance=instance, data=data)

        except ValidationError as error:
            return Response(data=error.detail, status=status.HTTP_400_BAD_REQUEST)

        update_session_auth_hash(request=request, user=user)

        return Response(status=status.HTTP_200_OK)


class UserUpdatePasswordAPIView(APIView):
    """
    API view for updating the password of the authenticated user.

    Requires session-based authentication using SessionAuthentication.
    """

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    service = UserService()

    def patch(self, request):
        """
        Allows authenticated users to update their password.

        Usage:
            - To update the password: Send a PATCH request to the '/update_password/' endpoint.

        Example Request:
        ```
        PATCH /update_password/
        {
            "current_password": "current_secure_password",
            "new_password": "new_secure_password"
        }
        ```

        Responses:
            - 200 OK: Successful password update.
            - 400 Bad Request: Validation errors in the request.
            - 401 Unauthorized: Authentication failed.
        """

        instance: User = request.user
        data: dict = request.data

        try:
            user: User = self.service.update_password(instance=instance, data=data)

        except ValidationError as error:
            return Response(data=error.detail, status=status.HTTP_400_BAD_REQUEST)

        update_session_auth_hash(request=request, user=user)

        return Response(status=status.HTTP_200_OK)
 