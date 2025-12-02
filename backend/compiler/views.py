from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.http import FileResponse, HttpResponse
from django.core.files.base import ContentFile
from django.db.models import Q
from .models import Project, Folder, LatexFile, CompilationResult, FileVersion
from .serializers import (
    ProjectSerializer, ProjectListSerializer, FolderSerializer,
    LatexFileSerializer, CompilationResultSerializer, FileVersionSerializer
)
from .services.latex_compiler import LatexCompiler
from .services.pdf_generator import PDFGenerator
import time


class ProjectViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing LaTeX projects
    """
    permission_classes = [permissions.AllowAny]  # Allow unauthenticated access for development
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ProjectListSerializer
        return ProjectSerializer
    
    def get_queryset(self):
        # For development: return all projects
        return Project.objects.all()
    
    def perform_create(self, serializer):
        # Save with owner if authenticated, otherwise allow null
        if self.request.user.is_authenticated:
            serializer.save(owner=self.request.user)
        else:
            serializer.save(owner=None)
    
    @action(detail=True, methods=['get'])
    def tree(self, request, pk=None):
        """Get complete project file tree structure"""
        project = self.get_object()
        
        # Build tree structure
        tree = {
            'project': ProjectSerializer(project, context={'request': request}).data,
            'folders': self._build_folder_tree(project),
            'root_files': LatexFileSerializer(
                project.files.filter(folder__isnull=True),
                many=True,
                context={'request': request}
            ).data
        }
        
        return Response(tree)
    
    def _build_folder_tree(self, project):
        """Recursively build folder tree"""
        root_folders = project.folders.filter(parent__isnull=True)
        return self._serialize_folders_recursive(root_folders)
    
    def _serialize_folders_recursive(self, folders):
        """Serialize folders with their children"""
        result = []
        for folder in folders:
            folder_data = FolderSerializer(folder, context={'request': self.request}).data
            folder_data['files'] = LatexFileSerializer(
                folder.files.all(),
                many=True,
                context={'request': self.request}
            ).data
            folder_data['subfolders'] = self._serialize_folders_recursive(folder.subfolders.all())
            result.append(folder_data)
        return result
    
    @action(detail=True, methods=['post'])
    def clone(self, request, pk=None):
        """Clone a project"""
        source_project = self.get_object()
        
        # Create new project
        new_project = Project.objects.create(
            name=f"{source_project.name} (Copy)",
            description=source_project.description,
            owner=request.user,
            is_public=False
        )
        
        # Clone folders
        folder_mapping = {}
        for folder in source_project.folders.all().order_by('parent'):
            new_folder = Folder.objects.create(
                project=new_project,
                parent=folder_mapping.get(folder.parent.id) if folder.parent else None,
                name=folder.name
            )
            folder_mapping[folder.id] = new_folder
        
        # Clone files
        for file in source_project.files.all():
            LatexFile.objects.create(
                project=new_project,
                folder=folder_mapping.get(file.folder.id) if file.folder else None,
                name=file.name,
                file_type=file.file_type,
                content=file.content,
                is_main=file.is_main
            )
        
        return Response(
            ProjectSerializer(new_project, context={'request': request}).data,
            status=status.HTTP_201_CREATED
        )


class FolderViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing folders
    """
    serializer_class = FolderSerializer
    permission_classes = [permissions.AllowAny]  # Allow unauthenticated access for development
    
    def get_queryset(self):
        project_id = self.request.query_params.get('project')
        queryset = Folder.objects.all()
        
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        
        # For development: return all folders
        return queryset
    
    @action(detail=True, methods=['post'])
    def move(self, request, pk=None):
        """Move folder to a new parent"""
        folder = self.get_object()
        new_parent_id = request.data.get('parent_id')
        
        if new_parent_id:
            new_parent = get_object_or_404(Folder, id=new_parent_id, project=folder.project)
            
            # Check for circular reference
            current = new_parent
            while current:
                if current.id == folder.id:
                    return Response(
                        {'error': 'Cannot move folder into itself or its descendants'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                current = current.parent
            
            folder.parent = new_parent
        else:
            folder.parent = None
        
        folder.save()
        return Response(FolderSerializer(folder, context={'request': request}).data)


class LatexFileViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing LaTeX files
    """
    serializer_class = LatexFileSerializer
    permission_classes = [permissions.AllowAny]  # Allow unauthenticated access for development
    
    def get_queryset(self):
        project_id = self.request.query_params.get('project')
        folder_id = self.request.query_params.get('folder')
        queryset = LatexFile.objects.all()
        
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        
        if folder_id:
            queryset = queryset.filter(folder_id=folder_id)
        
        # For development: return all files
        return queryset
    
    def perform_update(self, serializer):
        """Save version when updating file"""
        file_instance = self.get_object()
        old_content = file_instance.content
        
        # Save the file
        updated_file = serializer.save()
        
        # Create version if content changed
        if old_content != updated_file.content:
            FileVersion.objects.create(
                file=updated_file,
                content=old_content,
                message=self.request.data.get('version_message', 'Auto-saved version'),
                created_by=self.request.user if self.request.user.is_authenticated else None
            )
    
    @action(detail=True, methods=['post'])
    def compile(self, request, pk=None):
        """Compile LaTeX file to PDF"""
        latex_file = self.get_object()
        
        # Validate LaTeX
        is_valid, errors = LatexCompiler.validate_latex(latex_file.content)
        if not is_valid:
            return Response(
                {
                    'status': 'validation_error',
                    'errors': errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create compilation result
        compilation = CompilationResult.objects.create(
            project=latex_file.project,
            file=latex_file,
            status='compiling'
        )
        
        try:
            # Compile LaTeX
            compiler = LatexCompiler()
            success, pdf_bytes, error_log, compile_time = compiler.compile(
                latex_file.content,
                latex_file.name
            )
            
            if success and pdf_bytes:
                # Save PDF
                pdf_filename = f"{latex_file.name}_{int(time.time())}.pdf"
                compilation.pdf_file.save(pdf_filename, ContentFile(pdf_bytes))
                compilation.status = 'success'
                compilation.error_log = error_log
                compilation.compilation_time = compile_time
            else:
                compilation.status = 'error'
                compilation.error_log = error_log or "Unknown compilation error"
                compilation.compilation_time = compile_time
            
            compilation.save()
            
            return Response(
                CompilationResultSerializer(compilation, context={'request': request}).data
            )
        
        except Exception as e:
            compilation.status = 'error'
            compilation.error_log = str(e)
            compilation.save()
            
            return Response(
                CompilationResultSerializer(compilation, context={'request': request}).data,
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['post'])
    def move(self, request, pk=None):
        """Move file to a new folder"""
        file = self.get_object()
        folder_id = request.data.get('folder_id')
        
        if folder_id:
            folder = get_object_or_404(Folder, id=folder_id, project=file.project)
            file.folder = folder
        else:
            file.folder = None
        
        file.save()
        return Response(LatexFileSerializer(file, context={'request': request}).data)
    
    @action(detail=True, methods=['get'])
    def versions(self, request, pk=None):
        """Get file version history"""
        file = self.get_object()
        versions = file.versions.all()
        serializer = FileVersionSerializer(versions, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def restore_version(self, request, pk=None):
        """Restore file to a previous version"""
        file = self.get_object()
        version_id = request.data.get('version_id')
        
        version = get_object_or_404(FileVersion, id=version_id, file=file)
        
        # Save current content as version before restoring
        FileVersion.objects.create(
            file=file,
            content=file.content,
            message="Before restore",
            created_by=request.user if request.user.is_authenticated else None
        )
        
        # Restore content
        file.content = version.content
        file.save()
        
        return Response(LatexFileSerializer(file, context={'request': request}).data)
    
    @action(detail=False, methods=['post'])
    def create_from_template(self, request):
        """Create a new file from template"""
        project_id = request.data.get('project')
        folder_id = request.data.get('folder')
        name = request.data.get('name', 'document')
        file_type = request.data.get('file_type', 'tex')
        
        project = get_object_or_404(Project, id=project_id)
        folder = None
        if folder_id:
            folder = get_object_or_404(Folder, id=folder_id, project=project)
        
        # Get template content
        if file_type == 'tex':
            content = LatexCompiler.get_default_template()
        else:
            content = ""
        
        file = LatexFile.objects.create(
            project=project,
            folder=folder,
            name=name,
            file_type=file_type,
            content=content
        )
        
        return Response(
            LatexFileSerializer(file, context={'request': request}).data,
            status=status.HTTP_201_CREATED
        )


class CompilationResultViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing compilation results
    """
    serializer_class = CompilationResultSerializer
    permission_classes = [permissions.AllowAny]  # Allow unauthenticated access for development
    
    def get_queryset(self):
        project_id = self.request.query_params.get('project')
        queryset = CompilationResult.objects.all()
        
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        
        # For development: return all compilation results
        return queryset
    
    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        """Download compiled PDF"""
        compilation = self.get_object()
        
        if not compilation.pdf_file:
            return Response(
                {'error': 'PDF file not available'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        response = FileResponse(
            compilation.pdf_file.open('rb'),
            content_type='application/pdf'
        )
        response['Content-Disposition'] = f'attachment; filename="{compilation.file.name}.pdf"'
        return response
