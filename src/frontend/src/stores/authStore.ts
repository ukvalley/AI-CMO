/**
 * Authentication Store
 *
 * Manages user authentication state with API integration
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole, AuthState, Company } from '@/types/entities';
import { authApi } from '@/services/api';
import { useCompanyStore } from './companyStore';
import { useDataStore } from './dataStore';

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
  register: (data: { email: string; password: string; name: string; companyName?: string }) => Promise<{ success: boolean; error?: string }>;
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

            // Set demo company in companyStore
            const companyStore = useCompanyStore.getState();
            companyStore.companies = [{
              id: 'demo-company',
              name: 'Demo Company',
              notificationEmail: 'demo@example.com',
              userIds: ['demo-user'],
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }];
            companyStore.activeCompanyId = 'demo-company';

            // Sync to dataStore
            const dataStore = useDataStore.getState();
            dataStore.setActiveCompany('demo-company');

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

          const responseData = response.data as { token?: string; user?: User; companies?: CompanyInfo[] } | undefined;
          const { token, user, companies } = responseData || {};

          if (token && user) {
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
              token,
              companies: companies || [],
            });

            // Sync companies to companyStore
            if (companies && companies.length > 0) {
              const companyStore = useCompanyStore.getState();
              // Convert CompanyInfo to Company format
              const fullCompanies = companies.map((c: CompanyInfo) => ({
                id: c.id,
                name: c.name,
                notificationEmail: '',
                userIds: [user.id],
                isActive: c.isActive ?? true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }));
              companyStore.companies = fullCompanies;
              const activeId = user.activeCompanyId || companies[0].id;
              companyStore.setActiveCompany(activeId);

              // Sync to dataStore
              const dataStore = useDataStore.getState();
              dataStore.setActiveCompany(activeId);
            }

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

          const responseData = response.data as { token?: string; user?: User; company?: { id: string; name: string } } | undefined;
          const { token, user, company } = responseData || {};

          if (token && user) {
            const userCompanies = company ? [{ id: company.id, name: company.name, isActive: true }] : [];
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
              token,
              companies: userCompanies,
            });

            // Sync to companyStore
            if (company) {
              const companyStore = useCompanyStore.getState();
              companyStore.companies = [{
                id: company.id,
                name: company.name,
                notificationEmail: '',
                userIds: [user.id],
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }];
              companyStore.activeCompanyId = company.id;

              // Sync to dataStore
              const dataStore = useDataStore.getState();
              dataStore.setActiveCompany(company.id);
            }

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
        // Clear localStorage to prevent stale token issues
        if (typeof window !== 'undefined') {
          localStorage.removeItem('ai-cmo-auth');
          localStorage.removeItem('ai-cmo-companies');
          localStorage.removeItem('ai-cmo-data');
        }
        // Clear dataStore active company
        const dataStore = useDataStore.getState();
        dataStore.setActiveCompany(null as unknown as string);
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

        // Verify user has access to this company
        if (!user.companyIds.includes(companyId)) {
          console.error('User does not have access to company:', companyId);
          return;
        }

        // Update authStore
        set({
          user: {
            ...user,
            activeCompanyId: companyId,
            updatedAt: new Date().toISOString(),
          },
        });

        // Sync to companyStore
        const companyStore = useCompanyStore.getState();
        companyStore.setActiveCompany(companyId);

        // Sync to dataStore
        const dataStore = useDataStore.getState();
        dataStore.setActiveCompany(companyId);

        // API call to persist change (if not demo mode)
        if (token && token !== 'demo-token') {
          try {
            await authApi.switchCompany(companyId);
          } catch (error) {
            console.error('Failed to switch company on server:', error);
          }
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

          const responseData = response.data as { user?: User; companies?: CompanyInfo[] } | undefined;
          const { user, companies } = responseData || {};

          if (user) {
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              companies: companies || [],
            });

            // Sync companies to companyStore
            if (companies && companies.length > 0) {
              const companyStore = useCompanyStore.getState();
              const fullCompanies = companies.map((c: CompanyInfo) => ({
                id: c.id,
                name: c.name,
                notificationEmail: '',
                userIds: [user.id],
                isActive: c.isActive ?? true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }));
              companyStore.companies = fullCompanies;
              if (user.activeCompanyId) {
                companyStore.setActiveCompany(user.activeCompanyId);
              }

              // Sync to dataStore
              const dataStore = useDataStore.getState();
              if (user.activeCompanyId) {
                dataStore.setActiveCompany(user.activeCompanyId);
              }
            }
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
