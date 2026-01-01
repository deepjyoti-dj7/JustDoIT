# ☁️ Spring Cloud - Complete Guide

## 📋 Module Overview

This comprehensive module covers Spring Cloud - a framework providing tools for building cloud-native, distributed applications with patterns for configuration management, service discovery, circuit breakers, routing, and more.

---

## 📚 Topics Covered

### 1. **Spring Cloud Overview** ✅
- What is Spring Cloud
- Core components and ecosystem
- Spring Cloud vs Spring Boot
- Release train versioning
- Version compatibility matrix
- Maven dependency management
- Complete architecture overview
- Getting started guide

### 2. **Eureka Server & Client** ✅
- Netflix Eureka service registry
- Server setup and configuration
- Client registration and discovery
- DiscoveryClient vs EurekaClient
- @LoadBalanced RestTemplate/WebClient
- Heartbeat and lease management
- Self-preservation mode
- High availability setup
- Zone awareness
- Health checks and metadata

### 3. **Config Server** ✅
- Centralized configuration management
- Git backend integration
- Server and client setup
- Profile-specific configuration
- Configuration refresh (@RefreshScope)
- Spring Cloud Bus integration
- Manual and automatic refresh
- Symmetric and asymmetric encryption
- Vault backend
- Multiple repository support
- GitHub webhook integration

### 4. **Cloud Gateway** ✅
- API Gateway on Spring WebFlux
- Route configuration (YAML and Java)
- Route predicates (Path, Method, Header, Query, etc.)
- Built-in filters (AddHeader, RewritePath, StripPrefix)
- Custom global and route filters
- JWT authentication
- Rate limiting (Redis-based)
- CORS configuration
- Circuit breaker integration
- Request/response modification
- WebSocket support

### 5. **Feign Client** ✅
- Declarative REST client
- @FeignClient annotation
- Request parameters and headers
- Load balancing integration
- Error handling (ErrorDecoder)
- Fallback implementations
- FallbackFactory with exception access
- Retry configuration
- Request/Response compression
- OAuth2 integration
- File upload support
- Custom encoder/decoder
- Logging levels

### 6. **Resilience4j** ✅
- Fault tolerance patterns
- **Circuit Breaker**: CLOSED/OPEN/HALF_OPEN states
- **Retry**: Exponential backoff, max attempts
- **Rate Limiter**: Request rate control
- **Time Limiter**: Execution timeout
- **Bulkhead**: Semaphore and Thread Pool isolation
- Pattern combination and stacking
- Event monitoring
- Health indicators
- Custom configuration
- Metrics integration

### 7. **Sleuth & Zipkin** ✅
- Distributed tracing
- Trace and Span concepts
- Automatic instrumentation
- B3 propagation headers
- RestTemplate, WebClient, Feign tracing
- Kafka and RabbitMQ tracing
- Custom spans and tags
- Baggage propagation
- Logging integration (MDC)
- Sampling strategies
- Zipkin server and UI
- Performance considerations

### 8. **Cloud Bus** ✅
- Message broker integration
- RabbitMQ and Kafka backends
- Configuration refresh broadcasting
- /actuator/busrefresh endpoint
- Selective refresh (destination parameter)
- Custom event broadcasting
- RemoteApplicationEvent extension
- Event monitoring and tracing
- GitHub webhook integration
- Security considerations

---

## 🎯 Learning Path

### Beginner Level
```
1. Spring Cloud Overview
   - Understand ecosystem
   - Learn release train versioning
   - Set up dependencies

2. Eureka (Service Discovery)
   - Set up Eureka Server
   - Register services as clients
   - Discover and call services

3. Feign Client
   - Create declarative REST clients
   - Integrate with Eureka
   - Implement basic error handling
```

### Intermediate Level
```
4. Config Server
   - Centralize configuration
   - Set up Git backend
   - Implement refresh mechanisms

5. Cloud Gateway
   - Configure API Gateway
   - Set up routing and filters
   - Implement authentication

6. Cloud Bus
   - Broadcast configuration changes
   - Send custom events
   - Integrate with webhooks
```

### Advanced Level
```
7. Resilience4j
   - Implement circuit breakers
   - Combine fault tolerance patterns
   - Monitor resilience metrics

8. Sleuth & Zipkin
   - Distributed tracing
   - Trace correlation
   - Performance monitoring
```

---

## 🏛️ Complete Architecture

### Production-Ready Microservices Ecosystem

```
                    GitHub
                   (Config Repo)
                        ↓
                  Config Server (8888)
                        ↓
                   Eureka Server (8761)
                        ↑
                    ┌───┴───┐
                    │       │
              API Gateway (8080)
              ├─ Routing
              ├─ Auth (JWT)
              ├─ Rate Limiting
              └─ Circuit Breaker
                    │
        ┌───────────┼───────────┐
        │           │           │
   Order Service Payment Service Inventory
    (8081-8083)   (8091-8093)   (8101-8103)
        │           │           │
        └───────────┼───────────┘
                    │
         ┌──────────┼──────────┐
         │          │          │
    RabbitMQ    Zipkin (9411)  Redis
   (Cloud Bus)  (Tracing)  (Rate Limit)
```

### Request Flow

```
1. Client Request → API Gateway
   ├─ Authentication (JWT)
   ├─ Rate Limiting (Redis)
   └─ Route Selection

2. API Gateway → Eureka
   └─ Discover Service Instances

3. API Gateway → Service (Load Balanced)
   ├─ Trace ID Added (Sleuth)
   └─ Circuit Breaker Protection

4. Service A → Service B (via Feign)
   ├─ Load Balanced
   ├─ Circuit Breaker
   ├─ Retry on Failure
   └─ Trace Propagation

5. Response → Client
   └─ Trace Sent to Zipkin
```

---

## 📊 Component Comparison

### Service Discovery

| Feature | Eureka | Consul | Kubernetes |
|---------|--------|--------|------------|
| **Type** | AP | CP | CP |
| **Health Checks** | Heartbeat | Active | Active |
| **Load Balancing** | Client-side | Client/Server | Server-side |
| **Language** | Java | Go | Go |
| **Best For** | Spring Cloud | Multi-language | Container orchestration |

### API Gateway

| Feature | Spring Cloud Gateway | Zuul 1 | Kong |
|---------|---------------------|--------|------|
| **Model** | Reactive (WebFlux) | Blocking | Nginx-based |
| **Performance** | High | Moderate | Very High |
| **Filters** | Pre/Post/Global | Pre/Route/Post | Plugins |
| **Circuit Breaker** | Yes | Yes | Plugin |
| **Status** | Active | Deprecated | Active |

### Configuration Management

| Feature | Config Server | Consul | etcd | Kubernetes ConfigMap |
|---------|--------------|--------|------|---------------------|
| **Backend** | Git, Vault | KV Store | KV Store | YAML |
| **Versioning** | Git | Yes | Yes | Limited |
| **Encryption** | Yes | Yes | No | External |
| **Dynamic Refresh** | Yes (Bus) | Yes | Yes | Pod restart |

---

## 🚀 Quick Start Guide

### 1. Infrastructure Services

**Eureka Server (Service Registry):**

```java
@SpringBootApplication
@EnableEurekaServer
public class EurekaServerApplication { }
```

```yaml
server:
  port: 8761
eureka:
  client:
    register-with-eureka: false
    fetch-registry: false
```

**Config Server (Configuration Management):**

```java
@SpringBootApplication
@EnableConfigServer
public class ConfigServerApplication { }
```

```yaml
server:
  port: 8888
spring:
  cloud:
    config:
      server:
        git:
          uri: https://github.com/org/config-repo
```

**API Gateway (Routing):**

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

### 2. Microservice Setup

**Dependencies:**

```xml
<dependencies>
    <!-- Service Discovery -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
    </dependency>
    
    <!-- Configuration -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-config</artifactId>
    </dependency>
    
    <!-- REST Client -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-openfeign</artifactId>
    </dependency>
    
    <!-- Circuit Breaker -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-circuitbreaker-resilience4j</artifactId>
    </dependency>
    
    <!-- Distributed Tracing -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-sleuth</artifactId>
    </dependency>
</dependencies>
```

**Application:**

```java
@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class OrderServiceApplication { }
```

**Configuration:**

```yaml
spring:
  application:
    name: order-service
  config:
    import: optional:configserver:http://localhost:8888

eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
```

**Feign Client:**

```java
@FeignClient(name = "payment-service", fallback = PaymentFallback.class)
public interface PaymentClient {
    @PostMapping("/api/payments")
    PaymentResponse charge(@RequestBody PaymentRequest request);
}
```

**Service with Resilience:**

```java
@Service
public class OrderService {
    
    @CircuitBreaker(name = "payment", fallbackMethod = "fallback")
    @Retry(name = "payment")
    public Order createOrder(OrderRequest request) {
        PaymentResponse payment = paymentClient.charge(request);
        return orderRepository.save(new Order(request, payment));
    }
    
    private Order fallback(OrderRequest request, Exception ex) {
        return Order.pending(request);
    }
}
```

### 3. Startup Sequence

```
1. Start RabbitMQ (optional, for Cloud Bus)
   docker run -d -p 5672:5672 rabbitmq:3-management

2. Start Zipkin (optional, for tracing)
   docker run -d -p 9411:9411 openzipkin/zipkin

3. Start Config Server (8888)
   java -jar config-server.jar

4. Start Eureka Server (8761)
   java -jar eureka-server.jar

5. Start API Gateway (8080)
   java -jar api-gateway.jar

6. Start Microservices (8081, 8082, ...)
   java -jar order-service.jar
   java -jar payment-service.jar
```

---

## 💡 Best Practices

### 1. Dependency Management

```xml
<!-- ✅ Good - Use BOM -->
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-dependencies</artifactId>
            <version>2023.0.0</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>

<!-- ❌ Bad - Manual version management -->
```

### 2. Service Discovery

```java
// ✅ Good - Use @EnableDiscoveryClient
@SpringBootApplication
@EnableDiscoveryClient
public class ServiceApplication { }

// ❌ Bad - Hardcode service URLs
String url = "http://localhost:8082/api/payment";
```

### 3. Circuit Breakers

```java
// ✅ Good - Implement fault tolerance
@CircuitBreaker(name = "service", fallbackMethod = "fallback")
@Retry(name = "service")
public Response call() { }

// ❌ Bad - No fault tolerance
public Response call() { }
```

### 4. Configuration

```yaml
# ✅ Good - Externalize configuration
spring:
  config:
    import: optional:configserver:http://config-server:8888

# ❌ Bad - Hardcode in application.yml
```

### 5. Distributed Tracing

```yaml
# ✅ Good - Enable tracing
spring:
  sleuth:
    sampler:
      probability: 0.1  # 10% in production
  zipkin:
    base-url: http://zipkin:9411

# ❌ Bad - No observability
```

### 6. API Gateway

```yaml
# ✅ Good - Use API Gateway as single entry point
Client → API Gateway → Services

# ❌ Bad - Direct service calls
Client → Service A
Client → Service B
```

---

## 🎤 Comprehensive Interview Questions

### Architecture & Design (Q1-Q10)

**Q1: What is Spring Cloud?**
**A:** Framework providing tools for distributed systems: service discovery, configuration, routing, circuit breakers, tracing.

**Q2: Spring Boot vs Spring Cloud?**
**A:** Spring Boot: Build standalone apps. Spring Cloud: Add distributed system patterns on top of Spring Boot.

**Q3: What are main Spring Cloud components?**
**A:** Eureka (discovery), Config Server, Gateway, LoadBalancer, Resilience4j, Feign, Sleuth, Bus.

**Q4: What is Spring Cloud release train?**
**A:** Versioning using names (Ilford, Jubilee, Kilburn, Leyton) ensuring compatibility between components.

**Q5: Why microservices need service discovery?**
**A:** Dynamic IP addresses, auto-scaling, multiple instances, avoid hardcoding service locations.

**Q6: Client-side vs Server-side load balancing?**
**A:** Client-side: Client chooses instance (Spring Cloud LoadBalancer). Server-side: Proxy chooses (Nginx, K8s).

**Q7: What is API Gateway pattern?**
**A:** Single entry point for all clients, handles routing, authentication, rate limiting, aggregation.

**Q8: Why externalize configuration?**
**A:** Centralized management, environment-specific configs, dynamic refresh, version control.

**Q9: What is distributed tracing?**
**A:** Tracking requests across services using trace IDs to identify performance bottlenecks.

**Q10: Eureka vs Consul vs Kubernetes?**
**A:** Eureka: AP, Spring Cloud. Consul: CP, multi-language. Kubernetes: CP, container orchestration.

### Service Discovery (Q11-Q15)

**Q11: How does Eureka work?**
**A:** Services register on startup, send heartbeats (30s), Eureka evicts if no heartbeat (90s).

**Q12: What is self-preservation mode?**
**A:** Eureka stops evicting when renewal rate drops, protecting against network partitions.

**Q13: What is @LoadBalanced?**
**A:** Enables client-side load balancing using service name instead of URL.

**Q14: DiscoveryClient vs EurekaClient?**
**A:** DiscoveryClient: Spring Cloud abstraction. EurekaClient: Netflix-specific with more features.

**Q15: Eureka high availability?**
**A:** Run multiple Eureka servers in peer-to-peer replication mode.

### Configuration (Q16-Q20)

**Q16: How does Config Server work?**
**A:** Stores configs in Git, exposes REST API, clients fetch on startup, can refresh dynamically.

**Q17: What is @RefreshScope?**
**A:** Enables beans to reload when configuration changes via /actuator/refresh.

**Q18: What is Spring Cloud Bus?**
**A:** Message bus (RabbitMQ/Kafka) broadcasting config refresh to all services.

**Q19: How to encrypt passwords?**
**A:** Use /encrypt endpoint, store as `{cipher}...`, Config Server decrypts.

**Q20: bootstrap.yml vs application.yml?**
**A:** bootstrap.yml loaded first to configure Config Server connection.

### API Gateway (Q21-Q25)

**Q21: Spring Cloud Gateway vs Zuul?**
**A:** Gateway: Reactive (WebFlux), active. Zuul 1: Blocking, deprecated. Zuul 2: Reactive, late to market.

**Q22: What are predicates?**
**A:** Conditions to match routes (Path, Method, Header, Query, Cookie, etc.).

**Q23: What are filters?**
**A:** Modify request/response (headers, path, auth, rate limiting, circuit breaker).

**Q24: Global vs Route filters?**
**A:** Global: All routes. Route: Specific routes.

**Q25: How to implement rate limiting?**
**A:** Use RequestRateLimiter filter with Redis backend.

### Fault Tolerance (Q26-Q30)

**Q26: Resilience4j patterns?**
**A:** Circuit Breaker, Retry, Rate Limiter, Time Limiter, Bulkhead.

**Q27: Circuit Breaker states?**
**A:** CLOSED (normal), OPEN (failing), HALF_OPEN (testing recovery).

**Q28: When to use retry vs circuit breaker?**
**A:** Retry: Transient failures. Circuit Breaker: Persistent failures, prevent cascade.

**Q29: What is bulkhead?**
**A:** Isolates resources (threads, calls) to prevent one failure affecting others.

**Q30: Resilience4j vs Hystrix?**
**A:** Resilience4j: Lightweight, modular, active. Hystrix: Monolithic, deprecated.

---

## 🔧 Common Challenges & Solutions

### Challenge 1: Service Discovery Latency

**Problem:** New service instances not immediately discovered

**Solution:**
```yaml
eureka:
  instance:
    lease-renewal-interval-in-seconds: 10  # Faster heartbeat
  client:
    registry-fetch-interval-seconds: 10    # Faster registry fetch
```

### Challenge 2: Configuration Refresh

**Problem:** Configuration changes require manual refresh

**Solution:**
```bash
# Use Spring Cloud Bus
curl -X POST http://config-server:8888/actuator/busrefresh

# Or GitHub webhook
# Automatically trigger refresh on Git push
```

### Challenge 3: Circuit Breaker Tuning

**Problem:** Circuit breaker too sensitive or not sensitive enough

**Solution:**
```yaml
resilience4j:
  circuitbreaker:
    instances:
      service:
        failure-rate-threshold: 50      # Adjust threshold
        sliding-window-size: 100        # Larger window
        wait-duration-in-open-state: 30s  # Longer wait
```

### Challenge 4: Distributed Tracing Overhead

**Problem:** High overhead from 100% sampling

**Solution:**
```yaml
spring:
  sleuth:
    sampler:
      probability: 0.1  # Sample only 10%
```

### Challenge 5: Gateway Timeout

**Problem:** Gateway times out before backend completes

**Solution:**
```yaml
spring:
  cloud:
    gateway:
      httpclient:
        response-timeout: 30s  # Increase timeout
```

---

## 📈 Performance Optimization

### 1. Connection Pooling

```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
```

### 2. Caching

```java
@Cacheable(value = "products", key = "#id")
public Product getProduct(String id) { }
```

### 3. Async Processing

```java
@Async
public CompletableFuture<Response> processAsync() { }
```

### 4. Response Compression

```yaml
feign:
  compression:
    request:
      enabled: true
    response:
      enabled: true
```

---

## 📝 Summary

### Essential Components

```
Infrastructure:
├─ Service Discovery (Eureka)
├─ Configuration (Config Server)
├─ API Gateway (Cloud Gateway)
└─ Load Balancing (LoadBalancer)

Resilience:
├─ Circuit Breaker (Resilience4j)
├─ Retry
├─ Rate Limiter
└─ Bulkhead

Communication:
├─ REST Client (Feign)
├─ Message Bus (Cloud Bus)
└─ Event Broadcasting

Observability:
├─ Distributed Tracing (Sleuth + Zipkin)
├─ Metrics (Micrometer)
└─ Health Checks (Actuator)
```

### Key Takeaways

1. **Start with infrastructure**: Eureka, Config Server, Gateway
2. **Enable discovery**: Use service names, not URLs
3. **Implement resilience**: Circuit breakers, retries, timeouts
4. **Externalize config**: Use Config Server, enable refresh
5. **Add observability**: Sleuth for tracing, metrics for monitoring
6. **Secure services**: API Gateway authentication, mTLS
7. **Test failures**: Circuit breakers, fallbacks, retries
8. **Monitor everything**: Health checks, metrics, traces

---

**🎯 Next Steps:**
- Practice building complete microservices architecture
- Study cloud deployment (AWS, Azure, Kubernetes)
- Explore service mesh (Istio, Linkerd)
- Learn container orchestration (Docker, Kubernetes)
- Master observability (Prometheus, Grafana)

**📚 Continue to:** Module 15 - Messaging & Kafka →

