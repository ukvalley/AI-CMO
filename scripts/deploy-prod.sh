#!/bin/bash
# Production Deployment Script with Zero Downtime
# Usage: ./scripts/deploy-prod.sh

set -e

echo "=========================================="
echo "Mengo - Production Deployment"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Load environment variables
if [ ! -f .env.prod ]; then
    echo -e "${RED}Error: .env.prod not found${NC}"
    echo "Please create .env.prod from the template"
    exit 1
fi

export $(grep -v '^#' .env.prod | xargs)

echo ""
echo "Step 1: Creating necessary directories..."
mkdir -p uploads backups/mongo docker/nginx/ssl
echo -e "${GREEN}✓ Directories created${NC}"

echo ""
echo "Step 2: Checking SSL certificates..."
if [ ! -f "docker/nginx/ssl/fullchain.pem" ] || [ ! -f "docker/nginx/ssl/privkey.pem" ]; then
    echo -e "${YELLOW}Warning: SSL certificates not found${NC}"
    echo "To set up SSL with Let's Encrypt, run:"
    echo "  ./scripts/setup-ssl.sh your-domain.com"
    echo ""
    echo -e "${YELLOW}Continuing without SSL for now...${NC}"
fi

echo ""
echo "Step 3: Pulling latest code..."
git pull origin main || echo -e "${YELLOW}Not a git repository or already up to date${NC}"

echo ""
echo "Step 4: Building images..."
docker compose -f docker-compose.prod.yml build --no-cache

echo ""
echo "Step 5: Starting services..."
docker compose -f docker-compose.prod.yml up -d

echo ""
echo "Step 6: Running health checks..."
sleep 15

# Health check function
check_health() {
    local url=$1
    local name=$2
    local max_attempts=10
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200"; then
            echo -e "${GREEN}✓ $name is healthy${NC}"
            return 0
        fi
        echo "  Attempt $attempt/$max_attempts..."
        sleep 5
        attempt=$((attempt + 1))
    done

    echo -e "${RED}✗ $name health check failed${NC}"
    return 1
}

check_health "http://localhost:3001/health" "Backend"
check_health "http://localhost:3000/login" "Frontend"

echo ""
echo "Step 7: Cleaning up old images..."
docker system prune -f

echo ""
echo "=========================================="
echo -e "${GREEN}Production deployment complete!${NC}"
echo "=========================================="
echo ""
echo "Your application is now running at:"
echo "  http://your-domain.com (port 80)"
echo "  https://your-domain.com (port 443) - after SSL setup"
echo ""
echo "View logs: docker compose -f docker-compose.prod.yml logs -f"
echo "View backend logs: docker compose -f docker-compose.prod.yml logs -f backend"
echo "Backup database: ./scripts/backup-db.sh"
echo ""
