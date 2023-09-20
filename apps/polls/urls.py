# Django.
from django.urls import path
# Basic views.
from . import views
# CRUD views.
from .app_views.poll_views import create_poll, read_poll, update_poll, delete_poll
from .app_views.options_views import option_manager
from .app_views.voting_views import add_vote, get_vote, update_vote, delete_vote
# GET Polls views.
from .app_views.user_polls_views import user_polls, user_voted_polls
from .app_views.categories_polls_views import category_polls

urlpatterns = [
    # Utils.
    path('categories/', views.polls_categories, name="RCategories"),

    # CRUD Poll.
    path('poll/create/', create_poll, name='CPoll'),
    path('poll/read/<str:poll_id>', read_poll, name='RPoll'),
    path('poll/update/<str:poll_id>', update_poll, name='UPoll'),
    path('poll/delete/<str:poll_id>', delete_poll, name='DPoll'),

    # Options.
    path('poll/option/<str:poll_id>', option_manager, name='OptionManager'),

    # CRUD Vote.
    path('poll/vote/add/<str:poll_id>', add_vote, name='CVote'),
    path('poll/vote/get/<str:poll_id>', get_vote, name='RVote'),
    path('poll/vote/update/<str:poll_id>', update_vote, name='UVote'),
    path('poll/vote/delete/<str:poll_id>', delete_vote, name='DVote'),

    ### GET Polls. ###

    # User Polls.
    path('user/<str:username>', user_polls, name='GetUserPolls'),
    path('user/voted/<str:username>', user_voted_polls, name='GetUserVPolls'),

    # Category Polls.
    path('category/<str:category>', category_polls, name='GetCategoryPolls'),
]
