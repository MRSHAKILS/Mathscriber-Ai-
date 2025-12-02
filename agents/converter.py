"""
ConverterAgent: Converts images to appropriate format based on classified type.
- Equations → LaTeX format
- Tables → Markdown or HTML table
- Diagrams → Mermaid diagram or structured description
"""

import os
import base64
from typing import Dict
from .state import ScribbleState

# Import necessary AI libraries
try:
    import google.generativeai as genai
    from dotenv import load_dotenv
    load_dotenv()
    GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
    if GOOGLE_API_KEY:
        genai.configure(api_key=GOOGLE_API_KEY)
except ImportError:
    print("Warning: google-generativeai not installed")


async def convert_scribble(state: ScribbleState) -> Dict:
    """
    Convert the scribble image to the appropriate format based on its type.
    
    Args:
        state: Current workflow state containing image and classification
        
    Returns:
        Dict with converted_output
    """
    try:
        scribble_type = state.get("scribble_type", "unknown")
        image_path = state.get("image_path")
        image_data = state.get("image_data")
        feedback = state.get("feedback", "")
        retry_count = state.get("retry_count", 0)
        
        if scribble_type == "unknown":
            return {
                "converted_output": "",
                "errors": state.get("errors", []) + ["Cannot convert unknown scribble type"],
                "status": "error"
            }
        
        # Read image
        if image_path and os.path.exists(image_path):
            with open(image_path, 'rb') as f:
                image_bytes = f.read()
        else:
            try:
                image_bytes = base64.b64decode(image_data)
            except Exception as e:
                return {
                    "converted_output": "",
                    "errors": state.get("errors", []) + [f"Failed to decode image: {str(e)}"],
                    "status": "error"
                }
        
        # Prepare image for model
        import PIL.Image
        import io
        pil_image = PIL.Image.open(io.BytesIO(image_bytes))
        
        # Use Gemini for conversion
        model = genai.GenerativeModel('gemini-2.0-flash')
        
        # Type-specific prompts
        if scribble_type == "equation":
            conversion_prompt = """
Convert the mathematical equation/formula in this image to clean LaTeX code.

Requirements:
- Provide ONLY the raw LaTeX code without any delimiters (no $$, $, \\[, \\], etc.)
- Do NOT wrap the output in brackets, parentheses, or any extra symbols
- Use proper LaTeX syntax (\\frac{}{}, \\sqrt{}, \\sum, \\int, \\alpha, \\beta, etc.)
- Preserve all mathematical notation accurately
- For simple inline equations, provide just the expression
- For complex equations, provide the equation without surrounding delimiters

Example:
Image shows: x = (-b ± √(b²-4ac)) / 2a
Output: x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}

Do NOT output: $$x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$$

"""
            if feedback and retry_count > 0:
                conversion_prompt += f"\n\nPrevious attempt had issues. Feedback: {feedback}\nPlease address these issues in this conversion."
        
        elif scribble_type == "table":
            conversion_prompt = """
Convert the table in this image to LaTeX table format.

Requirements:
- Use LaTeX tabular environment
- Provide ONLY the table content without \\begin{document} or \\end{document}
- Preserve all data accurately including headers
- Use proper column alignment (l, c, r)
- Include \\hline for horizontal lines if present in the image
- Format numbers and text appropriately

Example format:
\\begin{tabular}{|c|c|c|}
\\hline
Header 1 & Header 2 & Header 3 \\\\
\\hline
Data 1 & Data 2 & Data 3 \\\\
Data 4 & Data 5 & Data 6 \\\\
\\hline
\\end{tabular}

"""
            if feedback and retry_count > 0:
                conversion_prompt += f"\n\nPrevious attempt had issues. Feedback: {feedback}\nPlease address these issues in this conversion."
        
        elif scribble_type == "diagram":
            conversion_prompt = """
Convert the diagram/flowchart in this image to LaTeX TikZ code.

Requirements:
- Use TikZ package syntax for drawing
- Provide ONLY the tikzpicture environment content without \\begin{document} or \\end{document}
- Preserve the structure and relationships from the image
- Include all nodes, shapes, and connections
- Use appropriate TikZ shapes (rectangle, circle, ellipse, diamond, etc.)
- Add arrows and labels accurately
- Use proper positioning

Example format:
\\begin{tikzpicture}[node distance=2cm]
\\node (start) [rectangle, draw] {Start};
\\node (process) [rectangle, draw, below of=start] {Process};
\\node (decision) [diamond, draw, below of=process] {Decision};
\\node (end) [rectangle, draw, below of=decision] {End};
\\draw[->] (start) -- (process);
\\draw[->] (process) -- (decision);
\\draw[->] (decision) -- node[right] {Yes} (end);
\\end{tikzpicture}

If the diagram is too complex for TikZ, provide a structured textual description in LaTeX format with:
- \\textbf{Main components}
- \\textit{Relationships}
- Proper formatting

"""
            if feedback and retry_count > 0:
                conversion_prompt += f"\n\nPrevious attempt had issues. Feedback: {feedback}\nPlease address these issues in this conversion."
        
        else:
            conversion_prompt = "Convert the content of this image to an appropriate text format."
        
        # Generate conversion
        response = model.generate_content([conversion_prompt, pil_image])
        converted_output = response.text.strip()
        
        # Clean up code blocks if present - remove markdown wrappers
        # Remove any markdown code block delimiters
        converted_output = converted_output.replace("```latex", "").replace("```tex", "").replace("```tikz", "").replace("```", "").strip()
        
        # Remove math delimiters if accidentally added ($$, $, \[, \])
        if scribble_type == "equation":
            # Remove display math delimiters
            if converted_output.startswith("$$") and converted_output.endswith("$$"):
                converted_output = converted_output[2:-2].strip()
            elif converted_output.startswith("$") and converted_output.endswith("$"):
                converted_output = converted_output[1:-1].strip()
            elif converted_output.startswith("\\[") and converted_output.endswith("\\]"):
                converted_output = converted_output[2:-2].strip()
            elif converted_output.startswith("(") and converted_output.endswith(")"):
                # Only remove outer parentheses if they seem to be wrappers, not part of the equation
                inner = converted_output[1:-1].strip()
                if not any(op in inner[:5] for op in ["frac", "sqrt", "sum", "int"]):
                    # Likely wrapper parentheses
                    converted_output = inner
        
        retry_msg = f" (Retry {retry_count})" if retry_count > 0 else ""
        print(f"✅ Converted {scribble_type} to output{retry_msg}")
        print(f"   Output preview: {converted_output[:100]}...")
        
        return {
            "converted_output": converted_output,
            "status": "converted",
            "model_used": f"gemini-2.0-flash ({scribble_type.capitalize()} Converter)"
        }
        
    except Exception as e:
        error_msg = f"Conversion error: {str(e)}"
        print(f"❌ {error_msg}")
        errors = state.get("errors", [])
        errors.append(error_msg)
        
        return {
            "converted_output": "",
            "errors": errors,
            "status": "error"
        }


def convert_scribble_sync(state: ScribbleState) -> Dict:
    """
    Synchronous wrapper for convert_scribble.
    """
    import asyncio
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    
    return loop.run_until_complete(convert_scribble(state))
