/**
 * useBrand
 *
 * Hook around the singleton `brand` entity in the data store.
 * Initialises a default Brand record if missing and exposes
 * a typed `update(patch)` that auto-saves via the store.
 */

'use client';

import { useEffect, useMemo } from 'react';
import { useCompanyStore, useDataStore } from '@/stores';
import type { Brand, BrandApprovalEntry } from '@/types/entities';

const DEFAULT_BRAND = (companyId: string): Brand => {
  const now = new Date().toISOString();
  return {
    id: `brand-${Date.now()}`,
    companyId,
    createdAt: now,
    updatedAt: now,

    // visual basics
    primaryColor: '#7C6BF0',
    secondaryColor: '#1E293B',
    accentColor: '#22D3EE',
    headingFont: 'inter',
    bodyFont: 'inter',

    // SOP defaults
    purposeAlignsVision: false,
    purposeAlignsValueProp: false,
    purposeAlignsPositioning: false,
    purposeApprovedByCEO: false,

    personalityPrimary: [],
    personalitySecondary: [],
    personalityApprovedByCEO: false,

    voiceDos: [],
    voiceDonts: [],
    voiceApprovedByCEO: false,
    voiceApprovedByMarketing: false,

    promiseBelievable: false,
    promiseDefensible: false,
    promiseDeliverable: false,
    emotionalApprovedByCEO: false,

    visualInspirationLinks: [],
    visualApprovedByCEO: false,

    diffBrandSymbols: [],
    diffSignatureExpressions: [],
    diffLockedElements: [],
    diffApprovedByCEO: false,

    guardApprovedByCEO: false,

    alignOnboardingChecklist: [],
    alignLeadershipChecklist: [],
    alignApprovedByHR: false,
    alignApprovedByCEO: false,

    validScalability: 5,
    validCulturalSensitivity: 5,
    validLongevity: 5,
    validFinalLockByCEO: false,

    rulesVoiceForbiddenWords: [],
    rulesDesignForbiddenPatterns: [],

    approvalLog: [],
    masterDocVersion: 0,
  };
};

export function useBrand() {
  const getItems = useDataStore((s) => s.getItems);
  const setItems = useDataStore((s) => s.setItems);
  const setDataActiveCompany = useDataStore((s) => s.setActiveCompany);
  const dataActiveId = useDataStore((s) => s.activeCompanyId);

  // Source of truth for active company is the company store (has DEMO_COMPANY by default).
  // We sync it into the data store so getItems/setItems work.
  const companyActiveId = useCompanyStore((s) => s.activeCompanyId);
  const activeCompanyId = dataActiveId ?? companyActiveId;

  // One-shot sync: when companyStore has a company but dataStore doesn't, mirror it across.
  useEffect(() => {
    if (companyActiveId && companyActiveId !== dataActiveId) {
      setDataActiveCompany(companyActiveId);
    }
  }, [companyActiveId, dataActiveId, setDataActiveCompany]);

  // re-render whenever brand data slice changes
  const brandFromStore = useDataStore((s) =>
    activeCompanyId ? s.data[activeCompanyId]?.brand ?? null : null
  );

  // Stable in-memory fallback — keyed by company so id stays consistent until persisted
  const fallback = useMemo<Brand | null>(
    () => (activeCompanyId ? DEFAULT_BRAND(activeCompanyId) : null),
    [activeCompanyId]
  );

  // Brand is never null when a company is active — the form shows defaults
  // and any edit triggers `update()` which seeds the store automatically.
  const brand: Brand | null = brandFromStore ?? fallback;

  const ensureBrand = (): Brand => {
    if (!activeCompanyId) {
      throw new Error('No active company. Pick a company first.');
    }
    // Make sure the data store knows about this company before mutating it
    if (dataActiveId !== activeCompanyId) {
      setDataActiveCompany(activeCompanyId);
    }
    const existing = getItems('brand') as Brand | null;
    if (existing) return existing;
    const seeded = DEFAULT_BRAND(activeCompanyId);
    setItems('brand', seeded);
    return seeded;
  };

  const update = (patch: Partial<Brand>) => {
    if (!activeCompanyId) return;
    if (dataActiveId !== activeCompanyId) {
      setDataActiveCompany(activeCompanyId);
    }
    const current = (getItems('brand') as Brand | null) ?? ensureBrand();
    const next: Brand = {
      ...current,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    setItems('brand', next);
  };

  const logApproval = (entry: Omit<BrandApprovalEntry, 'id' | 'timestamp'>) => {
    const current = (getItems('brand') as Brand | null) ?? ensureBrand();
    const log = current.approvalLog ?? [];
    const newEntry: BrandApprovalEntry = {
      ...entry,
      id: `approval-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    update({ approvalLog: [newEntry, ...log] });
  };

  return { brand, update, ensureBrand, logApproval, activeCompanyId };
}
