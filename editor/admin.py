from django.contrib import admin
from .models import Project, Document, CompileRun, Folder, BinaryFile

class DocumentInline(admin.StackedInline):
    model = Document
    extra = 1

class ProjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'created_at')
    inlines = [DocumentInline]

class CompileRunAdmin(admin.ModelAdmin):
    list_display = ('id', 'project', 'status', 'created_at', 'pdf')
    list_filter = ('status', 'project')
    readonly_fields = ('pdf', 'log')

class FolderAdmin(admin.ModelAdmin):
    list_display = ('name', 'project', 'parent')
    list_filter = ('project',)

class BinaryFileAdmin(admin.ModelAdmin):
    list_display = ('name', 'project', 'folder', 'uploaded_at')
    list_filter = ('project',)

# Register your models
admin.site.register(Project, ProjectAdmin)
admin.site.register(Document)
admin.site.register(CompileRun, CompileRunAdmin)
admin.site.register(Folder, FolderAdmin)
admin.site.register(BinaryFile, BinaryFileAdmin)