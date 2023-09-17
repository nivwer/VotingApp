from django.urls import path
from . import views

urlpatterns = [
    # CRUD profile.
    path('profile/read/', views.read_profile),
    path('profile/update/', views.update_profile),

    # Get user public profile.
    path('profile/get/<str:username>', views.get_profile),
]
