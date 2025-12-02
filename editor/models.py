# editor/models.py
from django.conf import settings
from django.db import models
from django.utils import timezone
from pathlib import Path

class Project(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='projects')
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name

class Collaborator(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='collaborators')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    role = models.CharField(max_length=50, choices=[('owner', 'Owner'), ('editor', 'Editor'), ('viewer', 'Viewer')])

    class Meta:
        unique_together = ('project', 'user')

class Folder(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='folders')
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='child_folders')
    name = models.CharField(max_length=200)

    class Meta:
        # Enforce unique folder names within the same parent folder
        unique_together = ('project', 'parent', 'name')

    def __str__(self):
        if self.parent:
            return f"{self.parent}/{self.name}"
        return f"/{self.name}"

class Document(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='documents')
    folder = models.ForeignKey(Folder, on_delete=models.CASCADE, null=True, blank=True, related_name='documents')
    name = models.CharField(max_length=200)
    content = models.TextField(default='')
    is_main = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        # Enforce unique document names within the same folder
        unique_together = ('project', 'folder', 'name')

    def __str__(self):
        return f'{self.project.name}/{self.name}'
    
    @property
    def path(self):
        # Helper to get the full path
        if self.folder:
            return f"{self.folder}/{self.name}"
        return self.name

class BinaryFile(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='binaries')
    folder = models.ForeignKey(Folder, on_delete=models.CASCADE, null=True, blank=True, related_name='binaries')
    file = models.FileField(upload_to='project_files/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    @property
    def name(self):
        return Path(self.file.name).name
    
    class Meta:
        # Enforce unique file names within the same folder
        unique_together = ('project', 'folder', 'file')

    def __str__(self):
        return self.name

class Version(models.Model):
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='versions')
    content = models.TextField()
    message = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)

    class Meta:
        ordering = ['-created_at']

class CompileRun(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='compiles')
    status = models.CharField(max_length=20, choices=[('queued','Queued'),('running','Running'),('success','Success'),('error','Error')], default='queued')
    log = models.TextField(blank=True)
    pdf = models.FileField(upload_to='project_pdfs/', blank=True, null=True)
    finished_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-created_at']