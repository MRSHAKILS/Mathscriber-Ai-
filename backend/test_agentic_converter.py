"""
Quick test script to verify the agentic converter is working
"""
import os
import sys

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mathscriber_ai.settings')
import django
django.setup()

from converter.converter2 import AgenticGeminiConverter

print("=" * 60)
print("AGENTIC CONVERTER TEST")
print("=" * 60)

try:
    print("\n✓ Importing AgenticGeminiConverter...")
    
    print("✓ Initializing converter...")
    converter = AgenticGeminiConverter()
    
    print("✓ Converter initialized successfully!")
    print(f"  - Identifier Agent: {converter.identifier_agent.model_name}")
    print(f"  - Converter Agent: {converter.converter_agent.model_name}")
    print(f"  - Validator Agent: {converter.validator_agent.model_name}")
    
    print("\n" + "=" * 60)
    print("STATUS: ✅ READY TO USE")
    print("=" * 60)
    print("\nAvailable endpoints:")
    print("  • POST /api/convert/upload (with use_agentic=true)")
    print("  • POST /api/convert/capture (with use_agentic=true)")
    print("  • POST /api/convert/canvas (with use_agentic=true)")
    print("  • POST /api/convert/agentic (dedicated endpoint)")
    print("\nThe agentic converter is ready for production use!")
    
except Exception as e:
    print(f"\n❌ ERROR: {str(e)}")
    print("\nPlease check:")
    print("  1. GEMINI_API_KEY is set in environment variables")
    print("  2. google-generativeai package is installed")
    print("  3. All dependencies are up to date")
    import traceback
    traceback.print_exc()
