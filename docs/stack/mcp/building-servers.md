---
title: Building MCP Servers
description: Building production-quality MCP servers with the TypeScript SDK — tools with Zod validation, resources, prompts, stdio and SSE transports, error handling, and testing with MCP Inspector.
---

# Building MCP Servers

This page walks through building a real MCP server from scratch using the official TypeScript SDK. Every concept from the Core Concepts page becomes concrete code here. By the end you will have a production-ready server with tools, resources, prompts, proper error handling, and a working test setup.

---

## Setup

```bash
mkdir my-mcp-server && cd my-mcp-server
npm init -y
npm install @modelcontextprotocol/sdk zod
npm install --save-dev typescript @types/node tsx
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
  }
}
```

```json
// package.json scripts
{
  "scripts": {
    "dev":   "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

---

## The Minimal Server

```typescript
// src/index.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

// Create the server
const server = new McpServer({
  name: 'my-mcp-server',
  version: '1.0.0'
});

// Connect via stdio transport
const transport = new StdioServerTransport();
await server.connect(transport);
// Server is now listening on stdin/stdout
```

That's the complete boilerplate. Everything else is registering tools, resources, and prompts.

---

## Implementing Tools

```typescript
import { z } from 'zod';

// Register a tool with Zod schema validation
server.tool(
  'search_orders',
  'Search the orders database by customer email, status, or date range. ' +
  'Returns a list of matching orders with ID, status, total, and date. ' +
  'Use for questions about order history. Does NOT modify data.',
  {
    // Zod schema — automatically converted to JSON Schema for the protocol
    email:     z.string().email().optional().describe('Filter by customer email'),
    status:    z.enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])
                .optional().describe('Filter by order status'),
    since:     z.string().datetime().optional().describe('ISO 8601 datetime — only orders after this date'),
    limit:     z.number().int().min(1).max(100).default(20).describe('Max results to return')
  },
  async ({ email, status, since, limit }) => {
    try {
      const orders = await db.query(
        `SELECT id, status, total, created_at
         FROM orders
         WHERE ($1::text IS NULL OR customer_email = $1)
           AND ($2::text IS NULL OR status = $2)
           AND ($3::timestamptz IS NULL OR created_at >= $3)
         ORDER BY created_at DESC
         LIMIT $4`,
        [email ?? null, status ?? null, since ?? null, limit]
      );

      if (orders.length === 0) {
        return {
          content: [{ type: 'text', text: 'No orders found matching the given filters.' }]
        };
      }

      const summary = orders.map(o =>
        `• Order ${o.id}: ${o.status} — $${o.total.toFixed(2)} on ${o.created_at.toDateString()}`
      ).join('\n');

      return {
        content: [{ type: 'text', text: `Found ${orders.length} orders:\n\n${summary}` }]
      };

    } catch (err) {
      // Return an error result (isError: true) — do NOT throw
      return {
        content: [{ type: 'text', text: `Database error: ${(err as Error).message}` }],
        isError: true
      };
    }
  }
);
```

### Tool result content types

```typescript
// Text result (most common)
return {
  content: [{ type: 'text', text: 'Operation completed successfully.' }]
};

// Image result
return {
  content: [{
    type: 'image',
    data: base64ImageData,
    mimeType: 'image/png'
  }]
};

// Multiple content blocks
return {
  content: [
    { type: 'text', text: `Found ${count} results:` },
    { type: 'text', text: formattedTable }
  ]
};

// Error result — use isError: true instead of throwing
return {
  content: [{ type: 'text', text: `Error: ${errorMessage}` }],
  isError: true
};
```

> **Never throw unhandled errors from tool handlers.** Unhandled exceptions crash the server process. Always catch errors and return `{ isError: true }` results so the AI can report them gracefully to the user.

---

## Implementing Resources

```typescript
// Static resource — same content every request
server.resource(
  'api-docs',
  'file:///project/API.md',
  {
    name: 'API Documentation',
    description: 'Complete REST API reference for the orders service',
    mimeType: 'text/markdown'
  },
  async (uri) => {
    const content = await fs.readFile('./docs/API.md', 'utf-8');
    return {
      contents: [{
        uri: uri.href,
        mimeType: 'text/markdown',
        text: content
      }]
    };
  }
);

// Dynamic resource — parameterised by URI template
server.resource(
  'order-detail',
  new ResourceTemplate('postgres://orders/{orderId}', { list: undefined }),
  {
    name: 'Order Detail',
    description: 'Full details of a specific order including all items',
    mimeType: 'application/json'
  },
  async (uri, { orderId }) => {
    const order = await db.query(
      'SELECT * FROM orders WHERE id = $1',
      [orderId]
    );

    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    return {
      contents: [{
        uri: uri.href,
        mimeType: 'application/json',
        text: JSON.stringify(order, null, 2)
      }]
    };
  }
);
```

---

## Implementing Prompts

```typescript
server.prompt(
  'summarise_customer',
  'Generate a comprehensive customer summary including order history, spending patterns, and recommended actions',
  {
    customerId: z.string().describe('The customer UUID'),
    period:     z.enum(['30d', '90d', '1y', 'all']).default('90d')
                 .describe('Time period to analyse')
  },
  async ({ customerId, period }) => {
    // Fetch data to embed in the prompt
    const customer = await customerRepo.findById(customerId);
    const orders   = await orderRepo.findByCustomer(customerId, period);

    const orderSummary = orders.map(o =>
      `- ${o.createdAt.toDateString()}: ${o.status} — $${o.total}`
    ).join('\n');

    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text:
              `Analyse this customer and provide actionable insights:\n\n` +
              `**Customer:** ${customer.name} (${customer.email})\n` +
              `**Account created:** ${customer.createdAt.toDateString()}\n\n` +
              `**Orders (last ${period}):**\n${orderSummary}\n\n` +
              `Please provide:\n` +
              `1. Spending pattern analysis\n` +
              `2. Customer health score (1-10) with reasoning\n` +
              `3. Risk factors (churn, support burden)\n` +
              `4. Recommended actions for the account team`
          }
        }
      ]
    };
  }
);
```

---

## HTTP + SSE Transport (Remote Server)

For servers that need to be shared across a team or deployed to the cloud:

```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import express from 'express';

const app = express();
app.use(express.json());

// Map of active sessions
const transports: Map<string, SSEServerTransport> = new Map();

// SSE endpoint — clients connect here for server-push
app.get('/sse', async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.MCP_API_KEY) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const transport = new SSEServerTransport('/messages', res);
  const sessionId = transport.sessionId;
  transports.set(sessionId, transport);

  const server = new McpServer({ name: 'orders-server', version: '1.0.0' });
  registerTools(server);       // your tool registrations
  registerResources(server);

  res.on('close', () => {
    transports.delete(sessionId);
  });

  await server.connect(transport);
});

// POST endpoint — clients send messages here
app.post('/messages', async (req, res) => {
  const sessionId = req.query.sessionId as string;
  const transport = transports.get(sessionId);

  if (!transport) {
    res.status(404).json({ error: 'Session not found' });
    return;
  }

  await transport.handlePostMessage(req, res);
});

app.listen(3000, () => console.log('MCP server on :3000'));
```

---

## Logging

MCP servers can send structured log messages to the host via the `logging` capability:

```typescript
import { LoggingLevel } from '@modelcontextprotocol/sdk/types.js';

// In your tool handler
server.server.notification({
  method: 'notifications/message',
  params: {
    level: 'info',
    logger: 'orders-tool',
    data: `Querying orders for customer: ${email}`
  }
});
```

The host (Claude Desktop, Cursor) will surface these logs in its developer console.

---

## Testing with MCP Inspector

MCP Inspector is the official browser-based debugging tool for MCP servers:

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

This opens a browser UI where you can:
- See all registered tools, resources, and prompts
- Call tools with custom arguments and see the raw JSON response
- Browse resources and their content
- Test prompt generation with parameters
- Inspect all JSON-RPC messages in real time

```bash
# For SSE servers, point Inspector at the URL
npx @modelcontextprotocol/inspector --transport sse --url http://localhost:3000/sse
```

---

## Production Checklist

```typescript
// 1. Validate all tool inputs with Zod schemas (automatic with SDK)

// 2. Always return errors as isError: true, never throw
async handler(args) {
  try { /* work */ }
  catch (err) {
    return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
  }
}

// 3. Use parameterised queries — never concatenate user input into SQL or shell commands
await db.query('SELECT * FROM orders WHERE id = $1', [args.orderId]);  // CORRECT
await db.query(`SELECT * FROM orders WHERE id = '${args.orderId}'`);  // SQL INJECTION

// 4. Apply principle of least privilege to credentials
// Read-only DB user for read-only tools
// Scoped API tokens with only required permissions

// 5. Validate that resource URIs are within expected scope
const resolved = path.resolve(args.filePath);
if (!resolved.startsWith(allowedRoot)) {
  return { content: [{ type: 'text', text: 'Access denied: path outside workspace' }], isError: true };
}

// 6. Never log secrets or sensitive data
// 7. Handle process shutdown cleanly
process.on('SIGTERM', async () => {
  await db.end();
  process.exit(0);
});
```
