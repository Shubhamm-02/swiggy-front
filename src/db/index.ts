import { join } from 'path';
import { mkdirSync, existsSync } from 'fs';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { eq, desc, sql } from 'drizzle-orm';
import { orders } from './schema';
import type { OrderRow } from './schema';

const dbDir = join(process.cwd(), 'data');
const dbPath = join(dbDir, 'orders.db');

function ensureDataDir() {
  if (!existsSync(dbDir)) {
    mkdirSync(dbDir, { recursive: true });
  }
}

let _db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (_db) return _db;
  ensureDataDir();
  const client = new Database(dbPath);
  _db = drizzle(client);

  // Create table if not exists (no separate migration step)
  client.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL,
      phone TEXT NOT NULL,
      total INTEGER NOT NULL,
      items TEXT NOT NULL,
      restaurant_name TEXT NOT NULL,
      timestamp TEXT NOT NULL
    )
  `);
  return _db;
}

export type OrderItem = { name: string; price: number; quantity: number };
export type Order = {
  orderId: string;
  phone: string;
  total: number;
  items: OrderItem[];
  restaurantName: string;
  timestamp: string;
};

// Drizzle may return camelCase (schema keys) or snake_case (SQLite column names) depending on driver
function rowToOrder(row: OrderRow & Record<string, unknown>): Order {
  const orderId = row.orderId ?? row.order_id;
  const itemsJson = row.items;
  const restaurantName = row.restaurantName ?? row.restaurant_name;
  return {
    orderId: String(orderId ?? ''),
    phone: String(row.phone ?? ''),
    total: Number(row.total ?? 0),
    items: typeof itemsJson === 'string' ? (JSON.parse(itemsJson) as OrderItem[]) : Array.isArray(itemsJson) ? itemsJson as OrderItem[] : [],
    restaurantName: String(restaurantName ?? ''),
    timestamp: String(row.timestamp ?? ''),
  };
}

export function seedIfEmpty() {
  const db = getDb();
  const result = db.select({ count: sql<number>`count(*)`.as('count') }).from(orders).all();
  const count = Number(result[0]?.count ?? 0);
  if (count > 0) return;

  const base = [
    { name: 'Margherita Pizza', price: 299, quantity: 1 },
    { name: 'Veg Biryani', price: 249, quantity: 2 },
    { name: 'Butter Naan', price: 50, quantity: 4 },
    { name: 'Paneer Tikka', price: 279, quantity: 1 },
    { name: 'Chicken Burger', price: 189, quantity: 2 },
    { name: 'Gulab Jamun', price: 79, quantity: 2 },
    { name: 'Masala Dosa', price: 89, quantity: 1 },
    { name: 'Cold Coffee', price: 99, quantity: 1 },
    { name: 'Dal Makhani', price: 229, quantity: 1 },
    { name: 'Veg Fried Rice', price: 179, quantity: 1 },
  ];
  const restaurants = ['Pizza Hut', 'Biryani Blues', "McDonald's", 'Cafe Coffee Day', 'Saravana Bhavan', "Domino's", 'KFC', "Haldiram's"];
  const phones = ['1111111111', '2222222222', '3333333333', '4444444444', '5555555555'];
  const now = Date.now();

  for (let pi = 0; pi < phones.length; pi++) {
    const phone = phones[pi];
    const numOrders = 3 + (pi % 3);
    for (let i = 0; i < numOrders; i++) {
      const itemCount = 1 + ((pi + i) % 3);
      const orderItems = base.slice(pi * 2, pi * 2 + itemCount).map((it) => ({ ...it, quantity: (it.quantity + i) % 3 || 1 }));
      const total = orderItems.reduce((s, it) => s + it.price * it.quantity, 0);
      const restaurantName = restaurants[(pi + i) % restaurants.length];
      const ts = new Date(now - (phones.length * 10 - pi * 10 - i) * 60000).toISOString();
      db.insert(orders).values({
        orderId: `ORD-${now - (phones.length * 10 - pi * 10 - i) * 60000}`,
        phone,
        total,
        items: JSON.stringify(orderItems),
        restaurantName,
        timestamp: ts,
      }).run();
    }
  }
}

export function getOrdersByPhone(phone: string): Order[] {
  const db = getDb();
  const rows = db.select().from(orders).where(eq(orders.phone, phone)).orderBy(desc(orders.timestamp)).all();
  return rows.map(rowToOrder);
}

export function insertOrder(order: Order): Order {
  const db = getDb();
  db.insert(orders).values({
    orderId: order.orderId,
    phone: order.phone,
    total: order.total,
    items: JSON.stringify(order.items),
    restaurantName: order.restaurantName,
    timestamp: order.timestamp,
  }).run();
  return order;
}
