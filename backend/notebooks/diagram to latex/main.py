import os
from input_processing import DiagramProcessor
from latex_code_generatation import LatexGenerator, CodeValidator
import argparse

class DiagramToLatexConverter:
    def __init__(self):
        self.processor = DiagramProcessor()
        self.generator = LatexGenerator()
        self.validator = CodeValidator()

    def convert(self, image_path: str):
        try:
            # Step 1: Preprocess image
            print("📷 Preprocessing image...")
            processed_image = self.processor.preprocess_image(image_path)

            # Step 2: Generate LaTeX
            print("⚡ Generating LaTeX code...")
            latex_code = self.generator.generate_latex({"diagram_analysis": processed_image})

            # Step 3: Validate and refine
            print("🔧 Validating and refining code...")
            validation_result = self.validator.validate_latex(latex_code)

            return {
                "status": "success",
                "latex_code": validation_result["improved_code"],
                "original_code": latex_code
            }

        except Exception as e:
            return {
                "status": "error",
                "error": str(e)
            }

# Update the main function to use the new pipeline
def main():
    parser = argparse.ArgumentParser(description="Convert a diagram image to LaTeX code.")
    parser.add_argument("image_path", type=str, help="Path to the diagram image file.")
    args = parser.parse_args()

    converter = DiagramToLatexConverter()

    # Use the provided image path
    image_path = args.image_path

    result = converter.convert(image_path)

    if result["status"] == "success":
        print("✅ Conversion successful!")
        print("\nGenerated LaTeX Code:\n")
        print(result["latex_code"])

        # Save to file
        with open("output.tex", "w") as f:
            f.write(result["latex_code"])
        print("\n💾 Code saved to output.tex")

    else:
        print(f"❌ Conversion failed: {result['error']}")

if __name__ == "__main__":
    main()