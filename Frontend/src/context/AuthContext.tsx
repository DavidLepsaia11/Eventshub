// src/context/AuthContext.tsx
// Provides: user, isAuthenticated, isAdmin, login(response), logout()
// On mount: restores session from localStorage if token + user data exist.
// Auto-logout: schedules a timer based on the JWT exp claim; fires logout() when the token expires.

import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import type { AuthUser, AuthResponseDto } from '@/types/auth';
import { logoutRequest } from '@/api/auth';

const TOKEN_KEY = 'eventhub_token';
const USER_KEY  = 'eventhub_user';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isVisitor: boolean;
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

/** Decode a JWT payload and return the exp Unix timestamp, or null if unreadable. */
function getTokenExp(token: string): number | null {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return typeof decoded.exp === 'number' ? decoded.exp : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readStoredUser);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const logout = useCallback(() => {
    clearTimer();
    logoutRequest().catch(() => {/* server-side revoke failed — local cleanup still proceeds */});
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const scheduleAutoLogout = useCallback((token: string) => {
    clearTimer();
    const exp = getTokenExp(token);
    if (exp === null) return;

    const msUntilExpiry = exp * 1000 - Date.now();
    if (msUntilExpiry <= 0) {
      // Token already expired — log out immediately
      logout();
      return;
    }

    timerRef.current = setTimeout(() => {
      logout();
    }, msUntilExpiry);
  }, [logout]);

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
    scheduleAutoLogout(response.token);
  }, [scheduleAutoLogout]);

  // On mount: if a stored session exists, schedule auto-logout based on stored token's expiry.
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token && user) {
      scheduleAutoLogout(token);
    }
    return clearTimer;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isAuthenticated = user !== null;
  const isAdmin   = user?.roles.includes('Admin')   ?? false;
  const isVisitor = user?.roles.includes('Visitor') ?? false;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, isVisitor, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
