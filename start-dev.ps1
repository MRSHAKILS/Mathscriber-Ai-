# Development Environment Startup Script
# This script starts both the Django backend and Next.js frontend servers

Write-Host "=== MathScriber AI - Development Environment ===" -ForegroundColor Cyan
Write-Host ""

# Refresh PATH to include user environment variables (for MiKTeX, etc.)
Write-Host "Refreshing PATH environment variables..." -ForegroundColor Yellow
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Verify pdflatex is available
Write-Host "Checking for pdflatex..." -ForegroundColor Yellow
$pdflatex = Get-Command pdflatex -ErrorAction SilentlyContinue
if ($pdflatex) {
    Write-Host "✓ pdflatex found at: $($pdflatex.Source)" -ForegroundColor Green
} else {
    Write-Host "✗ pdflatex not found. Please install MiKTeX." -ForegroundColor Red
    Write-Host "  Run: winget install MiKTeX.MiKTeX" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Starting development servers..." -ForegroundColor Cyan
Write-Host "- Backend:  http://127.0.0.1:8000" -ForegroundColor Green
Write-Host "- Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop all servers" -ForegroundColor Yellow
Write-Host ""

# Start backend server in a new window
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; python manage.py runserver"

# Wait a moment for backend to start
Start-Sleep -Seconds 2

# Start frontend server in a new window
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev"

Write-Host "Development servers started in separate windows!" -ForegroundColor Green
