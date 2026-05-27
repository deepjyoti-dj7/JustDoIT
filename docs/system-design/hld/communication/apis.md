---
title: APIs
---

# APIs

An API (Application Programming Interface) is a contract between a provider and a consumer — a defined set of operations, inputs, outputs, and behaviors that allows two pieces of software to communicate without either needing to know the other's internal implementation.

> **APIs are the seams of distributed systems.** Every microservice, every third-party integration, every mobile app, every partner connection is mediated by an API. Designing APIs well is one of the highest-leverage engineering activities — a bad API is extraordinarily expensive to change once clients depend on it.

---

## Why APIs Exist

Without APIs, software systems would be monolithic silos that can't share capabilities:

```mermaid
graph TD
    subgraph "Without APIs (monolithic silo)"
        M1["Your App\n(all logic internal)"]
    end

    subgraph "With APIs (composable ecosystem)"
        A["Your App"]
        B["Stripe\n(payments API)"]
        C["Twilio\n(SMS API)"]
        D["Google Maps\n(geo API)"]
        E["Auth0\n(identity API)"]
        F["SendGrid\n(email API)"]

        A --> B & C & D & E & F
    end
```

APIs enable:

- **Encapsulation** — hide implementation, expose behavior
- **Composability** — build complex systems from specialized providers
- **Independent scaling** — each service scales its own API
- **Team autonomy** — teams own their API contract; internal changes don't cascade

---

## The API Communication Landscape

Different API styles suit different communication patterns:

```mermaid
graph TD
    API["API Style"]

    REST["REST\nResource-oriented\nHTTP verbs\nStateless\nBest: public APIs, CRUD"]
    GQL["GraphQL\nQuery language\nClient-defined shape\nBest: complex, nested data"]
    RPC["gRPC / RPC\nProcedure-oriented\nStrong types (Protobuf)\nBest: internal microservices"]
    WS["WebSocket\nBidirectional streaming\nLong-lived connection\nBest: real-time, chat, games"]
    SSE["Server-Sent Events\nServer → Client push\nHTTP-based\nBest: live feeds, notifications"]
    MQ["Message Queues\nAsync, decoupled\nBest: background jobs, event-driven"]

    API --> REST & GQL & RPC & WS & SSE & MQ
```

| Style             | Direction                    | Synchrony    | Protocol         | Best For                      |
| ----------------- | ---------------------------- | ------------ | ---------------- | ----------------------------- |
| **REST**          | Request/Response             | Synchronous  | HTTP/1.1, HTTP/2 | Public APIs, CRUD             |
| **GraphQL**       | Request/Response             | Synchronous  | HTTP             | Complex client-driven queries |
| **gRPC**          | Request/Response + Streaming | Sync & Async | HTTP/2           | Internal microservices        |
| **WebSocket**     | Bidirectional                | Asynchronous | TCP (WS)         | Real-time, chat, gaming       |
| **SSE**           | Server → Client              | Asynchronous | HTTP             | Live feeds, notifications     |
| **Message Queue** | Async, decoupled             | Asynchronous | AMQP, Kafka      | Background jobs, event-driven |

---

## API Anatomy

Every API interaction has the same structure regardless of style:

```mermaid
sequenceDiagram
    participant Client
    participant API as API Gateway / Service
    participant Backend

    Client->>API: Request\n(endpoint + method + headers + body)
    API->>API: Auth, rate-limit, validate
    API->>Backend: Forward (or handle internally)
    Backend-->>API: Internal response
    API-->>Client: Response\n(status + headers + body)
```

**Request components:**

- **Endpoint:** The resource address (`/api/v1/orders/42`)
- **Method:** The intended action (`GET`, `POST`, `PUT`, `DELETE`, `PATCH`)
- **Headers:** Metadata (`Authorization`, `Content-Type`, `Accept`, `X-Request-Id`)
- **Body:** Data payload (JSON, Protobuf, form data)

**Response components:**

- **Status code:** Machine-readable outcome (`200 OK`, `404 Not Found`, `429 Too Many Requests`)
- **Headers:** Response metadata (`Content-Type`, `Cache-Control`, `ETag`, `Retry-After`)
- **Body:** The returned data or error detail

---

## API Versioning

APIs must evolve while preserving backward compatibility. Strategies:

### URI Versioning (Most Common)

```
GET /api/v1/users/42
GET /api/v2/users/42
```

**Pro:** Explicit, easy to route, easy to cache.  
**Con:** URL changes; clients must update base URLs.

### Header Versioning

```
GET /api/users/42
Accept: application/vnd.yourapi.v2+json
```

**Pro:** Clean URLs.  
**Con:** Headers are less visible; harder to test in browser.

### Query Parameter Versioning

```
GET /api/users/42?version=2
```

**Pro:** Easy to add.  
**Con:** Pollutes query strings; caching complications.

**Which to choose:** URI versioning is the industry standard for public APIs (Stripe, GitHub, Twitter all use it). Header versioning is common in enterprise/internal APIs.

---

## API Authentication Patterns

| Method                 | How It Works                         | Use Case                             |
| ---------------------- | ------------------------------------ | ------------------------------------ |
| **API Key**            | Secret key in header or query string | Server-to-server, public APIs        |
| **OAuth 2.0**          | Token-based delegation               | Third-party access on behalf of user |
| **JWT (Bearer token)** | Signed token with claims             | Stateless auth, microservices        |
| **mTLS**               | Client presents certificate          | High-security service-to-service     |
| **Basic Auth**         | Base64 username:password             | Internal, development only           |

```
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
X-API-Key: sk_live_4xK9...
```

---

## API Rate Limiting

Rate limiting protects APIs from abuse and ensures fair usage:

```mermaid
graph TD
    Client["Client Request"]
    RL["Rate Limiter\n(per user / per IP / per API key)"]
    Allow["Allow\n(under limit)"]
    Deny["429 Too Many Requests\nRetry-After: 30"]

    Client --> RL
    RL -->|"tokens available"| Allow
    RL -->|"bucket empty"| Deny
```

**Common algorithms:**

- **Token bucket:** Tokens refill at a fixed rate. Burst allowed up to bucket size.
- **Leaky bucket:** Requests drain at a constant rate regardless of burst.
- **Fixed window counter:** Count requests per time window (e.g., 1000/hour).
- **Sliding window:** More accurate, avoids edge-of-window bursts.

**Headers to include in rate-limited responses:**

```
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1716825600
Retry-After: 30
```

---

## API Gateway

The API gateway is the single entry point for all client API calls to a backend system:

```mermaid
graph TD
    Mobile["Mobile App"]
    Web["Web Browser"]
    Partner["Partner System"]

    GW["API Gateway\n\n• Auth & authorization\n• Rate limiting\n• Request routing\n• SSL termination\n• Request/response transformation\n• Logging & metrics\n• Caching\n• Circuit breaking"]

    S1["Orders Service"]
    S2["Users Service"]
    S3["Payments Service"]
    S4["Inventory Service"]

    Mobile & Web & Partner --> GW
    GW --> S1 & S2 & S3 & S4
```

**Why not call services directly?**

- Avoids N×M cross-cutting concerns (every service implements auth, rate limiting, logging separately)
- Single TLS termination point
- Enables backend changes without updating client URLs

**Real-world implementations:** AWS API Gateway, Kong, NGINX, Envoy, Traefik, Apigee

---

## API Design Principles (Quick Reference)

A well-designed API is:

1. **Intuitive** — a developer can guess how it works without reading docs
2. **Consistent** — same patterns everywhere (naming, errors, pagination)
3. **Stable** — backward compatible; breaking changes are versioned
4. **Documented** — OpenAPI/Swagger spec + examples
5. **Secure** — auth, rate limiting, input validation, HTTPS only

> Full API design principles are covered in depth in the [API Design](./api-design.md) article.

---

## Real-World API Examples

**Stripe (REST):** Clean resource hierarchy, idempotency keys on POST, detailed error objects with `code`, `message`, `param` — the gold standard for public API design.

**GitHub (REST + GraphQL):** Offers both REST v3 (simple, familiar) and GraphQL v4 (for clients that need precise data shapes — like fetching 50 repos with their last 3 commits in one call).

**Slack (WebSocket + REST):** Real-time events over WebSocket (RTM API); resource management over REST. The hybrid pattern for real-time applications.

**Twitch (GraphQL):** Fully GraphQL — their UI requires dozens of related data types per page. GraphQL let them build a single endpoint that serves all frontend data needs.

---

## Interview Talking Points

**1. How do you decide between REST, GraphQL, and gRPC?**

> "REST is my default for public-facing APIs — it's well-understood, HTTP-native, and works everywhere. gRPC for internal service-to-service communication where strong typing and performance matter (Protobuf is 5–10x smaller than JSON). GraphQL when clients have diverse and complex data needs — multiple UI surfaces querying the same backend with different shapes. If I need bidirectional real-time, WebSocket. If server needs to push updates without client polling, SSE."

**2. How do you handle API versioning without breaking clients?**

> "I use URI versioning (v1, v2) and maintain the old version until all clients migrate. I follow additive changes (add new fields, never remove) within a major version. When a breaking change is unavoidable, I release v2, document the migration, set a deprecation date (minimum 6 months for external APIs), and monitor traffic to know when v1 is safe to retire."

**3. What happens when an API call fails? How do you design for failure?**

> "I design clients to handle: 5xx (server errors — retry with exponential backoff + jitter), 429 (rate limited — respect Retry-After header), 4xx (client errors — don't retry, fix the request), timeouts (retry with idempotency key). On the server side, I implement circuit breakers to stop cascading failures when a downstream service is unhealthy."

---

## Key Takeaways

- APIs are **contracts** — changing them carelessly breaks clients
- Choose **REST** for public APIs, **gRPC** for internal services, **GraphQL** for complex multi-shape queries
- **Versioning** (URI-based) is essential for any API that external clients depend on
- **Rate limiting** protects your system — always respond with `429` and `Retry-After`
- **API gateways** centralize cross-cutting concerns (auth, rate limiting, routing) so services don't each implement them
- The best APIs are **intuitive, consistent, stable, documented, and secure**
