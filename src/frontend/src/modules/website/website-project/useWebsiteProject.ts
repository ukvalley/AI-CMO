/**
 * useWebsiteProject
 *
 * Singleton hook for the 28-module Website Project tracker.
 * Mirrors useBrand: reads/writes through useDataStore, syncs the active
 * company from useCompanyStore, exposes typed update helpers.
 */

'use client';

import { useEffect, useMemo } from 'react';
import { useCompanyStore, useDataStore } from '@/stores';
import type {
  BrandApprovalEntry,
  BrandApproverRole,
  WebsiteProject,
  WebsiteSectionData,
  WebsiteSectionState,
  WebsiteSectionStatus,
} from '@/types/entities';

const DEFAULT_PROJECT = (companyId: string): WebsiteProject => {
  const now = new Date().toISOString();
  return {
    id: `web-project-${Date.now()}`,
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

export function useWebsiteProject() {
  const getItems = useDataStore((s) => s.getItems);
  const setItems = useDataStore((s) => s.setItems);
  const setDataActiveCompany = useDataStore((s) => s.setActiveCompany);
  const dataActiveId = useDataStore((s) => s.activeCompanyId);

  const companyActiveId = useCompanyStore((s) => s.activeCompanyId);
  const activeCompanyId = dataActiveId ?? companyActiveId;

  // Mirror company id from companyStore → dataStore
  useEffect(() => {
    if (companyActiveId && companyActiveId !== dataActiveId) {
      setDataActiveCompany(companyActiveId);
    }
  }, [companyActiveId, dataActiveId, setDataActiveCompany]);

  const projectFromStore = useDataStore((s) =>
    activeCompanyId ? s.data[activeCompanyId]?.websiteProject ?? null : null
  );

  // Stable in-memory fallback so the form is never empty during seeding
  const fallback = useMemo<WebsiteProject | null>(
    () => (activeCompanyId ? DEFAULT_PROJECT(activeCompanyId) : null),
    [activeCompanyId]
  );

  const project: WebsiteProject | null = projectFromStore ?? fallback;

  const ensureProject = (): WebsiteProject => {
    if (!activeCompanyId) {
      throw new Error('No active company. Pick a company first.');
    }
    if (dataActiveId !== activeCompanyId) {
      setDataActiveCompany(activeCompanyId);
    }
    const existing = getItems('websiteProject') as WebsiteProject | null;
    if (existing) return existing;
    const seeded = DEFAULT_PROJECT(activeCompanyId);
    setItems('websiteProject', seeded);
    return seeded;
  };

  const updateRoot = (patch: Partial<WebsiteProject>) => {
    if (!activeCompanyId) return;
    if (dataActiveId !== activeCompanyId) {
      setDataActiveCompany(activeCompanyId);
    }
    const current = (getItems('websiteProject') as WebsiteProject | null) ?? ensureProject();
    setItems('websiteProject', {
      ...current,
      ...patch,
      updatedAt: new Date().toISOString(),
    });
  };

  /** Patch a single field inside one section's `data` map. */
  const updateField = (sectionId: string, fieldKey: string, value: WebsiteSectionData[string]) => {
    const current = (getItems('websiteProject') as WebsiteProject | null) ?? ensureProject();
    const sections = current.sections ?? {};
    const existing = sections[sectionId] ?? {};
    const nextSection: WebsiteSectionState = {
      ...existing,
      data: { ...(existing.data ?? {}), [fieldKey]: value },
    };
    updateRoot({
      sections: { ...sections, [sectionId]: nextSection },
    });
  };

  const updateSection = (
    sectionId: string,
    patch: Partial<WebsiteSectionState>
  ) => {
    const current = (getItems('websiteProject') as WebsiteProject | null) ?? ensureProject();
    const sections = current.sections ?? {};
    const existing = sections[sectionId] ?? {};
    updateRoot({
      sections: {
        ...sections,
        [sectionId]: { ...existing, ...patch },
      },
    });
  };

  const setStatus = (sectionId: string, status: WebsiteSectionStatus) =>
    updateSection(sectionId, { status });

  const toggleApproval = (sectionId: string, approver: BrandApproverRole = 'CEO', sectionTitle?: string) => {
    const current = (getItems('websiteProject') as WebsiteProject | null) ?? ensureProject();
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
        id: `wp-approval-${Date.now()}`,
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
