# Encapsulation

Encapsulation is **information hiding**: bundle data and the code that operates on it together, then restrict direct access to that data. The outside world interacts only through a controlled public interface. The object decides what to expose, what to protect, and what to enforce.

Think of a capsule (hence the name). The drug inside is protected by the outer shell — you interact with the capsule, not the chemical directly.

> **Interview relevance:** Encapsulation is the #1 OOP principle that produces *maintainable* code. Every "design a class" question implicitly tests whether you instinctively hide state and validate mutations.

---

## The Problem With Public Fields

```java
// ❌ NAIVE — public fields, zero protection
class Employee {
    public String name;
    public double salary;
    public int age;
}

Employee emp = new Employee();
emp.salary = -99_000;   // perfectly valid Java, completely wrong business logic
emp.age    = 999;       // no one stops you
```

The class has no opinion about its own data. Any caller can put it into an invalid state. The invariants live nowhere — they're a verbal agreement, broken the moment someone forgets.

---

## Access Modifiers

| Modifier | Accessible from |
|---|---|
| `private` | Within the same class only |
| `package-private` *(default)* | Within the same package |
| `protected` | Same package + subclasses |
| `public` | Everywhere |

**Rule of thumb:** Start with `private`. Escalate only when there's a concrete reason.

---

## Validation Inside Methods

The fix isn't just making fields private. It's moving the business rules _into the class_ where they belong:

```java
// ✅ BETTER — private fields, validated mutators
class Employee {
    private String name;
    private double salary;
    private int age;

    public Employee(String name, double salary, int age) {
        setName(name);
        setSalary(salary);
        setAge(age);
    }

    public void setSalary(double salary) {
        if (salary < 0)
            throw new IllegalArgumentException("Salary cannot be negative: " + salary);
        this.salary = salary;
    }

    public void setAge(int age) {
        if (age < 16 || age > 100)
            throw new IllegalArgumentException("Invalid age: " + age);
        this.age = age;
    }

    public void setName(String name) {
        if (name == null || name.isBlank())
            throw new IllegalArgumentException("Name cannot be blank");
        this.name = name.strip();
    }

    public double getSalary() { return salary; }
    public int    getAge()    { return age; }
    public String getName()   { return name; }
}
```

The class _owns_ its rules. Change the rule once (in the setter), and every caller benefits automatically.

---

## Full Example: UserProfile

```java
public final class UserProfile {
    private final String userId;
    private String email;
    private String displayName;
    private int    age;

    public UserProfile(String userId, String email, String displayName, int age) {
        this.userId = requireNonBlank(userId, "userId");
        setEmail(email);
        setDisplayName(displayName);
        setAge(age);
    }

    public void setEmail(String email) {
        if (email == null || !email.contains("@"))
            throw new IllegalArgumentException("Invalid email: " + email);
        this.email = email.toLowerCase().strip();
    }

    public void setDisplayName(String name) {
        if (name == null || name.isBlank())
            throw new IllegalArgumentException("Display name cannot be blank");
        if (name.length() > 50)
            throw new IllegalArgumentException("Display name too long");
        this.displayName = name.strip();
    }

    public void setAge(int age) {
        if (age < 13 || age > 120)
            throw new IllegalArgumentException("Age out of range: " + age);
        this.age = age;
    }

    public String getUserId()      { return userId; }
    public String getEmail()       { return email; }
    public String getDisplayName() { return displayName; }
    public int    getAge()         { return age; }

    private static String requireNonBlank(String value, String field) {
        if (value == null || value.isBlank())
            throw new IllegalArgumentException(field + " cannot be blank");
        return value.strip();
    }
}
```

---

## Immutability: The Strongest Form of Encapsulation

An immutable object is one whose state cannot change after construction. It's automatically thread-safe, can be freely shared, and is easy to reason about.

```java
// Immutable value object
public final class Money {
    private final long amountCents;   // always in cents to avoid floating-point drift
    private final String currency;

    public Money(long amountCents, String currency) {
        if (amountCents < 0) throw new IllegalArgumentException("Amount cannot be negative");
        if (currency == null || currency.length() != 3)
            throw new IllegalArgumentException("Invalid currency code");
        this.amountCents = amountCents;
        this.currency    = currency.toUpperCase();
    }

    // No setters — state never changes after construction
    public long   amountCents() { return amountCents; }
    public String currency()    { return currency; }

    // Operations return NEW instances instead of mutating
    public Money add(Money other) {
        if (!this.currency.equals(other.currency))
            throw new IllegalArgumentException("Currency mismatch");
        return new Money(this.amountCents + other.amountCents, this.currency);
    }
}
```

---

## The Law of Demeter: Don't Reach Through Objects

> "Talk to friends, not strangers."

```java
// ❌ VIOLATION — reaching into internals of internals
double tax = order.getCustomer().getAddress().getCountry().getTaxRate();

// ✅ BETTER — delegate; each object handles its own concern
double tax = order.calculateTax();
```

Each method should only call methods on:
1. `this` — itself
2. Its own fields
3. Parameters it received
4. Objects it created locally

Chains like `a.getB().getC().doSomething()` are a smell of poor encapsulation — something in the middle should absorb that knowledge.

---

## Interview Talking Points

**1. Why not just make all fields public and avoid boilerplate getters/setters?**
> "Public fields expose implementation details. If `balance` is public, any caller can set it to `-99999` without validation. Worse, if you later need to add logging, auditing, or a different backing store, you can't — callers are directly reading the field. Private fields give you the freedom to change how data is stored or validated without breaking callers. Getters/setters are not about boilerplate — they're about preserving the right to evolve your internals."

**2. When should an object be immutable?**
> "Whenever the object represents a _value_ — Money, Email, an RGB colour, a geographic coordinate. Immutable objects are thread-safe by default, can be safely cached, and can be used as map keys. Use `final` on both the class and all fields, provide no setters, and return new instances for any 'mutation' operation. In Java 16+, use `record` for boilerplate-free value objects."

**3. What is the Law of Demeter and why does it matter?**
> "The Law of Demeter (or principle of least knowledge) says a method should only call methods on objects it directly knows about — not objects obtained by traversing other objects. Chains like `a.getB().getC().doSomething()` create tight coupling: a change to B or C breaks A's callers. The fix is to move the responsibility closer to the data, asking the intermediate object to perform the operation on our behalf."

---

## Key Takeaways

- **Private fields** are non-negotiable; expose data only through controlled methods
- **Validation belongs in setters and constructors**, not in callers
- **Immutable objects** are the gold standard for value types — thread-safe, shareable, easy to reason about
- Use `final` on fields that should not change after construction
- Obey the **Law of Demeter**: don't chain through other objects' internals
- Access modifiers in order of restriction: `private` → `package` → `protected` → `public`

