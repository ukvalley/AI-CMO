#!/bin/bash
# Development Deployment Script
# Usage: ./scripts/deploy-dev.sh

set -e

echo "=========================================="
echo "Mengo - Development Deployment"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env.dev exists
if [ ! -f .env.dev ]; then
    echo -e "${YELLOW}Warning: .env.dev not found, creating from template${NC}"
    cp .env.example .env.dev
    echo -e "${YELLOW}Please update .env.dev with your development values${NC}"
fi

# Load environment variables
export $(grep -v '^#' .env.dev | xargs)

echo ""
echo "Step 1: Pulling latest code..."
git pull origin dev || echo -e "${YELLOW}Not a git repository or already up to date${NC}"

echo ""
echo "Step 2: Stopping existing containers..."
docker compose -f docker-compose.dev.yml down

echo ""
echo "Step 3: Building and starting services..."
docker compose -f docker-compose.dev.yml up -d --build

echo ""
echo "Step 4: Waiting for services to start..."
sleep 10

echo ""
echo "Step 5: Health checks..."
echo "Checking backend..."
if curl -s http://localhost:3101/health > /dev/null; then
    echo -e "${GREEN}✓ Backend is healthy${NC}"
else
    echo -e "${RED}✗ Backend health check failed${NC}"
fi

echo "Checking frontend..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3100/login | grep -q "200"; then
    echo -e "${GREEN}✓ Frontend is responding${NC}"
else
    echo -e "${RED}✗ Frontend check failed${NC}"
fi

echo ""
echo "=========================================="
echo -e "${GREEN}Development deployment complete!${NC}"
echo "=========================================="
echo ""
echo "Access your application:"
echo "  Frontend: http://localhost:3100"
echo "  Backend API: http://localhost:3101"
echo "  MongoDB: localhost:27017"
echo "  Redis: localhost:6379"
echo ""
echo "View logs: docker compose -f docker-compose.dev.yml logs -f"
echo "Stop: docker compose -f docker-compose.dev.yml down"
echo ""
