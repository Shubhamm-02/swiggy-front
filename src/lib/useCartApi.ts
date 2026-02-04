'use client';

import { useCallback } from 'react';
import { apiFetch } from '@/lib/api';
import { useCartStore } from '@/store/cartStore';

type CartResponse = {
  restaurant_id?: string | null;
  restaurant_name?: string | null;
  items: Array<{
    item_id: string;
    name: string;
    price: number;
    quantity: number;
    is_veg: boolean;
  }>;
};

type PlaceOrderResponse = {
  id: string;
  total: number;
  [key: string]: unknown;
};

/**
 * Hook for cart/order API calls when user is logged in.
 * Syncs cart with backend and places orders via API.
 */
export function useCartApi() {
  const setCartFromApi = useCartStore((s) => s.setCartFromApi);
  const clearCart = useCartStore((s) => s.clearCart);

  const updateItemWithApi = useCallback(
    async (itemId: string, quantity: number) => {
      try {
        await apiFetch<CartResponse>('/cart/update', {
          method: 'PUT',
          body: JSON.stringify({ item_id: itemId, quantity }),
        });
        const cart = await apiFetch<CartResponse>('/cart');
        setCartFromApi({
          restaurant_id: cart.restaurant_id,
          restaurant_name: cart.restaurant_name,
          items: (cart.items || []).map((i) => ({
            item_id: i.item_id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            is_veg: i.is_veg,
          })),
        });
      } catch {
        // On error, refetch cart to stay in sync
        try {
          const cart = await apiFetch<CartResponse>('/cart');
          setCartFromApi({
            restaurant_id: cart.restaurant_id,
            restaurant_name: cart.restaurant_name,
            items: (cart.items || []).map((i) => ({
              item_id: i.item_id,
              name: i.name,
              price: i.price,
              quantity: i.quantity,
              is_veg: i.is_veg,
            })),
          });
        } catch {
          // ignore
        }
      }
    },
    [setCartFromApi]
  );

  const placeOrderWithApi = useCallback(
    async (
      delivery_address: { label?: string; line1: string; line2?: string; city: string; pincode: string }
    ): Promise<{ orderId: string; total: number } | { error: string } | null> => {
      try {
        const order = await apiFetch<PlaceOrderResponse>('/orders/place', {
          method: 'POST',
          body: JSON.stringify({ delivery_address }),
        });
        clearCart();
        return { orderId: order.id, total: order.total };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to place order';
        return { error: message };
      }
    },
    [clearCart]
  );

  return { updateItemWithApi, placeOrderWithApi };
}
