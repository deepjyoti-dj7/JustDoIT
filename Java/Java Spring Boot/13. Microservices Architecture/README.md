# 🏗️ Microservices Architecture - Complete Guide

## 📋 Module Overview

This comprehensive module covers the complete landscape of microservices architecture in Spring Boot, from foundational principles to production-ready implementations.

---

## 📚 Topics Covered

### 1. **Microservices Principles** ✅
- Core concepts and characteristics
- Microservices vs Monolithic architecture
- Design patterns (API Gateway, Service Discovery, Circuit Breaker, Saga, CQRS, Event Sourcing)
- Domain-Driven Design (DDD)
- Database per service pattern
- Challenges and trade-offs
- When to use microservices
- Best practices

### 2. **Service Discovery** ✅
- Netflix Eureka Server setup
- Service registration (@EnableEurekaServer, @EnableDiscoveryClient)
- Service discovery mechanisms
- DiscoveryClient API
- Load-balanced RestTemplate (@LoadBalanced)
- OpenFeign integration
- Health checks and metadata
- High availability configuration
- Zone awareness

### 3. **API Gateway** ✅
- Spring Cloud Gateway architecture
- Route predicates and filters
- Pre-filters, Post-filters, Global filters
- Custom filter implementations
- JWT authentication and authorization
- Rate limiting and throttling
- CORS configuration
- Circuit breaker integration
- Response caching
- Request/response transformation

### 4. **Load Balancing** ✅
- Client-side vs Server-side load balancing
- Load balancing algorithms:
  - Round Robin
  - Random
  - Weighted Response Time
  - Least Connections
  - IP Hash
  - Zone-Aware
- Spring Cloud LoadBalancer
- Nginx and HAProxy integration
- Health-based routing
- Custom load balancer implementation
- Monitoring and metrics

### 5. **Circuit Breaker** ✅
- Resilience4j integration
- Circuit breaker states (CLOSED, OPEN, HALF_OPEN)
- Configuration (failure threshold, wait duration, ring buffer size)
- Fallback methods (simple, cached, multi-level)
- Retry pattern integration
- Time Limiter pattern
- Bulkhead pattern
- Rate Limiter pattern
- Event monitoring and metrics
- Health indicators

### 6. **Distributed Tracing** ✅
- Spring Cloud Sleuth auto-instrumentation
- Trace and Span concepts
- Trace ID and Span ID propagation
- Zipkin integration and visualization
- Baggage propagation
- Logging with trace correlation
- Custom spans and tags
- Sampling strategies
- Performance considerations
- Kafka/RabbitMQ tracing
- Async method tracing

### 7. **Config Server** ✅
- Spring Cloud Config Server setup
- Git-backed configuration
- Environment-specific profiles
- Config Client integration
- Bootstrap configuration
- @RefreshScope for dynamic updates
- Manual refresh (/actuator/refresh)
- Spring Cloud Bus for broadcast refresh
- Symmetric and asymmetric encryption
- Vault backend integration
- Native file system backend
- Fail-fast and retry configuration

### 8. **Inter-service Communication** ✅
- Synchronous communication:
  - REST with RestTemplate
  - REST with WebClient (reactive)
  - OpenFeign declarative clients
  - gRPC with Protocol Buffers
- Asynchronous communication:
  - Apache Kafka (event streaming)
  - RabbitMQ (message queuing)
  - Event-driven architecture
- Communication patterns:
  - Request-Response
  - Event-Driven
  - Choreography vs Orchestration
  - Saga pattern
  - Request-Reply pattern
- Idempotency and deduplication
- Dead letter queues
- Circuit breakers in communication

---

## 🎯 Learning Path

### Beginner Level
```
1. Start with Microservices Principles
   - Understand core concepts
   - Learn when to use microservices
   - Study design patterns

2. Service Discovery
   - Set up Eureka Server
   - Register services
   - Implement service discovery

3. Inter-service Communication
   - Master REST with RestTemplate/Feign
   - Understand synchronous patterns
```

### Intermediate Level
```
4. API Gateway
   - Implement routing and filtering
   - Add authentication
   - Configure rate limiting

5. Load Balancing
   - Understand algorithms
   - Implement client-side load balancing
   - Configure health checks

6. Config Server
   - Centralize configuration
   - Implement dynamic refresh
   - Encrypt sensitive data
```

### Advanced Level
```
7. Circuit Breaker & Resilience
   - Implement fault tolerance
   - Configure fallback mechanisms
   - Monitor resilience patterns

8. Distributed Tracing
   - Set up Sleuth + Zipkin
   - Implement trace propagation
   - Monitor distributed requests
```

---

## 🏛️ Architecture Overview

### Complete Microservices Ecosystem

```
                    ┌─────────────────┐
                    │   API Gateway   │
                    │ (Port: 8080)    │
                    │ - Routing       │
                    │ - Auth          │
                    │ - Rate Limiting │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
         ┌────▼────┐    ┌────▼────┐   ┌────▼────┐
         │ Order   │    │ Payment │   │Inventory│
         │ Service │    │ Service │   │ Service │
         │ (8081)  │    │ (8082)  │   │ (8083)  │
         └────┬────┘    └────┬────┘   └────┬────┘
              │              │              │
              └──────────────┼──────────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
         ┌────▼────┐    ┌────▼────┐   ┌────▼────┐
         │ Eureka  │    │ Config  │   │ Zipkin  │
         │ Server  │    │ Server  │   │ Server  │
         │ (8761)  │    │ (8888)  │   │ (9411)  │
         └─────────┘    └─────────┘   └─────────┘
                             │
                        ┌────▼────┐
                        │   Git   │
                        │  Repo   │
                        │(Configs)│
                        └─────────┘

         ┌─────────────────────────────┐
         │   Message Broker (Kafka)    │
         │   - Event Streaming         │
         │   - Async Communication     │
         └─────────────────────────────┘
```

---

## 📊 Pattern Comparison

### Service Discovery Patterns

| Pattern | Implementation | Use Case | Pros | Cons |
|---------|---------------|----------|------|------|
| **Client-Side** | Eureka + Ribbon | Spring Boot services | Simple, no proxy | Client complexity |
| **Server-Side** | Kubernetes DNS | Container orchestration | Simple clients | Single point of failure |
| **Service Mesh** | Istio, Linkerd | Complex deployments | Advanced features | High complexity |

### Communication Patterns

| Pattern | Technology | Coupling | Consistency | Use Case |
|---------|-----------|----------|-------------|----------|
| **Synchronous REST** | RestTemplate, Feign | Tight | Strong | User-facing APIs |
| **Synchronous gRPC** | Protocol Buffers | Tight | Strong | Internal services |
| **Asynchronous Events** | Kafka | Loose | Eventual | Background tasks |
| **Asynchronous Messages** | RabbitMQ | Loose | Eventual | Task queues |

### Resilience Patterns

| Pattern | Purpose | When to Use | Example |
|---------|---------|-------------|---------|
| **Circuit Breaker** | Prevent cascade failures | Protect from failing services | Resilience4j |
| **Retry** | Handle transient failures | Network issues | @Retry |
| **Timeout** | Limit wait time | Slow services | HTTP timeouts |
| **Bulkhead** | Isolate resources | Prevent resource exhaustion | Thread pools |
| **Rate Limiter** | Control request rate | Prevent overload | @RateLimiter |

---

## 🚀 Quick Start Guide

### 1. Set Up Infrastructure

**Eureka Server:**
```java
@SpringBootApplication
@EnableEurekaServer
public class EurekaServerApplication { }
```

**Config Server:**
```java
@SpringBootApplication
@EnableConfigServer
public class ConfigServerApplication { }
```

**API Gateway:**
```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: order-service
          uri: lb://order-service
          predicates:
            - Path=/api/orders/**
```

### 2. Create Microservice

```java
@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class OrderServiceApplication { }
```

**bootstrap.yml:**
```yaml
spring:
  application:
    name: order-service
  cloud:
    config:
      uri: http://localhost:8888
  profiles:
    active: dev
```

**Feign Client:**
```java
@FeignClient(name = "payment-service", fallback = PaymentFallback.class)
public interface PaymentClient {
    @PostMapping("/api/payments")
    PaymentResponse charge(@RequestBody PaymentRequest request);
}
```

**Circuit Breaker:**
```java
@Service
public class OrderService {
    
    @CircuitBreaker(name = "payment", fallbackMethod = "paymentFallback")
    public Order createOrder(OrderRequest request) {
        PaymentResponse payment = paymentClient.charge(request);
        return new Order(request, payment);
    }
    
    private Order paymentFallback(OrderRequest request, Exception ex) {
        return Order.pending(request);
    }
}
```

### 3. Enable Observability

**Distributed Tracing:**
```yaml
spring:
  sleuth:
    sampler:
      probability: 1.0
  zipkin:
    base-url: http://localhost:9411
```

**Logging:**
```xml
<pattern>
  %d [%X{traceId}/%X{spanId}] %-5level %logger - %msg%n
</pattern>
```

---

## 💡 Best Practices

### Design Principles

1. **Single Responsibility**: Each service owns one business capability
2. **Loose Coupling**: Minimize dependencies between services
3. **High Cohesion**: Related functionality in same service
4. **API First**: Design APIs before implementation
5. **Database per Service**: No shared databases
6. **Eventual Consistency**: Accept async data updates
7. **Failure Isolation**: One failure doesn't cascade
8. **Automated Deployment**: CI/CD for all services

### Implementation Guidelines

```java
// ✅ Good - Small, focused service
@Service
public class OrderService {
    public Order createOrder(OrderRequest request) {
        // Only order-related logic
    }
}

// ❌ Bad - God service doing everything
@Service
public class OrderService {
    public Order createOrder() { }
    public Payment processPayment() { }
    public void sendEmail() { }
    public void updateInventory() { }
}
```

### Configuration Management

```yaml
# ✅ Good - Externalized configuration
spring:
  datasource:
    url: ${DATABASE_URL}
    username: ${DATABASE_USERNAME}
    password: ${DATABASE_PASSWORD}

# ❌ Bad - Hardcoded values
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/db
    username: admin
    password: admin123
```

### Error Handling

```java
// ✅ Good - Graceful degradation
@CircuitBreaker(name = "inventory", fallbackMethod = "inventoryFallback")
public InventoryResponse checkInventory(String productId) {
    return inventoryClient.check(productId);
}

private InventoryResponse inventoryFallback(String productId, Exception ex) {
    log.warn("Inventory service unavailable, using default");
    return InventoryResponse.assumeAvailable();
}
```

---

## 🎤 Comprehensive Interview Questions

### Architecture & Design

**Q1: What are microservices?**
**A:** Architectural style structuring application as collection of small, independent services owning specific business capabilities.

**Q2: Microservices vs Monolithic?**
**A:** Monolithic: Single deployable unit, simple initially, hard to scale. Microservices: Multiple services, complex initially, easier to scale independently.

**Q3: When to use microservices?**
**A:** Large teams, need independent scaling, polyglot requirements, frequent deployments, bounded contexts clear.

**Q4: What is Domain-Driven Design (DDD)?**
**A:** Approach focusing on business domain, using bounded contexts to define service boundaries.

**Q5: Database per service pattern?**
**A:** Each microservice has its own database, ensuring loose coupling and independent deployment.

### Service Discovery

**Q6: What is service discovery?**
**A:** Mechanism for services to find and communicate with each other dynamically.

**Q7: Client-side vs Server-side discovery?**
**A:** Client-side: Client queries registry (Eureka). Server-side: Load balancer queries registry (Kubernetes).

**Q8: What is Eureka?**
**A:** Netflix service registry for locating services for load balancing and failover.

**Q9: How does Eureka heartbeat work?**
**A:** Clients send heartbeats every 30s, server evicts if no heartbeat for 90s.

**Q10: What is self-preservation mode?**
**A:** Eureka stops evicting instances when too many heartbeats missed (network partition protection).

### Communication

**Q11: Synchronous vs Asynchronous communication?**
**A:** Sync: Waits for response (REST, gRPC). Async: Doesn't wait (Kafka, events).

**Q12: What is API Gateway?**
**A:** Single entry point for all clients, handles routing, authentication, rate limiting.

**Q13: What is Saga pattern?**
**A:** Managing distributed transactions using choreography (events) or orchestration (coordinator).

**Q14: REST vs gRPC?**
**A:** REST: HTTP/JSON, human-readable, slower. gRPC: HTTP/2/Protobuf, binary, faster.

**Q15: What is idempotency?**
**A:** Multiple identical requests produce same result without additional side effects.

### Resilience

**Q16: What is Circuit Breaker?**
**A:** Pattern preventing calls to failing service, using fallback, auto-recovery.

**Q17: Circuit Breaker states?**
**A:** CLOSED (normal), OPEN (failing), HALF_OPEN (testing recovery).

**Q18: What is Bulkhead pattern?**
**A:** Isolating resources (thread pools) to prevent one failure affecting others.

**Q19: Retry vs Circuit Breaker?**
**A:** Retry: Immediate re-attempts. Circuit Breaker: Stops trying, prevents cascade failures.

**Q20: What is timeout pattern?**
**A:** Limiting wait time for response to prevent indefinite blocking.

### Configuration & Observability

**Q21: What is Config Server?**
**A:** Centralized configuration management backed by Git with dynamic refresh.

**Q22: What is @RefreshScope?**
**A:** Annotation enabling beans to reload when configuration changes via /actuator/refresh.

**Q23: What is distributed tracing?**
**A:** Tracking requests across multiple services using trace IDs and spans.

**Q24: Trace vs Span?**
**A:** Trace: Complete request journey. Span: Single operation within trace.

**Q25: What is Spring Cloud Sleuth?**
**A:** Library adding distributed tracing to Spring Boot applications automatically.

### Advanced Topics

**Q26: How to handle distributed transactions?**
**A:** Saga pattern (choreography or orchestration), eventual consistency, compensating transactions.

**Q27: What is CQRS?**
**A:** Command Query Responsibility Segregation - separate models for reads and writes.

**Q28: What is Event Sourcing?**
**A:** Storing state changes as sequence of events instead of current state.

**Q29: Kafka vs RabbitMQ?**
**A:** Kafka: Event streaming, high throughput, log retention. RabbitMQ: Traditional messaging, complex routing.

**Q30: What is Blue-Green deployment?**
**A:** Running two identical environments, switch traffic from blue to green for zero-downtime deployment.

---

## 🔧 Common Challenges & Solutions

### Challenge 1: Service Communication Failures

**Problem:** Service dependencies cause cascade failures

**Solution:**
```java
@CircuitBreaker(name = "payment", fallbackMethod = "fallback")
@Retry(name = "payment", fallbackMethod = "fallback")
@Timeout(name = "payment")
public PaymentResponse processPayment(PaymentRequest request) {
    return paymentClient.charge(request);
}
```

### Challenge 2: Configuration Management

**Problem:** Configuration scattered across services

**Solution:**
- Use Spring Cloud Config Server
- Store in Git repository
- Environment-specific profiles
- Encrypt sensitive data

### Challenge 3: Debugging Distributed Systems

**Problem:** Hard to trace requests across services

**Solution:**
```yaml
# Add Sleuth + Zipkin
spring:
  sleuth:
    sampler:
      probability: 1.0
  zipkin:
    base-url: http://localhost:9411
```

### Challenge 4: Data Consistency

**Problem:** Maintaining consistency across services

**Solution:**
- Use Saga pattern
- Implement compensating transactions
- Accept eventual consistency
- Use event sourcing for audit

### Challenge 5: Service Discovery Overhead

**Problem:** Too many network calls to Eureka

**Solution:**
```yaml
eureka:
  client:
    registry-fetch-interval-seconds: 30  # Cache
    instance-info-replication-interval-seconds: 30
```

---

## 📈 Performance Optimization

### 1. Caching Strategies

```java
@Cacheable(value = "products", key = "#productId")
public Product getProduct(String productId) {
    return productRepository.findById(productId);
}
```

### 2. Connection Pooling

```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000
```

### 3. Async Processing

```java
@Async
public CompletableFuture<Order> processOrderAsync(OrderRequest request) {
    Order order = processOrder(request);
    return CompletableFuture.completedFuture(order);
}
```

### 4. Load Balancing

```yaml
spring:
  cloud:
    loadbalancer:
      ribbon:
        enabled: false  # Use Spring Cloud LoadBalancer
```

---

## 🎓 Learning Resources

### Books
- "Building Microservices" - Sam Newman
- "Microservices Patterns" - Chris Richardson
- "Spring Microservices in Action" - John Carnell

### Online Resources
- Spring Cloud Documentation
- Microservices.io (Chris Richardson)
- Martin Fowler's Blog

### Practice Projects
1. E-commerce system (Order, Payment, Inventory services)
2. Banking application (Account, Transaction, Notification services)
3. Social media platform (User, Post, Comment services)

---

## 📝 Summary

Microservices Architecture enables building scalable, maintainable applications by:

✅ **Decomposing** monoliths into independent services  
✅ **Service Discovery** for dynamic service location  
✅ **API Gateway** for unified entry point  
✅ **Load Balancing** for optimal resource usage  
✅ **Circuit Breakers** for fault tolerance  
✅ **Distributed Tracing** for observability  
✅ **Config Server** for centralized configuration  
✅ **Async Communication** for loose coupling  

### Key Takeaways

1. **Start Simple**: Don't over-engineer early
2. **Automate Everything**: CI/CD, testing, deployment
3. **Monitor Relentlessly**: Logs, metrics, traces
4. **Design for Failure**: Circuit breakers, retries, fallbacks
5. **Secure by Default**: Authentication, authorization, encryption
6. **Document APIs**: OpenAPI/Swagger specifications
7. **Version Carefully**: Backward compatibility
8. **Test Thoroughly**: Unit, integration, contract tests

---

**🎯 Next Steps:**
- Practice implementing each pattern
- Build a complete microservices application
- Study cloud deployment (AWS, Azure, Kubernetes)
- Explore service mesh (Istio, Linkerd)
- Learn container orchestration (Docker, Kubernetes)

**📚 Continue to:** Module 14 - Spring Cloud →

