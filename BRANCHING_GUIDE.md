# Branching Strategy Guide

## Overview

This project uses Git Flow with the following branch structure:

## Branch Types

### 1. main (Production)
- **Purpose**: Production-ready code
- **Protection**: Cannot push directly, requires PR + review
- **Deploys to**: Production environment

### 2. dev (Integration)
- **Purpose**: Integration and testing branch
- **Protection**: Cannot push directly, requires PR + review
- **Deploys to**: Staging/Testing environment

### 3. feature/* (Features)
- **Purpose**: Individual feature development
- **Created from**: dev
- **Merges to**: dev
- **Naming**: `feature/short-description`
- **Examples**:
  - `feature/user-authentication`
  - `feature/payment-gateway`
  - `feature/dashboard-analytics`

### 4. bugfix/* (Bug Fixes)
- **Purpose**: Non-critical bug fixes
- **Created from**: dev
- **Merges to**: dev
- **Naming**: `bugfix/issue-description`

### 5. hotfix/* (Critical Fixes)
- **Purpose**: Critical production fixes
- **Created from**: main
- **Merges to**: main AND dev
- **Naming**: `hotfix/issue-description`

### 6. release/* (Releases)
- **Purpose**: Release preparation
- **Created from**: dev
- **Merges to**: main
- **Naming**: `release/v1.2.3`

## Workflow

### Starting a Feature

```bash
# 1. Pull latest dev
git checkout dev
git pull origin dev

# 2. Create feature branch
git checkout -b feature/your-feature-name

# Or use the helper script
./scripts/create-feature.sh your-feature-name
```

### During Development

```bash
# Make changes, commit regularly
git add .
git commit -m "feat: descriptive message"

# Push to remote
git push origin feature/your-feature-name
```

### Creating a Pull Request

1. Go to GitHub
2. Click "New Pull Request"
3. Base: `dev` ← Compare: `feature/your-feature-name`
4. Fill in PR template
5. Request review from module owner
6. Address review comments
7. Merge after approval

### After Merge

```bash
# Switch back to dev
git checkout dev
git pull origin dev

# Delete local feature branch
git branch -d feature/your-feature-name

# Delete remote feature branch
git push origin --delete feature/your-feature-name
```

## Rules

1. ✅ **DO** create feature branches from `dev`
2. ✅ **DO** use descriptive branch names
3. ✅ **DO** delete branches after merge
4. ❌ **DON'T** push directly to `main` or `dev`
5. ❌ **DON'T** merge without review
6. ❌ **DON'T** keep long-running feature branches

## Emergency Hotfix

```bash
# 1. Create hotfix from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-fix

# 2. Fix and commit
git add .
git commit -m "fix: critical issue"

# 3. Push and create PR to main
# 4. After merge, also merge main back to dev
```
