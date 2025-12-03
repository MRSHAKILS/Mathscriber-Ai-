"""
Quick test to verify Gemini API is working correctly.
"""
import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment
load_dotenv()

# Configure Gemini
api_key = os.getenv('GOOGLE_API_KEY')
if not api_key:
    print("❌ GOOGLE_API_KEY not found in .env")
    exit(1)

print(f"✅ API Key found: {api_key[:10]}...")

try:
    genai.configure(api_key=api_key)
    print("✅ Gemini configured")
    
    # Test with a simple prompt
    model = genai.GenerativeModel('gemini-2.0-flash-exp')
    print("✅ Model created: gemini-2.0-flash-exp")
    
    response = model.generate_content('Say hello')
    print(f"✅ API Response: {response.text}")
    
    print("\n" + "="*60)
    print("SUCCESS! Gemini API is working correctly!")
    print("="*60)
    
except Exception as e:
    print(f"\n❌ Error: {e}")
    print("\nTrying with gemini-1.5-flash instead...")
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content('Say hello')
        print(f"✅ Works with gemini-1.5-flash: {response.text}")
        print("\n⚠️  You need to update agent files to use 'gemini-1.5-flash' instead of 'gemini-2.0-flash-exp'")
    except Exception as e2:
        print(f"❌ Also failed: {e2}")
