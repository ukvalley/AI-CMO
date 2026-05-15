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
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        {/* Login Card */}
        <Card padding="lg" className="bg-[#0d1117] border-white/10 shadow-xl">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white">{UILabels.logIn}</h1>
            <p className="text-[#878e9a] mt-2">
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
              leftIcon={<Mail className="w-4 h-4 text-[#686f7e]" />}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              error={errors.email}
              autoComplete="email"
              className="bg-[#1a1d21] border-white/10 text-white placeholder:text-[#686f7e]"
            />

            {/* Password Field */}
            <div className="space-y-1">
              <Input
                id="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
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
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                error={errors.password}
                autoComplete="current-password"
                className="bg-[#1a1d21] border-white/10 text-white placeholder:text-[#686f7e]"
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-white/10 bg-[#1a1d21] text-primary-500 focus:ring-[#C8FF2E]/20"
                />
                <span className="text-sm text-[#878e9a]">Remember me</span>
              </label>

              <Link
                href="/forgot-password"
                className="text-sm font-medium text-[#C8FF2E] hover:text-[#d4ff5c]"
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
              Continue as Guest
            </Button>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[#878e9a]">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="font-medium text-[#C8FF2E] hover:text-[#d4ff5c]"
              >
                Sign up
              </Link>
            </p>
          </div>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-[#686f7e] mt-8">
          &copy; {new Date().getFullYear()} Mengo. All rights reserved.
        </p>
      </div>
    </div>
  );
}
