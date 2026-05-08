#!/bin/bash

# Mengo Development Setup Script
# Usage: ./scripts/setup-dev.sh

set -e

echo "🚀 Setting up Mengo development environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js version
echo -e "${YELLOW}Checking Node.js version...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js 20+${NC}"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo -e "${RED}Node.js version 20+ required. Current: $(node --version)${NC}"
    exit 1
fi

# Check Git
echo -e "${YELLOW}Checking Git...${NC}"
if ! command -v git &> /dev/null; then
    echo -e "${RED}Git is not installed${NC}"
    exit 1
fi

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm install

# Setup environment file
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}Creating .env.local file...${NC}"
    cp .env.example .env.local
    echo -e "${GREEN}✓ Created .env.local - please update it with your values${NC}"
else
    echo -e "${GREEN}✓ .env.local already exists${NC}"
fi

# Setup Git hooks
echo -e "${YELLOW}Setting up Git hooks...${NC}"
npx husky install || true

# Create initial branches if they don't exist
echo -e "${YELLOW}Checking branches...${NC}"
git fetch origin || true

if ! git branch --list | grep -q "dev"; then
    git checkout -b dev
    git push -u origin dev || echo "Push dev branch manually after setting remote"
    git checkout main
fi

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Update .env.local with your configuration"
echo "  2. Read CONTRIBUTING.md for workflow details"
echo "  3. Read docs/onboarding/DEVELOPER_SETUP.md for more info"
echo "  4. Run 'npm run dev' to start development"
echo ""
echo "Quick commands:"
echo "  npm run dev       - Start all services"
echo "  npm run lint      - Run linter"
echo "  npm run test      - Run tests"
echo "  docker-compose up - Start dependencies (DB, Redis)"
