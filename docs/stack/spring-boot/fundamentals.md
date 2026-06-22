---
title: Fundamentals
description: Spring Boot auto-configuration, starters, IoC container, bean lifecycle, scopes, profiles, events, @ConfigurationProperties, CommandLineRunner, and application startup internals.
---

# Fundamentals

Spring Boot is Spring Framework with opinions baked in. It eliminates the XML and Java configuration that made Spring applications tedious to bootstrap by using **auto-configuration** — scanning the classpath and automatically wiring sensible defaults. You override only what you need to change.

---

## Spring vs Spring Boot

| | Spring Framework | Spring Boot |
|---|---|---|
| **Configuration** | Explicit XML or `@Configuration` | Auto-configured from classpath |
| **Server** | Deploy WAR to Tomcat/Jetty | Embedded server — run as `java -jar` |
| **Dependency management** | Manage all versions manually | Parent POM manages compatible versions |
| **Entry point** | `web.xml` or AnnotationConfigDispatcherServlet | `@SpringBootApplication` + `main()` |

---

## `@SpringBootApplication` — Three Annotations in One

```java
@SpringBootApplication
public class OrderServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(OrderServiceApplication.class, args);
    }
}
```

`@SpringBootApplication` is shorthand for:
- `@SpringBootConfiguration` — marks this as a `@Configuration` class
- `@EnableAutoConfiguration` — activates auto-configuration based on classpath
- `@ComponentScan` — scans the current package and all sub-packages

```java
// Exclude specific auto-configurations
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
```

---

## How Auto-Configuration Works

Spring Boot auto-configuration is driven by `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` files in starter JARs. Each entry is a `@Configuration` class annotated with `@Conditional*` annotations:

```java
@Configuration
@ConditionalOnClass(DataSource.class)           // only if DataSource is on classpath
@ConditionalOnMissingBean(DataSource.class)     // only if no DataSource bean defined yet
@EnableConfigurationProperties(DataSourceProperties.class)
public class DataSourceAutoConfiguration {
    @Bean
    public DataSource dataSource(DataSourceProperties props) {
        return DataSourceBuilder.create()
            .url(props.getUrl())
            .build();
    }
}
```

### Conditional annotations

| Annotation | Condition |
|---|---|
| `@ConditionalOnClass(Foo.class)` | Foo is present on the classpath |
| `@ConditionalOnMissingClass("com.Foo")` | Foo is NOT on the classpath |
| `@ConditionalOnBean(Foo.class)` | A Foo bean already exists |
| `@ConditionalOnMissingBean(Foo.class)` | No Foo bean exists yet |
| `@ConditionalOnProperty("app.feature.enabled")` | Property is true/present |
| `@ConditionalOnWebApplication` | Running as a web application |
| `@ConditionalOnExpression("${x} == 1")` | SpEL expression is true |
| `@ConditionalOnResource("classpath:config.xml")` | Resource exists |

---

## Starter Dependencies

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.3.0</version>
</parent>
<dependencies>
    <dependency><groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>    <!-- spring-webmvc, jackson, embedded Tomcat, validation -->
    <dependency><groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>    <!-- Hibernate, Spring Data JPA, HikariCP -->
    <dependency><groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency><groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>
    <dependency><groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-cache</artifactId>
    </dependency>
    <dependency><groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-devtools</artifactId>
        <scope>runtime</scope><optional>true</optional>
    </dependency>    <!-- auto-restart on class change, LiveReload -->
    <dependency><groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>    <!-- JUnit 5, Mockito, MockMvc, Testcontainers -->
</dependencies>
```

---

## IoC Container and Dependency Injection

### Bean stereotypes

| Annotation | Layer | Extra behaviour |
|---|---|---|
| `@Component` | Any | Base stereotype |
| `@Service` | Business logic | Semantic only |
| `@Repository` | Data access | Translates JPA/JDBC exceptions to `DataAccessException` |
| `@Controller` | MVC views | Detected for request mapping |
| `@RestController` | REST APIs | `@Controller` + `@ResponseBody` |
| `@Configuration` | Config classes | `@Bean` methods proxied for singleton enforcement |

### Dependency injection — constructor injection is always preferred

```java
@Service
public class OrderService {
    private final OrderRepository repo;
    private final PaymentService paymentService;

    // Constructor injection: explicit, immutable, testable without Spring
    public OrderService(OrderRepository repo, PaymentService paymentService) {
        this.repo = repo;
        this.paymentService = paymentService;
    }
}
```

### `@Qualifier`, `@Primary`, and `@Lazy`

```java
// Multiple beans of same type
@Service @Qualifier("stripe")  public class StripePayment implements PaymentService {}
@Service @Primary              public class PayPalPayment  implements PaymentService {}

// Inject specific implementation
public OrderService(@Qualifier("stripe") PaymentService svc) {}

// Lazy: don't create bean until first use (useful for optional expensive beans)
@Lazy @Autowired private ExpensiveService expensive;
```

---

## Bean Scopes

```java
@Component
@Scope("singleton")  // default — one shared instance per ApplicationContext
public class OrderCache { }

@Component
@Scope("prototype")  // new instance every time the bean is requested
public class OrderBuilder { }

@Component
@Scope(value = WebApplicationContext.SCOPE_REQUEST, proxyMode = ScopedProxyMode.TARGET_CLASS)
public class RequestContext { } // new instance per HTTP request

@Component
@Scope(value = WebApplicationContext.SCOPE_SESSION, proxyMode = ScopedProxyMode.TARGET_CLASS)
public class UserCart { } // new instance per HTTP session
```

> **Use `proxyMode = ScopedProxyMode.TARGET_CLASS`** for request/session scoped beans injected into singletons. Without it Spring cannot inject a narrower-scoped bean into a singleton.

---

## Bean Lifecycle

```java
@Component
public class CacheWarmer implements InitializingBean, DisposableBean {

    private final UserRepository repo;
    public CacheWarmer(UserRepository repo) { this.repo = repo; }

    @PostConstruct  // preferred over InitializingBean
    public void warmUp() {
        // Runs after constructor + dependency injection
        // Safe to use injected dependencies here
        log.info("Warming up cache, {} users", repo.count());
    }

    @PreDestroy  // preferred over DisposableBean
    public void cleanup() {
        log.info("Releasing cache resources");
    }
}

// Alternative: @Bean(initMethod="start", destroyMethod="stop")
@Bean(initMethod = "start", destroyMethod = "stop")
public MyService myService() { return new MyService(); }
```

---

## Application Events

Spring has a rich event system. Use it to decouple components:

```java
// Custom event (Java record works great here)
public record OrderCreatedEvent(UUID orderId, String customerId, BigDecimal total) {}

// Publishing
@Service
public class OrderService {
    private final ApplicationEventPublisher eventPublisher;

    public Order createOrder(CreateOrderRequest req) {
        Order saved = orderRepo.save(buildOrder(req));
        eventPublisher.publishEvent(new OrderCreatedEvent(
            saved.getId(), req.customerId(), saved.getTotal()));
        return saved;
    }
}

// Listening — can be in any Spring bean
@Component
public class NotificationListener {

    @EventListener
    public void onOrderCreated(OrderCreatedEvent event) {
        emailService.sendConfirmation(event.customerId(), event.orderId());
    }

    @EventListener
    @Async  // handle asynchronously so it doesn't slow down the publishing thread
    public void indexOrder(OrderCreatedEvent event) {
        searchIndex.index(event.orderId());
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void afterCommit(OrderCreatedEvent event) {
        // Only fires after the publishing transaction commits successfully
        // Prevents sending notifications for rolled-back orders
        kafkaTemplate.send("orders", event.orderId().toString(), event);
    }
}
```

---

## `@Value` and `@ConfigurationProperties`

```java
// @Value: inject individual properties (SpEL supported)
@Value("${app.payment.api-key}")
private String apiKey;

@Value("${app.payment.timeout-seconds:30}")  // default value after :
private int timeoutSeconds;

@Value("${app.feature.enabled:false}")
private boolean featureEnabled;

// @ConfigurationProperties: type-safe binding of a group of properties
@ConfigurationProperties(prefix = "app.payment")
@Validated
public record PaymentProperties(
    @NotBlank String apiKey,
    @NotNull URI baseUrl,
    @Min(1) @Max(120) int timeoutSeconds,
    boolean sandboxMode
) {}

@SpringBootApplication
@EnableConfigurationProperties(PaymentProperties.class)
public class OrderServiceApplication {}

// Inject the record anywhere:
@Service
public class PaymentService {
    private final PaymentProperties config;
    // ...
}
```

```yaml
# application.yml
app:
  payment:
    api-key: ${PAYMENT_API_KEY}
    base-url: https://api.stripe.com
    timeout-seconds: 30
    sandbox-mode: false
```

---

## Profiles

```java
@Component @Profile("production")
public class SentryErrorReporter implements ErrorReporter { }

@Component @Profile("!production")  // NOT production
public class LoggingErrorReporter implements ErrorReporter { }

@Configuration @Profile({"dev", "test"})  // either dev or test
public class DevDataConfig { }
```

```yaml
# application.yml
spring:
  profiles:
    active: ${SPRING_PROFILES_ACTIVE:dev}  # env var with fallback

---
spring:
  config:
    activate:
      on-profile: production
  datasource:
    url: ${DB_URL}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
```

```bash
# Activate at runtime
java -jar app.jar --spring.profiles.active=production
SPRING_PROFILES_ACTIVE=production java -jar app.jar
```

---

## `CommandLineRunner` and `ApplicationRunner`

Run code after the application context is fully started:

```java
@Component
@Order(1)  // run first
public class SchemaValidator implements CommandLineRunner {
    @Override
    public void run(String... args) {
        validateDatabaseSchema();
        log.info("Schema validation passed");
    }
}

@Component
@Order(2)
public class DataSeeder implements ApplicationRunner {
    @Override
    public void run(ApplicationArguments args) {
        // ApplicationArguments provides named and optional arguments
        if (args.containsOption("seed")) {
            seedInitialData();
        }
    }
}
```

---

## Application Properties Hierarchy

Properties are loaded in priority order — later sources override earlier ones:

```
1. Default properties (SpringApplication.setDefaultProperties)
2. @PropertySource annotations
3. application.properties / application.yml
4. application-{profile}.properties / application-{profile}.yml
5. Environment variables
6. Command-line arguments (--server.port=9090)
```

```yaml
server:
  port: 8080
  shutdown: graceful

spring:
  application:
    name: order-service
  datasource:
    url: ${DB_URL:jdbc:h2:mem:devdb}  # env var with fallback
    username: ${DB_USERNAME:sa}
    password: ${DB_PASSWORD:}
  jpa:
    hibernate:
      ddl-auto: validate       # never create/drop in production
    open-in-view: false        # disable to prevent lazy-load in view anti-pattern
    show-sql: false

logging:
  level:
    com.example: INFO
    org.hibernate.SQL: DEBUG   # log SQL in dev only
```
