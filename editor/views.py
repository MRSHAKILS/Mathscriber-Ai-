# editor/views.py
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseForbidden, FileResponse, JsonResponse, HttpResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse
from django.views.decorators.http import require_POST
from .models import Project, Document, Version, CompileRun, Collaborator, Folder, BinaryFile
from .forms import (
    ProjectForm, DocumentForm, NewDocumentForm, 
    NewFolderForm, UploadBinaryFileForm
)
from .services import compile_latex_pdf
from django.template.loader import render_to_string
from django.db import transaction, IntegrityError
import json
import mimetypes

def user_can_edit(project, user):
    return project.owner_id == user.id or Collaborator.objects.filter(project=project, user=user, role__in=['owner','editor']).exists()

@login_required
def project_list(request):
    projects = Project.objects.filter(owner=request.user) | Project.objects.filter(collaborators__user=request.user)
    projects = projects.distinct().order_by('-created_at')
    return render(request, 'editor/project_list.html', {'projects': projects})

@login_required
def project_create_view(request):
    if request.method == 'POST':
        # Check if we have LaTeX code from converter
        latex_from_post = request.POST.get('latex_code', '')
        filename_from_post = request.POST.get('latex_filename', 'main.tex')
        project_name_from_post = request.POST.get('name', '')
        
        # If submitting with LaTeX code, create project directly
        if latex_from_post and project_name_from_post:
            project = Project.objects.create(
                name=project_name_from_post,
                owner=request.user,
                description=f"Created from MathScriber converter"
            )
            
            # Create document with LaTeX code
            Document.objects.create(
                project=project,
                name=filename_from_post,
                content=latex_from_post,
                is_main=True
            )
            
            # Redirect to the first document in the project
            first_doc = project.documents.first()
            if first_doc:
                return redirect('editor:document_editor', pk=project.pk, doc_id=first_doc.pk)
            return redirect('editor:project_detail', pk=project.pk)
        
        # Otherwise use the form
        form = ProjectForm(request.POST)
        if form.is_valid():
            project = form.save(commit=False)
            project.owner = request.user
            project.save()
            
            if latex_from_post:
                # Use the LaTeX code from converter
                Document.objects.create(
                    project=project,
                    name=filename_from_post,
                    content=latex_from_post,
                    is_main=True
                )
            else:
                # Create a default main.tex with comprehensive package support
                default_content = r'''\documentclass{article}

% Math packages for equations
\usepackage{amsmath}
\usepackage{amssymb}
\usepackage{amsfonts}
\usepackage{mathtools}

% Table packages
\usepackage{array}
\usepackage{tabularx}
\usepackage{booktabs}
\usepackage{multirow}
\usepackage{longtable}

% Graphics and diagrams
\usepackage{graphicx}
\usepackage{tikz}
\usetikzlibrary{shapes,arrows,positioning,calc,patterns,decorations.pathmorphing,decorations.markings}

% Other useful packages
\usepackage[utf8]{inputenc}
\usepackage[T1]{fontenc}
\usepackage{xcolor}
\usepackage{hyperref}

\title{My Document}
\author{Your Name}
\date{\today}

\begin{document}

\maketitle

\section{Introduction}

Welcome to your LaTeX document! This template includes support for:
\begin{itemize}
    \item Advanced mathematical equations
    \item Complex tables
    \item TikZ diagrams
    \item And much more!
\end{itemize}

\section{Example Equation}

Einstein's famous equation:
\begin{equation}
    E = mc^2
\end{equation}

\section{Example Table}

\begin{table}[h]
\centering
\begin{tabular}{lcc}
\toprule
Item & Quantity & Price \\
\midrule
Apples & 5 & \$2.50 \\
Oranges & 3 & \$1.80 \\
\bottomrule
\end{tabular}
\caption{Sample table}
\end{table}

\end{document}
'''
                Document.objects.create(
                    project=project,
                    name='main.tex',
                    content=default_content,
                    is_main=True
                )
            return redirect('editor:project_detail', pk=project.pk)
    else:
        # GET request - check for URL parameters from converter
        latex_code = request.GET.get('latex', '')
        filename = request.GET.get('filename', 'main.tex')
        project_name = request.GET.get('name', '')
        
        # Pre-fill form with project name if provided
        initial_data = {}
        if project_name:
            initial_data['name'] = project_name
        form = ProjectForm(initial=initial_data)
    
        context = {
            'form': form,
            'latex_code': latex_code,
            'latex_filename': filename,
            'from_converter': bool(latex_code)
        }
        return render(request, 'editor/project_form.html', context)

@login_required
def project_delete(request, pk):
    project = get_object_or_404(Project, pk=pk)
    if project.owner != request.user:
        return HttpResponseForbidden()
    if request.method == "POST":
        project.delete()
        return redirect("editor:project_list")
    return redirect("editor:project_detail", pk=pk)


@login_required
def project_detail(request, pk):
    project = get_object_or_404(Project, pk=pk)
    # This view is now just a detail page, forms are in the editor
    documents = project.documents.all()
    form = DocumentForm() # Dummy form for the old template
    return render(request, 'editor/project_detail.html', {'project': project, 'documents': documents, 'form': form})

# --- HELPER FUNCTION FOR FILE TREE ---
def get_project_tree(project):
    tree = []
    
    # Get root items
    root_folders = project.folders.filter(parent__isnull=True).order_by('name')
    root_docs = project.documents.filter(folder__isnull=True).order_by('name')
    root_bins = project.binaries.filter(folder__isnull=True).order_by('file')

    def build_tree(folders, docs, bins):
        items = []
        for folder in folders:
            folder_item = {
                'type': 'folder',
                'item': folder,
                'children': build_tree(
                    folder.child_folders.all().order_by('name'),
                    folder.documents.all().order_by('name'),
                    folder.binaries.all().order_by('file')
                )
            }
            items.append(folder_item)
        
        for doc in docs:
            items.append({'type': 'document', 'item': doc})
            
        for bin_file in bins:
            items.append({'type': 'binary', 'item': bin_file})
            
        return items

    return build_tree(root_folders, root_docs, root_bins)

# ... other imports
from .models import Project, Document
from .forms import DocumentForm # Make sure DocumentForm is imported

# ...

@login_required
def document_editor(request, pk, doc_id):
    project = get_object_or_404(Project, pk=pk)
    doc = get_object_or_404(Document, pk=doc_id, project=project)

    # ... (check for POST request, etc.)

    # THIS IS THE CRITICAL PART
    # You must create an instance of DocumentForm
    # and pass it to the template.
    form = DocumentForm(instance=doc) 

    # You also need the other forms for the modals
    new_doc_form = NewDocumentForm()
    new_folder_form = NewFolderForm()
    upload_binary_form = UploadBinaryFileForm()
    
    # Get the file tree
    file_tree = get_project_tree(project)
    
    # Get the most recent successful compile run for the download PDF link
    latest_run = project.compiles.filter(status='success').order_by('-created_at').first()

    context = {
        'project': project,
        'doc': doc,
        'form': form,
        'file_tree': file_tree,
        'new_doc_form': new_doc_form,
        'new_folder_form': new_folder_form,
        'upload_binary_form': upload_binary_form,
        'latest_run': latest_run,
    }
    return render(request, 'editor/document_editor.html', context)

@login_required
@require_POST
@transaction.atomic
def live_compile(request, pk, doc_id):
    project = get_object_or_404(Project, pk=pk)
    doc = get_object_or_404(Document, pk=doc_id, project=project)

    if not user_can_edit(project, request.user):
        return HttpResponseForbidden()

    try:
        data = json.loads(request.body)
        content = data.get('content')
        is_main = data.get('is_main', False)

        if content is None:
            return JsonResponse({'error': 'No content provided.'}, status=400)

        doc.content = content
        doc.is_main = is_main
        if is_main:
            project.documents.exclude(pk=doc.pk).update(is_main=False)
        doc.save()

        run = CompileRun.objects.create(project=project, status='queued')
        
        try:
            compile_latex_pdf(project, run)
        except Exception as compile_error:
            run.status = 'error'
            run.log = f'Compilation error: {str(compile_error)}'
            run.save()

        html_to_return = render_to_string(
            'editor/pdf_frame.html', 
            {'project': project, 'run': run}
        )
        return JsonResponse({'html': html_to_return})

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON.'}, status=400)
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"Error in live_compile: {error_details}")  # Log to console
        return JsonResponse({'error': f'Server error: {str(e)}'}, status=500)


# --- OLD VIEWS (May be needed) ---
@login_required
def document_create(request, pk):
    # This is the old, non-ajax view
    project = get_object_or_404(Project, pk=pk)
    if not user_can_edit(project, request.user):
        return HttpResponseForbidden()
    if request.method == "POST":
        form = DocumentForm(request.POST)
        if form.is_valid():
            doc = form.save(commit=False)
            doc.project = project
            doc.save()
            return redirect('editor:document_editor', pk=pk, doc_id=doc.pk)
    return redirect('editor:project_detail', pk=pk)

@login_required
def compile_project(request, pk):
    # Old compile view
    project = get_object_or_404(Project, pk=pk)
    if not user_can_edit(project, request.user):
        return HttpResponseForbidden()
    run = CompileRun.objects.create(project=project, status='queued')
    compile_latex_pdf(project, run)
    return redirect('editor:compile_status', pk=pk, run_id=run.pk)

@login_required
def compile_status(request, pk, run_id):
    project = get_object_or_404(Project, pk=pk)
    run = get_object_or_404(CompileRun, pk=run_id, project=project)
    return render(request, 'editor/compile_status.html', {'project': project, 'run': run})

@login_required
def download_pdf(request, pk, run_id):
    project = get_object_or_404(Project, pk=pk)
    run = get_object_or_404(CompileRun, pk=run_id, project=project)
    if run.status == 'success' and run.pdf:
        # Add a cache-busting query param if this is an iframe
        if 't' in request.GET:
            return FileResponse(run.pdf.open('rb'), content_type='application/pdf')
        else:
            return FileResponse(run.pdf.open('rb'), content_type='application/pdf', as_attachment=True, filename=f'{project.name}.pdf')
    else:
        return redirect('editor:compile_status', pk=pk, run_id=run_id)


# --- NEW AJAX VIEWS ---

@login_required
@require_POST
@transaction.atomic
def folder_create_ajax(request, pk):
    project = get_object_or_404(Project, pk=pk)
    if not user_can_edit(project, request.user):
        return JsonResponse({'error': 'Permission denied.'}, status=403)

    form = NewFolderForm(request.POST)
    if form.is_valid():
        name = form.cleaned_data['name']
        parent_folder_id = form.cleaned_data['folder_id']
        parent_folder = None
        if parent_folder_id:
            parent_folder = get_object_or_404(Folder, pk=parent_folder_id, project=project)
        
        try:
            Folder.objects.create(project=project, parent=parent_folder, name=name)
            return JsonResponse({'success': True})
        except IntegrityError:
            return JsonResponse({'error': 'A folder with this name already exists here.'})
    
    return JsonResponse({'error': 'Invalid data.'}, status=400)

@login_required
@require_POST
@transaction.atomic
def document_create_ajax(request, pk):
    project = get_object_or_404(Project, pk=pk)
    if not user_can_edit(project, request.user):
        return JsonResponse({'error': 'Permission denied.'}, status=403)

    form = NewDocumentForm(request.POST)
    if form.is_valid():
        name = form.cleaned_data['name']
        parent_folder_id = form.cleaned_data['folder_id']
        parent_folder = None
        if parent_folder_id:
            parent_folder = get_object_or_404(Folder, pk=parent_folder_id, project=project)
        
        try:
            doc = Document.objects.create(
                project=project,
                folder=parent_folder,
                name=name,
                content=f"% New file: {name}\n"
            )
            # Return the URL to the new document so the page can redirect
            return JsonResponse({'success': True, 'url': reverse('editor:document_editor', args=[project.pk, doc.pk])})
        except IntegrityError:
            return JsonResponse({'error': 'A file with this name already exists here.'})
    
    return JsonResponse({'error': 'Invalid data.'}, status=400)

@login_required
@require_POST
@transaction.atomic
def binary_file_upload_ajax(request, pk):
    project = get_object_or_404(Project, pk=pk)
    if not user_can_edit(project, request.user):
        return JsonResponse({'error': 'Permission denied.'}, status=403)

    form = UploadBinaryFileForm(request.POST, request.FILES)
    if form.is_valid():
        files = request.FILES.getlist('file')
        parent_folder_id = form.cleaned_data['folder_id']
        parent_folder = None
        if parent_folder_id:
            parent_folder = get_object_or_404(Folder, pk=parent_folder_id, project=project)
        
        errors = []
        for f in files:
            try:
                BinaryFile.objects.create(
                    project=project,
                    folder=parent_folder,
                    file=f
                )
            except IntegrityError:
                errors.append(f"A file named '{f.name}' already exists in this folder.")
            except Exception as e:
                errors.append(f"Error uploading '{f.name}': {str(e)}")
        
        if errors:
            return JsonResponse({'success': False, 'error': "\n".join(errors)})
        return JsonResponse({'success': True})
    
    return JsonResponse({'error': 'Invalid data or no file provided.'}, status=400)
@login_required
def pdf_frame(request, pk):
    """
    Renders an HTML snippet (to be used in an iframe) that shows
    the latest successful PDF, or the latest error log.
    """
    project = get_object_or_404(Project, pk=pk)
    
    # Find the most recent compile run for this project.
    run = project.compiles.order_by('-created_at').first()
    
    context = {
        'project': project,
        'run': run
    }
    return render(request, 'editor/pdf_frame.html', context)
# ... other imports ...
from .models import Project, Document, Folder, BinaryFile
from django.http import HttpResponseForbidden, FileResponse, JsonResponse, HttpResponse
import mimetypes

# ... other views ...

@login_required
def download_binary(request, pk, file_id):
    """
    Serves a BinaryFile (like an image) to the user.
    """
    project = get_object_or_404(Project, pk=pk)
    
    # Check if user has permission
    can_view = project.owner == request.user or Collaborator.objects.filter(project=project, user=request.user).exists()
    if not can_view:
        return HttpResponseForbidden("You do not have access to this project.")
        
    binary_file = get_object_or_404(BinaryFile, pk=file_id, project=project)
    
    try:
        # Open the file and serve it
        # FileResponse is efficient for serving large files
        response = FileResponse(binary_file.file.open('rb'))
        
        # Try to guess the MIME type (e.g., 'image/png')
        content_type, encoding = mimetypes.guess_type(binary_file.name)
        if content_type:
            response['Content-Type'] = content_type
        
        # 'inline' will try to display the file in the browser (good for images)
        # 'attachment' would force a download
        response['Content-Disposition'] = f'inline; filename="{binary_file.name}"'
        return response
        
    except FileNotFoundError:
        return HttpResponse("File not found.", status=404)
    except Exception as e:
        # Catch other potential errors
        return HttpResponse(f"Error serving file: {e}", status=500)

# ... rest of your views.py ...
@login_required
@require_POST
@transaction.atomic
def move_item_ajax(request, pk):
    project = get_object_or_404(Project, pk=pk)
    if not user_can_edit(project, request.user):
        return JsonResponse({'error': 'Permission denied.'}, status=403)
    
    try:
        data = json.loads(request.body)
        item_type = data.get('item_type')
        item_id = data.get('item_id')
        target_folder_id = data.get('target_folder_id')

        target_folder = None
        if target_folder_id:
            target_folder = get_object_or_404(Folder, pk=target_folder_id, project=project)

        item = None
        if item_type == 'folder':
            item = get_object_or_404(Folder, pk=item_id, project=project)
            # Prevent dragging a folder into itself or its own child
            if target_folder and (target_folder.pk == item.pk or target_folder.parent == item):
                 return JsonResponse({'error': 'Cannot move a folder into itself.'}, status=400)
            item.parent = target_folder
        elif item_type == 'document':
            item = get_object_or_404(Document, pk=item_id, project=project)
            item.folder = target_folder
        elif item_type == 'binary':
            item = get_object_or_404(BinaryFile, pk=item_id, project=project)
            item.folder = target_folder
        else:
            return JsonResponse({'error': 'Invalid item type.'}, status=400)
        
        item.save()
        return JsonResponse({'success': True})
    
    except IntegrityError:
        return JsonResponse({'error': 'An item with that name already exists in the target folder.'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)