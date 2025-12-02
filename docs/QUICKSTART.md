# ⚡ QUICK START - Mathscriber AI

## 🚀 Get Running in 5 Minutes!

### Step 1: Open Two Terminals

**Terminal 1 - Backend:**

```powershell
cd "d:\HP\D\Mathscriber AI\backend"
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
# Now edit .env and add your GEMINI_API_KEY
python manage.py migrate
python manage.py runserver
```

**Terminal 2 - Frontend:**

```powershell
cd "d:\HP\D\Mathscriber AI\frontend"
npm install
npm run dev
```

### Step 2: Get Gemini API Key

🔑 Visit: https://makersuite.google.com/app/apikey

### Step 3: Open Browser

🌐 Go to: http://localhost:3000

---

## 📋 Essential Commands

### Backend

```powershell
# Start backend
cd backend
.\venv\Scripts\activate
python manage.py runserver

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

### Frontend

```powershell
# Start frontend
cd frontend
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## 🆘 Quick Troubleshooting

### Backend won't start?

- Check Python version: `python --version` (need 3.9+)
- Activate venv: `.\venv\Scripts\activate`
- Install deps: `pip install -r requirements.txt`

### Frontend won't start?

- Check Node: `node --version` (need 18+)
- Delete node_modules: `rm -r node_modules`
- Reinstall: `npm install`

### "API key not found"?

- Check backend/.env exists
- Add: `GEMINI_API_KEY=your_key_here`
- Restart backend server

### "Cannot connect to backend"?

- Backend running on port 8000?
- Check: http://localhost:8000/api/health/
- CORS configured in settings.py?

---

## 📂 File Locations

```
backend/
├── .env                    ← Add API key here
├── manage.py              ← Run commands here
├── converter/converter.py  ← Gemini integration
└── requirements.txt       ← Dependencies

frontend/
├── app/page.tsx           ← Home page
├── components/            ← UI components
├── lib/api.ts             ← API calls
└── package.json           ← Dependencies
```

---

## 🎯 Test URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000/api/
- **Health Check:** http://localhost:8000/api/health/
- **Admin:** http://localhost:8000/admin/

---

## 💡 Quick Tips

1. **Always run 2 terminals** (backend + frontend)
2. **Keep terminals open** while developing
3. **Activate venv** before backend commands
4. **API key in .env** not .env.example
5. **Check console** for errors

---

## 📚 Documentation Quick Links

- **Setup Guide:** SETUP.md
- **User Guide:** USER_GUIDE.md
- **Developer Docs:** DEVELOPMENT.md
- **All Docs:** DOCUMENTATION_INDEX.md

---

## ✅ Verify Everything Works

1. Backend: http://localhost:8000/api/health/ returns OK
2. Frontend: http://localhost:3000 shows home page
3. Upload: Can select and preview image
4. Convert: Gets LaTeX code back
5. Copy: Button copies to clipboard

---

**That's it! You're ready to go! 🎉**

For detailed instructions, see SETUP.md
