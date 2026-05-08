# Contributing to Mengo

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy environment variables: `cp .env.example .env`
4. Run dev server: `npm run dev`

## Development Workflow

### 1. Before Starting Work
```bash
git checkout dev
git pull origin dev
```

### 2. Create Feature Branch
```bash
git checkout -b feature/description-of-feature
# Example: git checkout -b feature/user-authentication
```

Branch naming conventions:
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Critical production fixes
- `docs/*` - Documentation updates

### 3. Make Your Changes
- Write clean, documented code
- Follow existing code style
- Add tests for new functionality

### 4. Commit Your Changes
```bash
git add .
git commit -m "type: description"
```

Commit message format:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `test:` Tests
- `refactor:` Code refactoring
- `chore:` Maintenance tasks

### 5. Push and Create PR
```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub targeting the `dev` branch.

## Code Review Requirements

- All PRs must have at least 1 approval
- CI checks must pass
- No merge conflicts
- Branch must be up to date with `dev`

## Definition of Done

- [ ] Code compiles without errors
- [ ] Tests pass
- [ ] Documentation updated
- [ ] Code reviewed and approved
- [ ] No console errors/warnings
- [ ] Feature tested manually
