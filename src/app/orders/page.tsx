'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { CartCountBadge } from '@/components/CartCountBadge';
import { SignInNavLink } from '@/components/SignInNavLink';
import { apiFetch } from '@/lib/api';

// Rehydrate auth so /orders works when opened directly (user from localStorage)
function useAuthRehydrate() {
  const rehydrate = useAuthStore.persist?.rehydrate;
  useEffect(() => {
    if (typeof rehydrate === 'function') rehydrate();
  }, [rehydrate]);
}

type OrderItem = { name: string; price: number; quantity: number };
type Order = {
  orderId: string;
  total: number;
  items: OrderItem[];
  restaurantName: string;
  timestamp: string;
};

function formatOrderDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

type ApiOrder = {
  id: string;
  total: number;
  items: Array<{ name: string; price: number; quantity: number }>;
  restaurant_name: string;
  created_at: string;
};

export default function OrdersPage() {
  useAuthRehydrate();
  const user = useAuthStore((s) => s.user);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setOrders([]);
      return;
    }
    setLoading(true);
    let cancelled = false;
    apiFetch<ApiOrder[]>('/orders')
      .then((data) => {
        if (!cancelled)
          setOrders(
            (Array.isArray(data) ? data : []).map((o) => ({
              orderId: o.id,
              total: o.total,
              items: o.items ?? [],
              restaurantName: o.restaurant_name ?? 'Restaurant',
              timestamp: o.created_at,
            }))
          );
      })
      .catch(() => {
        if (!cancelled) setOrders([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [user]);

  return (
    <main className="min-h-screen bg-white">
      <header
        className="sticky top-0 left-0 right-0 z-[1000] h-20 bg-white px-5 will-change-transform contain-[size_layout_style] transition-transform duration-300 ease-[ease]"
        style={{ boxShadow: '0 15px 40px -20px rgba(40,44,63,.15)' }}
      >
        <div className="max-w-[1200px] min-w-0 mx-auto h-20 flex items-center">
          <Link href="/" className="flex-shrink-0 mr-4 block transition-transform duration-300 ease-[cubic-bezier(.215,.61,.355,1)] hover:scale-110">
            <svg className="h-[49px] w-auto block" viewBox="0 0 61 61" fill="none" stroke="currentColor" strokeWidth="0" aria-hidden>
              <path fill="#ff5200" d="M.32 30.5c0-12.966 0-19.446 3.498-23.868a16.086 16.086 0 0 1 2.634-2.634C10.868.5 17.354.5 30.32.5s19.446 0 23.868 3.498c.978.774 1.86 1.656 2.634 2.634C60.32 11.048 60.32 17.534 60.32 30.5s0 19.446-3.498 23.868a16.086 16.086 0 0 1-2.634 2.634C49.772 60.5 43.286 60.5 30.32 60.5s-19.446 0-23.868-3.498a16.086 16.086 0 0 1-2.634-2.634C.32 49.952.32 43.466.32 30.5Z" />
              <path fill="#FFF" fillRule="evenodd" d="M32.317 24.065v-6.216a.735.735 0 0 0-.732-.732.735.735 0 0 0-.732.732v7.302c0 .414.336.744.744.744h.714c10.374 0 11.454.54 10.806 2.73-.03.108-.066.21-.102.324-.006.024-.012.048-.018.066-2.724 8.214-10.092 18.492-12.27 21.432a.764.764 0 0 1-1.23 0c-1.314-1.776-4.53-6.24-7.464-11.304-.198-.462-.294-1.542 2.964-1.542h3.984c.222 0 .402.18.402.402v3.216c0 .384.282.738.666.768a.73.73 0 0 0 .582-.216.701.701 0 0 0 .216-.516v-4.362a.76.76 0 0 0-.756-.756h-8.052c-1.404 0-2.256-1.2-2.814-2.292-1.752-3.672-3.006-7.296-3.006-10.152 0-7.314 5.832-13.896 13.884-13.896 7.17 0 12.6 5.214 13.704 11.52.006.054.048.294.054.342.288 3.096-7.788 2.742-11.184 2.76a.357.357 0 0 1-.36-.36v.006Z" clipRule="evenodd" />
            </svg>
          </Link>
          <h1 className="text-xl font-extrabold text-[#02060c] tracking-tight flex-1 min-w-0 truncate">
            Recent Orders
          </h1>
          <div className="flex items-center h-full mr-[-16px]">
            <CartCountBadge />
            <SignInNavLink />
          </div>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-4 md:px-5 py-6">
        {!user ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-[#02060c] font-semibold text-lg mb-2">Sign in to see your orders</p>
            <p className="text-[#686b78] text-sm mb-4">Orders from your account will appear here.</p>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('open-login'))}
              className="px-6 py-3 rounded-lg bg-[#ff5200] text-white font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Sign in
            </button>
            <Link href="/food-delivery" className="mt-4 text-[#ff5200] text-sm font-semibold hover:underline">
              Browse restaurants
            </Link>
          </div>
        ) : loading ? (
          <div className="py-12 text-center text-[#686b78] text-sm">Loading orders…</div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-[#02060c] font-semibold text-lg mb-2">No orders yet</p>
            <p className="text-[#686b78] text-sm mb-4">Order from a restaurant to see your orders here.</p>
            <Link href="/food-delivery" className="px-6 py-3 rounded-lg bg-[#ff5200] text-white font-semibold text-sm hover:opacity-90 transition-opacity inline-block">
              Order food
            </Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {orders.map((order) => (
              <li
                key={order.orderId}
                className="border border-[#e9e9eb] rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <p className="text-[#02060c] font-semibold text-base truncate">{order.restaurantName}</p>
                  <span className="text-[#686b78] text-xs font-medium whitespace-nowrap">
                    {formatOrderDate(order.timestamp)}
                  </span>
                </div>
                <p className="text-[#686b78] text-xs mb-1">Order ID: {order.orderId}</p>
                <p className="text-[#686b78] text-sm mb-2">
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''} · ₹{order.total}
                </p>
                <ul className="text-[#02060c] text-sm border-t border-[#e9e9eb] pt-2 mt-2 space-y-0.5">
                  {order.items.slice(0, 5).map((item, i) => (
                    <li key={i} className="flex justify-between gap-2">
                      <span className="truncate">{item.name} × {item.quantity}</span>
                      <span className="text-[#686b78] flex-shrink-0">₹{item.price * item.quantity}</span>
                    </li>
                  ))}
                  {order.items.length > 5 && (
                    <li className="text-[#686b78] text-xs">+{order.items.length - 5} more</li>
                  )}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
