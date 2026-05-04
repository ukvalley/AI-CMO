/**
 * Company Store
 *
 * Manages multiple companies/organizations, switching, and per-company data.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Company } from '@/types/entities';

interface CompanyState {
  companies: Company[];
  activeCompanyId: string | null;
  isLoading: boolean;
  error: string | null;
}

interface CompanyStore extends CompanyState {
  // Actions
  setCompanies: (companies: Company[]) => void;
  addCompany: (name: string, notificationEmail?: string) => Company;
  updateCompany: (id: string, updates: Partial<Company>) => void;
  deleteCompany: (id: string) => void;
  setActiveCompany: (id: string) => void;
  getActiveCompany: () => Company | undefined;
  getCompanyById: (id: string) => Company | undefined;
  importData: (companyId: string, data: unknown) => void;
  exportData: (companyId: string) => string;
  resetCompanyData: (companyId: string) => void;
}

// Default demo company
const DEMO_COMPANY: Company = {
  id: 'demo-company',
  name: 'Demo Company',
  notificationEmail: 'demo@example.com',
  userIds: ['demo-user'],
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const useCompanyStore = create<CompanyStore>()(
  persist(
    (set, get) => ({
      // Initial state
      companies: [DEMO_COMPANY],
      activeCompanyId: 'demo-company',
      isLoading: false,
      error: null,

      // Actions
      setCompanies: (companies) => {
        set({ companies });
      },

      addCompany: (name, notificationEmail) => {
        const newCompany: Company = {
          id: `company-${Date.now()}`,
          name,
          notificationEmail,
          userIds: [],
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          companies: [...state.companies, newCompany],
          activeCompanyId: newCompany.id,
        }));

        return newCompany;
      },

      updateCompany: (id, updates) => {
        set((state) => ({
          companies: state.companies.map((c) =>
            c.id === id
              ? { ...c, ...updates, updatedAt: new Date().toISOString() }
              : c
          ),
        }));
      },

      deleteCompany: (id) => {
        set((state) => ({
          companies: state.companies.filter((c) => c.id !== id),
          activeCompanyId:
            state.activeCompanyId === id
              ? state.companies.find((c) => c.id !== id)?.id || null
              : state.activeCompanyId,
        }));
      },

      setActiveCompany: (id) => {
        set({ activeCompanyId: id });
      },

      getActiveCompany: () => {
        const { companies, activeCompanyId } = get();
        return companies.find((c) => c.id === activeCompanyId);
      },

      getCompanyById: (id) => {
        return get().companies.find((c) => c.id === id);
      },

      importData: (companyId, data) => {
        // Store data in window.storage for the company
        const storageKey = `ai-cmo-data-${companyId}`;
        if (typeof window !== 'undefined') {
          const win = window as unknown as { storage?: Record<string, string> };
          win.storage = {
            ...win.storage,
            [storageKey]: JSON.stringify(data),
          };
        }
      },

      exportData: (companyId) => {
        const storageKey = `ai-cmo-data-${companyId}`;
        if (typeof window !== 'undefined') {
          const win = window as unknown as { storage?: Record<string, string> };
          const data = win.storage?.[storageKey];
          return data || '{}';
        }
        return '{}';
      },

      resetCompanyData: (companyId) => {
        const storageKey = `ai-cmo-data-${companyId}`;
        if (typeof window !== 'undefined') {
          const win = window as unknown as { storage?: Record<string, string> };
          win.storage = {
            ...win.storage,
            [storageKey]: '{}',
          };
        }
      },
    }),
    {
      name: 'ai-cmo-companies',
      partialize: (state) => ({
        companies: state.companies,
        activeCompanyId: state.activeCompanyId,
      }),
    }
  )
);
