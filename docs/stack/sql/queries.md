---
title: Queries
description: SELECT, JOINs, subqueries, CTEs, aggregate functions, GROUP BY/HAVING, UNION, and practical query patterns.
---

# Queries

SQL's power is in its query language. A single well-crafted query can replace hundreds of lines of application code by pushing computation into the database — closer to the data, and dramatically faster for large datasets.

---

## SELECT Basics

```sql
-- Columns, expressions, aliases
SELECT
    id,
    email,
    UPPER(name)          AS display_name,
    created_at::DATE     AS joined_date,
    NOW() - created_at   AS account_age
FROM customers
WHERE is_active = TRUE
  AND created_at >= '2025-01-01'
ORDER BY created_at DESC
LIMIT 20 OFFSET 40;   -- page 3 (0-indexed), 20 per page
```

> **Prefer cursor-based pagination over OFFSET at scale.** `OFFSET 10000` forces the database to scan and discard 10,000 rows. Use `WHERE id > :last_seen_id ORDER BY id LIMIT 20` instead — it always hits the index.

---

## JOINs

```mermaid
graph LR
    IJ[INNER JOIN
only matching rows] --- LJ[LEFT JOIN
all left + matched right]
    LJ --- RJ[RIGHT JOIN
all right + matched left]
    RJ --- FJ[FULL OUTER JOIN
all rows from both]
```

```sql
-- INNER JOIN: only orders that have a customer
SELECT o.id, o.total, c.email
FROM orders o
INNER JOIN customers c ON o.customer_id = c.id
WHERE o.status = 'confirmed';

-- LEFT JOIN: all customers, with orders if they exist (NULL if none)
SELECT c.id, c.email, COUNT(o.id) AS order_count
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.email;

-- FULL OUTER JOIN: all rows from both sides
SELECT c.name, o.id AS order_id
FROM customers c
FULL OUTER JOIN orders o ON c.id = o.customer_id
WHERE c.id IS NULL OR o.id IS NULL;  -- find orphaned rows

-- SELF JOIN: organisational hierarchy
SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;

-- Multiple JOINs: order with customer and items
SELECT
    o.id          AS order_id,
    c.email,
    p.name        AS product,
    oi.quantity,
    oi.unit_price
FROM orders o
JOIN customers c   ON o.customer_id  = c.id
JOIN order_items oi ON o.id          = oi.order_id
JOIN products p    ON oi.product_id  = p.id
WHERE o.id = 'order-uuid-here';
```

---

## Aggregate Functions and GROUP BY

```sql
-- Per-customer order stats
SELECT
    c.email,
    COUNT(o.id)          AS total_orders,
    SUM(o.total)         AS lifetime_value,
    AVG(o.total)         AS avg_order_value,
    MAX(o.total)         AS largest_order,
    MIN(o.created_at)    AS first_order_date
FROM customers c
JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.email
HAVING SUM(o.total) > 500   -- HAVING filters AFTER aggregation
ORDER BY lifetime_value DESC
LIMIT 10;

-- COUNT(*) vs COUNT(col): COUNT(*) counts rows; COUNT(col) excludes NULLs
SELECT
    COUNT(*)             AS total_rows,
    COUNT(phone)         AS rows_with_phone,  -- NULLs excluded
    COUNT(DISTINCT city) AS unique_cities
FROM customers;
```

---

## Subqueries

```sql
-- Scalar subquery: single value
SELECT name, price,
       price - (SELECT AVG(price) FROM products) AS diff_from_avg
FROM products;

-- IN with subquery: customers who have placed at least one order
SELECT email FROM customers
WHERE id IN (
    SELECT DISTINCT customer_id FROM orders WHERE status = 'confirmed'
);

-- EXISTS: usually faster than IN for large sets
SELECT email FROM customers c
WHERE EXISTS (
    SELECT 1 FROM orders o
    WHERE o.customer_id = c.id
      AND o.total > 1000
);

-- Derived table (subquery in FROM)
SELECT email, order_count
FROM (
    SELECT c.email, COUNT(o.id) AS order_count
    FROM customers c
    LEFT JOIN orders o ON c.id = o.customer_id
    GROUP BY c.id, c.email
) ranked
WHERE order_count >= 5;
```

---

## CTEs — Common Table Expressions

CTEs make complex queries readable by naming intermediate result sets:

```sql
-- Single CTE
WITH confirmed_orders AS (
    SELECT customer_id, SUM(total) AS spend
    FROM orders
    WHERE status = 'confirmed'
      AND created_at >= NOW() - INTERVAL '1 year'
    GROUP BY customer_id
)
SELECT c.email, co.spend
FROM customers c
JOIN confirmed_orders co ON c.id = co.customer_id
WHERE co.spend > 1000
ORDER BY co.spend DESC;

-- Chained CTEs
WITH
orderly_customers AS (
    SELECT customer_id, COUNT(*) AS order_count
    FROM orders
    GROUP BY customer_id
),
high_value AS (
    SELECT customer_id, SUM(total) AS revenue
    FROM orders
    WHERE status = 'confirmed'
    GROUP BY customer_id
    HAVING SUM(total) > 5000
)
SELECT c.email, oc.order_count, hv.revenue
FROM customers c
JOIN orderly_customers oc ON c.id = oc.customer_id
JOIN high_value hv         ON c.id = hv.customer_id;

-- Recursive CTE: traverse a tree (categories, org charts)
WITH RECURSIVE category_tree AS (
    -- Base case: root categories
    SELECT id, name, parent_id, 0 AS depth
    FROM categories
    WHERE parent_id IS NULL

    UNION ALL

    -- Recursive case: children
    SELECT c.id, c.name, c.parent_id, ct.depth + 1
    FROM categories c
    INNER JOIN category_tree ct ON c.parent_id = ct.id
)
SELECT id, REPEAT('  ', depth) || name AS indented_name, depth
FROM category_tree
ORDER BY depth, name;
```

---

## UNION, INTERSECT, EXCEPT

```sql
-- UNION: combine results, remove duplicates
SELECT email FROM customers
UNION
SELECT email FROM newsletter_subscribers;

-- UNION ALL: keep duplicates (faster — no dedup step)
SELECT 'order'   AS type, id, created_at FROM orders
UNION ALL
SELECT 'invoice' AS type, id, created_at FROM invoices
ORDER BY created_at DESC;

-- INTERSECT: only rows in BOTH result sets
SELECT customer_id FROM orders WHERE status = 'confirmed'
INTERSECT
SELECT customer_id FROM orders WHERE total > 500;

-- EXCEPT: rows in first set but NOT in second
SELECT id FROM customers
EXCEPT
SELECT DISTINCT customer_id FROM orders;  -- customers with no orders
```
