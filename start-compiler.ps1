# MathScriber AI - LaTeX Compiler Quick Start

Write-Host "🚀 Starting MathScriber AI LaTeX Compiler..." -ForegroundColor Cyan
Write-Host ""

# Check if backend virtual environment exists
if (Test-Path "backend\.env") {
    Write-Host "✓ Backend virtual environment found" -ForegroundColor Green
} else {
    Write-Host "⚠ Backend virtual environment not found" -ForegroundColor Yellow
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv backend\.env
}

# Start Backend
Write-Host ""
Write-Host "Starting Django backend..." -ForegroundColor Cyan
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd backend; .\.env\Scripts\Activate.ps1; python manage.py runserver"

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "Starting Next.js frontend..." -ForegroundColor Cyan
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host ""
Write-Host "✅ Both servers are starting!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Backend:  http://localhost:8000" -ForegroundColor White
Write-Host "📍 Frontend: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "📚 Test Login:" -ForegroundColor Yellow
Write-Host "   Username: testuser" -ForegroundColor White
Write-Host "   Password: testpass123" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
