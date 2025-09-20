#!/bin/bash

echo "🚀 Setting up Post-Dost for contributors..."

# Check Node.js version
echo "📋 Checking Node.js version..."
node_version=$(node -v 2>/dev/null)
if [ $? -ne 0 ]; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $node_version"

# Install dependencies
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies. Trying to clear cache..."
    rm -rf node_modules package-lock.json
    npm install --legacy-peer-deps
fi

# Setup environment
echo "🔧 Setting up environment..."
if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo "✅ Created .env.local from .env.example"
    echo "📝 Please edit .env.local with your configuration"
else
    echo "✅ .env.local already exists"
fi

# Type check
echo "🔍 Running type check..."
npm run type-check

# Start development server
echo "🎉 Setup complete! Starting development server..."
echo "🌐 Open http://localhost:3000 in your browser"
npm run dev