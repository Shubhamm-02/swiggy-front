'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

function getStorage() {
  if (typeof window === 'undefined') {
    return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
  }
  return window.localStorage;
}

export type DeliveryAddress = {
  id: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  pincode: string;
};

const BENGALURU_DEFAULTS: DeliveryAddress[] = [
  { id: 'addr-1', label: 'Home', line1: '12, 80 Feet Rd', line2: 'Koramangala', city: 'Bengaluru', pincode: '560034' },
  { id: 'addr-2', label: 'Work', line1: '45, 100 Feet Rd', line2: 'Indiranagar', city: 'Bengaluru', pincode: '560038' },
  { id: 'addr-3', label: 'HSR Layout', line1: '78, Sector 2', line2: 'HSR Layout', city: 'Bengaluru', pincode: '560102' },
  { id: 'addr-4', label: 'Whitefield', line1: '23, ITPL Main Rd', line2: 'Whitefield', city: 'Bengaluru', pincode: '560066' },
  { id: 'addr-5', label: 'Jayanagar', line1: '56, 4th Block', line2: 'Jayanagar', city: 'Bengaluru', pincode: '560041' },
];

type AddressState = {
  _hydrated: boolean;
  addresses: DeliveryAddress[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  addAddress: (address: Omit<DeliveryAddress, 'id'>) => string;
  setHydrated: (v: boolean) => void;
};

function nextId(): string {
  return 'addr-' + Date.now();
}

export const useAddressStore = create<AddressState>()(
  persist(
    (set, get) => ({
      _hydrated: false,
      addresses: BENGALURU_DEFAULTS,
      selectedId: BENGALURU_DEFAULTS[0]?.id ?? null,

      setSelectedId(id) {
        set({ selectedId: id });
      },

      addAddress(address) {
        const id = nextId();
        const newAddr: DeliveryAddress = { ...address, id };
        set((s) => ({
          addresses: [...s.addresses, newAddr],
          selectedId: id,
        }));
        return id;
      },

      setHydrated(v) {
        set({ _hydrated: v });
      },
    }),
    {
      name: 'swiggy-addresses',
      storage: createJSONStorage(() => getStorage()),
      partialize: (s) => ({ addresses: s.addresses, selectedId: s.selectedId }),
      skipHydration: true,
    }
  )
);

export function getSelectedAddress(state: AddressState): DeliveryAddress | null {
  const { addresses, selectedId } = state;
  if (!selectedId) return addresses[0] ?? null;
  return addresses.find((a) => a.id === selectedId) ?? addresses[0] ?? null;
}

export function formatAddressShort(addr: DeliveryAddress): string {
  const parts = [addr.line1, addr.line2, addr.city, addr.pincode].filter(Boolean);
  return parts.join(', ');
}
