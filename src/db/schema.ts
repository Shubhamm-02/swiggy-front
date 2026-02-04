import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderId: text('order_id').notNull(),
  phone: text('phone').notNull(),
  total: integer('total').notNull(),
  items: text('items').notNull(), // JSON: { name, price, quantity }[]
  restaurantName: text('restaurant_name').notNull(),
  timestamp: text('timestamp').notNull(), // ISO string
});

export type OrderRow = typeof orders.$inferSelect;
export type OrderInsert = typeof orders.$inferInsert;
