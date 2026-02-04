'use client';

import React, { useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';

export function CartCountBadge() {
  const totalCount = useCartStore((s) => (s._hydrated ? s.totalCount() : 0));
  const openCart = useCartStore((s) => s.openCart);
  const rehydrate = useCartStore.persist?.rehydrate;
  const setHydrated = useCartStore((s) => s.setHydrated);

  useEffect(() => {
    if (typeof rehydrate !== 'function') return;
    const p = rehydrate();
    if (p && typeof (p as Promise<unknown>).then === 'function') {
      (p as Promise<void>).then(() => setHydrated(true));
    } else {
      setHydrated(true);
    }
  }, [rehydrate, setHydrated]);

  return (
    <button
      type="button"
      onClick={openCart}
      className="flex items-center h-full pl-7 text-base font-normal text-[rgba(2,6,12,.9)] hover:text-[#ff5200] transition-colors bg-transparent border-0 cursor-pointer p-0"
    >
      <svg
        className="w-5 h-5 mr-2 flex-shrink-0 text-[rgba(2,6,12,.9)]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      <span className="relative flex items-center">
        <span className="bg-[#1ba672] text-white text-xs font-semibold min-w-[16px] h-4 flex items-center justify-center rounded px-1 mr-2">
          {totalCount}
        </span>
        Cart
      </span>
    </button>
  );
}
