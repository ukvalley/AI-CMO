/**
 * API Service
 * Frontend service to connect with backend API
 */

import { useAuthStore } from '@/stores';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3101/api';

/**
 * Transform MongoDB _id to id for frontend compatibility
 */
const transformIds = (data: any): any => {
  if (data === null || data === undefined) return data;

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map(transformIds);
  }

  // Handle objects
  if (typeof data === 'object') {
    const transformed: any = {};
    for (const key of Object.keys(data)) {
      const value = data[key];
      if (key === '_id') {
        transformed['id'] = value;
      } else if (typeof value === 'object') {
        transformed[key] = transformIds(value);
      } else {
        transformed[key] = value;
      }
    }
    return transformed;
  }

  return data;
};

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
  skipAuth?: boolean;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

/**
 * Get auth token from auth store
 */
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  const state = useAuthStore.getState();
  return state.token;
};

/**
 * Make API request
 */
export const apiRequest = async <T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<ApiResponse<T>> => {
  const { method = 'GET', body, headers = {}, skipAuth = false } = options;

  const url = `${API_URL}${endpoint}`;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // Add auth token if available
  if (!skipAuth) {
    const token = getAuthToken();
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const status = response.status;

    // Handle 401 - Unauthorized
    if (status === 401) {
      // Clear auth state and localStorage
      useAuthStore.getState().logout();
      return {
        error: 'Session expired or invalid. Please login again.',
        status,
      };
    }

    // Parse response body
    let data: T | undefined;
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      const jsonData = await response.json();
      if (!response.ok) {
        return {
          error: jsonData.error || jsonData.message || 'Request failed',
          status,
        };
      }
      // Transform _id to id for MongoDB documents
      data = transformIds(jsonData);
    } else if (!response.ok) {
      return {
        error: response.statusText || 'Request failed',
        status,
      };
    }

    return { data, status };
  } catch (error) {
    console.error('API request failed:', error);
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        error: 'Request timed out. Backend may be unavailable.',
        status: 0,
      };
    }
    return {
      error: error instanceof Error ? error.message : 'Network error',
      status: 0,
    };
  }
};

// ============== AUTH API ==============

export const authApi = {
  register: (data: { email: string; password: string; name: string; companyName?: string }) =>
    apiRequest('/auth/register', { method: 'POST', body: data, skipAuth: true }),

  login: (data: { email: string; password: string }) =>
    apiRequest('/auth/login', { method: 'POST', body: data, skipAuth: true }),

  me: () => apiRequest('/auth/me'),

  switchCompany: (companyId: string) =>
    apiRequest('/auth/switch-company', { method: 'POST', body: { companyId } }),
};

// ============== COMPANIES API ==============

export const companyApi = {
  getAll: () => apiRequest('/companies'),

  getById: (id: string) => apiRequest(`/companies/${id}`),

  create: (data: { name: string; notificationEmail?: string }) =>
    apiRequest('/companies', { method: 'POST', body: data }),

  update: (id: string, data: any) =>
    apiRequest(`/companies/${id}`, { method: 'PUT', body: data }),

  delete: (id: string) => apiRequest(`/companies/${id}`, { method: 'DELETE' }),
};

// ============== BUSINESS PROFILE API ==============

export const businessProfileApi = {
  getByCompany: (companyId: string) =>
    apiRequest(`/business-profiles/${companyId}`),

  create: (data: any) =>
    apiRequest('/business-profiles', { method: 'POST', body: data }),

  update: (id: string, data: any) =>
    apiRequest(`/business-profiles/${id}`, { method: 'PUT', body: data }),

  delete: (id: string) =>
    apiRequest(`/business-profiles/${id}`, { method: 'DELETE' }),
};

// ============== PRODUCTS API ==============

export const productApi = {
  getAll: (companyId: string) => apiRequest(`/products/${companyId}`),

  getById: (id: string) => apiRequest(`/products/detail/${id}`),

  create: (data: any) => apiRequest('/products', { method: 'POST', body: data }),

  update: (id: string, data: any) =>
    apiRequest(`/products/${id}`, { method: 'PUT', body: data }),

  delete: (id: string) => apiRequest(`/products/${id}`, { method: 'DELETE' }),
};

// ============== PRODUCT CATEGORIES API ==============

export const categoryApi = {
  getAll: (companyId: string) => apiRequest(`/products/categories/${companyId}`),

  create: (data: any) =>
    apiRequest('/products/categories', { method: 'POST', body: data }),

  update: (id: string, data: any) =>
    apiRequest(`/products/categories/${id}`, { method: 'PUT', body: data }),

  delete: (id: string) =>
    apiRequest(`/products/categories/${id}`, { method: 'DELETE' }),
};

// ============== FOUNDERS API ==============

export const founderApi = {
  getAll: (companyId: string) => apiRequest(`/founders/${companyId}`),

  getById: (id: string) => apiRequest(`/founders/detail/${id}`),

  create: (data: any) =>
    apiRequest('/founders', { method: 'POST', body: data }),

  update: (id: string, data: any) =>
    apiRequest(`/founders/${id}`, { method: 'PUT', body: data }),

  delete: (id: string) =>
    apiRequest(`/founders/${id}`, { method: 'DELETE' }),
};

// ============== EMPLOYEES API ==============

export const employeeApi = {
  getAll: (companyId: string) => apiRequest(`/employees/${companyId}`),

  getById: (id: string) => apiRequest(`/employees/detail/${id}`),

  create: (data: any) =>
    apiRequest('/employees', { method: 'POST', body: data }),

  update: (id: string, data: any) =>
    apiRequest(`/employees/${id}`, { method: 'PUT', body: data }),

  delete: (id: string) =>
    apiRequest(`/employees/${id}`, { method: 'DELETE' }),
};

// ============== ICP API ==============

export const icpApi = {
  getAll: (companyId: string) => apiRequest(`/icps/${companyId}`),

  getById: (id: string) => apiRequest(`/icps/detail/${id}`),

  create: (data: any) => apiRequest('/icps', { method: 'POST', body: data }),

  update: (id: string, data: any) =>
    apiRequest(`/icps/${id}`, { method: 'PUT', body: data }),

  delete: (id: string) => apiRequest(`/icps/${id}`, { method: 'DELETE' }),
};

// ============== PERSONA API ==============

export const personaApi = {
  getAll: (companyId: string) => apiRequest(`/personas/${companyId}`),

  getByIcp: (icpId: string) => apiRequest(`/personas/icp/${icpId}`),

  getById: (id: string) => apiRequest(`/personas/detail/${id}`),

  create: (data: any) =>
    apiRequest('/personas', { method: 'POST', body: data }),

  update: (id: string, data: any) =>
    apiRequest(`/personas/${id}`, { method: 'PUT', body: data }),

  delete: (id: string) =>
    apiRequest(`/personas/${id}`, { method: 'DELETE' }),
};

// ============== COMPETITOR API ==============

export const competitorApi = {
  getAll: (companyId: string) => apiRequest(`/competitors/${companyId}`),

  getById: (id: string) => apiRequest(`/competitors/detail/${id}`),

  create: (data: any) =>
    apiRequest('/competitors', { method: 'POST', body: data }),

  update: (id: string, data: any) =>
    apiRequest(`/competitors/${id}`, { method: 'PUT', body: data }),

  delete: (id: string) =>
    apiRequest(`/competitors/${id}`, { method: 'DELETE' }),
};

// ============== CONTENT GROUP APIs ==============

export const websitePageApi = {
  getAll: (companyId: string) => apiRequest(`/website-pages/${companyId}`),

  getById: (id: string) => apiRequest(`/website-pages/detail/${id}`),

  create: (data: any) =>
    apiRequest('/website-pages', { method: 'POST', body: data }),

  update: (id: string, data: any) =>
    apiRequest(`/website-pages/${id}`, { method: 'PUT', body: data }),

  delete: (id: string) => apiRequest(`/website-pages/${id}`, { method: 'DELETE' }),
};

export const blogApi = {
  getAll: (companyId: string) => apiRequest(`/blogs/${companyId}`),

  getById: (id: string) => apiRequest(`/blogs/detail/${id}`),

  create: (data: any) =>
    apiRequest('/blogs', { method: 'POST', body: data }),

  update: (id: string, data: any) =>
    apiRequest(`/blogs/${id}`, { method: 'PUT', body: data }),

  delete: (id: string) => apiRequest(`/blogs/${id}`, { method: 'DELETE' }),
};

export const newsletterApi = {
  getAll: (companyId: string) => apiRequest(`/newsletters/${companyId}`),

  getById: (id: string) => apiRequest(`/newsletters/detail/${id}`),

  create: (data: any) =>
    apiRequest('/newsletters', { method: 'POST', body: data }),

  update: (id: string, data: any) =>
    apiRequest(`/newsletters/${id}`, { method: 'PUT', body: data }),

  delete: (id: string) => apiRequest(`/newsletters/${id}`, { method: 'DELETE' }),
};

export const faqApi = {
  getAll: (companyId: string) => apiRequest(`/faqs/${companyId}`),

  getById: (id: string) => apiRequest(`/faqs/detail/${id}`),

  create: (data: any) =>
    apiRequest('/faqs', { method: 'POST', body: data }),

  update: (id: string, data: any) =>
    apiRequest(`/faqs/${id}`, { method: 'PUT', body: data }),

  delete: (id: string) => apiRequest(`/faqs/${id}`, { method: 'DELETE' }),
};

// ============== FAQ BANK API ==============

export const faqCategoryApi = {
  getAll: (companyId: string) => apiRequest(`/faq-bank/categories/${companyId}`),

  getById: (id: string) => apiRequest(`/faq-bank/categories/detail/${id}`),

  create: (data: any) =>
    apiRequest('/faq-bank/categories', { method: 'POST', body: data }),

  update: (id: string, data: any) =>
    apiRequest(`/faq-bank/categories/${id}`, { method: 'PUT', body: data }),

  delete: (id: string) => apiRequest(`/faq-bank/categories/${id}`, { method: 'DELETE' }),
};

export const faqBankApi = {
  // CRUD
  getAll: (companyId: string, params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiRequest(`/faq-bank/faqs/${companyId}${query}`);
  },

  getById: (id: string) => apiRequest(`/faq-bank/faqs/detail/${id}`),

  create: (data: any) =>
    apiRequest('/faq-bank/faqs', { method: 'POST', body: data }),

  update: (id: string, data: any) =>
    apiRequest(`/faq-bank/faqs/${id}`, { method: 'PUT', body: data }),

  delete: (id: string) => apiRequest(`/faq-bank/faqs/${id}`, { method: 'DELETE' }),

  // Bulk Operations
  bulkImport: (data: any) =>
    apiRequest('/faq-bank/faqs/bulk-import', { method: 'POST', body: data }),

  bulkUpdate: (data: any) =>
    apiRequest('/faq-bank/faqs/bulk-update', { method: 'PUT', body: data }),

  bulkDelete: (ids: string[]) =>
    apiRequest('/faq-bank/faqs/bulk-delete', { method: 'POST', body: { ids } }),

  // Export
  exportFaqs: (companyId: string, format: string) =>
    apiRequest(`/faq-bank/faqs/export/${companyId}?format=${format}`),

  // AI Generation
  generate: (data: any) =>
    apiRequest('/faq-bank/faqs/generate', { method: 'POST', body: data }),

  suggestMissing: (data: any) =>
    apiRequest('/faq-bank/faqs/suggest-missing', { method: 'POST', body: data }),

  detectDuplicates: (data: any) =>
    apiRequest('/faq-bank/faqs/detect-duplicates', { method: 'POST', body: data }),
};

// ============== STATIONERY API ==============

export const stationeryApi = {
  getAll: (companyId: string) => apiRequest(`/stationery/${companyId}`),

  getById: (id: string) => apiRequest(`/stationery/detail/${id}`),

  create: (data: any) =>
    apiRequest('/stationery', { method: 'POST', body: data }),

  update: (id: string, data: any) =>
    apiRequest(`/stationery/${id}`, { method: 'PUT', body: data }),

  delete: (id: string) => apiRequest(`/stationery/${id}`, { method: 'DELETE' }),
};

// ============== BRAND ASSET API ==============

export const brandAssetApi = {
  getAll: (companyId: string) => apiRequest(`/brand-assets/${companyId}`),

  getById: (id: string) => apiRequest(`/brand-assets/detail/${id}`),

  create: (data: any) =>
    apiRequest('/brand-assets', { method: 'POST', body: data }),

  update: (id: string, data: any) =>
    apiRequest(`/brand-assets/${id}`, { method: 'PUT', body: data }),

  delete: (id: string) => apiRequest(`/brand-assets/${id}`, { method: 'DELETE' }),
};

// ============== BRAND API ==============

export const brandApi = {
  getByCompany: (companyId: string) => apiRequest(`/brands/${companyId}`),

  create: (data: any) => apiRequest('/brands', { method: 'POST', body: data }),

  update: (id: string, data: any) =>
    apiRequest(`/brands/${id}`, { method: 'PUT', body: data }),

  delete: (id: string) => apiRequest(`/brands/${id}`, { method: 'DELETE' }),
};

// ============== HR ASSET API ==============

export const hrAssetApi = {
  getAll: (companyId: string) => apiRequest(`/hr-assets/${companyId}`),

  getById: (id: string) => apiRequest(`/hr-assets/detail/${id}`),

  create: (data: any) =>
    apiRequest('/hr-assets', { method: 'POST', body: data }),

  update: (id: string, data: any) =>
    apiRequest(`/hr-assets/${id}`, { method: 'PUT', body: data }),

  delete: (id: string) => apiRequest(`/hr-assets/${id}`, { method: 'DELETE' }),

  bulkUpload: (items: any[], companyId: string) =>
    apiRequest('/hr-assets/bulk', { method: 'POST', body: { items, companyId } }),
};

// ============== BLOG CONTENT OS API ==============

export const blogStrategyApi = {
  getAll: (companyId: string) => apiRequest(`/blog-content-os/strategies/${companyId}`),
  getById: (id: string) => apiRequest(`/blog-content-os/strategies/detail/${id}`),
  create: (data: any) => apiRequest('/blog-content-os/strategies', { method: 'POST', body: data }),
  update: (id: string, data: any) => apiRequest(`/blog-content-os/strategies/${id}`, { method: 'PUT', body: data }),
  delete: (id: string) => apiRequest(`/blog-content-os/strategies/${id}`, { method: 'DELETE' }),
};

export const blogCalendarApi = {
  getAll: (companyId: string) => apiRequest(`/blog-content-os/calendars/${companyId}`),
  getById: (id: string) => apiRequest(`/blog-content-os/calendars/detail/${id}`),
  create: (data: any) => apiRequest('/blog-content-os/calendars', { method: 'POST', body: data }),
  update: (id: string, data: any) => apiRequest(`/blog-content-os/calendars/${id}`, { method: 'PUT', body: data }),
  delete: (id: string) => apiRequest(`/blog-content-os/calendars/${id}`, { method: 'DELETE' }),
};

export const blogTitleApi = {
  getAll: (companyId: string) => apiRequest(`/blog-content-os/titles/${companyId}`),
  getById: (id: string) => apiRequest(`/blog-content-os/titles/detail/${id}`),
  create: (data: any) => apiRequest('/blog-content-os/titles', { method: 'POST', body: data }),
  update: (id: string, data: any) => apiRequest(`/blog-content-os/titles/${id}`, { method: 'PUT', body: data }),
  delete: (id: string) => apiRequest(`/blog-content-os/titles/${id}`, { method: 'DELETE' }),
};

export const blogPostApi = {
  getAll: (companyId: string) => apiRequest(`/blog-content-os/posts/${companyId}`),
  getById: (id: string) => apiRequest(`/blog-content-os/posts/detail/${id}`),
  create: (data: any) => apiRequest('/blog-content-os/posts', { method: 'POST', body: data }),
  update: (id: string, data: any) => apiRequest(`/blog-content-os/posts/${id}`, { method: 'PUT', body: data }),
  delete: (id: string) => apiRequest(`/blog-content-os/posts/${id}`, { method: 'DELETE' }),
};

export const blogContentChunkApi = {
  getAll: (companyId: string) => apiRequest(`/blog-content-os/chunks/${companyId}`),
  getById: (id: string) => apiRequest(`/blog-content-os/chunks/detail/${id}`),
  create: (data: any) => apiRequest('/blog-content-os/chunks', { method: 'POST', body: data }),
  update: (id: string, data: any) => apiRequest(`/blog-content-os/chunks/${id}`, { method: 'PUT', body: data }),
  delete: (id: string) => apiRequest(`/blog-content-os/chunks/${id}`, { method: 'DELETE' }),
};

export const blogExportApi = {
  getAll: (companyId: string) => apiRequest(`/blog-content-os/exports/${companyId}`),
  getById: (id: string) => apiRequest(`/blog-content-os/exports/detail/${id}`),
  create: (data: any) => apiRequest('/blog-content-os/exports', { method: 'POST', body: data }),
  update: (id: string, data: any) => apiRequest(`/blog-content-os/exports/${id}`, { method: 'PUT', body: data }),
  delete: (id: string) => apiRequest(`/blog-content-os/exports/${id}`, { method: 'DELETE' }),
};

// ============== NEWSLETTER CONTENT OS API ==============

export const newsletterStrategyApi = {
  getAll: (companyId: string) => apiRequest(`/newsletter-content-os/strategies/${companyId}`),
  getById: (id: string) => apiRequest(`/newsletter-content-os/strategies/detail/${id}`),
  create: (data: any) => apiRequest('/newsletter-content-os/strategies', { method: 'POST', body: data }),
  update: (id: string, data: any) => apiRequest(`/newsletter-content-os/strategies/${id}`, { method: 'PUT', body: data }),
  delete: (id: string) => apiRequest(`/newsletter-content-os/strategies/${id}`, { method: 'DELETE' }),
};

export const newsletterCalendarApi = {
  getAll: (companyId: string) => apiRequest(`/newsletter-content-os/calendars/${companyId}`),
  getById: (id: string) => apiRequest(`/newsletter-content-os/calendars/detail/${id}`),
  create: (data: any) => apiRequest('/newsletter-content-os/calendars', { method: 'POST', body: data }),
  update: (id: string, data: any) => apiRequest(`/newsletter-content-os/calendars/${id}`, { method: 'PUT', body: data }),
  delete: (id: string) => apiRequest(`/newsletter-content-os/calendars/${id}`, { method: 'DELETE' }),
};

export const newsletterTitleApi = {
  getAll: (companyId: string) => apiRequest(`/newsletter-content-os/titles/${companyId}`),
  getById: (id: string) => apiRequest(`/newsletter-content-os/titles/detail/${id}`),
  create: (data: any) => apiRequest('/newsletter-content-os/titles', { method: 'POST', body: data }),
  update: (id: string, data: any) => apiRequest(`/newsletter-content-os/titles/${id}`, { method: 'PUT', body: data }),
  delete: (id: string) => apiRequest(`/newsletter-content-os/titles/${id}`, { method: 'DELETE' }),
};

export const newsletterPostApi = {
  getAll: (companyId: string) => apiRequest(`/newsletter-content-os/posts/${companyId}`),
  getById: (id: string) => apiRequest(`/newsletter-content-os/posts/detail/${id}`),
  create: (data: any) => apiRequest('/newsletter-content-os/posts', { method: 'POST', body: data }),
  update: (id: string, data: any) => apiRequest(`/newsletter-content-os/posts/${id}`, { method: 'PUT', body: data }),
  delete: (id: string) => apiRequest(`/newsletter-content-os/posts/${id}`, { method: 'DELETE' }),
};

export const newsletterContentChunkApi = {
  getAll: (companyId: string) => apiRequest(`/newsletter-content-os/chunks/${companyId}`),
  getById: (id: string) => apiRequest(`/newsletter-content-os/chunks/detail/${id}`),
  create: (data: any) => apiRequest('/newsletter-content-os/chunks', { method: 'POST', body: data }),
  update: (id: string, data: any) => apiRequest(`/newsletter-content-os/chunks/${id}`, { method: 'PUT', body: data }),
  delete: (id: string) => apiRequest(`/newsletter-content-os/chunks/${id}`, { method: 'DELETE' }),
};

export const newsletterExportApi = {
  getAll: (companyId: string) => apiRequest(`/newsletter-content-os/exports/${companyId}`),
  getById: (id: string) => apiRequest(`/newsletter-content-os/exports/detail/${id}`),
  create: (data: any) => apiRequest('/newsletter-content-os/exports', { method: 'POST', body: data }),
  update: (id: string, data: any) => apiRequest(`/newsletter-content-os/exports/${id}`, { method: 'PUT', body: data }),
  delete: (id: string) => apiRequest(`/newsletter-content-os/exports/${id}`, { method: 'DELETE' }),
};

// ============== LANDING PAGE CONTENT OS API ==============

export const landingPageApi = {
  getAll: (companyId: string) => apiRequest(`/landing-page-content-os/pages/${companyId}`),
  getById: (id: string) => apiRequest(`/landing-page-content-os/pages/detail/${id}`),
  create: (data: any) => apiRequest('/landing-page-content-os/pages', { method: 'POST', body: data }),
  update: (id: string, data: any) => apiRequest(`/landing-page-content-os/pages/${id}`, { method: 'PUT', body: data }),
  delete: (id: string) => apiRequest(`/landing-page-content-os/pages/${id}`, { method: 'DELETE' }),
};

export const landingPageTemplateApi = {
  getAll: (companyId: string) => apiRequest(`/landing-page-content-os/templates/${companyId}`),
  getById: (id: string) => apiRequest(`/landing-page-content-os/templates/detail/${id}`),
  create: (data: any) => apiRequest('/landing-page-content-os/templates', { method: 'POST', body: data }),
  update: (id: string, data: any) => apiRequest(`/landing-page-content-os/templates/${id}`, { method: 'PUT', body: data }),
  delete: (id: string) => apiRequest(`/landing-page-content-os/templates/${id}`, { method: 'DELETE' }),
};

export const landingPageExportApi = {
  getAll: (companyId: string) => apiRequest(`/landing-page-content-os/exports/${companyId}`),
  getById: (id: string) => apiRequest(`/landing-page-content-os/exports/detail/${id}`),
  create: (data: any) => apiRequest('/landing-page-content-os/exports', { method: 'POST', body: data }),
  update: (id: string, data: any) => apiRequest(`/landing-page-content-os/exports/${id}`, { method: 'PUT', body: data }),
  delete: (id: string) => apiRequest(`/landing-page-content-os/exports/${id}`, { method: 'DELETE' }),
};

// ============== SOCIAL MEDIA CONTENT OS API ==============

export const socialStrategyApi = {
  getAll: (companyId: string) => apiRequest(`/social-content-os/strategies/${companyId}`),
  getById: (id: string) => apiRequest(`/social-content-os/strategies/detail/${id}`),
  create: (data: any) => apiRequest('/social-content-os/strategies', { method: 'POST', body: data }),
  update: (id: string, data: any) => apiRequest(`/social-content-os/strategies/${id}`, { method: 'PUT', body: data }),
  delete: (id: string) => apiRequest(`/social-content-os/strategies/${id}`, { method: 'DELETE' }),
};

export const socialCalendarEntryApi = {
  getAll: (companyId: string) => apiRequest(`/social-content-os/entries/${companyId}`),
  getById: (id: string) => apiRequest(`/social-content-os/entries/detail/${id}`),
  create: (data: any) => apiRequest('/social-content-os/entries', { method: 'POST', body: data }),
  update: (id: string, data: any) => apiRequest(`/social-content-os/entries/${id}`, { method: 'PUT', body: data }),
  delete: (id: string) => apiRequest(`/social-content-os/entries/${id}`, { method: 'DELETE' }),
};

export const socialCampaignApi = {
  getAll: (companyId: string) => apiRequest(`/social-content-os/campaigns/${companyId}`),
  getById: (id: string) => apiRequest(`/social-content-os/campaigns/detail/${id}`),
  create: (data: any) => apiRequest('/social-content-os/campaigns', { method: 'POST', body: data }),
  update: (id: string, data: any) => apiRequest(`/social-content-os/campaigns/${id}`, { method: 'PUT', body: data }),
  delete: (id: string) => apiRequest(`/social-content-os/campaigns/${id}`, { method: 'DELETE' }),
};

export const socialTemplateApi = {
  getAll: (companyId: string) => apiRequest(`/social-content-os/templates/${companyId}`),
  getById: (id: string) => apiRequest(`/social-content-os/templates/detail/${id}`),
  create: (data: any) => apiRequest('/social-content-os/templates', { method: 'POST', body: data }),
  update: (id: string, data: any) => apiRequest(`/social-content-os/templates/${id}`, { method: 'PUT', body: data }),
  delete: (id: string) => apiRequest(`/social-content-os/templates/${id}`, { method: 'DELETE' }),
};

export const socialHashtagApi = {
  getAll: (companyId: string) => apiRequest(`/social-content-os/hashtags/${companyId}`),
  getById: (id: string) => apiRequest(`/social-content-os/hashtags/detail/${id}`),
  create: (data: any) => apiRequest('/social-content-os/hashtags', { method: 'POST', body: data }),
  update: (id: string, data: any) => apiRequest(`/social-content-os/hashtags/${id}`, { method: 'PUT', body: data }),
  delete: (id: string) => apiRequest(`/social-content-os/hashtags/${id}`, { method: 'DELETE' }),
};

export const socialCreativeApi = {
  getAll: (companyId: string) => apiRequest(`/social-content-os/creatives/${companyId}`),
  getById: (id: string) => apiRequest(`/social-content-os/creatives/detail/${id}`),
  create: (data: any) => apiRequest('/social-content-os/creatives', { method: 'POST', body: data }),
  update: (id: string, data: any) => apiRequest(`/social-content-os/creatives/${id}`, { method: 'PUT', body: data }),
  delete: (id: string) => apiRequest(`/social-content-os/creatives/${id}`, { method: 'DELETE' }),
};

export const socialExportApi = {
  getAll: (companyId: string) => apiRequest(`/social-content-os/exports/${companyId}`),
  getById: (id: string) => apiRequest(`/social-content-os/exports/detail/${id}`),
  create: (data: any) => apiRequest('/social-content-os/exports', { method: 'POST', body: data }),
  update: (id: string, data: any) => apiRequest(`/social-content-os/exports/${id}`, { method: 'PUT', body: data }),
  delete: (id: string) => apiRequest(`/social-content-os/exports/${id}`, { method: 'DELETE' }),
};

// ============== SALES COLLATERAL API ==============

export const salesCollateralApi = {
  getAll: (companyId: string) => apiRequest(`/sales-collateral/collateral/${companyId}`),
  getById: (id: string) => apiRequest(`/sales-collateral/collateral/detail/${id}`),
  create: (data: any) => apiRequest('/sales-collateral/collateral', { method: 'POST', body: data }),
  update: (id: string, data: any) => apiRequest(`/sales-collateral/collateral/${id}`, { method: 'PUT', body: data }),
  delete: (id: string) => apiRequest(`/sales-collateral/collateral/${id}`, { method: 'DELETE' }),
};

export const collateralCategoryApi = {
  getAll: (companyId: string) => apiRequest(`/sales-collateral/categories/${companyId}`),
  getById: (id: string) => apiRequest(`/sales-collateral/categories/detail/${id}`),
  create: (data: any) => apiRequest('/sales-collateral/categories', { method: 'POST', body: data }),
  update: (id: string, data: any) => apiRequest(`/sales-collateral/categories/${id}`, { method: 'PUT', body: data }),
  delete: (id: string) => apiRequest(`/sales-collateral/categories/${id}`, { method: 'DELETE' }),
};

// ============== MODULE DATA API (Generic) ==============

export const moduleDataApi = {
  get: (moduleId: string, companyId: string) =>
    apiRequest(`/module-data/${moduleId}/${companyId}`),

  save: (moduleId: string, data: { companyId: string; data: any }) =>
    apiRequest(`/module-data/${moduleId}`, { method: 'POST', body: data }),

  delete: (moduleId: string, companyId: string) =>
    apiRequest(`/module-data/${moduleId}/${companyId}`, { method: 'DELETE' }),
};

// ============== CHAT API ==============

export const chatApi = {
  getSession: (companyId: string) => apiRequest(`/chat/${companyId}`),

  addMessage: (companyId: string, message: any, context?: any) =>
    apiRequest(`/chat/${companyId}/messages`, {
      method: 'POST',
      body: { message, context },
    }),

  clear: (companyId: string) =>
    apiRequest(`/chat/${companyId}`, { method: 'DELETE' }),
};

// ============== TASKS API ==============

export const taskApi = {
  getAll: (companyId: string) => apiRequest(`/tasks/${companyId}`),

  getById: (id: string) => apiRequest(`/tasks/detail/${id}`),

  create: (data: any) => apiRequest('/tasks', { method: 'POST', body: data }),

  update: (id: string, data: any) =>
    apiRequest(`/tasks/${id}`, { method: 'PUT', body: data }),

  cancel: (id: string) =>
    apiRequest(`/tasks/${id}/cancel`, { method: 'POST' }),

  delete: (id: string) => apiRequest(`/tasks/${id}`, { method: 'DELETE' }),
};

// ============== AI API ==============

export const aiApi = {
  generate: (data: { prompt: string; context?: any; maxTokens?: number }) =>
    apiRequest('/ai/generate', { method: 'POST', body: data }),

  generateBulk: (data: { items: any[]; template: string; context?: any }) =>
    apiRequest('/ai/generate-bulk', { method: 'POST', body: data }),

  suggest: (data: { moduleId: string; fieldName: string; currentValue?: string; context?: any }) =>
    apiRequest('/ai/suggest', { method: 'POST', body: data }),

  analyze: (data: { data: any; analysisType: string }) =>
    apiRequest('/ai/analyze', { method: 'POST', body: data }),
};

// ============== TESTIMONIALS API ==============

export const testimonialApi = {
  // Get all testimonials for a company
  getAll: (companyId: string, filters?: Record<string, any>) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const queryString = params.toString();
    return apiRequest(`/testimonials/${companyId}${queryString ? `?${queryString}` : ''}`);
  },

  // Get single testimonial
  getById: (id: string) =>
    apiRequest(`/testimonials/detail/${id}`),

  // Create testimonial
  create: (data: Record<string, any>) =>
    apiRequest('/testimonials', { method: 'POST', body: data }),

  // Update testimonial
  update: (id: string, data: Record<string, any>) =>
    apiRequest(`/testimonials/${id}`, { method: 'PUT', body: data }),

  // Delete testimonial
  delete: (id: string) =>
    apiRequest(`/testimonials/${id}`, { method: 'DELETE' }),

  // Bulk import testimonials
  bulkImport: (companyId: string, testimonials: any[]) =>
    apiRequest('/testimonials/bulk-import', {
      method: 'POST',
      body: { companyId, testimonials },
    }),

  // Bulk update status
  bulkUpdate: (ids: string[], updates: Record<string, any>) =>
    apiRequest('/testimonials/bulk-update', {
      method: 'PUT',
      body: { ids, updates },
    }),

  // Advanced search
  search: (companyId: string, params: Record<string, any>) => {
    const searchParams = new URLSearchParams({ companyId });
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    return apiRequest(`/testimonials/search?${searchParams.toString()}`);
  },

  // Get dashboard statistics
  getStats: (companyId: string) =>
    apiRequest(`/testimonials/stats/${companyId}`),
};

// ============== FILE UPLOAD API ==============

export const uploadApi = {
  // Upload single file
  uploadFile: async (file: File): Promise<{ url: string; originalName: string; size: number }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }

    return response.json();
  },

  // Upload multiple images
  uploadImages: async (files: File[]): Promise<{ files: { url: string; originalName: string; size: number }[] }> => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));

    const response = await fetch(`${API_URL}/upload/images`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }

    return response.json();
  },
};
