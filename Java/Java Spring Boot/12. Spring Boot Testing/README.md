# 🧪 Spring Boot Testing - Complete Guide

## 📋 Module Overview

This module provides comprehensive coverage of **Spring Boot Testing**, from basic unit tests to advanced integration testing with TestContainers.

### 📚 Topics Covered

1. **Testing Fundamentals** - Testing pyramid, annotations, configuration
2. **Unit Testing** - JUnit 5, assertions, test lifecycle
3. **MockMvc** - Testing controllers with MockMvc
4. **@WebMvcTest** - Controller slice testing
5. **@DataJpaTest** - Repository slice testing
6. **Mockito Integration** - Mocking dependencies
7. **Integration Testing** - Full application testing with @SpringBootTest
8. **TestContainers** - Docker-based testing with real databases

---

## 🎯 Learning Path

```
1. Testing Fundamentals
   ↓
2. Unit Testing (JUnit 5)
   ↓
3. Mocking (Mockito)
   ↓
4. Controller Testing (@WebMvcTest, MockMvc)
   ↓
5. Repository Testing (@DataJpaTest)
   ↓
6. Integration Testing (@SpringBootTest)
   ↓
7. Advanced Testing (TestContainers)
```

---

## 🏗️ Testing Strategy

### Test Pyramid

```
         /\
        /  \  E2E Tests
       /____\  (Few - Slow)
      /      \
     / Integ- \  Integration Tests
    /  ration  \  (Some - Medium)
   /____________\
  /              \
 /   Unit Tests   \  Unit Tests
/__________________\  (Many - Fast)
```

### When to Use Each Type

| Test Type | Use For | Tool | Speed |
|-----------|---------|------|-------|
| **Unit** | Individual classes | JUnit + Mockito | Fast |
| **Slice** | Single layer (Controller/Repository) | @WebMvcTest, @DataJpaTest | Fast |
| **Integration** | Multiple components together | @SpringBootTest | Medium |
| **E2E** | Complete user workflows | TestContainers | Slow |

---

## 🔧 Quick Start

### 1. Maven Dependencies

```xml
<dependencies>
    <!-- Spring Boot Test Starter -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
    
    <!-- Includes:
         - JUnit 5
         - Mockito
         - AssertJ
         - Hamcrest
         - Spring Test
         - MockMvc
    -->
    
    <!-- TestContainers (Optional) -->
    <dependency>
        <groupId>org.testcontainers</groupId>
        <artifactId>testcontainers</artifactId>
        <version>1.19.3</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

### 2. Basic Test Structure

```java
@SpringBootTest
class ApplicationTests {
    
    @Test
    void contextLoads() {
        // Verifies Spring context loads successfully
    }
}
```

---

## 📝 Testing Patterns

### Pattern 1: Unit Testing with Mockito

```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    
    @Mock
    private UserRepository userRepository;
    
    @InjectMocks
    private UserService userService;
    
    @Test
    void shouldCreateUser() {
        // Given
        UserRequest request = new UserRequest("John", "john@example.com");
        User user = new User(1L, "John", "john@example.com");
        when(userRepository.save(any(User.class))).thenReturn(user);
        
        // When
        User created = userService.createUser(request);
        
        // Then
        assertThat(created.getName()).isEqualTo("John");
        verify(userRepository).save(any(User.class));
    }
}
```

**Use Case:** Testing service layer business logic in isolation

### Pattern 2: Controller Testing with @WebMvcTest

```java
@WebMvcTest(UserController.class)
class UserControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private UserService userService;
    
    @Test
    void shouldCreateUser() throws Exception {
        User user = new User(1L, "John", "john@example.com");
        when(userService.createUser(any())).thenReturn(user);
        
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"John\",\"email\":\"john@example.com\"}"))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.name").value("John"));
    }
}
```

**Use Case:** Testing controllers without loading full application context

### Pattern 3: Repository Testing with @DataJpaTest

```java
@DataJpaTest
class UserRepositoryTest {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private TestEntityManager entityManager;
    
    @Test
    void shouldFindUserByEmail() {
        // Given
        User user = entityManager.persistAndFlush(
            new User("John", "john@example.com")
        );
        
        // When
        Optional<User> found = userRepository.findByEmail("john@example.com");
        
        // Then
        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("John");
    }
}
```

**Use Case:** Testing repository queries with embedded database

### Pattern 4: Integration Testing with @SpringBootTest

```java
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@Transactional
class UserIntegrationTest {
    
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Autowired
    private UserRepository userRepository;
    
    @Test
    void shouldCreateUserEndToEnd() {
        // Given
        UserRequest request = new UserRequest("John", "john@example.com");
        
        // When
        ResponseEntity<User> response = restTemplate.postForEntity(
            "/api/users",
            request,
            User.class
        );
        
        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(userRepository.findAll()).hasSize(1);
    }
}
```

**Use Case:** Testing complete workflows with all components

### Pattern 5: Docker Testing with TestContainers

```java
@Testcontainers
@SpringBootTest
class UserTestContainersTest {
    
    @Container
    private static PostgreSQLContainer<?> postgres = 
        new PostgreSQLContainer<>("postgres:15-alpine");
    
    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }
    
    @Autowired
    private UserRepository userRepository;
    
    @Test
    void shouldUseRealPostgreSQL() {
        User user = userRepository.save(new User("John", "john@example.com"));
        assertThat(user.getId()).isNotNull();
    }
}
```

**Use Case:** Integration testing with real database in Docker

---

## 🎯 Testing Decision Tree

```
Need to test a component?
│
├─ Single class logic?
│  └─ Use JUnit + Mockito
│     @ExtendWith(MockitoExtension.class)
│
├─ Controller endpoints?
│  └─ Use @WebMvcTest + MockMvc
│     Mock service layer
│
├─ Repository queries?
│  └─ Use @DataJpaTest
│     Embedded H2 database
│
├─ Complete workflow?
│  └─ Use @SpringBootTest
│     TestRestTemplate or MockMvc
│
└─ Need real database?
   └─ Use TestContainers
      Docker PostgreSQL/MySQL
```

---

## 📊 Comparison Table

| Feature | Unit Test | @WebMvcTest | @DataJpaTest | @SpringBootTest | TestContainers |
|---------|-----------|-------------|--------------|-----------------|----------------|
| **Speed** | Very Fast | Fast | Fast | Slow | Slowest |
| **Scope** | Single class | Controllers | Repositories | Full app | Full app + DB |
| **Context** | None | Web layer | JPA layer | Complete | Complete |
| **Database** | Mocked | N/A | H2 | H2/Config | Real DB |
| **Annotations** | @Mock | @MockBean | @Autowired | @Autowired | @Container |
| **Use Case** | Logic | API | Queries | Workflows | Real env |

---

## 🚀 Common Testing Scenarios

### Scenario 1: Test Service Business Logic

```java
@ExtendWith(MockitoExtension.class)
class OrderServiceTest {
    @Mock private OrderRepository orderRepository;
    @Mock private ProductRepository productRepository;
    @InjectMocks private OrderService orderService;
    
    @Test
    void shouldCalculateOrderTotal() {
        // Test business logic with mocked dependencies
    }
}
```

### Scenario 2: Test REST API Endpoint

```java
@WebMvcTest(OrderController.class)
class OrderControllerTest {
    @Autowired private MockMvc mockMvc;
    @MockBean private OrderService orderService;
    
    @Test
    void shouldCreateOrder() throws Exception {
        // Test HTTP endpoint without full context
    }
}
```

### Scenario 3: Test Custom JPA Query

```java
@DataJpaTest
class OrderRepositoryTest {
    @Autowired private OrderRepository orderRepository;
    @Autowired private TestEntityManager entityManager;
    
    @Test
    void shouldFindOrdersByStatus() {
        // Test custom @Query methods
    }
}
```

### Scenario 4: Test Complete Order Flow

```java
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Transactional
class OrderFlowTest {
    @Autowired private TestRestTemplate restTemplate;
    @Autowired private OrderRepository orderRepository;
    
    @Test
    void shouldProcessOrderEndToEnd() {
        // Test: API → Service → Repository → Database
    }
}
```

### Scenario 5: Test with Real PostgreSQL

```java
@Testcontainers
@SpringBootTest
class OrderPostgreSQLTest {
    @Container
    private static PostgreSQLContainer<?> postgres = ...;
    
    @Test
    void shouldUsePostgreSQLFeatures() {
        // Test PostgreSQL-specific features
    }
}
```

---

## 💡 Best Practices Summary

### ✅ Do's

```java
// ✅ Use descriptive test names
@Test
void shouldThrowExceptionWhenUserNotFound() { }

// ✅ Follow AAA pattern (Arrange, Act, Assert)
@Test
void shouldCreateUser() {
    // Arrange (Given)
    UserRequest request = new UserRequest("John", "john@example.com");
    
    // Act (When)
    User created = userService.createUser(request);
    
    // Assert (Then)
    assertThat(created.getName()).isEqualTo("John");
}

// ✅ Use @Transactional for automatic cleanup
@SpringBootTest
@Transactional
class UserServiceTest { }

// ✅ Test one scenario per test
@Test void shouldSucceed() { }
@Test void shouldFailWhenInvalid() { }

// ✅ Use appropriate test slice
@WebMvcTest(UserController.class)  // Not @SpringBootTest
class UserControllerTest { }
```

### ❌ Don'ts

```java
// ❌ Don't use vague names
@Test void test1() { }

// ❌ Don't test multiple scenarios
@Test void testEverything() {
    // test success
    // test failure
    // test edge cases
}

// ❌ Don't use @SpringBootTest for unit tests
@SpringBootTest  // Too heavy!
class UserServiceTest { }

// ❌ Don't forget cleanup
// Missing @Transactional or @AfterEach cleanup

// ❌ Don't test getters/setters
@Test void shouldSetName() {
    user.setName("John");
    assertEquals("John", user.getName());
}
```

---

## 🎤 Comprehensive Interview Questions

### Fundamentals

**Q1: What is the testing pyramid?**
**A:** Many unit tests (fast), fewer integration tests (medium), few E2E tests (slow).

**Q2: What's included in spring-boot-starter-test?**
**A:** JUnit 5, Mockito, AssertJ, Hamcrest, Spring Test, MockMvc.

**Q3: Difference between @Mock and @MockBean?**
**A:** @Mock is Mockito (unit tests), @MockBean is Spring (integration tests, replaces bean in context).

### Annotations

**Q4: What does @SpringBootTest do?**
**A:** Loads full Spring application context for integration testing.

**Q5: What does @WebMvcTest do?**
**A:** Loads only web layer (controllers) for focused testing.

**Q6: What does @DataJpaTest do?**
**A:** Loads only JPA layer (repositories) with embedded database.

**Q7: What is @Transactional in tests?**
**A:** Automatically rolls back database changes after each test.

### Mockito

**Q8: How to stub a method?**
**A:** `when(mock.method()).thenReturn(value)`

**Q9: How to verify method was called?**
**A:** `verify(mock).method()`

**Q10: What is @InjectMocks?**
**A:** Creates instance and injects @Mock dependencies into it.

### Testing Types

**Q11: When to use @WebMvcTest?**
**A:** Testing controllers in isolation with mocked service layer.

**Q12: When to use @DataJpaTest?**
**A:** Testing repository queries with embedded database.

**Q13: When to use @SpringBootTest?**
**A:** Testing complete workflows with all components.

**Q14: When to use TestContainers?**
**A:** Testing with real database (PostgreSQL, MySQL) in Docker.

### MockMvc

**Q15: What is MockMvc?**
**A:** Testing utility to perform HTTP requests without starting server.

**Q16: How to test POST request?**
**A:**
```java
mockMvc.perform(post("/api/users")
    .content(json))
    .andExpect(status().isCreated());
```

### TestContainers

**Q17: What is TestContainers?**
**A:** Library providing Docker containers for integration testing.

**Q18: What is @DynamicPropertySource?**
**A:** Adds properties to Spring after container starts (for JDBC URL, port).

**Q19: Difference between static and instance @Container?**
**A:** Static = one container for all tests (faster), instance = new container per test.

### Database Testing

**Q20: What database does @DataJpaTest use?**
**A:** H2 in-memory database by default.

**Q21: How to use real database in tests?**
**A:** Use TestContainers or `@AutoConfigureTestDatabase(replace = NONE)`.

**Q22: What is TestEntityManager?**
**A:** Test-specific EntityManager with utilities like `persistAndFlush()`.

### Advanced

**Q23: How to test security?**
**A:** Use `@WithMockUser` annotation for authentication.

**Q24: How to test validation?**
**A:** Send invalid data and expect `status().isBadRequest()`.

**Q25: Best practice for test data cleanup?**
**A:** Use `@Transactional` for auto-rollback or `@AfterEach` cleanup method.

---

## 📚 Resources

### Official Documentation
- [Spring Boot Testing](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.testing)
- [JUnit 5 User Guide](https://junit.org/junit5/docs/current/user-guide/)
- [Mockito Documentation](https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html)
- [TestContainers](https://www.testcontainers.org/)

### Key Libraries
- **JUnit 5** - Testing framework
- **Mockito** - Mocking framework
- **AssertJ** - Fluent assertions
- **MockMvc** - Controller testing
- **TestContainers** - Docker containers

---

## 🎯 Module Summary

### Testing Annotations Quick Reference

```java
// Unit Testing
@ExtendWith(MockitoExtension.class)
@Mock, @InjectMocks, @Spy

// Controller Testing
@WebMvcTest(Controller.class)
@MockBean, @Autowired MockMvc

// Repository Testing
@DataJpaTest
@Autowired Repository, @Autowired TestEntityManager

// Integration Testing
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Autowired TestRestTemplate

// TestContainers
@Testcontainers
@Container, @DynamicPropertySource

// Lifecycle & Cleanup
@BeforeEach, @AfterEach
@Transactional, @Rollback

// Security Testing
@WithMockUser, @WithAnonymousUser

// Data Setup
@Sql, @BeforeTestMethod, @AfterTestMethod
```

### Testing Workflow

```
1. Choose appropriate test type (unit/slice/integration)
2. Set up test class with correct annotations
3. Mock dependencies (if needed)
4. Write test following AAA pattern:
   - Arrange: Set up test data
   - Act: Execute code under test
   - Assert: Verify results
5. Clean up (transaction rollback or manual)
```

### Key Takeaways

```
✅ Use testing pyramid: Many unit, fewer integration
✅ Use test slices (@WebMvcTest, @DataJpaTest) when possible
✅ Use @SpringBootTest for integration tests
✅ Use TestContainers for real database testing
✅ Mock external dependencies
✅ Follow AAA pattern (Arrange, Act, Assert)
✅ Use @Transactional for automatic cleanup
✅ Write descriptive test names
✅ Test one scenario per test
✅ Verify important interactions
```

---

## 🎓 Next Steps

After mastering Spring Boot Testing, continue to:

1. **Microservices Architecture** - Service decomposition and patterns
2. **Spring Cloud** - Distributed system tools
3. **Performance Testing** - Load testing and optimization
4. **Contract Testing** - Consumer-driven contracts
5. **Test Automation** - CI/CD integration

---

**Happy Testing! 🧪**

