import os
import subprocess
import tempfile
import shutil
from pathlib import Path
from django.core.files.base import ContentFile
from django.utils import timezone
from .models import CompileRun, Document


def compile_latex_pdf(project, run):
    """
    Compile a LaTeX project to PDF using pdflatex
    
    Args:
        project: Project instance
        run: CompileRun instance
    
    Returns:
        bool: True if successful, False otherwise
    """
    run.status = 'running'
    run.save()
    
    try:
        # Check if pdflatex is installed
        try:
            subprocess.run(['pdflatex', '--version'], capture_output=True, check=True, timeout=5)
        except (subprocess.CalledProcessError, FileNotFoundError, subprocess.TimeoutExpired):
            run.status = 'error'
            run.log = '''pdflatex command not found.

Please install a LaTeX distribution:
- Windows: Install MiKTeX from https://miktex.org/download
- Linux: sudo apt-get install texlive-full
- Mac: Install MacTeX from https://www.tug.org/mactex/

After installation, restart your terminal and try again.'''
            run.finished_at = timezone.now()
            run.save()
            return False
        
        # Find main document
        main_doc = project.documents.filter(is_main=True).first()
        if not main_doc:
            run.status = 'error'
            run.log = 'No main document found. Please mark one document as the main document.'
            run.finished_at = timezone.now()
            run.save()
            return False
        
        # Create temporary directory for compilation
        with tempfile.TemporaryDirectory(prefix=f'proj_{project.id}_run_{run.id}_') as tmpdir:
            tmpdir_path = Path(tmpdir)
            
            # Write all project files to temp directory
            write_project_files_to_temp(project, tmpdir_path)
            
            # Get main document path
            main_doc_path = tmpdir_path / main_doc.path
            
            # Compile twice (for cross-references)
            logs = []
            for i in range(2):
                try:
                    result = subprocess.run(
                        [
                            'pdflatex',
                            '-interaction=nonstopmode',
                            '-output-directory', str(tmpdir_path),
                            str(main_doc_path)
                        ],
                        capture_output=True,
                        text=True,
                        timeout=120,
                        cwd=str(tmpdir_path)
                    )
                    
                    logs.append(f"=== Compilation Run {i + 1} ===\n")
                    logs.append(result.stdout)
                    if result.stderr:
                        logs.append(result.stderr)
                    
                except subprocess.TimeoutExpired:
                    run.status = 'error'
                    run.log = 'Compilation timed out after 120 seconds. Check for infinite loops or very large documents.'
                    run.finished_at = timezone.now()
                    run.save()
                    return False
            
            # Check for PDF output
            pdf_name = main_doc.name.replace('.tex', '.pdf')
            pdf_path = tmpdir_path / pdf_name
            
            if pdf_path.exists():
                # Save PDF to media storage
                with open(pdf_path, 'rb') as pdf_file:
                    run.pdf.save(
                        f'project_{project.id}_run_{run.id}.pdf',
                        ContentFile(pdf_file.read()),
                        save=False
                    )
                
                # Check for .log file
                log_path = tmpdir_path / main_doc.name.replace('.tex', '.log')
                if log_path.exists():
                    with open(log_path, 'r', encoding='utf-8', errors='ignore') as log_file:
                        logs.append("\n=== LaTeX Log File ===\n")
                        logs.append(log_file.read())
                
                run.status = 'success'
                run.log = '\n'.join(logs)
                run.finished_at = timezone.now()
                run.save()
                return True
            else:
                # Compilation failed
                run.status = 'error'
                run.log = '\n'.join(logs)
                run.finished_at = timezone.now()
                run.save()
                return False
                
    except Exception as e:
        run.status = 'error'
        run.log = f'Unexpected error during compilation: {str(e)}'
        run.finished_at = timezone.now()
        run.save()
        return False


def write_project_files_to_temp(project, tmpdir_path):
    """
    Write all project files (documents, binary files) to a temporary directory
    
    Args:
        project: Project instance
        tmpdir_path: Path object pointing to temp directory
    """
    # Create folder structure
    for folder in project.folders.all():
        folder_path = tmpdir_path / folder.path
        folder_path.mkdir(parents=True, exist_ok=True)
    
    # Write all documents
    for doc in project.documents.all():
        doc_path = tmpdir_path / doc.path
        doc_path.parent.mkdir(parents=True, exist_ok=True)
        with open(doc_path, 'w', encoding='utf-8') as f:
            f.write(doc.content)
    
    # Copy all binary files
    for binary in project.binary_files.all():
        if binary.file:
            binary_path = tmpdir_path / binary.path
            binary_path.parent.mkdir(parents=True, exist_ok=True)
            
            # Copy file
            with open(binary.file.path, 'rb') as src:
                with open(binary_path, 'wb') as dst:
                    shutil.copyfileobj(src, dst)


def user_can_edit(project, user):
    """Check if user has edit permission for project"""
    if project.owner == user:
        return True
    
    collab = project.collaborators.filter(user=user).first()
    if collab and collab.role in ['owner', 'editor']:
        return True
    
    return False


def user_can_view(project, user):
    """Check if user has view permission for project"""
    if project.owner == user:
        return True
    
    if project.collaborators.filter(user=user).exists():
        return True
    
    return False


def get_default_latex_template():
    """Return default LaTeX template for new projects"""
    return r"""\documentclass{article}

% Math packages
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

% Graphics
\usepackage{graphicx}
\usepackage{tikz}
\usetikzlibrary{shapes,arrows,positioning}

% Other packages
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
Your content here...

\end{document}"""
