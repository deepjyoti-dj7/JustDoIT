# 🌐 REST API Development - Complete Guide

## 📋 Overview

This folder contains comprehensive guides on building REST APIs with Spring Boot, covering everything from basic controller setup to advanced concepts like HATEOAS.

---

## 📚 Topics Covered

### 01. RestController Basics
- Introduction to @RestController annotation
- REST principles and architecture
- Creating your first REST API
- JSON serialization with Jackson
- Exception handling in REST controllers
- Testing REST APIs

### 02. HTTP Methods
- Complete guide to HTTP methods (GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS)
- CRUD operations mapping
- Idempotency concepts
- Method selection guidelines
- Safety vs idempotency

### 03. Request Mapping
- @RequestMapping and shortcut annotations
- Path patterns and wildcards
- Multiple mappings
- Headers and parameters in mapping
- Consumes and produces specifications
- Class-level vs method-level mapping

### 04. Path Variables & Query Parameters
- @PathVariable for URL path extraction
- @RequestParam for query parameters
- Optional and default values
- Validation of parameters
- Matrix variables
- Advanced parameter handling techniques

### 05. Request Body & Response Entity
- @RequestBody for deserializing request data
- ResponseEntity for customizing responses
- DTO pattern for request/response
- Validation with Bean Validation
- Custom headers and status codes
- Content negotiation basics

### 06. HTTP Status Codes
- Complete guide to HTTP status codes (1xx-5xx)
- Appropriate status codes for CRUD operations
- Client errors (4xx) vs server errors (5xx)
- Exception handling with proper status codes
- Best practices for status code usage

### 07. Content Negotiation
- Accept and Content-Type headers
- Produces and consumes annotations
- Message converters (Jackson, JAXB)
- Supporting multiple formats (JSON, XML)
- Custom media types
- API versioning strategies

### 08. HATEOAS
- Hypermedia as the Engine of Application State
- Spring HATEOAS library
- Creating links with WebMvcLinkBuilder
- EntityModel and CollectionModel
- HAL format
- Link relations and discoverability

---

## 🎯 Quick Reference

### REST API Annotations

| Annotation | Purpose | Example |
|------------|---------|---------|
| `@RestController` | Mark class as REST controller | `@RestController` |
| `@RequestMapping` | Map requests to handler methods | `@RequestMapping("/api/users")` |
| `@GetMapping` | Handle GET requests | `@GetMapping("/{id}")` |
| `@PostMapping` | Handle POST requests | `@PostMapping` |
| `@PutMapping` | Handle PUT requests | `@PutMapping("/{id}")` |
| `@PatchMapping` | Handle PATCH requests | `@PatchMapping("/{id}")` |
| `@DeleteMapping` | Handle DELETE requests | `@DeleteMapping("/{id}")` |
| `@PathVariable` | Extract path variable | `@PathVariable Long id` |
| `@RequestParam` | Extract query parameter | `@RequestParam String name` |
| `@RequestBody` | Deserialize request body | `@RequestBody User user` |
| `@Valid` | Validate request body | `@Valid @RequestBody User user` |

### HTTP Methods

| Method | Purpose | Idempotent | Safe | Request Body | Response Body |
|--------|---------|------------|------|--------------|---------------|
| **GET** | Retrieve resource | ✅ | ✅ | ❌ | ✅ |
| **POST** | Create resource | ❌ | ❌ | ✅ | ✅ |
| **PUT** | Update/Replace | ✅ | ❌ | ✅ | ✅ |
| **PATCH** | Partial update | ❌ | ❌ | ✅ | ✅ |
| **DELETE** | Delete resource | ✅ | ❌ | ❌ | ❌ |
| **HEAD** | Get headers only | ✅ | ✅ | ❌ | ❌ |
| **OPTIONS** | Get allowed methods | ✅ | ✅ | ❌ | ✅ |

### HTTP Status Codes

#### 2xx Success
| Code | Name | Usage |
|------|------|-------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST (resource created) |
| 202 | Accepted | Request accepted for async processing |
| 204 | No Content | Successful DELETE or update with no body |

#### 4xx Client Errors
| Code | Name | Usage |
|------|------|-------|
| 400 | Bad Request | Invalid request syntax or data |
| 401 | Unauthorized | Authentication required or failed |
| 403 | Forbidden | Authenticated but not authorized |
| 404 | Not Found | Resource doesn't exist |
| 405 | Method Not Allowed | HTTP method not supported |
| 409 | Conflict | Duplicate resource or state conflict |
| 422 | Unprocessable Entity | Semantic/business rule violation |
| 429 | Too Many Requests | Rate limit exceeded |

#### 5xx Server Errors
| Code | Name | Usage |
|------|------|-------|
| 500 | Internal Server Error | Unexpected server error |
| 502 | Bad Gateway | Invalid upstream response |
| 503 | Service Unavailable | Temporarily down |
| 504 | Gateway Timeout | Upstream timeout |

### CRUD Operations

| Operation | HTTP Method | URL | Request Body | Success Status | Error Status |
|-----------|-------------|-----|--------------|----------------|--------------|
| **Create** | POST | `/users` | User JSON | 201 Created | 400, 409 |
| **Read (single)** | GET | `/users/{id}` | None | 200 OK | 404 |
| **Read (all)** | GET | `/users` | None | 200 OK | - |
| **Update (full)** | PUT | `/users/{id}` | User JSON | 200 OK | 400, 404 |
| **Update (partial)** | PATCH | `/users/{id}` | Partial JSON | 200 OK | 400, 404 |
| **Delete** | DELETE | `/users/{id}` | None | 204 No Content | 404 |

---

## 💡 Complete REST Controller Example

```java
@RestController
@RequestMapping("/api/users")
@Validated
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private UserModelAssembler assembler;
    
    // GET all users with pagination
    @GetMapping
    public ResponseEntity<Page<EntityModel<User>>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<EntityModel<User>> users = userService.findAll(pageable)
            .map(assembler::toModel);
        
        return ResponseEntity.ok(users);
    }
    
    // GET single user by ID
    @GetMapping("/{id}")
    public ResponseEntity<EntityModel<User>> getUser(@PathVariable Long id) {
        return userService.findById(id)
            .map(assembler::toModel)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    // Search users
    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) Integer minAge,
            @RequestParam(required = false) Integer maxAge) {
        
        List<User> users = userService.search(name, email, minAge, maxAge);
        return ResponseEntity.ok(users);
    }
    
    // POST - Create new user
    @PostMapping
    public ResponseEntity<EntityModel<User>> createUser(
            @Valid @RequestBody CreateUserRequest request) {
        
        if (userService.existsByEmail(request.getEmail())) {
            throw new ConflictException("User already exists with email: " + request.getEmail());
        }
        
        User created = userService.create(request);
        EntityModel<User> model = assembler.toModel(created);
        
        URI location = ServletUriComponentsBuilder
            .fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(created.getId())
            .toUri();
        
        return ResponseEntity.created(location).body(model);
    }
    
    // PUT - Full update
    @PutMapping("/{id}")
    public ResponseEntity<EntityModel<User>> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request) {
        
        return userService.update(id, request)
            .map(assembler::toModel)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    // PATCH - Partial update
    @PatchMapping("/{id}")
    public ResponseEntity<EntityModel<User>> patchUser(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates) {
        
        return userService.patch(id, updates)
            .map(assembler::toModel)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (!userService.exists(id)) {
            return ResponseEntity.notFound().build();
        }
        
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
    
    // Get user's orders
    @GetMapping("/{id}/orders")
    public ResponseEntity<CollectionModel<EntityModel<Order>>> getUserOrders(
            @PathVariable Long id) {
        
        if (!userService.exists(id)) {
            return ResponseEntity.notFound().build();
        }
        
        List<EntityModel<Order>> orders = orderService.findByUserId(id).stream()
            .map(orderAssembler::toModel)
            .collect(Collectors.toList());
        
        CollectionModel<EntityModel<Order>> collection = CollectionModel.of(orders,
            linkTo(methodOn(UserController.class).getUserOrders(id)).withSelfRel(),
            linkTo(methodOn(UserController.class).getUser(id)).withRel("user")
        );
        
        return ResponseEntity.ok(collection);
    }
}
```

---

## 🛠️ Request/Response Examples

### Create User (POST)

**Request:**
```http
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30
}
```

**Response:**
```http
HTTP/1.1 201 Created
Location: http://localhost:8080/api/users/123
Content-Type: application/hal+json

{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30,
  "_links": {
    "self": {"href": "http://localhost:8080/api/users/123"},
    "orders": {"href": "http://localhost:8080/api/users/123/orders"},
    "users": {"href": "http://localhost:8080/api/users"}
  }
}
```

### Get User (GET)

**Request:**
```http
GET /api/users/123
Accept: application/json
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/hal+json

{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30,
  "_links": {
    "self": {"href": "http://localhost:8080/api/users/123"},
    "orders": {"href": "http://localhost:8080/api/users/123/orders"}
  }
}
```

### Update User (PUT)

**Request:**
```http
PUT /api/users/123
Content-Type: application/json

{
  "name": "John Smith",
  "email": "john.smith@example.com",
  "age": 31
}
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 123,
  "name": "John Smith",
  "email": "john.smith@example.com",
  "age": 31
}
```

### Partial Update (PATCH)

**Request:**
```http
PATCH /api/users/123
Content-Type: application/json

{
  "age": 32
}
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 123,
  "name": "John Smith",
  "email": "john.smith@example.com",
  "age": 32
}
```

### Delete User (DELETE)

**Request:**
```http
DELETE /api/users/123
```

**Response:**
```http
HTTP/1.1 204 No Content
```

### Search with Query Parameters

**Request:**
```http
GET /api/users/search?name=John&minAge=25&maxAge=35
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

[
  {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30
  },
  {
    "id": 456,
    "name": "John Smith",
    "email": "john.smith@example.com",
    "age": 28
  }
]
```

---

## 🔧 Exception Handling

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.NOT_FOUND.value(),
            ex.getMessage(),
            LocalDateTime.now(),
            Collections.emptyList()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
    
    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ErrorResponse> handleConflict(ConflictException ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.CONFLICT.value(),
            ex.getMessage(),
            LocalDateTime.now(),
            Collections.emptyList()
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
            MethodArgumentNotValidException ex) {
        
        List<String> errors = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(error -> error.getField() + ": " + error.getDefaultMessage())
            .collect(Collectors.toList());
        
        ErrorResponse error = new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            "Validation failed",
            LocalDateTime.now(),
            errors
        );
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneral(Exception ex) {
        logger.error("Unexpected error", ex);
        
        ErrorResponse error = new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "Internal server error",
            LocalDateTime.now(),
            Collections.emptyList()
        );
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}

@Data
@AllArgsConstructor
public class ErrorResponse {
    private int status;
    private String message;
    private LocalDateTime timestamp;
    private List<String> errors;
}
```

---

## ✅ Validation

```java
// Request DTO with validation
@Data
public class CreateUserRequest {
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
    private String name;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    
    @NotNull(message = "Age is required")
    @Min(value = 18, message = "Age must be at least 18")
    @Max(value = 150, message = "Age must be less than 150")
    private Integer age;
}

// Controller with validation
@PostMapping
public ResponseEntity<User> createUser(@Valid @RequestBody CreateUserRequest request) {
    User created = userService.create(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(created);
}
```

---

## 🔗 HATEOAS Implementation

```java
@Component
public class UserModelAssembler implements RepresentationModelAssembler<User, EntityModel<User>> {
    
    @Override
    public EntityModel<User> toModel(User user) {
        EntityModel<User> model = EntityModel.of(user,
            linkTo(methodOn(UserController.class).getUser(user.getId())).withSelfRel(),
            linkTo(methodOn(UserController.class).getAllUsers(0, 10, "id")).withRel("users")
        );
        
        // Conditional links based on user state
        if (user.isActive()) {
            model.add(linkTo(methodOn(UserController.class).deactivateUser(user.getId()))
                .withRel("deactivate"));
        } else {
            model.add(linkTo(methodOn(UserController.class).activateUser(user.getId()))
                .withRel("activate"));
        }
        
        // Related resources
        model.add(linkTo(methodOn(UserController.class).getUserOrders(user.getId()))
            .withRel("orders"));
        
        return model;
    }
}
```

---

## 📌 Best Practices

### 1. Use Proper HTTP Methods
- **GET**: Retrieve resources
- **POST**: Create new resources
- **PUT**: Full update/replace
- **PATCH**: Partial update
- **DELETE**: Remove resources

### 2. Use Appropriate Status Codes
- **201** for created resources
- **204** for successful deletes
- **400** for validation errors
- **404** for missing resources
- **409** for conflicts

### 3. Use DTOs
Separate API contract from domain model:
```java
CreateUserRequest → User (entity) → UserResponse
```

### 4. Validate Input
Always validate request data:
```java
@PostMapping
public User create(@Valid @RequestBody CreateUserRequest request) { }
```

### 5. Version Your API
```java
@RequestMapping("/api/v1/users")
@RequestMapping("/api/v2/users")
```

### 6. Handle Exceptions Properly
Use @RestControllerAdvice for global exception handling

### 7. Use HATEOAS
Include links to related resources for discoverability

### 8. Document Your API
Use SpringDoc OpenAPI for automatic documentation

### 9. Implement Pagination
For collections, use pagination:
```java
@GetMapping
public Page<User> getUsers(Pageable pageable) { }
```

### 10. Use Content Negotiation
Support multiple formats (JSON, XML):
```java
@GetMapping(produces = {MediaType.APPLICATION_JSON_VALUE, 
                       MediaType.APPLICATION_XML_VALUE})
```

---

## 🎤 Interview Questions

### Q1: What is @RestController?
**Answer:** Combination of @Controller and @ResponseBody. Automatically serializes return values to JSON/XML.

### Q2: Difference between @RestController and @Controller?
**Answer:**
- **@RestController**: Returns data (JSON/XML), combines @Controller + @ResponseBody
- **@Controller**: Returns view names for template rendering

### Q3: What are the main HTTP methods?
**Answer:** GET (retrieve), POST (create), PUT (update), PATCH (partial update), DELETE (remove), HEAD (headers), OPTIONS (allowed methods).

### Q4: What is idempotency?
**Answer:** Multiple identical requests have same effect as single request. GET, PUT, DELETE are idempotent; POST, PATCH are not.

### Q5: Difference between PUT and PATCH?
**Answer:**
- **PUT**: Full replacement, idempotent
- **PATCH**: Partial update, not idempotent

### Q6: What is @PathVariable?
**Answer:** Extracts values from URI path:
```java
@GetMapping("/users/{id}")
public User getUser(@PathVariable Long id) { }
```

### Q7: What is @RequestParam?
**Answer:** Extracts query parameters:
```java
@GetMapping("/users")
public List<User> getUsers(@RequestParam String name) { }
```

### Q8: What is @RequestBody?
**Answer:** Deserializes HTTP request body to Java object using message converters (Jackson for JSON).

### Q9: What is ResponseEntity?
**Answer:** Wrapper for HTTP response allowing customization of body, headers, and status code.

### Q10: Common HTTP status codes?
**Answer:**
- **2xx**: 200 (OK), 201 (Created), 204 (No Content)
- **4xx**: 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 409 (Conflict)
- **5xx**: 500 (Internal Server Error), 503 (Service Unavailable)

### Q11: What is Content Negotiation?
**Answer:** Process where server and client agree on response format (JSON, XML) based on Accept header.

### Q12: What is HATEOAS?
**Answer:** Hypermedia As The Engine Of Application State - responses include links to related resources for discoverability.

### Q13: What is HAL?
**Answer:** Hypertext Application Language - standard format for HATEOAS with `_links` and `_embedded`.

### Q14: How to validate request data?
**Answer:** Use @Valid with Bean Validation annotations:
```java
@PostMapping
public User create(@Valid @RequestBody User user) { }
```

### Q15: How to handle exceptions in REST APIs?
**Answer:** Use @RestControllerAdvice with @ExceptionHandler:
```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) { }
}
```

### Q16: What is the DTO pattern?
**Answer:** Data Transfer Object - separates API contract from domain model. Prevents exposing sensitive data and allows API evolution.

### Q17: API versioning strategies?
**Answer:**
- **URL**: `/api/v1/users`, `/api/v2/users`
- **Header**: `X-API-Version: 1`
- **Accept header**: `application/vnd.company.v1+json`
- **Parameter**: `/users?version=1`

### Q18: What is pagination?
**Answer:** Dividing large datasets into pages:
```java
@GetMapping
public Page<User> getUsers(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size) { }
```

### Q19: Difference between 401 and 403?
**Answer:**
- **401 Unauthorized**: Not authenticated (missing/invalid credentials)
- **403 Forbidden**: Authenticated but not authorized (insufficient permissions)

### Q20: What are message converters?
**Answer:** Components converting HTTP request/response bodies to/from Java objects. Examples: Jackson (JSON), JAXB (XML).

---

## 📚 Summary

### Key Concepts

1. **REST Principles**: Stateless, cacheable, uniform interface, client-server
2. **HTTP Methods**: GET, POST, PUT, PATCH, DELETE for CRUD operations
3. **Status Codes**: Appropriate codes for different scenarios
4. **Request Handling**: @PathVariable, @RequestParam, @RequestBody
5. **Response Handling**: ResponseEntity with custom headers and status
6. **Validation**: Bean Validation with @Valid
7. **Exception Handling**: @RestControllerAdvice for global handling
8. **Content Negotiation**: Supporting multiple formats (JSON, XML)
9. **HATEOAS**: Hypermedia links for API discoverability
10. **Best Practices**: DTOs, versioning, pagination, documentation

### Learning Path

```
01. RestController Basics → Understand @RestController, REST principles
02. HTTP Methods → Master GET, POST, PUT, PATCH, DELETE
03. Request Mapping → Learn URL mapping and patterns
04. Path Variables & Query Parameters → Handle URL parameters
05. Request Body & Response Entity → Manage request/response data
06. HTTP Status Codes → Use appropriate status codes
07. Content Negotiation → Support multiple formats
08. HATEOAS → Implement hypermedia links
```

---

**Next:** Spring Data JPA → Learn database integration with Spring Boot

