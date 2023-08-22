from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_poll, name='CreatePoll'),
    path('read/<str:poll_id>', views.read_poll, name='ReadPoll'),
    path('update/<str:poll_id>', views.update_poll, name='UpdatePoll'),
    path('delete/<str:poll_id>', views.delete_poll, name='DeletePoll')
]
