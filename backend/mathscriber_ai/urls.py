"""
URL configuration for mathscriber_ai project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView
from django.shortcuts import redirect

def login_redirect(request):
    """Redirect to editor login page"""
    next_url = request.GET.get('next', '/')
    return redirect(f'/editor/login/?next={next_url}')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('converter.urls')),
    path('api/', include('converter.api_urls')),  # New API endpoints
    path('editor/', include('editor.urls')),
    path('compiler/', RedirectView.as_view(url='/editor/projects/', permanent=False)),
    path('accounts/login/', login_redirect, name='login'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
