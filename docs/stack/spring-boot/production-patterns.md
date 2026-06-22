---
title: Production Patterns
description: Actuator health/metrics, Micrometer + Prometheus, structured logging with Logback and MDC, externalized config, graceful shutdown, layered JAR Docker build, and Caffeine caching.
---

# Production Patterns

Getting a Spring Boot application running is easy. Getting it running reliably in production — with health checks, metrics, structured logs, proper configuration management, and graceful shutdown — requires deliberate choices. This page covers those choices.

---

## Actuator — Built-in Operations Endpoints

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus,loggers,env,beans,httptrace
      base-path: /actuator
  endpoint:
    health:
      show-details: when-authorized  # never expose to public
      probes:
        enabled: true                # /actuator/health/liveness and /readiness
    env:
      show-values: when-authorized
  metrics:
    export:
      prometheus:
        enabled: true
  info:
    env:
      enabled: true
    git:
      mode: full  # include git commit info
    build:
      enabled: true
```

### Custom health indicator

```java
@Component
public class ExternalApiHealthIndicator implements HealthIndicator {

    private final PaymentGatewayClient client;

    @Override
    public Health health() {
        try {
            long start = System.currentTimeMillis();
            client.ping();
            long latency = System.currentTimeMillis() - start;
            return Health.up()
                    .withDetail("latency_ms", latency)
                    .withDetail("gateway", "reachable")
                    .build();
        } catch (Exception ex) {
            return Health.down()
                    .withDetail("gateway", "unreachable")
                    .withDetail("error", ex.getMessage())
                    .build();
        }
    }
}
```

### Health groups and Kubernetes probes

```yaml
management:
  endpoint:
    health:
      group:
        liveness:
          include: livenessState    # JVM is alive
        readiness:
          include: readinessState,db,redis  # ready to serve traffic
```

```yaml
# Kubernetes deployment
livenessProbe:
  httpGet:
    path: /actuator/health/liveness
    port: 8080
  initialDelaySeconds: 30
  periodSeconds: 10
  failureThreshold: 3

readinessProbe:
  httpGet:
    path: /actuator/health/readiness
    port: 8080
  initialDelaySeconds: 20
  periodSeconds: 5
  failureThreshold: 3
```

### Custom Info contributor

```java
@Component
public class EnvironmentInfoContributor implements InfoContributor {
    @Override
    public void contribute(Info.Builder builder) {
        builder.withDetail("environment", Map.of(
            "name",    System.getenv("ENVIRONMENT"),
            "region",  System.getenv("AWS_REGION"),
            "version", System.getenv("APP_VERSION")
        ));
    }
}
```

---

## Micrometer Metrics + Prometheus

```java
@Service
public class OrderService {

    private final Counter ordersCreated;
    private final Counter ordersRejected;
    private final Timer  orderProcessingTimer;
    private final DistributionSummary orderValueSummary;

    public OrderService(MeterRegistry registry) {
        this.ordersCreated = Counter.builder("orders.created")
            .tag("service", "order-service")
            .description("Total orders created")
            .register(registry);

        this.ordersRejected = Counter.builder("orders.rejected")
            .tag("service", "order-service")
            .register(registry);

        this.orderProcessingTimer = Timer.builder("orders.processing.duration")
            .publishPercentiles(0.5, 0.95, 0.99)
            .publishPercentileHistogram()
            .register(registry);

        this.orderValueSummary = DistributionSummary.builder("orders.value")
            .baseUnit("dollars")
            .publishPercentiles(0.5, 0.9, 0.99)
            .register(registry);
    }

    public Order placeOrder(PlaceOrderRequest req) {
        return orderProcessingTimer.record(() -> {
            Order order = buildAndSave(req);
            ordersCreated.increment();
            orderValueSummary.record(order.getTotal().doubleValue());
            return order;
        });
    }
}
```

Scrape at `/actuator/prometheus` with Prometheus; visualise with Grafana dashboards.

---

## Structured Logging with Logback and MDC

### Logback configuration for JSON output

```xml
<!-- src/main/resources/logback-spring.xml -->
<configuration>
    <springProfile name="production">
        <appender name="JSON" class="ch.qos.logback.core.ConsoleAppender">
            <encoder class="net.logstash.logback.encoder.LogstashEncoder">
                <customFields>{"service":"order-service","env":"production"}</customFields>
            </encoder>
        </appender>
        <root level="INFO"><appender-ref ref="JSON"/></root>
    </springProfile>

    <springProfile name="!production">
        <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
            <encoder>
                <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level [%X{correlationId}] %logger{36} - %msg%n</pattern>
            </encoder>
        </appender>
        <root level="DEBUG"><appender-ref ref="CONSOLE"/></root>
    </springProfile>
</configuration>
```

### MDC for per-request context

```java
// Filter: populate MDC at the start of each request
@Component
public class RequestContextFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res,
                                    FilterChain chain) throws ServletException, IOException {
        String correlId = Optional.ofNullable(req.getHeader("X-Correlation-Id"))
                                  .orElse(UUID.randomUUID().toString());
        MDC.put("correlationId", correlId);
        MDC.put("requestPath",   req.getRequestURI());
        MDC.put("requestMethod", req.getMethod());
        res.setHeader("X-Correlation-Id", correlId);
        try {
            chain.doFilter(req, res);
        } finally {
            MDC.clear();  // always clear to prevent thread pool leaks
        }
    }
}

// Now every log statement in this request includes correlationId automatically
log.info("Order {} placed", order.getId());
// Output: {"level":"INFO","correlationId":"abc-123","requestPath":"/api/orders","msg":"Order xyz placed"}
```

### Dynamic log levels via Actuator

```bash
# View current log levels
GET /actuator/loggers

# Set DEBUG for a package at runtime (no restart needed)
POST /actuator/loggers/com.example.payments
Content-Type: application/json
{"configuredLevel": "DEBUG"}

# Reset to default
POST /actuator/loggers/com.example.payments
{"configuredLevel": null}
```

---

## Externalized Configuration

```java
// Type-safe configuration properties
@ConfigurationProperties(prefix = "app")
@Validated
public record AppProperties(
    @Valid PaymentProperties payment,
    @Valid FeatureFlags features
) {
    public record PaymentProperties(
        @NotBlank String apiKey,
        @NotNull URI baseUrl,
        @DurationMin(seconds = 1) Duration timeout,
        boolean sandboxMode
    ) {}

    public record FeatureFlags(
        boolean newCheckout,
        boolean loyaltyPoints
    ) {}
}
```

```yaml
# application.yml
app:
  payment:
    api-key: ${PAYMENT_API_KEY}      # required env var — startup fails if missing
    base-url: https://api.stripe.com
    timeout: 30s                     # Duration binding
    sandbox-mode: ${SANDBOX:false}   # env var with default
  features:
    new-checkout: true
    loyalty-points: false
```

---

## Graceful Shutdown

```yaml
server:
  shutdown: graceful
spring:
  lifecycle:
    timeout-per-shutdown-phase: 30s  # max wait for in-flight requests
```

On SIGTERM (Kubernetes pod termination):
1. Kubernetes removes pod from service endpoints (stops new traffic)
2. Spring sets readiness probe to DOWN
3. In-flight requests complete (up to 30s)
4. `@PreDestroy` methods run, database connections close
5. Process exits 0

---

## Docker Multi-Stage Layered Build

```dockerfile
# Stage 1: extract Spring Boot layers for optimal Docker caching
FROM eclipse-temurin:21-jdk-jammy AS extract
WORKDIR /build
COPY target/app.jar app.jar
RUN java -Djarmode=tools -jar app.jar extract --layers --launcher --destination extracted

# Stage 2: production image — JRE only (~180MB vs ~500MB JDK)
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Dependencies (rarely change) in lower layers — Docker caches aggressively
COPY --from=extract /build/extracted/dependencies/          ./
COPY --from=extract /build/extracted/spring-boot-loader/    ./
COPY --from=extract /build/extracted/snapshot-dependencies/ ./
# Application classes (change every commit) in top layer
COPY --from=extract /build/extracted/application/           ./

USER 1000
EXPOSE 8080

ENV JAVA_OPTS="-Xmx512m -Xms256m -XX:+UseZGC -XX:+ZGenerational"
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### JVM flags for production containers

```bash
# Recommended JVM flags for containerised Spring Boot
-Xmx512m                        # heap max (set to ~75% of container memory limit)
-Xms256m                        # heap initial (avoids late growth pauses)
-XX:+UseZGC                     # low-latency GC (Java 21: use ZGenerational for best results)
-XX:+ZGenerational              # ZGC generational mode (Java 21+)
-XX:MaxMetaspaceSize=256m       # prevent metaspace leaks
-Dfile.encoding=UTF-8
-Dspring.profiles.active=${SPRING_PROFILES_ACTIVE}
```

---

## Caffeine Cache Configuration

```xml
<dependency>
    <groupId>com.github.ben-manes.caffeine</groupId>
    <artifactId>caffeine</artifactId>
</dependency>
```

```java
@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager mgr = new CaffeineCacheManager();
        mgr.setCaffeine(Caffeine.newBuilder()
            .maximumSize(2000)
            .expireAfterWrite(Duration.ofMinutes(10))
            .expireAfterAccess(Duration.ofMinutes(5))
            .recordStats());  // exposes hit/miss metrics via Micrometer
        return mgr;
    }

    // Different caches with different TTLs
    @Bean
    @Primary
    public CacheManager compositeCacheManager(
            CaffeineCacheManager defaultCache) {
        SimpleCacheManager mgr = new SimpleCacheManager();
        mgr.setCaches(List.of(
            buildCache("products",  2000, Duration.ofMinutes(30)),
            buildCache("sessions",  10000, Duration.ofMinutes(60)),
            buildCache("config",    100,   Duration.ofHours(1))
        ));
        return mgr;
    }

    private Cache buildCache(String name, int size, Duration ttl) {
        return new CaffeineCache(name, Caffeine.newBuilder()
            .maximumSize(size)
            .expireAfterWrite(ttl)
            .recordStats()
            .build());
    }
}
```
