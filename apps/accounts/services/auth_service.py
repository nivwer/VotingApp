from django.contrib.auth import authenticate, login

from rest_framework.exceptions import AuthenticationFailed
from rest_framework.request import Request


class AuthService:
    def authenticate(self, request: Request, raise_exception: bool = False):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(request=request, username=username, password=password)

        if user is None:
            if raise_exception:
                raise AuthenticationFailed(detail="Failed authentication.")
            return None

        return user

    def authenticateAndLogin(self, request: Request, raise_exception: bool = False):
        user = self.authenticate(request=request, raise_exception=raise_exception)

        if user is None:
            return None

        login(request=request, user=user)

        return user
