#!/usr/bin/env python3
"""
Universal Image to LaTeX Converter - Gemini Vision API Version
Converts any image (equations, tables, diagrams) into complete LaTeX documents.
Uses Google's Gemini 2.0 Flash vision model with intelligent content detection.
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


def detect_content_type(image_path: str) -> dict:
    """
    Analyze image to detect content types (equation, table, diagram, or mixed).
    
    Args:
        image_path: Path to the image file
        
    Returns:
        Dictionary with content type and confidence
    """
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("Error: GOOGLE_API_KEY not found in environment variables")
        sys.exit(1)

    try:
        import google.generativeai as genai
    except ImportError:
        print("Error: google-generativeai package not installed")
        print("Install it with: pip install google-generativeai")
        sys.exit(1)

    print("=" * 70)
    print("CONTENT TYPE DETECTION")
    print("=" * 70)
    print("Analyzing image to identify content types...")
    
    # Configure Gemini
    genai.configure(api_key=api_key)
    # Use gemini-2.5-flash - stable version with good quota
    model = genai.GenerativeModel('gemini-2.5-flash')

    # Detection prompt
    prompt = """Analyze this image and identify ALL content types present. Respond in the following format:

CONTENT DETECTED:
- [X] EQUATIONS: (Yes/No) - Mathematical formulas, expressions, or calculations
- [X] TABLES: (Yes/No) - Tabular data with rows and columns
- [X] DIAGRAMS: (Yes/No) - Flowcharts, block diagrams, network diagrams, or visual representations

PRIMARY TYPE: (EQUATION/TABLE/DIAGRAM/MIXED)
CONFIDENCE: (HIGH/MEDIUM/LOW)

Be precise and identify all content types present in the image."""

    try:
        with Image.open(image_path) as img:
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            response = model.generate_content([prompt, img])
            detection_result = response.text.strip()
            
            print(detection_result)
            print("=" * 70)
            
            # Parse the response
            has_equations = "EQUATIONS: Yes" in detection_result or "EQUATIONS: (Yes)" in detection_result
            has_tables = "TABLES: Yes" in detection_result or "TABLES: (Yes)" in detection_result
            has_diagrams = "DIAGRAMS: Yes" in detection_result or "DIAGRAMS: (Yes)" in detection_result
            
            # Determine primary type
            if "PRIMARY TYPE: EQUATION" in detection_result:
                primary = "equation"
            elif "PRIMARY TYPE: TABLE" in detection_result:
                primary = "table"
            elif "PRIMARY TYPE: DIAGRAM" in detection_result:
                primary = "diagram"
            else:
                primary = "mixed"
            
            return {
                'primary': primary,
                'has_equations': has_equations,
                'has_tables': has_tables,
                'has_diagrams': has_diagrams,
                'raw_response': detection_result
            }
            
    except Exception as e:
        print(f"Error detecting content type: {e}")
        return {
            'primary': 'unknown',
            'has_equations': False,
            'has_tables': False,
            'has_diagrams': False,
            'raw_response': str(e)
        }


def create_universal_latex(image_path: str, content_info: dict) -> str:
    """
    Generates complete LaTeX document for any content type using Gemini Vision API.
    
    Args:
        image_path: Path to the image file
        content_info: Dictionary with detected content information
        
    Returns:
        Generated LaTeX code as string
    """
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("Error: GOOGLE_API_KEY not found in environment variables")
        sys.exit(1)

    try:
        import google.generativeai as genai
    except ImportError:
        print("Error: google-generativeai package not installed")
        sys.exit(1)

    print("=" * 70)
    print("GEMINI UNIVERSAL LATEX CONVERTER")
    print("=" * 70)
    print(f"Primary Content Type: {content_info['primary'].upper()}")
    print(f"Contains Equations: {'Yes' if content_info['has_equations'] else 'No'}")
    print(f"Contains Tables: {'Yes' if content_info['has_tables'] else 'No'}")
    print(f"Contains Diagrams: {'Yes' if content_info['has_diagrams'] else 'No'}")
    print("=" * 70)
    print("Generating LaTeX code...")
    print("=" * 70)

    # Configure Gemini
    genai.configure(api_key=api_key)
    # Use gemini-2.5-flash - stable version with good quota
    model = genai.GenerativeModel('gemini-2.5-flash')

    # Build customized prompt based on content type
    prompt = f"""Convert this image to a complete, compilable LaTeX document. The image contains:
- Equations: {"YES" if content_info['has_equations'] else "NO"}
- Tables: {"YES" if content_info['has_tables'] else "NO"}
- Diagrams: {"YES" if content_info['has_diagrams'] else "NO"}

CRITICAL REQUIREMENTS:

1. DOCUMENT STRUCTURE:
   - Start with \\documentclass{{article}} or \\documentclass{{standalone}}
   - Include ALL necessary packages
   - End with \\end{{document}}

2. FOR EQUATIONS (if present):
   - Use appropriate math environments: equation, align, gather
   - Proper LaTeX commands for symbols: \\frac, \\sum, \\int, \\sqrt, etc.
   - Handle subscripts with _{{}} and superscripts with ^{{}}
   - Use amsmath, amssymb, amsfonts packages

3. FOR TABLES (if present):
   - Use tabularx environment with width \\textwidth
   - Include array, tabularx, booktabs packages
   - Proper column specifications: |X|c|l|r|
   - All horizontal lines with \\hline
   - Bold headers with \\textbf{{}}
   - Use geometry package for wide tables: \\usepackage[margin=1cm]{{geometry}}

4. FOR DIAGRAMS (if present):
   - Use TikZ with all necessary libraries
   - Include \\usepackage{{tikz}} and \\usetikzlibrary{{shapes,arrows,positioning}}
   - Identify all shapes, connections, and labels
   - Preserve colors, positions, and styles
   - Use standalone class for diagrams: \\documentclass{{standalone}}

5. MIXED CONTENT:
   - Clearly separate different content types with sections/comments
   - Maintain logical order from the image
   - Use appropriate environments for each part

6. OUTPUT FORMAT:
   - Generate ONLY raw LaTeX code
   - No markdown code blocks (no ```latex)
   - No explanatory text outside LaTeX comments
   - Code must compile without errors

Generate the complete, compilable LaTeX document now:"""

    try:
        with Image.open(image_path) as img:
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            response = model.generate_content([prompt, img])
            latex_code = response.text.strip()
            
            # Clean up markdown code blocks if present
            if latex_code.startswith("```latex"):
                latex_code = latex_code[8:]
            elif latex_code.startswith("```"):
                latex_code = latex_code[3:]
            
            if latex_code.endswith("```"):
                latex_code = latex_code[:-3]
            
            latex_code = latex_code.strip()
            
            # Add identification comment at the top
            content_labels = []
            if content_info['has_equations']:
                content_labels.append("EQUATIONS")
            if content_info['has_tables']:
                content_labels.append("TABLES")
            if content_info['has_diagrams']:
                content_labels.append("DIAGRAMS")
            
            content_header = f"% Generated by Gemini Universal Converter\n"
            content_header += f"% Content Detected: {', '.join(content_labels)}\n"
            content_header += f"% Primary Type: {content_info['primary'].upper()}\n"
            content_header += "% " + "=" * 60 + "\n\n"
            
            # Insert header after documentclass line
            lines = latex_code.split('\n')
            for i, line in enumerate(lines):
                if line.strip().startswith('\\documentclass'):
                    lines.insert(i + 1, content_header)
                    break
            else:
                # If no documentclass found, add at the beginning
                latex_code = content_header + latex_code
                lines = latex_code.split('\n')
            
            latex_code = '\n'.join(lines)
            
            print("[SUCCESS] Successfully generated LaTeX code")
            print(f"[INFO] Content types processed: {', '.join(content_labels)}")
            return latex_code
            
    except Exception as e:
        print(f"Error generating LaTeX with Gemini: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


def main():
    """Command-line interface for standalone usage."""
    if len(sys.argv) < 2:
        print("Usage: python gemini_universal.py <image_path> [output_path]")
        print("Example: python gemini_universal.py myimage.png output.tex")
        print("\nThis script automatically detects and converts:")
        print("  - Mathematical equations")
        print("  - Tables with data")
        print("  - Diagrams and flowcharts")
        print("  - Mixed content (any combination)")
        sys.exit(1)
    
    # Get input and output paths
    image_path = sys.argv[1]
    
    # Default output to test_outputs folder
    if len(sys.argv) >= 3:
        output_path = sys.argv[2]
    else:
        test_outputs_dir = Path(__file__).parent.parent / "test_outputs"
        test_outputs_dir.mkdir(exist_ok=True)
        output_path = test_outputs_dir / f"{Path(image_path).stem}_gemini_universal.tex"
    
    # Check if image exists
    if not os.path.exists(image_path):
        print(f"Error: Image file not found: {image_path}")
        sys.exit(1)
    
    print(f"Processing image: {image_path}")
    print("=" * 70)
    
    try:
        # Step 1: Detect content type
        content_info = detect_content_type(image_path)
        
        # Step 2: Generate LaTeX based on content
        latex_code = create_universal_latex(image_path, content_info)
        
        # Step 3: Save to file
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(latex_code)
        
        print("=" * 70)
        print(f"[OK] LaTeX file saved to: {output_path}")
        print("=" * 70)
        print("Conversion complete!")
        print(f"\nTo compile the LaTeX document:")
        print(f"  pdflatex {output_path}")
        print(f"\nOr use online compiler: https://www.overleaf.com/")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
