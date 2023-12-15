from django.contrib.auth import update_session_auth_hash

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import ValidationError

from apps.accounts.repositories.user_repository import UserRepository
from apps.accounts.serializers.user_serialziers import UserSerializer


class UserCreateAPIView(APIView):
    permission_classes = [AllowAny]
    user_repository = UserRepository()

    def post(self, request):
        try:
            user = self.user_repository.create_user(data=request.data)

        except ValidationError as error:
            return Response(data=error.detail, status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_201_CREATED)


class UserAPIView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = UserSerializer(instance=request.user).data
        return Response(data=user, status=status.HTTP_200_OK)


class UserUpdateUsernameAPIView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    user_repository = UserRepository()

    def patch(self, request):
        try:
            user = self.user_repository.update_username(
                instance=request.user, data=request.data
            )

        except ValidationError as error:
            return Response(data=error.detail, status=status.HTTP_400_BAD_REQUEST)

        update_session_auth_hash(request=request, user=user)
        return Response(status=status.HTTP_200_OK)


class UserUpdatePasswordAPIView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    user_repository = UserRepository()

    def patch(self, request):
        try:
            user = self.user_repository.update_password(
                user=request.user, data=request.data
            )

        except ValidationError as error:
            return Response(data=error.detail, status=status.HTTP_400_BAD_REQUEST)

        update_session_auth_hash(request=request, user=user)
        return Response(status=status.HTTP_200_OK)
