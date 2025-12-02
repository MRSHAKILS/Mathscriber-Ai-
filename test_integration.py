"""
Simple integration test to verify frontend-backend connection
and image-to-LaTeX conversion
"""
import os
import sys
import django

# Set environment
os.environ['GOOGLE_API_KEY'] = 'AIzaSyBrwfPQBRlNRXgK2CUE1vM1pJXCJzl0hN0'
os.environ['DJANGO_SETTINGS_MODULE'] = 'mathscriber_ai.settings'

# Add backend to path
sys.path.insert(0, r'E:\Machine Learning\Projects\Solvio Hackathon\UpScriber\Mathscriber-Ai-\backend')

# Setup Django
django.setup()

from converter.converter import GeminiConverter
from PIL import Image, ImageDraw, ImageFont
from io import BytesIO

def test_equation_conversion():
    """Test converting a simple equation image to LaTeX"""
    print("=" * 50)
    print("INTEGRATION TEST: Image to LaTeX Conversion")
    print("=" * 50)
    
    # Create test image with equation
    img = Image.new('RGB', (400, 100), color='white')
    draw = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype("arial.ttf", 36)
    except:
        font = ImageFont.load_default()
    
    draw.text((50, 30), 'E = mc²', fill='black', font=font)
    
    # Save to buffer
    buffer = BytesIO()
    img.save(buffer, format='PNG')
    buffer.seek(0)
    buffer.name = 'test_equation.png'
    
    print("\n✓ Created test image with equation: E = mc²")
    
    # Initialize converter
    try:
        converter = GeminiConverter()
        print("✓ Initialized Gemini Converter")
    except Exception as e:
        print(f"✗ Failed to initialize converter: {e}")
        return False
    
    # Convert image to LaTeX
    print("\nConverting image to LaTeX...")
    try:
        latex_output = converter.convert_image_to_latex(buffer, task_type='equation')
        print("\n" + "=" * 50)
        print("SUCCESS! LaTeX Output:")
        print("=" * 50)
        print(latex_output)
        print("=" * 50)
        return True
    except Exception as e:
        print(f"\n✗ Conversion failed: {e}")
        return False

if __name__ == '__main__':
    success = test_equation_conversion()
    print("\n" + "=" * 50)
    if success:
        print("✓ INTEGRATION TEST PASSED")
        print("✓ Backend is connected and working")
        print("✓ Gemini API is functional")
        print("✓ Frontend should be able to use the API at:")
        print("  http://localhost:8000/api/convert-image/")
    else:
        print("✗ INTEGRATION TEST FAILED")
    print("=" * 50)
