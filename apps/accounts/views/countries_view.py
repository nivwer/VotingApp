from datetime import datetime, timedelta

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny

from apps.accounts.utils.countries import COUNTRIES


class CountriesAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        TTL = timedelta(weeks=1)
        expiration_date = datetime.utcnow() + TTL

        response = Response(data=COUNTRIES, status=status.HTTP_200_OK)
        response["Cache-Control"] = f"max-age={int(TTL.total_seconds())}"
        response["Expires"] = expiration_date.strftime("%a, %d %b %Y %H:%M:%S GMT")

        return response
