/**
 * Register Page
 *
 * User registration with backend API integration.
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Logo } from '@/components/ui/Logo';
import { Eye, EyeOff, Mail, Lock, User, Building2, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuthStore } from '@/stores';

export default function Register() {
  const router = useRouter();
  const { register } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    companyName: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required.';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const result = await register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        companyName: formData.companyName,
      });

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <Logo size="lg" />
          </div>

          <Card padding="lg" className="bg-[#0d1117] border-white/10 shadow-xl text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Account Created!</h1>
            <p className="text-[#878e9a]">
              Welcome to AI CMO. Redirecting you to the dashboard...
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        {/* Register Card */}
        <Card padding="lg" className="bg-[#0d1117] border-white/10 shadow-xl">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white">Create Account</h1>
            <p className="text-[#878e9a] mt-2">
              Get started with AI CMO for free
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <Input
              id="name"
              label="Full Name"
              type="text"
              placeholder="John Doe"
              required
              leftIcon={<User className="w-4 h-4 text-[#686f7e]" />}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={errors.name}
              className="bg-[#1a1d21] border-white/10 text-white placeholder:text-[#686f7e]"
            />

            {/* Email */}
            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              required
              leftIcon={<Mail className="w-4 h-4 text-[#686f7e]" />}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
              autoComplete="email"
              className="bg-[#1a1d21] border-white/10 text-white placeholder:text-[#686f7e]"
            />

            {/* Company Name */}
            <Input
              id="companyName"
              label="Company Name"
              type="text"
              placeholder="Acme Inc."
              required
              leftIcon={<Building2 className="w-4 h-4 text-[#686f7e]" />}
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              error={errors.companyName}
              className="bg-[#1a1d21] border-white/10 text-white placeholder:text-[#686f7e]"
            />

            {/* Password */}
            <div className="space-y-1">
              <Input
                id="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                required
                leftIcon={<Lock className="w-4 h-4 text-[#686f7e]" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#686f7e] hover:text-[#afb6c4] transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                }
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={errors.password}
                autoComplete="new-password"
                className="bg-[#1a1d21] border-white/10 text-white placeholder:text-[#686f7e]"
              />
              <p className="text-xs text-[#686f7e]">
                Must be at least 6 characters
              </p>
            </div>

            {/* Terms */}
            <p className="text-sm text-[#686f7e]">
              By creating an account, you agree to our{' '}
              <Link href="#" className="text-[#C8FF2E] hover:text-[#d4ff5c]">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="#" className="text-[#C8FF2E] hover:text-[#d4ff5c]">
                Privacy Policy
              </Link>
              .
            </p>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
            >
              Create Account
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[#878e9a]">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-medium text-[#C8FF2E] hover:text-[#d4ff5c]"
              >
                Sign in
              </Link>
            </p>
          </div>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-[#686f7e] mt-8">
          &copy; {new Date().getFullYear()} AI CMO. All rights reserved.
        </p>
      </div>
    </div>
  );
}
