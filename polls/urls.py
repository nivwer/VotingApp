from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_poll, name='CreatePoll'),
    path('read/', views.read_poll, name='ReadPoll')
]
