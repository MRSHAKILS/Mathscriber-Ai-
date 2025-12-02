# Mathscriber AI

Convert mathematical equations, diagrams, and tables from images to LaTeX code using AI.

## 🚀 Features

- **Image Upload**: Upload images containing equations, diagrams, or tables
- **Canvas Scanner**: Draw equations on a digital canvas
- **AI-Powered**: Uses Gemini 2.0 Flash model for accurate conversion
- **Instant Results**: Get LaTeX code in seconds
- **Clean UI**: Modern Neumorphism design with TailwindCSS
- **Easy Copy**: One-click copy to clipboard

## 🛠️ Tech Stack

### Backend

- Django 5.0
- Django REST Framework
- Gemini API (Google Generative AI)
- SQLite database
- CORS enabled

### Frontend

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS (Neumorphism design)
- Lucide React icons

## 📋 Prerequisites

- Python 3.9+
- Node.js 18+
- Gemini API key (Get from [Google AI Studio](https://makersuite.google.com/app/apikey))

## 🔧 Installation

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Create a virtual environment:

```bash
python -m venv venv
```

3. Activate the virtual environment:

- Windows: `venv\Scripts\activate`
- macOS/Linux: `source venv/bin/activate`

4. Install dependencies:

```bash
pip install -r requirements.txt
```

5. Create a `.env` file:

```bash
cp .env.example .env
```

6. Add your Gemini API key to `.env`:

```
GEMINI_API_KEY=your_actual_api_key_here
```

7. Run migrations:

```bash
python manage.py migrate
```

8. Start the development server:

```bash
python manage.py runserver
```

Backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file:

```bash
cp .env.local.example .env.local
```

4. Start the development server:

```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`

## 🎯 Usage

1. Open your browser and go to `http://localhost:3000`
2. Choose one of two options:
   - **Upload Image**: Click "Upload Image" and select an image file
   - **Canvas Scanner**: Click "Canvas Scanner" and draw your equation
3. Click "Convert to LaTeX"
4. Copy the generated LaTeX code and use it in your documents

## 📁 Project Structure

```
Mathscriber AI/
├── backend/
│   ├── mathscriber_ai/
│   │   ├── settings.py       # Django settings (REST, CORS configured)
│   │   ├── urls.py            # Main URL routing
│   │   └── wsgi.py
│   ├── converter/
│   │   ├── converter.py       # Gemini API integration
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
