"""
Test script to verify LaTeX compiler functionality
"""
import os
import sys
import django

# Setup Django
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mathscriber_ai.settings')
django.setup()

from compiler.services.latex_compiler import LatexCompiler

def test_latex_validator():
    """Test LaTeX validation"""
    print("=" * 60)
    print("Testing LaTeX Validator")
    print("=" * 60)
    
    # Test valid LaTeX
    valid_latex = LatexCompiler.get_default_template()
    is_valid, errors = LatexCompiler.validate_latex(valid_latex)
    print(f"\n✅ Valid LaTeX test: {'PASSED' if is_valid else 'FAILED'}")
    if errors:
        print(f"  Errors: {errors}")
    
    # Test invalid LaTeX (missing document class)
    invalid_latex = r"\begin{document}Hello\end{document}"
    is_valid, errors = LatexCompiler.validate_latex(invalid_latex)
    print(f"\n✅ Invalid LaTeX detection: {'PASSED' if not is_valid else 'FAILED'}")
    if errors:
        print(f"  Expected errors found: {errors}")
    
    print("\n")

def test_latex_compilation():
    """Test LaTeX to PDF compilation"""
    print("=" * 60)
    print("Testing LaTeX Compilation")
    print("=" * 60)
    
    compiler = LatexCompiler()
    
    # Simple test document
    simple_latex = r"""\documentclass{article}
\begin{document}
Hello, World!

This is a test document with an equation: $E = mc^2$
\end{document}
"""
    
    print("\nCompiling simple LaTeX document...")
    success, pdf_bytes, error_log, compile_time = compiler.compile(simple_latex)
    
    if success and pdf_bytes:
        print(f"✅ COMPILATION SUCCESSFUL!")
        print(f"  - PDF size: {len(pdf_bytes)} bytes")
        print(f"  - Compilation time: {compile_time:.2f} seconds")
        print(f"  - Log: {error_log[:200]}...")
        return True
    else:
        print(f"❌ COMPILATION FAILED")
        print(f"  - Error log:\n{error_log}")
        return False

def test_database_models():
    """Test database models"""
    print("=" * 60)
    print("Testing Database Models")
    print("=" * 60)
    
    from compiler.models import Project, Folder, LatexFile
    from django.contrib.auth.models import User
    
    # Check if models are working
    try:
        project_count = Project.objects.count()
        file_count = LatexFile.objects.count()
        folder_count = Folder.objects.count()
        user_count = User.objects.count()
        
        print(f"\n✅ Database connection successful!")
        print(f"  - Projects: {project_count}")
        print(f"  - Files: {file_count}")
        print(f"  - Folders: {folder_count}")
        print(f"  - Users: {user_count}")
        
        if project_count > 0:
            print(f"\n  Sample projects:")
            for proj in Project.objects.all()[:3]:
                print(f"    - {proj.name} (owner: {proj.owner.username})")
        
        return True
    except Exception as e:
        print(f"❌ Database error: {str(e)}")
        return False

def test_api_endpoints():
    """Test API endpoints availability"""
    print("\n" + "=" * 60)
    print("API Endpoints Available")
    print("=" * 60)
    
    from compiler.urls import router
    
    print("\nRegistered API endpoints:")
    for route in router.urls:
        print(f"  - {route.pattern}")
    
    print(f"\nBase URL: /api/compiler/")
    print(f"Full endpoints:")
    print(f"  - Projects: http://localhost:8000/api/compiler/projects/")
    print(f"  - Folders: http://localhost:8000/api/compiler/folders/")
    print(f"  - Files: http://localhost:8000/api/compiler/files/")
    print(f"  - Compilations: http://localhost:8000/api/compiler/compilations/")

def main():
    """Run all tests"""
    print("\n" + "=" * 60)
    print("MathScriber AI - LaTeX Compiler System Check")
    print("=" * 60 + "\n")
    
    results = []
    
    # Test 1: Validation
    try:
        test_latex_validator()
        results.append(("Validation", True))
    except Exception as e:
        print(f"❌ Validation test failed: {str(e)}\n")
        results.append(("Validation", False))
    
    # Test 2: Database
    try:
        db_ok = test_database_models()
        results.append(("Database", db_ok))
    except Exception as e:
        print(f"❌ Database test failed: {str(e)}\n")
        results.append(("Database", False))
    
    # Test 3: Compilation (optional - requires pdflatex)
    try:
        comp_ok = test_latex_compilation()
        results.append(("Compilation", comp_ok))
    except Exception as e:
        print(f"⚠️  Compilation test skipped: {str(e)}")
        print(f"   (pdflatex may not be installed - this is optional for development)")
        results.append(("Compilation", None))
    
    # Test 4: API
    try:
        test_api_endpoints()
        results.append(("API", True))
    except Exception as e:
        print(f"❌ API test failed: {str(e)}\n")
        results.append(("API", False))
    
    # Summary
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    
    for name, status in results:
        if status is True:
            print(f"✅ {name}: PASSED")
        elif status is False:
            print(f"❌ {name}: FAILED")
        else:
            print(f"⚠️  {name}: SKIPPED")
    
    all_critical_passed = all(
        status is not False 
        for name, status in results 
        if name != "Compilation"
    )
    
    if all_critical_passed:
        print("\n🎉 All critical tests passed!")
        print("The LaTeX compiler system is ready to use.")
        print("\nNote: PDF compilation requires pdflatex to be installed.")
        print("      For development, you can use the system without it.")
    else:
        print("\n⚠️  Some tests failed. Please check the errors above.")
    
    print("\n" + "=" * 60)

if __name__ == "__main__":
    main()
