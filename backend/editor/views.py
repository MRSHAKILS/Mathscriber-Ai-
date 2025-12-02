import json
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, FileResponse, Http404
from django.views.decorators.http import require_http_methods
from django.utils import timezone
from django.db import transaction

from .models import Project, Document, Folder, BinaryFile, CompileRun
from .forms import ProjectForm, DocumentForm, NewDocumentForm, NewFolderForm, UploadBinaryFileForm
from .services import compile_latex_pdf, user_can_edit, user_can_view, get_default_latex_template


def project_list(request):
    """List all projects owned by or shared with the user"""
    if request.user.is_authenticated:
        projects = Project.objects.filter(owner=request.user)
    else:
        # For anonymous users, show all projects or create a session-based filter
        session_key = request.session.session_key
        if not session_key:
            request.session.create()
            session_key = request.session.session_key
        projects = Project.objects.filter(owner__username=f'anon_{session_key}')
    return render(request, 'editor/project_list.html', {'projects': projects})


def project_create(request):
    """Create a new project"""
    if request.method == 'POST':
        form = ProjectForm(request.POST)
        if form.is_valid():
            project = form.save(commit=False)
            
            # Handle anonymous users
            if request.user.is_authenticated:
                project.owner = request.user
            else:
                # Create or get anonymous user for this session
                from django.contrib.auth.models import User
                session_key = request.session.session_key
                if not session_key:
                    request.session.create()
                    session_key = request.session.session_key
                username = f'anon_{session_key}'
                user, created = User.objects.get_or_create(
                    username=username,
                    defaults={'is_active': False}
                )
                project.owner = user
            
            project.save()
            
            # Get LaTeX code if provided (from converter)
            latex_code = request.POST.get('latex_code', '').strip()
            latex_filename = request.POST.get('latex_filename', 'main.tex').strip()
            
            if not latex_code:
                latex_code = get_default_latex_template()
            
            # Create main document
            doc = Document.objects.create(
                project=project,
                name=latex_filename if latex_filename.endswith('.tex') else 'main.tex',
                content=latex_code,
                is_main=True
            )
            
            return redirect('editor:document_editor', pk=project.pk, doc_id=doc.pk)
    else:
        # Check for LaTeX code in query params
        initial = {}
        if 'latex' in request.GET:
            initial['latex_code'] = request.GET.get('latex', '')
            initial['latex_filename'] = request.GET.get('filename', 'main.tex')
            initial['name'] = request.GET.get('name', 'New LaTeX Project')
        
        form = ProjectForm(initial=initial)
    
    return render(request, 'editor/project_form.html', {'form': form})


def project_delete(request, pk):
    """Delete a project"""
    project = get_object_or_404(Project, pk=pk)
    
    # Check ownership
    if request.user.is_authenticated:
        if project.owner != request.user:
            raise Http404("Project not found")
    else:
        session_key = request.session.session_key
        if not session_key:
            request.session.create()
            session_key = request.session.session_key
        if project.owner.username != f'anon_{session_key}':
            raise Http404("Project not found")
    
    if request.method == 'POST':
        project.delete()
        return redirect('editor:project_list')
    
    return render(request, 'editor/project_confirm_delete.html', {'project': project})


def document_editor(request, pk, doc_id):
    """Main editor interface for a document"""
    project = get_object_or_404(Project, pk=pk)
    
    # Check permissions (allow anonymous users)
    if request.user.is_authenticated:
        if not user_can_view(project, request.user):
            raise Http404("Project not found")
    else:
        # Allow anonymous users to view their own projects
        session_key = request.session.session_key
        if not session_key:
            request.session.create()
            session_key = request.session.session_key
        if project.owner.username != f'anon_{session_key}':
            raise Http404("Project not found")
    
    doc = get_object_or_404(Document, pk=doc_id, project=project)
    
    # Get file tree
    file_tree = build_file_tree(project)
    
    # Get latest successful compile run
    latest_run = project.compile_runs.filter(status='success').first()
    
    # Forms for modals
    form = DocumentForm(instance=doc)
    new_doc_form = NewDocumentForm()
    new_folder_form = NewFolderForm()
    upload_binary_form = UploadBinaryFileForm()
    
    # Determine if user can edit
    if request.user.is_authenticated:
        can_edit = user_can_edit(project, request.user)
    else:
        # Anonymous users can only edit their own projects
        session_key = request.session.session_key
        can_edit = (session_key and project.owner.username == f'anon_{session_key}')
    
    context = {
        'project': project,
        'doc': doc,
        'form': form,
        'file_tree': file_tree,
        'new_doc_form': new_doc_form,
        'new_folder_form': new_folder_form,
        'upload_binary_form': upload_binary_form,
        'latest_run': latest_run,
        'can_edit': can_edit,
    }
    
    return render(request, 'editor/document_editor.html', context)


@require_http_methods(["POST"])
def live_compile(request, pk, doc_id):
    """Handle live compilation via AJAX"""
    project = get_object_or_404(Project, pk=pk)
    
    # Check permissions (allow anonymous)
    if request.user.is_authenticated:
        if not user_can_edit(project, request.user):
            return JsonResponse({'error': 'Permission denied'}, status=403)
    else:
        session_key = request.session.session_key
        if not session_key:
            request.session.create()
            session_key = request.session.session_key
        if project.owner.username != f'anon_{session_key}':
            return JsonResponse({'error': 'Permission denied'}, status=403)
    
    doc = get_object_or_404(Document, pk=doc_id, project=project)
    
    try:
        data = json.loads(request.body)
        content = data.get('content', '')
        is_main = data.get('is_main', False)
        
        # Update document
        doc.content = content
        doc.save()
        
        # Update is_main flag
        if is_main and not doc.is_main:
            # Unset other main documents
            project.documents.exclude(pk=doc.pk).update(is_main=False)
            doc.is_main = True
            doc.save()
        
        # Create compile run
        run = CompileRun.objects.create(project=project)
        
        # Compile in background
        success = compile_latex_pdf(project, run)
        
        # Render PDF frame
        html = render_pdf_frame(request, project, run)
        
        return JsonResponse({'html': html})
        
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@require_http_methods(["POST"])
def folder_create_ajax(request, pk):
    """Create a new folder via AJAX"""
    project = get_object_or_404(Project, pk=pk)
    
    # Check permissions (allow anonymous)
    if request.user.is_authenticated:
        if not user_can_edit(project, request.user):
            return JsonResponse({'error': 'Permission denied'}, status=403)
    else:
        session_key = request.session.session_key
        if not session_key:
            request.session.create()
            session_key = request.session.session_key
        if project.owner.username != f'anon_{session_key}':
            return JsonResponse({'error': 'Permission denied'}, status=403)
    
    form = NewFolderForm(request.POST)
    if form.is_valid():
        name = form.cleaned_data['name']
        folder_id = form.cleaned_data.get('folder_id')
        
        parent = None
        if folder_id:
            parent = get_object_or_404(Folder, pk=folder_id, project=project)
        
        try:
            Folder.objects.create(
                project=project,
                parent=parent,
                name=name
            )
            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Invalid form data'}, status=400)


@require_http_methods(["POST"])
def document_create_ajax(request, pk):
    """Create a new document via AJAX"""
    project = get_object_or_404(Project, pk=pk)
    
    # Check permissions (allow anonymous)
    if request.user.is_authenticated:
        if not user_can_edit(project, request.user):
            return JsonResponse({'error': 'Permission denied'}, status=403)
    else:
        session_key = request.session.session_key
        if not session_key:
            request.session.create()
            session_key = request.session.session_key
        if project.owner.username != f'anon_{session_key}':
            return JsonResponse({'error': 'Permission denied'}, status=403)
    
    form = NewDocumentForm(request.POST)
    if form.is_valid():
        name = form.cleaned_data['name']
        folder_id = form.cleaned_data.get('folder_id')
        
        # Ensure .tex extension
        if not name.endswith('.tex'):
            name += '.tex'
        
        folder = None
        if folder_id:
            folder = get_object_or_404(Folder, pk=folder_id, project=project)
        
        try:
            doc = Document.objects.create(
                project=project,
                folder=folder,
                name=name,
                content='% New document\n'
            )
            return JsonResponse({
                'success': True,
                'url': f'/editor/projects/{project.pk}/docs/{doc.pk}/'
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Invalid form data'}, status=400)


@require_http_methods(["POST"])
def binary_upload_ajax(request, pk):
    """Upload binary files via AJAX"""
    project = get_object_or_404(Project, pk=pk)
    
    # Check permissions (allow anonymous)
    if request.user.is_authenticated:
        if not user_can_edit(project, request.user):
            return JsonResponse({'error': 'Permission denied'}, status=403)
    else:
        session_key = request.session.session_key
        if not session_key:
            request.session.create()
            session_key = request.session.session_key
        if project.owner.username != f'anon_{session_key}':
            return JsonResponse({'error': 'Permission denied'}, status=403)
    
    folder_id = request.POST.get('folder_id')
    folder = None
    if folder_id:
        folder = get_object_or_404(Folder, pk=folder_id, project=project)
    
    files = request.FILES.getlist('file')
    if not files:
        return JsonResponse({'error': 'No files uploaded'}, status=400)
    
    try:
        for file in files:
            BinaryFile.objects.create(
                project=project,
                folder=folder,
                file=file
            )
        return JsonResponse({'success': True})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)


def download_binary(request, pk, file_id):
    """Serve a binary file"""
    project = get_object_or_404(Project, pk=pk)
    
    # Check permissions (allow anonymous)
    if request.user.is_authenticated:
        if not user_can_view(project, request.user):
            raise Http404("File not found")
    else:
        session_key = request.session.session_key
        if not session_key:
            request.session.create()
            session_key = request.session.session_key
        if project.owner.username != f'anon_{session_key}':
            raise Http404("File not found")
    
    binary = get_object_or_404(BinaryFile, pk=file_id, project=project)
    
    return FileResponse(binary.file.open('rb'), as_attachment=False)


def download_pdf(request, pk, run_id):
    """Download compiled PDF"""
    project = get_object_or_404(Project, pk=pk)
    
    # Check permissions (allow anonymous)
    if request.user.is_authenticated:
        if not user_can_view(project, request.user):
            raise Http404("PDF not found")
    else:
        session_key = request.session.session_key
        if not session_key:
            request.session.create()
            session_key = request.session.session_key
        if project.owner.username != f'anon_{session_key}':
            raise Http404("PDF not found")
    
    run = get_object_or_404(CompileRun, pk=run_id, project=project)
    
    if not run.pdf:
        raise Http404("PDF not available")
    
    response = FileResponse(run.pdf.open('rb'), as_attachment=False, content_type='application/pdf')
    response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    return response


def pdf_frame(request, pk):
    """Render PDF frame for preview"""
    project = get_object_or_404(Project, pk=pk)
    
    # Check permissions (allow anonymous)
    if request.user.is_authenticated:
        if not user_can_view(project, request.user):
            raise Http404("Project not found")
    else:
        session_key = request.session.session_key
        if not session_key:
            request.session.create()
            session_key = request.session.session_key
        if project.owner.username != f'anon_{session_key}':
            raise Http404("Project not found")
    
    latest_run = project.compile_runs.filter(status='success').first()
    
    return render(request, 'editor/pdf_frame.html', {
        'project': project,
        'run': latest_run
    })


def build_file_tree(project):
    """Build hierarchical file tree structure"""
    tree = {
        'folders': [],
        'documents': [],
        'binaries': []
    }
    
    # Get root folders
    root_folders = project.folders.filter(parent=None).order_by('name')
    for folder in root_folders:
        tree['folders'].append(build_folder_tree(folder))
    
    # Get root documents
    root_docs = project.documents.filter(folder=None).order_by('name')
    tree['documents'] = list(root_docs)
    
    # Get root binaries
    root_binaries = project.binary_files.filter(folder=None).order_by('file')
    tree['binaries'] = list(root_binaries)
    
    return tree


def build_folder_tree(folder):
    """Recursively build folder tree"""
    return {
        'folder': folder,
        'folders': [build_folder_tree(f) for f in folder.subfolders.order_by('name')],
        'documents': list(folder.documents.order_by('name')),
        'binaries': list(folder.binary_files.order_by('file'))
    }


def render_pdf_frame(request, project, run):
    """Render PDF frame HTML"""
    from django.template.loader import render_to_string
    
    html = render_to_string('editor/pdf_frame.html', {
        'project': project,
        'run': run
    }, request=request)
    
    return html
