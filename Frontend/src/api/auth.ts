// src/api/auth.ts
// Authentication API calls — login, register, logout.
// Base URL is read from import.meta.env.VITE_API_URL — never hardcoded.

import type { LoginDto, RegisterDto, AuthResponseDto } from '@/types/auth';

const BASE = import.meta.env.VITE_API_URL as string;
const TOKEN_KEY = 'eventhub_token';

async function authRequest<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const data = await res.json();
      message = data?.message ?? data?.title ?? message;
    } catch {
      // ignore parse errors
    }
    throw new Error(message || `Request failed with status ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// POST /api/auth/login
export function login(dto: LoginDto): Promise<AuthResponseDto> {
  return authRequest<AuthResponseDto>('/api/auth/login', dto);
}

// POST /api/auth/register
export function register(dto: RegisterDto): Promise<AuthResponseDto> {
  return authRequest<AuthResponseDto>('/api/auth/register', dto);
}

// POST /api/auth/logout — revokes the current JWT on the server (fire-and-forget safe)
export function logoutRequest(): Promise<void> {
  const token = localStorage.getItem(TOKEN_KEY);
  return fetch(`${BASE}/api/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  }).then(() => undefined); // ignore response — local cleanup always happens
}
