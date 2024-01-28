from django.urls import path

from .views.health_check_view import HealthCheckAPIView


urlpatterns = [
    path(
        route="health-check/",
        view=HealthCheckAPIView.as_view(),
        name="health_check",
    ),
]
