#!/usr/bin/env python3
"""
List all available Gemini models for the current API key.
"""

import os
from dotenv import load_dotenv

# Load environment variables
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(env_path)

try:
    import google.generativeai as genai
except ImportError:
    print("Error: google-generativeai package not installed")
    exit(1)

api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    print("Error: GOOGLE_API_KEY not found in environment variables")
    exit(1)

genai.configure(api_key=api_key)

print("Available Gemini Models:")
print("=" * 70)

for model in genai.list_models():
    if 'generateContent' in model.supported_generation_methods:
        print(f"\nModel: {model.name}")
        print(f"  Display Name: {model.display_name}")
        print(f"  Description: {model.description}")
        print(f"  Supported Methods: {', '.join(model.supported_generation_methods)}")

print("\n" + "=" * 70)
