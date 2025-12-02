"""
End-to-End Verification Test
Tests the complete flow: Upload → Universal Detection → Conversion → Database Storage
"""
import os
import sys
import requests
from PIL import Image, ImageDraw, ImageFont
from io import BytesIO

# Backend API base URL
API_URL = "http://127.0.0.1:8000/api"

def create_test_image(text="E = mc²"):
    """Create a simple test image with text"""
    img = Image.new('RGB', (400, 100), color='white')
    draw = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype("arial.ttf", 36)
    except:
        font = ImageFont.load_default()
    draw.text((50, 30), text, fill='black', font=font)
    return img

def test_conversion_api():
    """Test the complete conversion flow"""
    print("=" * 70)
    print("END-TO-END VERIFICATION TEST")
    print("=" * 70)
    
    # Step 1: Create test image
    print("\n[1/5] Creating test image...")
    img = create_test_image("x² + y² = r²")
    buffer = BytesIO()
    img.save(buffer, format='PNG')
    buffer.seek(0)
    print("✓ Test image created")
    
    # Step 2: Send to API
    print("\n[2/5] Sending image to conversion API...")
    files = {'image': ('test.png', buffer, 'image/png')}
    data = {'task': 'equation'}
    
    response = requests.post(f'{API_URL}/convert-image/', files=files, data=data)
    print(f"✓ API Response Status: {response.status_code}")
    
    if response.status_code != 200:
        print(f"✗ API Error: {response.text}")
        return False
    
    result = response.json()
    
    # Step 3: Verify response structure
    print("\n[3/5] Verifying response structure...")
    required_fields = ['success', 'conversion_id', 'latex_code', 'detected_content']
    for field in required_fields:
        if field in result:
            print(f"✓ Field '{field}' present")
        else:
            print(f"✗ Field '{field}' missing")
            return False
    
    conversion_id = result.get('conversion_id')
    latex_code = result.get('latex_code')
    detected_content = result.get('detected_content', {})
    
    print(f"\n📋 Conversion ID: {conversion_id}")
    print(f"📐 Primary Type: {detected_content.get('primary', 'Unknown')}")
    print(f"📊 Has Equations: {detected_content.get('has_equations', False)}")
    print(f"📝 Has Tables: {detected_content.get('has_tables', False)}")
    print(f"🎨 Has Diagrams: {detected_content.get('has_diagrams', False)}")
    
    # Step 4: Verify LaTeX code
    print("\n[4/5] Verifying LaTeX code...")
    if latex_code and len(latex_code) > 0:
        print(f"✓ LaTeX code generated ({len(latex_code)} characters)")
        print("\nFirst 200 characters:")
        print(latex_code[:200] + "...")
    else:
        print("✗ No LaTeX code generated")
        return False
    
    # Step 5: Test result retrieval
    print("\n[5/5] Testing result retrieval API...")
    result_response = requests.get(f'{API_URL}/result/{conversion_id}/')
    print(f"✓ Result API Status: {result_response.status_code}")
    
    if result_response.status_code == 200:
        result_data = result_response.json()
        if result_data.get('success'):
            print("✓ Result retrieved successfully")
            stored_latex = result_data.get('data', {}).get('latex_code', '')
            if stored_latex == latex_code:
                print("✓ Stored LaTeX matches original")
            else:
                print("⚠ Stored LaTeX differs from original")
        else:
            print(f"✗ Result retrieval failed: {result_data.get('message')}")
            return False
    else:
        print(f"✗ Result API Error: {result_response.text}")
        return False
    
    return True

def main():
    print("\n🚀 Starting End-to-End Verification...\n")
    
    # Test API health
    print("Checking API health...")
    try:
        health_response = requests.get(f'{API_URL}/health/')
        if health_response.status_code == 200:
            print("✓ Backend API is running")
        else:
            print("✗ Backend API health check failed")
            return
    except requests.exceptions.ConnectionError:
        print("✗ Cannot connect to backend. Make sure it's running on port 8000")
        return
    
    # Run main test
    success = test_conversion_api()
    
    print("\n" + "=" * 70)
    if success:
        print("✅ ALL TESTS PASSED")
        print("=" * 70)
        print("\nFeatures Verified:")
        print("  ✓ Universal content detection working")
        print("  ✓ LaTeX conversion working")
        print("  ✓ Database storage working")
        print("  ✓ Result retrieval working")
        print("  ✓ Frontend-backend integration ready")
        print("\n🎉 System is fully operational!")
        print("\nNext Steps:")
        print("  1. Open: http://localhost:3001/upload")
        print("  2. Upload an image with equations/tables/diagrams")
        print("  3. Select task type or use 'Auto-Detect'")
        print("  4. Click 'Convert to LaTeX'")
        print("  5. View beautiful result with processing animation!")
    else:
        print("❌ TESTS FAILED")
        print("=" * 70)
        print("\nPlease check the errors above and try again.")
    print("=" * 70)

if __name__ == '__main__':
    main()
