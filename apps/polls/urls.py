from django.urls import path
from .views import poll_views, options_views

urlpatterns = [
    # CRUD Poll.
    path('create/', poll_views.create_poll, name='CreatePoll'),
    path('read/<str:poll_id>', poll_views.read_poll, name='ReadPoll'),
    path('update/<str:poll_id>', poll_views.update_poll, name='UpdatePoll'),
    path('delete/<str:poll_id>', poll_views.delete_poll, name='DeletePoll'),

    # GET Polls.
    path('user/<str:username>', poll_views.user_polls, name='UserPolls'),
    # path('category/<str:category>', views.category_polls, name='CategoryPolls')

    # Options.
    path('options/<str:poll_id>', options_views.get_options),
    path('option/<str:poll_id>', options_views.option_manager),
]
