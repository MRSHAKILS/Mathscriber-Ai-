"""
LaTeX Converter using Google Gemini API - Universal Approach
Automatically detects content type and converts equations, tables, diagrams, or mixed content
Based on gemini_universal.py from notebooks
"""
import os
from io import BytesIO
from PIL import Image
import google.generativeai as genai
from django.conf import settings


class GeminiConverter:
    """Handles conversion of images to LaTeX using Google Gemini Vision API with universal detection"""
    
    def __init__(self):
        """Initialize Gemini API with API key"""
        api_key = os.getenv('GOOGLE_API_KEY') or getattr(settings, 'GEMINI_API_KEY', None)
        
        if not api_key:
            raise ValueError("GOOGLE_API_KEY not found in environment variables. Please set it in backend/.env")
        
        genai.configure(api_key=api_key)
        # Use gemini-2.0-flash for vision tasks (stable with good quota)
        self.model = genai.GenerativeModel('gemini-2.0-flash')

    def detect_content_type(self, image):
        """
        Analyze image to detect content types (equation, table, diagram, or mixed).
        Uses universal detection approach from gemini_universal.py
        
        Args:
            image: PIL Image object
            
        Returns:
            Dictionary with content type and confidence
        """
        prompt = """Analyze this image and identify ALL content types present. Respond in the following format:

CONTENT DETECTED:
- EQUATIONS: (Yes/No) - Mathematical formulas, expressions, or calculations
- TABLES: (Yes/No) - Tabular data with rows and columns
- DIAGRAMS: (Yes/No) - Flowcharts, block diagrams, network diagrams, or visual representations

PRIMARY TYPE: (EQUATION/TABLE/DIAGRAM/MIXED)
CONFIDENCE: (HIGH/MEDIUM/LOW)

Be precise and identify all content types present in the image."""

        try:
            response = self.model.generate_content([prompt, image])
            detection_result = response.text.strip()
            
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
            return {
                'primary': 'unknown',
                'has_equations': False,
                'has_tables': False,
                'has_diagrams': False,
                'raw_response': str(e)
            }

    def convert_image_to_latex(self, image_file, task_type='auto'):
        """
        Universal converter that detects content and generates complete LaTeX.
        Based on gemini_universal.py - works for ALL content types.
        
        Args:
            image_file: Django UploadedFile object
            task_type: Type of conversion - 'equation', 'table', 'diagram', or 'auto'
            
        Returns:
            str: Complete LaTeX code ready to compile
        """
        try:
            # Open image using PIL
            image = Image.open(image_file)
            
            # Convert to RGB if necessary
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Detect content type (always detect for best results)
            content_info = self.detect_content_type(image)
            
            # Override detection if user specified a task type
            if task_type != 'auto':
                content_info['primary'] = task_type
                content_info['has_equations'] = task_type == 'equation'
                content_info['has_tables'] = task_type == 'table'
                content_info['has_diagrams'] = task_type == 'diagram'
            
            # Use universal converter for all types
            latex_code = self._create_universal_latex(image, content_info)
            
            return latex_code
            
        except Exception as e:
            raise Exception(f"Error processing image with Gemini: {str(e)}")

    def _create_universal_latex(self, image, content_info):
        """
        Universal LaTeX generator - works for ALL content types.
        Based on gemini_universal.py create_universal_latex function.
        
        Args:
            image: PIL Image object
            content_info: Dictionary with detected content information
            
        Returns:
            Complete, compilable LaTeX document
        """
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
            response = self.model.generate_content([prompt, image])
            latex_code = response.text.strip()
            
            # Clean up markdown code blocks if present
            latex_code = self._clean_latex_output(latex_code)
            
            # Add identification comment at the top
            content_labels = []
            if content_info['has_equations']:
                content_labels.append("EQUATIONS")
            if content_info['has_tables']:
                content_labels.append("TABLES")
            if content_info['has_diagrams']:
                content_labels.append("DIAGRAMS")
            
            content_header = f"% Generated by MathScriber AI - Universal Converter\n"
            content_header += f"% Content Detected: {', '.join(content_labels) if content_labels else 'UNKNOWN'}\n"
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
            
            return latex_code
            
        except Exception as e:
            raise Exception(f"Error generating universal LaTeX: {str(e)}")

    def _clean_latex_output(self, text):
        """Clean up the LaTeX output by removing markdown code blocks"""
        latex_code = text.strip()
        
        # Remove markdown code blocks if present
        if latex_code.startswith("```latex"):
            latex_code = latex_code[8:]
        elif latex_code.startswith("```"):
            latex_code = latex_code[3:]
        
        if latex_code.endswith("```"):
            latex_code = latex_code[:-3]
        
        return latex_code.strip()
