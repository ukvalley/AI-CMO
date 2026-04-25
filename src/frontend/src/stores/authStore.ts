/**
 * Authentication Store
 *
 * Manages user authentication state, login/logout, and user profile.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole, AuthState } from '@/types/entities';

interface AuthStore extends AuthState {
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  switchCompany: (companyId: string) => void;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

// Demo user for demo mode
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

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          // Demo mode: allow empty credentials
          if (!email && !password) {
            set({
              user: DEMO_USER,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return;
          }

          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 500));

          // Mock validation
          if (email && password.length >= 6) {
            const user: User = {
              id: `user-${Date.now()}`,
              email,
              name: email.split('@')[0],
              role: 'admin',
              companyIds: ['company-1'],
              activeCompanyId: 'company-1',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            throw new Error('Invalid email or password');
          }
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Login failed',
          });
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },

      updateUser: (updates) => {
        const { user } = get();
        if (user) {
          set({
            user: { ...user, ...updates, updatedAt: new Date().toISOString() },
          });
        }
      },

      switchCompany: (companyId) => {
        const { user } = get();
        if (user && user.companyIds.includes(companyId)) {
          set({
            user: {
              ...user,
              activeCompanyId: companyId,
              updatedAt: new Date().toISOString(),
            },
          });
        }
      },

      hasRole: (role) => {
        const { user } = get();
        if (!user) return false;
        const roles = Array.isArray(role) ? role : [role];
        return roles.includes(user.role);
      },
    }),
    {
      name: 'ai-cmo-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
