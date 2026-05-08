#!/bin/bash
# MongoDB Backup Script
# Usage: ./scripts/backup-db.sh [retention-days]

set -e

RETENTION_DAYS=${1:-7}
BACKUP_DIR="backups/mongo"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="ai-cmo-backup-$TIMESTAMP"

echo "=========================================="
echo "MongoDB Backup"
echo "=========================================="
echo "Backup name: $BACKUP_NAME"
echo "Retention: $RETENTION_DAYS days"
echo ""

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Run mongodump in container
echo "Creating backup..."
docker exec ai-cmo-mongo mongodump \
    --username "${DB_USER}" \
    --password "${DB_PASSWORD}" \
    --authenticationDatabase admin \
    --db "${DB_NAME}" \
    --out "/backups/$BACKUP_NAME"

# Compress backup
echo "Compressing backup..."
docker exec ai-cmo-mongo tar -czf "/backups/$BACKUP_NAME.tar.gz" -C /backups "$BACKUP_NAME"

# Remove uncompressed backup
docker exec ai-cmo-mongo rm -rf "/backups/$BACKUP_NAME"

# Copy to host
docker cp "ai-cmo-mongo:/backups/$BACKUP_NAME.tar.gz" "$BACKUP_DIR/"

# Remove from container
docker exec ai-cmo-mongo rm "/backups/$BACKUP_NAME.tar.gz"

# Clean up old backups
echo "Cleaning up old backups..."
find "$BACKUP_DIR" -name "ai-cmo-backup-*.tar.gz" -mtime +$RETENTION_DAYS -delete

echo ""
echo "=========================================="
echo "Backup Complete!"
echo "=========================================="
echo "Location: $BACKUP_DIR/$BACKUP_NAME.tar.gz"
echo "Size: $(du -h "$BACKUP_DIR/$BACKUP_NAME.tar.gz" | cut -f1)"
echo ""
echo "Available backups:"
ls -lh "$BACKUP_DIR"/*.tar.gz 2>/dev/null | tail -10
echo ""
