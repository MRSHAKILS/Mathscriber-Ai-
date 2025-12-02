# PostgreSQL Setup Guide for MathScriber AI

## Option 1: Install PostgreSQL (Recommended for Production)

### Windows Installation

1. **Download PostgreSQL:**
   - Visit: https://www.postgresql.org/download/windows/
   - Download the latest version installer
   - Or use the direct link: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

2. **Install PostgreSQL:**
   ```powershell
   # Run the installer and follow these settings:
   # - Port: 5432 (default)
   # - Password: Choose a strong password (remember this!)
   # - Locale: Default
   ```

3. **Add PostgreSQL to PATH:**
   ```powershell
   # Add to system PATH:
   # C:\Program Files\PostgreSQL\16\bin
   ```

4. **Verify Installation:**
   ```powershell
   psql --version
   ```

### Create Database

1. **Open PostgreSQL Shell (psql):**
   ```powershell
   # Option 1: From Start Menu, open "SQL Shell (psql)"
   # Or from command line:
   psql -U postgres
   ```

2. **Create Database and User:**
   ```sql
   -- Create database
   CREATE DATABASE mathscriber;
   
   -- Create user
   CREATE USER mathscriber_user WITH PASSWORD 'your_secure_password';
   
   -- Grant privileges
   GRANT ALL PRIVILEGES ON DATABASE mathscriber TO mathscriber_user;
   
   -- Grant schema permissions (PostgreSQL 15+)
   \c mathscriber
   GRANT ALL ON SCHEMA public TO mathscriber_user;
   GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO mathscriber_user;
   GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO mathscriber_user;
   
   -- Exit
   \q
   ```

### Configure Django

1. **Create/Update `.env` file in backend directory:**
   ```bash
   # Database Configuration
   DB_ENGINE=postgresql
   DB_NAME=mathscriber
   DB_USER=mathscriber_user
   DB_PASSWORD=your_secure_password
   DB_HOST=localhost
   DB_PORT=5432
   
   # Other settings
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

2. **Install PostgreSQL Python Driver:**
   ```powershell
   cd backend
   pip install psycopg2-binary
   ```

3. **Run Migrations:**
   ```powershell
   python manage.py migrate
   ```

4. **Create Superuser:**
   ```powershell
   python manage.py createsuperuser
   ```

5. **Seed Sample Data:**
   ```powershell
   python manage.py seed_projects
   ```

---

## Option 2: Use SQLite (Current - For Development)

SQLite is already configured as the default fallback. No additional setup needed!

### Current Configuration

The settings are already configured to use SQLite when PostgreSQL is not available:

```python
# In settings.py - Already done!
if os.getenv('DB_ENGINE') == 'postgresql':
    # Use PostgreSQL if configured
else:
    # Use SQLite (default)
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }
```

### To Continue with SQLite:

1. **Just run migrations:**
   ```powershell
   cd backend
   python manage.py migrate
   ```

2. **Start the server:**
   ```powershell
   python manage.py runserver
   ```

---

## Quick Start Commands

### For PostgreSQL Setup:
```powershell
# 1. Install PostgreSQL from https://www.postgresql.org/download/windows/

# 2. Create database (in psql):
CREATE DATABASE mathscriber;
CREATE USER mathscriber_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE mathscriber TO mathscriber_user;

# 3. Configure .env file
echo "DB_ENGINE=postgresql" >> backend/.env
echo "DB_NAME=mathscriber" >> backend/.env
echo "DB_USER=mathscriber_user" >> backend/.env
echo "DB_PASSWORD=secure_password" >> backend/.env
echo "DB_HOST=localhost" >> backend/.env
echo "DB_PORT=5432" >> backend/.env

# 4. Run migrations
cd backend
python manage.py migrate
python manage.py seed_projects
```

### For SQLite (Current Setup):
```powershell
# Already working! Just run:
cd backend
python manage.py migrate
python manage.py runserver
```

---

## Comparison: PostgreSQL vs SQLite

| Feature | PostgreSQL | SQLite |
|---------|-----------|--------|
| **Setup** | Requires installation | Built-in with Python |
| **Performance** | Better for production | Good for development |
| **Concurrent Users** | Excellent | Limited |
| **Data Size** | Unlimited | Limited (recommended < 1GB) |
| **Features** | Full-featured | Basic |
| **Backup** | pg_dump tools | Copy db.sqlite3 file |
| **Production Ready** | ✅ Yes | ❌ Not recommended |

---

## Troubleshooting

### PostgreSQL Connection Issues

1. **Can't connect to PostgreSQL:**
   ```powershell
   # Check if PostgreSQL is running:
   Get-Service -Name postgresql*
   
   # Start PostgreSQL service:
   Start-Service postgresql-x64-16
   ```

2. **Authentication failed:**
   - Check username and password in `.env`
   - Verify user exists in PostgreSQL
   - Check `pg_hba.conf` authentication method

3. **Database does not exist:**
   ```sql
   CREATE DATABASE mathscriber;
   ```

### SQLite Issues

1. **Database is locked:**
   - Close any open connections
   - Restart Django server
   - Delete `db.sqlite3` and run migrations again

2. **Migration conflicts:**
   ```powershell
   # Delete migrations and start fresh:
   python manage.py migrate --fake-initial
   ```

---

## Recommendation

**For Development:** Continue with SQLite (current setup)  
**For Production:** Use PostgreSQL

Your project is currently configured to work with both, defaulting to SQLite for ease of development.

---

## Current Status ✅

- ✅ Settings configured for both PostgreSQL and SQLite
- ✅ SQLite working by default
- ✅ Migrations created and applied
- ✅ Sample data available
- ✅ Ready to use immediately with SQLite

**You can start developing now with SQLite, and switch to PostgreSQL later when needed!**
