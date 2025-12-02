"""
Simple test script to verify authentication endpoints
Run with: python test_auth.py
"""
import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_health():
    """Test health check endpoint"""
    print("Testing health check...")
    try:
        response = requests.get(f"{BASE_URL}/health/")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}\n")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}\n")
        return False

def test_register():
    """Test user registration"""
    print("Testing user registration...")
    data = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "testpass123"
    }
    try:
        response = requests.post(f"{BASE_URL}/register/", json=data)
        print(f"Status: {response.status_code}")
        result = response.json()
        print(f"Response: {json.dumps(result, indent=2)}\n")
        return result.get('success', False), result.get('token')
    except Exception as e:
        print(f"Error: {e}\n")
        return False, None

def test_login():
    """Test user login"""
    print("Testing user login...")
    data = {
        "email": "test@example.com",
        "password": "testpass123"
    }
    try:
        response = requests.post(f"{BASE_URL}/login/", json=data)
        print(f"Status: {response.status_code}")
        result = response.json()
        print(f"Response: {json.dumps(result, indent=2)}\n")
        return result.get('success', False), result.get('token')
    except Exception as e:
        print(f"Error: {e}\n")
        return False, None

if __name__ == "__main__":
    print("=" * 50)
    print("Authentication Endpoint Tests")
    print("=" * 50 + "\n")
    
    # Test health check
    if not test_health():
        print("❌ Server is not running. Please start Django server first.")
        exit(1)
    
    print("✓ Health check passed\n")
    
    # Test registration
    success, token = test_register()
    if success:
        print("✓ Registration passed")
        print(f"Token: {token[:20]}...\n")
    else:
        print("Note: Registration may fail if user already exists\n")
    
    # Test login
    success, token = test_login()
    if success:
        print("✓ Login passed")
        print(f"Token: {token[:20]}...\n")
    else:
        print("❌ Login failed\n")
    
    print("=" * 50)
    print("Tests completed!")
    print("=" * 50)
