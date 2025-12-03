from rest_framework import serializers
from .models import Visual, VisualStyle


class VisualSerializer(serializers.ModelSerializer):
    """Serializer for Visual model"""
    
    class Meta:
        model = Visual
        fields = [
            'id', 'owner', 'content', 'context',
            'napkin_request_id', 'style_id', 'visual_query',
            'format', 'file_path', 'file_url',
            'status', 'error_message',
            'transparent_background', 'color_mode', 'orientation',
            'width', 'height',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'napkin_request_id', 'file_path', 'file_url', 'status', 'created_at', 'updated_at']


class VisualCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating visuals"""
    
    class Meta:
        model = Visual
        fields = [
            'content', 'context', 'style_id', 'visual_query',
            'format', 'transparent_background', 'color_mode',
            'orientation', 'width', 'height'
        ]


class VisualStyleSerializer(serializers.ModelSerializer):
    """Serializer for VisualStyle model"""
    
    class Meta:
        model = VisualStyle
        fields = ['id', 'style_id', 'name', 'description', 'category', 'is_active']
