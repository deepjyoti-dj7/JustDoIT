# 📊 Spring Data JPA - Complete Reference

## 📋 Table of Contents

1. [Introduction to Spring Data JPA](01.%20Introduction%20to%20Spring%20Data%20JPA.md)
2. [Entity Relationships](02.%20Entity%20Relationships.md)
3. [JPA Repository Methods](03.%20JPA%20Repository%20Methods.md)
4. [Query Methods](04.%20Query%20Methods.md)
5. [Custom Queries with @Query](05.%20Custom%20Queries%20with%20@Query.md)
6. [Pagination and Sorting](06.%20Pagination%20and%20Sorting.md)
7. [Specifications and Criteria API](07.%20Specifications%20and%20Criteria%20API.md)
8. [Auditing and Soft Delete](08.%20Auditing%20and%20Soft%20Delete.md)

---

## 🎯 What is Spring Data JPA?

Spring Data JPA is a powerful framework that simplifies data access by providing repository abstraction over JPA (Java Persistence API). It eliminates boilerplate code and provides query methods, pagination, auditing, and more.

### Architecture

```
Application Layer
       ↓
Spring Data JPA (Repository Abstraction)
       ↓
JPA (Java Persistence API)
       ↓
Hibernate (JPA Provider)
       ↓
JDBC (Java Database Connectivity)
       ↓
Database (MySQL, PostgreSQL, H2, etc.)
```

---

## 🏗️ Core Concepts

### 1. Entity

```java
@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 100)
    private String name;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    private Integer age;
    
    @Enumerated(EnumType.STRING)
    private Status status;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdDate;
    
    // Getters and setters
}
```

### 2. Repository

```java
public interface UserRepository extends JpaRepository<User, Long> {
    // Inherits 20+ methods: save, findById, findAll, delete, etc.
    
    // Custom query methods
    List<User> findByName(String name);
    List<User> findByAgeGreaterThan(int age);
    
    // Custom JPQL
    @Query("SELECT u FROM User u WHERE u.email = :email")
    Optional<User> findByEmail(@Param("email") String email);
}
```

### 3. Service Layer

```java
@Service
@Transactional
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    public User create(UserDTO userDTO) {
        User user = new User();
        user.setName(userDTO.getName());
        user.setEmail(userDTO.getEmail());
        return userRepository.save(user);
    }
    
    public User findById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
    
    public List<User> findAll() {
        return userRepository.findAll();
    }
    
    public void delete(Long id) {
        userRepository.deleteById(id);
    }
}
```

---

## 🔗 Repository Hierarchy

```
Repository<T, ID>
    ↓
CrudRepository<T, ID>
    ├─ save(entity)
    ├─ findById(id)
    ├─ findAll()
    ├─ delete(entity)
    └─ count()
    ↓
PagingAndSortingRepository<T, ID>
    ├─ findAll(Sort)
    └─ findAll(Pageable)
    ↓
JpaRepository<T, ID>
    ├─ flush()
    ├─ saveAndFlush(entity)
    ├─ deleteInBatch(entities)
    └─ getOne(id)
```

### Interface Comparison

| Feature | CrudRepository | PagingAndSortingRepository | JpaRepository |
|---------|----------------|---------------------------|---------------|
| Basic CRUD | ✅ | ✅ | ✅ |
| Pagination | ❌ | ✅ | ✅ |
| Sorting | ❌ | ✅ | ✅ |
| Batch Operations | ❌ | ❌ | ✅ |
| Flush | ❌ | ❌ | ✅ |
| Return Type | Iterable | Iterable | List |

---

## 📚 Entity Relationships

### @OneToOne

```java
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "profile_id", referencedColumnName = "id")
    private UserProfile profile;
}

@Entity
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne(mappedBy = "profile")
    private User user;
}
```

### @OneToMany / @ManyToOne

```java
@Entity
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Employee> employees = new ArrayList<>();
    
    public void addEmployee(Employee employee) {
        employees.add(employee);
        employee.setDepartment(this);
    }
}

@Entity
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;
}
```

### @ManyToMany

```java
@Entity
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToMany
    @JoinTable(
        name = "student_course",
        joinColumns = @JoinColumn(name = "student_id"),
        inverseJoinColumns = @JoinColumn(name = "course_id")
    )
    private Set<Course> courses = new HashSet<>();
}

@Entity
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToMany(mappedBy = "courses")
    private Set<Student> students = new HashSet<>();
}
```

---

## 🔍 Query Methods

### Derived Query Methods

```java
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Equality
    List<User> findByName(String name);
    List<User> findByEmail(String email);
    
    // Comparison
    List<User> findByAgeGreaterThan(Integer age);
    List<User> findByAgeLessThan(Integer age);
    List<User> findByAgeBetween(Integer minAge, Integer maxAge);
    
    // String operations
    List<User> findByNameContaining(String keyword);
    List<User> findByNameStartingWith(String prefix);
    List<User> findByNameIgnoreCase(String name);
    
    // Boolean
    List<User> findByActiveTrue();
    List<User> findByActiveFalse();
    
    // Null checks
    List<User> findByEmailIsNull();
    List<User> findByEmailIsNotNull();
    
    // Multiple conditions
    List<User> findByNameAndEmail(String name, String email);
    List<User> findByNameOrEmail(String name, String email);
    
    // Sorting
    List<User> findByStatusOrderByNameAsc(String status);
    
    // Limiting
    User findFirstByOrderByCreatedDateDesc();
    List<User> findTop10ByOrderByAgeDesc();
    
    // Count and Exists
    long countByStatus(String status);
    boolean existsByEmail(String email);
    
    // Delete
    @Transactional
    long deleteByStatus(String status);
}
```

### Query Method Keywords

| Keyword | Example | JPQL |
|---------|---------|------|
| And | findByNameAndEmail | ... where x.name = ?1 and x.email = ?2 |
| Or | findByNameOrEmail | ... where x.name = ?1 or x.email = ?2 |
| Between | findByAgeBetween | ... where x.age between ?1 and ?2 |
| LessThan | findByAgeLessThan | ... where x.age < ?1 |
| GreaterThan | findByAgeGreaterThan | ... where x.age > ?1 |
| Like | findByNameLike | ... where x.name like ?1 |
| Containing | findByNameContaining | ... where x.name like %?1% |
| StartingWith | findByNameStartingWith | ... where x.name like ?1% |
| EndingWith | findByNameEndingWith | ... where x.name like %?1 |
| In | findByIdIn | ... where x.id in ?1 |
| NotIn | findByIdNotIn | ... where x.id not in ?1 |
| OrderBy | findByNameOrderByAgeAsc | ... order by x.age asc |
| IgnoreCase | findByNameIgnoreCase | ... where UPPER(x.name) = UPPER(?1) |

---

## 📝 Custom Queries

### JPQL Queries

```java
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Simple JPQL
    @Query("SELECT u FROM User u WHERE u.name = :name")
    List<User> findByName(@Param("name") String name);
    
    // Join
    @Query("SELECT u FROM User u JOIN FETCH u.orders WHERE u.id = :id")
    Optional<User> findByIdWithOrders(@Param("id") Long id);
    
    // Aggregation
    @Query("SELECT COUNT(u) FROM User u WHERE u.status = :status")
    long countByStatus(@Param("status") String status);
    
    // DTO Projection
    @Query("SELECT new com.example.dto.UserDTO(u.id, u.name, u.email) FROM User u")
    List<UserDTO> findAllDTO();
    
    // Update
    @Modifying
    @Query("UPDATE User u SET u.status = :status WHERE u.id = :id")
    int updateStatus(@Param("id") Long id, @Param("status") String status);
    
    // Delete
    @Modifying
    @Query("DELETE FROM User u WHERE u.status = :status")
    int deleteByStatus(@Param("status") String status);
}
```

### Native SQL Queries

```java
// Native query
@Query(value = "SELECT * FROM users WHERE name = :name", nativeQuery = true)
List<User> findByNameNative(@Param("name") String name);

// With pagination
@Query(value = "SELECT * FROM users WHERE status = :status",
       countQuery = "SELECT COUNT(*) FROM users WHERE status = :status",
       nativeQuery = true)
Page<User> findByStatusNative(@Param("status") String status, Pageable pageable);

// Native update
@Modifying
@Query(value = "UPDATE users SET status = :status WHERE id = :id", nativeQuery = true)
int updateStatusNative(@Param("id") Long id, @Param("status") String status);
```

---

## 📄 Pagination and Sorting

### Basic Pagination

```java
@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    public Page<User> getUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return userRepository.findAll(pageable);
    }
    
    public Page<User> getUsersSorted(int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return userRepository.findAll(pageable);
    }
    
    public Page<User> getUsersComplexSort(int page, int size) {
        Sort sort = Sort.by("name").ascending()
                        .and(Sort.by("createdDate").descending());
        Pageable pageable = PageRequest.of(page, size, sort);
        return userRepository.findAll(pageable);
    }
}
```

### Page vs Slice

```java
// Page - Includes total count (extra query)
Page<User> page = userRepository.findAll(pageable);
long total = page.getTotalElements();
int totalPages = page.getTotalPages();

// Slice - No total count (faster, for infinite scroll)
Slice<User> slice = userRepository.findByStatus("ACTIVE", pageable);
boolean hasNext = slice.hasNext();
```

### REST Controller

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping
    public Page<UserDTO> getUsers(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "id") String sortBy,
        @RequestParam(defaultValue = "ASC") String direction
    ) {
        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        
        return userRepository.findAll(pageable)
                           .map(this::convertToDTO);
    }
    
    private UserDTO convertToDTO(User user) {
        return new UserDTO(user.getId(), user.getName(), user.getEmail());
    }
}
```

---

## 🔬 Specifications (Dynamic Queries)

### Basic Specification

```java
public class UserSpecifications {
    
    public static Specification<User> hasName(String name) {
        return (root, query, criteriaBuilder) -> 
            name == null ? null : criteriaBuilder.equal(root.get("name"), name);
    }
    
    public static Specification<User> ageGreaterThan(Integer age) {
        return (root, query, criteriaBuilder) -> 
            age == null ? null : criteriaBuilder.greaterThan(root.get("age"), age);
    }
    
    public static Specification<User> hasStatus(String status) {
        return (root, query, criteriaBuilder) -> 
            status == null ? null : criteriaBuilder.equal(root.get("status"), status);
    }
}
```

### Repository

```java
public interface UserRepository extends JpaRepository<User, Long>, 
                                         JpaSpecificationExecutor<User> {
    // Inherits: findAll(Specification), count(Specification), etc.
}
```

### Usage

```java
@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    public List<User> searchUsers(String name, Integer age, String status) {
        Specification<User> spec = Specification
            .where(UserSpecifications.hasName(name))
            .and(UserSpecifications.ageGreaterThan(age))
            .and(UserSpecifications.hasStatus(status));
        
        return userRepository.findAll(spec);
    }
    
    public Page<User> searchUsersPaginated(
        String name, Integer age, String status, Pageable pageable
    ) {
        Specification<User> spec = Specification
            .where(UserSpecifications.hasName(name))
            .and(UserSpecifications.ageGreaterThan(age))
            .and(UserSpecifications.hasStatus(status));
        
        return userRepository.findAll(spec, pageable);
    }
}
```

---

## 🔐 Auditing

### Enable Auditing

```java
@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
public class JpaConfig {
    
    @Bean
    public AuditorAware<String> auditorAware() {
        return () -> {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            return Optional.ofNullable(auth)
                          .map(Authentication::getName);
        };
    }
}
```

### Auditable Entity

```java
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class Auditable {
    
    @CreatedDate
    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;
    
    @LastModifiedDate
    @Column(name = "last_modified_date")
    private LocalDateTime lastModifiedDate;
    
    @CreatedBy
    @Column(name = "created_by", updatable = false)
    private String createdBy;
    
    @LastModifiedBy
    @Column(name = "last_modified_by")
    private String lastModifiedBy;
    
    // Getters and setters
}

@Entity
public class User extends Auditable {
    // Inherits audit fields automatically
}
```

---

## 🗑️ Soft Delete

### Implementation

```java
@Entity
@Table(name = "users")
@SQLDelete(sql = "UPDATE users SET deleted = true, deleted_at = NOW() WHERE id = ?")
@Where(clause = "deleted = false")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String email;
    
    @Column(name = "deleted")
    private boolean deleted = false;
    
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
    
    @Column(name = "deleted_by")
    private String deletedBy;
    
    public void softDelete(String deletedBy) {
        this.deleted = true;
        this.deletedAt = LocalDateTime.now();
        this.deletedBy = deletedBy;
    }
    
    public void restore() {
        this.deleted = false;
        this.deletedAt = null;
        this.deletedBy = null;
    }
}
```

### Repository Methods

```java
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Find including deleted
    @Query("SELECT u FROM User u WHERE u.id = :id")
    Optional<User> findByIdIncludingDeleted(@Param("id") Long id);
    
    // Find only deleted
    @Query("SELECT u FROM User u WHERE u.deleted = true")
    List<User> findDeleted();
    
    // Restore
    @Modifying
    @Query("UPDATE User u SET u.deleted = false, u.deletedAt = null WHERE u.id = :id")
    int restore(@Param("id") Long id);
}
```

---

## 📊 Complete CRUD Example

### Entity

```java
@Entity
@Table(name = "products")
@EntityListeners(AuditingEntityListener.class)
@SQLDelete(sql = "UPDATE products SET deleted = true WHERE id = ?")
@Where(clause = "deleted = false")
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private BigDecimal price;
    
    @Enumerated(EnumType.STRING)
    private ProductStatus status;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;
    
    // Audit fields
    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdDate;
    
    @LastModifiedDate
    private LocalDateTime lastModifiedDate;
    
    @CreatedBy
    @Column(updatable = false)
    private String createdBy;
    
    @LastModifiedBy
    private String lastModifiedBy;
    
    // Soft delete
    private boolean deleted = false;
    private LocalDateTime deletedAt;
    
    @Version
    private Long version;
    
    // Getters and setters
}
```

### Repository

```java
public interface ProductRepository extends JpaRepository<Product, Long>,
                                            JpaSpecificationExecutor<Product> {
    
    // Query methods
    List<Product> findByStatus(ProductStatus status);
    Page<Product> findByCategory_Name(String categoryName, Pageable pageable);
    
    // Custom JPQL
    @Query("SELECT p FROM Product p JOIN FETCH p.category WHERE p.id = :id")
    Optional<Product> findByIdWithCategory(@Param("id") Long id);
    
    @Query("SELECT p FROM Product p WHERE p.price BETWEEN :min AND :max")
    List<Product> findByPriceRange(@Param("min") BigDecimal min, @Param("max") BigDecimal max);
    
    // Native query
    @Query(value = "SELECT * FROM products WHERE name LIKE %:keyword%", nativeQuery = true)
    List<Product> searchByName(@Param("keyword") String keyword);
    
    // Modifying query
    @Modifying
    @Query("UPDATE Product p SET p.status = :status WHERE p.id = :id")
    int updateStatus(@Param("id") Long id, @Param("status") ProductStatus status);
}
```

### Service

```java
@Service
@Transactional
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    public Product create(ProductDTO productDTO) {
        Product product = new Product();
        product.setName(productDTO.getName());
        product.setPrice(productDTO.getPrice());
        product.setStatus(ProductStatus.ACTIVE);
        
        return productRepository.save(product);
    }
    
    public Product findById(Long id) {
        return productRepository.findByIdWithCategory(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }
    
    public Page<Product> findAll(Pageable pageable) {
        return productRepository.findAll(pageable);
    }
    
    public Page<Product> search(ProductSearchCriteria criteria, Pageable pageable) {
        Specification<Product> spec = ProductSpecifications.withCriteria(criteria);
        return productRepository.findAll(spec, pageable);
    }
    
    public Product update(Long id, ProductDTO productDTO) {
        Product product = findById(id);
        product.setName(productDTO.getName());
        product.setPrice(productDTO.getPrice());
        
        return productRepository.save(product);
    }
    
    public void delete(Long id) {
        Product product = findById(id);
        productRepository.delete(product); // Soft delete
    }
    
    public void restore(Long id) {
        productRepository.restore(id);
    }
}
```

### REST Controller

```java
@RestController
@RequestMapping("/api/products")
public class ProductController {
    
    @Autowired
    private ProductService productService;
    
    @PostMapping
    public ResponseEntity<ProductDTO> create(@Valid @RequestBody ProductDTO productDTO) {
        Product product = productService.create(productDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                           .body(convertToDTO(product));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> findById(@PathVariable Long id) {
        Product product = productService.findById(id);
        return ResponseEntity.ok(convertToDTO(product));
    }
    
    @GetMapping
    public ResponseEntity<Page<ProductDTO>> findAll(
        @PageableDefault(size = 20, sort = "createdDate", direction = Sort.Direction.DESC)
        Pageable pageable
    ) {
        Page<Product> page = productService.findAll(pageable);
        return ResponseEntity.ok(page.map(this::convertToDTO));
    }
    
    @PostMapping("/search")
    public ResponseEntity<Page<ProductDTO>> search(
        @RequestBody ProductSearchCriteria criteria,
        Pageable pageable
    ) {
        Page<Product> page = productService.search(criteria, pageable);
        return ResponseEntity.ok(page.map(this::convertToDTO));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> update(
        @PathVariable Long id,
        @Valid @RequestBody ProductDTO productDTO
    ) {
        Product product = productService.update(id, productDTO);
        return ResponseEntity.ok(convertToDTO(product));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }
    
    private ProductDTO convertToDTO(Product product) {
        return new ProductDTO(
            product.getId(),
            product.getName(),
            product.getPrice(),
            product.getStatus()
        );
    }
}
```

---

## ⚙️ Configuration

### application.properties

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/mydb
spring.datasource.username=root
spring.datasource.password=password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.jpa.properties.hibernate.jdbc.batch_size=20
spring.jpa.properties.hibernate.order_inserts=true
spring.jpa.properties.hibernate.order_updates=true

# Connection Pool
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=30000
```

### application.yml

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/mydb
    username: root
    password: password
    driver-class-name: com.mysql.cj.jdbc.Driver
    
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        format_sql: true
        dialect: org.hibernate.dialect.MySQL8Dialect
        jdbc:
          batch_size: 20
        order_inserts: true
        order_updates: true
```

---

## 🎯 Best Practices

### 1. Use DTOs, Not Entities in REST APIs

```java
// ✅ Good
public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
    User user = userService.findById(id);
    return ResponseEntity.ok(convertToDTO(user));
}

// ❌ Bad
public ResponseEntity<User> getUser(@PathVariable Long id) {
    return ResponseEntity.ok(userService.findById(id));
}
```

### 2. Use @Transactional in Service Layer

```java
// ✅ Good
@Service
@Transactional
public class UserService {
    public User update(Long id, UserDTO dto) {
        User user = userRepository.findById(id).orElseThrow();
        user.setName(dto.getName());
        return userRepository.save(user);
    }
}
```

### 3. Use FetchType.LAZY for Associations

```java
// ✅ Good
@ManyToOne(fetch = FetchType.LAZY)
private Department department;

// ❌ Bad
@ManyToOne(fetch = FetchType.EAGER)
private Department department;
```

### 4. Avoid N+1 Queries

```java
// ✅ Good
@Query("SELECT u FROM User u JOIN FETCH u.orders WHERE u.id = :id")
Optional<User> findByIdWithOrders(@Param("id") Long id);

// ❌ Bad
Optional<User> findById(Long id); // Then u.getOrders() causes N queries
```

### 5. Use Pagination for Large Datasets

```java
// ✅ Good
Page<User> findAll(Pageable pageable);

// ❌ Bad
List<User> findAll(); // Loads entire table
```

### 6. Validate Inputs

```java
// ✅ Good
@PostMapping
public ResponseEntity<UserDTO> create(@Valid @RequestBody UserDTO userDTO) {
    // ...
}

@Data
public class UserDTO {
    @NotBlank
    @Size(min = 3, max = 50)
    private String name;
    
    @Email
    @NotBlank
    private String email;
}
```

### 7. Handle Optional Properly

```java
// ✅ Good
return userRepository.findById(id)
    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

// ❌ Bad
User user = userRepository.findById(id).get(); // Can throw NoSuchElementException
```

---

## 🎤 Top 20 Interview Questions

### Q1: What is Spring Data JPA?
**Answer:** Framework providing repository abstraction over JPA to simplify data access and eliminate boilerplate code.

### Q2: Difference between JPA and Hibernate?
**Answer:**
- **JPA**: Specification (interface)
- **Hibernate**: JPA provider (implementation)

### Q3: What is @Entity annotation?
**Answer:** Marks class as JPA entity to be mapped to database table.

### Q4: Explain repository hierarchy.
**Answer:** Repository → CrudRepository → PagingAndSortingRepository → JpaRepository (each adding more features).

### Q5: What is @Query annotation?
**Answer:** Defines custom JPQL or native SQL queries on repository methods.

### Q6: Difference between JPQL and native query?
**Answer:**
- **JPQL**: Entity-based, database-independent
- **Native**: Table-based, database-specific SQL

### Q7: What is FetchType.LAZY vs EAGER?
**Answer:**
- **LAZY**: Load on-demand when accessed
- **EAGER**: Load immediately with parent

### Q8: What is N+1 problem?
**Answer:** Loading parent entities triggers N additional queries for related entities. Solution: JOIN FETCH, @EntityGraph, @BatchSize.

### Q9: What is @Transactional?
**Answer:** Declares transaction boundaries. Methods execute within transaction context with automatic commit/rollback.

### Q10: Difference between save() and saveAndFlush()?
**Answer:**
- **save()**: Persists to context, DB write at flush time
- **saveAndFlush()**: Persists and immediately flushes to database

### Q11: What is Pageable?
**Answer:** Interface representing pagination information: page number, size, sort specification.

### Q12: Difference between Page and Slice?
**Answer:**
- **Page**: Includes total count (extra query)
- **Slice**: No total count, knows if next page exists

### Q13: What are Specifications?
**Answer:** Type-safe way to build dynamic queries programmatically using JPA Criteria API.

### Q14: What is @Modifying?
**Answer:** Annotation for UPDATE/DELETE queries in @Query. Must be used with @Transactional.

### Q15: What is auditing in JPA?
**Answer:** Automatic tracking of creation/modification timestamps and users using @CreatedDate, @LastModifiedDate, @CreatedBy, @LastModifiedBy.

### Q16: What is soft delete?
**Answer:** Marking records as deleted using flag/timestamp without physically removing from database.

### Q17: How to prevent SQL injection in derived queries?
**Answer:** Spring Data JPA uses parameterized queries automatically. For custom queries, use named parameters with @Param.

### Q18: What is @Version for?
**Answer:** Optimistic locking. Auto-incremented on each update, prevents concurrent modification conflicts.

### Q19: What is cascade in relationships?
**Answer:** Operations (PERSIST, MERGE, REMOVE, etc.) propagate from parent to child entities.

### Q20: Difference between findById() and getOne()?
**Answer:**
- **findById()**: Returns Optional, queries database immediately
- **getOne()**: Returns proxy, lazy loading (deprecated, use getReferenceById)

---

## 📖 Quick Reference

### Common Annotations

```java
// Entity
@Entity
@Table(name = "users", indexes = @Index(columnList = "email"))
@EntityListeners(AuditingEntityListener.class)
@SQLDelete(sql = "UPDATE users SET deleted = true WHERE id = ?")
@Where(clause = "deleted = false")

// Primary Key
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)

// Columns
@Column(name = "user_name", nullable = false, unique = true, length = 100)
@Enumerated(EnumType.STRING)
@Temporal(TemporalType.TIMESTAMP)
@Lob
@Transient

// Relationships
@OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
@OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
@ManyToOne(fetch = FetchType.LAZY)
@ManyToMany
@JoinColumn(name = "department_id")
@JoinTable

// Auditing
@CreatedDate
@LastModifiedDate
@CreatedBy
@LastModifiedBy

// Versioning
@Version
```

### Common Repository Methods

```java
// Save
save(entity)
saveAll(entities)
saveAndFlush(entity)

// Find
findById(id)
findAll()
findAll(Sort)
findAll(Pageable)
findAllById(ids)

// Exists
existsById(id)

// Count
count()

// Delete
delete(entity)
deleteById(id)
deleteAll()
deleteAllInBatch()

// Flush
flush()
```

---

## 🚀 Learning Path

1. ✅ **Basics**: Entity, Repository, CRUD operations
2. ✅ **Relationships**: @OneToOne, @OneToMany, @ManyToMany
3. ✅ **Query Methods**: Derived queries, method naming
4. ✅ **Custom Queries**: @Query, JPQL, native SQL
5. ✅ **Pagination**: Pageable, Page, Slice
6. ✅ **Specifications**: Dynamic queries, Criteria API
7. ✅ **Auditing**: Tracking changes automatically
8. ✅ **Soft Delete**: Recoverable deletions
9. 🎯 **Advanced**: Performance tuning, caching, batch operations

---

## 📚 Additional Resources

- [Spring Data JPA Official Documentation](https://spring.io/projects/spring-data-jpa)
- [JPA Specification](https://jakarta.ee/specifications/persistence/)
- [Hibernate Documentation](https://hibernate.org/orm/documentation/)

---

**Master Spring Data JPA for efficient database operations!** 🚀

