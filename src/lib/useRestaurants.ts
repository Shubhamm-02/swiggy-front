'use client';

import { useEffect, useState, useMemo } from 'react';
import { apiFetch } from './api';

export type RestaurantCard = {
  id: string;
  name: string;
  rating: string;
  time: string;
  cuisines: string;
  location: string;
  offer: string;
  img: string;
  slug: string;
  cost?: number;
};

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

function mapApiToCard(r: ApiRestaurant): RestaurantCard {
  return {
    id: r.id,
    name: r.name,
    rating: String(r.rating),
    time: r.delivery_time,
    cuisines: Array.isArray(r.cuisines) ? r.cuisines.join(', ') : String(r.cuisines || ''),
    location: r.address || '',
    offer: r.discount || '',
    img: r.image || '',
    slug: r.id,
    cost: r.price_for_two,
  };
}

export function useRestaurantsFromApi(params?: { cuisine?: string; veg_only?: boolean; search?: string; sort_by?: string }) {
  const [data, setData] = useState<RestaurantCard[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const query = useMemo(() => {
    const p = new URLSearchParams();
    if (params?.cuisine) p.set('cuisine', params.cuisine);
    if (params?.veg_only) p.set('veg_only', 'true');
    if (params?.search) p.set('search', params.search);
    if (params?.sort_by) p.set('sort_by', params.sort_by);
    return p.toString();
  }, [params?.cuisine, params?.veg_only, params?.search, params?.sort_by]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    const url = query ? `/restaurants?${query}` : '/restaurants';
    apiFetch<ApiRestaurant[]>(url, { skipAuth: true })
      .then((list) => {
        if (!cancelled) setData(list.map(mapApiToCard));
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load');
          setData(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [query]);

  return { data, loading, error };
}
