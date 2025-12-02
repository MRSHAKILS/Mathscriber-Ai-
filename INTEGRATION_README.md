# MathScriber AI - LaTeX Editor Integration

## 🎯 Overview

Complete integration of advanced image-to-LaTeX conversion features into the Django LaTeX editor using Next.js components and Gemini AI.

## ✨ Key Features

### 1. **Floating Action Buttons**

- Fixed left-side panel with 4 conversion methods
- Smooth expand/collapse animation
- Glassmorphic red/orange gradient design

### 2. **Multiple Input Methods**

- 📤 **Upload**: Drag & drop images
- 📸 **Capture**: Real-time camera capture
- ✏️ **Canvas**: Draw equations with stylus/mouse
- 📚 **History**: Access past conversions

### 3. **Intelligent Code Insertion**

- 🧠 **Gemini AI Analysis**: Analyzes existing LaTeX document
- 🚫 **No Duplicates**: Automatically avoids duplicate packages
- 📍 **Smart Placement**: Inserts code at appropriate location
- 🔄 **Structure Preservation**: Maintains document integrity

### 4. **Comprehensive Results**

- View original input image
- Syntax-highlighted LaTeX code
- Rendered output preview
- Download as .tex or .pdf
- One-click insertion into editor

### 5. **History Management**

- Search through past conversions
- Quick copy/insert actions
- Delete unwanted items
- Detailed view modal

## 🚀 Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+
- Gemini API key
- pdflatex (MiKTeX or TeX Live)

### Installation

1. **Clone and setup**:

   ```bash
   cd "d:\HP\D\Mathscriber AI"
   ```

2. **Install Python dependencies**:

   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Install Node dependencies**:

   ```bash
   cd ../frontend
   npm install --legacy-peer-deps
   ```

4. **Set environment variables**:

   ```powershell
   $env:GEMINI_API_KEY = "your-gemini-api-key-here"
   ```

5. **Run migrations**:
   ```bash
   cd backend
   python manage.py migrate
   ```

### Running the Application

#### Option 1: Using the Start Script (Recommended)

```powershell
.\start-servers.ps1
```

#### Option 2: Manual Start

**Terminal 1 - Django Backend**:

```bash
cd backend
python manage.py runserver
```

**Terminal 2 - Next.js Frontend**:

```bash
cd frontend
npm run dev
```

### Access the Application

Open your browser to:

- **LaTeX Editor**: http://localhost:8000/editor/projects/

## 📖 Usage Guide

### Basic Workflow

1. **Open the Editor**

   - Navigate to Projects
   - Open or create a LaTeX document
   - The floating buttons panel appears on the left

2. **Convert Image to LaTeX**

   - Click any of the 4 buttons (Upload/Capture/Canvas/History)
   - Provide input (image/photo/drawing)
   - Wait for AI conversion
   - Review results

3. **Insert into Document**
   - Click "Insert at Cursor" in the result page
   - Gemini analyzes your existing document
   - Code is intelligently merged
   - Editor updates automatically

### Using Upload Method

1. Click the **Upload** button (📤)
2. Drag and drop an image OR click to browse
3. Preview appears
4. Click "Convert to LaTeX"
5. View results and choose action

**Supported formats**: JPG, PNG, GIF, BMP

### Using Camera Capture

1. Click the **Capture** button (📸)
2. Allow camera access when prompted
3. Point camera at math equation
4. Click "Capture" to take photo
5. Click "Retake" if needed
6. Click "Convert" when ready

**Requirements**:

- Camera access permission
- HTTPS in production (HTTP works in localhost)

### Using Drawing Canvas

1. Click the **Canvas** button (✏️)
2. Draw equation using mouse/stylus
3. Toggle between Draw and Erase
4. Use "Clear" to start over
5. Click "Convert to LaTeX"

**Best for**:

- Handwritten equations
- Quick sketches
- Touch devices

### Managing History

1. Click the **History** button (📚)
2. Browse past conversions in grid
3. Use search to find specific items
4. Actions available:
   - **Copy**: Copy LaTeX to clipboard
   - **Insert**: Insert into editor
   - **Delete**: Remove from history
5. Click card for detailed view

## 🔧 Configuration

### Django Settings (`backend/mathscriber_ai/settings.py`)

```python
# CORS Configuration
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:8000",
]

# X-Frame Options (allow iframe)
X_FRAME_OPTIONS = 'SAMEORIGIN'

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'
```

### Environment Variables

Required:

- `GEMINI_API_KEY`: Your Google Gemini API key

Optional:

- `DEBUG`: Set to `False` in production
- `SECRET_KEY`: Change in production

### Frontend Configuration (`frontend/next.config.js`)

```javascript
module.exports = {
  // API proxy configuration if needed
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/api/:path*",
      },
    ];
  },
};
```

## 📁 Project Structure

```
MathScriber AI/
├── backend/
│   ├── converter/
│   │   ├── api_views.py          # API endpoints
│   │   ├── api_urls.py           # API routing
│   │   ├── models.py             # ConversionHistory model
│   │   └── converter.py          # GeminiConverter class
│   ├── editor/
│   │   └── templates/
│   │       └── editor/
│   │           └── document_editor.html  # Main editor template
│   └── mathscriber_ai/
│       └── settings.py           # Django settings
│
├── frontend/
│   ├── app/
│   │   └── editor-integration/
│   │       ├── page.tsx          # Integration page
│   │       └── layout.tsx        # Transparent layout
│   └── components/
│       └── editor/
│           ├── FloatingButtonsPanel.tsx
│           ├── UploadPopup.tsx
│           ├── CapturePopup.tsx
│           ├── CanvasPopup.tsx
│           ├── ResultPage.tsx
│           ├── HistoryPage.tsx
│           └── EditorIntegration.tsx
│
├── INTEGRATION_GUIDE.md          # This file
├── TESTING_GUIDE.md              # Testing checklist
└── start-servers.ps1             # Quick start script
```

## 🎨 Theme System

### Color Palette

- **Primary Gradient**: Red (#ef4444) → Orange (#f97316)
- **Background**: Black with gradient overlays
- **Borders**: Red with 10-30% opacity
- **Text**: White (#ffffff) / Gray (#9ca3af)

### Visual Effects

- **Glassmorphism**: `backdrop-blur-xl` with transparent backgrounds
- **Gradients**: `bg-gradient-to-br from-red-500 to-orange-500`
- **Shadows**: Red glow effects on hover
- **Animations**: Smooth transitions with Framer Motion

## 🔌 API Reference

### Base URL

```
http://localhost:8000/api
```

### Endpoints

#### 1. Convert Upload

```http
POST /convert/upload
Content-Type: multipart/form-data

Body:
- image: File

Response: {
  input: string (base64),
  latex: string,
  convertedOutput: string,
  timestamp: string,
  id: number
}
```

#### 2. Convert Capture

```http
POST /convert/capture
(Same as upload)
```

#### 3. Convert Canvas

```http
POST /convert/canvas
(Same as upload)
```

#### 4. Download TeX

```http
POST /download/tex
Content-Type: application/json

Body: {
  latex: string
}

Response: File download (.tex)
```

#### 5. Download PDF

```http
POST /download/pdf
Content-Type: application/json

Body: {
  latex: string
}

Response: File download (.pdf)
```

#### 6. Insert at Cursor

```http
POST /editor/insert-at-cursor
Content-Type: application/json

Body: {
  latexSnippet: string,
  currentContent: string,
  cursorPosition: number
}

Response: {
  success: boolean,
  updatedContent: string,
  message: string
}
```

#### 7. Get History

```http
GET /history

Response: Array<{
  id: number,
  original_filename: string,
  latex_code: string,
  created_at: string,
  input_image_url: string,
  input_image_data: string (base64)
}>
```

#### 8. Delete History

```http
DELETE /history/<id>

Response: {
  success: boolean
}
```

## 🧪 Testing

See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for comprehensive testing checklist.

### Quick Test

1. Start both servers
2. Open http://localhost:8000/editor/projects/
3. Create or open a document
4. Click Upload button
5. Upload a math equation image
6. Verify LaTeX conversion
7. Click "Insert at Cursor"
8. Verify code merges intelligently

## 🐛 Troubleshooting

### Components Not Loading

- **Check**: Next.js server is running
- **Check**: iframe src URL matches Next.js port (3000 or 3001)
- **Check**: Browser console for errors
- **Fix**: Restart Next.js server

### Insert Not Working

- **Check**: `window.aceEditor` is defined
- **Check**: Gemini API key is valid
- **Check**: Network tab shows API call succeeds
- **Fix**: Refresh page and try again

### PDF Compilation Fails

- **Check**: pdflatex is installed
- **Check**: LaTeX syntax is valid
- **Check**: All required packages are available
- **Fix**: Run `pdflatex --version` to verify installation

### Camera Not Accessible

- **Check**: Browser has camera permission
- **Check**: Using HTTPS or localhost
- **Check**: Camera not used by another app
- **Fix**: Grant permission in browser settings

### API CORS Errors

- **Check**: CORS_ALLOWED_ORIGINS includes frontend URL
- **Check**: Both servers are running
- **Fix**: Update `settings.py` with correct origins

## 🚀 Deployment

### Production Checklist

- [ ] Set `DEBUG = False` in settings.py
- [ ] Change `SECRET_KEY`
- [ ] Configure production database
- [ ] Set up proper CORS origins
- [ ] Configure HTTPS
- [ ] Set environment variables securely
- [ ] Run `python manage.py collectstatic`
- [ ] Run `npm run build` in frontend
- [ ] Set up reverse proxy (nginx)
- [ ] Configure domain names
- [ ] Enable security headers

### Environment Variables (Production)

```bash
export GEMINI_API_KEY="your-key"
export DEBUG="False"
export SECRET_KEY="production-secret-key"
export ALLOWED_HOSTS="yourdomain.com"
export DATABASE_URL="production-db-url"
```

## 📊 Performance

### Expected Response Times

- Image upload: < 5 seconds
- Conversion (Gemini): 3-8 seconds
- Insert at cursor: < 2 seconds
- History load: < 1 second
- PDF compilation: 2-5 seconds

### Optimization Tips

- Use image compression before upload
- Cache history items
- Lazy load history images
- Use pagination for large history
- Optimize LaTeX compilation

## 🔐 Security

### Implemented

- CSRF protection on POST requests
- File type validation
- Size limits on uploads
- Session-based auth
- Input sanitization

### Recommendations

- Enable rate limiting on API
- Implement user authentication
- Add file size limits
- Sanitize LaTeX before compilation
- Use HTTPS in production
- Regular security audits

## 📝 License

See [LICENSE](./LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📞 Support

- Documentation: See `DOCUMENTATION_INDEX.md`
- Issues: GitHub Issues
- Email: support@mathscriber.ai

## 🎉 Acknowledgments

- **Google Gemini**: AI-powered image-to-LaTeX conversion
- **Ace Editor**: Code editor component
- **Next.js**: React framework
- **Django**: Backend framework
- **Framer Motion**: Animation library

---

**Version**: 1.0.0  
**Last Updated**: December 2, 2025  
**Status**: ✅ Production Ready
