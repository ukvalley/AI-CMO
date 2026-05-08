# AI CMO - Complete Project Documentation

> **AI-Powered Chief Marketing Officer Platform**
> A comprehensive modular marketing management system with 60+ modules.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [Module Architecture](#4-module-architecture)
5. [Development Setup](#5-development-setup)
6. [Deployment Guide](#6-deployment-guide)
7. [API Documentation](#7-api-documentation)
8. [Database Schema](#8-database-schema)
9. [Design System](#9-design-system)
10. [Team & Workflow](#10-team--workflow)

---

## 1. Project Overview

AI CMO is a modular AI-powered Chief Marketing Officer platform designed to help businesses manage their entire marketing operations through 60+ interconnected modules organized into 8 functional groups.

### Key Features

- **60+ Marketing Modules**: Comprehensive coverage of marketing operations
- **AI Integration**: Claude API and OpenAI for content generation
- **Modular Architecture**: Each module can work independently
- **Dark Theme UI**: Professional dark interface with purple accents
- **Real-time Collaboration**: WebSocket support for live updates
- **Multi-tenant**: Company-based data isolation
- **API-First**: RESTful API with localStorage fallback

### Module Groups

| Group | Modules | Description |
|-------|---------|-------------|
| **Foundation** | Business Profile, Founders, Employees, Products, Categories, ICPs, Personas, Competitors | Core business data |
| **Brand** | Brand, Brand Assets, Stationery | Brand identity management |
| **Content** | Website Pages, Blogs, Newsletters, FAQs, Content Library, Stories, Testimonials | Content management |
| **Sales** | Landing Pages, Sales Scripts, Sales Collateral, Video Content, Banners, Books | Sales enablement |
| **Marketing** | SEO Pages, Ads, PR Items, Email Templates, Courses, Events | Marketing campaigns |
| **Programs** | Loyalty Programs, Membership Plans, Referral Programs, SOPs | Customer programs |
| **Operations** | Job Postings, Legal Documents | Business operations |
| **System** | Settings, AI Engine, Background Tasks | Platform management |

---

## 2. Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.x
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod

### Backend
- **Runtime**: Node.js 20 LTS
- **Framework**: Express.js 4.x
- **Language**: TypeScript 5.x
- **Database**: MongoDB 7.0 (Mongoose ODM)
- **Cache**: Redis 7.x
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: Zod

### AI/ML
- **Claude API**: Anthropic Claude for content generation
- **OpenAI API**: GPT models for additional AI features

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Web Server**: Nginx (reverse proxy)
- **SSL**: Let's Encrypt
- **Process Manager**: PM2 (production)
- **VPS Deployment**: Ubuntu 22.04 LTS

---

## 3. Project Structure

```
AI CMO/
├── src/
│   ├── frontend/                   # Next.js 14 Application
│   │   ├── src/
│   │   │   ├── app/               # Next.js App Router
│   │   │   │   ├── (routes)/      # Page routes
│   │   │   │   ├── api/           # API routes (if any)
│   │   │   │   ├── layout.tsx     # Root layout
│   │   │   │   └── globals.css    # Global styles
│   │   │   ├── components/
│   │   │   │   ├── shared/        # Shared components
│   │   │   │   │   ├── ModulePage.tsx      # Module page wrapper
│   │   │   │   │   ├── UniversalTable.tsx  # Data table
│   │   │   │   │   ├── UniversalForm.tsx   # Form builder
│   │   │   │   │   └── AIChatPanel.tsx     # AI chat
│   │   │   │   ├── ui/            # shadcn/ui components
│   │   │   │   └── layout/        # Layout components
│   │   │   ├── modules/           # Module implementations
│   │   │   │   ├── foundation/    # Foundation modules
│   │   │   │   ├── brand/         # Brand modules
│   │   │   │   ├── content/       # Content modules
│   │   │   │   ├── sales/         # Sales modules
│   │   │   │   ├── marketing/     # Marketing modules
│   │   │   │   ├── programs/      # Program modules
│   │   │   │   └── operations/    # Operations modules
│   │   │   ├── stores/            # Zustand stores
│   │   │   │   ├── dataStore.ts   # Data CRUD operations
│   │   │   │   ├── authStore.ts   # Authentication
│   │   │   │   ├── companyStore.ts
│   │   │   │   └── chatStore.ts
│   │   │   ├── services/          # API services
│   │   │   ├── types/             # TypeScript types
│   │   │   ├── lib/               # Utilities
│   │   │   └── hooks/             # Custom React hooks
│   │   ├── package.json
│   │   ├── next.config.js
│   │   ├── tailwind.config.ts
│   │   └── tsconfig.json
│   │
│   ├── backend/                    # Express Backend
│   │   ├── src/
│   │   │   ├── models/            # Mongoose models
│   │   │   │   ├── User.ts
│   │   │   │   ├── Company.ts
│   │   │   │   ├── BusinessProfile.ts
│   │   │   │   ├── Product.ts
│   │   │   │   ├── Founder.ts
│   │   │   │   ├── Employee.ts
│   │   │   │   ├── ICP.ts
│   │   │   │   ├── Persona.ts
│   │   │   │   ├── Competitor.ts
│   │   │   │   └── ... (60+ models)
│   │   │   ├── routes/            # API routes
│   │   │   │   ├── auth.ts
│   │   │   │   ├── companies.ts
│   │   │   │   ├── users.ts
│   │   │   │   ├── products.ts
│   │   │   │   └── ... (module routes)
│   │   │   ├── middleware/        # Express middleware
│   │   │   │   ├── auth.ts        # JWT authentication
│   │   │   │   ├── errorHandler.ts
│   │   │   │   └── validation.ts
│   │   │   ├── utils/             # Utilities
│   │   │   │   ├── database.ts    # DB connection
│   │   │   │   ├── redis.ts       # Redis client
│   │   │   │   └── ai.ts          # AI service helpers
│   │   │   └── index.ts           # App entry point
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── ml/                         # Python ML (Future)
│
├── docker/                         # Docker Configuration
│   ├── Dockerfile.frontend
│   ├── Dockerfile.frontend.prod
│   ├── Dockerfile.backend
│   ├── Dockerfile.backend.prod
│   └── nginx/
│       └── nginx.conf
│
├── scripts/                        # Deployment Scripts
│   ├── deploy-dev.sh
│   ├── deploy-prod.sh
│   ├── backup-db.sh
│   └── setup-ssl.sh
│
├── docker-compose.yml              # Development
├── docker-compose.dev.yml          # VPS Development
├── docker-compose.prod.yml         # Production
│
├── .env.example                    # Environment template
├── .env.dev                        # Development environment
├── .env.prod                       # Production environment
│
└── docs/                           # Documentation
    ├── architecture/
    ├── api/
    └── onboarding/
```

---

## 4. Module Architecture

### Module Development Pattern

Each module follows a consistent pattern:

1. **Backend Model** (Mongoose Schema)
2. **Backend Routes** (Express CRUD API)
3. **Frontend Types** (TypeScript Interfaces)
4. **Frontend Service** (API Client)
5. **Frontend Page** (Module Implementation)
6. **Route Registration** (Next.js App Router)

### Example: Product Module

**Backend Model** (`src/backend/src/models/Product.ts`):
```typescript
import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Company' },
  name: { type: String, required: true },
  description: String,
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductCategory' },
  price: Number,
  status: { type: String, enum: ['active', 'inactive', 'draft'], default: 'draft' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Product = mongoose.model('Product', ProductSchema);
```

**Backend Routes** (`src/backend/src/routes/products.ts`):
```typescript
import express from 'express';
import { Product } from '../models/Product';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  const products = await Product.find({ companyId: req.user.companyId });
  res.json(products);
});

router.post('/', authenticate, async (req, res) => {
  const product = new Product({
    ...req.body,
    companyId: req.user.companyId
  });
  await product.save();
  res.status(201).json(product);
});

export default router;
```

**Frontend Page** (`src/frontend/src/modules/foundation/products/page.tsx`):
```typescript
'use client';

import { ModulePage } from '@/components/shared';
import type { Product } from '@/types/entities';

const columns = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'price', header: 'Price', sortable: true },
  { key: 'status', header: 'Status', filterable: true },
];

const fields = [
  { key: 'name', label: 'Name', type: 'text', required: true },
  { key: 'description', label: 'Description', type: 'textarea', aiGenerate: true },
  { key: 'price', label: 'Price', type: 'number' },
  { key: 'status', label: 'Status', type: 'select', options: [...] },
];

export default function ProductsPage() {
  return (
    <ModulePage
      moduleId="products"
      columns={columns}
      fields={fields}
      // ... handlers
    />
  );
}
```

---

## 5. Development Setup

### Prerequisites

- Node.js 20+ 
- npm 10+
- Git
- Docker (optional)

### Local Development

1. **Clone Repository**:
```bash
git clone https://github.com/ukvalley/AI-CMO.git
cd AI-CMO
```

2. **Install Dependencies**:
```bash
# Root dependencies
npm install

# Frontend dependencies
cd src/frontend && npm install && cd ../..

# Backend dependencies  
cd src/backend && npm install && cd ../..
```

3. **Environment Setup**:
```bash
cp .env.example .env.dev
# Edit .env.dev with your values
```

4. **Start Development**:
```bash
# Using Docker Compose (recommended)
docker-compose -f docker-compose.dev.yml up -d

# Or manually
# Terminal 1: MongoDB
docker run -d -p 27017:27017 --name mongodb mongo:7.0

# Terminal 2: Redis
docker run -d -p 6379:6379 --name redis redis:7-alpine

# Terminal 3: Backend
cd src/backend && npm run dev

# Terminal 4: Frontend
cd src/frontend && npm run dev
```

5. **Access Application**:
- Frontend: http://localhost:3100
- Backend API: http://localhost:3101
- MongoDB: localhost:27017
- Redis: localhost:6379

### Environment Variables

**Development** (`.env.dev`):
```env
# Database
DB_USER=ai_cmo_dev
DB_PASSWORD=dev_secure_password
DB_NAME=ai_cmo_dev
MONGODB_URI=mongodb://ai_cmo_dev:dev_secure_password@mongodb:27017/ai_cmo_dev?authSource=admin
REDIS_URL=redis://redis:6379

# Auth
JWT_SECRET=dev-jwt-secret-change-in-production-min-32-chars
JWT_EXPIRES_IN=7d

# URLs
FRONTEND_URL=http://localhost:3100
BACKEND_URL=http://localhost:3101
PORT=3101

# AI APIs (optional for dev)
CLAUDE_API_KEY=
OPENAI_API_KEY=

# Email (optional)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=

# File Upload
MAX_FILE_SIZE=20971520
UPLOAD_DIR=./uploads

# Logging
LOG_LEVEL=debug
```

---

## 6. Deployment Guide

### VPS Requirements

- **OS**: Ubuntu 22.04 LTS
- **RAM**: 4GB minimum (8GB recommended)
- **CPU**: 2+ cores
- **Storage**: 50GB+ SSD
- **Domain**: Pointed to VPS IP

### Production Deployment

1. **Server Setup**:
```bash
# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt update
sudo apt install docker-compose-plugin

# Re-login for docker group to take effect
```

2. **Clone Repository**:
```bash
sudo mkdir -p /opt
cd /opt
sudo git clone https://github.com/ukvalley/AI-CMO.git
cd AI-CMO
```

3. **Setup Environment**:
```bash
# Create production environment
sudo cp .env.example .env.prod
sudo nano .env.prod  # Edit with production values
```

4. **Configure SSL (Optional)**:
```bash
# Setup Let's Encrypt SSL
sudo ./scripts/setup-ssl.sh your-domain.com
```

5. **Deploy**:
```bash
# Run production deployment
sudo ./scripts/deploy-prod.sh
```

### Deployment Scripts

**Development Mode** (`scripts/deploy-dev.sh`):
- Hot reload enabled
- Debug logging
- Exposed database ports
- Port 3100 (frontend), 3101 (backend)

**Production Mode** (`scripts/deploy-prod.sh`):
- Optimized builds
- Nginx reverse proxy
- SSL termination
- Health checks
- Auto-restart on failure

### Production URLs

After deployment:
- **Frontend**: https://your-domain.com
- **Backend API**: https://api.your-domain.com (or /api path)
- **Health Check**: https://your-domain.com/health

### Database Backup

```bash
# Run backup script
./scripts/backup-db.sh

# Backup location: backups/mongo/
# Auto-cleanup: 7 days retention (configurable)
```

---

## 7. API Documentation

### Authentication

All API endpoints (except `/api/auth/login` and `/api/auth/register`) require JWT authentication.

**Headers**:
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

### Endpoints

#### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/switch-company` | Switch active company |

#### Companies
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/companies` | List user's companies |
| POST | `/api/companies` | Create company |
| GET | `/api/companies/:id` | Get company details |
| PUT | `/api/companies/:id` | Update company |
| DELETE | `/api/companies/:id` | Delete company |

#### Module Data (Generic Pattern)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products |
| POST | `/api/products` | Create product |
| GET | `/api/products/:id` | Get product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |

*Similar patterns apply to all modules: founders, employees, icps, personas, etc.*

#### AI Generation
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/generate` | Generate content with AI |
| POST | `/api/chat` | Send chat message |
| GET | `/api/chat/sessions` | Get chat sessions |

### Response Format

**Success**:
```json
{
  "success": true,
  "data": { ... }
}
```

**Error**:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data"
  }
}
```

---

## 8. Database Schema

### Core Collections

**Users**:
```typescript
{
  _id: ObjectId,
  email: string,
  password: string, // hashed
  firstName: string,
  lastName: string,
  role: 'admin' | 'user',
  companies: ObjectId[], // Company references
  activeCompanyId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

**Companies**:
```typescript
{
  _id: ObjectId,
  name: string,
  slug: string,
  description: string,
  industry: string,
  size: string,
  website: string,
  ownerId: ObjectId,
  members: [{ userId: ObjectId, role: string }],
  settings: object,
  createdAt: Date,
  updatedAt: Date
}
```

**Products**:
```typescript
{
  _id: ObjectId,
  companyId: ObjectId,
  name: string,
  description: string,
  categoryId: ObjectId,
  price: number,
  cost: number,
  sku: string,
  inventory: number,
  images: string[],
  status: 'active' | 'inactive' | 'draft',
  attributes: object,
  createdAt: Date,
  updatedAt: Date
}
```

*All module schemas follow similar patterns with companyId for multi-tenancy.*

---

## 9. Design System

### Colors (Dark Theme Only)

| Purpose | Tailwind Class | Hex Code |
|---------|---------------|----------|
| Background | `bg-slate-950` | `#020617` |
| Card Surface | `bg-slate-900` | `#0f172a` |
| Card Hover | `bg-slate-800/50` | `#1e293b80` |
| Border | `border-slate-700` | `#334155` |
| Text Primary | `text-slate-200` | `#e2e8f0` |
| Text Secondary | `text-slate-400` | `#94a3b8` |
| Accent | `bg-primary-500` | `#7C6BF0` |
| Success | `text-green-400` | `#4ade80` |
| Warning | `text-yellow-400` | `#facc15` |
| Error | `text-red-400` | `#f87171` |

### Component Patterns

**Card**:
```tsx
<div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
  {/* Content */}
</div>
```

**Form Input**:
```tsx
<Input className="bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500" />
```

**Button**:
```tsx
<Button variant="default" className="bg-primary-500 hover:bg-primary-600">
  Action
</Button>
```

### Typography

| Element | Class | Size |
|---------|-------|------|
| Page Title | `text-3xl font-bold text-white` | 30px |
| Section Title | `text-xl font-semibold text-slate-200` | 20px |
| Body | `text-sm text-slate-400` | 14px |
| Label | `text-sm font-medium text-slate-300` | 14px |

---

## 10. Team & Workflow

### Git Workflow

1. **Branch Strategy**:
   - `main`: Production-ready code
   - `dev`: Integration/testing branch
   - `feature/*`: Feature branches
   - `hotfix/*`: Critical production fixes

2. **Development Process**:
```bash
# 1. Start from dev
git checkout dev
git pull origin dev

# 2. Create feature branch
git checkout -b feature/module-name

# 3. Make changes and commit
git add .
git commit -m "feat: implement module-name"

# 4. Push and create PR
git push origin feature/module-name

# 5. Create PR to dev branch
# 6. After review, merge to dev
# 7. Delete feature branch
```

3. **Commit Message Format**:
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation
   - `test:` Tests
   - `refactor:` Code refactoring
   - `chore:` Maintenance

### Code Review Requirements

- 1 approval required
- CI checks must pass
- No merge conflicts
- Branch up to date with target

### File Ownership

| Directory | Owner |
|-----------|-------|
| `/src/backend` | @backend-lead |
| `/src/frontend` | @frontend-lead |
| `/docker`, `/scripts`, `/infra` | @devops-lead |
| `/docs` | All contributors |

---

## Additional Resources

- [CLAUDE.md](./CLAUDE.md) - AI assistant guide
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guidelines
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Architecture overview
- [docs/architecture/ARCHITECTURE_OVERVIEW.md](./docs/architecture/ARCHITECTURE_OVERVIEW.md) - System design
- [docs/onboarding/DEVELOPER_SETUP.md](./docs/onboarding/DEVELOPER_SETUP.md) - Setup guide

---

**Last Updated**: 2026-05-08
**Version**: 1.0
**Maintainers**: AI CMO Development Team
