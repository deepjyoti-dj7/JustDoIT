# Performance & Best Practices - Module README

---

## Module Overview

This module covers advanced performance optimization techniques and best practices for building production-ready Spring Boot applications. Learn database tuning, async processing, memory management, code quality, and design patterns.

**What You'll Learn:**
- Application performance profiling and optimization
- Database query optimization and connection pool tuning
- Solving N+1 query problems
- Asynchronous processing and thread pool configuration
- JVM memory management and garbage collection
- Common pitfalls and how to avoid them
- Code quality principles (SOLID, clean code)
- Design patterns in Spring Boot context

---

## Module Structure

### 01. Application Performance
**Focus:** General application performance optimization techniques

**Key Topics:**
- Performance profiling tools (VisualVM, JProfiler, Java Mission Control)
- Response time optimization (HTTP compression, caching, ETags)
- Lazy vs Eager loading strategies
- Pagination and batch processing
- Caching strategies (Caffeine, Redis)
- CDN and static resource optimization
- Load balancing and query performance
- API optimization with DTOs and JsonView

**Learning Objectives:**
- Profile application performance and identify bottlenecks
- Implement HTTP compression and caching
- Choose appropriate loading strategies
- Apply caching effectively

### 02. Database Optimization
**Focus:** Database performance tuning

**Key Topics:**
- Indexing strategies (single, composite, unique)
- Query optimization techniques
- HikariCP connection pool configuration
- Query caching (second-level cache)
- Read replicas and read-write splitting
- Database partitioning
- Bulk operations
- EXPLAIN plan analysis

**Learning Objectives:**
- Create effective database indexes
- Optimize queries with EXPLAIN plans
- Configure HikariCP for optimal performance
- Implement read-write splitting

### 03. N+1 Query Problem
**Focus:** Understanding and solving N+1 query issues

**Key Topics:**
- Problem detection and identification
- Solution 1: Fetch Joins
- Solution 2: Entity Graphs
- Solution 3: Batch Fetching (@BatchSize)
- Solution 4: DTO Projections
- Solution 5: Subselect Fetch
- Solution comparison and trade-offs
- Real-world examples and testing

**Learning Objectives:**
- Detect N+1 query problems
- Apply appropriate solutions
- Compare solution trade-offs
- Test query performance

### 04. Connection Pool Tuning
**Focus:** Optimizing HikariCP connection pool

**Key Topics:**
- Connection pooling benefits
- Pool sizing formulas
- HikariCP configuration parameters
- Monitoring with HikariPoolMXBean
- Common issues (timeouts, leaks)
- Multi-tenant configuration

**Learning Objectives:**
- Calculate optimal pool size
- Configure HikariCP parameters
- Monitor connection pool metrics
- Troubleshoot connection issues

### 05. Async Processing
**Focus:** Asynchronous processing for improved responsiveness

**Key Topics:**
- @Async annotation and @EnableAsync
- Future and CompletableFuture
- Custom thread pool configuration
- Multiple thread pools
- Exception handling in async methods
- Real-world examples (email, parallel API calls, file processing)
- Monitoring async tasks

**Learning Objectives:**
- Implement async methods
- Configure custom thread pools
- Handle exceptions in async context
- Monitor async task execution

### 06. Thread Pool Configuration
**Focus:** Thread pool management and optimization

**Key Topics:**
- ExecutorService and ThreadPoolTaskExecutor
- Thread pool sizing formulas (CPU-bound vs I/O-bound)
- Rejection policies (Abort, CallerRuns, Discard)
- Queue types (LinkedBlockingQueue, SynchronousQueue)
- Scheduled thread pools
- Monitoring and best practices

**Learning Objectives:**
- Calculate appropriate thread pool size
- Configure rejection policies
- Choose appropriate queue types
- Monitor thread pool metrics

### 07. Memory Management
**Focus:** JVM memory optimization and leak prevention

**Key Topics:**
- JVM memory structure (Heap, Metaspace)
- Heap and Metaspace configuration
- Garbage collection algorithms (G1GC, ZGC)
- Memory leak patterns and detection
- Heap dump analysis
- Memory monitoring
- Optimization techniques

**Learning Objectives:**
- Configure JVM memory parameters
- Choose appropriate GC algorithm
- Detect and fix memory leaks
- Monitor memory usage

### 08. Common Pitfalls
**Focus:** Avoiding common mistakes and anti-patterns

**Key Topics:**
- Architecture pitfalls (god classes, circular dependencies)
- Performance pitfalls (N+1, missing indexes)
- Concurrency pitfalls (race conditions, deadlocks)
- Transaction pitfalls (missing @Transactional)
- Security pitfalls (SQL injection, exposed data)
- Exception handling pitfalls
- Resource management pitfalls
- Configuration pitfalls

**Learning Objectives:**
- Recognize common anti-patterns
- Apply proper solutions
- Avoid security vulnerabilities
- Manage resources correctly

### 09. Code Quality
**Focus:** Code quality principles and practices

**Key Topics:**
- SOLID principles (SRP, OCP, LSP, ISP, DIP)
- Clean code practices (meaningful names, small functions)
- Code organization and layer separation
- Testing (unit tests, integration tests)
- Code review checklist
- Static code analysis (SonarQube, Checkstyle, SpotBugs)

**Learning Objectives:**
- Apply SOLID principles
- Write clean, maintainable code
- Implement comprehensive tests
- Use static analysis tools

### 10. Design Patterns
**Focus:** Common design patterns in Spring Boot

**Key Topics:**
- Creational patterns (Singleton, Factory, Builder, Prototype)
- Structural patterns (Adapter, Decorator, Proxy, Facade)
- Behavioral patterns (Strategy, Observer, Template Method, Chain of Responsibility)
- Spring-specific patterns (DI, Repository, DTO)

**Learning Objectives:**
- Recognize design patterns
- Implement patterns in Spring Boot
- Choose appropriate patterns
- Understand Spring's use of patterns

---

## Key Concepts

### Performance Optimization

```java
// HTTP Compression
server.compression.enabled=true
server.compression.mime-types=application/json,text/html

// Caching with Caffeine
@Cacheable(value = "users", key = "#id")
public User findById(Long id) {
    return userRepository.findById(id).orElseThrow();
}

// Pagination
Page<Product> products = productRepository.findAll(
    PageRequest.of(0, 20, Sort.by("createdAt").descending())
);
```

### Database Optimization

```java
// Composite Index
@Table(name = "users", indexes = {
    @Index(name = "idx_email_status", columnList = "email, status")
})

// Fetch Join (solves N+1)
@Query("SELECT o FROM Order o JOIN FETCH o.items WHERE o.id = :id")
Optional<Order> findByIdWithItems(@Param("id") Long id);

// HikariCP Configuration
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.connection-timeout=30000
spring.datasource.hikari.leak-detection-threshold=60000
```

### Async Processing

```java
// Enable Async
@EnableAsync
@Configuration
public class AsyncConfig {
    @Bean
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("async-");
        executor.initialize();
        return executor;
    }
}

// Async Method
@Async
public CompletableFuture<String> processAsync() {
    // Long-running task
    return CompletableFuture.completedFuture("Result");
}
```

### Memory Management

```java
// JVM Configuration
-Xms2g -Xmx2g
-XX:+UseG1GC
-XX:MaxGCPauseMillis=200
-XX:MetaspaceSize=256m
-XX:MaxMetaspaceSize=512m
-XX:+HeapDumpOnOutOfMemoryError

// Prevent Memory Leaks
// Use try-with-resources
try (Connection conn = dataSource.getConnection()) {
    // Use connection
}

// Clean ThreadLocal
@Component
public class ThreadLocalCleanupFilter implements Filter {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) {
        try {
            chain.doFilter(request, response);
        } finally {
            UserContext.clear();  // Clean ThreadLocal
        }
    }
}
```

---

## Technology Stack

### Performance Tools
- **Profiling:** VisualVM, JProfiler, Java Mission Control, YourKit
- **Metrics:** Micrometer, Spring Boot Actuator
- **APM:** New Relic, Dynatrace, AppDynamics

### Database
- **Connection Pool:** HikariCP (default in Spring Boot)
- **ORM:** Hibernate/JPA
- **Caching:** Caffeine, Redis, Ehcache
- **Monitoring:** Hibernate Statistics, EXPLAIN plans

### Async Processing
- **Spring:** @Async, ThreadPoolTaskExecutor, @EnableAsync
- **Java:** CompletableFuture, ExecutorService, ForkJoinPool

### Memory Management
- **JVM:** G1GC, ZGC, Parallel GC
- **Tools:** jmap, jstat, jvisualvm, Eclipse MAT
- **Monitoring:** MemoryMXBean, GarbageCollectorMXBean

### Code Quality
- **Static Analysis:** SonarQube, Checkstyle, PMD, SpotBugs
- **Testing:** JUnit 5, Mockito, AssertJ, TestContainers
- **Build:** Maven, Gradle

---

## Best Practices

### Performance Best Practices

1. **Always Profile Before Optimizing**
   - Use profiling tools to identify bottlenecks
   - Measure before and after changes
   - Focus on highest impact areas

2. **Enable HTTP Compression**
   - Reduces response size by 70-90%
   - Configure `server.compression.enabled=true`

3. **Use Pagination**
   - Never load all records
   - Use `Page<T>` or `Slice<T>`
   - Default page size: 20-50

4. **Cache Frequently Accessed Data**
   - User sessions, configuration, reference data
   - Use appropriate TTL
   - Monitor cache hit rate

5. **Optimize Database Queries**
   - Avoid N+1 queries
   - Use indexes on frequently queried columns
   - Use DTO projections for read-only data

6. **Use CDN for Static Resources**
   - Offload static content
   - Enable browser caching
   - Version resources

7. **Implement Load Balancing**
   - Horizontal scaling
   - Session affinity if needed
   - Health checks

8. **Monitor Response Times**
   - Set SLA targets (e.g., 95th percentile < 500ms)
   - Alert on degradation
   - Track over time

9. **Lazy Load Associations**
   - Default to lazy loading
   - Use eager/fetch join selectively
   - Avoid lazy loading in loops

10. **Batch Processing**
    - Process in chunks (100-1000 records)
    - Flush and clear EntityManager
    - Configure JDBC batch size

### Database Best Practices

1. **Index Strategy**
   - Index foreign keys
   - Create composite indexes for multi-column queries
   - Monitor unused indexes

2. **Query Optimization**
   - Avoid `SELECT *`
   - Use EXISTS instead of COUNT
   - Fetch only needed columns

3. **Connection Pool Sizing**
   - Formula: `core_count * 2` for SSD
   - Small apps: 5-10, Medium: 10-20, Large: 20-50
   - Monitor active connections

4. **Connection Timeouts**
   - connection-timeout: 30s
   - idle-timeout: 10min
   - max-lifetime: 30min (less than DB timeout)

5. **Leak Detection**
   - Enable in development: 30s
   - Production: 60s or disabled
   - Monitor and fix leaks

6. **Query Caching**
   - Enable second-level cache for reference data
   - Use query cache sparingly
   - Monitor cache statistics

7. **Read Replicas**
   - Route read queries to replicas
   - Write to master only
   - Handle replication lag

8. **Database Partitioning**
   - Horizontal sharding for scalability
   - Vertical partitioning (hot vs cold data)

9. **Bulk Operations**
   - Use batch insert/update/delete
   - Configure batch size: 20-50
   - Disable validation for bulk

10. **EXPLAIN Plans**
    - Analyze slow queries
    - Check index usage
    - Look for table scans

### Async Processing Best Practices

1. **Thread Pool Sizing**
   - CPU-bound: `core_count + 1`
   - I/O-bound: `core_count * 2` to `core_count * 4`
   - Monitor and adjust

2. **Use Custom Thread Pools**
   - Separate pools for different tasks
   - Named thread pools for debugging
   - Configure rejection policy

3. **Bounded Queues**
   - Prevent memory issues
   - Typical size: 100-1000
   - Monitor queue size

4. **Exception Handling**
   - Implement AsyncUncaughtExceptionHandler
   - Try-catch in async methods
   - Log all exceptions

5. **Avoid Blocking**
   - Don't block async threads
   - Use non-blocking I/O
   - Return CompletableFuture

6. **Context Propagation**
   - Use TaskDecorator
   - Copy SecurityContext
   - Copy MDC for logging

7. **Graceful Shutdown**
   - Set waitForTasksToCompleteOnShutdown
   - Configure awaitTerminationSeconds
   - Finish in-progress tasks

8. **Monitor Metrics**
   - Active threads
   - Queue size
   - Rejection count
   - Task execution time

### Memory Management Best Practices

1. **Set Initial and Max Heap Equal**
   - `-Xms2g -Xmx2g`
   - Prevents heap resizing
   - Predictable memory usage

2. **Allocate 25-50% of System Memory**
   - Leave memory for OS and other processes
   - 4GB system: 1-2GB heap
   - 16GB system: 4-8GB heap

3. **Choose Appropriate GC**
   - G1GC: Balanced (default Java 9+)
   - ZGC: Low latency (<10ms pauses)
   - Parallel: Throughput (batch processing)

4. **Configure Metaspace**
   - Initial: 256m
   - Maximum: 512m
   - Monitor usage

5. **Enable Heap Dump on OOM**
   - `-XX:+HeapDumpOnOutOfMemoryError`
   - `-XX:HeapDumpPath=/var/log/app`
   - Analyze with Eclipse MAT

6. **Avoid Memory Leaks**
   - Close resources (try-with-resources)
   - Clean ThreadLocal
   - Use bounded caches
   - Avoid static collections

7. **Monitor Memory Usage**
   - JVM memory metrics
   - GC pause times
   - Memory pool usage
   - Metaspace usage

8. **GC Tuning**
   - G1GC: MaxGCPauseMillis=200ms
   - Enable GC logging
   - Analyze GC logs

### Code Quality Best Practices

1. **Follow SOLID Principles**
   - Single Responsibility
   - Open/Closed
   - Liskov Substitution
   - Interface Segregation
   - Dependency Inversion

2. **Write Clean Code**
   - Meaningful names
   - Small functions (<20 lines)
   - Single level of abstraction
   - DRY (Don't Repeat Yourself)

3. **Separate Layers**
   - Controller: HTTP concerns
   - Service: Business logic
   - Repository: Data access
   - DTO: External representation

4. **Test Thoroughly**
   - Unit tests: 80%+ coverage
   - Integration tests
   - Edge cases
   - Mocking external dependencies

5. **Code Reviews**
   - Check functionality, design, performance
   - Verify security
   - Ensure test coverage
   - Maintain standards

6. **Static Analysis**
   - Run SonarQube regularly
   - Fix critical issues
   - Maintain quality gate
   - Track technical debt

7. **Document Wisely**
   - Explain WHY, not WHAT
   - Self-documenting code
   - API documentation (Swagger)
   - README for each module

8. **Handle Errors Properly**
   - Specific exceptions
   - Global exception handler
   - Consistent error responses
   - Log appropriately

9. **Use DTOs**
   - Don't expose entities
   - Validate input
   - Control serialization
   - Version APIs

10. **Dependency Management**
    - Keep dependencies updated
    - Scan for CVEs
    - Minimize dependencies
    - Use BOM for version management

---

## Configuration Examples

### Development Configuration

```yaml
# application-dev.yml
spring:
  datasource:
    hikari:
      maximum-pool-size: 5
      connection-timeout: 30000
      leak-detection-threshold: 30000  # 30s for dev
  
  jpa:
    show-sql: true
    properties:
      hibernate:
        format_sql: true
        use_sql_comments: true
        generate_statistics: true

logging:
  level:
    org.hibernate.SQL: DEBUG
    org.hibernate.type.descriptor.sql.BasicBinder: TRACE
    com.zaxxer.hikari: DEBUG

management:
  endpoints:
    web:
      exposure:
        include: '*'
```

### Production Configuration

```yaml
# application-prod.yml
spring:
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 20
      connection-timeout: 30000
      idle-timeout: 600000  # 10 min
      max-lifetime: 1800000  # 30 min
      leak-detection-threshold: 60000  # 60s
  
  jpa:
    show-sql: false
    properties:
      hibernate:
        jdbc:
          batch_size: 30
        order_inserts: true
        order_updates: true
        cache:
          use_second_level_cache: true
          use_query_cache: true
          region:
            factory_class: org.hibernate.cache.jcache.JCacheRegionFactory
  
  cache:
    caffeine:
      spec: maximumSize=10000,expireAfterWrite=600s

server:
  compression:
    enabled: true
    mime-types: application/json,text/html,text/xml,text/plain,application/xml
    min-response-size: 1024

logging:
  level:
    root: INFO
    com.example: INFO
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} - %logger{36} - %msg%n"

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

### JVM Configuration (Production)

```bash
# startup.sh
java -jar \
  -Xms4g \
  -Xmx4g \
  -XX:+UseG1GC \
  -XX:MaxGCPauseMillis=200 \
  -XX:InitiatingHeapOccupancyPercent=45 \
  -XX:G1HeapRegionSize=16m \
  -XX:MetaspaceSize=256m \
  -XX:MaxMetaspaceSize=512m \
  -XX:+HeapDumpOnOutOfMemoryError \
  -XX:HeapDumpPath=/var/log/app/heapdump.hprof \
  -Xlog:gc*:file=/var/log/app/gc.log:time,uptime:filecount=5,filesize=100m \
  -Dspring.profiles.active=prod \
  app.jar
```

---

## Common Patterns

### Pattern 1: N+1 Solution with Fetch Join

```java
// Problem: N+1 queries
List<Order> orders = orderRepository.findAll();  // 1 query
for (Order order : orders) {
    order.getItems().size();  // N queries (lazy loading)
}

// Solution: Fetch Join
@Query("SELECT DISTINCT o FROM Order o JOIN FETCH o.items")
List<Order> findAllWithItems();

// Usage
List<Order> orders = orderRepository.findAllWithItems();  // 1 query
for (Order order : orders) {
    order.getItems().size();  // No additional query
}
```

### Pattern 2: Async Processing

```java
@Service
public class OrderService {
    
    @Transactional
    public Order createOrder(OrderRequest request) {
        Order order = orderRepository.save(request.toOrder());
        
        // Fire async tasks
        emailService.sendConfirmationAsync(order);
        inventoryService.updateStockAsync(order);
        analyticsService.trackOrderAsync(order);
        
        return order;
    }
}

@Service
public class EmailService {
    
    @Async("emailExecutor")
    public CompletableFuture<Void> sendConfirmationAsync(Order order) {
        // Send email
        return CompletableFuture.completedFuture(null);
    }
}
```

### Pattern 3: Memory Leak Prevention

```java
// Use try-with-resources
public List<User> getUsers() {
    try (Connection conn = dataSource.getConnection();
         Statement stmt = conn.createStatement();
         ResultSet rs = stmt.executeQuery("SELECT * FROM users")) {
        
        List<User> users = new ArrayList<>();
        while (rs.next()) {
            users.add(mapUser(rs));
        }
        return users;
    }
}

// Clean ThreadLocal
@Component
public class UserContextFilter implements Filter {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) 
            throws IOException, ServletException {
        try {
            chain.doFilter(request, response);
        } finally {
            UserContext.clear();  // Prevent leak
        }
    }
}
```

### Pattern 4: Connection Pool Monitoring

```java
@Component
public class HikariMetricsLogger {
    private final HikariDataSource dataSource;
    
    @Scheduled(fixedRate = 60000)  // Every minute
    public void logMetrics() {
        HikariPoolMXBean poolBean = dataSource.getHikariPoolMXBean();
        
        log.info("HikariCP Metrics - Active: {}, Idle: {}, Total: {}, Waiting: {}",
            poolBean.getActiveConnections(),
            poolBean.getIdleConnections(),
            poolBean.getTotalConnections(),
            poolBean.getThreadsAwaitingConnection()
        );
    }
}
```

---

## Interview Questions

### Performance & Database (15 Questions)

**Q1: What tools profile Spring Boot apps?**
**A:** VisualVM, JProfiler, Java Mission Control, Spring Boot Actuator.

**Q2: How to enable HTTP compression?**
**A:** `server.compression.enabled=true` in application.yml.

**Q3: What is N+1 query problem?**
**A:** 1 query for parents, N queries for children. Solved with fetch join.

**Q4: How to solve N+1?**
**A:** Fetch join, entity graph, @BatchSize, DTO projection, subselect.

**Q5: What is HikariCP?**
**A:** Connection pool, default in Spring Boot, fastest Java pool.

**Q6: How to size connection pool?**
**A:** Formula: `core_count * 2` for SSD. Small: 5-10, Large: 20-50.

**Q7: What is leak-detection-threshold?**
**A:** Logs warning if connection held longer. Dev: 30s, Prod: 60s.

**Q8: Benefits of pagination?**
**A:** Reduces memory, faster queries, better UX. Use Page<T>.

**Q9: When to use caching?**
**A:** Frequently accessed, rarely changed data. Users, config, reference data.

**Q10: Difference between Page and Slice?**
**A:** Page has total count (slower), Slice doesn't (faster).

**Q11: How to create composite index?**
**A:** `@Index(name="idx_name", columnList="col1, col2")`.

**Q12: What is second-level cache?**
**A:** Entity-level cache in Hibernate. Configure with @Cacheable.

**Q13: How to monitor HikariCP?**
**A:** HikariPoolMXBean metrics: active, idle, total, waiting threads.

**Q14: What is DTO projection?**
**A:** Query only needed fields into DTO, not full entity. Faster, less memory.

**Q15: Lazy vs eager loading?**
**A:** Lazy: load on access. Eager: load immediately. Default lazy, use eager selectively.

### Async & Threading (15 Questions)

**Q16: What is @Async?**
**A:** Executes method asynchronously in separate thread.

**Q17: How to enable @Async?**
**A:** Add @EnableAsync to configuration class.

**Q18: What is CompletableFuture?**
**A:** Async computation result, supports composition and callbacks.

**Q19: How to size thread pool?**
**A:** CPU-bound: core_count+1. I/O-bound: core_count*2 to core_count*4.

**Q20: What is rejection policy?**
**A:** Handles tasks when queue full. AbortPolicy, CallerRunsPolicy, DiscardPolicy.

**Q21: What is CallerRunsPolicy?**
**A:** Runs task in caller thread when queue full. Provides backpressure.

**Q22: Bounded vs unbounded queue?**
**A:** Bounded: fixed size, prevents OOM. Unbounded: grows infinitely, risky.

**Q23: How to handle async exceptions?**
**A:** AsyncUncaughtExceptionHandler, try-catch in method, CompletableFuture.exceptionally().

**Q24: What is TaskDecorator?**
**A:** Wraps tasks to copy context (security, MDC) to new thread.

**Q25: How to configure custom executor?**
**A:** Create ThreadPoolTaskExecutor bean with core/max pool size, queue capacity.

**Q26: What is @Scheduled?**
**A:** Runs method periodically. Use with @EnableScheduling.

**Q27: fixedRate vs fixedDelay?**
**A:** fixedRate: fixed interval from start. fixedDelay: fixed delay after completion.

**Q28: How to monitor thread pool?**
**A:** Micrometer ExecutorServiceMetrics, ThreadPoolMXBean, custom logging.

**Q29: What is graceful shutdown?**
**A:** Finish in-progress tasks before shutdown. Set waitForTasksToCompleteOnShutdown.

**Q30: When to use async?**
**A:** Long-running tasks, I/O operations, parallel processing, non-blocking operations.

### Memory & GC (15 Questions)

**Q31: What is JVM heap?**
**A:** Memory for object allocation. Young Generation + Old Generation.

**Q32: What is Young Generation?**
**A:** Eden + Survivor0 + Survivor1. New objects allocated in Eden.

**Q33: What is Metaspace?**
**A:** Non-heap memory for class metadata. Replaced PermGen in Java 8.

**Q34: How to configure heap?**
**A:** -Xms (initial), -Xmx (maximum). Set equal in production.

**Q35: How much heap to allocate?**
**A:** 25-50% of system memory. Leave for OS and other processes.

**Q36: What is G1GC?**
**A:** Garbage-First GC. Balanced, default Java 9+. Target pause time.

**Q37: What is ZGC?**
**A:** Low-latency GC. Pauses < 10ms. Large heaps (multi-TB).

**Q38: How to enable GC logging?**
**A:** Java 9+: `-Xlog:gc*:file=gc.log`. Java 8: `-Xloggc:gc.log`.

**Q39: What is heap dump?**
**A:** Snapshot of heap memory. Analyze with Eclipse MAT.

**Q40: How to trigger heap dump on OOM?**
**A:** `-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/path`.

**Q41: Common memory leak causes?**
**A:** Static collections, unclosed resources, ThreadLocal, listeners not removed.

**Q42: How to detect memory leaks?**
**A:** Monitor heap usage over time, analyze heap dumps, check GC logs.

**Q43: What is ThreadLocal leak?**
**A:** ThreadLocal not cleared in thread pools. Always call remove().

**Q44: How to prevent resource leaks?**
**A:** Use try-with-resources for auto-close. Always close connections.

**Q45: How to monitor memory?**
**A:** MemoryMXBean, GarbageCollectorMXBean, Actuator metrics, profiling tools.

### Code Quality & Patterns (15 Questions)

**Q46: What is SOLID?**
**A:** Five principles: SRP, OCP, LSP, ISP, DIP.

**Q47: What is SRP?**
**A:** Single Responsibility Principle. Class has one reason to change.

**Q48: What is DIP?**
**A:** Dependency Inversion. Depend on abstractions, not concretions.

**Q49: What is Singleton pattern?**
**A:** Single instance of class. Spring beans are singleton by default.

**Q50: What is Factory pattern?**
**A:** Creates objects without specifying exact class.

**Q51: What is Strategy pattern?**
**A:** Family of interchangeable algorithms. Select at runtime.

**Q52: What is Observer pattern?**
**A:** Notifies multiple objects about state changes. Spring events.

**Q53: What is Facade pattern?**
**A:** Simplified interface to complex subsystem. Service layer.

**Q54: What is Proxy pattern?**
**A:** Placeholder for another object. @Transactional creates proxy.

**Q55: What is Template Method?**
**A:** Skeleton of algorithm. Subclasses override steps. JdbcTemplate.

**Q56: What is Repository pattern?**
**A:** Abstraction over data access. JpaRepository.

**Q57: What is DTO pattern?**
**A:** Data Transfer Object. External representation, hides internals.

**Q58: What is good code coverage?**
**A:** 80%+ for critical code, 100% for business logic.

**Q59: What is SonarQube?**
**A:** Static code analysis for quality and security.

**Q60: Benefits of code review?**
**A:** Find bugs, share knowledge, maintain quality, enforce standards.

---

## Learning Path

### 1. Beginner Level (Week 1-2)
**Focus:** Basic performance concepts and database optimization

**Topics:**
- Application performance profiling
- HTTP compression and caching
- Database indexing basics
- HikariCP configuration
- Pagination

**Hands-on:**
- Profile application with VisualVM
- Enable HTTP compression
- Create database indexes
- Configure HikariCP
- Implement pagination

### 2. Intermediate Level (Week 3-4)
**Focus:** Advanced optimization and async processing

**Topics:**
- N+1 query problem and solutions
- Connection pool tuning
- Async processing with @Async
- Thread pool configuration
- Caching strategies

**Hands-on:**
- Detect and fix N+1 queries
- Optimize connection pool
- Implement async methods
- Configure custom thread pools
- Setup Redis caching

### 3. Advanced Level (Week 5-6)
**Focus:** Memory management and production optimization

**Topics:**
- JVM memory configuration
- Garbage collection tuning
- Memory leak detection
- Common pitfalls
- Production monitoring

**Hands-on:**
- Configure JVM parameters
- Analyze heap dumps
- Detect memory leaks
- Setup monitoring dashboards
- Load testing

### 4. Expert Level (Week 7-8)
**Focus:** Code quality and design patterns

**Topics:**
- SOLID principles
- Clean code practices
- Design patterns
- Static code analysis
- Performance testing

**Hands-on:**
- Refactor code with SOLID
- Implement design patterns
- Setup SonarQube
- Write comprehensive tests
- Performance benchmarking

---

## Tools & Resources

### Profiling Tools
- **VisualVM:** Free, bundled with JDK, CPU/memory profiling
- **JProfiler:** Commercial, advanced features, heap walker
- **Java Mission Control:** Free, low overhead, production profiling
- **YourKit:** Commercial, CPU/memory/thread profiling

### Monitoring Tools
- **Spring Boot Actuator:** Built-in metrics and health checks
- **Micrometer:** Metrics facade, supports Prometheus, Graphite
- **Prometheus + Grafana:** Metrics collection and visualization
- **New Relic, Dynatrace, AppDynamics:** Commercial APM solutions

### Database Tools
- **EXPLAIN plans:** Analyze query execution
- **pgAdmin, MySQL Workbench:** Database management
- **DBeaver:** Universal database tool
- **Flyway, Liquibase:** Database migrations

### Code Quality Tools
- **SonarQube:** Code quality and security
- **Checkstyle:** Coding standards
- **PMD:** Source code analyzer
- **SpotBugs:** Bug detector
- **JaCoCo:** Code coverage

### Testing Tools
- **JUnit 5:** Unit testing framework
- **Mockito:** Mocking framework
- **AssertJ:** Fluent assertions
- **TestContainers:** Integration testing with Docker
- **JMeter, Gatling:** Load testing

### Documentation
- **Spring Boot Docs:** https://spring.io/projects/spring-boot
- **Hibernate Docs:** https://hibernate.org/orm/documentation/
- **HikariCP:** https://github.com/brettwooldridge/HikariCP
- **Baeldung:** https://www.baeldung.com/
- **Java Performance:** https://www.oracle.com/java/technologies/javase-performance.html

---

## Summary

Performance optimization is critical for production-ready Spring Boot applications. Key areas: application performance (profiling, caching, compression, pagination), database optimization (indexing, N+1 solutions, HikariCP tuning, query optimization), async processing (@Async, thread pools, CompletableFuture), memory management (JVM configuration, GC tuning, leak prevention). Best practices: profile before optimizing, measure impact, use appropriate caching, implement pagination, avoid common pitfalls (N+1, missing indexes, resource leaks, god classes). Code quality: follow SOLID principles, write clean code, comprehensive testing, static analysis, code reviews. Design patterns: understand and apply creational, structural, behavioral patterns in Spring context. Monitor continuously with Actuator, Micrometer, Prometheus. Configure properly for development vs production. Essential skills for building scalable, maintainable, high-performance applications.

---

## Next Module

**Folder 20: Interview Questions** - Comprehensive collection of Spring Boot interview questions covering all topics from fundamentals to advanced concepts, real-world scenarios, coding challenges, system design questions.

---

**Module Completed!** 🎉

You now have comprehensive knowledge of performance optimization and best practices for Spring Boot applications. Practice implementing these concepts in real projects, monitor performance metrics, and continuously improve your applications.

---
