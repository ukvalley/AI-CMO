/**
 * Login Page
 *
 * User authentication with backend API integration.
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';
import { UILabels } from '@/utils/spelling';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Logo } from '@/components/ui/Logo';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/stores';

// ============================================
// COMPONENT
// ============================================

export default function Login() {
  const router = useRouter();
  const { login, isLoading, error: authError } = useAuthStore();

  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [loginError, setLoginError] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
  });

  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!validateForm()) return;

    const result = await login(formData.email, formData.password);

    if (result.success) {
      // Check if user has companies
      const { user } = useAuthStore.getState();
      if (user?.companyIds && user.companyIds.length > 0) {
        router.push('/dashboard');
      } else {
        // Redirect to company creation if no companies
        router.push('/companies');
      }
    } else {
      setLoginError(result.error || 'Login failed');
    }
  };

  // Demo login (for development)
  const handleDemoLogin = async () => {
    setLoginError(null);
    const result = await login('', '');
    if (result.success) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        {/* Login Card */}
        <Card padding="lg" className="bg-slate-900 border-slate-800 shadow-xl">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white">{UILabels.logIn}</h1>
            <p className="text-slate-400 mt-2">
              Welcome back! Please enter your details.
            </p>
          </div>

          {/* Error Message */}
          {(loginError || authError) && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">{loginError || authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
              required
              leftIcon={<Mail className="w-4 h-4 text-slate-500" />}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              error={errors.email}
              autoComplete="email"
              className="bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500"
            />

            {/* Password Field */}
            <div className="space-y-1">
              <Input
                id="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                required
                leftIcon={<Lock className="w-4 h-4 text-slate-500" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-500 hover:text-slate-300 transition-colors"
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
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                error={errors.password}
                autoComplete="current-password"
                className="bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500"
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-primary-500 focus:ring-primary-500/20"
                />
                <span className="text-sm text-slate-400">Remember me</span>
              </label>

              <Link
                href="/forgot-password"
                className="text-sm font-medium text-primary-400 hover:text-primary-300"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
            >
              {UILabels.logIn}
            </Button>
          </form>

          {/* Demo Mode Button */}
          <div className="mt-4">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              fullWidth
              onClick={handleDemoLogin}
              disabled={isLoading}
            >
              Try Demo (No Login Required)
            </Button>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-400">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="font-medium text-primary-400 hover:text-primary-300"
              >
                Sign up
              </Link>
            </p>
          </div>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-slate-500 mt-8">
          &copy; {new Date().getFullYear()} AI CMO. All rights reserved.
        </p>
      </div>
    </div>
  );
}
