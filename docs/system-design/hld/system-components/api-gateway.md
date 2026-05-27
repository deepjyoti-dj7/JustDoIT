---
title: API Gateway
---

# API Gateway

An API Gateway is the single entry point for all client-to-backend communication in a microservices architecture. It sits in front of your services and handles cross-cutting concerns — authentication, rate limiting, routing, transformation — so individual services don't have to.

> **The mental model:** An API Gateway is to microservices what a receptionist is to a large office. All visitors go through one desk; the receptionist verifies identity, routes them to the right room, and enforces building rules — so individual teams don't need to manage visitors themselves.

---

## The Problem Without an API Gateway

In a microservices system, clients would need to know about every service:

```mermaid
graph LR
    Mobile["Mobile App"]
    Web["Web App"]

    US["User Service\n:8001"]
    OS["Order Service\n:8002"]
    PS["Product Service\n:8003"]
    NS["Notification Service\n:8004"]

    Mobile --> US
    Mobile --> OS
    Mobile --> PS
    Mobile --> NS
    Web --> US
    Web --> OS
    Web --> PS
    Web --> NS
```

**Problems:**

- Clients must know the internal address of every service
- Each service must implement auth, rate limiting, CORS, logging independently
- Changing a service's URL requires updating all clients
- Mobile apps can't be forced to update — API contracts break

---

## The API Gateway Solution

```mermaid
graph LR
    Mobile["Mobile App"]
    Web["Web App"]
    Third["Third-Party\nIntegrations"]

    GW["API Gateway\nSingle Entry Point"]

    US["User Service"]
    OS["Order Service"]
    PS["Product Service"]
    NS["Notification Service"]

    Mobile --> GW
    Web --> GW
    Third --> GW

    GW -->|"/users/*"| US
    GW -->|"/orders/*"| OS
    GW -->|"/products/*"| PS
    GW -->|"/notify/*"| NS
```

Now clients interact with one stable endpoint. Internal services can change independently.

---

## Core Responsibilities

An API Gateway is not just a router. It handles a full stack of cross-cutting concerns:

```mermaid
flowchart TD
    Client["Client Request"]

    A["1. SSL Termination\nDecrypt HTTPS"]
    B["2. Authentication\nVerify JWT / API key"]
    C["3. Authorization\nCheck permissions"]
    D["4. Rate Limiting\nThrottle abuse"]
    E["5. Request Routing\nRoute to correct service"]
    F["6. Request Transformation\nHeader injection, protocol translation"]
    G["7. Load Balancing\nAcross service instances"]
    H["8. Response Transformation\nAggregation, filtering"]
    I["9. Logging & Tracing\nRequest ID, distributed trace"]
    J["10. Caching\nCache GET responses"]

    Client --> A --> B --> C --> D --> E --> F --> G --> H --> I --> J
```

### 1. Authentication & Authorization

The gateway verifies every request's identity before it reaches a service:

```mermaid
sequenceDiagram
    participant Client
    participant Gateway
    participant Auth Service
    participant Order Service

    Client->>Gateway: POST /orders (Bearer: jwt_token)
    Gateway->>Auth Service: Validate jwt_token
    Auth Service-->>Gateway: {userId: 42, roles: ["customer"]}
    Gateway->>Order Service: POST /orders (X-User-Id: 42)
    Order Service-->>Gateway: 201 Created
    Gateway-->>Client: 201 Created
```

Services receive the user identity in trusted headers — they never parse JWTs themselves. This centralizes auth logic and prevents services from needing auth library dependencies.

### 2. Rate Limiting

Prevent abuse and ensure fair use:

```
Per-user:    100 requests/minute
Per-API-key: 1000 requests/minute
Per-IP:      500 requests/minute
Global:      50,000 requests/second
```

When exceeded, the gateway returns `429 Too Many Requests` with a `Retry-After` header — services never see the excess traffic.

### 3. Request Routing

Route based on URL path, HTTP method, headers, or query parameters:

```yaml
# Example routing config (Kong/Traefik style)
routes:
  - path: /api/v1/users
    service: user-service
    methods: [GET, POST]
  - path: /api/v1/orders
    service: order-service
    methods: [GET, POST, PUT]
  - path: /internal/admin
    service: admin-service
    auth_required: true
    allowed_roles: [admin]
```

### 4. API Aggregation (Backend for Frontend)

A gateway can aggregate multiple service calls into a single response, reducing client round-trips:

```mermaid
sequenceDiagram
    participant Mobile
    participant Gateway
    participant User Service
    participant Order Service
    participant Product Service

    Mobile->>Gateway: GET /dashboard

    par Parallel calls
        Gateway->>User Service: GET /users/42
        Gateway->>Order Service: GET /orders?userId=42
        Gateway->>Product Service: GET /products?ids=1,2,3
    end

    User Service-->>Gateway: user data
    Order Service-->>Gateway: orders
    Product Service-->>Gateway: products

    Gateway-->>Mobile: Combined dashboard response
```

Without aggregation, the mobile app would make 3 separate requests. With aggregation, one request does all three — critical for mobile networks where connection overhead matters.

### 5. Protocol Translation

Clients speak HTTP/REST; internal services may speak gRPC, GraphQL, WebSockets, or even legacy SOAP. The gateway handles translation:

```
Client HTTP/REST → Gateway → gRPC (internal service)
Client REST      → Gateway → AMQP (async queue)
Client WebSocket → Gateway → HTTP streaming (service)
```

---

## API Gateway vs. Load Balancer vs. Reverse Proxy

This is a common interview question. The three are related but serve different purposes:

| Concern                | Load Balancer                       | Reverse Proxy                  | API Gateway                         |
| ---------------------- | ----------------------------------- | ------------------------------ | ----------------------------------- |
| **Primary job**        | Distribute traffic across instances | Forward requests, hide backend | Manage API policies across services |
| **Protocol awareness** | L4 (TCP) or L7 (HTTP)               | L7 (HTTP)                      | L7 (HTTP/gRPC/WebSocket)            |
| **Authentication**     | ❌                                  | Sometimes                      | ✅ Core feature                     |
| **Rate limiting**      | ❌                                  | Sometimes                      | ✅ Core feature                     |
| **Routing**            | Instance selection                  | Path-based                     | Service + path + header + auth      |
| **Aggregation**        | ❌                                  | ❌                             | ✅                                  |
| **Target**             | Server instances                    | Any backend                    | Microservices                       |

> In practice, these overlap. NGINX can act as all three. AWS ALB + API Gateway is a common combination where ALB handles L7 load balancing and API Gateway handles auth/rate limiting.

---

## Request/Response Transformation

The gateway can rewrite requests and responses without touching services:

```
# Add internal headers
X-Request-ID: uuid-generated-by-gateway
X-User-Id: 42
X-Correlation-Id: trace-span-id

# Rewrite URLs
/api/v2/users → /users (service internal path)

# Strip sensitive headers from responses
Remove: X-Internal-Service-Token
Remove: X-Debug-Info
```

This enables **API versioning** — the gateway translates v1 to v2 format, so the service only handles one version.

---

## Canary Deployments and A/B Testing

The gateway is the perfect place to implement gradual rollouts:

```mermaid
graph TD
    Request["Incoming Request"]
    GW["API Gateway\n(routing policy)"]

    GW -->|"90% traffic"| V1["Order Service v1\n(stable)"]
    GW -->|"10% traffic"| V2["Order Service v2\n(canary)"]
```

Route based on user ID hash, cookie, header, or random percentage. Gradually increase the canary percentage while monitoring error rates.

---

## Real-World API Gateways

| Gateway                  | Type                     | Key Feature                                    |
| ------------------------ | ------------------------ | ---------------------------------------------- |
| **AWS API Gateway**      | Managed cloud            | Serverless-native, deep Lambda integration     |
| **Kong**                 | Open source / Enterprise | Plugin ecosystem, highly extensible            |
| **NGINX**                | Self-managed             | High performance, proxy + gateway hybrid       |
| **Traefik**              | Open source              | Native Kubernetes, automatic service discovery |
| **Envoy**                | Open source              | xDS config, service mesh foundation (Istio)    |
| **Apigee** (Google)      | Enterprise managed       | Analytics, monetization, full lifecycle        |
| **Azure API Management** | Managed cloud            | Azure integration, developer portal            |

---

## Design Considerations and Tradeoffs

### The Bottleneck Risk

Every request passes through the gateway. It must be:

- **Horizontally scalable** (multiple gateway instances behind a load balancer)
- **Stateless** (state in Redis, not in process memory)
- **Fast** (adds <5ms overhead per request ideally)

```mermaid
graph TD
    Internet --> DNS
    DNS --> LB["Load Balancer\n(L4/L7)"]
    LB --> GW1["API Gateway Instance 1"]
    LB --> GW2["API Gateway Instance 2"]
    LB --> GW3["API Gateway Instance 3"]

    GW1 & GW2 & GW3 --> Redis["Shared Redis\n(rate limit state)"]
    GW1 & GW2 & GW3 --> Services["Backend Services"]
```

### Avoid Putting Business Logic in the Gateway

The gateway should handle **cross-cutting infrastructure concerns** only:

- ✅ Auth, rate limiting, routing, logging, tracing
- ❌ Business validation ("Is this order amount valid?")
- ❌ Data transformation beyond format conversion
- ❌ Orchestration logic (use orchestration services instead)

Business logic in the gateway is hard to test, deploy independently, or reuse.

---

## Interview Talking Points

### What the interviewer wants to hear

**1. Position in the architecture**

> "The API Gateway sits between clients and services, handling auth, rate limiting, and routing centrally so individual services stay lean."

**2. How it handles auth**

> "The gateway validates JWTs against our auth service on every request. Valid tokens get the user ID injected as a trusted header so services can trust it without re-validating."

**3. Scaling the gateway itself**

> "The gateway is stateless — all rate limit state lives in Redis. We run multiple instances behind an NLB, so it's not a single point of failure."

**4. The BFF pattern (Backend for Frontend)**

> "For mobile vs. web, we'd use separate gateway configurations — the mobile gateway aggregates calls and returns compact responses, while the web gateway can tolerate more round-trips."

---

## Key Takeaways

- The API Gateway is the **single entry point** for all external traffic into a microservices system
- It centralizes **auth, rate limiting, routing, and observability** — so services don't have to implement them
- **Not a replacement for load balancers** — they work together (LB distributes to gateway instances, gateway routes to services)
- The gateway must be **scalable and highly available** — it's in the critical path of every request
- **Avoid business logic** in the gateway — keep it to infrastructure concerns
- The **Backend for Frontend (BFF) pattern** uses specialized gateway configurations per client type
