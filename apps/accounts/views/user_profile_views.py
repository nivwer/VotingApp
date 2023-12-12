from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from apps.accounts.services.user_profile_service import UserProfileRepository
from apps.profiles.serializers import UserProfileSerializer


class UserProfileAPIView(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]
    user_profile_repository = UserProfileRepository()

    def get(self, request):
        profile = self.user_profile_repository.get_profile_by_user_id(
            id=request.user.pk
        )
        profile = UserProfileSerializer(instance=profile).data
        return Response(data=profile, status=status.HTTP_200_OK)

    def post(self, request):
        try:
            self.user_profile_repository.create(
                data={"user": request.user.pk, "profile_name": request.user.username}
            )

        except ValidationError as error:
            return Response(data=error.detail, status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_201_CREATED)

    def put(self, request):
        try:
            profile = self.user_profile_repository.get_profile_by_user_id(
                id=request.user.pk
            )
            self.user_profile_repository.update(instance=profile, data=request.data)

        except ValidationError as error:
            return Response(data=error.detail, status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_200_OK)
