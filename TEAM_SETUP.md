# 🚀 TEAM CLONE & RUN GUIDE

## ⚡ Super Quick Setup (Copy-Paste Commands)

### 1. Clone Project
```bash
git clone https://github.com/MRSHAKILS/Mathscriber-Ai-.git
cd Mathscriber-Ai-
```

### 2. Setup Database (Run in pgAdmin or psql)
```sql
CREATE DATABASE upscriber_db;
CREATE USER mathscriber_user WITH PASSWORD 'admin123';
ALTER USER mathscriber_user WITH SUPERUSER;
GRANT ALL PRIVILEGES ON DATABASE upscriber_db TO mathscriber_user;
```

### 3. Backend Setup
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

**Edit `.env` and add your Gemini API key from:** https://makersuite.google.com/app/apikey

```bash
python manage.py migrate
python manage.py runserver
```

✅ Backend running at: http://127.0.0.1:8000

### 4. Frontend Setup (New Terminal)
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

✅ Frontend running at: http://localhost:3000

## 📋 Checklist

- [ ] PostgreSQL installed and running
- [ ] Python 3.11+ installed
- [ ] Node.js 18+ installed
- [ ] Database created
- [ ] Backend .env configured with Gemini API key
- [ ] Backend server running on port 8000
- [ ] Frontend server running on port 3000
- [ ] Both URLs open in browser

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check Python version
python --version  # Should be 3.11+

# Reinstall dependencies
pip install -r requirements.txt

# Check database connection
python manage.py check
```

### Frontend won't start
```bash
# Always use --legacy-peer-deps
npm install --legacy-peer-deps

# Clear cache
rm -rf .next node_modules
npm install --legacy-peer-deps
```

### Port already in use
```bash
# Kill port 3000
netstat -ano | findstr :3000
taskkill /PID <number> /F

# Kill port 8000
netstat -ano | findstr :8000
taskkill /PID <number> /F
```

### Database error
```sql
-- In pgAdmin, run:
ALTER USER mathscriber_user WITH SUPERUSER;
GRANT ALL ON SCHEMA public TO mathscriber_user;
```

## 📁 Project Structure
```
Mathscriber-Ai-/
├── backend/              # Django REST API
│   ├── converter/        # Main app
│   ├── mathscriber_ai/   # Django settings
│   └── .env              # Secrets (DON'T COMMIT)
├── frontend/             # Next.js 16 + React 19
│   ├── app/              # Pages (Auth, Dashboard, API)
│   ├── components/       # Reusable components
│   └── lib/              # Utilities
└── README.md             # Full documentation
```

## 💡 Key Points

1. **Always use `--legacy-peer-deps`** when running npm commands
2. **Both servers must run** - Backend AND Frontend
3. **Don't commit .env files** - They contain secrets
4. **TypeScript is optional** - Write like JavaScript
5. **Ask questions** - We're a team!

## 🔄 Daily Workflow

```bash
# Pull latest changes
git pull origin shakil

# Reinstall if needed
pip install -r requirements.txt
npm install --legacy-peer-deps

# Start servers
# Terminal 1: Backend
cd backend; .\venv\Scripts\activate; python manage.py runserver

# Terminal 2: Frontend
cd frontend; npm run dev
```

## 📚 More Documentation

- `README.md` - Complete project documentation
- `SETUP.md` - Detailed setup instructions
- `QUICKSTART.md` - Fast start guide
- `ARCHITECTURE.md` - Project architecture
- `USER_GUIDE.md` - How to use the app

## 🎯 Need Help?

1. Check both servers are running
2. Check `.env` file exists in backend
3. Check database is created
4. Try `npm install --legacy-peer-deps`
5. Ask in team chat!

---

Made with ❤️ for Solvio Hackathon
