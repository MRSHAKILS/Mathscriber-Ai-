from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import ImageUploadSerializer, LaTeXResponseSerializer, ConversionHistorySerializer
from .converter import GeminiConverter
from .models import ConversionHistory


class ConvertImageView(APIView):
    """
    API endpoint to convert uploaded images to LaTeX code
    POST /api/convert-image/
    """
    permission_classes = [AllowAny]  # Allow both authenticated and unauthenticated requests
    authentication_classes = [JWTAuthentication]
    
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
            conversion_type = request.data.get('conversion_type', 'upload')
            
            # Get task type for specialized conversion (equation, table, diagram, auto)
            task_type = request.data.get('task', 'auto')
            
            # Convert image to LaTeX using Gemini with task-specific prompts
            converter = GeminiConverter()
            latex_code = converter.convert_image_to_latex(image_file, task_type=task_type)
            
            # Save to history if user is authenticated
            if request.user and request.user.is_authenticated:
                ConversionHistory.objects.create(
                    user=request.user,
                    original_filename=image_file.name,
                    image=image_file,
                    latex_code=latex_code,
                    conversion_type=conversion_type,
                    accuracy=0.95  # Default accuracy
                )
            
            # Return LaTeX code
            response_data = {
                'success': True,
                'latex_code': latex_code,
                'task_type': task_type,
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


class RegisterView(APIView):
    """
    User registration endpoint
    POST /api/register/
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        """Handle user registration"""
        try:
            name = request.data.get('name')
            email = request.data.get('email')
            password = request.data.get('password')
            
            # Validate required fields
            if not all([name, email, password]):
                return Response(
                    {
                        'success': False,
                        'message': 'Name, email, and password are required'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Check if user already exists
            if User.objects.filter(username=email).exists():
                return Response(
                    {
                        'success': False,
                        'message': 'User with this email already exists'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Create user
            user = User.objects.create_user(
                username=email,
                email=email,
                password=password,
                first_name=name
            )
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            return Response(
                {
                    'success': True,
                    'message': 'User registered successfully',
                    'user': {
                        'id': user.id,
                        'email': user.email,
                        'name': user.first_name,
                    },
                    'token': str(refresh.access_token),
                    'refresh': str(refresh),
                },
                status=status.HTTP_201_CREATED
            )
            
        except Exception as e:
            return Response(
                {
                    'success': False,
                    'message': f'Registration failed: {str(e)}'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class LoginView(APIView):
    """
    User login endpoint
    POST /api/login/
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        """Handle user login"""
        try:
            email = request.data.get('email')
            password = request.data.get('password')
            
            # Validate required fields
            if not all([email, password]):
                return Response(
                    {
                        'success': False,
                        'message': 'Email and password are required'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Authenticate user
            user = authenticate(username=email, password=password)
            
            if user is None:
                return Response(
                    {
                        'success': False,
                        'message': 'Invalid email or password'
                    },
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            return Response(
                {
                    'success': True,
                    'message': 'Login successful',
                    'user': {
                        'id': user.id,
                        'email': user.email,
                        'name': user.first_name,
                    },
                    'token': str(refresh.access_token),
                    'refresh': str(refresh),
                },
                status=status.HTTP_200_OK
            )
            
        except Exception as e:
            return Response(
                {
                    'success': False,
                    'message': f'Login failed: {str(e)}'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ConversionHistoryView(APIView):
    """
    API endpoint to retrieve user's conversion history
    GET /api/history/
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get user's conversion history"""
        try:
            # Get query parameters
            limit = int(request.query_params.get('limit', 20))
            offset = int(request.query_params.get('offset', 0))
            conversion_type = request.query_params.get('type', None)
            
            # Build query
            queryset = ConversionHistory.objects.filter(user=request.user)
            
            if conversion_type:
                queryset = queryset.filter(conversion_type=conversion_type)
            
            # Order by most recent first
            queryset = queryset.order_by('-created_at')
            
            # Get total count
            total_count = queryset.count()
            
            # Apply pagination
            history = queryset[offset:offset + limit]
            
            # Serialize data
            serializer = ConversionHistorySerializer(history, many=True, context={'request': request})
            
            return Response(
                {
                    'success': True,
                    'data': serializer.data,
                    'total': total_count,
                    'limit': limit,
                    'offset': offset
                },
                status=status.HTTP_200_OK
            )
            
        except Exception as e:
            return Response(
                {
                    'success': False,
                    'message': f'Error fetching history: {str(e)}'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
