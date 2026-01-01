# 🔐 Spring Security - Complete Module

## 📚 Overview

This comprehensive Spring Security module covers all aspects of securing Spring Boot applications, from basic authentication to advanced OAuth2 integration and JWT implementation.

---

## 📖 Module Contents

### [01. Security Fundamentals](01.%20Security%20Fundamentals.md)
- Introduction to Spring Security
- Security principles (CIA triad, defense in depth, least privilege)
- Spring Security architecture and filter chain
- Core interfaces (Authentication, UserDetails, GrantedAuthority)
- Basic authentication and form-based login
- HTTP security (HTTPS, CSRF, security headers)
- SecurityContext usage

### [02. Authentication vs Authorization](02.%20Authentication%20vs%20Authorization.md)
- Key differences (who vs what, 401 vs 403)
- Authentication process and flow
- Authorization levels (URL, method, domain)
- Authentication types (Form, Basic, JWT, OAuth2, Remember-Me)
- Authorization strategies (RBAC, permission-based, ABAC)
- Role vs Authority comparison
- Hierarchical roles

### [03. Security Configuration](03.%20Security%20Configuration.md)
- SecurityFilterChain configuration
- Custom login/logout pages
- Multiple security configurations
- CSRF configuration
- Session management (stateless, concurrent sessions)
- Remember Me functionality
- Custom authentication handlers

### [04. User Details Service](04.%20User%20Details%20Service.md)
- UserDetailsService interface
- Custom UserDetails implementation
- Loading users from database
- Caching user details
- Custom user attributes
- OAuth2 user support

### [05. Password Encoding](05.%20Password%20Encoding.md)
- BCrypt password encoder
- Password strength validation
- Password migration strategies
- DelegatingPasswordEncoder
- Custom password encoders
- Password history implementation

### [06. JWT Authentication](06.%20JWT%20Authentication.md)
- JWT structure (Header, Payload, Signature)
- JWT utility class implementation
- JWT authentication filter
- Token generation and validation
- Refresh token implementation
- Security configuration for stateless APIs

### [07. OAuth2 & Social Login](07.%20OAuth2%20&%20Social%20Login.md)
- OAuth2 authorization flow
- Google login integration
- GitHub login integration
- Facebook login integration
- Custom OAuth2 user service
- Multiple provider configuration

### [08. Method Security](08.%20Method%20Security.md)
- @PreAuthorize for complex authorization
- @PostAuthorize for result validation
- @Secured for simple role checks
- @RolesAllowed (JSR-250)
- @PreFilter and @PostFilter
- Custom security expressions

### [09. CORS Configuration](09.%20CORS%20Configuration.md)
- CORS basics and Same-Origin Policy
- Global CORS configuration
- Controller-level CORS
- CORS with Spring Security
- Preflight request handling
- Common CORS issues and solutions

---

## 🚀 Quick Start Guide

### 1. Basic Security Setup

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/login", "/register").permitAll()
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .defaultSuccessUrl("/home")
                .permitAll()
            )
            .logout(logout -> logout
                .logoutSuccessUrl("/")
                .permitAll()
            );
        
        return http.build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

### 2. Database User Authentication

```java
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String email;
    private String password;
    
    @ManyToMany(fetch = FetchType.EAGER)
    private Set<Role> roles;
}

@Service
public class CustomUserDetailsService implements UserDetailsService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public UserDetails loadUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        return org.springframework.security.core.userdetails.User.builder()
            .username(user.getUsername())
            .password(user.getPassword())
            .authorities(getAuthorities(user))
            .build();
    }
    
    private Collection<? extends GrantedAuthority> getAuthorities(User user) {
        return user.getRoles().stream()
            .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName()))
            .collect(Collectors.toList());
    }
}
```

### 3. JWT Authentication Setup

```xml
<!-- Add JWT dependency -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.3</version>
</dependency>
```

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Autowired
    private JwtAuthenticationFilter jwtAuthFilter;
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
```

### 4. OAuth2 Social Login

```yaml
# application.yml
spring:
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: YOUR_CLIENT_ID
            client-secret: YOUR_CLIENT_SECRET
            scope:
              - openid
              - profile
              - email
```

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .oauth2Login(oauth2 -> oauth2
                .loginPage("/login")
                .defaultSuccessUrl("/home")
            );
        
        return http.build();
    }
}
```

---

## 🎯 Common Security Patterns

### 1. Role-Based Access Control (RBAC)

```java
// URL-level
http.authorizeHttpRequests(auth -> auth
    .requestMatchers("/api/admin/**").hasRole("ADMIN")
    .requestMatchers("/api/user/**").hasRole("USER")
    .anyRequest().authenticated()
);

// Method-level
@PreAuthorize("hasRole('ADMIN')")
public void deleteUser(Long id) { }

@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
public void approveRequest(Long id) { }
```

### 2. Ownership-Based Access

```java
@PreAuthorize("#userId == authentication.principal.id or hasRole('ADMIN')")
public void updateUser(Long userId, UserDTO dto) {
    // User can update their own profile, or admin can update anyone
}

@PreAuthorize("@postSecurity.isAuthor(#postId, authentication)")
public void deletePost(Long postId) {
    // Only post author can delete
}
```

### 3. API Security with JWT

```java
// 1. Login endpoint (public)
@PostMapping("/api/auth/login")
public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
    // Authenticate user
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
    );
    
    // Generate JWT
    String token = jwtService.generateToken(user);
    return ResponseEntity.ok(new AuthResponse(token));
}

// 2. Protected endpoint
@GetMapping("/api/users/profile")
@PreAuthorize("isAuthenticated()")
public User getProfile(@AuthenticationPrincipal UserDetails userDetails) {
    return userService.findByEmail(userDetails.getUsername());
}
```

### 4. CORS Configuration

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

---

## 🔑 Key Concepts Summary

### Authentication Flow

```
1. User submits credentials
   ↓
2. AuthenticationManager processes
   ↓
3. UserDetailsService loads user from database
   ↓
4. PasswordEncoder verifies password
   ↓
5. Authentication object created
   ↓
6. SecurityContext stores authentication
   ↓
7. User authenticated
```

### JWT Flow

```
1. User login with credentials
   ↓
2. Server validates and generates JWT
   ↓
3. Client stores JWT (localStorage/sessionStorage)
   ↓
4. Client sends JWT in Authorization header
   ↓
5. JwtAuthenticationFilter validates token
   ↓
6. SecurityContext updated
   ↓
7. Request proceeds
```

### OAuth2 Flow

```
1. User clicks "Login with Google"
   ↓
2. Redirect to Google login
   ↓
3. User authenticates with Google
   ↓
4. Google redirects back with authorization code
   ↓
5. Spring exchanges code for access token
   ↓
6. Spring fetches user info from Google
   ↓
7. User logged in
```

---

## 📊 Security Comparison Tables

### Authentication Methods

| Method | Use Case | Stateful | Scalability | Mobile Support |
|--------|----------|----------|-------------|----------------|
| Form-Based | Traditional web apps | Yes | Limited | Poor |
| HTTP Basic | Simple APIs | No | Good | Good |
| JWT | Modern APIs | No | Excellent | Excellent |
| OAuth2 | Social login | No | Excellent | Excellent |

### Authorization Annotations

| Annotation | Spring | SpEL | Complexity | Use Case |
|------------|--------|------|------------|----------|
| @Secured | ✅ | ❌ | Simple | Basic role checks |
| @RolesAllowed | JSR-250 | ❌ | Simple | Standard role checks |
| @PreAuthorize | ✅ | ✅ | Complex | Advanced authorization |
| @PostAuthorize | ✅ | ✅ | Complex | Result validation |

### Password Encoders

| Encoder | Strength | Speed | Recommended |
|---------|----------|-------|-------------|
| BCrypt | High | Slow | ✅ Yes |
| Argon2 | Very High | Slowest | ✅ Yes (2023+) |
| PBKDF2 | Medium | Medium | ⚠️ Legacy |
| SCrypt | High | Slow | ⚠️ Memory intensive |
| SHA-256 | Low | Fast | ❌ Deprecated |
| Plain Text | None | Fast | ❌ Never use |

---

## 🛡️ Security Best Practices

### 1. Always Use HTTPS in Production

```properties
server.ssl.enabled=true
server.ssl.key-store=classpath:keystore.p12
server.ssl.key-store-password=password
server.ssl.key-store-type=PKCS12
```

### 2. Never Store Plain Text Passwords

```java
// ❌ Bad
user.setPassword("password123");

// ✅ Good
user.setPassword(passwordEncoder.encode("password123"));
```

### 3. Implement Strong Password Policies

```java
@ValidPassword // Custom annotation
private String password;

// Validation: min 8 chars, uppercase, lowercase, digit, special char
```

### 4. Use BCrypt with Appropriate Strength

```java
// ✅ Good - Production
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(10); // Default
}

// ✅ Better - High security
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(12);
}
```

### 5. Implement Session Timeout

```properties
server.servlet.session.timeout=30m
```

### 6. Enable CSRF Protection (for form-based)

```java
// ✅ Good - CSRF enabled (default)
http.csrf(Customizer.withDefaults());

// ⚠️ Only disable for stateless JWT APIs
http.csrf(csrf -> csrf.disable());
```

### 7. Use Method Security for Fine-Grained Control

```java
@PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.id")
public void updateProfile(Long userId, ProfileDTO dto) { }
```

### 8. Implement Rate Limiting

```java
@Component
public class LoginAttemptService {
    private final Map<String, Integer> attemptsCache = new ConcurrentHashMap<>();
    
    public void loginFailed(String username) {
        attemptsCache.merge(username, 1, Integer::sum);
    }
    
    public boolean isBlocked(String username) {
        return attemptsCache.getOrDefault(username, 0) >= 5;
    }
}
```

### 9. Log Security Events

```java
log.info("User {} logged in successfully", username);
log.warn("Failed login attempt for user {}", username);
log.error("Security exception: {}", exception.getMessage());
```

### 10. Use Environment Variables for Secrets

```yaml
# ✅ Good
jwt:
  secret: ${JWT_SECRET}

spring:
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: ${GOOGLE_CLIENT_ID}
            client-secret: ${GOOGLE_CLIENT_SECRET}
```

---

## 🎤 Top 50 Interview Questions

### Basic Concepts (1-10)

1. **What is Spring Security?**
   - Framework for authentication and authorization in Spring applications

2. **Difference between authentication and authorization?**
   - Authentication: Who you are (401 Unauthorized)
   - Authorization: What you can do (403 Forbidden)

3. **What is SecurityContext?**
   - Stores authentication and security information for current thread

4. **What is UserDetailsService?**
   - Interface for loading user-specific data during authentication

5. **What is PasswordEncoder?**
   - Interface for encoding passwords (BCrypt, Argon2)

6. **What is @EnableWebSecurity?**
   - Annotation to enable Spring Security configuration

7. **What is SecurityFilterChain?**
   - Bean defining security configuration (replaces WebSecurityConfigurerAdapter)

8. **What is GrantedAuthority?**
   - Represents permission/role granted to user

9. **Difference between hasRole() and hasAuthority()?**
   - hasRole() adds ROLE_ prefix, hasAuthority() uses exact string

10. **What is CSRF?**
    - Cross-Site Request Forgery - attack forcing users to execute unwanted actions

### Configuration (11-20)

11. **How to disable CSRF?**
    ```java
    http.csrf(csrf -> csrf.disable());
    ```

12. **What is SessionCreationPolicy?**
    - ALWAYS, NEVER, IF_REQUIRED, STATELESS

13. **How to configure form login?**
    ```java
    http.formLogin(form -> form.loginPage("/login"));
    ```

14. **What is Remember Me?**
    - Persistent authentication across sessions using cookies

15. **How to enable method security?**
    ```java
    @EnableMethodSecurity(prePostEnabled = true)
    ```

16. **What is @PreAuthorize?**
    - Annotation for authorization before method execution

17. **What is @PostAuthorize?**
    - Annotation for authorization after method execution

18. **Difference between @Secured and @PreAuthorize?**
    - @Secured: Simple roles only
    - @PreAuthorize: Supports SpEL expressions

19. **What is @PreFilter?**
    - Filters input collection before method execution

20. **What is @PostFilter?**
    - Filters output collection after method execution

### JWT & OAuth2 (21-30)

21. **What is JWT?**
    - JSON Web Token - compact, URL-safe token for secure information transmission

22. **JWT structure?**
    - Header.Payload.Signature (Base64 encoded)

23. **What are JWT claims?**
    - Statements about entity (iss, sub, exp, iat, custom claims)

24. **How to verify JWT?**
    - Extract signature, recompute using header+payload+secret, compare

25. **What is refresh token?**
    - Long-lived token to obtain new access token

26. **What is OAuth2?**
    - Authorization framework for third-party access

27. **OAuth2 vs OpenID Connect?**
    - OAuth2: Authorization
    - OpenID Connect: Authentication + Authorization

28. **What is authorization code flow?**
    - User logs in → code → app exchanges code for token → access resources

29. **How to implement Google login?**
    - Add oauth2-client dependency, configure client-id/secret, enable oauth2Login

30. **What is OAuth2User?**
    - Interface representing authenticated OAuth2 user

### Advanced (31-40)

31. **How to customize login success?**
    ```java
    .successHandler(authenticationSuccessHandler())
    ```

32. **What is BCrypt?**
    - Adaptive hash function with built-in salt

33. **BCrypt strength?**
    - 4-31 rounds, default 10 (1024 rounds)

34. **What is DelegatingPasswordEncoder?**
    - Supports multiple password encoding algorithms

35. **How to migrate passwords?**
    - During login, verify old format, re-encode with new algorithm

36. **What is CORS?**
    - Cross-Origin Resource Sharing - mechanism allowing/restricting cross-origin requests

37. **How to enable CORS?**
    ```java
    http.cors(Customizer.withDefaults());
    ```

38. **What is preflight request?**
    - OPTIONS request checking if CORS is allowed

39. **Can you use * with credentials?**
    - No, must specify exact origins when allowCredentials is true

40. **What is AuthenticationManager?**
    - Processes authentication requests

### Real-World Scenarios (41-50)

41. **How to secure REST API?**
    - Use JWT, stateless session, HTTPS, CORS, rate limiting

42. **How to implement ownership-based access?**
    ```java
    @PreAuthorize("#userId == authentication.principal.id")
    ```

43. **How to handle concurrent sessions?**
    ```java
    .sessionManagement(session -> session.maximumSessions(1))
    ```

44. **How to implement password history?**
    - Store previous passwords, check new password against history

45. **How to lock user after failed attempts?**
    - Track attempts, set locked flag after threshold

46. **Best password encoder?**
    - BCrypt (10-12 strength) or Argon2

47. **How to test security?**
    ```java
    @WithMockUser(roles = "ADMIN")
    ```

48. **Security for microservices?**
    - JWT, API Gateway, OAuth2, service-to-service auth

49. **How to audit security events?**
    - Implement ApplicationListener, log authentication events

50. **Production security checklist?**
    - HTTPS, BCrypt, CSRF enabled, session timeout, rate limiting, logging, strong secrets

---

## 🔧 Common Security Configurations

### Development Environment

```yaml
spring:
  security:
    user:
      name: admin
      password: admin
  
jwt:
  secret: dev-secret-key-change-in-production
  expiration: 86400000

cors:
  allowed-origins: http://localhost:3000,http://localhost:4200
```

### Production Environment

```yaml
spring:
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: ${GOOGLE_CLIENT_ID}
            client-secret: ${GOOGLE_CLIENT_SECRET}

jwt:
  secret: ${JWT_SECRET}
  expiration: 900000  # 15 minutes

cors:
  allowed-origins: https://myapp.com,https://www.myapp.com

server:
  ssl:
    enabled: true
  servlet:
    session:
      timeout: 30m
```

---

## 📝 Additional Resources

### Official Documentation
- [Spring Security Reference](https://docs.spring.io/spring-security/reference/)
- [Spring Security Guides](https://spring.io/guides#security)
- [JWT.io](https://jwt.io/) - JWT debugger

### Key Dependencies

```xml
<!-- Spring Security -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>

<!-- OAuth2 Client -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-oauth2-client</artifactId>
</dependency>

<!-- JWT -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.3</version>
</dependency>
```

---

## ✅ Security Checklist

- [ ] HTTPS enabled in production
- [ ] Passwords encrypted with BCrypt (strength 10+)
- [ ] CSRF protection enabled (for form-based auth)
- [ ] Session timeout configured (15-30 minutes)
- [ ] Strong password policy enforced
- [ ] JWT secret stored in environment variables
- [ ] CORS properly configured
- [ ] Method security enabled for fine-grained control
- [ ] Rate limiting implemented for login
- [ ] Security events logged
- [ ] OAuth2 credentials secured
- [ ] Database credentials encrypted
- [ ] Error messages don't expose sensitive info
- [ ] Security headers configured (X-Frame-Options, etc.)
- [ ] Input validation implemented
- [ ] SQL injection prevention (use JPA/JDBC Template)
- [ ] XSS protection enabled
- [ ] Concurrent session control configured
- [ ] Remember Me with secure token repository
- [ ] Regular security audits and updates

---

## 🎓 Next Steps

After completing this Spring Security module, you should:

1. **Practice Implementation**
   - Build a complete authentication system
   - Implement JWT authentication
   - Add OAuth2 social login
   - Configure method-level security

2. **Explore Advanced Topics**
   - Multi-factor authentication (MFA)
   - Single Sign-On (SSO)
   - Security testing and penetration testing
   - OAuth2 Resource Server

3. **Real-World Projects**
   - E-commerce platform with role-based access
   - Multi-tenant application
   - Microservices with centralized authentication
   - Mobile app backend with JWT

---

**Module Complete!** 🎉

You now have comprehensive knowledge of Spring Security, from basic authentication to advanced OAuth2 and JWT implementation. Practice these concepts to build secure Spring Boot applications.

**Next Module:** Exception Handling →

