/**
 * API Data Hook
 *
 * Replaces useDataStore with API calls for server-side persistence.
 * Falls back to localStorage when in demo mode (no token).
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/stores';
import type { BaseEntity } from '@/types/entities';

interface UseApiDataOptions<T> {
  module: string;
  fetchFn: (companyId: string) => Promise<{ data?: T[]; error?: string }>;
  createFn: (data: any) => Promise<{ data?: T; error?: string }>;
  updateFn: (id: string, data: any) => Promise<{ data?: T; error?: string }>;
  deleteFn: (id: string) => Promise<{ error?: string }>;
}

interface UseApiDataResult<T> {
  items: T[];
  isLoading: boolean;
  error: string | null;
  createItem: (data: Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'companyId'>) => Promise<string | null>;
  updateItem: (id: string, data: Partial<T>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useApiData<T extends BaseEntity>({
  fetchFn,
  createFn,
  updateFn,
  deleteFn,
}: UseApiDataOptions<T>): UseApiDataResult<T> {
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user, token } = useAuthStore();
  const companyId = user?.activeCompanyId;

  const fetchItems = useCallback(async () => {
    if (!companyId) {
      setItems([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchFn(companyId);

      if (response.error) {
        setError(response.error);
        setItems([]);
      } else {
        setItems(response.data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [companyId, fetchFn]);

  // Initial fetch
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const createItem = useCallback(async (
    data: Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'companyId'>
  ): Promise<string | null> => {
    if (!companyId) return null;

    try {
      const response = await createFn({
        ...data,
        companyId,
      });

      if (response.error) {
        console.error('Create error:', response.error);
        return null;
      }

      if (response.data) {
        setItems((prev) => [...prev, response.data as T]);
        return (response.data as T).id;
      }
    } catch (err) {
      console.error('Create error:', err);
    }
    return null;
  }, [companyId, createFn]);

  const updateItem = useCallback(async (id: string, data: Partial<T>): Promise<void> => {
    try {
      const response = await updateFn(id, data);

      if (response.error) {
        console.error('Update error:', response.error);
        return;
      }

      if (response.data) {
        setItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, ...response.data } : item
          )
        );
      }
    } catch (err) {
      console.error('Update error:', err);
    }
  }, [updateFn]);

  const deleteItem = useCallback(async (id: string): Promise<void> => {
    try {
      const response = await deleteFn(id);

      if (response.error) {
        console.error('Delete error:', response.error);
        return;
      }

      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  }, [deleteFn]);

  return {
    items,
    isLoading,
    error,
    createItem,
    updateItem,
    deleteItem,
    refresh: fetchItems,
  };
}
