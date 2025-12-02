import os
from mistralai import Mistral
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

API_KEY = os.getenv("MISTRAL_API_KEY")
if not API_KEY:
    raise ValueError("Missing MISTRAL_API_KEY in .env file!")

# Initialize Mistral client
client = Mistral(api_key=API_KEY)

def convert_to_latex(file_path, model="pixtral-12b"):
    """
    Converts an equation/table image or PDF to LaTeX code using Mistral API.

    Args:
        file_path (str): Path to the image or PDF.
        model (str): Mistral model name. 'pixtral-12b' supports vision inputs.

    Returns:
        str: Generated LaTeX code
    """
    try:
        # Send the file and prompt to the model
        response = client.chat.complete(
            model=model,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "Convert this image or PDF content to LaTeX code. Respond with only the code."},
                        {"type": "image_url", "image_url": f"file://{os.path.abspath(file_path)}"},
                    ],
                }
            ],
        )

        latex_code = response.choices[0].message["content"][0]["text"].strip()
        print("\n✅ Conversion successful! LaTeX Code:\n")
        print(latex_code)
        return latex_code

    except Exception as e:
        print(f"❌ Error: {e}")
        return None

if __name__ == "__main__":
    path = input("Enter the image or PDF path: ").strip()
    convert_to_latex(path)
