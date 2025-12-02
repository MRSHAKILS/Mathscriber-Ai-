#!/bin/bash

# Mathscriber AI - Automated Setup Script (macOS/Linux)
# This script sets up both backend and frontend

echo "========================================"
echo "  Mathscriber AI - Automated Setup"
echo "========================================"
echo ""

# Check if Python is installed
echo "[1/6] Checking Python installation..."
if command -v python3 &> /dev/null; then
    echo "✓ Python found: $(python3 --version)"
else
    echo "✗ Python not found. Please install Python 3.9+ first."
    exit 1
fi

# Check if Node.js is installed
echo "[2/6] Checking Node.js installation..."
if command -v node &> /dev/null; then
    echo "✓ Node.js found: $(node --version)"
else
    echo "✗ Node.js not found. Please install Node.js 18+ first."
    exit 1
fi

# Setup Backend
echo ""
echo "[3/6] Setting up Backend..."
cd backend

# Create virtual environment
echo "  Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "  Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "  Installing Python dependencies (this may take a few minutes)..."
pip install -r requirements.txt --quiet

# Create .env file
if [ ! -f .env ]; then
    echo "  Creating .env file..."
    cp .env.example .env
    echo "  ⚠ Please edit backend/.env and add your GEMINI_API_KEY"
fi

# Run migrations
echo "  Running database migrations..."
python manage.py migrate

echo "✓ Backend setup complete!"
cd ..

# Setup Frontend
echo ""
echo "[4/6] Setting up Frontend..."
cd frontend

# Install dependencies
echo "  Installing Node.js dependencies (this may take a few minutes)..."
npm install --silent

# Create .env.local
if [ ! -f .env.local ]; then
    echo "  Creating .env.local file..."
    cp .env.local.example .env.local
fi

echo "✓ Frontend setup complete!"
cd ..

# Final instructions
echo ""
echo "========================================"
echo "  Setup Complete! 🎉"
echo "========================================"
echo ""
echo "Next Steps:"
echo ""
echo "1. Get your Gemini API key from:"
echo "   https://makersuite.google.com/app/apikey"
echo ""
echo "2. Edit backend/.env and add your API key:"
echo "   GEMINI_API_KEY=your_api_key_here"
echo ""
echo "3. Open TWO terminals and run:"
echo ""
echo "   Terminal 1 (Backend):"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   python manage.py runserver"
echo ""
echo "   Terminal 2 (Frontend):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "For detailed instructions, see SETUP.md"
echo ""
