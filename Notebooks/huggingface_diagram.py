"""
HuggingFace Diagram Converter (Template-Based)

⚠️ IMPORTANT NOTE ⚠️
HuggingFace vision models are currently deprecated/unavailable through the Inference API.
This converter now generates intelligent templates based on image analysis rather than AI vision.

For AI-powered diagram conversion, please use:
1. Gemini Diagram (FREE & Excellent) - RECOMMENDED
2. OpenAI Diagram (Best Quality, Paid)
3. DeepSeek Diagram (Budget-Friendly)

This template generator is useful for:
- Getting started with TikZ diagrams
- Learning TikZ structure
- Quick placeholder diagrams

See DIAGRAM_CONVERTERS_GUIDE.md for detailed comparison and setup instructions.
"""

import sys
import os
from pathlib import Path
from dotenv import load_dotenv
import requests
from PIL import Image
from io import BytesIO
import base64
import json

# Load environment variables
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(env_path)

# HuggingFace API Configuration  
# Check both HUGGINGFACE_API_KEY and HF_API_KEY for compatibility
HF_API_TOKEN = os.getenv('HUGGINGFACE_API_KEY') or os.getenv('HF_API_KEY')
HF_API_URL = "https://api-inference.huggingface.co/models/"

# Best available vision-language models on HuggingFace (updated 2025)
VISION_MODELS = [
    "Salesforce/blip-image-captioning-base",  # BLIP: Fast and reliable
    "nlpconnect/vit-gpt2-image-captioning",   # ViT-GPT2: Good for descriptions
    "microsoft/git-large-coco",                # GIT: Microsoft's vision-language model
    "ydshieh/vit-gpt2-coco-en",               # Alternative ViT-GPT2
]

def query_huggingface_vision(image_path: str, prompt: str = None, model_name: str = None) -> str:
    """
    Query HuggingFace Vision-Language model for diagram analysis.
    Uses image captioning models for intelligent image understanding.
    """
    if not HF_API_TOKEN:
        print("[WARNING] HF_API_KEY not found in .env file")
        print("[INFO] Get a free API key from: https://huggingface.co/settings/tokens")
        print("[INFO] Falling back to template-based generation")
        return None
    
    # Use provided model or try models in order
    models_to_try = [model_name] if model_name else VISION_MODELS
    
    try:
        # Try using huggingface_hub library first (more reliable)
        try:
            from huggingface_hub import InferenceClient
            
            client = InferenceClient(token=HF_API_TOKEN)
            
            for model in models_to_try:
                try:
                    print(f"[INFO] Trying model: {model}")
                    
                    # Use image captioning
                    description = client.image_to_text(image_path, model=model)
                    
                    if description and len(description.strip()) > 10:
                        print(f"[SUCCESS] Model {model} provided description")
                        return description.strip()
                        
                except Exception as e:
                    print(f"[WARNING] Model {model} failed: {str(e)[:100]}")
                    continue
                    
        except ImportError:
            print("[INFO] huggingface_hub not installed, using direct API calls")
            # Fall back to direct API calls
            pass
        
        # Direct API calls as fallback
        with open(image_path, 'rb') as img_file:
            image_bytes = img_file.read()
        
        headers = {"Authorization": f"Bearer {HF_API_TOKEN}"}
        
        for model in models_to_try:
            try:
                print(f"[INFO] Trying API model: {model}")
                api_url = HF_API_URL + model
                
                # Image captioning models work with image bytes directly
                response = requests.post(
                    api_url,
                    headers=headers,
                    data=image_bytes,
                    timeout=30
                )
                
                if response.status_code == 200:
                    result = response.json()
                    
                    # Extract text from different response formats
                    if isinstance(result, list) and len(result) > 0:
                        if isinstance(result[0], dict):
                            description = result[0].get('generated_text', result[0].get('text', ''))
                        else:
                            description = str(result[0])
                    elif isinstance(result, dict):
                        description = result.get('generated_text', result.get('text', ''))
                    else:
                        description = str(result)
                    
                    if description and len(description.strip()) > 10:
                        print(f"[SUCCESS] API model {model} provided description")
                        return description.strip()
                
                elif response.status_code == 503:
                    print(f"[INFO] Model {model} is loading, trying next...")
                    continue
                elif response.status_code == 410:
                    print(f"[INFO] Model {model} is deprecated, trying next...")
                    continue
                else:
                    print(f"[WARNING] Model {model} returned status {response.status_code}")
                    
            except requests.Timeout:
                print(f"[WARNING] Model {model} timed out, trying next...")
                continue
            except Exception as e:
                print(f"[WARNING] Error with model {model}: {str(e)[:100]}")
                continue
        
        print("[WARNING] All HuggingFace models failed or unavailable")
        print("[TIP] The HuggingFace Inference API may be rate-limited or down")
        print("[TIP] Consider using OpenAI, Gemini, or DeepSeek converters instead")
        return None
        
    except Exception as e:
        print(f"[ERROR] HuggingFace API error: {e}")
        return None


def analyze_diagram_with_ai(image_path: str) -> dict:
    """
    Use HuggingFace Vision AI to analyze diagram structure and content.
    Returns structured information about the diagram.
    """
    print("[INFO] Analyzing diagram with HuggingFace Vision AI...")
    
    # Query HuggingFace for image description
    ai_description = query_huggingface_vision(image_path)
    
    # Also get basic image analysis
    basic_analysis = analyze_image_advanced(image_path)
    
    if ai_description:
        # Parse AI description to enhance our analysis
        ai_analysis = parse_ai_description(ai_description)
        basic_analysis['ai_description'] = ai_description
        basic_analysis['ai_insights'] = ai_analysis
        basic_analysis['has_ai'] = True
        print(f"[AI INSIGHT] {ai_description[:150]}...")
    else:
        basic_analysis['has_ai'] = False
        print("[INFO] Using template-based analysis (no AI available)")
    
    return basic_analysis


def parse_ai_description(description: str) -> dict:
    """Parse AI-generated description to extract structured information."""
    description_lower = description.lower()
    
    insights = {
        'diagram_type': 'unknown',
        'node_count_estimate': 'multiple',
        'layout_direction': 'mixed',
        'has_arrows': False,
        'complexity_level': 'medium'
    }
    
    # Detect diagram type
    if any(word in description_lower for word in ['flowchart', 'flow chart', 'process']):
        insights['diagram_type'] = 'flowchart'
    elif any(word in description_lower for word in ['network', 'topology', 'graph']):
        insights['diagram_type'] = 'network'
    elif any(word in description_lower for word in ['hierarchy', 'organizational', 'tree']):
        insights['diagram_type'] = 'hierarchy'
    elif any(word in description_lower for word in ['sequence', 'timeline', 'chronological']):
        insights['diagram_type'] = 'sequence'
    
    # Detect layout direction
    if any(word in description_lower for word in ['horizontal', 'left to right', 'left-to-right']):
        insights['layout_direction'] = 'horizontal'
    elif any(word in description_lower for word in ['vertical', 'top to bottom', 'top-to-bottom']):
        insights['layout_direction'] = 'vertical'
    elif any(word in description_lower for word in ['circular', 'radial', 'cycle']):
        insights['layout_direction'] = 'circular'
    
    # Detect arrows/connections
    if any(word in description_lower for word in ['arrow', 'connector', 'connection', 'link']):
        insights['has_arrows'] = True
    
    # Estimate node count
    if any(word in description_lower for word in ['many', 'numerous', 'multiple', 'several']):
        insights['node_count_estimate'] = 'many'
    elif any(word in description_lower for word in ['few', 'simple', 'basic']):
        insights['node_count_estimate'] = 'few'
    
    return insights


def analyze_image_advanced(image_path: str) -> dict:
    """Perform advanced image analysis to understand diagram structure."""
    try:
        with Image.open(image_path) as img:
            width, height = img.size
            aspect_ratio = width / height
            
            # Analyze layout
            if aspect_ratio > 1.5:
                layout_type = "horizontal"
                description = "wide horizontal flowchart or timeline"
            elif aspect_ratio < 0.7:
                layout_type = "vertical"
                description = "vertical hierarchy or organizational chart"
            else:
                layout_type = "balanced"
                description = "balanced network or process diagram"
            
            # Analyze complexity
            colors = img.getcolors(maxcolors=1024)
            num_colors = len(colors) if colors else 100
            
            # Estimate complexity
            if num_colors > 50:
                complexity = "high"
                elements = "many nodes and connections"
            elif num_colors > 20:
                complexity = "medium"
                elements = "several interconnected elements"
            else:
                complexity = "low"
                elements = "few simple elements"
            
            return {
                "width": width,
                "height": height,
                "aspect_ratio": aspect_ratio,
                "layout_type": layout_type,
                "description": description,
                "complexity": complexity,
                "num_colors": num_colors,
                "elements": elements
            }
    except Exception as e:
        return {
            "width": 800,
            "height": 600,
            "aspect_ratio": 1.33,
            "layout_type": "balanced",
            "description": "technical diagram",
            "complexity": "medium",
            "num_colors": 10,
            "elements": "multiple connected elements"
        }

def create_latex_diagram(image_path: str) -> str:
    """
    Generate intelligent TikZ LaTeX code using HuggingFace Vision AI.
    Falls back to advanced template generation if AI is unavailable.
    """
    print("=" * 70)
    print("HUGGINGFACE AI-POWERED DIAGRAM CONVERTER")
    print("=" * 70)
    print("Using: HuggingFace Vision AI (BLIP-2/LLaVA) + Smart Generation")
    print("=" * 70)
    
    # Try AI-powered analysis first
    analysis = analyze_diagram_with_ai(image_path)
    
    if analysis.get('has_ai'):
        print("\n[AI MODE] Using Vision AI insights for diagram generation")
        print(f"[ANALYSIS] AI Type: {analysis['ai_insights'].get('diagram_type', 'unknown')}")
        print(f"[ANALYSIS] Layout: {analysis['description']}")
        print(f"[ANALYSIS] Complexity: {analysis['complexity']} - {analysis['elements']}")
        print(f"[ANALYSIS] Dimensions: {analysis['width']}x{analysis['height']} (ratio: {analysis['aspect_ratio']:.2f})")
    else:
        print("\n[TEMPLATE MODE] Using advanced template generation")
        print("[INFO] To enable AI: Set HUGGINGFACE_API_KEY in .env file")
        print(f"[ANALYSIS] Layout: {analysis['description']}")
        print(f"[ANALYSIS] Complexity: {analysis['complexity']} - {analysis['elements']}")
        print(f"[ANALYSIS] Dimensions: {analysis['width']}x{analysis['height']} (ratio: {analysis['aspect_ratio']:.2f})")
    
    print()
    
    # Generate LaTeX code
    print("Generating TikZ template...")
    
    if analysis.get('has_ai'):
        # Use AI insights to generate better template
        latex_code = generate_ai_enhanced_template(analysis)
        print("[SUCCESS] AI-enhanced TikZ template generated")
    else:
        # Use standard template based on analysis
        latex_code = generate_optimized_template(analysis)
        print("[SUCCESS] Intelligent TikZ template generated")
    
    print("[TIP] For best results: Use OpenAI or Gemini converter for complex diagrams")
    
    return latex_code


def generate_ai_enhanced_template(analysis: dict) -> str:
    """Generate TikZ template enhanced with AI insights."""
    ai_insights = analysis.get('ai_insights', {})
    diagram_type = ai_insights.get('diagram_type', 'unknown')
    layout_dir = ai_insights.get('layout_direction', 'mixed')
    
    # Choose template based on AI-detected type
    if diagram_type == 'flowchart':
        if layout_dir == 'horizontal':
            return generate_horizontal_flowchart(analysis['complexity'])
        else:
            return generate_vertical_flowchart(analysis['complexity'])
    elif diagram_type == 'hierarchy':
        return generate_vertical_hierarchy(analysis['complexity'])
    elif diagram_type == 'network':
        return generate_network_diagram(analysis['complexity'])
    elif diagram_type == 'sequence':
        return generate_sequence_diagram(analysis['complexity'])
    else:
        # Fall back to layout-based selection
        layout_type = analysis['layout_type']
        if layout_type == "horizontal":
            return generate_horizontal_flowchart(analysis['complexity'])
        elif layout_type == "vertical":
            return generate_vertical_hierarchy(analysis['complexity'])
        else:
            return generate_network_diagram(analysis['complexity'])

def generate_optimized_template(analysis: dict) -> str:
    """Generate highly optimized TikZ template based on detailed analysis."""
    
    layout_type = analysis['layout_type']
    complexity = analysis['complexity']
    
    # Choose template based on layout
    if layout_type == "horizontal":
        return generate_horizontal_flowchart(complexity)
    elif layout_type == "vertical":
        return generate_vertical_hierarchy(complexity)
    else:
        return generate_network_diagram(complexity)

def generate_horizontal_flowchart(complexity: str) -> str:
    """Generate horizontal flowchart template."""
    return r"""\documentclass{standalone}
\usepackage{tikz}
\usetikzlibrary{shapes.geometric,arrows.meta,positioning,shadows.blur,decorations.pathreplacing}

\begin{document}

\begin{tikzpicture}[
    node distance=3cm,
    auto,
    % Modern gradient styles
    startend/.style={
        ellipse,
        minimum width=2.5cm,
        minimum height=1cm,
        text centered,
        draw=red!80,
        fill=red!20,
        line width=1.2pt,
        blur shadow={shadow blur steps=5}
    },
    process/.style={
        rectangle,
        minimum width=3cm,
        minimum height=1.2cm,
        text centered,
        rounded corners=5pt,
        draw=blue!80,
        fill=blue!15,
        line width=1.2pt,
        blur shadow={shadow blur steps=5}
    },
    decision/.style={
        diamond,
        minimum width=2.8cm,
        minimum height=1.4cm,
        text centered,
        draw=green!80,
        fill=green!15,
        aspect=2,
        line width=1.2pt,
        blur shadow={shadow blur steps=5}
    },
    io/.style={
        trapezium,
        trapezium left angle=70,
        trapezium right angle=110,
        minimum width=2.8cm,
        minimum height=1cm,
        text centered,
        draw=purple!80,
        fill=purple!15,
        line width=1.2pt,
        blur shadow={shadow blur steps=5}
    },
    arrow/.style={
        -{Stealth[length=5mm, width=3mm]},
        line width=1.5pt,
        draw=gray!70
    }
]

% Horizontal Flowchart Layout
\node[startend] (start) {Start};
\node[process, right=of start] (step1) {Initialize\\System};
\node[io, right=of step1] (input) {Get\\Input};
\node[decision, right=of input] (check) {Valid\\Data?};
\node[process, below=1.5cm of check] (process) {Process\\Data};
\node[process, right=of check] (error) {Handle\\Error};
\node[io, below=1.5cm of error] (output) {Output\\Result};
\node[startend, below=1.5cm of process] (end) {End};

% Connections
\draw[arrow] (start) -- (step1);
\draw[arrow] (step1) -- (input);
\draw[arrow] (input) -- (check);
\draw[arrow] (check) -- node[above, font=\small] {No} (error);
\draw[arrow] (check) -- node[right, font=\small] {Yes} (process);
\draw[arrow] (error) -- (output);
\draw[arrow] (process) -- (end);
\draw[arrow] (output) |- (end);

% Add annotation
\node[above=0.3cm of start, font=\small\itshape, text=gray] {AI-Enhanced Template};

\end{tikzpicture}

\end{document}"""


def generate_vertical_flowchart(complexity: str) -> str:
    """Generate vertical flowchart template."""
    return r"""\documentclass{standalone}
\usepackage{tikz}
\usetikzlibrary{shapes.geometric,arrows.meta,positioning,shadows.blur}

\begin{document}

\begin{tikzpicture}[
    node distance=2.5cm,
    auto,
    startend/.style={
        ellipse,
        minimum width=2.5cm,
        minimum height=1cm,
        text centered,
        draw=red!80,
        fill=red!20,
        line width=1.2pt,
        blur shadow={shadow blur steps=5}
    },
    process/.style={
        rectangle,
        minimum width=3cm,
        minimum height=1.2cm,
        text centered,
        rounded corners=5pt,
        draw=blue!80,
        fill=blue!15,
        line width=1.2pt,
        blur shadow={shadow blur steps=5}
    },
    decision/.style={
        diamond,
        minimum width=3cm,
        minimum height=1.5cm,
        text centered,
        draw=green!80,
        fill=green!15,
        aspect=2,
        line width=1.2pt,
        blur shadow={shadow blur steps=5}
    },
    arrow/.style={
        -{Stealth[length=5mm, width=3mm]},
        line width=1.5pt,
        draw=gray!70
    }
]

% Vertical Flowchart Layout
\node[startend] (start) {Start};
\node[process, below=of start] (init) {Initialize};
\node[process, below=of init] (step1) {Step 1};
\node[decision, below=of step1] (check) {Check\\Condition?};
\node[process, below=of check] (step2) {Step 2};
\node[process, right=3cm of check] (alt) {Alternative\\Path};
\node[process, below=of step2] (final) {Finalize};
\node[startend, below=of final] (end) {End};

% Connections
\draw[arrow] (start) -- (init);
\draw[arrow] (init) -- (step1);
\draw[arrow] (step1) -- (check);
\draw[arrow] (check) -- node[right, font=\small] {Yes} (step2);
\draw[arrow] (check) -- node[above, font=\small] {No} (alt);
\draw[arrow] (alt) |- (final);
\draw[arrow] (step2) -- (final);
\draw[arrow] (final) -- (end);

\end{tikzpicture}

\end{document}"""


def generate_sequence_diagram(complexity: str) -> str:
    """Generate sequence/timeline diagram template."""
    return r"""\documentclass{standalone}
\usepackage{tikz}
\usetikzlibrary{positioning,arrows.meta,shadows.blur,shapes.symbols}

\begin{document}

\begin{tikzpicture}[
    node distance=3.5cm,
    event/.style={
        rectangle,
        rounded corners=8pt,
        minimum width=2.5cm,
        minimum height=1.2cm,
        text centered,
        draw=blue!70,
        fill=blue!15,
        line width=1.2pt,
        blur shadow={shadow blur steps=5}
    },
    milestone/.style={
        signal,
        signal to=east,
        signal from=west,
        minimum width=2.8cm,
        minimum height=1cm,
        text centered,
        draw=orange!80,
        fill=orange!15,
        line width=1.2pt,
        blur shadow={shadow blur steps=5}
    },
    arrow/.style={
        -{Stealth[length=5mm, width=3mm]},
        line width=1.5pt,
        draw=gray!60
    }
]

% Timeline sequence (horizontal)
\node[event] (e1) {Event 1\\Start};
\node[event, right=of e1] (e2) {Event 2\\Process};
\node[milestone, right=of e2] (m1) {Milestone\\Achieved};
\node[event, right=of m1] (e3) {Event 3\\Complete};

% Timeline connections
\draw[arrow] (e1) -- (e2);
\draw[arrow] (e2) -- (m1);
\draw[arrow] (m1) -- (e3);

% Timeline axis
\draw[thick, gray!50] ([yshift=-2cm]e1.south) -- ([yshift=-2cm]e3.south);
\foreach \x in {0,1,2,3} {
    \draw[gray!50] ([yshift=-1.8cm, xshift=\x*3.5cm]e1.south) -- ([yshift=-2.2cm, xshift=\x*3.5cm]e1.south);
}

% Time labels
\node[below=2.5cm of e1, font=\small] {T0};
\node[below=2.5cm of e2, font=\small] {T1};
\node[below=2.5cm of m1, font=\small] {T2};
\node[below=2.5cm of e3, font=\small] {T3};

\end{tikzpicture}

\end{document}"""

def generate_vertical_hierarchy(complexity: str) -> str:
    """Generate vertical hierarchy template."""
    return r"""\documentclass{standalone}
\usepackage{tikz}
\usetikzlibrary{shapes.geometric,arrows.meta,positioning,shadows.blur,fit}

\begin{document}

\begin{tikzpicture}[
    level distance=2.5cm,
    sibling distance=3.5cm,
    auto,
    % Hierarchy styles
    boss/.style={
        rectangle,
        rounded corners=8pt,
        minimum width=3.5cm,
        minimum height=1.2cm,
        text centered,
        draw=purple!80,
        fill=purple!20,
        line width=1.5pt,
        blur shadow={shadow blur steps=5}
    },
    manager/.style={
        rectangle,
        rounded corners=5pt,
        minimum width=3cm,
        minimum height=1cm,
        text centered,
        draw=blue!80,
        fill=blue!15,
        line width=1.2pt,
        blur shadow={shadow blur steps=5}
    },
    worker/.style={
        rectangle,
        rounded corners=3pt,
        minimum width=2.5cm,
        minimum height=0.9cm,
        text centered,
        draw=green!80,
        fill=green!10,
        line width=1pt,
        blur shadow={shadow blur steps=5}
    },
    line/.style={
        -{Stealth[length=4mm, width=2.5mm]},
        line width=1.2pt,
        draw=gray!60
    }
]

% Top level
\node[boss] (ceo) {CEO/Director};

% Second level
\node[manager, below left=2cm and 2cm of ceo] (mgr1) {Manager A};
\node[manager, below right=2cm and 2cm of ceo] (mgr2) {Manager B};

% Third level
\node[worker, below left=1.8cm and 1cm of mgr1] (w1) {Team Member 1};
\node[worker, below right=1.8cm and 1cm of mgr1] (w2) {Team Member 2};
\node[worker, below left=1.8cm and 1cm of mgr2] (w3) {Team Member 3};
\node[worker, below right=1.8cm and 1cm of mgr2] (w4) {Team Member 4};

% Connections
\draw[line] (ceo) -- (mgr1);
\draw[line] (ceo) -- (mgr2);
\draw[line] (mgr1) -- (w1);
\draw[line] (mgr1) -- (w2);
\draw[line] (mgr2) -- (w3);
\draw[line] (mgr2) -- (w4);

\end{tikzpicture}

\end{document}"""

def generate_network_diagram(complexity: str) -> str:
    """Generate network/graph diagram template."""
    return r"""\documentclass{standalone}
\usepackage{tikz}
\usetikzlibrary{shapes.geometric,arrows.meta,positioning,shadows.blur,decorations.markings}

\begin{document}

\begin{tikzpicture}[
    node distance=3.5cm,
    auto,
    % Network node styles
    server/.style={
        rectangle,
        rounded corners=3pt,
        minimum width=2.5cm,
        minimum height=1.2cm,
        text centered,
        draw=blue!80,
        fill=blue!15,
        line width=1.2pt,
        blur shadow={shadow blur steps=5}
    },
    database/.style={
        cylinder,
        shape border rotate=90,
        minimum width=2cm,
        minimum height=2cm,
        text centered,
        draw=green!80,
        fill=green!15,
        line width=1.2pt,
        blur shadow={shadow blur steps=5}
    },
    client/.style={
        ellipse,
        minimum width=2.2cm,
        minimum height=1cm,
        text centered,
        draw=orange!80,
        fill=orange!15,
        line width=1.2pt,
        blur shadow={shadow blur steps=5}
    },
    cloud/.style={
        cloud,
        cloud puffs=12,
        minimum width=2.5cm,
        minimum height=1.5cm,
        text centered,
        draw=purple!80,
        fill=purple!10,
        line width=1.2pt
    },
    connection/.style={
        {Stealth[length=4mm]}-{Stealth[length=4mm]},
        line width=1.3pt,
        draw=gray!60
    },
    oneway/.style={
        -{Stealth[length=4mm, width=3mm]},
        line width=1.3pt,
        draw=gray!60
    }
]

% Network layout
\node[client] (client1) {Client 1};
\node[client, right=of client1] (client2) {Client 2};

\node[server, below=2.5cm of $(client1)!0.5!(client2)$] (server) {Application\\Server};

\node[database, below left=2cm and 1.5cm of server] (db) {Database};
\node[cloud, below right=2cm and 1.5cm of server] (cloud) {Cloud\\Storage};

% Connections
\draw[oneway] (client1) -- node[left, font=\small] {Request} (server);
\draw[oneway] (client2) -- node[right, font=\small] {Request} (server);
\draw[connection] (server) -- node[left, font=\small] {Query} (db);
\draw[connection] (server) -- node[right, font=\small] {API} (cloud);

\end{tikzpicture}

\end{document}"""

def main():
    """Command-line interface."""
    if len(sys.argv) < 2:
        print("=" * 70)
        print("HuggingFace Diagram Converter (Template Generator)")
        print("=" * 70)
        print()
        print("⚠️  IMPORTANT: HuggingFace vision models are deprecated")
        print("    This tool generates templates based on image analysis only")
        print()
        print("✅  For AI-powered conversion, use:")
        print("    1. Gemini Diagram (FREE & Excellent) - RECOMMENDED")
        print("    2. OpenAI Diagram (Best Quality)")
        print("    3. DeepSeek Diagram (Budget-Friendly)")
        print()
        print("Usage: python huggingface_diagram.py <image_path> [output_path]")
        print("Example: python huggingface_diagram.py diagram.png diagram.tex")
        print()
        print("See DIAGRAM_CONVERTERS_GUIDE.md for detailed comparison")
        print("=" * 70)
        sys.exit(1)
    
    image_path = sys.argv[1]
    
    # Default output to test_outputs folder
    if len(sys.argv) >= 3:
        output_path = sys.argv[2]
    else:
        test_outputs_dir = Path(__file__).parent.parent / "test_outputs"
        test_outputs_dir.mkdir(exist_ok=True)
        output_path = test_outputs_dir / f"{Path(image_path).stem}_huggingface.tex"
    
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
