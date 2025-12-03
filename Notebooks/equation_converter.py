import sys
import base64
import os
import glob
from PIL import Image
from io import BytesIO
from dotenv import load_dotenv
from langchain_core.messages import HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI

# Load environment variables from .env file
load_dotenv()

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
        return None

def detect_content_type(image_path: str) -> str:
    """
    Uses AI to detect if the image contains a table or equation.
    Returns 'table', 'equation', or 'unknown'
    """
    llm = ChatGoogleGenerativeAI(model="gemini-2.5-pro")
    
    b64_image = image_to_base64(image_path)
    if not b64_image:
        return "unknown"

    prompt_text = """
    Analyze this image and determine if it contains primarily:
    - A TABLE (grid-like structure with rows and columns of data)
    - An EQUATION (mathematical expressions, formulas, or calculations)
    
    Respond with ONLY one word: either "table" or "equation".
    Do not include any other text, explanations, or formatting.
    """

    message = HumanMessage(
        content=[
            {"type": "text", "text": prompt_text},
            {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64_image}"}},
        ]
    )

    try:
        response = llm.invoke([message])
        content = response.content.strip().lower() if hasattr(response, "content") else str(response).strip().lower()
        
        if "table" in content:
            return "table"
        elif "equation" in content:
            return "equation"
        else:
            return "unknown"
    except Exception as e:
        print(f"Error detecting content type: {e}")
        return "unknown"

def create_latex_table(image_path: str) -> str:
    """Generates LaTeX code for table images."""
    llm = ChatGoogleGenerativeAI(model="gemini-2.5-pro")
    
    b64_image = image_to_base64(image_path)
    if not b64_image:
        return ""

    prompt_text = r"""
    You are a precision LaTeX document generator. Your mission is to convert the provided table image into a **complete, standalone, and directly compilable `.tex` file**. The final document must perfectly render the entire table, with all columns and borders visible.

    EXECUTION DIRECTIVES (NON-NEGOTIABLE):

    1.  Generate a Full Document: Your output MUST be a complete LaTeX document. It must start with `\documentclass{article}` and end with `\end{document}`.

    2.  Force Page Width: You MUST include the `geometry` package to create ample horizontal space. Use these exact settings in the preamble:
        `\usepackage[a4paper, margin=1cm, hmargin=1cm, vmargin=2cm]{geometry}`

    3.  Required Packages: Your preamble MUST include `\usepackage{tabularx}` and `\usepackage{booktabs}` for high-quality tables.

    4.  Table Environment:
        * Use the `tabularx` environment and set its width to `\linewidth` to fill the new, wider page space.
        * Your column specifier MUST replicate all vertical borders seen in the image (e.g., `{|l|X|c|c|}`).
        * To preserve the table's natural column widths, use the `X` type ONLY for the column(s) with long, wrapping text. Use `l`, `c`, or `r` for all other columns.

    5.  Border Fidelity: You MUST replicate ALL horizontal lines using `\hline`. This includes a `\hline` after the header, after every data row, and at the very end of the table to create a complete box.

    6.  No Extra Content: The document body should contain ONLY the table. Do not add any text before `\begin{tabularx}` or after `\end{tabularx}`.

    7.  Final Output: Your entire response must be the raw code for the `.tex` file and nothing else.

    Analyze the image and generate the complete, self-contained LaTeX file now.
    """

    message = HumanMessage(
        content=[
            {"type": "text", "text": prompt_text},
            {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64_image}"}},
        ]
    )

    print("🤖 Generating LaTeX table code...")
    response = llm.invoke([message])
    return clean_latex_response(response)

def create_latex_equation(image_path: str) -> str:
    """Generates LaTeX code for equation images."""
    llm = ChatGoogleGenerativeAI(model="gemini-2.5-pro")
    
    b64_image = image_to_base64(image_path)
    if not b64_image:
        return ""

    prompt_text = r"""
    You are a precision LaTeX equation generator. Your mission is to convert the provided handwritten or printed equation image into a **complete, standalone, and directly compilable `.tex` file**. The final document must perfectly render the mathematical equation with proper formatting and alignment.

    EXECUTION DIRECTIVES (NON-NEGOTIABLE):

    1.  Generate a Full Document: Your output MUST be a complete LaTeX document. It must start with `\documentclass{article}` and end with `\end{document}`.

    2.  Required Packages: Your preamble MUST include these essential math packages:
        - `\usepackage{amsmath}` for advanced mathematical environments
        - `\usepackage{amssymb}` for mathematical symbols
        - `\usepackage{amsfonts}` for additional mathematical fonts

    3.  Equation Environment:
        - Use the appropriate equation environment based on the equation type:
          * `equation` for single-line numbered equations
          * `equation*` for single-line unnumbered equations  
          * `align` for multi-line equations with alignment
          * `align*` for multi-line equations without alignment
          * `gather` for multi-line equations without alignment
          * `gather*` for multi-line equations without alignment or numbering

    4.  Mathematical Notation:
        - Use proper LaTeX commands for all mathematical symbols:
          * Fractions: `\frac{numerator}{denominator}`
          * Superscripts: `x^{2}`
          * Subscripts: `x_{i}`
          * Square roots: `\sqrt{expression}` or `\sqrt[n]{expression}`
          * Integrals: `\int`, `\int_{a}^{b}`
          * Summations: `\sum`, `\sum_{i=1}^{n}`
          * Greek letters: `\alpha`, `\beta`, `\gamma`, etc.
          * Operators: `\sin`, `\cos`, `\log`, `\ln`, etc.

    5.  Formatting Requirements:
        - Center the equation using `\begin{center}` and `\end{center}` if it's a displayed equation
        - Ensure proper spacing using `\,`, `\:`, `\;`, `\!` where appropriate
        - Use `\left` and `\right` for automatically sized delimiters
        - For piecewise functions, use the `cases` environment

    6.  Document Structure:
        - Include a title if the equation has a label or name
        - Use `\title{Equation}` and `\maketitle` if appropriate
        - Set reasonable page margins: `\usepackage[margin=1in]{geometry}`

    7.  Accuracy Check:
        - Ensure the LaTeX code accurately represents the mathematical expression in the image
        - Verify all symbols, operators, and structures are correctly translated
        - Check for proper grouping using curly braces `{}`

    8.  Final Output: Your entire response must be the raw code for the `.tex` file and nothing else.

    Analyze the equation image carefully and generate the complete, self-contained LaTeX file now.
    """

    message = HumanMessage(
        content=[
            {"type": "text", "text": prompt_text},
            {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64_image}"}},
        ]
    )

    print("🤖 Generating LaTeX equation code...")
    response = llm.invoke([message])
    return clean_latex_response(response)

def clean_latex_response(response):
    """Cleans and formats the LaTeX response from the AI."""
    cleaned_response = response.content.strip() if hasattr(response, "content") else str(response).strip()

    # Remove common markdown fences if present
    if cleaned_response.startswith("```latex"):
        cleaned_response = cleaned_response[7:]
    if cleaned_response.startswith("```"):
        cleaned_response = cleaned_response[3:]
    if cleaned_response.endswith("```"):
        cleaned_response = cleaned_response[:-3]

    # Remove any leading stray characters before the LaTeX documentclass
    import re
    m = re.search(r'\\documentclass', cleaned_response)
    if m:
        cleaned_response = cleaned_response[m.start():]
    else:
        # Fallback: remove any leading non-printable/garbage characters and whitespace
        cleaned_response = cleaned_response.lstrip()

    return cleaned_response.strip()

def process_all_images():
    """Process all images in the test_images folder and convert to LaTeX."""
    
    # Define the test images folder path
    test_images_folder = "test_images"
    
    # Create output folder if it doesn't exist
    output_folder = "latex_output"
    os.makedirs(output_folder, exist_ok=True)
    
    # Supported image formats
    image_extensions = ['*.jpg', '*.jpeg', '*.png', '*.bmp', '*.tiff', '*.webp']
    
    # Find all image files in the test_images folder
    image_files = []
    for extension in image_extensions:
        image_files.extend(glob.glob(os.path.join(test_images_folder, extension)))
        image_files.extend(glob.glob(os.path.join(test_images_folder, extension.upper())))
    
    if not image_files:
        print(f"❌ No image files found in {test_images_folder} folder.")
        print(f"Please make sure your images are in the '{test_images_folder}' directory.")
        return
    
    print(f"📁 Found {len(image_files)} image files to process...")
    print("=" * 50)
    
    successful_conversions = 0
    conversion_summary = []
    
    for i, image_path in enumerate(image_files, 1):
        try:
            filename = os.path.basename(image_path)
            print(f"\n[{i}/{len(image_files)}] Processing: {filename}")
            
            # Detect content type (table or equation)
            print("🔍 Detecting content type...")
            content_type = detect_content_type(image_path)
            print(f"📊 Detected: {content_type}")
            
            # Generate appropriate LaTeX code
            if content_type == "table":
                latex_code = create_latex_table(image_path)
                file_type = "table"
            elif content_type == "equation":
                latex_code = create_latex_equation(image_path)
                file_type = "equation"
            else:
                # If unknown, try equation first, then table
                print("⚠️  Unknown content type, trying equation conversion...")
                latex_code = create_latex_equation(image_path)
                file_type = "equation"
            
            if not latex_code:
                print(f"❌ Failed to generate LaTeX code for {filename}")
                conversion_summary.append((filename, "FAILED", "No code generated"))
                continue
            
            # Create output filename
            input_name = os.path.splitext(filename)[0]
            output_filename = f"{input_name}_{file_type}.tex"
            output_path = os.path.join(output_folder, output_filename)
            
            # Save to .tex file
            with open(output_path, "w", encoding="utf-8") as f:
                f.write(latex_code)
            
            print(f"✅ Successfully created: {output_filename}")
            successful_conversions += 1
            conversion_summary.append((filename, "SUCCESS", output_filename))
            
        except Exception as e:
            print(f"❌ Error processing {filename}: {e}")
            conversion_summary.append((filename, "FAILED", str(e)))
    
    # Print summary
    print("\n" + "=" * 50)
    print("📊 CONVERSION SUMMARY")
    print("=" * 50)
    
    for filename, status, details in conversion_summary:
        status_icon = "✅" if status == "SUCCESS" else "❌"
        print(f"{status_icon} {filename}: {status} - {details}")
    
    print(f"\n🎉 Conversion complete! {successful_conversions}/{len(image_files)} files successfully converted.")
    print(f"📁 Output files saved in: {output_folder}/")

def process_single_image(image_path: str):
    """Process a single image file."""
    if not os.path.exists(image_path):
        print(f"❌ Image file not found: {image_path}")
        return
    
    print(f"📷 Processing single image: {os.path.basename(image_path)}")
    
    # Detect content type
    content_type = detect_content_type(image_path)
    print(f"📊 Detected content type: {content_type}")
    
    # Generate appropriate LaTeX code
    if content_type == "table":
        latex_code = create_latex_table(image_path)
        file_type = "table"
    else:  # Default to equation for unknown types
        latex_code = create_latex_equation(image_path)
        file_type = "equation"
    
    if not latex_code:
        print("❌ Failed to generate LaTeX code")
        return
    
    # Create output filename
    input_name = os.path.splitext(os.path.basename(image_path))[0]
    output_filename = f"{input_name}_{file_type}.tex"
    
    # Save to current directory
    with open(output_filename, "w", encoding="utf-8") as f:
        f.write(latex_code)
    
    print(f"✅ Successfully created: {output_filename}")

if __name__ == "__main__":
    # Check if .env file exists
    if not os.path.exists(".env"):
        print("❌ Error: .env file not found!")
        print("Please create a .env file with your Google API key:")
        print("GOOGLE_API_KEY=your_api_key_here")
        sys.exit(1)
    
    # Check command line arguments
    if len(sys.argv) == 1:
        # No arguments - process all images in test_images folder
        process_all_images()
    elif len(sys.argv) == 2:
        # Single image file provided
        image_path = sys.argv[1]
        process_single_image(image_path)
    else:
        print("Usage:")
        print("  python convert_images.py                    - Process all images in test_images folder")
        print("  python convert_images.py <image_path>      - Process a single image file")
        sys.exit(1)