from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

# Views.
async def singup(request):
    request.GET.get('query', '')

    return HttpResponse("SingUp")

async def singin(request):
    return HttpResponse("SingIn")
