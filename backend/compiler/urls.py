from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProjectViewSet,
    FolderViewSet,
    LatexFileViewSet,
    CompilationResultViewSet,
    DirectCompileView
)

router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'folders', FolderViewSet, basename='folder')
router.register(r'files', LatexFileViewSet, basename='latexfile')
router.register(r'compilations', CompilationResultViewSet, basename='compilation')
router.register(r'compile', DirectCompileView, basename='direct-compile')

urlpatterns = [
    path('', include(router.urls)),
]
