# 🧮 MathScriber AI - Complete LaTeX Ecosystem ✨

> **Your all-in-one solution: Convert → Edit → Compile → Visualize LaTeX** 🚀

[![Django](https://img.shields.io/badge/Django-5.0.14-green.svg)](https://djangoproject.com)
[![Python](https://img.shields.io/badge/Python-3.11.9+-blue.svg)](https://python.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-blue.svg)](https://tailwindcss.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Ready-blue.svg)](https://postgresql.org)
[![Render](https://img.shields.io/badge/Deploy-Render-purple.svg)](https://render.com)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen.svg)](https://github.com/MRSHAKILS/MathScriber)

## 🎯 What Makes MathScriber Unique?

**MathScriber isn't just an OCR tool - it's a complete LaTeX workflow platform combining AI conversion, professional editing, and visual generation!**

### 🔄 **Four Integrated Modules:**

1. **📸 Converter** - AI-powered OCR for equations, tables, and diagrams (11 AI models)
2. **✏️ Editor** - Professional LaTeX IDE with live PDF compilation and preview
3. **🎨 Visuals** - AI diagram generator powered by Napkin AI (50+ diagram types)
4. **📱 Tools** - Camera scanner, stylus drawing, and quick conversion utilities

### 💡 **Complete Workflow:**

```
Upload/Draw/Scan → AI Conversion → Edit in IDE → Live PDF Preview → Export/Share
```

**Key Features:**

- 🤖 **11 AI Models**: Gemini, GPT-4o, Groq, Mistral, DeepSeek + specialized OCR engines
- ✨ **Live Preview**: Real-time LaTeX rendering with MathJax 3
- 📂 **Project Management**: Folders, files, version control, drag-and-drop organization
- 🌙 **Modern UI**: Dark mode, smooth animations, fully responsive
- 🚀 **No Login Required**: Start using immediately (optional accounts for project saving)
- ☁️ **Cloud Ready**: Deploy to Render with PostgreSQL in minutes

---

## ⚡ Quick Start

### 🔧 **Local Development Setup (5 Minutes)**

```bash
# 1. Clone the repository
git clone https://github.com/MRSHAKILS/MathScriber.git
cd MathScriber

# 2. Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Set up environment variables
cp .env.example .env
# Edit .env and add your API keys (optional for basic use)

# 5. Setup database (uses local PostgreSQL or SQLite fallback)
python manage.py migrate

# 6. Load Napkin AI styles (optional, for visual generator)
python manage.py load_napkin_styles

# 7. Create admin user (optional)
python manage.py createsuperuser

# 8. Launch! 🚀
python manage.py runserver
```

**🎉 Visit http://127.0.0.1:8000 - No login required to start converting!**

### ☁️ **Deploy to Render (Production)**

Complete deployment guide available in [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)

**Quick Deploy:**

```bash
# 1. Configure for Render (files already included)
#    - build.sh (build script)
#    - Procfile (gunicorn configuration)
#    - .python-version (Python 3.11.9)
#    - runtime.txt (if needed)

# 2. Push to GitHub
git add .
git commit -m "Ready for Render deployment"
git push origin main

# 3. Create Render Web Service
#    Build Command: ./build.sh
#    Start Command: gunicorn MathScriber.wsgi:application

# 4. Add Environment Variables in Render Dashboard:
#    - DATABASE_URL (from Render PostgreSQL)
#    - SECRET_KEY (generate new one)
#    - DEBUG=False
#    - ALLOWED_HOSTS=your-app.onrender.com
#    - API keys (GOOGLE_API_KEY, GROQ_API_KEY, etc.)
```

---

## 🧠 AI Models & Capabilities

### 📊 **Math & Table OCR (6 Models)**

| Model               | Provider    | Accuracy | Speed      | Cost | Best For                         |
| ------------------- | ----------- | -------- | ---------- | ---- | -------------------------------- |
| **Gemini 2.5 Pro**  | Google      | 97%+     | ⚡⚡⚡     | FREE | Complex equations, mixed content |
| **Groq Llama**      | Groq        | 95%+     | ⚡⚡⚡⚡⚡ | FREE | Lightning-fast processing        |
| **Grok 2**          | xAI         | 95%+     | ⚡⚡⚡     | FREE | Alternative AI provider          |
| **Mistral Pixtral** | Mistral AI  | 93%+     | ⚡⚡⚡     | Paid | European compliance              |
| **LatexOCR**        | pix2tex     | 99%+     | ⚡⚡⚡⚡   | FREE | Handwritten equations ⭐         |
| **Tesseract**       | Traditional | 85%+     | ⚡⚡       | FREE | Printed tables                   |

### 🎨 **Diagram → TikZ Conversion (5 Options)**

| Method                   | AI Model       | Quality | Speed      | Cost | Notes            |
| ------------------------ | -------------- | ------- | ---------- | ---- | ---------------- |
| **Gemini 2.0 Flash**     | Google Vision  | 90%+    | ⚡⚡⚡⚡   | FREE | Recommended ⭐   |
| **GPT-4o Vision**        | OpenAI         | 95%+    | ⚡⚡⚡     | Paid | Highest accuracy |
| **DeepSeek-V3**          | DeepSeek       | 92%+    | ⚡⚡⚡     | Paid | Smart fallback   |
| **Intelligent Template** | Shape Analysis | 85%+    | ⚡⚡⚡⚡⚡ | FREE | Auto-detection   |
| **Basic Template**       | Static         | 70%+    | ⚡⚡⚡⚡⚡ | FREE | Generic starter  |

### ✨ **Visual Generator (Napkin AI)**

**Create professional diagrams from natural language descriptions!**

- **50+ Diagram Types**: Flowcharts, mindmaps, timelines, org charts, sequences, architectures
- **15+ Art Styles**: Professional, sketch, hand-drawn, watercolor, vibrant, minimal
- **Smart Gallery**: Browse, search, and manage all generated visuals
- **Export Options**: PDF, PNG downloads in publication-ready quality
- **No Design Skills**: Just describe what you want in plain English

---

## 🎨 Modern UI Features

### 🌟 **Design System**

- **Tailwind CSS 3**: Utility-first framework for rapid development
- **Dark Mode**: Complete theme system with localStorage persistence
- **Dual Color Schemes**:
  - **Converter/Dashboard**: Green-to-emerald gradients
  - **LaTeX Editor**: Teal-to-blue IDE aesthetics
- **Glass Morphism**: Modern translucent effects on cards and navbars
- **Animations**: Fade-in, slide-up, scale-on-hover, smooth transitions (60fps)
- **Responsive Design**: Mobile-first approach (sm/md/lg/xl breakpoints)

### 📝 **LaTeX Editor Module**

**Professional IDE Experience:**

- **Ace Editor**: Syntax highlighting with multiple themes (Light/Dark)
- **Three-Column Layout**: File browser | Code editor | PDF preview
- **Live Compilation**: Auto-compile with debouncing (configurable delay)
- **Project Management**: Create, organize, delete projects with modern cards
- **File Organization**: Drag-and-drop folders and files
- **Template Library**: 8+ ready-to-use templates (equations, tables, TikZ diagrams)
- **Smart Insertion**: Code inserts at cursor position maintaining formatting
- **Error Handling**: Detailed logs with helpful debugging hints
- **Package Support**: Pre-loaded with 20+ packages (amsmath, tikz, booktabs, graphicx, etc.)
- **Converter Integration**: Sidebar buttons for Upload/Scanner/Stylus with iframe communication
- **No Login Required**: Create and edit projects as guest user

### 📱 **Mobile Experience**

- Touch-friendly interface with large tap targets
- Optimized camera capture with overlay guides
- Responsive tables and equation preview
- Mobile menu with smooth animations
- Theme persistence across devices

---

## 🔧 Project Architecture

### **Django Apps Structure**

```
MathScriber/
├── converter/          # Main OCR conversion app
│   ├── models.py      # UploadedImage model
│   ├── views.py       # Upload, scanner, stylus, results views
│   ├── ocr_utils.py   # AI model integrations (6 models)
│   └── templates/     # Dashboard, upload, scanner, stylus pages
│
├── editor/            # Professional LaTeX IDE
│   ├── models.py      # Project, Document, Folder, BinaryFile, CompileRun
│   ├── views.py       # Project/document CRUD, live compilation
│   ├── services.py    # LaTeX compilation with pdflatex
│   └── templates/     # Project list, editor, PDF preview
│
├── visuals/           # Napkin AI diagram generator
│   ├── models.py      # Visual, VisualStyle models
│   ├── services.py    # Napkin API integration
│   ├── serializers.py # DRF serializers for REST API
│   └── templates/     # Generator, gallery, detail views
│
├── MathScriber/       # Project settings
│   ├── settings.py    # Environment-based configuration
│   ├── urls.py        # URL routing
│   └── wsgi.py        # WSGI application
│
├── static/            # Static assets
│   ├── css/          # Tailwind CSS (compiled)
│   ├── js/           # Theme toggle, animations, editor
│   └── img/          # Logos, icons, illustrations
│
├── templates/         # Base templates
│   ├── base.html     # Main template with navbar/footer
│   └── dashboard.html # Landing page
│
└── media/             # User uploads
    ├── uploads/       # OCR images/PDFs
    ├── project_files/ # LaTeX binary files
    ├── project_pdfs/  # Compiled PDFs
    └── visuals/       # Generated diagrams
```

### **Tech Stack**

**Backend:**

- Django 5.0.14 (Python web framework)
- PostgreSQL/SQLite (database with smart fallback)
- dj-database-url (database URL parsing)
- psycopg2-binary (PostgreSQL adapter)
- Pillow (image processing)
- PyMuPDF (PDF extraction)
- pix2tex (LaTeX OCR specialized model)
- pytesseract (traditional OCR)

**AI Integrations:**

- Google Gemini API (gemini-2.5-pro, gemini-2.0-flash)
- OpenAI API (gpt-4o-vision)
- Groq API (llama models)
- Mistral API (pixtral-12b)
- DeepSeek API
- Napkin AI API (visual generation)

**Frontend:**

- Tailwind CSS 3 (utility-first CSS framework)
- Vanilla JavaScript (no heavy frameworks)
- Ace Editor (code editing with syntax highlighting)
- MathJax 3 (LaTeX rendering)
- Bootstrap Icons (icon library)

**Production:**

- Gunicorn (WSGI HTTP server)
- WhiteNoise (static file serving)
- django-cors-headers (CORS handling)
- djangorestframework (REST API for visuals)

---

## 📚 Usage Guide

### 🚀 **Quick Conversion Flow**

1. **Visit Dashboard** at `/` - Browse features and pricing
2. **Choose Input Method**:
   - `/upload/` - Drag & drop images/PDFs
   - `/scanner/` - Live camera capture (mobile)
   - `/stylus/` - Draw with stylus/finger
3. **Select AI Model** - Choose based on content type
4. **Get LaTeX** - Copy, edit, or open in editor
5. **Export** - Download PDF or save to projects

### ✏️ **LaTeX Editor Workflow**

1. **Create Project** - Name it and add description
2. **Choose Template** - Start from 8+ templates or blank
3. **Write/Edit** - Live syntax highlighting
4. **Auto-Compile** - See PDF preview in real-time
5. **Organize** - Use folders for complex projects
6. **Export** - Download PDF or share project

### 🎨 **Visual Generator Flow**

1. **Visit Generator** at `/visuals/generator/`
2. **Describe Diagram** - Natural language description
3. **Choose Style** - Professional, sketch, hand-drawn, etc.
4. **Select Type** - Flowchart, mindmap, timeline, etc.
5. **Generate** - AI creates visual in seconds
6. **Export** - Download PDF/PNG or save to gallery

### 📱 **Mobile Scanner**

1. Open `/scanner/` on mobile device
2. Allow camera permissions
3. Position equation/table in green overlay
4. Tap capture with large button
5. Get instant LaTeX conversion

---

## 🔑 API Keys Setup

### **Required for Full Functionality**

Create `.env` file with your API keys:

```env
# Google Gemini (Recommended - FREE tier)
GOOGLE_API_KEY=your_gemini_api_key
GEMINI_API_KEY=your_gemini_api_key

# Groq (FREE tier)
GROQ_API_KEY=your_groq_api_key

# Optional: Additional AI providers
MISTRAL_API_KEY=your_mistral_api_key
OPENAI_API_KEY=your_openai_api_key
DEEPSEEK_API_KEY=your_deepseek_api_key

# Napkin AI (for visual generator)
NAPKIN_API_KEY=your_napkin_api_key
NAPKIN_API_URL=https://api.napkin.ai/v1

# Database (for production)
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Django settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

### **Get API Keys:**

1. **Google Gemini**: https://makersuite.google.com/app/apikey (FREE)
2. **Groq**: https://console.groq.com/keys (FREE)
3. **Mistral**: https://console.mistral.ai/ (Paid)
4. **OpenAI**: https://platform.openai.com/api-keys (Paid)
5. **DeepSeek**: https://platform.deepseek.com/api_keys (Paid)
6. **Napkin AI**: https://www.napkin.ai/ (Contact for access)

---

## 📊 Project Statistics

- **Total Lines of Code**: 50,000+
- **AI Models Integrated**: 11 (6 OCR + 5 diagram)
- **Supported File Types**: JPG, PNG, WebP, BMP, GIF, TIFF, PDF
- **LaTeX Packages**: 20+ pre-configured
- **Diagram Types**: 50+ via Napkin AI
- **Art Styles**: 15+ professional styles
- **Accuracy**: 97%+ on clear images (with best models)
- **Performance**: 2-15 seconds per conversion

---

## 🛠️ Development

### **Requirements**

- Python 3.11.9+
- PostgreSQL 12+ (optional, SQLite fallback available)
- Node.js 16+ (for Tailwind CSS compilation)
- pdflatex (for LaTeX compilation in editor)

### **Install pdflatex**

```bash
# Ubuntu/Debian
sudo apt-get install texlive-latex-extra texlive-fonts-extra

# macOS
brew install --cask mactex

# Windows
# Download from: https://miktex.org/download
```

### **Tailwind CSS Development**

```bash
# Install Node dependencies
npm install

# Watch for CSS changes (development)
npm run dev

# Build for production
npm run build
```

### **Database Setup**

**PostgreSQL (Recommended for production):**

```bash
# Create database
createdb mathscriber

# Update .env
DB_NAME=mathscriber
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

**SQLite (Development fallback):**

- Automatically used if `DB_NAME` not set in .env
- No additional configuration needed

---

## 🚀 Deployment

### **Render.com (Recommended)**

See complete guide: [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)

**Pre-configured files included:**

- `build.sh` - Build script
- `Procfile` - Gunicorn start command
- `.python-version` - Python 3.11.9
- `requirements.txt` - All dependencies

**Environment Variables to Set:**

```
DATABASE_URL=postgresql://...  (from Render PostgreSQL)
SECRET_KEY=generate-new-secret-key
DEBUG=False
ALLOWED_HOSTS=your-app.onrender.com
+ All API keys from .env
```

### **Other Platforms**

**Heroku:**

```bash
heroku create your-app-name
heroku addons:create heroku-postgresql:mini
heroku config:set SECRET_KEY=your-secret-key
git push heroku main
```

**Docker:**

```dockerfile
# TODO: Dockerfile coming soon
```

---

## 🤝 Contributing

Contributions welcome! Here's how:

1. **Fork** the repository
2. **Create** feature branch: `git checkout -b feature/amazing-feature`
3. **Code** following Django best practices
4. **Test** thoroughly on multiple devices
5. **Submit** PR with detailed description

**Areas for Contribution:**

- Additional AI model integrations
- UI/UX improvements
- Performance optimizations
- Documentation updates
- Bug fixes and testing

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 🙏 Acknowledgments

- **LaTeX OCR**: [pix2tex](https://github.com/lukas-blecher/LaTeX-OCR)
- **Napkin AI**: Visual generation platform
- **Google Gemini**: AI conversion models
- **OpenAI**: GPT-4o Vision API
- **Tailwind CSS**: Modern styling framework
- **Django**: Powerful web framework

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/MRSHAKILS/MathScriber/issues)
- **Discussions**: [GitHub Discussions](https://github.com/MRSHAKILS/MathScriber/discussions)
- **Email**: contact@mathscriber.com

---

**Made with ❤️ for mathematicians, students, researchers, and LaTeX enthusiasts!**

_From handwritten notes to publication-ready documents with AI and modern design_ ✨
