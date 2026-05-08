# Mengo Architecture Overview

## System Components

```
┌─────────────────────────────────────────────────────────────┐
│                        Mengo Platform                         │
├──────────────┬──────────────┬──────────────┬────────────────┤
│   Frontend   │   Backend    │      ML      │   Infrastructure │
├──────────────┼──────────────┼──────────────┼────────────────┤
│  React/Next  │  Node.js/    │  Python/     │   Docker/       │
│     TS       │   Express    │  TensorFlow  │   Kubernetes    │
└──────────────┴──────────────┴──────────────┴────────────────┘
```

## Module Owners

| Module | Lead | Responsibilities |
|--------|------|------------------|
| Frontend | @frontend-lead | UI/UX, Client-side logic |
| Backend | @backend-lead | API, Database, Auth |
| ML/AI | @ml-lead | Models, Training, Inference |
| DevOps | @devops-lead | CI/CD, Infrastructure |

## Data Flow

```
User → Frontend → API Gateway → Backend Services → Database
                        ↓
                    ML Services (for predictions)
```

## Technology Stack

### Frontend
- React / Next.js
- TypeScript
- Tailwind CSS
- State Management: Zustand/Redux

### Backend
- Node.js / Express
- TypeScript
- Database: PostgreSQL
- Cache: Redis
- Message Queue: Redis/RabbitMQ

### ML/AI
- Python
- TensorFlow / PyTorch
- FastAPI for model serving
- MLflow for experiment tracking

### Infrastructure
- Docker
- Docker Compose (local)
- Kubernetes (production)
- GitHub Actions (CI/CD)
- AWS/GCP (cloud)
