from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.models import AnonymousUser


class JWTAuthenticationMiddleware:
    """
    Middleware to authenticate users via JWT tokens for Django views
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Try to authenticate via JWT
        jwt_auth = JWTAuthentication()
        
        try:
            # Check for Authorization header
            auth_header = request.META.get('HTTP_AUTHORIZATION', '')
            if auth_header.startswith('Bearer '):
                # Authenticate the token
                validated_token = jwt_auth.get_validated_token(auth_header.split(' ')[1])
                user = jwt_auth.get_user(validated_token)
                request.user = user
            elif not hasattr(request, 'user') or request.user.is_anonymous:
                request.user = AnonymousUser()
        except Exception:
            if not hasattr(request, 'user'):
                request.user = AnonymousUser()

        response = self.get_response(request)
        return response
