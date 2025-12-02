"""
Gemini API integration for converting images to LaTeX
Universal converter supporting equations, tables, and diagrams
"""
import google.generativeai as genai
from django.conf import settings
from PIL import Image
import io


class GeminiConverter:
    """Handles conversion of images to LaTeX using Gemini API"""
    
    def __init__(self):
        """Initialize Gemini API with API key"""
        api_key = settings.GEMINI_API_KEY
        if not api_key:
            raise ValueError("GOOGLE_API_KEY not found in environment variables. Please set it in backend/.env")
        
        genai.configure(api_key=api_key)
        # Use gemini-2.0-flash for better performance
        self.model = genai.GenerativeModel('gemini-2.0-flash')
    
    def detect_content_type(self, image):
        """
        Analyze image to detect content types (equation, table, diagram, or mixed).
        
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
        Convert an uploaded image to LaTeX code
        
        Args:
            image_file: Django UploadedFile object
            task_type: Type of conversion - 'equation', 'table', 'diagram', or 'auto'
            
        Returns:
            str: LaTeX code extracted from the image
        """
        try:
            # Open image using PIL
            image = Image.open(image_file)
            
            # Convert to RGB if necessary
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # If auto, detect content type first
            if task_type == 'auto' or task_type == 'equation':
                content_info = self.detect_content_type(image)
            else:
                # Set content info based on task type
                content_info = {
                    'primary': task_type,
                    'has_equations': task_type == 'equation',
                    'has_tables': task_type == 'table',
                    'has_diagrams': task_type == 'diagram',
                }
            
            # Generate LaTeX based on task type
            if task_type == 'equation' or (task_type == 'auto' and content_info['primary'] == 'equation'):
                return self._convert_equation(image)
            elif task_type == 'table' or (task_type == 'auto' and content_info['primary'] == 'table'):
                return self._convert_table(image)
            elif task_type == 'diagram' or (task_type == 'auto' and content_info['primary'] == 'diagram'):
                return self._convert_diagram(image)
            else:
                # Universal conversion for mixed or unknown content
                return self._convert_universal(image, content_info)
            
        except Exception as e:
            raise Exception(f"Error processing image with Gemini: {str(e)}")

    def _convert_equation(self, image):
        """Convert equation image to LaTeX"""
        prompt = """You are an expert at converting mathematical equations from images into LaTeX code.

Analyze this image and convert the mathematical content into clean, properly formatted LaTeX code.

REQUIREMENTS:
1. Use appropriate math environments: equation, align, or inline math ($...$)
2. Use proper LaTeX commands for all symbols: \\frac, \\sum, \\int, \\sqrt, \\alpha, \\beta, etc.
3. Handle subscripts with _{} and superscripts with ^{}
4. For multi-line equations, use align environment with & for alignment
5. Include \\usepackage{amsmath, amssymb, amsfonts} if needed

OUTPUT FORMAT:
- Return ONLY the LaTeX code
- No markdown code blocks (no ```latex)
- No explanatory text
- Code should be ready to use in a LaTeX document

Convert the equation now:"""

        response = self.model.generate_content([prompt, image])
        return self._clean_latex_output(response.text)

    def _convert_table(self, image):
        """Convert table image to LaTeX"""
        prompt = """You are an expert at converting tables from images into LaTeX code.

Analyze this image and convert the table into clean, properly formatted LaTeX code.

REQUIREMENTS:
1. Use tabular or tabularx environment
2. Include proper column specifications: |c|l|r|X|
3. Add horizontal lines with \\hline or \\toprule, \\midrule, \\bottomrule
4. Bold headers with \\textbf{}
5. Preserve all data accurately
6. Handle merged cells if present with \\multicolumn or \\multirow

OUTPUT FORMAT:
- Return ONLY the LaTeX code
- Include necessary packages: array, tabularx, booktabs
- No markdown code blocks
- No explanatory text
- Code should be complete and compilable

Example structure:
\\begin{tabular}{|c|c|c|}
\\hline
\\textbf{Header1} & \\textbf{Header2} & \\textbf{Header3} \\\\
\\hline
data1 & data2 & data3 \\\\
\\hline
\\end{tabular}

Convert the table now:"""

        response = self.model.generate_content([prompt, image])
        return self._clean_latex_output(response.text)

    def _convert_diagram(self, image):
        """Convert diagram image to LaTeX TikZ"""
        prompt = """You are an expert at converting diagrams and flowcharts from images into LaTeX TikZ code.

Analyze this image and convert the diagram into clean, properly formatted TikZ code.

REQUIREMENTS:
1. Use TikZ with appropriate libraries: shapes, arrows, positioning
2. Identify all shapes (rectangles, circles, diamonds, etc.)
3. Preserve connections and arrows between shapes
4. Include all labels and text
5. Maintain relative positions and layout
6. Use appropriate styles for different element types

OUTPUT FORMAT:
- Return ONLY the LaTeX/TikZ code
- Include: \\usepackage{tikz} and \\usetikzlibrary{...}
- No markdown code blocks
- No explanatory text
- Code should be complete and compilable

Example structure:
\\begin{tikzpicture}[node distance=2cm]
\\node[rectangle, draw] (start) {Start};
\\node[rectangle, draw, below of=start] (process) {Process};
\\draw[->] (start) -- (process);
\\end{tikzpicture}

Convert the diagram now:"""

        response = self.model.generate_content([prompt, image])
        return self._clean_latex_output(response.text)

    def _convert_universal(self, image, content_info):
        """Universal conversion for mixed or unknown content"""
        content_parts = []
        if content_info.get('has_equations'):
            content_parts.append("EQUATIONS")
        if content_info.get('has_tables'):
            content_parts.append("TABLES")
        if content_info.get('has_diagrams'):
            content_parts.append("DIAGRAMS")
        
        content_str = ", ".join(content_parts) if content_parts else "UNKNOWN"
        
        prompt = f"""You are an expert at converting images containing mathematical content into LaTeX code.

This image contains: {content_str}

Analyze this image and convert ALL content into clean, properly formatted LaTeX code.

REQUIREMENTS:
1. For EQUATIONS: Use proper math environments (equation, align, $...$)
2. For TABLES: Use tabular/tabularx with proper formatting
3. For DIAGRAMS: Use TikZ with appropriate libraries
4. Include ALL necessary packages
5. Preserve the structure and order from the image

OUTPUT FORMAT:
- Return ONLY the LaTeX code
- No markdown code blocks (no ```latex or ```)
- No explanatory text outside LaTeX comments
- Code should be complete and ready to use
- If multiple content types, separate with LaTeX comments

Convert the content now:"""

        response = self.model.generate_content([prompt, image])
        return self._clean_latex_output(response.text)

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
