from django.db import models
from django.contrib.auth.models import User


class ConversionHistory(models.Model):
    """Model to store conversion history"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='conversions', null=True, blank=True)
    original_filename = models.CharField(max_length=255, blank=True)
    image = models.ImageField(upload_to='conversions/%Y/%m/%d/', null=True, blank=True)
    input_image = models.ImageField(upload_to='conversions/%Y/%m/%d/', null=True, blank=True)  # For API
    latex_code = models.TextField(blank=True)
    latex_output = models.TextField(blank=True)  # Alias for API consistency
    converted_output = models.TextField(blank=True)  # Rendered output
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
        user_str = self.user.username if self.user else 'Anonymous'
        return f"{user_str} - {self.original_filename or 'Conversion'} ({self.created_at.strftime('%Y-%m-%d %H:%M')})"
