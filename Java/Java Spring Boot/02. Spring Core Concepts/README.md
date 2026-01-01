# 🌱 Spring Core Concepts - Complete Study Guide

## 📚 Overview

This comprehensive guide covers the fundamental concepts of Spring Framework that form the foundation for Spring Boot development. Each topic is designed for interview preparation with practical examples, best practices, and detailed explanations.

---

## 📖 Topics Covered

### 1️⃣ **Spring Framework Overview**
**What You'll Learn:**
- Spring ecosystem architecture and modules
- Core principles: IoC, DI, AOP
- Evolution from Spring 1.x to Spring 6.x
- Spring vs Java EE comparison
- Spring Boot, Cloud, Data, Security integration

**Key Concepts:**
```java
// IoC Container manages object lifecycle
@Configuration
public class AppConfig {
    @Bean
    public UserService userService() {
        return new UserServiceImpl();
    }
}
```

**Core Principles:**
- **Inversion of Control (IoC)**: Container manages object creation
- **Dependency Injection (DI)**: Dependencies injected, not created
- **Aspect-Oriented Programming (AOP)**: Cross-cutting concerns separation
- **POJO-Based**: No framework inheritance required

**Spring Ecosystem:**
- Spring Boot → Rapid development
- Spring Cloud → Microservices
- Spring Data → Database access
- Spring Security → Authentication/Authorization
- Spring Batch → Batch processing

---

### 2️⃣ **Bean Lifecycle**
**What You'll Learn:**
- Complete bean lifecycle from instantiation to destruction
- Initialization and destruction callbacks
- BeanPostProcessor for custom processing
- Aware interfaces for Spring infrastructure access

**Lifecycle Phases:**
```
1. Instantiation → Constructor called
2. Population → Dependencies injected
3. Aware Interfaces → BeanNameAware, ApplicationContextAware
4. BeanPostProcessor (Before) → Custom pre-processing
5. Initialization → @PostConstruct → afterPropertiesSet() → init-method
6. BeanPostProcessor (After) → AOP proxies created
7. Ready for Use
8. Destruction → @PreDestroy → destroy() → destroy-method
```

**Initialization Methods:**
```java
// Method 1: @PostConstruct (Recommended)
@PostConstruct
public void init() {
    // Initialize resources
}

// Method 2: InitializingBean
public void afterPropertiesSet() throws Exception {
    // Can throw checked exceptions
}

// Method 3: Custom init-method
@Bean(initMethod = "customInit")
```

**Key Points:**
- Prototype beans don't get destruction callbacks
- BeanPostProcessor creates AOP proxies
- Use @PostConstruct for most cases
- Always cleanup resources in @PreDestroy

---

### 3️⃣ **ApplicationContext**
**What You'll Learn:**
- Advanced Spring container features
- Different ApplicationContext types
- Event publication mechanism
- Internationalization and resource loading

**ApplicationContext vs BeanFactory:**
| Feature | BeanFactory | ApplicationContext |
|---------|-------------|-------------------|
| Bean Loading | Lazy | Eager |
| BeanPostProcessor | Manual | Automatic |
| Events | ❌ | ✅ |
| i18n | ❌ | ✅ |

**Types of ApplicationContext:**
```java
// 1. Java Config (Most common)
ApplicationContext context = 
    new AnnotationConfigApplicationContext(AppConfig.class);

// 2. XML Config
ApplicationContext context = 
    new ClassPathXmlApplicationContext("beans.xml");

// 3. Web Applications
WebApplicationContext webContext = ...

// 4. Spring Boot
ConfigurableApplicationContext context = 
    SpringApplication.run(Application.class, args);
```

**Features:**
- **Event Publishing**: Loose coupling via events
- **i18n**: MessageSource for internationalization
- **Resource Loading**: Load files from various sources
- **Environment Abstraction**: Access properties and profiles

---

### 4️⃣ **Bean Scopes**
**What You'll Learn:**
- Different bean scopes and their use cases
- Singleton vs prototype scope
- Web scopes (request, session, application)
- Scoped proxies for proper dependency injection

**Scope Types:**
| Scope | Instances | Lifecycle | Use Case |
|-------|-----------|-----------|----------|
| singleton | 1 per container | Container lifetime | Stateless services |
| prototype | New each time | Per request | Stateful beans |
| request | 1 per HTTP request | Request duration | Request data |
| session | 1 per HTTP session | Session duration | User session |
| application | 1 per ServletContext | App lifetime | Global state |

**Examples:**
```java
// Singleton (default)
@Component
public class UserService { }

// Prototype
@Component
@Scope("prototype")
public class ShoppingCart { }

// Request scope with proxy
@Component
@RequestScope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class RequestData { }

// Session scope
@Component
@SessionScope
public class UserSession { }
```

**Scoped Proxy Problem & Solution:**
```java
// Problem: Singleton depends on request-scoped bean
@Component
public class SingletonService {
    @Autowired
    private RequestData requestData; // Injected once!
}

// Solution: Use scoped proxy
@Component
@RequestScope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class RequestData { }
```

**Key Points:**
- Default scope is singleton
- Prototype beans don't have destruction callbacks
- Use scoped proxy when narrow scope injected into wider scope
- Web scopes only work in WebApplicationContext

---

### 5️⃣ **Component Scanning**
**What You'll Learn:**
- Automatic bean discovery with stereotype annotations
- Configuring component scanning
- Include/exclude filters
- Performance optimization

**Stereotype Annotations:**
```java
@Component    // Generic component
@Service      // Business logic layer
@Repository   // Data access layer (exception translation)
@Controller   // MVC controller
@RestController // REST API controller
```

**Enabling Component Scanning:**
```java
// Method 1: @ComponentScan
@Configuration
@ComponentScan(basePackages = "com.example")
public class AppConfig { }

// Method 2: @SpringBootApplication (includes @ComponentScan)
@SpringBootApplication
public class Application { }

// Type-safe scanning (preferred)
@ComponentScan(basePackageClasses = ServiceMarker.class)
```

**Filters:**
```java
@ComponentScan(
    basePackages = "com.example",
    excludeFilters = @ComponentScan.Filter(
        type = FilterType.REGEX,
        pattern = ".*Test.*"
    )
)
```

**Filter Types:**
- ANNOTATION - By annotation type
- ASSIGNABLE_TYPE - By class/interface
- REGEX - Regular expression
- ASPECTJ - AspectJ patterns
- CUSTOM - Custom TypeFilter

---

### 6️⃣ **Spring Profiles**
**What You'll Learn:**
- Environment-specific configuration
- Profile activation methods
- Profile expressions and groups
- Best practices for multi-environment apps

**Defining Profiles:**
```java
@Configuration
@Profile("dev")
public class DevConfig {
    @Bean
    public DataSource dataSource() {
        return new EmbeddedDatabaseBuilder()
            .setType(EmbeddedDatabaseType.H2)
            .build();
    }
}

@Configuration
@Profile("prod")
public class ProdConfig {
    @Bean
    public DataSource dataSource() {
        HikariDataSource ds = new HikariDataSource();
        ds.setJdbcUrl("jdbc:postgresql://prod-db:5432/app");
        return ds;
    }
}
```

**Activating Profiles:**
```properties
# application.properties
spring.profiles.active=dev

# Command line
java -jar app.jar --spring.profiles.active=prod

# Environment variable
export SPRING_PROFILES_ACTIVE=prod
```

**Profile Expressions:**
```java
@Profile("!prod")              // NOT production
@Profile("dev | test")         // dev OR test
@Profile("prod & cloud")       // prod AND cloud
@Profile("(prod | staging) & aws") // Complex
```

**Profile Groups (Spring Boot 2.4+):**
```properties
spring.profiles.group.development=dev,mysql,swagger,debug
spring.profiles.group.production=prod,postgres,monitoring
spring.profiles.active=development
```

---

### 7️⃣ **Property Sources**
**What You'll Learn:**
- Externalizing configuration
- Property loading hierarchy
- @Value vs @ConfigurationProperties
- Environment variable and command-line integration

**Property Hierarchy (Highest to Lowest):**
```
1. Command-line arguments
2. Java system properties
3. OS environment variables
4. Profile-specific properties
5. Application properties
6. @PropertySource
7. Default properties
```

**@Value Annotation:**
```java
@Component
public class AppConfig {
    @Value("${app.name}")
    private String appName;
    
    @Value("${app.timeout:30}")
    private int timeout; // Default: 30
    
    @Value("#{systemProperties['user.name']}")
    private String userName;
    
    @Value("#{T(java.lang.Math).random()}")
    private double random;
}
```

**@ConfigurationProperties (Preferred for Groups):**
```java
@Component
@ConfigurationProperties(prefix = "app")
@Validated
public class AppProperties {
    @NotEmpty
    private String name;
    
    @Min(1) @Max(1000)
    private int maxConnections;
    
    private Security security;
    
    // Getters and setters
}
```

**@Value vs @ConfigurationProperties:**
| Feature | @Value | @ConfigurationProperties |
|---------|--------|-------------------------|
| Use Case | Single property | Group of properties |
| Type Safety | Limited | Full |
| Validation | Manual | Built-in |
| SpEL | ✅ | ❌ |
| Relaxed Binding | ❌ | ✅ |

**External Configuration:**
```bash
# Load external file
java -jar app.jar --spring.config.location=file:/path/to/config.properties

# Environment variables (relaxed binding)
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/mydb
export APP_MAX_CONNECTIONS=100
```

---

### 8️⃣ **Spring Expression Language (SpEL)**
**What You'll Learn:**
- Runtime expression evaluation
- Property and method access
- Operators and collection manipulation
- Security and conditional expressions

**Basic Syntax:**
```java
@Component
public class SpELExample {
    // Literal
    @Value("#{1 + 1}")
    private int result; // 2
    
    // String operations
    @Value("#{'hello'.toUpperCase()}")
    private String upper; // "HELLO"
    
    // Static method
    @Value("#{T(java.lang.Math).random()}")
    private double random;
    
    // Bean reference
    @Value("#{userService.getUsername()}")
    private String username;
    
    // System property
    @Value("#{systemProperties['user.name']}")
    private String user;
    
    // Environment variable
    @Value("#{systemEnvironment['PATH']}")
    private String path;
}
```

**Operators:**
```java
// Arithmetic: +, -, *, /, %, ^
@Value("#{10 * 2 + 3}") // 23

// Relational: <, >, <=, >=, ==, !=
@Value("#{10 > 5}") // true

// Logical: and, or, not
@Value("#{true and false}") // false

// Ternary
@Value("#{user.age >= 18 ? 'Adult' : 'Minor'}")

// Elvis (null-safe)
@Value("#{user.name ?: 'Guest'}")

// Regex
@Value("#{'test@example.com' matches '.*@.*'}") // true
```

**Collection Selection:**
```java
// Filter (.?[])
@Value("#{users.?[age > 18]}")
private List<User> adults;

// First match (.^[])
@Value("#{users.^[age > 18]}")
private User firstAdult;

// Last match (.$[])
@Value("#{users.$[age > 18]}")
private User lastAdult;

// Projection (.![])
@Value("#{users.![name]}")
private List<String> names;
```

**Security Expressions:**
```java
@PreAuthorize("hasRole('ADMIN')")
public void adminOnly() { }

@PreAuthorize("#username == authentication.principal.username")
public void ownProfile(@PathVariable String username) { }

@PostAuthorize("returnObject.owner == authentication.name")
public Order getOrder(Long id) { }
```

---

## 🎯 Top 20 Interview Questions

### Q1: What is Spring Framework and why use it?
**Answer:** Spring is a comprehensive framework for enterprise Java development providing:
- **IoC Container**: Manages object lifecycle and dependencies
- **AOP**: Cross-cutting concerns (logging, security, transactions)
- **Data Access**: JDBC, ORM, Transaction Management
- **Web Framework**: MVC, REST, WebFlux
- **Testability**: Easy mocking and testing

Benefits: Lightweight, POJO-based, modular, extensive ecosystem.

### Q2: Explain Dependency Injection and its types?
**Answer:** DI is a design pattern where objects receive dependencies from external sources rather than creating them.

**Types:**
```java
// 1. Constructor Injection (Recommended)
public UserService(UserRepository repository) {
    this.repository = repository;
}

// 2. Setter Injection
public void setRepository(UserRepository repository) {
    this.repository = repository;
}

// 3. Field Injection (Avoid)
@Autowired
private UserRepository repository;
```

### Q3: What is the bean lifecycle in Spring?
**Answer:** 
```
1. Instantiation → Constructor
2. Population → @Autowired dependencies
3. Aware Interfaces → BeanNameAware, ApplicationContextAware
4. BeanPostProcessor (Before)
5. Initialization → @PostConstruct → afterPropertiesSet() → init-method
6. BeanPostProcessor (After) → AOP proxies
7. Ready for Use
8. Destruction → @PreDestroy → destroy() → destroy-method
```

### Q4: Difference between BeanFactory and ApplicationContext?
**Answer:**
| BeanFactory | ApplicationContext |
|-------------|-------------------|
| Lazy loading | Eager loading |
| Manual BeanPostProcessor | Automatic |
| No events | Event publishing |
| No i18n | MessageSource support |

ApplicationContext is preferred for enterprise apps.

### Q5: What are bean scopes? Explain each.
**Answer:**
- **singleton** (default): One instance per container
- **prototype**: New instance per request
- **request**: One per HTTP request (web only)
- **session**: One per HTTP session (web only)
- **application**: One per ServletContext
- **websocket**: One per WebSocket session

### Q6: What is @ComponentScan and how does it work?
**Answer:** @ComponentScan enables automatic bean discovery by scanning packages for stereotype annotations (@Component, @Service, @Repository, @Controller).

```java
@ComponentScan(basePackages = "com.example")
public class AppConfig { }
```

Spring scans packages, detects annotated classes, creates bean definitions, and registers them.

### Q7: What are Spring Profiles?
**Answer:** Profiles segregate configuration for different environments.

```java
@Profile("dev")
public class DevConfig { }

@Profile("prod")
public class ProdConfig { }
```

Activate: `spring.profiles.active=dev` or `--spring.profiles.active=prod`

### Q8: Difference between @Value and @ConfigurationProperties?
**Answer:**
| @Value | @ConfigurationProperties |
|--------|-------------------------|
| Single property | Group of properties |
| SpEL support | No SpEL |
| No validation | Built-in validation |
| Less type-safe | Fully type-safe |

Use @ConfigurationProperties for grouped, validated configuration.

### Q9: What is SpEL?
**Answer:** Spring Expression Language for runtime expression evaluation.

```java
@Value("#{systemProperties['user.name']}")
private String user;

@Value("#{users.?[age > 18]}")
private List<User> adults;

@PreAuthorize("hasRole('ADMIN')")
```

### Q10: How to externalize configuration in Spring Boot?
**Answer:** Multiple ways:
1. application.properties/yml
2. Profile-specific files (application-dev.properties)
3. Environment variables
4. Command-line arguments
5. @PropertySource
6. External config files (--spring.config.location)

### Q11: What is @PostConstruct and @PreDestroy?
**Answer:** Lifecycle callback annotations:
- **@PostConstruct**: Called after dependency injection, before bean is ready
- **@PreDestroy**: Called before bean destruction

```java
@PostConstruct
public void init() {
    // Initialize resources
}

@PreDestroy
public void cleanup() {
    // Release resources
}
```

### Q12: Explain scoped proxy in Spring?
**Answer:** Scoped proxy allows injecting narrow-scoped beans into wider-scoped beans.

```java
// Problem: Singleton depends on request bean
@Component
public class SingletonService {
    @Autowired
    private RequestData requestData; // Wrong!
}

// Solution: Scoped proxy
@RequestScope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class RequestData { }
```

Proxy delegates to correct instance based on current request.

### Q13: What are stereotype annotations?
**Answer:**
- **@Component**: Generic component
- **@Service**: Business logic
- **@Repository**: Data access (exception translation)
- **@Controller**: MVC controller
- **@RestController**: REST controller

All are specializations of @Component.

### Q14: How to handle multiple profiles?
**Answer:**
```properties
# Activate multiple
spring.profiles.active=dev,mysql,cache

# Profile groups (Spring Boot 2.4+)
spring.profiles.group.development=dev,mysql,swagger
spring.profiles.active=development
```

### Q15: What is BeanPostProcessor?
**Answer:** Interface for custom bean modification before/after initialization.

```java
public class CustomBeanPostProcessor implements BeanPostProcessor {
    public Object postProcessBeforeInitialization(Object bean, String name) {
        // Before init methods
        return bean;
    }
    
    public Object postProcessAfterInitialization(Object bean, String name) {
        // After init methods (AOP proxies created here)
        return bean;
    }
}
```

### Q16: Difference between @Component and @Service?
**Answer:** Functionally identical, semantically different:
- **@Component**: Generic component
- **@Service**: Business logic layer

Both create beans, but @Service indicates business logic semantically.

### Q17: How to validate @ConfigurationProperties?
**Answer:**
```java
@ConfigurationProperties(prefix = "app")
@Validated
public class AppProperties {
    @NotEmpty
    private String name;
    
    @Min(1) @Max(1000)
    private int maxConnections;
    
    @Email
    private String email;
}
```

### Q18: What are Aware interfaces?
**Answer:** Interfaces that give beans access to Spring infrastructure:
- BeanNameAware - Get bean name
- ApplicationContextAware - Get ApplicationContext
- BeanFactoryAware - Get BeanFactory
- EnvironmentAware - Get Environment

Prefer @Autowired over Aware when possible.

### Q19: Do prototype beans get destruction callbacks?
**Answer:** **NO**. Spring doesn't manage destruction of prototype beans. You must manually cleanup.

### Q20: How to create custom scope?
**Answer:**
```java
public class CustomScope implements Scope {
    public Object get(String name, ObjectFactory<?> factory) {
        // Custom logic
    }
    // Implement other methods
}

@Bean
public CustomScopeConfigurer configurer() {
    CustomScopeConfigurer cfg = new CustomScopeConfigurer();
    cfg.addScope("custom", new CustomScope());
    return cfg;
}
```

---

## ✅ Best Practices Summary

### 1. Dependency Injection
```java
// ✅ Constructor injection (immutable, testable)
public UserService(UserRepository repository) {
    this.repository = repository;
}

// ❌ Avoid field injection
@Autowired
private UserRepository repository;
```

### 2. Bean Scopes
- Use **singleton** for stateless services
- Use **prototype** for stateful beans
- Always use **scoped proxy** for narrow scopes in wider scopes

### 3. Component Scanning
```java
// ✅ Type-safe scanning
@ComponentScan(basePackageClasses = ServiceMarker.class)

// ❌ Avoid string-based
@ComponentScan("com.example")
```

### 4. Profiles
- Use semantic names (dev, prod not profile1)
- Set default profile for local development
- Don't hardcode secrets, use environment variables

### 5. Properties
- Use @ConfigurationProperties for grouped config
- Use @Value for simple properties or SpEL
- Externalize sensitive data
- Provide default values

### 6. Lifecycle
- Use @PostConstruct for initialization
- Always cleanup in @PreDestroy
- Avoid heavy work in constructors

---

## 🎓 Configuration Template

```java
@SpringBootApplication
@ConfigurationPropertiesScan
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

@Configuration
@ComponentScan(basePackages = "com.example")
@PropertySource("classpath:custom.properties")
public class AppConfig {
    
    @Bean
    @Profile("dev")
    public DataSource devDataSource() {
        return new EmbeddedDatabaseBuilder()
            .setType(EmbeddedDatabaseType.H2)
            .build();
    }
    
    @Bean
    @Profile("prod")
    public DataSource prodDataSource() {
        HikariDataSource ds = new HikariDataSource();
        ds.setJdbcUrl("${spring.datasource.url}");
        return ds;
    }
}

@Component
@ConfigurationProperties(prefix = "app")
@Validated
public class AppProperties {
    @NotEmpty
    private String name;
    
    @Min(1)
    private int maxConnections;
    
    // Getters and setters
}

@Service
public class UserService {
    private final UserRepository repository;
    
    public UserService(UserRepository repository) {
        this.repository = repository;
    }
    
    @PostConstruct
    public void init() {
        // Initialize
    }
    
    @PreDestroy
    public void cleanup() {
        // Cleanup
    }
}
```

---

## 📌 Key Takeaways

1. **Spring Core** provides IoC, DI, and AOP foundations
2. **Bean Lifecycle** has 8 phases from instantiation to destruction
3. **ApplicationContext** is preferred over BeanFactory for enterprise apps
4. **Scopes** control bean lifecycle: singleton (default), prototype, request, session
5. **Component Scanning** automates bean discovery with stereotype annotations
6. **Profiles** enable environment-specific configuration
7. **Property Sources** externalize configuration with hierarchy
8. **SpEL** provides powerful runtime expression evaluation

---

## 🚀 Next Steps

After mastering these core concepts, proceed to:
- **03. Dependency Injection & IoC** - Deep dive into DI patterns
- **04. Spring Boot Annotations** - Comprehensive annotation guide
- **05. Spring Boot Configuration** - Advanced configuration techniques
- **06. REST API Development** - Building RESTful services
- **07. Spring Data JPA** - Database access and ORM

---

**Happy Learning! 🎯**
