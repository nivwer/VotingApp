from django.urls import path

from .views.auth_views import UserRegisterAPIView, UserLoginAPIView, UserLogoutAPIView
from .views.user_views import (
    UserAPIView,
    UserCreateAPIView,
    UserUpdateUsernameAPIView,
    UserUpdatePasswordAPIView,
)
from .views.user_profile_views import UserProfileAPIView

urlpatterns = [
    path(
        route="register",
        view=UserRegisterAPIView.as_view(),
        name="account_register",
    ),
    path(
        route="login",
        view=UserLoginAPIView.as_view(),
        name="account_login",
    ),
    path(
        route="logout",
        view=UserLogoutAPIView.as_view(),
        name="account_logout",
    ),
    # Other views
    path(route="user", view=UserAPIView.as_view(), name="user"),
    path(route="user/create", view=UserCreateAPIView.as_view(), name="user_create"),
    path(
        route="user/update/username",
        view=UserUpdateUsernameAPIView.as_view(),
        name="user_update_username",
    ),
    path(
        route="user/update/password",
        view=UserUpdatePasswordAPIView.as_view(),
        name="user_update_password",
    ),
    # Profiles
    path(route="user/profile", view=UserProfileAPIView.as_view(), name="user_profile"),
]
