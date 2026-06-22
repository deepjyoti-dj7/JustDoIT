---
title: Data Layer
description: Spring Data JPA entities, relationships, repositories, pagination, @Transactional, N+1 avoidance, Spring Cache, JpaSpecificationExecutor, custom repositories, HikariCP, and Flyway.
---

# Data Layer

Spring Data JPA wraps Hibernate and turns interface declarations into fully implemented data access objects. This page covers everything from entity mapping to dynamic queries, caching, and connection pool tuning.

---

## Entities and Relationships

```java
@Entity
@Table(name = "orders",
       indexes = { @Index(name = "idx_orders_customer", columnList = "customer_id") },
       uniqueConstraints = { @UniqueConstraint(name = "uk_orders_ref", columnNames = "reference_number") })
@EntityListeners(AuditingEntityListener.class)
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "customer_id", nullable = false)
    private UUID customerId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    @Column(precision = 12, scale = 2, nullable = false)
    private BigDecimal total;

    // One-to-many: Order has many Items
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL,
               orphanRemoval = true, fetch = FetchType.LAZY)
    private List<OrderItem> items = new ArrayList<>();

    // Many-to-one: Order belongs to Customer
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", insertable = false, updatable = false)
    private Customer customer;

    // One-to-one: Order has one ShippingAddress
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "shipping_address_id")
    private ShippingAddress shippingAddress;

    @CreatedDate  @Column(updatable = false) private Instant createdAt;
    @LastModifiedDate private Instant updatedAt;
    @Version private Long version;  // optimistic locking

    // Helper methods maintain bidirectional relationship consistency
    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }
    public void removeItem(OrderItem item) {
        items.remove(item);
        item.setOrder(null);
    }
}
```

### Many-to-many

```java
@Entity
public class Product {
    @ManyToMany
    @JoinTable(
        name = "product_tags",
        joinColumns = @JoinColumn(name = "product_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tag> tags = new HashSet<>();
}
```

### Embedded objects (`@Embeddable`)

```java
@Embeddable
public class Address {
    private String street;
    private String city;
    @Column(name = "zip_code")
    private String zipCode;
}

@Entity
public class Customer {
    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "zipCode", column = @Column(name = "billing_zip"))
    })
    private Address billingAddress;

    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "zipCode", column = @Column(name = "shipping_zip"))
    })
    private Address shippingAddress;
}
```

### Inheritance

```java
// SINGLE_TABLE (default): all subclasses in one table, discriminator column
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "payment_type")
public abstract class Payment { @Id UUID id; BigDecimal amount; }

@Entity @DiscriminatorValue("CREDIT_CARD")
public class CreditCardPayment extends Payment { String last4; }

@Entity @DiscriminatorValue("BANK_TRANSFER")
public class BankTransfer extends Payment { String iban; }

// JOINED: each class has its own table, joined on id
@Entity @Inheritance(strategy = InheritanceType.JOINED)
public abstract class Vehicle { }
```

---

## Repositories

```java
public interface OrderRepository extends JpaRepository<Order, UUID> {

    // Derived query methods
    List<Order> findByCustomerId(UUID customerId);
    Optional<Order> findByCustomerIdAndStatus(UUID cid, OrderStatus status);
    long countByStatus(OrderStatus status);
    boolean existsByCustomerIdAndStatus(UUID cid, OrderStatus status);
    void deleteByCustomerIdAndStatus(UUID cid, OrderStatus status);

    // Pagination and sorting
    Page<Order>  findByStatus(OrderStatus status, Pageable pageable);
    Slice<Order> findByCustomerId(UUID customerId, Pageable pageable); // no COUNT query

    // JPQL — entity-based, not table-based
    @Query("SELECT o FROM Order o WHERE o.createdAt >= :since AND o.total > :min")
    List<Order> findHighValueRecent(@Param("since") Instant since,
                                    @Param("min") BigDecimal min);

    // JOIN FETCH — solve N+1 inline
    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.items i " +
           "LEFT JOIN FETCH i.product WHERE o.customerId = :cid")
    List<Order> findWithItemsByCustomer(@Param("cid") UUID customerId);

    // EntityGraph alternative
    @EntityGraph(attributePaths = {"items", "items.product"})
    @Query("SELECT o FROM Order o WHERE o.customerId = :cid")
    List<Order> findWithItemsGraph(@Param("cid") UUID customerId);

    // Projection — select only needed fields
    @Query("SELECT o.id AS id, o.status AS status, o.total AS total FROM Order o")
    List<OrderSummary> findAllSummaries();

    // Native SQL
    @Query(value = "SELECT * FROM orders WHERE EXTRACT(MONTH FROM created_at) = :month",
           nativeQuery = true)
    List<Order> findByMonth(@Param("month") int month);

    // Modifying query — use clearAutomatically to refresh 1st-level cache
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE Order o SET o.status = :status WHERE o.id IN :ids")
    int bulkUpdateStatus(@Param("ids") List<UUID> ids, @Param("status") OrderStatus status);

    // Pessimistic locking
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT o FROM Order o WHERE o.id = :id")
    Optional<Order> findByIdForUpdate(@Param("id") UUID id);
}

public interface OrderSummary {
    UUID getId(); OrderStatus getStatus(); BigDecimal getTotal();
}
```

---

## Pagination and Sorting

```java
@GetMapping
public Page<OrderResponse> list(
        @RequestParam(defaultValue = "0")  int page,
        @RequestParam(defaultValue = "20") int size,
        @RequestParam(defaultValue = "createdAt") String sortBy,
        @RequestParam(defaultValue = "DESC") String dir) {

    Sort sort = Sort.by(Sort.Direction.fromString(dir), sortBy);
    Pageable pageable = PageRequest.of(page, size, sort);

    return orderRepo.findByStatus(OrderStatus.CONFIRMED, pageable)
                    .map(OrderResponse::from);
}
// Page response: content[], totalElements, totalPages, number, size, first, last
// Slice: content[], hasNext(), hasPrevious() — no expensive COUNT query
```

---

## Dynamic Queries with JpaSpecificationExecutor

```java
public interface OrderRepository extends JpaRepository<Order, UUID>,
                                          JpaSpecificationExecutor<Order> {}

// Specification = a predicate against the JPA Criteria API
public class OrderSpecs {
    public static Specification<Order> hasCustomer(UUID id) {
        return (root, query, cb) -> cb.equal(root.get("customerId"), id);
    }
    public static Specification<Order> hasStatus(OrderStatus status) {
        return (root, query, cb) -> cb.equal(root.get("status"), status);
    }
    public static Specification<Order> createdAfter(Instant since) {
        return (root, query, cb) -> cb.greaterThan(root.get("createdAt"), since);
    }
    public static Specification<Order> totalAbove(BigDecimal min) {
        return (root, query, cb) -> cb.gt(root.get("total"), min);
    }
}

// Build dynamically
Specification<Order> spec = Specification.where(null);
if (customerId != null) spec = spec.and(hasCustomer(customerId));
if (status != null)     spec = spec.and(hasStatus(status));
if (since != null)      spec = spec.and(createdAfter(since));

List<Order> results = orderRepo.findAll(spec, Sort.by("createdAt").descending());
```

---

## Custom Repository Implementation

```java
// Step 1: custom fragment interface
public interface OrderRepositoryCustom {
    List<Order> findOrdersWithComplexFilter(OrderFilter filter);
}

// Step 2: implementation (Spring finds this by naming convention: {RepositoryName}Impl)
@Repository
public class OrderRepositoryImpl implements OrderRepositoryCustom {
    @PersistenceContext EntityManager em;

    @Override
    public List<Order> findOrdersWithComplexFilter(OrderFilter filter) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Order> q = cb.createQuery(Order.class);
        Root<Order> root = q.from(Order.class);
        // build predicates...
        return em.createQuery(q).getResultList();
    }
}

// Step 3: main repository extends both
public interface OrderRepository extends JpaRepository<Order, UUID>,
                                          OrderRepositoryCustom { }
```

---

## `@Transactional`

```java
@Service
@Transactional(readOnly = true)  // default for all methods: read-only
public class OrderService {

    @Transactional  // override: read-write
    public Order placeOrder(PlaceOrderRequest req) {
        // ...
        return orderRepo.save(order);
    }

    @Transactional(
        isolation = Isolation.REPEATABLE_READ,  // prevent non-repeatable reads
        rollbackFor = { PaymentException.class },  // roll back for checked exceptions too
        noRollbackFor = { NotificationException.class },
        timeout = 30  // seconds before TransactionTimedOutException
    )
    public void processPayment(UUID orderId) { ... }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void auditLog(String action) {
        // Always runs in a NEW transaction — separate commit
        auditRepo.save(new AuditEntry(action, Instant.now()));
    }
}
```

### Propagation modes

| Propagation | Behaviour |
|---|---|
| `REQUIRED` (default) | Join existing TX; create new if none |
| `REQUIRES_NEW` | Suspend existing, start fresh |
| `SUPPORTS` | Join if exists; non-transactional if none |
| `NOT_SUPPORTED` | Always non-transactional; suspend existing |
| `MANDATORY` | Must exist — throw if none |
| `NEVER` | Must NOT exist — throw if one does |
| `NESTED` | Savepoint in existing TX |

> **`@Transactional` only works when called through a Spring proxy (from another bean).** Self-invocation (`this.method()`) bypasses the proxy — the annotation is ignored.

---

## Avoiding the N+1 Problem

```java
// N+1: loading orders triggers N extra queries for items
List<Order> orders = orderRepo.findAll();
orders.forEach(o -> o.getItems().size()); // LAZY fires one query per order

// Solution 1: JOIN FETCH
@Query("SELECT DISTINCT o FROM Order o JOIN FETCH o.items")
List<Order> findAllWithItems();

// Solution 2: EntityGraph
@EntityGraph(attributePaths = {"items"})
List<Order> findAll();

// Solution 3: Hibernate batch fetching (catches most cases automatically)
# application.yml
spring.jpa.properties.hibernate.default_batch_fetch_size: 100
# Hibernate loads items for 100 orders at once instead of 1-by-1
```

---

## Spring Cache Abstraction

```java
@SpringBootApplication
@EnableCaching
public class App {}

// Caffeine cache configuration (fast, in-memory)
@Configuration
public class CacheConfig {
    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager mgr = new CaffeineCacheManager("products", "orders");
        mgr.setCaffeine(Caffeine.newBuilder()
            .maximumSize(1000)
            .expireAfterWrite(Duration.ofMinutes(10)));
        return mgr;
    }
}

@Service
public class ProductService {

    @Cacheable(value = "products", key = "#sku",
               condition = "#sku != null",
               unless = "#result == null")  // don't cache nulls
    public Product findBySku(String sku) { return repo.findBySku(sku); }

    @CachePut(value = "products", key = "#product.sku")  // update cache on write
    public Product update(Product product) { return repo.save(product); }

    @CacheEvict(value = "products", key = "#sku")  // remove from cache
    public void delete(String sku) { repo.deleteBySku(sku); }

    @Caching(evict = {  // multiple cache ops
        @CacheEvict(value = "products", key = "#product.sku"),
        @CacheEvict(value = "productsByCategory", allEntries = true)
    })
    public void deleteAll(Product product) { ... }
}
```

---

## HikariCP Connection Pool

```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 10       # max DB connections
      minimum-idle: 5
      connection-timeout: 30000   # ms to wait for connection from pool
      idle-timeout: 600000        # ms before idle connection removed
      max-lifetime: 1800000       # ms before connection retired
      connection-test-query: SELECT 1  # validation query
      pool-name: order-service-pool
```

> **Pool size formula:** `connections = (core_count * 2) + effective_spindle_count`. For a 4-core, SSD machine start with 9–10. More connections does not mean higher throughput beyond this point — context-switching overhead dominates.

---

## Database Migrations with Flyway

```
src/main/resources/db/migration/
    V1__create_customers.sql
    V2__create_products.sql
    V3__create_orders.sql
    V4__add_order_items.sql
    V5__add_indexes.sql
    R__create_reporting_views.sql    # R = repeatable: reruns on content change
```

```sql
-- V3__create_orders.sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    total NUMERIC(12, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    version BIGINT NOT NULL DEFAULT 0
);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status   ON orders(status, created_at DESC);
```

Flyway tracks migrations in `flyway_schema_history`. Never modify an applied migration — create a new versioned one.

```yaml
spring:
  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: true  # for existing databases
    out-of-order: false        # fail if migrations run out of sequence
```
