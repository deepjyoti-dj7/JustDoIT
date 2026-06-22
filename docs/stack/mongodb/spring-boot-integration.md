---
title: Spring Boot + MongoDB
description: Spring Data MongoDB setup, @Document entities, MongoRepository, custom queries, MongoTemplate for complex operations, aggregation, transactions, and indexing.
---

# Spring Boot + MongoDB

Spring Data MongoDB provides the same repository abstraction as Spring Data JPA, but targets MongoDB documents instead of relational tables. You annotate POJOs with `@Document`, define repository interfaces, and Spring generates implementations. For complex queries and the aggregation pipeline, `MongoTemplate` gives you full control.

---

## Dependency and Configuration

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-mongodb</artifactId>
</dependency>
```

```yaml
spring:
  data:
    mongodb:
      uri: ${MONGODB_URI:mongodb://localhost:27017/orders}
      # For Atlas:
      # uri: mongodb+srv://user:pass@cluster.mongodb.net/orders
      auto-index-creation: false   # manage indexes explicitly in production
```

---

## Documents and Entities

```java
@Document(collection = "orders")
@CompoundIndex(name = "idx_customer_status",
               def = "{'customerId': 1, 'status': 1}")
public class Order {

    @Id
    private String id;             // maps to MongoDB _id

    @Field("customer_id")
    @Indexed                       // single field index
    private String customerId;

    private OrderStatus status;

    @Field("total")
    private BigDecimal total;

    private List<OrderItem> items = new ArrayList<>();  // embedded documents

    private Address shippingAddress;  // embedded sub-document

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}

// Embedded document — no @Document (it is not a collection)
public class OrderItem {
    private String productId;
    private String productName;  // snapshot
    private int quantity;
    private BigDecimal unitPrice;
}
```

```java
// Enable auditing and index creation management
@SpringBootApplication
@EnableMongoAuditing
public class OrderServiceApplication {

    // Create indexes programmatically in production
    @Bean
    public InitializingBean mongoIndexes(MongoTemplate mongoTemplate) {
        return () -> {
            IndexOperations ops = mongoTemplate.indexOps(Order.class);
            ops.ensureIndex(new Index().on("customerId", Sort.Direction.ASC)
                                       .on("createdAt",  Sort.Direction.DESC));
            ops.ensureIndex(new Index().on("status", Sort.Direction.ASC)
                                       .sparse());
        };
    }
}
```

---

## MongoRepository

```java
public interface OrderRepository extends MongoRepository<Order, String> {

    // Derived queries
    List<Order> findByCustomerId(String customerId);
    Optional<Order> findByIdAndCustomerId(String id, String customerId);
    List<Order> findByStatusIn(List<OrderStatus> statuses);
    long countByStatus(OrderStatus status);

    // Paginated
    Page<Order> findByStatus(OrderStatus status, Pageable pageable);

    // Custom MongoDB query (JSON-style filter)
    @Query("{ 'customerId': ?0, 'total': { $gt: ?1 } }")
    List<Order> findHighValueOrders(String customerId, BigDecimal minTotal);

    // Return only specific fields (projection)
    @Query(value = "{ 'status': ?0 }",
           fields = "{ 'customerId': 1, 'status': 1, 'total': 1 }")
    List<OrderSummary> findSummariesByStatus(OrderStatus status);

    // Sort and limit
    List<Order> findTop10ByStatusOrderByCreatedAtDesc(OrderStatus status);

    // Delete
    void deleteByCustomerIdAndStatus(String customerId, OrderStatus status);
}

// Projection interface
public interface OrderSummary {
    String getCustomerId();
    OrderStatus getStatus();
    BigDecimal getTotal();
}
```

---

## MongoTemplate — Complex Operations

```java
@Service
public class OrderQueryService {

    private final MongoTemplate mongoTemplate;

    // Dynamic query with Criteria
    public List<Order> searchOrders(OrderSearchRequest req) {
        Query query = new Query();

        if (req.customerId() != null)
            query.addCriteria(Criteria.where("customerId").is(req.customerId()));
        if (req.status() != null)
            query.addCriteria(Criteria.where("status").is(req.status()));
        if (req.minTotal() != null)
            query.addCriteria(Criteria.where("total").gte(req.minTotal()));
        if (req.since() != null)
            query.addCriteria(Criteria.where("createdAt").gte(req.since()));

        query.with(Sort.by(Sort.Direction.DESC, "createdAt"));
        query.limit(req.limit() != null ? req.limit() : 50);

        return mongoTemplate.find(query, Order.class);
    }

    // Atomic findAndModify
    public Order confirmOrder(String orderId) {
        Query query = new Query(Criteria.where("_id").is(orderId)
                                        .and("status").is(OrderStatus.PENDING));
        Update update = new Update()
                .set("status", OrderStatus.CONFIRMED)
                .set("confirmedAt", Instant.now());

        return mongoTemplate.findAndModify(
            query, update,
            FindAndModifyOptions.options().returnNew(true),
            Order.class
        );
    }
}
```

---

## Aggregation Pipeline

```java
public List<CustomerOrderStats> getTopCustomers(int limit) {
    Aggregation agg = Aggregation.newAggregation(
        match(Criteria.where("status").is("confirmed")),

        group("customerId")
            .count().as("orderCount")
            .sum("total").as("totalRevenue")
            .avg("total").as("avgOrderValue"),

        sort(Sort.by(Sort.Direction.DESC, "totalRevenue")),

        limit(limit),

        project()
            .andExpression("_id").as("customerId")
            .and("orderCount").as("orderCount")
            .and("totalRevenue").as("totalRevenue")
            .andExpression("totalRevenue > 1000").as("isHighValue")
    );

    AggregationResults<CustomerOrderStats> results =
        mongoTemplate.aggregate(agg, "orders", CustomerOrderStats.class);

    return results.getMappedResults();
}

public record CustomerOrderStats(
    String customerId,
    long orderCount,
    BigDecimal totalRevenue,
    boolean isHighValue
) {}
```

---

## Multi-Document Transactions

```java
@Service
@Transactional   // Spring's @Transactional works with MongoDB 4.0+ replica sets
public class OrderService {

    @Transactional
    public Order placeOrder(PlaceOrderRequest req) {
        // Spring Data MongoDB handles the session automatically
        Product product = productRepository.findById(req.productId())
                .orElseThrow();

        if (product.getStock() < req.quantity()) {
            throw new InsufficientStockException();
        }

        product.setStock(product.getStock() - req.quantity());
        productRepository.save(product);

        Order order = new Order(/* build from req */);
        return orderRepository.save(order);
        // Both saves are in the same transaction
    }
}

// Required config for @Transactional with MongoDB
@Bean
public MongoTransactionManager transactionManager(MongoDatabaseFactory dbFactory) {
    return new MongoTransactionManager(dbFactory);
}
```
