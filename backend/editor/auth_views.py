from django.shortcuts import render, redirect
from django.contrib.auth import login
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth.models import User
import json


@csrf_exempt
@require_http_methods(["GET", "POST"])
def editor_login(request):
    """
    Login page for editor - creates Django session from JWT token
    """
    if request.method == 'POST':
        try:
            # Get token from POST data
            data = json.loads(request.body) if request.body else {}
            token = data.get('token') or request.POST.get('token')
            
            if token:
                # Validate JWT token
                access_token = AccessToken(token)
                user_id = access_token['user_id']
                
                # Get user
                user = User.objects.get(id=user_id)
                
                # Create Django session
                login(request, user, backend='django.contrib.auth.backends.ModelBackend')
                
                # Redirect to next or projects
                next_url = request.GET.get('next', '/editor/projects/')
                return redirect(next_url)
        except Exception as e:
            return render(request, 'editor/login.html', {
                'error': 'Invalid token. Please login again.',
                'next': request.GET.get('next', '/editor/projects/')
            })
    
    # GET request - show login page
    return render(request, 'editor/login.html', {
        'next': request.GET.get('next', '/editor/projects/')
    })
