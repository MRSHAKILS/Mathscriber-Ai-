from django.urls import path
from .views import (
    ConvertImageView, 
    ConversionHistoryListView, 
    ConversionHistoryDetailView,
    HealthCheckView
)

urlpatterns = [
    path('convert-image/', ConvertImageView.as_view(), name='convert-image'),
    path('history/', ConversionHistoryListView.as_view(), name='history-list'),
    path('history/<int:pk>/', ConversionHistoryDetailView.as_view(), name='history-detail'),
    path('health/', HealthCheckView.as_view(), name='health-check'),
]
