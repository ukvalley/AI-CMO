/**
 * Employees Module
 *
 * Employee management with departments and levels.
 */

'use client';

import React from 'react';
import { ModulePage } from '@/components/shared';
import { FormField } from '@/components/shared/UniversalForm';
import { useDataStore } from '@/stores';
import type { Employee, Department, EmployeeLevel } from '@/types/entities';
import { TableColumn } from '@/components/shared';

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
];

// ============================================
// EMPLOYEES PAGE
// ============================================

export default function EmployeesPage() {
  const { getItems, updateItem, deleteItem } = useDataStore();
  const employees = getItems('employees') as Employee[];

  return (
    <ModulePage
      moduleId="employees"
      columns={columns}
      fields={formFields}
      data={employees}
      onCreate={(data) => {
        const { addItem } = useDataStore.getState();
        addItem('employees', data);
      }}
      onUpdate={(id, data) => {
        updateItem('employees', id, data);
      }}
      onDelete={(id) => {
        deleteItem('employees', id);
      }}
    />
  );
}
