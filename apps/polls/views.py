# Django.
from django.http import JsonResponse
# Rest Framework.
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
# Utils.
from apps.polls.utils.categorys import CATEGORIES


# Views.

# Get poll categories.
@api_view(['GET'])
@permission_classes([AllowAny])
def polls_categories(request):
    return JsonResponse(CATEGORIES)
