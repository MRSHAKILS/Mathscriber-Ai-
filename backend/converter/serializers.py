from rest_framework import serializers
from .models import ConversionHistory


class ImageUploadSerializer(serializers.Serializer):
    """Serializer for image upload"""
    image = serializers.ImageField(required=True)
    
    def validate_image(self, value):
        """Validate uploaded image"""
        # Check file size (max 10MB)
        if value.size > 10 * 1024 * 1024:
            raise serializers.ValidationError("Image file size must be under 10MB")
        
        # Check file type
        allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
        if value.content_type not in allowed_types:
            raise serializers.ValidationError("Only JPEG, PNG, GIF, and WebP images are allowed")
        
        return value


class LaTeXResponseSerializer(serializers.Serializer):
    """Serializer for LaTeX response"""
    latex_code = serializers.CharField()
    success = serializers.BooleanField(default=True)
    message = serializers.CharField(required=False)


class ConversionHistorySerializer(serializers.ModelSerializer):
    """Serializer for conversion history"""
    username = serializers.CharField(source='user.username', read_only=True, allow_null=True)
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = ConversionHistory
        fields = ['id', 'username', 'original_filename', 'image_url', 'latex_code', 
                  'conversion_type', 'task_type', 'detected_content', 'accuracy', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_image_url(self, obj):
        # Try both image fields for compatibility
        image_field = obj.image or obj.input_image
        if image_field:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(image_field.url)
        return None
