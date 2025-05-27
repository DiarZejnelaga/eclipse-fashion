'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
}

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

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const checkUserSession = useCallback(async (calledFrom = "unknown") => {
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
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user as User);
        return { success: true, user: data.user as User, message: data.message || 'Login successful!' };
      } else {
        setUser(null);
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error: any) {
      setUser(null);
      return { success: false, message: error.message || 'An unexpected error occurred during login.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      setUser(null);
    } catch (error: any) {
      console.error(error.message);
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
      const data = await res.json();
      if (res.ok && data.user && data.user.id) {
        return { success: true, userId: data.user.id, message: data.message || 'Registration successful!' };
      } else if (res.ok && data.userId) {
        return { success: true, userId: data.userId, message: data.message || 'Registration successful!' };
      } else {
        return { success: false, message: data.message || 'Registration failed' };
      }
    } catch (error: any) {
      return { success: false, message: error.message || 'An unexpected error occurred during registration.' };
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
      const data = await res.json();
      if (res.ok) {
        return { success: true, message: data.message || 'If an account with that email exists, a password reset link has been sent.' };
      } else {
        return { success: false, message: data.message || 'If an account with that email exists, a password reset link has been sent.' };
      }
    } catch (error: any) {
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
