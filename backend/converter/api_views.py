import os
import json
import base64
import tempfile
from datetime import datetime
from django.http import JsonResponse, FileResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from .converter import GeminiConverter
from .models import ConversionHistory
import google.generativeai as genai
from django.conf import settings

# Configure Gemini
genai.configure(api_key=settings.GEMINI_API_KEY)


@csrf_exempt
@require_http_methods(["POST"])
def convert_upload(request):
    """Handle image upload and convert to LaTeX"""
    try:
        print("[DEBUG] Convert upload request received")
        
        if 'image' not in request.FILES:
            print("[DEBUG] No image in request.FILES")
            return JsonResponse({'error': 'No image provided'}, status=400)
        
        image_file = request.FILES['image']
        print(f"[DEBUG] Image file: {image_file.name}, size: {image_file.size}")
        
        # Save image temporarily
        image_path = default_storage.save(f'temp/{image_file.name}', image_file)
        full_path = default_storage.path(image_path)
        print(f"[DEBUG] Image saved to: {full_path}")
        
        try:
            # Convert to LaTeX
            print("[DEBUG] Initializing GeminiConverter...")
            converter = GeminiConverter()
            
            print("[DEBUG] Converting image to LaTeX...")
            with open(full_path, 'rb') as f:
                latex_code = converter.convert_image_to_latex(f)
            
            print(f"[DEBUG] Conversion successful, LaTeX length: {len(latex_code)}")
            
            # Read image as base64 for response
            with open(full_path, 'rb') as f:
                image_data = base64.b64encode(f.read()).decode()
                input_preview = f"data:image/{image_file.name.split('.')[-1]};base64,{image_data}"
            
            # Store in history
            history = ConversionHistory.objects.create(
                input_image=image_path,
                latex_output=latex_code,
                converted_output=latex_code
            )
            print(f"[DEBUG] History saved with ID: {history.id}")
            
            return JsonResponse({
                'input': input_preview,
                'latex': latex_code,
                'convertedOutput': latex_code,
                'timestamp': history.created_at.isoformat(),
                'id': history.id
            })
            
        finally:
            # Cleanup temp file
            if default_storage.exists(image_path):
                default_storage.delete(image_path)
                print("[DEBUG] Temp file cleaned up")
                
    except Exception as e:
        print(f"[ERROR] Conversion failed: {str(e)}")
        import traceback
        traceback.print_exc()
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def convert_capture(request):
    """Handle camera capture and convert to LaTeX"""
    return convert_upload(request)  # Same logic as upload


@csrf_exempt
@require_http_methods(["POST"])
def convert_canvas(request):
    """Handle canvas drawing and convert to LaTeX"""
    return convert_upload(request)  # Same logic as upload


@csrf_exempt
@require_http_methods(["POST"])
def download_tex(request):
    """Download LaTeX as .tex file"""
    try:
        data = json.loads(request.body)
        latex_code = data.get('latex', '')
        
        # Create temporary file
        with tempfile.NamedTemporaryFile(mode='w', suffix='.tex', delete=False) as f:
            f.write(latex_code)
            temp_path = f.name
        
        # Return file
        response = FileResponse(open(temp_path, 'rb'), content_type='application/x-tex')
        response['Content-Disposition'] = 'attachment; filename="output.tex"'
        
        return response
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def download_pdf_api(request):
    """Download LaTeX as compiled PDF"""
    try:
        data = json.loads(request.body)
        latex_code = data.get('latex', '')
        
        # Create temporary directory
        with tempfile.TemporaryDirectory() as tmpdir:
            tex_file = os.path.join(tmpdir, 'output.tex')
            
            # Write LaTeX file
            with open(tex_file, 'w', encoding='utf-8') as f:
                f.write(latex_code)
            
            # Compile with pdflatex
            import subprocess
            result = subprocess.run(
                ['pdflatex', '-interaction=nonstopmode', 'output.tex'],
                cwd=tmpdir,
                capture_output=True,
                timeout=30
            )
            
            pdf_file = os.path.join(tmpdir, 'output.pdf')
            
            if os.path.exists(pdf_file):
                response = FileResponse(open(pdf_file, 'rb'), content_type='application/pdf')
                response['Content-Disposition'] = 'attachment; filename="output.pdf"'
                return response
            else:
                return JsonResponse({'error': 'PDF compilation failed', 'log': result.stderr.decode()}, status=500)
                
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def insert_at_cursor(request):
    """
    Intelligently insert LaTeX snippet into editor at cursor position.
    Uses Gemini to analyze existing code and merge without duplicates.
    """
    try:
        data = json.loads(request.body)
        latex_snippet = data.get('latexSnippet', '')
        current_content = data.get('currentContent', '')
        cursor_position = data.get('cursorPosition', len(current_content))
        
        # Use Gemini to intelligently merge
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        prompt = f"""You are a LaTeX code merger. Given the current LaTeX document and a new snippet to insert, your task is to:

1. Analyze both the current document and the new snippet
2. Identify any duplicate packages in the preamble
3. Merge the code intelligently:
   - If the snippet contains packages already in the document, don't duplicate them
   - If the snippet is just math content, insert it at the cursor position
   - If the snippet has a complete document structure, extract only the relevant content
4. Return ONLY the complete merged LaTeX document, nothing else

Current LaTeX document:
```latex
{current_content}
```

New snippet to insert (at position {cursor_position}):
```latex
{latex_snippet}
```

Return the complete merged document:"""

        response = model.generate_content(prompt)
        merged_content = response.text.strip()
        
        # Clean up markdown code blocks if present
        if merged_content.startswith('```'):
            lines = merged_content.split('\n')
            merged_content = '\n'.join(lines[1:-1])
        
        return JsonResponse({
            'success': True,
            'updatedContent': merged_content,
            'message': 'LaTeX snippet inserted successfully'
        })
        
    except Exception as e:
        # Fallback: simple insertion at cursor
        content_before = current_content[:cursor_position]
        content_after = current_content[cursor_position:]
        merged_content = content_before + '\n' + latex_snippet + '\n' + content_after
        
        return JsonResponse({
            'success': True,
            'updatedContent': merged_content,
            'message': 'LaTeX snippet inserted (simple merge)',
            'error': str(e)
        })


@require_http_methods(["GET"])
def get_history(request):
    """Get conversion history"""
    try:
        # Get session key for anonymous users
        session_key = request.session.session_key
        if not session_key:
            return JsonResponse([])
        
        # Fetch recent history (limit to 50 items)
        history_items = ConversionHistory.objects.all().order_by('-created_at')[:50]
        
        history_data = []
        for item in history_items:
            # Read image as base64
            if item.input_image:
                try:
                    image_path = item.input_image.path
                    with open(image_path, 'rb') as f:
                        image_data = base64.b64encode(f.read()).decode()
                        ext = image_path.split('.')[-1]
                        input_preview = f"data:image/{ext};base64,{image_data}"
                except:
                    input_preview = ''
            else:
                input_preview = ''
            
            history_data.append({
                'id': item.id,
                'input': input_preview,
                'latex': item.latex_output,
                'convertedOutput': item.converted_output,
                'timestamp': item.created_at.isoformat()
            })
        
        return JsonResponse(history_data, safe=False)
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["DELETE"])
def delete_history(request, history_id):
    """Delete a history item"""
    try:
        history_item = ConversionHistory.objects.get(id=history_id)
        
        # Delete associated image file
        if history_item.input_image:
            if default_storage.exists(history_item.input_image.name):
                default_storage.delete(history_item.input_image.name)
        
        history_item.delete()
        
        return JsonResponse({'success': True, 'message': 'History item deleted'})
        
    except ConversionHistory.DoesNotExist:
        return JsonResponse({'error': 'History item not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
