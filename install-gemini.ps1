# Gemini LaTeX Compiler - Quick Install Script

Write-Host "Installing Gemini-powered LaTeX Compiler dependencies..." -ForegroundColor Green

# Install Python packages
Write-Host "`nInstalling Python packages..." -ForegroundColor Yellow
pip install google-generativeai reportlab pillow matplotlib numpy

Write-Host "`nSetup complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Get your Gemini API key from: https://makersuite.google.com/app/apikey"
Write-Host "2. Add it to backend\.env file: GEMINI_API_KEY=your_key_here"
Write-Host "3. Run: python backend\manage.py runserver"
Write-Host "4. In another terminal run: npm run dev (in frontend directory)"
Write-Host "`nSee GEMINI_SETUP.md for detailed instructions" -ForegroundColor Cyan
