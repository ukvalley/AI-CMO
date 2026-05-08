/**
 * Products Module
 *
 * Product catalog with categories, pricing, and marketing copy.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Package, Tags, Box } from 'lucide-react';
import { ModulePage } from '@/components/shared';
import { FormField } from '@/components/shared/UniversalForm';
import { TableColumn } from '@/components/shared/UniversalTable';
import { productApi, categoryApi } from '@/services/api';
import { useAuthStore, useCompanyStore } from '@/stores';
import type { Product, ProductCategory, ProductStatus, AudienceType } from '@/types/entities';
import { formatCurrency } from '@/utils/spelling';
import { Button } from '@/components/ui/Button';

// ============================================
// PRODUCT TABLE COLUMNS
// ============================================

function useProductColumns(categories: ProductCategory[]): TableColumn<Product>[] {
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
        if (!value || !category) {
          return (
            <span className="text-[#686f7e] italic text-sm">
              Uncategorised
            </span>
          );
        }
        return (
          <span className="px-2 py-1 text-xs bg-[#C8FF2E]/10 text-[#C8FF2E] rounded-full border border-[#C8FF2E]/30">
            {category.name}
          </span>
        );
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
      render: (value, _row) => {
        const labels: Record<string, string> = {
          b2b: 'B2B',
          b2c: 'B2C',
          both: 'B2B + B2C',
        };
        return (labels[value as string] || value) as React.ReactNode;
      },
    },
    {
      key: 'resources',
      header: 'Resources',
      align: 'center',
      render: (_value, row) => {
        const hasImages = (row.images?.length || 0) > 0;
        const hasPdf = !!row.catalogPdfUrl;
        const hasVideos = (row.videoUrls?.length || 0) > 0;
        const count = (hasImages ? 1 : 0) + (hasPdf ? 1 : 0) + (hasVideos ? 1 : 0);

        if (count === 0) {
          return (
            <span className="text-[#686f7e] text-xs">-</span>
          );
        }

        return (
          <div className="flex items-center justify-center gap-1.5">
            {hasImages && (
              <svg className="w-4 h-4 text-[#C8FF2E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
            {hasPdf && (
              <svg className="w-4 h-4 text-[#C8FF2E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            )}
            {hasVideos && (
              <svg className="w-4 h-4 text-[#C8FF2E]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
            <span className="text-xs text-[#878e9a] ml-1">{count}</span>
          </div>
        );
      },
    },
  ];
}

// ============================================
// PRODUCT FORM FIELDS
// ============================================

function useProductFormFields(categories: ProductCategory[]): FormField[] {
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
      options: categoryOptions.length > 0 ? categoryOptions : [{ value: '', label: 'No categories available' }],
      helperText: categoryOptions.length === 0 ? 'Create a category in the Categories tab first' : undefined,
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
      type: 'tags',
      placeholder: 'Add a feature and press Enter',
      helperText: 'Press Enter or comma to add a feature',
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
    {
      key: 'section-media',
      label: 'Product Media & Resources',
      type: 'section-header',
      colSpan: 2,
    },
    {
      key: 'images',
      label: 'Product Images',
      type: 'image-gallery',
      placeholder: 'Enter image URL (e.g., https://example.com/image.jpg)',
      helperText: 'Add multiple product images by entering URLs',
      colSpan: 2,
    },
    {
      key: 'catalogPdfUrl',
      label: 'Product Catalog PDF',
      type: 'pdf-upload',
      placeholder: 'Enter Canva/Figma PDF URL...',
      helperText: 'Upload PDF or paste Canva/Figma PDF link',
      colSpan: 2,
    },
    {
      key: 'videoUrls',
      label: 'Product Videos',
      type: 'video-urls',
      placeholder: 'Enter YouTube or Vimeo video URL...',
      helperText: 'Add product demo videos, tutorials, or promotional videos',
      colSpan: 2,
    },
    {
      key: 'designUrl',
      label: 'Canva/Figma Design',
      type: 'design-url',
      placeholder: 'Enter Canva or Figma design link...',
      helperText: 'Link to editable design file for marketing team',
      colSpan: 2,
    },
  ];
}

// ============================================
// CATEGORY TABLE COLUMNS
// ============================================

function useCategoryColumns(products: Product[]): TableColumn<ProductCategory>[] {
  return [
    {
      key: 'name',
      header: 'Category Name',
      sortable: true,
    },
    {
      key: 'description',
      header: 'Description',
      render: (value) => value ? String(value).slice(0, 60) + (String(value).length > 60 ? '...' : '') : '-',
    },
    {
      key: 'productCount',
      header: 'Products',
      align: 'right',
      render: (_value, row) => {
        const count = products.filter((p) => p.categoryId === row.id).length;
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${
            count > 0
              ? 'bg-[#C8FF2E]/10 text-[#C8FF2E] border border-[#C8FF2E]/30'
              : 'bg-[#21262d] text-[#686f7e] border border-white/10'
          }`}>
            {count} product{count !== 1 ? 's' : ''}
          </span>
        );
      },
    },
  ];
}

// ============================================
// CATEGORY FORM FIELDS
// ============================================

const categoryFormFields: FormField[] = [
  {
    key: 'name',
    label: 'Category Name',
    type: 'text',
    required: true,
    placeholder: 'e.g., Software, Services, Consulting',
  },
  {
    key: 'description',
    label: 'Description',
    type: 'textarea',
    rows: 3,
    colSpan: 2,
    placeholder: 'Brief description of this category...',
  },
];

// ============================================
// PRODUCTS PAGE
// ============================================

export default function ProductsPage() {
  const { user } = useAuthStore();
  const { activeCompanyId: storeCompanyId } = useCompanyStore();
  const companyId = user?.activeCompanyId || storeCompanyId;

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');

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

      if (productsRes.data) setProducts(productsRes.data as Product[]);
      if (categoriesRes.data) setCategories(categoriesRes.data as ProductCategory[]);

      setIsLoading(false);
    };

    loadData();
  }, [companyId]);

  // Product handlers
  const handleProductCreate = async (data: Record<string, unknown>) => {
    if (!companyId) return;

    const cleanedData: Record<string, unknown> = { ...data };
    if (cleanedData.categoryId === '' || cleanedData.categoryId === null) {
      delete cleanedData.categoryId;
    }

    const response = await productApi.create({
      ...cleanedData,
      companyId,
    });

    if (response.data) {
      setProducts((prev) => [...prev, response.data as Product]);
    }
  };

  const handleProductUpdate = async (id: string, data: Partial<Product>) => {
    const cleanedData: Partial<Product> = { ...data };
    if (cleanedData.categoryId === '' || cleanedData.categoryId === null) {
      delete cleanedData.categoryId;
    }

    const response = await productApi.update(id, cleanedData);

    if (response.data && (response.data as Product).id) {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...(response.data as Product) } : p))
      );
    }
  };

  const handleProductDelete = async (id: string) => {
    const response = await productApi.delete(id);
    if (!response.error) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // Category handlers
  const handleCategoryCreate = async (data: Record<string, unknown>) => {
    if (!companyId) return;

    const response = await categoryApi.create({
      ...data,
      companyId,
    });

    if (response.data) {
      setCategories((prev) => [...prev, response.data as ProductCategory]);
    }
  };

  const handleCategoryUpdate = async (id: string, data: Partial<ProductCategory>) => {
    const response = await categoryApi.update(id, data);

    if (response.data && (response.data as ProductCategory).id) {
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...(response.data as ProductCategory) } : c))
      );
    }
  };

  const handleCategoryDelete = async (id: string) => {
    // Check if category has products
    const productsInCategory = products.filter((p) => p.categoryId === id).length;
    if (productsInCategory > 0) {
      if (!confirm(`This category has ${productsInCategory} product(s). Deleting will remove the category from these products. Continue?`)) {
        return;
      }
      // Update products to remove category
      setProducts((prev) =>
        prev.map((p) => (p.categoryId === id ? { ...p, categoryId: undefined } : p))
      );
    }

    const response = await categoryApi.delete(id);
    if (!response.error) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
  };

  if (!companyId) {
    return (
      <div className="text-center py-12">
        <p className="text-[#878e9a]">Please select a company to view products.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C8FF2E]"></div>
      </div>
    );
  }

  const productColumns = useProductColumns(categories);
  const productFormFields = useProductFormFields(categories);
  const categoryColumns = useCategoryColumns(products);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-[#C8FF2E] to-[#b3e628] rounded-2xl flex items-center justify-center shadow-lg shadow-[#C8FF2E]/20">
          <Package className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Products</h1>
          <p className="text-[#878e9a]">
            Manage your product catalog and categories
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/10">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'products'
                ? 'text-[#C8FF2E] border-b-2 border-[#C8FF2E]'
                : 'text-[#878e9a] hover:text-white'
            }`}
          >
            <Box className="w-4 h-4" />
            Products
            <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-[#21262d] text-[#878e9a]">
              {products.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'categories'
                ? 'text-[#C8FF2E] border-b-2 border-[#C8FF2E]'
                : 'text-[#878e9a] hover:text-white'
            }`}
          >
            <Tags className="w-4 h-4" />
            Categories
            <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-[#21262d] text-[#878e9a]">
              {categories.length}
            </span>
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'products' ? (
        <ModulePage
          moduleId="products"
          columns={productColumns}
          fields={productFormFields}
          data={products}
          onCreate={handleProductCreate}
          onUpdate={handleProductUpdate}
          onDelete={handleProductDelete}
        />
      ) : (
        <ModulePage
          moduleId="categories"
          columns={categoryColumns}
          fields={categoryFormFields}
          data={categories}
          onCreate={handleCategoryCreate}
          onUpdate={handleCategoryUpdate}
          onDelete={handleCategoryDelete}
        />
      )}
    </div>
  );
}
