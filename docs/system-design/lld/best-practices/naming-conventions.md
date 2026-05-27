# Naming Conventions

> "There are only two hard things in Computer Science: cache invalidation and naming things."
> — Phil Karlton

Naming is not cosmetic. A good name is the first and cheapest form of documentation. A bad name forces every future reader — including yourself in six months — to decode intent before they can reason about correctness. In an LLD interview, your naming immediately signals whether you think in domain terms or implementation terms.

> **Interview relevance:** Interviewers watch your naming instinctively. A class called `Manager`, `Helper`, or `Utils` signals fuzzy thinking. A class called `OrderFulfillmentService`, `InvoiceLineItem`, or `PaymentDeclineReason` signals domain understanding. The name is your first design decision.

---

## The Naming Hierarchy

Good naming operates at every level of code structure. Each level has its own conventions.

| Level | Java convention | Example |
|---|---|---|
| **Package** | lowercase, reverse-domain | `com.company.orders.domain` |
| **Class / Interface** | PascalCase, noun or noun phrase | `OrderFulfillmentService` |
| **Method** | camelCase, verb or verb phrase | `calculateShippingCost()` |
| **Variable** | camelCase, noun | `shippingCostInCents` |
| **Constant** | UPPER_SNAKE_CASE | `MAX_RETRY_ATTEMPTS` |
| **Generic type** | Single capital letter, or descriptive | `T`, `K`, `V`, `EntityType` |
| **Boolean** | camelCase with is/has/can/should prefix | `isEligibleForDiscount` |

---

## Classes: Name What It Is, Not What It Does

A class name should describe what the class **represents**, not how it works.

### Anti-patterns and their fixes

| Anti-pattern | Problem | Better name |
|---|---|---|
| `OrderManager` | "Manager" says nothing — manages what exactly? | `OrderFulfillmentService`, `OrderLifecycleCoordinator` |
| `DataHelper` | "Helper" is noise — helps with what? | `OrderDiscountCalculator`, `AddressFormatter` |
| `OrderUtils` | Utils classes are usually SRP violations in disguise | Split into focused classes |
| `AbstractBaseOrderProcessor` | Hungarian notation in class names; redundant prefix | `OrderProcessor` (the abstract part is visible in the declaration) |
| `IOrderRepository` | `I` prefix is a .NET convention; Java doesn't use it | `OrderRepository` for the interface, `JdbcOrderRepository` for the impl |

```java
// BAD — the name leaks implementation, not purpose
public class MySqlOrderDataAccessObject { ... }

// GOOD — names the role; implementation is invisible to callers
public interface OrderRepository { ... }
public class JdbcOrderRepository implements OrderRepository { ... }
public class InMemoryOrderRepository implements OrderRepository { ... }  // for tests
```

### Naming interfaces vs implementations

The **interface** gets the clean, business-facing name. The **implementation** gets the qualifier:

```java
// Interface: pure concept
public interface PaymentGateway { ... }
public interface NotificationChannel { ... }
public interface UserRepository { ... }

// Implementations: qualified by technology or behaviour
public class StripePaymentGateway implements PaymentGateway { ... }
public class EmailNotificationChannel implements NotificationChannel { ... }
public class JdbcUserRepository implements UserRepository { ... }
public class CachedUserRepository implements UserRepository { ... }   // decorator
public class InMemoryUserRepository implements UserRepository { ... } // test double
```

Callers depend on `PaymentGateway`. The qualifier tells you *which one*, which matters only at wiring time.

---

## Methods: One Verb, One Purpose

A method name should answer: what does calling this method **cause to happen** or **return**?

### Commands vs Queries

Distinguish **commands** (change state, return void or the changed object) from **queries** (return data, no side effects):

```java
// Commands — verb that describes the state change
public void placeOrder(Order order) { ... }
public void cancelOrder(String orderId) { ... }
public void reserveInventory(String productId, int quantity) { ... }
public Order confirmCheckout(Cart cart) { ... }

// Queries — returns something, no state change
public Order findOrderById(String orderId) { ... }
public List<Order> findOrdersByCustomer(String customerId) { ... }
public boolean isEligibleForDiscount(Customer customer) { ... }
public Money calculateShippingCost(Order order, ShippingZone zone) { ... }
```

Mixing commands and queries in one method is a smell:

```java
// BAD — unclear if this is a query or a command, or both
public Order processOrder(Order order) { ... }

// BETTER — split intent
public void processOrder(Order order) { ... }          // command
public OrderStatus getOrderStatus(String id) { ... }   // query
```

### Boolean method names

Boolean methods should read as natural English predicates:

```java
// BAD
public boolean check(Customer customer) { ... }
public boolean orderStatus(Order o) { ... }

// GOOD — reads naturally in an if statement
public boolean isEligibleForPremiumShipping(Customer customer) { ... }
public boolean hasPendingPayment(Order order) { ... }
public boolean canBeCancelled(Order order) { ... }
public boolean shouldSendReminderEmail(Subscription sub) { ... }
```

Reading `if (customer.isEligibleForPremiumShipping())` is self-documenting. Reading `if (customer.check())` tells you nothing.

---

## Variables: Reveal Intent, Not Type

Variable names should reveal **what the value means**, not its type.

```java
// BAD — type-focused, reveals nothing about purpose
int n = 30;
String s = "USD";
List<Order> list = getOrders();
double d = 0.15;

// GOOD — meaning is immediately clear
int sessionTimeoutMinutes = 30;
String currencyCode = "USD";
List<Order> unshippedOrders = findUnshippedOrders();
double taxRate = 0.15;
```

### Scope-length rule

Variable names should be proportional to their scope:

```java
// Loop variable: single letter is fine — scope is one line
for (int i = 0; i < items.size(); i++) { ... }

// Short-lived local: brief is OK
String line = reader.readLine();

// Field or method parameter: descriptive — will be read far from declaration
private final OrderRepository orderRepository;
public Receipt generateReceipt(Order confirmedOrder, Customer billedCustomer) { ... }
```

### Avoid encodings and noise

```java
// BAD — Hungarian notation (type prefix)
String strCustomerName;
int intRetryCount;
List<Order> listOrders;

// BAD — noise words that add nothing
Order orderObject;
String nameString;
Order getOrderData(String orderId) { ... }   // "Data" adds nothing

// GOOD — pure intent
String customerName;
int retryCount;
List<Order> orders;
Order getOrder(String orderId) { ... }
```

---

## Ubiquitous Language: Name in the Domain

The most powerful naming discipline comes from Domain-Driven Design: use the language your business stakeholders use. If Finance calls it an *invoice line item*, your class should be `InvoiceLineItem`, not `BillingRecord` or `ChargeEntry`.

```java
// BAD — technical names that mean nothing to the business
public class ChargeRecord {
    private double amount;
    private String code;
    private String dest;
}

// GOOD — domain language; a stakeholder could read this
public class InvoiceLineItem {
    private Money chargedAmount;
    private ProductCode productCode;
    private BillingAddress billingAddress;
}
```

Naming alignment between the codebase and the business model has a concrete benefit: when a domain expert says "an invoice can be partially credited", you immediately know which class and method to look at. When names diverge from the domain, every conversation requires translation.

---

## Naming in Practice: Order System Walkthrough

```java
// Package: reverse domain + bounded context + layer
package com.acme.orders.domain;

// Entity: domain noun, no suffix noise
public class Order {
    private final OrderId          id;           // strong type, not plain String
    private final CustomerId       customerId;
    private final List<OrderLine>  lines;        // "lines" not "items" or "entries" — match domain language
    private       OrderStatus      status;
    private       ShippingAddress  destination;

    // Command — verb phrase; changes state
    public void addLine(Product product, Quantity quantity) { ... }

    // Command — clear what "confirm" means in this domain
    public void confirm() { ... }

    // Query — reads as English predicate
    public boolean isConfirmed() {
        return status == OrderStatus.CONFIRMED;
    }

    // Query — returns meaningful type, not primitives
    public Money totalAmount() { ... }

    // Query — "lines" mirrors field name, no get-prefix needed for queries
    public List<OrderLine> lines() {
        return Collections.unmodifiableList(lines);
    }
}

// Value object: domain concept
public class OrderLine {
    private final ProductId productId;
    private final Quantity  quantity;
    private final Money     unitPrice;

    // Query — computed value
    public Money lineTotal() {
        return unitPrice.multiply(quantity.value());
    }
}

// Service: noun phrase describing the orchestration concern
public class OrderFulfillmentService {
    private final OrderRepository      orders;
    private final InventoryService     inventory;
    private final PaymentGateway       payments;
    private final NotificationService  notifications;

    // Command: verb phrase; named by the business operation
    public Order placeOrder(PlaceOrderCommand command) { ... }
    public void  cancelOrder(OrderId orderId, CancellationReason reason) { ... }
    public void  shipOrder(OrderId orderId, TrackingCode trackingCode) { ... }
}
```

---

## Common Naming Mistakes Table

| Mistake | Example | Fix |
|---|---|---|
| Vague noun | `Manager`, `Handler`, `Processor`, `Helper` | Name the specific concern |
| Type in name | `orderList`, `nameString` | `orders`, `name` |
| Abbreviation | `calcShpCst()`, `usrRepo` | `calculateShippingCost()`, `userRepository` |
| Misleading name | `getUserData()` returns void and sends email | Name the actual side effect |
| Inconsistent vocabulary | `fetch` in one class, `get` in another, `retrieve` in a third for the same concept | Pick one word per concept |
| Numeric suffixes | `processOrder2()`, `UserService2` | Descriptive suffixes: `processOrderWithRetry()` |
| Negated booleans | `isNotExpired`, `hasNoBalance` | `isExpired`, `hasBalance` — use positive form |

---

## Interview Talking Points

**1. How do you name a class when you're not sure what to call it?**
> "I start with the domain language — what does the business call this thing? If I can't name it well, that's a signal the abstraction isn't clear yet. I also listen to the words I use when I explain what the class does out loud — those words often become the name. If I catch myself saying 'and' while explaining the class, I split it first, then name the pieces."

**2. Why should the interface get the clean name, not the implementation?**
> "Because callers depend on the interface, not the implementation. The clean name communicates the *role* — `PaymentGateway`, `OrderRepository`. The implementation name communicates the *mechanism* — `StripePaymentGateway`, `JdbcOrderRepository`. This matters at wiring time and in logs, but not when reading business logic. Code that reads `PaymentGateway.charge()` is clear regardless of which provider is behind it."

**3. What's the relationship between naming and design quality?**
> "They're tightly coupled. A class that is hard to name usually has an unclear responsibility. A method that needs a long conjunction in its name — `saveAndNotifyAndUpdateCache()` — is doing too much. The act of naming forces you to articulate purpose, which exposes design flaws. I treat naming difficulty as a design smell — if I can't name it cleanly, the abstraction needs work."

---

## Key Takeaways

- Names are **the cheapest form of documentation** — they must reveal intent, not type or implementation
- **Classes**: noun phrases describing a domain concept; interfaces get clean names, implementations get qualified names
- **Methods**: verb phrases — distinguish commands (change state) from queries (return value)
- **Booleans**: `is`, `has`, `can`, `should` prefixes — reads naturally as an English predicate
- **Variables**: scope-proportional — short for local, descriptive for fields and parameters
- **Ubiquitous language**: mirror the domain vocabulary; stakeholders should recognise your class names
- Naming difficulty is a **design smell** — if you can't name it cleanly, the abstraction needs rethinking
