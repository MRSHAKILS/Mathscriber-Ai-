import sys
import base64
import os
from PIL import Image
from io import BytesIO
from dotenv import load_dotenv
from groq import Groq

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
    Generates a complete, standalone, and compilable LaTeX document for a table or equation image using Groq.
    Automatically detects whether the image contains a table or equation and processes accordingly.
    """
    # Initialize Groq client
    client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
    
    b64_image = image_to_base64(image_path)

    # Universal prompt that handles both tables and equations
    prompt_text = """You are an expert LaTeX code generator. Convert the provided image to LaTeX code.

CRITICAL REQUIREMENTS:

1. CONTENT DETECTION:
   - Analyze the image to determine if it contains a TABLE or EQUATION(S)
   - Generate appropriate code for the content type

2. OUTPUT ONLY CODE (NO DOCUMENT WRAPPER):
   - Do NOT include \\documentclass, \\usepackage, \\begin{document}, or \\end{document}
   - Generate ONLY the actual table or equation code
   - Output should be ready to insert into an existing LaTeX document body

3. FOR TABLES:
   - Use tabularx environment with \\textwidth width for proper fitting
   - Column specification: Use |X| for flexible text columns, |c|/|l|/|r| for fixed columns
   - CRITICAL: Ensure total width fits within margins. Use X columns for long text to enable wrapping
   - Use \\hline for every horizontal line (top, after header, after each row, bottom)
   - Example: \\begin{tabularx}{\\textwidth}{|X|c|c|}
   - Preserve exact text from image (case-sensitive)
   - Use \\textbf{} for bold, \\textit{} for italic
   - Align numbers right, text left

4. FOR EQUATIONS:
   - Use appropriate math environments: equation, align, gather, etc.
   - For single equations: \\begin{equation} ... \\end{equation}
   - For multiple equations: \\begin{align} ... \\end{align}
   - For unnumbered: Use starred versions (equation*, align*)
   - Preserve all mathematical notation exactly
   - Use \\frac{}{} for fractions
   - Use \\sum, \\int, \\prod with proper limits
   - Use \\text{} for text within equations

5. FORMATTING:
   - Escape special LaTeX characters properly
   - Preserve subscripts and superscripts exactly
   - Use proper spacing commands

6. OUTPUT FORMAT:
   - Return ONLY the table/equation code
   - NO document preamble or wrapper
   - NO markdown fences (no ```)
   - NO explanations or comments

Generate the clean LaTeX code now:"""

    print("Generating LaTeX document using Groq API...")
    
    try:
        # Use Groq vision model - Llama 4 Scout (faster, recommended)
        completion = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt_text},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{b64_image}",
                            },
                        },
                    ],
                }
            ],
            temperature=0.1,
            max_tokens=4096,
            top_p=1,
            stream=False,
        )
        
        # Extract response
        latex_code = completion.choices[0].message.content.strip()
        
        # Clean up response - remove markdown fences
        if latex_code.startswith("```latex"):
            latex_code = latex_code[7:]
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
        
        return latex_code
        
    except Exception as e:
        print(f"Error calling Groq API: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python convert_table_groq.py <path_to_image>")
        sys.exit(1)

    # Get input image path
    image_file_path = sys.argv[1]
    
    # Generate LaTeX code
    latex_code = create_latex_standalone(image_file_path)
    
    # Create output filename based on input image name
    input_name = os.path.splitext(os.path.basename(image_file_path))[0]
    output_filename = f"{input_name}_groq.tex"
    
    # Save to .tex file
    try:
        with open(output_filename, "w", encoding="utf-8") as f:
            f.write(latex_code)
        print(f"Successfully created: {output_filename}")
    except Exception as e:
        print(f"Error saving .tex file: {e}")
        sys.exit(1)
