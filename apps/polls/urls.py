from django.urls import path
from .views import poll_views, options_views, voting_views

urlpatterns = [
    # CRUD Poll.
    path('create/', poll_views.create_poll, name='CPoll'),
    path('read/<str:poll_id>', poll_views.read_poll, name='RPoll'),
    path('update/<str:poll_id>', poll_views.update_poll, name='UPoll'),
    path('delete/<str:poll_id>', poll_views.delete_poll, name='DPoll'),

    # Options.
    path('option/<str:poll_id>', options_views.option_manager),

    # CRUD Vote.
    path('vote/add/<str:poll_id>', voting_views.add_user_vote, name='CVote'),
    path('vote/get/<str:poll_id>', voting_views.get_user_vote, name='RVote'),
    path('vote/update/<str:poll_id>', voting_views.update_user_vote, name='UVote'),
    path('vote/delete/<str:poll_id>', voting_views.delete_user_vote, name='DVote'),

    # GET Polls.
    path('user/<str:username>', poll_views.user_polls, name='UserPolls'),
    # path('category/<str:category>', views.category_polls, name='CategoryPolls')




    path('categorys/', poll_views.categorys)
]