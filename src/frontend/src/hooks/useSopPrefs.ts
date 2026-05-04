'use client';

/**
 * useSopPrefs
 *
 * localStorage-backed preferences for the SOP module:
 *   - favourites — array of pinned SOP ids
 *   - recents    — last 8 viewed SOP ids (most recent first)
 *   - density    — library card density
 */

import { useCallback, useEffect, useState } from 'react';

const FAV_KEY = 'sop:favourites';
const RECENT_KEY = 'sop:recents';
const DENSITY_KEY = 'sop:density';
const VIEWS_KEY = 'sop:views';

const MAX_RECENTS = 8;

export type SopDensity = 'comfy' | 'compact';

export interface SopSavedView {
  id: string;
  name: string;
  search?: string;
  status?: string;
  category?: string;
  priority?: string;
  favsOnly?: boolean;
}

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota / privacy errors
  }
}

export function useSopPrefs() {
  const [favourites, setFavourites] = useState<string[]>([]);
  const [recents, setRecents] = useState<string[]>([]);
  const [density, setDensityState] = useState<SopDensity>('comfy');
  const [savedViews, setSavedViews] = useState<SopSavedView[]>([]);

  // Hydrate after mount to avoid SSR mismatch
  useEffect(() => {
    setFavourites(readJSON<string[]>(FAV_KEY, []));
    setRecents(readJSON<string[]>(RECENT_KEY, []));
    setDensityState(readJSON<SopDensity>(DENSITY_KEY, 'comfy'));
    setSavedViews(readJSON<SopSavedView[]>(VIEWS_KEY, []));
  }, []);

  const isFavourite = useCallback((id: string) => favourites.includes(id), [favourites]);

  const toggleFavourite = useCallback((id: string) => {
    setFavourites((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      writeJSON(FAV_KEY, next);
      return next;
    });
  }, []);

  const addRecent = useCallback((id: string) => {
    setRecents((prev) => {
      const next = [id, ...prev.filter((x) => x !== id)].slice(0, MAX_RECENTS);
      writeJSON(RECENT_KEY, next);
      return next;
    });
  }, []);

  const clearRecents = useCallback(() => {
    setRecents([]);
    writeJSON(RECENT_KEY, []);
  }, []);

  const setDensity = useCallback((d: SopDensity) => {
    setDensityState(d);
    writeJSON(DENSITY_KEY, d);
  }, []);

  const saveView = useCallback((view: Omit<SopSavedView, 'id'>) => {
    const newView: SopSavedView = { ...view, id: Math.random().toString(36).slice(2, 10) };
    setSavedViews((prev) => {
      const next = [...prev, newView];
      writeJSON(VIEWS_KEY, next);
      return next;
    });
    return newView;
  }, []);

  const deleteView = useCallback((id: string) => {
    setSavedViews((prev) => {
      const next = prev.filter((v) => v.id !== id);
      writeJSON(VIEWS_KEY, next);
      return next;
    });
  }, []);

  return {
    favourites,
    recents,
    density,
    savedViews,
    isFavourite,
    toggleFavourite,
    addRecent,
    clearRecents,
    setDensity,
    saveView,
    deleteView,
  };
}
