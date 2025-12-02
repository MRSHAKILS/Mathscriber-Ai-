"""
Quick diagnostic script to test all API endpoints
"""
import requests
import os

BASE_URL = "http://localhost:8000/api"

print("=" * 60)
print("BACKEND API ENDPOINT TEST")
print("=" * 60)

endpoints = [
    "/convert/upload",
    "/convert/capture",
    "/convert/canvas",
    "/convert/agentic",
    "/history",
]

print("\nTesting endpoints with GET requests (should return 405 Method Not Allowed):\n")

for endpoint in endpoints:
    url = BASE_URL + endpoint
    try:
        response = requests.get(url)
        if response.status_code == 405:
            print(f"✅ {endpoint:30} - Endpoint exists (405 - needs POST)")
        elif response.status_code == 404:
            print(f"❌ {endpoint:30} - NOT FOUND (404)")
        else:
            print(f"⚠️  {endpoint:30} - Status {response.status_code}")
    except requests.exceptions.ConnectionError:
        print(f"❌ {endpoint:30} - CONNECTION FAILED")
    except Exception as e:
        print(f"❌ {endpoint:30} - Error: {str(e)}")

print("\n" + "=" * 60)
print("Testing POST without image (should return 400 Bad Request):\n")

for endpoint in ["/convert/upload", "/convert/agentic"]:
    url = BASE_URL + endpoint
    try:
        response = requests.post(url)
        if response.status_code == 400:
            data = response.json()
            print(f"✅ {endpoint:30} - Works (400 - no image)")
            print(f"   Error message: {data.get('error', 'N/A')}")
        else:
            print(f"⚠️  {endpoint:30} - Status {response.status_code}")
    except Exception as e:
        print(f"❌ {endpoint:30} - Error: {str(e)}")

print("\n" + "=" * 60)
print("SUMMARY")
print("=" * 60)
print("✅ If endpoints show 405 (GET) and 400 (POST), they're working correctly")
print("❌ If you see 404, the endpoint doesn't exist")
print("❌ If you see CONNECTION FAILED, Django server is not running")
print("\nBackend is ready if all tests show ✅")
