"""
Quick Test Script for History Page
This script creates test data and verifies the history API
"""

import requests
import json
from pathlib import Path

BASE_URL = "http://localhost:8000/api"

def test_history_api():
    """Test the history API endpoint"""
    print("🧪 Testing History API\n")
    
    # You'll need a valid JWT token - get it from localStorage after login
    token = input("Enter your JWT token (from localStorage after login): ").strip()
    
    if not token:
        print("❌ No token provided. Please login first and copy your token.")
        return
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # Test 1: Get all history
    print("📋 Test 1: Fetching all history...")
    response = requests.get(f"{BASE_URL}/history/", headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Success! Found {data.get('total', 0)} conversions")
        print(f"   Limit: {data.get('limit')}, Offset: {data.get('offset')}\n")
        
        # Display first conversion
        if data.get('data'):
            first = data['data'][0]
            print("📄 First conversion:")
            print(f"   ID: {first.get('id')}")
            print(f"   Filename: {first.get('original_filename')}")
            print(f"   Task Type: {first.get('task_type')}")
            print(f"   Created: {first.get('created_at')}")
            
            if first.get('detected_content'):
                dc = first['detected_content']
                print(f"   Detected Content:")
                print(f"     - Primary: {dc.get('primary')}")
                print(f"     - Has Equations: {dc.get('has_equations')}")
                print(f"     - Has Tables: {dc.get('has_tables')}")
                print(f"     - Has Diagrams: {dc.get('has_diagrams')}")
        else:
            print("📭 No conversions found. Upload an image first!")
    else:
        print(f"❌ Failed: Status {response.status_code}")
        print(f"   Response: {response.text}")
    
    print("\n" + "="*60 + "\n")
    
    # Test 2: Filter by task type
    print("📋 Test 2: Filtering by task type 'equation'...")
    response = requests.get(
        f"{BASE_URL}/history/",
        headers=headers,
        params={"type": "equation"}
    )
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Found {data.get('total', 0)} equation conversions")
    else:
        print(f"❌ Failed: Status {response.status_code}")
    
    print("\n" + "="*60 + "\n")
    
    # Test 3: Pagination
    print("📋 Test 3: Testing pagination (limit=2)...")
    response = requests.get(
        f"{BASE_URL}/history/",
        headers=headers,
        params={"limit": 2, "offset": 0}
    )
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Retrieved {len(data.get('data', []))} items (limit=2)")
        print(f"   Total available: {data.get('total')}")
    else:
        print(f"❌ Failed: Status {response.status_code}")
    
    print("\n✨ All tests complete!\n")

def show_history_page_preview():
    """Show a text preview of the history page layout"""
    print("""
╔════════════════════════════════════════════════════════════════════════╗
║                        📚 YOUR HISTORY PAGE                            ║
╚════════════════════════════════════════════════════════════════════════╝

  [Filters]  🌟 All    📐 Equation    📊 Table    🎨 Diagram    🔮 Auto
  [Sort]     🕐 Newest    ⏳ Oldest

  ┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
  │                 │                 │                 │                 │
  │  [📐 EQUATION]  │  [📊 TABLE]    │  [🎨 DIAGRAM]  │  [🔮 AUTO]     │
  │                 │                 │                 │                 │
  │  ┌───────────┐  │  ┌───────────┐  │  ┌───────────┐  │  ┌───────────┐  │
  │  │   IMAGE   │  │  │   IMAGE   │  │  │   IMAGE   │  │  │   IMAGE   │  │
  │  │  PREVIEW  │  │  │  PREVIEW  │  │  │  PREVIEW  │  │  │  PREVIEW  │  │
  │  └───────────┘  │  └───────────┘  │  └───────────┘  │  └───────────┘  │
  │                 │                 │                 │                 │
  │ equation.png    │ table_data.jpg  │ diagram.png     │ mixed.jpg       │
  │                 │                 │                 │                 │
  │ 📐 Equations    │ 📊 Tables       │ 🎨 Diagrams     │ 📐📊 Equations  │
  │                 │                 │                 │    Tables       │
  │ LaTeX: \\sum... │ LaTeX: \\begin..│ LaTeX: \\tikz...│ LaTeX: \\begin..│
  │                 │                 │                 │                 │
  │ 🕐 2 hours ago  │ 🕐 5 hours ago  │ 🕐 1 day ago    │ 🕐 3 days ago   │
  │                 │                 │                 │                 │
  │    [View →]     │    [View →]     │    [View →]     │    [View →]     │
  │                 │                 │                 │                 │
  └─────────────────┴─────────────────┴─────────────────┴─────────────────┘

  ✨ Hover Effects: Scale up, glow border, smooth animations
  🎨 Beautiful gradients: Purple, pink, blue
  📱 Responsive: 1→2→3→4 columns based on screen size
    """)

if __name__ == "__main__":
    print("\n" + "="*70)
    print("  MATHSCRIBER AI - HISTORY PAGE TEST SUITE")
    print("="*70 + "\n")
    
    show_history_page_preview()
    
    print("\n" + "="*70 + "\n")
    
    choice = input("Do you want to run API tests? (yes/no): ").strip().lower()
    if choice == 'yes' or choice == 'y':
        test_history_api()
    else:
        print("\n✨ Skipping API tests. Visit http://localhost:3001/history to see the page!\n")
