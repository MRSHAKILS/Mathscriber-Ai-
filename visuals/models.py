from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
import uuid


class Visual(models.Model):
    """Model to store generated visuals from Napkin AI"""
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    FORMAT_CHOICES = [
        ('svg', 'SVG'),
        ('png', 'PNG'),
        ('ppt', 'PowerPoint'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='visuals',
        null=True,
        blank=True
    )
    
    # Content and context
    content = models.TextField(help_text="Main text content to visualize")
    context = models.TextField(blank=True, null=True, help_text="Additional context for generation")
    
    # Napkin API related fields
    napkin_request_id = models.CharField(max_length=100, unique=True, null=True, blank=True)
    style_id = models.CharField(max_length=100, blank=True, null=True)
    visual_query = models.CharField(max_length=100, blank=True, null=True, help_text="E.g., mindmap, flowchart, timeline")
    language = models.CharField(max_length=10, default='en', help_text="Language code (e.g., en, es, fr)")
    
    # File information
    format = models.CharField(max_length=10, choices=FORMAT_CHOICES, default='png')
    file_path = models.CharField(max_length=500, blank=True, null=True)
    file_url = models.URLField(blank=True, null=True)
    
    # Status and metadata
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    error_message = models.TextField(blank=True, null=True)
    
    # Additional options
    transparent_background = models.BooleanField(default=False)
    color_mode = models.CharField(max_length=10, default='light', choices=[
        ('light', 'Light'),
        ('dark', 'Dark'),
        ('both', 'Both'),
    ])
    orientation = models.CharField(max_length=20, default='auto', choices=[
        ('auto', 'Auto'),
        ('horizontal', 'Horizontal'),
        ('vertical', 'Vertical'),
        ('square', 'Square'),
    ])
    width = models.IntegerField(null=True, blank=True, help_text="Width in pixels (PNG only)")
    height = models.IntegerField(null=True, blank=True, help_text="Height in pixels (PNG only)")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Visual'
        verbose_name_plural = 'Visuals'
    
    def __str__(self):
        return f"Visual {self.id} - {self.status}"


class VisualStyle(models.Model):
    """Model to cache available Napkin AI styles"""
    
    CATEGORY_CHOICES = [
        ('colorful', 'Colorful'),
        ('casual', 'Casual'),
        ('hand-drawn', 'Hand-drawn'),
        ('formal', 'Formal'),
        ('monochrome', 'Monochrome'),
        ('custom', 'Custom'),
    ]
    
    style_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['category', 'name']
        verbose_name = 'Visual Style'
        verbose_name_plural = 'Visual Styles'
    
    def __str__(self):
        return f"{self.name} ({self.category})"
