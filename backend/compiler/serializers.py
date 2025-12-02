from rest_framework import serializers
from .models import Project, Folder, LatexFile, CompilationResult, FileVersion
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class FolderSerializer(serializers.ModelSerializer):
    path = serializers.SerializerMethodField()
    depth = serializers.SerializerMethodField()
    subfolders = serializers.SerializerMethodField()
    files_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Folder
        fields = [
            'id', 'project', 'parent', 'name', 'path', 'depth',
            'created_at', 'updated_at', 'subfolders', 'files_count'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_path(self, obj):
        return obj.get_path()
    
    def get_depth(self, obj):
        return obj.get_depth()
    
    def get_subfolders(self, obj):
        # Return immediate subfolders only
        subfolders = obj.subfolders.all()
        return FolderSerializer(subfolders, many=True, context=self.context).data
    
    def get_files_count(self, obj):
        return obj.files.count()


class LatexFileSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    path = serializers.SerializerMethodField()
    folder_name = serializers.SerializerMethodField()
    last_compiled = serializers.SerializerMethodField()
    
    class Meta:
        model = LatexFile
        fields = [
            'id', 'project', 'folder', 'name', 'file_type', 'content',
            'is_main', 'full_name', 'path', 'folder_name', 'last_compiled',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_full_name(self, obj):
        return obj.get_full_name()
    
    def get_path(self, obj):
        return obj.get_path()
    
    def get_folder_name(self, obj):
        return obj.folder.name if obj.folder else 'Root'
    
    def get_last_compiled(self, obj):
        last_compilation = obj.compilations.filter(status='success').first()
        if last_compilation:
            return last_compilation.compiled_at
        return None


class CompilationResultSerializer(serializers.ModelSerializer):
    file_name = serializers.SerializerMethodField()
    pdf_url = serializers.SerializerMethodField()
    
    class Meta:
        model = CompilationResult
        fields = [
            'id', 'project', 'file', 'file_name', 'status', 'pdf_file',
            'pdf_url', 'error_log', 'compiled_at', 'compilation_time'
        ]
        read_only_fields = ['id', 'compiled_at']
    
    def get_file_name(self, obj):
        return obj.file.get_full_name()
    
    def get_pdf_url(self, obj):
        if obj.pdf_file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.pdf_file.url)
        return None


class FileVersionSerializer(serializers.ModelSerializer):
    created_by_username = serializers.SerializerMethodField()
    
    class Meta:
        model = FileVersion
        fields = [
            'id', 'file', 'content', 'message', 'created_by',
            'created_by_username', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_created_by_username(self, obj):
        return obj.created_by.username if obj.created_by else 'Unknown'


class ProjectSerializer(serializers.ModelSerializer):
    owner_username = serializers.SerializerMethodField()
    folders = FolderSerializer(many=True, read_only=True)
    root_files = serializers.SerializerMethodField()
    files_count = serializers.SerializerMethodField()
    folders_count = serializers.SerializerMethodField()
    last_compilation = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = [
            'id', 'name', 'description', 'owner', 'owner_username',
            'is_public', 'created_at', 'updated_at', 'folders',
            'root_files', 'files_count', 'folders_count', 'last_compilation'
        ]
        read_only_fields = ['id', 'owner', 'created_at', 'updated_at']
    
    def get_owner_username(self, obj):
        return obj.owner.username
    
    def get_root_files(self, obj):
        # Get files without a folder (root level)
        root_files = obj.files.filter(folder__isnull=True)
        return LatexFileSerializer(root_files, many=True, context=self.context).data
    
    def get_files_count(self, obj):
        return obj.files.count()
    
    def get_folders_count(self, obj):
        return obj.folders.count()
    
    def get_last_compilation(self, obj):
        last_compilation = obj.compilations.filter(status='success').first()
        if last_compilation:
            return CompilationResultSerializer(last_compilation, context=self.context).data
        return None


class ProjectListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for project lists"""
    owner_username = serializers.SerializerMethodField()
    files_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = [
            'id', 'name', 'description', 'owner_username',
            'is_public', 'files_count', 'created_at', 'updated_at'
        ]
    
    def get_owner_username(self, obj):
        return obj.owner.username
    
    def get_files_count(self, obj):
        return obj.files.count()
