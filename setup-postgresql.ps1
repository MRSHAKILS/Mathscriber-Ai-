# PostgreSQL Installation and Setup Script for Windows

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "PostgreSQL Installation for MathScriber AI" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Download PostgreSQL
Write-Host "Step 1: Download PostgreSQL" -ForegroundColor Yellow
Write-Host "Please download PostgreSQL from:" -ForegroundColor White
Write-Host "https://www.postgresql.org/download/windows/" -ForegroundColor Green
Write-Host ""
Write-Host "Or use direct link:" -ForegroundColor White
Write-Host "https://sbp.enterprisedb.com/getfile.jsp?fileid=1258893" -ForegroundColor Green
Write-Host ""

$download = Read-Host "Have you downloaded the installer? (y/n)"
if ($download -ne 'y') {
    Write-Host "Please download and run the installer first, then run this script again." -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "Step 2: Install PostgreSQL" -ForegroundColor Yellow
Write-Host "Run the installer with these settings:" -ForegroundColor White
Write-Host "  - Port: 5432 (default)" -ForegroundColor Gray
Write-Host "  - Superuser password: Choose a strong password (you'll need this!)" -ForegroundColor Gray
Write-Host "  - Locale: Default" -ForegroundColor Gray
Write-Host ""

$installed = Read-Host "Have you installed PostgreSQL? (y/n)"
if ($installed -ne 'y') {
    Write-Host "Please install PostgreSQL first, then run this script again." -ForegroundColor Yellow
    exit
}

# Step 3: Get PostgreSQL password
Write-Host ""
Write-Host "Step 3: Configure Database" -ForegroundColor Yellow
$pgPassword = Read-Host "Enter the PostgreSQL superuser (postgres) password you set during installation" -AsSecureString
$pgPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($pgPassword))

# Step 4: Create database and user
Write-Host ""
Write-Host "Step 4: Creating database and user..." -ForegroundColor Yellow

$dbName = "mathscriber"
$dbUser = "mathscriber_user"
$dbPassword = Read-Host "Enter a password for the database user 'mathscriber_user'" -AsSecureString
$dbPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPassword))

# Find PostgreSQL installation
$pgPaths = @(
    "C:\Program Files\PostgreSQL\17\bin",
    "C:\Program Files\PostgreSQL\16\bin",
    "C:\Program Files\PostgreSQL\15\bin",
    "C:\Program Files\PostgreSQL\14\bin"
)

$psqlPath = $null
foreach ($path in $pgPaths) {
    if (Test-Path "$path\psql.exe") {
        $psqlPath = "$path\psql.exe"
        break
    }
}

if (-not $psqlPath) {
    Write-Host "ERROR: Could not find psql.exe" -ForegroundColor Red
    Write-Host "Please add PostgreSQL bin directory to your PATH manually" -ForegroundColor Yellow
    exit
}

Write-Host "Found PostgreSQL at: $psqlPath" -ForegroundColor Green

# Create SQL commands
$sqlCommands = @"
-- Create database
CREATE DATABASE $dbName;

-- Create user
CREATE USER $dbUser WITH PASSWORD '$dbPasswordPlain';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE $dbName TO $dbUser;

-- Connect to database
\c $dbName

-- Grant schema permissions
GRANT ALL ON SCHEMA public TO $dbUser;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $dbUser;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $dbUser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $dbUser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $dbUser;
"@

# Save SQL to temp file
$tempSqlFile = "$env:TEMP\mathscriber_setup.sql"
$sqlCommands | Out-File -FilePath $tempSqlFile -Encoding UTF8

# Execute SQL
Write-Host "Executing SQL commands..." -ForegroundColor Yellow
$env:PGPASSWORD = $pgPasswordPlain
& $psqlPath -U postgres -f $tempSqlFile 2>&1 | Write-Host
Remove-Item $tempSqlFile

# Step 5: Create .env file
Write-Host ""
Write-Host "Step 5: Creating .env file..." -ForegroundColor Yellow

$envContent = @"
# Django Settings
DEBUG=True
SECRET_KEY=django-insecure-dev-key-replace-in-production

# Database Configuration (PostgreSQL)
DB_ENGINE=postgresql
DB_NAME=$dbName
DB_USER=$dbUser
DB_PASSWORD=$dbPasswordPlain
DB_HOST=localhost
DB_PORT=5432

# Gemini API Key (for converter app)
GEMINI_API_KEY=
"@

$envContent | Out-File -FilePath "backend\.env" -Encoding UTF8

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "PostgreSQL Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Configuration saved to backend\.env" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. cd backend" -ForegroundColor Gray
Write-Host "2. python manage.py migrate" -ForegroundColor Gray
Write-Host "3. python manage.py seed_projects" -ForegroundColor Gray
Write-Host "4. python manage.py runserver" -ForegroundColor Gray
Write-Host ""
Write-Host "Database Details:" -ForegroundColor Cyan
Write-Host "  Database: $dbName" -ForegroundColor White
Write-Host "  User: $dbUser" -ForegroundColor White
Write-Host "  Host: localhost" -ForegroundColor White
Write-Host "  Port: 5432" -ForegroundColor White
Write-Host ""
