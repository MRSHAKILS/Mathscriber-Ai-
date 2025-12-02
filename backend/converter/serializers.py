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
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = ConversionHistory
        fields = ['id', 'image', 'image_url', 'latex_code', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_image_url(self, obj):
        """Get the full URL for the image"""
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
