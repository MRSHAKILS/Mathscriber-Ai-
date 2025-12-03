# Render Deployment Guide for MathScriber AI

## Files Created for Deployment:
1. `build.sh` - Build script for Render
2. `Procfile` - Tells Render how to run the app
3. `runtime.txt` - Specifies Python version
4. Updated `settings.py` - Production-ready configurations
5. Updated `requirements.txt` - All dependencies including gunicorn and whitenoise

## Render Configuration:

### 1. Create a New Web Service on Render
- Go to https://dashboard.render.com
- Click "New +" → "Web Service"
- Connect your GitHub repository

### 2. Configure Build & Deploy Settings:

**Build Command:**
```bash
./build.sh
```

**Start Command:**
```bash
gunicorn MathScriber.wsgi:application
```

### 3. Environment Variables to Add in Render Dashboard:

**Required:**
```
PYTHON_VERSION=3.11.0
SECRET_KEY=your-super-secret-key-here-generate-a-new-one
DEBUG=False
ALLOWED_HOSTS=your-app-name.onrender.com,www.your-domain.com
```

**Database (PostgreSQL):**
```
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=your_db_host (from Render PostgreSQL)
DB_PORT=5432
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

**API Keys (from your .env):**
```
GOOGLE_API_KEY=your_google_api_key
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
MISTRAL_API_KEY=your_mistral_api_key
HF_API_KEY=your_huggingface_api_key
OPENAI_API_KEY=your_openai_api_key
DEEPSEEK_API_KEY=your_deepseek_api_key
Qwen_API_KEY=your_qwen_api_key
NAPKIN_API_KEY=your_napkin_api_key
NAPKIN_API_URL=https://api.napkin.ai/v1
```

### 4. Create PostgreSQL Database on Render:
1. Go to Dashboard → "New +" → "PostgreSQL"
2. Create database
3. Copy the connection details to environment variables above

### 5. Important Notes:

**Static Files:**
- WhiteNoise is configured to serve static files
- No need for external storage in development
- For production with heavy traffic, consider using AWS S3 or similar

**Media Files:**
- Current setup stores media files locally
- For production, configure cloud storage (AWS S3, Cloudinary, etc.)
- Add to settings.py if using cloud storage

**Build Script Permissions:**
If build fails, make build.sh executable:
```bash
chmod +x build.sh
```

### 6. After Deployment:

**Check logs:**
```bash
# In Render dashboard, go to Logs tab
```

**Create superuser (via Render Shell):**
```bash
python manage.py createsuperuser
```

**Collect static files (if needed):**
```bash
python manage.py collectstatic --no-input
```

### 7. Common Issues:

**Issue: Static files not loading**
Solution: Ensure STATIC_ROOT and STATICFILES_STORAGE are set correctly

**Issue: Database connection error**
Solution: Verify DATABASE_URL environment variable is set correctly

**Issue: Build fails**
Solution: Check that all dependencies in requirements.txt are compatible

**Issue: 502 Bad Gateway**
Solution: Check logs, ensure gunicorn is starting correctly

### 8. Generate New SECRET_KEY:

Run this in Python:
```python
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
```

### 9. Domain Setup (Optional):

1. In Render dashboard, go to your web service
2. Click "Settings" → "Custom Domain"
3. Add your domain and follow DNS instructions

### 10. Monitoring:

- Enable "Auto-Deploy" for automatic deployments on git push
- Set up health check endpoint (optional)
- Monitor logs regularly

## Deployment Checklist:

- [ ] All files committed to GitHub
- [ ] Render web service created
- [ ] Build command set: `./build.sh`
- [ ] Start command set: `gunicorn MathScriber.wsgi:application`
- [ ] All environment variables added
- [ ] PostgreSQL database created and connected
- [ ] First deployment successful
- [ ] Static files loading correctly
- [ ] Database migrations applied
- [ ] Superuser created
- [ ] Test all features

## Local Testing Before Deploy:

```bash
# Set environment variables
export DEBUG=False
export SECRET_KEY=your-test-key
export ALLOWED_HOSTS=localhost,127.0.0.1

# Collect static files
python manage.py collectstatic --no-input

# Run with gunicorn locally
gunicorn MathScriber.wsgi:application
```

## Support:
- Render Docs: https://render.com/docs
- Django Deployment: https://docs.djangoproject.com/en/stable/howto/deployment/
