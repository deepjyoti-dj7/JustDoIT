# LLD Cheat Sheet

A dense, scannable reference for everything in Low-Level Design. Use this as a last-mile revision guide before an interview, or as a quick lookup during design reviews.

---

## SOLID Principles — Quick Reference

| Principle | One-line definition | Violation signal | Fix |
|---|---|---|---|
| **SRP** | One reason to change | Class name has "and"; multiple stakeholder teams modify it | Split by actor/responsibility |
| **OCP** | Open for extension, closed for modification | New type requires editing an existing switch/if-else | Extract interface + implement new class |
| **LSP** | Subtypes fully substitutable | `UnsupportedOperationException` in override; empty override; `instanceof` in client | Redesign hierarchy; use composition |
| **ISP** | No client forced to depend on unused methods | Fat interface; implementors throw for unused methods | Split interface by client need |
| **DIP** | High-level modules depend on abstractions | `new ConcreteClass()` inside a service | Constructor-inject the interface |

---

## Design Patterns — Decision Table

| Problem | Pattern | Key structure |
|---|---|---|
| Algorithm varies by context | **Strategy** | Interface + multiple implementors; inject into context |
| Object behaviour changes per state | **State** | Interface per state; context delegates to current state |
| One-to-many event notification | **Observer** | Subject holds `List<Observer>`; calls `update()` on all |
| Add behaviour without subclassing | **Decorator** | Wrapper implements same interface; delegates + adds behaviour |
| Create objects without knowing exact class | **Factory Method** | Abstract `create()` method; subclass decides the class |
| Create families of related objects | **Abstract Factory** | Interface for each object family; concrete factory per variant |
| Build complex objects step by step | **Builder** | Fluent setters; `build()` validates and constructs |
| Single instance globally | **Singleton** | Private constructor; `getInstance()` with lazy init + double-check |
| Decouple request from execution | **Command** | `execute()` / `undo()` interface; invoker doesn't know receiver |
| Algorithm skeleton with swappable steps | **Template Method** | Abstract class; `final` template method calls abstract steps |
| Simplified interface to subsystem | **Facade** | Thin class delegates to subsystem; no logic of its own |
| Tree of objects treated uniformly | **Composite** | `Component` interface; `Leaf` and `Composite` both implement it |
| Object traversal without exposing internals | **Iterator** | `hasNext()` / `next()` interface; collection provides iterator |
| Lazy instantiation / access control | **Proxy** | Same interface as real object; controls/delays access |

---

## UML Class Diagram — Notation Reference

```
+-------------------------------+
|    ClassName                  |  <- PascalCase; <<stereotype>> if needed
+-------------------------------+
|  - privateField: Type         |  <- - private, + public, # protected, ~ package
|  + publicField: Type          |
+-------------------------------+
|  + publicMethod(): ReturnType |
|  # protectedMethod(): void    |
+-------------------------------+
```

### Relationship arrows

| Notation | Name | Meaning | Java signal |
|---|---|---|---|
| `A *-- B` filled diamond | Composition | B is part of A; dies with A | `new B()` inside A |
| `A o-- B` hollow diamond | Aggregation | A holds B; B lives independently | B passed into A's constructor |
| `A --> B` open arrow | Association | A holds a field of type B | `private B b;` |
| `A ..> B` dashed arrow | Dependency | A uses B in a method | B appears as method param |
| `A <\|-- B` solid triangle | Inheritance | B extends A | `class B extends A` |
| `A <\|.. B` dashed triangle | Realization | B implements A | `class B implements A` |

### Multiplicity

| Symbol | Meaning |
|---|---|
| `"1"` | Exactly one |
| `"*"` | Zero or more |
| `"0..1"` | Optional (zero or one) |
| `"1..*"` | At least one |
| `"2..5"` | Between two and five |

---

## OOP Relationships — Key Distinctions

| Question | Relationship |
|---|---|
| Can B exist without A? **No** | Composition `*--` |
| Can B exist without A? **Yes** | Aggregation `o--` |
| Does A hold a permanent reference to B? | Association `-->` |
| Does A use B only in one method call? | Dependency `..>` |
| Does B fully honour A's contracts? | Inheritance `<\|--` |
| Does B fulfil A's interface contract? | Realization `<\|..` |

**Composition** → `new B()` inside A, B created and destroyed by A  
**Aggregation** → B passed into A's constructor, B can outlive A  
**Association** → A has a field `private B ref;`  
**Dependency** → B only in `void method(B param)` or local variable

---

## Common Patterns in LLD Interviews

### State Pattern template

```java
public interface State {
    void handle(Context ctx);
    // OR — one method per trigger
    void onEvent1(Context ctx);
    void onEvent2(Context ctx);
}

public class Context {
    private State state;
    public void setState(State s) { this.state = s; }
    public void trigger() { state.handle(this); }
}
```

### Strategy Pattern template

```java
public interface Strategy {
    Result execute(Input input);
}

public class Context {
    private final Strategy strategy;  // injected

    public Context(Strategy strategy) { this.strategy = strategy; }

    public Result doWork(Input input) {
        return strategy.execute(input);
    }
}
```

### Observer Pattern template

```java
public interface Observer {
    void update(Event event);
}

public class Subject {
    private final List<Observer> observers = new ArrayList<>();

    public void addObserver(Observer o)    { observers.add(o); }
    public void removeObserver(Observer o) { observers.remove(o); }

    protected void notifyObservers(Event event) {
        observers.forEach(o -> o.update(event));
    }
}
```

### Decorator Pattern template

```java
public interface Component {
    Result operation();
}

public abstract class Decorator implements Component {
    protected final Component wrapped;
    protected Decorator(Component wrapped) { this.wrapped = wrapped; }
}

public class ConcreteDecorator extends Decorator {
    public ConcreteDecorator(Component wrapped) { super(wrapped); }

    @Override
    public Result operation() {
        // before
        Result result = wrapped.operation();
        // after
        return result;
    }
}
```

### Repository Pattern template

```java
public interface Repository<T, ID> {
    void save(T entity);
    Optional<T> findById(ID id);
    List<T> findAll();
    void delete(ID id);
}

// Production implementation
public class JdbcRepository implements Repository<Order, String> { ... }

// Test double
public class InMemoryRepository implements Repository<Order, String> {
    private final Map<String, Order> store = new HashMap<>();
    // ...
}
```

---

## Java OOP — Quick Reference Card

### Access modifiers

| Modifier | Class | Package | Subclass | World |
|---|---|---|---|---|
| `public` | Y | Y | Y | Y |
| `protected` | Y | Y | Y | N |
| *(none)* | Y | Y | N | N |
| `private` | Y | N | N | N |

### Key keywords for design

| Keyword | Use for |
|---|---|
| `final class` | Prevent subclassing (Value Objects) |
| `final` method | Prevent overriding (Template Method skeleton) |
| `abstract class` | Shared implementation + contract; cannot instantiate |
| `interface` | Pure contract; default methods for optional behaviour |
| `sealed` (Java 17+) | Closed hierarchy; exhaustive switch |
| `record` (Java 16+) | Immutable value object with auto-equals/hashCode |

### Immutable Value Object template

```java
public final class Money {
    private final long   amountCents;
    private final String currency;

    public Money(long amountCents, String currency) {
        if (amountCents < 0) throw new IllegalArgumentException("Negative money");
        this.amountCents = amountCents;
        this.currency    = Objects.requireNonNull(currency);
    }

    public Money add(Money other) {
        if (!this.currency.equals(other.currency))
            throw new IllegalArgumentException("Currency mismatch");
        return new Money(this.amountCents + other.amountCents, this.currency);
    }

    public Money multiply(double factor) {
        return new Money(Math.round(amountCents * factor), currency);
    }

    public long amountCents() { return amountCents; }
    public String currency()  { return currency; }

    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Money m)) return false;
        return amountCents == m.amountCents && currency.equals(m.currency);
    }
    @Override public int hashCode() { return Objects.hash(amountCents, currency); }
    @Override public String toString() { return currency + " " + amountCents / 100.0; }
}
```

---

## Naming Quick Reference

| What | Convention | Example |
|---|---|---|
| Class / Interface | PascalCase noun | `OrderFulfillmentService` |
| Method (command) | camelCase verb phrase | `placeOrder()`, `cancelBooking()` |
| Method (query) | camelCase noun/find/get | `findOrderById()`, `totalAmount()` |
| Boolean method | `is/has/can/should` prefix | `isEligibleForDiscount()`, `hasPaymentMethod()` |
| Variable | camelCase noun | `unshippedOrders`, `taxRatePercent` |
| Constant | UPPER_SNAKE_CASE | `MAX_RETRY_ATTEMPTS` |
| Package | lowercase, feature-first | `com.company.orders.domain` |
| Interface | Clean concept name | `PaymentGateway`, `OrderRepository` |
| Implementation | Qualifier + Interface name | `StripePaymentGateway`, `JdbcOrderRepository` |

---

## SOLID Violations — Instant Recognition

```
UnsupportedOperationException in override   → LSP violation
Empty override body                          → LSP violation
instanceof check in client code             → LSP violation
new ConcreteClass() inside a service        → DIP violation
if/else chain on type string                → OCP violation
Class name: XxxManager, XxxHelper, XxxUtils → SRP violation (probably)
Interface with 10+ methods                  → ISP violation
Method that tests need to mock 6 things     → DIP + SRP violation
Getter chain: a.getB().getC().getD()        → Law of Demeter violation
```

---

## Interview Framework — 5-Step Reminder

```
1. CLARIFY    (2-3 min)  — actors, scale, scope, constraints, edge cases
2. ENTITIES   (3-4 min)  — nouns = classes; entity vs value object vs enum
3. RELATIONS  (3-4 min)  — composition / aggregation / association; multiplicity on every line
4. PATTERNS   (2-3 min)  — identify variation points; apply State/Strategy/Observer/Decorator
5. IMPLEMENT  (remaining) — core entity + key interface + one representative method with logic
                          — defer persistence/HTTP behind interfaces explicitly
```

---

## Common LLD Problems — Pattern Map

| Problem | State pattern? | Strategy pattern? | Observer pattern? |
|---|---|---|---|
| Parking Lot | SlotStatus (available/occupied/maintenance) | Pricing (hourly/flat/tiered); SlotAssignment | Notify when lot is full |
| Library System | BookItem (available/loaned/reserved/lost) | Search (by title/author/ISBN) | Notify waitlist on return |
| ATM Machine | ATM states (idle/card/pin/transaction) | Withdrawal (daily limit varies) | N/A |
| Elevator | Door (open/closed); Direction (up/down/idle) | Dispatch (nearest/load-balanced) | Notify floor arrival |
| Vending Machine | Machine states (idle/selected/payment) | Change dispensing (greedy/DP) | N/A |
| Notification Service | N/A | Channel (email/SMS/push); Template | Fan-out to subscribers |
| Chess | Game states (active/check/checkmate) | Move validation per piece type | N/A |
| Hotel Booking | Room (available/booked/occupied/maintenance) | Pricing (seasonal/weekend) | Notify on cancellation |

---

## Cohesion vs Coupling — Quick Definitions

| Concept | Goal | Measure |
|---|---|---|
| **Cohesion** | Elements within a class belong together | High cohesion = good |
| **Coupling** | Dependency between classes | Low coupling = good |
| **Efferent coupling (Ce)** | How many classes this class depends on | Low for domain classes |
| **Afferent coupling (Ca)** | How many classes depend on this class | High for stable abstractions |

> High cohesion + low coupling = maintainable design

---

## Exception Handling — Quick Reference

| Exception type | Use case | Java base class |
|---|---|---|
| Domain violation | Business rule broken (`OrderAlreadyCancelled`) | `RuntimeException` |
| Not found | Requested entity doesn't exist | `RuntimeException` |
| Validation failure | Input fails a business rule | `RuntimeException` |
| Payment failure | External system declined | `RuntimeException` |
| Recoverable I/O | DB connection lost (retry logic needed) | `Exception` (checked) |

```java
// Domain exceptions — extend RuntimeException (unchecked)
public class OrderNotFoundException extends RuntimeException {
    public OrderNotFoundException(String orderId) {
        super("Order not found: " + orderId);
    }
}

public class PaymentDeclinedException extends RuntimeException {
    public PaymentDeclinedException(String reason) {
        super("Payment declined: " + reason);
    }
}
```

---

## Anti-Pattern Quick Lookup

| Anti-pattern | Key symptom | SOLID violated | Fix |
|---|---|---|---|
| God Object | 500+ line class with 20+ methods | SRP | Responsibility audit → extract collaborators |
| Spaghetti Code | 100+ line methods, mixed abstraction levels | SRP | Extract Method; Step-Down Rule |
| Tight Coupling | `new ConcreteClass()` in services | DIP | Constructor-inject interfaces |
| Premature Optimization | Caches, pools without profiler data | — | Clean code first; profile first |
| Fragile Base Class | Subclass breaks when parent changes | LSP | Favour composition over inheritance |
| Law of Demeter | `a.getB().getC().getD()` chains | ISP/SRP | Tell, don't ask; expose computed values |
| Anemic Domain Model | Domain objects are pure data bags | SRP | Move business logic into the entity |

---

## The 30-Second Design Quality Test

Ask these 5 questions about any class:

1. Can I describe it in **one sentence without "and"**?
2. Can I test it with **only plain Java objects** (no DB, no network)?
3. Does adding a new **variant** require only a new class (no edits to existing ones)?
4. Does every **override** deliver at least as much as the parent promised?
5. Does every dependency come in through the **constructor as an interface**?

If all five are yes: the class is well-designed.  
If any is no: you have a specific SOLID principle to apply.
