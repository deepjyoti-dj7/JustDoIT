# 📘 Spring Boot Configuration - Complete Reference

## 📑 Table of Contents

### Configuration Topics
1. [application.properties vs application.yml](#1-applicationproperties-vs-applicationyml)
2. [Externalized Configuration](#2-externalized-configuration)
3. [ConfigurationProperties](#3-configurationproperties)
4. [Value Annotation](#4-value-annotation)
5. [Profile-specific Configuration](#5-profile-specific-configuration)
6. [Environment Variables](#6-environment-variables)
7. [Command-line Arguments](#7-command-line-arguments)
8. [Configuration Precedence](#8-configuration-precedence)

### Additional Sections
- [Configuration Methods Comparison](#configuration-methods-comparison)
- [Quick Reference Guide](#quick-reference-guide)
- [Configuration Precedence Chart](#configuration-precedence-chart)
- [Common Patterns](#common-patterns)
- [Interview Questions](#interview-questions)
- [Best Practices Summary](#best-practices-summary)

---

## 📚 Configuration Topics Overview

### 1. application.properties vs application.yml

**Purpose:** Compare the two main configuration file formats

**Key Concepts:**
- `.properties` - Traditional Java format
- `.yml` - YAML hierarchical format
- Syntax differences
- Multi-document files (YAML)
- Profile support

**When to Use:**
- `.properties` - Simple, flat configuration
- `.yml` - Complex hierarchical data, better readability

**Example:**

```properties
# application.properties
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/db
spring.datasource.username=admin
```

```yaml
# application.yml
server:
  port: 8080
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/db
    username: admin
```

---

### 2. Externalized Configuration

**Purpose:** Configure application from external sources

**Key Concepts:**
- 12-Factor App methodology
- Multiple configuration sources
- Property source order
- Relaxed binding
- Type conversion

**Configuration Sources:**
1. Command-line arguments
2. System properties
3. Environment variables
4. Configuration files
5. @PropertySource
6. Default properties

**Example:**

```yaml
# application.yml
app:
  name: ${APP_NAME:MyApp}
  max-users: ${APP_MAX_USERS:100}

spring:
  datasource:
    url: ${DB_URL}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
```

---

### 3. ConfigurationProperties

**Purpose:** Type-safe configuration binding

**Key Concepts:**
- Type safety
- Validation support
- Nested properties
- Constructor binding
- Immutability

**Features:**
- ✅ Compile-time type checking
- ✅ IDE auto-completion
- ✅ Built-in validation
- ✅ Relaxed binding
- ✅ Complex object mapping

**Example:**

```java
@ConfigurationProperties(prefix = "app")
@Validated
public class AppProperties {
    
    @NotBlank
    private String name;
    
    @Min(1)
    @Max(1000)
    private int maxUsers;
    
    @Valid
    private Database database;
    
    public static class Database {
        @NotBlank
        private String url;
        
        @NotBlank
        private String username;
        
        @NotBlank
        private String password;
        
        // Getters and setters
    }
    
    // Getters and setters
}
```

---

### 4. Value Annotation

**Purpose:** Simple property injection

**Key Concepts:**
- Direct property injection
- SpEL expressions
- Default values
- System properties access
- Collection binding

**When to Use:**
- Single property injection
- SpEL expressions needed
- Simple values

**Example:**

```java
@Component
public class AppComponent {
    
    @Value("${app.name:MyApp}")
    private String name;
    
    @Value("${app.max-users:100}")
    private int maxUsers;
    
    // SpEL expression
    @Value("#{${app.timeout-seconds:30} * 1000}")
    private long timeoutMillis;
    
    // System property
    @Value("${user.home}")
    private String userHome;
    
    // List
    @Value("${app.servers}")
    private List<String> servers;
}
```

---

### 5. Profile-specific Configuration

**Purpose:** Environment-specific configuration

**Key Concepts:**
- Environment separation (dev, test, prod)
- Profile activation
- Profile groups
- Profile expressions
- Conditional beans

**Activation Methods:**
```bash
# Command-line
--spring.profiles.active=prod

# Environment variable
SPRING_PROFILES_ACTIVE=prod

# application.properties
spring.profiles.active=prod
```

**Example:**

```yaml
# application.yml (base)
spring:
  application:
    name: MyApp

---
# Development profile
spring:
  config:
    activate:
      on-profile: dev
server:
  port: 8080
spring:
  datasource:
    url: jdbc:h2:mem:devdb

---
# Production profile
spring:
  config:
    activate:
      on-profile: prod
server:
  port: 80
spring:
  datasource:
    url: jdbc:mysql://prod:3306/db
```

```java
@Configuration
@Profile("dev")
public class DevConfig {
    @Bean
    public EmailService emailService() {
        return new MockEmailService();
    }
}

@Configuration
@Profile("prod")
public class ProdConfig {
    @Bean
    public EmailService emailService() {
        return new SmtpEmailService();
    }
}
```

---

### 6. Environment Variables

**Purpose:** OS-level configuration

**Key Concepts:**
- OS-level variables
- Security for secrets
- Cloud-native approach
- Relaxed binding
- Docker/Kubernetes integration

**Naming Convention:**
```bash
UPPER_CASE_WITH_UNDERSCORES

# Examples
export APP_NAME=MyApp
export SERVER_PORT=8080
export DB_PASSWORD=secret123
```

**Example:**

```yaml
# application.yml
spring:
  datasource:
    url: ${DB_URL}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}

app:
  name: ${APP_NAME:MyApp}
  max-users: ${APP_MAX_USERS:100}
```

```bash
# Docker
docker run -e DB_URL=jdbc:mysql://db:3306/mydb \
           -e DB_USERNAME=admin \
           -e DB_PASSWORD=secret \
           myapp:latest
```

---

### 7. Command-line Arguments

**Purpose:** Runtime configuration override

**Key Concepts:**
- Highest priority
- Runtime flexibility
- ApplicationArguments
- Option vs non-option args
- Testing support

**Syntax:**
```bash
# Option arguments
--server.port=9090
--spring.profiles.active=prod

# Non-option arguments
file1.txt file2.txt

# Boolean flags
--debug --verbose
```

**Example:**

```bash
java -jar app.jar \
  --server.port=9090 \
  --spring.profiles.active=prod \
  --app.name="Production App" \
  --import-file=data.csv
```

```java
@Component
public class ArgsProcessor implements ApplicationRunner {
    
    @Override
    public void run(ApplicationArguments args) throws Exception {
        if (args.containsOption("import-file")) {
            String file = args.getOptionValues("import-file").get(0);
            importData(file);
        }
        
        if (args.containsOption("debug")) {
            enableDebugMode();
        }
        
        List<String> files = args.getNonOptionArgs();
        processFiles(files);
    }
}
```

---

### 8. Configuration Precedence

**Purpose:** Understand property resolution order

**Key Concepts:**
- Priority hierarchy
- Override behavior
- Source combination
- Profile precedence
- Location precedence

**Precedence Order (Highest to Lowest):**

1. **Command-line arguments** (highest)
2. **System properties** (`-D` flags)
3. **Environment variables**
4. **Profile-specific properties (external)** (`/config/application-prod.properties`)
5. **Profile-specific properties (internal)** (`classpath:application-prod.properties`)
6. **Application properties (external)** (`/config/application.properties`)
7. **Application properties (internal)** (`classpath:application.properties`)
8. **@PropertySource annotations**
9. **Default properties** (lowest)

**Example:**

```properties
# classpath:application.properties (Low priority)
server.port=8080
app.name=BaseApp
```

```bash
# Environment variable (Medium priority)
export APP_NAME=EnvApp

# System property (High priority)
java -Dapp.version=2.0.0 -jar app.jar

# Command-line (Highest priority)
java -jar app.jar --server.port=9090

# Result:
# server.port = 9090 (command-line)
# app.name = EnvApp (environment)
# app.version = 2.0.0 (system property)
```

---

## 🔄 Configuration Methods Comparison

### @ConfigurationProperties vs @Value

| Feature | @ConfigurationProperties | @Value |
|---------|-------------------------|---------|
| **Type Safety** | ✅ Compile-time | ❌ Runtime only |
| **Validation** | ✅ Built-in (@Validated) | ❌ Manual |
| **Relaxed Binding** | ✅ Yes | ❌ No |
| **SpEL Support** | ❌ No | ✅ Yes |
| **IDE Support** | ✅ Auto-completion | ⚠️ Limited |
| **Complex Objects** | ✅ Easy (nested) | ⚠️ Difficult |
| **Multiple Properties** | ✅ Grouped | ❌ Individual |
| **Immutability** | ✅ Constructor binding | ❌ No |
| **Metadata** | ✅ Auto-generated | ❌ No |
| **Best For** | Complex configuration | Simple values |
| **Learning Curve** | Medium | Low |
| **Verbosity** | Medium | Low |

**Recommendation:**
- **Use @ConfigurationProperties** for: Multiple related properties, complex structures, validation needed
- **Use @Value** for: Single properties, SpEL expressions, simple values

---

## 🎯 Quick Reference Guide

### Configuration File Formats

```properties
# application.properties
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/db
spring.datasource.username=admin
app.max-users=100
app.servers=server1,server2,server3
```

```yaml
# application.yml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/db
    username: admin

app:
  max-users: 100
  servers:
    - server1
    - server2
    - server3
```

### Property Injection Methods

```java
// 1. @Value
@Value("${app.name:MyApp}")
private String name;

// 2. @ConfigurationProperties
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    private String name;
}

// 3. Environment
@Autowired
private Environment env;
String name = env.getProperty("app.name", "MyApp");

// 4. System.getenv()
String name = System.getenv("APP_NAME");

// 5. ApplicationArguments
@Autowired
private ApplicationArguments args;
String name = args.getOptionValues("app.name").get(0);
```

### Profile Activation

```bash
# 1. Command-line
java -jar app.jar --spring.profiles.active=prod

# 2. Environment variable
export SPRING_PROFILES_ACTIVE=prod

# 3. System property
java -Dspring.profiles.active=prod -jar app.jar

# 4. application.properties
spring.profiles.active=prod

# 5. Programmatically
app.setAdditionalProfiles("prod");
```

### Environment Variable Binding

```bash
# Set environment variables (UPPER_CASE_WITH_UNDERSCORES)
export APP_NAME=MyApp
export SERVER_PORT=8080
export DB_PASSWORD=secret
```

```yaml
# application.yml
app:
  name: ${APP_NAME:DefaultApp}
  
server:
  port: ${SERVER_PORT:8080}
  
spring:
  datasource:
    password: ${DB_PASSWORD}
```

---

## 📊 Configuration Precedence Chart

```
┌─────────────────────────────────────────────────────┐
│           Configuration Priority (High → Low)        │
├─────────────────────────────────────────────────────┤
│                                                      │
│  1️⃣  Command-line Arguments                         │
│      --server.port=9090                             │
│      --spring.profiles.active=prod                  │
│                                                      │
│  2️⃣  Java System Properties                         │
│      -Dserver.port=8080                             │
│      -Dapp.name=MyApp                               │
│                                                      │
│  3️⃣  OS Environment Variables                       │
│      SERVER_PORT=8081                               │
│      APP_NAME=MyApplication                         │
│                                                      │
│  4️⃣  Profile-Specific Properties (External)         │
│      /config/application-prod.properties            │
│      ./application-prod.properties                  │
│                                                      │
│  5️⃣  Profile-Specific Properties (Internal)         │
│      classpath:/config/application-prod.properties  │
│      classpath:application-prod.properties          │
│                                                      │
│  6️⃣  Application Properties (External)              │
│      /config/application.properties                 │
│      ./application.properties                       │
│                                                      │
│  7️⃣  Application Properties (Internal)              │
│      classpath:/config/application.properties       │
│      classpath:application.properties               │
│                                                      │
│  8️⃣  @PropertySource Annotations                    │
│      @PropertySource("classpath:custom.properties") │
│                                                      │
│  9️⃣  Default Properties                             │
│      SpringApplication.setDefaultProperties()       │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## 🎨 Common Patterns

### Pattern 1: Multi-Environment Configuration

```yaml
# application.yml (base)
spring:
  application:
    name: myapp
  
app:
  name: MyApp
  version: 1.0.0

---
# Development
spring:
  config:
    activate:
      on-profile: dev
server:
  port: 8080
spring:
  datasource:
    url: jdbc:h2:mem:devdb
logging:
  level:
    root: DEBUG

---
# Test
spring:
  config:
    activate:
      on-profile: test
server:
  port: 8081
spring:
  datasource:
    url: jdbc:h2:mem:testdb
logging:
  level:
    root: INFO

---
# Production
spring:
  config:
    activate:
      on-profile: prod
server:
  port: 80
spring:
  datasource:
    url: ${DB_URL}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
logging:
  level:
    root: WARN
```

### Pattern 2: Secure Configuration

```yaml
# application.yml
spring:
  datasource:
    url: ${DB_URL:jdbc:h2:mem:devdb}
    username: ${DB_USERNAME:sa}
    password: ${DB_PASSWORD}  # From environment, no default

app:
  jwt:
    secret: ${JWT_SECRET}     # From environment
    expiration: 3600000
  
  api:
    key: ${API_KEY}           # From environment
    endpoint: ${API_ENDPOINT:http://localhost:9000}
```

```bash
# Set secrets via environment variables
export DB_PASSWORD=secret123
export JWT_SECRET=my-super-secret-key-32-chars-min
export API_KEY=pk_live_abc123xyz
```

### Pattern 3: Feature Flags

```yaml
# application.yml
app:
  features:
    new-ui: ${FEATURE_NEW_UI:false}
    payment-gateway: ${FEATURE_PAYMENT:false}
    email-notifications: ${FEATURE_EMAIL:true}
```

```java
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    
    private Features features = new Features();
    
    public static class Features {
        private boolean newUi = false;
        private boolean paymentGateway = false;
        private boolean emailNotifications = true;
        
        // Getters and setters
    }
    
    // Getter and setter
}

@Service
public class FeatureService {
    
    private final AppProperties properties;
    
    public FeatureService(AppProperties properties) {
        this.properties = properties;
    }
    
    public boolean isNewUiEnabled() {
        return properties.getFeatures().isNewUi();
    }
}
```

### Pattern 4: Database Configuration

```java
@ConfigurationProperties(prefix = "app.datasource")
@Validated
public class DataSourceProperties {
    
    @NotBlank
    private String url;
    
    @NotBlank
    private String username;
    
    @NotBlank
    private String password;
    
    private Pool pool = new Pool();
    
    public static class Pool {
        @Min(1)
        private int minSize = 5;
        
        @Min(1)
        private int maxSize = 20;
        
        @NotNull
        private Duration maxLifetime = Duration.ofMinutes(30);
        
        // Getters and setters
    }
    
    // Getters and setters
}
```

```yaml
app:
  datasource:
    url: ${DB_URL}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
    pool:
      min-size: 5
      max-size: 20
      max-lifetime: 30m
```

### Pattern 5: External Service Configuration

```java
@ConfigurationProperties(prefix = "app.external")
public class ExternalServiceProperties {
    
    private Map<String, ServiceConfig> services = new HashMap<>();
    
    public static class ServiceConfig {
        private String url;
        private String apiKey;
        private Duration timeout;
        private int retries;
        
        // Getters and setters
    }
    
    // Getter and setter
}
```

```yaml
app:
  external:
    services:
      payment:
        url: ${PAYMENT_API_URL}
        api-key: ${PAYMENT_API_KEY}
        timeout: 30s
        retries: 3
      
      email:
        url: ${EMAIL_API_URL}
        api-key: ${EMAIL_API_KEY}
        timeout: 10s
        retries: 2
      
      sms:
        url: ${SMS_API_URL}
        api-key: ${SMS_API_KEY}
        timeout: 5s
        retries: 1
```

---

## 🎤 Interview Questions

### Basic Questions

**Q1: What are the two main configuration file formats in Spring Boot?**

**A:** `application.properties` (traditional format) and `application.yml` (YAML format). YAML is preferred for complex hierarchical data.

---

**Q2: What is externalized configuration?**

**A:** Ability to configure application from external sources (properties files, environment variables, command-line args) without changing code or recompiling.

---

**Q3: Difference between @ConfigurationProperties and @Value?**

**A:**
- **@ConfigurationProperties**: Type-safe, validation, relaxed binding, grouped properties, no SpEL
- **@Value**: Simple injection, SpEL support, no validation, individual properties

---

**Q4: How to activate a Spring profile?**

**A:**
- Command-line: `--spring.profiles.active=prod`
- Environment variable: `SPRING_PROFILES_ACTIVE=prod`
- application.properties: `spring.profiles.active=prod`
- System property: `-Dspring.profiles.active=prod`

---

**Q5: Configuration precedence order (top 5)?**

**A:**
1. Command-line arguments (highest)
2. System properties
3. Environment variables
4. Profile-specific properties (external)
5. Profile-specific properties (internal)

---

### Intermediate Questions

**Q6: How does Spring Boot map environment variables to properties?**

**A:** Using relaxed binding - `APP_MAX_USERS` maps to `app.max-users`, `app.maxUsers`, `app.max_users`, etc.

---

**Q7: What is relaxed binding?**

**A:** Ability to bind different property name formats (kebab-case, camelCase, snake_case, UPPER_CASE) to the same bean property.

---

**Q8: How to create immutable configuration classes?**

**A:** Use constructor binding with @ConstructorBinding:
```java
@ConfigurationProperties(prefix = "app")
@ConstructorBinding
public class AppProperties {
    private final String name;
    private final int port;
    
    public AppProperties(String name, int port) {
        this.name = name;
        this.port = port;
    }
    // Only getters
}
```

---

**Q9: What are profile groups?**

**A:** Groups of profiles activated together:
```yaml
spring:
  profiles:
    group:
      development: [dev, h2, mock]
```

Activating `development` activates all three profiles.

---

**Q10: How to validate configuration properties?**

**A:** Add @Validated and use Bean Validation annotations:
```java
@ConfigurationProperties(prefix = "app")
@Validated
public class AppProperties {
    @NotBlank
    private String name;
    
    @Min(1)
    @Max(1000)
    private int maxUsers;
}
```

---

### Advanced Questions

**Q11: Difference between command-line arguments and system properties?**

**A:**
- **Command-line**: `--key=value`, highest priority, Spring Boot specific
- **System properties**: `-Dkey=value`, JVM-level, lower priority than command-line

---

**Q12: How to disable command-line properties?**

**A:**
```java
SpringApplication app = new SpringApplication(Application.class);
app.setAddCommandLineProperties(false);
```

---

**Q13: Config file location precedence?**

**A:**
1. `/config/` subdirectory (highest)
2. Current directory
3. `classpath:/config/`
4. `classpath:/` (lowest)

---

**Q14: How to specify custom config location?**

**A:**
```bash
# Replace default locations
--spring.config.location=file:./custom/,classpath:/config/

# Add to default locations
--spring.config.additional-location=file:/etc/myapp/
```

---

**Q15: How to debug which property source is being used?**

**A:**
- Enable debug: `--debug`
- Actuator endpoint: `/actuator/env/{property}`
- Custom logging in ApplicationReadyEvent listener

---

**Q16: Can profile properties override command-line arguments?**

**A:** No, command-line arguments have highest priority and cannot be overridden by any other source including profiles.

---

**Q17: How to bind complex nested properties?**

**A:**
```java
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    private Database database;
    
    public static class Database {
        private Pool pool;
        
        public static class Pool {
            private int minSize;
            private int maxSize;
        }
    }
}
```

```yaml
app:
  database:
    pool:
      min-size: 5
      max-size: 20
```

---

**Q18: What is SPRING_APPLICATION_JSON?**

**A:** Environment variable or system property containing JSON configuration:
```bash
export SPRING_APPLICATION_JSON='{"server":{"port":8080}}'
```

---

**Q19: How to configure Spring Boot for different cloud platforms?**

**A:**
- AWS: Environment variables via Elastic Beanstalk config
- Kubernetes: ConfigMaps and Secrets
- Heroku: Config vars
- Use profile per platform with externalized secrets

---

**Q20: Best practices for configuration management?**

**A:**
1. Use profiles for environments
2. Externalize secrets (env vars, Secrets Manager)
3. Use @ConfigurationProperties for type safety
4. Provide sensible defaults
5. Document required properties
6. Use kebab-case in properties
7. Validate on startup
8. Keep base config minimal
9. Use configuration metadata
10. Test configuration precedence

---

## ✅ Best Practices Summary

### 1. Configuration Format

✅ **DO:**
- Use YAML for complex hierarchical data
- Use properties for simple flat configuration
- Be consistent within project

❌ **DON'T:**
- Mix properties and YAML unnecessarily
- Create overly deep nesting

---

### 2. Property Injection

✅ **DO:**
- Use @ConfigurationProperties for complex configurations
- Use @Value for simple single values
- Provide default values
- Validate configuration

❌ **DON'T:**
- Use @Value for multiple related properties
- Hardcode values in code
- Skip validation

---

### 3. Profiles

✅ **DO:**
- Use meaningful profile names (dev, test, prod)
- Keep base config in application.properties
- Use profile groups for complex setups
- Document profile requirements

❌ **DON'T:**
- Use profiles for feature flags (use properties)
- Duplicate configuration across profiles
- Commit profile-specific secrets

---

### 4. Security

✅ **DO:**
- Use environment variables for secrets
- Use secrets management (Vault, AWS Secrets Manager)
- Restrict file permissions
- Rotate secrets regularly

❌ **DON'T:**
- Commit secrets to version control
- Pass secrets via command-line
- Log sensitive values
- Use same secrets across environments

---

### 5. Environment Variables

✅ **DO:**
- Use UPPER_CASE_WITH_UNDERSCORES
- Provide descriptive names
- Document required variables
- Validate on startup

❌ **DON'T:**
- Use ambiguous names
- Skip defaults
- Expose in logs

---

### 6. Testing

✅ **DO:**
- Use @TestPropertySource for test properties
- Use separate test profiles
- Test configuration precedence
- Validate configuration

❌ **DON'T:**
- Use production config in tests
- Hardcode test values
- Skip integration tests

---

### 7. Documentation

✅ **DO:**
- Document required properties
- Provide examples
- Explain precedence rules
- Document defaults

❌ **DON'T:**
- Assume configuration is self-explanatory
- Skip migration guides
- Forget to update docs

---

### 8. Production

✅ **DO:**
- Use external configuration
- Monitor configuration changes
- Use Actuator for debugging
- Log configuration sources

❌ **DON'T:**
- Modify config in production jars
- Use debug settings
- Expose sensitive endpoints

---

## 📈 Configuration Checklist

### Development Setup
- [ ] application-dev.properties/yml created
- [ ] Default values provided
- [ ] Local database configuration
- [ ] Debug logging enabled
- [ ] DevTools configured

### Testing Setup
- [ ] application-test.properties/yml created
- [ ] Test profiles configured
- [ ] Test data sources configured
- [ ] Mock configurations ready
- [ ] Integration test properties set

### Production Setup
- [ ] application-prod.properties/yml created
- [ ] Environment variables documented
- [ ] Secrets externalized
- [ ] Production database configured
- [ ] Logging levels set correctly
- [ ] Actuator endpoints secured
- [ ] Configuration validated
- [ ] Monitoring configured

### Security
- [ ] No secrets in version control
- [ ] Environment variables used for secrets
- [ ] File permissions set correctly
- [ ] Secrets management configured
- [ ] Sensitive data not logged

### Documentation
- [ ] Configuration properties documented
- [ ] Required environment variables listed
- [ ] Profile activation documented
- [ ] Examples provided
- [ ] Migration guide created

---

## 🎓 Learning Path

### Beginner
1. Start with application.properties basics
2. Learn @Value for simple injection
3. Understand profiles (dev, test, prod)
4. Practice environment variables

### Intermediate
5. Master @ConfigurationProperties
6. Learn configuration precedence
7. Understand relaxed binding
8. Practice command-line arguments
9. Use validation

### Advanced
10. Master complex nested configurations
11. Implement custom property sources
12. Configure for cloud platforms
13. Optimize for Docker/Kubernetes
14. Implement secrets management

---

## 📚 Additional Resources

### Official Documentation
- [Spring Boot Configuration](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config)
- [Common Application Properties](https://docs.spring.io/spring-boot/docs/current/reference/html/application-properties.html)
- [Configuration Metadata](https://docs.spring.io/spring-boot/docs/current/reference/html/configuration-metadata.html)

### Tools
- Spring Boot Configuration Processor (metadata generation)
- Spring Boot Actuator (configuration debugging)
- Spring Cloud Config (centralized configuration)

---

## 🎯 Next Steps

After mastering configuration, proceed to:
- **06. REST API Development** - Building RESTful APIs
- **07. Spring Data JPA** - Database access
- **08. Database Integration** - Advanced database features
- **09. Spring Security** - Securing your application
- **10. Exception Handling** - Error handling strategies

---

**📌 Remember:** Good configuration management is key to building maintainable, secure, and scalable Spring Boot applications!

