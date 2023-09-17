from django.urls import path
from . import views

# Auth urls.
urlpatterns = [
    # Sign Up/In/Out.
    path('signup/', views.sign_up, name="signup"),
    path('signin/', views.sign_in, name='signin'),
    path('signout/', views.sign_out, name='signout'),
    # User data.
    path('user/data/', views.user_view, name="user"),
    # User Session.
    path('user/session/check/', views.check_session, name='check_session'),
]
