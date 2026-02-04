'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useCartStore, getCartItemId } from '@/store/cartStore';
import { CartCountBadge } from '@/components/CartCountBadge';
import { apiFetch } from '@/lib/api';

type ApiRestaurant = {
  id: string;
  name: string;
  image: string;
  cuisines: string[];
  rating: number;
  delivery_time: string;
  price_for_two: number;
  discount?: string | null;
  address: string;
  is_open?: boolean;
};

type ApiMenuItem = {
  id: string;
  restaurant_id: string;
  name: string;
  description?: string;
  price: number;
  image?: string | null;
  category: string;
  is_veg: boolean;
  is_bestseller?: boolean;
  is_available?: boolean;
};

export default function RestaurantFromApi({ restaurantId }: { restaurantId: string }) {
  const [restaurant, setRestaurant] = useState<ApiRestaurant | null>(null);
  const [menuItems, setMenuItems] = useState<ApiMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const addItem = useCartStore((s) => s.addItem);
  const cartItems = useCartStore((s) => s.items);
  const incrementItem = useCartStore((s) => s.incrementItem);
  const decrementItem = useCartStore((s) => s.decrementItem);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([
      apiFetch<ApiRestaurant>(`/restaurants/${restaurantId}`, { skipAuth: true }),
      apiFetch<ApiMenuItem[]>(`/restaurants/${restaurantId}/menu`, { skipAuth: true }),
    ])
      .then(([rest, menu]) => {
        if (!cancelled) {
          setRestaurant(rest);
          setMenuItems(Array.isArray(menu) ? menu : []);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load');
          setRestaurant(null);
          setMenuItems([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [restaurantId]);

  const categoriesWithItems = useMemo(() => {
    const byCategory = new Map<string, ApiMenuItem[]>();
    for (const item of menuItems) {
      const cat = item.category || 'Other';
      if (!byCategory.has(cat)) byCategory.set(cat, []);
      byCategory.get(cat)!.push(item);
    }
    return Array.from(byCategory.entries()).map(([title, items]) => ({ title, items }));
  }, [menuItems]);

  const getQty = (itemId: string) => cartItems.find((i) => i.itemId === itemId)?.quantity ?? 0;

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f5f6f8]">
        <header className="sticky top-0 z-[1000] h-20 bg-white px-4" style={{ boxShadow: '0 15px 40px -20px rgba(40,44,63,.15)' }}>
          <div className="max-w-[1200px] mx-auto h-20 flex items-center">
            <Link href="/food-delivery" className="text-[#02060c] font-medium">← Back</Link>
            <div className="flex-1" />
            <CartCountBadge />
          </div>
        </header>
        <div className="max-w-[1200px] mx-auto px-4 py-12 text-center text-[#686b78]">Loading restaurant…</div>
      </main>
    );
  }

  if (error || !restaurant) {
    return (
      <main className="min-h-screen bg-[#f5f6f8]">
        <header className="sticky top-0 z-[1000] h-20 bg-white px-4" style={{ boxShadow: '0 15px 40px -20px rgba(40,44,63,.15)' }}>
          <div className="max-w-[1200px] mx-auto h-20 flex items-center">
            <Link href="/food-delivery" className="text-[#02060c] font-medium">← Back</Link>
          </div>
        </header>
        <div className="max-w-[1200px] mx-auto px-4 py-16 text-center">
          <h1 className="text-xl font-semibold text-[#02060c]">Restaurant not found</h1>
          <p className="text-[#686b78] mt-2">{error || 'The restaurant doesn’t exist or is unavailable.'}</p>
          <Link href="/food-delivery" className="inline-block mt-6 px-4 py-2 bg-[#ff5200] text-white font-medium rounded-lg hover:opacity-90">
            Back to food delivery
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f6f8]">
      <header className="sticky top-0 z-[1000] h-20 bg-white px-4" style={{ boxShadow: '0 15px 40px -20px rgba(40,44,63,.15)' }}>
        <div className="max-w-[1200px] min-w-0 mx-auto h-20 flex items-center w-full">
          <Link href="/food-delivery" className="flex-shrink-0 mr-4 block">
            <svg className="h-[49px] w-auto block" viewBox="0 0 61 61" fill="none" stroke="currentColor" strokeWidth="0" aria-hidden>
              <path fill="#ff5200" d="M.32 30.5c0-12.966 0-19.446 3.498-23.868a16.086 16.086 0 0 1 2.634-2.634C10.868.5 17.354.5 30.32.5s19.446 0 23.868 3.498c.978.774 1.86 1.656 2.634 2.634C60.32 11.048 60.32 17.534 60.32 30.5s0 19.446-3.498 23.868a16.086 16.086 0 0 1-2.634 2.634C49.772 60.5 43.286 60.5 30.32 60.5s-19.446 0-23.868-3.498a16.086 16.086 0 0 1-2.634-2.634C.32 49.952.32 43.466.32 30.5Z" />
              <path fill="#FFF" fillRule="evenodd" d="M32.317 24.065v-6.216a.735.735 0 0 0-.732-.732.735.735 0 0 0-.732.732v7.302c0 .414.336.744.744.744h.714c10.374 0 11.454.54 10.806 2.73-.03.108-.066.21-.102.324-.006.024-.012.048-.018.066-2.724 8.214-10.092 18.492-12.27 21.432a.764.764 0 0 1-1.23 0c-1.314-1.776-4.53-6.24-7.464-11.304-.198-.462-.294-1.542 2.964-1.542h3.984c.222 0 .402.18.402.402v3.216c0 .384.282.738.666.768a.73.73 0 0 0 .582-.216.701.701 0 0 0 .216-.516v-4.362a.76.76 0 0 0-.756-.756h-8.052c-1.404 0-2.256-1.2-2.814-2.292-1.752-3.672-3.006-7.296-3.006-10.152 0-7.314 5.832-13.896 13.884-13.896 7.17 0 12.6 5.214 13.704 11.52.006.054.048.294.054.342.288 3.096-7.788 2.742-11.184 2.76a.357.357 0 0 1-.36-.36v.006Z" clipRule="evenodd" />
            </svg>
          </Link>
          <div className="flex-1 min-w-0 truncate">
            <div className="font-semibold text-[#02060c] truncate">{restaurant.name}</div>
            <div className="text-xs text-[#686b78]">{restaurant.delivery_time}</div>
          </div>
          <div className="ml-auto">
            <CartCountBadge />
          </div>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-4 py-4">
        <div className="flex flex-wrap items-center gap-1 text-sm text-[#686b78] mb-6">
          <Link href="/" className="hover:text-[#ff5200]">Home</Link>
          <span aria-hidden>/</span>
          <Link href="/food-delivery" className="hover:text-[#ff5200]">Bangalore</Link>
          <span aria-hidden>/</span>
          <span className="text-[#02060c] font-medium">{restaurant.name}</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="h-40 sm:h-48 relative">
            <img src={restaurant.image || ''} alt={restaurant.name} className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
              <h1 className="text-xl font-bold">{restaurant.name}</h1>
              <p className="text-sm opacity-90">{Array.isArray(restaurant.cuisines) ? restaurant.cuisines.join(', ') : ''} · {restaurant.delivery_time}</p>
              {restaurant.discount && <p className="text-xs mt-1">{restaurant.discount}</p>}
            </div>
          </div>
        </div>

        {categoriesWithItems.length === 0 ? (
          <p className="text-[#686b78] text-center py-8">No menu items available.</p>
        ) : (
          <div className="space-y-8">
            {categoriesWithItems.map(({ title, items }) => (
              <section key={title} className="bg-white rounded-xl shadow-sm p-4">
                <h2 className="text-lg font-semibold text-[#02060c] mb-4">{title}</h2>
                <ul className="space-y-4">
                  {items.map((item) => {
                    const itemId = item.id || getCartItemId(restaurantId, item.name, item.price);
                    const qty = getQty(itemId);
                    return (
                      <li key={item.id || itemId} className="flex items-start justify-between gap-4 py-3 border-b border-[#e9e9eb] last:border-0">
                        <div className="min-w-0 flex-1">
                          <span className="inline-block w-4 h-4 rounded-full border border-current mr-2" style={{ borderColor: item.is_veg ? '#0f8a0f' : '#e43b4f', background: item.is_veg ? '#0f8a0f' : '#e43b4f' }} />
                          <span className="font-medium text-[#02060c]">{item.name}</span>
                          {item.description && <p className="text-sm text-[#686b78] mt-0.5 line-clamp-2">{item.description}</p>}
                          <p className="text-sm font-medium text-[#02060c] mt-1">₹{item.price}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {qty === 0 ? (
                            <button
                              type="button"
                              onClick={() => addItem(restaurantId, restaurant.name, { name: item.name, price: item.price, isVeg: item.is_veg, id: item.id })}
                              className="px-4 py-2 border border-[#ff5200] text-[#ff5200] font-medium text-sm rounded-lg hover:bg-[#ff5200] hover:text-white transition-colors"
                            >
                              ADD
                            </button>
                          ) : (
                            <div className="flex items-center gap-1 border border-[#e9e9eb] rounded-lg px-2 py-1">
                              <button type="button" onClick={() => decrementItem(itemId)} className="w-7 h-7 flex items-center justify-center text-[#02060c] font-semibold hover:bg-[#f5f6f8] rounded" aria-label="Decrease">−</button>
                              <span className="min-w-[1.25rem] text-center text-sm font-semibold">{qty}</span>
                              <button type="button" onClick={() => incrementItem(itemId)} className="w-7 h-7 flex items-center justify-center text-[#02060c] font-semibold hover:bg-[#f5f6f8] rounded" aria-label="Increase">+</button>
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
