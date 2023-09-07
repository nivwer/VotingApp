from django.urls import path
from . import views

urlpatterns = [
    path('get/<str:username>', views.get_profile),
    path('update/<str:user_id>', views.update_profile),
]
