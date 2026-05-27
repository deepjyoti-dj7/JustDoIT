---
title: Stateful vs Stateless
---

# Stateful vs Stateless

A stateless system treats every request as completely independent — the server holds no memory of previous interactions. A stateful system maintains context between requests — the server remembers who you are and what you've done. Statelessness is one of the core REST principles and the key enabler of horizontal scalability; statefulness is necessary when the cost of re-establishing context on each request is prohibitive. Understanding this tradeoff is foundational to designing systems that scale horizontally without painful coordination overhead.

> **Why this matters in interviews:** The stateful vs stateless distinction appears in authentication design (session cookies vs JWTs), WebSocket connection management, service mesh design, and database connection pooling. Interviewers frequently probe whether you understand why stateless services scale easily, what problems arise with stateful services, and how to externalize state to make a service effectively stateless.

---

## The Core Difference

```mermaid
graph TD
    subgraph "Stateless Service"
        Client1["Request from user Alice"]
        Client2["Next request from Alice"]
        
        Server1["Server Instance 1"]
        Server2["Server Instance 2"]
        Server3["Server Instance 3"]
        
        Client1 -->|"Any server handles it\n(no memory needed)"| Server2
        Client2 -->|"Different server? Fine!"| Server1
        
        Note1["Each request carries ALL context\n(JWT token, user ID, request body)\nServer is interchangeable"]
    end

    subgraph "Stateful Service"
        Client3["Request from user Alice"]
        Client4["Next request from Alice"]
        
        ServerS["Server Instance 1\n(stores Alice's session in memory)"]
        
        Client3 -->|"Must go to Server 1\n(Alice's session is here)"| ServerS
        Client4 -->|"MUST also go to Server 1\n(sticky session required)"| ServerS
        
        Note2["State lives in server memory\nRequests must go to the SAME server\nLoad balancer needs sticky sessions"]
    end
```

---

## Stateless Design

### REST + JWT — Stateless Authentication

JWTs embed all user context in the token itself. The server extracts and verifies the token on each request without any server-side session store:

```
Request:
  GET /api/orders
  Authorization: Bearer eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ1c2VyXzEyMyIsInJvbGVzIjpbImFkbWluIl0sImV4cCI6MTcxNjk5OTk5OX0.SflKxwRJSMeKKF2QT4...

Server extracts from JWT:
  user_id: user_123
  roles: ["admin"]
  exp: 1716999999 (not expired)

No database lookup required. Any server with the public key can verify.
```

**Why statelessness enables horizontal scaling:**

```mermaid
graph LR
    LB["Load Balancer\n(round-robin, no sticky sessions)"] 
    
    S1["API Server 1"]
    S2["API Server 2"]
    S3["API Server 3"]
    S4["API Server 4 (just added)"]
    
    LB --> S1
    LB --> S2
    LB --> S3
    LB --> S4
    
    Note["Any request can go to any server.\nAdd servers freely.\nRemove servers freely.\nNo session migration needed."]
```

Adding a new server instance requires zero coordination. The load balancer immediately routes traffic to it. The server has no state to initialize.

### Stateless Services at Scale

- **API servers:** Each request carries authentication (JWT), routing context (URL), and data (request body) — no server memory needed
- **Microservices:** Individual function calls — each invocation is independent
- **CDN edge nodes:** Serve cached content from any PoP based on URL alone
- **Serverless functions (Lambda):** Each invocation is completely independent; the platform can run it on any compute

---

## Stateful Design

### When State Is Unavoidable

Some workloads genuinely require maintained state:

**Database connections:** Database connections are expensive to create (TCP handshake, authentication, session initialization). A connection pool maintains a fixed set of open connections that requests share:

```mermaid
sequenceDiagram
    participant App
    participant Pool as Connection Pool
    participant DB

    App->>Pool: Request connection
    Pool-->>App: Returns existing connection (no setup cost)
    App->>DB: Query using pooled connection
    DB-->>App: Result
    App->>Pool: Return connection to pool
    Note over Pool: Connection stays open for next requester
```

The pool is stateful — it tracks which connections are in use. This is local, bounded state that doesn't affect horizontal scaling of the app server.

**WebSocket connections:** Once established, the WebSocket connection state (the open TCP socket) is bound to one server. The server must maintain the connection object in memory.

**Game servers:** Player position, game state, and physics simulation must be maintained in memory for low-latency computation. Serializing to a database on every frame is too slow.

**ML model inference:** Loading a large model (GPT-4: 700GB weights) into GPU memory is slow (minutes). The server must be stateful — the model stays loaded across requests.

### Session-Based Authentication (Stateful)

Traditional web applications store session state on the server:

```mermaid
sequenceDiagram
    participant User
    participant Server
    participant Redis as Session Store (Redis)

    User->>Server: Login (username + password)
    Server->>Redis: Store: session:abc123 = {user_id: 123, expires: 1h}
    Server-->>User: Set-Cookie: sid=abc123

    User->>Server: Next request (Cookie: sid=abc123)
    Server->>Redis: Lookup: session:abc123
    Redis-->>Server: {user_id: 123, valid}
    Server-->>User: Response
```

With a session store like Redis, sessions are "externalized" — any server can look up any session. This makes the API servers stateless even though sessions are stateful. The state moved from local server memory to a shared external store.

---

## Externalizing State — The Key Pattern

The practical solution for most systems: make the application layer stateless by moving state to a dedicated external store:

```mermaid
graph TD
    Stateful["Initially Stateful Service:\nHolds session data in server memory\nCannot scale horizontally"]
    
    Extract["Extract State to External Store"]
    
    Redis2["Redis / Memcached\nSession store, rate limit counters,\nfeature flags, distributed locks"]
    
    DB2["Database (PostgreSQL)\nDurable user data, orders,\npersistent state"]
    
    S2_1["Stateless App Server 1\n(reads/writes to Redis + DB)"]
    S2_2["Stateless App Server 2\n(reads/writes to Redis + DB)"]
    S2_3["Stateless App Server 3 (new)\n(reads/writes to Redis + DB)"]
    
    Stateful --> Extract
    Extract --> Redis2
    Extract --> DB2
    Redis2 --> S2_1
    Redis2 --> S2_2
    Redis2 --> S2_3
    DB2 --> S2_1
    DB2 --> S2_2
    DB2 --> S2_3
```

Once state is in a shared external store, the application servers become interchangeable. Any server can handle any request. Horizontal scaling is trivial.

---

## Sticky Sessions — When You Need State But Can't Externalize

Some state is too large or too fast-moving to externalize (WebSocket connections, ML model weights). Load balancers use **sticky sessions** (also called session affinity) to route the same user to the same server:

```mermaid
graph TD
    LB["Load Balancer\n(consistent hash on session ID or user ID)"]
    S1["Server 1\nHolds: Alice's WebSocket connection\nUser IDs: alice, bob, carol"]
    S2["Server 2\nHolds: Dave's WebSocket connection\nUser IDs: dave, eve, frank"]
    
    Alice["Alice's request"] -->|"Hash(alice) → Server 1"| LB
    Dave["Dave's request"] -->|"Hash(dave) → Server 2"| LB
    LB --> S1
    LB --> S2
    
    Problem["Problem: If Server 1 dies, Alice's connection dies.\nSolution: Reconnect with exponential backoff."]  
```

**Sticky session pitfalls:**
- Uneven load distribution: if 10% of users are 90% of traffic, they all go to the same server
- Failure recovery: when a server dies, all its sticky users must reconnect and re-establish state
- Rolling deploys are harder: cannot simply kill any server

---

## Comparison

| Dimension | Stateless | Stateful |
|---|---|---|
| **Horizontal scaling** | Trivial — add servers freely | Complex — sticky sessions or state migration |
| **Failure recovery** | Any server handles failover | State lost if server dies (or must be replicated) |
| **Load balancing** | Round-robin, any algorithm | Must use sticky sessions or shared store |
| **Request overhead** | Must carry all context per request (larger payload) | Context stored on server (smaller request) |
| **Server memory** | Minimal (no session state) | Higher (holds session data per user) |
| **Example** | REST API with JWT, CDN, serverless | WebSocket servers, game servers, ML inference |

---

## Interview Talking Points

**1. Why is statelessness a core principle of REST and why does it matter for scalability?**
> "REST's statelessness constraint means every request must contain all the information needed to process it — the server retains no client context between requests. This matters for scalability for three reasons. First, horizontal scaling is trivial: any server can handle any request because no server has special context about any client. Add a new server instance and the load balancer routes to it immediately — zero initialization required. Second, failure recovery is simple: if a server dies, the load balancer routes to another. The client's next request goes to a different server seamlessly because that server has all the context it needs from the request itself. Third, load balancing is unconstrained: round-robin, least-connections, consistent hashing — any algorithm works because there's no sticky session requirement. The cost of statelessness is that each request carries more data (the JWT token, user context), and the server must validate that context on every request. But validation is fast, and the scaling benefits are significant."

**2. What is the difference between stateful authentication (sessions) and stateless authentication (JWTs)?**
> "Session-based authentication is stateful: when a user logs in, the server creates a session record in a database or Redis, stores a session ID in a cookie, and looks up that session on every subsequent request. The server has state — it 'remembers' the user. JWT authentication is stateless: when a user logs in, the server creates a signed token containing user identity and permissions, returns it to the client, and on every subsequent request the client presents the token. The server validates the cryptographic signature — no database lookup required. Sessions have a clear advantage in revocation: delete the session record and the user is immediately logged out. JWTs are valid until they expire, making immediate revocation hard without a denylist (which reintroduces server state). Sessions require a shared session store (Redis) for horizontal scaling; JWTs work on any server with the public key. My preference: JWTs for stateless API servers (short expiry, 5-15 minutes, with revocable refresh tokens), sessions for traditional web applications where immediate logout and session management matter."

**3. How do you scale a stateful WebSocket service horizontally?**
> "WebSocket connections are inherently stateful — the open TCP connection lives on one server. Scaling requires two things: first, sticky sessions at the load balancer so the same user's requests route to the same server (consistent hashing by user ID or connection ID). Second, a message broker (Redis pub/sub) to route messages between servers. When user Alice (on Server 1) needs to receive a message from user Bob (on Server 2), Server 2 publishes to Redis on Alice's channel. Server 1 subscribes to its connected users' channels and delivers to Alice's connection. This scales horizontally — add servers, redistribute connection load. The failure scenario: if Server 1 dies, Alice's connection drops. The client must implement reconnection with exponential backoff. On reconnect, Alice hits a different server and re-establishes her session. The reconnection time is the 'cost' of the stateful design. Some systems handle this with fast reconnection tokens — the client presents a reconnection token that lets the new server restore context quickly without full re-authentication."

**4. What does it mean to 'externalize state' and how does it help with scaling?**
> "Externalizing state means moving data from server-local memory to a shared external store (Redis, Memcached, a database) that all server instances can access. A service that stores session data in local memory can only serve requests that match that session's server — it's stateful, requiring sticky sessions. Move the session data to Redis: now any server can look up any session. The application servers become stateless — they hold no per-user state. The 'state' exists, but it lives in the external store. This pattern is universal: rate limit counters in Redis, feature flag evaluations cached in Redis, distributed locks in Redis, configuration in a config service. The application servers become interchangeable, enabling free horizontal scaling and simple failure recovery. The external store becomes the stateful component — but a Redis cluster or database cluster is purpose-built for high-availability, horizontal scaling, and replication in ways that ad-hoc server memory management is not."

---

## Key Takeaways

- **Stateless services** hold no per-request memory — any server can handle any request; enables free horizontal scaling
- **Stateful services** maintain context between requests — required for WebSocket connections, ML model servers, game servers
- **JWT = stateless auth:** token carries all context; verified via signature; no server-side lookup required
- **Sessions = stateful auth:** server stores session; enables instant revocation; requires shared session store for horizontal scaling
- **Externalize state:** move server-local state to Redis/database — application servers become stateless while state persists reliably
- **Sticky sessions** route the same user to the same server — necessary when state cannot be externalized; complicates load balancing and failure recovery
- **REST's statelessness** is why REST APIs scale so easily — round-robin load balancing, zero coordination between servers
