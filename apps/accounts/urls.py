from django.urls import path
from .views.session import SignUp, SignIn, SignOut, SessionCheck
from .views.account import user_me, user_me_update_username, user_me_update_password
from .views.auth_views import (
    UserRegisterAPIView,
    UserRegisterAndLoginAPIView,
    UserLoginAPIView,
)
from .views.user_views import (
    UserAPIView,
    UserCreateAPIView,
    UserUpdateUsernameAPIView,
    UserUpdatePasswordAPIView,
)
from .views.user_profile_views import UserProfileAPIView

urlpatterns = [
    path("signup", SignUp.as_view(), name="SignUp"),
    path("signin", SignIn.as_view(), name="SignIn"),
    path("signout", SignOut.as_view(), name="SignOut"),
    path("user/me/session/check/", SessionCheck.as_view(), name="SessionCheck"),
    # User data.
    path("user/me", user_me, name="user"),
    path(
        "user/me/update/username",
        user_me_update_username,
        name="user_me_update_username",
    ),
    path(
        "user/me/update/password",
        user_me_update_password,
        name="user_me_update_password",
    ),
    
   
    # NEW VERSION Accouts
    path(
        route="register/login",
        view=UserRegisterAndLoginAPIView.as_view(),
        name="account_register_and_login",
    ),
    path(route="register", view=UserRegisterAPIView.as_view(), name="account_register"),
    path(route="login", view=UserLoginAPIView.as_view(), name="account_register"),
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
    # NEW VERSION PROFILES
    path(route="user/profile", view=UserProfileAPIView.as_view(), name="user_profile"),
]
