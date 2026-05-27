# Design Tradeoffs

> "There are no solutions, only tradeoffs."
> — Thomas Sowell

Every design decision is a tradeoff. Coupling vs flexibility. Simplicity vs extensibility. Performance vs readability. The measure of an experienced engineer is not that they know the "right answer" — it's that they can articulate what they are trading away, for what gain, given the current context.

This is what interviewers are actually evaluating when they ask open-ended LLD questions. They are watching whether you are opinionated with reasons, or decisive without thought.

> **Interview relevance:** In every LLD interview, the most valuable thing you can say after a design decision is "this trades X for Y, and given [context], that tradeoff is acceptable because..." This signal separates senior from junior candidates more reliably than any specific pattern knowledge.

---

## The Fundamental Tensions

Every design tradeoff is an instance of one of these fundamental tensions:

| Tension | The question |
|---|---|
| **Simplicity vs Extensibility** | Do I build for today's requirements or tomorrow's? |
| **Coupling vs Cohesion** | Should related things live together or be kept separate? |
| **Abstraction vs Performance** | Does the indirection cost more than the flexibility is worth? |
| **Consistency vs Flexibility** | Should everything work the same way, or should each case be optimised? |
| **Early design vs Late design** | Should I invest in structure now or wait for requirements to stabilise? |

---

## Tradeoff 1: Inheritance vs Composition

**Inheritance** offers concise, read-familiar code for truly hierarchical relationships. The cost is tight coupling to the parent's implementation and inflexibility to combine behaviours.

**Composition** offers flexibility, testability, and runtime variability. The cost is more boilerplate (forwarding methods, wiring code) and more files to navigate.

```java
// Inheritance: concise, but brittle
public class PremiumOrderService extends OrderService {
    @Override
    public Order placeOrder(PlaceOrderCommand cmd) {
        Order order = super.placeOrder(cmd);
        applyPremiumBenefits(order);
        return order;
    }
}

// Composition: flexible, testable, extensible
public class OrderService {
    private final List<OrderEnricher> enrichers;

    public Order placeOrder(PlaceOrderCommand cmd) {
        Order order = buildOrder(cmd);
        enrichers.forEach(e -> e.enrich(order));
        return order;
    }
}

public class PremiumBenefitsEnricher implements OrderEnricher {
    @Override public void enrich(Order order) { /* apply benefits */ }
}
```

| Choose | When |
|---|---|
| Inheritance | True is-a, LSP holds, parent is stable, using Template Method deliberately |
| Composition | Multiple dimensions of variation, runtime behaviour selection, testability priority |

---

## Tradeoff 2: Abstraction vs Simplicity

Abstraction (interfaces, abstract classes, generic patterns) buys you flexibility and testability. It costs you indirection — a reader must trace from the call site to the concrete implementation to understand what actually happens.

### Premature Abstraction

```java
// One implementor. One caller. No variation ever planned.
public interface OrderIdGenerator {
    String generate();
}

public class UuidOrderIdGenerator implements OrderIdGenerator {
    @Override public String generate() { return UUID.randomUUID().toString(); }
}

// vs.

// KISS — no interface needed when there's no meaningful variation
public class Order {
    private final String id = UUID.randomUUID().toString();
}
```

When there is exactly one implementor and no credible reason for a second, the interface adds indirection without value. Apply abstraction when the variation is real.

### The Right Abstraction

```java
// Three real implementors in production: Stripe, PayPal, bank transfer
public interface PaymentGateway {
    PaymentResult charge(Money amount, String token);
    PaymentResult refund(String transactionId, Money amount);
}
```

Now the abstraction earns its indirection: it enables swapping providers, A/B testing, test doubles, and circuit-breaker decorators without touching business logic.

| Abstraction pays off when | Abstraction costs without payoff when |
|---|---|
| Multiple real implementors exist or are credible | Only one implementor ever exists |
| You need to swap implementations (provider, test double) | The "alternative" is purely hypothetical |
| The interface enables Decorator or Strategy patterns | The interface just mirrors one class |
| The interface is the stable part clients depend on | The interface changes every time the class changes |

---

## Tradeoff 3: Early Return vs Single Exit

**Single exit point**: one `return` at the end of a method. Sometimes cleaner for readers who like to see the full flow in sequence.

**Guard clause / early return**: return as soon as a condition is detected. Reduces nesting, makes the happy path clearer, avoids deeply nested code.

```java
// Single exit — readable but nested
public PaymentResult processPayment(Order order, String token) {
    PaymentResult result;
    if (order != null) {
        if (order.isConfirmed()) {
            if (token != null && !token.isBlank()) {
                result = gateway.charge(order.total(), token);
            } else {
                result = PaymentResult.failure("Missing token");
            }
        } else {
            result = PaymentResult.failure("Order not confirmed");
        }
    } else {
        result = PaymentResult.failure("Order is null");
    }
    return result;
}

// Guard clauses — flat, readable
public PaymentResult processPayment(Order order, String token) {
    if (order == null)              return PaymentResult.failure("Order is null");
    if (!order.isConfirmed())       return PaymentResult.failure("Order not confirmed");
    if (token == null || token.isBlank()) return PaymentResult.failure("Missing token");

    return gateway.charge(order.total(), token);
}
```

The guard clause version is almost always clearer for validation-heavy methods. The single-exit form has value when the computation at the end needs context from all the intermediate steps.

**The rule**: use guard clauses for precondition validation; use single exit when the return value is built up over the method body.

---

## Tradeoff 4: Immutability vs Mutability

**Immutable objects** cannot be changed after construction. They are thread-safe by default, can be shared freely, are easy to reason about, and make bugs (stale state, unexpected mutation) impossible.

**Mutable objects** are sometimes easier to build incrementally (Builder pattern), can be updated in-place for performance, and are necessary for entities that must track changing state.

```java
// Immutable value object — thread-safe, shareable, no defensive copying needed
public final class Money {
    private final long   amountCents;
    private final String currency;

    public Money(long amountCents, String currency) {
        if (amountCents < 0) throw new IllegalArgumentException("Negative money");
        this.amountCents = amountCents;
        this.currency    = Objects.requireNonNull(currency);
    }

    // Returns new instance — original unchanged
    public Money add(Money other) {
        if (!this.currency.equals(other.currency))
            throw new IllegalArgumentException("Currency mismatch");
        return new Money(this.amountCents + other.amountCents, this.currency);
    }

    public long amountCents() { return amountCents; }
    public String currency()  { return currency; }
}

// Mutable entity — state changes over its lifecycle
public class Order {
    private OrderStatus status = OrderStatus.PENDING;
    private PaymentMethod paymentMethod;

    public void confirm() {
        if (paymentMethod == null) throw new IllegalStateException("No payment method");
        this.status = OrderStatus.CONFIRMED;
    }

    public void cancel() {
        this.status = OrderStatus.CANCELLED;
    }
}
```

| Prefer immutable | Prefer mutable |
|---|---|
| Value objects (`Money`, `Address`, `Email`) | Entities with tracked lifecycle (`Order`, `User`, `Account`) |
| Objects shared across threads | Objects confined to a single thread |
| Objects returned from methods as results | Objects built incrementally (Builder pattern) |
| Configuration/settings objects | Stateful resources (connections, caches) |

---

## Tradeoff 5: Checked vs Unchecked Exceptions

**Checked exceptions** force callers to handle or declare the exception. They make failure paths explicit in the method signature.

**Unchecked exceptions** (RuntimeException and subclasses) propagate freely. Callers aren't forced to handle them at every call site.

```java
// Checked — caller is forced to acknowledge failure
public Order findOrder(String id) throws OrderNotFoundException {
    return repository.findById(id)
                     .orElseThrow(() -> new OrderNotFoundException(id));
}

// Caller must handle or declare
try {
    Order order = service.findOrder(id);
} catch (OrderNotFoundException e) {
    // handle it
}

// Unchecked — propagates to a global handler
public Order findOrder(String id) {
    return repository.findById(id)
                     .orElseThrow(() -> new OrderNotFoundException(id)); // extends RuntimeException
}

// Caller can ignore — global exception handler in the framework deals with it
Order order = service.findOrder(id);
```

Modern Java style (Spring, production APIs) strongly prefers unchecked exceptions for **domain errors** (not found, invalid state, business rule violation). Checked exceptions are appropriate for **recoverable I/O failures** — when the caller genuinely needs to decide what to do differently.

| Use checked | Use unchecked |
|---|---|
| Caller must handle differently based on the exception type | Caller cannot meaningfully recover from the exception |
| I/O operation that can fail in recoverable ways | Business rule violations (`OrderAlreadyCancelledException`) |
| External API contracts where failure handling is mandatory | "Not found" scenarios handled by a global handler |

---

## Tradeoff 6: Data Class vs Rich Domain Object

**Anemic domain model**: classes that hold data (getters/setters) with all logic in separate service classes. Simple to understand, works well with ORMs and serialization frameworks.

**Rich domain model**: classes that encapsulate both data and behaviour — validation, state transitions, invariant enforcement. Harder to map to/from persistence, but keeps business logic inside the domain object where it can protect its own invariants.

```java
// Anemic — data bag; logic is in OrderService
public class Order {
    private String id;
    private String status;
    private List<OrderItem> items;

    public String getId()       { return id; }
    public void setId(String id){ this.id = id; }
    public String getStatus()   { return status; }
    public void setStatus(String s) { this.status = s; }
    // ... setters for everything
}

// Anyone can call order.setStatus("CONFIRMED") bypassing payment validation

// Rich — logic in the entity; invariants protected
public class Order {
    private final String   id;
    private OrderStatus    status = OrderStatus.PENDING;
    private PaymentMethod  paymentMethod;
    private final List<OrderLine> lines = new ArrayList<>();

    // No public setters — state changes only through meaningful operations
    public void addLine(Product product, Quantity quantity) { ... }

    public void setPaymentMethod(PaymentMethod method) {
        if (this.status != OrderStatus.PENDING)
            throw new IllegalStateException("Cannot change payment on a non-pending order");
        this.paymentMethod = Objects.requireNonNull(method);
    }

    public void confirm() {
        if (paymentMethod == null)
            throw new IllegalStateException("No payment method");
        if (lines.isEmpty())
            throw new IllegalStateException("No items in order");
        this.status = OrderStatus.CONFIRMED;
    }
}
```

| Anemic model fits | Rich model fits |
|---|---|
| CRUD-heavy applications with simple rules | Complex domain with invariants to protect |
| High ORM/serialization compatibility requirement | Domain rules that must be enforced regardless of caller |
| Distributed teams less familiar with DDD | Bounded context with its own deployment boundary |
| Simple reads where logic stays in services | Entities with complex state machines |

---

## Tradeoff 7: Performance vs Clarity

Performance and readability are in constant tension. The readable code is the baseline. Optimise only when a profiler or benchmark proves a bottleneck.

```java
// Readable — allocates an Optional on every call
public Optional<Order> findLatestOrder(Customer customer) {
    return customer.orders().stream()
                   .max(Comparator.comparing(Order::createdAt));
}

// Marginally faster — no Optional allocation, but returns null
public Order findLatestOrderOrNull(Customer customer) {
    return customer.orders().stream()
                   .max(Comparator.comparing(Order::createdAt))
                   .orElse(null);
}
```

The `Optional` allocation is nanoseconds. The `null` it avoids could cause a `NullPointerException` that takes hours to debug. **The `Optional` version is correct. Optimise when you have profiler data showing this is the bottleneck** — which is almost never.

The general rule: write the clear, correct version first. Profile before you optimise. When you do optimise, document why.

---

## A Framework for Making Tradeoffs in an Interview

When you face a design decision in an interview, use this structure:

1. **Name the decision**: "I need to decide whether to use inheritance or composition here."
2. **State the options**: "The options are X and Y."
3. **Name the tradeoffs**: "X trades [benefit] for [cost]. Y trades [benefit] for [cost]."
4. **State the context constraint**: "Given that [context — e.g., we have multiple providers, we need testability], ..."
5. **Make the call**: "...I'll use Y, because the [benefit] is more valuable here than the [cost]."
6. **Acknowledge what you gave up**: "The cost is [X], which I'd revisit if [condition]."

This is what senior engineers sound like. It is not about always picking the right answer — it's about demonstrating that you understand the consequences of your choices.

---

## Common Interview Tradeoff Questions

| Question | What they're testing |
|---|---|
| "Would you use an abstract class or an interface here?" | Shared impl vs contract; when to use each |
| "How would you handle this if there were 10 payment providers?" | OCP, Strategy pattern, extensibility thinking |
| "Would you use checked or unchecked exceptions?" | Error handling philosophy, recovery vs fail-fast |
| "Is this design testable?" | DIP, composition, separation of concerns |
| "What happens when this service needs to support multiple databases?" | DIP, repository pattern, abstraction design |
| "How would you make this thread-safe?" | Immutability, synchronisation, concurrency tradeoffs |

---

## Key Takeaways

- Every design decision has a cost — name it explicitly when making a choice
- **Abstraction** earns its complexity only when variation is real and present
- **Guard clauses** beat deep nesting for validation; **single exit** beats early return for result-building methods
- **Immutability** is the default for value objects; **mutability** is for entities with tracked lifecycle
- **Unchecked exceptions** for domain errors handled globally; **checked exceptions** for recoverable I/O failures
- **Rich domain models** protect invariants; **anemic models** are simpler but allow invalid state to be created from anywhere
- Profile before optimising: never sacrifice clarity for unproven performance gains
- In interviews: name the decision, state both options, state both tradeoffs, pick one, acknowledge the cost
