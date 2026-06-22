---
title: Data and Auth
description: PostgreSQL with pg and Prisma, Mongoose for MongoDB, JWT authentication, session handling, and rate limiting in Node.js applications.
---

# Data & Auth

Node.js has excellent libraries for every data access pattern. For PostgreSQL, Prisma is the modern choice for type safety and migrations. For MongoDB, Mongoose provides schema enforcement at the application layer. For auth, the industry has converged on JWT for stateless APIs and sessions backed by Redis for web apps that need revocation.

---

## PostgreSQL with Prisma

Prisma is a type-safe ORM that generates a client from your schema:

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Order {
  id          String      @id @default(uuid())
  customerId  String      @map("customer_id")
  status      OrderStatus @default(PENDING)
  items       OrderItem[]
  createdAt   DateTime    @default(now()) @map("created_at")
  updatedAt   DateTime    @updatedAt @map("updated_at")

  @@index([customerId])
  @@map("orders")
}

model OrderItem {
  id        String  @id @default(uuid())
  orderId   String  @map("order_id")
  productId String  @map("product_id")
  quantity  Int
  order     Order   @relation(fields: [orderId], references: [id])

  @@map("order_items")
}

enum OrderStatus { PENDING CONFIRMED SHIPPED DELIVERED CANCELLED }
```

```bash
npx prisma migrate dev --name add_orders_table
npx prisma generate   # regenerate the client after schema changes
```

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fully typed queries — TypeScript knows the exact shape
async function createOrder(data: CreateOrderInput) {
    return prisma.order.create({
        data: {
            customerId: data.customerId,
            items: {
                create: data.items.map(item => ({
                    productId: item.productId,
                    quantity:  item.quantity
                }))
            }
        },
        include: { items: true }
    });
}

async function getOrdersByCustomer(customerId: string, page = 1, limit = 20) {
    return prisma.order.findMany({
        where: { customerId },
        include: { items: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
    });
}

// Transaction
async function transferCredits(fromId: string, toId: string, amount: number) {
    return prisma.$transaction(async tx => {
        await tx.wallet.update({
            where: { userId: fromId },
            data:  { balance: { decrement: amount } }
        });
        await tx.wallet.update({
            where: { userId: toId },
            data:  { balance: { increment: amount } }
        });
    });
}
```

---

## MongoDB with Mongoose

```javascript
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    customerId: { type: String, required: true, index: true },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    items: [{
        productId: { type: String, required: true },
        quantity:  { type: Number, required: true, min: 1 }
    }],
    totalAmount: { type: Number, required: true }
}, {
    timestamps: true,   // adds createdAt and updatedAt
    toJSON: { virtuals: true }
});

// Virtual field — computed, not stored
orderSchema.virtual('itemCount').get(function() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

// Middleware hook
orderSchema.pre('save', function(next) {
    this.totalAmount = this.items.reduce((sum, item) =>
        sum + item.quantity * item.unitPrice, 0);
    next();
});

export const Order = mongoose.model('Order', orderSchema);

// Usage
const order = await Order.find({ customerId, status: 'pending' })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();  // lean() returns plain JS objects (faster, no Mongoose methods)
```

---

## JWT Authentication

```typescript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = '24h';

interface JwtPayload {
    sub: string;      // user ID
    email: string;
    roles: string[];
}

export function signToken(payload: JwtPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
        issuer: 'order-service',
        audience: 'order-service'
    });
}

export function verifyToken(token: string): JwtPayload {
    return jwt.verify(token, JWT_SECRET, {
        issuer: 'order-service',
        audience: 'order-service'
    }) as JwtPayload;
}

// Express middleware
export function authenticate(req, res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing token' });
    }
    try {
        req.user = verifyToken(header.slice(7));
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
}

// Role guard
export function requireRole(...roles: string[]) {
    return (req, res, next) => {
        if (!roles.some(r => req.user.roles.includes(r))) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }
        next();
    };
}
```

---

## Session Handling with Redis

For web apps where you need session revocation (logout, force-expire):

```javascript
import session from 'express-session';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';

const redisClient = createClient({ url: process.env.REDIS_URL });
await redisClient.connect();

app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',  // HTTPS only in prod
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000   // 24 hours
    }
}));

// Login
app.post('/auth/login', async (req, res) => {
    const user = await userService.authenticate(req.body.email, req.body.password);
    req.session.userId = user.id;
    req.session.roles  = user.roles;
    res.json({ message: 'Logged in' });
});

// Logout — invalidates session in Redis immediately
app.post('/auth/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logged out' });
});
```

---

## Rate Limiting

```javascript
import { rateLimit } from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';

// Global rate limit
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    limit: 100,                // 100 requests per window
    message: { error: 'Too many requests, please try again later' },
    store: new RedisStore({ sendCommand: (...args) => redisClient.sendCommand(args) })
}));

// Stricter limit for auth endpoints
const authRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    skipSuccessfulRequests: true   // only count failed attempts
});

app.post('/auth/login', authRateLimit, loginHandler);
app.post('/auth/register', authRateLimit, registerHandler);
```
