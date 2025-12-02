from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse, FileResponse, HttpResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Visual, VisualStyle
from .serializers import VisualSerializer, VisualCreateSerializer, VisualStyleSerializer
from .services import NapkinAPIService, get_available_styles
import os
from django.conf import settings


class VisualViewSet(viewsets.ModelViewSet):
    """ViewSet for Visual CRUD operations"""
    
    queryset = Visual.objects.all()
    serializer_class = VisualSerializer
    
    def get_queryset(self):
        """Filter visuals by owner if authenticated"""
        queryset = Visual.objects.all()
        if self.request.user.is_authenticated:
            queryset = queryset.filter(owner=self.request.user)
        return queryset
    
    def perform_create(self, serializer):
        """Create visual and trigger generation"""
        visual = serializer.save(owner=self.request.user if self.request.user.is_authenticated else None)
        
        # Trigger async generation in background (for production, use Celery)
        try:
            service = NapkinAPIService()
            service.generate_visual(visual)
        except Exception as e:
            visual.status = 'failed'
            visual.error_message = str(e)
            visual.save()
    
    @action(detail=True, methods=['post'])
    def regenerate(self, request, pk=None):
        """Regenerate visual with new parameters"""
        visual = self.get_object()
        
        # Update parameters if provided
        style_id = request.data.get('style_id')
        visual_query = request.data.get('visual_query')
        
        if style_id:
            visual.style_id = style_id
        if visual_query:
            visual.visual_query = visual_query
        
        visual.status = 'pending'
        visual.save()
        
        try:
            service = NapkinAPIService()
            service.generate_visual(visual)
            return Response(VisualSerializer(visual).data)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['post'])
    def duplicate(self, request, pk=None):
        """Duplicate an existing visual"""
        visual = self.get_object()
        
        # Create duplicate
        new_visual = Visual.objects.create(
            owner=request.user if request.user.is_authenticated else None,
            content=visual.content,
            context=visual.context,
            style_id=visual.style_id,
            visual_query=visual.visual_query,
            format=visual.format,
            transparent_background=visual.transparent_background,
            color_mode=visual.color_mode,
            orientation=visual.orientation,
            width=visual.width,
            height=visual.height
        )
        
        # Generate
        try:
            service = NapkinAPIService()
            service.generate_visual(new_visual)
            return Response(VisualSerializer(new_visual).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def destroy(self, request, pk=None):
        """Delete a visual"""
        visual = self.get_object()
        
        # Delete file if exists
        if visual.file_path:
            file_path = os.path.join(settings.MEDIA_ROOT, visual.file_path)
            if os.path.exists(file_path):
                try:
                    os.remove(file_path)
                except Exception as e:
                    print(f"Error deleting file: {e}")
        
        visual.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([AllowAny])
def visual_options(request):
    """Get available visual styles and options"""
    styles = get_available_styles()
    
    return Response({
        'styles': styles,
        'formats': ['svg', 'png', 'ppt'],
        'color_modes': ['light', 'dark', 'both'],
        'orientations': ['auto', 'horizontal', 'vertical', 'square']
    })


@api_view(['GET'])
def get_recent_visuals(request):
    """Get recent visuals for the current user or session"""
    limit = int(request.GET.get('limit', 5))
    
    visuals = Visual.objects.all().order_by('-created_at')[:limit]
    
    if request.user.is_authenticated:
        visuals = Visual.objects.filter(owner=request.user).order_by('-created_at')[:limit]
    else:
        # For anonymous users, show recent visuals from last 24 hours
        from django.utils import timezone
        from datetime import timedelta
        cutoff_time = timezone.now() - timedelta(hours=24)
        visuals = Visual.objects.filter(created_at__gte=cutoff_time).order_by('-created_at')[:limit]
    
    return Response(VisualSerializer(visuals, many=True).data)


@api_view(['POST'])
def export_visuals_pdf(request):
    """Export multiple visuals to a single PDF"""
    from reportlab.lib.pagesizes import letter, A4
    from reportlab.pdfgen import canvas
    from reportlab.lib.utils import ImageReader
    from io import BytesIO
    import tempfile
    
    visual_ids = request.data.get('visual_ids', [])
    
    if not visual_ids:
        return Response(
            {'error': 'No visual IDs provided'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    visuals = Visual.objects.filter(id__in=visual_ids, status='completed')
    
    if not visuals:
        return Response(
            {'error': 'No completed visuals found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Create PDF
    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter
    
    for visual in visuals:
        if visual.file_path:
            try:
                img_path = os.path.join(settings.MEDIA_ROOT, visual.file_path)
                if os.path.exists(img_path):
                    img = ImageReader(img_path)
                    img_width, img_height = img.getSize()
                    
                    # Scale image to fit page with margin
                    margin = 50
                    max_width = width - (2 * margin)
                    max_height = height - (2 * margin) - 50  # Extra space for text
                    
                    scale = min(max_width / img_width, max_height / img_height)
                    scaled_width = img_width * scale
                    scaled_height = img_height * scale
                    
                    # Center image
                    x = (width - scaled_width) / 2
                    y = (height - scaled_height) / 2 + 25
                    
                    pdf.drawImage(img_path, x, y, scaled_width, scaled_height)
                    
                    # Add content text at bottom
                    pdf.setFont("Helvetica", 10)
                    text = visual.content[:100] + '...' if len(visual.content) > 100 else visual.content
                    pdf.drawString(margin, margin, text)
                    
                    pdf.showPage()
            except Exception as e:
                print(f"Error adding visual to PDF: {e}")
                continue
    
    pdf.save()
    buffer.seek(0)
    
    response = HttpResponse(buffer.read(), content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="visuals_export.pdf"'
    
    return response


@api_view(['POST'])
def generate_visual_simple(request):
    """Simple endpoint to generate visual - starts async generation"""
    serializer = VisualCreateSerializer(data=request.data)
    
    if serializer.is_valid():
        visual = serializer.save(
            owner=request.user if request.user.is_authenticated else None,
            status='pending'
        )
        
        try:
            # Create the request with Napkin API
            service = NapkinAPIService()
            response = service.create_visual_request(visual)
            
            # Save the request ID
            visual.napkin_request_id = response['id']
            visual.status = 'processing'
            visual.save()
            
            return Response(VisualSerializer(visual).data, status=status.HTTP_201_CREATED)
            
        except ValueError as e:
            # API key not configured
            return Response(
                {'error': str(e), 'details': 'Please configure NAPKIN_API_KEY in your environment variables.'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        except Exception as e:
            visual.status = 'failed'
            visual.error_message = str(e)
            visual.save()
            return Response(
                {'error': f'Failed to create visual request: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def check_visual_status(request, pk):
    """Check the status of a visual generation request"""
    try:
        visual = Visual.objects.get(pk=pk)
        
        if visual.status == 'completed' or visual.status == 'failed':
            return Response(VisualSerializer(visual).data)
        
        if not visual.napkin_request_id:
            return Response(
                {'error': 'No Napkin request ID found'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check status with Napkin API
        service = NapkinAPIService()
        status_response = service.get_request_status(visual.napkin_request_id)
        
        if status_response['status'] == 'completed':
            # Download the file
            generated_files = status_response.get('generated_files', [])
            if generated_files:
                file_info = generated_files[0]
                file_url = file_info.get('url')
                
                if file_url:
                    from django.conf import settings
                    filename = f"visual_{visual.id}.{visual.format}"
                    save_path = os.path.join(settings.MEDIA_ROOT, 'visuals', filename)
                    
                    service.download_visual_file(file_url, save_path)
                    
                    visual.file_path = f'visuals/{filename}'
                    visual.file_url = file_url
                    visual.status = 'completed'
                    visual.save()
        
        elif status_response['status'] == 'failed':
            visual.status = 'failed'
            visual.error_message = 'Napkin API processing failed'
            visual.save()
        
        return Response(VisualSerializer(visual).data)
        
    except Visual.DoesNotExist:
        return Response(
            {'error': 'Visual not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# Template views
def visual_generator_page(request):
    """Visual generator page"""
    return render(request, 'visuals/generator.html')


def visual_gallery_page(request):
    """Gallery of user's visuals"""
    # Show all visuals (completed, processing, pending, failed) for better history tracking
    visuals = Visual.objects.all().order_by('-created_at')
    
    if request.user.is_authenticated:
        visuals = visuals.filter(owner=request.user)
    else:
        # For anonymous users, show all recent visuals from last 24 hours
        from django.utils import timezone
        from datetime import timedelta
        cutoff_time = timezone.now() - timedelta(hours=24)
        visuals = visuals.filter(created_at__gte=cutoff_time)
    
    return render(request, 'visuals/gallery.html', {
        'visuals': visuals,
        'MEDIA_URL': settings.MEDIA_URL
    })


def visual_detail_page(request, pk):
    """Detail page for a specific visual"""
    visual = get_object_or_404(Visual, pk=pk)
    return render(request, 'visuals/detail.html', {
        'visual': visual,
        'MEDIA_URL': settings.MEDIA_URL
    })
