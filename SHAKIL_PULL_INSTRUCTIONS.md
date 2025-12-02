# 🔄 Instructions for Shakil - Pull Sanjana's Frontend Changes

## What's in the Sanjana Branch?

✅ **Backend**: Complete Gemini API integration (from shakil branch - preserved)
✅ **Frontend**: Enhanced Next.js 16 structure with new components
✅ **Database**: PostgreSQL settings (preserved in .env)

## 🚀 How to Pull and Merge (Will Only Affect Your Frontend)

### Option 1: Safe Merge (Recommended)

```bash
# 1. Make sure you're in the project directory
cd path/to/Mathscriber-Ai-

# 2. Commit any current work
git add .
git commit -m "save current work"

# 3. Fetch latest changes
git fetch origin

# 4. Pull sanjana's changes (only affects frontend)
git pull origin sanjana

# If there are conflicts in frontend files, Git will tell you
# The backend files won't be affected since they came from your shakil branch
```

### Option 2: Cherry-pick Frontend Only

```bash
# 1. Fetch all branches
git fetch --all

# 2. Checkout specific frontend folders from sanjana branch
git checkout origin/sanjana -- frontend/app/(auth)
git checkout origin/sanjana -- frontend/app/(dashboard)
git checkout origin/sanjana -- frontend/app/api
git checkout origin/sanjana -- frontend/components
git checkout origin/sanjana -- frontend/lib
git checkout origin/sanjana -- frontend/package.json
git checkout origin/sanjana -- frontend/package-lock.json
git checkout origin/sanjana -- frontend/tailwind.config.js
git checkout origin/sanjana -- frontend/.env.local.example

# 3. Commit the changes
git add frontend/
git commit -m "merged sanjana's frontend improvements"
```

### Option 3: Fresh Clone (If Issues)

```bash
# 1. Clone fresh copy
git clone https://github.com/MRSHAKILS/Mathscriber-Ai-.git
cd Mathscriber-Ai-

# 2. Checkout sanjana branch
git checkout sanjana

# 3. Copy your backend .env file (has your API keys)
# Copy from your old project to: backend/.env

# 4. Install and run
cd backend
pip install -r requirements.txt
python manage.py runserver

# New terminal
cd frontend
npm install --legacy-peer-deps
npm run dev
```

## 📦 What Changed in Frontend?

### New Folder Structure:
```
frontend/
├── app/
│   ├── (auth)/              # Login & Register pages
│   ├── (dashboard)/         # Dashboard, Upload, Playground, Results, etc.
│   └── api/                 # Next.js API routes (BFF pattern)
├── components/
│   ├── converter/           # Image uploader, model selector, results viewer
│   ├── playground/          # Graph visualizer, step solver
│   ├── collaboration/       # Real-time editor features
│   └── ui/                  # Reusable components (Button, Input, Card, etc.)
└── lib/
    └── utils.ts             # Utility functions
```

### Removed Old Pages:
- ❌ `app/upload/page.tsx` (replaced with `app/(dashboard)/upload/page.tsx`)
- ❌ `app/scan/page.tsx` (merged into upload)
- ❌ `app/history/page.tsx` (replaced with `app/(dashboard)/results/page.tsx`)
- ❌ `app/result/page.tsx` (merged into results)

### New Dependencies:
```json
{
  "next": "16.0.6",
  "react": "19.2.0",
  "tailwindcss": "3.4.3",
  "daisyui": "5.5.5",
  "tailwindcss-animate": "1.0.7",
  "lucide-react": "0.344.0"
}
```

**Important**: Always use `npm install --legacy-peer-deps` due to React 19!

## ⚠️ Important Notes

1. **Backend is NOT affected** - Your Gemini API integration is safe
2. **Database settings preserved** - .env file not touched
3. **Frontend enhanced** - Better structure with more components
4. **React 19 compatibility** - Must use `--legacy-peer-deps`

## 🔍 Verify Everything Works

After pulling:

1. **Check Backend**:
   ```bash
   cd backend
   python manage.py check
   # Should show: "System check identified no issues (0 silenced)."
   ```

2. **Check Frontend**:
   ```bash
   cd frontend
   npm install --legacy-peer-deps
   npm run dev
   # Should compile without errors
   ```

3. **Test API**:
   - Backend: http://127.0.0.1:8000/api/health/
   - Frontend: http://localhost:3000

## 🐛 Troubleshooting

### "npm install" errors
```bash
npm install --legacy-peer-deps
```

### Port conflicts
```bash
# Kill port 3000
netstat -ano | findstr :3000
taskkill /PID <number> /F

# Kill port 8000
netstat -ano | findstr :8000
taskkill /PID <number> /F
```

### Git merge conflicts
```bash
# Accept all your backend changes
git checkout --ours backend/

# Accept all sanjana's frontend changes
git checkout --theirs frontend/

# Then commit
git add .
git commit -m "merged sanjana frontend"
```

### Module not found errors
```bash
# Backend
pip install -r requirements.txt

# Frontend
rm -rf node_modules .next
npm install --legacy-peer-deps
```

## 📞 Questions?

Check these files:
- `README.md` - Full project documentation
- `TEAM_SETUP.md` - Quick setup guide
- `SETUP.md` - Detailed setup instructions

---

**Note**: Your backend implementation from shakil branch is completely safe and won't be overwritten! 🛡️
