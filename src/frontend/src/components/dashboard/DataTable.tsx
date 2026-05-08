/**
 * Data Table Component (Organism)
 *
 * Full-featured table with sorting, pagination, and row selection.
 */

'use client';

import React from 'react';
import { cn } from '@/utils/cn';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
} from 'lucide-react';
import { Dropdown } from '@/components/ui/Dropdown';

// ============================================
// TYPES
// ============================================

type AlignType = 'left' | 'center' | 'right';

interface TableColumn<T = unknown> {
  key: string;
  header: string;
  width?: string;
  align?: AlignType;
  sortable?: boolean;
  formatter?: (value: unknown, row: T) => React.ReactNode;
}

interface DataTableProps<T = unknown> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  emptyState?: React.ReactNode;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
  };
  sortable?: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  rowSelection?: {
    selectedIds: string[];
    onSelectionChange: (selectedIds: string[]) => void;
    getRowId: (row: T) => string;
  };
}

// ============================================
// COMPONENT
// ============================================

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  loading = false,
  emptyState,
  pagination,
  sortable = true,
  onSort,
  rowSelection,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');

  // Handle column sort
  const handleSort = (key: string) => {
    if (!sortable) return;

    let newDirection: 'asc' | 'desc' = 'asc';
    if (sortKey === key) {
      newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    }

    setSortKey(key);
    setSortDirection(newDirection);
    onSort?.(key, newDirection);
  };

  // Calculate pagination
  const currentPage = pagination?.page || 1;
  const pageSize = pagination?.pageSize || 10;
  const totalPages = pagination ? Math.ceil(pagination.total / pageSize) : 1;

  // Loading skeleton rows
  const skeletonRows = Array.from({ length: 5 }, (_, i) => i);

  // Empty state
  const defaultEmptyState = (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
        <MoreHorizontal className="w-8 h-8 text-neutral-400" />
      </div>
      <h3 className="text-lg font-medium text-neutral-900 mb-1">
        No data available
      </h3>
      <p className="text-sm text-neutral-500">
        There are no items to display at the moment.
      </p>
    </div>
  );

  return (
    <Card padding="none" className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Table Header */}
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              {rowSelection && (
                <th className="px-4 py-3 w-12">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                    checked={
                      rowSelection.selectedIds.length === data.length && data.length > 0
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        rowSelection.onSelectionChange(
                          data.map((row) => rowSelection.getRowId(row))
                        );
                      } else {
                        rowSelection.onSelectionChange([]);
                      }
                    }}
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right',
                    column.width && column.width
                  )}
                >
                  {sortable && column.sortable !== false ? (
                    <button
                      onClick={() => handleSort(column.key)}
                      className="flex items-center gap-1 hover:text-neutral-700 transition-colors group"
                    >
                      {column.header}
                      <span className="flex flex-col">
                        <ChevronUp
                          className={cn(
                            'w-3 h-3 -mb-1',
                            sortKey === column.key && sortDirection === 'asc'
                              ? 'text-primary-600'
                              : 'text-neutral-300 group-hover:text-neutral-400'
                          )}
                        />
                        <ChevronDown
                          className={cn(
                            'w-3 h-3',
                            sortKey === column.key && sortDirection === 'desc'
                              ? 'text-primary-600'
                              : 'text-neutral-300 group-hover:text-neutral-400'
                          )}
                        />
                      </span>
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
              <th className="w-10" />
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-neutral-100">
            {loading ? (
              // Loading skeleton
              skeletonRows.map((i) => (
                <tr key={i}>
                  {rowSelection && (
                    <td className="px-4 py-4">
                      <div className="w-4 h-4 skeleton" />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-4">
                      <div className="h-4 w-full skeleton" />
                    </td>
                  ))}
                  <td />
                </tr>
              ))
            ) : data.length === 0 ? (
              // Empty state
              <tr>
                <td colSpan={columns.length + (rowSelection ? 2 : 1)}>
                  {emptyState || defaultEmptyState}
                </td>
              </tr>
            ) : (
              // Data rows
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-neutral-50/50 transition-colors"
                >
                  {rowSelection && (
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                        checked={rowSelection.selectedIds.includes(
                          rowSelection.getRowId(row)
                        )}
                        onChange={(e) => {
                          const id = rowSelection.getRowId(row);
                          if (e.target.checked) {
                            rowSelection.onSelectionChange([
                              ...rowSelection.selectedIds,
                              id,
                            ]);
                          } else {
                            rowSelection.onSelectionChange(
                              rowSelection.selectedIds.filter((i) => i !== id)
                            );
                          }
                        }}
                      />
                    </td>
                  )}
                  {columns.map((column) => {
                    const value = row[column.key];
                    const formattedValue = column.formatter
                      ? column.formatter(value, row)
                      : String(value);

                    return (
                      <td
                        key={column.key}
                        className={cn(
                          'px-4 py-4 whitespace-nowrap',
                          column.align === 'center' && 'text-center',
                          column.align === 'right' && 'text-right'
                        )}
                      >
                        <span className="text-sm text-neutral-700">
                          {formattedValue}
                        </span>
                      </td>
                    );
                  })}
                  <td className="px-4 py-4">
                    <Dropdown
                      align="right"
                      trigger={
                        <button className="p-1 rounded hover:bg-neutral-100 transition-colors">
                          <MoreHorizontal className="w-4 h-4 text-neutral-400" />
                        </button>
                      }
                      items={[
                        {
                          id: 'view',
                          label: 'View details',
                          onClick: () => console.log('View', row),
                        },
                        {
                          id: 'edit',
                          label: 'Edit',
                          onClick: () => console.log('Edit', row),
                        },
                        { id: 'divider', label: '', divider: true },
                        {
                          id: 'delete',
                          label: 'Delete',
                          onClick: () => console.log('Delete', row),
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-200 bg-neutral-50">
          <div className="text-sm text-neutral-500">
            Showing{' '}
            <span className="font-medium text-neutral-900">
              {(currentPage - 1) * pageSize + 1}
            </span>{' '}
            to{' '}
            <span className="font-medium text-neutral-900">
              {Math.min(currentPage * pageSize, pagination.total)}
            </span>{' '}
            of{' '}
            <span className="font-medium text-neutral-900">
              {pagination.total}
            </span>{' '}
            results
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => pagination.onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              leftIcon={<ChevronLeft className="w-4 h-4" />}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => pagination.onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
