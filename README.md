# AI CMO

AI-powered Chief Marketing Officer platform.

## Quick Start

```bash
# Clone repository
git clone <repo-url>
cd AI\ CMO

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your values

# Run development server
npm run dev
```

## Project Structure

See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for detailed architecture.

## Development

See [CONTRIBUTING.md](./CONTRIBUTING.md) for workflow guidelines.

## Team

| Role | Owner | Module |
|------|-------|--------|
| Backend Lead | @backend-lead | `/src/backend` |
| Frontend Lead | @frontend-lead | `/src/frontend` |
| ML Lead | @ml-lead | `/src/ml` |
| DevOps Lead | @devops-lead | `/infra`, `/docker` |

## Branching

- `main` - Production
- `dev` - Integration/Testing
- `feature/*` - Feature development

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Run linter
