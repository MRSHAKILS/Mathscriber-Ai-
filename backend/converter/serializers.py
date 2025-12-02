from rest_framework import serializers


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
