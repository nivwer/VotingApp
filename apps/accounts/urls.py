from django.urls import path
from .views.session import sign_up, sign_in, sign_out, user_me_session_check
from .views.account import user_me, user_me_update_username, user_me_update_password

# Auth urls.
urlpatterns = [

    # Sign Up/In/Out.
    path('signup', sign_up, name="sign_up"),
    path('signin', sign_in, name='sign_in'),
    path('signout', sign_out, name='sign_out'),

    # User Session.
    path('user/me/session/check/', user_me_session_check,
         name='user_me_session_check'),

    # User data.
    path('user/me', user_me, name="user"),
    path('user/me/update/username', user_me_update_username,
         name="user_me_update_username"),
    path('user/me/update/password', user_me_update_password,
         name="user_me_update_password"),


]
