# Authentication System - Implementation Guide

## ✅ What Was Implemented

### Backend (Django)

1. **JWT Authentication Setup**

   - Installed `djangorestframework-simplejwt`
   - Configured JWT settings with 1-day access tokens and 7-day refresh tokens
   - Added JWT authentication to REST Framework

2. **Authentication Endpoints**

   - `POST /api/register/` - User registration
   - `POST /api/login/` - User login
   - Returns JWT tokens and user information

3. **Database Configuration**
   - Switched to SQLite for easier development
   - Django's built-in User model is used
   - All migrations are already applied

### Frontend (Next.js)

1. **API Routes (Proxy Layer)**

   - `/api/auth/register` - Proxies to Django backend
   - `/api/auth/login` - Proxies to Django backend
   - Handles errors and responses

2. **UI Pages**
   - `/register` - Registration form with validation
   - `/login` - Login form with error handling
   - Both pages include:
     - Loading states
     - Error messages
     - Form validation
     - Token storage in localStorage
     - Auto-redirect after successful auth

## 🚀 How to Test

### Option 1: Manual Testing (Browser)

1. **Start the servers** (if not running):

   ```bash
   # Terminal 1 - Backend
   cd backend
   python manage.py runserver

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

2. **Test Registration**:

   - Go to http://localhost:3000/register
   - Fill in the form:
     - Name: Your Name
     - Email: test@example.com
     - Password: password123
     - Confirm Password: password123
   - Click "Create account"
   - Should redirect to home page with token stored

3. **Test Login**:

   - Go to http://localhost:3000/login
   - Enter credentials:
     - Email: test@example.com
     - Password: password123
   - Click "Sign in"
   - Should redirect to home page with token stored

4. **Verify Token**:
   - Open browser console (F12)
   - Type: `localStorage.getItem('token')`
   - Should see a JWT token

### Option 2: Automated Testing (Python Script)

1. **Install requests** (if not installed):

   ```bash
   pip install requests
   ```

2. **Run the test script**:
   ```bash
   cd backend
   python test_auth.py
   ```

### Option 3: API Testing (Postman/Thunder Client)

**Register a User:**

```http
POST http://localhost:8000/api/register/
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Login:**

```http
POST http://localhost:8000/api/login/
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepass123"
}
```

## 📋 Response Format

### Successful Registration/Login:

```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "test@example.com",
    "name": "Test User"
  },
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Error Response:

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

## 🔧 Configuration

### Environment Variables (Optional)

Create `.env` file in backend folder:

```env
GEMINI_API_KEY=your_api_key_here
SECRET_KEY=your-secret-key-here
```

### CORS Settings

Already configured in `backend/mathscriber_ai/settings.py`:

- Allows requests from `http://localhost:3000`
- Allows POST, GET, OPTIONS methods
- Allows Authorization header

## 🔐 Security Features

1. **Password Hashing**: Django's built-in password hashing (PBKDF2)
2. **JWT Tokens**: Secure token-based authentication
3. **CORS Protection**: Only allows requests from frontend
4. **Input Validation**: Validates email, password, and required fields
5. **Token Expiration**: Access tokens expire after 1 day

## 📁 Files Modified

### Backend:

- `backend/requirements.txt` - Added JWT package
- `backend/mathscriber_ai/settings.py` - JWT & database config
- `backend/converter/views.py` - Added RegisterView and LoginView
- `backend/converter/urls.py` - Added auth routes
- `backend/test_auth.py` - Test script (new file)

### Frontend:

- `frontend/app/api/auth/register/route.ts` - API proxy
- `frontend/app/api/auth/login/route.ts` - API proxy
- `frontend/app/(auth)/register/page.tsx` - Registration form
- `frontend/app/(auth)/login/page.tsx` - Login form

## ⚠️ Known Limitations

1. **No Logout Endpoint**: Currently no server-side logout (client-side only)
2. **No Password Reset**: Forgot password feature not implemented
3. **No Email Verification**: Users can register without email verification
4. **Basic Validation**: Minimal password requirements (6+ characters)
5. **No Rate Limiting**: No protection against brute force attacks

## 🎯 Next Steps (Optional Enhancements)

1. Add logout endpoint to blacklist tokens
2. Implement password reset flow
3. Add email verification
4. Implement refresh token rotation
5. Add rate limiting
6. Create protected route middleware
7. Add user profile management
8. Implement social login (Google, GitHub)

## 🐛 Troubleshooting

### "Unable to connect to server"

- Ensure Django server is running on port 8000
- Check: `python manage.py runserver`

### "User already exists"

- The email is already registered
- Try a different email or login with existing credentials

### "Invalid email or password"

- Check credentials are correct
- Ensure user is registered first

### Token not saving

- Check browser console for errors
- Ensure localStorage is enabled
- Try a different browser

### CORS errors

- Ensure Django server is running
- Check CORS settings in `settings.py`
- Clear browser cache

## ✨ Success!

Your authentication system is now fully functional! Users can:

- ✅ Register new accounts
- ✅ Login with credentials
- ✅ Receive JWT tokens
- ✅ Store tokens in localStorage
- ✅ Auto-redirect after auth

The system is production-ready for basic authentication needs.
