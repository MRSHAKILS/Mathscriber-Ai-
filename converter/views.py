from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods, require_POST
import os
import json
import base64
from .models import UploadedImage
from .forms import MultipleImageUploadForm
from .ocr_utils import process_image_to_latex, validate_image, is_pdf_file, validate_pdf, process_pdf_to_latex
from django.utils import timezone
from django.urls import reverse
from urllib.parse import quote


def dashboard_view(request):
    """
    Modern landing page that explains the project, its value, common LaTeX OCR pain points,
    and provides clear calls-to-action to Upload, Draw, and View Results.
    """
    # We can surface a few recent uploads if available (optional UX sweetener)
    recent_uploads = UploadedImage.objects.order_by('-created_at')[:6]
    total_conversions = UploadedImage.objects.count()

    # Per-task counts for metrics
    task_keys = [key for key, _ in UploadedImage.TASK_CHOICES]
    task_counts = {k: UploadedImage.objects.filter(task=k).count() for k in task_keys}

    # Optional: today's conversions
    today = timezone.now().date()
    today_conversions = UploadedImage.objects.filter(created_at__date=today).count()

    return render(request, 'converter/dashboard.html', {
        'recent_uploads': recent_uploads,
        'total_conversions': total_conversions,
        'task_counts': task_counts,
        'today_conversions': today_conversions,
    })

def upload_view(request):
    """
    Main view for handling image uploads and displaying results.
    """
    if request.method == 'POST':
        form = MultipleImageUploadForm(request.POST)
        images = request.FILES.getlist('images')  # Get multiple files
        
        if form.is_valid() and images:
            task = form.cleaned_data['task']
            processed_images = []
            
            for image in images:
                try:
                    # Validate file type - now supports images and PDFs
                    valid_image_extensions = ['.jpg', '.jpeg', '.png', '.bmp', '.gif', '.tiff']
                    is_image = any(image.name.lower().endswith(ext) for ext in valid_image_extensions)
                    is_pdf = image.name.lower().endswith('.pdf')
                    
                    if not (is_image or is_pdf):
                        messages.error(request, f"File {image.name} is not a valid image or PDF format.")
                        continue
                    
                    # Save the uploaded file
                    uploaded_image = UploadedImage.objects.create(
                        image=image,
                        task=task,
                        latex_output=""  # Will be updated after processing
                    )
                    
                    # Process the file to get LaTeX output
                    file_path = uploaded_image.image.path
                    
                    # Handle Agent Workflow
                    if task == 'agent':
                        # Import agent workflow
                        from agents import process_scribble
                        
                        if is_pdf:
                            messages.error(request, f"Agent workflow does not support PDF files yet: {image.name}")
                            uploaded_image.delete()
                            continue
                        
                        if validate_image(file_path):
                            print(f"🤖 Processing with Agent Workflow: {image.name}")
                            
                            # Run the multi-agent workflow
                            result = process_scribble(file_path, max_retries=3)
                            
                            # Extract results
                            uploaded_image.latex_output = result.get('converted_output', '')
                            uploaded_image.scribble_type = result.get('scribble_type', 'unknown')
                            uploaded_image.type_confidence = result.get('type_confidence', 0.0)
                            uploaded_image.validation_score = result.get('validation_score', 0.0)
                            uploaded_image.feedback = result.get('feedback', '')
                            uploaded_image.retry_count = result.get('retry_count', 0)
                            uploaded_image.model_used = result.get('model_used', 'Multi-Agent Workflow (Gemini)')
                            uploaded_image.save()
                            
                            processed_images.append({
                                'id': uploaded_image.id,
                                'image_url': uploaded_image.image.url,
                                'latex_output': uploaded_image.latex_output,
                                'filename': uploaded_image.image.name,
                                'task': task,
                                'model_used': uploaded_image.model_used,
                                'file_type': 'Image',
                                'scribble_type': uploaded_image.scribble_type,
                                'type_confidence': uploaded_image.type_confidence,
                                'validation_score': uploaded_image.validation_score,
                                'feedback': uploaded_image.feedback,
                                'retry_count': uploaded_image.retry_count
                            })
                        else:
                            messages.error(request, f"Invalid image file: {image.name}")
                            uploaded_image.delete()
                    
                    elif is_pdf:
                        # Handle PDF processing
                        if validate_pdf(file_path):
                            print(f"📄 Processing PDF: {image.name}")
                            latex_outputs = process_pdf_to_latex(file_path, task)
                            
                            # Combine all pages into one output
                            combined_latex = "\n\n".join(latex_outputs)
                            uploaded_image.latex_output = combined_latex
                            # Set model name used based on task
                            uploaded_image.model_used = (
                                'Multi-Agent Workflow (Gemini)' if task == 'agent' else
                                'gemini-2.5-flash (Universal Auto-Detect)' if task == 'gemini_universal' else
                                'pixtral-12b-2409 (Mistral Universal Auto-Detect)' if task == 'mistral_universal' else
                                'llama-4-scout-17b (Groq Universal Auto-Detect)' if task == 'groq_universal' else
                                'pix2tex (LatexOCR)' if task == 'equation' else
                                'pytesseract + table_to_latex'
                            )
                            uploaded_image.save()
                            
                            processed_images.append({
                                'id': uploaded_image.id,
                                'image_url': uploaded_image.image.url,
                                'latex_output': combined_latex,
                                'filename': uploaded_image.image.name,
                                'task': task,
                                'model_used': uploaded_image.model_used,
                                'file_type': 'PDF',
                                'page_count': len(latex_outputs)
                            })
                        else:
                            messages.error(request, f"Invalid PDF file: {image.name}")
                            uploaded_image.delete()
                    else:
                        # Handle image processing (existing logic)
                        if validate_image(file_path):
                            latex_output = process_image_to_latex(file_path, task)
                            uploaded_image.latex_output = latex_output
                            # Set model name used based on task
                            uploaded_image.model_used = (
                                'Multi-Agent Workflow (Gemini)' if task == 'agent' else
                                'gemini-2.5-flash (Universal Auto-Detect)' if task == 'gemini_universal' else
                                'pixtral-12b-2409 (Mistral Universal Auto-Detect)' if task == 'mistral_universal' else
                                'llama-4-scout-17b (Groq Universal Auto-Detect)' if task == 'groq_universal' else
                                'pix2tex (LatexOCR)' if task == 'equation' else
                                'pytesseract + table_to_latex'
                            )
                            uploaded_image.save()
                            
                            processed_images.append({
                                'id': uploaded_image.id,
                                'image_url': uploaded_image.image.url,
                                'latex_output': latex_output,
                                'filename': uploaded_image.image.name,
                                'task': task,
                                'model_used': uploaded_image.model_used,
                                'file_type': 'Image'
                            })
                        else:
                            messages.error(request, f"Invalid image file: {image.name}")
                            uploaded_image.delete()
                        
                except Exception as e:
                    messages.error(request, f"Error processing {image.name}: {str(e)}")
            
            if processed_images:
                messages.success(request, f"Successfully processed {len(processed_images)} image(s)!")
                return render(request, 'converter/results.html', {
                    'processed_images': processed_images,
                    'form': MultipleImageUploadForm()  # Fresh form for new uploads
                })
            else:
                messages.error(request, "No images were successfully processed.")
        elif not images:
            messages.error(request, "Please select at least one image or PDF file.")
        else:
            messages.error(request, "Please correct the errors below.")
    
    else:
        form = MultipleImageUploadForm()
    
    # Get recent uploads for display
    recent_uploads = UploadedImage.objects.order_by('-created_at')[:10]
    
    return render(request, 'converter/upload.html', {
        'form': form,
        'recent_uploads': recent_uploads
    })

def results_view(request):
    """
    View to display all processed results.
    """
    uploads = UploadedImage.objects.order_by('-created_at')
    return render(request, 'converter/results.html', {
        'processed_images': [
            {
                'id': upload.id,
                'image_url': upload.image.url,
                'latex_output': upload.latex_output,
                'filename': upload.image.name,
                'task': upload.task,
                'model_used': upload.model_used,
                'created_at': upload.created_at
            }
            for upload in uploads
        ],
        'form': MultipleImageUploadForm()
    })

def pricing_view(request):
    """
    View for the pricing page.
    """
    return render(request, 'converter/pricing.html')

def stylus_view(request):
    """
    View for the stylus drawing page.
    """
    return render(request, 'converter/stylus.html')

#Image Capture
@csrf_exempt
def camera_capture(request):
    """
    Capture image from webcam, process it like a normal upload,
    and save into UploadedImage table with LaTeX output.
    """
    if request.method == 'POST':
        data_url = request.POST.get('captured_image', '')
        task = request.POST.get('task', 'equation')  # Default to 'equation' if not provided

        if not data_url or data_url == 'data:,':
            return render(request, 'converter/Scanner.html', {'error': 'No image captured!'})

        try:
            # Decode the base64 image
            header, imgstr = data_url.split(',', 1)
            file_ext = header.split('/')[1].split(';')[0]  # e.g., jpeg
            image_data = base64.b64decode(imgstr)

            # Save temporary file
            filename = f"capture_{timezone.now().strftime('%Y%m%d_%H%M%S')}.{file_ext}"
            file_path = default_storage.save(f"uploads/{filename}", ContentFile(image_data))
            abs_path = default_storage.path(file_path)

            # Validate the image
            if not validate_image(abs_path):
                os.remove(abs_path)
                return render(request, 'converter/Scanner.html', {'error': 'Invalid image format!'})

            # Handle Agent Workflow
            if task == 'agent':
                from agents import process_scribble
                
                print(f"🤖 Processing captured image with Agent Workflow")
                result = process_scribble(abs_path, max_retries=3)
                
                # Create DB entry with agent results
                uploaded_image = UploadedImage.objects.create(
                    image=file_path,
                    task=task,
                    latex_output=result.get('converted_output', ''),
                    scribble_type=result.get('scribble_type', 'unknown'),
                    type_confidence=result.get('type_confidence', 0.0),
                    validation_score=result.get('validation_score', 0.0),
                    feedback=result.get('feedback', ''),
                    retry_count=result.get('retry_count', 0),
                    model_used=result.get('model_used', 'Multi-Agent Workflow (Gemini)')
                )
                latex_output = uploaded_image.latex_output
            else:
                # Process image to LaTeX (standard workflow)
                latex_output = process_image_to_latex(abs_path, task)

                # Create DB entry
                uploaded_image = UploadedImage.objects.create(
                    image=file_path,
                    task=task,
                    latex_output=latex_output,
                    model_used=(
                        'Multi-Agent Workflow (Gemini)' if task == 'agent' else
                        'gemini-2.5-flash (Universal Auto-Detect)' if task == 'gemini_universal' else
                        'pixtral-12b-2409 (Mistral Universal Auto-Detect)' if task == 'mistral_universal' else
                        'llama-4-scout-17b (Groq Universal Auto-Detect)' if task == 'groq_universal' else
                        'pix2tex (LatexOCR)' if task == 'equation' else
                        'pytesseract + table_to_latex'
                    )
                )

            # Show result page just like upload_view
            processed_images = [{
                'id': uploaded_image.id,
                'image_url': uploaded_image.image.url,
                'latex_output': latex_output,
                'filename': uploaded_image.image.name,
                'task': uploaded_image.task,
                'model_used': uploaded_image.model_used,
                'file_type': 'Image'
            }]

            messages.success(request, "✅ Captured image processed successfully!")
            return render(request, 'converter/results.html', {
                'processed_images': processed_images,
                'form': MultipleImageUploadForm()
            })

        except Exception as e:
            return render(request, 'converter/Scanner.html', {
                'error': f'❌ Failed to process image: {e}'
            })

    # GET request → render capture page
    return render(request, 'converter/Scanner.html')

def Home(request):
    return render(request, 'Welcome.html')

@require_POST
def delete_upload_view(request, upload_id):
    """
    Delete a specific upload and its associated file.
    """
    try:
        upload = get_object_or_404(UploadedImage, id=upload_id)
        
        # Delete the file from storage
        if upload.image:
            if os.path.exists(upload.image.path):
                os.remove(upload.image.path)
        
        # Delete the database record
        upload.delete()
        
        if request.headers.get('Content-Type') == 'application/json':
            return JsonResponse({'success': True, 'message': 'Upload deleted successfully'})
        else:
            messages.success(request, 'Upload deleted successfully!')
            return redirect('converter:upload')
            
    except Exception as e:
        if request.headers.get('Content-Type') == 'application/json':
            return JsonResponse({'success': False, 'error': str(e)}, status=500)
        else:
            messages.error(request, f'Error deleting upload: {str(e)}')
            return redirect('converter:upload')

@require_POST
def update_latex_view(request, upload_id):
    """
    Update the LaTeX output for a specific upload.
    """
    try:
        upload = get_object_or_404(UploadedImage, id=upload_id)
        
        # Parse JSON body
        data = json.loads(request.body)
        new_latex = data.get('latex_output', '')
        
        # Update the LaTeX output
        upload.latex_output = new_latex
        upload.save()
        
        return JsonResponse({
            'success': True, 
            'message': 'LaTeX output updated successfully',
            'latex_output': new_latex
        })
            
    except Exception as e:
        return JsonResponse({
            'success': False, 
            'error': str(e)
        }, status=500)


def _wrap_latex_if_needed(latex: str, task: str = "") -> str:
    """Ensure LaTeX is a compilable document. If it's a snippet, wrap with minimal preamble.
    Adds useful packages for tables and math.
    """
    if not latex:
        latex = "% Generated by MathScriber\n% Empty LaTeX content"
    # If already a full document, return as-is
    if "\\documentclass" in latex:
        return latex
    # Minimal preamble based on task
    packages = ["amsmath", "amssymb"]
    if "tabular" in latex or task.startswith("table"):
        packages.extend(["array", "tabularx", "booktabs"])
    preamble = "\\documentclass{article}\n" + "\n".join(f"\\usepackage{{{p}}}" for p in packages) + "\n\\begin{document}\n"
    closing = "\n\\end{document}\n"
    return preamble + latex + closing


def overleaf_snip_view(request, upload_id: int):
    """Serve a compilable .tex for Overleaf snip import. Overleaf will fetch this URL.
    Note: This works best when your site is publicly reachable; Overleaf cannot fetch localhost.
    """
    upload = get_object_or_404(UploadedImage, id=upload_id)
    latex = upload.latex_output or ""
    wrapped = _wrap_latex_if_needed(latex, task=upload.task or "")
    resp = HttpResponse(wrapped, content_type="text/plain; charset=utf-8")
    resp["Content-Disposition"] = f"inline; filename=mathscriber_{upload_id}.tex"
    return resp


def overleaf_open_view(request, upload_id: int):
    """Redirect to Overleaf with POST data to create a new project with the LaTeX content.
    Uses a form POST to Overleaf's docs endpoint with snip parameter.
    """
    upload = get_object_or_404(UploadedImage, id=upload_id)
    latex = upload.latex_output or ""
    wrapped = _wrap_latex_if_needed(latex, task=upload.task or "")
    
    # Return an HTML page that auto-submits a form to Overleaf
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Opening in Overleaf...</title>
        <style>
            body {{ font-family: system-ui, sans-serif; text-align: center; padding: 50px; }}
            .loader {{ border: 4px solid #f3f3f3; border-top: 4px solid #0d6efd; 
                       border-radius: 50%; width: 40px; height: 40px; 
                       animation: spin 1s linear infinite; margin: 20px auto; }}
            @keyframes spin {{ 0% {{ transform: rotate(0deg); }} 100% {{ transform: rotate(360deg); }} }}
        </style>
    </head>
    <body>
        <h2>Opening in Overleaf...</h2>
        <div class="loader"></div>
        <p>Creating a new project with your LaTeX code.</p>
        <form id="overleaf-form" method="POST" action="https://www.overleaf.com/docs" target="_blank">
            <input type="hidden" name="snip" value="{wrapped.replace('"', '&quot;').replace('<', '&lt;').replace('>', '&gt;')}">
            <input type="hidden" name="snip_name" value="MathScriber Result #{upload_id}">
        </form>
        <script>
            document.getElementById('overleaf-form').submit();
            setTimeout(function() {{ window.close(); }}, 2000);
        </script>
    </body>
    </html>
    """
    return HttpResponse(html)

def about_view(request):
    """About Us page with team information"""
    team_members = [
        {
            'name': 'Team Member 1',
            'initial': 'A',
            'role': 'Lead Developer',
            'bio': 'Full-stack developer passionate about AI'
        },
        {
            'name': 'Team Member 2',
            'initial': 'B',
            'role': 'AI Engineer',
            'bio': 'Specializes in computer vision and NLP'
        },
        {
            'name': 'Team Member 3',
            'initial': 'C',
            'role': 'Product Designer',
            'bio': 'Creates intuitive user experiences'
        },
        {
            'name': 'Team Member 4',
            'initial': 'D',
            'role': 'Research Lead',
            'bio': 'PhD in Machine Learning and OCR'
        },
    ]
    
    context = {
        'team_members': team_members
    }
    return render(request, 'converter/about.html', context)
