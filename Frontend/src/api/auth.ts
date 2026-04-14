// src/api/auth.ts
// Authentication API calls — login and register.
// Base URL is read from import.meta.env.VITE_API_URL — never hardcoded.

import type { LoginDto, RegisterDto, AuthResponseDto } from '@/types/auth';

const BASE = import.meta.env.VITE_API_URL as string;

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
