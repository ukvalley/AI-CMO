# Developer Onboarding Guide

## Prerequisites

- Node.js 20+
- Git
- Docker (optional, for containerized development)
- GitHub account with repository access

## Initial Setup

### 1. Clone Repository
```bash
git clone <repo-url>
cd AI\ CMO
```

### 2. Branch Setup
```bash
# Ensure you're on main
git checkout main

# Pull latest
git pull origin main

# The dev branch should already exist remotely
# Fetch it
git fetch origin dev
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Environment Setup
```bash
cp .env.example .env.local
# Edit .env.local with your local settings
```

### 5. Verify Setup
```bash
npm run lint    # Should pass
npm run test    # Should pass
npm run dev     # Server should start
```

## Development Environment Options

### Option 1: Local Development
- Run directly on your machine
- Use `npm run dev`

### Option 2: GitHub Codespaces
- Click "Code" → "Codespaces" → "Create codespace on dev"
- Pre-configured environment
- VS Code in browser

### Option 3: VS Code + Dev Container
- Install "Remote - Containers" extension
- Open in container

## First Contribution

1. Create a test branch: `git checkout -b feature/test-yourname`
2. Make a small change (e.g., add your name to CONTRIBUTORS.md)
3. Push and create PR
4. Get it reviewed and merged

## Team Communication

- **Daily Standups**: [Time/Link]
- **Sprint Planning**: [Day/Link]
- **Code Reviews**: Via GitHub PRs
- **Questions**: [Slack/Discord channel]

## Resources

- [CONTRIBUTING.md](../../CONTRIBUTING.md) - Workflow details
- [PROJECT_STRUCTURE.md](../../PROJECT_STRUCTURE.md) - Architecture overview
