# Mengo - AI CMO Platform

## 1. Project Identity

**Name**: Mengo  
**Purpose**: Modular AI-powered Chief Marketing Officer platform for businesses. It centralises brand strategy, content planning, sales collateral, marketing campaigns, and operations into a single dashboard with AI-assisted generation.

**Repository**: `https://github.com/ukvalley/AI-CMO`

**Version**: 1.0  
**Last Updated**: 2026-05-13  
**Maintainers**: All developers + AI assistants

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 + React 18 + TypeScript + Tailwind CSS |
| **State Management** | Zustand (persist + subscribeWithSelector middleware) |
| **Backend** | Node.js + Express + Mongoose |
| **Database** | MongoDB 7.0 (document store) |
| **Cache** | Redis 7 (sessions + response caching) |
| **AI Engine** | Claude API (Anthropic) + Ollama Cloud GLM 5.1 for local/edge generation |
| **Auth** | JWT tokens + bcrypt |

---

## 3. Architecture Overview

```
+-----------------+     +-----------------+     +-----------------+
|   Next.js App   |---->|  Express API    |---->|    MongoDB      |
|  (localhost:3000)|     | (localhost:3101)|     |   (port 27017)  |
+-----------------+     +-----------------+     +-----------------+
         |                       |
    localStorage           Redis Cache
    (fallback/demo)        (port 6379)
```

---

## 4. Module Structure (60+ Modules)

Organised into **8 groups**:

| Group | Modules | Status |
|-------|---------|--------|
| **Foundation** | Dashboard, Business Profile, Founders, Employees, ICPs & Personas, Products, Competitors, Settings | Active |
| **Brand** | Brand, Brand Strategy, Brand Manual, Visual Identity, Brand Assets, Stationery, HR Assets | Active |
| **Content** | Website Planner, Blogs, **Blog Content OS**, Newsletters, **Newsletter Content OS**, FAQ Bank, Content Library, Stories & Campaigns, Testimonials | Active |
| **Sales** | Landing Pages, Sales Scripts, Sales Collateral, Video Content, Banners, Books | Active |
| **Marketing** | SEO, Ads, PR, Email Templates, Courses, Events | Active |
| **Programs** | Loyalty Programme, Membership Plans, Referral Programme, SOPs | Active |
| **Ops** | Legal Documents, Background Tasks | Active |
| **System** | AI Chat | Active |

**Content OS Modules** (Advanced AI-powered planning systems):
- **Blog Content OS**: Strategy, content types, calendar, AI title generation, AI content writing, assets, review, export
- **Newsletter Content OS**: Strategy, content types, calendar, AI title/subject line generation, AI newsletter writing, assets, review, export

---

## 5. Data Architecture

### Frontend (Zustand Store)

- **Key pattern**: `useDataStore` provides generic CRUD operations
  - `getItems(moduleKey)` - Get all items for current company
  - `setItems(moduleKey, items)` - Replace all items
  - `addItem(moduleKey, data)` - Add single item (auto-generates id, timestamps)
  - `updateItem(moduleKey, id, updates)` - Update single item
  - `deleteItem(moduleKey, id)` - Delete single item
- **Company-scoped**: All data is keyed by `activeCompanyId`
- **Auto-save**: 2-second debounce -> localStorage + backend sync
- **API merging**: Remote data merged by ID to prevent overwriting local changes on navigation

### Backend (MongoDB)

**Unified Model Pattern** (new for Content OS modules):
```typescript
// One document per company with Schema.Types.Mixed arrays
interface NewsletterContentOS {
  companyId: string;  // unique index
  strategies: any[];
  calendars: any[];
  titles: any[];
  posts: any[];
  chunks: any[];
  exports: any[];
}
```

**Traditional Pattern**: Individual collections per entity (e.g., `products`, `founders`, `employees`)

### Data Flow
```
User Action -> Zustand Store -> localStorage (immediate)
                      -> Debounced API Save (2s delay)
                      -> MongoDB (persistent)
```

---

## 6. Design System (Dark Theme Only)

### Colours
| Token | Value |
|-------|-------|
| Background | `bg-slate-950` |
| Cards | `bg-slate-800/50` + `backdrop-blur-sm` |
| Borders | `border-slate-700` |
| Text Primary | `text-slate-200` |
| Text Secondary | `text-slate-400` |
| Accent | `primary-500` (purple `#7C6BF0`) |
| Error | `red-400` |

### Card Pattern
```tsx
<div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
```

### Form Input Pattern
```tsx
<input className="bg-slate-900 border border-slate-700 text-slate-200" />
```

### Button Patterns
- Primary: `bg-primary-600 hover:bg-primary-700`
- Secondary: `bg-slate-700 hover:bg-slate-600`
- Ghost: transparent

**Important**: No light theme colours allowed (no `white`, `neutral-900`, `gray-100`, etc.)

---

## 7. Key Development Patterns

### Module Registration

Every module is registered in `/src/frontend/src/lib/modules.ts`:
```typescript
{
  id: 'newsletter-content-os',
  name: 'Newsletter Content OS',
  description: 'AI-powered newsletter strategy, planning, and content generation',
  group: 'content',
  icon: 'Mail',
  path: '/newsletter-content-os',
  status: 'active',
  permissions: ['admin', 'editor'],
  hasAI: true,
  hasBulkGeneration: true,
  badge: 'AI',
}
```

### Page Structure
```
src/app/[module]/page.tsx                    -> Route wrapper (DashboardLayout)
src/modules/[group]/[module]/page.tsx        -> Actual implementation
```

### API Services Pattern
Located in `/src/frontend/src/services/api.ts`:
```typescript
const entityApi = {
  getAll: (companyId) => fetch(`${API_URL}/newsletter-content-os/strategies?companyId=${companyId}`),
  getById: (id) => fetch(`${API_URL}/newsletter-content-os/strategies/${id}`),
  create: (data) => fetch(`${API_URL}/newsletter-content-os/strategies`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetch(`${API_URL}/newsletter-content-os/strategies/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetch(`${API_URL}/newsletter-content-os/strategies/${id}`, { method: 'DELETE' }),
};
```

### Type Definition Pattern
Located in `/src/frontend/src/types/entities.ts`:
```typescript
export interface NewsletterStrategy extends BaseEntity {
  name: string;
  objective: NewsletterGoal;
  audience: string;
  industry: string;
  funnelStage: FunnelStage;
  communicationTone: string;
  contentDepth: ContentDepth;
  ctaGoal: string;
  linkedData: {
    brandId?: string;
    businessProfileId?: string;
    icpIds?: string[];
    personaIds?: string[];
    productIds?: string[];
    competitorIds?: string[];
  };
}
```

---

## 8. Content OS Modules (Advanced Feature)

Both **Blog Content OS** and **Newsletter Content OS** share this workflow:

### 8.1 Strategy Tab
- Define goals/objectives, audience, industry, tone
- Set funnel stage and content depth
- Link modules: ICPs, Personas, Products, Competitors
- View brand voice and business context

### 8.2 Content Types Tab
- Enable/disable content types
- Set percentage allocation (must sum to 100%)
- Visual allocation bar
- Configure CTA strategy and conversion goals

### 8.3 Calendar Tab
- Set publishing frequency (daily, weekly, bi-weekly, monthly, quarterly)
- Choose publishing days
- View content pipeline timeline
- Track status: empty, planned, title-generated, assigned, in-progress, ready

### 8.4 AI Title Generator (Titles Tab)
- **Blog**: Generate SEO-optimised, viral, authority, technical, emotional, founder, LinkedIn, thought-leadership titles
- **Newsletter**: Generate educational, conversational, founder-style, authority, emotional, insight, minimal subject lines
- Engagement/SEO scoring
- Select/reject workflow
- Preview text generation (newsletter)

### 8.5 AI Content Writer (Content Tab)
- Create posts from selected titles
- Generate content sections: headings, paragraphs, lists, quotes, CTAs
- Word count and readability metrics
- Version tracking

### 8.6 Assets Tab
- AI-suggested visual assets:
  - Hero/Featured Image (1200x630px)
  - Social Cards (LinkedIn, Twitter)
  - Infographics
  - CTA Banners

### 8.7 Review & Approval
- Workflow: Draft -> Review -> Approved -> Published
- Approve, request revisions, re-submit
- Content preview

### 8.8 Export Tab
- Export formats: Markdown, HTML, Word (.docx), WordPress
- Bulk export capability
- File download with proper naming

---

## 9. Project File Structure

```
/Users/umeshkhivasara/AI CMO/
|
|-- CLAUDE.md                                      # Developer guide for AI assistants
|-- docker-compose.yml                             # Full stack orchestration
|-- docker/
|   |-- Dockerfile.backend
|   |-- Dockerfile.frontend
|   |-- Dockerfile.ml
|   |-- mongo-init.js
|
|-- src/
|   |-- frontend/
|   |   |-- src/
|   |   |   |-- app/
|   |   |   |   |-- dashboard/page.tsx
|   |   |   |   |-- newsletter-content-os/page.tsx   # Route wrapper
|   |   |   |   |-- blog-content-os/page.tsx         # Route wrapper
|   |   |   |   |-- [60+ other module routes]
|   |   |   |
|   |   |   |-- components/
|   |   |   |   |-- layout/
|   |   |   |   |   |-- DashboardLayout.tsx
|   |   |   |   |   |-- Sidebar.tsx
|   |   |   |   |   |-- Header.tsx
|   |   |   |   |-- shared/
|   |   |   |   |   |-- ModulePage.tsx
|   |   |   |   |   |-- UniversalTable.tsx
|   |   |   |   |   |-- UniversalForm.tsx
|   |   |   |   |-- ai/
|   |   |   |   |   |-- AIChatPanel.tsx
|   |   |   |
|   |   |   |-- modules/
|   |   |   |   |-- content/
|   |   |   |   |   |-- blog-content-os/page.tsx      # Blog Content OS (2600+ lines)
|   |   |   |   |   |-- newsletter-content-os/page.tsx # Newsletter Content OS (2500+ lines)
|   |   |   |   |-- foundation/
|   |   |   |   |   |-- business-profile/page.tsx
|   |   |   |   |   |-- founders/page.tsx
|   |   |   |   |   |-- employees/page.tsx
|   |   |   |   |   |-- [other foundation modules]
|   |   |   |   |-- brand/
|   |   |   |   |-- sales/
|   |   |   |   |-- marketing/
|   |   |   |   |-- programs/
|   |   |   |   |-- ops/
|   |   |   |
|   |   |   |-- stores/
|   |   |   |   |-- dataStore.ts                     # Main CRUD + auto-save
|   |   |   |   |-- authStore.ts
|   |   |   |   |-- companyStore.ts
|   |   |   |   |-- chatStore.ts
|   |   |   |   |-- taskStore.ts
|   |   |   |
|   |   |   |-- services/
|   |   |   |   |-- api.ts                           # All API clients
|   |   |   |
|   |   |   |-- types/
|   |   |   |   |-- entities.ts                      # All TypeScript interfaces
|   |   |   |   |-- index.ts
|   |   |   |
|   |   |   |-- lib/
|   |   |   |   |-- modules.ts                        # Module registry
|   |   |   |
|   |   |   |-- utils/
|   |   |   |   |-- cn.ts                             # Tailwind merge
|   |   |   |   |-- spelling.ts                       # UK English helpers
|   |   |   |
|   |   |   |-- styles/
|   |   |       |-- globals.css
|   |   |       |-- design-tokens.ts
|   |   |
|   |   |-- package.json
|   |   |-- next.config.js
|   |   |-- tailwind.config.ts
|   |   |-- tsconfig.json
|
|   |-- backend/
|   |   |-- src/
|   |   |   |-- models/
|   |   |   |   |-- NewsletterContentOS.ts           # Unified newsletter model
|   |   |   |   |-- index.ts                          # Model exports
|   |   |   |   |-- [other models: User, Company, Product, etc.]
|   |   |   |
|   |   |   |-- routes/
|   |   |   |   |-- newsletterContentOs.ts           # Newsletter API routes
|   |   |   |   |-- [other route files]
|   |   |   |
|   |   |   |-- middleware/
|   |   |   |   |-- auth.ts
|   |   |   |   |-- errorHandler.ts
|   |   |   |
|   |   |   |-- utils/
|   |   |   |   |-- database.ts
|   |   |   |   |-- redis.ts
|   |   |   |
|   |   |   |-- index.ts                             # Express server entry
|   |   |
|   |   |-- package.json
|   |   |-- .env.example
|
|   |-- ml/                                          # Python ML service (future)
```

---

## 10. Running the Project

### Prerequisites
- Docker + Docker Compose
- Node.js 20+
- npm or yarn

### Full Stack (Docker)
```bash
cd /Users/umeshkhivasara/AI CMO
docker-compose up -d
```
This starts: MongoDB, Redis, Backend, Frontend

### Individual Services

**MongoDB**:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:7.0
```

**Redis**:
```bash
docker run -d -p 6379:6379 --name redis redis:7-alpine
```

**Backend**:
```bash
cd src/backend
npm install
npm run dev   # http://localhost:3101
```

**Frontend**:
```bash
cd src/frontend
npm install
npm run dev   # http://localhost:3000
```

### Environment Variables
Copy `src/backend/.env.example` to `.env` and fill in:
```bash
MONGODB_URI=mongodb://mengo:password@localhost:27017/mengo?authSource=admin
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-key
CLAUDE_API_KEY=sk-ant-api03-...
PORT=3101
```

---

## 11. API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | User registration |
| POST | /api/auth/login | User login |
| GET | /api/auth/me | Get current user |
| POST | /api/auth/switch-company | Switch active company |

### Companies
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/companies | List companies |
| POST | /api/companies | Create company |
| PUT | /api/companies/:id | Update company |
| DELETE | /api/companies/:id | Delete company |

### Newsletter Content OS
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/newsletter-content-os/strategies?companyId=xxx | Get strategies |
| POST | /api/newsletter-content-os/strategies | Create strategy |
| PUT | /api/newsletter-content-os/strategies/:id | Update strategy |
| DELETE | /api/newsletter-content-os/strategies/:id | Delete strategy |
| GET | /api/newsletter-content-os/calendars?companyId=xxx | Get calendars |
| POST | /api/newsletter-content-os/calendars | Create calendar |
| PUT | /api/newsletter-content-os/calendars/:id | Update calendar |
| DELETE | /api/newsletter-content-os/calendars/:id | Delete calendar |
| GET | /api/newsletter-content-os/titles?companyId=xxx | Get titles |
| POST | /api/newsletter-content-os/titles | Create title |
| PUT | /api/newsletter-content-os/titles/:id | Update title |
| DELETE | /api/newsletter-content-os/titles/:id | Delete title |
| GET | /api/newsletter-content-os/posts?companyId=xxx | Get posts |
| POST | /api/newsletter-content-os/posts | Create post |
| PUT | /api/newsletter-content-os/posts/:id | Update post |
| DELETE | /api/newsletter-content-os/posts/:id | Delete post |
| GET | /api/newsletter-content-os/exports?companyId=xxx | Get exports |
| POST | /api/newsletter-content-os/exports | Create export |

### Blog Content OS
Same pattern as Newsletter Content OS under `/api/blog-content-os/[entity]`.

### Other Modules
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST/PUT/DELETE | /api/business-profiles | Business Profile CRUD |
| GET/POST/PUT/DELETE | /api/products | Product CRUD |
| GET/POST/PUT/DELETE | /api/founders | Founder CRUD |
| GET/POST/PUT/DELETE | /api/employees | Employee CRUD |
| GET/POST/PUT/DELETE | /api/icps | ICP CRUD |
| GET/POST/PUT/DELETE | /api/personas | Persona CRUD |
| GET/POST/PUT/DELETE | /api/competitors | Competitor CRUD |
| GET/POST/PUT/DELETE | /api/module-data | Generic module data store |
| GET/POST | /api/chat | AI chat sessions |
| GET/POST | /api/tasks | Background tasks |
| POST | /api/ai | AI generation (Claude API) |

---

## 12. Database Collections

| Collection | Purpose |
|------------|---------|
| `companies` | Company documents |
| `users` | User accounts with password hashes |
| `businessprofiles` | One per company |
| `products` + `productcategories` | Product catalog |
| `founders` | Founder profiles with assets |
| `employees` | Team members |
| `icps` + `personas` | Customer profiles |
| `competitors` | Competitive analysis |
| `chatsessions` | AI chat history |
| `backgroundtasks` | Bulk generation jobs |
| `blogcontentoses` | Unified blog data per company |
| `newslettercontentoses` | Unified newsletter data per company |

---

## 13. Data Store Module Keys

```typescript
// Foundation
businessProfiles, founders, employees, products, productCategories
icps, personas, competitors

// Brand
brand, brandAssets, stationery

// Content
websitePlanners, blogSystem, blogs, newsletters, faqs
contentItems, stories, testimonials

// Blog Content OS
blogContentSystem, blogStrategies, blogContentTypes
blogCalendars, blogTitles, blogPosts, blogContentChunks, blogExports

// Newsletter Content OS
newsletterContentSystem, newsletterStrategies, newsletterContentTypes
newsletterCalendars, newsletterTitles, newsletterPosts
newsletterContentChunks, newsletterExports

// Sales
landingPageSystem, landingPages, salesScripts, salesCollateral
videoContent, banners, books

// Marketing
seoSystem, seoPages, ads, prItems, emailTemplates, courses, events

// Programs
loyaltyProgrammes, membershipPlans, referralProgrammes, sops

// Ops
hrSystem, jobPostings, legalDocuments
```

---

## 14. Recent Commit History

| Commit | Description |
|--------|-------------|
| `d25382e` | feat: implement Newsletter Content OS module |
| `2441fb0` | feat: implement Blog Content Operating System |
| `ab8852b` | feat: Add Data Sources tab to Website Planner |
| `2946db1` | feat: Complete Website Planner Module |
| `fe71078` | database connectivity issue solved |
| `f80b776` | login issue solved |

---

## 15. Known Issues & Fixes

### Issue: Data loss on module navigation
**Cause**: `activeCompanyId` not persisted in Zustand store, API responses overwriting local data with empty arrays.

**Fix**: 
- Persist `activeCompanyId` in Zustand `partialize`
- Use merge-by-id strategy when loading API data
- Wire API calls into all CRUD mutations

### Issue: "items is not iterable" runtime error
**Cause**: `getItems()` returning `undefined` instead of empty array.

**Fix**: Added `|| []` fallback in `addItem`, `updateItem`, `deleteItem` methods.

### Issue: Duplicate `NewsletterFrequency` type
**Cause**: Two declarations in `entities.ts`.

**Fix**: Removed duplicate, kept the Content OS version with `'bi-weekly'` spelling.

---

## 16. Development Guidelines

### Do's
- Use shared components: `ModulePage`, `UniversalTable`, `UniversalForm`
- Follow dark theme colour system
- Define types in `/src/types/entities.ts`
- Add module to `/src/lib/modules.ts`
- Wrap routes with `DashboardLayout`
- Use `'use client'` directive on pages with hooks
- Use UK English spelling (colour, organisation, etc.)
- Write concise code, no unnecessary comments

### Don'ts
- Create custom table/form components (use Universal*)
- Use light theme colours
- Use `neutral-*` or `gray-*` Tailwind classes
- Forget to add `'use client'`
- Add client logic in server components
- Commit `.env` files or credentials

---

## 17. Git Workflow

```bash
# 1. Pull latest
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/module-name

# 3. Make changes following patterns above

# 4. Commit
git add .
git commit -m "feat: implement [module-name] with CRUD operations"

# 5. Push
git push origin feature/module-name

# 6. Create PR on GitHub
```

---

## 18. Next Recommended Work

1. **Testing**: End-to-end testing of both Content OS modules
2. **Sales Enablement**: Landing Pages, Sales Scripts, Sales Collateral modules
3. **Marketing Campaigns**: SEO, Ads, PR modules
4. **AI Integration**: Connect title/content generation to actual Claude/Ollama APIs
5. **Bulk Generation**: Implement background task system for bulk operations
6. **Export System**: Add PDF, email template exports
7. **User Permissions**: Implement role-based access control
8. **Analytics Dashboard**: Module usage and content performance metrics

---

## 19. Contact & Support

- **Issues**: Report at https://github.com/ukvalley/AI-CMO/issues
- **Documentation**: See `CLAUDE.md` for AI assistant instructions
- **Design System**: Follow `/src/styles/design-tokens.ts`

---

*Document generated on 2026-05-13. For latest changes, check `git log`.*
