# Unit Testing

A carpenter doesn't assemble an entire cabinet to check if one joint fits. They test each joint **in isolation** — does the mortise-and-tenon hold tight? Does the drawer slide smoothly? That's unit testing: verifying the **smallest unit of behaviour** works correctly, independently of the rest of the system.

> **Interview relevance:** "How would you test this class?", "Write a unit test for this method", "Is this design testable?" — testing questions reveal whether you write code that's easy to verify, maintain, and refactor with confidence.

---

## What Is a Unit Test?

A unit test verifies a **single behaviour** of a class or method in **isolation** from external dependencies.

### Properties of a Good Unit Test (F.I.R.S.T.)

| Property | Meaning | Violation example |
|---|---|---|
| **F**ast | Runs in milliseconds | Test hits a real database |
| **I**solated | No dependency on other tests or external systems | Test fails when run in different order |
| **R**epeatable | Same result every time | Test depends on current time or random |
| **S**elf-validating | Pass/fail with no manual inspection | Test prints output you must eyeball |
| **T**imely | Written close to the code it tests | Tests written 6 months after the code |

---

## Anatomy of a Unit Test (AAA Pattern)

Every unit test follows three phases:

```java
@Test
void shouldCalculateDiscountForPremiumCustomer() {
    // ARRANGE — set up the scenario
    Customer customer = new Customer("Alice", CustomerTier.PREMIUM);
    Order order = new Order(customer, Money.of(100, "USD"));
    DiscountCalculator calculator = new DiscountCalculator();

    // ACT — invoke the behaviour under test
    Money discount = calculator.calculate(order);

    // ASSERT — verify the expected outcome
    assertEquals(Money.of(15, "USD"), discount);  // 15% for premium
}
```

### Alternative: Given-When-Then (BDD Style)

```java
@Test
void premiumCustomer_getsPercentageDiscount() {
    // Given a premium customer with a $100 order
    var customer = Customer.premium("Alice");
    var order = Order.of(customer, Money.dollars(100));

    // When calculating the discount
    var discount = new DiscountCalculator().calculate(order);

    // Then a 15% discount is applied
    assertThat(discount).isEqualTo(Money.dollars(15));
}
```

---

## Test Naming Conventions

Good test names are **documentation**. They describe the behaviour, not the implementation.

| Pattern | Example |
|---|---|
| `should_ExpectedBehaviour_When_Condition` | `should_rejectWithdrawal_when_insufficientBalance` |
| `methodName_condition_expectedResult` | `withdraw_insufficientBalance_throwsException` |
| `givenCondition_whenAction_thenResult` | `givenExpiredToken_whenAuthenticate_thenReturnsUnauthorized` |

```java
// BAD — describes implementation, not behaviour
@Test void testCalculateDiscount() { }
@Test void test1() { }

// GOOD — describes the business rule being verified
@Test void premiumCustomers_receive15PercentDiscount() { }
@Test void freeShipping_appliedForOrdersAbove50Dollars() { }
@Test void expiredCoupons_areRejectedWithClearMessage() { }
```

---

## Testing Different Scenarios

### Testing Normal Behaviour

```java
public class ShoppingCart {
    private final List<CartItem> items = new ArrayList<>();

    public void addItem(Product product, int quantity) {
        if (quantity <= 0) throw new IllegalArgumentException("Quantity must be positive");
        items.stream()
            .filter(item -> item.getProduct().equals(product))
            .findFirst()
            .ifPresentOrElse(
                item -> item.increaseQuantity(quantity),
                () -> items.add(new CartItem(product, quantity))
            );
    }

    public Money getTotal() {
        return items.stream()
            .map(CartItem::getSubtotal)
            .reduce(Money.ZERO, Money::add);
    }
}
```

```java
class ShoppingCartTest {

    @Test
    void newCart_hasZeroTotal() {
        ShoppingCart cart = new ShoppingCart();
        assertEquals(Money.ZERO, cart.getTotal());
    }

    @Test
    void addingItem_increasesTotal() {
        ShoppingCart cart = new ShoppingCart();
        Product laptop = new Product("Laptop", Money.of(999, "USD"));

        cart.addItem(laptop, 1);

        assertEquals(Money.of(999, "USD"), cart.getTotal());
    }

    @Test
    void addingSameProductTwice_combinesQuantity() {
        ShoppingCart cart = new ShoppingCart();
        Product book = new Product("Book", Money.of(20, "USD"));

        cart.addItem(book, 1);
        cart.addItem(book, 2);

        assertEquals(Money.of(60, "USD"), cart.getTotal());  // 3 × $20
    }
}
```

### Testing Edge Cases

```java
@Test
void addItem_withZeroQuantity_throwsException() {
    ShoppingCart cart = new ShoppingCart();
    Product product = new Product("Widget", Money.of(10, "USD"));

    assertThrows(IllegalArgumentException.class,
        () -> cart.addItem(product, 0));
}

@Test
void addItem_withNegativeQuantity_throwsException() {
    ShoppingCart cart = new ShoppingCart();
    Product product = new Product("Widget", Money.of(10, "USD"));

    IllegalArgumentException ex = assertThrows(
        IllegalArgumentException.class,
        () -> cart.addItem(product, -1)
    );
    assertTrue(ex.getMessage().contains("positive"));
}
```

### Testing State Transitions

```java
class OrderStateMachineTest {

    @Test
    void newOrder_isPending() {
        Order order = Order.create(customer, items);
        assertEquals(OrderState.PENDING, order.getState());
    }

    @Test
    void pendingOrder_canBeConfirmed() {
        Order order = Order.create(customer, items);
        order.confirm();
        assertEquals(OrderState.CONFIRMED, order.getState());
    }

    @Test
    void confirmedOrder_cannotBeCancelledAfterShipping() {
        Order order = Order.create(customer, items);
        order.confirm();
        order.ship();

        assertThrows(InvalidOrderStateException.class, () -> order.cancel());
    }
}
```

---

## Parameterized Tests — Eliminating Duplication

When the same logic applies to multiple inputs:

```java
@ParameterizedTest
@CsvSource({
    "STANDARD, 100.00, 0.00",     // Standard: no discount
    "PREMIUM, 100.00, 15.00",     // Premium: 15%
    "VIP, 100.00, 25.00",         // VIP: 25%
    "VIP, 0.00, 0.00",            // VIP with zero order: no discount
})
void discountCalculation_basedOnTier(CustomerTier tier, double orderAmount,
                                      double expectedDiscount) {
    Customer customer = new Customer("Test", tier);
    Order order = new Order(customer, Money.of(orderAmount, "USD"));

    Money discount = new DiscountCalculator().calculate(order);

    assertEquals(Money.of(expectedDiscount, "USD"), discount);
}
```

---

## Testing with Dependencies (Mocks vs Stubs)

When a class depends on external services:

```java
public class NotificationService {
    private final EmailSender emailSender;
    private final UserRepository userRepository;

    public NotificationService(EmailSender emailSender, UserRepository userRepository) {
        this.emailSender = emailSender;
        this.userRepository = userRepository;
    }

    public void sendOrderConfirmation(String userId, Order order) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException(userId));
        emailSender.send(user.getEmail(), "Order Confirmed",
            "Your order " + order.getId() + " has been confirmed.");
    }
}
```

```java
@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock EmailSender emailSender;
    @Mock UserRepository userRepository;
    @InjectMocks NotificationService notificationService;

    @Test
    void sendsConfirmationEmail_toUserEmail() {
        // Arrange
        User user = new User("USR-1", "alice@example.com");
        when(userRepository.findById("USR-1")).thenReturn(Optional.of(user));
        Order order = new Order("ORD-123");

        // Act
        notificationService.sendOrderConfirmation("USR-1", order);

        // Assert — verify interaction
        verify(emailSender).send(
            eq("alice@example.com"),
            eq("Order Confirmed"),
            contains("ORD-123")
        );
    }

    @Test
    void throwsException_whenUserNotFound() {
        when(userRepository.findById("USR-999")).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class,
            () -> notificationService.sendOrderConfirmation("USR-999", new Order("ORD-1")));

        // Verify email was never sent
        verifyNoInteractions(emailSender);
    }
}
```

---

## What Makes a Unit Test Valuable?

| Valuable test | Low-value test |
|---|---|
| Tests **behaviour** (what the class does) | Tests **implementation** (how it does it) |
| Fails when a bug is introduced | Fails when you refactor (brittle) |
| Is readable as documentation | Requires reading implementation to understand |
| Covers edge cases and boundaries | Only covers happy path |

### Example: Testing Behaviour vs Implementation

```java
// BAD — tests implementation details (internal list size)
@Test
void addItem_increasesInternalListSize() {
    cart.addItem(product, 1);
    assertEquals(1, cart.getItems().size());  // coupled to internal representation
}

// GOOD — tests observable behaviour
@Test
void addItem_increasesTotal() {
    cart.addItem(product, 1);
    assertEquals(Money.of(20, "USD"), cart.getTotal());  // tests what matters to callers
}
```

---

## Key Takeaways

1. **Unit tests verify behaviour, not implementation** — ask "what should happen?" not "how is it stored?"
2. **AAA/Given-When-Then** provides clear structure — every test has exactly one arrange, one act, one assert.
3. **Good test names replace documentation** — reading test names should explain the class's contract.
4. **Parameterized tests** eliminate duplication for rule-based logic.
5. **Fast and isolated** — if your unit test needs a database or network, it's an integration test.
6. In interviews, **showing you think about testability** while designing classes demonstrates engineering maturity.
