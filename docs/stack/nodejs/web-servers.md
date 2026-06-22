---
title: Web Servers
description: Building REST APIs with Express and Fastify, middleware patterns, input validation with Zod, and structured error handling.
---

# Web Servers

Node.js has two dominant web frameworks: **Express** (the veteran, simple and flexible) and **Fastify** (modern, schema-first, dramatically faster serialization). Both are excellent choices. Express wins on familiarity and ecosystem; Fastify wins on performance, TypeScript ergonomics, and built-in schema validation.

---

## Express.js

### Application structure

```javascript
// app.js
import express from 'express';
import helmet from 'helmet';
import { orderRouter } from './routes/orders.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Middleware runs in order — order matters
app.use(helmet());                           // security headers
app.use(express.json({ limit: '1mb' }));     // parse JSON body
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    req.startTime = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - req.startTime;
        logger.info({ method: req.method, path: req.path,
                      status: res.statusCode, duration });
    });
    next();
});

// Routes
app.use('/api/v1/orders', orderRouter);
app.use('/health', (req, res) => res.json({ status: 'ok' }));

// 404 handler — after all routes
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// Error handler — MUST have 4 params
app.use(errorHandler);

export default app;
```

### Router and controllers

```javascript
// routes/orders.js
import { Router } from 'express';
import { validateBody } from '../middleware/validate.js';
import { createOrderSchema, updateOrderSchema } from '../schemas/order.js';
import * as orderController from '../controllers/orders.js';

const router = Router();

router.get('/',      orderController.list);
router.get('/:id',   orderController.getById);
router.post('/',     validateBody(createOrderSchema), orderController.create);
router.put('/:id',   validateBody(updateOrderSchema), orderController.update);
router.delete('/:id',orderController.remove);

export { router as orderRouter };
```

### Centralised error handler

```javascript
// middleware/errorHandler.js
export function errorHandler(err, req, res, next) {
    if (err.name === 'ZodError') {
        return res.status(400).json({
            error: 'Validation failed',
            details: err.errors.map(e => ({
                field: e.path.join('.'),
                message: e.message
            }))
        });
    }

    if (err.statusCode) {
        return res.status(err.statusCode).json({ error: err.message });
    }

    logger.error('Unhandled error', err);
    res.status(500).json({ error: 'Internal server error' });
}

// Helper to create HTTP errors
export function createHttpError(statusCode, message) {
    const err = new Error(message);
    err.statusCode = statusCode;
    return err;
}
```

---

## Fastify

Fastify's key differences from Express: JSON schema validation is built-in (no middleware needed), serialization is significantly faster (JSON schema + fast-json-stringify), and the plugin system is composable.

```javascript
// app.js
import Fastify from 'fastify';
import fastifyPostgres from '@fastify/postgres';
import { orderRoutes } from './routes/orders.js';

const app = Fastify({
    logger: { level: 'info' }   // built-in Pino logger
});

// Register plugins
await app.register(fastifyPostgres, {
    connectionString: process.env.DATABASE_URL
});

// Register routes with prefix
await app.register(orderRoutes, { prefix: '/api/v1/orders' });

export default app;
```

### Routes with schema validation

```javascript
// routes/orders.js
import { z } from 'zod';

const createOrderSchema = z.object({
    customerId: z.string().uuid(),
    items: z.array(z.object({
        productId: z.string().uuid(),
        quantity:  z.number().int().min(1).max(999)
    })).min(1)
});

export async function orderRoutes(fastify) {

    fastify.post('/', async (request, reply) => {
        const body = createOrderSchema.parse(request.body); // throws ZodError on invalid
        const order = await orderService.create(body);
        reply.code(201);
        return order;
    });

    fastify.get('/:id', async (request, reply) => {
        const order = await orderService.findById(request.params.id);
        if (!order) return reply.code(404).send({ error: 'Not found' });
        return order;
    });

    // Fastify lifecycle hooks
    fastify.addHook('onRequest', async (request, reply) => {
        // Runs before route handler — good for auth
        if (!request.headers.authorization) {
            reply.code(401).send({ error: 'Unauthorized' });
        }
    });
}
```

---

## Input Validation with Zod

Zod is the standard TypeScript-first validation library. It generates TypeScript types from schemas — no duplication:

```typescript
import { z } from 'zod';

const CreateOrderSchema = z.object({
    customerId: z.string().uuid({ message: 'Invalid customer ID' }),
    items: z.array(z.object({
        productId: z.string().uuid(),
        quantity:  z.number().int().positive()
    })).min(1, 'At least one item required').max(50),
    deliveryDate: z.coerce.date().min(new Date(), 'Must be future date').optional(),
    promoCode: z.string().regex(/^[A-Z0-9]{6,12}$/).optional()
});

// TypeScript type inferred automatically — no separate interface needed
type CreateOrderRequest = z.infer<typeof CreateOrderSchema>;

// Validate
const result = CreateOrderSchema.safeParse(requestBody);
if (!result.success) {
    // result.error.errors has field-level detail
    throw new ValidationError(result.error);
}
const validData: CreateOrderRequest = result.data;
```

---

## Express vs Fastify

| | Express | Fastify |
|---|---|---|
| **Performance** | ~50k req/s | ~100k+ req/s |
| **Validation** | Manual (middleware) | Built-in (JSON Schema or Zod plugin) |
| **TypeScript** | Requires @types/express, manual typing | First-class, generic request types |
| **Middleware** | Express middleware (broad ecosystem) | Plugins with encapsulation |
| **Error handling** | 4-param middleware | Custom error handler |
| **Logging** | Bring your own (morgan, winston) | Built-in Pino |
| **Ecosystem** | Huge | Growing, all critical plugins exist |
| **Best for** | Familiar, quick prototypes, large teams with existing Express | New projects, performance-sensitive, TypeScript-first |
