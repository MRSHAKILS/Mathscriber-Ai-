# 🏗️ Mathscriber AI - Architecture Diagram

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│                     http://localhost:3000                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      NEXT.JS FRONTEND                           │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  Pages (App Router)                                     │  │
│  │  ├─ page.tsx           (Home)                           │  │
│  │  ├─ upload/page.tsx    (Upload Interface)              │  │
│  │  ├─ scan/page.tsx      (Canvas Drawing)                │  │
│  │  └─ result/page.tsx    (LaTeX Results)                 │  │
│  └─────────────────────────────────────────────────────────┘  │
│                             │                                   │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  Components                                             │  │
│  │  ├─ ImageUploader.tsx   (Drag & Drop)                  │  │
│  │  ├─ LatexResult.tsx     (Display & Copy)               │  │
│  │  ├─ Navbar.tsx          (Navigation)                   │  │
│  │  └─ Footer.tsx          (Footer)                       │  │
│  └─────────────────────────────────────────────────────────┘  │
│                             │                                   │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  API Layer (lib/api.ts)                                │  │
│  │  └─ convertImageToLatex()                              │  │
│  └─────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP POST (multipart/form-data)
                             │ /api/convert-image/
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DJANGO REST BACKEND                          │
│                    http://localhost:8000                        │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  API Endpoints (views.py)                              │  │
│  │  ├─ POST /api/convert-image/  (ConvertImageView)      │  │
│  │  └─ GET  /api/health/         (HealthCheckView)       │  │
│  └─────────────────────────────────────────────────────────┘  │
│                             │                                   │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  Serializers (serializers.py)                          │  │
│  │  ├─ ImageUploadSerializer    (Validate input)         │  │
│  │  └─ LaTeXResponseSerializer  (Format output)          │  │
│  └─────────────────────────────────────────────────────────┘  │
│                             │                                   │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  Converter Logic (converter.py)                        │  │
│  │  └─ GeminiConverter                                    │  │
│  │     └─ convert_image_to_latex()                        │  │
│  └─────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ API Call
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     GOOGLE GEMINI API                           │
│                  (Gemini 2.0 Flash Model)                       │
│                                                                 │
│  AI Processing: Image → LaTeX Code                             │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
┌──────────┐
│  User    │
└────┬─────┘
     │ 1. Selects image
     ▼
┌──────────────────┐
│ ImageUploader    │
└────┬─────────────┘
     │ 2. Validates image
     │    (size, type)
     ▼
┌──────────────────┐
│ api.ts           │
│ convertImage()   │
└────┬─────────────┘
     │ 3. POST request
     │    FormData
     ▼
┌──────────────────────┐
│ Django Backend       │
│ ConvertImageView     │
└────┬─────────────────┘
     │ 4. Validate request
     │    (serializer)
     ▼
┌──────────────────────┐
│ GeminiConverter      │
└────┬─────────────────┘
     │ 5. Process image
     │    with Gemini AI
     ▼
┌──────────────────────┐
│ Gemini API           │
│ (AI Processing)      │
└────┬─────────────────┘
     │ 6. Return LaTeX
     ▼
┌──────────────────────┐
│ Response to Frontend │
└────┬─────────────────┘
     │ 7. Navigate to
     │    result page
     ▼
┌──────────────────────┐
│ LatexResult          │
│ Display & Copy       │
└──────────────────────┘
```

## Component Hierarchy

```
RootLayout (layout.tsx)
├─ Navbar
├─ Main Content
│  ├─ HomePage (page.tsx)
│  │  └─ Feature Cards
│  │
│  ├─ UploadPage (upload/page.tsx)
│  │  └─ ImageUploader
│  │     ├─ Drop Zone
│  │     ├─ File Input
│  │     ├─ Preview
│  │     └─ Convert Button
│  │
│  ├─ ScanPage (scan/page.tsx)
│  │  └─ Canvas Component
│  │     ├─ Drawing Canvas
│  │     ├─ Clear Button
│  │     └─ Convert Button
│  │
│  └─ ResultPage (result/page.tsx)
│     └─ LatexResult
│        ├─ Code Display
│        ├─ Copy Button
│        └─ Action Buttons
└─ Footer
```

## Backend Architecture

```
mathscriber_ai/
├─ settings.py
│  ├─ Installed Apps
│  │  ├─ rest_framework
│  │  ├─ corsheaders
│  │  └─ converter
│  ├─ Middleware
│  │  └─ CORS
│  ├─ REST Framework Config
│  └─ CORS Config
│
├─ urls.py
│  └─ /api/ → converter.urls
│
converter/
├─ views.py
│  ├─ ConvertImageView
│  │  └─ POST /api/convert-image/
│  └─ HealthCheckView
│     └─ GET /api/health/
│
├─ serializers.py
│  ├─ ImageUploadSerializer
│  └─ LaTeXResponseSerializer
│
├─ converter.py
│  └─ GeminiConverter
│     ├─ __init__()
│     └─ convert_image_to_latex()
│
└─ urls.py
   └─ URL Patterns
```

## Request/Response Flow

### Upload Image Request

```
Client                    Backend                   Gemini API
  │                          │                           │
  │──POST /api/convert────→  │                           │
  │  [FormData: image]        │                           │
  │                          │                           │
  │                          │──Process Image──────────→ │
  │                          │  [Image + Prompt]         │
  │                          │                           │
  │                          │ ←─────LaTeX Code──────────│
  │                          │                           │
  │ ←─────JSON Response──────│                           │
  │  {success, latex_code}   │                           │
```

### Success Response

```json
{
  "success": true,
  "latex_code": "E = mc^2",
  "message": "Image converted successfully"
}
```

### Error Response

```json
{
  "success": false,
  "latex_code": "",
  "message": "Error message here"
}
```

## Technology Stack Diagram

```
┌─────────────────────────────────────────┐
│           PRESENTATION LAYER            │
│  ┌────────────────────────────────┐    │
│  │  Next.js 14 + TypeScript       │    │
│  │  ├─ React 18                   │    │
│  │  ├─ TailwindCSS                │    │
│  │  └─ Lucide Icons               │    │
│  └────────────────────────────────┘    │
└─────────────────────────────────────────┘
                  │
                  │ REST API
                  ▼
┌─────────────────────────────────────────┐
│           APPLICATION LAYER             │
│  ┌────────────────────────────────┐    │
│  │  Django 5.0                    │    │
│  │  ├─ Django REST Framework      │    │
│  │  ├─ CORS Headers               │    │
│  │  └─ Python 3.9+                │    │
│  └────────────────────────────────┘    │
└─────────────────────────────────────────┘
                  │
                  │ API Call
                  ▼
┌─────────────────────────────────────────┐
│            AI PROCESSING                │
│  ┌────────────────────────────────┐    │
│  │  Google Gemini API             │    │
│  │  └─ Gemini 2.0 Flash Model     │    │
│  └────────────────────────────────┘    │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│            DATA STORAGE                 │
│  ┌────────────────────────────────┐    │
│  │  SQLite (Development)          │    │
│  │  PostgreSQL (Production)       │    │
│  └────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

## Deployment Architecture (Production)

```
┌────────────────────────────────────────────────────────┐
│                    CDN / Cloudflare                    │
└──────────────────────┬─────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
        ▼                             ▼
┌─────────────────┐          ┌─────────────────┐
│  Frontend       │          │  Backend        │
│  (Vercel/       │          │  (Railway/      │
│   Netlify)      │          │   Heroku)       │
│                 │          │                 │
│  Next.js Build  │          │  Gunicorn       │
│                 │          │  + Django       │
└─────────────────┘          └────────┬────────┘
                                      │
                             ┌────────┴────────┐
                             │                 │
                             ▼                 ▼
                    ┌─────────────┐   ┌──────────────┐
                    │ PostgreSQL  │   │  Gemini API  │
                    │  Database   │   │              │
                    └─────────────┘   └──────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────────────┐
│              Security Layers                │
│                                             │
│  1. Frontend Validation                    │
│     ├─ File type check                     │
│     ├─ File size limit (10MB)              │
│     └─ Image format validation             │
│                                             │
│  2. CORS Protection                        │
│     └─ Allowed origins configured          │
│                                             │
│  3. Backend Validation                     │
│     ├─ DRF Serializers                     │
│     ├─ Image validation                    │
│     └─ Request validation                  │
│                                             │
│  4. Environment Security                   │
│     ├─ API keys in .env                    │
│     ├─ .gitignore configured               │
│     └─ No hardcoded secrets                │
│                                             │
│  5. Production Security                    │
│     ├─ DEBUG=False                         │
│     ├─ HTTPS only                          │
│     ├─ Rate limiting                       │
│     └─ Secure headers                      │
└─────────────────────────────────────────────┘
```

## File Organization

```
Mathscriber AI/
│
├─── Frontend (Next.js)
│    ├─ User Interface
│    ├─ Client-side Logic
│    └─ API Communication
│
├─── Backend (Django)
│    ├─ REST API
│    ├─ Image Processing
│    └─ Gemini Integration
│
└─── Documentation
     ├─ User Guides
     ├─ Developer Docs
     └─ Setup Instructions
```

---

This architecture ensures:

- ✅ Clear separation of concerns
- ✅ Scalable structure
- ✅ Easy maintenance
- ✅ Security best practices
- ✅ Beginner-friendly design
- ✅ Production-ready foundation
