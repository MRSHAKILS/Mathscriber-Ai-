import sys
import base64
import os
import requests
from PIL import Image
from io import BytesIO
from dotenv import load_dotenv

# Load environment variables from .env file in parent directory
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(env_path)

def image_to_base64(image_path: str) -> str:
    """Converts an image file to a base64 encoded string."""
    try:
        # Check if the file exists
        if not os.path.exists(image_path):
            print(f"Error: Image file not found at {image_path}")
            sys.exit(1)
            
        with Image.open(image_path) as img:
            # Convert to RGB and save as JPEG for compatibility with models
            if img.mode != 'RGB':
                img = img.convert('RGB')
            buffered = BytesIO()
            img.save(buffered, format="JPEG")
            return base64.b64encode(buffered.getvalue()).decode('utf-8')
    except Exception as e:
        print(f"Error processing image: {e}")
        sys.exit(1)

def create_latex_diagram(image_path: str) -> str:
    """
    Generates a comprehensive TikZ template for diagrams.
    
    Note: This is a TEMPLATE GENERATOR, not an AI-powered converter.
    For AI-powered diagram analysis and conversion, use the OpenAI diagram converter instead.
    
    This generator provides a professional starting point that you can customize.
    """
    print("=" * 70)
    print("TikZ TEMPLATE GENERATOR")
    print("=" * 70)
    print("Note: This tool generates a customizable TikZ template.")
    print("For AI-powered diagram conversion, use the 'OpenAI Diagram' option.")
    print("=" * 70)
    
    # Generate a comprehensive template
    latex_code = generate_advanced_tikz_template()
    return latex_code


def generate_tikz_from_description(description: str) -> str:
    """Generate basic TikZ code from an image description."""
    return f"""\\documentclass{{article}}
\\usepackage{{tikz}}
\\usetikzlibrary{{shapes.geometric,arrows,positioning}}

\\begin{{document}}

% Generated from image description: {description}
% Please customize this TikZ code based on your specific diagram

\\begin{{tikzpicture}}[node distance=2cm, auto]
  % Define styles
  \\tikzstyle{{block}} = [rectangle, draw, fill=blue!20, text width=5em, text centered, rounded corners, minimum height=3em]
  \\tikzstyle{{arrow}} = [thick,->,>=stealth]

  % Add your nodes here based on the diagram
  \\node [block] (node1) {{Element 1}};
  \\node [block, right of=node1] (node2) {{Element 2}};
  
  % Add connections
  \\path [arrow] (node1) -- (node2);
\\end{{tikzpicture}}

% Note: This is a basic template generated from the image description.
% The actual diagram structure needs to be customized based on: {description}

\\end{{document}}"""


def generate_advanced_tikz_template() -> str:
    """Generate a comprehensive TikZ template with examples."""
    return r"""\documentclass{article}
\usepackage{tikz}
\usetikzlibrary{shapes.geometric,arrows,positioning,fit,calc}

\begin{document}

% Comprehensive TikZ Template for Diagrams
% Customize this template based on your specific diagram

\begin{tikzpicture}[
    node distance=2.5cm,
    auto,
    % Define node styles
    startstop/.style={rectangle, rounded corners, minimum width=3cm, minimum height=1cm, text centered, draw=black, fill=red!30},
    process/.style={rectangle, minimum width=3cm, minimum height=1cm, text centered, draw=black, fill=blue!30},
    decision/.style={diamond, minimum width=3cm, minimum height=1cm, text centered, draw=black, fill=green!30},
    io/.style={trapezium, trapezium left angle=70, trapezium right angle=110, minimum width=3cm, minimum height=1cm, text centered, draw=black, fill=yellow!30},
    arrow/.style={thick,->,>=stealth}
]

% Example nodes - customize these based on your diagram
\node (start) [startstop] {Start};
\node (proc1) [process, below of=start] {Process 1};
\node (dec1) [decision, below of=proc1, yshift=-0.5cm] {Decision?};
\node (proc2a) [process, below of=dec1, yshift=-0.5cm] {Process 2a};
\node (proc2b) [process, right of=dec1, xshift=2cm] {Process 2b};
\node (stop) [startstop, below of=proc2a] {Stop};

% Example arrows - customize these connections
\draw [arrow] (start) -- (proc1);
\draw [arrow] (proc1) -- (dec1);
\draw [arrow] (dec1) -- node[anchor=east] {yes} (proc2a);
\draw [arrow] (dec1) -- node[anchor=south] {no} (proc2b);
\draw [arrow] (proc2a) -- (stop);
\draw [arrow] (proc2b) |- (stop);

% Additional customization tips:
% 1. Modify node positions using: right of, left of, above of, below of
% 2. Add more node styles as needed
% 3. Use \node[style] (name) at (x,y) {text}; for absolute positioning
% 4. For complex diagrams, use the positioning library: \node[right=of node1]

\end{tikzpicture}

\end{document}"""

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python convert_diagram_deepseek_vl.py <path_to_image>")
        sys.exit(1)

    image_file_path = sys.argv[1]
    latex_code = create_latex_diagram(image_file_path)
    
    input_name = os.path.splitext(os.path.basename(image_file_path))[0]
    output_filename = f"{input_name}_diagram.tex"
    
    # Save the generated code to a .tex file
    try:
        with open(output_filename, "w", encoding="utf-8") as f:
            f.write(latex_code)
        print(f"Successfully created: {output_filename}")
    except Exception as e:
        print(f"Error saving .tex file: {e}")
        sys.exit(1)