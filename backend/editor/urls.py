from django.urls import path
from . import views
from .auth_views import editor_login

app_name = 'editor'

urlpatterns = [
    # Authentication
    path('login/', editor_login, name='editor_login'),
    
    # Project management
    path('projects/', views.project_list, name='project_list'),
    path('projects/new/', views.project_create, name='project_create'),
    path('projects/<int:pk>/delete/', views.project_delete, name='project_delete'),
    
    # Document editor
    path('projects/<int:pk>/docs/<int:doc_id>/', views.document_editor, name='document_editor'),
    path('projects/<int:pk>/docs/<int:doc_id>/live_compile/', views.live_compile, name='live_compile'),
    
    # File management AJAX
    path('projects/<int:pk>/ajax/create_folder/', views.folder_create_ajax, name='folder_create_ajax'),
    path('projects/<int:pk>/ajax/create_document/', views.document_create_ajax, name='document_create_ajax'),
    path('projects/<int:pk>/ajax/upload_binary/', views.binary_upload_ajax, name='binary_upload_ajax'),
    
    # File serving
    path('projects/<int:pk>/files/<int:file_id>/', views.download_binary, name='download_binary'),
    path('projects/<int:pk>/compile/<int:run_id>/pdf/', views.download_pdf, name='download_pdf'),
    path('projects/<int:pk>/pdf_frame/', views.pdf_frame, name='pdf_frame'),
]
