from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_poll, name='CreatePoll'),
    path('read/', views.read_poll, name='ReadPoll'),
    path('update/', views.update_poll, name='UpdatePoll'),
    path('delete/', views.delete_poll, name='DeletePoll')
]
