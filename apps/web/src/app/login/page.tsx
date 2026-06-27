'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { loginSchema, type LoginFormData } from '@/schemas/auth';
import { ZodError } from 'zod';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState<LoginFormData>({
    emailOrPhone: '',
    password: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  // Redirect to original page if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirect = searchParams.get('redirect') || '/';
      router.push(redirect);
    }
  }, [isAuthenticated, router, searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setErrors({});

    try {
      // Validate form data
      loginSchema.parse(formData);

      // Call login
      await login(formData);

      // Redirect to original page or home on success
      const redirect = searchParams.get('redirect') || '/';
      router.push(redirect);
    } catch (error) {
      if (error instanceof ZodError) {
        // Handle validation errors
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else if (error instanceof Error) {
        // Handle API errors
        setApiError(error.message);
      } else {
        setApiError('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 text-white">
      <div className="w-full max-w-md glass-card p-8">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
        <p className="text-gray-300 mb-6">Sign in to your account to continue shopping</p>

        {apiError && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-300 text-sm">{apiError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email or Phone */}
          <div>
            <label htmlFor="emailOrPhone" className="block text-sm font-medium text-gray-300 mb-1">
              Email or Phone
            </label>
            <input
              type="text"
              id="emailOrPhone"
              name="emailOrPhone"
              value={formData.emailOrPhone}
              onChange={handleChange}
              placeholder="john@example.com or +1234567890"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-black/20 text-white ${
                errors.emailOrPhone ? 'border-red-500' : 'border-white/20'
              }`}
              disabled={isLoading}
            />
            {errors.emailOrPhone && (
              <p className="text-red-400 text-sm mt-1">{errors.emailOrPhone}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-black/20 text-white ${
                errors.password ? 'border-red-500' : 'border-white/20'
              }`}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-600 text-white font-bold py-3 rounded-xl transition duration-200 mt-6 shadow-sm border border-emerald-400/50"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center text-gray-300 mt-6">
          Don't have an account?{' '}
          <a href="/register" className="text-white hover:text-emerald-400 font-bold underline transition-colors">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}
