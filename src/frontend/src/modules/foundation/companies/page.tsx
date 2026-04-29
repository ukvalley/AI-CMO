/**
 * Companies Module
 *
 * Company management - create, select, switch between companies.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Plus,
  Check,
  Settings,
  Users,
  LogOut,
  ChevronRight,
  AlertCircle,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Logo } from '@/components/ui/Logo';
import { Modal } from '@/components/ui/Modal';
import { useAuthStore } from '@/stores';
import { companyApi } from '@/services/api';
import type { Company } from '@/types/entities';

// ============================================
// COMPANIES PAGE
// ============================================

export default function CompaniesPage() {
  const router = useRouter();
  const { user, logout, switchCompany, setUser } = useAuthStore();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load companies
  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    setIsLoading(true);
    const response = await companyApi.getAll();
    if (response.data) {
      setCompanies(response.data);
    }
    setIsLoading(false);
  };

  const handleCreateCompany = async (data: { name: string; notificationEmail?: string }) => {
    setError(null);
    const response = await companyApi.create(data);

    if (response.error) {
      setError(response.error);
      return false;
    }

    if (response.data) {
      // Add new company to list
      setCompanies((prev) => [...prev, response.data as Company]);

      // Switch to the new company
      const newCompany = response.data as Company;
      await switchCompany(newCompany.id);

      return true;
    }

    return false;
  };

  const handleSelectCompany = async (companyId: string) => {
    await switchCompany(companyId);
    router.push('/dashboard');
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <Logo size="lg" className="mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-white mb-2">Your Companies</h1>
        <p className="text-slate-400">
          Select a company to work with or create a new one
        </p>
      </div>

      {/* User Info */}
      <div className="flex items-center justify-center gap-4">
        <div className="bg-slate-800/50 rounded-full px-4 py-2 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center">
            <Users className="w-4 h-4 text-primary-400" />
          </div>
          <span className="text-slate-300">{user?.name}</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 text-sm">{user?.email}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Existing Companies */}
        {companies.map((company) => (
          <CompanyCard
            key={company.id}
            company={company}
            isActive={user?.activeCompanyId === company.id}
            onSelect={() => handleSelectCompany(company.id)}
          />
        ))}

        {/* Create New Button */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="group bg-slate-800/30 border-2 border-dashed border-slate-700 rounded-xl p-6 hover:border-primary-500/50 hover:bg-slate-800/50 transition-all"
        >
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center group-hover:bg-primary-500/20 transition-colors">
              <Plus className="w-6 h-6 text-slate-500 group-hover:text-primary-400" />
            </div>
            <div className="text-center">
              <p className="text-white font-medium">Create New Company</p>
              <p className="text-slate-500 text-sm mt-1">Add another organisation</p>
            </div>
          </div>
        </button>
      </div>

      {/* Empty State */}
      {companies.length === 0 && (
        <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-slate-700">
          <Building2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Companies Yet</h3>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">
            Create your first company to start using AI CMO and manage your marketing
          </p>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Company
          </Button>
        </div>
      )}

      {/* Create Company Modal */}
      <CreateCompanyModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setError(null);
        }}
        onCreate={handleCreateCompany}
        error={error}
      />
    </div>
  );
}

// ============================================
// COMPANY CARD
// ============================================

function CompanyCard({
  company,
  isActive,
  onSelect,
}: {
  company: Company;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <Card
      className={`relative group cursor-pointer transition-all ${
        isActive
          ? 'bg-primary-500/10 border-primary-500/50'
          : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
      }`}
      onClick={onSelect}
    >
      {/* Active Badge */}
      {isActive && (
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-500/20 text-primary-400 text-xs rounded-full">
            <Check className="w-3 h-3" />
            Active
          </span>
        </div>
      )}

      <div className="p-6">
        {/* Company Icon */}
        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mb-4">
          <Building2 className="w-6 h-6 text-white" />
        </div>

        {/* Company Info */}
        <h3 className="text-lg font-semibold text-white mb-1">{company.name}</h3>
        {company.notificationEmail && (
          <p className="text-sm text-slate-400 mb-4">{company.notificationEmail}</p>
        )}

        {/* Action */}
        <div className="flex items-center gap-2 text-primary-400 group-hover:text-primary-300">
          <span className="text-sm font-medium">
            {isActive ? 'Continue' : 'Switch'}
          </span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </Card>
  );
}

// ============================================
// CREATE COMPANY MODAL
// ============================================

function CreateCompanyModal({
  isOpen,
  onClose,
  onCreate,
  error,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: { name: string; notificationEmail?: string }) => Promise<boolean>;
  error: string | null;
}) {
  const [name, setName] = useState('');
  const [notificationEmail, setNotificationEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!name.trim()) {
      setValidationError('Company name is required');
      return;
    }

    if (name.length < 2) {
      setValidationError('Company name must be at least 2 characters');
      return;
    }

    setIsSubmitting(true);
    const success = await onCreate({
      name: name.trim(),
      notificationEmail: notificationEmail.trim() || undefined,
    });
    setIsSubmitting(false);

    if (success) {
      setName('');
      setNotificationEmail('');
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Company" size="md">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Error Display */}
        {(error || validationError) && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">{error || validationError}</span>
          </div>
        )}

        {/* Company Name */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Company Name <span className="text-red-400">*</span>
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Acme Inc."
            autoFocus
            required
          />
        </div>

        {/* Notification Email */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Notification Email (Optional)
          </label>
          <Input
            type="email"
            value={notificationEmail}
            onChange={(e) => setNotificationEmail(e.target.value)}
            placeholder="alerts@company.com"
          />
          <p className="text-xs text-slate-500 mt-1">
            Where to send important notifications
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={isSubmitting} className="flex-1">
            Create Company
          </Button>
        </div>
      </form>
    </Modal>
  );
}
