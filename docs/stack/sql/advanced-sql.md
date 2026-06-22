---
title: Advanced SQL
description: Window functions (ROW_NUMBER, RANK, LAG/LEAD, running totals), EXPLAIN ANALYZE, index types (B-tree, GIN, partial), and query optimisation.
---

# Advanced SQL

Window functions and query optimisation are what separate SQL novices from engineers who can handle millions of rows. Window functions let you compute aggregates and rankings without collapsing rows. EXPLAIN ANALYZE shows you exactly what the query planner is doing and why a query is slow.

---

## Window Functions

A window function computes a value across a set of rows **related to the current row** without collapsing them into a single output row. The `OVER()` clause defines the window.

```sql
SELECT
    customer_id,
    created_at,
    total,
    -- Rank each order within its customer's orders by date
    ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY created_at)    AS rn,
    RANK()       OVER (PARTITION BY customer_id ORDER BY total DESC)    AS value_rank,
    DENSE_RANK() OVER (PARTITION BY customer_id ORDER BY total DESC)    AS value_dense_rank,
    -- Running total per customer
    SUM(total)   OVER (PARTITION BY customer_id ORDER BY created_at
                       ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total,
    -- Previous and next order values
    LAG(total, 1)  OVER (PARTITION BY customer_id ORDER BY created_at) AS prev_order_total,
    LEAD(total, 1) OVER (PARTITION BY customer_id ORDER BY created_at) AS next_order_total,
    -- First and last order in window
    FIRST_VALUE(total) OVER (PARTITION BY customer_id ORDER BY created_at) AS first_order_total,
    LAST_VALUE(total)  OVER (PARTITION BY customer_id ORDER BY created_at
                             ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS last_order_total
FROM orders;
```

### Difference between RANK and DENSE_RANK

| Score | ROW_NUMBER | RANK | DENSE_RANK |
|---|---|---|---|
| 100 | 1 | 1 | 1 |
| 90 | 2 | 2 | 2 |
| 90 | 3 | 2 | 2 |
| 80 | 4 | 4 | 3 |

`RANK` skips numbers after ties; `DENSE_RANK` does not.

### Practical example: most recent order per customer

```sql
-- Get the latest order for each customer
WITH ranked AS (
    SELECT *,
           ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY created_at DESC) AS rn
    FROM orders
)
SELECT * FROM ranked WHERE rn = 1;
```

### 7-day rolling average

```sql
SELECT
    DATE(created_at)                                     AS day,
    COUNT(*)                                             AS daily_orders,
    AVG(COUNT(*)) OVER (
        ORDER BY DATE(created_at)
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    )                                                    AS rolling_7day_avg
FROM orders
GROUP BY DATE(created_at)
ORDER BY day;
```

---

## EXPLAIN ANALYZE

`EXPLAIN ANALYZE` executes the query and shows the actual execution plan with real timings:

```sql
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT c.email, COUNT(o.id)
FROM customers c
JOIN orders o ON c.id = o.customer_id
WHERE o.created_at >= '2026-01-01'
GROUP BY c.id, c.email;
```

```
Hash Join  (cost=245.00..1890.00 rows=1200 width=50)
              (actual time=12.3..45.6 rows=980 loops=1)
  Hash Cond: (o.customer_id = c.id)
  -> Seq Scan on orders  (cost=0..800 rows=15000 width=24)
              (actual time=0.1..18.3 rows=14200 loops=1)
       Filter: (created_at >= '2026-01-01')
       Rows Removed by Filter: 5800
  -> Hash  (cost=120..120 rows=5000 width=40)
       -> Seq Scan on customers  (cost=0..120 rows=5000 width=40)
Planning Time: 0.8 ms
Execution Time: 46.1 ms
```

The `Seq Scan on orders` with filter means there is no index on `created_at`. Adding one turns this into an `Index Scan`:

```sql
CREATE INDEX idx_orders_created_at ON orders (created_at);
```

---

## Index Types

### B-tree (default)

```sql
-- Standard index for equality and range queries
CREATE INDEX idx_orders_customer ON orders (customer_id);
CREATE INDEX idx_orders_status   ON orders (status);

-- Composite index — column ORDER matters
-- This index helps: WHERE status = 'confirmed' AND created_at > ...
-- This index does NOT help: WHERE created_at > ...  (no leading column)
CREATE INDEX idx_orders_status_date ON orders (status, created_at DESC);
```

### Partial index — index a subset of rows

```sql
-- Only index pending orders (99% of queries that hit the index)
-- Much smaller than a full index, fits in memory better
CREATE INDEX idx_orders_pending ON orders (created_at)
WHERE status = 'pending';

-- Index only non-deleted rows
CREATE UNIQUE INDEX idx_products_sku ON products (sku)
WHERE deleted_at IS NULL;
```

### GIN — for JSONB, arrays, full-text

```sql
-- JSONB index — supports @>, ?, ?|, ?& operators
CREATE INDEX idx_products_metadata ON products USING GIN (metadata);

-- Full-text search
CREATE INDEX idx_products_search ON products
USING GIN (to_tsvector('english', name || ' ' || description));

-- Query using the GIN index
SELECT * FROM products
WHERE to_tsvector('english', name || ' ' || description)
   @@ plainto_tsquery('english', 'wireless headphones');
```

### Index strategy rules

| Rule | Reasoning |
|---|---|
| Index foreign keys | JOINs on unindexed FKs cause seq scans |
| Index high-cardinality filter columns | `WHERE email = ?` benefits; `WHERE is_active = true` on 99% active rows does not |
| Composite index column order: most selective first | Leftmost column is the entry point |
| Too many indexes hurt writes | Each INSERT/UPDATE/DELETE must update all indexes |
| Monitor unused indexes | `pg_stat_user_indexes` shows index usage |

```sql
-- Find unused indexes
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY pg_relation_size(indexrelid) DESC;
```
