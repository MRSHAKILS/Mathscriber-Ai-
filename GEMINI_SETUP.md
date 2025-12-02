# Gemini-Powered LaTeX Compiler Setup

This setup uses Google's Gemini API to compile LaTeX documents with full TikZ graphics support.

## Prerequisites

1. Python 3.8+
2. PostgreSQL (or use SQLite)
3. Node.js 16+
4. Google Gemini API Key

## Backend Setup

### 1. Install Python Dependencies

```bash
cd backend
pip install google-generativeai reportlab pillow matplotlib numpy
```

### 2. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create or select a project
3. Click "Create API Key"
4. Copy your API key

### 3. Configure Environment Variables

Create or update `.env` file in the `backend` directory:

```env
# Gemini API Key
GEMINI_API_KEY=your_actual_api_key_here

# Database (optional - uses SQLite by default)
DB_ENGINE=postgresql
DB_NAME=mathscriber
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

### 4. Run Migrations

```bash
python manage.py migrate
```

### 5. Start Backend Server

```bash
python manage.py runserver
```

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start Frontend Server

```bash
npm run dev
```

## How It Works

1. **User writes LaTeX** with TikZ graphics in the editor
2. **File is saved** to the backend database
3. **User clicks compile**
4. **Backend extracts TikZ** blocks from the LaTeX document
5. **Gemini API converts** each TikZ block to Python matplotlib code
6. **Python code executes** to generate PNG images
7. **ReportLab creates PDF** combining text and generated images
8. **Frontend displays** the compiled PDF

## Example LaTeX with TikZ

```latex
\documentclass{article}
\usepackage{tikz}

\begin{document}

\section{My Diagram}

\begin{tikzpicture}
\draw[thick, ->] (0,0) -- (4,0) node[right] {x};
\draw[thick, ->] (0,0) -- (0,3) node[above] {y};
\draw[red, thick] (0,0) circle (2);
\fill[blue] (2,0) circle (0.1);
\node at (2,-0.5) {Point A};
\end{tikzpicture}

\end{document}
```

## API Costs

- Gemini API has a free tier
- Each TikZ conversion costs approximately 1 API call
- Monitor usage at [Google Cloud Console](https://console.cloud.google.com/)

## Troubleshooting

### "GEMINI_API_KEY not found"
- Check that `.env` file exists in `backend/` directory
- Verify the API key is correctly set
- Restart the Django server after updating `.env`

### "Failed to execute Python"
- Ensure matplotlib and numpy are installed: `pip install matplotlib numpy`
- Check Python execution permissions

### TikZ graphics not appearing
- Check backend logs for Gemini API errors
- Verify API key has sufficient quota
- Some complex TikZ features may not convert perfectly

## Features

✅ Full LaTeX document support
✅ TikZ graphics via Gemini AI conversion
✅ Automatic Python code generation
✅ PDF generation with embedded graphics
✅ Real-time preview
✅ File versioning
✅ Project management

## Limitations

- Complex TikZ features may require manual adjustment
- API rate limits apply
- Internet connection required for compilation
- Graphics quality depends on matplotlib output
