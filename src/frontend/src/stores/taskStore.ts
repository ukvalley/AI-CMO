/**
 * Task Store
 *
 * Manages background tasks for bulk AI generation.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BackgroundTask, TaskStatus, TaskResult } from '@/types/entities';

interface TaskState {
  tasks: BackgroundTask[];
  runningTaskCount: number;
}

interface TaskStore extends TaskState {
  // Actions
  createTask: (name: string, moduleId: string, totalItems: number) => string;
  updateTask: (id: string, updates: Partial<BackgroundTask>) => void;
  completeBatch: (taskId: string, batchIndex: number, items: string[]) => void;
  failBatch: (taskId: string, batchIndex: number, error: string) => void;
  deleteTask: (id: string) => void;
  cancelTask: (id: string) => void;
  getRunningTasks: () => BackgroundTask[];
  getTaskById: (id: string) => BackgroundTask | undefined;
}

const BATCH_SIZE = 10;

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      // Initial state
      tasks: [],
      runningTaskCount: 0,

      // Actions
      createTask: (name, moduleId, totalItems) => {
        const { activeCompanyId } = useCompanyStore.getState();
        const id = `task-${Date.now()}`;

        const batches: TaskResult[] = [];
        const batchCount = Math.ceil(totalItems / BATCH_SIZE);
        for (let i = 0; i < batchCount; i++) {
          batches.push({
            batchIndex: i,
            items: [],
            status: 'running',
          });
        }

        const newTask: BackgroundTask = {
          id,
          name,
          moduleId,
          totalItems,
          completedItems: 0,
          status: 'running',
          results: batches,
          companyId: activeCompanyId || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          tasks: [...state.tasks, newTask],
          runningTaskCount: state.runningTaskCount + 1,
        }));

        return id;
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? { ...t, ...updates, updatedAt: new Date().toISOString() }
              : t
          ),
        }));
      },

      completeBatch: (taskId, batchIndex, items) => {
        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (t.id !== taskId) return t;

            const updatedResults = t.results.map((r) =>
              r.batchIndex === batchIndex
                ? { ...r, items, status: 'completed' as TaskStatus, completedAt: new Date().toISOString() }
                : r
            );

            const completedItems = updatedResults.reduce(
              (sum, r) => sum + (r.status === 'completed' ? r.items.length : 0),
              0
            );

            const allCompleted = updatedResults.every((r) => r.status === 'completed');

            return {
              ...t,
              results: updatedResults,
              completedItems,
              status: allCompleted ? 'completed' : t.status,
              updatedAt: new Date().toISOString(),
            };
          }),
        }));

        // Update running count
        const { tasks } = get();
        const runningCount = tasks.filter((t) => t.status === 'running').length;
        set({ runningTaskCount: runningCount });
      },

      failBatch: (taskId, batchIndex, error) => {
        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (t.id !== taskId) return t;

            const updatedResults = t.results.map((r) =>
              r.batchIndex === batchIndex
                ? { ...r, error, status: 'failed' as TaskStatus }
                : r
            );

            return {
              ...t,
              results: updatedResults,
              status: 'failed',
              error,
              updatedAt: new Date().toISOString(),
            };
          }),
        }));

        // Update running count
        const { tasks } = get();
        const runningCount = tasks.filter((t) => t.status === 'running').length;
        set({ runningTaskCount: runningCount });
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }));
      },

      cancelTask: (id) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, status: 'cancelled' as TaskStatus } : t
          ),
        }));
      },

      getRunningTasks: () => {
        return get().tasks.filter((t) => t.status === 'running');
      },

      getTaskById: (id) => {
        return get().tasks.find((t) => t.id === id);
      },
    }),
    {
      name: 'ai-cmo-tasks',
      partialize: (state) => ({
        tasks: state.tasks.filter((t) => t.status !== 'running'),
      }),
    }
  )
);

// Import reference to company store
import { useCompanyStore } from './companyStore';
