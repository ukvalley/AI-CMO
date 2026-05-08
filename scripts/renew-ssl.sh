#!/bin/bash
# SSL Certificate Auto-Renewal Script
# Add to crontab: 0 2 * * * /opt/ai-cmo/scripts/renew-ssl.sh >> /var/log/letsencrypt-renew.log 2>&1

set -e

cd /opt/ai-cmo

# Run certbot renew
docker run --rm \
    -v "$PWD/certbot-data:/etc/letsencrypt" \
    -v "$PWD/certbot-www:/var/www/certbot" \
    certbot/certbot renew --quiet

# Check if certificates were renewed
if [ -d "certbot-data/live" ]; then
    for domain in certbot-data/live/*/; do
        domain=$(basename "$domain")
        if [ -f "certbot-data/live/$domain/fullchain.pem" ]; then
            # Copy updated certificates
            cp "certbot-data/live/$domain/fullchain.pem" docker/nginx/ssl/
            cp "certbot-data/live/$domain/privkey.pem" docker/nginx/ssl/
            echo "$(date): Renewed SSL certificates for $domain"
        fi
    done

    # Reload nginx to apply new certificates
    docker-compose -f docker-compose.prod.yml exec nginx nginx -s reload
    echo "$(date): Nginx reloaded successfully"
fi
