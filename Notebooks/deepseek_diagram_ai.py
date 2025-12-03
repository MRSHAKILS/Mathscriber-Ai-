"""
DeepSeek AI-Powered Diagram Converter
Uses DeepSeek API with diagram description to generate TikZ code
"""

import sys
import base64
import os
from pathlib import Path
from dotenv import load_dotenv
import requests
from PIL import Image
from io import BytesIO

# Load environment variables
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(env_path)

def analyze_image_properties(image_path: str) -> str:
    """Analyze image to understand diagram structure."""
    try:
        with Image.open(image_path) as img:
            width, height = img.size
            aspect_ratio = width / height
            
            # Basic analysis
            if aspect_ratio > 1.5:
                layout = "wide horizontal flowchart or process diagram"
            elif aspect_ratio < 0.7:
                layout = "vertical hierarchy or tree diagram"
            else:
                layout = "balanced diagram with multiple elements"
            
            # Analyze colors
            colors = img.getcolors(maxcolors=256)
            num_distinct_colors = len(colors) if colors else "many"
            
            return f"{layout}, approximately {num_distinct_colors} distinct colors, {width}x{height}px"
    except:
        return "technical diagram with multiple elements"

def generate_smart_template(image_path: str) -> str:
    """Generate an intelligent TikZ template based on image analysis."""
    try:
        with Image.open(image_path) as img:
            width, height = img.size
            aspect_ratio = width / height
        
        layout = "horizontal" if aspect_ratio > 1.2 else "vertical" if aspect_ratio < 0.8 else "balanced"
        
        return f"""\\documentclass{{standalone}}
\\usepackage{{tikz}}
\\usetikzlibrary{{shapes.geometric,arrows.meta,positioning,fit,calc,shadows,decorations.pathreplacing}}

\\begin{{document}}

\\begin{{tikzpicture}}[
    node distance=2.5cm,
    auto,
    % Professional Styles
    process/.style={{
        rectangle,
        draw=blue!70,
        fill=blue!10,
        thick,
        minimum width=3.5cm,
        minimum height=1.2cm,
        text centered,
        rounded corners=4pt,
        drop shadow={{shadow xshift=1mm, shadow yshift=-1mm}}
    }},
    decision/.style={{
        diamond,
        draw=orange!70,
        fill=orange!10,
        thick,
        aspect=2.5,
        text centered,
        inner sep=2pt,
        drop shadow
    }},
    startstop/.style={{
        ellipse,
        draw=red!70,
        fill=red!10,
        thick,
        minimum width=3cm,
        minimum height=1cm,
        text centered,
        drop shadow
    }},
    data/.style={{
        trapezium,
        trapezium left angle=70,
        trapezium right angle=110,
        draw=green!70,
        fill=green!10,
        thick,
        minimum width=3cm,
        minimum height=1cm,
        text centered,
        drop shadow
    }},
    arrow/.style={{
        -{{Stealth[length=4mm, width=3mm]}},
        very thick,
        draw=gray!60
    }},
    label/.style={{
        font=\\small,
        text=black!70
    }}
]

% Layout: {layout} (aspect ratio: {aspect_ratio:.2f})
% Customize nodes and connections below:

% Start node
\\node[startstop] (start) {{Start}};

% Process nodes
\\node[process, below=of start] (proc1) {{Process 1}};
\\node[decision, below=of proc1] (dec1) {{Decision?}};
\\node[process, below=of dec1, xshift=-3cm] (proc2) {{Process 2A}};
\\node[process, below=of dec1, xshift=3cm] (proc3) {{Process 2B}};
\\node[process, below=of dec1, yshift=-4cm] (proc4) {{Merge Process}};

% End node
\\node[startstop, below=of proc4] (end) {{End}};

% Connections
\\draw[arrow] (start) -- (proc1);
\\draw[arrow] (proc1) -- (dec1);
\\draw[arrow] (dec1) -| node[label, near start] {{Yes}} (proc2);
\\draw[arrow] (dec1) -| node[label, near start] {{No}} (proc3);
\\draw[arrow] (proc2) |- (proc4);
\\draw[arrow] (proc3) |- (proc4);
\\draw[arrow] (proc4) -- (end);

\\end{{tikzpicture}}

\\end{{document}}"""
    except:
        return generate_basic_template()

def generate_basic_template() -> str:
    """Minimal fallback template."""
    return r"""\documentclass{standalone}
\usepackage{tikz}
\usetikzlibrary{shapes,arrows,positioning}

\begin{document}
\begin{tikzpicture}[node distance=2cm]
    \tikzstyle{block} = [rectangle, draw, fill=blue!20, minimum width=3cm, minimum height=1cm]
    \tikzstyle{arrow} = [thick,->,>=stealth]
    
    \node [block] (n1) {Node 1};
    \node [block, below of=n1] (n2) {Node 2};
    \draw [arrow] (n1) -- (n2);
\end{tikzpicture}
\end{document}"""

def create_latex_diagram(image_path: str) -> str:
    """
    Generate TikZ LaTeX code using DeepSeek Reasoner.
    Note: DeepSeek API requires payment. This will check balance first.
    """
    print("=" * 70)
    print("DEEPSEEK AI-POWERED DIAGRAM CONVERTER")
    print("=" * 70)
    print("Using: DeepSeek Reasoner API")
    print("Analyzing and generating TikZ code...")
    print("=" * 70)
    
    api_key = os.getenv('DEEPSEEK_API_KEY')
    if not api_key:
        print("Error: DEEPSEEK_API_KEY not found in .env file")
        sys.exit(1)
    
    try:
        # Check if API has balance first
        print("Checking API status...")
        test_response = requests.get(
            "https://api.deepseek.com/models",
            headers={"Authorization": f"Bearer {api_key}"}
        )
        
        if test_response.status_code != 200:
            print(f"[ERROR] DeepSeek API authentication failed: {test_response.status_code}")
            print("[INFO] Note: DeepSeek API requires a paid account with credits")
            print("[INFO] Please add credits at: https://platform.deepseek.com/")
            print("\n[FALLBACK] Generating intelligent template instead...")
            return generate_smart_template(image_path)
        
        print("[OK] API authenticated successfully")
        
        # Analyze image to get description
        diagram_info = analyze_image_properties(image_path)
        
        prompt = f"""You are an expert LaTeX and TikZ programmer. Generate a complete, professional TikZ diagram.

Image analysis: {diagram_info}

Generate a COMPLETE LaTeX document with:
1. \\documentclass{{standalone}}
2. \\usepackage{{tikz}} with appropriate libraries
3. Professional node styles with colors and shadows
4. Well-positioned nodes based on the analysis
5. Proper connections and arrows
6. Clean, commented code

Output ONLY the LaTeX code from \\documentclass to \\end{{document}}. No explanations."""

        print("Generating TikZ code with DeepSeek Reasoner...")
        response = requests.post(
            "https://api.deepseek.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            },
            json={
                "model": "deepseek-reasoner",
                "messages": [
                    {"role": "system", "content": "You are an expert LaTeX and TikZ programmer. Generate only code, no explanations."},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.3,
                "max_tokens": 2000
            },
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            latex_code = result['choices'][0]['message']['content'].strip()
            
            # Clean up
            if latex_code.startswith("```latex"):
                latex_code = latex_code[8:]
            elif latex_code.startswith("```"):
                latex_code = latex_code[3:]
            
            if latex_code.endswith("```"):
                latex_code = latex_code[:-3]
            
            latex_code = latex_code.strip()
            
            print("[SUCCESS] Successfully generated TikZ code using DeepSeek AI")
            return latex_code
            
        elif response.status_code == 402:
            print("[ERROR] Insufficient balance in DeepSeek account")
            print("[INFO] Please add credits at: https://platform.deepseek.com/")
            print("\n[FALLBACK] Generating intelligent template instead...")
            return generate_smart_template(image_path)
        else:
            print(f"[ERROR] DeepSeek API returned {response.status_code}: {response.text[:200]}")
            print("[FALLBACK] Generating intelligent template...")
            return generate_smart_template(image_path)
            
    except Exception as e:
        print(f"[WARNING] Error: {e}")
        print("[FALLBACK] Generating intelligent template...")
        return generate_smart_template(image_path)

def main():
    """Command-line interface."""
    if len(sys.argv) < 2:
        print("Usage: python deepseek_diagram_ai.py <image_path> [output_path]")
        print("Example: python deepseek_diagram_ai.py diagram.png diagram.tex")
        sys.exit(1)
    
    image_path = sys.argv[1]
    
    # Default output to test_outputs folder
    if len(sys.argv) >= 3:
        output_path = sys.argv[2]
    else:
        test_outputs_dir = Path(__file__).parent.parent / "test_outputs"
        test_outputs_dir.mkdir(exist_ok=True)
        output_path = test_outputs_dir / f"{Path(image_path).stem}_deepseek_ai.tex"
    
    if not os.path.exists(image_path):
        print(f"Error: Image file not found: {image_path}")
        sys.exit(1)
    
    print(f"Converting diagram: {image_path}")
    print("=" * 60)
    
    try:
        latex_code = create_latex_diagram(image_path)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(latex_code)
        
        print(f"[OK] LaTeX file saved to: {output_path}")
        print("=" * 60)
        print("Conversion complete!")
        print(f"\nTo compile the LaTeX document:")
        print(f"  pdflatex {output_path}")
        print(f"\nOr use online compiler: https://www.overleaf.com/")
        
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
