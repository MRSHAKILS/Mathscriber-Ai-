# Mathscriber AI - Setup Instructions

## 🎯 Quick Start Guide

### Step 1: Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### Step 2: Backend Setup

Open a terminal and run:

```powershell
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file from example
copy .env.example .env

# Edit .env file and add your API key
# Open .env in any text editor and replace 'your_gemini_api_key_here' with your actual key

# Run migrations
python manage.py migrate

# Start the backend server
python manage.py runserver
```

Keep this terminal running. Backend will be at `http://localhost:8000`

### Step 3: Frontend Setup

Open a NEW terminal and run:

```powershell
# Navigate to frontend (from project root)
cd frontend

# Install dependencies
npm install

# Create environment file
copy .env.local.example .env.local

# Start the frontend server
npm run dev
```

Keep this terminal running. Frontend will be at `http://localhost:3000`

### Step 4: Test the Application

1. Open your browser and go to `http://localhost:3000`
2. Click "Upload Image"
3. Upload an image with a math equation
4. Click "Convert to LaTeX"
5. Copy the generated LaTeX code!

## 🔍 Troubleshooting

### Backend Issues

**Port 8000 already in use:**

```powershell
# Find and kill the process using port 8000
netstat -ano | findstr :8000
taskkill /PID <PID_NUMBER> /F
```

**Gemini API errors:**

- Make sure your API key is correctly set in `backend/.env`
- Check if you have API quota remaining
- Ensure your API key has access to Gemini 2.0 Flash

**Module not found errors:**

- Make sure virtual environment is activated
- Re-run `pip install -r requirements.txt`

### Frontend Issues

**Port 3000 already in use:**

```powershell
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

**Cannot connect to backend:**

- Ensure backend is running on `http://localhost:8000`
- Check `frontend/.env.local` has correct API URL
- Try accessing `http://localhost:8000/api/health/` directly

**Module not found:**

- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

## 📝 Development Tips

### Running Both Servers

You need TWO terminal windows:

1. Terminal 1: Backend (Django) - `python manage.py runserver`
2. Terminal 2: Frontend (Next.js) - `npm run dev`

### Testing API Directly

Test backend without frontend:

```powershell
curl -X POST http://localhost:8000/api/convert-image/ -F "image=@path\to\image.png"
```

### Hot Reload

Both servers support hot reload:

- Django: Automatically reloads on Python file changes
- Next.js: Automatically reloads on TypeScript/CSS changes

## 🚀 Production Build

### Backend

```powershell
# Set environment variables
$env:DEBUG="False"
$env:SECRET_KEY="your-secret-key"

# Collect static files
python manage.py collectstatic

# Run with Gunicorn (install first)
pip install gunicorn
gunicorn mathscriber_ai.wsgi:application
```

### Frontend

```powershell
# Build for production
npm run build

# Start production server
npm start
```

## 🔐 Security Checklist for Production

- [ ] Change `SECRET_KEY` in Django settings
- [ ] Set `DEBUG=False` in Django
- [ ] Update CORS settings to only allow your frontend domain
- [ ] Use environment variables for all sensitive data
- [ ] Use PostgreSQL or MySQL instead of SQLite
- [ ] Enable HTTPS
- [ ] Set up proper logging
- [ ] Configure rate limiting
- [ ] Use a reverse proxy (nginx/Apache)

## 📚 Additional Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

## 🆘 Need Help?

Check the following:

1. Both terminals are running
2. Virtual environment is activated for backend
3. .env files are created and filled
4. All dependencies are installed
5. No port conflicts

---

Happy coding! 🎉
