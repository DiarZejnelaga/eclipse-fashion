'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// Define User interface
interface User {
  id: string;
  email: string;
  name?: string;
}

// Define API response interfaces for better type safety
interface LoginApiResponse {
  user?: User;
  message?: string;
}

interface RegisterApiResponse {
  user?: { id: string; /* other user fields if API returns them */ };
  userId?: string; // If API might send userId directly
  message?: string;
}

interface PasswordResetApiResponse {
  message?: string;
}

// Define AuthContextType
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; message: string }>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<{ success: boolean; userId?: string; message: string }>;
  loading: boolean;
  initialLoading: boolean;
  fetchUser: (calledFrom?: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Helper function to safely get an error message
function getErrorMessage(error: unknown, defaultMessage: string): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string' && error.trim() !== '') {
    return error;
  }
  // Add more specific checks if your API errors have a known structure, e.g.:
  // if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as any).message === 'string') {
  //   return (error as any).message;
  // }
  return defaultMessage;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const checkUserSession = useCallback(async (calledFrom = "unknown") => {
    // In a real app, this would check for a session/token and validate it.
    // For now, it's a placeholder.
    // console.log(`checkUserSession called from: ${calledFrom}`);
    if (calledFrom === "initial load") {
      setUser(null);
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    checkUserSession("initial load");
  }, [checkUserSession]);

  const login = async (email: string, password: string): Promise<{ success: boolean; user?: User; message: string }> => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json() as LoginApiResponse;
      if (res.ok && data.user) {
        setUser(data.user); // Assuming data.user directly matches User interface
        return { success: true, user: data.user, message: data.message || 'Login successful!' };
      } else {
        setUser(null);
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error: unknown) { // Fix: Use unknown type for error
      setUser(null);
      const message = getErrorMessage(error, 'An unexpected error occurred during login.');
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      // Placeholder: If actual API call, e.g., await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
    } catch (error: unknown) { // Fix: Use unknown type for error
      // This catch is more relevant if there's an API call in the try block
      console.error("Logout error:", getErrorMessage(error, "An unexpected error occurred during logout."));
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name?: string): Promise<{ success: boolean; userId?: string; message: string }> => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json() as RegisterApiResponse;
      if (res.ok && data.user && data.user.id) {
        return { success: true, userId: data.user.id, message: data.message || 'Registration successful!' };
      } else if (res.ok && data.userId) { // Handle if API sends userId directly
        return { success: true, userId: data.userId, message: data.message || 'Registration successful!' };
      }
      else {
        return { success: false, message: data.message || 'Registration failed' };
      }
    } catch (error: unknown) { // Fix: Use unknown type for error
      const message = getErrorMessage(error, 'An unexpected error occurred during registration.');
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const requestPasswordReset = async (email: string): Promise<{ success: boolean; message: string }> => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json() as PasswordResetApiResponse;
      if (res.ok) {
        return { success: true, message: data.message || 'If an account with that email exists, a password reset link has been sent.' };
      } else {
        return { success: false, message: data.message || 'Failed to request password reset. Please try again.' };
      }
    } catch (error: unknown) { // Fix: Use unknown type for error
      // Fix: Use the error variable, e.g., by logging it
      console.error("Password reset request error:", getErrorMessage(error, "Details unavailable."));
      return { success: false, message: 'An unexpected error occurred. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const contextValue: AuthContextType = {
    user,
    login,
    logout,
    register,
    loading,
    initialLoading,
    fetchUser: checkUserSession,
    requestPasswordReset,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}