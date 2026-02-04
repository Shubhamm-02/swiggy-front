import { NextRequest, NextResponse } from 'next/server';
import { seedIfEmpty, getOrdersByPhone, insertOrder } from '@/db';
import type { OrderItem } from '@/db';

export type Order = {
  orderId: string;
  phone: string;
  total: number;
  items: OrderItem[];
  restaurantName: string;
  timestamp: string;
};

export function GET(request: NextRequest) {
  seedIfEmpty();
  const phone = request.nextUrl.searchParams.get('phone');
  if (!phone || phone.length !== 10) {
    return NextResponse.json({ error: 'Valid phone required' }, { status: 400 });
  }
  const userOrders = getOrdersByPhone(phone);
  return NextResponse.json(userOrders);
}

export async function POST(request: NextRequest) {
  seedIfEmpty();
  let body: { phone: string; orderId: string; total: number; items: OrderItem[]; restaurantName: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const { phone, orderId, total, items, restaurantName } = body;
  if (!phone || phone.length !== 10 || !orderId || typeof total !== 'number' || !Array.isArray(items) || !restaurantName) {
    return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
  }
  const order: Order = {
    orderId,
    phone,
    total,
    items: items.map((i) => ({ name: i.name, price: i.price, quantity: i.quantity })),
    restaurantName,
    timestamp: new Date().toISOString(),
  };
  insertOrder(order);
  return NextResponse.json(order);
}
