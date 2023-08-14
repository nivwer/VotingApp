from django.urls import path
from . import views
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    #path('token/csrf/', views.getCSRFToken, name="csrf"),
    path('token/', obtain_auth_token),
    path('register/', views.singup, name="register"),
    path('user/', views.user_view, name="user"),
]
