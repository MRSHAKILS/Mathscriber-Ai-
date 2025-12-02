"""
Test different Gemini model names to find which one works.
"""
import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
api_key = os.getenv('GOOGLE_API_KEY')
genai.configure(api_key=api_key)

models_to_test = [
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-1.5-flash-latest',
    'gemini-1.5-pro',
    'gemini-1.5-pro-latest',
    'gemini-pro-vision',
]

print("Testing Gemini models:")
print("="*60)

for model_name in models_to_test:
    try:
        model = genai.GenerativeModel(model_name)
        response = model.generate_content('Say "OK"')
        print(f"✅ {model_name} - WORKS")
        print(f"   Response: {response.text}")
        break  # Use the first working model
    except Exception as e:
        error_msg = str(e)[:100]
        print(f"❌ {model_name} - {error_msg}")
