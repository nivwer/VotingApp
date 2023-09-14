from django.urls import path
from . import views

# Auth urls.
urlpatterns = [
    # Register.
    path('signup/', views.sign_up, name="signup"),
    # Login.
    path('signin/', views.sign_in, name='signin'),
    # Logout.
    path('signout/', views.sign_out, name='signout'),
    # Check user session.
    path('check-session/', views.check_session, name='check_session'),
    # User data.
    path('user/', views.user_view, name="user"),
]
