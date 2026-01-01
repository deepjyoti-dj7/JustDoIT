# 📖 Database Integration - Complete Reference

## 📚 Module Overview

This module covers **complete database integration** in Spring Boot, from basic connectivity to advanced performance optimization.

### Topics Covered

| # | Topic | Key Concepts | Lines |
|---|-------|-------------|-------|
| 01 | [Database Connectivity Basics](01.%20Database%20Connectivity%20Basics.md) | JDBC, DataSource, HikariCP, Multi-DataSource | ~1,200 |
| 02 | [JDBC Template](02.%20JDBC%20Template.md) | CRUD, RowMapper, Batch Operations, Named Parameters | ~1,300 |
| 03 | [Spring Data JDBC](03.%20Spring%20Data%20JDBC.md) | Repository, Entity Mapping, Aggregate Design | ~1,200 |
| 04 | [Transaction Management](04.%20Transaction%20Management.md) | @Transactional, Propagation, Isolation, Rollback | ~1,400 |
| 05 | [Database Migrations](05.%20Database%20Migrations%20(Flyway%20&%20Liquibase).md) | Flyway, Liquibase, Versioning, Deployment | ~1,400 |
| 06 | [Connection Pooling](06.%20Database%20Connection%20Pooling.md) | HikariCP Tuning, Monitoring, Leak Detection | ~1,300 |
| 07 | [NoSQL Databases](07.%20NoSQL%20Databases%20(MongoDB,%20Redis).md) | MongoDB, Redis, Caching, Document DB | ~1,400 |
| 08 | [Performance Optimization](08.%20Database%20Performance%20Optimization.md) | Indexing, N+1, Caching, Batch Operations | ~1,300 |

**Total:** ~10,500 lines of comprehensive database integration content

---

## 🎯 Learning Path

### Beginner Level (Days 1-3)
1. **Database Connectivity Basics** - Understanding JDBC, DataSource, connection pooling fundamentals
2. **JDBC Template** - Simplified database operations with Spring's template pattern
3. **Spring Data JDBC** - Repository-based data access with aggregate design

### Intermediate Level (Days 4-6)
4. **Transaction Management** - ACID properties, propagation levels, isolation
5. **Database Migrations** - Flyway and Liquibase for version-controlled schema changes
6. **Connection Pooling** - HikariCP optimization, monitoring, troubleshooting

### Advanced Level (Days 7-8)
7. **NoSQL Databases** - MongoDB document storage, Redis caching strategies
8. **Performance Optimization** - Indexing, query optimization, N+1 solutions

---

## ⚡ Quick Start Guide

### 1. Basic Database Setup

```properties
# application.properties

# DataSource Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/mydb
spring.datasource.username=root
spring.datasource.password=password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# HikariCP Pool
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5

# JPA Configuration
spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

### 2. Entity & Repository

```java
// Entity
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    
    @Column(unique = true)
    private String email;
    
    // Getters, setters, constructors
}

// Repository
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByNameContaining(String keyword);
}

// Service
@Service
@Transactional
public class UserService {
    @Autowired
    private UserRepository userRepository;
    
    public User createUser(User user) {
        return userRepository.save(user);
    }
    
    @Transactional(readOnly = true)
    public List<User> findAll() {
        return userRepository.findAll();
    }
}
```

### 3. Database Migrations with Flyway

```properties
# Enable Flyway
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration
```

```sql
-- V1__Create_users_table.sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_email ON users(email);
```

---

## 🔄 Database Comparison

### SQL vs NoSQL

| Feature | SQL (MySQL, PostgreSQL) | NoSQL (MongoDB, Redis) |
|---------|------------------------|------------------------|
| **Schema** | Fixed, structured | Flexible, schema-less |
| **Scalability** | Vertical (scale up) | Horizontal (scale out) |
| **Transactions** | ACID, strong consistency | BASE, eventual consistency |
| **Query Language** | SQL (standardized) | Database-specific |
| **Use Case** | Structured data, complex queries | Flexible data, simple queries |
| **Joins** | Native support | Limited/no support |
| **Example** | Banking, e-commerce | Social media, caching |

### Database Selection Guide

```
Choose SQL (JPA/JDBC) when:
✅ Complex relationships (1-to-many, many-to-many)
✅ ACID transactions required
✅ Strong consistency needed
✅ Complex queries and joins
✅ Established schema

Choose MongoDB when:
✅ Schema changes frequently
✅ JSON/document-based data
✅ Flexible data model
✅ Horizontal scaling needed
✅ Read-heavy workloads

Choose Redis when:
✅ Caching layer needed
✅ Session storage
✅ Real-time analytics
✅ Leaderboards, counters
✅ Pub/Sub messaging
```

---

## 🔧 Connection Pooling Configuration

### HikariCP (Default in Spring Boot)

```properties
# Pool Size (Formula: (core_count * 2) + disk_count)
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5

# Timeouts
spring.datasource.hikari.connection-timeout=30000
spring.datasource.hikari.idle-timeout=600000
spring.datasource.hikari.max-lifetime=1800000

# Leak Detection (dev only)
spring.datasource.hikari.leak-detection-threshold=60000

# MySQL Optimizations
spring.datasource.hikari.data-source-properties.cachePrepStmts=true
spring.datasource.hikari.data-source-properties.prepStmtCacheSize=250
spring.datasource.hikari.data-source-properties.useServerPrepStmts=true
```

### Monitoring HikariCP

```java
@Component
public class PoolMonitor {
    @Autowired
    private DataSource dataSource;
    
    @Scheduled(fixedRate = 60000)
    public void logPoolStats() {
        HikariPoolMXBean pool = ((HikariDataSource) dataSource).getHikariPoolMXBean();
        log.info("Active: {}, Idle: {}, Total: {}", 
            pool.getActiveConnections(),
            pool.getIdleConnections(),
            pool.getTotalConnections());
    }
}
```

---

## 💾 Transaction Management

### Propagation Levels

| Propagation | Behavior | Use Case |
|-------------|----------|----------|
| **REQUIRED** (default) | Join existing or create new | Most operations |
| **REQUIRES_NEW** | Always create new, suspend current | Audit logging |
| **NESTED** | Create savepoint | Partial rollback scenarios |
| **SUPPORTS** | Join if exists, else non-transactional | Read operations |
| **NOT_SUPPORTED** | Suspend current, run non-transactionally | File I/O |
| **MANDATORY** | Must have existing transaction | Strict transaction enforcement |
| **NEVER** | Throw exception if transaction exists | Non-transactional operations |

### Isolation Levels

| Isolation | Dirty Read | Non-Repeatable Read | Phantom Read | Performance |
|-----------|------------|---------------------|--------------|-------------|
| **READ_UNCOMMITTED** | ✅ | ✅ | ✅ | ⭐⭐⭐⭐⭐ |
| **READ_COMMITTED** | ❌ | ✅ | ✅ | ⭐⭐⭐⭐ |
| **REPEATABLE_READ** | ❌ | ❌ | ✅ | ⭐⭐⭐ |
| **SERIALIZABLE** | ❌ | ❌ | ❌ | ⭐ |

### Transaction Examples

```java
// Basic transaction
@Transactional
public Order createOrder(OrderRequest request) {
    Order order = orderRepository.save(new Order());
    paymentService.charge(request.getPayment());
    return order;
}

// Read-only optimization
@Transactional(readOnly = true)
public List<User> findAll() {
    return userRepository.findAll();
}

// Rollback on checked exceptions
@Transactional(rollbackFor = Exception.class)
public void processPayment(Payment payment) throws PaymentException {
    // ...
}

// Independent transaction (audit logging)
@Transactional(propagation = Propagation.REQUIRES_NEW)
public void logAudit(String message) {
    auditRepository.save(new AuditLog(message));
}
```

---

## 📊 Database Migrations

### Flyway vs Liquibase

| Feature | Flyway | Liquibase |
|---------|--------|-----------|
| **Format** | SQL only | XML, YAML, JSON, SQL |
| **Learning Curve** | ⭐⭐ Easy | ⭐⭐⭐⭐ Moderate |
| **Rollback** | ❌ Pro only | ✅ Free |
| **Preconditions** | ❌ Limited | ✅ Extensive |
| **Best For** | Simple migrations | Complex migrations |

### Flyway Example

```sql
-- V1__Create_users_table.sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL
);

-- V2__Add_created_date.sql
ALTER TABLE users ADD COLUMN created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- V3__Create_orders_table.sql
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Liquibase Example

```xml
<!-- 001-create-users.xml -->
<changeSet id="1" author="john">
    <createTable tableName="users">
        <column name="id" type="BIGINT" autoIncrement="true">
            <constraints primaryKey="true"/>
        </column>
        <column name="username" type="VARCHAR(100)">
            <constraints nullable="false" unique="true"/>
        </column>
    </createTable>
</changeSet>
```

---

## ⚡ Performance Optimization

### Indexing Strategy

```java
// Single column index
@Entity
@Table(indexes = @Index(name = "idx_email", columnList = "email"))
public class User {
    @Column(unique = true)
    private String email;
}

// Composite index
@Entity
@Table(indexes = @Index(name = "idx_user_status", columnList = "user_id, status"))
public class Order {
    private Long userId;
    private String status;
}
```

### N+1 Problem Solutions

```java
// ❌ Bad - N+1 queries
List<User> users = userRepository.findAll(); // 1 query
for (User user : users) {
    user.getOrders().size(); // N queries
}

// ✅ Good - Single query with JOIN FETCH
@Query("SELECT u FROM User u JOIN FETCH u.orders")
List<User> findAllWithOrders();

// ✅ Good - @EntityGraph
@EntityGraph(attributePaths = {"orders"})
List<User> findAll();

// ✅ Good - Batch fetching
@Entity
public class User {
    @OneToMany(mappedBy = "user")
    @BatchSize(size = 10)
    private List<Order> orders;
}
```

### Caching with Redis

```java
@Service
public class ProductService {
    
    @Cacheable(value = "products", key = "#id")
    public Product findById(Long id) {
        return productRepository.findById(id).orElse(null);
    }
    
    @CacheEvict(value = "products", key = "#id")
    public void delete(Long id) {
        productRepository.deleteById(id);
    }
}
```

---

## 🎤 Interview Questions

### Database Connectivity

**Q: What is DataSource?**  
A: Interface representing a connection factory, manages database connections and pooling.

**Q: Why use connection pooling?**  
A: Reuses connections (1-5ms) instead of creating new ones (100-200ms), 10-100x performance improvement.

**Q: HikariCP vs Tomcat JDBC?**  
A: HikariCP is faster (1-2ms vs 2-3ms), smaller (130KB vs 400KB), zero dependencies, default in Spring Boot.

### JDBC Template

**Q: Benefits of JdbcTemplate?**  
A: Eliminates boilerplate, automatic resource management, exception translation, 80% less code.

**Q: What is RowMapper?**  
A: Interface for mapping ResultSet rows to objects, converts database rows to Java entities.

**Q: When to use NamedParameterJdbcTemplate?**  
A: For named parameters (:name) instead of positional (?), improves readability.

### Transactions

**Q: Default @Transactional rollback behavior?**  
A: Rolls back on RuntimeException and Error, does NOT rollback on checked exceptions.

**Q: REQUIRED vs REQUIRES_NEW propagation?**  
A: REQUIRED joins existing transaction or creates new. REQUIRES_NEW always creates new, suspends current.

**Q: When to use readOnly=true?**  
A: For queries, enables performance optimizations (no dirty checking, potential database optimizations).

### Database Migrations

**Q: Why use database migrations?**  
A: Version control for schema, repeatable across environments, rollback capability, team collaboration.

**Q: Can you modify executed Flyway migration?**  
A: No, checksum validation fails. Create new migration instead.

**Q: Flyway vs Liquibase?**  
A: Flyway: simpler, SQL-only, no free rollback. Liquibase: complex, multiple formats, free rollback.

### Performance

**Q: What is the N+1 problem?**  
A: 1 query fetches N entities, then N additional queries fetch related data (1 + N total).

**Q: How to solve N+1?**  
A: Use JOIN FETCH, @EntityGraph, batch fetching, or DTO projections.

**Q: Optimal connection pool size?**  
A: Formula: (core_count * 2) + disk_count. Example: 4 cores + 1 disk = 9 connections.

**Q: When to create database index?**  
A: On columns used in WHERE, JOIN, ORDER BY clauses, and frequently queried fields.

### NoSQL

**Q: MongoDB vs MySQL?**  
A: MongoDB: flexible schema, document-based, horizontal scaling. MySQL: fixed schema, ACID, relational.

**Q: When to use Redis?**  
A: Caching, session storage, leaderboards, rate limiting, pub/sub messaging.

**Q: What is @Cacheable?**  
A: Spring annotation that caches method result, skips execution if cached value exists.

---

## 📚 Code Examples

### Complete CRUD with JPA

```java
// Entity
@Entity
@Table(name = "products", indexes = {
    @Index(name = "idx_name", columnList = "name"),
    @Index(name = "idx_category", columnList = "category")
})
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String category;
    private BigDecimal price;
    
    @CreatedDate
    private LocalDateTime createdDate;
    
    @LastModifiedDate
    private LocalDateTime updatedDate;
}

// Repository
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(String category);
    
    @Query("SELECT p FROM Product p WHERE p.price BETWEEN :min AND :max")
    List<Product> findByPriceRange(@Param("min") BigDecimal min, 
                                   @Param("max") BigDecimal max);
    
    Page<Product> findByNameContaining(String keyword, Pageable pageable);
}

// Service
@Service
@Transactional
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    public Product create(Product product) {
        return productRepository.save(product);
    }
    
    @Transactional(readOnly = true)
    @Cacheable(value = "products", key = "#id")
    public Product findById(Long id) {
        return productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }
    
    @Transactional(readOnly = true)
    public Page<Product> search(String keyword, int page, int size) {
        return productRepository.findByNameContaining(
            keyword, 
            PageRequest.of(page, size, Sort.by("name"))
        );
    }
    
    @CachePut(value = "products", key = "#product.id")
    public Product update(Product product) {
        return productRepository.save(product);
    }
    
    @CacheEvict(value = "products", key = "#id")
    public void delete(Long id) {
        productRepository.deleteById(id);
    }
}
```

### Multiple DataSources

```java
// Primary DataSource
@Configuration
public class PrimaryDataSourceConfig {
    
    @Bean
    @Primary
    @ConfigurationProperties("spring.datasource.primary")
    public DataSourceProperties primaryDataSourceProperties() {
        return new DataSourceProperties();
    }
    
    @Bean
    @Primary
    public DataSource primaryDataSource() {
        return primaryDataSourceProperties()
            .initializeDataSourceBuilder()
            .type(HikariDataSource.class)
            .build();
    }
    
    @Bean
    @Primary
    public JdbcTemplate primaryJdbcTemplate(@Qualifier("primaryDataSource") DataSource ds) {
        return new JdbcTemplate(ds);
    }
}

// Secondary DataSource
@Configuration
public class SecondaryDataSourceConfig {
    
    @Bean
    @ConfigurationProperties("spring.datasource.secondary")
    public DataSourceProperties secondaryDataSourceProperties() {
        return new DataSourceProperties();
    }
    
    @Bean
    public DataSource secondaryDataSource() {
        return secondaryDataSourceProperties()
            .initializeDataSourceBuilder()
            .type(HikariDataSource.class)
            .build();
    }
    
    @Bean
    public JdbcTemplate secondaryJdbcTemplate(@Qualifier("secondaryDataSource") DataSource ds) {
        return new JdbcTemplate(ds);
    }
}
```

### MongoDB Integration

```java
// Document
@Document(collection = "users")
public class User {
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String email;
    
    private String name;
    
    @Field("phone_number")
    private String phoneNumber;
    
    private Address address; // Embedded
    
    @CreatedDate
    private LocalDateTime createdDate;
}

// Repository
@Repository
public interface UserRepository extends MongoRepository<User, String> {
    List<User> findByName(String name);
    
    @Query("{ 'address.city': ?0 }")
    List<User> findByCity(String city);
}

// Service
@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private MongoTemplate mongoTemplate;
    
    public User create(User user) {
        return userRepository.save(user);
    }
    
    public List<User> searchByName(String keyword) {
        Query query = new Query();
        query.addCriteria(Criteria.where("name").regex(keyword, "i"));
        return mongoTemplate.find(query, User.class);
    }
}
```

---

## 🎯 Best Practices Summary

### Configuration
✅ Use HikariCP (default)  
✅ Set appropriate pool size: `(core_count * 2) + disk_count`  
✅ Configure timeouts (connection, idle, max-lifetime)  
✅ Enable leak detection in development  
✅ Externalize database credentials

### Development
✅ Use Spring Data repositories  
✅ Apply @Transactional on service methods  
✅ Use readOnly=true for queries  
✅ Implement database migrations (Flyway/Liquibase)  
✅ Never modify executed migrations

### Performance
✅ Create indexes on frequently queried columns  
✅ Solve N+1 problems with JOIN FETCH  
✅ Use projections for read-only queries  
✅ Enable caching for frequently accessed data  
✅ Use batch operations for bulk inserts/updates  
✅ Monitor slow queries with EXPLAIN

### Production
✅ Disable DDL auto (use migrations)  
✅ Monitor connection pool metrics  
✅ Set max-lifetime < database timeout  
✅ Backup before migrations  
✅ Use environment-specific configurations  
✅ Enable query logging in staging only

---

## 📖 Additional Resources

### Official Documentation
- [Spring Data JPA Reference](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/)
- [HikariCP Documentation](https://github.com/brettwooldridge/HikariCP)
- [Flyway Documentation](https://flywaydb.org/documentation/)
- [Liquibase Documentation](https://docs.liquibase.com/)
- [MongoDB Spring Boot](https://docs.spring.io/spring-data/mongodb/docs/current/reference/html/)
- [Redis Spring Boot](https://docs.spring.io/spring-data/redis/docs/current/reference/html/)

### Performance Tools
- **EXPLAIN** - Analyze query execution plans
- **Spring Boot Actuator** - Monitor connection pools, caches
- **Hibernate Statistics** - Track queries, cache hits
- **JProfiler/VisualVM** - Profile application performance

---

## ✅ Module Completion Checklist

- [ ] Understand JDBC, DataSource, and connection pooling
- [ ] Master JdbcTemplate for simplified database operations
- [ ] Use Spring Data repositories for CRUD operations
- [ ] Implement transaction management with @Transactional
- [ ] Set up database migrations with Flyway or Liquibase
- [ ] Optimize HikariCP configuration and monitor pool
- [ ] Integrate MongoDB for document storage
- [ ] Implement Redis caching strategies
- [ ] Create indexes and optimize queries
- [ ] Solve N+1 problems
- [ ] Apply batch operations for bulk data
- [ ] Configure multi-datasource applications

---

## 🎓 Next Steps

After completing this module:
1. **Spring Security** - Secure your database with authentication/authorization
2. **Exception Handling** - Handle database errors gracefully
3. **Spring Boot Testing** - Test repository and service layers
4. **Microservices** - Distributed database patterns

---

**Database Integration Complete!** 🎉

Master these concepts to build high-performance, scalable Spring Boot applications with robust database integration.

