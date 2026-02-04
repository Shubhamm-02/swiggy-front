/**
 * Backend API client. All routes under BASE_URL/api.
 * Set NEXT_PUBLIC_BACKEND_URL (e.g. http://localhost:8000) in .env.local.
 */

const getBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    return (process.env.NEXT_PUBLIC_BACKEND_URL || '').replace(/\/$/, '') || 'http://localhost:8000';
  }
  return process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
};

export function getBackendUrl(): string {
  return getBaseUrl();
}

export function getApiUrl(path: string): string {
  const base = getBaseUrl();
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}/api${p}`;
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('swiggy_token');
}

export function setToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (token) localStorage.setItem('swiggy_token', token);
  else localStorage.removeItem('swiggy_token');
}

type RequestInitWithAuth = RequestInit & { skipAuth?: boolean };

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInitWithAuth = {}
): Promise<T> {
  const { skipAuth, ...init } = options;
  const url = getApiUrl(path);
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...((init.headers as Record<string, string>) || {}),
  };
  const token = skipAuth ? null : getToken();
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(url, { ...init, headers });
  const text = await res.text();
  let data: T;
  try {
    data = text ? (JSON.parse(text) as T) : ({} as T);
  } catch {
    throw new Error(res.ok ? text : `Request failed: ${res.status}`);
  }
  if (!res.ok) {
    const err = data as { detail?: string };
    throw new Error(typeof err.detail === 'string' ? err.detail : `Request failed: ${res.status}`);
  }
  return data;
}
