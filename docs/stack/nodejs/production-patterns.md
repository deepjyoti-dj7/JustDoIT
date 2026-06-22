---
title: Production Patterns
description: PM2 process management, structured logging with Pino, graceful shutdown, Docker packaging, and memory leak detection in Node.js.
---

# Production Patterns

A Node.js application in production needs to survive crashes, log in a machine-readable format, drain in-flight requests before shutdown, run across multiple CPU cores, and fit into a small Docker image. This page covers the operational patterns that make Node.js reliable in production.

---

## PM2 — Process Management

PM2 manages Node.js processes in production: starts them, restarts on crash, distributes across CPU cores, and provides log management.

```javascript
// ecosystem.config.cjs
module.exports = {
    apps: [{
        name:          'order-service',
        script:        'dist/index.js',
        instances:     'max',          // one per CPU core
        exec_mode:     'cluster',      // PM2 cluster mode
        watch:         false,
        max_memory_restart: '512M',    // restart if memory exceeds 512 MB
        env: {
            NODE_ENV: 'production',
            PORT: 3000
        },
        error_file:    './logs/error.log',
        out_file:      './logs/out.log',
        merge_logs:    true,
        log_date_format: 'YYYY-MM-DD HH:mm:ss'
    }]
};
```

```bash
pm2 start ecosystem.config.cjs
pm2 reload order-service   # zero-downtime reload
pm2 stop order-service
pm2 logs order-service
pm2 monit                   # real-time dashboard
pm2 startup                 # generate systemd/upstart/launchd script
```

> **In Kubernetes, you do not need PM2.** Kubernetes restarts crashed pods and scales with replica count. Use a single-process Node.js instance in your container and rely on Kubernetes for orchestration. PM2 is for VMs or bare-metal deployments.

---

## Structured Logging with Pino

Pino is the fastest Node.js logger. It writes NDJSON by default — machine-readable logs that Splunk, CloudWatch Logs Insights, and Loki can query efficiently.

```javascript
import pino from 'pino';

export const logger = pino({
    level: process.env.LOG_LEVEL ?? 'info',
    redact: ['req.headers.authorization', 'body.password', 'body.creditCard'],
    serializers: {
        req: pino.stdSerializers.req,
        res: pino.stdSerializers.res,
        err: pino.stdSerializers.err
    },
    formatters: {
        level(label) { return { level: label }; }
    }
});

// Child logger with fixed context
const requestLogger = logger.child({ requestId: '123', userId: 'user-456' });
requestLogger.info('Order created', { orderId: 'order-789' });
// Output: {"level":"info","requestId":"123","userId":"user-456","msg":"Order created","orderId":"order-789"}

// Request logging middleware
app.use((req, res, next) => {
    req.log = logger.child({ requestId: req.headers['x-request-id'] ?? crypto.randomUUID() });
    const start = Date.now();
    res.on('finish', () => {
        req.log.info({
            method: req.method,
            url:    req.url,
            status: res.statusCode,
            ms:     Date.now() - start
        }, 'Request completed');
    });
    next();
});
```

---

## Graceful Shutdown

Without graceful shutdown, SIGTERM from Kubernetes kills the process mid-request:

```javascript
import { createServer } from './app.js';

const server = http.createServer(app);
server.listen(3000);

// Track in-flight requests
let connections = 0;
server.on('connection', socket => {
    connections++;
    socket.on('close', () => connections--);
});

function shutdown(signal) {
    logger.info({ signal }, 'Shutdown signal received');

    // Stop accepting new connections
    server.close(() => {
        logger.info('HTTP server closed');
        // Close database pool, Redis client, etc.
        prisma.$disconnect();
        redisClient.quit();
        process.exit(0);
    });

    // Force exit after 30 seconds if graceful shutdown hangs
    const forceExit = setTimeout(() => {
        logger.error('Forcing shutdown after timeout');
        process.exit(1);
    }, 30_000);
    forceExit.unref(); // don't keep event loop alive for this timer
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));
```

---

## Docker Packaging

```dockerfile
FROM node:20-alpine AS base
WORKDIR /app
# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

FROM base AS build
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM base
COPY --from=deps  /app/node_modules ./node_modules
COPY --from=build /app/dist         ./dist
USER node
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

---

## Memory Leak Detection

Node.js memory leaks are usually caused by: accumulting event listeners, closures holding large objects, or caches without eviction.

```javascript
// Detect listener leaks — EventEmitter warns if >10 listeners on one event
emitter.setMaxListeners(20);  // increase if you legitimately need more

// --inspect flag opens Chrome DevTools for heap snapshots
node --inspect dist/index.js

// Heap snapshot programmatically
import v8 from 'v8';
import { writeFileSync } from 'fs';

process.on('SIGUSR2', () => {
    const snapshot = v8.writeHeapSnapshot();
    logger.info({ snapshot }, 'Heap snapshot written');
});
// kill -USR2 <pid>  then open in Chrome DevTools -> Memory -> Load snapshot
```

```bash
# clinic.js — visual profiling
npm install -g clinic
clinic doctor -- node dist/index.js     # CPU, memory, event loop delay
clinic flame  -- node dist/index.js     # flame graph for CPU profiling
clinic bubbleprof -- node dist/index.js # async operation profiling
```
