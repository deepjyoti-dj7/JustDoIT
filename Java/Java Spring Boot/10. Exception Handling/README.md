# 🛡️ Exception Handling - Complete Guide

## 📚 Module Overview

This module covers **Exception Handling** in Spring Boot, providing comprehensive techniques for handling errors gracefully, creating custom exceptions, and implementing production-ready error handling strategies.

---

## 📖 Topics Covered

### [01. ExceptionHandler](./01.%20ExceptionHandler.md)
- @ExceptionHandler annotation basics
- Method-level exception handling
- Controller-level exception handling
- Exception hierarchy
- Multiple exception handlers
- Response status
- Return types (ResponseEntity, ErrorResponse)
- Request context in handlers

**Key Concepts:**
```java
@ExceptionHandler(UserNotFoundException.class)
@ResponseStatus(HttpStatus.NOT_FOUND)
public ErrorResponse handleUserNotFound(UserNotFoundException ex) {
    return ErrorResponse.builder()
        .status(HttpStatus.NOT_FOUND.value())
        .message(ex.getMessage())
        .timestamp(LocalDateTime.now())
        .build();
}
```

---

### [02. ControllerAdvice](./02.%20ControllerAdvice.md)
- @ControllerAdvice vs @RestControllerAdvice
- Global exception handling
- Targeting specific controllers (basePackages, assignableTypes)
- @ModelAttribute for common attributes
- @InitBinder for data binding
- Exception handler priority (@Order)
- Cross-cutting concerns

**Key Concepts:**
```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(
            ResourceNotFoundException ex,
            HttpServletRequest request) {
        
        log.warn("Resource not found: {}", ex.getMessage());
        
        ErrorResponse error = ErrorResponse.builder()
            .status(HttpStatus.NOT_FOUND.value())
            .message(ex.getMessage())
            .path(request.getRequestURI())
            .timestamp(LocalDateTime.now())
            .build();
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
}
```

---

### [03. Custom Exceptions](./03.%20Custom%20Exceptions.md)
- Creating custom exceptions
- Exception hierarchy design
- Domain-specific exceptions
- Exceptions with error codes
- Exceptions with additional data
- Business rule exceptions
- Base exception classes

**Key Concepts:**
```java
@Getter
public abstract class BaseException extends RuntimeException {
    private final HttpStatus status;
    private final String errorCode;
    
    protected BaseException(String message, HttpStatus status, String errorCode) {
        super(message);
        this.status = status;
        this.errorCode = errorCode;
    }
}

public class UserNotFoundException extends BaseException {
    public UserNotFoundException(Long id) {
        super(
            String.format("User not found with id: %d", id),
            HttpStatus.NOT_FOUND,
            "USER_NOT_FOUND"
        );
    }
}
```

---

### [04. Global Exception Handling](./04.%20Global%20Exception%20Handling.md)
- ResponseEntityExceptionHandler
- Centralized exception handling
- Default exception handlers
- Overriding Spring MVC handlers
- Custom error responses
- Exception handling strategies
- Production-ready setup

**Key Concepts:**
```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {
    
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request) {
        
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> 
            errors.put(error.getField(), error.getDefaultMessage())
        );
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }
}
```

---

### [05. Error Response Structure](./05.%20Error%20Response%20Structure.md)
- Basic error response
- Validation error response
- Rich error response
- API error standards (RFC 7807)
- Error response builder
- Real-world examples
- Consistent formatting

**Key Concepts:**
```java
@Data
@Builder
public class ErrorResponse {
    private String errorCode;
    private int status;
    private String message;
    private String path;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    private LocalDateTime timestamp;
    
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Map<String, Object> metadata;
}
```

**Example Response:**
```json
{
  "errorCode": "USER_NOT_FOUND",
  "status": 404,
  "message": "User not found with id: 123",
  "path": "/api/users/123",
  "timestamp": "2024-01-15T10:30:45.123"
}
```

---

### [06. Validation Exceptions](./06.%20Validation%20Exceptions.md)
- Bean Validation (JSR-303/JSR-380)
- @Valid for request body
- MethodArgumentNotValidException
- ConstraintViolationException
- Custom validators
- Field-level validation
- Class-level validation
- Nested object validation

**Key Concepts:**
```java
// DTO with validation
@Data
public class UserRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;
    
    @NotNull(message = "Age is required")
    @Min(value = 18, message = "Must be at least 18")
    private Integer age;
}

// Controller
@PostMapping
public User create(@Valid @RequestBody UserRequest request) {
    return userService.create(request);
}

// Exception Handler
@ExceptionHandler(MethodArgumentNotValidException.class)
public ValidationErrorResponse handleValidation(
        MethodArgumentNotValidException ex) {
    
    Map<String, String> errors = new HashMap<>();
    ex.getBindingResult().getFieldErrors().forEach(error -> 
        errors.put(error.getField(), error.getDefaultMessage())
    );
    
    return ValidationErrorResponse.builder()
        .errorCode("VALIDATION_ERROR")
        .status(400)
        .errors(errors)
        .build();
}
```

---

### [07. Best Practices](./07.%20Best%20Practices.md)
- Exception design principles
- Global exception handling patterns
- Error response standards
- Logging strategies
- Security considerations
- Testing exception handling
- Production best practices
- Common anti-patterns

**Key Principles:**
- ✅ Use exception hierarchy
- ✅ Centralized global handling
- ✅ Consistent error format
- ✅ Don't expose sensitive info
- ✅ Log appropriately (WARN vs ERROR)
- ✅ Environment-specific messages
- ✅ Include correlation IDs
- ✅ Monitor and alert

---

## 🚀 Quick Start

### 1. Create Base Exception

```java
@Getter
public abstract class BaseException extends RuntimeException {
    private final HttpStatus status;
    private final String errorCode;
    
    protected BaseException(String message, HttpStatus status, String errorCode) {
        super(message);
        this.status = status;
        this.errorCode = errorCode;
    }
}
```

### 2. Create Domain Exceptions

```java
public class UserNotFoundException extends BaseException {
    public UserNotFoundException(Long id) {
        super(
            String.format("User not found with id: %d", id),
            HttpStatus.NOT_FOUND,
            "USER_NOT_FOUND"
        );
    }
}

public class DuplicateEmailException extends BaseException {
    public DuplicateEmailException(String email) {
        super(
            String.format("Email already exists: %s", email),
            HttpStatus.CONFLICT,
            "DUPLICATE_EMAIL"
        );
    }
}
```

### 3. Create Error Response DTOs

```java
@Data
@Builder
public class ErrorResponse {
    private String errorCode;
    private int status;
    private String message;
    private String path;
    private LocalDateTime timestamp;
}

@Data
@Builder
public class ValidationErrorResponse {
    private String errorCode;
    private int status;
    private String message;
    private Map<String, String> errors;
    private String path;
    private LocalDateTime timestamp;
}
```

### 4. Create Global Exception Handler

```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {
    
    // Business exceptions
    @ExceptionHandler(BaseException.class)
    public ResponseEntity<ErrorResponse> handleBaseException(
            BaseException ex,
            HttpServletRequest request) {
        
        log.warn("Business exception: {}", ex.getMessage());
        
        ErrorResponse error = ErrorResponse.builder()
            .errorCode(ex.getErrorCode())
            .status(ex.getStatus().value())
            .message(ex.getMessage())
            .path(request.getRequestURI())
            .timestamp(LocalDateTime.now())
            .build();
        
        return ResponseEntity.status(ex.getStatus()).body(error);
    }
    
    // Validation errors
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request) {
        
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> 
            errors.put(error.getField(), error.getDefaultMessage())
        );
        
        ValidationErrorResponse errorResponse = ValidationErrorResponse.builder()
            .errorCode("VALIDATION_ERROR")
            .status(HttpStatus.BAD_REQUEST.value())
            .message("Validation failed")
            .errors(errors)
            .path(request.getDescription(false).replace("uri=", ""))
            .timestamp(LocalDateTime.now())
            .build();
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }
    
    // Generic exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(
            Exception ex,
            HttpServletRequest request) {
        
        log.error("Unexpected error at {}", request.getRequestURI(), ex);
        
        ErrorResponse error = ErrorResponse.builder()
            .errorCode("INTERNAL_ERROR")
            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
            .message("An unexpected error occurred")
            .path(request.getRequestURI())
            .timestamp(LocalDateTime.now())
            .build();
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
```

### 5. Use in Service

```java
@Service
public class UserService {
    
    public User findById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException(id));
    }
    
    public User create(UserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException(request.getEmail());
        }
        // Create user...
    }
}
```

---

## 📊 Exception Handling Patterns

### Pattern 1: By HTTP Status

```java
// 404 - Not Found
UserNotFoundException
ProductNotFoundException
OrderNotFoundException

// 409 - Conflict
DuplicateEmailException
ResourceAlreadyExistsException
InsufficientStockException

// 400 - Bad Request
InvalidRequestException
InvalidEmailFormatException
InvalidOrderStatusException

// 401 - Unauthorized
UnauthorizedException
InvalidCredentialsException
TokenExpiredException

// 403 - Forbidden
ForbiddenException
InsufficientPermissionsException
```

### Pattern 2: By Domain

```java
// User Domain
UserNotFoundException
DuplicateEmailException
InvalidCredentialsException

// Product Domain
ProductNotFoundException
InsufficientStockException
ProductDiscontinuedException

// Order Domain
OrderNotFoundException
InvalidOrderStatusException
OrderAlreadyCancelledException

// Payment Domain
PaymentFailedException
InsufficientFundsException
CardDeclinedException
```

---

## 🔍 Comparison Table

| Feature | @ExceptionHandler | @ControllerAdvice | ResponseEntityExceptionHandler |
|---------|-------------------|-------------------|-------------------------------|
| **Scope** | Controller-level | Global | Global |
| **Location** | In controller | Separate class | Separate class |
| **Reusability** | ❌ Low | ✅ High | ✅ High |
| **Spring Exceptions** | ❌ Manual | ❌ Manual | ✅ Built-in |
| **Custom Exceptions** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Target Specific** | ❌ No | ✅ Yes | ✅ Yes |
| **Best For** | Single controller | All controllers | REST APIs |

---

## 🎯 Error Response Formats

### Basic Error

```json
{
  "errorCode": "USER_NOT_FOUND",
  "status": 404,
  "message": "User not found with id: 123",
  "path": "/api/users/123",
  "timestamp": "2024-01-15T10:30:45.123"
}
```

### Validation Error

```json
{
  "errorCode": "VALIDATION_ERROR",
  "status": 400,
  "message": "Validation failed",
  "errors": {
    "email": "Email must be valid",
    "age": "Age must be at least 18",
    "password": "Password must be at least 8 characters"
  },
  "path": "/api/users",
  "timestamp": "2024-01-15T10:30:45.123"
}
```

### Rich Error (with metadata)

```json
{
  "errorCode": "INSUFFICIENT_STOCK",
  "status": 409,
  "message": "Insufficient stock for product",
  "path": "/api/orders",
  "timestamp": "2024-01-15T10:30:45.123",
  "metadata": {
    "productId": 123,
    "productName": "iPhone 15",
    "requestedQuantity": 5,
    "availableQuantity": 2
  }
}
```

---

## 💡 Common Use Cases

### Use Case 1: User Not Found

```java
// Exception
public class UserNotFoundException extends BaseException {
    public UserNotFoundException(Long id) {
        super(
            String.format("User not found with id: %d", id),
            HttpStatus.NOT_FOUND,
            "USER_NOT_FOUND"
        );
    }
}

// Service
public User findById(Long id) {
    return userRepository.findById(id)
        .orElseThrow(() -> new UserNotFoundException(id));
}

// Response
{
  "errorCode": "USER_NOT_FOUND",
  "status": 404,
  "message": "User not found with id: 123"
}
```

### Use Case 2: Validation Error

```java
// DTO
@Data
public class UserRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;
    
    @Min(value = 18, message = "Must be at least 18")
    private Integer age;
}

// Controller
@PostMapping
public User create(@Valid @RequestBody UserRequest request) {
    return userService.create(request);
}

// Response
{
  "errorCode": "VALIDATION_ERROR",
  "status": 400,
  "errors": {
    "email": "Email must be valid",
    "age": "Must be at least 18"
  }
}
```

### Use Case 3: Insufficient Stock

```java
// Exception
@Getter
public class InsufficientStockException extends BaseException {
    private final Long productId;
    private final int requested;
    private final int available;
    
    public InsufficientStockException(Long productId, int requested, int available) {
        super(
            String.format("Insufficient stock. Requested: %d, Available: %d", 
                requested, available),
            HttpStatus.CONFLICT,
            "INSUFFICIENT_STOCK"
        );
        this.productId = productId;
        this.requested = requested;
        this.available = available;
    }
}

// Service
public Order createOrder(OrderRequest request) {
    Product product = productRepository.findById(request.getProductId())
        .orElseThrow(() -> new ProductNotFoundException(request.getProductId()));
    
    if (product.getStock() < request.getQuantity()) {
        throw new InsufficientStockException(
            product.getId(),
            request.getQuantity(),
            product.getStock()
        );
    }
    // Create order...
}

// Response
{
  "errorCode": "INSUFFICIENT_STOCK",
  "status": 409,
  "message": "Insufficient stock. Requested: 5, Available: 2",
  "metadata": {
    "productId": 123,
    "requested": 5,
    "available": 2
  }
}
```

---

## 🎤 Interview Questions

### Basic Questions

**Q1: What is @ExceptionHandler?**  
Annotation for handling exceptions at controller or global level.

**Q2: Difference between @ControllerAdvice and @RestControllerAdvice?**  
@RestControllerAdvice = @ControllerAdvice + @ResponseBody (auto JSON).

**Q3: What is ResponseEntityExceptionHandler?**  
Base class providing default handlers for Spring MVC exceptions.

**Q4: Why use custom exceptions?**  
Domain-specific context, meaningful messages, better error handling.

**Q5: Should exceptions extend Exception or RuntimeException?**  
RuntimeException for business logic (unchecked).

### Intermediate Questions

**Q6: How to handle validation errors globally?**  
Override handleMethodArgumentNotValid() or @ExceptionHandler(MethodArgumentNotValidException.class).

**Q7: What fields should error response include?**  
errorCode, status, message, path, timestamp (minimum).

**Q8: How to include request context in errors?**  
Use HttpServletRequest to get URI, method, headers.

**Q9: What log level for exceptions?**  
WARN for expected business exceptions, ERROR for unexpected.

**Q10: How to target specific controllers in @ControllerAdvice?**  
Use basePackages, assignableTypes, or annotations attribute.

### Advanced Questions

**Q11: How to prevent exposing sensitive information?**  
- Don't return stack traces
- Generic messages in production
- Log details server-side
- Environment-specific responses

**Q12: What is correlation ID and why use it?**  
Unique identifier linking request, error, and logs for tracking.

**Q13: How to handle async exceptions?**  
@ExceptionHandler(AsyncRequestTimeoutException.class) or AsyncUncaughtExceptionHandler.

**Q14: How to test exception handling?**  
Use MockMvc to verify status, error code, message structure.

**Q15: Best practices for exception handling?**
1. Use exception hierarchy
2. Centralized global handling
3. Consistent error format
4. Don't expose sensitive info
5. Log appropriately
6. Environment-specific messages
7. Include correlation IDs
8. Test thoroughly

---

## 📚 Additional Resources

### Dependencies

```xml
<!-- Spring Boot Starter Web (includes validation) -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- Validation -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>

<!-- Lombok (optional) -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <scope>provided</scope>
</dependency>
```

### Configuration

```yaml
# application.yml
spring:
  mvc:
    throw-exception-if-no-handler-found: true
  web:
    resources:
      add-mappings: false

# Error handling
server:
  error:
    include-message: always
    include-binding-errors: always
    include-stacktrace: never  # Never expose in production
    include-exception: false

# Logging
logging:
  level:
    com.example: INFO
    org.springframework.web: INFO
```

---

## 🎯 Summary

### Core Components

1. **@ExceptionHandler** - Handle exceptions in controller
2. **@ControllerAdvice** - Global exception handling
3. **ResponseEntityExceptionHandler** - Spring MVC exception base
4. **Custom Exceptions** - Domain-specific errors
5. **Error Response** - Consistent format
6. **Validation** - Bean validation with @Valid

### Exception Flow

```
Request → Controller → Service → Exception
                                     ↓
                      @ControllerAdvice catches
                                     ↓
                      @ExceptionHandler methods
                                     ↓
                      Format ErrorResponse
                                     ↓
                      Return to client
```

### Best Practices Checklist

- ✅ Use exception hierarchy with base class
- ✅ Centralize handling with @RestControllerAdvice
- ✅ Extend ResponseEntityExceptionHandler
- ✅ Consistent error response format
- ✅ Use error codes (USER_NOT_FOUND, VALIDATION_ERROR)
- ✅ Include request context (path, timestamp)
- ✅ Log appropriately (WARN vs ERROR)
- ✅ Don't expose stack traces or sensitive info
- ✅ Environment-specific messages
- ✅ Add correlation IDs for tracking
- ✅ Test exception handling
- ✅ Monitor and alert on errors

---

## 🎓 Next Steps

After mastering Exception Handling, proceed to:
- **Validation** - Advanced Bean Validation techniques
- **Spring Security** - Handling security exceptions
- **Logging & Monitoring** - Exception tracking and alerting
- **REST API Best Practices** - Professional error handling

---

**📘 This module provides production-ready exception handling for Spring Boot applications!**

