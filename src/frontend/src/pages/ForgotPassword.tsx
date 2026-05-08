/**
 * Forgot Password Page
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-[#C8FF2E]-500 to-[#C8FF2E]-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold">AI</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Reset Password</h1>
          <p className="text-[#878e9a] mt-2">Enter your email to reset your password</p>
        </div>

        <div className="bg-[#0d1117] rounded-xl border border-white/10 p-6">
          {submitted ? (
            <div className="text-center py-4">
              <p className="text-[#afb6c4]">Check your email for reset instructions.</p>
              <Link href="/login" className="text-[#C8FF2E]-400 hover:text-[#C8FF2E]-300 mt-4 inline-block">
                Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#afb6c4] mb-1">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <Button type="submit" className="w-full">Send Reset Link</Button>
            </form>
          )}
        </div>

        <p className="text-center text-[#686f7e] mt-6">
          Remember your password?{' '}
          <Link href="/login" className="text-[#C8FF2E]-400 hover:text-[#C8FF2E]-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
