#!/usr/bin/env python3
"""
Image to TikZ LaTeX Diagram Converter - Django/OpenAI Version
Converts diagram images into complete, standalone LaTeX documents using TikZ.
Designed for integration with Django projects using OpenAI API.
"""

import base64
import json
import os
from pathlib import Path
from typing import Optional, Union
from dotenv import load_dotenv

# Load environment variables from .env file in parent directory
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(env_path)


class ImageToTikzConverter:
    """
    Converter class for transforming diagram images into TikZ LaTeX documents.
    Designed for Django integration with OpenAI API.
    """
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize the converter with OpenAI API key.
        
        Args:
            api_key: OpenAI API key. If None, reads from OPENAI_API_KEY env variable.
        """
        self.api_key = api_key or os.getenv('OPENAI_API_KEY')
        if not self.api_key:
            raise ValueError("OpenAI API key not provided. Set OPENAI_API_KEY environment variable.")
    
    def image_to_base64(self, image_path: Union[str, Path]) -> str:
        """
        Convert image file to base64 string.
        
        Args:
            image_path: Path to the image file
            
        Returns:
            Base64 encoded string of the image
        """
        with open(image_path, 'rb') as f:
            return base64.b64encode(f.read()).decode('utf-8')
    
    def get_image_mime_type(self, image_path: Union[str, Path]) -> str:
        """
        Determine MIME type from file extension.
        
        Args:
            image_path: Path to the image file
            
        Returns:
            MIME type string
        """
        ext = Path(image_path).suffix.lower()
        mime_types = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.bmp': 'image/bmp',
            '.webp': 'image/webp'
        }
        return mime_types.get(ext, 'image/jpeg')
    
    def call_openai_api(self, image_base64: str, mime_type: str, 
                       model: str = "gpt-4o") -> str:
        """
        Call OpenAI API to analyze the diagram and generate TikZ code.
        
        Args:
            image_base64: Base64 encoded image string
            mime_type: MIME type of the image
            model: OpenAI model to use (default: gpt-4o for vision)
            
        Returns:
            Generated LaTeX code as string
        """
        try:
            from openai import OpenAI
        except ImportError:
            raise ImportError(
                "OpenAI library not installed. Install with: pip install openai"
            )
        
        # Initialize OpenAI client
        client = OpenAI(api_key=self.api_key)
        
        # Prepare the prompt
        prompt = """Analyze this diagram image and convert it into a complete, standalone LaTeX document using TikZ.

Requirements:
1. Include complete LaTeX document structure with \\documentclass{standalone} and all necessary packages
2. Identify all shapes (rectangles, diamonds, ellipses, circles, etc.)
3. Extract all text labels and their positions
4. Detect colors used in the diagram
5. Identify all connections/arrows between elements
6. Preserve relative positions and alignment
7. Use appropriate TikZ styles for nodes and edges
8. Add clear comments explaining each section

Generate ONLY the complete LaTeX code, starting with \\documentclass and ending with \\end{document}.
Make sure the code compiles without errors. Use the standalone document class for easy compilation.
Do not include any markdown formatting or code block markers."""
        
        # Make API call
        response = client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:{mime_type};base64,{image_base64}"
                            }
                        },
                        {
                            "type": "text",
                            "text": prompt
                        }
                    ]
                }
            ],
            max_tokens=4000
        )
        
        # Extract the generated LaTeX code
        latex_code = response.choices[0].message.content
        return latex_code
    
    def clean_latex_code(self, latex_code: str) -> str:
        """
        Clean up the LaTeX code by removing markdown code blocks if present.
        
        Args:
            latex_code: Raw LaTeX code from API
            
        Returns:
            Cleaned LaTeX code
        """
        latex_code = latex_code.strip()
        
        # Remove markdown code block markers
        if latex_code.startswith("```latex"):
            latex_code = latex_code[8:]
        elif latex_code.startswith("```"):
            latex_code = latex_code[3:]
        
        if latex_code.endswith("```"):
            latex_code = latex_code[:-3]
        
        return latex_code.strip()
    
    def convert_from_file(self, image_path: Union[str, Path], 
                         output_path: Optional[Union[str, Path]] = None) -> str:
        """
        Convert an image file to TikZ LaTeX document.
        
        Args:
            image_path: Path to the input image
            output_path: Path to save the output .tex file (optional)
            
        Returns:
            Generated LaTeX code as string
        """
        # Verify image file exists
        if not Path(image_path).exists():
            raise FileNotFoundError(f"Image file not found: {image_path}")
        
        # Convert image to base64
        image_base64 = self.image_to_base64(image_path)
        mime_type = self.get_image_mime_type(image_path)
        
        # Call OpenAI API to generate TikZ code
        latex_code = self.call_openai_api(image_base64, mime_type)
        
        # Clean up the code
        latex_code = self.clean_latex_code(latex_code)
        
        # Save to file if output path is provided
        if output_path:
            self.save_latex_file(latex_code, output_path)
        
        return latex_code
    
    def convert_from_base64(self, image_base64: str, mime_type: str = "image/png",
                           output_path: Optional[Union[str, Path]] = None) -> str:
        """
        Convert a base64 encoded image to TikZ LaTeX document.
        Useful for Django file uploads.
        
        Args:
            image_base64: Base64 encoded image string
            mime_type: MIME type of the image
            output_path: Path to save the output .tex file (optional)
            
        Returns:
            Generated LaTeX code as string
        """
        # Call OpenAI API to generate TikZ code
        latex_code = self.call_openai_api(image_base64, mime_type)
        
        # Clean up the code
        latex_code = self.clean_latex_code(latex_code)
        
        # Save to file if output path is provided
        if output_path:
            self.save_latex_file(latex_code, output_path)
        
        return latex_code
    
    def convert_from_django_file(self, django_file, 
                                output_path: Optional[Union[str, Path]] = None) -> str:
        """
        Convert a Django UploadedFile to TikZ LaTeX document.
        
        Args:
            django_file: Django UploadedFile object
            output_path: Path to save the output .tex file (optional)
            
        Returns:
            Generated LaTeX code as string
        """
        # Read and encode the file
        image_data = django_file.read()
        image_base64 = base64.b64encode(image_data).decode('utf-8')
        
        # Get MIME type from content_type or file name
        mime_type = django_file.content_type or self.get_image_mime_type(django_file.name)
        
        # Call OpenAI API to generate TikZ code
        latex_code = self.call_openai_api(image_base64, mime_type)
        
        # Clean up the code
        latex_code = self.clean_latex_code(latex_code)
        
        # Save to file if output path is provided
        if output_path:
            self.save_latex_file(latex_code, output_path)
        
        return latex_code
    
    def save_latex_file(self, latex_code: str, output_path: Union[str, Path]) -> None:
        """
        Save the LaTeX code to a file.
        
        Args:
            latex_code: LaTeX code to save
            output_path: Path to save the file
        """
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(latex_code)


# ============================================================================
# Django Views Example
# ============================================================================

"""
Example Django views.py implementation:

from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .image_to_tikz import ImageToTikzConverter
import os

def upload_diagram_view(request):
    '''Render the upload form.'''
    return render(request, 'upload_diagram.html')

@csrf_exempt
def convert_diagram_view(request):
    '''Handle diagram conversion.'''
    if request.method == 'POST' and request.FILES.get('diagram_image'):
        try:
            # Get the uploaded file
            diagram_file = request.FILES['diagram_image']
            
            # Initialize converter with API key from settings
            api_key = os.getenv('OPENAI_API_KEY')
            converter = ImageToTikzConverter(api_key=api_key)
            
            # Convert the diagram
            latex_code = converter.convert_from_django_file(diagram_file)
            
            # Return as downloadable file
            response = HttpResponse(latex_code, content_type='text/plain')
            response['Content-Disposition'] = 'attachment; filename="diagram.tex"'
            return response
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'No file uploaded'}, status=400)

@csrf_exempt
def convert_diagram_json_view(request):
    '''Handle diagram conversion and return JSON.'''
    if request.method == 'POST' and request.FILES.get('diagram_image'):
        try:
            diagram_file = request.FILES['diagram_image']
            
            api_key = os.getenv('OPENAI_API_KEY')
            converter = ImageToTikzConverter(api_key=api_key)
            
            latex_code = converter.convert_from_django_file(diagram_file)
            
            return JsonResponse({
                'success': True,
                'latex_code': latex_code
            })
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'No file uploaded'}, status=400)
"""


# ============================================================================
# Django URL Configuration Example
# ============================================================================

"""
Example urls.py:

from django.urls import path
from . import views

urlpatterns = [
    path('upload/', views.upload_diagram_view, name='upload_diagram'),
    path('convert/', views.convert_diagram_view, name='convert_diagram'),
    path('api/convert/', views.convert_diagram_json_view, name='convert_diagram_json'),
]
"""


# ============================================================================
# Django Template Example
# ============================================================================

"""
Example upload_diagram.html template:

<!DOCTYPE html>
<html>
<head>
    <title>Diagram to TikZ Converter</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
        }
        .upload-form {
            border: 2px dashed #ccc;
            border-radius: 10px;
            padding: 40px;
            text-align: center;
        }
        input[type="file"] {
            margin: 20px 0;
        }
        button {
            background-color: #4CAF50;
            color: white;
            padding: 15px 32px;
            font-size: 16px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        button:hover {
            background-color: #45a049;
        }
    </style>
</head>
<body>
    <h1>Diagram to TikZ LaTeX Converter</h1>
    <div class="upload-form">
        <h2>Upload Your Diagram</h2>
        <form action="{% url 'convert_diagram' %}" method="post" enctype="multipart/form-data">
            {% csrf_token %}
            <input type="file" name="diagram_image" accept="image/*" required>
            <br>
            <button type="submit">Convert to TikZ</button>
        </form>
    </div>
</body>
</html>
"""


# ============================================================================
# Standalone CLI Usage
# ============================================================================

def main():
    """Command-line interface for standalone usage."""
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python image_to_tikz.py <image_path> [output_path]")
        print("Example: python image_to_tikz.py diagram.png diagram.tex")
        sys.exit(1)
    
    # Get input and output paths
    image_path = sys.argv[1]
    
    # Default output to test_outputs folder
    if len(sys.argv) >= 3:
        output_path = sys.argv[2]
    else:
        test_outputs_dir = Path(__file__).parent.parent / "test_outputs"
        test_outputs_dir.mkdir(exist_ok=True)
        output_path = test_outputs_dir / f"{Path(image_path).stem}_openai_diagram.tex"
    
    print(f"Converting diagram: {image_path}")
    print("=" * 60)
    
    try:
        # Initialize converter
        converter = ImageToTikzConverter()
        
        # Convert the diagram
        print("Sending image to OpenAI API for analysis...")
        latex_code = converter.convert_from_file(image_path, output_path)
        
        print(f"✓ LaTeX file saved to: {output_path}")
        print("=" * 60)
        print("Conversion complete!")
        print(f"\nTo compile the LaTeX document:")
        print(f"  pdflatex {output_path}")
        print(f"\nOr use online compiler: https://www.overleaf.com/")
        
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()