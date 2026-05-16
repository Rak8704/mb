// hooks/useAuth.ts
import { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  referralCode?: string;
  referredBy?: string;
  agentId?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("bearer_token");
        const userStr = localStorage.getItem("user");
        
        if (token && userStr) {
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
    const handleStorageChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const logout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch (error) {
      console.error("Logout API error:", error);
    }
    
    localStorage.removeItem("bearer_token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    logout
  };
}
