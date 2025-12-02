import os

def save_latex_to_file(latex_code: str, output_dir="outputs", filename="result.tex"):
    """
    Saves the generated LaTeX code into a specified file.
    """
    os.makedirs(output_dir, exist_ok=True)
    file_path = os.path.join(output_dir, filename)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(latex_code)

    print(f"✅ LaTeX code successfully saved to: {file_path}")
