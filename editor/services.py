# editor/services.py
import os
import subprocess
import tempfile
import shutil
from pathlib import Path
from django.core.files import File
from django.utils import timezone
from .models import Document, BinaryFile # Import models

def write_project_files_to_temp(project, tmpdir):
    """
    Recursively writes all project files (text and binary) to a temp directory,
    preserving the folder structure.
    """
    
    # Get all root items
    root_folders = project.folders.filter(parent__isnull=True)
    root_docs = project.documents.filter(folder__isnull=True)
    root_bins = project.binaries.filter(folder__isnull=True)

    # Function to process items
    def process_items(folders, docs, bins, current_dir):
        # Write text documents
        for doc in docs:
            doc_path = current_dir / doc.name
            with open(doc_path, 'w', encoding='utf-8') as f:
                f.write(doc.content)
        
        # Write binary files
        for bin_file in bins:
            bin_path = current_dir / bin_file.name
            with bin_file.file.open('rb') as f_in, open(bin_path, 'wb') as f_out:
                shutil.copyfileobj(f_in, f_out)
        
        # Recurse into subfolders
        for folder in folders:
            sub_dir = current_dir / folder.name
            sub_dir.mkdir(parents=True, exist_ok=True)
            
            process_items(
                folder.child_folders.all(),
                folder.documents.all(),
                folder.binaries.all(),
                sub_dir
            )

    # Start processing from the root temp directory
    process_items(root_folders, root_docs, root_bins, tmpdir)


def compile_latex_pdf(project, run):
    """
    Writes all project files to a temp directory and runs pdflatex.
    """
    
    tex_path = shutil.which("pdflatex")
    if tex_path is None:
        run.status = "error"
        run.log = "Error: 'pdflatex' command not found. Please install a LaTeX distribution (MiKTeX or TeX Live)."
        run.finished_at = timezone.now()
        run.save()
        print("ERROR: pdflatex not found")  # Debug log
        return

    tmpdir = Path(tempfile.mkdtemp(prefix=f'proj_{project.id}_run_{run.id}_'))
    print(f"Compiling project {project.id} in temp directory: {tmpdir}")  # Debug log
    
    try:
        main_doc = project.documents.filter(is_main=True).first()
        if not main_doc:
            run.status = "error"
            run.log = "Error: No document is set as 'main'. Please check the 'Set as Main Document' checkbox for one of your .tex files."
            run.finished_at = timezone.now()
            run.save()
            print(f"ERROR: No main document for project {project.id}")  # Debug log
            return

        # Write all project files to temp dir
        write_project_files_to_temp(project, tmpdir)
        print(f"Written project files to {tmpdir}")  # Debug log

        # Get the relative path of the main doc for pdflatex
        main_doc_name = main_doc.name
        if main_doc.folder:
            # This is complex, let's just use the name
            # For pdflatex to find it, it must be in a subpath
            main_doc_path_in_temp = tmpdir / main_doc.path
            main_doc_arg = main_doc.path # e.g. "chapters/chapter1.tex"
        else:
            main_doc_arg = main_doc.name # e.g. "main.tex"

        cmd = [
            tex_path,
            "-interaction=nonstopmode",
            "-output-directory", str(tmpdir),
            main_doc_arg
        ]

        print(f"Running pdflatex with command: {' '.join(cmd)}")  # Debug log
        
        # Run pdflatex twice
        proc1 = subprocess.run(cmd, cwd=tmpdir, capture_output=True, text=True, timeout=120)
        print(f"First pdflatex run completed with return code: {proc1.returncode}")  # Debug log
        
        proc2 = subprocess.run(cmd, cwd=tmpdir, capture_output=True, text=True, timeout=120)
        print(f"Second pdflatex run completed with return code: {proc2.returncode}")  # Debug log

        # Read the .log file which contains detailed error messages
        log_path = tmpdir / Path(main_doc.name).with_suffix('.log')
        latex_log = ""
        if log_path.exists():
            with open(log_path, 'r', encoding='utf-8', errors='ignore') as f:
                latex_log = f.read()

        run.log = "--- PDFLATEX RUN 1 ---\n" + proc1.stdout + "\n---\n" + proc1.stderr + \
                  "\n\n--- PDFLATEX RUN 2 ---\n" + proc2.stdout + "\n---\n" + proc2.stderr + \
                  "\n\n--- LATEX LOG FILE ---\n" + latex_log

        pdf_path = tmpdir / Path(main_doc.name).with_suffix('.pdf')
        
        # Check if PDF was created in the main tempdir
        # If main.tex was in a subfolder, output might be there
        if not pdf_path.exists():
            pdf_path_in_sub = tmpdir / Path(main_doc_arg).with_suffix('.pdf')
            if pdf_path_in_sub.exists():
                pdf_path = pdf_path_in_sub
            else:
                 # As a last resort, check for the name without path
                 pdf_path = tmpdir / Path(main_doc.name).with_suffix('.pdf')

        print(f"Checking for PDF at: {pdf_path}, exists: {pdf_path.exists()}")  # Debug log

        if proc2.returncode == 0 and pdf_path.exists():
            run.status = "success"
            with open(pdf_path, "rb") as f:
                run.pdf.save(f"{project.pk}_{run.pk}.pdf", File(f))
            print(f"SUCCESS: PDF saved for project {project.id}")  # Debug log
        elif pdf_path.exists():
            # PDF exists but there were errors - still save it but mark as error
            run.status = "error"
            with open(pdf_path, "rb") as f:
                run.pdf.save(f"{project.pk}_{run.pk}.pdf", File(f))
            print(f"WARNING: PDF saved with errors for project {project.id}")  # Debug log
        else:
            run.status = "error"
            print(f"ERROR: PDF compilation failed. Return code: {proc2.returncode}, PDF exists: {pdf_path.exists()}")  # Debug log
        
        run.finished_at = timezone.now()
        run.save()

    except subprocess.TimeoutExpired:
        run.status = "error"
        run.log = "Error: Compilation timed out after 120 seconds. Your document might be too complex or have infinite loops."
        run.finished_at = timezone.now()
        run.save()
        print(f"ERROR: Compilation timeout for project {project.id}")  # Debug log
    except Exception as e:
        run.status = "error"
        error_msg = str(e)
        
        # Provide specific guidance based on error type
        if "No such file or directory" in error_msg and ("uploads/" in error_msg or "media/" in error_msg or ".jpeg" in error_msg or ".png" in error_msg or ".jpg" in error_msg):
            run.log = f"""An unexpected error occurred: {error_msg}

⚠️ IMAGE FILE NOT FOUND ERROR

It looks like your LaTeX document references image files that don't exist in your project.

SOLUTION:
1. Find the \\includegraphics commands in your document (look for lines like: \\includegraphics{{...}})
2. Either:
   a) REMOVE those lines if you don't need the images, OR
   b) UPLOAD the image files to your project:
      - Click "Upload File" in the file browser
      - Upload the image file (e.g., images_iB1uslX.jpeg)
      - Update the path in \\includegraphics{{filename.jpeg}}

📝 NOTE: When you create a project from converter results, only the LaTeX code is transferred, not the original images. The converter generates LaTeX code that doesn't need images (equations, tables, diagrams are pure LaTeX code).

If you manually added \\includegraphics commands, make sure to upload those image files to your project."""
        else:
            run.log = f"An unexpected error occurred: {error_msg}\n\nThis might be due to:\n- Missing LaTeX packages\n- Syntax errors in your LaTeX code\n- Permission issues\n\nPlease check your document and try again."
        
        run.finished_at = timezone.now()
        run.save()
        print(f"ERROR: Exception during compilation: {error_msg}")  # Debug log
        import traceback
        traceback.print_exc()  # Print full traceback to console
    finally:
        shutil.rmtree(tmpdir)
        print(f"Cleaned up temp directory: {tmpdir}")  # Debug log