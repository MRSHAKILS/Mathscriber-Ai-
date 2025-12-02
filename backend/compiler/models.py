from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import uuid
import os


class Project(models.Model):
    """LaTeX Project container"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='latex_projects')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_public = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-updated_at']
        verbose_name = 'LaTeX Project'
        verbose_name_plural = 'LaTeX Projects'
    
    def __str__(self):
        return f"{self.name} - {self.owner.username}"


class Folder(models.Model):
    """Hierarchical folder structure for organizing LaTeX files"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='folders')
    parent = models.ForeignKey(
        'self', 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True, 
        related_name='subfolders'
    )
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name']
        unique_together = ['project', 'parent', 'name']
        verbose_name = 'Folder'
        verbose_name_plural = 'Folders'
    
    def __str__(self):
        return f"{self.project.name}/{self.get_path()}"
    
    def get_path(self):
        """Get full path of folder"""
        if self.parent:
            return f"{self.parent.get_path()}/{self.name}"
        return self.name
    
    def get_depth(self):
        """Calculate folder depth"""
        depth = 0
        current = self
        while current.parent:
            depth += 1
            current = current.parent
        return depth


class LatexFile(models.Model):
    """LaTeX document file"""
    FILE_TYPES = [
        ('tex', 'LaTeX Document'),
        ('bib', 'Bibliography'),
        ('cls', 'Class File'),
        ('sty', 'Style File'),
        ('txt', 'Text File'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='files')
    folder = models.ForeignKey(
        Folder, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True, 
        related_name='files'
    )
    name = models.CharField(max_length=255)
    file_type = models.CharField(max_length=10, choices=FILE_TYPES, default='tex')
    content = models.TextField(default='', blank=True)
    is_main = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name']
        unique_together = ['project', 'folder', 'name']
        verbose_name = 'LaTeX File'
        verbose_name_plural = 'LaTeX Files'
    
    def __str__(self):
        return f"{self.name}.{self.file_type}"
    
    def get_full_name(self):
        """Return file name with extension"""
        return f"{self.name}.{self.file_type}"
    
    def get_path(self):
        """Get full path of file"""
        if self.folder:
            return f"{self.folder.get_path()}/{self.get_full_name()}"
        return self.get_full_name()
    
    def save(self, *args, **kwargs):
        # If this is set as main file, unset others
        if self.is_main:
            LatexFile.objects.filter(project=self.project, is_main=True).update(is_main=False)
        super().save(*args, **kwargs)


class CompilationResult(models.Model):
    """Store compilation results and generated PDFs"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('compiling', 'Compiling'),
        ('success', 'Success'),
        ('error', 'Error'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='compilations')
    file = models.ForeignKey(LatexFile, on_delete=models.CASCADE, related_name='compilations')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    pdf_file = models.FileField(upload_to='compiled_pdfs/', null=True, blank=True)
    error_log = models.TextField(blank=True, null=True)
    compiled_at = models.DateTimeField(auto_now_add=True)
    compilation_time = models.FloatField(null=True, blank=True)  # in seconds
    
    class Meta:
        ordering = ['-compiled_at']
        verbose_name = 'Compilation Result'
        verbose_name_plural = 'Compilation Results'
    
    def __str__(self):
        return f"{self.file.name} - {self.status} - {self.compiled_at}"
    
    def get_pdf_url(self):
        """Get PDF download URL"""
        if self.pdf_file:
            return self.pdf_file.url
        return None


class FileVersion(models.Model):
    """Track file version history"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    file = models.ForeignKey(LatexFile, on_delete=models.CASCADE, related_name='versions')
    content = models.TextField()
    message = models.CharField(max_length=255, blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'File Version'
        verbose_name_plural = 'File Versions'
    
    def __str__(self):
        return f"{self.file.name} - v{self.created_at}"
