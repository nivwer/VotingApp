from django.urls import path
from . import views

urlpatterns = [
    # CRUD profiles.
    path('read/', views.read_profile),
    path('update/', views.update_profile),
    # Get user public profiles.
    path('get/<str:username>', views.get_profile),
]
