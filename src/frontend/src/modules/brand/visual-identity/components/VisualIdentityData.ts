/**
 * Comprehensive Visual Identity Framework
 *
 * Two modes:
 * - Template Mode: Pre-configured templates with everything set
 * - Manual Mode: Full control over all settings
 */

// ============================================
// SPACING SYSTEM
// ============================================

export const SPACING_OPTIONS = [
  {
    id: 'compact',
    name: 'Compact',
    description: 'Minimal spacing, tight layout',
    values: {
      section: '3rem',
      component: '1rem',
      element: '0.5rem',
      grid: '1rem',
    },
    density: 'high',
  },
  {
    id: 'comfortable',
    name: 'Comfortable',
    description: 'Balanced spacing for readability',
    values: {
      section: '4rem',
      component: '1.5rem',
      element: '0.75rem',
      grid: '1.5rem',
    },
    density: 'medium',
  },
  {
    id: 'spacious',
    name: 'Spacious',
    description: 'Generous spacing, premium feel',
    values: {
      section: '6rem',
      component: '2rem',
      element: '1rem',
      grid: '2rem',
    },
    density: 'low',
  },
  {
    id: 'luxury',
    name: 'Luxury',
    description: 'Maximum spacing for high-end brands',
    values: {
      section: '8rem',
      component: '3rem',
      element: '1.5rem',
      grid: '3rem',
    },
    density: 'minimal',
  },
];

// ============================================
// ICON STYLE OPTIONS
// ============================================

export const ICON_STYLES = [
  {
    id: 'outline',
    name: 'Outline',
    description: 'Clean line icons',
    strokeWidth: 1.5,
    fill: 'none',
    defaultSize: 20,
    style: 'stroke',
  },
  {
    id: 'filled',
    name: 'Filled',
    description: 'Solid filled icons',
    strokeWidth: 0,
    fill: 'currentColor',
    defaultSize: 20,
    style: 'fill',
  },
  {
    id: 'two-tone',
    name: 'Two Tone',
    description: 'Duotone style with accent',
    strokeWidth: 1.5,
    fill: 'secondary',
    defaultSize: 20,
    style: 'duotone',
  },
  {
    id: 'rounded',
    name: 'Rounded',
    description: 'Soft rounded edges',
    strokeWidth: 2,
    fill: 'none',
    defaultSize: 20,
    style: 'rounded',
  },
  {
    id: 'sharp',
    name: 'Sharp',
    description: 'Angular, precise edges',
    strokeWidth: 1.5,
    fill: 'none',
    defaultSize: 20,
    style: 'sharp',
  },
];

// ============================================
// IMAGE STYLE OPTIONS
// ============================================

export const IMAGE_STYLES = [
  {
    id: 'rounded',
    name: 'Rounded',
    description: 'Soft rounded corners',
    borderRadius: '1rem',
    shadow: '0 4px 6px rgba(0,0,0,0.1)',
    filter: 'none',
    aspectRatio: '16/9',
  },
  {
    id: 'circular',
    name: 'Circular',
    description: 'Circular/avatar style',
    borderRadius: '50%',
    shadow: '0 4px 12px rgba(0,0,0,0.15)',
    filter: 'none',
    aspectRatio: '1/1',
  },
  {
    id: 'sharp',
    name: 'Sharp',
    description: 'No border radius, clean edges',
    borderRadius: '0',
    shadow: '0 2px 4px rgba(0,0,0,0.1)',
    filter: 'none',
    aspectRatio: '16/9',
  },
  {
    id: 'polaroid',
    name: 'Polaroid',
    description: 'Vintage photo style with border',
    borderRadius: '0.25rem',
    shadow: '0 8px 24px rgba(0,0,0,0.15)',
    filter: 'contrast(1.1)',
    aspectRatio: '4/5',
  },
  {
    id: 'gradient-overlay',
    name: 'Gradient Overlay',
    description: 'Images with gradient overlay',
    borderRadius: '0.75rem',
    shadow: '0 4px 6px rgba(0,0,0,0.1)',
    filter: 'none',
    aspectRatio: '16/9',
    overlay: true,
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    description: 'Black and white effect',
    borderRadius: '0.5rem',
    shadow: '0 4px 6px rgba(0,0,0,0.1)',
    filter: 'grayscale(100%)',
    aspectRatio: '16/9',
  },
  {
    id: 'duotone',
    name: 'Duotone',
    description: 'Two-color image treatment',
    borderRadius: '0.5rem',
    shadow: '0 4px 6px rgba(0,0,0,0.1)',
    filter: 'sepia(50%)',
    aspectRatio: '16/9',
  },
];

// ============================================
// TYPOGRAPHY PRESETS
// ============================================

export const TYPOGRAPHY_PRESETS = [
  {
    id: 'modern-sans',
    name: 'Modern Sans',
    description: 'Clean, contemporary sans-serif pairing',
    heading: 'Inter',
    body: 'Inter',
    accent: 'Playfair Display',
    mono: 'JetBrains Mono',
    weights: {
      heading: 700,
      body: 400,
      accent: 600,
    },
    sizes: {
      h1: '3rem',
      h2: '2.25rem',
      h3: '1.5rem',
      body: '1rem',
      small: '0.875rem',
    },
  },
  {
    id: 'editorial',
    name: 'Editorial',
    description: 'Elegant serif for premium content',
    heading: 'Playfair Display',
    body: 'Source Sans Pro',
    accent: 'Cormorant Garamond',
    mono: 'Source Code Pro',
    weights: {
      heading: 700,
      body: 400,
      accent: 500,
    },
    sizes: {
      h1: '3.5rem',
      h2: '2.5rem',
      h3: '1.75rem',
      body: '1.125rem',
      small: '0.875rem',
    },
  },
  {
    id: 'tech-mono',
    name: 'Tech Mono',
    description: 'Developer-focused monospace style',
    heading: 'Space Grotesk',
    body: 'Inter',
    accent: 'JetBrains Mono',
    mono: 'JetBrains Mono',
    weights: {
      heading: 600,
      body: 400,
      accent: 500,
    },
    sizes: {
      h1: '2.75rem',
      h2: '2rem',
      h3: '1.5rem',
      body: '1rem',
      small: '0.875rem',
    },
  },
  {
    id: 'friendly-rounded',
    name: 'Friendly Rounded',
    description: 'Warm, approachable rounded fonts',
    heading: 'Poppins',
    body: 'Nunito',
    accent: 'Comfortaa',
    mono: 'Roboto Mono',
    weights: {
      heading: 600,
      body: 400,
      accent: 500,
    },
    sizes: {
      h1: '3rem',
      h2: '2.25rem',
      h3: '1.5rem',
      body: '1rem',
      small: '0.875rem',
    },
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Professional, traditional business style',
    heading: 'Merriweather',
    body: 'Source Sans Pro',
    accent: 'Cinzel',
    mono: 'Source Code Pro',
    weights: {
      heading: 700,
      body: 400,
      accent: 600,
    },
    sizes: {
      h1: '2.75rem',
      h2: '2rem',
      h3: '1.5rem',
      body: '1rem',
      small: '0.875rem',
    },
  },
  {
    id: 'playful',
    name: 'Playful',
    description: 'Creative, energetic display fonts',
    heading: 'Fredoka One',
    body: 'Nunito',
    accent: 'Pacifico',
    mono: 'Space Mono',
    weights: {
      heading: 400,
      body: 400,
      accent: 400,
    },
    sizes: {
      h1: '3.25rem',
      h2: '2.5rem',
      h3: '1.75rem',
      body: '1.125rem',
      small: '0.875rem',
    },
  },
];

// ============================================
// COMPLETE VISUAL IDENTITY TEMPLATES (20+ templates)
// ============================================

export interface VisualIdentityTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  // Colors
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  // Typography preset
  typography: typeof TYPOGRAPHY_PRESETS[0];
  // Spacing
  spacing: typeof SPACING_OPTIONS[0];
  // Icon style
  iconStyle: typeof ICON_STYLES[0];
  // Image style
  imageStyle: typeof IMAGE_STYLES[0];
  // Border radius
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  // Shadow depth
  shadowDepth: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  // Animation speed
  animationSpeed: 'fast' | 'normal' | 'slow';
  tags: string[];
}

export const VISUAL_IDENTITY_TEMPLATES: VisualIdentityTemplate[] = [
  // TECHNOLOGY TEMPLATES
  {
    id: 'tech-midnight',
    name: 'Midnight Tech',
    category: 'technology',
    description: 'Dark mode perfection for SaaS and tech',
    colors: {
      primary: '#C8FF2E',
      secondary: '#1E293B',
      accent: '#22D3EE',
      background: '#0D1117',
      surface: '#161B22',
      text: '#E6EDF3',
      textMuted: '#8B949E',
      success: '#3FB950',
      warning: '#D29922',
      error: '#F85149',
      info: '#58A6FF',
    },
    typography: TYPOGRAPHY_PRESETS[0], // Modern Sans
    spacing: SPACING_OPTIONS[1], // Comfortable
    iconStyle: ICON_STYLES[0], // Outline
    imageStyle: IMAGE_STYLES[0], // Rounded
    borderRadius: { sm: '0.375rem', md: '0.5rem', lg: '0.75rem', xl: '1rem' },
    shadowDepth: 'md',
    animationSpeed: 'fast',
    tags: ['technology', 'saas', 'dark-mode', 'modern', 'developers'],
  },
  {
    id: 'tech-neon',
    name: 'Neon Cyber',
    category: 'technology',
    description: 'High-energy cyberpunk aesthetic',
    colors: {
      primary: '#00F5FF',
      secondary: '#FF00FF',
      accent: '#FFFF00',
      background: '#0D0221',
      surface: '#1A0B2E',
      text: '#FFFFFF',
      textMuted: '#B8B8B8',
      success: '#00FF9F',
      warning: '#FFB800',
      error: '#FF003C',
      info: '#00F5FF',
    },
    typography: TYPOGRAPHY_PRESETS[2], // Tech Mono
    spacing: SPACING_OPTIONS[0], // Compact
    iconStyle: ICON_STYLES[4], // Sharp
    imageStyle: IMAGE_STYLES[2], // Sharp
    borderRadius: { sm: '0.125rem', md: '0.25rem', lg: '0.375rem', xl: '0.5rem' },
    shadowDepth: 'xl',
    animationSpeed: 'fast',
    tags: ['technology', 'gaming', 'cyberpunk', 'edgy', 'innovative'],
  },
  {
    id: 'tech-cloud',
    name: 'Cloud SaaS',
    category: 'technology',
    description: 'Professional cloud software aesthetic',
    colors: {
      primary: '#0066CC',
      secondary: '#4A90E2',
      accent: '#50E3C2',
      background: '#F8FAFC',
      surface: '#FFFFFF',
      text: '#1E293B',
      textMuted: '#64748B',
      success: '#22C55E',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
    typography: TYPOGRAPHY_PRESETS[0], // Modern Sans
    spacing: SPACING_OPTIONS[1], // Comfortable
    iconStyle: ICON_STYLES[0], // Outline
    imageStyle: IMAGE_STYLES[0], // Rounded
    borderRadius: { sm: '0.25rem', md: '0.375rem', lg: '0.5rem', xl: '0.75rem' },
    shadowDepth: 'sm',
    animationSpeed: 'normal',
    tags: ['technology', 'saas', 'professional', 'enterprise', 'light'],
  },
  {
    id: 'tech-ai',
    name: 'Deep Purple AI',
    category: 'technology',
    description: 'Creative AI and machine learning',
    colors: {
      primary: '#7C3AED',
      secondary: '#1E1B4B',
      accent: '#22D3EE',
      background: '#0F0A1E',
      surface: '#1E1B4B',
      text: '#FAFAFA',
      textMuted: '#A78BFA',
      success: '#34D399',
      warning: '#FBBF24',
      error: '#F87171',
      info: '#60A5FA',
    },
    typography: TYPOGRAPHY_PRESETS[2], // Tech Mono
    spacing: SPACING_OPTIONS[1], // Comfortable
    iconStyle: ICON_STYLES[1], // Filled
    imageStyle: IMAGE_STYLES[4], // Gradient Overlay
    borderRadius: { sm: '0.375rem', md: '0.5rem', lg: '0.75rem', xl: '1rem' },
    shadowDepth: 'lg',
    animationSpeed: 'normal',
    tags: ['technology', 'ai', 'ml', 'innovative', 'dark'],
  },
  {
    id: 'tech-startup',
    name: 'Startup Vibes',
    category: 'technology',
    description: 'Energetic startup aesthetic',
    colors: {
      primary: '#FF6B6B',
      secondary: '#4ECDC4',
      accent: '#FFE66D',
      background: '#FFF5F5',
      surface: '#FFFFFF',
      text: '#2D3436',
      textMuted: '#636E72',
      success: '#00B894',
      warning: '#FDCB6E',
      error: '#D63031',
      info: '#74B9FF',
    },
    typography: TYPOGRAPHY_PRESETS[3], // Friendly Rounded
    spacing: SPACING_OPTIONS[2], // Spacious
    iconStyle: ICON_STYLES[3], // Rounded
    imageStyle: IMAGE_STYLES[0], // Rounded
    borderRadius: { sm: '0.5rem', md: '0.75rem', lg: '1rem', xl: '1.5rem' },
    shadowDepth: 'md',
    animationSpeed: 'normal',
    tags: ['technology', 'startup', 'friendly', 'colorful', 'light'],
  },

  // HEALTHCARE TEMPLATES
  {
    id: 'health-medical',
    name: 'Medical Trust',
    category: 'healthcare',
    description: 'Clean clinical healthcare aesthetic',
    colors: {
      primary: '#0066CC',
      secondary: '#E3F2FD',
      accent: '#00BCD4',
      background: '#FFFFFF',
      surface: '#F5F5F5',
      text: '#1A237E',
      textMuted: '#546E7A',
      success: '#4CAF50',
      warning: '#FF9800',
      error: '#F44336',
      info: '#2196F3',
    },
    typography: TYPOGRAPHY_PRESETS[4], // Corporate
    spacing: SPACING_OPTIONS[1], // Comfortable
    iconStyle: ICON_STYLES[0], // Outline
    imageStyle: IMAGE_STYLES[0], // Rounded
    borderRadius: { sm: '0.25rem', md: '0.375rem', lg: '0.5rem', xl: '0.75rem' },
    shadowDepth: 'sm',
    animationSpeed: 'normal',
    tags: ['healthcare', 'medical', 'professional', 'clean', 'trustworthy'],
  },
  {
    id: 'health-wellness',
    name: 'Wellness Natural',
    category: 'healthcare',
    description: 'Natural holistic wellness',
    colors: {
      primary: '#2D6A4F',
      secondary: '#40916C',
      accent: '#52B788',
      background: '#F8FAF9',
      surface: '#FFFFFF',
      text: '#1B4332',
      textMuted: '#52796F',
      success: '#2D6A4F',
      warning: '#D4A373',
      error: '#BC4749',
      info: '#457B9D',
    },
    typography: TYPOGRAPHY_PRESETS[4], // Corporate
    spacing: SPACING_OPTIONS[2], // Spacious
    iconStyle: ICON_STYLES[3], // Rounded
    imageStyle: IMAGE_STYLES[1], // Circular
    borderRadius: { sm: '0.5rem', md: '0.75rem', lg: '1rem', xl: '1.5rem' },
    shadowDepth: 'sm',
    animationSpeed: 'slow',
    tags: ['healthcare', 'wellness', 'natural', 'organic', 'calm'],
  },
  {
    id: 'health-pediatric',
    name: 'Pediatric Care',
    category: 'healthcare',
    description: 'Child-friendly healthcare',
    colors: {
      primary: '#FF6B9D',
      secondary: '#4ECDC4',
      accent: '#FFE66D',
      background: '#FFF5F7',
      surface: '#FFFFFF',
      text: '#2D3436',
      textMuted: '#636E72',
      success: '#00B894',
      warning: '#FDCB6E',
      error: '#D63031',
      info: '#74B9FF',
    },
    typography: TYPOGRAPHY_PRESETS[5], // Playful
    spacing: SPACING_OPTIONS[2], // Spacious
    iconStyle: ICON_STYLES[3], // Rounded
    imageStyle: IMAGE_STYLES[3], // Polaroid
    borderRadius: { sm: '0.75rem', md: '1rem', lg: '1.5rem', xl: '2rem' },
    shadowDepth: 'md',
    animationSpeed: 'normal',
    tags: ['healthcare', 'pediatric', 'children', 'friendly', 'playful'],
  },

  // FINANCE TEMPLATES
  {
    id: 'finance-trust',
    name: 'Banking Trust',
    category: 'finance',
    description: 'Traditional banking authority',
    colors: {
      primary: '#1A365D',
      secondary: '#2C5282',
      accent: '#38A169',
      background: '#F7FAFC',
      surface: '#FFFFFF',
      text: '#1A202C',
      textMuted: '#4A5568',
      success: '#276749',
      warning: '#C05621',
      error: '#C53030',
      info: '#2B6CB0',
    },
    typography: TYPOGRAPHY_PRESETS[4], // Corporate
    spacing: SPACING_OPTIONS[1], // Comfortable
    iconStyle: ICON_STYLES[0], // Outline
    imageStyle: IMAGE_STYLES[0], // Rounded
    borderRadius: { sm: '0.125rem', md: '0.25rem', lg: '0.375rem', xl: '0.5rem' },
    shadowDepth: 'sm',
    animationSpeed: 'normal',
    tags: ['finance', 'banking', 'professional', 'trustworthy', 'classic'],
  },
  {
    id: 'finance-fintech',
    name: 'Fintech Modern',
    category: 'finance',
    description: 'Disruptive financial technology',
    colors: {
      primary: '#667EEA',
      secondary: '#764BA2',
      accent: '#F093FB',
      background: '#F9FAFB',
      surface: '#FFFFFF',
      text: '#1F2937',
      textMuted: '#6B7280',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
    typography: TYPOGRAPHY_PRESETS[0], // Modern Sans
    spacing: SPACING_OPTIONS[1], // Comfortable
    iconStyle: ICON_STYLES[1], // Filled
    imageStyle: IMAGE_STYLES[0], // Rounded
    borderRadius: { sm: '0.375rem', md: '0.5rem', lg: '0.75rem', xl: '1rem' },
    shadowDepth: 'md',
    animationSpeed: 'fast',
    tags: ['finance', 'fintech', 'modern', 'innovative', 'gradient'],
  },
  {
    id: 'finance-luxury',
    name: 'Private Banking',
    category: 'finance',
    description: 'Exclusive wealth management',
    colors: {
      primary: '#D4AF37',
      secondary: '#1C1C1C',
      accent: '#8B0000',
      background: '#0A0A0A',
      surface: '#141414',
      text: '#F5F5F5',
      textMuted: '#A0A0A0',
      success: '#228B22',
      warning: '#B8860B',
      error: '#8B0000',
      info: '#4169E1',
    },
    typography: TYPOGRAPHY_PRESETS[1], // Editorial
    spacing: SPACING_OPTIONS[3], // Luxury
    iconStyle: ICON_STYLES[0], // Outline
    imageStyle: IMAGE_STYLES[5], // Monochrome
    borderRadius: { sm: '0.25rem', md: '0.375rem', lg: '0.5rem', xl: '0.75rem' },
    shadowDepth: 'lg',
    animationSpeed: 'slow',
    tags: ['finance', 'luxury', 'wealth', 'exclusive', 'dark'],
  },

  // E-COMMERCE TEMPLATES
  {
    id: 'ecom-retail',
    name: 'Retail Store',
    category: 'ecommerce',
    description: 'Classic retail shopping experience',
    colors: {
      primary: '#FF6B35',
      secondary: '#F7931E',
      accent: '#FFD23F',
      background: '#FFF8F0',
      surface: '#FFFFFF',
      text: '#2D3748',
      textMuted: '#718096',
      success: '#48BB78',
      warning: '#ED8936',
      error: '#F56565',
      info: '#4299E1',
    },
    typography: TYPOGRAPHY_PRESETS[0], // Modern Sans
    spacing: SPACING_OPTIONS[1], // Comfortable
    iconStyle: ICON_STYLES[0], // Outline
    imageStyle: IMAGE_STYLES[0], // Rounded
    borderRadius: { sm: '0.375rem', md: '0.5rem', lg: '0.75rem', xl: '1rem' },
    shadowDepth: 'md',
    animationSpeed: 'normal',
    tags: ['ecommerce', 'retail', 'warm', 'friendly', 'shopping'],
  },
  {
    id: 'ecom-luxury',
    name: 'Luxury Boutique',
    category: 'ecommerce',
    description: 'High-end fashion and luxury goods',
    colors: {
      primary: '#1A1A1A',
      secondary: '#333333',
      accent: '#D4AF37',
      background: '#FFFFFF',
      surface: '#F9F9F9',
      text: '#000000',
      textMuted: '#666666',
      success: '#2E7D32',
      warning: '#F57C00',
      error: '#C62828',
      info: '#1565C0',
    },
    typography: TYPOGRAPHY_PRESETS[1], // Editorial
    spacing: SPACING_OPTIONS[3], // Luxury
    iconStyle: ICON_STYLES[0], // Outline
    imageStyle: IMAGE_STYLES[0], // Rounded
    borderRadius: { sm: '0', md: '0', lg: '0', xl: '0' },
    shadowDepth: 'sm',
    animationSpeed: 'slow',
    tags: ['ecommerce', 'luxury', 'fashion', 'minimal', 'elegant'],
  },
  {
    id: 'ecom-handmade',
    name: 'Artisan Market',
    category: 'ecommerce',
    description: 'Handmade and craft marketplace',
    colors: {
      primary: '#D2691E',
      secondary: '#8B4513',
      accent: '#DEB887',
      background: '#FFFAF0',
      surface: '#FFFFFF',
      text: '#5D4037',
      textMuted: '#8D6E63',
      success: '#6B8E6B',
      warning: '#D4A373',
      error: '#BC6C6C',
      info: '#6B7B8C',
    },
    typography: TYPOGRAPHY_PRESETS[5], // Playful
    spacing: SPACING_OPTIONS[2], // Spacious
    iconStyle: ICON_STYLES[3], // Rounded
    imageStyle: IMAGE_STYLES[3], // Polaroid
    borderRadius: { sm: '0.5rem', md: '0.75rem', lg: '1rem', xl: '1.5rem' },
    shadowDepth: 'md',
    animationSpeed: 'normal',
    tags: ['ecommerce', 'artisan', 'handmade', 'craft', 'warm'],
  },

  // EDUCATION TEMPLATES
  {
    id: 'edu-academic',
    name: 'Academic Classic',
    category: 'education',
    description: 'Traditional educational institution',
    colors: {
      primary: '#003366',
      secondary: '#004B8D',
      accent: '#FFD700',
      background: '#F5F5F5',
      surface: '#FFFFFF',
      text: '#1A1A1A',
      textMuted: '#4A4A4A',
      success: '#28A745',
      warning: '#FFC107',
      error: '#DC3545',
      info: '#17A2B8',
    },
    typography: TYPOGRAPHY_PRESETS[4], // Corporate
    spacing: SPACING_OPTIONS[1], // Comfortable
    iconStyle: ICON_STYLES[0], // Outline
    imageStyle: IMAGE_STYLES[0], // Rounded
    borderRadius: { sm: '0.125rem', md: '0.25rem', lg: '0.375rem', xl: '0.5rem' },
    shadowDepth: 'sm',
    animationSpeed: 'normal',
    tags: ['education', 'academic', 'university', 'traditional', 'professional'],
  },
  {
    id: 'edu-creative',
    name: 'Creative Learning',
    category: 'education',
    description: 'Modern ed-tech and creative learning',
    colors: {
      primary: '#FF6B6B',
      secondary: '#4ECDC4',
      accent: '#FFE66D',
      background: '#F7FFF7',
      surface: '#FFFFFF',
      text: '#2C3E50',
      textMuted: '#5D6D7E',
      success: '#27AE60',
      warning: '#F39C12',
      error: '#E74C3C',
      info: '#3498DB',
    },
    typography: TYPOGRAPHY_PRESETS[3], // Friendly Rounded
    spacing: SPACING_OPTIONS[2], // Spacious
    iconStyle: ICON_STYLES[3], // Rounded
    imageStyle: IMAGE_STYLES[0], // Rounded
    borderRadius: { sm: '0.75rem', md: '1rem', lg: '1.25rem', xl: '1.5rem' },
    shadowDepth: 'md',
    animationSpeed: 'normal',
    tags: ['education', 'edtech', 'creative', 'modern', 'colorful'],
  },
  {
    id: 'edu-kids',
    name: 'Kids Academy',
    category: 'education',
    description: 'Fun learning for children',
    colors: {
      primary: '#FF7043',
      secondary: '#FFAB91',
      accent: '#FFE082',
      background: '#FFF8E1',
      surface: '#FFFFFF',
      text: '#3E2723',
      textMuted: '#6D4C41',
      success: '#81C784',
      warning: '#FFB74D',
      error: '#E57373',
      info: '#64B5F6',
    },
    typography: TYPOGRAPHY_PRESETS[5], // Playful
    spacing: SPACING_OPTIONS[2], // Spacious
    iconStyle: ICON_STYLES[3], // Rounded
    imageStyle: IMAGE_STYLES[3], // Polaroid
    borderRadius: { sm: '1rem', md: '1.25rem', lg: '1.5rem', xl: '2rem' },
    shadowDepth: 'lg',
    animationSpeed: 'normal',
    tags: ['education', 'kids', 'children', 'playful', 'fun'],
  },

  // ENTERTAINMENT TEMPLATES
  {
    id: 'ent-streaming',
    name: 'Streaming Platform',
    category: 'entertainment',
    description: 'Media streaming service',
    colors: {
      primary: '#E50914',
      secondary: '#221F1F',
      accent: '#FFD700',
      background: '#000000',
      surface: '#141414',
      text: '#FFFFFF',
      textMuted: '#A3A3A3',
      success: '#46D369',
      warning: '#E87C03',
      error: '#E50914',
      info: '#54B9C0',
    },
    typography: TYPOGRAPHY_PRESETS[0], // Modern Sans
    spacing: SPACING_OPTIONS[0], // Compact
    iconStyle: ICON_STYLES[1], // Filled
    imageStyle: IMAGE_STYLES[4], // Gradient Overlay
    borderRadius: { sm: '0.25rem', md: '0.375rem', lg: '0.5rem', xl: '0.75rem' },
    shadowDepth: 'xl',
    animationSpeed: 'fast',
    tags: ['entertainment', 'streaming', 'media', 'dark', 'bold'],
  },
  {
    id: 'ent-gaming',
    name: 'Gaming Arena',
    category: 'entertainment',
    description: 'Gaming and esports platform',
    colors: {
      primary: '#FF0055',
      secondary: '#00FF99',
      accent: '#00CCFF',
      background: '#0A0A0F',
      surface: '#141420',
      text: '#FFFFFF',
      textMuted: '#8A8AA0',
      success: '#00FF99',
      warning: '#FFAA00',
      error: '#FF0055',
      info: '#00CCFF',
    },
    typography: TYPOGRAPHY_PRESETS[2], // Tech Mono
    spacing: SPACING_OPTIONS[0], // Compact
    iconStyle: ICON_STYLES[4], // Sharp
    imageStyle: IMAGE_STYLES[2], // Sharp
    borderRadius: { sm: '0', md: '0.25rem', lg: '0.5rem', xl: '0.75rem' },
    shadowDepth: 'xl',
    animationSpeed: 'fast',
    tags: ['entertainment', 'gaming', 'esports', 'vibrant', 'energetic'],
  },

  // LUXURY TEMPLATES
  {
    id: 'luxury-fashion',
    name: 'Haute Couture',
    category: 'luxury',
    description: 'High-end fashion house',
    colors: {
      primary: '#1A1A1A',
      secondary: '#333333',
      accent: '#D4AF37',
      background: '#FFFFFF',
      surface: '#FAFAFA',
      text: '#000000',
      textMuted: '#757575',
      success: '#2E7D32',
      warning: '#F57C00',
      error: '#C62828',
      info: '#1565C0',
    },
    typography: TYPOGRAPHY_PRESETS[1], // Editorial
    spacing: SPACING_OPTIONS[3], // Luxury
    iconStyle: ICON_STYLES[0], // Outline
    imageStyle: IMAGE_STYLES[5], // Monochrome
    borderRadius: { sm: '0', md: '0', lg: '0', xl: '0' },
    shadowDepth: 'sm',
    animationSpeed: 'slow',
    tags: ['luxury', 'fashion', 'high-end', 'minimal', 'elegant'],
  },
  {
    id: 'luxury-hospitality',
    name: 'Five Star Hotel',
    category: 'luxury',
    description: 'Premium hospitality and travel',
    colors: {
      primary: '#8B7355',
      secondary: '#A0826D',
      accent: '#D4C4B0',
      background: '#FAF8F5',
      surface: '#FFFFFF',
      text: '#3D405B',
      textMuted: '#6B7280',
      success: '#6B8E6B',
      warning: '#D4A373',
      error: '#BC6C6C',
      info: '#6B7B8C',
    },
    typography: TYPOGRAPHY_PRESETS[1], // Editorial
    spacing: SPACING_OPTIONS[3], // Luxury
    iconStyle: ICON_STYLES[0], // Outline
    imageStyle: IMAGE_STYLES[0], // Rounded
    borderRadius: { sm: '0.25rem', md: '0.5rem', lg: '0.75rem', xl: '1rem' },
    shadowDepth: 'md',
    animationSpeed: 'slow',
    tags: ['luxury', 'hospitality', 'hotel', 'travel', 'premium'],
  },

  // FOOD & BEVERAGE
  {
    id: 'food-organic',
    name: 'Organic Fresh',
    category: 'food',
    description: 'Natural organic food brand',
    colors: {
      primary: '#558B2F',
      secondary: '#7CB342',
      accent: '#AED581',
      background: '#F1F8E9',
      surface: '#FFFFFF',
      text: '#33691E',
      textMuted: '#558B2F',
      success: '#43A047',
      warning: '#FB8C00',
      error: '#E53935',
      info: '#039BE5',
    },
    typography: TYPOGRAPHY_PRESETS[3], // Friendly Rounded
    spacing: SPACING_OPTIONS[2], // Spacious
    iconStyle: ICON_STYLES[3], // Rounded
    imageStyle: IMAGE_STYLES[0], // Rounded
    borderRadius: { sm: '0.5rem', md: '0.75rem', lg: '1rem', xl: '1.5rem' },
    shadowDepth: 'md',
    animationSpeed: 'normal',
    tags: ['food', 'organic', 'natural', 'healthy', 'eco-friendly'],
  },
  {
    id: 'food-gourmet',
    name: 'Gourmet Dining',
    category: 'food',
    description: 'Fine dining restaurant',
    colors: {
      primary: '#1A1A1A',
      secondary: '#4A4A4A',
      accent: '#C9A227',
      background: '#FDF6E3',
      surface: '#FFFFFF',
      text: '#1A1A1A',
      textMuted: '#666666',
      success: '#2E7D32',
      warning: '#F57C00',
      error: '#C62828',
      info: '#1565C0',
    },
    typography: TYPOGRAPHY_PRESETS[1], // Editorial
    spacing: SPACING_OPTIONS[3], // Luxury
    iconStyle: ICON_STYLES[0], // Outline
    imageStyle: IMAGE_STYLES[5], // Monochrome
    borderRadius: { sm: '0', md: '0', lg: '0', xl: '0' },
    shadowDepth: 'lg',
    animationSpeed: 'slow',
    tags: ['food', 'restaurant', 'fine-dining', 'luxury', 'gourmet'],
  },

  // NON-PROFIT
  {
    id: 'nonprofit-humanitarian',
    name: 'Humanitarian Aid',
    category: 'nonprofit',
    description: 'Global charity and aid organization',
    colors: {
      primary: '#E63946',
      secondary: '#1D3557',
      accent: '#F1FAEE',
      background: '#FFFFFF',
      surface: '#F8F9FA',
      text: '#1D3557',
      textMuted: '#457B9D',
      success: '#2A9D8F',
      warning: '#E9C46A',
      error: '#E63946',
      info: '#457B9D',
    },
    typography: TYPOGRAPHY_PRESETS[0], // Modern Sans
    spacing: SPACING_OPTIONS[1], // Comfortable
    iconStyle: ICON_STYLES[0], // Outline
    imageStyle: IMAGE_STYLES[0], // Rounded
    borderRadius: { sm: '0.375rem', md: '0.5rem', lg: '0.75rem', xl: '1rem' },
    shadowDepth: 'md',
    animationSpeed: 'normal',
    tags: ['nonprofit', 'charity', 'humanitarian', 'trustworthy', 'caring'],
  },
];

// ============================================
// GOOGLE FONTS LIST (for manual selection)
// ============================================

export const GOOGLE_FONTS = [
  // Sans-serif
  { name: 'Inter', category: 'sans-serif' },
  { name: 'Roboto', category: 'sans-serif' },
  { name: 'Poppins', category: 'sans-serif' },
  { name: 'Montserrat', category: 'sans-serif' },
  { name: 'Open Sans', category: 'sans-serif' },
  { name: 'Lato', category: 'sans-serif' },
  { name: 'Nunito', category: 'sans-serif' },
  { name: 'Raleway', category: 'sans-serif' },
  { name: 'DM Sans', category: 'sans-serif' },
  { name: 'Source Sans Pro', category: 'sans-serif' },
  { name: 'Work Sans', category: 'sans-serif' },
  { name: 'Ubuntu', category: 'sans-serif' },
  { name: 'Rubik', category: 'sans-serif' },
  { name: 'Space Grotesk', category: 'sans-serif' },
  { name: 'Plus Jakarta Sans', category: 'sans-serif' },
  // Serif
  { name: 'Playfair Display', category: 'serif' },
  { name: 'Merriweather', category: 'serif' },
  { name: 'Lora', category: 'serif' },
  { name: 'Cormorant Garamond', category: 'serif' },
  { name: 'Crimson Text', category: 'serif' },
  { name: 'EB Garamond', category: 'serif' },
  { name: 'Libre Baskerville', category: 'serif' },
  { name: 'Vollkorn', category: 'serif' },
  { name: 'Bodoni Moda', category: 'serif' },
  { name: 'Cinzel', category: 'serif' },
  // Monospace
  { name: 'JetBrains Mono', category: 'monospace' },
  { name: 'Fira Code', category: 'monospace' },
  { name: 'Source Code Pro', category: 'monospace' },
  { name: 'IBM Plex Mono', category: 'monospace' },
  { name: 'Space Mono', category: 'monospace' },
  // Display
  { name: 'Fredoka One', category: 'display' },
  { name: 'Bebas Neue', category: 'display' },
  { name: 'Righteous', category: 'display' },
  { name: 'Comfortaa', category: 'display' },
  { name: 'Pacifico', category: 'display' },
  { name: 'Great Vibes', category: 'display' },
  { name: 'Dancing Script', category: 'display' },
];

// Export all together
export * from './data';
