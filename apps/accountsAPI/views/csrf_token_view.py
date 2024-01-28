from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from rest_framework.exceptions import ValidationError


class CSRFTokenAPIView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            csrf_token: str = request.COOKIES.get("csrftoken", None)

            if not csrf_token:
                message: str = "CSRF token not found in the request cookies"
                raise ValidationError(detail={"message": message})

            return Response(data={"csrftoken": csrf_token}, status=status.HTTP_200_OK)

        except ValidationError as error:
            return Response(data=error.detail, status=status.HTTP_400_BAD_REQUEST)
