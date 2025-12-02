from django.contrib import admin
from .models import Visual, VisualStyle


@admin.register(Visual)
class VisualAdmin(admin.ModelAdmin):
    list_display = ['id', 'owner', 'status', 'format', 'style_id', 'created_at']
    list_filter = ['status', 'format', 'color_mode', 'created_at']
    search_fields = ['content', 'napkin_request_id', 'owner__username']
    readonly_fields = ['id', 'napkin_request_id', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'owner', 'status', 'format')
        }),
        ('Content', {
            'fields': ('content', 'context')
        }),
        ('Napkin AI Configuration', {
            'fields': ('napkin_request_id', 'style_id', 'visual_query')
        }),
        ('File Information', {
            'fields': ('file_path', 'file_url')
        }),
        ('Display Options', {
            'fields': ('transparent_background', 'color_mode', 'orientation', 'width', 'height')
        }),
        ('Status', {
            'fields': ('error_message',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(VisualStyle)
class VisualStyleAdmin(admin.ModelAdmin):
    list_display = ['name', 'style_id', 'category', 'is_active']
    list_filter = ['category', 'is_active']
    search_fields = ['name', 'style_id', 'description']
