/**
 * useBlogSystem
 *
 * Singleton hook for the 20-module Blog System tracker.
 * Mirrors useWebsiteProject — same store + section data shape, different slot.
 */

'use client';

import { useEffect, useMemo } from 'react';
import { useCompanyStore, useDataStore } from '@/stores';
import type {
  BlogSystem,
  BrandApprovalEntry,
  BrandApproverRole,
  WebsiteSectionData,
  WebsiteSectionState,
  WebsiteSectionStatus,
} from '@/types/entities';

const DEFAULT_BLOG_SYSTEM = (companyId: string): BlogSystem => {
  const now = new Date().toISOString();
  return {
    id: `blog-system-${Date.now()}`,
    companyId,
    createdAt: now,
    updatedAt: now,
    name: '',
    client: '',
    sections: {},
    approvalLog: [],
    masterDocVersion: 0,
  };
};

export function useBlogSystem() {
  const getItems = useDataStore((s) => s.getItems);
  const setItems = useDataStore((s) => s.setItems);
  const setDataActiveCompany = useDataStore((s) => s.setActiveCompany);
  const dataActiveId = useDataStore((s) => s.activeCompanyId);

  const companyActiveId = useCompanyStore((s) => s.activeCompanyId);
  const activeCompanyId = dataActiveId ?? companyActiveId;

  useEffect(() => {
    if (companyActiveId && companyActiveId !== dataActiveId) {
      setDataActiveCompany(companyActiveId);
    }
  }, [companyActiveId, dataActiveId, setDataActiveCompany]);

  const fromStore = useDataStore((s) =>
    activeCompanyId ? s.data[activeCompanyId]?.blogSystem ?? null : null
  );

  const fallback = useMemo<BlogSystem | null>(
    () => (activeCompanyId ? DEFAULT_BLOG_SYSTEM(activeCompanyId) : null),
    [activeCompanyId]
  );

  const project: BlogSystem | null = fromStore ?? fallback;

  const ensureProject = (): BlogSystem => {
    if (!activeCompanyId) {
      throw new Error('No active company. Pick a company first.');
    }
    if (dataActiveId !== activeCompanyId) {
      setDataActiveCompany(activeCompanyId);
    }
    const existing = getItems('blogSystem') as BlogSystem | null;
    if (existing) return existing;
    const seeded = DEFAULT_BLOG_SYSTEM(activeCompanyId);
    setItems('blogSystem', seeded);
    return seeded;
  };

  const updateRoot = (patch: Partial<BlogSystem>) => {
    if (!activeCompanyId) return;
    if (dataActiveId !== activeCompanyId) {
      setDataActiveCompany(activeCompanyId);
    }
    const current = (getItems('blogSystem') as BlogSystem | null) ?? ensureProject();
    setItems('blogSystem', {
      ...current,
      ...patch,
      updatedAt: new Date().toISOString(),
    });
  };

  const updateField = (sectionId: string, fieldKey: string, value: WebsiteSectionData[string]) => {
    const current = (getItems('blogSystem') as BlogSystem | null) ?? ensureProject();
    const sections = current.sections ?? {};
    const existing = sections[sectionId] ?? {};
    const next: WebsiteSectionState = {
      ...existing,
      data: { ...(existing.data ?? {}), [fieldKey]: value },
    };
    updateRoot({ sections: { ...sections, [sectionId]: next } });
  };

  const updateSection = (sectionId: string, patch: Partial<WebsiteSectionState>) => {
    const current = (getItems('blogSystem') as BlogSystem | null) ?? ensureProject();
    const sections = current.sections ?? {};
    const existing = sections[sectionId] ?? {};
    updateRoot({
      sections: { ...sections, [sectionId]: { ...existing, ...patch } },
    });
  };

  const setStatus = (sectionId: string, status: WebsiteSectionStatus) =>
    updateSection(sectionId, { status });

  const toggleApproval = (
    sectionId: string,
    approver: BrandApproverRole = 'CEO',
    sectionTitle?: string
  ) => {
    const current = (getItems('blogSystem') as BlogSystem | null) ?? ensureProject();
    const sections = current.sections ?? {};
    const existing = sections[sectionId] ?? {};
    const next = !existing.approved;
    updateSection(sectionId, {
      approved: next,
      approvedAt: next ? new Date().toISOString() : undefined,
    });
    if (next) {
      const log = current.approvalLog ?? [];
      const entry: BrandApprovalEntry = {
        id: `blog-approval-${Date.now()}`,
        role: approver,
        approver,
        section: sectionTitle ?? sectionId,
        timestamp: new Date().toISOString(),
      };
      updateRoot({ approvalLog: [entry, ...log] });
    }
  };

  return {
    project,
    activeCompanyId,
    ensureProject,
    updateRoot,
    updateField,
    updateSection,
    setStatus,
    toggleApproval,
  };
}
