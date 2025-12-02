# Quick PostgreSQL Setup Guide

## Step 1: Download & Install PostgreSQL

1. **Download:** https://www.postgresql.org/download/windows/
2. **Install** with these settings:
   - Port: `5432`
   - Password: `postgres` (or your choice - update .env if different)
   - Install Stack Builder: No (optional)

## Step 2: Create Database

Open **SQL Shell (psql)** from Start Menu:

```sql
-- Press Enter for all prompts, then enter password: postgres

-- Create database
CREATE DATABASE mathscriber;

-- Exit
\q
```

## Step 3: Configure Django

The `.env` file is already configured in `backend/.env`:
```
DB_ENGINE=postgresql
DB_NAME=mathscriber
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
```

**Note:** If you used a different password during PostgreSQL installation, update `DB_PASSWORD` in `.env`

## Step 4: Run Migrations

```powershell
cd backend
python manage.py migrate
python manage.py seed_projects
```

## Step 5: Start Server

```powershell
python manage.py runserver
```

## Done! ✅

Your application is now using PostgreSQL!

---

## Troubleshooting

### Can't connect to PostgreSQL?

1. **Check if PostgreSQL is running:**
   ```powershell
   Get-Service -Name postgresql*
   ```

2. **Start PostgreSQL if stopped:**
   ```powershell
   Start-Service postgresql-x64-*
   ```

3. **Verify password:** Make sure `DB_PASSWORD` in `.env` matches your PostgreSQL password

### Database doesn't exist?

```sql
-- In SQL Shell (psql):
CREATE DATABASE mathscriber;
```

### Authentication failed?

Edit `DB_PASSWORD` in `backend\.env` to match your PostgreSQL password

---

## Alternative: Use pgAdmin

1. Open **pgAdmin 4** (installed with PostgreSQL)
2. Connect to PostgreSQL (password: postgres)
3. Right-click "Databases" → Create → Database
4. Name: `mathscriber`
5. Save

Then run migrations as in Step 4 above.
