# 🏷️ Spring Boot Annotations - Complete Reference

A comprehensive guide to all essential Spring Boot annotations organized by category.

---

## 📚 Table of Contents

1. [Core Annotations](#1-core-annotations)
2. [Configuration Annotations](#2-configuration-annotations)
3. [Web Annotations](#3-web-annotations)
4. [Data Annotations](#4-data-annotations)
5. [Security Annotations](#5-security-annotations)
6. [Transaction Annotations](#6-transaction-annotations)
7. [Conditional Annotations](#7-conditional-annotations)
8. [Custom Annotations](#8-custom-annotations)
9. [Quick Reference](#quick-reference)
10. [Interview Questions](#interview-questions)

---

## 1. Core Annotations

### @SpringBootApplication
- **Purpose**: Main entry point annotation
- **Combines**: @SpringBootConfiguration + @EnableAutoConfiguration + @ComponentScan
- **Use Case**: Application bootstrap

```java
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

### Stereotype Annotations

| Annotation | Layer | Purpose |
|------------|-------|---------|
| **@Component** | Generic | Any Spring component |
| **@Service** | Business | Business logic |
| **@Repository** | Data | Data access (+ exception translation) |
| **@Controller** | Web | MVC controller (returns views) |
| **@RestController** | Web | REST API (returns data) |

---

## 2. Configuration Annotations

### Bean Definition

| Annotation | Purpose | Example |
|------------|---------|---------|
| **@Configuration** | Configuration class | Bean factory |
| **@Bean** | Bean method | Manual bean creation |
| **@ComponentScan** | Auto-detect components | Package scanning |
| **@Import** | Import configs | Modular configuration |

### Property Management

```java
// @Value - Inject single property
@Value("${app.name}")
private String appName;

// @ConfigurationProperties - Type-safe properties
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    private String name;
    private int maxUsers;
}

// @PropertySource - Load properties file
@PropertySource("classpath:custom.properties")
```

### Environment-Specific

```java
@Profile("dev")   // Active in dev profile
@Profile("prod")  // Active in prod profile
@Profile("!prod") // Active when NOT prod
```

---

## 3. Web Annotations

### Request Mapping

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @GetMapping              // GET request
    @PostMapping             // POST request
    @PutMapping              // PUT request
    @PatchMapping            // PATCH request
    @DeleteMapping           // DELETE request
}
```

### Request Parameters

```java
@PathVariable Long id              // /users/{id}
@RequestParam String name          // /users?name=john
@RequestBody UserDto dto           // Request body → object
@RequestHeader String token        // HTTP header
```

### Response Control

```java
@ResponseBody                      // Serialize to JSON/XML
@ResponseStatus(HttpStatus.CREATED) // Set status code
ResponseEntity<User>               // Full response control
```

### Exception Handling

```java
@ExceptionHandler                  // Handle specific exceptions
@ControllerAdvice                  // Global exception handling
@RestControllerAdvice              // Global REST exception handling
```

### CORS

```java
@CrossOrigin(origins = "http://localhost:3000")
```

---

## 4. Data Annotations

### Entity Mapping

```java
@Entity                            // JPA entity
@Table(name = "users")             // Table name
@Id                                // Primary key
@GeneratedValue(strategy = IDENTITY) // Auto-generate ID
@Column(nullable = false)          // Column mapping
```

### Relationships

```java
@OneToOne                          // 1:1 relationship
@OneToMany                         // 1:N relationship
@ManyToOne                         // N:1 relationship
@ManyToMany                        // N:M relationship

@JoinColumn(name = "user_id")      // Foreign key
@JoinTable                         // Join table (M:M)
```

### Field Mapping

```java
@Transient                         // Don't persist
@Lob                               // Large object (BLOB/CLOB)
@Enumerated(EnumType.STRING)       // Enum mapping
@Temporal(TemporalType.TIMESTAMP)  // Date/time mapping
```

### Queries

```java
@Query("SELECT u FROM User u WHERE u.email = :email")
Optional<User> findByEmail(@Param("email") String email);

@Modifying                         // UPDATE/DELETE query
@EntityGraph                       // Solve N+1 problem
```

### Fetch Strategies

```java
fetch = FetchType.LAZY             // Load when accessed
fetch = FetchType.EAGER            // Load immediately
cascade = CascadeType.ALL          // Cascade operations
orphanRemoval = true               // Delete orphans
```

---

## 5. Security Annotations

### Method Security

```java
@EnableMethodSecurity              // Enable method security

@Secured("ROLE_ADMIN")            // Simple role check
@PreAuthorize("hasRole('ADMIN')") // Before method (SpEL)
@PostAuthorize("returnObject.owner == authentication.name") // After method
@RolesAllowed("ROLE_ADMIN")       // JSR-250 annotation
```

### Advanced Security

```java
// Check ownership
@PreAuthorize("#userId == authentication.principal.id")
public void update(Long userId, Data data) { }

// Filter collections
@PreFilter("filterObject.owner == authentication.name")
@PostFilter("filterObject.isPublic or filterObject.owner == authentication.name")

// Custom security
@PreAuthorize("@securityService.canAccess(#id)")
```

### Testing

```java
@WithMockUser(username = "user", roles = "USER")
@Test
void testUserAccess() { }
```

---

## 6. Transaction Annotations

### @Transactional

```java
@Transactional                     // Default transaction

@Transactional(readOnly = true)    // Read-only optimization
@Transactional(timeout = 10)       // 10 second timeout
@Transactional(rollbackFor = Exception.class) // Rollback rules
```

### Propagation

```java
REQUIRED         // Join existing or create new (default)
REQUIRES_NEW     // Always create new
MANDATORY        // Must exist
SUPPORTS         // Optional
NOT_SUPPORTED    // Never use transaction
NEVER            // Forbidden
NESTED           // Nested with savepoint
```

### Isolation

```java
READ_UNCOMMITTED // Dirty reads possible
READ_COMMITTED   // Prevents dirty reads
REPEATABLE_READ  // Prevents non-repeatable reads
SERIALIZABLE     // Complete isolation
```

### Transaction Events

```java
@TransactionalEventListener(phase = AFTER_COMMIT)
public void afterCommit(OrderCreatedEvent event) { }
```

---

## 7. Conditional Annotations

### Property-Based

```java
@ConditionalOnProperty(
    name = "cache.enabled",
    havingValue = "true",
    matchIfMissing = true
)
```

### Class-Based

```java
@ConditionalOnClass(RedisTemplate.class)      // Class exists
@ConditionalOnMissingClass("com.example.Foo") // Class missing
```

### Bean-Based

```java
@ConditionalOnBean(DataSource.class)          // Bean exists
@ConditionalOnMissingBean(DataSource.class)   // Bean missing
```

### Expression-Based

```java
@ConditionalOnExpression("${cache.enabled} and ${cache.type} == 'redis'")
```

### Profile-Based

```java
@Profile("dev")                    // Active in dev
@Profile({"dev", "test"})          // dev OR test
@Profile("prod & cloud")           // prod AND cloud
@Profile("!prod")                  // NOT prod
```

---

## 8. Custom Annotations

### Create Custom Annotation

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface LogExecutionTime {
    String value() default "";
}
```

### Composed Annotations

```java
@RestController
@RequestMapping("/api")
@CrossOrigin
@Validated
public @interface ApiController {
}
```

### Custom Validation

```java
@Constraint(validatedBy = EmailValidator.class)
public @interface ValidEmail {
    String message() default "Invalid email";
}
```

### AOP Integration

```java
@Aspect
@Component
public class LoggingAspect {
    @Around("@annotation(LogExecutionTime)")
    public Object log(ProceedingJoinPoint pjp) throws Throwable {
        long start = System.currentTimeMillis();
        Object result = pjp.proceed();
        log.info("Executed in {} ms", System.currentTimeMillis() - start);
        return result;
    }
}
```

---

## Quick Reference

### By Use Case

| Use Case | Annotation |
|----------|------------|
| **Main application** | @SpringBootApplication |
| **Business logic** | @Service |
| **Data access** | @Repository |
| **REST endpoint** | @RestController |
| **Bean definition** | @Bean |
| **Inject property** | @Value |
| **Type-safe config** | @ConfigurationProperties |
| **Database entity** | @Entity |
| **Transaction** | @Transactional |
| **Security** | @PreAuthorize |
| **Conditional bean** | @ConditionalOnProperty |
| **Profile-specific** | @Profile |

### By Layer

```
Presentation Layer:
├── @RestController
├── @RequestMapping
├── @GetMapping/@PostMapping/etc.
├── @RequestBody/@PathVariable/@RequestParam
└── @ExceptionHandler/@ControllerAdvice

Business Layer:
├── @Service
├── @Transactional
├── @PreAuthorize/@PostAuthorize
└── @Validated

Data Layer:
├── @Repository
├── @Entity/@Table
├── @Id/@GeneratedValue
├── @OneToMany/@ManyToOne/etc.
└── @Query

Configuration Layer:
├── @Configuration
├── @Bean
├── @ConfigurationProperties
├── @Profile
└── @ConditionalOnProperty
```

---

## Interview Questions

### Core Annotations

**Q1: What is @SpringBootApplication?**
- Combines @SpringBootConfiguration, @EnableAutoConfiguration, @ComponentScan
- Main entry point for Spring Boot application

**Q2: Difference between @Component and @Service?**
- Functionally identical (both create beans)
- @Service indicates business logic layer (semantic difference)

**Q3: @Controller vs @RestController?**
- @Controller returns view names (HTML)
- @RestController = @Controller + @ResponseBody (returns data/JSON)

### Configuration

**Q4: @Value vs @ConfigurationProperties?**
- @Value: Simple properties, SpEL expressions
- @ConfigurationProperties: Complex nested properties, type-safe, validation

**Q5: What is @Profile?**
- Activates beans based on environment (dev, prod, test)
- Can use logical operators (AND, OR, NOT)

### Web

**Q6: @PathVariable vs @RequestParam?**
- @PathVariable: From URL path (`/users/{id}`)
- @RequestParam: From query string (`/users?id=123`)

**Q7: What is @ControllerAdvice?**
- Global exception handling for all controllers
- Centralized error handling

### Data

**Q8: LAZY vs EAGER fetching?**
- LAZY: Load when accessed (default for collections)
- EAGER: Load immediately (default for single entities)

**Q9: What is @Transactional propagation?**
- Controls transaction behavior when methods call each other
- Types: REQUIRED, REQUIRES_NEW, MANDATORY, etc.

**Q10: What is N+1 query problem?**
- 1 query for parent + N queries for children
- Solve with @EntityGraph, JOIN FETCH, or batch fetching

### Security

**Q11: @Secured vs @PreAuthorize?**
- @Secured: Simple role-based
- @PreAuthorize: SpEL-based, supports complex expressions

**Q12: What is @PreFilter and @PostFilter?**
- @PreFilter: Filters collection parameters before method
- @PostFilter: Filters returned collection after method

### Conditional

**Q13: What is @ConditionalOnMissingBean?**
- Creates bean only if specified bean doesn't exist
- Used for providing default implementations

**Q14: matchIfMissing in @ConditionalOnProperty?**
- Determines behavior when property is missing
- If true, bean created even if property absent

### Custom

**Q15: How to create custom annotation?**
```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface MyAnnotation { }
```

**Q16: What is @Retention?**
- SOURCE: Discarded by compiler
- CLASS: In .class but not at runtime
- RUNTIME: Available at runtime via reflection

**Q17: What are composed annotations?**
- Annotations that combine multiple annotations
- Example: @RestController = @Controller + @ResponseBody

**Q18: How to use custom annotations with AOP?**
- Create @Aspect with advice targeting `@annotation(yourAnnotation)`

### Transactions

**Q19: What is transaction isolation?**
- Controls data visibility between concurrent transactions
- Levels: READ_UNCOMMITTED, READ_COMMITTED, REPEATABLE_READ, SERIALIZABLE

**Q20: Default rollback behavior?**
- RuntimeException: Rolls back
- Checked Exception: Commits
- Use `rollbackFor` to change

---

## Summary

### Most Important Annotations

1. **@SpringBootApplication** - Application entry point
2. **@RestController** - REST API endpoints
3. **@Service** - Business logic
4. **@Repository** - Data access
5. **@Transactional** - Transaction management
6. **@Entity** - JPA entities
7. **@ConfigurationProperties** - Type-safe configuration
8. **@PreAuthorize** - Method security
9. **@ConditionalOnProperty** - Conditional beans
10. **@Profile** - Environment-specific config

### Best Practices

1. ✅ Use appropriate stereotype annotations (@Service, @Repository)
2. ✅ Use @Transactional(readOnly = true) for queries
3. ✅ Use @ConfigurationProperties over @Value for complex properties
4. ✅ Use LAZY fetch for collections to avoid N+1
5. ✅ Use @PreAuthorize for complex security logic
6. ✅ Use @ConditionalOnMissingBean for defaults
7. ✅ Use composed annotations to reduce boilerplate
8. ✅ Document custom annotations well
9. ✅ Keep transactions short and focused
10. ✅ Use profiles for environment-specific configuration

### Complete Example

```java
// Application
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

// Configuration
@Configuration
@EnableConfigurationProperties(AppProperties.class)
public class AppConfig {
    @Bean
    @ConditionalOnMissingBean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}

@ConfigurationProperties(prefix = "app")
public class AppProperties {
    private String name;
    private int maxUsers;
}

// Entity
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String username;
    
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Order> orders;
}

// Repository
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    @Query("SELECT u FROM User u WHERE u.email = :email")
    Optional<User> findByEmail(@Param("email") String email);
}

// Service
@Service
@Transactional(readOnly = true)
public class UserService {
    
    private final UserRepository userRepository;
    
    public User findById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException(id));
    }
    
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}

// Controller
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.findById(id));
    }
    
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public User createUser(@Valid @RequestBody UserDto dto) {
        return userService.create(dto);
    }
    
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}

// Exception Handling
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(UserNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorResponse(404, ex.getMessage()));
    }
}
```

---

## 📖 Further Reading

- [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Spring Framework Documentation](https://docs.spring.io/spring-framework/docs/current/reference/html/)
- [Spring Data JPA Documentation](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/)
- [Spring Security Documentation](https://docs.spring.io/spring-security/reference/)

---

**Mastering these annotations is essential for Spring Boot development!** 🚀

