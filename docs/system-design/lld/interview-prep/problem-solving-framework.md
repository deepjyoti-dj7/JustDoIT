# Problem-Solving Framework

A consistent, structured approach to LLD problems is more valuable than memorising solutions. Every interviewer will modify the classic problems — add requirements, change constraints, introduce edge cases. A reliable framework ensures you produce good designs under time pressure even for problems you've never seen.

This framework is distilled from the approach used in *Grokking the Object-Oriented Design Interview* and refined with production design practice.

> **The goal**: move from "I'll design a parking lot" to "I'll identify the domain model, draw relationships, locate variation points, apply patterns, and implement a representative slice" — reliably, in any interview.

---

## The 5-Step Framework

```
Step 1: Clarify Requirements          (2-3 minutes)
Step 2: Identify Core Entities        (3-4 minutes)
Step 3: Define Relationships          (3-4 minutes)
Step 4: Identify Variation Points     (2-3 minutes)
Step 5: Implement + Narrate           (remaining time)
```

---

## Step 1: Clarify Requirements

Never start drawing before you have enough information to make real decisions.

### What to ask

| Category | Example questions |
|---|---|
| **Scale & deployment** | Single instance or distributed? Concurrent users? |
| **Actors & roles** | Who uses the system? What can each do? |
| **Core operations** | What are the must-have operations? What is out of scope today? |
| **Constraints** | Capacity limits? Time constraints? Business rules? |
| **Edge cases** | What happens when X is full? What if payment fails? |

### Example: Parking Lot clarification

> "Before I start — a few questions. Is this a single parking lot or a multi-location system? Do we need to handle different vehicle types like motorcycles, cars, and trucks? Should I support multiple floors? Is pricing hourly, flat-rate, or configurable? Do I need to handle the payment processing, or is that out of scope and I just need to calculate the fee?"

Getting answers to these five questions in 2 minutes produces a design 10x more accurate than jumping straight to a whiteboard.

### Pro tip: Define what you're NOT building

"I'll assume payment processing is external — I'll model a `PaymentService` interface and not implement the gateway. I'll also not model the physical entry/exit gates — just the software logic."

Scoping explicitly shows systems thinking and prevents you from going off on infrastructure tangents.

---

## Step 2: Identify Core Entities

Entities are the **nouns** of your problem. They become classes.

### The NVA (Noun-Verb-Attribute) Exercise

For any problem description, perform this three-pass exercise in your head or on the whiteboard:

1. **Underline the nouns** — these are candidate classes
2. **Circle the verbs** — these are candidate methods
3. **Identify the adjectives/state descriptors** — these become enums or fields

**Example** — *"Members can borrow books from the library. Each book has one or more physical copies. A member can borrow up to 5 books. Overdue books incur a daily fine."*

- **Nouns**: Member, Book, Library, Copy (BookItem), Fine
- **Verbs**: borrow, return, incur, calculate (fine)
- **States**: available/loaned/overdue (for BookItem), active/suspended (for Member)

### Entity Classification

Not all nouns become full classes. Classify each:

| Type | Characteristics | Java representation |
|---|---|---|
| **Entity** | Has unique identity, mutable state, lifecycle | Class with `id` field |
| **Value Object** | Identity by all fields, immutable, no lifecycle | `final class` with no setters |
| **Enum** | Small, fixed set of named values | `enum` |
| **Service** | Stateless orchestration | Class with injected dependencies |
| **Repository** | Data access abstraction | Interface |

```java
// Entity — has id, mutable state
public class BookItem {
    private final String     barcode;      // identity
    private BookItemStatus   status;        // mutable state
    private LocalDate        dueDate;       // mutable state
}

// Value Object — immutable, equality by all fields
public final class Money {
    private final long   amountCents;
    private final String currency;
    // no setters; operations return new Money
}

// Enum — small fixed set
public enum BookItemStatus { AVAILABLE, LOANED, RESERVED, LOST }
```

---

## Step 3: Define Relationships

Relationships are the **edges** of your class diagram. Each one is a design decision with consequences.

### The Three Questions

For every pair of entities, ask:

1. **Does one own the other?** (Can B exist without A?) → Composition if no; Aggregation if yes
2. **Does one know about the other permanently?** → Association
3. **Does one only need the other briefly, in a method call?** → Dependency (parameter)

### Decision guide in practice

```
Library problem:
  Library owns BookItems  → Library *-- BookItem  (composition: item doesn't exist without the library)
  BookItem references Book → BookItem --> Book     (association: book catalogue exists independently)
  Member borrows BookItem  → Member --> BookItem   (association: both exist independently)
  LibraryService uses Repository → LibraryService ..> BookRepository (dependency: method parameter/injection)
```

### Draw multiplicity on every line

| Multiplicity | Means |
|---|---|
| `"1"` | Exactly one |
| `"*"` | Zero or more |
| `"0..1"` | Optional |
| `"1..*"` | At least one |

Leaving multiplicity off forces the interviewer to ask — and reveals that you haven't thought through the cardinality.

---

## Step 4: Identify Variation Points

A variation point is a behaviour that **might change or come in multiple forms**. These are where patterns apply.

### The Variation Point Questions

| Question | Pattern to apply |
|---|---|
| Does this behaviour vary by type? (pricing, discount, vehicle type) | **Strategy** |
| Does the object change how it behaves based on its current state? | **State** |
| Do multiple objects need to react when something changes? | **Observer** |
| Do you need to create objects without knowing the exact class? | **Factory** |
| Do you need to add behaviour without modifying the original class? | **Decorator** |
| Do you have an algorithm skeleton with swappable steps? | **Template Method** |
| Do you need to decouple request creation from execution? | **Command** |

### Applying variation analysis to Parking Lot

```
Variation point 1: How pricing is calculated
  → varies by time-of-day, vehicle type, membership
  → Apply: PricingStrategy interface

Variation point 2: Slot assignment algorithm
  → might change: nearest available, specific floor preference, reserved spots
  → Apply: SlotAssignmentStrategy interface

Variation point 3: Ticket state (active, paid, expired)
  → behaviour varies per state: can extend time if active, cannot if expired
  → Apply: State pattern (or simple status enum with guard clauses if states are simple)

Variation point 4: Payment methods
  → Cash, card, digital wallet — each has different charge flow
  → Apply: PaymentStrategy interface
```

### Pattern application: the minimum viable interface

```java
// PricingStrategy — extracted because pricing WILL change
public interface PricingStrategy {
    Money calculateFee(Ticket ticket);
}

// SlotAssignmentStrategy — extracted because we might want "nearest to entrance"
public interface SlotAssignmentStrategy {
    Optional<ParkingSlot> findSlot(List<ParkingFloor> floors, VehicleType vehicleType);
}

// Wired in the lot constructor — easy to swap
public class ParkingLot {
    private final PricingStrategy        pricing;
    private final SlotAssignmentStrategy slotAssignment;

    public ParkingLot(PricingStrategy pricing, SlotAssignmentStrategy slotAssignment) {
        this.pricing        = pricing;
        this.slotAssignment = slotAssignment;
    }
}
```

---

## Step 5: Implement + Narrate

Use the remaining time to write representative code. The goal is not to implement everything — it's to demonstrate design quality and domain understanding.

### What to prioritise

1. **Core entity** with its fields, invariant-enforcing constructor, and key methods
2. **The most interesting method** — the one with real business logic (not trivial getters)
3. **The key interface** that enables extensibility
4. **One representative implementation** of that interface

### What to defer explicitly

"I'd put persistence behind a `Repository` interface and inject it — I won't implement the JDBC/SQL here, but the domain logic is isolated from it."

This signals architectural awareness without burning time on infrastructure.

### Narration structure

For every non-trivial decision, say:

> "I'm making [class/field/method] [this way] because [reason]. The alternative would be [alternative], but that has [downside] in this context."

Example:
> "I'm using `synchronized` on `occupy()` in `ParkingSlot` because two concurrent checkout requests could both see the slot as available and double-assign it. An alternative is optimistic locking at the database level, but for an in-memory model, synchronized is simpler and correct."

---

## Handling Curveball Requirements

Interviewers will add requirements mid-design. This is intentional — they want to see how your design handles change.

### The extension response pattern

When a new requirement arrives:

1. **Absorb it calmly** — "Good requirement. Let me see where that fits."
2. **Identify the impact** — "That affects the `PricingService` and possibly the `Ticket`."
3. **Extend via the existing pattern** — "I can add a `PeakHourPricingStrategy` that wraps the base strategy — no changes to existing strategies."
4. **Acknowledge if refactoring is needed** — "If we hadn't used the Strategy pattern, this would require a big if/else chain. This design handles it cleanly."

### Common curveballs and their responses

| Curveball | OOP Response |
|---|---|
| "Now add a new vehicle type (EV)" | Add `class ElectricVehicle extends Vehicle` — Strategy decides slot compatibility |
| "Support peak-hour pricing" | Add `PeakHourDecorator implements PricingStrategy` wrapping existing strategy |
| "Notify admins when lot is 90% full" | Observer pattern — `ParkingLot` is the subject, `AdminNotifier` is the listener |
| "Book reservation in advance" | New state: `RESERVED`; `BookItem` state machine gains `reserve()` transition |
| "Multiple elevators" | `ElevatorController` holds `List<Elevator>` and a `DispatchStrategy` |

---

## The 20-Minute LLD Skeleton

A repeatable template for any problem in a 20-minute slot:

```
[0-2 min]   Clarify requirements — 3-5 targeted questions
[2-6 min]   Entity identification — list classes with key attributes
[6-10 min]  Relationships — draw class diagram with multiplicities
[10-13 min] Variation points — identify and name the strategy/state interfaces
[13-19 min] Core implementation — key entity + key interface + one method with logic
[19-20 min] Summary — "Here's what I'd add next: persistence behind Repository, 
             concurrency handling with synchronised blocks, and notification via Observer 
             when state changes"
```

---

## Interview Talking Points

**1. How do you avoid analysis paralysis in an LLD interview?**
> "I follow a strict time-box. I spend at most 3 minutes clarifying, 4 minutes identifying entities, 4 minutes drawing relationships, then I start writing code. If I get stuck on a decision, I make it and state the assumption: 'I'm assuming pricing is hourly for now — the Strategy pattern makes it easy to change later.' Making a stated assumption is always better than stalling silently."

**2. How do you show SOLID principles without being asked about them explicitly?**
> "By designing in a way that applies them naturally. When I extract a `PricingStrategy` interface, that's OCP — I don't name it. When I inject dependencies through the constructor, that's DIP — I don't announce it. When I split `Book` from `BookItem`, that's SRP. I let the design speak. If the interviewer asks why I made a particular decision, then I can explain the principle. Naming principles unprompted while drawing feels like recitation; demonstrating them while designing shows understanding."

**3. How do you handle requirements that conflict with your existing design?**
> "I treat it as a design test. A new requirement that breaks the existing design usually means I over-fitted the initial design to the first requirements rather than identifying the real variation points. I acknowledge this: 'This requirement shows that pricing is a variation point I should have extracted earlier. Let me refactor the PricingService to use the Strategy pattern now.' Being comfortable refactoring mid-interview shows design maturity — it's not failure, it's the design process working correctly."

---

## Key Takeaways

- **5 steps**: Clarify → Entities → Relationships → Variation Points → Implement + Narrate
- **Clarify first** — 2-3 questions prevent a whole design going in the wrong direction
- **NVA exercise**: nouns = classes, verbs = methods, state descriptors = enums/fields
- **Entity types**: entity (has id + lifecycle), value object (immutable, equality by fields), service (stateless orchestrator)
- **Every relationship**: ask if B can exist without A (composition vs aggregation), then draw multiplicity on both ends
- **Variation points**: locate the `if-else-on-type` and `switch-on-state` — these are where patterns live
- **Narrate decisions** — the reasoning is evaluated as much as the code
- Handle curveballs by **extending through existing patterns** — if you can't, acknowledge and refactor cleanly
