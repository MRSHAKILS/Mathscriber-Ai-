import os  # For environment variable access
import mimetypes  # For automatic MIME type detection based on file extension
from openai import OpenAI  # OpenAI SDK for API interaction
from dotenv import load_dotenv  # Loads environment variables from a .env file

def get_openai_client():
    """
    Initializes and returns an OpenAI API client using the API key from environment variables.
    """
    load_dotenv()
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY not found in environment or .env file")
    return OpenAI(api_key=api_key)

def generate_latex_from_image(client, base64_image: str, model="gpt-4.1", image_path: str = None):
    """
    Sends a Base64-encoded image to the OpenAI Vision model and retrieves LaTeX TikZ code.

    Args:
        client: Initialized OpenAI client.
        base64_image: Base64-encoded string of the input image.
        model: OpenAI Vision model to use for inference.
        image_path: Path to the original image file (used for MIME type detection).

    Returns:
        str: Generated LaTeX TikZ code as a string.
    """

    prompt = (
        "You are a LaTeX expert specializing in TikZ diagram generation.\n"
        "Convert the following diagram image into **complete, compilable LaTeX code** using TikZ.\n"
        "Include all arrows, colors, text, and layout structure exactly as shown.\n"
        "The final code must compile standalone with \\documentclass and \\begin{document}.\n"
        "Do not include explanations — only output the LaTeX code block."
    )

    # Detect the MIME type of the image for correct data URI formatting
    mime_type, _ = mimetypes.guess_type(image_path or "image.png")
    if not mime_type:
        mime_type = "image/png"  # Default to PNG if detection fails

    # Format the image as a data URI for the OpenAI API
    image_url = f"data:{mime_type};base64,{base64_image}"

    # Send the request to the OpenAI Vision model
    response = client.responses.create(
        model=model,
        input=[
            {
                "role": "user",
                "content": [
                    {"type": "input_text", "text": prompt},
                    {"type": "input_image", "image_url": image_url},
                ],
            }
        ],
    )

    return response.output_text
