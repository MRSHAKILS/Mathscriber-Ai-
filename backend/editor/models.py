from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class Project(models.Model):
    """LaTeX project containing multiple documents and files"""
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projects')
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name


class Folder(models.Model):
    """Hierarchical folder structure within a project"""
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='folders')
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='subfolders')
    name = models.CharField(max_length=200)
    
    class Meta:
        unique_together = ['project', 'parent', 'name']
        ordering = ['name']
    
    def __str__(self):
        if self.parent:
            return f"{self.parent}/{self.name}"
        return self.name
    
    @property
    def path(self):
        """Return full path of folder"""
        if self.parent:
            return f"{self.parent.path}/{self.name}"
        return self.name


class Document(models.Model):
    """LaTeX document (.tex file)"""
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='documents')
    folder = models.ForeignKey(Folder, null=True, blank=True, on_delete=models.CASCADE, related_name='documents')
    name = models.CharField(max_length=200)
    content = models.TextField(default='')
    is_main = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['project', 'folder', 'name']
        ordering = ['name']
    
    def __str__(self):
        return f"{self.project.name}/{self.path}"
    
    @property
    def path(self):
        """Return full path including folder structure"""
        if self.folder:
            return f"{self.folder.path}/{self.name}"
        return self.name


class BinaryFile(models.Model):
    """Binary files (images, PDFs, etc.) for use in LaTeX documents"""
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='binary_files')
    folder = models.ForeignKey(Folder, null=True, blank=True, on_delete=models.CASCADE, related_name='binary_files')
    file = models.FileField(upload_to='project_files/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['file']
    
    def __str__(self):
        return self.file.name
    
    @property
    def filename(self):
        """Get just the filename without path"""
        import os
        return os.path.basename(self.file.name)
    
    @property
    def path(self):
        """Return full path including folder structure"""
        if self.folder:
            return f"{self.folder.path}/{self.filename}"
        return self.filename


class CompileRun(models.Model):
    """Record of a compilation attempt"""
    STATUS_CHOICES = [
        ('queued', 'Queued'),
        ('running', 'Running'),
        ('success', 'Success'),
        ('error', 'Error'),
    ]
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='compile_runs')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='queued')
    log = models.TextField(blank=True)
    pdf = models.FileField(upload_to='project_pdfs/', blank=True, null=True)
    finished_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.project.name} - {self.status} - {self.created_at}"


class Collaborator(models.Model):
    """Project collaborators with role-based permissions"""
    ROLE_CHOICES = [
        ('owner', 'Owner'),
        ('editor', 'Editor'),
        ('viewer', 'Viewer'),
    ]
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='collaborators')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='collaborations')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='viewer')
    
    class Meta:
        unique_together = ['project', 'user']
    
    def __str__(self):
        return f"{self.user.username} - {self.project.name} - {self.role}"


class Version(models.Model):
    """Version history for documents"""
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='versions')
    content = models.TextField()
    message = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    author = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.document.name} - {self.created_at}"
