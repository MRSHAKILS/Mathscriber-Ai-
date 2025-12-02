from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'', views.VisualViewSet, basename='visual')

app_name = 'visuals'

urlpatterns = [
    # API endpoints
    path('api/options/', views.visual_options, name='visual_options'),
    path('api/generate/', views.generate_visual_simple, name='generate_simple'),
    path('api/status/<uuid:pk>/', views.check_visual_status, name='check_status'),
    path('api/', include(router.urls)),
    
    # Template views
    path('generator/', views.visual_generator_page, name='generator'),
    path('gallery/', views.visual_gallery_page, name='gallery'),
    path('<uuid:pk>/', views.visual_detail_page, name='detail'),
]
