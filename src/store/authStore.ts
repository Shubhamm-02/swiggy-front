'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { setToken } from '@/lib/api';

function getStorage() {
  if (typeof window === 'undefined') {
    return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
  }
  return window.localStorage;
}

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  addresses: Array<{ label?: string; line1: string; line2?: string; city: string; pincode: string }>;
  created_at: string;
};

type AuthState = {
  _hydrated: boolean;
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  signOut: () => void;
  setHydrated: (v: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      _hydrated: false,
      user: null,

      setUser(user) {
        set({ user });
      },

      signOut() {
        setToken(null);
        set({ user: null });
      },

      setHydrated(v) {
        set({ _hydrated: v });
      },
    }),
    {
      name: 'swiggy-auth',
      storage: createJSONStorage(() => getStorage()),
      partialize: (s) => ({ user: s.user }),
      skipHydration: true,
    }
  )
);

export function maskEmail(email: string | undefined | null): string {
  if (email == null || typeof email !== 'string') return 'User';
  const [local, domain] = email.split('@');
  if (!domain) return '***';
  if (local.length <= 2) return local[0] + '***@' + domain;
  return local.slice(0, 2) + '***@' + domain;
}
