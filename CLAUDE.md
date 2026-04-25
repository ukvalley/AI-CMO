# AI CMO - Project Guide for Developers & AI

> **READ THIS FIRST**: This file contains everything developers and AI assistants need to know about the project. AI assistants should study this file before making any changes.

---

## 1. PROJECT OVERVIEW

**AI CMO** is a modular AI-powered Chief Marketing Officer platform with 60+ modules organized into 8 groups.

- **Tech Stack**: Next.js 14 + TypeScript + Tailwind CSS + Zustand
- **Design**: Dark theme with purple accent (#7C6BF0)
- **Architecture**: Modular with shared components
- **Data**: Auto-save with 2-second delay via window.storage

---

## 2. FOLDER STRUCTURE

```
/Users/umeshkhivasara/AI CMO/
├── src/frontend/
│   ├── src/
│   │   ├── app/                    # Next.js routes (pages)
│   │   │   ├── layout.tsx          # Root layout with dark theme
│   │   │   ├── page.tsx            # Redirects to /dashboard
│   │   │   ├── dashboard/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── business-profile/   # Route wrapper
│   │   │   ├── founders/           # Route wrapper
│   │   │   └── employees/          # Route wrapper
│   │   │
│   │   ├── modules/                # ALL MODULES GO HERE
│   │   │   └── foundation/         # Group: Foundation modules
│   │   │       ├── business-profile/page.tsx
│   │   │       ├── founders/page.tsx
│   │   │       ├── employees/page.tsx
│   │   │       └── index.ts
│   │   │
│   │   ├── components/
│   │   │   ├── shared/             # SHARED COMPONENTS (CRITICAL)
│   │   │   │   ├── ModulePage.tsx      # Standard module layout
│   │   │   │   ├── UniversalTable.tsx  # Table with search/filter
│   │   │   │   ├── UniversalForm.tsx   # Form with AI buttons
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── ui/                 # UI Components
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   └── Modal.tsx
│   │   │   │
│   │   │   ├── layout/             # Layout Components
│   │   │   │   ├── DashboardLayout.tsx   # Sidebar + Header + AI Chat
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── Header.tsx
│   │   │   │
│   │   │   └── ai/                 # AI Components
│   │   │       └── AIChatPanel.tsx
│   │   │
│   │   ├── stores/                 # STATE MANAGEMENT
│   │   │   ├── dataStore.ts        # Main data CRUD + auto-save
│   │   │   ├── authStore.ts
│   │   │   ├── companyStore.ts
│   │   │   ├── chatStore.ts
│   │   │   └── taskStore.ts
│   │   │
│   │   ├── lib/
│   │   │   └── modules.ts          # MODULE REGISTRY
│   │   │
│   │   ├── types/
│   │   │   ├── entities.ts         # ALL TYPE INTERFACES
│   │   │   └── index.ts
│   │   │
│   │   ├── styles/
│   │   │   ├── globals.css
│   │   │   └── design-tokens.ts    # Colors, spacing, etc.
│   │   │
│   │   └── pages/                  # Page components
│   │       ├── Dashboard.tsx
│   │       ├── Login.tsx
│   │       └── Register.tsx
│   │
│   └── ... (config files)
└── CLAUDE.md                       # THIS FILE
```

---

## 3. DESIGN SYSTEM (MUST FOLLOW)

### Colors (Dark Theme Only)
```
Background:       bg-slate-950          (main background)
Cards:            bg-slate-800/50       (card surfaces)
Borders:          border-slate-700      (default)
Text Primary:     text-slate-200        (headings, labels)
Text Secondary:   text-slate-400        (descriptions, hints)
Accent:           primary-500           (purple #7C6BF0)
Error:            red-400               (error messages)
```

### Component Patterns
```tsx
// Cards always use this pattern:
<div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">

// Form inputs always use:
<Input className="bg-slate-800 border-slate-700 text-slate-200" />

// Buttons:
<Button variant="primary">    // Purple
<Button variant="secondary"> // Slate background
<Button variant="ghost">     // Transparent

// Text:
<h1 className="text-white">           // Headings
<p className="text-slate-400">        // Descriptions
<label className="text-slate-300">    // Labels
```

---

## 4. MODULE DEVELOPMENT PATTERN

### Step 1: Add Module to Registry
Edit `/src/lib/modules.ts`:
```typescript
{
  id: 'your-module',
  name: 'Your Modules',
  description: 'What this module does',
  group: 'foundation', // or 'brand', 'content', etc.
  icon: 'IconName',    // from lucide-react
  path: '/your-module',
  status: 'active',
  hasAI: true,         // if AI generation is available
}
```

### Step 2: Create Module Page
Create `/src/modules/[group]/[module]/page.tsx`:
```typescript
'use client';

import { ModulePage } from '@/components/shared';
import { FormField } from '@/components/shared/UniversalForm';
import { TableColumn } from '@/components/shared/UniversalTable';
import { useDataStore } from '@/stores';
import type { YourEntity } from '@/types/entities';

// Define table columns
const columns: TableColumn<YourEntity>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'email', header: 'Email' },
  {
    key: 'status',
    header: 'Status',
    filterable: true,
    filterOptions: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
    ],
  },
];

// Define form fields
const formFields: FormField[] = [
  { key: 'name', label: 'Name', type: 'text', required: true },
  { key: 'email', label: 'Email', type: 'email' },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
    ],
  },
  {
    key: 'description',
    label: 'Description',
    type: 'textarea',
    rows: 4,
    aiGenerate: true,  // Shows AI button
    colSpan: 2,
  },
  {
    key: 'socialProfiles',
    label: 'Social Profiles',
    type: 'social-grid',  // 20 social inputs grid
    colSpan: 2,
  },
];

export default function YourModulePage() {
  const { getItems, updateItem, deleteItem } = useDataStore();
  const items = getItems('yourModuleKey') as YourEntity[];

  return (
    <ModulePage
      moduleId="your-module"
      columns={columns}
      fields={formFields}
      data={items}
      onCreate={(data) => {
        const { addItem } = useDataStore.getState();
        addItem('yourModuleKey', data);
      }}
      onUpdate={(id, data) => {
        updateItem('yourModuleKey', id, data);
      }}
      onDelete={(id) => {
        deleteItem('yourModuleKey', id);
      }}
    />
  );
}
```

### Step 3: Create Route Wrapper
Create `/src/app/your-module/page.tsx`:
```typescript
'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import YourModulePage from '@/modules/[group]/your-module/page';

export default function YourModuleRoute() {
  return (
    <DashboardLayout>
      <YourModulePage />
    </DashboardLayout>
  );
}
```

### Step 4: Add Type Interface
Edit `/src/types/entities.ts`:
```typescript
export interface YourEntity {
  id: string;
  companyId: string;
  name: string;
  email?: string;
  status: 'active' | 'inactive';
  socialProfiles?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}
```

### Step 5: Add to Data Store
Edit `/src/stores/dataStore.ts`:
- Add `yourModuleKey: YourEntity[]` to ModuleData interface
- Add `yourModuleKey: []` to createEmptyModuleData()

---

## 5. SHARED COMPONENTS API

### ModulePage Props
```typescript
interface ModulePageProps<T> {
  moduleId: string;                    // Must match registry
  columns: TableColumn<T>[];         // Table columns
  fields: FormField[];                 // Form fields
  data: T[];                           // Items from store
  onCreate: (data) => void;            // Create handler
  onUpdate: (id, data) => void;       // Update handler
  onDelete: (id) => void;              // Delete handler
  detailView?: (item, onBack) => Node; // Optional detail view
  renderActions?: (item) => Node;      // Extra action buttons
}
```

### UniversalForm Field Types
```typescript
type FieldType =
  | 'text'
  | 'textarea'      // Multi-line text with optional AI button
  | 'number'
  | 'email'
  | 'tel'
  | 'url'
  | 'date'
  | 'select'        // Dropdown
  | 'multiselect'   // Tag-style selection
  | 'toggle'        // On/off switch
  | 'color'         // Color picker
  | 'social-grid';  // Grid of 20 social profile inputs
```

### FormField Options
```typescript
interface FormField {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
  options?: { value: string; label: string }[]; // For select/multiselect
  min?: number;
  max?: number;
  rows?: number;           // For textarea
  aiGenerate?: boolean;    // Show AI sparkle button
  colSpan?: 1 | 2;         // Full width (2) or half (1)
  dependsOn?: {            // Conditional display
    field: string;
    value: unknown;
  };
}
```

---

## 6. DATA STORE API

### CRUD Operations
```typescript
// Get all items for current company
const items = getItems('moduleKey');

// Set all items (replaces)
setItems('moduleKey', newItems);

// Add single item
const id = addItem('moduleKey', { name: 'New Item' });

// Update single item
updateItem('moduleKey', id, { name: 'Updated' });

// Delete single item
deleteItem('moduleKey', id);

// Import/Export
importData(companyId, jsonString);
const json = exportData(companyId);

// Stats
const stats = getStats();
```

### Module Data Keys
- `businessProfiles`, `founders`, `employees`
- `products`, `productCategories`, `icps`, `personas`, `competitors`
- `brand`, `brandAssets`, `stationery`
- `websitePages`, `blogs`, `newsletters`, `faqs`, `contentItems`, `stories`, `testimonials`
- `landingPages`, `salesScripts`, `salesCollateral`, `videoContent`, `banners`, `books`
- `seoPages`, `ads`, `prItems`, `emailTemplates`, `courses`, `events`
- `loyaltyProgrammes`, `membershipPlans`, `referralProgrammes`, `sops`
- `jobPostings`, `legalDocuments`

---

## 7. MODULE GROUPS (8 Total)

| Group | ID | Modules | Status |
|-------|-----|---------|--------|
| **Foundation** | `foundation` | Business Profile, Founders, Employees, Products, Product Categories, ICPs, Personas, Competitors | Active |
| **Brand** | `brand` | Brand, Brand Assets, Stationery | Active |
| **Content** | `content` | Website Pages, Blogs, Newsletters, FAQs, Content Library, Stories, Testimonials | Active |
| **Sales** | `sales` | Landing Pages, Sales Scripts, Sales Collateral, Video Content, Banners, Books | Active |
| **Marketing** | `marketing` | SEO Pages, Ads, PR Items, Email Templates, Courses, Events | Active |
| **Programs** | `programs` | Loyalty Programmes, Membership Plans, Referral Programmes, SOPs | Active |
| **Operations** | `operations` | Job Postings, Legal Documents | Active |
| **System** | `system` | Settings, AI Engine, Background Tasks | Active |

---

## 8. AI ENGINE INSTRUCTIONS

When working on this project, AI assistants must:

1. **READ THIS FILE FIRST** - Always study this guide before making changes
2. **USE SHARED COMPONENTS** - Never create new table/form components. Use `UniversalTable`, `UniversalForm`, `ModulePage`
3. **FOLLOW DESIGN SYSTEM** - Only use `slate-950`, `slate-800/50`, `slate-200`, `slate-400`, `primary-500` colors
4. **DARK THEME ONLY** - Never use light theme colors (white backgrounds, neutral-900 text, etc.)
5. **MODULE PATTERN** - Follow the 5-step module development pattern above
6. **TYPE SAFETY** - Always define TypeScript interfaces in `/src/types/entities.ts`
7. **UK ENGLISH** - Use UK spelling (colour, organisation, etc.) - see `/src/utils/spelling.ts`
8. **NO CLIENT LOGIC IN SERVER** - Keep `'use client'` directives on pages with hooks

### AI Workflow for New Module
1. Read module registry to understand existing modules
2. Read entities.ts to see available interfaces
3. Create module page in `/src/modules/[group]/[name]/page.tsx`
4. Create route wrapper in `/src/app/[name]/page.tsx`
5. Add module to registry in `/src/lib/modules.ts`
6. Add type to entities.ts
7. Add data key to dataStore.ts

---

## 9. GIT WORKFLOW

```bash
# 1. Pull latest dev branch
git checkout dev
git pull origin dev

# 2. Create feature branch
git checkout -b feature/module-name

# 3. Make changes following patterns above

# 4. Commit
git add .
git commit -m "feat: implement [module-name] with CRUD operations"

# 5. Push
git push origin feature/module-name

# 6. Create PR on GitHub to merge into dev
```

---

## 10. COMMON PITFALLS

❌ **DON'T**:
- Create custom table components
- Create custom form components
- Use light theme colors
- Use neutral-* colors
- Forget to wrap route with DashboardLayout
- Forget 'use client' directive

✅ **DO**:
- Use UniversalTable, UniversalForm, ModulePage
- Use slate-950/800/700/600/500/400/300/200
- Wrap routes with DashboardLayout
- Add 'use client' to all pages
- Follow UK English spelling
- Add types to entities.ts

---

## 11. QUICK REFERENCE

### Run Project
```bash
cd src/frontend
npm run dev
# http://localhost:3000
```

### Module Template
Copy from: `/src/modules/foundation/founders/page.tsx`

### Route Template
Copy from: `/src/app/founders/page.tsx`

### Check Design
All backgrounds should be `slate-950` (dark), all text `slate-200` (light)

---

**Last Updated**: 2026-04-25
**Version**: 1.0
**Maintainers**: All developers + AI assistants

> **Remember**: When in doubt, look at how `founders` or `employees` module is implemented and copy that pattern.
