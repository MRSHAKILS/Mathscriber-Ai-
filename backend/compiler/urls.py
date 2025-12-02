from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProjectViewSet,
    FolderViewSet,
    LatexFileViewSet,
    CompilationResultViewSet
)

router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'folders', FolderViewSet, basename='folder')
router.register(r'files', LatexFileViewSet, basename='latexfile')
router.register(r'compilations', CompilationResultViewSet, basename='compilation')

urlpatterns = [
    path('', include(router.urls)),
]
