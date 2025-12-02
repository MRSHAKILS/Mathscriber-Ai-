# Backend - Mathscriber AI

Django REST API for converting images to LaTeX using Gemini AI.

## Quick Start

1. Create virtual environment:

```bash
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Configure environment:

```bash
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

4. Run migrations:

```bash
python manage.py migrate
```

5. Start server:

```bash
python manage.py runserver
```

Server runs at `http://localhost:8000`

## API Endpoints

- `POST /api/convert-image/` - Convert image to LaTeX
- `GET /api/health/` - Health check

## Environment Variables

- `GEMINI_API_KEY` - Your Gemini API key (required)

## Testing

Test the API with curl:

```bash
curl -X POST http://localhost:8000/api/convert-image/ \
  -F "image=@path/to/your/image.png"
```

## Project Structure

- `mathscriber_ai/` - Django project settings
- `converter/` - Main app with conversion logic
  - `converter.py` - Gemini API integration
  - `views.py` - API endpoints
  - `serializers.py` - Data validation
  - `urls.py` - URL routing
