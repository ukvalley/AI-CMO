/**
 * Employees Module
 *
 * Employee management with departments and levels.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { ModulePage } from '@/components/shared';
import { FormField } from '@/components/shared/UniversalForm';
import { TableColumn } from '@/components/shared/UniversalTable';
import { employeeApi } from '@/services/api';
import { useAuthStore, useCompanyStore } from '@/stores';
import type { Employee, Department, EmployeeLevel } from '@/types/entities';

// ============================================
// TABLE COLUMNS
// ============================================

const columns: TableColumn<Employee>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'title', header: 'Title', sortable: true },
  {
    key: 'department',
    header: 'Department',
    sortable: true,
    filterable: true,
    filterOptions: [
      { value: 'engineering', label: 'Engineering' },
      { value: 'marketing', label: 'Marketing' },
      { value: 'sales', label: 'Sales' },
      { value: 'design', label: 'Design' },
      { value: 'hr', label: 'HR' },
      { value: 'finance', label: 'Finance' },
      { value: 'product', label: 'Product' },
    ],
  },
  {
    key: 'level',
    header: 'Level',
    sortable: true,
  },
  { key: 'email', header: 'Email' },
];

// ============================================
// FORM FIELDS
// ============================================

const formFields: FormField[] = [
  { key: 'name', label: 'Full Name', type: 'text', required: true },
  { key: 'title', label: 'Title', type: 'text' },
  {
    key: 'department',
    label: 'Department',
    type: 'select',
    options: [
      { value: 'engineering', label: 'Engineering' },
      { value: 'marketing', label: 'Marketing' },
      { value: 'sales', label: 'Sales' },
      { value: 'design', label: 'Design' },
      { value: 'operations', label: 'Operations' },
      { value: 'hr', label: 'HR' },
      { value: 'finance', label: 'Finance' },
      { value: 'customer-success', label: 'Customer Success' },
      { value: 'product', label: 'Product' },
      { value: 'legal', label: 'Legal' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    key: 'level',
    label: 'Level',
    type: 'select',
    options: [
      { value: 'intern', label: 'Intern' },
      { value: 'junior', label: 'Junior' },
      { value: 'mid', label: 'Mid' },
      { value: 'senior', label: 'Senior' },
      { value: 'lead', label: 'Lead' },
      { value: 'manager', label: 'Manager' },
      { value: 'director', label: 'Director' },
      { value: 'vp', label: 'VP' },
      { value: 'c-suite', label: 'C-Suite' },
    ],
  },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'phone', label: 'Phone', type: 'tel' },
  { key: 'city', label: 'City', type: 'text' },
  { key: 'country', label: 'Country', type: 'text' },
  { key: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
  { key: 'workAnniversary', label: 'Work Anniversary', type: 'date' },
  {
    key: 'bio',
    label: 'Bio',
    type: 'textarea',
    rows: 4,
    aiGenerate: true,
    colSpan: 2,
  },
  {
    key: 'socialProfiles',
    label: 'Social Profiles',
    type: 'social-grid',
    colSpan: 2,
  },
  {
    key: 'section-photos',
    label: 'Photos & Media',
    type: 'section-header',
    colSpan: 2,
  },
  {
    key: 'photos',
    label: 'Employee Photos',
    type: 'image-gallery',
    placeholder: 'Upload photos or add Canva/Figma URLs...',
    helperText: 'Add multiple photos (headshots, team photos, event photos)',
    colSpan: 2,
  },
  {
    key: 'driveLink',
    label: 'Google Drive Link',
    type: 'url',
    placeholder: 'https://drive.google.com/drive/folders/...',
    helperText: 'Link to Google Drive folder with additional photos/videos',
    colSpan: 2,
  },
];

// ============================================
// EMPLOYEES PAGE
// ============================================

export default function EmployeesPage() {
  const { user } = useAuthStore();
  const { activeCompanyId: storeCompanyId } = useCompanyStore();
  const companyId = user?.activeCompanyId || storeCompanyId;

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from API
  useEffect(() => {
    if (!companyId) {
      setEmployees([]);
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      setIsLoading(true);
      const response = await employeeApi.getAll(companyId);
      if (response.data) setEmployees(response.data as Employee[]);
      setIsLoading(false);
    };

    loadData();
  }, [companyId]);

  const handleCreate = async (data: Record<string, unknown>) => {
    if (!companyId) return;

    const response = await employeeApi.create({
      ...data,
      companyId,
    });

    if (response.data) {
      setEmployees((prev) => [...prev, response.data as Employee]);
    }
  };

  const handleUpdate = async (id: string, data: Partial<Employee>) => {
    const response = await employeeApi.update(id, data);
    if (response.data && (response.data as Employee).id) {
      setEmployees((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...(response.data as Employee) } : e))
      );
    }
  };

  const handleDelete = async (id: string) => {
    const response = await employeeApi.delete(id);
    if (!response.error) {
      setEmployees((prev) => prev.filter((e) => e.id !== id));
    }
  };

  if (!companyId) {
    return (
      <div className="text-center py-12">
        <p className="text-[#878e9a]">Please select a company to view employees.</p>
      </div>
    );
  }

  return (
    <ModulePage
      moduleId="employees"
      columns={columns}
      fields={formFields}
      data={employees}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
    />
  );
}
