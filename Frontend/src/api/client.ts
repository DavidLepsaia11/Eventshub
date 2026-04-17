// src/api/client.ts
// Shared HTTP primitives used by all API modules.
// This is the ONLY file that may reference import.meta.env.VITE_API_URL.

export const BASE: string = import.meta.env.VITE_API_URL as string;

export function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('eventhub_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const isFormData = options?.body instanceof FormData;
  const merged: RequestInit = {
    ...options,
    headers: {
      // For FormData let the browser set Content-Type with boundary automatically
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...authHeaders(),
      ...(options?.headers as Record<string, string> | undefined),
    },
  };
  const res = await fetch(`${BASE}${path}`, merged);

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      // ASP.NET Core model validation returns { errors: { Field: ["msg", ...] } }
      if (body?.errors && typeof body.errors === 'object') {
        const messages = Object.values(body.errors as Record<string, string[]>)
          .flat()
          .filter(Boolean);
        if (messages.length > 0) {
          message = messages.join(' · ');
        }
      } else {
        message = body?.message ?? body?.title ?? message;
      }
    } catch {
      // ignore parse errors
    }
    throw new Error(message || `Request failed with status ${res.status}`);
  }

  if (res.status === 204) return undefined as unknown as T;

  return res.json() as Promise<T>;
}
