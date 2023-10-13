from django.urls import path
from .views.profile import profile_me, profile_me_update
from .views.profile_public import profile_by_username

urlpatterns = [
    # User private profile.
    path('profile/user/me', profile_me, name='me_profile'),
    path('profile/user/me/update', profile_me_update, name='update_me_profile'),

    # User public profile.
    path('profile/user/<str:username>',
         profile_by_username, name='profile_by_username'),
]
