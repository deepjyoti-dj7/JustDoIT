---
title: Service Discovery
---

# Service Discovery

In a microservices system, services need to find each other to communicate. Service discovery is the mechanism that answers the question: **"Where is the Order Service running right now?"**

In static infrastructure, you hardcode IPs. In dynamic cloud environments, container orchestrators (Kubernetes, ECS) start, stop, and reschedule services constantly — IPs change. Service discovery solves this automatically.

> **The core problem:** In a system with 50+ microservices each running 3–20 instances that can scale up/down at any time, it's impossible to manage connectivity manually. Service discovery does it automatically.

---

## The Problem Without Service Discovery

```mermaid
graph TD
    OrderService["Order Service\n🔧"]

    Static1["Hardcoded:\npayment-service:192.168.1.10"]
    Static2["Hardcoded:\nuser-service:192.168.1.11"]
    Static3["Hardcoded:\ninventory-service:192.168.1.12"]

    OrderService --> Static1
    OrderService --> Static2
    OrderService --> Static3

    Problem["🚨 Payment service restarts\nNew IP: 192.168.1.99\nOrder service can't reach it!"]
    Static1 --> Problem
```

In dynamic environments (containers, auto-scaling), hardcoded IPs break constantly.

---

## The Service Registry

The foundation of service discovery is a **service registry** — a database of service instances and their network locations:

```mermaid
graph TD
    subgraph Registry["Service Registry\n(Consul / etcd / Zookeeper / Eureka)"]
        R["service: payment-service\ninstances:\n  - 10.0.1.5:8080 (healthy)\n  - 10.0.1.6:8080 (healthy)\n  - 10.0.1.7:8080 (unhealthy)\n\nservice: user-service\ninstances:\n  - 10.0.2.3:8080 (healthy)"]
    end

    PS1["Payment Instance 1\n10.0.1.5"] -->|"register on start"| Registry
    PS2["Payment Instance 2\n10.0.1.6"] -->|"register on start"| Registry
    PS3["Payment Instance 3\n10.0.1.7"] -->|"deregister on stop"| Registry

    OrderService["Order Service"] -->|"query: where is payment-service?"| Registry
    Registry -->|"10.0.1.5:8080, 10.0.1.6:8080"| OrderService
```

Every service instance registers itself when it starts and deregisters when it stops. The registry maintains the current view of the fleet.

---

## Client-Side vs. Server-Side Discovery

There are two fundamental patterns for how services use the registry:

### Client-Side Discovery

The calling service queries the registry itself and chooses an instance:

```mermaid
sequenceDiagram
    participant Order Service
    participant Service Registry
    participant Payment 1
    participant Payment 2

    Order Service->>Service Registry: Where are payment-service instances?
    Service Registry-->>Order Service: [10.0.1.5:8080, 10.0.1.6:8080]

    Note over Order Service: Client picks one\n(round-robin, least-conn, etc.)

    Order Service->>Payment 1: POST /charge (10.0.1.5:8080)
    Payment 1-->>Order Service: 200 OK
```

**Pros:**

- Client has full control over load balancing algorithm
- One fewer network hop (no intermediate router)
- Client can implement smart routing (prefer same AZ, etc.)

**Cons:**

- Every service client must implement discovery and load balancing logic
- Must maintain discovery client in every language/framework
- If discovery logic has a bug, all services are affected

**Examples:** Netflix Ribbon (with Eureka), early microservices patterns

### Server-Side Discovery

A router/proxy queries the registry and routes requests:

```mermaid
sequenceDiagram
    participant Order Service
    participant Router/LB
    participant Service Registry
    participant Payment 1
    participant Payment 2

    Order Service->>Router/LB: POST /payment/charge
    Router/LB->>Service Registry: Where are payment-service instances?
    Service Registry-->>Router/LB: [10.0.1.5:8080, 10.0.1.6:8080]
    Router/LB->>Payment 1: POST /charge (10.0.1.5:8080)
    Payment 1-->>Router/LB: 200 OK
    Router/LB-->>Order Service: 200 OK
```

**Pros:**

- Services are completely decoupled from discovery logic
- Works with any language/framework — no client library needed
- Centralized load balancing configuration

**Cons:**

- Router is another component to deploy and make HA
- Extra network hop adds latency (~1ms typical)

**Examples:** AWS ALB + ECS, Kubernetes Services, Envoy + Consul

### Side-by-Side Comparison

|                       | Client-Side                    | Server-Side                         |
| --------------------- | ------------------------------ | ----------------------------------- |
| **Discovery logic**   | In each service                | In router/infrastructure            |
| **Load balancing**    | In each service                | In router                           |
| **Language coupling** | Requires client library        | None                                |
| **Network hops**      | Fewer                          | More                                |
| **Complexity**        | Distributed (harder to change) | Centralized (easier to change)      |
| **Who uses it**       | Netflix OSS, Spring Cloud      | Kubernetes, AWS ECS, Consul Connect |

---

## Registration Patterns

How do services get registered in the registry?

### Self-Registration

Each service registers and deregisters itself:

```mermaid
sequenceDiagram
    participant Service Instance
    participant Registry

    Service Instance->>Registry: POST /register {name: "payment", ip: "10.0.1.5", port: 8080}
    Registry-->>Service Instance: 200 OK

    loop Heartbeat every 10s
        Service Instance->>Registry: PUT /heartbeat/instance-id
        Registry-->>Service Instance: 200 OK
    end

    Service Instance->>Registry: DELETE /register/instance-id  (on graceful shutdown)
```

**Pros:** Service knows its own capabilities and health best  
**Cons:** Tightly couples service to registry. Every service needs the registry client library.

### Third-Party Registration (Sidecar)

An external agent (sidecar or orchestrator) handles registration on behalf of the service:

```mermaid
graph TD
    Orchestrator["Container Orchestrator\n(Kubernetes / ECS)"]
    Sidecar["Sidecar Agent\n(Consul Agent / Envoy)"]
    Service["Service Instance\n(just your app)"]
    Registry["Service Registry\n(Consul)"]

    Orchestrator -->|"starts container"| Service
    Orchestrator -->|"notifies"| Sidecar
    Sidecar -->|"registers on start"| Registry
    Sidecar -->|"deregisters on stop"| Registry
    Sidecar -->|"proxies all traffic"| Service
```

**Pros:** Service is completely unaware of discovery infrastructure. Language-agnostic.  
**Cons:** More moving parts. Sidecar adds resource overhead per instance.

This is the pattern Kubernetes uses — the kubelet registers/deregisters pods automatically.

---

## Health Checking in Service Discovery

The registry must know which instances are healthy to avoid routing to dead ones:

```mermaid
sequenceDiagram
    participant Registry as Registry (Consul)
    participant Instance as Service Instance
    participant Caller as Calling Service

    loop Every 10 seconds
        Registry->>Instance: GET /health
        Instance-->>Registry: 200 OK {"status": "healthy"}
    end

    Note over Instance: Instance crashes

    loop Health check fails 3 times
        Registry->>Instance: GET /health
        Instance-->>Registry: ❌ Connection refused
    end

    Note over Registry: Mark instance as unhealthy

    Caller->>Registry: Discover payment-service
    Registry-->>Caller: [healthy instances only]
```

**Common health check types:**

| Type       | How it works                              | Use case          |
| ---------- | ----------------------------------------- | ----------------- |
| **HTTP**   | Probe `/health` endpoint → expect 200     | Web services      |
| **TCP**    | Open TCP connection → success if accepted | Non-HTTP services |
| **gRPC**   | Use gRPC Health Checking Protocol         | gRPC services     |
| **Script** | Run a custom script → check exit code     | Complex checks    |
| **TTL**    | Service must heartbeat within N seconds   | Manual control    |

---

## Service Discovery in Kubernetes

Kubernetes has built-in service discovery via the `Service` resource — the most widely used implementation today:

```mermaid
graph TD
    subgraph Kubernetes Cluster
        PodA["Pod: order-service\n10.0.1.5"]
        PodB["Pod: order-service\n10.0.1.6"]
        PodC["Pod: order-service\n10.0.1.7"]

        SVC["Service: order-service\nClusterIP: 10.96.0.10\nDNS: order-service.default.svc.cluster.local"]

        KDNS["kube-dns\n(CoreDNS)"]

        KUBE_PROXY["kube-proxy\n(iptables / IPVS)"]
    end

    Caller["payment-service Pod"] -->|"DNS: order-service"| KDNS
    KDNS -->|"10.96.0.10"| Caller
    Caller -->|"10.96.0.10:8080"| KUBE_PROXY
    KUBE_PROXY --> PodA & PodB & PodC
```

**How it works:**

1. You create a `Service` YAML pointing to pods via label selectors
2. Kubernetes assigns a stable `ClusterIP` and DNS name
3. CoreDNS resolves `order-service` → ClusterIP automatically
4. `kube-proxy` load-balances to healthy pod IPs via iptables/IPVS rules
5. When pods are added/removed, endpoints are updated automatically

**DNS names in Kubernetes:**

```
order-service                                    (same namespace)
order-service.default                            (cross-namespace short)
order-service.default.svc.cluster.local          (fully qualified)
```

---

## Real-World Service Registries

| Tool                   | Type                                | Key Strength                                   |
| ---------------------- | ----------------------------------- | ---------------------------------------------- |
| **Consul** (HashiCorp) | Dedicated SD + KV + health checking | Rich health checking, service mesh via Connect |
| **etcd**               | Distributed KV store                | Foundation of Kubernetes, strong consistency   |
| **Zookeeper**          | Distributed coordination            | Battle-tested, strong CP guarantees            |
| **Eureka** (Netflix)   | HTTP service registry               | Java/Spring ecosystem, Netflix OSS             |
| **Kubernetes DNS**     | Built-in cluster DNS                | Zero extra setup in K8s environments           |
| **AWS Cloud Map**      | Managed, AWS-native                 | ECS/EKS integration, Route53 backing           |

---

## Service Mesh — The Evolution

Service discovery at scale evolves into a **service mesh** — a dedicated infrastructure layer for all service-to-service communication:

```mermaid
graph TD
    subgraph Service Mesh with Envoy Sidecars
        subgraph OrderPod["Order Service Pod"]
            OS["Order App"] --- OE["Envoy Sidecar"]
        end
        subgraph PaymentPod["Payment Service Pod"]
            PS["Payment App"] --- PE["Envoy Sidecar"]
        end

        CP["Control Plane\n(Istio / Consul Connect)"]

        OE <-->|"mTLS encrypted\ntraffic"| PE
        CP -->|"config: routes, certs, policies"| OE
        CP -->|"config: routes, certs, policies"| PE
    end
```

The sidecar proxy (Envoy) handles:

- Service discovery (automatically)
- Load balancing (automatically)
- mTLS (encrypted, authenticated service-to-service)
- Circuit breaking
- Observability (distributed tracing)

The application doesn't know any of this is happening.

**Popular service meshes:** Istio, Linkerd, Consul Connect, AWS App Mesh

---

## Interview Talking Points

### What the interviewer wants to hear

**1. Why service discovery is needed**

> "In a microservices system on Kubernetes, pod IPs change every time a pod restarts. We can't hardcode IPs. Service discovery gives services a stable name to call, with automatic registration and health checking."

**2. Client-side vs. server-side tradeoff**

> "Client-side discovery is more efficient (fewer hops) but requires every service to implement discovery logic. Server-side discovery centralizes it in a router — works with any language. In Kubernetes, server-side via kube-proxy is the default."

**3. Health checking**

> "The registry only serves healthy instances. Each service exposes a `/health` endpoint. The registry (or sidecar) probes it every 10 seconds and removes instances that fail 3 consecutive checks."

**4. Kubernetes specifics**

> "In Kubernetes, a `Service` resource creates a stable DNS name and ClusterIP. CoreDNS resolves the name, kube-proxy load-balances to pod IPs. I don't need a separate registry — it's built in."

---

## Key Takeaways

- Service discovery solves **dynamic service location** — essential when IPs change constantly in cloud/container environments
- The **service registry** is the source of truth: instances register on start, deregister on stop, heartbeat to prove liveness
- **Client-side discovery** is more efficient; **server-side discovery** is more language-agnostic
- **Health checking** is non-negotiable — registries must know which instances are healthy
- **Kubernetes built-in DNS** replaces the need for a separate registry in K8s environments
- **Service meshes** (Istio, Linkerd) extend service discovery with mTLS, observability, and circuit breaking via sidecars
