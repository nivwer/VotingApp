from django.urls import path
from . import views

urlpatterns = [
    path('signin/', views.signin, name='signin'),
    path('signup/', views.signup, name="signup"),
    path('user/', views.user_view, name="user"),
]