"""
Test Visual History Feature
This script tests the visual history and gallery functionality
"""
import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'MathScriber.settings')
django.setup()

from visuals.models import Visual
from django.contrib.auth import get_user_model

User = get_user_model()

def test_visual_history():
    """Test visual history features"""
    
    print("=" * 60)
    print("Testing Visual History Feature")
    print("=" * 60)
    print()
    
    # Count total visuals
    total_visuals = Visual.objects.count()
    print(f"✓ Total visuals in database: {total_visuals}")
    
    # Count by status
    completed = Visual.objects.filter(status='completed').count()
    processing = Visual.objects.filter(status='processing').count()
    pending = Visual.objects.filter(status='pending').count()
    failed = Visual.objects.filter(status='failed').count()
    
    print(f"  - Completed: {completed}")
    print(f"  - Processing: {processing}")
    print(f"  - Pending: {pending}")
    print(f"  - Failed: {failed}")
    print()
    
    # Show recent visuals
    recent = Visual.objects.all().order_by('-created_at')[:5]
    
    if recent:
        print(f"✓ Recent visuals (last 5):")
        for i, visual in enumerate(recent, 1):
            status_icon = {
                'completed': '🟢',
                'processing': '🔵',
                'pending': '🟡',
                'failed': '🔴'
            }.get(visual.status, '⚪')
            
            print(f"  {i}. {status_icon} {visual.status.upper()}")
            print(f"     ID: {visual.id}")
            print(f"     Format: {visual.format.upper()}")
            print(f"     Created: {visual.created_at.strftime('%Y-%m-%d %H:%M:%S')}")
            print(f"     Content: {visual.content[:60]}...")
            if visual.file_path:
                print(f"     File: {visual.file_path}")
            print()
    else:
        print("⚠ No visuals found in database")
        print("  Create some visuals at: http://127.0.0.1:8000/visuals/generator/")
        print()
    
    # Test gallery view
    print("=" * 60)
    print("Gallery Access Information")
    print("=" * 60)
    print()
    print("📍 Generator URL: http://127.0.0.1:8000/visuals/generator/")
    print("📍 Gallery URL: http://127.0.0.1:8000/visuals/gallery/")
    print()
    
    if total_visuals > 0:
        # Show first visual detail URL
        first_visual = Visual.objects.first()
        print(f"📍 Example Detail URL: http://127.0.0.1:8000/visuals/{first_visual.id}/")
        print()
    
    # API endpoints
    print("=" * 60)
    print("API Endpoints")
    print("=" * 60)
    print()
    print("GET /visuals/api/recent/?limit=5  - Get recent visuals")
    print("GET /visuals/api/                  - Get all visuals")
    print("GET /visuals/api/<uuid>/           - Get specific visual")
    print("POST /visuals/api/generate/        - Generate new visual")
    print("GET /visuals/api/status/<uuid>/    - Check generation status")
    print()
    
    # Test authenticated vs anonymous
    print("=" * 60)
    print("User Access")
    print("=" * 60)
    print()
    
    # Count visuals with owners
    with_owner = Visual.objects.exclude(owner=None).count()
    without_owner = Visual.objects.filter(owner=None).count()
    
    print(f"✓ Visuals with user account: {with_owner}")
    print(f"✓ Anonymous visuals: {without_owner}")
    print()
    
    if with_owner > 0:
        # Show unique owners
        owners = Visual.objects.exclude(owner=None).values_list('owner__username', flat=True).distinct()
        print(f"  Users with visuals: {', '.join(owners)}")
        print()
    
    # Summary
    print("=" * 60)
    print("Summary")
    print("=" * 60)
    print()
    
    if total_visuals == 0:
        print("⚠ No visual history found")
        print("  Start by generating visuals at the generator page")
    elif completed == 0:
        print("⚠ No completed visuals yet")
        print("  Visuals are still processing or have failed")
    else:
        print("✅ Visual history is working!")
        print(f"   {completed} completed visuals ready to view")
    
    print()
    print("=" * 60)
    
    return True

if __name__ == '__main__':
    test_visual_history()
