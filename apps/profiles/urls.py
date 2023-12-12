from django.urls import path
from .views.profile import profile_me, profile_me_update
from .views.profile_public import profile_by_username
from .views.countries import countries
from .views.search import search_users
from .views.explore import explore_users
from ..accounts.views.user_profile_views import UserProfileAPIView

urlpatterns = [
    # Countries.
    path("countries", countries, name="countries"),
    # User private profile.
    path("profile/user/me", profile_me, name="me_profile"),
    path("profile/user/me/update", profile_me_update, name="update_me_profile"),
    # User public profile.
    path(
        "profile/user/<str:username>", profile_by_username, name="profile_by_username"
    ),
    # Search users
    path("search", search_users, name="search_users"),
    # Explore users
    path("explore", explore_users, name="explore_users"),
    path(
        route="profile",
        view=UserProfileAPIView.as_view(),
        name="profile",
    ),
]
