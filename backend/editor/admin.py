from django.contrib import admin
from .models import Project, Document, Folder, BinaryFile, CompileRun, Collaborator, Version

admin.site.register(Project)
admin.site.register(Document)
admin.site.register(Folder)
admin.site.register(BinaryFile)
admin.site.register(CompileRun)
admin.site.register(Collaborator)
admin.site.register(Version)
