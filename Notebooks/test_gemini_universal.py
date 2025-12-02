#!/usr/bin/env python3
"""
Test script for Gemini Universal Converter
This script tests the auto-detection and conversion capabilities.
"""

import os
import sys
from pathlib import Path

# Add the Notebooks directory to the path
notebooks_dir = Path(__file__).parent
sys.path.insert(0, str(notebooks_dir))

# Import the gemini_universal module
try:
    from gemini_universal import detect_content_type, create_universal_latex
    print("✅ Successfully imported gemini_universal module")
except ImportError as e:
    print(f"❌ Failed to import gemini_universal: {e}")
    sys.exit(1)

def test_detection():
    """Test the content detection functionality"""
    print("\n" + "="*70)
    print("TESTING CONTENT DETECTION")
    print("="*70)
    
    # You would need a test image here
    test_image = "test_image.png"
    
    if not os.path.exists(test_image):
        print(f"⚠️  Test image not found: {test_image}")
        print("   To test, create a test image with equations/tables/diagrams")
        return False
    
    try:
        content_info = detect_content_type(test_image)
        print(f"\n✅ Detection Results:")
        print(f"   Primary Type: {content_info['primary']}")
        print(f"   Has Equations: {content_info['has_equations']}")
        print(f"   Has Tables: {content_info['has_tables']}")
        print(f"   Has Diagrams: {content_info['has_diagrams']}")
        return True
    except Exception as e:
        print(f"❌ Detection failed: {e}")
        return False

def test_conversion():
    """Test the LaTeX conversion functionality"""
    print("\n" + "="*70)
    print("TESTING LATEX CONVERSION")
    print("="*70)
    
    test_image = "test_image.png"
    
    if not os.path.exists(test_image):
        print(f"⚠️  Test image not found: {test_image}")
        print("   To test, create a test image with equations/tables/diagrams")
        return False
    
    try:
        # First detect content
        content_info = detect_content_type(test_image)
        
        # Then convert
        latex_code = create_universal_latex(test_image, content_info)
        
        if latex_code:
            print(f"\n✅ Conversion successful!")
            print(f"   Generated {len(latex_code)} characters of LaTeX code")
            
            # Save to test output
            output_file = "test_output_universal.tex"
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(latex_code)
            print(f"   Saved to: {output_file}")
            
            # Show preview
            print(f"\n📄 Preview (first 500 chars):")
            print("-" * 70)
            print(latex_code[:500])
            if len(latex_code) > 500:
                print("...")
            print("-" * 70)
            
            return True
        else:
            print("❌ Conversion returned empty result")
            return False
            
    except Exception as e:
        print(f"❌ Conversion failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def check_environment():
    """Check if all required dependencies are available"""
    print("\n" + "="*70)
    print("CHECKING ENVIRONMENT")
    print("="*70)
    
    checks = {
        'Google API Key': False,
        'google-generativeai package': False,
        'PIL/Pillow package': False,
        'dotenv package': False
    }
    
    # Check API key
    from dotenv import load_dotenv
    env_path = notebooks_dir.parent / '.env'
    load_dotenv(env_path)
    api_key = os.getenv("GOOGLE_API_KEY")
    if api_key:
        checks['Google API Key'] = True
        print(f"✅ Google API Key found")
    else:
        print(f"❌ Google API Key not found in .env file")
    
    # Check packages
    try:
        import google.generativeai
        checks['google-generativeai package'] = True
        print(f"✅ google-generativeai package installed")
    except ImportError:
        print(f"❌ google-generativeai package not installed")
        print(f"   Install with: pip install google-generativeai")
    
    try:
        from PIL import Image
        checks['PIL/Pillow package'] = True
        print(f"✅ PIL/Pillow package installed")
    except ImportError:
        print(f"❌ PIL/Pillow package not installed")
        print(f"   Install with: pip install Pillow")
    
    try:
        import dotenv
        checks['dotenv package'] = True
        print(f"✅ dotenv package installed")
    except ImportError:
        print(f"❌ dotenv package not installed")
        print(f"   Install with: pip install python-dotenv")
    
    all_checks_passed = all(checks.values())
    
    print("\n" + "="*70)
    if all_checks_passed:
        print("✅ All environment checks passed!")
    else:
        print("⚠️  Some checks failed. Please install missing dependencies.")
    print("="*70)
    
    return all_checks_passed

def main():
    """Main test runner"""
    print("="*70)
    print("GEMINI UNIVERSAL CONVERTER - TEST SUITE")
    print("="*70)
    
    # Check environment first
    env_ok = check_environment()
    
    if not env_ok:
        print("\n❌ Environment check failed. Please fix issues before testing.")
        return
    
    # Test detection
    print("\n" + "="*70)
    print("TEST 1: Content Detection")
    print("="*70)
    detection_ok = test_detection()
    
    # Test conversion
    print("\n" + "="*70)
    print("TEST 2: LaTeX Conversion")
    print("="*70)
    conversion_ok = test_conversion()
    
    # Summary
    print("\n" + "="*70)
    print("TEST SUMMARY")
    print("="*70)
    print(f"Environment Check: {'✅ PASS' if env_ok else '❌ FAIL'}")
    print(f"Content Detection: {'✅ PASS' if detection_ok else '⚠️  SKIP (no test image)'}")
    print(f"LaTeX Conversion:  {'✅ PASS' if conversion_ok else '⚠️  SKIP (no test image)'}")
    print("="*70)
    
    print("\n💡 TIP: To run full tests, create a 'test_image.png' with")
    print("   equations, tables, or diagrams in the Notebooks directory.")
    print("\n📚 Usage: python gemini_universal.py <image_path> [output_path]")

if __name__ == "__main__":
    main()
