# KISS, DRY & YAGNI

These three principles are heuristics, not laws. They pull in different directions and conflict with each other constantly. Understanding when to apply each — and when to let one override another — is what separates experienced engineers from those who apply rules mechanically.

> **Interview relevance:** Interviewers ask these three principles not to hear definitions, but to probe your judgment. The interesting answers explain the *tensions* and how you resolve them situationally.

---

## KISS — Keep It Simple, Stupid

> "Simplicity is the ultimate sophistication." — Leonardo da Vinci
> "Everything should be made as simple as possible, but not simpler." — Albert Einstein (attributed)

KISS does not mean "write dumb code". It means: **prefer the simplest solution that correctly solves the problem**. Complexity is a liability. Every abstraction you add is something future readers must learn, understand, and maintain.

### The Two Faces of Complexity

| Type | What it looks like | Root cause |
|---|---|---|
| **Accidental** | Over-engineering, premature abstraction, clever tricks | Anxiety about future requirements |
| **Essential** | Inherent difficulty of the problem domain | The problem itself is hard |

KISS attacks accidental complexity. It has nothing to say about essential complexity — you cannot make a transaction manager "simpler" by wishing away distributed systems.

### Example: The Over-Engineered Feature Flag

```java
// BAD — solving a problem that doesn't exist yet
public interface FeatureFlagStrategy {
    boolean isEnabled(String featureName, User user);
}

public class PercentageRolloutStrategy implements FeatureFlagStrategy {
    private final Map<String, Double> rolloutPercentages;
    private final FeatureFlagRepository repository;
    private final UserSegmentationService segmentation;
    // ...
}

public class AbTestingFeatureFlagStrategy implements FeatureFlagStrategy { ... }
public class GeoBasedFeatureFlagStrategy implements FeatureFlagStrategy { ... }
public class FeatureFlagStrategyFactory { ... }
public class FeatureFlagManager {
    private final List<FeatureFlagStrategy> strategies;
    // ...
}
```

All of this to toggle one feature that has one current state.

```java
// GOOD for now — one constant, one decision point
public class Features {
    public static final boolean NEW_CHECKOUT_FLOW_ENABLED = true;
}

// Used exactly where needed
if (Features.NEW_CHECKOUT_FLOW_ENABLED) {
    return newCheckoutService.checkout(cart);
}
return legacyCheckoutService.checkout(cart);
```

If tomorrow you need percentage rollout, you add it then. The constant costs you one line to replace. The infrastructure you didn't build costs you nothing to maintain.

### KISS vs Correctness

KISS never means *incomplete*. The simplest solution that **correctly** handles all required cases is the target. A one-liner that silently swallows exceptions or ignores edge cases isn't simple — it's broken.

```java
// BAD — "simple" but incorrect: null pointer risk, silent on empty list
public String getFirstOrderId(Customer customer) {
    return customer.getOrders().get(0).getId();
}

// GOOD — simple AND correct
public Optional<String> getFirstOrderId(Customer customer) {
    return customer.getOrders().stream()
                   .findFirst()
                   .map(Order::getId);
}
```

---

## DRY — Don't Repeat Yourself

> "Every piece of knowledge must have a single, unambiguous, authoritative representation within a system."
> — Andrew Hunt & David Thomas, *The Pragmatic Programmer*

DRY is about **knowledge duplication**, not code duplication. This distinction is crucial and widely misunderstood.

### Code Duplication vs Knowledge Duplication

```java
// APPARENT duplication — same code, DIFFERENT knowledge
public boolean isEligibleForFreeShipping(Order order) {
    return order.total().amountCents() > 5000;  // > $50
}

public boolean isEligibleForVipPromotion(Order order) {
    return order.total().amountCents() > 5000;  // > $50
}
```

At first glance: extract a shared constant. But wait — if the free shipping threshold changes to $60, should the VIP promotion threshold also change? Probably not. These are **two different business rules that happen to share the same number today**. Merging them creates false coupling.

```java
// TRUE duplication — same knowledge encoded twice
// BAD: if the formula changes, both must be updated identically
public class PricingService {
    public Money calculateDiscount(Order order) {
        return new Money(order.total().amountCents() * 15 / 100, "USD");
    }
}

public class InvoiceService {
    public Money computeLineDiscount(Order order) {
        return new Money(order.total().amountCents() * 15 / 100, "USD");   // same formula
    }
}

// GOOD: one authoritative source
public class DiscountCalculator {
    private static final double STANDARD_RATE = 0.15;

    public Money calculate(Money amount) {
        long discountCents = Math.round(amount.amountCents() * STANDARD_RATE);
        return new Money(discountCents, amount.currency());
    }
}
```

Now when the 15% rate changes to 12%, there is exactly one place to change it.

### The DRY Extraction Checklist

Before extracting duplicated code, ask:

1. **Do they represent the same knowledge?** If the free shipping rule and the VIP rule both use `> $50` but for independent reasons, they are NOT the same knowledge — do not merge.
2. **Will they always change together?** If you can construct a realistic scenario where one changes without the other, they may not be the same knowledge.
3. **Is the extracted abstraction coherent?** An extraction that requires a confusing parameter to handle its two callers differently is a sign you've forced unrelated things together.

### The Danger of DRY Overreach: The WET trap in reverse

Over-applying DRY creates **tight coupling between things that should be independent**:

```java
// BAD — merged two independent rules into one "shared" method
public boolean isThresholdMet(Order order, ThresholdType type) {
    int threshold = switch (type) {
        case FREE_SHIPPING -> 5000;
        case VIP_PROMOTION -> 5000;    // same now, but for how long?
        case LOYALTY_DISCOUNT -> 3000; // already different
    };
    return order.total().amountCents() > threshold;
}
```

This is now a switch statement waiting to become a maintenance burden. Separate independent rules.

### DRY in Configuration and Schema

DRY applies beyond code:

```java
// BAD — same validation rule duplicated in 3 places
// Controller validates
if (email == null || !email.contains("@")) throw new BadRequestException(...);

// Service validates
if (email == null || !email.contains("@")) throw new InvalidEmailException(...);

// Repository validates
if (email == null || !email.contains("@")) { ... }

// GOOD — one validator, called from the right layer (domain or service)
public class EmailAddress {
    private final String value;

    public EmailAddress(String value) {
        if (value == null || !value.matches("^[^@]+@[^@]+\\.[^@]+$"))
            throw new IllegalArgumentException("Invalid email: " + value);
        this.value = value.toLowerCase();
    }

    public String value() { return value; }
}
```

Validation logic in the value object means it is impossible to create an invalid `EmailAddress`. No other layer needs to repeat the check.

---

## YAGNI — You Aren't Gonna Need It

> "Always implement things when you actually need them, never when you just foresee that you need them."
> — Ron Jeffries (XP co-creator)

YAGNI is the hardest principle to follow because it requires resisting the engineer's instinct to prepare for the future. The future is uncertain. Code built for requirements that never materialise is code that must be read, maintained, tested, and worked around — forever.

### The Cost of Unused Abstraction

```java
// BAD — designed for requirements that don't exist
public class OrderExporterFactory {
    public OrderExporter create(ExportFormat format) {
        return switch (format) {
            case CSV  -> new CsvOrderExporter();
            case JSON -> new JsonOrderExporter();    // used
            case XML  -> new XmlOrderExporter();    // never requested
            case PDF  -> new PdfOrderExporter();    // never requested
            case XLSX -> new XlsxOrderExporter();   // never requested
        };
    }
}
```

Three implementations, a factory, and a format enum — all untested in production, all requiring maintenance, all potentially inconsistent with each other. The business asked for JSON export.

```java
// GOOD — implement what you need; the abstraction appears when the second format arrives
public class OrderExporter {
    public String exportAsJson(List<Order> orders) {
        // ... JSON serialisation
        return json;
    }
}
```

When CSV is requested, you extract the `OrderExporter` interface and add `CsvOrderExporter`. This is the **Rule of Three** applied to YAGNI: the first occurrence is a solution, the second is a coincidence, the third is a pattern worth abstracting.

### YAGNI vs Good Design

YAGNI does not mean "write throwaway code". It means:

| Do | Don't |
|---|---|
| Write clean, well-named code that's easy to extend | Build frameworks for extensions not yet asked for |
| Make the current design correct and maintainable | Add switches and parameters for hypothetical variants |
| Refactor when the second variant genuinely arrives | Pre-emptively extract abstractions for imagined future requirements |
| Leave design open via good naming and single responsibilities | Hard-code 5 payment providers when only one is needed today |

The key: YAGNI defers complexity **until you have the information to make good decisions**. Early abstractions are made with incomplete information. Late abstractions — made when requirements are real — are made with full information about what the abstraction actually needs to express.

---

## The Tensions Between the Three

These principles conflict. Knowing when each wins is the skill.

### DRY vs YAGNI

You have duplicate code in two places.

- **YAGNI says**: don't extract yet — you might be coupling two independent things
- **DRY says**: extract the shared knowledge

Resolution: ask the checklist — is this genuinely the same knowledge, or the same code coincidentally? If the same knowledge, DRY wins. If independent rules that happen to share a value today, wait.

### KISS vs DRY

You have 20 lines of duplicated JDBC boilerplate across 5 DAO classes.

- **DRY says**: extract into a shared utility
- **KISS says**: maybe an ORM (Spring Data JPA) is simpler than a custom JDBC helper

Resolution: the simplest thing that eliminates the duplication. Sometimes the DRY abstraction is more complex than a well-known library.

### KISS vs OCP

You need a new payment method.

- **KISS says**: add an `else if` — it's the simplest change
- **OCP says**: extract a `PaymentStrategy` interface

Resolution: if this is the **second** payment method, OCP wins — the pattern is established. If it's the **first** and there's no current need for a second, KISS wins with a note to refactor when the second arrives.

---

## Decision Matrix

| Situation | Dominant principle | Reasoning |
|---|---|---|
| Only one variant exists | YAGNI | Don't abstract what doesn't vary yet |
| Second variant appears | OCP / DRY | Now the variation is real; abstract it |
| Same code, different business rules | Let duplication stand | Different knowledge; merging creates coupling |
| Same formula in N places, same rule | DRY | Extract to one authoritative source |
| Complex solution to a simple problem | KISS | Step back; find the simpler path |
| Simple solution that's clearly wrong | Correctness first | KISS never means incomplete or incorrect |
| Feature not yet requested | YAGNI | Build it when the spec arrives, not before |

---

## Interview Talking Points

**1. When should you NOT apply DRY?**
> "When the duplication is accidental — two pieces of code that look the same but represent independent business rules. If the free-shipping threshold is $50 and the VIP promotion threshold is also $50, I don't merge them into a shared constant. They're governed by different stakeholders and will diverge. Merging them creates coupling between unrelated rules. DRY is about eliminating knowledge duplication — not text duplication."

**2. How do you balance YAGNI against the cost of future refactoring?**
> "By leaving the code clean and easy to extend, even if not yet extended. I don't build the abstraction, but I don't write code that would make adding it painful either. Good naming, single responsibilities, and cohesive classes make later refactoring cheap. YAGNI defers the abstraction — it doesn't make the codebase hostile to it. The moment the second real variant appears, I refactor confidently because the existing code is already in good shape."

**3. What's an example where KISS and good design are in tension?**
> "Early abstraction. A junior engineer sees two payment methods and immediately designs an interface, a factory, and a strategy pattern. That's fine when both methods are implemented, tested, and in production. But if it was designed for one method with the other anticipated — the factory has dead branches, the second strategy is a stub, tests are incomplete. KISS says: ship the clean direct implementation of what you have; introduce the abstraction when the second real case forces you to. The abstraction you design with two real examples is better than the one you designed with one example and imagination."

---

## Key Takeaways

- **KISS**: prefer the simplest *correct* solution; fight accidental complexity; defer to libraries over custom infrastructure
- **DRY**: eliminate *knowledge* duplication, not text duplication; same code for different reasons is not a DRY violation
- **YAGNI**: implement when needed, not when anticipated; build the abstraction when the second real case arrives, not before
- The principles **conflict** — knowing when each wins is the judgment skill
- DRY extraction checklist: same knowledge? always change together? coherent abstraction?
- YAGNI ≠ write throwaway code; it means *clean and easy to extend later, but not extended yet*
- All three serve the same goal: **manage complexity** so the codebase remains navigable and changeable
