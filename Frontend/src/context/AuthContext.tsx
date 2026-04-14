// src/context/AuthContext.tsx
// Provides: user, isAuthenticated, isAdmin, login(response), logout()
// On mount: restores session from localStorage if token + user data exist.

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { AuthUser, AuthResponseDto } from '@/types/auth';

const TOKEN_KEY = 'eventhub_token';
const USER_KEY  = 'eventhub_user';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (response: AuthResponseDto) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readStoredUser);

  const isAuthenticated = user !== null;
  const isAdmin = user?.roles.includes('Admin') ?? false;

  const login = useCallback((response: AuthResponseDto) => {
    const authUser: AuthUser = {
      userId:   response.userId,
      userName: response.userName,
      email:    response.email,
      roles:    response.roles,
    };
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USER_KEY,  JSON.stringify(authUser));
    setUser(authUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
