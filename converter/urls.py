from django.urls import path
from . import views

app_name = 'converter'

urlpatterns = [
    path('', views.dashboard_view, name='dashboard'),
    path('about/', views.about_view, name='about'),
    path('upload/', views.upload_view, name='upload'),
    path('stylus/', views.stylus_view, name='stylus'),
    path('Scanner/', views.camera_capture, name='scanner'),
    path('results/', views.results_view, name='results'),
    path('pricing/', views.pricing_view, name='pricing'),
    path('delete/<int:upload_id>/', views.delete_upload_view, name='delete_upload'),
    path('update-latex/<int:upload_id>/', views.update_latex_view, name='update_latex'),
    path('overleaf/snip/<int:upload_id>/', views.overleaf_snip_view, name='overleaf_snip'),
    path('overleaf/open/<int:upload_id>/', views.overleaf_open_view, name='overleaf_open'),
]
