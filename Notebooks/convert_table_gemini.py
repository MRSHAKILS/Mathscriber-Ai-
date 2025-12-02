import sys
import base64
import os
from PIL import Image
from io import BytesIO
from dotenv import load_dotenv
from langchain_core.messages import HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI

# Load environment variables from .env file in parent directory
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(env_path)

def image_to_base64(image_path: str) -> str:
    """Converts an image file to a base64 encoded string."""
    try:
        with Image.open(image_path) as img:
            if img.mode != 'RGB':
                img = img.convert('RGB')
            buffered = BytesIO()
            img.save(buffered, format="JPEG")
            return base64.b64encode(buffered.getvalue()).decode('utf-8')
    except Exception as e:
        print(f"Error processing image: {e}")
        sys.exit(1)

def create_latex_standalone(image_path: str) -> str:
    """
    Generates a complete, standalone, and compilable LaTeX document for a table or equation image.
    """
    # Use the configured Google generative model.
    llm = ChatGoogleGenerativeAI(model="gemini-2.5-pro")
    
    b64_image = image_to_base64(image_path)

    # --- PROMPT: describe the expected LaTeX output and include the image ---
    # Note: raw string used so backslashes in LaTeX are preserved and won't cause unicode escape errors.
    prompt_text = r"""
    You are a precision LaTeX code generator. Convert the provided image to LaTeX code.

    CRITICAL INSTRUCTIONS:

    1.  Analyze the Image: Determine if it contains:
        - A TABLE (tabular data with rows and columns)
        - EQUATIONS/FORMULAS (mathematical expressions)
        - BOTH (mixed content)

    2.  OUTPUT ONLY THE CODE: Do NOT include document structure like \documentclass, \usepackage, \begin{document}, or \end{document}. 
        Generate ONLY the actual table or equation code that goes inside a document body.

    3.  FOR TABLES:
        * Use `tabularx` environment with width set to `\textwidth` for proper fitting
        * Column specification: Use `|X|` for flexible-width text columns, `|c|` or `|l|` or `|r|` for fixed-width columns
        * CRITICAL: Make sure total width fits within page margins. Use X columns for long text to enable wrapping
        * Add all horizontal borders using `\hline` (top, after header, after each row, bottom)
        * Format cells: Use `\textbf{}` for bold, `\textit{}` for italic
        * Example structure:
          ```
          \begin{tabularx}{\textwidth}{|X|c|c|}
          \hline
          \textbf{Header 1} & \textbf{Header 2} & \textbf{Header 3} \\
          \hline
          Data 1 & Data 2 & Data 3 \\
          \hline
          \end{tabularx}
          ```

    4.  FOR EQUATIONS:
        * Use appropriate math environments: `equation`, `align`, `gather`, `align*`, etc.
        * For inline math: `$...$`
        * For display math: `\[...\]` or equation environments
        * Handle fractions: `\frac{numerator}{denominator}`
        * Operators: `\sum`, `\int`, `\lim`, `\prod`, etc.
        * Subscripts: `_{text}`, Superscripts: `^{text}`
        * Use `\text{}` for text within equations
        * Example: `\begin{equation} E = mc^2 \end{equation}`

    5.  MIXED CONTENT: Include both in the order they appear in the image.

    6.  NO DOCUMENT WRAPPER: Output ONLY the table/equation code. No \documentclass, no \begin{document}, no preamble.

    7.  NO EXTRA TEXT: No explanations, no markdown fences like ```latex, no comments.

    Generate the clean LaTeX code now:
    """

    message = HumanMessage(
        content=[
            {"type": "text", "text": prompt_text},
            {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64_image}"}},
        ]
    )

    print("Generating a complete, standalone .tex file...")
    response = llm.invoke([message])
    
    # Extract text and trim whitespace
    cleaned_response = response.content.strip() if hasattr(response, "content") else str(response).strip()

    # Remove common markdown fences if present
    if cleaned_response.startswith("```latex"):
        cleaned_response = cleaned_response[7:]
    if cleaned_response.startswith("```"):
        cleaned_response = cleaned_response[3:]
    if cleaned_response.endswith("```"):
        cleaned_response = cleaned_response[:-3]

    # Remove document wrapper if present (we only want the content)
    import re
    
    # Extract content between \begin{document} and \end{document} if present
    doc_match = re.search(r'\\begin\{document\}(.*?)\\end\{document\}', cleaned_response, re.DOTALL)
    if doc_match:
        cleaned_response = doc_match.group(1).strip()
    
    # Remove any \documentclass, \usepackage, and other preamble commands
    cleaned_response = re.sub(r'\\documentclass.*?\n', '', cleaned_response)
    cleaned_response = re.sub(r'\\usepackage.*?\n', '', cleaned_response)
    cleaned_response = re.sub(r'\\begin\{document\}', '', cleaned_response)
    cleaned_response = re.sub(r'\\end\{document\}', '', cleaned_response)
    
    # Clean up any remaining whitespace
    cleaned_response = cleaned_response.strip()

    return cleaned_response

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python convert_table.py <path_to_image>")
        sys.exit(1)

    # Get input image path
    image_file_path = sys.argv[1]
    
    # Generate LaTeX code
    latex_code = create_latex_standalone(image_file_path)
    
    # Create output filename based on input image name
    input_name = os.path.splitext(os.path.basename(image_file_path))[0]
    output_filename = f"{input_name}_gemini.tex"
    
    # Save to .tex file
    try:
        with open(output_filename, "w", encoding="utf-8") as f:
            f.write(latex_code)
        print(f"Successfully created: {output_filename}")
    except Exception as e:
        print(f"Error saving .tex file: {e}")
        sys.exit(1)