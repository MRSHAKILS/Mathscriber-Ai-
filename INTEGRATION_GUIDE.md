# LaTeX Editor Integration System

## Overview

Complete integration of Next.js components with Django LaTeX editor for advanced image-to-LaTeX conversion features.

## Architecture

### Tech Stack

- **Frontend**: Next.js 14 (App Router) with React components
- **Backend**: Django REST API
- **Editor**: Ace Editor (Django-rendered)
- **AI Model**: Google Gemini 1.5 Flash

### Integration Method

React components are embedded in Django editor page via iframe to avoid JavaScript conflicts while maintaining full functionality.

## Components

### 1. Floating Buttons Panel (`FloatingButtonsPanel.tsx`)

- **Location**: Fixed left side of editor
- **Buttons**:
  - Upload: Opens file upload dialog
  - Capture: Activates camera for photo capture
  - Canvas: Opens drawing canvas
  - History: Shows conversion history
- **Styling**: Gradient red/orange theme with glassmorphism
- **Animation**: Expandable panel with smooth transitions

### 2. Upload Popup (`UploadPopup.tsx`)

- **Features**:
  - Drag & drop support
  - File preview
  - Instant conversion
- **API Endpoint**: `POST /api/convert/upload`
- **Flow**: Upload → Preview → Convert → Show Result

### 3. Capture Popup (`CapturePopup.tsx`)

- **Features**:
  - WebRTC camera access
  - Live preview
  - Capture & retake
- **API Endpoint**: `POST /api/convert/capture`
- **Flow**: Camera → Capture → Preview → Convert → Show Result

### 4. Canvas Popup (`CanvasPopup.tsx`)

- **Features**:
  - Touch/stylus support
  - Draw & erase tools
  - Clear canvas
- **API Endpoint**: `POST /api/convert/canvas`
- **Flow**: Draw → Convert → Show Result

### 5. Result Page (`ResultPage.tsx`)

- **Displays**:
  - Original input image
  - Generated LaTeX code with syntax highlighting
  - Rendered output
- **Actions**:
  - Copy LaTeX code
  - Download .tex file
  - Download .pdf file
  - Insert at cursor (intelligent merge)

### 6. History Page (`HistoryPage.tsx`)

- **Features**:
  - Grid view of past conversions
  - Search functionality
  - Quick actions (copy, insert, delete)
  - Detail modal view
- **API Endpoint**: `GET /api/history`

### 7. Editor Integration (`EditorIntegration.tsx`)

- **Purpose**: Main wrapper component
- **Handles**:
  - State management for all popups
  - Communication with Ace Editor
  - Insert at cursor logic

## Django Backend API

### Endpoints

#### 1. Upload Conversion

```
POST /api/convert/upload
Body: multipart/form-data with 'image' file
Response: {
  input: "base64_image",
  latex: "latex_code",
  convertedOutput: "rendered_output",
  timestamp: "ISO timestamp",
  id: number
}
```

#### 2. Capture Conversion

```
POST /api/convert/capture
(Same as upload)
```

#### 3. Canvas Conversion

```
POST /api/convert/canvas
(Same as upload)
```

#### 4. Download LaTeX

```
POST /api/download/tex
Body: { latex: "latex_code" }
Response: file download
```

#### 5. Download PDF

```
POST /api/download/pdf
Body: { latex: "latex_code" }
Response: PDF file (compiled with pdflatex)
```

#### 6. Insert at Cursor (Intelligent Merge)

```
POST /api/editor/insert-at-cursor
Body: {
  latexSnippet: "new_latex",
  currentContent: "existing_document",
  cursorPosition: number
}
Response: {
  success: true,
  updatedContent: "merged_latex",
  message: "Success message"
}
```

**Gemini Analysis**: Automatically detects:

- Duplicate packages
- Correct insertion location
- Structural conflicts
- Returns clean merged document

#### 7. Get History

```
GET /api/history
Response: Array of conversion items
```

#### 8. Delete History

```
DELETE /api/history/<id>
Response: { success: true }
```

## Database Model

### ConversionHistory

```python
- user: ForeignKey (nullable for anonymous)
- original_filename: CharField
- image: ImageField
- input_image: ImageField (for API)
- latex_code: TextField
- latex_output: TextField (alias)
- converted_output: TextField (rendered)
- conversion_type: CharField (upload/canvas/capture)
- accuracy: FloatField
- created_at: DateTimeField
```

## Integration Flow

### 1. Page Load

```
Django renders editor template
→ Loads Ace Editor
→ Exposes editor to window.aceEditor
→ Loads React components via iframe
→ Components initialize floating buttons
```

### 2. User Uploads Image

```
Click Upload button
→ Open UploadPopup
→ Select/drop image
→ Preview shown
→ Click Convert
→ POST to /api/convert/upload
→ Gemini analyzes image
→ Returns LaTeX code
→ Show ResultPage
```

### 3. Insert at Cursor

```
Click "Insert" button
→ Get current editor content
→ Get cursor position
→ POST to /api/editor/insert-at-cursor
→ Gemini analyzes both snippets
→ Merges intelligently
→ Returns updated document
→ Update editor content
→ Show success notification
```

## Styling Theme

### Colors

- Primary: Red (#ef4444) to Orange (#f97316)
- Background: Black with gradient overlays
- Borders: Red with 10-30% opacity
- Text: White/Gray hierarchy

### Effects

- Glassmorphism (backdrop-blur)
- Gradient animations
- Smooth transitions
- Card glow on hover
- Button scale effects

## Key Features

### 1. Intelligent LaTeX Merging

- Gemini AI analyzes existing document structure
- Avoids duplicate package declarations
- Places code at appropriate location
- Maintains document integrity

### 2. Multi-Input Methods

- File upload (drag & drop)
- Camera capture (real-time)
- Drawing canvas (touch/stylus)

### 3. Comprehensive History

- Stores all conversions
- Searchable archive
- Quick reuse of past conversions

### 4. Seamless Integration

- No JavaScript conflicts with Ace Editor
- Transparent iframe overlay
- Native-feeling UI

### 5. Professional UI/UX

- Modern gradient design
- Smooth animations
- Responsive layout
- Accessibility focused

## Usage Instructions

### For Users

1. Open LaTeX editor
2. Click floating button (Upload/Capture/Canvas/History)
3. Provide input (image/capture/drawing)
4. Review conversion result
5. Click "Insert" to add to document

### For Developers

1. Frontend components in `/frontend/components/editor/`
2. Backend API in `/backend/converter/api_views.py`
3. Integration page at `/editor-integration`
4. Embedded via iframe in Django template

## Configuration

### Environment Variables

```
GEMINI_API_KEY=your_gemini_api_key
```

### CORS Settings

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:8000",
]
```

### X-Frame-Options

```python
X_FRAME_OPTIONS = 'SAMEORIGIN'
```

## Testing

### Test Upload

1. Visit http://localhost:8000/editor/projects/
2. Open a project
3. Click Upload button
4. Select math image
5. Verify LaTeX generation
6. Test Insert functionality

### Test History

1. Perform multiple conversions
2. Click History button
3. Verify all items displayed
4. Test search functionality
5. Test insert from history

## Deployment Notes

### Frontend

- Build: `npm run build`
- Serves at: http://localhost:3000
- Integration route: `/editor-integration`

### Backend

- Migrations: `python manage.py migrate`
- Static files: `python manage.py collectstatic`
- Server: `python manage.py runserver`

### Dependencies

- Python: google-generativeai, Pillow, Django
- Node: next, react, framer-motion, react-syntax-highlighter
- System: pdflatex (MiKTeX/TeX Live)

## Security Considerations

1. **CSRF Protection**: All POST requests include CSRF token
2. **Anonymous Users**: Session-based project tracking
3. **File Upload**: Validated file types and sizes
4. **API Rate Limiting**: Consider adding for Gemini API calls
5. **Input Sanitization**: LaTeX code cleaned before compilation

## Performance Optimizations

1. **Lazy Loading**: Components load on demand
2. **Image Optimization**: Compressed before upload
3. **History Pagination**: Limited to 50 recent items
4. **Caching**: Browser caches React components
5. **Async Operations**: Non-blocking conversions

## Future Enhancements

1. **Real-time Collaboration**: Multiple users editing
2. **Version Control**: Track document changes
3. **Template Library**: Pre-made LaTeX templates
4. **Batch Conversion**: Multiple images at once
5. **Custom AI Models**: Fine-tuned for specific domains
6. **Mobile App**: Native iOS/Android integration
7. **Cloud Storage**: Save to Google Drive/Dropbox
8. **Advanced Analytics**: Usage statistics dashboard

## Troubleshooting

### Issue: Components not loading

- Check Next.js server is running
- Verify iframe src URL is correct
- Check browser console for errors

### Issue: Insert not working

- Verify aceEditor is exposed to window
- Check Gemini API key is valid
- Review browser network tab

### Issue: PDF compilation fails

- Ensure pdflatex is installed
- Check LaTeX syntax is valid
- Review compile logs

### Issue: Camera not accessible

- Grant browser camera permissions
- Use HTTPS in production
- Check device camera availability

## Support

For issues or questions:

- GitHub Issues: [repository URL]
- Documentation: This file
- API Reference: `/api/docs/` (if configured)

---

**Version**: 1.0.0  
**Last Updated**: December 2, 2025  
**Author**: MathScriber AI Team
