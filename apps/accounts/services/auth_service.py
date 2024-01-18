from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User

from rest_framework.exceptions import AuthenticationFailed
from rest_framework.request import Request


class AuthService:
    """
    Service class for authentication-related operations.

    This class provides methods for authenticating users and handling login operations.
    """

    def authenticate(self, request: Request, raise_exception: bool = False):
        """
        Authenticates a user based on provided credentials.
        """

        username: str = request.data.get("username")
        password: str = request.data.get("password")

        user: User = authenticate(request=request, username=username, password=password)

        if user is None:
            if raise_exception:
                message: str = "Failed authentication."
                raise AuthenticationFailed(detail={"password": [message]})
            return None

        return user

    def authenticateAndLogin(self, request: Request, raise_exception: bool = True):
        """
        Authenticates and logs in a user based on provided credentials.
        """

        user: User = self.authenticate(request=request, raise_exception=raise_exception)

        if user is None:
            return None

        login(request=request, user=user)

        return user
