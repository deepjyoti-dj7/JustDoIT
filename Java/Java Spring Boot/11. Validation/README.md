# ✅ Validation - Complete Module Overview

## 📋 Table of Contents
- [Introduction](#introduction)
- [Topics Covered](#topics-covered)
- [Quick Start Guide](#quick-start-guide)
- [Core Concepts](#core-concepts)
- [Validation Flow](#validation-flow)
- [Common Patterns](#common-patterns)
- [Complete Examples](#complete-examples)
- [Best Practices](#best-practices)
- [Interview Questions](#interview-questions)

---

## 🎯 Introduction

This module covers **Bean Validation (JSR 380)** and **Spring Validation** - the comprehensive validation framework for ensuring data integrity in Spring Boot applications.

### What You'll Learn

```
✅ Bean Validation fundamentals (JSR 380)
✅ Built-in validation annotations (@NotNull, @Size, etc.)
✅ Creating custom validators
✅ @Valid vs @Validated differences
✅ Validation groups for conditional validation
✅ Internationalized validation messages
✅ ConstraintValidator implementation
✅ Global exception handling for validation errors
```

### Why Validation Matters

```
Data Integrity:
✅ Prevent invalid data from entering system
✅ Enforce business rules at entry points
✅ Consistent validation across layers

User Experience:
✅ Clear, actionable error messages
✅ Immediate feedback on invalid input
✅ Multiple languages support (i18n)

Security:
✅ Input sanitization
✅ SQL injection prevention
✅ XSS attack prevention

Maintainability:
✅ Declarative validation (annotations)
✅ Reusable validation logic
✅ Centralized validation rules
```

---

## 📚 Topics Covered

### 1. [Bean Validation](01.%20Bean%20Validation.md)
- JSR 380 / Jakarta Validation API
- @Valid annotation usage
- @Validated annotation (Spring-specific)
- Basic constraint annotations
- Validation groups
- Nested object validation
- Method-level validation
- Spring Boot auto-configuration

### 2. [Built-in Validators](02.%20Built-in%20Validators.md)
- Null validators: @NotNull, @Null
- String validators: @NotEmpty, @NotBlank, @Size, @Email, @Pattern
- Numeric validators: @Min, @Max, @DecimalMin, @DecimalMax, @Positive, @Negative
- Date/Time validators: @Past, @Future, @PastOrPresent, @FutureOrPresent
- Boolean validators: @AssertTrue, @AssertFalse
- Validator comparison and selection guide

### 3. [Custom Validators](03.%20Custom%20Validators.md)
- Creating custom annotations
- Implementing ConstraintValidator interface
- Field-level custom validators
- Class-level custom validators
- Parameterized validators
- Dependency injection in validators
- Best practices for custom validation

### 4. [Valid vs Validated](04.%20Valid%20vs%20Validated.md)
- @Valid (Jakarta standard) capabilities
- @Validated (Spring-specific) features
- Validation groups support
- Method parameter validation
- Use case comparison
- When to use each annotation
- Combining both annotations

### 5. [Group Validation](05.%20Group%20Validation.md)
- Creating validation groups
- Assigning constraints to groups
- Group sequences for ordered validation
- Default group behavior
- Group inheritance
- Role-based validation patterns
- Multi-step form validation

### 6. [Validation Messages](06.%20Validation%20Messages.md)
- Default validation messages
- Custom inline messages
- Message interpolation with parameters
- Internationalization (i18n)
- ValidationMessages.properties configuration
- MessageSource setup
- Dynamic messages with ConstraintValidatorContext

### 7. [ConstraintValidator](07.%20ConstraintValidator.md)
- ConstraintValidator interface
- initialize() and isValid() methods
- Creating custom validators
- Multi-type validators
- Dependency injection in validators
- Performance optimization
- Testing validators

---

## 🚀 Quick Start Guide

### 1. Add Dependencies

```xml
<!-- Spring Boot Starter includes Hibernate Validator -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

### 2. Create DTO with Validation

```java
@Data
public class UserRegistrationRequest {
    
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 50, message = "Name must be 2-50 characters")
    private String name;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;
    
    @Min(value = 18, message = "Must be at least 18 years old")
    private Integer age;
}
```

### 3. Validate in Controller

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @PostMapping("/register")
    public ResponseEntity<User> register(
        @Valid @RequestBody UserRegistrationRequest request
    ) {
        User user = userService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }
}
```

### 4. Handle Validation Errors

```java
@RestControllerAdvice
public class ValidationExceptionHandler {
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationErrors(
        MethodArgumentNotValidException ex
    ) {
        Map<String, String> errors = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .collect(Collectors.toMap(
                FieldError::getField,
                FieldError::getDefaultMessage
            ));
        
        ErrorResponse response = new ErrorResponse(
            "Validation failed",
            errors
        );
        
        return ResponseEntity.badRequest().body(response);
    }
}
```

---

## 🧩 Core Concepts

### Annotation Types

```java
// 1. Null Checks
@NotNull      // Value must not be null
@Null         // Value must be null

// 2. String Validation
@NotEmpty     // Not null and not empty (length > 0)
@NotBlank     // Not null and contains non-whitespace
@Size         // Length/size within range
@Email        // Valid email format
@Pattern      // Matches regex pattern

// 3. Numeric Validation
@Min          // Value >= minimum
@Max          // Value <= maximum
@Positive     // Value > 0
@Negative     // Value < 0
@DecimalMin   // Decimal >= minimum
@DecimalMax   // Decimal <= maximum

// 4. Date/Time Validation
@Past         // Date in the past
@Future       // Date in the future
@PastOrPresent    // Date in past or present
@FutureOrPresent  // Date in future or present

// 5. Boolean Validation
@AssertTrue   // Must be true
@AssertFalse  // Must be false
```

### Validation Triggers

```java
// 1. Controller Request Body
@PostMapping
public Response create(@Valid @RequestBody Request request) { }

// 2. Method Parameters (requires @Validated on class)
@Validated
@Service
public class UserService {
    public User find(@Min(1) Long id) { }
}

// 3. Nested Objects
@Data
public class Order {
    @Valid
    private Customer customer;  // Validates customer fields
}

// 4. Collections
@Data
public class Batch {
    @Valid
    private List<Item> items;  // Validates each item
}
```

---

## 🔄 Validation Flow

### Request Validation Flow

```
1. Client sends request
   ↓
2. Spring MVC receives request
   ↓
3. @Valid/@Validated triggers validation
   ↓
4. Validators execute (built-in + custom)
   ↓
5a. If valid → Controller method executes
   ↓
6a. Return response

5b. If invalid → Throw MethodArgumentNotValidException
   ↓
6b. @ExceptionHandler catches exception
   ↓
7b. Return 400 Bad Request with error details
```

### Custom Validator Flow

```
1. Define annotation (@ValidEmail)
   ↓
2. Implement ConstraintValidator<A, T>
   ↓
3. Override initialize() - setup
   ↓
4. Override isValid() - validation logic
   ↓
5. Apply @ValidEmail to field
   ↓
6. Trigger with @Valid
   ↓
7. Validator executes, returns true/false
```

---

## 🎨 Common Patterns

### Pattern 1: CRUD Validation Groups

```java
// Groups
public interface CreateGroup {}
public interface UpdateGroup {}

// DTO
@Data
public class ProductRequest {
    
    @Null(groups = CreateGroup.class)
    @NotNull(groups = UpdateGroup.class)
    private Long id;
    
    @NotBlank(groups = {CreateGroup.class, UpdateGroup.class})
    private String name;
    
    @NotNull(groups = CreateGroup.class)
    @Positive(groups = CreateGroup.class)
    private BigDecimal price;
}

// Controller
@PostMapping
public Product create(@Validated(CreateGroup.class) @RequestBody ProductRequest req) {
    return productService.create(req);
}

@PutMapping("/{id}")
public Product update(
    @PathVariable Long id,
    @Validated(UpdateGroup.class) @RequestBody ProductRequest req
) {
    return productService.update(id, req);
}
```

### Pattern 2: Nested Validation

```java
@Data
public class OrderRequest {
    
    @NotBlank
    private String orderNumber;
    
    @Valid  // Cascade validation
    @NotNull
    private CustomerInfo customer;
    
    @Valid  // Validate each item
    @NotEmpty
    private List<OrderItem> items;
}

@Data
public class CustomerInfo {
    
    @NotBlank
    private String name;
    
    @Email
    private String email;
    
    @Valid  // Further nesting
    private Address address;
}
```

### Pattern 3: Custom Business Rule Validation

```java
// Annotation
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = DateRangeValidator.class)
public @interface ValidDateRange {
    String message() default "End date must be after start date";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

// Validator
public class DateRangeValidator implements ConstraintValidator<ValidDateRange, OrderRequest> {
    
    @Override
    public boolean isValid(OrderRequest request, ConstraintValidatorContext context) {
        if (request.getStartDate() == null || request.getEndDate() == null) {
            return true;
        }
        
        return !request.getEndDate().isBefore(request.getStartDate());
    }
}

// Usage
@Data
@ValidDateRange
public class OrderRequest {
    private LocalDate startDate;
    private LocalDate endDate;
}
```

### Pattern 4: Database Uniqueness Check

```java
// Annotation
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = UniqueEmailValidator.class)
public @interface UniqueEmail {
    String message() default "Email already exists";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

// Validator
@Component
public class UniqueEmailValidator implements ConstraintValidator<UniqueEmail, String> {
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public boolean isValid(String email, ConstraintValidatorContext context) {
        return email == null || !userRepository.existsByEmail(email);
    }
}

// Usage
@Data
public class UserRequest {
    
    @NotBlank
    @Email
    @UniqueEmail
    private String email;
}
```

### Pattern 5: Multi-Step Form Validation

```java
// Step groups
public interface Step1 {}
public interface Step2 {}
public interface Step3 {}

@GroupSequence({Step1.class, Step2.class, Step3.class})
public interface CompleteRegistration {}

// DTO
@Data
public class RegistrationRequest {
    
    // Step 1
    @NotBlank(groups = Step1.class)
    private String username;
    
    @Email(groups = Step1.class)
    private String email;
    
    // Step 2
    @NotBlank(groups = Step2.class)
    private String firstName;
    
    @NotBlank(groups = Step2.class)
    private String lastName;
    
    // Step 3
    @NotBlank(groups = Step3.class)
    private String address;
}

// Controller
@PostMapping("/step1")
public StepResult step1(@Validated(Step1.class) @RequestBody RegistrationRequest req) {
    return new StepResult(true);
}

@PostMapping("/complete")
public User complete(@Validated(CompleteRegistration.class) @RequestBody RegistrationRequest req) {
    return registrationService.complete(req);
}
```

---

## 💼 Complete Examples

### Example 1: E-commerce Product Creation

```java
// DTO
@Data
public class ProductCreateRequest {
    
    @NotBlank(message = "Product name is required")
    @Size(min = 3, max = 100, message = "Name must be 3-100 characters")
    private String name;
    
    @NotBlank(message = "Description is required")
    @Size(min = 10, max = 1000, message = "Description must be 10-1000 characters")
    private String description;
    
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    @DecimalMin(value = "0.01", message = "Price must be at least $0.01")
    @DecimalMax(value = "999999.99", message = "Price cannot exceed $999,999.99")
    private BigDecimal price;
    
    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock cannot be negative")
    @Max(value = 100000, message = "Stock cannot exceed 100,000")
    private Integer stock;
    
    @NotBlank(message = "SKU is required")
    @Pattern(regexp = "^[A-Z0-9]{6,12}$", message = "SKU must be 6-12 uppercase alphanumeric characters")
    @UniqueSKU(message = "SKU already exists")
    private String sku;
    
    @NotNull(message = "Category ID is required")
    @Min(value = 1, message = "Invalid category ID")
    private Long categoryId;
    
    @NotEmpty(message = "At least one image URL is required")
    @Size(max = 5, message = "Maximum 5 images allowed")
    private List<@URL(message = "Invalid image URL") String> imageUrls;
    
    @Valid
    private ProductDimensions dimensions;
}

@Data
public class ProductDimensions {
    
    @NotNull
    @Positive(message = "Length must be positive")
    private Double length;
    
    @NotNull
    @Positive(message = "Width must be positive")
    private Double width;
    
    @NotNull
    @Positive(message = "Height must be positive")
    private Double height;
    
    @NotNull
    @Positive(message = "Weight must be positive")
    private Double weight;
}

// Controller
@RestController
@RequestMapping("/api/products")
public class ProductController {
    
    @Autowired
    private ProductService productService;
    
    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(
        @Valid @RequestBody ProductCreateRequest request
    ) {
        Product product = productService.create(request);
        ProductResponse response = mapToResponse(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}

// Exception Handler
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorResponse> handleValidation(
        MethodArgumentNotValidException ex
    ) {
        Map<String, String> errors = new HashMap<>();
        
        ex.getBindingResult().getFieldErrors().forEach(error -> {
            String fieldName = error.getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        ValidationErrorResponse response = new ValidationErrorResponse(
            "Validation failed",
            errors,
            LocalDateTime.now()
        );
        
        return ResponseEntity.badRequest().body(response);
    }
}
```

### Example 2: User Registration with Groups

```java
// Groups
public interface BasicInfo {}
public interface AccountSecurity {}
public interface ProfileDetails {}

@GroupSequence({BasicInfo.class, AccountSecurity.class, ProfileDetails.class})
public interface CompleteRegistration {}

// DTO
@Data
@PasswordMatches(groups = AccountSecurity.class)
public class UserRegistrationRequest {
    
    // Basic Info (Step 1)
    @NotBlank(groups = BasicInfo.class, message = "Email is required")
    @Email(groups = BasicInfo.class, message = "Invalid email format")
    @UniqueEmail(groups = BasicInfo.class, message = "Email already registered")
    private String email;
    
    @NotBlank(groups = BasicInfo.class, message = "Username is required")
    @Size(min = 4, max = 20, groups = BasicInfo.class, message = "Username must be 4-20 characters")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", groups = BasicInfo.class, message = "Username can only contain letters, numbers, and underscores")
    @UniqueUsername(groups = BasicInfo.class, message = "Username already taken")
    private String username;
    
    // Account Security (Step 2)
    @NotBlank(groups = AccountSecurity.class, message = "Password is required")
    @StrongPassword(groups = AccountSecurity.class, message = "Password must be strong")
    private String password;
    
    @NotBlank(groups = AccountSecurity.class, message = "Password confirmation is required")
    private String confirmPassword;
    
    // Profile Details (Step 3)
    @NotBlank(groups = ProfileDetails.class, message = "First name is required")
    @Size(min = 2, max = 50, groups = ProfileDetails.class)
    private String firstName;
    
    @NotBlank(groups = ProfileDetails.class, message = "Last name is required")
    @Size(min = 2, max = 50, groups = ProfileDetails.class)
    private String lastName;
    
    @NotNull(groups = ProfileDetails.class, message = "Birth date is required")
    @Past(groups = ProfileDetails.class, message = "Birth date must be in the past")
    @MinAge(value = 18, groups = ProfileDetails.class, message = "Must be at least 18 years old")
    private LocalDate birthDate;
    
    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", groups = ProfileDetails.class, message = "Invalid phone number")
    private String phoneNumber;
}

// Controller
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @PostMapping("/register/step1")
    public StepResponse validateBasicInfo(
        @Validated(BasicInfo.class) @RequestBody UserRegistrationRequest request
    ) {
        return new StepResponse(true, "Basic info validated");
    }
    
    @PostMapping("/register/step2")
    public StepResponse validateAccountSecurity(
        @Validated(AccountSecurity.class) @RequestBody UserRegistrationRequest request
    ) {
        return new StepResponse(true, "Account security validated");
    }
    
    @PostMapping("/register/step3")
    public StepResponse validateProfileDetails(
        @Validated(ProfileDetails.class) @RequestBody UserRegistrationRequest request
    ) {
        return new StepResponse(true, "Profile details validated");
    }
    
    @PostMapping("/register/complete")
    public ResponseEntity<UserResponse> completeRegistration(
        @Validated(CompleteRegistration.class) @RequestBody UserRegistrationRequest request
    ) {
        User user = authService.register(request);
        UserResponse response = mapToResponse(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
```

---

## ✅ Best Practices

### 1. Layer Separation

```java
// ✅ Good - Validation at entry point
@RestController
public class UserController {
    @PostMapping
    public User create(@Valid @RequestBody UserRequest request) {
        return userService.create(request);  // No validation in service
    }
}

// ❌ Bad - Validation in service layer
@Service
public class UserService {
    public User create(UserRequest request) {
        if (request.getEmail() == null) {  // Don't do this
            throw new ValidationException("Email required");
        }
    }
}
```

### 2. Clear Error Messages

```java
// ✅ Good - Clear, actionable
@Email(message = "Please provide a valid email address (e.g., user@example.com)")
private String email;

// ❌ Bad - Vague
@Email(message = "Invalid")
private String email;
```

### 3. Use Validation Groups

```java
// ✅ Good - Same DTO for create and update
@Data
public class UserRequest {
    @Null(groups = CreateGroup.class)
    @NotNull(groups = UpdateGroup.class)
    private Long id;
}

// ❌ Bad - Separate DTOs
public class UserCreateRequest { }
public class UserUpdateRequest { }  // Duplicated fields
```

### 4. Internationalization

```java
// ✅ Good - i18n support
@NotBlank(message = "{user.email.required}")
private String email;

// ValidationMessages.properties
// user.email.required=Email is required

// ValidationMessages_es.properties
// user.email.required=El correo electrónico es obligatorio

// ❌ Bad - Hardcoded English
@NotBlank(message = "Email is required")
private String email;
```

### 5. Custom Validators for Business Rules

```java
// ✅ Good - Reusable custom validator
@UniqueEmail
private String email;

// ❌ Bad - Manual check in controller
@PostMapping
public User create(@RequestBody UserRequest request) {
    if (userRepository.existsByEmail(request.getEmail())) {
        throw new ValidationException("Email exists");
    }
}
```

### 6. Null Handling

```java
// ✅ Good - Separate null check
@NotNull(message = "Email is required")
@Email(message = "Invalid email format")
private String email;

// ❌ Bad - Mixed concerns
@Email(message = "Email is required and must be valid")
private String email;  // Unclear which rule failed
```

### 7. Performance Optimization

```java
// ✅ Good - Compiled pattern reused
@Component
public class MyValidator implements ConstraintValidator<MyAnnotation, String> {
    
    private Pattern pattern;
    
    @Override
    public void initialize(MyAnnotation annotation) {
        this.pattern = Pattern.compile(annotation.regexp());
    }
    
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return pattern.matcher(value).matches();
    }
}

// ❌ Bad - Compile on every validation
@Override
public boolean isValid(String value, ConstraintValidatorContext context) {
    return value.matches(regex);  // Compiles every time
}
```

---

## 🎤 Interview Questions

### Basic Questions

**Q1: What is Bean Validation?**  
**Answer:** JSR 380 specification for declarative validation using annotations like @NotNull, @Size, etc.

**Q2: What is the difference between @Valid and @Validated?**  
**Answer:**
- @Valid: Jakarta standard, no groups, nested validation
- @Validated: Spring-specific, supports groups, method validation

**Q3: What is @NotNull vs @NotEmpty vs @NotBlank?**  
**Answer:**
- @NotNull: Value must not be null
- @NotEmpty: Not null AND not empty (length > 0)
- @NotBlank: Not null AND contains non-whitespace

**Q4: How to validate nested objects?**  
**Answer:** Use @Valid on nested field:
```java
@Valid
private Address address;
```

**Q5: What exception is thrown on validation failure?**  
**Answer:** `MethodArgumentNotValidException` (controller) or `ConstraintViolationException` (method parameters)

### Intermediate Questions

**Q6: What are validation groups?**  
**Answer:** Marker interfaces to conditionally apply constraints:
```java
@NotNull(groups = CreateGroup.class)
```

**Q7: How to create custom validator?**  
**Answer:**
1. Create annotation with @Constraint
2. Implement ConstraintValidator<A, T>
3. Override initialize() and isValid()

**Q8: What is ConstraintValidatorContext?**  
**Answer:** Provides context for validation, allows custom error messages

**Q9: How to internationalize validation messages?**  
**Answer:** Create ValidationMessages_*.properties for each locale

**Q10: Can you inject dependencies in validators?**  
**Answer:** Yes, mark validator with @Component, use @Autowired

### Advanced Questions

**Q11: What is @GroupSequence?**  
**Answer:** Defines order of group validation, stops at first failure

**Q12: How to validate method parameters?**  
**Answer:** Use @Validated at class level:
```java
@Validated
@Service
public class MyService {
    public void method(@Min(1) Long id) { }
}
```

**Q13: How to provide dynamic validation messages?**  
**Answer:**
```java
context.disableDefaultConstraintViolation();
context.buildConstraintViolationWithTemplate("Dynamic: " + value)
    .addConstraintViolation();
```

**Q14: Can one annotation have multiple validators?**  
**Answer:** Yes:
```java
@Constraint(validatedBy = {Validator1.class, Validator2.class})
```

**Q15: How to handle validation errors globally?**  
**Answer:**
```java
@RestControllerAdvice
public class Handler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handle(MethodArgumentNotValidException ex) {
        // Extract and return errors
    }
}
```

### Expert Questions

**Q16: Performance considerations for validators?**  
**Answer:**
- Cache expensive operations in initialize()
- Avoid database queries if possible
- Use efficient algorithms
- Compile regex patterns once

**Q17: Are validators thread-safe?**  
**Answer:** Yes, one instance used for all validations. Avoid mutable state.

**Q18: Can you validate collections?**  
**Answer:** Yes:
```java
@Valid List<@NotNull Item> items;
```

**Q19: How to test custom validators?**  
**Answer:**
```java
validator.initialize(annotation);
boolean result = validator.isValid(value, context);
```

**Q20: Best practice for choosing validation strategy?**  
**Answer:**
- Simple rules → Built-in validators
- Business logic → Custom validators
- Conditional validation → Groups
- Cross-field → Class-level validators

---

## 📊 Validation Cheat Sheet

### Annotation Quick Reference

| Annotation | Use Case | Example |
|------------|----------|---------|
| `@NotNull` | Must not be null | `@NotNull private String name;` |
| `@NotEmpty` | Not null, not empty | `@NotEmpty private List<String> tags;` |
| `@NotBlank` | Not null, has non-whitespace | `@NotBlank private String username;` |
| `@Size` | Length/size constraint | `@Size(min=2, max=50) private String name;` |
| `@Min` | Minimum value | `@Min(1) private Integer quantity;` |
| `@Max` | Maximum value | `@Max(100) private Integer percentage;` |
| `@Email` | Valid email format | `@Email private String email;` |
| `@Pattern` | Regex match | `@Pattern(regexp="^\\d{10}$") private String phone;` |
| `@Past` | Date in past | `@Past private LocalDate birthDate;` |
| `@Future` | Date in future | `@Future private LocalDate eventDate;` |
| `@Positive` | Value > 0 | `@Positive private BigDecimal price;` |
| `@Valid` | Nested validation | `@Valid private Address address;` |

### Common Validation Patterns

```java
// Email
@NotBlank @Email
private String email;

// Phone (US)
@Pattern(regexp = "^\\d{10}$", message = "Phone must be 10 digits")
private String phone;

// Password (Strong)
@NotBlank
@Size(min = 8)
@Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).*$")
private String password;

// Price
@NotNull @Positive @DecimalMin("0.01")
private BigDecimal price;

// Age (18+)
@NotNull @Min(18) @Max(120)
private Integer age;

// URL
@NotBlank @URL
private String website;

// Date Range
@NotNull @Past
private LocalDate startDate;

@NotNull @Future
private LocalDate endDate;
```

---

## 📚 Summary

### Key Takeaways

1. **Bean Validation (JSR 380)**: Standard declarative validation using annotations
2. **@Valid vs @Validated**: Use @Valid for simple cases, @Validated for groups/method validation
3. **Built-in Validators**: Comprehensive set for common validations (@NotNull, @Email, @Size, etc.)
4. **Custom Validators**: Create domain-specific validation with ConstraintValidator
5. **Validation Groups**: Conditional validation for different scenarios (create vs update)
6. **Internationalization**: Support multiple languages with ValidationMessages.properties
7. **Exception Handling**: Global exception handler for consistent error responses

### Learning Path

```
1. Start with built-in validators
   ↓
2. Learn @Valid vs @Validated
   ↓
3. Master validation groups
   ↓
4. Create custom validators
   ↓
5. Implement i18n messages
   ↓
6. Optimize performance
   ↓
7. Write comprehensive tests
```

### Next Steps

- Practice with real-world DTOs
- Create custom validators for your domain
- Implement comprehensive exception handling
- Set up internationalization
- Write integration tests for validation flows

**Happy Validating! ✅**

