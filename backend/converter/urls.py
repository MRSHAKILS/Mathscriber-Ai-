from django.urls import path
from .views import ConvertImageView, HealthCheckView

urlpatterns = [
    path('convert-image/', ConvertImageView.as_view(), name='convert-image'),
    path('health/', HealthCheckView.as_view(), name='health-check'),
]
