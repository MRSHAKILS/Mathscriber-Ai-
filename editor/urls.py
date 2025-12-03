# editor/urls.py
from django.urls import path
from . import views

app_name = 'editor'

urlpatterns = [
    path('projects/', views.project_list, name='project_list'),
    path('projects/new/', views.project_create_view, name='project_create'),
    path("projects/<int:pk>/delete/", views.project_delete, name="project_delete"),
    
    path('projects/<int:pk>/', views.project_detail, name='project_detail'),
    
    # Document/Editor URLs
    path('projects/<int:pk>/docs/<int:doc_id>/', views.document_editor, name='document_editor'),
    path('projects/<int:pk>/docs/new/', views.document_create, name='document_create'), # This is the old one, maybe remove?
    
    # Live Compile
    path("projects/<int:pk>/docs/<int:doc_id>/live_compile/", views.live_compile, name="live_compile"),
    
    # Old Compile (still used by pdf_frame)
    path('projects/<int:pk>/compile/', views.compile_project, name='compile_project'),
    path('projects/<int:pk>/compile/<int:run_id>/', views.compile_status, name='compile_status'),
    path('projects/<int:pk>/compile/<int:run_id>/pdf/', views.download_pdf, name='download_pdf'),
    path('projects/<int:pk>/pdf_frame/', views.pdf_frame, name='pdf_frame'),
    path('projects/<int:pk>/files/<int:file_id>/', views.download_binary, name='download_binary'),
    # --- NEW AJAX URLS ---
    path("projects/<int:pk>/ajax/create_folder/", views.folder_create_ajax, name="folder_create_ajax"),
    path("projects/<int:pk>/ajax/create_document/", views.document_create_ajax, name="document_create_ajax"),
    path("projects/<int:pk>/ajax/upload_binary/", views.binary_file_upload_ajax, name="binary_file_upload_ajax"),
    path("projects/<int:pk>/ajax/move_item/", views.move_item_ajax, name="move_item_ajax"),
]