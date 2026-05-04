/**
 * API Service
 * Frontend service to connect with backend API
 */

import { useAuthStore } from '@/stores';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

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
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

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
      data = jsonData;
    } else if (!response.ok) {
      return {
        error: response.statusText || 'Request failed',
        status,
      };
    }

    return { data, status };
  } catch (error) {
    console.error('API request failed:', error);
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
