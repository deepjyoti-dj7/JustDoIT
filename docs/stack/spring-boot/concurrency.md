---
title: Concurrency
description: The @Async with thread pools, TaskDecorator for context propagation, @Scheduled, CompletableFuture fan-out, virtual threads, transaction+async pitfalls, and Resilience4j patterns.
---

# Concurrency

Spring provides high-level concurrency abstractions on top of Java's concurrent primitives. Understanding how `@Async`, `@Scheduled`, and `CompletableFuture` interact with Spring's transaction management and request context is essential for correct async code.

---

## `@Async` — Background Execution

```java
@SpringBootApplication
@EnableAsync
public class OrderServiceApplication {}

@Configuration
public class AsyncConfig implements AsyncConfigurer {

    @Override
    public Executor getAsyncExecutor() {
        ThreadPoolTaskExecutor exec = new ThreadPoolTaskExecutor();
        exec.setCorePoolSize(5);
        exec.setMaxPoolSize(20);
        exec.setQueueCapacity(100);
        exec.setThreadNamePrefix("async-order-");
        exec.setRejectedExecutionHandler(new CallerRunsPolicy()); // backpressure
        exec.setTaskDecorator(new MdcTaskDecorator());            // propagate MDC/context
        exec.initialize();
        return exec;
    }

    @Override
    public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
        return (ex, method, params) ->
            log.error("Uncaught async exception in {}: {}", method.getName(), ex.getMessage(), ex);
    }
}
```

### `@Async` return types

```java
@Service
public class NotificationService {

    // void — fire and forget, exceptions go to AsyncUncaughtExceptionHandler
    @Async
    public void sendEmail(String to, String body) {
        emailClient.send(to, body);
    }

    // CompletableFuture — caller can compose or wait
    @Async("emailExecutor")  // use named executor bean
    public CompletableFuture<SendResult> sendEmailAsync(String to, String body) {
        try {
            return CompletableFuture.completedFuture(emailClient.send(to, body));
        } catch (Exception e) {
            return CompletableFuture.failedFuture(e);
        }
    }

    // Future — legacy, prefer CompletableFuture
    @Async
    public Future<Boolean> isEmailValid(String email) {
        return new AsyncResult<>(validator.check(email));
    }
}
```

> **`@Async` only works through a Spring proxy.** Calling an `@Async` method from the **same class** (i.e., `this.sendEmail(...)`) bypasses the proxy and runs synchronously. Move the async method to a separate bean.

---

## `TaskDecorator` — Propagate Request Context

By default, async tasks run in a new thread that does NOT have the MDC (logging context), `SecurityContext`, or request scope from the calling thread. Fix this with a `TaskDecorator`:

```java
@Component
public class MdcTaskDecorator implements TaskDecorator {

    @Override
    public Runnable decorate(Runnable runnable) {
        // Capture context from the calling thread
        Map<String, String> mdcContext = MDC.getCopyOfContextMap();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        return () -> {
            try {
                // Restore context in the async thread
                if (mdcContext != null) MDC.setContextMap(mdcContext);
                SecurityContextHolder.getContext().setAuthentication(auth);
                runnable.run();
            } finally {
                MDC.clear();
                SecurityContextHolder.clearContext();
            }
        };
    }
}
```

---

## `@Async` and Transactions

**`@Transactional` does NOT propagate across thread boundaries.** If an `@Async` method calls a `@Transactional` method, the async thread starts a new transaction independently:

```java
// WRONG: assumes save() will be rolled back if async method fails
@Transactional
public void processOrder(UUID orderId) {
    orderRepo.updateStatus(orderId, PROCESSING);
    asyncService.doExpensiveWork(orderId); // runs in different thread, different TX
}

// CORRECT: design for independent transactions
// The async work should be self-contained or use @TransactionalEventListener
@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
@Async
public void afterOrderCreated(OrderCreatedEvent event) {
    // Fires only after the creating transaction committed — safe to act on the order
    searchIndex.index(event.orderId());
}
```

---

## `CompletableFuture` — Parallel Fan-Out

```java
@Service
public class OrderEnrichmentService {

    private final ProductService productService;
    private final CustomerService customerService;
    private final Executor pool;

    @Async
    public CompletableFuture<EnrichedOrder> enrich(Order order) {
        // Fire both calls concurrently
        CompletableFuture<Customer> customerF =
            CompletableFuture.supplyAsync(
                () -> customerService.findById(order.getCustomerId()), pool);

        CompletableFuture<List<ProductInfo>> productsF =
            CompletableFuture.supplyAsync(
                () -> productService.findByIds(order.getProductIds()), pool);

        // Combine when both complete
        return customerF.thenCombine(productsF,
            (customer, products) -> new EnrichedOrder(order, customer, products));
    }

    // Enrich a list in parallel
    public List<EnrichedOrder> enrichAll(List<Order> orders) {
        List<CompletableFuture<EnrichedOrder>> futures = orders.stream()
            .map(this::enrich)
            .toList();

        return futures.stream()
            .map(f -> f.orTimeout(5, TimeUnit.SECONDS)
                       .exceptionally(ex -> EnrichedOrder.empty()))
            .map(CompletableFuture::join)
            .toList();
    }
}
```

---

## `@Scheduled` — Periodic Tasks

```java
@SpringBootApplication
@EnableScheduling
public class OrderServiceApplication {}

@Component
public class OrderMaintenanceJobs {

    // Cron expression: second minute hour day-of-month month day-of-week
    @Scheduled(cron = "0 0 2 * * *")        // 2 AM every night
    public void cleanExpiredOrders() {
        int deleted = orderRepo.deleteExpiredOrders(Instant.now().minus(30, DAYS));
        log.info("Deleted {} expired orders", deleted);
    }

    @Scheduled(fixedDelay = 30_000, initialDelay = 10_000)
    public void syncInventory() {}

    @Scheduled(fixedRate = 60_000)
    public void heartbeat() {}
}
```

### Thread pool for scheduled tasks

By default all `@Scheduled` tasks share a single thread. If one task is slow it blocks all others:

```java
@Bean
public TaskScheduler taskScheduler() {
    ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
    scheduler.setPoolSize(5);
    scheduler.setThreadNamePrefix("scheduler-");
    scheduler.setErrorHandler(t -> log.error("Scheduled task error", t));
    return scheduler;
}
```

---

## Virtual Threads (Java 21 + Spring Boot 3.2)

```yaml
spring:
  threads:
    virtual:
      enabled: true
```

With this setting:
- Tomcat creates a virtual thread per HTTP request (no bounded thread pool)
- `@Async` executor switches to virtual threads
- Blocking database and HTTP calls park virtual threads without wasting OS threads

```java
// Explicitly create virtual thread executor if needed before Spring Boot 3.2
@Bean
public Executor virtualThreadExecutor() {
    return Executors.newVirtualThreadPerTaskExecutor();
}
```

---

## Resilience4j — Circuit Breaker, Retry, Bulkhead

```xml
<dependency>
    <groupId>io.github.resilience4j</groupId>
    <artifactId>resilience4j-spring-boot3</artifactId>
</dependency>
```

```java
@Service
public class PaymentService {

    @CircuitBreaker(name = "payment", fallbackMethod = "paymentFallback")
    @TimeLimiter(name = "payment")
    @Retry(name = "payment")
    @Bulkhead(name = "payment")
    public CompletableFuture<PaymentResult> charge(ChargeRequest req) {
        return CompletableFuture.supplyAsync(() -> gateway.charge(req));
    }

    // Fallback: same signature + Throwable parameter
    public CompletableFuture<PaymentResult> paymentFallback(ChargeRequest req, Throwable ex) {
        log.warn("Payment gateway unavailable ({}), queuing for retry", ex.getMessage());
        return CompletableFuture.completedFuture(PaymentResult.pending(req.orderId()));
    }
}
```

```yaml
resilience4j:
  circuitbreaker:
    instances:
      payment:
        sliding-window-size: 10
        failure-rate-threshold: 50       # open after 50% failures
        wait-duration-in-open-state: 30s
        permitted-calls-in-half-open-state: 3
        record-exceptions:
          - java.io.IOException
          - com.example.PaymentException
  timelimiter:
    instances:
      payment:
        timeout-duration: 3s
        cancel-running-future: true
  retry:
    instances:
      payment:
        max-attempts: 3
        wait-duration: 500ms
        retry-on-result-predicate: com.example.PaymentRetryPredicate
        exponential-backoff-multiplier: 2  # 500ms, 1s, 2s
  bulkhead:
    instances:
      payment:
        max-concurrent-calls: 10
        max-wait-duration: 0ms  # don't wait if full — fail fast
```

---

## Thread-Safety Pitfalls in Spring

### Spring beans are singletons — never store mutable per-request state in fields

```java
// DANGEROUS: counter field shared across all threads
@Service
public class OrderService {
    private int requestCount = 0;    // race condition!

    public void placeOrder(PlaceOrderRequest req) {
        requestCount++;  // NOT atomic
    }
}

// CORRECT: use AtomicInteger for shared counters
private final AtomicInteger requestCount = new AtomicInteger(0);
requestCount.incrementAndGet();

// OR: use Micrometer counters — they're already thread-safe
private final Counter ordersCounter;
public OrderService(MeterRegistry registry) {
    this.ordersCounter = Counter.builder("orders.created").register(registry);
}
```

### `@Transactional` and thread boundaries

JPA `EntityManager` is bound to the current thread. Never pass managed entities across thread boundaries:

```java
// WRONG: entity is detached in the async thread
@Transactional
public void processOrder(UUID orderId) {
    Order order = orderRepo.findById(orderId).orElseThrow();
    asyncService.process(order);  // order is detached in the async thread — LazyInit fails
}

// CORRECT: pass the ID, load fresh in the async thread
@Transactional
public void processOrder(UUID orderId) {
    asyncService.process(orderId);  // async method loads its own managed entity
}

@Async
@Transactional
public void process(UUID orderId) {
    Order order = orderRepo.findById(orderId).orElseThrow(); // fresh load in new TX
    // safe to access lazy-loaded associations
}
```
