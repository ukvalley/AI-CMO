# Mengo Frontend

A production-ready SaaS dashboard frontend built with Next.js, React, TypeScript, and Tailwind CSS.

## Architecture Overview

This frontend follows a strict component architecture based on Atomic Design principles:

```
src/
├── components/
│   ├── ui/           # Atoms & Molecules (buttons, inputs, cards)
│   ├── layout/       # Organisms & Templates (sidebar, header, layouts)
│   └── dashboard/    # Feature components (KPI cards, charts, tables)
├── hooks/            # Custom React hooks
├── utils/            # Utility functions
├── styles/           # Global styles & design tokens
├── types/            # TypeScript type definitions
└── pages/            # Page components

app/                  # Next.js App Router
├── layout.tsx        # Root layout
├── page.tsx          # Root page (redirects to dashboard)
└── dashboard/        # Dashboard routes
    └── page.tsx
```

## Design System

### Colors
- **Primary**: Blue (#3b82f6)
- **Secondary**: Purple (#d946ef)
- **Neutral**: Gray scale (50-900)
- **Semantic**: Success (green), Warning (amber), Error (red)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Base Size**: 16px
- **Scale**: xs (12px) → 5xl (48px)
- **Line Height**: Normal (1.5), Tight (1.25), Loose (1.625)

### Spacing
- **Base Unit**: 8px
- **Scale**: 0.5 (2px) → 96 (384px)
- **Grid**: 12-column (desktop), 8-column (tablet), 4-column (mobile)

### Shadows (Soft UI)
- **Soft Sm**: 0 2px 4px rgba(0,0,0,0.05)
- **Soft Md**: 0 4px 8px rgba(0,0,0,0.04)
- **Soft Lg**: 0 8px 16px rgba(0,0,0,0.04)
- **Soft Xl**: 0 16px 32px rgba(0,0,0,0.04)

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

## Component Usage

### Button
```tsx
import { Button } from '@/components/ui/Button';

<Button variant="primary" size="md" leftIcon={<Icon />}>
  Click me
</Button>
```

### Card
```tsx
import { Card, CardHeader, CardContent } from '@/components/ui/Card';

<Card padding="md" hover>
  <CardHeader title="Title" subtitle="Description" />
  <CardContent>Content here</CardContent>
</Card>
```

### KPI Card
```tsx
import { KPICard } from '@/components/dashboard/KPICard';

<KPICard
  title="Revenue"
  value={124500}
  format="currency"
  change={{ value: 12.5, timeframe: 'last month', trend: 'up' }}
  icon={DollarSign}
/>
```

## Design Principles

1. **Minimalist**: Maximum whitespace, typography-first hierarchy
2. **Soft UI**: Subtle shadows, no heavy emboss
3. **Card-Based**: Modular, reusable card components
4. **Data-First**: Prioritize readability over decoration
5. **Flat + Subtle Gradients**: Base UI flat, gradients only for accents

## Responsive Breakpoints

- **sm**: 640px (Mobile landscape)
- **md**: 768px (Tablet)
- **lg**: 1024px (Desktop)
- **xl**: 1280px (Large desktop)
- **2xl**: 1536px (Extra large)

## Accessibility

- WCAG 2.1 AA compliant
- Semantic HTML
- ARIA labels where needed
- Focus visible states
- Keyboard navigation support

## Performance

- Tree-shakeable components
- Lazy loading for heavy components
- Image optimization with Next.js Image
- CSS optimized with Tailwind purge
