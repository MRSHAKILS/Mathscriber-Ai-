from django.contrib import admin
from .models import Project, Folder, LatexFile, CompilationResult, FileVersion


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['name', 'owner', 'is_public', 'created_at', 'updated_at']
    list_filter = ['is_public', 'created_at', 'owner']
    search_fields = ['name', 'description', 'owner__username']
    readonly_fields = ['id', 'created_at', 'updated_at']
    date_hierarchy = 'created_at'


@admin.register(Folder)
class FolderAdmin(admin.ModelAdmin):
    list_display = ['name', 'project', 'parent', 'created_at']
    list_filter = ['project', 'created_at']
    search_fields = ['name', 'project__name']
    readonly_fields = ['id', 'created_at', 'updated_at']
    raw_id_fields = ['project', 'parent']


@admin.register(LatexFile)
class LatexFileAdmin(admin.ModelAdmin):
    list_display = ['name', 'file_type', 'project', 'folder', 'is_main', 'updated_at']
    list_filter = ['file_type', 'is_main', 'created_at']
    search_fields = ['name', 'project__name', 'content']
    readonly_fields = ['id', 'created_at', 'updated_at']
    raw_id_fields = ['project', 'folder']


@admin.register(CompilationResult)
class CompilationResultAdmin(admin.ModelAdmin):
    list_display = ['file', 'project', 'status', 'compilation_time', 'compiled_at']
    list_filter = ['status', 'compiled_at']
    search_fields = ['file__name', 'project__name', 'error_log']
    readonly_fields = ['id', 'compiled_at']
    raw_id_fields = ['project', 'file']


@admin.register(FileVersion)
class FileVersionAdmin(admin.ModelAdmin):
    list_display = ['file', 'created_by', 'message', 'created_at']
    list_filter = ['created_at']
    search_fields = ['file__name', 'message', 'created_by__username']
    readonly_fields = ['id', 'created_at']
    raw_id_fields = ['file', 'created_by']

