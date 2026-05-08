# Mengo - Developer Onboarding & Handoff Document

**Project:** Mengo - AI-powered Chief Marketing Officer Platform  
**Repository:** https://github.com/ukvalley/Mengo  
**Last Updated:** 2026-04-23  
**Status:** Ready for Development

---

## 1. Project Overview

Mengo is a multi-module platform with the following components:
- **Frontend**: React/Next.js web application
- **Backend**: Node.js/Express API services
- **ML/AI**: Python-based machine learning models
- **Infrastructure**: Docker, CI/CD, cloud deployment

---

## 2. Repository Access

### GitHub Repository
- **URL:** https://github.com/ukvalley/Mengo
- **Visibility:** Public
- **Main Branch:** `main` (production)
- **Development Branch:** `dev` (integration/testing)

### Getting Access
1. Repository owner will add you as a collaborator
2. Accept the GitHub invitation via email
3. Clone the repository (see Setup section below)

---

## 3. Quick Start (5 Minutes)

### Prerequisites
- Node.js 20+ (`node --version`)
- Git (`git --version`)
- Docker (optional, for containerized dev)

### Setup Commands

```bash
# 1. Clone the repository
git clone https://github.com/ukvalley/Mengo.git
cd Mengo

# 2. Run the automated setup
./scripts/setup-dev.sh

# 3. Start development
npm run dev
```

**That's it!** The setup script handles:
- Installing dependencies
- Creating environment files
- Setting up Git hooks
- Verifying your environment

---

## 4. Project Structure

```
Mengo/
├── src/
│   ├── backend/          # Node.js API (Owner: @backend-lead)
│   ├── frontend/         # React/Next.js (Owner: @frontend-lead)
│   ├── shared/           # Shared utilities/types
│   └── ml/               # Python ML models (Owner: @ml-lead)
├── docs/
│   ├── architecture/     # System design docs
│   ├── api/              # API documentation
│   └── onboarding/         # This document
├── tests/                # Test suites
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docker/               # Docker configurations
├── infra/                # Infrastructure as Code
├── scripts/              # Automation scripts
└── .github/
    ├── workflows/        # CI/CD pipelines
    └── ISSUE_TEMPLATE/   # Issue templates
```

---

## 5. Module Ownership

| Module | Lead | Responsibilities | GitHub Handle |
|--------|------|------------------|---------------|
| **Frontend** | Frontend Lead | UI/UX, React components, state management | @frontend-lead |
| **Backend** | Backend Lead | API, database, authentication, integrations | @backend-lead |
| **ML/AI** | ML Lead | Models, training pipelines, inference APIs | @ml-lead |
| **DevOps** | DevOps Lead | CI/CD, Docker, infrastructure, deployment | @devops-lead |
| **Project** | Project Lead | Overall coordination, architecture decisions | @project-lead |

### CODEOWNERS File
The `.github/CODEOWNERS` file automatically assigns reviewers based on which files you modify:
- Edit `/src/backend/` → Backend Lead is auto-assigned
- Edit `/src/frontend/` → Frontend Lead is auto-assigned
- Edit `/src/ml/` → ML Lead is auto-assigned

---

## 6. Branching Strategy (CRITICAL)

### Branch Types

| Branch | Purpose | Created From | Merges To | Protection |
|--------|---------|--------------|-----------|------------|
| `main` | Production | - | - | No direct push |
| `dev` | Integration | - | - | No direct push |
| `feature/*` | New features | `dev` | `dev` | Delete after merge |
| `bugfix/*` | Bug fixes | `dev` | `dev` | Delete after merge |
| `hotfix/*` | Critical fixes | `main` | `main` + `dev` | Delete after merge |

### Workflow

```bash
# 1. Always start from dev
git checkout dev
git pull origin dev

# 2. Create feature branch
./scripts/create-feature.sh user-authentication
# OR manually:
git checkout -b feature/user-authentication

# 3. Make changes & commit
git add .
git commit -m "feat: add user authentication"

# 4. Push to remote
git push origin feature/user-authentication

# 5. Create Pull Request on GitHub
#    - Target: dev branch
#    - Fill in PR template
#    - Request review from module owner

# 6. After approval, merge via GitHub UI
# 7. Delete your feature branch locally
git checkout dev
git branch -d feature/user-authentication
```

### ⚠️ IMPORTANT RULES

1. **NEVER push directly to `main` or `dev`**
2. **ALWAYS create Pull Request for review**
3. **Feature branches must be from `dev`, not `main`**
4. **Delete feature branches after merging**
5. **Get at least 1 approval before merging**

---

## 7. Development Workflow

### Daily Workflow

```bash
# Morning: Pull latest changes
git checkout dev
git pull origin dev

# Create your feature branch (if starting new work)
./scripts/create-feature.sh your-feature-name

# Work on your code...

# Before committing: Pull latest dev (if working for multiple days)
git checkout dev
git pull origin dev
git checkout feature/your-feature
git rebase dev  # or: git merge dev

# Commit and push
git add .
git commit -m "feat: your descriptive message"
git push origin feature/your-feature

# Create PR on GitHub, wait for review
```

### Commit Message Format

```
type: description

feat: add user login API
fix: resolve authentication bug
docs: update API documentation
test: add unit tests for payment
tefactor: simplify database queries
chore: update dependencies
```

---

## 8. Pull Request Process

### Creating a PR

1. Go to https://github.com/ukvalley/Mengo/pulls
2. Click "New Pull Request"
3. **Base:** `dev` ← **Compare:** `feature/your-branch`
4. Fill in the PR template:
   - Description of changes
   - Type of change (feature/bug/docs)
   - Related issue (if any)
   - Checklist items
5. **Request review** from your module owner
6. Wait for CI checks to pass (green ✓)

### Review Requirements

- ✅ Code reviewed by at least 1 person
- ✅ CI checks pass (lint, test, build)
- ✅ No merge conflicts
- ✅ Branch is up to date with `dev`

### After Merge

```bash
# Update your local dev
git checkout dev
git pull origin dev

# Delete feature branch
git branch -d feature/your-feature
git push origin --delete feature/your-feature  # Optional
```

---

## 9. Useful Commands

### Development

```bash
# Start all services
npm run dev

# Start specific service
npm run dev:backend
npm run dev:frontend
npm run dev:ml

# Run tests
npm run test
npm run test:ci  # CI version

# Lint & format
npm run lint
npm run lint:fix
npm run format
```

### Docker (Optional)

```bash
# Start dependencies (DB, Redis)
docker-compose up -d

# Stop
docker-compose down

# View logs
docker-compose logs -f backend
```

### Git Helpers

```bash
# Create feature branch (automated)
./scripts/create-feature.sh feature-name

# Setup development environment
./scripts/setup-dev.sh
```

---

## 10. Development Environment Options

### Option 1: Local Development (Recommended)
```bash
npm install
npm run dev
```

### Option 2: GitHub Codespaces
1. Go to https://github.com/ukvalley/Mengo
2. Click "Code" → "Codespaces" tab
3. Click "Create codespace on dev"
4. VS Code opens in browser with pre-configured environment

### Option 3: VS Code + Dev Container
1. Install "Remote - Containers" extension
2. Open project in VS Code
3. Press `Cmd/Ctrl+Shift+P` → "Remote-Containers: Open Folder in Container"

---

## 11. Task & Issue Management

### Creating Issues

Use GitHub Issues with templates:
- **Bug Report:** For bugs and errors
- **Feature Request:** For new features
- **Development Task:** For specific development work

### Task Assignment

Each task must have:
1. **Single owner** (no shared responsibility)
2. **Clear deadline**
3. **Definition of done**
4. **Module label** (frontend/backend/ml/infra)

### Finding Your Tasks

Filter issues by:
- `assignee:@me` - Your assigned tasks
- `label:frontend` - Frontend tasks
- `label:backend` - Backend tasks
- `label:ml` - ML tasks

---

## 12. Code Standards

### Style Guide
- **TypeScript:** Strict mode enabled
- **ESLint:** Configured with project rules
- **Prettier:** Automatic formatting on commit
- **Husky:** Pre-commit hooks run linting

### Testing Requirements
- Unit tests for utilities
- Integration tests for APIs
- Minimum 70% coverage expected

### Documentation
- Update docs when changing APIs
- Comment complex logic
- Update README for new features

---

## 13. Communication

### Channels
- **GitHub Issues:** Task tracking, bug reports
- **Pull Requests:** Code review discussions
- **GitHub Discussions:** Architecture decisions
- **(Add your team Slack/Discord here)**

### Meetings
- **Daily Standup:** [Time TBD]
- **Sprint Planning:** [Day/Time TBD]
- **Code Review:** Async via GitHub

---

## 14. Emergency Procedures

### Hotfix Process (Critical Production Bug)

```bash
# 1. Create hotfix from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug-description

# 2. Fix the bug

# 3. Commit and push
git add .
git commit -m "fix: critical bug description"
git push origin hotfix/critical-bug-description

# 4. Create PR to main (urgent review)

# 5. After merge to main, ALSO merge main back to dev
git checkout dev
git merge main
git push origin dev
```

---

## 15. Resources & Documentation

### Essential Reading
1. [CONTRIBUTING.md](../CONTRIBUTING.md) - Detailed workflow
2. [BRANCHING_GUIDE.md](../BRANCHING_GUIDE.md) - Branch strategy
3. [PROJECT_STRUCTURE.md](../PROJECT_STRUCTURE.md) - Architecture
4. [ARCHITECTURE_OVERVIEW.md](./ARCHITECTURE_OVERVIEW.md) - System design

### External Resources
- [GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Actions](https://docs.github.com/en/actions)

---

## 16. Checklist for New Developers

Before starting work:

- [ ] Repository access granted
- [ ] Local setup completed (`./scripts/setup-dev.sh`)
- [ ] Can run `npm run dev` without errors
- [ ] Read CONTRIBUTING.md
- [ ] Read BRANCHING_GUIDE.md
- [ ] Know your module owner
- [ ] Created first test branch and PR (for practice)
- [ ] Joined team communication channels

---

## 17. Troubleshooting

### Common Issues

**"Permission denied" on scripts**
```bash
chmod +x scripts/*.sh
```

**"Cannot push to main"**
✅ This is correct! Create a feature branch and make a PR.

**Merge conflicts**
```bash
git checkout dev
git pull origin dev
git checkout your-branch
git merge dev
# Resolve conflicts
```

**CI checks failing**
- Run `npm run lint` locally first
- Run `npm run test` locally first
- Fix issues before pushing

### Getting Help

1. Check documentation in `/docs/`
2. Ask your module owner
3. Open a GitHub Discussion
4. Emergency: Contact project lead

---

## 18. Contact Information

| Role | Name | GitHub | Primary Contact |
|------|------|--------|-----------------|
| Project Lead | [Name] | @project-lead | [email] |
| Frontend Lead | [Name] | @frontend-lead | [email] |
| Backend Lead | [Name] | @backend-lead | [email] |
| ML Lead | [Name] | @ml-lead | [email] |
| DevOps Lead | [Name] | @devops-lead | [email] |

---

## 19. Quick Reference Card

```
DAILY WORKFLOW
==============
1. git checkout dev && git pull origin dev
2. ./scripts/create-feature.sh my-feature
3. Code, test, commit
4. git push origin feature/my-feature
5. Create PR → Request review → Merge
6. git checkout dev && git branch -d feature/my-feature

BRANCH RULES
============
✓ feature/* from dev → to dev
✓ hotfix/* from main → to main + dev
✗ NEVER push to main or dev directly
✓ Always 1 review required
✓ Delete branches after merge

COMMANDS
========
npm run dev         Start development
npm run test        Run tests
npm run lint        Check code style
./scripts/setup-dev.sh    Initial setup
```

---

**Document Version:** 1.0  
**Next Review Date:** [Set after first sprint]

**Questions?** Open a GitHub Issue or contact your module lead.
