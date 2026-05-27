# Spaghetti Code

> "Spaghetti code is code whose structure is difficult or impossible to understand — tangled, unstructured, and with control flow jumping unpredictably between distant parts of the program."

Spaghetti code is not just "messy" code. It is code whose **control flow and responsibilities are so intertwined** that you cannot understand any part of it without understanding all of it. Every change risks breaking something apparently unrelated. Every bug fix introduces two new bugs.

The term comes from the mental image of pulling one strand of spaghetti from a plate: you cannot move it without disturbing every other strand.

> **Interview relevance:** Spaghetti code is what interviewers are implicitly warning you against when they say "make this maintainable". The ability to recognise spaghetti patterns and produce their clean-code alternatives is a core design competency.

---

## The Hallmarks of Spaghetti Code

| Hallmark | What it looks like |
|---|---|
| **Tangled control flow** | Deeply nested if/else chains, loops containing business logic containing more loops |
| **Mixed levels of abstraction** | High-level operations interspersed with low-level details (SQL, HTTP, string parsing) in the same method |
| **Scattered state** | Fields mutated from everywhere; no single place that owns a piece of state |
| **No named concepts** | Operations are coded inline rather than named and extracted |
| **Long methods** | 100+ line methods that do 10 different things |
| **Fear of change** | Developers are afraid to touch the class because they don't know what will break |

---

## The Classic Example: The Checkout Method

```java
// BAD — a 120-line method doing everything inline
public void checkout(String userId, List<String> productIds, String paymentToken,
                     String street, String city, String zip) throws Exception {
    // 1. Load user
    Connection conn = DriverManager.getConnection("jdbc:mysql://localhost/shop", "root", "pass");
    PreparedStatement ps = conn.prepareStatement("SELECT * FROM users WHERE id = ?");
    ps.setString(1, userId);
    ResultSet rs = ps.executeQuery();
    if (!rs.next()) throw new Exception("User not found");
    String email = rs.getString("email");
    String name  = rs.getString("name");
    rs.close(); ps.close();

    // 2. Load products and calculate total
    double total = 0;
    List<String> productNames = new ArrayList<>();
    for (String productId : productIds) {
        ps = conn.prepareStatement("SELECT * FROM products WHERE id = ?");
        ps.setString(1, productId);
        rs = ps.executeQuery();
        if (!rs.next()) throw new Exception("Product not found: " + productId);
        double price = rs.getDouble("price");
        int stock    = rs.getInt("stock_count");
        if (stock <= 0) throw new Exception("Out of stock: " + productId);
        productNames.add(rs.getString("name"));
        total += price;
        rs.close(); ps.close();
        // Update stock
        ps = conn.prepareStatement("UPDATE products SET stock_count = stock_count - 1 WHERE id = ?");
        ps.setString(1, productId);
        ps.executeUpdate();
        ps.close();
    }

    // 3. Apply tax
    if ("CA".equals(city)) {
        total = total * 1.0825;
    } else if ("NY".equals(city)) {
        total = total * 1.08875;
    } else {
        total = total * 1.07;
    }

    // 4. Charge payment
    URL url = new URL("https://api.stripe.com/v1/charges");
    HttpURLConnection http = (HttpURLConnection) url.openConnection();
    http.setRequestMethod("POST");
    http.setRequestProperty("Authorization", "Bearer sk_live_hardcoded_key_123");
    http.setDoOutput(true);
    String body = "amount=" + (int)(total * 100) + "&currency=usd&source=" + paymentToken;
    http.getOutputStream().write(body.getBytes());
    int code = http.getResponseCode();
    if (code != 200) throw new Exception("Payment failed");

    // 5. Save order
    ps = conn.prepareStatement(
        "INSERT INTO orders (user_id, total, status, street, city, zip) VALUES (?,?,?,?,?,?)");
    ps.setString(1, userId);
    ps.setDouble(2, total);
    ps.setString(3, "CONFIRMED");
    ps.setString(4, street);
    ps.setString(5, city);
    ps.setString(6, zip);
    ps.executeUpdate();
    String orderId = /* get generated key */ "new-order-id";
    ps.close();

    // 6. Send email (inline SMTP)
    Properties props = new Properties();
    props.put("mail.smtp.host", "smtp.gmail.com");
    props.put("mail.smtp.port", "587");
    // ...
    Session session = Session.getInstance(props);
    Message message = new MimeMessage(session);
    message.setFrom(new InternetAddress("orders@shop.com"));
    message.setRecipient(RecipientType.TO, new InternetAddress(email));
    message.setSubject("Order Confirmed #" + orderId);
    StringBuilder sb = new StringBuilder();
    sb.append("Dear ").append(name).append(",\n");
    sb.append("Your order has been confirmed. Items:\n");
    for (String n : productNames) sb.append("- ").append(n).append("\n");
    sb.append("Total: $").append(String.format("%.2f", total));
    message.setText(sb.toString());
    Transport.send(message);

    conn.close();
}
```

This is textbook spaghetti:
- **6 responsibilities in one method**: user loading, product loading, tax calculation, payment, persistence, email
- **Hardcoded infrastructure**: connection strings, API keys, SMTP host embedded inline
- **Untestable**: cannot test tax calculation without a real database and real SMTP
- **No error recovery**: a failure at step 5 leaves stock decremented but no order saved
- **Mixed abstraction levels**: high-level "confirm order" logic next to low-level `PreparedStatement` management

---

## How Spaghetti Code Gets Written

Spaghetti usually starts as a reasonable prototype:

```java
// Day 1: MVP, reasonable shortcut
public void checkout(String userId, String productId, String token) {
    // 30 lines — manageable
}
```

Then requirements arrive: multiple products, tax by region, email confirmation, logging. Each feature is added inline because "this method already does the checkout". Nobody extracts. Nobody names. After 12 features, the method is 200 lines and no one wants to touch it.

---

## The Refactored Design: Separate, Name, Compose

The antidote to spaghetti is **structured decomposition**: extract every distinct operation into a named method or class, then compose them at the right level of abstraction.

```mermaid
sequenceDiagram
    participant C as CheckoutController
    participant S as CheckoutService
    participant R as OrderRepository
    participant P as PricingService
    participant G as PaymentGateway
    participant N as OrderNotifier

    C->>S: checkout(cmd)
    S->>R: findUser(userId)
    R-->>S: User
    S->>R: loadAndReserveProducts(productIds)
    R-->>S: List~OrderLine~
    S->>P: calculateTotal(lines, address)
    P-->>S: Money
    S->>G: charge(total, token)
    G-->>S: PaymentResult
    S->>R: saveOrder(order)
    S->>N: notifyConfirmation(order)
    S-->>C: Order
```

```java
// Each class owns exactly one concern

// ------- Domain Objects -------
public class Order {
    private final String       orderId;
    private final String       customerId;
    private final List<OrderLine> lines;
    private final Money        total;
    private final Address      shippingAddress;
    private       OrderStatus  status;

    public static Order create(String customerId,
                               List<OrderLine> lines,
                               Money total,
                               Address address) {
        return new Order(UUID.randomUUID().toString(), customerId,
                         lines, total, address, OrderStatus.CONFIRMED);
    }
    // getters, equals/hashCode
}

// ------- Tax Calculation — named, isolated, testable -------
public class TaxCalculator {
    private static final Map<String, Double> TAX_RATES = Map.of(
        "CA", 0.0825,
        "NY", 0.08875
    );
    private static final double DEFAULT_RATE = 0.07;

    public Money calculateTax(Money subtotal, Address address) {
        double rate = TAX_RATES.getOrDefault(address.state(), DEFAULT_RATE);
        return subtotal.multiply(rate);
    }

    public Money applyTax(Money subtotal, Address address) {
        return subtotal.add(calculateTax(subtotal, address));
    }
}

// ------- Pricing — composes tax and discounts -------
public class PricingService {
    private final TaxCalculator taxCalculator;

    public PricingService(TaxCalculator taxCalculator) {
        this.taxCalculator = taxCalculator;
    }

    public Money calculateTotal(List<OrderLine> lines, Address address) {
        Money subtotal = lines.stream()
                              .map(OrderLine::lineTotal)
                              .reduce(Money.ZERO, Money::add);
        return taxCalculator.applyTax(subtotal, address);
    }
}

// ------- Payment — thin wrapper over provider -------
public interface PaymentGateway {
    PaymentResult charge(Money amount, String paymentToken);
    PaymentResult refund(String transactionId, Money amount);
}

// ------- Notification — single purpose, swappable -------
public interface OrderNotifier {
    void notifyConfirmation(Order order, Customer customer);
}

// ------- Orchestrator — reads like a story -------
public class CheckoutService {
    private final UserRepository    users;
    private final ProductRepository products;
    private final OrderRepository   orders;
    private final PricingService    pricing;
    private final PaymentGateway    payment;
    private final OrderNotifier     notifier;

    public CheckoutService(UserRepository users, ProductRepository products,
                           OrderRepository orders, PricingService pricing,
                           PaymentGateway payment, OrderNotifier notifier) {
        this.users    = users;
        this.products = products;
        this.orders   = orders;
        this.pricing  = pricing;
        this.payment  = payment;
        this.notifier = notifier;
    }

    public Order checkout(CheckoutCommand cmd) {
        Customer customer = users.findById(cmd.userId())
                                 .orElseThrow(() -> new UserNotFoundException(cmd.userId()));

        List<OrderLine> lines = reserveProducts(cmd.productIds());
        Money total = pricing.calculateTotal(lines, cmd.shippingAddress());

        PaymentResult result = payment.charge(total, cmd.paymentToken());
        if (!result.isSuccess()) {
            releaseReservations(lines);
            throw new PaymentDeclinedException(result.reason());
        }

        Order order = Order.create(cmd.userId(), lines, total, cmd.shippingAddress());
        orders.save(order);
        notifier.notifyConfirmation(order, customer);
        return order;
    }

    private List<OrderLine> reserveProducts(List<String> productIds) {
        return productIds.stream()
                         .map(id -> products.findAndReserve(id)
                                            .orElseThrow(() -> new ProductUnavailableException(id)))
                         .collect(toList());
    }

    private void releaseReservations(List<OrderLine> lines) {
        lines.forEach(line -> products.releaseReservation(line.productId()));
    }
}
```

The orchestrator (`CheckoutService.checkout`) now **reads like a story**: find the customer, reserve products, calculate total, charge payment, save order, notify. Each step is a named operation with a clear purpose. The implementation of each step lives in its own class.

---

## Extracting Named Concepts: The Core Technique

The most powerful weapon against spaghetti is **extracting named operations**. When code has no names, you read the implementation to understand intent. When code has names, you read the name.

```java
// BEFORE — what is this doing?
if (order.getStatus().equals("PENDING") &&
    order.getCreatedAt().isBefore(LocalDateTime.now().minusHours(24)) &&
    order.getPaymentMethod() != null &&
    !order.getItems().isEmpty()) {
    // ...
}

// AFTER — intent is declared by the name
if (isEligibleForAutoConfirmation(order)) {
    // ...
}

private boolean isEligibleForAutoConfirmation(Order order) {
    return order.isPending()
        && order.isOlderThan(Duration.ofHours(24))
        && order.hasPaymentMethod()
        && order.hasItems();
}
```

The condition hasn't changed. But now it has a name. The name is documentation. The private method is independently testable. The if-statement is readable without decoding.

---

## Mixed Abstraction Levels: The Hidden Spaghetti

Spaghetti isn't always about nesting depth. It also manifests as mixing levels of abstraction within a single method:

```java
// BAD — high-level steps mixed with low-level details
public void processRefund(String orderId) {
    // High level
    Order order = orderRepository.findById(orderId)
                                 .orElseThrow(OrderNotFoundException::new);
    order.markRefunded();

    // Suddenly: low-level HTTP
    HttpClient client = HttpClient.newHttpClient();
    HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create("https://api.stripe.com/v1/refunds"))
        .header("Authorization", "Bearer " + System.getenv("STRIPE_KEY"))
        .POST(HttpRequest.BodyPublishers.ofString("charge=" + order.getTransactionId()))
        .build();
    HttpResponse<String> response = client.send(request, BodyHandlers.ofString());
    if (response.statusCode() != 200) throw new RefundFailedException();

    // Back to high level
    orderRepository.save(order);
    notifier.notifyRefund(order);
}
```

The high-level narrative is: find order, refund it, save, notify. But the Stripe HTTP call is embedded in the middle, forcing the reader to mentally context-switch from domain language to HTTP plumbing.

```java
// GOOD — uniform abstraction level throughout
public void processRefund(String orderId) {
    Order order = orderRepository.findById(orderId)
                                 .orElseThrow(OrderNotFoundException::new);

    PaymentResult result = paymentGateway.refund(order.getTransactionId(), order.total());
    if (!result.isSuccess()) throw new RefundFailedException(result.reason());

    order.markRefunded();
    orderRepository.save(order);
    notifier.notifyRefund(order);
}
```

Every line operates at the same abstraction level. The Stripe HTTP details live inside `StripePaymentGateway.refund()`, where they belong.

---

## Common Spaghetti Patterns and Their Antidotes

| Spaghetti Pattern | Clean Code Antidote |
|---|---|
| 100-line method doing everything | Extract Method — name each distinct operation |
| `if/else` chains on type strings | Polymorphism — each type is its own class |
| SQL embedded in business logic | Repository pattern — data access behind an interface |
| HTTP calls inline in service methods | Gateway/Adapter — wrap the provider call in an interface |
| Deeply nested loops with logic | Extract the loop body into a named method |
| Mixed abstraction levels | The Step-Down Rule — each method calls only methods one level below it |
| Comments explaining what code does | Replace the code with a method whose name says the same thing |
| Condition too complex to read | Extract to a boolean method with an expressive name |

---

## The Step-Down Rule

Clean Code's **Step-Down Rule**: a method should call other methods that are one level of abstraction below it. Reading the code top to bottom should feel like reading a high-level story that gradually reveals details at each level.

```java
// Level 0 — high-level story
public Order placeOrder(PlaceOrderCommand cmd) {
    validateCommand(cmd);
    List<OrderLine> lines = reserveInventory(cmd);
    Money total = calculateTotal(lines, cmd.shippingAddress());
    PaymentResult payment = chargeCustomer(total, cmd.paymentToken());
    Order order = persistOrder(cmd, lines, total, payment);
    notifyCustomer(order);
    return order;
}

// Level 1 — one level of detail exposed
private void validateCommand(PlaceOrderCommand cmd) {
    if (cmd.productIds().isEmpty()) throw new InvalidOrderException("No products");
    if (cmd.paymentToken().isBlank()) throw new InvalidOrderException("No payment token");
}

private List<OrderLine> reserveInventory(PlaceOrderCommand cmd) {
    return cmd.productIds().stream()
              .map(this::reserveSingleProduct)
              .collect(toList());
}

// Level 2 — implementation detail
private OrderLine reserveSingleProduct(String productId) {
    return inventory.findAndReserve(productId)
                    .orElseThrow(() -> new OutOfStockException(productId));
}
```

Reading `placeOrder()` gives you the complete picture. You don't need to understand `reserveSingleProduct()` to understand the top-level flow.

---

## Interview Talking Points

**1. How do you identify spaghetti code when you join a new codebase?**
> "I look for three things: methods longer than 30 lines, code that comments what it's doing rather than naming it (comments are a smell for missing extractions), and methods that mix abstraction levels — domain operations next to SQL or HTTP plumbing. I also look at test coverage: if a file has no unit tests, it usually means the code is too tangled to test in isolation, which is a reliable spaghetti indicator."

**2. What's your strategy for cleaning up spaghetti code?**
> "I never do a big-bang rewrite. I work incrementally with three techniques: extract-and-name (take any inline operation longer than 5 lines and give it a name), normalise abstraction levels (push any low-level detail — SQL, HTTP — behind an interface so the method stays at one level of abstraction), and test-first extraction (write a characterisation test before I extract, so I can verify I haven't changed behaviour). I also make sure I don't introduce the same problems — I enforce that every new method does one thing and is short enough to see on one screen."

**3. What's the relationship between spaghetti code and testability?**
> "Directly inverse. Spaghetti code is hard to test because its dependencies are tangled — you can't test tax calculation without a database connection, because they're in the same method. When you extract tax calculation into `TaxCalculator.applyTax()`, it takes a `Money` and an `Address` — both plain objects. The test is three lines. Testability is one of the best structural metrics for spaghetti: if a class requires mocking 6 collaborators to test one behaviour, the code is tangled."

---

## Key Takeaways

- Spaghetti code is characterised by **tangled control flow, mixed abstraction levels, and no named concepts**
- It grows incrementally — each feature adds 10 lines; **refactor continuously**, not reactively
- The primary antidote: **Extract Method** — name every distinct operation, even if it's 3 lines
- **Mixed abstraction levels** are as damaging as nested conditionals — keep each method at one level
- The **Step-Down Rule**: high-level methods call mid-level methods; mid-level call low-level — read top-to-bottom like a story
- **Testability is the diagnostic**: if you cannot test a behaviour in isolation, the code is tangled
- The checkoutmethod refactoring shows the pattern: separate concerns → name operations → compose in a thin orchestrator
