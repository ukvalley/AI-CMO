# Mengo - Project Structure

## Repository Structure

```
Mengo/
├── .github/                    # GitHub-specific configurations
│   ├── workflows/               # CI/CD workflows
│   ├── pull_request_template.md
│   └── CODEOWNERS               # Code ownership rules
├── docs/                        # Documentation
│   ├── architecture/
│   ├── api/
│   └── onboarding/
├── src/                         # Source code
│   ├── backend/                 # Backend services
│   ├── frontend/                # Frontend applications
│   ├── shared/                  # Shared utilities/types
│   └── ml/                      # ML/AI models
├── tests/                       # Test suites
├── scripts/                     # Automation scripts
├── docker/                      # Docker configurations
├── infra/                       # Infrastructure as Code
└── config/                      # Configuration files
```

## Branching Strategy

| Branch      | Purpose                      | Protection Rules                  |
|-------------|------------------------------|-----------------------------------|
| `main`      | Production-ready code        | No direct push, requires PR + review |
| `dev`       | Integration/Testing          | No direct push, requires PR + review |
| `feature/*` | Individual features          | Delete after merge                |
| `hotfix/*`  | Critical production fixes    | Merge to both main and dev        |
| `release/*` | Release preparation          | Version-specific branches         |

## Workflow

```
1. Pull latest from dev
   git checkout dev
   git pull origin dev

2. Create feature branch
   git checkout -b feature/your-feature-name

3. Work on your code

4. Push to remote
   git push origin feature/your-feature-name

5. Create Pull Request to dev

6. Code Review (1 approval required)

7. Merge to dev

8. Delete feature branch
```
