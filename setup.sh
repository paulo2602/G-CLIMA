#!/bin/bash

# Clima AI Platform - macOS Setup Script
set -e

echo "🌍 Clima AI Platform Setup - macOS"
echo "=================================="
echo ""

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "📦 Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    echo "✅ Homebrew installed"
else
    echo "✅ Homebrew already installed"
fi

echo ""
echo "📦 Installing dependencies via Homebrew..."

# Install nvm (Node Version Manager)
if ! command -v nvm &> /dev/null; then
    echo "📥 Installing nvm..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    echo "✅ nvm installed"
else
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    echo "✅ nvm already installed"
fi

# Install Node.js 18
echo "📥 Installing Node.js 18..."
nvm install 18
nvm use 18
nvm alias default 18
echo "✅ Node.js 18 installed"

# Install pnpm
echo "📥 Installing pnpm..."
npm install -g pnpm
echo "✅ pnpm installed"

# Install Go
if ! command -v go &> /dev/null; then
    echo "📥 Installing Go..."
    brew install go
    echo "✅ Go installed"
else
    echo "✅ Go already installed"
fi

# Install Python 3.12
if ! command -v python3.12 &> /dev/null; then
    echo "📥 Installing Python 3.12..."
    brew install python@3.12
    echo "✅ Python 3.12 installed"
else
    echo "✅ Python 3.12 already installed"
fi

# Install Docker
if ! command -v docker &> /dev/null; then
    echo "📥 Installing Docker..."
    brew install docker
    brew install docker-compose
    echo "✅ Docker installed"
    echo "⚠️  Please start Docker Desktop from Applications/Docker.app"
else
    echo "✅ Docker already installed"
fi

# Install MongoDB (optional, we're using Docker)
if ! command -v mongosh &> /dev/null; then
    echo "📥 Installing MongoDB shell..."
    brew install mongosh
    echo "✅ MongoDB shell installed"
else
    echo "✅ MongoDB shell already installed"
fi

# Install NestJS CLI
echo "📥 Installing NestJS CLI..."
npm install -g @nestjs/cli
echo "✅ NestJS CLI installed"

# Verify Node version
echo ""
echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo "✅ Go version: $(go version)"
echo "✅ Python version: $(python3.12 --version)"
echo "✅ Docker version: $(docker --version)"

echo ""
echo "📂 Setting up project..."

# Install project dependencies
echo "📥 Installing API dependencies..."
cd api-nest
npm install
npm run build
cd ..

echo "📥 Installing Frontend dependencies..."
cd frontend
npm install
npm run build
cd ..

echo "📥 Setting up Python collector..."
cd collector-python
python3.12 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
deactivate
cd ..

echo "📥 Setting up Go worker..."
cd worker-go
go mod download
cd ..

echo ""
echo "🐳 Starting Docker services..."
docker-compose down 2>/dev/null || true
docker-compose up -d

echo ""
echo "✅ Setup completed!"
echo ""
echo "📋 Services:"
echo "  - API: http://localhost:3000"
echo "  - Frontend: http://localhost:5173"
echo "  - RabbitMQ Management: http://localhost:15672 (guest/guest)"
echo "  - MongoDB: mongodb://localhost:27017"
echo ""
echo "🚀 To start development:"
echo "  cd api-nest && npm run start:dev"
echo "  # In another terminal:"
echo "  cd frontend && npm run dev"
echo ""
echo "📊 View logs:"
echo "  docker-compose logs -f api"
echo "  docker-compose logs -f collector"
echo "  docker-compose logs -f worker"
echo ""
