from django.urls import path
from .views import ConvertImageView, HealthCheckView, RegisterView, LoginView, ConversionHistoryView

urlpatterns = [
    path('convert-image/', ConvertImageView.as_view(), name='convert-image'),
    path('health/', HealthCheckView.as_view(), name='health-check'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('history/', ConversionHistoryView.as_view(), name='conversion-history'),
]
