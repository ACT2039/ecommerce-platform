'use client';

import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import apiClient from '@/lib/api';
import { authTokens } from '@/lib/auth';
import { User, AuthResponse, LoginInput, RegisterInput } from '@/lib/types';

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (credentials: LoginInput) => Promise<User>;
  register: (data: RegisterInput) => Promise<User>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<User>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = authTokens.getAccessToken();
        if (accessToken) {
          // Try to fetch current user
          const response = await apiClient.get<User>('/api/auth/me');
          setUser(response.data);
        }
      } catch (err) {
        // Token is invalid or expired, clear it
        authTokens.clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (credentials: LoginInput): Promise<User> => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await apiClient.post<any>('/api/auth/login', credentials);
      const userData = response.data?.data?.user || response.data?.user;
      const accessToken = response.data?.token || response.data?.accessToken;

      // Store tokens (refresh token comes from httpOnly cookie automatically)
      authTokens.setTokens(accessToken, ''); // Refresh token is httpOnly, we don't store it

      setUser(userData);
      return userData;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterInput): Promise<User> => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await apiClient.post<any>('/api/auth/register', data);
      const userData = response.data?.data?.user || response.data?.user;
      const accessToken = response.data?.token || response.data?.accessToken;

      // Store tokens
      authTokens.setTokens(accessToken, '');

      setUser(userData);
      return userData;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      setIsLoading(true);

      // Call logout endpoint to revoke refresh tokens
      await apiClient.post('/api/auth/logout');
    } catch (err: any) {
      console.error('Logout error:', err);
    } finally {
      // Always clear local state and tokens
      authTokens.clearTokens();
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const fetchCurrentUser = useCallback(async (): Promise<User> => {
    try {
      setError(null);
      const response = await apiClient.get<User>('/api/auth/me');
      setUser(response.data);
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to fetch user';
      setError(message);
      throw new Error(message);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    login,
    register,
    logout,
    fetchCurrentUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
