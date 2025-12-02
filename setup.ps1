# Mathscriber AI - Automated Setup Script
# This script sets up both backend and frontend

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Mathscriber AI - Automated Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Python is installed
Write-Host "[1/6] Checking Python installation..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✓ Python found: $pythonVersion" -ForegroundColor Green
}
catch {
    Write-Host "✗ Python not found. Please install Python 3.9+ first." -ForegroundColor Red
    exit 1
}

# Check if Node.js is installed
Write-Host "[2/6] Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>&1
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "✗ Node.js not found. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

# Setup Backend
Write-Host ""
Write-Host "[3/6] Setting up Backend..." -ForegroundColor Yellow
Set-Location backend

# Create virtual environment
Write-Host "  Creating virtual environment..." -ForegroundColor Gray
python -m venv venv

# Activate virtual environment
Write-Host "  Activating virtual environment..." -ForegroundColor Gray
.\venv\Scripts\activate

# Install dependencies
Write-Host "  Installing Python dependencies (this may take a few minutes)..." -ForegroundColor Gray
pip install -r requirements.txt --quiet

# Create .env file
if (-not (Test-Path .env)) {
    Write-Host "  Creating .env file..." -ForegroundColor Gray
    Copy-Item .env.example .env
    Write-Host "  ⚠ Please edit backend/.env and add your GEMINI_API_KEY" -ForegroundColor Yellow
}

# Run migrations
Write-Host "  Running database migrations..." -ForegroundColor Gray
python manage.py migrate

Write-Host "✓ Backend setup complete!" -ForegroundColor Green
Set-Location ..

# Setup Frontend
Write-Host ""
Write-Host "[4/6] Setting up Frontend..." -ForegroundColor Yellow
Set-Location frontend

# Install dependencies
Write-Host "  Installing Node.js dependencies (this may take a few minutes)..." -ForegroundColor Gray
npm install --silent

# Create .env.local
if (-not (Test-Path .env.local)) {
    Write-Host "  Creating .env.local file..." -ForegroundColor Gray
    Copy-Item .env.local.example .env.local
}

Write-Host "✓ Frontend setup complete!" -ForegroundColor Green
Set-Location ..

# Final instructions
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup Complete! 🎉" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Get your Gemini API key from:" -ForegroundColor White
Write-Host "   https://makersuite.google.com/app/apikey" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Edit backend/.env and add your API key:" -ForegroundColor White
Write-Host "   GEMINI_API_KEY=your_api_key_here" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Open TWO terminals and run:" -ForegroundColor White
Write-Host ""
Write-Host "   Terminal 1 (Backend):" -ForegroundColor Yellow
Write-Host "   cd backend" -ForegroundColor Gray
Write-Host "   .\venv\Scripts\activate" -ForegroundColor Gray
Write-Host "   python manage.py runserver" -ForegroundColor Gray
Write-Host ""
Write-Host "   Terminal 2 (Frontend):" -ForegroundColor Yellow
Write-Host "   cd frontend" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Open http://localhost:3000 in your browser" -ForegroundColor White
Write-Host ""
Write-Host "For detailed instructions, see SETUP.md" -ForegroundColor White
Write-Host ""
