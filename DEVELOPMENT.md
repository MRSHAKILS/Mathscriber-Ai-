# Mathscriber AI - Development Guide

## 🏗️ Architecture Overview

### Backend Architecture

```
Django REST API
├── mathscriber_ai/ (Project Config)
│   ├── settings.py - Django configuration
│   ├── urls.py - Main URL routing
│   └── wsgi.py - WSGI application
│
└── converter/ (Main App)
    ├── converter.py - Gemini API integration
    ├── views.py - API endpoints (APIView classes)
    ├── serializers.py - Request/response validation
    └── urls.py - App-specific routing
```

### Frontend Architecture

```
Next.js App Router
├── app/ (Pages)
│   ├── page.tsx - Home page
│   ├── upload/page.tsx - Upload interface
│   ├── scan/page.tsx - Canvas drawing
│   ├── result/page.tsx - Display results
│   └── layout.tsx - Root layout with Navbar/Footer
│
├── components/ (Reusable Components)
│   ├── ImageUploader.tsx - Drag & drop upload
│   ├── LatexResult.tsx - LaTeX display & copy
│   ├── Navbar.tsx - Navigation bar
│   └── Footer.tsx - Footer
│
└── lib/ (Utilities)
    └── api.ts - API communication layer
```

## 🔄 Data Flow

1. **User uploads image** → `ImageUploader.tsx`
2. **FormData created** → `lib/api.ts::convertImageToLatex()`
3. **POST request** → Django `/api/convert-image/`
4. **View processes** → `converter/views.py::ConvertImageView`
5. **Serializer validates** → `converter/serializers.py`
6. **Gemini converts** → `converter/converter.py::GeminiConverter`
7. **Response returned** → Frontend
8. **Navigate to results** → `app/result/page.tsx`
9. **Display LaTeX** → `LatexResult.tsx`

## 🛠️ Key Technologies

### Backend

- **Django 5.0**: Web framework
- **Django REST Framework**: API framework
- **django-cors-headers**: CORS support
- **Pillow**: Image processing
- **google-generativeai**: Gemini API client
- **python-dotenv**: Environment variables

### Frontend

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type safety
- **TailwindCSS**: Utility-first CSS
- **lucide-react**: Icon library
- **React Hooks**: State management (useState, useRef)

## 🎨 Design System

### Colors

```css
Primary Blue:
- 50: #f0f9ff
- 500: #0ea5e9 (Main)
- 600: #0284c7 (Hover)

Neutral Gray:
- 50: #f8fafc
- 100: #f1f5f9 (Background)
- 800: #1e293b (Text)
```

### Shadows (Neumorphism)

```css
shadow-neu: Standard depth
shadow-neu-lg: Hover effect
shadow-neu-inset: Input fields
```

### Components

- **Buttons**: Rounded-xl, shadow-neu, hover effects
- **Cards**: Rounded-3xl, padding-8, shadow-neu
- **Inputs**: Rounded-xl, shadow-neu-inset

## 🔧 API Details

### Endpoint: `/api/convert-image/`

**Method:** POST  
**Content-Type:** multipart/form-data

**Request:**

```python
{
    "image": <File>  # Max 10MB, JPEG/PNG/GIF/WebP
}
```

**Success Response (200):**

```json
{
  "success": true,
  "latex_code": "\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}",
  "message": "Image converted successfully"
}
```

**Error Response (400/500):**

```json
{
  "success": false,
  "latex_code": "",
  "message": "Error message here"
}
```

## 🧩 Component Props

### ImageUploader

```typescript
interface ImageUploaderProps {
  onConversionComplete: (latexCode: string) => void;
}
```

### LatexResult

```typescript
interface LatexResultProps {
  latexCode: string;
}
```

## 🔐 Environment Variables

### Backend (.env)

```bash
GEMINI_API_KEY=your_api_key_here
SECRET_KEY=django_secret_key
DEBUG=True
```

### Frontend (.env.local)

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## 📝 Code Conventions

### Python (Backend)

- Use PEP 8 style guide
- Class-based views (APIView)
- Docstrings for all classes and methods
- Type hints where applicable
- Explicit error handling

### TypeScript (Frontend)

- Functional components with hooks
- TypeScript strict mode
- Interface definitions for props
- Async/await for API calls
- Error boundaries for components

## 🧪 Testing

### Backend Testing

```bash
# Run Django tests
python manage.py test

# Test specific app
python manage.py test converter

# Test with coverage
pip install coverage
coverage run --source='.' manage.py test
coverage report
```

### Frontend Testing

```bash
# Run Jest tests (if configured)
npm test

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🚀 Performance Optimization

### Backend

- Use Django's caching framework
- Optimize database queries (no N+1)
- Compress images before sending to API
- Implement rate limiting

### Frontend

- Next.js automatic code splitting
- Image optimization with next/image
- Lazy loading components
- Debounce API calls

## 🐛 Common Issues & Solutions

### Issue: Gemini API timeout

**Solution:** Implement retry logic with exponential backoff

### Issue: Large image file uploads

**Solution:** Client-side compression before upload

### Issue: CORS errors

**Solution:** Check CORS_ALLOWED_ORIGINS in settings.py

### Issue: Canvas drawing performance

**Solution:** Use requestAnimationFrame for smooth drawing

## 📊 Future Enhancements

- [ ] User authentication and history
- [ ] Multiple image batch processing
- [ ] Export to PDF with rendered LaTeX
- [ ] Support for more math notation types
- [ ] Real-time collaboration
- [ ] Mobile app version
- [ ] LaTeX preview rendering
- [ ] Dark mode support

## 🤝 Contributing Guidelines

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
6. Follow code conventions
7. Update documentation

## 📚 Learning Resources

- [Django REST Framework Tutorial](https://www.django-rest-framework.org/tutorial/quickstart/)
- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Gemini API Quickstart](https://ai.google.dev/tutorials/python_quickstart)
- [TailwindCSS Neumorphism](https://neumorphism.io/)

## 🎓 Educational Value

This project teaches:

- Full-stack development (Django + Next.js)
- RESTful API design
- AI API integration (Gemini)
- Modern UI/UX patterns
- TypeScript and Python best practices
- Image processing and canvas manipulation

---

For more information, see README.md and SETUP.md
