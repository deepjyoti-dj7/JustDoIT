---
title: Web Layer
description: The @RestController, all request binding annotations, validation, global exception handling with Problem Details, filters vs interceptors, async controllers, multipart uploads, and CORS.
---

# Web Layer

Every HTTP request in Spring MVC flows through `DispatcherServlet`, which routes it to a controller method via `HandlerMapping`, executes filters and interceptors, then serialises the response via `HttpMessageConverter`. Understanding this pipeline lets you inject your logic in exactly the right place.

---

## Request Binding Annotations

```java
@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    // Path variable — /api/v1/orders/123
    @GetMapping("/{id}")
    public OrderResponse get(@PathVariable UUID id) {
        return OrderResponse.from(orderService.findById(id).orElseThrow());
    }

    // Query parameters — /api/v1/orders?page=0&size=20&sort=createdAt,desc
    @GetMapping
    public Page<OrderResponse> list(
        @RequestParam(defaultValue = "0")  int page,
        @RequestParam(defaultValue = "20") int size,
        @RequestParam(required = false)    OrderStatus status) {
        return orderService.findAll(page, size, status);
    }

    // Request body — JSON to Java object (Jackson deserialises)
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse create(@RequestBody @Valid CreateOrderRequest req) {
        return OrderResponse.from(orderService.create(req));
    }

    // Request header
    @GetMapping("/me")
    public OrderResponse getForCurrentUser(
        @RequestHeader("X-User-Id") UUID userId,
        @RequestHeader(value = "X-Correlation-Id", required = false) String correlId) {
        return OrderResponse.from(orderService.findForUser(userId));
    }

    // Cookie value
    @GetMapping("/cart")
    public CartResponse getCart(@CookieValue("session") String sessionId) {
        return cartService.getCart(sessionId);
    }

    // Multiple path variables
    @GetMapping("/{orderId}/items/{itemId}")
    public OrderItemResponse getItem(
        @PathVariable UUID orderId,
        @PathVariable UUID itemId) {
        return orderService.getItem(orderId, itemId);
    }
}
```

### `ResponseEntity` — full control over the response

```java
@PostMapping
public ResponseEntity<OrderResponse> create(@RequestBody @Valid CreateOrderRequest req) {
    Order order = orderService.create(req);
    return ResponseEntity
        .created(URI.create("/api/v1/orders/" + order.getId()))
        .header("X-Order-Id", order.getId().toString())
        .body(OrderResponse.from(order));
}

// Conditional responses
@GetMapping("/{id}")
public ResponseEntity<OrderResponse> get(@PathVariable UUID id) {
    return orderService.findById(id)
        .map(OrderResponse::from)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
}
```

---

## Request Validation

```java
// DTO with Bean Validation constraints
public record CreateOrderRequest(
    @NotBlank(message = "customerId is required")
    String customerId,

    @NotEmpty @Size(min = 1, max = 50)
    List<@Valid OrderItemRequest> items,

    @Email String notificationEmail,

    @DecimalMin("0.00") @Digits(integer = 8, fraction = 2)
    BigDecimal discount,

    @FutureOrPresent LocalDate deliveryDate
) {}

// @Valid triggers validation on the parameter; @Validated is for group validation
@PostMapping
public OrderResponse create(@RequestBody @Valid CreateOrderRequest req) {
    return OrderResponse.from(orderService.create(req));
}

// Validate query parameters (must annotate the controller class with @Validated)
@RestController @Validated
public class OrderController {
    @GetMapping
    public Page<OrderResponse> list(
        @RequestParam @Min(0)  int page,
        @RequestParam @Max(100) int size) {
        return orderService.findAll(page, size);
    }
}
```

### Custom constraint validator

```java
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ValidSkuValidator.class)
public @interface ValidSku {
    String message() default "Invalid SKU format";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

public class ValidSkuValidator implements ConstraintValidator<ValidSku, String> {
    private static final Pattern SKU_PATTERN = Pattern.compile("^[A-Z]{2}-\\d{6}$");

    @Override
    public boolean isValid(String value, ConstraintValidatorContext ctx) {
        return value == null || SKU_PATTERN.matcher(value).matches();
    }
}
```

---

## Global Exception Handling

### `@RestControllerAdvice` + Problem Details (RFC 7807, Spring 6+)

```java
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    // Handle domain exceptions
    @ExceptionHandler(ResourceNotFoundException.class)
    public ProblemDetail handleNotFound(ResourceNotFoundException ex, HttpServletRequest req) {
        ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.NOT_FOUND);
        pd.setTitle("Resource Not Found");
        pd.setDetail(ex.getMessage());
        pd.setType(URI.create("/errors/not-found"));
        pd.setProperty("resourceId", ex.getResourceId());
        return pd;
    }

    // Override default Spring validation error handling
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            HttpHeaders headers, HttpStatusCode status, WebRequest request) {

        ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
        pd.setTitle("Validation Failed");
        pd.setProperty("errors",
            ex.getBindingResult().getFieldErrors().stream()
              .map(e -> Map.of("field", e.getField(), "message", e.getDefaultMessage()))
              .toList());
        return ResponseEntity.badRequest().body(pd);
    }

    // Catch-all
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ProblemDetail handleGeneric(Exception ex) {
        log.error("Unhandled exception", ex);
        ProblemDetail pd = ProblemDetail.forStatus(500);
        pd.setTitle("Internal Server Error");
        pd.setDetail("An unexpected error occurred");
        return pd;
    }
}
```

Enable `ProblemDetail` responses in `application.yml`:
```yaml
spring:
  mvc:
    problemdetails:
      enabled: true
```

---

## Filters vs Interceptors

| | `Filter` (Servlet API) | `HandlerInterceptor` (Spring MVC) |
|---|---|---|
| **Scope** | Before DispatcherServlet | After routing, before/after handler |
| **Access to** | Raw request/response | Handler method + ModelAndView |
| **Spring beans** | Via `FilterRegistrationBean` | Always Spring beans |
| **Use for** | JWT extraction, logging, GZIP | Auth checks, audit log, locale |

```java
// Filter — runs before Spring even touches the request
@Component
public class CorrelationIdFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest req,
                                    HttpServletResponse res,
                                    FilterChain chain) throws ServletException, IOException {
        String id = Optional.ofNullable(req.getHeader("X-Correlation-Id"))
                            .orElse(UUID.randomUUID().toString());
        MDC.put("correlationId", id);
        res.setHeader("X-Correlation-Id", id);
        try {
            chain.doFilter(req, res);
        } finally {
            MDC.clear();
        }
    }
}

// Interceptor — runs after routing
@Component
public class AuditInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest req, HttpServletResponse res, Object handler) {
        if (handler instanceof HandlerMethod hm) {
            log.info("{} {} → {}.{}",
                req.getMethod(), req.getRequestURI(),
                hm.getBeanType().getSimpleName(), hm.getMethod().getName());
        }
        return true;  // false = abort request
    }

    @Override
    public void afterCompletion(HttpServletRequest req, HttpServletResponse res,
                                Object handler, Exception ex) {
        if (ex != null) log.error("Exception during request", ex);
    }
}

@Configuration
public class WebConfig implements WebMvcConfigurer {
    private final AuditInterceptor auditInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(auditInterceptor)
                .addPathPatterns("/api/**")
                .excludePathPatterns("/api/v1/health");
    }
}
```

---

## Async Controller Methods

For long-running operations without blocking a Tomcat thread:

```java
// Callable: runs in a different thread pool
@GetMapping("/reports/{id}")
public Callable<ReportResponse> getReport(@PathVariable UUID id) {
    return () -> reportService.generate(id);  // Spring runs this in task executor
}

// DeferredResult: complete from another thread/event
@GetMapping("/stream/{id}")
public DeferredResult<String> streamResult(@PathVariable UUID id) {
    DeferredResult<String> result = new DeferredResult<>(10_000L, "timeout");
    asyncProcessor.processAsync(id, result::setResult, result::setErrorResult);
    return result;
}

// CompletableFuture: integrates with @Async services
@GetMapping("/enriched/{id}")
public CompletableFuture<EnrichedOrder> getEnriched(@PathVariable UUID id) {
    return orderService.findById(id)
        .thenCompose(order -> enrichmentService.enrich(order));
}
```

---

## File Upload (Multipart)

```java
@PostMapping("/attachments")
public AttachmentResponse upload(
        @RequestParam("file") MultipartFile file,
        @RequestParam String description) {

    if (file.isEmpty()) throw new BadRequestException("File is empty");
    String contentType = file.getContentType();
    if (!ALLOWED_TYPES.contains(contentType)) {
        throw new BadRequestException("Unsupported file type: " + contentType);
    }

    String key = storageService.store(file);
    return new AttachmentResponse(key, file.getOriginalFilename(), file.getSize());
}

// Multipart configuration
// spring.servlet.multipart.max-file-size=10MB
// spring.servlet.multipart.max-request-size=50MB
```

---

## CORS Configuration

```java
// Global CORS (applied before Spring Security — use SecurityFilterChain.cors() when Security is present)
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("https://app.example.com")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .exposedHeaders("X-Correlation-Id", "X-Total-Count")
                .allowCredentials(true)
                .maxAge(3600);
    }
}

// Per-controller with @CrossOrigin
@CrossOrigin(origins = "https://app.example.com", maxAge = 3600)
@RestController
public class OrderController {}
```

> **With Spring Security:** configure CORS through `HttpSecurity.cors()` and a `CorsConfigurationSource` bean. Do NOT configure it in both `WebMvcConfigurer` and `HttpSecurity` — duplicate headers will break browser preflight requests.

---

## Content Negotiation

Spring MVC returns the format the client requests via the `Accept` header:

```java
// Automatically returns JSON or XML based on Accept header
// Add jackson-dataformat-xml to get XML support
@GetMapping(value = "/{id}",
            produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
public OrderResponse get(@PathVariable UUID id) {
    return OrderResponse.from(orderService.findById(id).orElseThrow());
}

// Force a specific content type
@GetMapping(value = "/export", produces = "text/csv")
public ResponseEntity<Resource> exportCsv() {
    Resource csv = csvExporter.export();
    return ResponseEntity.ok()
        .header("Content-Disposition", "attachment; filename=orders.csv")
        .body(csv);
}
```
