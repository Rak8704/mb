// lib/auth-client.ts (UPDATED - Add useSession function)
"use client";

import { useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  referralCode?: string | null;
  referredBy?: string | null;
  agentId?: string | null;
}

// MySQL Auth Functions
export async function login(email: string, password: string, rememberMe?: boolean) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, rememberMe })
  });
  
  return await response.json();
}

export async function register(name: string, email: string, password: string, referralCode?: string) {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, referralCode })
  });
  
  return await response.json();
}

// Server-side logout
export async function signOut() {
  try {
    // Clear ALL auth data from localStorage
    localStorage.removeItem("bearer_token");
    localStorage.removeItem("user");
    localStorage.removeItem("announcement_last_seen");
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Call server logout API
    const response = await fetch('/api/auth/logout', { 
      method: 'POST',
      credentials: 'include'
    });
    
    // Clear all cookies (client-side)
    document.cookie.split(";").forEach(cookie => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });
    
    return {
      success: true,
      message: "Logged out successfully"
    };
  } catch (error) {
    console.error("Logout error:", error);
    
    // Force clear everything even if error
    localStorage.clear();
    sessionStorage.clear();
    
    return {
      success: false,
      error: {
        code: "LOGOUT_FAILED",
        message: "Logout failed but data cleared"
      }
    };
  }
}

// Client-side auth hook
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const userStr = localStorage.getItem("user");
        const token = localStorage.getItem("bearer_token");
        
        if (userStr && token) {
          setUser(JSON.parse(userStr));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    
    // Listen for storage changes (other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user' || e.key === 'bearer_token') {
        checkAuth();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const logout = async () => {
    try {
      const result = await signOut();
      setUser(null);
      window.dispatchEvent(new Event('storage'));
      return result;
    } catch (error) {
      console.error("Logout in hook failed:", error);
      setUser(null);
      return { 
        success: false, 
        error: {
          code: "LOGOUT_HOOK_FAILED",
          message: "Logout failed"
        }
      };
    }
  };

  const loginUser = async (userData: User, token?: string) => {
    if (token) {
      localStorage.setItem("bearer_token", token);
    }
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    window.dispatchEvent(new Event('storage'));
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login: loginUser,
    logout
  };
}

// useSession hook (for better-auth compatibility)
export function useSession() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  
  const refetch = () => {
    // Force recheck auth state
    window.dispatchEvent(new Event('storage'));
  };
  
  return {
    data: {
      user: user ? {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        referralCode: user.referralCode,
        referredBy: user.referredBy,
        agentId: user.agentId,
      } : null,
    },
    isPending: loading,
    isAuthenticated,
    refetch,
    signOut: logout
  };
}

// Get current user from localStorage
export function getCurrentUserClient(): User | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}

// Combined auth client for frontend
export const authClient = {
  signIn: {
    email: async (email: string, password: string, rememberMe?: boolean) => {
      return await login(email, password, rememberMe);
    }
  },
  
  signUp: {
    email: async (name: string, email: string, password: string, referralCode?: string) => {
      return await register(name, email, password, referralCode);
    }
  },
  
  signOut: async () => {
    return await signOut();
  }
};
