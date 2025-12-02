import sys  # Provides access to command-line arguments and system functions
from utils.encoder import encode_image_to_base64  # Handles image encoding to Base64
from utils.openai_client import get_openai_client, generate_latex_from_image  # OpenAI client and LaTeX generation
from utils.file_writer import save_latex_to_file  # Handles saving LaTeX code to a file

def main():
    """
    Main entry point for converting a diagram image to LaTeX TikZ code using OpenAI Vision.
    Expects an image file path as a command-line argument.
    """

    # Validate command-line arguments
    if len(sys.argv) < 2:
        print("Usage: python main.py <image_path>")
        sys.exit(1)

    image_path = sys.argv[1]

    # Encode the input image to a Base64 string
    print("📸 Encoding image to Base64...")
    base64_image = encode_image_to_base64(image_path)

    # Initialize the OpenAI API client
    print("🤖 Connecting to OpenAI API...")
    client = get_openai_client()

    # Generate LaTeX code from the encoded image using the OpenAI Vision model
    print("🧠 Generating LaTeX code from diagram...")
    latex_code = generate_latex_from_image(client, base64_image, image_path=image_path)

    # Save the generated LaTeX code to a file
    print("💾 Saving result to file...")
    save_latex_to_file(latex_code)

    print("\n🎉 Process completed successfully!")

if __name__ == "__main__":
    main()
