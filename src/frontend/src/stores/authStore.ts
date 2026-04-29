/**
 * Authentication Store
 *
 * Manages user authentication state with API integration
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole, AuthState, Company } from '@/types/entities';
import { authApi } from '@/services/api';

interface CompanyInfo {
  id: string;
  name: string;
  isActive: boolean;
}

interface AuthStore extends AuthState {
  // Extended state
  token: string | null;
  companies: CompanyInfo[];

  // Actions
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { email: string; password: string; name: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  switchCompany: (companyId: string) => Promise<void>;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  loadUser: () => Promise<void>;
  setToken: (token: string | null) => void;
}

// Demo user for development without backend
const DEMO_USER: User = {
  id: 'demo-user',
  email: 'demo@aicmo.com',
  name: 'Demo User',
  role: 'admin',
  companyIds: ['demo-company'],
  activeCompanyId: 'demo-company',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const DEMO_COMPANY: CompanyInfo = {
  id: 'demo-company',
  name: 'Demo Company',
  isActive: true,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      token: null,
      companies: [],

      // Actions
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          // Demo mode: allow empty credentials for quick testing
          if (!email && !password) {
            set({
              user: DEMO_USER,
              isAuthenticated: true,
              isLoading: false,
              error: null,
              token: 'demo-token',
              companies: [DEMO_COMPANY],
            });
            return { success: true };
          }

          // API call
          const response = await authApi.login({ email, password });

          if (response.error) {
            set({
              isLoading: false,
              error: response.error,
            });
            return { success: false, error: response.error };
          }

          const { token, user, companies } = response.data || {};

          if (token && user) {
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
              token,
              companies: companies || [],
            });
            return { success: true };
          } else {
            throw new Error('Invalid response from server');
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          set({
            isLoading: false,
            error: errorMessage,
          });
          return { success: false, error: errorMessage };
        }
      },

      register: async (data: { email: string; password: string; name: string; companyName?: string }) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authApi.register(data);

          if (response.error) {
            set({
              isLoading: false,
              error: response.error,
            });
            return { success: false, error: response.error };
          }

          const { token, user, company } = response.data || {};

          if (token && user) {
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
              token,
              companies: company ? [{ id: company.id, name: company.name, isActive: true }] : [],
            });
            return { success: true };
          } else {
            throw new Error('Invalid response from server');
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Registration failed';
          set({
            isLoading: false,
            error: errorMessage,
          });
          return { success: false, error: errorMessage };
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
          token: null,
          companies: [],
        });
      },

      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },

      setToken: (token) => {
        set({ token });
      },

      updateUser: (updates) => {
        const { user } = get();
        if (user) {
          set({
            user: { ...user, ...updates, updatedAt: new Date().toISOString() },
          });
        }
      },

      switchCompany: async (companyId: string) => {
        const { user, token } = get();
        if (!user) return;

        // Update locally first for immediate feedback
        if (user.companyIds.includes(companyId)) {
          set({
            user: {
              ...user,
              activeCompanyId: companyId,
              updatedAt: new Date().toISOString(),
            },
          });
        }

        // API call to persist change (if not demo mode)
        if (token && token !== 'demo-token') {
          await authApi.switchCompany(companyId);
        }
      },

      hasRole: (role) => {
        const { user } = get();
        if (!user) return false;
        const roles = Array.isArray(role) ? role : [role];
        return roles.includes(user.role);
      },

      loadUser: async () => {
        const { token } = get();
        if (!token || token === 'demo-token') return;

        set({ isLoading: true });

        try {
          const response = await authApi.me();

          if (response.error) {
            // Token invalid, logout
            get().logout();
            return;
          }

          const { user, companies } = response.data || {};

          if (user) {
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              companies: companies || [],
            });
          }
        } catch (error) {
          console.error('Failed to load user:', error);
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'ai-cmo-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        companies: state.companies,
      }),
    }
  )
);
