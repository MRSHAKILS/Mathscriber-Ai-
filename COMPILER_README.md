# LaTeX Compiler System - MathScriber AI

A professional LaTeX editor and compiler built with Django REST Framework and Next.js, featuring real-time compilation, dynamic file management, and PDF generation.

## 🎯 Features

### Backend (Django)
- ✅ **Project Management**: Create, edit, delete, and clone LaTeX projects
- ✅ **Hierarchical File System**: Organize files in folders with unlimited nesting
- ✅ **LaTeX Compilation**: Compile LaTeX to PDF with pdflatex/xelatex
- ✅ **Version Control**: Track file changes with version history
- ✅ **Error Handling**: Comprehensive error logging and validation
- ✅ **RESTful API**: Full CRUD operations for all resources
- ✅ **File Types**: Support for .tex, .bib, .cls, .sty, .txt files

### Frontend (Next.js)
- ✅ **Modern Editor**: Clean, professional LaTeX code editor
- ✅ **File Tree**: Dynamic folder/file navigation with drag-and-drop
- ✅ **Live Preview**: Real-time PDF preview after compilation
- ✅ **Auto-Compile**: Optional automatic compilation on file changes
- ✅ **MathJax Support**: LaTeX math rendering in the editor
- ✅ **PDF Download**: One-click PDF download
- ✅ **Responsive UI**: Works on desktop and tablet devices

## 🏗️ Architecture

```
Backend (Django REST Framework)
├── Models: Project, Folder, LatexFile, CompilationResult, FileVersion
├── Services: LaTeX compilation with pdflatex/xelatex
├── API: Full REST API with viewsets
└── Storage: Local file storage for PDFs

Frontend (Next.js 14)
├── Editor Page: Three-column layout (tree, editor, preview)
├── Projects Page: Project list and management
├── Components: Modular, reusable React components
└── API Client: Axios-based API integration
```

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- pdflatex (TeX Live or MiKTeX)
- PostgreSQL (optional, SQLite by default)

### Backend Setup

1. **Install Dependencies**
```bash
cd backend
pip install -r requirements.txt
```

2. **Run Migrations**
```bash
python manage.py migrate
```

3. **Create Sample Data**
```bash
python manage.py seed_projects
```
This creates a test user (`testuser` / `testpass123`) and sample projects.

4. **Start Django Server**
```bash
python manage.py runserver
```
Backend runs at `http://localhost:8000`

### Frontend Setup

1. **Install Dependencies**
```bash
cd frontend
npm install
```

2. **Start Development Server**
```bash
npm run dev
```
Frontend runs at `http://localhost:3000`

## 📡 API Endpoints

### Projects
- `GET /api/compiler/projects/` - List all projects
- `POST /api/compiler/projects/` - Create project
- `GET /api/compiler/projects/{id}/` - Get project details
- `GET /api/compiler/projects/{id}/tree/` - Get full file tree
- `POST /api/compiler/projects/{id}/clone/` - Clone project
- `PATCH /api/compiler/projects/{id}/` - Update project
- `DELETE /api/compiler/projects/{id}/` - Delete project

### Folders
- `GET /api/compiler/folders/` - List folders
- `POST /api/compiler/folders/` - Create folder
- `POST /api/compiler/folders/{id}/move/` - Move folder
- `PATCH /api/compiler/folders/{id}/` - Update folder
- `DELETE /api/compiler/folders/{id}/` - Delete folder

### Files
- `GET /api/compiler/files/` - List files
- `POST /api/compiler/files/` - Create file
- `POST /api/compiler/files/create_from_template/` - Create from template
- `GET /api/compiler/files/{id}/` - Get file details
- `PATCH /api/compiler/files/{id}/` - Update file content
- `POST /api/compiler/files/{id}/compile/` - Compile to PDF
- `POST /api/compiler/files/{id}/move/` - Move file
- `GET /api/compiler/files/{id}/versions/` - Get version history
- `POST /api/compiler/files/{id}/restore_version/` - Restore version
- `DELETE /api/compiler/files/{id}/` - Delete file

### Compilations
- `GET /api/compiler/compilations/` - List compilation results
- `GET /api/compiler/compilations/{id}/` - Get compilation details
- `GET /api/compiler/compilations/{id}/download/` - Download PDF

## 🎨 Usage

### Creating a New Project

1. Navigate to `/projects`
2. Click "New Project"
3. Enter project name and description
4. Project opens in the editor automatically

### Writing LaTeX

1. Select a file from the file tree
2. Write your LaTeX code in the editor
3. Enable "Auto-compile" for live updates, or click "Compile" manually
4. View the PDF preview in the right panel

### Managing Files

- **Create File**: Click `+` icon in file tree
- **Create Folder**: Click folder icon in file tree
- **Delete File/Folder**: Click trash icon next to item
- **Rename**: Double-click item name (coming soon)
- **Move**: Drag and drop (coming soon)

### Compiling LaTeX

```latex
\documentclass{article}
\usepackage{amsmath}

\title{My Document}
\author{Your Name}

\begin{document}
\maketitle

\section{Introduction}
This is a sample document.

\[ E = mc^2 \]

\end{document}
```

## 🔧 Configuration

### Backend Settings

Edit `backend/mathscriber_ai/settings.py`:

```python
# CORS Origins (add your frontend URL)
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'https://yourdomain.com',
]

# Media files location
MEDIA_ROOT = BASE_DIR / 'media'
MEDIA_URL = 'media/'
```

### Frontend Configuration

Edit `frontend/lib/compiler-api.ts`:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/compiler';
```

## 📦 Models

### Project
- id, name, description, owner, is_public
- created_at, updated_at

### Folder
- id, project, parent, name
- Hierarchical structure with get_path()

### LatexFile
- id, project, folder, name, file_type, content
- is_main flag for main document

### CompilationResult
- id, project, file, status, pdf_file
- error_log, compilation_time

### FileVersion
- id, file, content, message, created_by
- Automatic versioning on file updates

## 🛠️ Technologies

**Backend:**
- Django 5.0
- Django REST Framework 3.14
- pdflatex / xelatex
- ReportLab (fallback PDF generation)

**Frontend:**
- Next.js 14
- React 18
- TypeScript
- TailwindCSS
- Axios
- MathJax 3

## 🧪 Testing

Run Django tests:
```bash
python manage.py test compiler
```

## 📝 LaTeX Support

Supported LaTeX features:
- ✅ All standard document classes
- ✅ Math environments (equation, align, etc.)
- ✅ Tables and figures
- ✅ Bibliography (BibTeX)
- ✅ Custom packages
- ✅ TikZ diagrams (if installed)
- ✅ Cross-references
- ✅ Multiple passes for ToC

Required LaTeX packages (install via TeX Live):
```bash
# Ubuntu/Debian
sudo apt-get install texlive-full

# macOS
brew install --cask mactex

# Windows
# Download and install MiKTeX or TeX Live
```

## 🚧 Roadmap

- [ ] Real-time collaboration (WebSockets)
- [ ] Monaco Editor integration
- [ ] Syntax highlighting
- [ ] Auto-complete for LaTeX commands
- [ ] Git integration
- [ ] Template library
- [ ] Export to Overleaf
- [ ] Mobile app support
- [ ] Cloud storage (S3)
- [ ] User authentication (JWT)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

## 📄 License

This project is part of MathScriber AI and follows the same license.

## 🐛 Known Issues

- LaTeX compilation requires pdflatex/xelatex installed on the system
- Large documents may take longer to compile
- Some LaTeX packages may not be available by default
- PDF preview requires iframe support in the browser

## 💡 Tips

1. **Auto-save**: Files are automatically saved as you type
2. **Version History**: Every save creates a version snapshot
3. **Error Messages**: Check the red error bar for compilation issues
4. **Main Document**: Mark one .tex file as "main" for compilation
5. **Keyboard Shortcuts**: Tab key inserts 4 spaces in the editor

## 📞 Support

For issues or questions:
- Check the error logs in the editor
- Review the compilation error messages
- Ensure LaTeX is properly installed
- Verify all required packages are available

---

**Built with ❤️ for the LaTeX community**
