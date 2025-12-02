# 🧮 Mathscriber AI

AI-powered tool to convert handwritten mathematical equations, diagrams, and tables from images to LaTeX code using Google Gemini.

## 🚀 Quick Start

### Automated Setup (Windows - Recommended)

```powershell
# Run the setup script
.\setup.ps1

# Start development servers
.\start-dev.ps1
```

The `start-dev.ps1` script will:
- Refresh PATH environment variables (for MiKTeX and other tools)
- Verify pdflatex installation
- Start both backend and frontend servers in separate windows

### Manual Setup

```bash
# Clone repository
git clone https://github.com/MRSHAKILS/Mathscriber-Ai-.git
cd Mathscriber-Ai-

# Setup backend
cd backend
python -m venv venv
.\venv\Scripts\activate  # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Setup frontend (new terminal)
cd frontend
npm install --legacy-peer-deps
npm run dev
```

**Servers:**
- Backend: http://127.0.0.1:8000
- Frontend: http://localhost:3000

## 🎯 Features

- ✅ **Image Upload** - Drag-drop or click to upload math images
- ✅ **AI Conversion** - Gemini 2.0 Flash for accurate LaTeX extraction
- ✅ **Live Preview** - Real-time LaTeX rendering
- ✅ **History** - Track all conversions with database storage
- ✅ **Templates** - Pre-built LaTeX templates library
- ✅ **Playground** - Interactive LaTeX editor with tools
- ✅ **Analytics** - Usage statistics and insights

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Django 5.0.1 + REST Framework 3.14.0 |
| **Database** | PostgreSQL 14+ |
| **AI Model** | Google Gemini 2.0 Flash |
| **Frontend** | Next.js 16.0.6 + React 19.2.0 |
| **Styling** | Tailwind CSS 3.4.3 + DaisyUI 5.5.5 |
| **Language** | TypeScript 5.4.5 |

## 📋 Prerequisites

- **Python** 3.11+
- **Node.js** 18+
- **PostgreSQL** 14+
- **Gemini API Key** - Get from [Google AI Studio](https://makersuite.google.com/app/apikey)

## 🔧 Setup Guide

### 1️⃣ Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
.\venv\Scripts\activate
# Activate (Linux/Mac)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup database (PostgreSQL)
# Open pgAdmin or psql and run:
# CREATE DATABASE upscriber_db;
# CREATE USER mathscriber_user WITH PASSWORD 'admin123';
# ALTER USER mathscriber_user WITH SUPERUSER;

# Configure environment
cp .env.example .env
# Edit .env and add your Gemini API key

# Run migrations
python manage.py migrate

# Start server
python manage.py runserver
```

### 2️⃣ Frontend Setup

```bash
cd frontend

# Install dependencies (Important: use --legacy-peer-deps)
npm install --legacy-peer-deps

# Configure environment
cp .env.local.example .env.local

# Start dev server
npm run dev
```

## 📖 Documentation

| Document | Description |
|----------|-------------|
| **[BACKEND_DOCS.md](./BACKEND_DOCS.md)** | Complete backend documentation - API endpoints, database models, Gemini integration |
| **[FRONTEND_DOCS.md](./FRONTEND_DOCS.md)** | Complete frontend documentation - components, routing, styling, TypeScript guide |
| **[TEAM_SETUP.md](./TEAM_SETUP.md)** | Quick setup guide for team members |
| **[SHAKIL_PULL_INSTRUCTIONS.md](./SHAKIL_PULL_INSTRUCTIONS.md)** | Branch merge instructions |

## 🗂️ Project Structure

```
Mathscriber-Ai-/
├── backend/                  # Django REST API
│   ├── converter/           # Main app (models, views, Gemini integration)
│   ├── mathscriber_ai/      # Django settings
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # Environment variables (gitignored)
├── frontend/                # Next.js application
│   ├── app/                 # Pages and routes
│   ├── components/          # Reusable UI components
│   ├── lib/                 # Utilities
│   ├── package.json         # Node dependencies
│   └── .env.local          # Frontend config (gitignored)
├── BACKEND_DOCS.md          # Backend documentation
├── FRONTEND_DOCS.md         # Frontend documentation
└── README.md               # This file
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health/` | Health check |
| POST | `/api/convert-image/` | Convert image to LaTeX |
| GET | `/api/history/` | Get all conversions |
| GET | `/api/history/<id>/` | Get specific conversion |

See [BACKEND_DOCS.md](./BACKEND_DOCS.md) for detailed API documentation.

## 💻 Development

```bash
# Backend
cd backend
python manage.py check              # Check for issues
python manage.py showmigrations     # View migrations
python manage.py shell              # Django shell

# Frontend
cd frontend
npm run dev                         # Start dev server
npm run build                       # Build for production
npx tsc --noEmit                   # Type check
```

## 🐛 Troubleshooting

### Backend Issues

**Database connection failed:**
```sql
-- In PostgreSQL, run:
ALTER USER mathscriber_user WITH SUPERUSER;
GRANT ALL ON SCHEMA public TO mathscriber_user;
```

**Port 8000 in use:**
```bash
netstat -ano | findstr :8000
taskkill /PID <number> /F
```

### Frontend Issues

**npm install errors:**
```bash
npm install --legacy-peer-deps
```

**Port 3000 in use:**
```bash
netstat -ano | findstr :3000
taskkill /PID <number> /F
```

**Module not found:**
```bash
rm -rf node_modules .next
npm install --legacy-peer-deps
```

## 🎯 Usage

1. Open browser at `http://localhost:3000`
2. Upload an image containing mathematical equations
3. Select AI model (Gemini 2.0 Flash)
4. Click "Convert" to get LaTeX code
5. Copy, edit, or download the results
6. View conversion history in Results page

## 🌟 Key Features Explained

### Dashboard
- Overview statistics
- Recent conversions
- Quick access to all tools

### Upload Page
- Drag-drop image upload
- Multiple format support (JPG, PNG, WebP)
- Real-time conversion with progress

### Playground
- Interactive LaTeX editor
- Live preview rendering
- Symbol toolbar for quick insertion
- Graph visualization tools

### Results
- Complete conversion history
- Search and filter capabilities
- Re-edit previous conversions

### Templates
- Pre-built LaTeX templates
- Categories: Equations, Matrices, Calculus, etc.
- One-click insertion

## 🤝 Team Workflow

### For Team Members Cloning

1. **Clone the repository:**
   ```bash
   git clone https://github.com/MRSHAKILS/Mathscriber-Ai-.git
   cd Mathscriber-Ai-
   ```

2. **Follow setup in TEAM_SETUP.md**

3. **Create your branch:**
   ```bash
   git checkout -b your-name
   ```

### Pulling Changes

**From Sanjana's branch (frontend changes):**
```bash
git fetch origin
git checkout origin/sanjana -- frontend/
```

**From Shakil's branch (backend changes):**
```bash
git fetch origin
git checkout origin/shakil -- backend/
```

See [SHAKIL_PULL_INSTRUCTIONS.md](./SHAKIL_PULL_INSTRUCTIONS.md) for detailed merge instructions.

## 📝 Environment Variables

### Backend (.env)
```env
GEMINI_API_KEY=your_key_here
DB_NAME=upscriber_db
DB_USER=mathscriber_user
DB_PASSWORD=admin123
DB_HOST=localhost
DB_PORT=5432
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
NEXT_PUBLIC_WS_URL=ws://127.0.0.1:8000
```

## 🔒 Security Notes

- ⚠️ Never commit `.env` files
- 🔑 Keep API keys private
- 🛡️ Use environment variables for sensitive data
- 🔐 Enable HTTPS in production

## 📊 Project Status

- ✅ Backend API - Fully functional
- ✅ Frontend UI - Complete with all pages
- ✅ Database - PostgreSQL configured
- ✅ AI Integration - Gemini 2.0 Flash working
- ✅ Documentation - Comprehensive guides available

## 📜 License

This project is created for the Solvio Hackathon.

## 👥 Team

**Solvio Hackathon Team**
- Backend: Shakil
- Frontend: Sanjana
- Collaboration: Full Stack Integration

## 📞 Support

- Check [BACKEND_DOCS.md](./BACKEND_DOCS.md) for backend issues
- Check [FRONTEND_DOCS.md](./FRONTEND_DOCS.md) for frontend issues
- Check [TEAM_SETUP.md](./TEAM_SETUP.md) for setup help

---

**Built with ❤️ for Solvio Hackathon 2025**
│   │   ├── views.py           # API endpoints
│   │   ├── serializers.py     # Request/response validation
│   │   └── urls.py            # App URL routing
│   ├── requirements.txt
│   └── manage.py
├── frontend/
│   ├── app/
│   │   ├── page.tsx           # Home page
│   │   ├── upload/page.tsx    # Upload page
│   │   ├── scan/page.tsx      # Canvas scanner page
│   │   ├── result/page.tsx    # Results page
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css
│   ├── components/
│   │   ├── ImageUploader.tsx  # Image upload component
│   │   ├── LatexResult.tsx    # Result display component
│   │   ├── Navbar.tsx         # Navigation bar
│   │   └── Footer.tsx         # Footer
│   ├── lib/
│   │   └── api.ts             # API utility functions
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## 🔌 API Endpoints

### POST `/api/convert-image/`

Convert an image to LaTeX code.

**Request:**

- Method: POST
- Content-Type: multipart/form-data
- Body: `image` (file)

**Response:**

```json
{
  "success": true,
  "latex_code": "E = mc^2",
  "message": "Image converted successfully"
}
```

### GET `/api/health/`

Check API status.

**Response:**

```json
{
  "status": "ok",
  "message": "Mathscriber AI API is running"
}
```

## 🎨 Design

The UI features a clean, minimalistic Neumorphism design with:

- Soft gray background (#f1f5f9)
- Blue accent colors for interactive elements
- Smooth shadows for depth effect
- Rounded corners and modern typography
- Responsive layout for all screen sizes

## 🔒 Security Notes

- CORS is configured to allow `localhost:3000` in development
- File size limited to 10MB
- Only image files (JPEG, PNG, GIF, WebP) are accepted
- API key is stored securely in environment variables

## 🚀 Deployment

### Backend (Django)

- Use Gunicorn or uWSGI for production
- Set `DEBUG=False` in production
- Use PostgreSQL or MySQL for production database
- Configure proper CORS origins
- Set strong `SECRET_KEY`

### Frontend (Next.js)

- Run `npm run build` to create production build
- Deploy to Vercel, Netlify, or any Node.js hosting
- Update `NEXT_PUBLIC_API_URL` to point to production backend

## 🤝 Contributing

This is a hackathon project. Feel free to fork and improve!

## 📝 License

MIT License - feel free to use this project for learning or hackathons.

## 🙏 Acknowledgments

- Google Gemini API for AI-powered conversion
- Next.js and Django communities
- TailwindCSS for styling utilities

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ for hackathons

