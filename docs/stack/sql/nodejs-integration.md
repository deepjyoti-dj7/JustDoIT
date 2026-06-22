---
title: Node.js + SQL
description: PostgreSQL with the pg driver (raw queries, connection pool), Prisma ORM (schema, migrations, typed queries, transactions), and Knex query builder.
---

# Node.js + SQL

Node.js has three dominant approaches to SQL: the `pg` driver for raw control, Prisma for full type-safety and auto-generated migrations, and Knex.js as a flexible query builder in between. Most production applications pick one and stick with it. Prisma is the recommended default for new TypeScript projects.

---

## `pg` — Raw PostgreSQL Driver

```bash
npm install pg
npm install --save-dev @types/pg
```

```typescript
import { Pool } from 'pg';

// Connection pool — reuse connections across requests
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,                 // max connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000
});

// Always use parameterized queries ($1, $2) — NEVER string interpolation
// Parameterized queries are immune to SQL injection
async function findOrdersByCustomer(customerId: string, status?: string) {
  const { rows } = await pool.query<Order>(
    `SELECT o.id, o.status, o.total, o.created_at
     FROM orders o
     WHERE o.customer_id = $1
       AND ($2::varchar IS NULL OR o.status = $2)
     ORDER BY o.created_at DESC
     LIMIT 50`,
    [customerId, status ?? null]
  );
  return rows;
}

// Transaction with pg
async function transferCredits(fromId: string, toId: string, amount: number) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      'SELECT balance FROM wallets WHERE user_id = $1 FOR UPDATE',
      [fromId]
    );
    if (rows[0].balance < amount) throw new Error('Insufficient balance');

    await client.query(
      'UPDATE wallets SET balance = balance - $1 WHERE user_id = $2',
      [amount, fromId]
    );
    await client.query(
      'UPDATE wallets SET balance = balance + $1 WHERE user_id = $2',
      [amount, toId]
    );
    await client.query(
      `INSERT INTO transfers (from_id, to_id, amount) VALUES ($1, $2, $3)`,
      [fromId, toId, amount]
    );

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release(); // ALWAYS release back to pool
  }
}
```

---

## Prisma ORM

Prisma generates a fully-typed client from your schema. TypeScript knows the exact shape of every query result.

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Customer {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  orders    Order[]
  createdAt DateTime @default(now()) @map("created_at")
  @@map("customers")
}

model Order {
  id         String      @id @default(uuid())
  customerId String      @map("customer_id")
  status     OrderStatus @default(PENDING)
  total      Decimal     @db.Decimal(12, 2)
  customer   Customer    @relation(fields: [customerId], references: [id])
  items      OrderItem[]
  createdAt  DateTime    @default(now()) @map("created_at")
  @@index([customerId])
  @@map("orders")
}

model OrderItem {
  id        String  @id @default(uuid())
  orderId   String  @map("order_id")
  productId String  @map("product_id")
  quantity  Int
  unitPrice Decimal @db.Decimal(10, 2) @map("unit_price")
  order     Order   @relation(fields: [orderId], references: [id])
  @@map("order_items")
}

enum OrderStatus { PENDING CONFIRMED SHIPPED DELIVERED CANCELLED }
```

```bash
npx prisma migrate dev --name add_orders   # generate SQL migration + apply
npx prisma generate                         # regenerate TypeScript client
npx prisma studio                           # visual database browser
```

### Typed queries

```typescript
import { PrismaClient, OrderStatus } from '@prisma/client';

const prisma = new PrismaClient();

// Fully typed — TypeScript infers exact return shape
async function getCustomerOrders(customerId: string) {
  return prisma.order.findMany({
    where: { customerId },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
    take: 20
  });
  // Return type: Array<Order & { items: Array<OrderItem & { product: Product }> }>
}

// Pagination with cursor
async function getOrdersPage(cursor?: string) {
  return prisma.order.findMany({
    take: 20,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: 'desc' },
    where: { status: OrderStatus.CONFIRMED }
  });
}

// Aggregations
async function getOrderStats(customerId: string) {
  return prisma.order.aggregate({
    where: { customerId, status: OrderStatus.CONFIRMED },
    _count: true,
    _sum: { total: true },
    _avg: { total: true },
    _max: { total: true }
  });
}

// Transaction
async function placeOrder(customerId: string, items: CartItem[]) {
  return prisma.$transaction(async tx => {
    // All operations use the same transaction
    const order = await tx.order.create({
      data: {
        customerId,
        items: {
          create: items.map(i => ({
            productId: i.productId,
            quantity: i.quantity,
            unitPrice: i.unitPrice
          }))
        }
      },
      include: { items: true }
    });

    // Update stock for each product
    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } }
      });
    }

    return order;
  });
}
```

---

## Knex.js Query Builder

Knex is useful when you want SQL control without raw strings, or when you need to build dynamic queries programmatically:

```typescript
import Knex from 'knex';

const knex = Knex({
  client: 'postgresql',
  connection: process.env.DATABASE_URL,
  pool: { min: 2, max: 10 }
});

// Fluent query builder
async function searchOrders(filters: OrderFilters) {
  const query = knex('orders as o')
    .join('customers as c', 'o.customer_id', 'c.id')
    .select('o.id', 'o.status', 'o.total', 'c.email')
    .orderBy('o.created_at', 'desc');

  // Dynamic filters
  if (filters.status)     query.where('o.status', filters.status);
  if (filters.minTotal)   query.where('o.total', '>=', filters.minTotal);
  if (filters.customerId) query.where('o.customer_id', filters.customerId);
  if (filters.since)      query.where('o.created_at', '>=', filters.since);

  return query.limit(filters.limit ?? 50);
}

// Transaction
await knex.transaction(async trx => {
  await trx('wallets').decrement('balance', amount).where('user_id', fromId);
  await trx('wallets').increment('balance', amount).where('user_id', toId);
});

// Knex migrations
// knexfile.js sets up migration config; run: knex migrate:latest
exports.up = function(knex) {
  return knex.schema.createTable('orders', table => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.uuid('customer_id').notNullable()
         .references('id').inTable('customers').onDelete('RESTRICT');
    table.string('status', 20).notNullable().defaultTo('pending');
    table.decimal('total', 12, 2).notNullable();
    table.timestamps(true, true);
    table.index(['customer_id']);
  });
};
```

---

## Choosing the Right Tool

| Tool | Best for |
|---|---|
| **pg (raw)** | Maximum control, complex queries, performance-critical paths |
| **Prisma** | New TypeScript projects, type safety, auto-migrations, team consistency |
| **Knex** | Dynamic query building, existing JS codebases, gradual migration from raw SQL |
