---
title: API Security
---

# API Security

API security is the set of practices, patterns, and controls that protect APIs — the primary interface through which modern applications communicate — from unauthorized access, data exposure, injection attacks, and abuse. As organizations shift to microservices and mobile-first architectures, APIs have become the dominant attack surface. The OWASP API Security Top 10 documents the most critical API vulnerabilities observed in the wild; virtually every major data breach in the past decade exploited one or more of these vulnerabilities.

> **Why this matters in interviews:** When you design any backend system, the interviewer expects you to think about security proactively — not just at the end as an afterthought. Knowing the OWASP API Top 10, input validation, CORS, CSRF, injection prevention, and authentication mechanisms is baseline for any senior backend engineer. Being able to spot and articulate common vulnerabilities shows security maturity.

---

## OWASP API Security Top 10

The OWASP API Security Top 10 (2023 edition) identifies the most critical API vulnerabilities:

| Rank | Vulnerability | Brief Description |
|---|---|---|
| **API1** | Broken Object Level Authorization (BOLA/IDOR) | User can access another user's data by changing resource ID |
| **API2** | Broken Authentication | Weak authentication tokens, missing expiry, no rate limiting on login |
| **API3** | Broken Object Property Level Authorization | User can read/write fields they should not have access to |
| **API4** | Unrestricted Resource Consumption | No rate limits — API can be abused to exhaust server resources |
| **API5** | Broken Function Level Authorization | User can call admin-only endpoints |
| **API6** | Unrestricted Access to Sensitive Business Flows | Bots can scrape prices, exhaust inventory, or automate fraud |
| **API7** | Server-Side Request Forgery (SSRF) | API fetches attacker-controlled URLs — can access internal services |
| **API8** | Security Misconfiguration | Default credentials, verbose errors, open debug endpoints |
| **API9** | Improper Inventory Management | Forgotten, undocumented API versions with weaker security |
| **API10** | Unsafe Consumption of APIs | Trusting data from third-party APIs without validation |

---

## API1: BOLA / IDOR — The Most Common API Flaw

Broken Object Level Authorization (BOLA), also called Insecure Direct Object Reference (IDOR), is when an API allows access to any resource by ID without verifying the requester owns it:

```python
# VULNERABLE: No ownership check
@app.get("/api/invoices/{invoice_id}")
def get_invoice(invoice_id: int):
    return db.query("SELECT * FROM invoices WHERE id = ?", invoice_id)
    # Anyone can access invoice 1, 2, 3, 4... by iterating IDs

# SECURE: Always scope to authenticated user
@app.get("/api/invoices/{invoice_id}")
def get_invoice(invoice_id: int, user: User = Depends(get_current_user)):
    invoice = db.query(
        "SELECT * FROM invoices WHERE id = ? AND owner_id = ?",
        invoice_id, user.id  # Scope to the authenticated user
    )
    if not invoice:
        raise HTTPException(status_code=404)  # 404, not 403 — don't leak existence
    return invoice
```

**Rule:** Never trust the client to tell you which user they are. Always derive the user ID from the authenticated session or JWT. Always add `AND owner_id = current_user.id` to every data access query.

---

## Input Validation and Injection Prevention

The root cause of injection attacks (SQL, NoSQL, command injection, XSS) is treating untrusted user input as code or trusted data without validation.

### SQL Injection

```python
# VULNERABLE: String concatenation with user input
def get_user(username: str):
    query = f"SELECT * FROM users WHERE username = '{username}'"
    return db.execute(query)
    # Input: ' OR '1'='1 → returns all users
    # Input: '; DROP TABLE users; -- → destroys the table

# SECURE: Always use parameterized queries / prepared statements
def get_user(username: str):
    return db.execute(
        "SELECT * FROM users WHERE username = ?",
        (username,)  # Database driver handles escaping
    )
```

**ORM safety:** ORMs like SQLAlchemy, Django ORM, and Hibernate use parameterized queries by default. But raw SQL bypasses this protection — always use the ORM's parameter binding even in raw queries.

### Pydantic for Input Validation (Python)

```python
from pydantic import BaseModel, Field, EmailStr
from typing import Annotated

class CreateOrderRequest(BaseModel):
    product_id: int = Field(gt=0, description="Product ID, must be positive")
    quantity: Annotated[int, Field(ge=1, le=100)]  # 1-100 items
    shipping_address: str = Field(min_length=10, max_length=500)
    email: EmailStr  # Validated email format
    
    # Only allow expected fields — Pydantic ignores extra fields by default
    # model_config = ConfigDict(extra='forbid')  # To explicitly reject extra fields

@app.post("/api/orders")
def create_order(request: CreateOrderRequest, user: User = Depends(auth)):
    # request is guaranteed to have valid data by the time we get here
    ...
```

**Validation principles:**
- **Allowlist, not denylist** — define what is valid, reject everything else
- **Type checking** — ensure integers are integers, emails are valid email format, URLs are valid URLs
- **Length limits** — every string field needs a maximum length to prevent buffer overflows and storage abuse
- **Range validation** — `quantity` should be 1-100, not `-999999` or `9999999`
- **Content validation** — file uploads should have allowed MIME types and file extensions validated by content, not just filename

---

## Authentication Patterns for APIs

### API Key Authentication

```mermaid
graph LR
    Client["API Client"] -->|"Header: X-API-Key: sk_live_abc123"| Gateway["API Gateway"]
    Gateway --> Validate["Validate key:\n1. Hash the received key\n2. Look up hash in DB\n3. Check permissions + rate limit"]
    Validate -->|"Valid"| Backend["Backend Service"]
    Validate -->|"Invalid"| Return["401 Unauthorized"]
```

**API key security practices:**
- Store only the **hash** of the API key in the database (bcrypt or SHA-256 with salt) — if the DB is breached, keys cannot be used
- Use a prefix for easy identification: `sk_live_` (Stripe-style) — makes grep/secrets scanning easy
- Issue keys per-client, per-scope — `read:orders` API key cannot call `delete:orders`
- Rotate keys regularly; provide a mechanism for clients to rotate without downtime
- Never log API keys in application or access logs

### Bearer Token (JWT) Authentication

```http
GET /api/orders HTTP/1.1
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

See the JWT Tokens article for full validation details. For APIs: always validate `exp`, `iss`, `aud`, and `scope` claims.

---

## CORS — Cross-Origin Resource Sharing

Browsers enforce the **Same-Origin Policy**: JavaScript on `https://app.com` cannot make XHR/fetch requests to `https://api.other.com` by default. CORS is the mechanism that allows servers to explicitly opt-in to cross-origin requests.

```mermaid
sequenceDiagram
    participant Browser
    participant API as api.example.com

    Note over Browser: JavaScript on app.example.com\ntries to fetch api.example.com

    Browser->>API: OPTIONS /api/data\nOrigin: https://app.example.com\nAccess-Control-Request-Method: GET
    
    Note over API: Pre-flight check — API declares\nwhat origins and methods it allows
    
    API-->>Browser: Access-Control-Allow-Origin: https://app.example.com\nAccess-Control-Allow-Methods: GET, POST\nAccess-Control-Allow-Headers: Authorization, Content-Type

    Browser->>API: GET /api/data\nOrigin: https://app.example.com\nAuthorization: Bearer ...
    API-->>Browser: Response data\nAccess-Control-Allow-Origin: https://app.example.com
```

**CORS misconfigurations that create vulnerabilities:**

```python
# VULNERABLE: Wildcard origin with credentials
response.headers["Access-Control-Allow-Origin"] = "*"
response.headers["Access-Control-Allow-Credentials"] = "true"
# Browsers reject this combination — but some poorly configured servers reflect arbitrary origins

# VULNERABLE: Reflecting any Origin header without validation
origin = request.headers.get("Origin")
response.headers["Access-Control-Allow-Origin"] = origin  # Any site can make credentialed requests

# SECURE: Explicit allowlist
ALLOWED_ORIGINS = {"https://app.example.com", "https://staging.example.com"}

def cors_middleware(request, response):
    origin = request.headers.get("Origin")
    if origin in ALLOWED_ORIGINS:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
    # If origin not in allowlist, no CORS headers — browser blocks the request
```

**CORS does not protect your API from non-browser clients** (curl, Postman, server-to-server calls). CORS only constrains what browsers will do. Real API security requires authentication and authorization, not just CORS.

---

## CSRF — Cross-Site Request Forgery

CSRF tricks a victim's browser into making authenticated requests to your site without the victim's knowledge:

```mermaid
sequenceDiagram
    participant Victim
    participant EvilSite as Evil Site\nevil.com
    participant Bank as bank.com API

    Note over Victim: Victim is logged into bank.com\n(has valid session cookie)
    
    Victim->>EvilSite: Visits evil.com
    EvilSite->>Victim: Returns page with hidden form:\n<form action="https://bank.com/transfer"\nmethod="POST">\n<input name="to" value="attacker-account">\n<input name="amount" value="10000">\n</form>\n<script>document.forms[0].submit()</script>
    
    Note over Victim: Browser automatically submits form\nto bank.com, including session cookie
    Victim->>Bank: POST /transfer\nCookie: session=abc (auto-sent)\nbody: to=attacker-account&amount=10000
    Bank->>Bank: Sees valid session cookie\nExecutes the transfer!
```

**CSRF mitigations:**

**1. SameSite cookie attribute (primary defense):**
```http
Set-Cookie: session=abc123; SameSite=Strict; Secure; HttpOnly
```
`SameSite=Strict`: Cookie is never sent on cross-site requests — the evil form submission does not include the session cookie.  
`SameSite=Lax`: Cookie sent for top-level navigation (clicking a link) but not for cross-site POST/XHR.

**2. CSRF tokens (for APIs that cannot use SameSite cookies):**
```python
# On form load: server generates a random token tied to the session
csrf_token = secrets.token_urlsafe(32)
session["csrf_token"] = csrf_token

# On form submission: server verifies token matches session
def transfer(request):
    submitted_token = request.form.get("csrf_token")
    expected_token = session.get("csrf_token")
    if not secrets.compare_digest(submitted_token, expected_token):
        raise HTTPException(status_code=403, detail="CSRF token mismatch")
    # Process transfer
```

**3. Custom request headers (for AJAX APIs):**
CORS blocks cross-origin requests with custom headers by default. Requiring `X-Requested-With: XMLHttpRequest` or a custom API header on all API calls provides CSRF protection because cross-site forms cannot set custom headers.

---

## SSRF — Server-Side Request Forgery

SSRF occurs when an API fetches a URL provided by the user — the attacker provides an internal URL to access private resources:

```python
# VULNERABLE: User controls the URL the server fetches
@app.post("/api/fetch-preview")
def fetch_url(url: str):
    response = requests.get(url)  # What if url = "http://169.254.169.254/latest/meta-data/"?
    return response.text
    # Attacker can access AWS EC2 metadata service — contains IAM credentials!
    # Or http://localhost:6379 (Redis), http://10.0.0.1:8080 (internal admin)
```

```python
# SECURE: Strict allowlist + DNS rebinding protection
import ipaddress
from urllib.parse import urlparse

ALLOWED_DOMAINS = {"trusted-partner.com", "cdn.example.com"}

def is_safe_url(url: str) -> bool:
    parsed = urlparse(url)
    if parsed.scheme not in ("http", "https"):
        return False
    hostname = parsed.hostname
    if hostname not in ALLOWED_DOMAINS:
        return False
    # Also resolve DNS and check the resolved IP is not private
    # (DNS rebinding: attacker's DNS resolves to 127.0.0.1 after allowlist check)
    resolved_ips = socket.getaddrinfo(hostname, None)
    for _, _, _, _, sockaddr in resolved_ips:
        ip = ipaddress.ip_address(sockaddr[0])
        if ip.is_private or ip.is_loopback or ip.is_link_local:
            return False
    return True
```

AWS IMDSv2 mitigates one major SSRF target by requiring a PUT request (with a session token) before GET — cross-site form submissions and simple SSRF cannot complete the two-step flow.

---

## Security Headers

Every API response should include security headers:

```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'; script-src 'self'
Permissions-Policy: geolocation=(), microphone=()
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

| Header | Protects Against |
|---|---|
| `X-Content-Type-Options: nosniff` | MIME type sniffing — browser obeys declared Content-Type |
| `X-Frame-Options: DENY` | Clickjacking — site cannot be embedded in an iframe |
| `Content-Security-Policy` | XSS — restricts sources of scripts, styles, images |
| `Referrer-Policy` | Information leakage via Referer header |
| `HSTS` | SSL stripping, downgrade attacks |

---

## Rate Limiting and Resource Consumption

```mermaid
graph TD
    Req["API Request"]
    
    Global["Global rate limit\nTotal: 10,000 req/sec\nProtect infrastructure"]
    
    PerIP["Per-IP rate limit\n100 req/min\nStop individual abuse"]
    
    PerUser["Per-user / API key\n1,000 req/min authenticated\nFair usage policy"]
    
    PerEndpoint["Per-endpoint limits\n/auth/login: 10 req/min\n/api/search: 500 req/min\n/api/export: 5 req/min"]
    
    Response["429 Too Many Requests\nRetry-After: 60\nX-RateLimit-Limit: 100\nX-RateLimit-Remaining: 0\nX-RateLimit-Reset: 1716999999"]
    
    Req --> Global
    Req --> PerIP
    Req --> PerUser
    Req --> PerEndpoint
    Global -->|"Exceeded"| Response
    PerIP -->|"Exceeded"| Response
```

**Rate limit response headers** should tell clients when they can retry — this enables legitimate clients to self-throttle instead of hammering your API with requests that will be rejected.

---

## Secret Management — Never Hardcode Credentials

```python
# NEVER: Hardcoded credentials in code (committed to git — cannot be un-committed)
DATABASE_URL = "postgresql://admin:super_secret_password@prod-db.internal:5432/mydb"
API_KEY = "sk_live_abc123secretkey"

# NEVER: Credentials in config files checked into version control
# config.py: DB_PASSWORD = "mypassword"

# CORRECT: Load from environment or secrets manager at runtime
import os
from boto3 import client as boto_client

def get_database_url():
    # AWS Secrets Manager
    secrets = boto_client("secretsmanager").get_secret_value(
        SecretId="prod/myapp/database"
    )
    secret = json.loads(secrets["SecretString"])
    return f"postgresql://{secret['username']}:{secret['password']}@{secret['host']}/mydb"

# Or via environment variables injected by the deployment system:
DATABASE_URL = os.environ["DATABASE_URL"]  # Set by Kubernetes secret or ECS task definition
```

**Secret scanning:** Tools like `git-secrets`, `truffleHog`, and GitHub's secret scanning automatically scan commits for accidentally checked-in credentials. Add `pre-commit` hooks to catch secrets before they reach the repository.

---

## Verbose Error Responses

Never expose internal implementation details in error responses:

```json
// VULNERABLE: Leaks stack traces, SQL queries, internal paths
{
  "error": "java.sql.SQLException: SELECT * FROM users WHERE username='admin'--' failed at com.company.UserDao:47",
  "stack": "at org.springframework.jdbc.core.JdbcTemplate.queryForObject(JdbcTemplate.java:493)..."
}

// SECURE: Generic error messages to the client; full details in server logs
{
  "error": "An unexpected error occurred. Please try again.",
  "error_code": "INTERNAL_ERROR",
  "request_id": "req_abc123"  // Use request_id to correlate with server logs
}
```

The `request_id` is key: the client gets a reference they can provide to support, while the full details are only visible in internal logs. Never expose: SQL queries, stack traces, internal IP addresses, server software versions, or file system paths.

---

## Interview Talking Points

**1. What are the most critical API security vulnerabilities and how do you prevent them?**
> "The most critical and most common API vulnerability is BOLA — Broken Object Level Authorization, also called IDOR. The pattern: an API returns any resource by ID without checking if the requesting user owns it. You fix it by always scoping database queries to the authenticated user: `WHERE id = ? AND owner_id = current_user.id`. Never trust a user ID in the request body. The second most impactful is injection: SQL injection from concatenating user input into queries — always use parameterized queries, never string concatenation. Third is authentication failures: missing rate limiting on login endpoints allows credential stuffing; weak API keys with no expiry allow indefinite misuse; missing JWT claim validation accepts forged tokens. My baseline for any new API: strict input validation with an allowlist schema (Pydantic, Zod, Bean Validation), parameterized queries only, ownership checks on every resource access, and authentication with scope-limited short-lived tokens."

**2. Explain CSRF and how modern applications prevent it.**
> "CSRF exploits the fact that browsers automatically include cookies with cross-origin requests. An attacker creates a malicious page with a form that submits to your bank's transfer endpoint. When the victim visits the page, the browser submits the form and auto-includes the victim's session cookie — the bank sees a valid session and executes the transfer. Modern applications primarily prevent CSRF using the SameSite cookie attribute: `SameSite=Strict` means the browser will never send the cookie on cross-origin requests, period — the attacker's cross-site form submission arrives without the session cookie, so the server rejects it as unauthenticated. For APIs that cannot use SameSite cookies, CSRF tokens work: the server issues a random token per session, embeds it in forms, and verifies it on state-changing requests. An attacker cannot read the CSRF token from another origin due to the Same-Origin Policy. For AJAX APIs, requiring a custom header (like `X-Requested-With`) works because CORS blocks cross-origin requests with non-standard headers by default."

**3. What is SSRF and what are the risks in cloud environments specifically?**
> "SSRF — Server-Side Request Forgery — is when an attacker can make the server issue HTTP requests to URLs the attacker specifies. Classic example: a 'preview this URL' feature. The attacker provides `http://169.254.169.254/latest/meta-data/iam/security-credentials/role-name` — the AWS Instance Metadata Service endpoint. The server fetches it and returns temporary IAM credentials with whatever permissions the EC2 role has. The attacker now has AWS credentials. This is exactly how the 2019 Capital One breach occurred — an SSRF vulnerability in a WAF configuration allowed an attacker to access the metadata service and retrieve IAM credentials, then download 100 million customer records from S3. Prevention requires: strict URL allowlisting (only specific trusted domains), blocking requests to private IP ranges (10.x.x.x, 172.16.x.x, 192.168.x.x, 127.x.x.x), resolving DNS and checking the resolved IP after allowlist validation (DNS rebinding defense), and deploying IMDSv2 on EC2 (requires a session token that SSRF cannot obtain)."

**4. How do you design a secure API key system?**
> "Stripe's API key design is the gold standard. Key design decisions: First, format — use a prefix like `sk_live_` followed by 32 random bytes. The prefix enables secrets scanning tools to automatically detect leaked keys in code, logs, and GitHub. Second, storage — never store the raw key, only a hash. On creation, show the full key once to the user (they must save it), then store a bcrypt or SHA-256 hash. If your database is breached, hashed keys cannot be used. Third, scope keys — each key should have explicit permissions (`read:orders`, `write:invoices`) rather than full access. If a key is compromised, the blast radius is limited to those specific permissions. Fourth, rotation support — your API must accept two valid keys simultaneously during a rotation window, so clients can switch without downtime. Fifth, monitoring — log every API key usage with the request metadata, alert on anomalous patterns (unusual volume, new geographic origin, unusual endpoint access patterns). Rate limit per key, not just per IP, so a compromised key cannot be abused at unlimited rate."

---

## Key Takeaways

- **BOLA/IDOR (#1 OWASP API):** Always scope queries to `AND owner_id = current_user.id` — never trust client-provided user IDs
- **SQL injection:** Always use parameterized queries — never concatenate user input into SQL strings
- **Input validation:** Allowlist — validate type, format, length, and range of all inputs at API boundaries
- **CORS:** Validate `Origin` against an explicit allowlist — never reflect arbitrary origins or combine wildcard with credentials
- **CSRF:** Use `SameSite=Strict` cookies; CSRF tokens for cookie-based APIs; custom headers for AJAX APIs
- **SSRF:** Allowlist specific trusted domains + block private IP ranges + use IMDSv2 on EC2
- **API keys:** Store only the hash; use descriptive prefixes for secrets scanning; scope to minimum permissions
- **Security headers:** `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`, `HSTS` are baseline
- **Rate limiting:** Per-IP + per-user + per-endpoint + global limits; return `Retry-After` header on 429s
- **Never expose internals** in error responses — log full details server-side, return only `request_id` to clients
