'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useAddressStore, getSelectedAddress, formatAddressShort } from '@/store/addressStore';
import { useCartApi } from '@/lib/useCartApi';

type CheckoutStep = 'cart' | 'confirm' | 'success';

export function CartDrawer() {
  const isCartOpen = useCartStore((s) => s.isCartOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const restaurantName = useCartStore((s) => s.restaurantName);
  const items = useCartStore((s) => s.items);
  const incrementItem = useCartStore((s) => s.incrementItem);
  const decrementItem = useCartStore((s) => s.decrementItem);
  const placeOrder = useCartStore((s) => s.placeOrder);
  const user = useAuthStore((s) => s.user);
  const { updateItemWithApi, placeOrderWithApi } = useCartApi();

  const addresses = useAddressStore((s) => s.addresses);
  const selectedId = useAddressStore((s) => s.selectedId);
  const setSelectedId = useAddressStore((s) => s.setSelectedId);
  const addAddress = useAddressStore((s) => s.addAddress);
  const selectedAddress = useAddressStore((s) => getSelectedAddress(s));

  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('cart');
  const [lastOrder, setLastOrder] = useState<{ orderId: string; total: number; items: { name: string; price: number; quantity: number }[]; restaurantName: string | null } | null>(null);
  const [showAddressPicker, setShowAddressPicker] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({ label: 'Home', line1: '', line2: '', city: 'Bengaluru', pincode: '' });

  useEffect(() => {
    const rehydrate = useAddressStore.persist?.rehydrate;
    if (typeof rehydrate === 'function') rehydrate();
  }, []);

  useEffect(() => {
    if (!isCartOpen) {
      setCheckoutStep('cart');
      setLastOrder(null);
      setShowAddressPicker(false);
      setShowAddAddress(false);
    }
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const itemTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <>
      {/* Overlay – click to close */}
      <div
        className="fixed inset-0 bg-black/50 z-[1100]"
        role="presentation"
        aria-hidden
        onClick={closeCart}
      />
      {/* Sidebar */}
      <div
        className="fixed top-0 right-0 bottom-0 w-full max-w-[400px] bg-white shadow-xl z-[1101] flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Cart"
      >
        {/* Header with close */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#e9e9eb] flex-shrink-0">
          <h2 className="text-lg font-semibold text-[#02060c]">Cart</h2>
          <button
            type="button"
            onClick={closeCart}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-[#e9e9eb] bg-white text-[#686b78] hover:bg-gray-50 transition-colors"
            aria-label="Close cart"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          {checkoutStep === 'success' && lastOrder ? (
            <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
              <div className="w-14 h-14 rounded-full bg-[#e8f5e9] flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-[#2e7d32]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-[#02060c] font-semibold text-lg">Order placed successfully!</p>
              <p className="text-[#686b78] text-sm mt-1">Order ID: {lastOrder.orderId}</p>
              <p className="text-[#02060c] font-medium text-sm mt-0.5">Total: ₹{lastOrder.total}</p>
              <button
                type="button"
                onClick={() => { closeCart(); setCheckoutStep('cart'); setLastOrder(null); }}
                className="mt-6 px-6 py-2.5 rounded-lg bg-[#ff5200] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Done
              </button>
            </div>
          ) : checkoutStep === 'confirm' ? (
            <div className="px-4 py-4">
              <p className="text-[#02060c] font-semibold text-sm mb-3">Review your order</p>
              {restaurantName && (
                <div className="pb-2 border-b border-[#e9e9eb] mb-3">
                  <p className="text-[#02060c] font-semibold text-sm truncate">{restaurantName}</p>
                </div>
              )}
              <ul className="divide-y divide-[#e9e9eb] mb-4">
                {items.map((item) => (
                  <li key={item.itemId} className="py-2 flex justify-between gap-3">
                    <p className="text-[#02060c] text-sm truncate flex-1">{item.name} × {item.quantity}</p>
                    <span className="text-[#02060c] text-sm font-medium flex-shrink-0">₹{item.price * item.quantity}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between text-sm text-[#686b78] mb-1">
                <span>Item total</span>
                <span className="text-[#02060c] font-medium">₹{itemTotal}</span>
              </div>
              <div className="mb-3">
                <p className="text-xs text-[#686b78] mb-1">Delivery address</p>
                {!showAddressPicker ? (
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[#02060c] text-sm flex-1 min-w-0">
                      {selectedAddress ? (
                        <>
                          <span className="font-semibold">{selectedAddress.label}</span>
                          <span className="text-[#686b78] block mt-0.5">{formatAddressShort(selectedAddress)}</span>
                        </>
                      ) : (
                        <span className="text-[#686b78]">No address selected</span>
                      )}
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowAddressPicker(true)}
                      className="text-[#ff5200] text-xs font-semibold flex-shrink-0 hover:underline"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div className="border border-[#e9e9eb] rounded-lg p-3 bg-[#f5f5f5] space-y-3">
                    <p className="text-[#02060c] text-xs font-semibold">Select or add address</p>
                    <ul className="space-y-2 max-h-[140px] overflow-y-auto">
                      {addresses.map((addr) => (
                        <li key={addr.id} className="flex items-start gap-2">
                          <input
                            type="radio"
                            name="delivery-address"
                            id={`addr-${addr.id}`}
                            checked={selectedId === addr.id}
                            onChange={() => { setSelectedId(addr.id); setShowAddressPicker(false); setShowAddAddress(false); }}
                            className="mt-1.5 flex-shrink-0"
                          />
                          <label htmlFor={`addr-${addr.id}`} className="text-[#02060c] text-sm cursor-pointer flex-1 min-w-0">
                            <span className="font-medium">{addr.label}</span>
                            <span className="text-[#686b78] block text-xs">{formatAddressShort(addr)}</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                    {!showAddAddress ? (
                      <button
                        type="button"
                        onClick={() => setShowAddAddress(true)}
                        className="w-full py-2 rounded-lg border border-dashed border-[#e9e9eb] text-[#ff5200] text-xs font-semibold hover:bg-white transition-colors"
                      >
                        + Add new delivery address
                      </button>
                    ) : (
                      <div className="bg-white rounded-lg p-3 border border-[#e9e9eb] space-y-2">
                        <input
                          type="text"
                          placeholder="Label (e.g. Home, Work)"
                          value={newAddr.label}
                          onChange={(e) => setNewAddr((a) => ({ ...a, label: e.target.value }))}
                          className="w-full border border-[#e9e9eb] rounded px-2 py-1.5 text-sm text-[#02060c] focus:outline-none focus:ring-2 focus:ring-[#ff5200]"
                        />
                        <input
                          type="text"
                          placeholder="Address line 1"
                          value={newAddr.line1}
                          onChange={(e) => setNewAddr((a) => ({ ...a, line1: e.target.value }))}
                          className="w-full border border-[#e9e9eb] rounded px-2 py-1.5 text-sm text-[#02060c] focus:outline-none focus:ring-2 focus:ring-[#ff5200]"
                        />
                        <input
                          type="text"
                          placeholder="Address line 2 (optional)"
                          value={newAddr.line2}
                          onChange={(e) => setNewAddr((a) => ({ ...a, line2: e.target.value }))}
                          className="w-full border border-[#e9e9eb] rounded px-2 py-1.5 text-sm text-[#02060c] focus:outline-none focus:ring-2 focus:ring-[#ff5200]"
                        />
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="City"
                            value={newAddr.city}
                            onChange={(e) => setNewAddr((a) => ({ ...a, city: e.target.value }))}
                            className="flex-1 border border-[#e9e9eb] rounded px-2 py-1.5 text-sm text-[#02060c] focus:outline-none focus:ring-2 focus:ring-[#ff5200]"
                          />
                          <input
                            type="text"
                            placeholder="Pincode"
                            value={newAddr.pincode}
                            onChange={(e) => setNewAddr((a) => ({ ...a, pincode: e.target.value }))}
                            className="w-24 border border-[#e9e9eb] rounded px-2 py-1.5 text-sm text-[#02060c] focus:outline-none focus:ring-2 focus:ring-[#ff5200]"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => { setShowAddAddress(false); setNewAddr({ label: 'Home', line1: '', line2: '', city: 'Bengaluru', pincode: '' }); }}
                            className="flex-1 py-1.5 rounded border border-[#e9e9eb] text-[#02060c] text-xs font-semibold hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (!newAddr.line1.trim() || !newAddr.pincode.trim()) return;
                              addAddress({
                                label: newAddr.label.trim() || 'Address',
                                line1: newAddr.line1.trim(),
                                line2: newAddr.line2.trim() || undefined,
                                city: newAddr.city.trim() || 'Bengaluru',
                                pincode: newAddr.pincode.trim(),
                              });
                              setNewAddr({ label: 'Home', line1: '', line2: '', city: 'Bengaluru', pincode: '' });
                              setShowAddAddress(false);
                              setShowAddressPicker(false);
                            }}
                            className="flex-1 py-1.5 rounded bg-[#ff5200] text-white text-xs font-semibold hover:opacity-90 disabled:opacity-50"
                            disabled={!newAddr.line1.trim() || !newAddr.pincode.trim()}
                          >
                            Save address
                          </button>
                        </div>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => { setShowAddressPicker(false); setShowAddAddress(false); }}
                      className="w-full py-1.5 text-[#686b78] text-xs font-medium hover:text-[#02060c]"
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setCheckoutStep('cart')}
                  className="flex-1 py-2.5 rounded-lg border border-[#e9e9eb] bg-white text-[#02060c] text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (user) {
                      if (!selectedAddress) return; // require address for logged-in user
                      const delivery_address = {
                        label: selectedAddress.label,
                        line1: selectedAddress.line1,
                        line2: selectedAddress.line2,
                        city: selectedAddress.city,
                        pincode: selectedAddress.pincode,
                      };
                      const result = await placeOrderWithApi(delivery_address);
                      if (result?.orderId) {
                        setLastOrder({ orderId: result.orderId, total: result.total, items: items.map((i) => ({ name: i.name, price: i.price, quantity: i.quantity })), restaurantName });
                        setCheckoutStep('success');
                      } else if (result?.error) {
                        setLastOrder(null);
                        setCheckoutStep('cart');
                      }
                    } else {
                      const result = placeOrder();
                      if (result) {
                        setLastOrder(result);
                        setCheckoutStep('success');
                      }
                    }
                  }}
                  disabled={user && !selectedAddress}
                  className="flex-1 py-2.5 rounded-lg bg-[#ff5200] text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Place Order
                </button>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
              <p className="text-[#02060c] font-medium text-base">Your cart is empty</p>
              <p className="text-[#686b78] text-sm mt-1">Browse restaurants and add items to get started.</p>
              <Link
                href="/food-delivery"
                onClick={closeCart}
                className="mt-4 px-4 py-2 rounded-lg bg-[#ff5200] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Browse restaurants
              </Link>
            </div>
          ) : (
            <>
              {restaurantName && (
                <div className="px-4 py-2 border-b border-[#e9e9eb]">
                  <p className="text-[#02060c] font-semibold text-sm truncate">{restaurantName}</p>
                </div>
              )}
              <ul className="divide-y divide-[#e9e9eb]">
                {items.map((item) => (
                  <li key={item.itemId} className="px-4 py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-[#02060c] font-medium text-sm truncate">{item.name}</p>
                      <p className="text-[#686b78] text-xs mt-0.5">₹{item.price} × {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          if (user) updateItemWithApi(item.itemId, item.quantity - 1);
                          else decrementItem(item.itemId);
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#e9e9eb] bg-white text-[#02060c] text-sm font-semibold hover:bg-gray-50 transition-colors"
                        aria-label={`Decrease ${item.name} quantity`}
                      >
                        −
                      </button>
                      <span className="min-w-[1.25rem] text-center text-sm font-semibold text-[#02060c]">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => {
                          if (user) updateItemWithApi(item.itemId, item.quantity + 1);
                          else incrementItem(item.itemId);
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#e9e9eb] bg-white text-[#02060c] text-sm font-semibold hover:bg-gray-50 transition-colors"
                        aria-label={`Increase ${item.name} quantity`}
                      >
                        +
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {items.length > 0 && checkoutStep === 'cart' && (
          <div className="border-t border-[#e9e9eb] px-4 py-4 flex-shrink-0 bg-white">
            <div className="flex justify-between text-sm text-[#686b78] mb-1">
              <span>Item total</span>
              <span className="text-[#02060c] font-medium">₹{itemTotal}</span>
            </div>
            <p className="text-xs text-[#686b78] mb-3">Delivery charges and taxes applied at checkout</p>
            <div className="flex justify-between text-base font-semibold text-[#02060c] mb-3">
              <span>Grand total</span>
              <span>₹{itemTotal}</span>
            </div>
            <button
              type="button"
              onClick={() => setCheckoutStep('confirm')}
              className="w-full py-3 rounded-lg bg-[#ff5200] text-white font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
