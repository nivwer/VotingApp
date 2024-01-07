from datetime import datetime, timedelta

from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from adrf.views import APIView

from apps.polls.utils.categorys import CATEGORIES


class GetCategoriesAPIView(APIView):
    permission_classes = [AllowAny]

    async def get(self, request):
        # Time To Live.
        TTL = timedelta(weeks=1)
        expiration_date = datetime.utcnow() + TTL

        # Cache Control.
        response = Response(data=CATEGORIES, status=status.HTTP_200_OK)
        response["Cache-Control"] = f"max-age={int(TTL.total_seconds())}"
        response["Expires"] = expiration_date.strftime("%a, %d %b %Y %H:%M:%S GMT")

        return response
