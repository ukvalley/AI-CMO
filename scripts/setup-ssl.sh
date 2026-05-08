#!/bin/bash
# SSL Setup Script using Let's Encrypt and Certbot
# Usage: ./scripts/setup-ssl.sh your-domain.com

set -e

DOMAIN=${1:-""}
EMAIL=${2:-"admin@$DOMAIN"}

if [ -z "$DOMAIN" ]; then
    echo "Error: Domain name required"
    echo "Usage: ./scripts/setup-ssl.sh your-domain.com [email]"
    exit 1
fi

echo "=========================================="
echo "Setting up SSL for $DOMAIN"
echo "=========================================="

# Create certbot directories
mkdir -p docker/nginx/ssl
mkdir -p certbot-data certbot-www

# Stop nginx if running
docker-compose -f docker-compose.prod.yml stop nginx 2>/dev/null || true

# Run certbot to get certificates
docker run -it --rm \
    -v "$PWD/certbot-data:/etc/letsencrypt" \
    -v "$PWD/certbot-www:/var/www/certbot" \
    -p 80:80 \
    certbot/certbot certonly --standalone \
    --agree-tos \
    --no-eff-email \
    --email "$EMAIL" \
    -d "$DOMAIN" \
    ${3:+-d "$3"}

# Copy certificates to nginx ssl directory
if [ -f "certbot-data/live/$DOMAIN/fullchain.pem" ]; then
    cp "certbot-data/live/$DOMAIN/fullchain.pem" docker/nginx/ssl/
    cp "certbot-data/live/$DOMAIN/privkey.pem" docker/nginx/ssl/
    echo "✓ SSL certificates installed"
else
    echo "✗ Failed to obtain SSL certificates"
    exit 1
fi

# Restart nginx
docker-compose -f docker-compose.prod.yml up -d nginx

echo ""
echo "=========================================="
echo "SSL Setup Complete!"
echo "=========================================="
echo ""
echo "Your site should now be accessible via:"
echo "  https://$DOMAIN"
echo ""
echo "To set up auto-renewal, add this to your crontab:"
echo "  0 2 * * * $PWD/scripts/renew-ssl.sh >> /var/log/letsencrypt-renew.log 2>&1"
echo ""
