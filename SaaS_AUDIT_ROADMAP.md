# Mengo - SaaS Audit & Strategic Roadmap

**Audit Date:** 2026-05-04  
**Auditor:** Claude Code (Technical Architecture Review)  
**Project:** Mengo - AI-Powered Marketing Platform

---

## Executive Summary

### Current State: **Not SaaS-Ready (Frontend-Heavy)**

After thorough analysis, **Mengo is currently 70% frontend and 30% backend**. While it has:
- ✅ Multi-tenancy architecture (Company-based isolation)
- ✅ JWT authentication with role-based access
- ✅ MongoDB with proper data isolation
- ⚠️ **CRITICAL GAP: No Website entity for multi-site management**
- ❌ **MISSING: Subscription/Billing system (SaaS revenue)**
- ❌ **MISSING: Comprehensive testing**

**Verdict:** This is a **Single-Company Marketing Tool**, not a true SaaS platform yet.

---

## Detailed SaaS Audit

### 1. Multi-Tenancy Architecture ✅ **PASS**

| Component | Status | Notes |
|-----------|--------|-------|
| Company Model | ✅ | Properly isolated by `companyId` |
| Data Isolation | ✅ | All routes verify `req.user.companyIds.includes(companyId)` |
| User-Company Association | ✅ | Many-to-many via `user.companyIds` array |
| Admin Override | ✅ | Global admin can access all companies |
| Database Design | ✅ | MongoDB supports multi-tenancy well |

**Assessment:** Multi-tenancy is correctly implemented.

---

### 2. Website Multi-Support ⚠️ **CRITICAL GAP**

**Problem Identified:**
- Current model: One Company = One Website
- SaaS Requirement: One Company = Multiple Websites
- **Missing:** Website entity in data model

**Current Flow:**
```
User → Company → Data
```

**Required SaaS Flow:**
```
User → Company → Websites → Data
                           ↓
                    Pages/Content
```

**Impact:**
- A marketing agency cannot manage multiple client websites
- A business cannot manage separate websites for different regions/brands
- The "Website Project" module (28 modules) is company-scoped, not website-scoped

**Evidence:**
- No `Website` model in `/src/backend/src/models/`
- Website content stored at company level: `data[activeCompanyId]`
- No website switcher in UI (like company switcher)

---

### 3. Subscription & Billing ❌ **MISSING**

**Critical for SaaS:**

| Feature | Status | Priority |
|---------|--------|----------|
| Subscription Plans | ❌ Missing | CRITICAL |
| Usage Limits (credits, modules) | ❌ Missing | CRITICAL |
| Billing Integration (Stripe) | ❌ Missing | CRITICAL |
| Payment Processing | ❌ Missing | CRITICAL |
| Trial Management | ❌ Missing | HIGH |
| Plan Upgrade/Downgrade | ❌ Missing | HIGH |
| Invoice Generation | ❌ Missing | MEDIUM |
| Usage Analytics | ❌ Missing | MEDIUM |

**Current State:** Free-for-all with no limits

**Impact:** Cannot monetize; users can create unlimited companies and content without paying.

---

### 4. Backend Completeness ⚠️ **INCOMPLETE**

**Backend Coverage Analysis:**

```
Total Modules in Registry: 38
Dedicated Backend Models:  10 (26% coverage)
Generic Module API:        28 modules use generic store
```

**Dedicated Models (Complete):**
- ✅ User, Company
- ✅ BusinessProfile, Founder, Employee
- ✅ Product, ICP, Persona, Competitor

**Generic Store Only (Incomplete):**
- ⚠️ Blogs, Newsletters, Website Content, SEO
- ⚠️ Sales modules, Marketing modules
- ⚠️ Loyalty, Membership, Referral, SOPs
- ⚠️ Legal Documents

**Problem:** Generic store = no business logic, no validation, no relationships

---

### 5. Frontend vs Backend Split

```
┌─────────────────────────────────────────────────┐
│ Frontend (70% Complete)                           │
├─────────────────────────────────────────────────┤
│ ✅ All 38 modules have routes and pages         │
│ ✅ Dashboard with stats                          │
│ ✅ Shared components (Table, Form, AI Chat)      │
│ ✅ Company switcher                              │
│ ✅ Dark theme UI                                 │
│ ✅ AI Chat panel                                 │
└─────────────────────────────────────────────────┘
                         ↕️ Mismatch
┌─────────────────────────────────────────────────┐
│ Backend (30% Complete)                          │
├─────────────────────────────────────────────────┤
│ ✅ 10 dedicated MongoDB models                 │
│ ✅ 14 API routes                                 │
│ ✅ JWT auth with roles                           │
│ ✅ Generic module-data store (fallback)          │
│ ❌ No Website model                              │
│ ❌ No Subscription model                         │
│ ❌ No billing integration                        │
└─────────────────────────────────────────────────┘
```

**Assessment:** Frontend is polished but backend lacks depth.

---

### 6. Testing Coverage ❌ **ZERO**

```
Test Directories: /tests/unit, /tests/integration, /tests/e2e
Actual Test Files: 0
Coverage: 0%
```

**Critical for SaaS:**
- No unit tests for auth logic
- No API integration tests
- No E2E tests for critical flows (login, payment, data isolation)

---

### 7. Security Assessment ⚠️ **PARTIAL**

| Aspect | Status | Notes |
|--------|--------|-------|
| JWT Auth | ✅ | Properly implemented |
| Data Isolation | ✅ | Company checks on all routes |
| Input Validation | ✅ | express-validator used |
| Rate Limiting | ✅ | Auth rate limiter exists |
| HTTPS | ⚠️ | Dev only, needs production config |
| CORS | ⚠️ | Needs review for production |
| SQL Injection | ✅ | N/A (MongoDB) |
| XSS Protection | ⚠️ | Frontend needs sanitization |
| Secret Management | ⚠️ | JWT_SECRET in env (good) |

---

### 8. Scalability Concerns ⚠️ **MODERATE RISK**

**Current Issues:**
1. **No Pagination:** All data loads at once (will fail at scale)
2. **No Caching Strategy:** Redis connected but underutilized
3. **No CDN:** No asset delivery optimization
4. **Single Database:** No read replicas for scale
5. **Session Storage:** localStorage (not scalable for multi-device)

---

## Strategic Roadmap

### Phase 1: Foundation (Weeks 1-4) - **CRITICAL**
**Goal:** Make it a true SaaS platform

#### 1.1 Add Website Entity
```
Priority: CRITICAL
Why: Core SaaS requirement for multi-site
```

**Tasks:**
1. Create `Website` model
2. Update all routes to filter by `websiteId`
3. Add Website switcher in UI (like company switcher)
4. Migration: Convert existing company-scoped data to website-scoped
5. Update dataStore to support `data[websiteId]`

**Estimated Effort:** 3-4 days

#### 1.2 Implement Subscription System
```
Priority: CRITICAL
Why: Cannot monetize without this
```

**Tasks:**
1. Create `SubscriptionPlan` model (Free, Pro, Enterprise)
2. Create `UserSubscription` model
3. Define plan limits:
   - Number of companies
   - Number of websites per company
   - AI generation credits per month
   - Module access (some modules Pro-only)
4. Add subscription middleware to enforce limits
5. Create pricing page in frontend

**Estimated Effort:** 5-7 days

#### 1.3 Integrate Stripe Billing
```
Priority: CRITICAL
Why: Revenue collection
```

**Tasks:**
1. Set up Stripe account
2. Create Stripe products and prices
3. Implement Stripe Checkout
4. Handle webhooks (payment success, failure, cancellation)
5. Add billing portal for invoice history
6. Add "Upgrade" CTAs in UI when limits reached

**Estimated Effort:** 3-4 days

#### 1.4 Complete Backend for Core Modules
```
Priority: HIGH
Why: Generic store is not enough
```

**Core Modules Needing Dedicated Backend:**
1. Blog/Newsletter (content management)
2. Website Pages (hierarchical structure)
3. SEO (meta tags, sitemaps)
4. Landing Pages (conversion tracking)

**Estimated Effort:** 5-7 days

---

### Phase 2: Quality & Testing (Weeks 5-6) - **MANDATORY**
**Goal:** Ensure reliability before launch

#### 2.1 Testing Infrastructure
```
Priority: CRITICAL
Why: SaaS requires 99.9% uptime
```

**Test Coverage Requirements:**

| Layer | Coverage Target | Focus Areas |
|-------|-----------------|-------------|
| Unit Tests | 80%+ | Auth logic, business rules, validations |
| Integration Tests | 60%+ | API endpoints, database queries |
| E2E Tests | Critical paths only | Login, Signup, Payment, Data isolation |

**Critical Test Scenarios:**
1. ✅ User can login with valid credentials
2. ✅ User cannot access another company's data
3. ✅ User cannot exceed subscription limits
4. ✅ Payment succeeds and updates subscription
5. ✅ Payment failure shows error and retries
6. ✅ Website switcher changes active context
7. ✅ AI generation decrements credits

**Estimated Effort:** 7-10 days

#### 2.2 Performance Optimization
```
Priority: HIGH
Why: User experience
```

**Tasks:**
1. Add pagination to all list endpoints (limit/offset)
2. Implement Redis caching for frequently accessed data
3. Add database indexes for common queries
4. Optimize bundle size (code splitting)
5. Add loading states and skeletons

**Estimated Effort:** 3-4 days

---

### Phase 3: Core Modules Completion (Weeks 7-10)
**Goal:** Complete one module at a time with quality

#### Module Completion Priority Order:

**Tier 1: Foundation (Must Have)**
1. Business Profile (✅ Already done - use as reference)
2. Products (✅ Already done)
3. Founders (✅ Already done)
4. Employees (✅ Already done)
5. ICPs & Personas (✅ Already done)
6. Competitors (✅ Already done)

**Tier 2: Content (High Value)**
7. Blog System (🟡 Needs dedicated backend)
8. Website Content (🟡 Needs Website entity)
9. Newsletters (⚪ Placeholder)
10. Landing Pages (🟡 Generic only)

**Tier 3: Marketing (Growth)**
11. SEO (🟡 Needs dedicated backend)
12. Ads (⚪ Placeholder)
13. Email Templates (⚪ Placeholder)

**Tier 4: Programs (Engagement)**
14. Loyalty Programme (⚪ Placeholder)
15. Membership Plans (⚪ Placeholder)
16. Referral Programme (⚪ Placeholder)

**Tier 5: Operations (Support)**
17. Legal Documents (⚪ Placeholder)
18. Background Tasks (🟡 Partial)

**Per Module Checklist (Quality Standard):**
```
☐ Dedicated MongoDB model with validation
☐ Complete REST API (GET, POST, PUT, DELETE)
☐ Company + Website isolation
☐ Subscription limit enforcement
☐ Unit tests (80%+ coverage)
☐ Integration tests for API
☐ Frontend CRUD with forms
☐ AI generation integration (if applicable)
☐ Bulk operations (if applicable)
☐ Export/Import functionality
☐ Documentation
```

**Estimated Effort per Module:** 2-3 days (with quality)

---

### Phase 4: Advanced Features (Weeks 11-12)
**Goal:** Differentiate from competitors

#### 4.1 AI Enhancements
```
Priority: MEDIUM
Why: Core value proposition
```

**Features:**
- AI content generation with context awareness
- Competitor analysis AI
- SEO optimization suggestions
- A/B testing recommendations

#### 4.2 Analytics Dashboard
```
Priority: MEDIUM
Why: User retention
```

**Features:**
- Content performance metrics
- AI usage statistics
- Team productivity reports
- Export to PDF/Excel

#### 4.3 Integrations
```
Priority: MEDIUM
Why: Ecosystem
```

**Integrations:**
- Google Analytics
- Mailchimp/SendGrid
- Social media APIs
- Webhook support

---

## Recommendation: Start Over or Fix?

### Current Approach: **FIX**

**Why not start over:**
- Frontend is well-architected (70% complete)
- Auth system is solid
- Multi-tenancy works
- 6 advanced modules are complete

**What needs immediate fixing:**
1. Add Website entity (1 week)
2. Add Subscription system (1 week)
3. Add comprehensive testing (2 weeks)
4. Complete backend for core modules (3 weeks)

**Total to SaaS-Ready:** 7-8 weeks

---

## Immediate Next Steps (This Week)

### Day 1-2: Website Entity
1. Create `Website` model:
```typescript
interface Website {
  id: string;
  companyId: string;
  name: string;
  domain?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

2. Update `User` model to track `activeWebsiteId`
3. Create `/api/websites` routes
4. Add Website switcher to sidebar
5. Update dataStore to use `data[websiteId]`

### Day 3-4: Subscription Foundation
1. Create `SubscriptionPlan` model
2. Create `UserSubscription` model
3. Define plan limits in code
4. Add subscription middleware

### Day 5-7: Testing Login/Register/Company
1. Write unit tests for authStore
2. Write integration tests for `/api/auth`
3. Write E2E tests for login flow
4. Write E2E tests for company creation
5. Write E2E tests for company switching

---

## Success Metrics

| Metric | Current | Target | Timeline |
|--------|---------|--------|----------|
| Backend Coverage | 26% | 90% | Week 10 |
| Test Coverage | 0% | 80% unit, 60% integration | Week 6 |
| SaaS Features | 0% | 100% (billing, limits, multi-site) | Week 4 |
| Modules Complete | 18/38 | 38/38 | Week 10 |
| Bug Rate | Unknown | < 5 critical/month | Ongoing |

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Website entity breaks existing data | High | High | Migration script, backup |
| Subscription limits frustrate users | Medium | Medium | Generous free tier |
| Testing delays launch | Medium | Medium | Focus on critical paths first |
| Stripe integration complexity | Low | Medium | Use Stripe Checkout (simpler) |
| Frontend-backend mismatch | Medium | High | API contract documentation |

---

## Conclusion

### Is it going in the right direction?
**Yes, but with critical gaps.**

The project has:
- ✅ Good architecture (modular, scalable frontend)
- ✅ Proper multi-tenancy
- ✅ Solid foundation (MongoDB, Express, Next.js)

But it needs:
- ❌ Website entity (not optional for SaaS)
- ❌ Subscription system (revenue critical)
- ❌ Comprehensive testing (quality critical)

### Recommendation:
**Pause feature development. Fix SaaS fundamentals first.**

1. Week 1: Add Website entity
2. Week 2: Add Subscription + Stripe
3. Weeks 3-4: Testing infrastructure + critical tests
4. Week 5+: Complete modules one by one with quality

**Quality over quantity.** Complete 10 modules perfectly rather than 38 modules poorly.

---

*Audit conducted by Claude Code - 2026-05-04*
