# 🔧 Backend Documentation - Mathscriber AI

## Overview

Django REST API with Gemini AI integration for converting mathematical images to LaTeX.

## Tech Stack

- **Framework**: Django 5.0.1
- **API**: Django REST Framework 3.14.0
- **Database**: PostgreSQL 14+
- **AI Model**: Google Gemini 2.0 Flash
- **Image Processing**: Pillow 10.4.0
- **Environment**: python-dotenv 1.0.1

## Project Structure

```
backend/
├── converter/                 # Main application
│   ├── converter.py          # Gemini API integration
│   ├── models.py             # ConversionHistory model
│   ├── serializers.py        # DRF serializers
│   ├── views.py              # API endpoints
│   ├── urls.py               # URL routing
│   └── migrations/           # Database migrations
├── mathscriber_ai/           # Django project settings
│   ├── settings.py           # Configuration
│   ├── urls.py               # Root URL config
│   └── wsgi.py               # WSGI application
├── manage.py                 # Django CLI
├── requirements.txt          # Python dependencies
└── .env                      # Environment variables (DO NOT COMMIT)
```

## Setup Instructions

### 1. Prerequisites

- Python 3.11+
- PostgreSQL 14+
- Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### 2. Install Dependencies

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install packages
pip install -r requirements.txt
```

### 3. Configure Environment

Create `.env` file in `backend/` directory:

```env
# API Keys
GEMINI_API_KEY=your_gemini_api_key_here

# Database Configuration
DB_NAME=upscriber_db
DB_USER=mathscriber_user
DB_PASSWORD=admin123
DB_HOST=localhost
DB_PORT=5432

# Django Settings
SECRET_KEY=your-secret-key-here-change-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

### 4. Setup Database

**PostgreSQL Setup:**

Open pgAdmin or psql and run:

```sql
-- Create database
CREATE DATABASE upscriber_db;

-- Create user
CREATE USER mathscriber_user WITH PASSWORD 'admin123';

-- Grant permissions
ALTER USER mathscriber_user WITH SUPERUSER;
GRANT ALL PRIVILEGES ON DATABASE upscriber_db TO mathscriber_user;
GRANT ALL ON SCHEMA public TO mathscriber_user;
```

### 5. Run Migrations

```bash
python manage.py migrate
```

### 6. Start Development Server

```bash
python manage.py runserver
```

Server runs at: **http://127.0.0.1:8000**

## API Endpoints

### Health Check

**GET** `/api/health/`

Response:
```json
{
  "status": "ok",
  "message": "Mathscriber AI API is running"
}
```

### Convert Image to LaTeX

**POST** `/api/convert-image/`

**Request:**
- Content-Type: `multipart/form-data`
- Body: `image` (file)

**Response:**
```json
{
  "success": true,
  "latex_code": "\\frac{a}{b} = c",
  "message": "Conversion successful"
}
```

### Get Conversion History

**GET** `/api/history/`

**Response:**
```json
[
  {
    "id": 1,
    "created_at": "2025-12-02T10:30:00Z",
    "latex_code": "\\int_0^\\infty e^{-x} dx",
    "image_url": "/media/conversions/image.jpg"
  }
]
```

### Get Single Conversion

**GET** `/api/history/<id>/`

**Response:**
```json
{
  "id": 1,
  "created_at": "2025-12-02T10:30:00Z",
  "latex_code": "\\int_0^\\infty e^{-x} dx",
  "image_url": "/media/conversions/image.jpg"
}
```

## Database Models

### ConversionHistory

```python
class ConversionHistory(models.Model):
    image = models.ImageField(upload_to='conversions/')
    latex_code = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Conversion Histories'
```

## Gemini Integration

### GeminiConverter Class

Located in `converter/converter.py`

```python
class GeminiConverter:
    def __init__(self):
        # Initializes Gemini 2.0 Flash model
        
    def convert_image_to_latex(self, image_file):
        # Converts image to LaTeX using Gemini AI
        # Returns: LaTeX code string
```

**How it works:**
1. Loads image using PIL
2. Sends to Gemini 2.0 Flash with specialized prompt
3. Extracts LaTeX code from AI response
4. Returns clean LaTeX string

## Configuration

### settings.py Key Configurations

```python
# Database (PostgreSQL)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}

# CORS Settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Media Files
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
```

## Development Commands

```bash
# Check for issues
python manage.py check

# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run shell
python manage.py shell

# Show migrations status
python manage.py showmigrations

# Run tests
python manage.py test
```

## Troubleshooting

### Database Connection Failed

**Error:** `OperationalError: FATAL: password authentication failed`

**Solution:**
1. Check PostgreSQL is running
2. Verify credentials in `.env`
3. Run permission grants in SQL:
   ```sql
   ALTER USER mathscriber_user WITH SUPERUSER;
   ```

### Module Not Found

**Error:** `ModuleNotFoundError: No module named 'google.generativeai'`

**Solution:**
```bash
pip install -r requirements.txt
```

### Gemini API Error

**Error:** `ValueError: GEMINI_API_KEY not found`

**Solution:**
1. Check `.env` file exists
2. Ensure `GEMINI_API_KEY` is set
3. Restart server after changing `.env`

### Port Already in Use

**Error:** `Error: That port is already in use`

**Solution:**
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <number> /F

# Linux/Mac
lsof -ti:8000 | xargs kill -9
```

## Testing

### Test Gemini Integration

```bash
python manage.py shell

>>> from converter.converter import GeminiConverter
>>> converter = GeminiConverter()
>>> # Should not raise errors
```

### Test API Endpoints

```bash
# Using curl
curl http://127.0.0.1:8000/api/health/

# Using PowerShell
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/health/"
```

## Deployment Notes

### Environment Variables

For production, update `.env`:

```env
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
SECRET_KEY=generate-a-strong-random-key-here
```

### Static Files

```bash
python manage.py collectstatic
```

### Gunicorn (Production Server)

```bash
pip install gunicorn
gunicorn mathscriber_ai.wsgi:application --bind 0.0.0.0:8000
```

## Security Notes

1. **Never commit `.env` file** - Contains sensitive keys
2. **Use strong SECRET_KEY** - Generate with Django's `get_random_secret_key()`
3. **HTTPS in production** - Always use SSL/TLS
4. **Rate limiting** - Consider adding rate limits to API endpoints
5. **API key rotation** - Regularly rotate Gemini API key

## Performance Tips

1. **Database indexing** - Add indexes for frequently queried fields
2. **Caching** - Use Redis for API response caching
3. **Image optimization** - Compress images before storage
4. **Async processing** - Consider Celery for heavy conversions
5. **Connection pooling** - Use pgBouncer for PostgreSQL

## Dependencies Reference

```txt
Django==5.0.1
djangorestframework==3.14.0
django-cors-headers==4.3.1
Pillow==10.4.0
python-dotenv==1.0.1
psycopg2-binary==2.9.11
google-generativeai==0.8.3
```

## Additional Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Gemini API Docs](https://ai.google.dev/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**Last Updated**: December 2, 2025  
**Maintained By**: Solvio Hackathon Team
