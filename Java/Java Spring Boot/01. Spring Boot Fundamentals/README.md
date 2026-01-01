# 🍃 Spring Boot Fundamentals - README

## 📚 Topics Overview

This folder contains 8 comprehensive topics covering Spring Boot fundamentals:

1. **Introduction to Spring Boot** - What it is, history, core philosophy, key features
2. **Spring vs Spring Boot** - Detailed comparison, migration path, when to use what
3. **Auto-configuration** - How it works, conditional annotations, customization
4. **Spring Boot Starters** - Dependency management, popular starters, creating custom starters
5. **Spring Boot CLI** - Command-line tool for rapid prototyping with Groovy
6. **Application Structure** - Package organization, layers, best practices
7. **Main Application Class** - @SpringBootApplication deep dive, customizations
8. **Running Spring Boot Apps** - IDE, Maven, Gradle, JAR, Docker, production deployment

---

## 1️⃣ Introduction to Spring Boot

### What is Spring Boot?
Spring Boot is an **opinionated framework** built on Spring Framework that eliminates boilerplate configuration through:
- **Auto-configuration** - Configures beans based on classpath dependencies
- **Embedded servers** - Tomcat, Jetty, or Undertow (no WAR deployment)
- **Starter dependencies** - Pre-packaged dependency bundles
- **Production-ready features** - Actuator for monitoring and health checks
- **Convention over configuration** - Sensible defaults, override when needed

### History
- **2014** - Version 1.0 released
- **2018** - Version 2.0 with Java 8 baseline and reactive support
- **2022** - Version 3.0 with Java 17 baseline and Jakarta EE 9+

### Core Philosophy
> "Get production-ready Spring applications up and running quickly with minimal configuration"

### Key Benefits
- Reduces development time by 60-80%
- Eliminates XML configuration
- Perfect for microservices and cloud-native apps
- Easier learning curve than traditional Spring

---

## 2️⃣ Spring vs Spring Boot

### Quick Comparison

| Aspect | Spring Framework | Spring Boot |
|--------|-----------------|-------------|
| **Configuration** | Extensive XML or Java config | Auto-configuration |
| **Dependencies** | Manual (50+ individual deps) | Starters (1-2 deps) |
| **Server** | External (WAR to Tomcat/JBoss) | Embedded (standalone JAR) |
| **Setup Time** | Hours | Minutes |
| **Deployment** | Complex | Simple (`java -jar`) |
| **Production Features** | Manual implementation | Built-in Actuator |

### Example Comparison

**Traditional Spring:**
```xml
<!-- Multiple XML files: web.xml, applicationContext.xml, dispatcher-servlet.xml -->
<!-- 50+ dependency declarations with version management -->
<!-- External server configuration -->
```

**Spring Boot:**
```java
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

### When to Use What?
- **Spring Boot**: New projects, microservices, REST APIs, cloud apps
- **Traditional Spring**: Legacy projects, need fine-grained control

---

## 3️⃣ Auto-configuration

### How Auto-configuration Works

```
1. Spring Boot Starts
   ↓
2. Scans Classpath for Dependencies
   ↓
3. Checks @Conditional Annotations
   ↓
4. Applies Sensible Defaults
   ↓
5. User Can Override via Properties
```

### Example
```xml
<!-- Add this dependency -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
```

**Spring Boot automatically configures:**
- DataSource
- EntityManagerFactory
- TransactionManager
- JPA Repositories

### Conditional Annotations
- `@ConditionalOnClass` - If class exists on classpath
- `@ConditionalOnMissingBean` - If bean not already defined
- `@ConditionalOnProperty` - If property has specific value
- `@ConditionalOnWebApplication` - If it's a web application

### Viewing Auto-configuration Report
```bash
java -jar myapp.jar --debug
```

### Disabling Auto-configuration
```java
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
```

---

## 4️⃣ Spring Boot Starters

### What are Starters?
Dependency descriptors that bundle related dependencies together with compatible versions.

### Why Use Starters?
**Without Starters:**
```xml
<!-- 50+ individual dependencies with version management headache -->
```

**With Starters:**
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

### Popular Starters

| Starter | Purpose | Includes |
|---------|---------|----------|
| `spring-boot-starter-web` | Web & REST APIs | Spring MVC, Tomcat, Jackson |
| `spring-boot-starter-data-jpa` | JPA/Hibernate | Hibernate, Spring Data JPA |
| `spring-boot-starter-security` | Security | Spring Security |
| `spring-boot-starter-test` | Testing | JUnit, Mockito, AssertJ |
| `spring-boot-starter-actuator` | Monitoring | Health checks, metrics |
| `spring-boot-starter-validation` | Validation | Hibernate Validator |
| `spring-boot-starter-cache` | Caching | Spring Cache |

### Benefits
- ✅ No version conflicts
- ✅ Pre-tested dependency combinations
- ✅ Simplified dependency management
- ✅ Auto-configuration support

---

## 5️⃣ Spring Boot CLI

### What is CLI?
Command-line tool for **rapid prototyping** using Groovy scripts.

### Installation
```bash
# Using SDKMAN
sdk install springboot

# Using Homebrew (Mac)
brew install spring-boot
```

### Quick Example
```groovy
// hello.groovy
@RestController
class HelloController {
    @GetMapping("/")
    String hello() {
        "Hello from Spring Boot CLI!"
    }
}
```

```bash
spring run hello.groovy
# Visit http://localhost:8080
```

### Use Cases
- ✅ Rapid prototyping
- ✅ Learning Spring Boot
- ✅ Quick demos
- ❌ **NOT for production**

### Key Commands
```bash
spring init --dependencies=web,data-jpa myproject  # Create project
spring run app.groovy                              # Run Groovy script
spring jar myapp.jar app.groovy                    # Package as JAR
```

---

## 6️⃣ Application Structure

### Recommended Package Structure

```
com.example.myapp
├── MyAppApplication.java       # ⚠️ Main class (MUST be in root)
├── controller/                 # REST endpoints (@RestController)
│   └── UserController.java
├── service/                    # Business logic (@Service)
│   ├── UserService.java
│   └── impl/
│       └── UserServiceImpl.java
├── repository/                 # Data access (@Repository)
│   └── UserRepository.java
├── model/                      # Domain entities (@Entity)
│   └── User.java
├── dto/                        # Data Transfer Objects
│   └── UserDTO.java
├── config/                     # Configuration (@Configuration)
│   └── SecurityConfig.java
├── exception/                  # Error handling (@ControllerAdvice)
│   └── GlobalExceptionHandler.java
└── util/                       # Utility classes
    └── DateUtil.java
```

### Layer Responsibilities

```
Request → Controller → Service → Repository → Database
          (HTTP)      (Logic)    (Data)
```

### Best Practices
- ✅ Main class in **root package**
- ✅ Follow layer separation
- ✅ Use DTOs (don't expose entities in APIs)
- ✅ Keep controllers thin
- ✅ Single responsibility per class

### Package Organization Options

**Layer-based** (small/medium apps):
```
controller/, service/, repository/
```

**Feature-based** (large apps/microservices):
```
user/, product/, order/
```

---

## 7️⃣ Main Application Class

### Basic Structure

```java
@SpringBootApplication
public class MyApplication {
    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }
}
```

### @SpringBootApplication Breakdown

```java
@SpringBootApplication = 
    @SpringBootConfiguration     // = @Configuration (bean definitions)
    + @EnableAutoConfiguration   // Auto-config magic
    + @ComponentScan            // Scan for components
```

### ⚠️ Important: Main Class Location

```
✅ CORRECT:
com.example.myapp
└── MyApplication.java      # Root package
    ├── controller/
    ├── service/
    └── repository/

❌ WRONG:
com.example.myapp
├── controller/
├── service/
└── config/
    └── MyApplication.java  # Won't scan siblings!
```

### Customizations

```java
@SpringBootApplication(
    exclude = {DataSourceAutoConfiguration.class},  // Exclude auto-config
    scanBasePackages = "com.example.myapp"          // Custom scan
)
public class MyApplication {
    
    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(MyApplication.class);
        app.setBannerMode(Banner.Mode.OFF);
        app.setAdditionalProfiles("dev");
        app.run(args);
    }
}
```

### CommandLineRunner (Startup Tasks)

```java
@Bean
public CommandLineRunner run() {
    return args -> {
        System.out.println("Application started!");
    };
}
```

---

## 8️⃣ Running Spring Boot Apps

### Development

**IDE (IntelliJ/Eclipse):**
```
Right-click main class → Run
```

**Maven:**
```bash
mvn spring-boot:run
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

**Gradle:**
```bash
./gradlew bootRun
```

### Production

**Build JAR:**
```bash
mvn clean package
# Creates: target/myapp-1.0.0.jar
```

**Run JAR:**
```bash
java -jar target/myapp-1.0.0.jar
```

**With JVM Tuning:**
```bash
java -Xms512m -Xmx2048m -XX:+UseG1GC -jar myapp.jar
```

**With Profiles:**
```bash
java -jar myapp.jar --spring.profiles.active=prod
```

### Docker

**Dockerfile:**
```dockerfile
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/myapp.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**Build & Run:**
```bash
docker build -t myapp:1.0 .
docker run -p 8080:8080 myapp:1.0
```

### Environment Variables

```bash
export SERVER_PORT=8081
export SPRING_PROFILES_ACTIVE=prod
java -jar myapp.jar
```

---

## 🎯 Key Interview Questions

**Q1: What is Spring Boot?**  
**A:** Framework built on Spring that eliminates configuration through auto-configuration, embedded servers, and starter dependencies.

**Q2: How does auto-configuration work?**  
**A:** Scans classpath → checks @Conditional annotations → applies defaults → allows overrides.

**Q3: What is @SpringBootApplication?**  
**A:** Meta-annotation = @Configuration + @EnableAutoConfiguration + @ComponentScan

**Q4: Spring Boot vs Spring?**  
**A:** Spring Boot = Spring + Automation. Reduces config by 80%, embedded server, faster setup.

**Q5: What are Starters?**  
**A:** Curated dependency bundles (e.g., spring-boot-starter-web = MVC + Tomcat + Jackson).

**Q6: Where should main class be?**  
**A:** Root package to enable component scanning of all sub-packages.

**Q7: How to disable auto-config?**  
**A:** `@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})`

**Q8: How to run different environments?**  
**A:** Use profiles: `--spring.profiles.active=dev/test/prod`

**Q9: What is Actuator?**  
**A:** Production monitoring - health checks, metrics, application info.

**Q10: Can Spring Boot create WAR files?**  
**A:** Yes, extend SpringBootServletInitializer and set `<packaging>war</packaging>`

---

## ✅ Best Practices Summary

### Configuration
- [ ] Main class in root package
- [ ] Use profiles (dev, test, prod)
- [ ] Externalize config (application.properties/yml)
- [ ] Never hardcode passwords

### Dependencies
- [ ] Use starters instead of individual dependencies
- [ ] Don't specify versions (parent POM manages)
- [ ] Review dependency tree: `mvn dependency:tree`

### Code Organization
- [ ] Follow layers: Controller → Service → Repository
- [ ] Use DTOs, don't expose entities
- [ ] Constructor injection over field injection
- [ ] Keep controllers thin (no business logic)

### Production
- [ ] Enable Actuator for monitoring
- [ ] Set JVM options (-Xms, -Xmx)
- [ ] Use production profile
- [ ] Configure logging properly
- [ ] Use connection pooling

---

## 🔧 Essential Configuration Template

```properties
# application.properties

# Server
server.port=8080
server.servlet.context-path=/api

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/mydb
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASSWORD}

# JPA
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false

# Logging
logging.level.root=INFO
logging.level.com.example.myapp=DEBUG

# Actuator
management.endpoints.web.exposure.include=health,info,metrics
```

---

## 🎯 Key Takeaways

1. **Spring Boot = Spring + Automation** - Not a new framework
2. **Auto-configuration** - Smart defaults based on classpath
3. **Starters** - One dependency replaces many
4. **Embedded Server** - No external Tomcat needed
5. **Main class location matters** - Must be in root package
6. **Convention over Configuration** - Follow defaults, override when needed
7. **Production-ready** - Actuator monitoring included
8. **Multiple running options** - IDE, Maven, JAR, Docker

---

**You now understand Spring Boot fundamentals! Ready to explore advanced topics.** 🚀
