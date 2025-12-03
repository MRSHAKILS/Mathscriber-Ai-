"""
Test script for Napkin AI Visual Generation
Run this to test your Napkin API connection and debug issues
"""
import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'MathScriber.settings')
django.setup()

from visuals.models import Visual
from visuals.services import NapkinAPIService
from django.contrib.auth import get_user_model

User = get_user_model()

def test_napkin_api():
    """Test Napkin API with a simple request"""
    
    print("=" * 60)
    print("Testing Napkin AI Visual Generation")
    print("=" * 60)
    
    # Check API key
    from django.conf import settings
    api_key = getattr(settings, 'NAPKIN_API_KEY', None)
    
    if not api_key:
        print("❌ ERROR: NAPKIN_API_KEY not configured in settings")
        return False
    
    print(f"✓ API Key configured: {api_key[:10]}...{api_key[-10:]}")
    print(f"✓ API URL: {getattr(settings, 'NAPKIN_API_URL', 'Not set')}")
    print()
    
    # Create test visual
    test_content = """
    The water cycle is a continuous process that circulates water throughout Earth's atmosphere, 
    land, and oceans. It consists of four main stages: evaporation, condensation, precipitation, 
    and collection. This cycle is essential for life on Earth and helps regulate climate.
    """
    
    print("Creating test visual request...")
    print(f"Content length: {len(test_content.strip())} characters")
    print()
    
    try:
        # Create visual object
        visual = Visual.objects.create(
            content=test_content.strip(),
            format='png',
            style_id='CDQPRVVJCSTPRBBCD5Q6AWR',  # Vibrant Strokes
            visual_query='flowchart',
            color_mode='light',
            transparent_background=False,
            orientation='auto'
        )
        
        print(f"✓ Visual object created: {visual.id}")
        print(f"  - Format: {visual.format}")
        print(f"  - Style ID: {visual.style_id}")
        print(f"  - Visual Query: {visual.visual_query}")
        print()
        
        # Initialize service
        service = NapkinAPIService()
        print("✓ NapkinAPIService initialized")
        print()
        
        # Make request
        print("Sending request to Napkin API...")
        response = service.create_visual_request(visual)
        
        print("✓ Request successful!")
        print(f"Response: {response}")
        print()
        
        # Update visual with response
        visual.napkin_request_id = response.get('id')
        visual.status = 'processing'
        visual.save()
        
        print(f"✓ Visual updated with request ID: {visual.napkin_request_id}")
        print()
        
        # Poll for status
        print("Polling for completion (max 60 seconds)...")
        import time
        max_wait = 60
        elapsed = 0
        poll_interval = 3
        
        while elapsed < max_wait:
            status_response = service.get_request_status(visual.napkin_request_id)
            current_status = status_response.get('status')
            
            print(f"  [{elapsed}s] Status: {current_status}")
            
            if current_status == 'completed':
                print()
                print("✓ Visual generation completed!")
                print(f"Response: {status_response}")
                
                # Get file URL
                generated_files = status_response.get('generated_files', [])
                if generated_files:
                    file_url = generated_files[0].get('url')
                    print(f"✓ File URL: {file_url}")
                
                visual.status = 'completed'
                visual.save()
                return True
                
            elif current_status == 'failed':
                print()
                print(f"❌ Visual generation failed: {status_response}")
                visual.status = 'failed'
                visual.save()
                return False
            
            time.sleep(poll_interval)
            elapsed += poll_interval
        
        print()
        print("⚠ Timeout waiting for completion")
        return False
        
    except ValueError as e:
        print(f"❌ Validation Error: {e}")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        print(f"Error type: {type(e).__name__}")
        import traceback
        traceback.print_exc()
        return False

def test_minimal_request():
    """Test with absolute minimal payload"""
    print("\n" + "=" * 60)
    print("Testing Minimal Request")
    print("=" * 60)
    
    import requests
    from django.conf import settings
    
    api_key = getattr(settings, 'NAPKIN_API_KEY', None)
    api_url = getattr(settings, 'NAPKIN_API_URL', 'https://api.napkin.ai/v1')
    
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    
    # Minimal payload - required fields: content, format, language
    payload = {
        'content': 'The water cycle involves evaporation, condensation, precipitation, and collection. This continuous process circulates water throughout Earth.',
        'format': 'png',
        'language': 'en'
    }
    
    print(f"Payload: {payload}")
    print()
    
    try:
        response = requests.post(
            f'{api_url}/visual',
            json=payload,
            headers=headers,
            timeout=30
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200 or response.status_code == 201:
            print("\n✓ Minimal request successful!")
            return True
        else:
            print(f"\n❌ Request failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == '__main__':
    print("\n🚀 Starting Napkin API Tests\n")
    
    # Test 1: Minimal request
    test_minimal_request()
    
    print("\n")
    
    # Test 2: Full integration test
    success = test_napkin_api()
    
    print("\n" + "=" * 60)
    if success:
        print("✅ All tests passed!")
    else:
        print("❌ Tests failed - check errors above")
    print("=" * 60)
