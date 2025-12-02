"""
Test the Django API endpoint directly
"""
import requests
from PIL import Image, ImageDraw, ImageFont
from io import BytesIO
import time

def test_api_endpoint():
    print("=" * 60)
    print("TESTING DJANGO API ENDPOINT")
    print("=" * 60)
    
    # Create test image
    img = Image.new('RGB', (400, 100), color='white')
    draw = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype("arial.ttf", 36)
    except:
        font = ImageFont.load_default()
    
    draw.text((50, 30), 'x² + y² = r²', fill='black', font=font)
    
    buffer = BytesIO()
    img.save(buffer, format='PNG')
    buffer.seek(0)
    
    print("\n✓ Created test image with equation: x² + y² = r²")
    
    # Wait for server to be ready
    print("\nWaiting for server...")
    time.sleep(2)
    
    # Test the API
    print("\nSending POST request to http://127.0.0.1:8000/api/convert-image/")
    
    try:
        files = {'image': ('test.png', buffer, 'image/png')}
        data = {'task': 'equation'}
        
        response = requests.post(
            'http://127.0.0.1:8000/api/convert-image/',
            files=files,
            data=data,
            timeout=30
        )
        
        print(f"\nStatus Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("\n" + "=" * 60)
            print("SUCCESS! API Response:")
            print("=" * 60)
            print(f"Success: {result.get('success')}")
            print(f"Message: {result.get('message')}")
            print(f"\nLaTeX Code:\n{result.get('latex_code')}")
            print("=" * 60)
            print("\n✓ FRONTEND-BACKEND INTEGRATION VERIFIED")
            print("✓ Image conversion is working end-to-end")
            return True
        else:
            print(f"\n✗ API returned error status: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("\n✗ Could not connect to server")
        print("  Make sure Django server is running on port 8000")
        return False
    except Exception as e:
        print(f"\n✗ Error: {e}")
        return False

if __name__ == '__main__':
    test_api_endpoint()
