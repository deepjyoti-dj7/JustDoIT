# Spring Boot Actuator - Module README

---

## Module Overview

This module provides comprehensive coverage of **Spring Boot Actuator**, which provides production-ready features for monitoring and managing Spring Boot applications. You'll learn to expose endpoints, create health checks, collect metrics, integrate with monitoring systems, and prepare applications for production deployment.

---

## What You'll Learn

By completing this module, you will:

1. **Actuator Endpoints** - Understand built-in endpoints and configuration
2. **Health Checks** - Implement liveness and readiness probes
3. **Metrics** - Collect JVM, HTTP, database, and custom metrics
4. **Info Endpoint** - Expose build, git, and environment information
5. **Custom Endpoints** - Create application-specific management endpoints
6. **Security** - Secure actuator endpoints properly
7. **Monitoring Integration** - Integrate with Prometheus, Grafana, Datadog
8. **Production Readiness** - Deploy confidently with best practices

---

## Module Structure

### 01. Actuator Endpoints
**Purpose:** Introduction to Spring Boot Actuator production-ready features  
**Key Topics:**
- Setup and dependencies
- Built-in endpoints (health, info, metrics, env, loggers, beans, mappings)
- Endpoint configuration and exposure
- Accessing and filtering endpoints
- Endpoint security with Spring Security
- CORS configuration
- Production best practices

**Learning Objectives:**
- Add actuator dependency and configure endpoints
- Understand endpoint purposes and response formats
- Expose/hide endpoints appropriately
- Secure endpoints with authentication

---

### 02. Health Checks
**Purpose:** Implementing comprehensive health monitoring  
**Key Topics:**
- Health endpoint and status values (UP, DOWN, OUT_OF_SERVICE, UNKNOWN)
- Built-in health indicators (database, disk space, Redis, Cassandra)
- Custom health indicators with HealthIndicator interface
- Reactive health indicators for WebFlux
- Health groups (liveness and readiness)
- Kubernetes probes integration
- Availability states (LivenessState, ReadinessState)
- Composite health indicators
- Timeout and caching configuration

**Learning Objectives:**
- Create custom health indicators for external dependencies
- Configure Kubernetes liveness and readiness probes
- Understand difference between liveness and readiness
- Implement availability state management

---

### 03. Metrics
**Purpose:** Comprehensive metrics collection and monitoring  
**Key Topics:**
- Accessing metrics endpoint
- JVM metrics (memory, GC, threads, class loading)
- System metrics (CPU, uptime, file descriptors)
- HTTP metrics with tags (uri, method, status)
- Database metrics (HikariCP connection pool)
- Cache metrics (Caffeine statistics)
- Custom metrics (Counter, Gauge, Timer, DistributionSummary)
- @Timed and @Counted annotations
- Common tags and metric filters
- Exporting to Prometheus

**Learning Objectives:**
- Understand different metric types and when to use them
- Create custom metrics with MeterRegistry
- Configure percentiles and SLOs
- Control metric cardinality with proper tags
- Export metrics to monitoring systems

---

### 04. Info Endpoint
**Purpose:** Exposing application metadata and build information  
**Key Topics:**
- Basic configuration with static properties
- Build information with Maven/Gradle plugins
- Git information with git-commit-id-plugin
- Environment information (Java, OS, profiles)
- Custom InfoContributors
- Security considerations
- Caching info endpoint

**Learning Objectives:**
- Configure build and git information
- Create custom InfoContributors for application metadata
- Include deployment and environment information
- Secure sensitive information in info endpoint

---

### 05. Custom Endpoints
**Purpose:** Creating application-specific actuator endpoints  
**Key Topics:**
- @Endpoint annotation
- Operation types (@ReadOperation, @WriteOperation, @DeleteOperation)
- Endpoint parameters with @Selector
- Advanced endpoints (thread analysis, connection pool stats)
- @RestControllerEndpoint vs @JmxEndpoint
- Endpoint security with Spring Security
- Endpoint configuration (enabling, exposure, path mapping)
- Real-world examples (cache management, config refresh)

**Learning Objectives:**
- Create custom endpoints for management operations
- Implement different operation types
- Secure custom endpoints appropriately
- Design RESTful management APIs

---

### 06. Security Actuator
**Purpose:** Securing actuator endpoints for production  
**Key Topics:**
- Spring Security integration with EndpointRequest
- Endpoint-specific security (different roles for different endpoints)
- Method-level security with @PreAuthorize
- Health endpoint security (show-details configuration)
- Separate management port
- HTTPS configuration with SSL/TLS
- CORS configuration
- Authentication methods (Basic, JWT, OAuth2)
- IP whitelisting
- Audit logging
- Sanitizing sensitive information
- Production security checklist

**Learning Objectives:**
- Secure endpoints with Spring Security
- Configure separate management port
- Enable HTTPS for actuator endpoints
- Implement audit logging for endpoint access
- Hide sensitive information properly

---

### 07. Monitoring Integration
**Purpose:** Integrating with monitoring and alerting systems  
**Key Topics:**
- Prometheus integration and scraping
- Grafana dashboards and visualization
- Alert rules and Alertmanager
- Datadog integration
- CloudWatch integration
- Elastic APM
- Service discovery (Kubernetes)
- Metric exporters
- Alert thresholds and best practices

**Learning Objectives:**
- Integrate actuator with Prometheus
- Create Grafana dashboards
- Configure meaningful alerts
- Use service discovery for dynamic targets
- Export metrics to multiple systems

---

### 08. Production-ready Features
**Purpose:** Comprehensive production deployment guide  
**Key Topics:**
- Production checklist (configuration, security, monitoring, logging)
- Kubernetes probes (startup, liveness, readiness)
- Graceful shutdown configuration
- Thread dump and heap dump analysis
- JVM tuning (memory, GC)
- External configuration (Config Server, ConfigMap)
- Error handling and circuit breakers
- Deployment strategies (blue-green, canary, rolling)
- SLIs and SLOs
- Troubleshooting guide

**Learning Objectives:**
- Prepare applications for production deployment
- Configure graceful shutdown
- Tune JVM for optimal performance
- Implement resilience patterns
- Monitor SLIs and meet SLOs

---

## Key Concepts

### Actuator Architecture

Spring Boot Actuator provides a framework for exposing operational information:

```
Application Code
       ↓
Actuator Endpoints (/actuator/*)
       ↓
┌──────────────┬─────────────┬──────────────┐
│   Health     │   Metrics   │   Custom     │
│  Indicators  │ Collectors  │  Endpoints   │
└──────────────┴─────────────┴──────────────┘
       ↓
Security Layer (Spring Security)
       ↓
HTTP / JMX Exposure
       ↓
Monitoring Systems (Prometheus, Grafana)
```

### Endpoint Types

**1. Built-in Endpoints:**
```yaml
/actuator/health      # Application health status
/actuator/info        # Application information
/actuator/metrics     # Application metrics
/actuator/env         # Environment properties
/actuator/loggers     # Logger configuration
/actuator/prometheus  # Prometheus metrics format
```

**2. Custom Endpoints:**
```java
@Endpoint(id = "features")
public class FeaturesEndpoint {
    
    @ReadOperation
    public Map<String, Boolean> features() {
        return Map.of("feature1", true, "feature2", false);
    }
    
    @WriteOperation
    public void toggleFeature(@Selector String feature, boolean enabled) {
        // Implementation
    }
}
```

### Health Status Values

```
UP               - Component is working
DOWN             - Component has failed
OUT_OF_SERVICE   - Component is temporarily unavailable
UNKNOWN          - Component state is unknown
```

### Metric Types

**Counter** - Monotonically increasing value
```java
Counter.builder("orders.created")
       .tag("status", "success")
       .register(meterRegistry)
       .increment();
```

**Gauge** - Current value that can go up or down
```java
Gauge.builder("users.active", userService, UserService::getActiveUserCount)
     .register(meterRegistry);
```

**Timer** - Measures duration and rate
```java
Timer.builder("payment.processing")
     .publishPercentiles(0.5, 0.95, 0.99)
     .register(meterRegistry)
     .record(() -> processPayment());
```

**Distribution Summary** - Measures distribution of values
```java
DistributionSummary.builder("order.value")
                   .baseUnit("dollars")
                   .register(meterRegistry)
                   .record(orderAmount);
```

### Security Best Practices

**EndpointRequest Matcher:**
```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.authorizeHttpRequests(auth -> auth
        .requestMatchers(EndpointRequest.to("health", "info")).permitAll()
        .requestMatchers(EndpointRequest.toAnyEndpoint()).hasRole("ADMIN")
        .anyRequest().authenticated()
    );
    return http.build();
}
```

---

## Technology Stack

### Core Actuator
- **Spring Boot Actuator** - Production-ready features
- **Micrometer** - Metrics facade supporting multiple monitoring systems
- **Spring Security** - Endpoint security

### Monitoring Systems
- **Prometheus** - Time series database and monitoring
- **Grafana** - Visualization and dashboards
- **Datadog** - SaaS monitoring and APM
- **New Relic** - Application performance monitoring
- **CloudWatch** - AWS native monitoring
- **Elastic APM** - Part of ELK stack

### Metrics Export
- **micrometer-registry-prometheus** - Prometheus format export
- **micrometer-registry-datadog** - Datadog integration
- **micrometer-registry-cloudwatch2** - CloudWatch integration

### Production Tools
- **HikariCP** - JDBC connection pool
- **Resilience4j** - Circuit breaker, retry, rate limiter
- **Logback** - Logging framework
- **Spring Cloud Config** - Externalized configuration

---

## Best Practices

### Actuator Configuration

1. **Expose only necessary endpoints in production**
   ```yaml
   management:
     endpoints:
       web:
         exposure:
           include: health,info,metrics,prometheus
           exclude: shutdown,threaddump,heapdump
   ```

2. **Use separate management port**
   ```yaml
   management:
     server:
       port: 8081
       address: 127.0.0.1
   ```

3. **Enable HTTPS for management endpoints**
   ```yaml
   management:
     server:
       ssl:
         enabled: true
         key-store: classpath:keystore.p12
   ```

4. **Configure health details visibility**
   ```yaml
   management:
     endpoint:
       health:
         show-details: when-authorized
         roles: ADMIN
   ```

5. **Use meaningful application tags**
   ```yaml
   management:
     metrics:
       tags:
         application: ${spring.application.name}
         environment: ${ENVIRONMENT}
         region: ${REGION}
   ```

6. **Configure metric percentiles for latency**
   ```yaml
   management:
     metrics:
       distribution:
         percentiles-histogram:
           http.server.requests: true
         slo:
           http.server.requests: 50ms,100ms,200ms,500ms,1s
   ```

7. **Enable health probes for Kubernetes**
   ```yaml
   management:
     health:
       livenessState:
         enabled: true
       readinessState:
         enabled: true
       probes:
         enabled: true
   ```

8. **Disable dangerous endpoints**
   ```yaml
   management:
     endpoint:
       shutdown:
         enabled: false
   ```

9. **Configure cache time-to-live**
   ```yaml
   management:
     endpoint:
       health:
         cache:
           time-to-live: 10s
   ```

10. **Use base path mapping**
    ```yaml
    management:
      endpoints:
        web:
          base-path: /management
    ```

### Security

1. **Always enable Spring Security**
   ```xml
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-security</artifactId>
   </dependency>
   ```

2. **Use role-based access control**
   ```java
   .requestMatchers(EndpointRequest.to("metrics")).hasRole("VIEWER")
   .requestMatchers(EndpointRequest.to("shutdown")).hasRole("ADMIN")
   ```

3. **Externalize credentials**
   ```yaml
   spring:
     security:
       user:
         name: ${ADMIN_USERNAME}
         password: ${ADMIN_PASSWORD}
   ```

4. **Enable audit logging**
   ```java
   @EventListener
   public void onAuditEvent(AuditApplicationEvent event) {
       log.info("Actuator access: {}", event.getAuditEvent());
   }
   ```

5. **Sanitize sensitive properties**
   ```yaml
   management:
     endpoint:
       env:
         show-values: when-authorized
         additional-keys-to-sanitize: token,apikey
   ```

6. **Use IP whitelisting**
   ```java
   @Component
   public class IpWhitelistFilter extends OncePerRequestFilter {
       private static final List<String> ALLOWED_IPS = List.of("10.0.0.0/8");
       
       @Override
       protected void doFilterInternal(HttpServletRequest request, 
                                       HttpServletResponse response, 
                                       FilterChain chain) {
           String remoteIp = request.getRemoteAddr();
           if (!isAllowed(remoteIp)) {
               response.setStatus(HttpServletResponse.SC_FORBIDDEN);
               return;
           }
           chain.doFilter(request, response);
       }
   }
   ```

7. **Enable CORS properly**
   ```yaml
   management:
     endpoints:
       web:
         cors:
           allowed-origins: https://monitoring.example.com
           allowed-methods: GET,POST
   ```

8. **Use HTTPS in production**
   ```yaml
   server:
     ssl:
       enabled: true
       key-store: classpath:keystore.p12
       key-store-password: ${KEYSTORE_PASSWORD}
   ```

9. **Implement method-level security**
   ```java
   @ReadOperation
   @PreAuthorize("hasRole('ADMIN')")
   public Map<String, Object> sensitiveData() {
       return data;
   }
   ```

10. **Regular security audits**
    - Review exposed endpoints quarterly
    - Check access logs for suspicious activity
    - Update dependencies regularly

### Monitoring

1. **Monitor JVM metrics**
   - Heap memory usage (alert > 90%)
   - GC pause time (alert > 1s)
   - Thread count (alert > 500)

2. **Monitor HTTP metrics**
   - Request rate
   - Response time (p50, p95, p99)
   - Error rate (alert > 1%)

3. **Monitor database metrics**
   - Connection pool usage
   - Query execution time
   - Active connections

4. **Use proper tag cardinality**
   ```java
   // ✅ Good - Low cardinality
   Counter.builder("api.calls")
          .tag("endpoint", "/api/users")
          .tag("method", "GET")
          .tag("status", "200");
   
   // ❌ Bad - High cardinality
   Counter.builder("api.calls")
          .tag("user_id", userId)  // Millions of users
          .tag("request_id", requestId);  // Unique per request
   ```

5. **Configure alert thresholds**
   ```yaml
   # Prometheus alerts
   - alert: HighErrorRate
     expr: rate(http_server_requests_seconds_count{status=~"5.."}[5m]) > 0.05
     for: 5m
   ```

6. **Use service discovery**
   ```yaml
   # Prometheus service discovery
   - job_name: 'kubernetes-pods'
     kubernetes_sd_configs:
       - role: pod
   ```

7. **Create meaningful dashboards**
   - Overview dashboard (all key metrics)
   - JVM dashboard (memory, GC, threads)
   - HTTP dashboard (request rate, latency, errors)
   - Database dashboard (connections, query time)

8. **Implement SLIs and SLOs**
   ```yaml
   sli:
     availability: 99.9%
     latency_p95: 200ms
     error_rate: 0.1%
   ```

### Production

1. **Enable graceful shutdown**
   ```yaml
   server:
     shutdown: graceful
   spring:
     lifecycle:
       timeout-per-shutdown-phase: 30s
   ```

2. **Configure Kubernetes probes**
   ```yaml
   livenessProbe:
     httpGet:
       path: /actuator/health/liveness
       port: 8080
   readinessProbe:
     httpGet:
       path: /actuator/health/readiness
       port: 8080
   ```

3. **Tune JVM appropriately**
   ```bash
   java -Xms2g -Xmx4g -XX:+UseG1GC -jar app.jar
   ```

4. **Externalize configuration**
   ```yaml
   spring:
     cloud:
       config:
         uri: http://config-server:8888
   ```

5. **Implement circuit breakers**
   ```java
   @CircuitBreaker(name = "externalAPI", fallbackMethod = "fallback")
   public Product getProduct(String id) {
       return externalAPI.getProduct(id);
   }
   ```

6. **Use structured logging**
   ```xml
   <encoder class="net.logstash.logback.encoder.LogstashEncoder"/>
   ```

7. **Configure connection pools**
   ```yaml
   spring:
     datasource:
       hikari:
         maximum-pool-size: 20
         minimum-idle: 5
         connection-timeout: 30000
   ```

8. **Enable heap dump on OOM**
   ```bash
   java -XX:+HeapDumpOnOutOfMemoryError \
        -XX:HeapDumpPath=/var/log/heapdumps \
        -jar app.jar
   ```

---

## Configuration Examples

### Development Configuration

```yaml
# application-dev.yml
spring:
  application:
    name: product-service

management:
  endpoints:
    web:
      exposure:
        include: '*'  # All endpoints for development
  endpoint:
    health:
      show-details: always
  metrics:
    export:
      prometheus:
        enabled: true

logging:
  level:
    root: INFO
    com.example: DEBUG
```

### Production Configuration

```yaml
# application-production.yml
spring:
  application:
    name: product-service
  datasource:
    url: ${DATABASE_URL}
    username: ${DATABASE_USERNAME}
    password: ${DATABASE_PASSWORD}
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000
      leak-detection-threshold: 60000

server:
  port: 8080
  shutdown: graceful
  ssl:
    enabled: true
    key-store: classpath:keystore.p12
    key-store-password: ${KEYSTORE_PASSWORD}

management:
  server:
    port: 8081
    address: 127.0.0.1
    ssl:
      enabled: true
  
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
        exclude: shutdown,threaddump,heapdump
      base-path: /management
  
  endpoint:
    health:
      show-details: when-authorized
      roles: ADMIN
      probes:
        enabled: true
    shutdown:
      enabled: false
  
  health:
    livenessState:
      enabled: true
    readinessState:
      enabled: true
  
  metrics:
    export:
      prometheus:
        enabled: true
    tags:
      application: ${spring.application.name}
      environment: production
      region: ${AWS_REGION}
    distribution:
      percentiles-histogram:
        http.server.requests: true
      slo:
        http.server.requests: 50ms,100ms,200ms,500ms,1s

spring:
  lifecycle:
    timeout-per-shutdown-phase: 30s

logging:
  level:
    root: WARN
    com.example: INFO
```

### Prometheus Integration

```yaml
# application.yml
management:
  metrics:
    export:
      prometheus:
        enabled: true
        step: 10s
    tags:
      application: ${spring.application.name}
      environment: ${ENVIRONMENT}

# prometheus.yml
scrape_configs:
  - job_name: 'spring-boot-actuator'
    metrics_path: '/actuator/prometheus'
    scrape_interval: 15s
    static_configs:
      - targets: ['localhost:8080']
```

### Grafana Dashboard Setup

```json
{
  "dashboard": {
    "title": "Spring Boot Application",
    "panels": [
      {
        "title": "Request Rate",
        "targets": [{
          "expr": "rate(http_server_requests_seconds_count[5m])",
          "legendFormat": "{{uri}}"
        }]
      },
      {
        "title": "JVM Heap",
        "targets": [{
          "expr": "jvm_memory_used_bytes{area=\"heap\"}",
          "legendFormat": "{{id}}"
        }]
      }
    ]
  }
}
```

---

## Common Patterns

### Pattern 1: Custom Health Indicator

```java
@Component
public class ExternalServiceHealthIndicator implements HealthIndicator {
    
    @Autowired
    private RestTemplate restTemplate;
    
    @Override
    public Health health() {
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(
                "https://api.external.com/health", 
                String.class
            );
            
            if (response.getStatusCode().is2xxSuccessful()) {
                return Health.up()
                             .withDetail("service", "external-api")
                             .withDetail("status", "UP")
                             .build();
            }
        } catch (Exception e) {
            return Health.down()
                         .withDetail("service", "external-api")
                         .withDetail("error", e.getMessage())
                         .build();
        }
        
        return Health.unknown().build();
    }
}
```

### Pattern 2: Custom Metrics

```java
@Service
public class OrderService {
    
    private final Counter ordersCreated;
    private final Timer orderProcessingTime;
    
    public OrderService(MeterRegistry meterRegistry) {
        this.ordersCreated = Counter.builder("orders.created")
                                     .tag("status", "success")
                                     .description("Total orders created")
                                     .register(meterRegistry);
        
        this.orderProcessingTime = Timer.builder("order.processing.time")
                                        .description("Order processing duration")
                                        .publishPercentiles(0.5, 0.95, 0.99)
                                        .register(meterRegistry);
    }
    
    public Order createOrder(OrderRequest request) {
        return orderProcessingTime.record(() -> {
            Order order = processOrder(request);
            ordersCreated.increment();
            return order;
        });
    }
}
```

### Pattern 3: Secure Actuator Endpoints

```java
@Configuration
@EnableWebSecurity
public class ActuatorSecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(auth -> auth
            // Public endpoints
            .requestMatchers(EndpointRequest.to("health", "info"))
                .permitAll()
            
            // Read-only endpoints for VIEWER role
            .requestMatchers(EndpointRequest.to("metrics", "prometheus"))
                .hasRole("VIEWER")
            
            // Dangerous endpoints for ADMIN only
            .requestMatchers(EndpointRequest.to("shutdown", "heapdump", "threaddump"))
                .hasRole("ADMIN")
            
            // All other endpoints for OPERATOR
            .requestMatchers(EndpointRequest.toAnyEndpoint())
                .hasRole("OPERATOR")
            
            .anyRequest().authenticated()
        )
        .httpBasic(Customizer.withDefaults());
        
        return http.build();
    }
}
```

### Pattern 4: Monitoring Integration

```java
@Configuration
public class MonitoringConfig {
    
    @Bean
    public MeterRegistryCustomizer<MeterRegistry> metricsCommonTags(
            @Value("${spring.application.name}") String applicationName) {
        
        return registry -> registry.config()
            .commonTags(
                "application", applicationName,
                "environment", System.getenv("ENVIRONMENT"),
                "region", System.getenv("AWS_REGION")
            );
    }
    
    @Bean
    public TimedAspect timedAspect(MeterRegistry registry) {
        return new TimedAspect(registry);
    }
}
```

---

## Comprehensive Interview Questions

### Category 1: Actuator Basics & Endpoints (15 Questions)

**Q1: What is Spring Boot Actuator?**
**A:** Production-ready features for monitoring and managing Spring Boot applications.

**Q2: What is the default actuator base path?**
**A:** /actuator

**Q3: How to expose all endpoints?**
**A:** management.endpoints.web.exposure.include=*

**Q4: What endpoints are exposed by default?**
**A:** Only /health and /info

**Q5: How to access health endpoint?**
**A:** GET /actuator/health

**Q6: What is metrics endpoint?**
**A:** Provides application metrics (JVM, HTTP, database, etc.).

**Q7: What is env endpoint?**
**A:** Shows environment properties and their sources.

**Q8: What is loggers endpoint?**
**A:** View and change application logger levels at runtime.

**Q9: How to change log level at runtime?**
**A:** POST /actuator/loggers/{logger} with {"configuredLevel": "DEBUG"}

**Q10: What is beans endpoint?**
**A:** Lists all Spring beans in the application context.

**Q11: What is mappings endpoint?**
**A:** Shows all @RequestMapping paths.

**Q12: What is threaddump endpoint?**
**A:** Returns thread dump showing all thread states.

**Q13: What is heapdump endpoint?**
**A:** Returns GZip-compressed hprof heap dump file.

**Q14: What is shutdown endpoint?**
**A:** Gracefully shuts down the application (disabled by default).

**Q15: How to change actuator base path?**
**A:** management.endpoints.web.base-path=/management

---

### Category 2: Health Checks & Monitoring (15 Questions)

**Q16: What are health status values?**
**A:** UP, DOWN, OUT_OF_SERVICE, UNKNOWN

**Q17: How to show health details?**
**A:** management.endpoint.health.show-details=always

**Q18: What is HealthIndicator?**
**A:** Interface to create custom health checks.

**Q19: What is liveness probe?**
**A:** Checks if application is running, restarts pod if fails.

**Q20: What is readiness probe?**
**A:** Checks if application is ready for traffic, removes from endpoints if fails.

**Q21: Difference between liveness and readiness?**
**A:** Liveness: restart if fails. Readiness: stop traffic if fails.

**Q22: What is health group?**
**A:** Combines multiple health indicators into a group.

**Q23: How to create readiness group?**
**A:** management.endpoint.health.group.readiness.include=db,redis

**Q24: What is LivenessState?**
**A:** CORRECT or BROKEN, represents application liveness.

**Q25: What is ReadinessState?**
**A:** ACCEPTING_TRAFFIC or REFUSING_TRAFFIC.

**Q26: What is AvailabilityChangeEvent?**
**A:** Event to change liveness or readiness state.

**Q27: What is composite health indicator?**
**A:** Combines multiple health indicators into one.

**Q28: How to disable health indicator?**
**A:** management.health.{indicator}.enabled=false

**Q29: What is ReactiveHealthIndicator?**
**A:** Health indicator for reactive applications (WebFlux).

**Q30: How to cache health results?**
**A:** management.endpoint.health.cache.time-to-live=10s

---

### Category 3: Metrics & Custom Endpoints (15 Questions)

**Q31: What is Micrometer?**
**A:** Metrics facade supporting multiple monitoring systems.

**Q32: What metric types exist?**
**A:** Counter, Gauge, Timer, DistributionSummary

**Q33: When to use Counter?**
**A:** Monotonically increasing values (orders created, requests).

**Q34: When to use Gauge?**
**A:** Current values that can go up or down (active users, queue size).

**Q35: When to use Timer?**
**A:** Measure duration and rate of events (request processing time).

**Q36: What is MeterRegistry?**
**A:** Registry to create and register meters.

**Q37: How to create Counter?**
**A:** Counter.builder("metric.name").register(meterRegistry)

**Q38: What is @Timed annotation?**
**A:** Automatically times method execution.

**Q39: What is @Counted annotation?**
**A:** Automatically counts method invocations.

**Q40: What are metric tags?**
**A:** Key-value pairs to add dimensions to metrics.

**Q41: What is tag cardinality?**
**A:** Number of unique tag value combinations.

**Q42: Why avoid high cardinality?**
**A:** Creates too many unique metrics, impacts performance and storage.

**Q43: How to create custom endpoint?**
**A:** @Endpoint(id="name") with @ReadOperation/@WriteOperation

**Q44: What is @Selector?**
**A:** Path variable for custom endpoints.

**Q45: What is @RestControllerEndpoint?**
**A:** Custom endpoint exposed only via web (not JMX).

---

### Category 4: Security & Production (15 Questions)

**Q46: How to secure actuator endpoints?**
**A:** Use Spring Security with EndpointRequest matchers.

**Q47: What is EndpointRequest?**
**A:** Request matcher for actuator endpoints in Spring Security.

**Q48: How to expose public health?**
**A:** EndpointRequest.to("health").permitAll()

**Q49: What is separate management port?**
**A:** Different port for actuator endpoints (isolation).

**Q50: How to configure separate port?**
**A:** management.server.port=8081

**Q51: What is show-details?**
**A:** Controls health details visibility: always, when-authorized, never.

**Q52: How to enable HTTPS for actuator?**
**A:** management.server.ssl.enabled=true with keystore config.

**Q53: What is SanitizingFunction?**
**A:** Masks sensitive values in env and configprops endpoints.

**Q54: How to add keys to sanitize?**
**A:** management.endpoint.env.additional-keys-to-sanitize=token,apikey

**Q55: What is graceful shutdown?**
**A:** Complete in-flight requests before shutdown.

**Q56: How to enable graceful shutdown?**
**A:** server.shutdown=graceful

**Q57: What is Prometheus format?**
**A:** Plain text format with metric name, labels, and value.

**Q58: What is p95 latency?**
**A:** 95th percentile - 95% of requests complete faster.

**Q59: What is SLI?**
**A:** Service Level Indicator - metrics measuring service quality.

**Q60: What is SLO?**
**A:** Service Level Objective - target values for SLIs.

---

## Learning Path

### Beginner Level (Weeks 1-2)
1. Add actuator dependency
2. Explore built-in endpoints (health, info, metrics)
3. Configure endpoint exposure
4. Understand health status values
5. Access and interpret metrics

### Intermediate Level (Weeks 3-4)
6. Create custom health indicators
7. Configure Kubernetes probes
8. Create custom metrics (Counter, Gauge, Timer)
9. Secure endpoints with Spring Security
10. Configure separate management port

### Advanced Level (Weeks 5-6)
11. Integrate with Prometheus and Grafana
12. Create custom actuator endpoints
13. Implement audit logging
14. Configure production-ready features
15. Set up alerting and dashboards
16. Tune JVM and application performance

---

## Tools & Resources

### Official Documentation
- [Spring Boot Actuator Reference](https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html)
- [Micrometer Documentation](https://micrometer.io/docs)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)

### Monitoring Tools
- [Prometheus](https://prometheus.io/) - Monitoring and alerting
- [Grafana](https://grafana.com/) - Visualization
- [Datadog](https://www.datadoghq.com/) - SaaS monitoring
- [New Relic](https://newrelic.com/) - APM
- [CloudWatch](https://aws.amazon.com/cloudwatch/) - AWS monitoring

### Development Tools
- [Spring Boot DevTools](https://docs.spring.io/spring-boot/docs/current/reference/html/using.html#using.devtools)
- [Eclipse MAT](https://www.eclipse.org/mat/) - Memory analyzer
- [VisualVM](https://visualvm.github.io/) - JVM monitoring

---

## Summary

Spring Boot Actuator provides essential production-ready features for monitoring, management, and operations. Master built-in endpoints (health, info, metrics), create custom health indicators and metrics, secure endpoints properly with Spring Security, integrate with monitoring systems (Prometheus, Grafana), and implement production best practices (graceful shutdown, health probes, externalized config). Critical for production deployments: expose only necessary endpoints, use separate management port, enable HTTPS, configure health probes for Kubernetes, export metrics to monitoring systems, set up meaningful alerts. Actuator transforms applications into observable, manageable production services ready for enterprise deployment.

---

**Previous:** Production-ready Features  
**Next:** Performance & Best Practices (Module 19) →

