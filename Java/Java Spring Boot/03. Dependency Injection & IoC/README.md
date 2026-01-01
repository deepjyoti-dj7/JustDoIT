# 💉 Dependency Injection & IoC - Complete Study Guide

## 📚 Overview

This comprehensive guide covers the core concepts of **Dependency Injection** and **Inversion of Control** in Spring Framework. These are fundamental principles that every Spring developer must master for building maintainable, testable, and loosely-coupled applications.

---

## 📖 Topics Covered

### 1️⃣ **Inversion of Control Concept**
**What You'll Learn:**
- IoC design principle and Hollywood Principle
- Traditional vs IoC control flow
- IoC containers and their responsibilities
- Types of IoC (DI, Dependency Lookup, Template Method, Strategy)
- Spring IoC container architecture

**Key Concepts:**
```java
// Traditional Approach - You control the flow
UserRepository repo = new UserRepositoryImpl();
UserService service = new UserServiceImpl(repo);

// IoC Approach - Framework controls the flow
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

**Core Principles:**
- **Hollywood Principle**: "Don't call us, we'll call you"
- **Framework calls your code**: Lifecycle methods, request handlers, event listeners
- **Benefits**: Loose coupling, testability, lifecycle management, AOP support

**IoC Container Workflow:**
```
1. Load Configuration
2. Create Bean Definitions
3. Instantiate Beans
4. Inject Dependencies
5. Process Aware Interfaces
6. Apply BeanPostProcessors
7. Initialize Beans
8. Beans Ready for Use
9. Destroy on Shutdown
```

---

### 2️⃣ **Dependency Injection Types**
**What You'll Learn:**
- 5 types of DI in Spring
- Constructor, Setter, Field, Method, and Interface injection
- Comparison and when to use each
- Lombok integration for cleaner code

**Types Overview:**
```java
// 1. Constructor Injection (RECOMMENDED)
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository repository;
}

// 2. Setter Injection (Optional dependencies)
@Service
public class NotificationService {
    private EmailService emailService;
    
    @Autowired(required = false)
    public void setEmailService(EmailService email) {
        this.emailService = email;
    }
}

// 3. Field Injection (AVOID - hard to test)
@Service
public class OrderService {
    @Autowired
    private OrderRepository repository;  // Not recommended!
}

// 4. Method Injection (Rare)
@Service
public class ReportService {
    @Autowired
    public void configure(DataSource ds, TemplateEngine te) {
        this.dataSource = ds;
        this.templateEngine = te;
    }
}

// 5. Interface Injection (Aware interfaces)
@Service
public class MyBean implements ApplicationContextAware {
    @Override
    public void setApplicationContext(ApplicationContext context) {
        this.applicationContext = context;
    }
}
```

**Comparison Matrix:**
| Type | Immutability | Testability | Mandatory Deps | Recommended |
|------|--------------|-------------|----------------|-------------|
| Constructor | ✅ final | ✅ Easy | ✅ | **YES** |
| Setter | ❌ | ✅ Easy | ❌ | For optional |
| Field | ❌ | ❌ Hard | ❌ | **AVOID** |
| Method | ❌ | ✅ Easy | ✅ | Rare cases |

---

### 3️⃣ **Constructor vs Setter Injection**
**What You'll Learn:**
- Detailed comparison of the two main DI approaches
- Immutability and thread-safety implications
- Optional dependency handling
- Circular dependency challenges

**Constructor Injection Benefits:**
```java
@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepo;      // Immutable
    private final PaymentService paymentService;  // Thread-safe
    private final EmailService emailService;      // Clear dependencies
    
    // All dependencies guaranteed at construction time
}
```
- ✅ **Immutable**: Fields can be `final`
- ✅ **Thread-safe**: Immutable objects are inherently thread-safe
- ✅ **Fail-fast**: Application won't start if dependency missing
- ✅ **Clear dependencies**: Visible in constructor signature

**Setter Injection Use Cases:**
```java
@Service
public class NotificationService {
    private final SmsService smsService;      // Required
    private EmailService emailService;         // Optional
    private PushService pushService;           // Optional
    
    public NotificationService(SmsService sms) {
        this.smsService = sms;
    }
    
    @Autowired(required = false)
    public void setEmailService(EmailService email) {
        this.emailService = email;
    }
    
    @Autowired(required = false)
    public void setPushService(PushService push) {
        this.pushService = push;
    }
}
```
- ✅ **Optional dependencies**: Easy with `required = false`
- ✅ **Reconfiguration**: Can change after creation
- ✅ **Circular dependencies**: Easier to resolve
- ❌ **Mutability**: Fields cannot be `final`

---

### 4️⃣ **Field Injection**
**What You'll Learn:**
- Why field injection is discouraged
- Testing challenges with field injection
- Migration guide from field to constructor injection
- When (if ever) field injection is acceptable

**The Problem:**
```java
// ❌ Field Injection - Hard to test
@Service
public class UserService {
    @Autowired
    private UserRepository repository;
    
    public User findUser(Long id) {
        return repository.findById(id).orElse(null);
    }
}

// Testing is HARD
@Test
public void testFindUser() {
    UserService service = new UserService();
    // repository is NULL! Can't inject without Spring
    
    // Need reflection or Spring context
    ReflectionTestUtils.setField(service, "repository", mockRepo);
}
```

**Why Avoid Field Injection:**
- ❌ **Hard to test**: Cannot instantiate without Spring
- ❌ **No immutability**: Fields cannot be `final`
- ❌ **Hidden dependencies**: Not visible in API
- ❌ **Tight coupling**: Depends on Spring framework
- ❌ **NullPointerException risk**: Fields null before injection
- ❌ **Not thread-safe**: Mutable fields

**The Solution:**
```java
// ✅ Constructor Injection - Easy to test
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository repository;
}

// Testing is EASY
@Test
public void testFindUser() {
    UserRepository mockRepo = mock(UserRepository.class);
    UserService service = new UserService(mockRepo);  // Simple!
}
```

---

### 5️⃣ **Autowiring**
**What You'll Learn:**
- @Autowired annotation and autowiring modes
- byType, byName, constructor autowiring
- Required vs optional dependencies
- Autowiring collections (List, Map, Array)
- Resolving autowiring ambiguity

**Autowiring Modes:**
```java
// 1. byType (Default) - Matches by class/interface
@Service
public class UserService {
    @Autowired
    public UserService(UserRepository repository) {
        this.repository = repository;  // Finds bean by type
    }
}

// 2. byName - Matches by parameter name
@Autowired
public void setUserRepo(UserRepository userRepo) {
    // Matches bean named "userRepo"
}

// 3. Constructor (Implicit since Spring 4.3)
@Service
public class OrderService {
    // @Autowired optional if single constructor
    public OrderService(OrderRepository repository) {
        this.repository = repository;
    }
}
```

**Optional Dependencies:**
```java
// Option 1: required = false
@Autowired(required = false)
public void setEmailService(EmailService email) { }

// Option 2: Optional<T>
public UserService(UserRepository repo, 
                  Optional<EmailService> email) {
    this.emailService = email.orElse(new DefaultEmailService());
}

// Option 3: @Nullable
public UserService(UserRepository repo,
                  @Nullable EmailService email) {
    this.emailService = email != null ? email : new DefaultEmailService();
}
```

**Autowiring Collections:**
```java
// Inject all beans of a type
@Service
public class NotificationDispatcher {
    private final List<NotificationService> services;
    
    @Autowired
    public NotificationDispatcher(List<NotificationService> services) {
        this.services = services;  // All implementations injected
    }
    
    public void notifyAll(String message) {
        services.forEach(s -> s.send(message));
    }
}

// Inject as Map (bean name → bean)
@Autowired
public PaymentProcessor(Map<String, PaymentGateway> gateways) {
    this.gateways = gateways;  // Key = bean name
}
```

---

### 6️⃣ **@Qualifier Annotation**
**What You'll Learn:**
- Resolving autowiring ambiguity when multiple beans exist
- Custom qualifier annotations
- Qualifier with collections
- Meta-annotations for semantic qualifiers

**The Problem:**
```java
public interface PaymentGateway { }

@Component
public class StripePayment implements PaymentGateway { }

@Component
public class PayPalPayment implements PaymentGateway { }

@Service
public class OrderService {
    @Autowired
    private PaymentGateway gateway;  // ❌ Which one?
}

// Error: NoUniqueBeanDefinitionException
```

**The Solution:**
```java
@Service
public class OrderService {
    private final PaymentGateway gateway;
    
    @Autowired
    public OrderService(@Qualifier("stripePayment") PaymentGateway gateway) {
        this.gateway = gateway;  // ✅ Explicitly selects StripePayment
    }
}
```

**Custom Qualifiers:**
```java
// Define custom qualifier
@Qualifier
@Target({ElementType.FIELD, ElementType.PARAMETER, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface PaymentType {
    PaymentProvider value();
}

public enum PaymentProvider {
    STRIPE, PAYPAL, SQUARE
}

// Use on beans
@Component
@PaymentType(PaymentProvider.STRIPE)
public class StripePayment implements PaymentGateway { }

// Inject with custom qualifier
@Autowired
public OrderService(@PaymentType(PaymentProvider.STRIPE) PaymentGateway gateway) {
    this.gateway = gateway;
}
```

---

### 7️⃣ **@Primary Annotation**
**What You'll Learn:**
- Setting default beans when multiple candidates exist
- @Primary vs @Qualifier comparison
- Combining @Primary with @Profile
- Best practices for using @Primary

**Setting a Default:**
```java
@Component
@Primary  // Default choice
public class StripePayment implements PaymentGateway { }

@Component
public class PayPalPayment implements PaymentGateway { }

@Service
public class OrderService {
    @Autowired
    private PaymentGateway gateway;  // ✅ Uses StripePayment (primary)
}
```

**@Qualifier Overrides @Primary:**
```java
@Component
@Primary
public class StripePayment implements PaymentGateway { }

@Component
public class PayPalPayment implements PaymentGateway { }

@Service
public class DefaultOrderService {
    @Autowired
    private PaymentGateway gateway;  // Uses StripePayment (primary)
}

@Service
public class SpecialOrderService {
    @Autowired
    public SpecialOrderService(@Qualifier("payPalPayment") PaymentGateway gateway) {
        this.gateway = gateway;  // @Qualifier wins over @Primary
    }
}
```

**Environment-Specific Primary:**
```java
@Bean
@Primary
@Profile("dev")
public DataSource devDataSource() {
    return new H2DataSource();
}

@Bean
@Primary
@Profile("prod")
public DataSource prodDataSource() {
    return new PostgreSQLDataSource();
}

// Different primary bean per environment
```

**@Primary vs @Qualifier:**
| Feature | @Primary | @Qualifier |
|---------|----------|-----------|
| Location | Bean definition | Injection point |
| Purpose | Default choice | Explicit choice |
| Scope | Global | Per-injection |
| Verbosity | Less (set once) | More (repeat) |
| Use Case | 90% of injections | Special cases |

---

### 8️⃣ **Circular Dependencies**
**What You'll Learn:**
- What circular dependencies are and how Spring detects them
- Why constructor injection fails with circular dependencies
- Resolution strategies: @Lazy, setter injection, redesign
- Best practices to avoid circular dependencies

**The Problem:**
```java
@Service
public class ServiceA {
    private final ServiceB serviceB;
    
    public ServiceA(ServiceB serviceB) {  // A → B
        this.serviceB = serviceB;
    }
}

@Service
public class ServiceB {
    private final ServiceA serviceA;
    
    public ServiceB(ServiceA serviceA) {  // B → A
        this.serviceA = serviceA;
    }
}

// ❌ BeanCurrentlyInCreationException: Circular dependency!
```

**Solution 1: @Lazy (Quick Fix)**
```java
@Service
public class ServiceA {
    private final ServiceB serviceB;
    
    @Autowired
    public ServiceA(@Lazy ServiceB serviceB) {  // Inject proxy
        this.serviceB = serviceB;
    }
}

@Service
public class ServiceB {
    private final ServiceA serviceA;
    
    @Autowired
    public ServiceB(ServiceA serviceA) {
        this.serviceA = serviceA;
    }
}

// ✅ Works! @Lazy creates proxy, defers bean creation
```

**Solution 2: Setter Injection**
```java
@Service
public class ServiceA {
    private ServiceB serviceB;
    
    @Autowired
    public void setServiceB(ServiceB serviceB) {
        this.serviceB = serviceB;
    }
}

@Service
public class ServiceB {
    private ServiceA serviceA;
    
    @Autowired
    public void setServiceA(ServiceA serviceA) {
        this.serviceA = serviceA;
    }
}

// ✅ Works! Beans created first, dependencies injected later
```

**Solution 3: Redesign (BEST)**
```java
// ❌ Circular dependency
ServiceA → ServiceB → ServiceA

// ✅ Redesigned - extract common logic
@Service
public class CommonService { }

@Service
public class ServiceA {
    public ServiceA(CommonService common) { }
}

@Service
public class ServiceB {
    public ServiceB(CommonService common) { }
}

// No circular dependency!
```

**Resolution Strategies Ranked:**
```
1. ✅ Redesign (BEST)
   - Extract common logic
   - Use event-driven architecture
   - Introduce interfaces

2. ⚠️ @Lazy (Temporary fix)
   - Quick workaround
   - Plan to refactor

3. ⚠️ Setter Injection (Acceptable)
   - Loses immutability
   - Not thread-safe

4. ❌ ApplicationContextAware (WORST)
   - Service Locator anti-pattern
   - Never use!
```

---

## 🎯 Top 20 Interview Questions

### Q1: What is Inversion of Control (IoC)?
**Answer:** IoC is a design principle where the control flow is inverted - the framework controls the flow instead of your code. The Hollywood Principle: "Don't call us, we'll call you."

### Q2: What is Dependency Injection?
**Answer:** DI is a design pattern (and type of IoC) where objects receive dependencies from external sources rather than creating them. Promotes loose coupling and testability.

### Q3: What are the types of Dependency Injection?
**Answer:**
- Constructor Injection (recommended)
- Setter Injection (optional dependencies)
- Field Injection (avoid)
- Method Injection (rare)
- Interface Injection (Aware interfaces)

### Q4: Constructor vs Setter Injection?
**Answer:**
| Constructor | Setter |
|-------------|--------|
| Immutable (final) | Mutable |
| Mandatory deps | Optional deps |
| Thread-safe | Not thread-safe |
| Fail-fast | Can be incomplete |

Use constructor for required, setter for optional.

### Q5: Why avoid Field Injection?
**Answer:**
- Hard to test (requires Spring or reflection)
- Cannot be final (not immutable)
- Hidden dependencies
- Tight coupling to Spring
- NullPointerException risk

### Q6: What is @Autowired?
**Answer:** Annotation for automatic dependency injection. Spring finds and injects matching beans by type, name, or constructor.

### Q7: Do you need @Autowired on constructors?
**Answer:** No, if there's only one constructor (Spring 4.3+). Yes, if multiple constructors exist.

### Q8: How to inject optional dependencies?
**Answer:**
```java
// Option 1
@Autowired(required = false)

// Option 2
Optional<EmailService> email

// Option 3
@Nullable EmailService email
```

### Q9: What is autowiring ambiguity?
**Answer:** When multiple beans of same type exist, Spring doesn't know which to inject. Throws `NoUniqueBeanDefinitionException`.

### Q10: How to resolve autowiring ambiguity?
**Answer:**
1. `@Qualifier("beanName")` - explicit selection
2. `@Primary` - mark default bean
3. Parameter name matching
4. Inject `List<T>` to get all beans

### Q11: @Qualifier vs @Primary?
**Answer:**
- **@Qualifier**: Explicit choice at injection point
- **@Primary**: Default choice at bean definition
- @Qualifier overrides @Primary

### Q12: Can you have multiple @Primary?
**Answer:** No! Only ONE @Primary per type. Multiple @Primary still throws exception.

### Q13: What are circular dependencies?
**Answer:** When two or more beans depend on each other in a cycle (A → B → A). Causes `BeanCurrentlyInCreationException`.

### Q14: How to resolve circular dependencies?
**Answer:**
1. **Redesign** (best) - extract common logic, use events
2. **@Lazy** - inject proxy
3. **Setter injection** - create beans first, inject later
4. **ObjectProvider** - lazy bean resolution

### Q15: Why does constructor injection fail with circular dependencies?
**Answer:** Both constructors need dependencies BEFORE construction completes, creating a deadlock. Spring can't create either bean.

### Q16: What is @Lazy?
**Answer:** Defers bean creation. Injects a proxy instead of real bean. Real bean created on first method call.

### Q17: How to inject all beans of a type?
**Answer:**
```java
@Autowired
public MyService(List<NotificationService> services) {
    // All NotificationService beans injected
}

// Or Map
Map<String, NotificationService> services
```

### Q18: What is the Hollywood Principle?
**Answer:** "Don't call us, we'll call you" - your code doesn't call the framework, the framework calls your code (lifecycle callbacks, request handlers, events).

### Q19: BeanFactory vs ApplicationContext?
**Answer:**
| BeanFactory | ApplicationContext |
|-------------|-------------------|
| Lazy loading | Eager loading |
| Manual BeanPostProcessor | Automatic |
| No events | Event publishing |
| Basic | Enterprise features |

Use ApplicationContext.

### Q20: What's the best DI approach?
**Answer:** **Constructor injection** with **@RequiredArgsConstructor** (Lombok):
```java
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository repository;
    private final EmailService emailService;
}
```
Immutable, testable, clear dependencies.

---

## ✅ Best Practices Summary

### 1. Dependency Injection Choice
```java
// ✅ ALWAYS prefer constructor injection
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository repository;  // Mandatory
}

// ✅ Use setter ONLY for optional dependencies
@Autowired(required = false)
public void setEmailService(EmailService email) { }

// ❌ AVOID field injection
@Autowired
private UserRepository repository;  // DON'T!
```

### 2. Handling Multiple Beans
```java
// ✅ Use @Primary for clear default (90% use case)
@Component
@Primary
public class DefaultEmailService implements EmailService { }

// ✅ Use @Qualifier for specific choice
@Autowired
public MyService(@Qualifier("smtpEmail") EmailService email) { }

// ✅ Inject all beans when needed
@Autowired
public NotificationService(List<NotificationChannel> channels) { }
```

### 3. Avoiding Circular Dependencies
```java
// ❌ DON'T create circular dependencies
ServiceA → ServiceB → ServiceA

// ✅ Redesign to extract common logic
ServiceA → CommonService ← ServiceB

// ⚠️ If unavoidable, use @Lazy (temporary)
@Autowired
public ServiceA(@Lazy ServiceB serviceB) { }
```

### 4. Testing
```java
// ✅ Constructor injection makes testing easy
@Test
public void testUserService() {
    UserRepository mockRepo = mock(UserRepository.class);
    UserService service = new UserService(mockRepo);  // Simple!
    
    when(mockRepo.findById(1L)).thenReturn(Optional.of(new User()));
    User user = service.findUser(1L);
    
    assertNotNull(user);
}
```

### 5. Immutability
```java
// ✅ Use final fields for immutability and thread-safety
@Service
public class OrderService {
    private final OrderRepository repository;      // Immutable
    private final PaymentService paymentService;  // Thread-safe
    
    public OrderService(OrderRepository repository,
                       PaymentService paymentService) {
        this.repository = repository;
        this.paymentService = paymentService;
    }
}
```

---

## 🎓 Configuration Templates

### Basic Service with DI

```java
@Service
@RequiredArgsConstructor
public class UserService {
    // Required dependencies - constructor injection
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    // Optional dependencies - setter injection
    private EmailService emailService;
    
    @Autowired(required = false)
    public void setEmailService(EmailService emailService) {
        this.emailService = emailService;
    }
    
    public User registerUser(UserRegistrationDto dto) {
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        
        User savedUser = userRepository.save(user);
        
        if (emailService != null) {
            emailService.sendWelcomeEmail(savedUser);
        }
        
        return savedUser;
    }
}
```

### Configuration with Multiple Implementations

```java
// Define interface
public interface PaymentGateway {
    PaymentResult charge(Order order);
}

// Default implementation
@Component
@Primary
public class StripePayment implements PaymentGateway {
    @Override
    public PaymentResult charge(Order order) {
        // Stripe API
    }
}

// Alternative implementation
@Component
public class PayPalPayment implements PaymentGateway {
    @Override
    public PaymentResult charge(Order order) {
        // PayPal API
    }
}

// Service using default
@Service
@RequiredArgsConstructor
public class OrderService {
    private final PaymentGateway paymentGateway;  // Uses Stripe (primary)
    
    public void processOrder(Order order) {
        PaymentResult result = paymentGateway.charge(order);
    }
}

// Service using specific implementation
@Service
public class SpecialOrderService {
    private final PaymentGateway paymentGateway;
    
    @Autowired
    public SpecialOrderService(@Qualifier("payPalPayment") PaymentGateway gateway) {
        this.paymentGateway = gateway;
    }
}
```

### Notification System with Strategy Pattern

```java
public interface NotificationChannel {
    void send(String message);
}

@Component
public class EmailNotification implements NotificationChannel {
    @Override
    public void send(String message) {
        // Send email
    }
}

@Component
public class SmsNotification implements NotificationChannel {
    @Override
    public void send(String message) {
        // Send SMS
    }
}

@Component
public class PushNotification implements NotificationChannel {
    @Override
    public void send(String message) {
        // Send push
    }
}

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final List<NotificationChannel> channels;  // All implementations
    
    public void notifyAll(String message) {
        channels.forEach(channel -> channel.send(message));
    }
}
```

---

## 📌 Key Takeaways

1. **IoC** inverts control flow - framework calls your code ("Hollywood Principle")
2. **DI is a type of IoC** - objects receive dependencies instead of creating them
3. **Constructor injection is preferred** - immutable, thread-safe, testable
4. **Avoid field injection** - hard to test, not immutable, hidden dependencies
5. **@Autowired** enables automatic dependency injection
6. **@Qualifier** resolves ambiguity when multiple beans exist
7. **@Primary** sets the default bean (90% use case)
8. **Circular dependencies** are code smells - redesign instead of workarounds
9. **Setter injection** for optional dependencies only
10. **Use Lombok** `@RequiredArgsConstructor` for cleaner code

---

## 🚀 Next Steps

After mastering DI & IoC, proceed to:
- **04. Spring Boot Annotations** - Comprehensive annotation guide
- **05. Spring Boot Configuration** - Advanced configuration techniques
- **06. REST API Development** - Building RESTful services
- **07. Spring Data JPA** - Database access patterns

---

**Happy Learning! 🎯**

