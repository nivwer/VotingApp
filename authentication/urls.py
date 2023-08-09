from django.urls import path
from . import views


urlpatterns = [
    path('singup/', views.singup, name="singup")
]
