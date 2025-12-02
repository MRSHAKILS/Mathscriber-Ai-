#!/usr/bin/env python3
"""
Image to TikZ LaTeX Diagram Converter - Gemini Vision API Version
Converts diagram images into complete, standalone LaTeX documents using TikZ.
Uses Google's Gemini 2.0 Flash vision model for diagram analysis.
"""

import base64
import os
import sys
from pathlib import Path
from PIL import Image
from io import BytesIO
from dotenv import load_dotenv

# Load environment variables from .env file in parent directory
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(env_path)


def image_to_base64(image_path: str) -> str:
    """
    Convert image file to base64 string.
    
    Args:
        image_path: Path to the image file
        
    Returns:
        Base64 encoded string of the image
    """
    try:
        with Image.open(image_path) as img:
            # Convert to RGB if necessary
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            buffered = BytesIO()
            img.save(buffered, format="JPEG")
            return base64.b64encode(buffered.getvalue()).decode('utf-8')
    except Exception as e:
        print(f"Error processing image: {e}")
        sys.exit(1)


def create_latex_diagram(image_path: str) -> str:
    """
    Generates LaTeX TikZ code for diagrams using Google Gemini Vision API.
    
    Args:
        image_path: Path to the diagram image
        
    Returns:
        Generated LaTeX code as string
    """
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("Error: GOOGLE_API_KEY not found in environment variables")
        print("Please add your Google AI Studio API key to the .env file")
        sys.exit(1)

    # Check if google-generativeai is installed
    try:
        import google.generativeai as genai
    except ImportError:
        print("Error: google-generativeai package not installed")
        print("Install it with: pip install google-generativeai")
        sys.exit(1)

    print("=" * 70)
    print("GEMINI AI-POWERED DIAGRAM CONVERTER")
    print("=" * 70)
    print("Using: Gemini 2.0 Flash Vision Model")
    print("Analyzing diagram and generating TikZ code...")
    print("=" * 70)

    # Configure Gemini
    genai.configure(api_key=api_key)
    
    # Use Gemini 2.0 Flash for vision tasks
    model = genai.GenerativeModel('gemini-2.0-flash-exp')

    # Prepare the prompt
    prompt = """Analyze this diagram image and convert it into a complete, standalone LaTeX document using TikZ.

Requirements:
1. Include complete LaTeX document structure with \\documentclass{standalone} or \\documentclass{article}
2. Add all necessary packages: \\usepackage{tikz} and relevant libraries
3. Identify ALL shapes in the diagram (rectangles, diamonds, circles, ellipses, etc.)
4. Extract ALL text labels with their exact positions
5. Detect and preserve colors used in the diagram
6. Identify ALL connections, arrows, and lines between elements
7. Maintain accurate relative positions and spacing
8. Use appropriate TikZ node styles (rounded corners, shadows, etc.)
9. Include arrow styles and connection types (solid, dashed, etc.)
10. Add clear comments explaining each section

Generate ONLY the complete LaTeX code, starting with \\documentclass and ending with \\end{document}.
Make sure the code compiles without errors. Do not include any markdown formatting or explanatory text outside the LaTeX code.
Return ONLY the raw LaTeX code."""

    try:
        # Load and prepare the image
        with Image.open(image_path) as img:
            # Convert to RGB if necessary
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Generate content using Gemini
            response = model.generate_content([prompt, img])
            
            # Extract the generated LaTeX code
            latex_code = response.text.strip()
            
            # Clean up markdown code blocks if present
            if latex_code.startswith("```latex"):
                latex_code = latex_code[8:]
            elif latex_code.startswith("```"):
                latex_code = latex_code[3:]
            
            if latex_code.endswith("```"):
                latex_code = latex_code[:-3]
            
            latex_code = latex_code.strip()
            
            print("[SUCCESS] Successfully generated TikZ code using Gemini AI")
            return latex_code
            
    except Exception as e:
        print(f"Error generating diagram with Gemini: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


def main():
    """Command-line interface for standalone usage."""
    if len(sys.argv) < 2:
        print("Usage: python gemini_diagram.py <image_path> [output_path]")
        print("Example: python gemini_diagram.py diagram.png diagram.tex")
        sys.exit(1)
    
    # Get input and output paths
    image_path = sys.argv[1]
    
    # Default output to test_outputs folder
    if len(sys.argv) >= 3:
        output_path = sys.argv[2]
    else:
        test_outputs_dir = Path(__file__).parent.parent / "test_outputs"
        test_outputs_dir.mkdir(exist_ok=True)
        output_path = test_outputs_dir / f"{Path(image_path).stem}_gemini_diagram.tex"
    
    # Check if image exists
    if not os.path.exists(image_path):
        print(f"Error: Image file not found: {image_path}")
        sys.exit(1)
    
    print(f"Converting diagram: {image_path}")
    print("=" * 60)
    
    try:
        # Generate the TikZ code
        latex_code = create_latex_diagram(image_path)
        
        # Save to file
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(latex_code)
        
        print(f"[OK] LaTeX file saved to: {output_path}")
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
