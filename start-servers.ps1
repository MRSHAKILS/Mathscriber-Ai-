# Quick Start Script - Run Both Servers
# Run this script to start Django and Next.js development servers

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  MathScriber AI - Integration Startup  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if port is in use
function Test-PortInUse {
    param([int]$Port)
    $connection = Test-NetConnection -ComputerName localhost -Port $Port -WarningAction SilentlyContinue
    return $connection.TcpTestSucceeded
}

# Check prerequisites
Write-Host "1. Checking prerequisites..." -ForegroundColor Yellow

# Check Python
try {
    $pythonVersion = python --version 2>&1
    Write-Host "   ✓ Python installed: $pythonVersion" -ForegroundColor Green
}
catch {
    Write-Host "   ✗ Python not found! Please install Python." -ForegroundColor Red
    exit 1
}

# Check Node
try {
    $nodeVersion = node --version
    Write-Host "   ✓ Node.js installed: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "   ✗ Node.js not found! Please install Node.js." -ForegroundColor Red
    exit 1
}

# Check if Gemini API key is set
if (-not $env:GEMINI_API_KEY) {
    Write-Host "   ⚠ GEMINI_API_KEY not set in environment" -ForegroundColor Yellow
    Write-Host "     You can set it with: `$env:GEMINI_API_KEY='your-key-here'" -ForegroundColor Gray
}

Write-Host ""

# Start Django server
Write-Host "2. Starting Django backend server..." -ForegroundColor Yellow
if (Test-PortInUse -Port 8000) {
    Write-Host "   ⚠ Port 8000 already in use. Django may already be running." -ForegroundColor Yellow
}
else {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\HP\D\Mathscriber AI\backend'; Write-Host 'Django Backend Server' -ForegroundColor Cyan; python manage.py runserver"
    Write-Host "   ✓ Django server starting on http://localhost:8000" -ForegroundColor Green
}

Start-Sleep -Seconds 2

# Start Next.js server
Write-Host ""
Write-Host "3. Starting Next.js frontend server..." -ForegroundColor Yellow
if (Test-PortInUse -Port 3000) {
    Write-Host "   ⚠ Port 3000 in use, Next.js will use port 3001" -ForegroundColor Yellow
}
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\HP\D\Mathscriber AI\frontend'; Write-Host 'Next.js Frontend Server' -ForegroundColor Cyan; npm run dev"
Write-Host "   ✓ Next.js server starting (check terminal for actual port)" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Servers Starting...                   " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Access the application at:" -ForegroundColor White
Write-Host "  • Django Backend:  http://localhost:8000" -ForegroundColor Cyan
Write-Host "  • LaTeX Editor:    http://localhost:8000/editor/projects/" -ForegroundColor Cyan
Write-Host "  • Next.js (check terminal for actual port)" -ForegroundColor Cyan
Write-Host ""
Write-Host "To stop servers:" -ForegroundColor Yellow
Write-Host "  • Close the PowerShell windows that opened" -ForegroundColor Gray
Write-Host "  • Or press Ctrl+C in each terminal" -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to exit this window..." -ForegroundColor DarkGray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
