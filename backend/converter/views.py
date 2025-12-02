from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.files.base import ContentFile
from .serializers import ImageUploadSerializer, LaTeXResponseSerializer, ConversionHistorySerializer
from .converter import GeminiConverter
from .models import ConversionHistory


class ConvertImageView(APIView):
    """
    API endpoint to convert uploaded images to LaTeX code
    POST /api/convert-image/
    """
    
    def post(self, request):
        """Handle image upload and conversion"""
        print("=" * 60)
        print("CONVERT IMAGE REQUEST RECEIVED")
        print(f"Files in request: {request.FILES}")
        print(f"Data in request: {request.data}")
        print("=" * 60)
        
        # Validate incoming data
        serializer = ImageUploadSerializer(data=request.data)
        
        if not serializer.is_valid():
            print(f"Validation failed: {serializer.errors}")
            return Response(
                {
                    'success': False,
                    'message': 'Invalid image data',
                    'errors': serializer.errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Get the uploaded image
            image_file = serializer.validated_data['image']
            print(f"Processing image: {image_file.name}, size: {image_file.size} bytes")
            
            # Convert image to LaTeX using Gemini
            converter = GeminiConverter()
            print("Calling Gemini API...")
            latex_code = converter.convert_image_to_latex(image_file)
            print(f"LaTeX code generated ({len(latex_code)} characters)")
            print(f"First 200 chars: {latex_code[:200]}")
            
            # Save to database
            conversion = ConversionHistory.objects.create(
                image=image_file,
                latex_code=latex_code
            )
            print(f"Saved to database with ID: {conversion.id}")
            
            # Return LaTeX code with conversion ID
            response_data = {
                'success': True,
                'id': conversion.id,
                'latex_code': latex_code,
                'image_url': self.request.build_absolute_uri(conversion.image.url),
                'message': 'Image converted successfully'
            }
            
            return Response(response_data, status=status.HTTP_200_OK)
            
        except ValueError as e:
            # API key not configured
            print(f"ValueError: {e}")
            return Response(
                {
                    'success': False,
                    'message': str(e),
                    'latex_code': ''
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
        except Exception as e:
            # Other errors
            print(f"Exception: {type(e).__name__}: {e}")
            import traceback
            traceback.print_exc()
            return Response(
                {
                    'success': False,
                    'message': f'Error converting image: {str(e)}',
                    'latex_code': ''
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ConversionHistoryListView(APIView):
    """
    API endpoint to retrieve all conversion history
    GET /api/history/
    """
    
    def get(self, request):
        """Retrieve all conversion history"""
        conversions = ConversionHistory.objects.all()[:50]  # Limit to last 50
        serializer = ConversionHistorySerializer(
            conversions, 
            many=True, 
            context={'request': request}
        )
        return Response({
            'success': True,
            'count': conversions.count(),
            'results': serializer.data
        })


class ConversionHistoryDetailView(APIView):
    """
    API endpoint to retrieve single conversion result
    GET /api/history/<id>/
    """
    
    def get(self, request, pk):
        """Retrieve single conversion by ID"""
        try:
            conversion = ConversionHistory.objects.get(pk=pk)
            serializer = ConversionHistorySerializer(
                conversion, 
                context={'request': request}
            )
            return Response({
                'success': True,
                'result': serializer.data
            })
        except ConversionHistory.DoesNotExist:
            return Response(
                {
                    'success': False,
                    'message': 'Conversion not found'
                },
                status=status.HTTP_404_NOT_FOUND
            )


class HealthCheckView(APIView):
    """Simple health check endpoint"""
    
    def get(self, request):
        """Return API status"""
        return Response({
            'status': 'ok',
            'message': 'Mathscriber AI API is running'
        })
