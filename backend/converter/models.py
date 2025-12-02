from django.db import models
from django.utils import timezone


class ConversionHistory(models.Model):
    """Store conversion history with uploaded images and LaTeX results"""
    
    image = models.ImageField(upload_to='conversions/%Y/%m/%d/')
    latex_code = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Conversion History'
        verbose_name_plural = 'Conversion Histories'
    
    def __str__(self):
        return f"Conversion #{self.id} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"
