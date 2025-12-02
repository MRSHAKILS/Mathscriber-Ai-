from django.urls import path
from . import api_views

urlpatterns = [
    # Conversion endpoints
    path('convert/upload', api_views.convert_upload, name='api_convert_upload'),
    path('convert/capture', api_views.convert_capture, name='api_convert_capture'),
    path('convert/canvas', api_views.convert_canvas, name='api_convert_canvas'),
    path('convert/agentic', api_views.convert_agentic, name='api_convert_agentic'),  # New multi-agent endpoint
    
    # Download endpoints
    path('download/tex', api_views.download_tex, name='api_download_tex'),
    path('download/pdf', api_views.download_pdf_api, name='api_download_pdf'),
    
    # Editor integration
    path('editor/insert-at-cursor', api_views.insert_at_cursor, name='api_insert_at_cursor'),
    
    # History endpoints
    path('history', api_views.get_history, name='api_get_history'),
    path('history/<int:history_id>', api_views.delete_history, name='api_delete_history'),
]
