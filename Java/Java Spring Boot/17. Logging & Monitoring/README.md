# Logging & Monitoring Module - README

---

## Overview

This module covers comprehensive logging and monitoring strategies for Spring Boot applications, from basic logging frameworks to distributed tracing and APM tools.

### What You'll Learn

- **Logging frameworks** - SLF4J, Logback, Log4j 2
- **Log levels** - TRACE, DEBUG, INFO, WARN, ERROR
- **Custom logging** - Custom appenders, filters, audit logging
- **Structured logging** - JSON format, ELK stack integration
- **Centralized logging** - ELK, Splunk, CloudWatch
- **Metrics collection** - Micrometer, Prometheus
- **APM tools** - New Relic, Datadog, Dynatrace
- **Distributed tracing** - Zipkin, Jaeger, OpenTelemetry

---

## Module Structure

### 1. Logging Frameworks (`01. Logging Frameworks.md`)
- SLF4J facade and implementations
- Logback configuration
- Log4j 2 setup
- MDC (Mapped Diagnostic Context)
- Async logging
- Log rotation
- Performance optimization

### 2. Logging Levels (`02. Logging Levels.md`)
- TRACE, DEBUG, INFO, WARN, ERROR, FATAL
- When to use each level
- Environment-specific configuration
- Dynamic log level changes
- Conditional logging
- Performance impact

### 3. Custom Logging (`03. Custom Logging.md`)
- Custom appenders (Database, Slack, Email)
- Custom filters (Sensitive data masking, rate limiting)
- Audit logging
- Request/Response logging
- Performance logging
- Correlation IDs

### 4. Structured Logging (`04. Structured Logging.md`)
- JSON logging with logstash-logback-encoder
- StructuredArguments
- MDC for context
- Exception logging
- ELK stack integration
- Best practices

### 5. Centralized Logging (`05. Centralized Logging.md`)
- ELK Stack (Elasticsearch, Logstash, Kibana)
- Splunk integration
- AWS CloudWatch Logs
- Log aggregation patterns
- Search and analysis
- Alerting

### 6. Metrics Collection (`06. Metrics Collection.md`)
- Micrometer framework
- Prometheus integration
- Custom metrics
- JVM metrics
- Application metrics
- Dashboards with Grafana

### 7. APM Tools (`07. APM Tools.md`)
- New Relic
- Datadog
- Dynatrace
- AppDynamics
- Performance monitoring
- Error tracking
- Real user monitoring

### 8. Distributed Tracing (`08. Distributed Tracing.md`)
- Zipkin
- Jaeger
- OpenTelemetry
- Spring Cloud Sleuth
- Trace context propagation
- Span management

---

## Key Concepts

### Logging Levels Hierarchy
```
TRACE (Most verbose)
  ↓
DEBUG
  ↓
INFO
  ↓
WARN
  ↓
ERROR
  ↓
FATAL (Least verbose)
```

### Structured Logging Example
```json
{
  "@timestamp": "2024-12-22T10:30:45.123Z",
  "level": "INFO",
  "message": "User logged in",
  "userId": "john",
  "requestId": "abc-123",
  "duration": 150
}
```

### MDC Context
```java
MDC.put("requestId", "abc-123");
MDC.put("userId", "john");
log.info("Processing request");
MDC.clear();
```

### Metrics Collection
```java
@Timed(value = "api.products.get", percentiles = {0.5, 0.95, 0.99})
public Product getProduct(Long id) {
    return repository.findById(id).orElseThrow();
}
```

### Distributed Tracing
```
Request → Service A [span1] → Service B [span2] → Service C [span3]
TraceID: abc-123 (same across all services)
```

---

## Technology Stack

### Logging
- **SLF4J** - Logging facade
- **Logback** - Default implementation
- **Log4j 2** - Alternative implementation
- **Logstash Logback Encoder** - JSON logging

### Centralized Logging
- **ELK Stack** - Elasticsearch, Logstash, Kibana
- **Splunk** - Enterprise log management
- **AWS CloudWatch** - Cloud-native logging
- **Fluentd** - Log collector

### Metrics
- **Micrometer** - Metrics facade
- **Prometheus** - Metrics collection
- **Grafana** - Metrics visualization
- **Spring Boot Actuator** - Built-in metrics

### APM
- **New Relic** - Full-stack monitoring
- **Datadog** - Infrastructure & APM
- **Dynatrace** - AI-powered monitoring
- **AppDynamics** - Application performance

### Tracing
- **Zipkin** - Distributed tracing
- **Jaeger** - Uber's tracing system
- **OpenTelemetry** - Unified observability
- **Spring Cloud Sleuth** - Auto-instrumentation

---

## Best Practices

### Logging
1. Use SLF4J facade for abstraction
2. Set appropriate log levels (INFO in prod)
3. Use structured logging (JSON)
4. Add context with MDC
5. Avoid logging sensitive data
6. Configure log rotation
7. Use async logging for performance
8. Centralize logs in distributed systems

### Monitoring
1. Collect application metrics
2. Monitor JVM health
3. Track error rates
4. Measure response times
5. Set up alerts
6. Create dashboards
7. Enable distributed tracing
8. Monitor database performance

### Performance
1. Minimize logging overhead
2. Use conditional logging for expensive operations
3. Configure appropriate retention
4. Use sampling for high-volume logs
5. Compress archived logs

---

## Configuration Examples

### Development
```yaml
logging:
  level:
    root: DEBUG
    com.example: TRACE
```

### Production
```yaml
logging:
  level:
    root: WARN
    com.example: INFO

management:
  endpoints:
    web:
      exposure:
        include: health,metrics,prometheus
  metrics:
    export:
      prometheus:
        enabled: true
```

### JSON Logging
```xml
<appender name="JSON" class="ch.qos.logback.core.ConsoleAppender">
    <encoder class="net.logstash.logback.encoder.LogstashEncoder">
        <includeMdcKeyName>traceId</includeMdcKeyName>
        <includeMdcKeyName>userId</includeMdcKeyName>
    </encoder>
</appender>
```

---

## Common Patterns

### Request Logging
```java
@Component
public class LoggingFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) {
        String requestId = UUID.randomUUID().toString();
        MDC.put("requestId", requestId);
        long start = System.currentTimeMillis();
        try {
            filterChain.doFilter(request, response);
        } finally {
            long duration = System.currentTimeMillis() - start;
            log.info("Request completed: {} {} - {} ({}ms)",
                request.getMethod(), request.getRequestURI(),
                response.getStatus(), duration);
            MDC.clear();
        }
    }
}
```

### Custom Metrics
```java
@Component
public class MetricsService {
    private final Counter orderCounter;
    private final Timer orderProcessingTimer;
    
    public MetricsService(MeterRegistry registry) {
        this.orderCounter = Counter.builder("orders.created")
            .tag("type", "online")
            .register(registry);
        
        this.orderProcessingTimer = Timer.builder("orders.processing.time")
            .publishPercentiles(0.5, 0.95, 0.99)
            .register(registry);
    }
}
```

---

## Interview Questions (60 Total)

**Logging Frameworks (15)**
1. What is SLF4J?
2. Logback vs Log4j 2?
3. What is MDC?
4. How to configure Logback?
5. What is async logging?
6. How to log exceptions?
7. What is log rotation?
8. How to switch logging frameworks?
9. What is a logging appender?
10. How to configure different log files?
11. What is parameterized logging?
12. How to add correlation ID?
13. What is logback-spring.xml?
14. How to log SQL queries?
15. What is the default logging in Spring Boot?

**Logging Levels (15)**
16. What are the log levels?
17. When to use DEBUG vs INFO?
18. What level for production?
19. How to change log level at runtime?
20. What is log level hierarchy?
21. TRACE vs DEBUG?
22. When to use WARN?
23. ERROR vs FATAL?
24. How to configure per-package levels?
25. What is the performance impact of TRACE?
26. How to enable SQL logging?
27. Should you log every method call?
28. What level for user login events?
29. How to reduce log volume?
30. What is conditional logging?

**Structured Logging (15)**
31. What is structured logging?
32. Why use JSON logs?
33. What is logstash-logback-encoder?
34. How to add custom JSON fields?
35. What is StructuredArguments?
36. How to log nested objects?
37. What is the ELK stack?
38. How to include trace ID?
39. What is a marker in SLF4J?
40. How to query JSON logs?
41. MDC vs StructuredArguments?
42. Should you log request body in production?
43. How to reduce JSON log size?
44. What is @timestamp?
45. What is log aggregation?

**Monitoring & Tracing (15)**
46. What is Micrometer?
47. Prometheus vs Graphite?
48. What is distributed tracing?
49. Zipkin vs Jaeger?
50. What is OpenTelemetry?
51. What is Spring Cloud Sleuth?
52. What is a trace ID?
53. What is a span?
54. How to measure method performance?
55. What metrics to collect?
56. What is an APM tool?
57. New Relic vs Datadog?
58. What is Grafana?
59. How to create alerts?
60. What is real user monitoring (RUM)?

---

## Learning Path

### Beginner
1. **Logging Frameworks** - Understand SLF4J and Logback
2. **Logging Levels** - Learn when to use each level
3. **Basic Configuration** - application.yml logging setup

### Intermediate
4. **Custom Logging** - Custom appenders and filters
5. **Structured Logging** - JSON format and ELK
6. **Metrics Collection** - Micrometer and Prometheus
7. **Spring Boot Actuator** - Built-in monitoring

### Advanced
8. **Centralized Logging** - ELK/Splunk setup
9. **APM Tools** - New Relic/Datadog integration
10. **Distributed Tracing** - Zipkin/Jaeger implementation
11. **Performance Optimization** - Async logging, sampling
12. **Production Monitoring** - Dashboards, alerts

---

## Tools & Resources

### Logging
- **Logback** - https://logback.qos.ch/
- **Log4j 2** - https://logging.apache.org/log4j/2.x/
- **SLF4J** - https://www.slf4j.org/

### Monitoring
- **Prometheus** - https://prometheus.io/
- **Grafana** - https://grafana.com/
- **Micrometer** - https://micrometer.io/

### Tracing
- **Zipkin** - https://zipkin.io/
- **Jaeger** - https://www.jaegertracing.io/
- **OpenTelemetry** - https://opentelemetry.io/

### APM
- **New Relic** - https://newrelic.com/
- **Datadog** - https://www.datadoghq.com/
- **Dynatrace** - https://www.dynatrace.com/

---

## Summary

Master logging with SLF4J/Logback, structured JSON logging, and centralized aggregation (ELK/Splunk). Collect metrics with Micrometer and Prometheus. Implement distributed tracing with Zipkin/Jaeger. Monitor applications with APM tools (New Relic, Datadog). Follow best practices: appropriate log levels, context with MDC, avoid sensitive data, configure rotation, use async logging.

**Key Takeaways:**
- Logging is essential for debugging and monitoring
- Use structured logging (JSON) for better analysis
- Centralize logs in distributed systems
- Collect metrics for performance monitoring
- Implement distributed tracing for microservices
- Set up dashboards and alerts
- Choose appropriate tools for your scale

---

**Next Module:** Spring Boot Actuator →

---

**Module Status:** In Progress ⏳
**Files:** 8 + README
**Estimated Study Time:** 14-18 hours
**Difficulty:** Intermediate to Advanced
