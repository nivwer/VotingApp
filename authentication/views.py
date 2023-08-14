# Django.
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.middleware.csrf import get_token
from django.contrib.auth.decorators import permission_required
# Rest Framework.
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
# Serializers.
from .serializers import UserSerializer


# Views.

# async def getCSRFToken(request):
#     return JsonResponse({'csrfToken': get_token(request)})


@api_view(['GET'])
@permission_required([IsAuthenticated])
def user_view(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


async def singup(request):
    return HttpResponse("SingUp")


async def singin(request):
    return HttpResponse("SingIn")
