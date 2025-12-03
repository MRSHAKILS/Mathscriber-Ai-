#!/usr/bin/env python3
"""
groq_table_equation_to_tex.py

Utility to convert an input image or PDF page (table or equation) into a
complete standalone .tex file by calling a Groq vision-capable model.

Features:
- Accepts image files (png/jpg/jpeg) or PDF files.
- For PDFs, converts each page to an image and processes pages individually.
- Sends the image (as a base64 data URI) to Groq's chat completions API using
  the official groq Python client.
- Uses strict prompt templates for tables (user-provided directives replicated)
  and a friendly template for equations.
- Writes model output to a .tex file (one file per processed image/page).

Requirements:
    pip install groq pillow pdf2image

Notes:
- You must set your Groq API key in the environment variable GROQ_API_KEY.
- The script attempts to use a Groq vision-capable model. Change MODEL_NAME
  below if you have a preferred model available in your Groq account.
- This is a best-effort tool: results depend on the model's vision + parsing quality.

Usage examples:
    python groq_table_equation_to_tex.py --input table_image.png --mode table --out table.tex
    python groq_table_equation_to_tex.py --input equations.pdf --mode equation --out eq_page_%d.tex

Author: assistant (adapted for Groq)
"""
import os
import sys
import base64
import argparse
import tempfile
from pathlib import Path

from PIL import Image

# Optional: convert PDFs to images
try:
    from pdf2image import convert_from_path
    PDF2IMAGE_AVAILABLE = True
except Exception:
    PDF2IMAGE_AVAILABLE = False

# Groq python client
try:
    # The official Groq client exposes a Groq class in many examples; some docs show 'Groq' or 'groq.Groq'
    # We'll attempt import style used in official quickstart.
    from groq import Groq
except Exception as e:
    raise RuntimeError(
        "Could not import the groq Python client. Install with: pip install groq\n"
        f"Import error: {e}"
    )


# ---------- Configuration ----------
# Vision-capable model to use. Change if you have a specific model you'd like to call.
# Examples seen in Groq docs: "meta-llama/llama-4-scout-17b-16e-instruct" or "llama-3.3-70b-versatile"
MODEL_NAME = "meta-llama/llama-4-scout-17b-16e-instruct"

# System-level prompt for table conversion (replicates the user's strict directives).
TABLE_SYSTEM_PROMPT = r"""
You are a precision LaTeX document generator. Your mission is to convert the provided table image into a
complete, standalone, and directly compilable `.tex` file. The final document must perfectly render the entire table, with all columns and borders visible.

EXECUTION DIRECTIVES (NON-NEGOTIABLE):

1. Generate a Full Document: Output MUST be a complete LaTeX document. It must start with `\documentclass{article}` and end with `\end{document}`.

2. Force Page Width: Include the `geometry` package using these exact settings in the preamble:
   \usepackage[a4paper, margin=1cm, hmargin=1cm, vmargin=2cm]{geometry}

3. Required Packages: The preamble MUST include `\usepackage{tabularx}` and `\usepackage{booktabs}`.

4. Table Environment:
   * Use the `tabularx` environment and set its width to `\linewidth`.
   * Column specifiers MUST replicate all vertical borders seen in the image (e.g., `{|l|X|c|c|}`).
   * Use `X` type ONLY for column(s) with long/wrapping text. Use `l`, `c`, `r` for other columns.

5. Border Fidelity: Replicate ALL horizontal lines using `\hline`. Include a `\hline` after the header, after every data row, and at the very end of the table to create a complete box.

6. No Extra Content: The document body should contain ONLY the table. Do not add any text before `\begin{tabularx}` or after `\end{tabularx}`.

7. Final Output: Return only the raw .tex file contents (the full .tex document as plaintext). Do not include commentary, explanations, or any extra text.
"""

# System-level prompt for equation conversion
EQUATION_SYSTEM_PROMPT = r"""
You are a precision LaTeX document generator. Convert the provided image (which contains mathematical equations) into a
complete, standalone, directly compilable `.tex` file that renders the equation(s) precisely.

Requirements:
- Output a full LaTeX document that begins with `\documentclass{article}` and ends with `\end{document}`.
- Use the geometry package to allow ample horizontal space:
  \usepackage[a4paper, margin=1cm, hmargin=1cm, vmargin=2cm]{geometry}
- Include amsmath package (`\usepackage{amsmath}`), and any other standard math packages required.
- If the image contains a single equation, typeset it using display math (e.g. `\[ ... \]` or `equation`).
- If multiple numbered equations are present, use `align` or `equation` environments and preserve numbering where possible.
- Return only the raw .tex file contents (the full .tex document as plaintext). No extra commentary.
"""

# Helper prompt fragment instructing how to embed the image reference in the message
IMAGE_INSTRUCTION = (
    "The image to convert is attached below as a base64 data-uri. "
    "Please analyze the image and produce the requested .tex file exactly per the system instructions.\n\n"
    "Image (data URI):\n"
)

# ---------- Helpers ----------
def image_file_to_data_uri(path: Path, format_hint: str = None) -> str:
    """Read an image file and return a data URI (base64)."""
    with open(path, "rb") as f:
        raw = f.read()
    b64 = base64.b64encode(raw).decode("ascii")
    # try to infer mime type from suffix
    suffix = path.suffix.lower().lstrip(".")
    mime = None
    if suffix in ("jpg", "jpeg"):
        mime = "image/jpeg"
    elif suffix in ("png",):
        mime = "image/png"
    elif suffix in ("gif",):
        mime = "image/gif"
    elif suffix in ("pdf",) and format_hint:
        mime = f"application/pdf"
    else:
        # fallback
        mime = "application/octet-stream"
    return f"data:{mime};base64,{b64}"


def convert_pdf_to_images(pdf_path: Path, dpi=200):
    """
    Convert a PDF into PIL Image objects (one per page).
    Requires pdf2image (and poppler installed on the system).
    """
    if not PDF2IMAGE_AVAILABLE:
        raise RuntimeError("pdf2image is required to convert PDFs. Install with: pip install pdf2image")
    imgs = convert_from_path(str(pdf_path), dpi=dpi)
    return imgs


def pil_image_to_data_uri(img: Image.Image, fmt="PNG") -> str:
    """Encode a PIL Image to a PNG base64 data URI."""
    import io
    buf = io.BytesIO()
    img.save(buf, format=fmt)
    b64 = base64.b64encode(buf.getvalue()).decode("ascii")
    mime = "image/png" if fmt.lower() == "png" else f"image/{fmt.lower()}"
    return f"data:{mime};base64,{b64}"


def build_messages_for_table(data_uri: str) -> list:
    """Construct messages list for table processing per the strict directives."""
    messages = [
        {"role": "system", "content": TABLE_SYSTEM_PROMPT},
        {"role": "user", "content": IMAGE_INSTRUCTION + data_uri + "\n\nPlease produce the .tex file now."}
    ]
    return messages


def build_messages_for_equation(data_uri: str) -> list:
    messages = [
        {"role": "system", "content": EQUATION_SYSTEM_PROMPT},
        {"role": "user", "content": IMAGE_INSTRUCTION + data_uri + "\n\nPlease produce the .tex file now."}
    ]
    return messages


# ---------- Core conversion ----------
def call_groq_with_messages(messages: list, model: str = MODEL_NAME, temperature: float = 0.0, timeout_seconds: int = 120):
    """
    Calls Groq chat completions endpoint with the provided message list.
    Returns the content string produced by the model (assumes single choice).
    """
    client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
    # Create chat completion
    completion = client.chat.completions.create(
        messages=messages,
        model=model,
        temperature=temperature,
        # You can tune max_output_tokens if desired. Letting default for now.
    )
    # Groq responses typically hold content in choices[0].message.content
    try:
        content = completion.choices[0].message.content
    except Exception:
        # The exact shape might differ; try alternative access patterns
        try:
            content = completion.choices[0].text
        except Exception:
            raise RuntimeError("Unexpected Groq response structure: " + str(completion))
    return content


# ---------- CLI ----------
def main():
    parser = argparse.ArgumentParser(
        description="Convert an image or PDF (table/equation) into a standalone .tex file using Groq vision LLM."
    )
    parser.add_argument("--input", "-i", required=True, help="Path to input image (png/jpg) or PDF.")
    parser.add_argument("--mode", "-m", choices=["table", "equation", "auto"], default="auto",
                        help="Processing mode. 'table' uses table-specific strict directives. 'equation' uses math directives. 'auto' tries to detect (best-effort) but will default to table if uncertain.")
    parser.add_argument("--out", "-o", required=True,
                        help="Output filename pattern. Use %d for page number when input is PDF and multi-page (e.g. out_page_%d.tex). For single image, the literal name is used.")
    parser.add_argument("--model", default=MODEL_NAME, help="Groq model name to call (override default).")
    parser.add_argument("--dpi", type=int, default=200, help="PDF->image DPI (if input is PDF).")
    args = parser.parse_args()

    groq_model = args.model

    input_path = Path(args.input)
    if not input_path.exists():
        print(f"Error: input file not found: {input_path}", file=sys.stderr)
        sys.exit(2)

    out_pattern = args.out

    # If input is PDF: convert pages
    if input_path.suffix.lower() == ".pdf":
        if not PDF2IMAGE_AVAILABLE:
            print("Error: pdf2image not installed; cannot convert PDF. Install with: pip install pdf2image", file=sys.stderr)
            sys.exit(2)
        print("Converting PDF to images...", file=sys.stderr)
        pages = convert_from_path(str(input_path), dpi=args.dpi)
        print(f"PDF has {len(pages)} page(s). Processing each page...", file=sys.stderr)
        for idx, page in enumerate(pages, start=1):
            data_uri = pil_image_to_data_uri(page, fmt="PNG")
            if args.mode == "equation":
                messages = build_messages_for_equation(data_uri)
            elif args.mode == "table":
                messages = build_messages_for_table(data_uri)
            else:  # auto: simple heuristic - ask the model to detect type first
                # We'll ask the model to classify the page's content quickly, then call with appropriate system prompt.
                classification_prompt = [
                    {"role": "system", "content": "You are an image classifier. Reply with exactly one word: TABLE or EQUATION."},
                    {"role": "user", "content": IMAGE_INSTRUCTION + data_uri + "\n\nDoes this image contain a TABLE or a mathematical EQUATION? Reply only TABLE or EQUATION."}
                ]
                cls_resp = call_groq_with_messages(classification_prompt, model=groq_model)
                # take first token
                cls = (cls_resp or "").strip().splitlines()[0].strip().upper()
                if "TABLE" in cls:
                    messages = build_messages_for_table(data_uri)
                else:
                    messages = build_messages_for_equation(data_uri)

            print(f"Calling Groq model for page {idx}...", file=sys.stderr)
            try:
                tex_content = call_groq_with_messages(messages, model=groq_model, temperature=0.0)
            except Exception as e:
                print(f"Groq call failed for page {idx}: {e}", file=sys.stderr)
                continue

            # Save output file for this page
            try:
                out_fname = out_pattern % idx
            except TypeError:
                # If pattern doesn't accept %d, just append page number
                out_fname = f"{out_pattern.rstrip('.tex')}_page{idx}.tex"
            with open(out_fname, "w", encoding="utf-8") as f:
                f.write(tex_content)
            print(f"Wrote: {out_fname}", file=sys.stderr)

    else:
        # Single image
        # Build data URI (read raw file)
        data_uri = image_file_to_data_uri(input_path)
        if args.mode == "table":
            messages = build_messages_for_table(data_uri)
        elif args.mode == "equation":
            messages = build_messages_for_equation(data_uri)
        else:
            # Auto -> simple classification roundtrip as above
            classification_prompt = [
                {"role": "system", "content": "You are an image classifier. Reply with exactly one word: TABLE or EQUATION."},
                {"role": "user", "content": IMAGE_INSTRUCTION + data_uri + "\n\nDoes this image contain a TABLE or a mathematical EQUATION? Reply only TABLE or EQUATION."}
            ]
            cls_resp = call_groq_with_messages(classification_prompt, model=groq_model)
            cls = (cls_resp or "").strip().splitlines()[0].strip().upper()
            if "TABLE" in cls:
                messages = build_messages_for_table(data_uri)
            else:
                messages = build_messages_for_equation(data_uri)

        print("Calling Groq model for single image...", file=sys.stderr)
        tex_content = call_groq_with_messages(messages, model=groq_model, temperature=0.0)

        # Save output
        out_fname = out_pattern
        with open(out_fname, "w", encoding="utf-8") as f:
            f.write(tex_content)
        print(f"Wrote: {out_fname}", file=sys.stderr)


if __name__ == "__main__":
    main()
