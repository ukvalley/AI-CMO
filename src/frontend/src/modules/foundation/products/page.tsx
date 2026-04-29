/**
 * Products Module
 *
 * Product catalog with categories, pricing, and marketing copy.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { ModulePage } from '@/components/shared';
import { FormField } from '@/components/shared/UniversalForm';
import { TableColumn } from '@/components/shared/UniversalTable';
import { productApi, categoryApi } from '@/services/api';
import { useAuthStore } from '@/stores';
import type { Product, ProductCategory, ProductStatus, AudienceType } from '@/types/entities';
import { formatCurrency } from '@/utils/spelling';

// ============================================
// TABLE COLUMNS
// ============================================

function useColumns(categories: ProductCategory[]): TableColumn<Product>[] {
  return [
    {
      key: 'name',
      header: 'Product Name',
      sortable: true,
    },
    {
      key: 'categoryId',
      header: 'Category',
      sortable: true,
      render: (value) => {
        const category = categories.find((c) => c.id === value);
        return category?.name || 'Uncategorised';
      },
    },
    {
      key: 'price',
      header: 'Price',
      sortable: true,
      align: 'right',
      render: (value) => {
        if (!value) return '-';
        return formatCurrency(value as number);
      },
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      filterable: true,
      filterOptions: [
        { value: 'active', label: 'Active' },
        { value: 'draft', label: 'Draft' },
        { value: 'discontinued', label: 'Discontinued' },
      ],
      render: (value) => {
        const colors: Record<string, string> = {
          active: 'bg-green-500/20 text-green-400 border-green-500/50',
          draft: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
          discontinued: 'bg-red-500/20 text-red-400 border-red-500/50',
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs border ${colors[value as string] || colors.draft}`}>
            {(value as string)?.charAt(0).toUpperCase() + (value as string)?.slice(1)}
          </span>
        );
      },
    },
    {
      key: 'audienceType',
      header: 'Audience',
      sortable: true,
      filterable: true,
      filterOptions: [
        { value: 'b2b', label: 'B2B' },
        { value: 'b2c', label: 'B2C' },
        { value: 'both', label: 'Both' },
      ],
      render: (value) => {
        const labels: Record<string, string> = {
          b2b: 'B2B',
          b2c: 'B2C',
          both: 'B2B + B2C',
        };
        return labels[value as string] || value;
      },
    },
  ];
}

// ============================================
// FORM FIELDS
// ============================================

function useFormFields(categories: ProductCategory[]): FormField[] {
  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  return [
    { key: 'name', label: 'Product Name', type: 'text', required: true },
    {
      key: 'categoryId',
      label: 'Category',
      type: 'select',
      options: categoryOptions.length > 0 ? categoryOptions : [{ value: '', label: 'No categories' }],
      required: true,
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'draft', label: 'Draft' },
        { value: 'discontinued', label: 'Discontinued' },
      ],
      required: true,
    },
    {
      key: 'audienceType',
      label: 'Target Audience',
      type: 'select',
      options: [
        { value: 'b2b', label: 'B2B (Business)' },
        { value: 'b2c', label: 'B2C (Consumer)' },
        { value: 'both', label: 'Both' },
      ],
      required: true,
    },
    {
      key: 'price',
      label: 'Price',
      type: 'number',
      min: 0,
      helperText: 'Leave empty for "Contact us" pricing',
    },
    {
      key: 'usp',
      label: 'Unique Selling Proposition (USP)',
      type: 'textarea',
      rows: 3,
      aiGenerate: true,
      colSpan: 2,
    },
    {
      key: 'description',
      label: 'Product Description',
      type: 'textarea',
      rows: 4,
      aiGenerate: true,
      colSpan: 2,
    },
    {
      key: 'features',
      label: 'Key Features',
      type: 'textarea',
      rows: 3,
      helperText: 'Enter each feature on a new line',
      aiGenerate: true,
      colSpan: 2,
    },
    {
      key: 'marketingCopy',
      label: 'Marketing Copy',
      type: 'textarea',
      rows: 5,
      aiGenerate: true,
      helperText: 'Short-form copy for ads, social media, etc.',
      colSpan: 2,
    },
  ];
}

// ============================================
// PRODUCTS PAGE
// ============================================

export default function ProductsPage() {
  const { user } = useAuthStore();
  const companyId = user?.activeCompanyId;

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from API
  useEffect(() => {
    if (!companyId) {
      setProducts([]);
      setCategories([]);
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      setIsLoading(true);

      const [productsRes, categoriesRes] = await Promise.all([
        productApi.getAll(companyId),
        categoryApi.getAll(companyId),
      ]);

      if (productsRes.data) setProducts(productsRes.data);
      if (categoriesRes.data) setCategories(categoriesRes.data);

      setIsLoading(false);
    };

    loadData();
  }, [companyId]);

  const columns = useColumns(categories);
  const formFields = useFormFields(categories);

  const handleCreate = async (data: Record<string, unknown>) => {
    if (!companyId) return;

    const featuresText = data.features as string;
    const features = featuresText
      ? featuresText.split('\n').filter((f) => f.trim() !== '')
      : [];

    const response = await productApi.create({
      ...data,
      features,
      companyId,
    });

    if (response.data) {
      setProducts((prev) => [...prev, response.data as Product]);
    }
  };

  const handleUpdate = async (id: string, data: Partial<Product>) => {
    const featuresText = data.features as unknown as string;
    if (typeof featuresText === 'string') {
      data.features = featuresText.split('\n').filter((f) => f.trim() !== '');
    }

    const response = await productApi.update(id, data);

    if (response.data) {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...response.data } : p))
      );
    }
  };

  const handleDelete = async (id: string) => {
    const response = await productApi.delete(id);
    if (!response.error) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  if (!companyId) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Please select a company to view products.</p>
      </div>
    );
  }

  return (
    <ModulePage
      moduleId="products"
      columns={columns}
      fields={formFields}
      data={products}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
    />
  );
}
