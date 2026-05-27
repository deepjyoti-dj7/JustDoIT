# Code Review Checklist

A structured checklist for evaluating LLD quality — whether reviewing a colleague's PR, assessing your own design in an interview, or auditing a system you've just joined.

Each item maps to a principle, pattern, or anti-pattern covered in this knowledge base. Use it both ways: as a quality gate before submitting code, and as a diagnostic when something feels wrong but you can't name it.

> **Interview use**: Run through this checklist mentally before presenting your design. It catches the most common mistakes that cause interviewers to probe — missing multiplicity, concrete dependencies, fat interfaces, missing edge cases.

---

## Section 1: Class Design

### 1.1 Single Responsibility

- [ ] Can I describe this class in **one sentence without "and" or "or"**?
- [ ] Does the class have **one reason to change** — one stakeholder who could drive a modification?
- [ ] Are there methods that use a disjoint subset of the fields? (Signal: possible split needed)
- [ ] Is the class name **specific**? (Reject: `Manager`, `Helper`, `Utils`, `Processor` without qualification)

```java
// FAIL — two responsibilities in one sentence
// "UserService manages users AND sends welcome emails"

// PASS — single sentence, one reason to change
// "PayrollCalculator calculates employee net pay based on salary and tax rules"
```

### 1.2 Encapsulation

- [ ] Are **all fields private**? No `public` or `protected` fields.
- [ ] Are **setters absent** for fields that should not change after construction? (Use constructor or factory)
- [ ] Do setters **validate** their input rather than blindly assigning?
- [ ] Does the class **protect its invariants**? (E.g., `balance >= 0` always; cannot add OrderItem after confirmation)
- [ ] Does the class expose **behaviour**, not just data? (Avoid "getter-only" anemic models for domain objects)

```java
// FAIL — raw field exposure
public class Order {
    public List<OrderItem> items; // any caller can clear the list
}

// PASS — behaviour exposed; structure hidden
public class Order {
    private final List<OrderItem> items = new ArrayList<>();
    public void addItem(Product p, Quantity q) { /* validate + add */ }
    public List<OrderItem> items() { return Collections.unmodifiableList(items); }
}
```

### 1.3 Abstraction Level

- [ ] Is every method at the **same level of abstraction**? (No high-level domain logic next to SQL/HTTP)
- [ ] Does the class name set the correct level of abstraction? (`OrderService` should not contain JDBC)
- [ ] Are **infrastructure details** (SQL, HTTP, email) behind interfaces and injected?

---

## Section 2: Relationships

### 2.1 Relationship Type Correctness

- [ ] Is each `*--` (composition) relationship where **B cannot exist without A**? Verify B is created inside A.
- [ ] Is each `o--` (aggregation) relationship where **B can exist independently**? Verify B is passed in, not created.
- [ ] Is each `-->` (association) a **permanent reference** that the class holds as a field?
- [ ] Is each `..>` (dependency) a **transient use** — appears only as a method parameter, not a field?

```java
// Composition — OrderItem created inside Order, meaningless outside it
public class Order {
    private final List<OrderItem> items = new ArrayList<>();
    public void addItem(...) { items.add(new OrderItem(...)); }
}

// Aggregation — Employee exists before and after Department
public class Department {
    private final List<Employee> members;
    public Department(List<Employee> members) { this.members = new ArrayList<>(members); }
}
```

### 2.2 Multiplicity

- [ ] Is **multiplicity marked at both ends** of every relationship line?
- [ ] Is there a `"0..1"` or `"1"` where an unbounded `"*"` would be wrong?
- [ ] Are optional references modelled as `Optional<T>` in Java, not nullable fields?

### 2.3 Direction

- [ ] Does every association arrow point in the **direction of navigation need**?
- [ ] Are bidirectional associations **necessary**? (Add reverse direction only if runtime navigation requires it)
- [ ] If bidirectional, is **one method responsible** for maintaining both sides consistently?

---

## Section 3: SOLID Principles

### 3.1 Open-Closed Principle

- [ ] Can a new **variant** (payment method, notification channel, discount type) be added by writing a **new class** without editing existing ones?
- [ ] Are there `if-else` or `switch` chains on type strings or enum values that would require editing when a new type is added?
- [ ] Do service methods depend on **interfaces**, not concrete classes?

### 3.2 Liskov Substitution

- [ ] Does any override throw `UnsupportedOperationException`? (Automatic fail)
- [ ] Does any override have a **stricter precondition** than the parent?
- [ ] Does any override silently do nothing (empty body)?
- [ ] Does any client code do `instanceof` checks before calling a method? (Signals LSP violation in the hierarchy)

```java
// FAIL — LSP violation
@Override
public void addItem(CartItem item) {
    throw new UnsupportedOperationException("Read-only cart");
}
```

### 3.3 Interface Segregation

- [ ] Can any **implementor honestly implement** every method in each interface?
- [ ] Do any implementations have `throw new UnsupportedOperationException()` stubs?
- [ ] Do clients use **only the methods they actually call**? (Fat interface check: is the client forced to import unused methods?)
- [ ] Could the interface be **split into smaller roles** that separate read from write, or query from command?

### 3.4 Dependency Inversion

- [ ] Does any class create its dependencies with `new ConcreteClass()`? (Should be constructor-injected)
- [ ] Do high-level classes (`OrderService`) import from low-level packages (`infrastructure.jdbc`)?
- [ ] Are all **infrastructure classes** (JDBC, HTTP, SMTP) **injected through interfaces**?
- [ ] Can the class be **fully tested** with only plain Java objects — no Spring context, no database, no network?

---

## Section 4: Naming

- [ ] Does the **class name** describe what it is, not what it does?
- [ ] Does the **method name** clearly state what the method does or returns?
- [ ] Do **boolean methods** start with `is`, `has`, `can`, or `should`?
- [ ] Do **command methods** use verb phrases? (`placeOrder`, `cancelBooking`)
- [ ] Do **query methods** use noun phrases or `get`/`find`/`calculate`? (`findOrderById`, `calculateShipping`)
- [ ] Are names from the **domain vocabulary** — words a business stakeholder would recognise?
- [ ] Are variables named by **intent**, not by type? (`unshippedOrders`, not `orderList`)

---

## Section 5: Error Handling

- [ ] Are **null checks replaced** by `Optional<T>` or precondition validation at boundaries?
- [ ] Are **domain exceptions** meaningful and named? (`OrderNotFoundException`, `PaymentDeclinedException`)
- [ ] Do methods throw **unchecked exceptions** for domain errors (not found, invalid state)?
- [ ] Are **checked exceptions** reserved for recoverable I/O failures only?
- [ ] Is the exception thrown **at the point of detection** (not swallowed and returned as null)?
- [ ] Are there **no empty catch blocks** (`catch (Exception e) {}`)?

```java
// FAIL — swallowed exception
try {
    order = orderRepo.findById(id);
} catch (Exception e) {
    // silent — caller gets null
}

// PASS — fail fast with meaningful exception
public Order findOrder(String id) {
    return orderRepo.findById(id)
                    .orElseThrow(() -> new OrderNotFoundException(id));
}
```

---

## Section 6: State Management

- [ ] Are **state transitions** explicit? (Not scattered if-else checking status strings)
- [ ] Can the object be put into an **invalid state** by calling methods in the wrong order?
- [ ] Are invalid state transitions **rejected with clear exceptions**?
- [ ] If there are 3+ states with different per-state behaviour, is the **State pattern applied**?
- [ ] Is there only **one place** where each state variable is mutated?

```java
// FAIL — state transition scattered across callers
order.setStatus("CONFIRMED"); // caller 1
order.setStatus("CONFIRMED"); // caller 2 — no check, no validation

// PASS — transition centralised and validated
public void confirm() {
    if (status != OrderStatus.PENDING)
        throw new IllegalStateException("Only PENDING orders can be confirmed");
    this.status = OrderStatus.CONFIRMED;
}
```

---

## Section 7: Testability

- [ ] Can this class be **tested without a database**?
- [ ] Can this class be **tested without a network call**?
- [ ] Can this class be **tested without a DI container** (no `@SpringBootTest` needed for unit tests)?
- [ ] Are dependencies **injectable** through the constructor?
- [ ] Is the class small enough that test setup is **under 10 lines**?
- [ ] Are the key test cases obvious from the class's contract? (Each state transition, each validation rule)

---

## Section 8: Design Patterns (Contextual)

Use this only when you identify a pattern-shaped problem. Do not force patterns.

### State Pattern — apply when:
- [ ] Object has 3+ named states
- [ ] Behaviour varies significantly per state
- [ ] State transitions follow specific rules that should be enforced

### Strategy Pattern — apply when:
- [ ] An algorithm or behaviour has 2+ variants
- [ ] You want to swap the variant at runtime or at wiring time
- [ ] New variants should be addable without editing the context class

### Observer Pattern — apply when:
- [ ] One object's state change should notify multiple objects
- [ ] The notifying object should not know about its listeners
- [ ] Listeners can be added/removed at runtime

### Decorator Pattern — apply when:
- [ ] You want to add behaviour to an object without subclassing
- [ ] Cross-cutting concerns (logging, retry, caching) should wrap an interface

### Repository Pattern — apply when:
- [ ] Business logic should be isolated from persistence technology
- [ ] You need to swap storage mechanisms (SQL → NoSQL, real → in-memory for tests)

---

## Section 9: Code Organisation

- [ ] Is related code **packaged by feature**, not by layer?
- [ ] Do infrastructure classes (`JdbcOrderRepository`) live in a **separate package** from domain classes?
- [ ] Is package-private visibility used to **hide internal implementation details**?
- [ ] Are test classes in a **mirror structure** of the source classes?
- [ ] Is the `shared` or `common` package small and limited to **genuinely cross-cutting value objects**?

---

## Section 10: Anti-Pattern Scan

- [ ] Is there a **God Object**? (1 class, 10+ responsibilities, 500+ lines)
- [ ] Are there **getter chains** (`a.getB().getC().getD()`) — Law of Demeter violations?
- [ ] Are there **boolean flag parameters** that control internal branching?
- [ ] Is there **optimisation without measurement** — caches, pools, bit manipulation without profiler evidence?
- [ ] Are there **hardcoded strings/numbers** that represent business rules? (Extract to named constants or config)
- [ ] Are there **commented-out code blocks**? (Delete or put in version control)
- [ ] Are there methods longer than **30 lines**? (Candidate for extraction)
- [ ] Are there classes longer than **300 lines**? (Candidate for splitting)

---

## Quick Pre-Submit Checklist (30-second scan)

Before presenting your design or submitting code, run through:

```
[ ] Every class has one clear reason to change
[ ] Every field is private
[ ] Every dependency is injected (no `new ConcreteClass()` in services)
[ ] Every relationship has multiplicity marked
[ ] Every variation point is behind an interface
[ ] No UnsupportedOperationException in any override
[ ] Every exception is named and meaningful
[ ] Every boolean method starts with is/has/can/should
[ ] No method is longer than 30 lines
[ ] The class can be tested with plain Java objects
```

Ten checks. Thirty seconds. Catches 80% of common LLD mistakes.

---

## Interview Context: What Reviewers Look For

| Category | What a strong candidate does | What a weak candidate does |
|---|---|---|
| **Encapsulation** | Private fields, validation in setters, expose behaviour not data | Public fields, setters without validation, getter-only models |
| **Extensibility** | Interfaces at variation points, patterns named and applied | Switch/if-else chains on type, edits to existing classes for new types |
| **Naming** | Domain vocabulary, intent-revealing names | `data`, `obj`, `temp`, `Manager`, `Helper` |
| **Relationships** | Typed and explained (composition vs aggregation, with multiplicity) | All "has-a" with no distinction, no multiplicity |
| **Error handling** | Named exceptions, fail-fast, no silent swallowing | Null returns on failure, empty catch blocks |
| **Testability** | Constructor injection, plain-object test doubles | Untestable concrete wiring, static utility calls |

---

## Key Takeaways

- Run the **30-second checklist** before presenting any design — it catches the most common interviewer objections
- **Testability is the single most diagnostic metric**: if you can't test it with plain Java, something is wrong with the coupling
- **UnsupportedOperationException in any override** is an automatic LSP violation flag
- **Getter chains** are LoD violations hiding in plain sight — replace with Tell-Don't-Ask methods
- **Variation points unprotected by interfaces** are OCP time bombs — every new type requires editing existing code
- The checklist works both directions: pre-submit quality gate, and post-review diagnosis tool
