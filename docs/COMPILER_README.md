# LaTeX Compiler - Mathscriber AI

## Overview

A complete LaTeX editor with real-time compilation and PDF preview, integrated into Mathscriber AI.

## Features

### ✅ Completed Features

- **Project Management**: Create, list, and delete LaTeX projects
- **File Organization**: Hierarchical folder structure for organizing documents and assets
- **Live Editor**: Ace Editor with LaTeX syntax highlighting (monokai theme)
- **Real-time Compilation**: Auto-compile on change (debounced) or manual compilation
- **PDF Preview**: Instant PDF preview in split-screen view
- **Error Handling**: Detailed compilation errors with log display
- **File Upload**: Upload images and binary files for use in LaTeX
- **Multi-file Projects**: Support for multiple .tex files with main document selection
- **Auto-save**: Content automatically saved to database
- **Download**: Download compiled PDFs

### 📋 Default LaTeX Template

New projects include:

- Math packages (amsmath, amssymb, mathtools)
- Table packages (tabularx, booktabs, multirow)
- Graphics (graphicx, tikz)
- Other essentials (hyperref, xcolor, inputenc)

## Access

### URLs

- **Project List**: http://localhost:8000/editor/projects/
- **Compiler Redirect**: http://localhost:8000/compiler/
- **Get Started Buttons**: Now link to compiler

### Requirements

- ✅ Django backend running (port 8000)
- ✅ User authentication (login required)
- ⚠️ **pdflatex installed** (MiKTeX or TeX Live) - Required for PDF compilation

## Installation

### Install LaTeX Distribution

**Windows:**

```powershell
# Download and install MiKTeX from https://miktex.org/download
# Or use Chocolatey:
choco install miktex
```

**Linux:**

```bash
sudo apt-get install texlive-full
```

**Mac:**

```bash
# Download MacTeX from https://www.tug.org/mactex/
brew install --cask mactex
```

### Verify Installation

```bash
pdflatex --version
```

## Usage

### 1. Create Project

- Click "New Project" from project list
- Enter project name and optional description
- A default LaTeX document is created automatically

### 2. Edit LaTeX

- Use Ace Editor with syntax highlighting
- Mark one document as "Main Document" for compilation
- Auto-save is enabled by default

### 3. Compile

- **Auto-compile**: Toggle checkbox (compiles on change with 500ms debounce)
- **Manual compile**: Click "Compile" button
- View PDF in right pane or see errors if compilation fails

### 4. File Management

- **New File**: Create additional .tex documents
- **New Folder**: Organize files in folders
- **Upload File**: Add images/assets for `\includegraphics`

### 5. Download PDF

- Click "Download PDF" button to save compiled PDF

## Technical Details

### Backend Stack

- Django 5.0.14
- SQLite database
- pdflatex subprocess compilation
- Temporary directories for isolation

### Frontend Stack

- Ace Editor 1.32.2 (LaTeX mode, Monokai theme)
- DaisyUI (dark theme)
- Tailwind CSS
- Bootstrap Icons
- Vanilla JavaScript (ES6+)

### Database Models

- **Project**: LaTeX project container
- **Document**: .tex files with content
- **Folder**: Hierarchical folder structure
- **BinaryFile**: Images and assets
- **CompileRun**: Compilation history with logs and PDFs
- **Collaborator**: Multi-user permissions (future)
- **Version**: Version history (future)

### Compilation Process

1. User edits LaTeX in Ace Editor
2. Content sent via AJAX to `/live_compile/` endpoint
3. Document saved to database
4. CompileRun record created
5. All project files written to temp directory
6. pdflatex runs twice (for cross-references)
7. PDF and logs saved
8. Preview updated without page reload

### Security

- Login required for all endpoints
- CSRF protection on all POST requests
- Temporary directories for isolated compilation
- 120-second compilation timeout
- File uploads validated

## Troubleshooting

### pdflatex not found

**Error:** "pdflatex command not found"

**Solution:** Install a LaTeX distribution (see Installation section above)

### Compilation timeout

**Error:** "Compilation timed out after 120 seconds"

**Causes:**

- Infinite loop in LaTeX code
- Missing `\end{document}`
- Very large document

**Solution:** Check LaTeX syntax, simplify document, or increase timeout in `services.py`

### Missing packages

**Error:** "! LaTeX Error: File `xyz.sty' not found"

**Solution:**

```bash
# MiKTeX (Windows)
miktex packages update
miktex packages install <package-name>

# TeX Live (Linux/Mac)
sudo tlmgr install <package-name>
```

### Image not found

**Error:** "! LaTeX Error: File `image.jpg' not found"

**Solution:** Upload the image file using "Upload File" button in the editor

## Integration with Converter

### From Results Page (Future Enhancement)

1. User converts image to LaTeX using OCR/AI converter
2. Results page displays "Realtime Editor" button
3. Modal opens with options:
   - Create new project with LaTeX
   - Add to existing project
4. LaTeX code transferred to editor automatically

### URL Parameters (Supported Now)

```
http://localhost:8000/editor/projects/new/?latex=<code>&filename=<name>&name=<project>
```

## File Structure

```
backend/editor/
├── models.py           # Database models
├── views.py           # View functions and API endpoints
├── services.py        # Compilation service
├── forms.py           # Django forms
├── urls.py            # URL routing
├── admin.py           # Admin configuration
├── templates/editor/
│   ├── base.html      # Base template
│   ├── project_list.html        # Project list page
│   ├── project_form.html        # Project creation form
│   ├── document_editor.html     # Main editor interface
│   ├── file_tree.html           # Recursive file tree
│   ├── pdf_frame.html           # PDF preview
│   ├── modals.html              # Modal dialogs
│   └── project_confirm_delete.html
└── migrations/
    └── 0001_initial.py
```

## API Endpoints

### Project Management

- `GET /editor/projects/` - List projects
- `GET /editor/projects/new/` - Create project form
- `POST /editor/projects/new/` - Create project
- `POST /editor/projects/<pk>/delete/` - Delete project

### Editor

- `GET /editor/projects/<pk>/docs/<doc_id>/` - Document editor
- `POST /editor/projects/<pk>/docs/<doc_id>/live_compile/` - Compile LaTeX

### File Management (AJAX)

- `POST /editor/projects/<pk>/ajax/create_folder/` - Create folder
- `POST /editor/projects/<pk>/ajax/create_document/` - Create document
- `POST /editor/projects/<pk>/ajax/upload_binary/` - Upload files

### File Serving

- `GET /editor/projects/<pk>/files/<file_id>/` - Serve binary file
- `GET /editor/projects/<pk>/compile/<run_id>/pdf/` - Download PDF
- `GET /editor/projects/<pk>/pdf_frame/` - PDF preview frame

## Performance Tips

1. **Auto-compile**: Disable for very large documents
2. **Cleanup**: Old CompileRun records can be deleted periodically
3. **Caching**: PDFs are cached in media storage
4. **Temp files**: Automatically cleaned after compilation

## Future Enhancements

- Real-time collaboration (WebSockets)
- Git integration for version control
- Snippet library for common LaTeX patterns
- BibTeX citation management
- Advanced error parsing with line highlighting
- Template gallery (research paper, resume, etc.)
- AI assistance for LaTeX generation

## Status

✅ **Fully functional and ready to use!**

All core features implemented:

- Project management ✅
- Live editor ✅
- Real-time compilation ✅
- PDF preview ✅
- File organization ✅
- Error handling ✅
- Multi-file support ✅
- Database persistence ✅
- User authentication ✅

## Testing Checklist

- [x] Create new project
- [x] Edit LaTeX in Ace Editor
- [x] Auto-compile on change
- [x] Manual compile button
- [x] PDF preview display
- [x] Error display for invalid LaTeX
- [x] Create folders
- [x] Create additional documents
- [x] Upload binary files (images)
- [x] Mark main document
- [x] Download PDF
- [x] Delete project
- [x] File tree navigation
- [x] Database migrations
- [x] URL routing
- [x] "Get Started" buttons redirect

## Notes

- First use may require LaTeX package installation (handled by MiKTeX/TeX Live)
- Compilation logs include detailed error messages
- PDF preview uses iframe with cache-busting timestamps
- Dark theme (DaisyUI) for comfortable coding
- Mobile-responsive design

---

**Built for Mathscriber AI** - Converting handwritten math to LaTeX, now with a complete editor!
