#!/bin/bash

# Create Feature Branch Script
# Usage: ./scripts/create-feature.sh feature-name

set -e

if [ -z "$1" ]; then
    echo "Usage: ./scripts/create-feature.sh <feature-name>"
    echo "Example: ./scripts/create-feature.sh user-authentication"
    exit 1
fi

FEATURE_NAME="$1"
BRANCH_NAME="feature/${FEATURE_NAME}"

echo "Creating feature branch: $BRANCH_NAME"

# Checkout dev and pull latest
echo "Pulling latest dev..."
git checkout dev
git pull origin dev

# Create new branch
echo "Creating branch: $BRANCH_NAME"
git checkout -b "$BRANCH_NAME"

echo ""
echo "✅ Feature branch created: $BRANCH_NAME"
echo ""
echo "Next steps:"
echo "  1. Make your changes"
echo "  2. git add ."
echo "  3. git commit -m 'feat: your message'"
echo "  4. git push origin $BRANCH_NAME"
echo "  5. Create PR to dev branch"
