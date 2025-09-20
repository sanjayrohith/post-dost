@echo off
echo 🚀 Setting up Post-Dost for contributors...

REM Check Node.js version
echo 📋 Checking Node.js version...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

node -v
echo ✅ Node.js found

REM Install dependencies
echo 📦 Installing dependencies...
npm install --legacy-peer-deps

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies. Trying to clear cache...
    if exist node_modules rmdir /s /q node_modules
    if exist package-lock.json del package-lock.json
    npm install --legacy-peer-deps
)

REM Setup environment
echo 🔧 Setting up environment...
if not exist .env.local (
    copy .env.example .env.local
    echo ✅ Created .env.local from .env.example
    echo 📝 Please edit .env.local with your configuration
) else (
    echo ✅ .env.local already exists
)

REM Type check
echo 🔍 Running type check...
npm run type-check

REM Start development server
echo 🎉 Setup complete! Starting development server...
echo 🌐 Open http://localhost:3000 in your browser
npm run dev

pause