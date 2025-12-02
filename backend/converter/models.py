from django.db import models
from django.contrib.auth.models import User


class ConversionHistory(models.Model):
    """Model to store conversion history"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='conversions')
    original_filename = models.CharField(max_length=255)
    image = models.ImageField(upload_to='conversions/%Y/%m/%d/', null=True, blank=True)
    latex_code = models.TextField()
    conversion_type = models.CharField(
        max_length=20,
        choices=[
            ('upload', 'Upload'),
            ('canvas', 'Canvas'),
            ('capture', 'Capture'),
        ],
        default='upload'
    )
    accuracy = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Conversion Histories'
    
    def __str__(self):
        return f"{self.user.username} - {self.original_filename} ({self.created_at.strftime('%Y-%m-%d %H:%M')})"
