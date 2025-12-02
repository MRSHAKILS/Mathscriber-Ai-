from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import ImageUploadSerializer, LaTeXResponseSerializer
from .converter import GeminiConverter


class ConvertImageView(APIView):
    """
    API endpoint to convert uploaded images to LaTeX code
    POST /api/convert-image/
    """
    
    def post(self, request):
        """Handle image upload and conversion"""
        # Validate incoming data
        serializer = ImageUploadSerializer(data=request.data)
        
        if not serializer.is_valid():
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
            
            # Convert image to LaTeX using Gemini
            converter = GeminiConverter()
            latex_code = converter.convert_image_to_latex(image_file)
            
            # Return LaTeX code
            response_data = {
                'success': True,
                'latex_code': latex_code,
                'message': 'Image converted successfully'
            }
            
            return Response(response_data, status=status.HTTP_200_OK)
            
        except ValueError as e:
            # API key not configured
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
            return Response(
                {
                    'success': False,
                    'message': f'Error converting image: {str(e)}',
                    'latex_code': ''
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class HealthCheckView(APIView):
    """Simple health check endpoint"""
    
    def get(self, request):
        """Return API status"""
        return Response({
            'status': 'ok',
            'message': 'Mathscriber AI API is running'
        })
