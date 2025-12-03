import os
import sys
from mistralai import Mistral
from PIL import Image
from io import BytesIO
import base64
from dotenv import load_dotenv

# Load environment variables from parent directory
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(dotenv_path=env_path)

API_KEY = os.getenv("MISTRAL_API_KEY")
if not API_KEY:
    raise ValueError("Missing MISTRAL_API_KEY in .env file!")

# Initialize Mistral client
client = Mistral(api_key=API_KEY)

def _image_to_base64(image_path: str) -> str:
    """Load image and return base64 JPEG data URL string."""
    try:
        with Image.open(image_path) as img:
            if img.mode != "RGB":
                img = img.convert("RGB")
            buf = BytesIO()
            img.save(buf, format="JPEG")
            b64 = base64.b64encode(buf.getvalue()).decode("utf-8")
            return f"data:image/jpeg;base64,{b64}"
    except Exception as e:
        print(f"Image load/encode error: {e}", file=sys.stderr)
        raise


def convert_to_latex(file_path, model="pixtral-12b"):
    """
    Converts an equation/table image or PDF to LaTeX code using Mistral API.

    Args:
        file_path (str): Path to the image or PDF.
        model (str): Mistral model name. 'pixtral-12b' supports vision inputs.

    Returns:
        str: Generated LaTeX code
    """
    try:
        # Get absolute path
        abs_path = os.path.abspath(file_path)
        
        # Build base64 data URL for the image (avoid file:// which remote API cannot read)
        data_url = _image_to_base64(abs_path)

        # Send the file and prompt to the model
        response = client.chat.complete(
            model=model,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": r"""You are an expert LaTeX code generator. Convert the provided image to LaTeX code.

CRITICAL INSTRUCTIONS:
1. Analyze the image carefully to determine if it contains:
   - Mathematical equations/formulas
   - Tables with data
   - Mixed content

2. OUTPUT ONLY CODE (NO DOCUMENT WRAPPER):
   - Do NOT include \documentclass, \usepackage, \begin{document}, or \end{document}
   - Generate ONLY the actual table or equation code
   - Output should be ready to insert into an existing LaTeX document body

3. For EQUATIONS:
   - Use appropriate math environments (equation, align, gather, etc.)
   - Handle fractions, operators, limits, integrals, summations
   - Use proper subscripts, superscripts, and special symbols
   - Add text labels using \text{} when needed

4. For TABLES:
   - Use tabularx environment with \textwidth width for proper fitting
   - Column specification: Use |X| for flexible text columns, |c|/|l|/|r| for fixed columns
   - CRITICAL: Ensure total width fits within margins. Use X columns for long text to enable wrapping
   - Add borders using \hline (not \toprule, \midrule, \bottomrule)
   - Format cells with bold (\textbf), italic (\textit) as needed
   - Handle special characters properly

5. OUTPUT FORMAT:
   - Return ONLY the table/equation code
   - NO document preamble or wrapper
   - NO markdown code fences (no ```latex)
   - NO explanatory text or % comments
   - NO metadata or header comments
   - ONLY LaTeX code, ensure all commands are properly closed

Generate clean, compilable LaTeX code:"""
                        },
                        {
                            "type": "image_url",
                            "image_url": {"url": data_url},
                        },
                    ],
                }
            ],
        )

        # Extract LaTeX code from response (robust to SDK variations)
        msg = response.choices[0].message
        content = getattr(msg, "content", None)
        latex_code = None

        # content may be a string or a list of content blocks
        if isinstance(content, str):
            latex_code = content.strip()
        elif isinstance(content, list):
            # find first text block
            for block in content:
                if isinstance(block, dict) and block.get("type") in ("text", "output_text"):
                    t = block.get("text") or block.get("content")
                    if t:
                        latex_code = str(t).strip()
                        break
        if latex_code is None:
            # Try dict-style access used in user's original sample
            try:
                latex_code = msg["content"][0]["text"].strip()
            except Exception:
                pass

        if not latex_code:
            raise RuntimeError("Empty response content from Mistral API")
        
        # Clean up markdown code fences if present
        if latex_code.startswith("```latex"):
            latex_code = latex_code[8:]
        if latex_code.startswith("```"):
            latex_code = latex_code[3:]
        if latex_code.endswith("```"):
            latex_code = latex_code[:-3]
        
        # Remove document wrapper if present (we only want the content)
        import re
        
        # Extract content between \begin{document} and \end{document} if present
        doc_match = re.search(r'\\begin\{document\}(.*?)\\end\{document\}', latex_code, re.DOTALL)
        if doc_match:
            latex_code = doc_match.group(1).strip()
        
        # Remove any \documentclass, \usepackage, and other preamble commands
        latex_code = re.sub(r'\\documentclass.*?\n', '', latex_code)
        latex_code = re.sub(r'\\usepackage.*?\n', '', latex_code)
        latex_code = re.sub(r'\\begin\{document\}', '', latex_code)
        latex_code = re.sub(r'\\end\{document\}', '', latex_code)
        
        # Clean up any remaining whitespace
        latex_code = latex_code.strip()
        
        print("Conversion successful!")
        return latex_code

    except Exception as e:
        # Print to stderr so Django subprocess captures it
        print(f"Error during Mistral API call: {e}", file=sys.stderr)
        return None

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python convert_mistral.py <image_path>")
        sys.exit(1)

    image_path = sys.argv[1]
    
    if not os.path.exists(image_path):
        print(f"Error: File not found: {image_path}")
        sys.exit(1)

    # Convert image to LaTeX
    latex_output = convert_to_latex(image_path)
    
    if latex_output:
        # Save to output file with _mistral suffix
        base_name = os.path.splitext(image_path)[0]
        output_file = f"{base_name}_mistral.tex"
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(latex_output)
        
        print(f"LaTeX saved to: {output_file}")
    else:
        print("Conversion failed!")
        sys.exit(1)
