"""
Verification script for Agent Workflow Integration
Run this to verify all components are properly installed and configured.
"""

import os
import sys
from pathlib import Path

def check_mark(condition, message):
    """Print check mark or X based on condition"""
    symbol = "✅" if condition else "❌"
    print(f"{symbol} {message}")
    return condition

def main():
    print("="*60)
    print("🔍 Verifying Agent Workflow Integration")
    print("="*60)
    print()
    
    all_checks = []
    
    # Check 1: Agent directory exists
    print("📁 Checking File Structure...")
    agents_dir = Path("agents")
    all_checks.append(check_mark(
        agents_dir.exists() and agents_dir.is_dir(),
        "agents/ directory exists"
    ))
    
    # Check 2: All agent files exist
    required_files = [
        "__init__.py", "state.py", "classifier.py", 
        "converter.py", "validator.py", "graph.py"
    ]
    for file in required_files:
        file_path = agents_dir / file
        all_checks.append(check_mark(
            file_path.exists(),
            f"agents/{file} exists"
        ))
    
    print()
    print("📦 Checking Dependencies...")
    
    # Check 3: Required packages installed
    packages = [
        ("langchain", "LangChain"),
        ("langgraph", "LangGraph"),
        ("google.generativeai", "Google Generative AI"),
        ("langchain_anthropic", "LangChain Anthropic"),
    ]
    
    for package, name in packages:
        try:
            __import__(package)
            all_checks.append(check_mark(True, f"{name} installed"))
        except ImportError:
            all_checks.append(check_mark(False, f"{name} installed"))
    
    print()
    print("🔑 Checking Environment Variables...")
    
    # Check 4: Environment variables
    try:
        from dotenv import load_dotenv
        load_dotenv()
        
        api_keys = [
            ("GOOGLE_API_KEY", "Google API Key"),
            ("GEMINI_API_KEY", "Gemini API Key"),
        ]
        
        for key, name in api_keys:
            value = os.getenv(key)
            all_checks.append(check_mark(
                value is not None and len(value) > 0,
                f"{name} set in .env"
            ))
    except ImportError:
        all_checks.append(check_mark(False, "python-dotenv installed"))
    
    print()
    print("🗄️  Checking Database...")
    
    # Check 5: Django setup
    try:
        sys.path.insert(0, str(Path.cwd()))
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'MathScriber.settings')
        
        import django
        django.setup()
        
        from converter.models import UploadedImage
        
        all_checks.append(check_mark(True, "Django models imported"))
        
        # Check if agent task exists
        tasks = [choice[0] for choice in UploadedImage.TASK_CHOICES]
        all_checks.append(check_mark(
            'agent' in tasks,
            "'agent' option in TASK_CHOICES"
        ))
        
        # Check if new fields exist
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute("PRAGMA table_info(converter_uploadedimage)")
            columns = [row[1] for row in cursor.fetchall()]
        
        new_fields = ['scribble_type', 'type_confidence', 'validation_score', 'feedback', 'retry_count']
        for field in new_fields:
            all_checks.append(check_mark(
                field in columns,
                f"Field '{field}' exists in database"
            ))
        
    except Exception as e:
        all_checks.append(check_mark(False, f"Django setup: {str(e)}"))
    
    print()
    print("🧪 Checking Agent Functionality...")
    
    # Check 6: Can import agents
    try:
        from agents import process_scribble, create_scribble_workflow
        all_checks.append(check_mark(True, "Agent workflow functions importable"))
    except ImportError as e:
        all_checks.append(check_mark(False, f"Agent workflow functions: {str(e)}"))
    
    print()
    print("="*60)
    
    # Summary
    passed = sum(all_checks)
    total = len(all_checks)
    percentage = (passed / total * 100) if total > 0 else 0
    
    print(f"📊 Results: {passed}/{total} checks passed ({percentage:.1f}%)")
    print("="*60)
    
    if passed == total:
        print("🎉 SUCCESS! Agent workflow is fully integrated and ready to use!")
        print()
        print("Next steps:")
        print("  1. Start Django server: python manage.py runserver")
        print("  2. Go to upload page and select 'Agent Workflow' option")
        print("  3. Upload an image and watch the console for logs")
        print()
        print("For testing: python test_agent_workflow.py <image_path>")
    else:
        print("⚠️  Some checks failed. Please review the errors above.")
        print()
        print("Common fixes:")
        print("  - Missing dependencies: pip install -r requirements.txt")
        print("  - Database not migrated: python manage.py migrate")
        print("  - API keys not set: Check .env file")
    
    print("="*60)
    
    return passed == total


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
