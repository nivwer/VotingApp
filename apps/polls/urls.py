from django.urls import path
from . import views
from .app_views import poll_views, options_views, voting_views


urlpatterns = [
    # Utils.
    path('categories/', views.polls_categories, name="RCategories"),

    # CRUD Poll.
    path('poll/create/', poll_views.create_poll, name='CPoll'),
    path('poll/read/<str:poll_id>', poll_views.read_poll, name='RPoll'),
    path('poll/update/<str:poll_id>', poll_views.update_poll, name='UPoll'),
    path('poll/delete/<str:poll_id>', poll_views.delete_poll, name='DPoll'),

    # Options.
    path('poll/option/<str:poll_id>', options_views.option_manager),

    # CRUD Vote.
    path('poll/vote/add/<str:poll_id>', voting_views.add_user_vote, name='CVote'),
    path('poll/vote/get/<str:poll_id>', voting_views.get_user_vote, name='RVote'),
    path('poll/vote/update/<str:poll_id>', voting_views.update_user_vote, name='UVote'),
    path('poll/vote/delete/<str:poll_id>', voting_views.delete_user_vote, name='DVote'),

    # GET Polls.
    path('user/<str:username>', poll_views.user_polls, name='UserPolls'),
    # path('category/<str:category>', views.category_polls, name='CategoryPolls')

]
