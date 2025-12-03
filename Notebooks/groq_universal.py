#!/usr/bin/env python3
"""
Universal Image to LaTeX Converter - Groq Vision API Version
Converts any image (equations, tables, diagrams) into complete LaTeX documents.
Uses Groq's vision-capable model with intelligent content detection.
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
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        print("Error: GROQ_API_KEY not found in environment variables")
        sys.exit(1)

    try:
        from groq import Groq
    except ImportError:
        print("Error: groq package not installed")
        print("Install it with: pip install groq")
        sys.exit(1)

    print("=" * 70)
    print("CONTENT TYPE DETECTION")
    print("=" * 70)
    print("Analyzing image to identify content types...")
    
    # Initialize Groq client
    client = Groq(api_key=api_key)

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
        # Convert image to base64 data URI
        with Image.open(image_path) as img:
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            buffered = BytesIO()
            img.save(buffered, format="JPEG")
            img_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
            data_uri = f"data:image/jpeg;base64,{img_base64}"
        
        response = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {"type": "image_url", "image_url": {"url": data_uri}},
                    ],
                }
            ],
            temperature=0.0,
        )
        
        detection_result = response.choices[0].message.content.strip()
        
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


def create_universal_latex(image_path: str, content_info: dict, mode: str = "mathjax") -> str:
    """
    Generates LaTeX code for any content type using Groq Vision API.
    
    Args:
        image_path: Path to the image file
        content_info: Dictionary with detected content information
        mode: Output mode - "mathjax" for web rendering or "compiler" for LaTeX compilation
        
    Returns:
        Generated LaTeX code as string
    """
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        print("Error: GROQ_API_KEY not found in environment variables")
        sys.exit(1)

    try:
        from groq import Groq
    except ImportError:
        print("Error: groq package not installed")
        sys.exit(1)

    print("=" * 70)
    print("GROQ UNIVERSAL LATEX CONVERTER")
    print("=" * 70)
    print(f"Primary Content Type: {content_info['primary'].upper()}")
    print(f"Contains Equations: {'Yes' if content_info['has_equations'] else 'No'}")
    print(f"Contains Tables: {'Yes' if content_info['has_tables'] else 'No'}")
    print(f"Contains Diagrams: {'Yes' if content_info['has_diagrams'] else 'No'}")
    print("=" * 70)
    print("Generating LaTeX code...")
    print("=" * 70)

    # Initialize Groq client
    client = Groq(api_key=api_key)

    # Build customized prompt based on mode
    if mode == "compiler":
        # Full LaTeX document for compilation
        prompt = f"""Convert this image to a complete, compilable LaTeX document. The image contains:
- Equations: {"YES" if content_info['has_equations'] else "NO"}
- Tables: {"YES" if content_info['has_tables'] else "NO"}
- Diagrams: {"YES" if content_info['has_diagrams'] else "NO"}

CRITICAL REQUIREMENTS:

1. DOCUMENT STRUCTURE:
   - Start with \\documentclass{{article}} or \\documentclass{{standalone}}
   - Include ALL necessary packages (amsmath, amssymb, amsfonts, array, tabularx, tikz, etc.)
   - Use \\begin{{document}} and \\end{{document}}

2. FOR EQUATIONS (if present):
   - Use appropriate math environments: equation, align, gather
   - Proper LaTeX commands: \\frac, \\sum, \\int, \\sqrt, etc.
   - Include amsmath, amssymb, amsfonts packages

3. FOR TABLES (if present):
   - Use tabularx or tabular environment
   - Include array, tabularx packages
   - Use \\hline for borders

4. FOR DIAGRAMS (if present):
   - Use TikZ with necessary libraries
   - Include \\usepackage{{tikz}}

5. OUTPUT FORMAT:
   - Complete compilable document
   - NO markdown blocks (no ```)
   - NO % comments
   - Start with \\documentclass

Generate the complete LaTeX document now:"""
    else:
        # MathJax mode - raw content only
        prompt = f"""Convert this image to LaTeX code for MathJax rendering. The image contains:
- Equations: {"YES" if content_info['has_equations'] else "NO"}
- Tables: {"YES" if content_info['has_tables'] else "NO"}
- Diagrams: {"YES" if content_info['has_diagrams'] else "NO"}

CRITICAL REQUIREMENTS:

1. OUTPUT ONLY THE CONTENT CODE:
   - Do NOT include \\documentclass, \\usepackage, \\begin{{document}}, or \\end{{document}}
   - Output ONLY the actual equation/table/diagram code
   - This will be rendered by MathJax in a web browser

2. FOR EQUATIONS (if present):
   - Use appropriate math environments: equation, align, gather
   - For display equations: \\[ ... \\] or \\begin{{equation}} ... \\end{{equation}}
   - For inline math: $ ... $
   - Proper LaTeX commands: \\frac, \\sum, \\int, \\sqrt, \\log, \\sin, \\cos, etc.
   - Handle subscripts with _{{}} and superscripts with ^{{}}
   - Use \\text{{}} for text within equations

3. FOR TABLES (if present):
   - Use array environment for math tables: \\begin{{array}}{{|c|c|c|}} ... \\end{{array}}
   - OR use \\begin{{tabular}}{{|c|c|c|}} ... \\end{{tabular}}
   - Include \\hline for horizontal lines
   - Use \\textbf{{}} for bold headers
   - Proper column alignment: c (center), l (left), r (right)

4. FOR DIAGRAMS (if present):
   - Describe the diagram structure as a formatted table or text representation
   - Use nested arrays or aligned environments
   - Do NOT use TikZ (not supported by MathJax)

5. OUTPUT FORMAT:
   - Return ONLY the raw LaTeX code for the content
   - NO document wrapper or preamble
   - NO markdown code blocks (no ```)
   - NO % comments
   - NO \\documentclass, \\usepackage, \\begin{{document}}, \\end{{document}}
   - Start directly with the equation/table/diagram code

Generate clean LaTeX code for MathJax now:"""

    try:
        # Convert image to base64 data URI
        with Image.open(image_path) as img:
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            buffered = BytesIO()
            img.save(buffered, format="JPEG")
            img_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
            data_uri = f"data:image/jpeg;base64,{img_base64}"
        
        response = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {"type": "image_url", "image_url": {"url": data_uri}},
                    ],
                }
            ],
            temperature=0.0,
        )
        
        latex_code = response.choices[0].message.content.strip()
        
        # Clean up markdown code blocks if present
        if latex_code.startswith("```latex"):
            latex_code = latex_code[8:]
        elif latex_code.startswith("```"):
            latex_code = latex_code[3:]
        
        if latex_code.endswith("```"):
            latex_code = latex_code[:-3]
        
        latex_code = latex_code.strip()
        
        print("[SUCCESS] Successfully generated LaTeX code")
        return latex_code
        
    except Exception as e:
        print(f"Error generating LaTeX with Groq: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


def main():
    """Command-line interface for standalone usage."""
    if len(sys.argv) < 2:
        print("Usage: python groq_universal.py <image_path> [output_path] [mode]")
        print("Example: python groq_universal.py myimage.png output.tex")
        print("         python groq_universal.py myimage.png output.tex compiler")
        print("\nModes:")
        print("  mathjax (default) - Raw LaTeX for web rendering")
        print("  compiler - Full document for LaTeX compilation")
        print("\nThis script automatically detects and converts:")
        print("  - Mathematical equations")
        print("  - Tables with data")
        print("  - Diagrams and flowcharts")
        print("  - Mixed content (any combination)")
        sys.exit(1)
    
    # Get input and output paths
    image_path = sys.argv[1]
    
    # Get mode (default: mathjax)
    mode = "mathjax"
    if len(sys.argv) >= 4:
        mode = sys.argv[3].lower()
        if mode not in ["mathjax", "compiler"]:
            print(f"Invalid mode: {mode}. Using 'mathjax' as default.")
            mode = "mathjax"
    
    # Default output to test_outputs folder
    if len(sys.argv) >= 3:
        output_path = sys.argv[2]
    else:
        test_outputs_dir = Path(__file__).parent.parent / "test_outputs"
        test_outputs_dir.mkdir(exist_ok=True)
        output_path = test_outputs_dir / f"{Path(image_path).stem}_groq_universal.tex"
    
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
        print(f"Output mode: {mode.upper()}")
        latex_code = create_universal_latex(image_path, content_info, mode)
        
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
