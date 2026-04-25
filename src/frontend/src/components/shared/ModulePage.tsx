/**
 * Module Page Component
 *
 * Standardized page layout for all 60+ modules.
 */

'use client';

import React, { useState } from 'react';
import { Plus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { UniversalTable, TableColumn } from './UniversalTable';
import { UniversalForm, FormField } from './UniversalForm';
import { getModuleById } from '@/lib/modules';

type ViewMode = 'list' | 'form' | 'detail';

export interface ModulePageProps<T extends { id: string }> {
  moduleId: string;
  columns: TableColumn<T>[];
  fields: FormField[];
  data: T[];
  onCreate: (data: Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'companyId'>) => void;
  onUpdate: (id: string, data: Partial<T>) => void;
  onDelete: (id: string) => void;
  detailView?: (item: T, onBack: () => void) => React.ReactNode;
  renderActions?: (item: T) => React.ReactNode;
  extraHeader?: React.ReactNode;
}

export function ModulePage<T extends { id: string }>({
  moduleId,
  columns,
  fields,
  data,
  onCreate,
  onUpdate,
  onDelete,
  detailView,
  renderActions,
  extraHeader,
}: ModulePageProps<T>) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  const module = getModuleById(moduleId);

  const handleEdit = (item: T) => {
    setSelectedItem(item);
    setViewMode('form');
  };

  const handleCreate = () => {
    setSelectedItem(null);
    setViewMode('form');
  };

  const handleView = (item: T) => {
    setSelectedItem(item);
    setViewMode('detail');
  };

  const handleBack = () => {
    setSelectedItem(null);
    setViewMode('list');
  };

  const handleSubmit = (formData: Record<string, unknown>) => {
    if (selectedItem) {
      onUpdate(selectedItem.id, formData as Partial<T>);
    } else {
      onCreate(formData as Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'companyId'>);
    }
    setViewMode('list');
    setSelectedItem(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {viewMode !== 'list' && (
            <Button variant="ghost" size="sm" onClick={handleBack} className="text-slate-400 hover:text-slate-200">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-semibold text-white">
              {viewMode === 'form' && selectedItem
                ? `Edit ${module?.name.slice(0, -1) || 'Item'}`
                : viewMode === 'form'
                ? `Add ${module?.name.slice(0, -1) || 'Item'}`
                : module?.name}
            </h1>
            {viewMode === 'list' && <p className="text-sm text-slate-400 mt-0.5">{module?.description}</p>}
          </div>
        </div>

        {viewMode === 'list' && (
          <div className="flex items-center gap-2">
            {extraHeader}
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Add {module?.name.slice(0, -1) || 'Item'}
            </Button>
          </div>
        )}
      </div>

      {viewMode === 'list' && (
        <UniversalTable
          data={data}
          columns={columns}
          moduleName={module?.name || 'Items'}
          onEdit={handleEdit}
          onDelete={(item) => onDelete(item.id)}
          onRowClick={detailView ? handleView : undefined}
          actions={renderActions}
        />
      )}

      {viewMode === 'form' && (
        <div className="max-w-3xl">
          <UniversalForm
            fields={fields}
            initialData={selectedItem || {}}
            onSubmit={handleSubmit}
            onCancel={handleBack}
          />
        </div>
      )}

      {viewMode === 'detail' && selectedItem && detailView && detailView(selectedItem, handleBack)}
    </div>
  );
}
