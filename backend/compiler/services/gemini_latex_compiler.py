import os
import re
import tempfile
from pathlib import Path
from typing import Dict, Any, List

try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False
    
try:
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.units import inch
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image as RLImage, PageBreak
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.enums import TA_CENTER, TA_LEFT
    REPORTLAB_AVAILABLE = True
except ImportError:
    REPORTLAB_AVAILABLE = False

from io import BytesIO
try:
    from PIL import Image as PILImage
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False


class GeminiLatexCompiler:
    def __init__(self):
        if not GEMINI_AVAILABLE:
            raise ImportError("google-generativeai is not installed. Run: pip install google-generativeai")
        
        if not REPORTLAB_AVAILABLE:
            raise ImportError("reportlab is not installed. Run: pip install reportlab")
        
        self.api_key = os.getenv('GEMINI_API_KEY')
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables. Please add it to your .env file")
        
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
    
    def extract_tikz_blocks(self, latex_content: str) -> List[Dict[str, Any]]:
        """Extract TikZ picture blocks from LaTeX content"""
        tikz_pattern = r'\\begin\{tikzpicture\}(.*?)\\end\{tikzpicture\}'
        matches = re.finditer(tikz_pattern, latex_content, re.DOTALL)
        
        tikz_blocks = []
        for idx, match in enumerate(matches):
            tikz_blocks.append({
                'id': f'tikz_{idx}',
                'content': match.group(0),
                'placeholder': f'__TIKZ_PLACEHOLDER_{idx}__'
            })
        
        # Replace TikZ blocks with placeholders
        processed_content = latex_content
        for block in tikz_blocks:
            processed_content = processed_content.replace(block['content'], block['placeholder'], 1)
        
        return tikz_blocks, processed_content
    
    def tikz_to_python(self, tikz_code: str) -> str:
        """Use Gemini to convert TikZ code to Python matplotlib code"""
        prompt = f"""Convert the following TikZ/LaTeX graphics code to Python matplotlib code that generates the same visual output.

TikZ Code:
{tikz_code}

Requirements:
1. Use matplotlib and numpy only
2. Return ONLY the Python code, no explanations
3. The code should create a figure and save it as PNG
4. Set figure size to (6, 6) inches
5. Use appropriate colors, line styles, and markers
6. Include all shapes, arrows, nodes, and text from the TikZ code
7. Set white background
8. Don't show the plot, only save it

Return Python code that starts with:
import matplotlib.pyplot as plt
import numpy as np
"""
        
        try:
            response = self.model.generate_content(prompt)
            python_code = response.text
            
            # Clean up the response to extract only code
            python_code = self._extract_code_from_response(python_code)
            
            return python_code
        except Exception as e:
            print(f"Gemini API error: {e}")
            return None
    
    def _extract_code_from_response(self, response: str) -> str:
        """Extract Python code from Gemini response"""
        # Remove markdown code blocks
        code = re.sub(r'```python\s*', '', response)
        code = re.sub(r'```\s*$', '', code)
        code = re.sub(r'^```\s*', '', code)
        
        return code.strip()
    
    def execute_python_code(self, python_code: str, output_path: str) -> bool:
        """Execute Python code to generate image"""
        try:
            # Import matplotlib here to avoid global imports
            import matplotlib
            matplotlib.use('Agg')  # Use non-interactive backend
            import matplotlib.pyplot as plt
            import numpy as np
            
            # Add save command if not present
            if 'savefig' not in python_code:
                python_code += f"\nplt.savefig('{output_path}', dpi=150, bbox_inches='tight', facecolor='white')\nplt.close()"
            else:
                # Replace any existing savefig with our path
                python_code = re.sub(
                    r"plt\.savefig\([^\)]+\)",
                    f"plt.savefig('{output_path}', dpi=150, bbox_inches='tight', facecolor='white')",
                    python_code
                )
            
            # Execute the code in a restricted environment
            exec_globals = {
                '__builtins__': __builtins__,
                'plt': plt,
                'np': np,
            }
            
            exec(python_code, exec_globals)
            plt.close('all')  # Clean up all figures
            
            return os.path.exists(output_path)
        except Exception as e:
            print(f"Python execution error: {e}")
            import traceback
            traceback.print_exc()
            return False
    
    def latex_to_html(self, latex_content: str) -> str:
        """Convert basic LaTeX to HTML"""
        html = latex_content
        
        # Extract document body
        doc_match = re.search(r'\\begin\{document\}(.*?)\\end\{document\}', html, re.DOTALL)
        if doc_match:
            html = doc_match.group(1)
        
        # Convert LaTeX commands to HTML
        conversions = [
            (r'\\documentclass.*?\n', ''),
            (r'\\usepackage\{.*?\}', ''),
            (r'\\title\{(.*?)\}', r'<h1>\1</h1>'),
            (r'\\author\{(.*?)\}', r'<p class="author">\1</p>'),
            (r'\\date\{(.*?)\}', r'<p class="date">\1</p>'),
            (r'\\maketitle', ''),
            (r'\\chapter\*?\{(.*?)\}', r'<h1>\1</h1>'),
            (r'\\section\*?\{(.*?)\}', r'<h2>\1</h2>'),
            (r'\\subsection\*?\{(.*?)\}', r'<h3>\1</h3>'),
            (r'\\subsubsection\*?\{(.*?)\}', r'<h4>\1</h4>'),
            (r'\\textbf\{(.*?)\}', r'<b>\1</b>'),
            (r'\\textit\{(.*?)\}', r'<i>\1</i>'),
            (r'\\emph\{(.*?)\}', r'<em>\1</em>'),
            (r'\\underline\{(.*?)\}', r'<u>\1</u>'),
            (r'\\\\', '<br>'),
            (r'\\par\b', '<br><br>'),
            (r'\\noindent\b', ''),
        ]
        
        for pattern, replacement in conversions:
            html = re.sub(pattern, replacement, html)
        
        return html
    
    def compile_to_pdf(self, latex_content: str, output_path: str) -> Dict[str, Any]:
        """Main compilation method"""
        try:
            # Extract TikZ blocks
            tikz_blocks, processed_content = self.extract_tikz_blocks(latex_content)
            
            # Convert each TikZ block to Python and execute
            temp_dir = tempfile.mkdtemp()
            tikz_images = {}
            
            for block in tikz_blocks:
                print(f"Processing {block['id']}...")
                
                # Convert TikZ to Python
                python_code = self.tikz_to_python(block['content'])
                
                if python_code:
                    # Execute Python to generate image
                    image_path = os.path.join(temp_dir, f"{block['id']}.png")
                    success = self.execute_python_code(python_code, image_path)
                    
                    if success:
                        tikz_images[block['placeholder']] = image_path
                    else:
                        print(f"Failed to execute Python for {block['id']}")
                else:
                    print(f"Failed to convert {block['id']} to Python")
            
            # Convert remaining LaTeX to HTML
            html_content = self.latex_to_html(processed_content)
            
            # Generate PDF with ReportLab
            self._create_pdf(html_content, tikz_images, output_path)
            
            return {
                'success': True,
                'output_path': output_path,
                'tikz_blocks_processed': len(tikz_images),
                'total_tikz_blocks': len(tikz_blocks)
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def _create_pdf(self, html_content: str, tikz_images: Dict[str, str], output_path: str):
        """Create PDF using ReportLab"""
        doc = SimpleDocTemplate(output_path, pagesize=A4)
        styles = getSampleStyleSheet()
        story = []
        
        # Split content by placeholders and paragraphs
        parts = re.split(r'(__TIKZ_PLACEHOLDER_\d+__)', html_content)
        
        for part in parts:
            part = part.strip()
            if not part:
                continue
            
            # Check if it's a TikZ placeholder
            if part.startswith('__TIKZ_PLACEHOLDER_'):
                if part in tikz_images:
                    img_path = tikz_images[part]
                    img = RLImage(img_path, width=5*inch, height=5*inch)
                    story.append(img)
                    story.append(Spacer(1, 0.2*inch))
            else:
                # Parse HTML tags and convert to ReportLab elements
                lines = part.split('<br>')
                for line in lines:
                    line = line.strip()
                    if not line:
                        continue
                    
                    # Detect heading level
                    if '<h1>' in line:
                        text = re.sub(r'<.*?>', '', line)
                        para = Paragraph(text, styles['Heading1'])
                        story.append(para)
                        story.append(Spacer(1, 0.2*inch))
                    elif '<h2>' in line:
                        text = re.sub(r'<.*?>', '', line)
                        para = Paragraph(text, styles['Heading2'])
                        story.append(para)
                        story.append(Spacer(1, 0.15*inch))
                    elif '<h3>' in line:
                        text = re.sub(r'<.*?>', '', line)
                        para = Paragraph(text, styles['Heading3'])
                        story.append(para)
                        story.append(Spacer(1, 0.1*inch))
                    else:
                        text = re.sub(r'<(?!b|i|u|em).*?>', '', line)
                        if text:
                            para = Paragraph(text, styles['Normal'])
                            story.append(para)
                            story.append(Spacer(1, 0.1*inch))
        
        doc.build(story)
