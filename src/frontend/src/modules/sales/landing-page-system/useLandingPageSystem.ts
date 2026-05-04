/**
 * useLandingPageSystem — singleton hook for the 19-module Landing Page tracker.
 * Mirrors useBlogSystem / useWebsiteProject patterns.
 */

'use client';

import { useEffect, useMemo } from 'react';
import { useCompanyStore, useDataStore } from '@/stores';
import type {
  BrandApprovalEntry,
  BrandApproverRole,
  LandingPageSystem,
  WebsiteSectionData,
  WebsiteSectionState,
  WebsiteSectionStatus,
} from '@/types/entities';

const DEFAULT_LP_SYSTEM = (companyId: string): LandingPageSystem => {
  const now = new Date().toISOString();
  return {
    id: `lp-system-${Date.now()}`,
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

export function useLandingPageSystem() {
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
    activeCompanyId ? s.data[activeCompanyId]?.landingPageSystem ?? null : null
  );

  const fallback = useMemo<LandingPageSystem | null>(
    () => (activeCompanyId ? DEFAULT_LP_SYSTEM(activeCompanyId) : null),
    [activeCompanyId]
  );

  const project: LandingPageSystem | null = fromStore ?? fallback;

  const ensureProject = (): LandingPageSystem => {
    if (!activeCompanyId) {
      throw new Error('No active company. Pick a company first.');
    }
    if (dataActiveId !== activeCompanyId) {
      setDataActiveCompany(activeCompanyId);
    }
    const existing = getItems('landingPageSystem') as LandingPageSystem | null;
    if (existing) return existing;
    const seeded = DEFAULT_LP_SYSTEM(activeCompanyId);
    setItems('landingPageSystem', seeded);
    return seeded;
  };

  const updateRoot = (patch: Partial<LandingPageSystem>) => {
    if (!activeCompanyId) return;
    if (dataActiveId !== activeCompanyId) {
      setDataActiveCompany(activeCompanyId);
    }
    const current =
      (getItems('landingPageSystem') as LandingPageSystem | null) ?? ensureProject();
    setItems('landingPageSystem', {
      ...current,
      ...patch,
      updatedAt: new Date().toISOString(),
    });
  };

  const updateField = (sectionId: string, fieldKey: string, value: WebsiteSectionData[string]) => {
    const current =
      (getItems('landingPageSystem') as LandingPageSystem | null) ?? ensureProject();
    const sections = current.sections ?? {};
    const existing = sections[sectionId] ?? {};
    const next: WebsiteSectionState = {
      ...existing,
      data: { ...(existing.data ?? {}), [fieldKey]: value },
    };
    updateRoot({ sections: { ...sections, [sectionId]: next } });
  };

  const updateSection = (sectionId: string, patch: Partial<WebsiteSectionState>) => {
    const current =
      (getItems('landingPageSystem') as LandingPageSystem | null) ?? ensureProject();
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
    const current =
      (getItems('landingPageSystem') as LandingPageSystem | null) ?? ensureProject();
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
        id: `lp-approval-${Date.now()}`,
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
