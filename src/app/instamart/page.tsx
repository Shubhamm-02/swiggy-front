'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { apiFetch } from '../../lib/api';
import { CartCountBadge } from '../../components/CartCountBadge';
import { SignInNavLink } from '../../components/SignInNavLink';
import Footer from '../../components/Footer';

type InstamartCategory = {
  id: string;
  name: string;
  image: string;
  product_count?: number;
};

type InstamartProduct = {
  id: string;
  name: string;
  image: string;
  price: number;
  original_price: number;
  category: string;
  unit: string;
  delivery_time: string;
  in_stock?: boolean;
};

// Fallback category images (Swiggy-style) when API has placeholders
const FALLBACK_CAT_IMAGES: Record<string, string> = {
  'Fruits & Vegetables': 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/NI_CATALOG/IMAGES/CIW/2025/5/14/43e3c412-4ca9-4894-82ba-24b69da80aa6_06c0d2a9-804c-4bf1-8725-7ebd234e144a',
  'Dairy & Bread': 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/NI_CATALOG/IMAGES/CIW/2025/5/14/6dea6676-ce07-45e6-b60c-a099c01c5462_6d33297a-5828-48ff-aa2a-c052ae97669e',
  'Snacks & Beverages': 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/NI_CATALOG/IMAGES/CIW/2024/7/6/37d399b1-52d2-47ef-bdd8-8951e51819fc_0361a93d-e864-49be-a57d-46c958eb7b56',
  'Instant Food': 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/NI_CATALOG/IMAGES/CIW/2025/5/14/1a08f110-17b6-4785-92d4-404825b75f2d_869c1986-d9c1-4d46-b1c3-10c79a052a59',
};

function discountPercent(price: number, original: number): number {
  if (original <= 0) return 0;
  return Math.round(((original - price) / original) * 100);
}

export default function InstamartPage() {
  const [categories, setCategories] = useState<InstamartCategory[]>([]);
  const [products, setProducts] = useState<InstamartProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const hotDealsRef = useRef<HTMLDivElement>(null);

  const loadData = useCallback(async () => {
    setLoadError(null);
    setLoading(true);
    try {
      const [cats, prods] = await Promise.all([
        apiFetch<InstamartCategory[]>('/instamart/categories', { skipAuth: true }).catch(() => []),
        apiFetch<InstamartProduct[]>('/instamart/products', { skipAuth: true }).catch(() => []),
      ]);
      setCategories(Array.isArray(cats) ? cats : []);
      setProducts(Array.isArray(prods) ? prods : []);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : 'Failed to load');
      setCategories([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const scrollHotDeals = (dir: 'left' | 'right') => {
    if (hotDealsRef.current) {
      hotDealsRef.current.scrollBy({ left: dir === 'right' ? 180 : -180, behavior: 'smooth' });
    }
  };

  const groceryCategories = categories.slice(0, 4);
  const snacksCategories = categories.slice(4, 12);

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header
        className="sticky top-0 left-0 right-0 z-[1000] h-16 md:h-20 bg-white border-b border-[#e9e9eb] px-4 md:px-5"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,.08)' }}
      >
        <div className="max-w-[1200px] min-w-0 mx-auto h-full flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 no-underline text-inherit">
            <div className="w-10 h-10 rounded-lg bg-[#00a550] flex items-center justify-center">
              <span className="text-white font-bold text-sm">IM</span>
            </div>
            <span className="text-[#00a550] font-bold text-lg tracking-tight hidden sm:inline">insta mart</span>
          </Link>
          <div className="flex items-center gap-1 flex-shrink-0 text-sm text-[#02060c99]">
            <span className="font-medium text-[#02060c]">31 Mins</span>
            <span> Delivery to</span>
            <button type="button" className="flex items-center gap-0.5 font-medium text-[#02060c] hover:text-[#00a550]">
              Select Your Location
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <div className="relative">
              <input
                type="search"
                placeholder="Search for 'Cakes'"
                className="w-full py-2.5 pl-4 pr-10 rounded-lg border border-[#e9e9eb] bg-[#f8f8f8] text-sm placeholder:text-[#686b78] focus:outline-none focus:border-[#00a550]"
              />
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#686b78]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <SignInNavLink />
            <CartCountBadge />
          </div>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-4 md:px-5 py-6">
        {loadError && (
          <div className="mb-4 p-4 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-between gap-4">
            <p className="text-amber-800 text-sm">Uh&apos;oh! Failed to load the next page.</p>
            <button
              type="button"
              onClick={loadData}
              className="px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-medium hover:bg-amber-700"
            >
              TRY AGAIN
            </button>
          </div>
        )}

        {loading && (
          <div className="py-12 text-center text-[#686b78] text-sm">Loading Instamart…</div>
        )}

        {!loading && (
          <>
            {/* Hot deals – structure matching Swiggy item-collection-card */}
            <section className="mb-10">
              <div className="flex items-center justify-between gap-4 mb-4 px-0 md:px-0">
                <h2 className="text-xl md:text-2xl font-extrabold text-[#02060c] tracking-tight">Hot deals</h2>
                <Link href="/instamart?section=deals" className="text-[#00a550] font-semibold text-sm hover:underline">
                  See All &gt;
                </Link>
              </div>
              <div
                ref={hotDealsRef}
                className="overflow-x-auto no-scrollbar scroll-smooth"
                style={{ padding: '12px 16px', marginLeft: -16, marginRight: -16 }}
              >
                <div className="flex items-stretch gap-0" style={{ paddingLeft: 16, paddingRight: 16 }}>
                  {(products.slice(0, 20)).map((p, idx) => {
                    const off = discountPercent(p.price, p.original_price);
                    const img = p.image && !p.image.includes('/fruits') && !p.image.includes('/dairy') ? p.image : FALLBACK_CAT_IMAGES[p.category] || 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/NI_CATALOG/IMAGES/CIW/2024/7/6/73e018a7-d342-475e-aaca-ec5cd3d0c59f_228ff3d4-ff21-44db-9768-7a369c65ce6a';
                    const isFirst = idx === 0;
                    const isLast = idx === 19;
                    return (
                      <div
                        key={p.id}
                        data-testid="item-collection-card"
                        className="flex-shrink-0 w-[140px]"
                        style={{ paddingLeft: isFirst ? 0 : 4, paddingRight: isLast ? 16 : 0 }}
                      >
                        <div className="flex flex-col h-full">
                          <div className="relative w-full aspect-square overflow-hidden rounded-lg bg-white" aria-hidden>
                            <div className="absolute top-0 right-0 z-10 p-1">
                              <button
                                type="button"
                                role="button"
                                aria-label="Add item to cart"
                                data-testid="buttonpair-add"
                                className="w-10 h-10 rounded-full bg-white border border-[#e9e9eb] flex items-center justify-center text-[#00a550] hover:bg-[#00a550] hover:text-white hover:border-[#00a550] transition-colors shadow-sm"
                              >
                                <svg aria-hidden height={20} width={20} viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M10 4a.9.9 0 01.9.9v4.2h4.2a.9.9 0 110 1.8h-4.2v4.2a.9.9 0 11-1.8 0v-4.2H4.9a.9.9 0 110-1.8h4.2V4.9A.9.9 0 0110 4z" />
                                </svg>
                              </button>
                            </div>
                            <img
                              src={img}
                              alt=""
                              loading="lazy"
                              className="w-full h-full object-cover"
                              style={{ background: 'rgb(255, 255, 255)' }}
                            />
                          </div>
                          <div className="mt-1">
                            <div
                              className="text-[10px] font-semibold text-[#02060c] uppercase tracking-wide"
                              aria-label="Delivery in 31 MINS"
                            >
                              31 MINS
                            </div>
                            <p className="text-sm font-medium text-[#02060c] mt-0.5 line-clamp-2 leading-snug">{p.name}</p>
                          </div>
                          <div className="mt-1.5 flex flex-col gap-0.5">
                            <div className="text-xs text-[#686b78]">{p.unit}</div>
                            {off > 0 && (
                              <div className="text-xs font-semibold text-[#00a550]" data-testid="offer-text">
                                {off}% OFF <span data-testid="line" className="inline-block w-3 border-t border-[#02060c33] align-middle ml-0.5" />
                              </div>
                            )}
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-sm font-bold text-[#02060c]">₹{p.price}</span>
                              {p.original_price > p.price && (
                                <span className="text-xs text-[#686b78] line-through" aria-hidden>
                                  ₹{p.original_price}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Grocery & Kitchen – structure matching Swiggy (snhix, KyyFD, item-image-wrapper) */}
            <section className="mb-10">
              <h2 className="text-xl md:text-2xl font-extrabold text-[#02060c] tracking-tight mb-4">Grocery & Kitchen</h2>
              <div
                className="overflow-x-auto no-scrollbar scroll-smooth"
                style={{ padding: '12px 16px', marginLeft: -16, marginRight: -16 }}
              >
                <div className="flex items-start" style={{ overflow: 'hidden', marginBottom: 0, paddingLeft: 16, paddingRight: 16 }}>
                  {(groceryCategories.length > 0 ? groceryCategories : [
                    { id: 'g1', name: 'Fresh Vegetables', image: 'https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_200/NI_CATALOG/IMAGES/CIW/2025/10/8/323b2564-9fa9-43dd-9755-b5df299797d7_a7f60fc5-47fa-429d-9fd1-5f0644c0d4e3' },
                    { id: 'g2', name: 'Fresh Fruits', image: 'https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_200/NI_CATALOG/IMAGES/CIW/2025/12/5/13a82fb6-aac6-4a94-af24-3a9522876d76_a27e7cc7-8e5f-4264-b978-c51531625dde' },
                    { id: 'g3', name: 'Dairy, Bread and Eggs', image: 'https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_200/NI_CATALOG/IMAGES/CIW/2025/12/24/ceb53190-72a3-466b-a892-8989615788c9_fe00456c-3b5a-4e74-80e2-c274a4c9f818.png' },
                    { id: 'g4', name: 'Meat and Seafood', image: 'https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_200/NI_CATALOG/IMAGES/CIW/2025/10/8/9c48b537-eef1-4047-becb-ddb7e79c373d_72aac542-4cef-4cf9-a9dd-5f1b862165c1' },
                  ]).map((c, idx) => {
                    const isFirst = idx === 0;
                    const isLast = idx === 3;
                    const img = c.image && !String(c.image).includes('/fruits') && !String(c.image).includes('/dairy') ? c.image : FALLBACK_CAT_IMAGES[c.name] || c.image;
                    return (
                      <Link
                        key={c.id}
                        href={`/instamart?category=${encodeURIComponent(c.name)}`}
                        className="flex-shrink-0 block no-underline text-inherit"
                        style={{
                          paddingLeft: isFirst ? 0 : 8,
                          paddingRight: isLast ? 16 : 0,
                          maxWidth: 112,
                        }}
                      >
                        <div data-testid="item-image-wrapper" className="w-full aspect-square overflow-hidden rounded-lg bg-transparent">
                          <img
                            src={img}
                            alt=""
                            className="w-full h-full object-cover"
                            style={{ background: 'transparent' }}
                          />
                        </div>
                        <div className="text-sm font-medium text-[#02060c] pt-2">{c.name}</div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Snacks & drinks */}
            <section className="mb-10">
              <h2 className="text-xl md:text-2xl font-extrabold text-[#02060c] tracking-tight mb-4">Snacks & drinks</h2>
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                {snacksCategories.length > 0
                  ? snacksCategories.map((c) => (
                      <Link
                        key={c.id}
                        href={`/instamart?category=${encodeURIComponent(c.name)}`}
                        className="flex-shrink-0 w-[140px] block rounded-xl overflow-hidden border border-[#e9e9eb] hover:shadow-md transition-shadow no-underline text-inherit"
                      >
                        <div className="aspect-square bg-[#f8f8f8] w-full">
                          <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                        </div>
                        <p className="p-2 text-xs font-semibold text-[#02060c] truncate">{c.name}</p>
                      </Link>
                    ))
                  : (
                    <>
                      {['Cold Drinks and...', 'Ice Creams and...', 'Chips and...', 'Chocolates', 'Noodles, Pasta', 'Frozen Food', 'Sweet Corner', 'Paan Corner'].map((name, i) => (
                        <div key={i} className="flex-shrink-0 w-[140px] rounded-xl overflow-hidden border border-[#e9e9eb]">
                          <div className="aspect-square bg-[#f8f8f8]" />
                          <p className="p-2 text-xs font-semibold text-[#02060c] truncate">{name}</p>
                        </div>
                      ))}
                    </>
                  )}
              </div>
            </section>
          </>
        )}
      </div>

      <Footer />
    </main>
  );
}
