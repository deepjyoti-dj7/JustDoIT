---
title: Spring Boot + SQL
description: Full Spring Data JPA integration — entities, repositories, relationships, pagination, @Transactional, N+1 prevention, HikariCP, and Flyway migrations.
---

# Spring Boot + SQL

Spring Data JPA provides a repository abstraction over Hibernate. You define an entity class, an interface, and Spring generates the implementation at startup. This page goes deeper than basic usage — covering entity relationships, pagination, transaction management, and the N+1 problem that causes most JPA performance issues.

---

## Dependency and Configuration

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
```

```yaml
spring:
  datasource:
    url: ${DB_URL:jdbc:postgresql://localhost:5432/orders}
    username: ${DB_USERNAME:postgres}
    password: ${DB_PASSWORD:}
    hikari:
      maximum-pool-size: 10
      minimum-idle: 5
      connection-timeout: 30000
  jpa:
    hibernate:
      ddl-auto: validate           # NEVER use create/create-drop in production
    open-in-view: false            # IMPORTANT: disable or you get the N+1 problem silently
    show-sql: false
    properties:
      hibernate:
        format_sql: false
        default_batch_fetch_size: 100  # reduces N+1 queries automatically
```

---

## Entities and Relationships

```java
@Entity
@Table(name = "orders",
       indexes = @Index(name = "idx_orders_customer", columnList = "customer_id"))
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

    // LAZY is the correct default — only load when accessed
    @OneToMany(mappedBy = "order",
               cascade = CascadeType.ALL,
               orphanRemoval = true,
               fetch = FetchType.LAZY)
    private List<OrderItem> items = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", insertable = false, updatable = false)
    private Customer customer;

    @CreatedDate @Column(updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    @Version  // optimistic locking
    private Long version;

    // Helper to maintain bidirectional relationship
    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }
}
```

---

## Repositories

```java
public interface OrderRepository extends JpaRepository<Order, UUID> {

    // Spring derives: SELECT o FROM Order o WHERE o.customerId = ?1
    List<Order> findByCustomerId(UUID customerId);

    // Pagination
    Page<Order> findByStatus(OrderStatus status, Pageable pageable);

    // JPQL with JOIN FETCH to solve N+1
    @Query("SELECT DISTINCT o FROM Order o " +
           "LEFT JOIN FETCH o.items i " +
           "LEFT JOIN FETCH i.product " +
           "WHERE o.customerId = :customerId")
    List<Order> findWithItemsByCustomerId(@Param("customerId") UUID customerId);

    // EntityGraph alternative to JOIN FETCH
    @EntityGraph(attributePaths = {"items", "items.product"})
    @Query("SELECT o FROM Order o WHERE o.customerId = :cid")
    List<Order> findWithItemsGraph(@Param("cid") UUID customerId);

    // Projection — only select needed fields
    @Query("SELECT o.id AS id, o.status AS status, o.total AS total " +
           "FROM Order o WHERE o.customerId = :cid")
    List<OrderSummary> findSummariesByCustomerId(@Param("cid") UUID cid);

    // Modifying query with @Modifying
    @Modifying
    @Query("UPDATE Order o SET o.status = :status WHERE o.id = :id")
    int updateStatus(@Param("id") UUID id, @Param("status") OrderStatus status);

    // Native SQL when JPQL isn't expressive enough
    @Query(value = "SELECT * FROM orders WHERE created_at >= :since " +
                   "AND total > :minTotal ORDER BY total DESC",
           nativeQuery = true)
    List<Order> findHighValueRecent(@Param("since") Instant since,
                                    @Param("minTotal") BigDecimal minTotal);
}

public interface OrderSummary {
    UUID getId();
    OrderStatus getStatus();
    BigDecimal getTotal();
}
```

---

## Pagination and Sorting

```java
@GetMapping
public Page<OrderResponse> listOrders(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        @RequestParam(defaultValue = "createdAt") String sortBy,
        @RequestParam(defaultValue = "DESC") String direction) {

    Sort sort = Sort.by(Sort.Direction.fromString(direction), sortBy);
    Pageable pageable = PageRequest.of(page, size, sort);
    return orderRepository.findByStatus(OrderStatus.CONFIRMED, pageable)
                          .map(OrderResponse::from);
}
// Response includes: content[], totalElements, totalPages, number, size
```

---

## `@Transactional` in Depth

```java
@Service
@Transactional(readOnly = true)  // default all methods read-only
public class OrderService {

    @Transactional  // read-write override
    public Order placeOrder(PlaceOrderRequest req) {
        // Inventory check with pessimistic lock
        Product product = productRepository.findByIdForUpdate(req.productId())
                .orElseThrow(() -> new NotFoundException("Product"));

        if (product.getStock() < req.quantity()) {
            throw new InsufficientStockException(product.getId());
        }

        product.setStock(product.getStock() - req.quantity());
        productRepository.save(product);

        Order order = new Order();
        order.setCustomerId(req.customerId());
        order.setStatus(OrderStatus.PENDING);
        order.addItem(new OrderItem(product, req.quantity(), product.getPrice()));

        return orderRepository.save(order);
        // Commit happens automatically when method returns
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logAuditEvent(UUID orderId, String action) {
        // runs in a SEPARATE transaction even if called within another
        auditRepository.save(new AuditEvent(orderId, action));
    }
}
```

---

## Avoiding the N+1 Problem

```java
// BAD: 1 query for orders + N queries for items (one per order)
List<Order> orders = orderRepository.findAll();
orders.forEach(o -> {
    int count = o.getItems().size(); // LAZY triggers a query here
});

// GOOD option 1: JOIN FETCH in the query
@Query("SELECT DISTINCT o FROM Order o JOIN FETCH o.items")
List<Order> findAllWithItems();

// GOOD option 2: EntityGraph
@EntityGraph(attributePaths = {"items"})
List<Order> findAll(); // override default findAll with eager items

// GOOD option 3: Batch fetching in application.yml
# hibernate.default_batch_fetch_size: 100
# Hibernate loads items for 100 orders at once instead of 1-by-1
```

---

## Flyway Migrations

```
src/main/resources/db/migration/
    V1__create_customers.sql
    V2__create_products.sql
    V3__create_orders.sql
    V4__add_order_items.sql
    V5__add_product_index.sql
```

```sql
-- V3__create_orders.sql
CREATE TABLE orders (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    status      VARCHAR(20) NOT NULL DEFAULT 'pending',
    total       NUMERIC(12, 2) NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW(),
    version     BIGINT NOT NULL DEFAULT 0
);
CREATE INDEX idx_orders_customer  ON orders(customer_id);
CREATE INDEX idx_orders_status    ON orders(status, created_at DESC);
```

> **Never modify an applied migration.** Create a new versioned migration instead. Flyway stores a checksum of each script in `flyway_schema_history` and will refuse to run if a previously-applied script changes.
