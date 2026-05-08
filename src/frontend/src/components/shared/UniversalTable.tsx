/**
 * Universal Table Component
 *
 * Shared table component used across all 60+ modules.
 */

'use client';

import React, { useState, useMemo } from 'react';
import { cn } from '@/utils/cn';
import { Search, Filter, ChevronLeft, ChevronRight, Pencil, Trash2, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';

export interface TableColumn<T = unknown> {
  key: string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  filterable?: boolean;
  filterOptions?: { value: string; label: string; count?: number }[];
  render?: (value: unknown, row: T) => React.ReactNode;
}

export interface TableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: TableColumn<T>[];
  moduleName: string;
  searchPlaceholder?: string;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onRowClick?: (item: T) => void;
  actions?: (item: T) => React.ReactNode;
  itemsPerPage?: number;
  showRowNumbers?: boolean;
  className?: string;
}

export function UniversalTable<T extends { id: string } & Record<string, unknown>>({
  data,
  columns,
  moduleName,
  searchPlaceholder = `Search ${moduleName.toLowerCase()}...`,
  onEdit,
  onDelete,
  onRowClick,
  actions,
  itemsPerPage = 10,
  showRowNumbers = true,
  className,
}: TableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [deleteConfirm, setDeleteConfirm] = useState<T | null>(null);

  const filterableColumns = useMemo(
    () => columns.filter((c) => c.filterable && c.filterOptions),
    [columns]
  );

  const processedData = useMemo(() => {
    let result = [...data];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((item) =>
        columns.some((col) => {
          const value = item[col.key];
          if (value == null) return false;
          return String(value).toLowerCase().includes(query);
        })
      );
    }

    Object.entries(activeFilters).forEach(([key, values]) => {
      if (values.length > 0) {
        result = result.filter((item) => {
          const value = item[key];
          if (Array.isArray(value)) {
            return values.some((v) => value.includes(v));
          }
          return values.includes(String(value));
        });
      }
    });

    if (sortKey) {
      result.sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        if (aVal == null) return sortDirection === 'asc' ? 1 : -1;
        if (bVal == null) return sortDirection === 'asc' ? -1 : 1;
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
        }
        return sortDirection === 'asc'
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }

    return result;
  }, [data, searchQuery, activeFilters, sortKey, sortDirection, columns]);

  const totalPages = Math.ceil(processedData.length / itemsPerPage);
  const paginatedData = processedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const toggleFilter = (columnKey: string, value: string) => {
    setActiveFilters((prev) => {
      const current = prev[columnKey] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [columnKey]: updated };
    });
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setActiveFilters({});
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleDelete = (item: T) => {
    if (onDelete) {
      onDelete(item);
    }
    setDeleteConfirm(null);
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#686f7e]" />
            <Input
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 w-full sm:w-80 bg-[#1a1d21] border-white/10 text-white placeholder:text-[#686f7e]"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-[#878e9a]">
            {processedData.length} {moduleName.toLowerCase()}
          </span>
          {(Object.keys(activeFilters).length > 0 || searchQuery) && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-[#878e9a] hover:text-white">
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {filterableColumns.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filterableColumns.map((col) => (
            <React.Fragment key={col.key}>
              {col.filterOptions?.map((option) => {
                const isActive = activeFilters[col.key]?.includes(option.value);
                return (
                  <button
                    key={`${col.key}-${option.value}`}
                    onClick={() => toggleFilter(col.key, option.value)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-sm transition-colors border',
                      isActive
                        ? 'bg-[#C8FF2E]/10 border-[#C8FF2E]/30 text-[#C8FF2E]'
                        : 'bg-[#1a1d21] border-white/10 text-[#878e9a] hover:border-[#C8FF2E]/30'
                    )}
                  >
                    {option.label}
                    {option.count != null && (
                      <span className="ml-1.5 text-xs opacity-70">{option.count}</span>
                    )}
                  </button>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full">
          <thead className="bg-[#151920] border-b border-white/10">
            <tr>
              {showRowNumbers && (
                <th className="px-4 py-3 text-left text-xs font-medium text-[#878e9a] w-12">#</th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'px-4 py-3 text-left text-xs font-medium text-[#878e9a]',
                    col.width && `w-${col.width}`
                  )}
                  style={{ width: col.width }}
                >
                  <div
                    className={cn(
                      'flex items-center gap-1',
                      col.sortable && 'cursor-pointer hover:text-white'
                    )}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    {col.header}
                    {col.sortable && sortKey === col.key && (
                      <ChevronDown className={cn('w-3 h-3', sortDirection === 'asc' && 'rotate-180')} />
                    )}
                  </div>
                </th>
              ))}
              {(onEdit || onDelete || actions) && (
                <th className="px-4 py-3 text-right text-xs font-medium text-[#878e9a] w-24">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    columns.length +
                    (showRowNumbers ? 1 : 0) +
                    (onEdit || onDelete || actions ? 1 : 0)
                  }
                  className="px-4 py-12 text-center text-[#878e9a]"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Filter className="w-8 h-8 text-[#686f7e]" />
                    <p>No {moduleName.toLowerCase()} found</p>
                    {(searchQuery || Object.keys(activeFilters).length > 0) && (
                      <Button variant="ghost" size="sm" onClick={clearFilters}>
                        Clear filters
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => (
                <tr
                  key={item.id}
                  className={cn(
                    'hover:bg-[#1a1d21] transition-colors',
                    index % 2 === 1 && 'bg-[#151920]/50',
                    onRowClick && 'cursor-pointer'
                  )}
                  onClick={() => onRowClick?.(item)}
                >
                  {showRowNumbers && (
                    <td className="px-4 py-3 text-sm text-[#686f7e]">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        'px-4 py-3 text-sm text-[#afb6c4]',
                        col.align === 'center' && 'text-center',
                        col.align === 'right' && 'text-right'
                      )}
                    >
                      {col.render
                        ? col.render(item[col.key], item)
                        : item[col.key] != null
                        ? String(item[col.key])
                        : '-'}
                    </td>
                  ))}
                  {(onEdit || onDelete || actions) && (
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {actions?.(item)}
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 text-[#878e9a] hover:text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(item);
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 text-red-400 hover:text-red-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirm(item);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-[#878e9a]">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, processedData.length)} of{' '}
            {processedData.length} results
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-[#878e9a]">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Confirm Delete"
        description={`Are you sure you want to delete this ${moduleName.toLowerCase().slice(0, -1)}? This action cannot be undone.`}
        footer={
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>
              Delete
            </Button>
          </div>
        }
      >
        {null}
      </Modal>
    </div>
  );
}
