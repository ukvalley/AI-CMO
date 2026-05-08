/**
 * Global TypeScript Type Definitions
 */

// ============================================
// UI COMPONENT TYPES
// ============================================

// Common variants
export type Variant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';
export type Size = 'sm' | 'md' | 'lg';
export type Status = 'idle' | 'loading' | 'success' | 'error';

// Button props
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClick?: () => void;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

// Card props
export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

// Input props
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  inputSize?: Size;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// Modal props
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  footer?: React.ReactNode;
}

// ============================================
// LAYOUT TYPES
// ============================================

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  children?: NavItem[];
}

export interface SidebarProps {
  items: NavItem[];
  user: UserProfile;
  collapsed?: boolean;
  onToggle?: () => void;
}

export interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// ============================================
// DASHBOARD TYPES
// ============================================

// KPI Card
export interface KPIData {
  id: string;
  title: string;
  value: string | number;
  change?: {
    value: number;
    timeframe: string;
    trend: 'up' | 'down' | 'neutral';
  };
  icon?: React.ComponentType<{ className?: string }>;
  format?: 'currency' | 'percentage' | 'number' | 'compact';
}

// Chart data
export interface ChartDataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
  date?: Date;
}

export interface ChartSeries {
  name: string;
  data: ChartDataPoint[];
  color?: string;
}

// Table types
export interface TableColumn<T = unknown> {
  key: string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  formatter?: (value: unknown, row: T) => React.ReactNode;
}

export interface TableProps<T = unknown> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  emptyState?: React.ReactNode;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
  };
  sortable?: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  rowSelection?: {
    selectedIds: string[];
    onSelectionChange: (selectedIds: string[]) => void;
  };
}

// ============================================
// USER TYPES
// ============================================

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'manager' | 'analyst' | 'viewer';
  permissions: Permission[];
}

export interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  meta?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

// ============================================
// NOTIFICATION TYPES
// ============================================

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// ============================================
// THEME TYPES
// ============================================

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}
