from django.urls import path

from .views.auth_views import (
    UserRegisterAPIView,
    UserLoginAPIView,
    UserLogoutAPIView,
    UserSessionCheckAPIView,
)
from .views.user_views import (
    UserAPIView,
    UserCreateAPIView,
    UserUpdateUsernameAPIView,
    UserUpdatePasswordAPIView,
)
from .views.user_profile_view import UserProfileAPIView
from .views.user_profile_public_views import (
    UserProfileByUsernameAPIView,
    UserProfileByUserIdAPIView,
)
from .views.user_list_by_keyword_view import UserListByKeywordAPIView
from .views.countries_view import CountriesAPIView
from .views.user_list_all_view import UserListAllAPIView
from .views.csrf_token_view import CSRFTokenAPIView


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
    path(
        route="user/session/check",
        view=UserSessionCheckAPIView.as_view(),
        name="user_session_check",
    ),
    path(
        route="user/create",
        view=UserCreateAPIView.as_view(),
        name="user_create",
    ),
    path(
        route="user",
        view=UserAPIView.as_view(),
        name="user",
    ),
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
    path(
        route="user/profile",
        view=UserProfileAPIView.as_view(),
        name="user_profile",
    ),
    path(
        route="countries",
        view=CountriesAPIView.as_view(),
        name="countries",
    ),
    path(
        route="user/<str:username>/profile",
        view=UserProfileByUsernameAPIView.as_view(),
        name="user_profile_by_username",
    ),
    path(
        route="user/<int:id>/profile",
        view=UserProfileByUserIdAPIView.as_view(),
        name="user_profile_by_user_id",
    ),
    path(
        route="users/search",
        view=UserListByKeywordAPIView.as_view(),
        name="users_search",
    ),
    path(
        route="users/all",
        view=UserListAllAPIView.as_view(),
        name="users_all",
    ),
    path(
        route="csrf-token",
        view=CSRFTokenAPIView.as_view(),
        name="csrf_token",
    ),
]
