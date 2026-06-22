---
title: Production Patterns
description: Image optimisation, container security, health checks, logging and resource limits, and container registry management for production Docker workloads.
---

# Production Patterns

Running Docker in development is forgiving. Running it in production is not. A container with root access, no resource limits, a bloated image, and secrets baked into layers is a security incident waiting to happen. This page covers the hardening patterns every production container deployment should implement.

---

## Image Optimisation

### Choose the right base image

The base image determines your attack surface and image size. Prefer smaller, purpose-built bases:

| Base | Typical size | When to use |
|---|---|---|
| `ubuntu:22.04` | ~78 MB | When you need a full package manager and general tooling |
| `debian:bookworm-slim` | ~30 MB | Smaller Debian, still has apt |
| `eclipse-temurin:21-jre-jammy` | ~180 MB | Java runtime — slimmer than JDK |
| `gcr.io/distroless/java21` | ~60 MB | Google Distroless — no shell, no package manager, very small |
| `scratch` | 0 bytes | Go static binaries, minimal C apps |

**Distroless images** have no shell, no package manager, and no debugging tools. This dramatically reduces the attack surface — there is nothing for an attacker to execute if they gain container access. The downside: you cannot `docker exec` into them for debugging. Use distroless in production, a regular base in development.

```dockerfile
# Production: distroless final stage
FROM eclipse-temurin:21-jdk-jammy AS build
WORKDIR /build
COPY . .
RUN ./mvnw package -DskipTests

FROM gcr.io/distroless/java21-debian12
WORKDIR /app
COPY --from=build /build/target/app.jar app.jar
EXPOSE 8080
CMD ["app.jar"]
```

### Layer ordering for cache efficiency

Every time a layer changes, all subsequent layers rebuild. Structure your Dockerfile so the least-frequently-changing content comes first:

```dockerfile
# 1. OS-level dependencies (rarely change)
FROM node:20-slim
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# 2. Dependency files (change when you add/remove packages)
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

# 3. Application code (changes every commit)
COPY src ./src
CMD ["node", "src/index.js"]
```

### Reducing layer count

Chain related `RUN` commands with `&&` and clean up in the same layer:

```dockerfile
# BAD: three layers, apt cache persists in layer 2
RUN apt-get update
RUN apt-get install -y curl wget git
RUN rm -rf /var/lib/apt/lists/*

# GOOD: one layer, cache cleaned immediately
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl wget git \
    && rm -rf /var/lib/apt/lists/*
```

---

## Security

### Run as non-root

By default, containers run as root (UID 0). If an attacker escapes the container, they have root on the host (with certain misconfigurations). Always specify a non-root user:

```dockerfile
# Create a dedicated user and group
RUN groupadd --gid 1000 appgroup \
    && useradd --uid 1000 --gid appgroup --no-create-home appuser

# Switch to non-root before the last CMD/ENTRYPOINT
USER 1000
```

Or use numeric UID/GID directly without creating a named user:
```dockerfile
USER 1000:1000
```

### Read-only root filesystem

```bash
# Prevent any writes to the container filesystem
docker run --read-only \
  --tmpfs /tmp:rw,noexec,nosuid,size=64m \
  myapp:latest
```

In Kubernetes:
```yaml
securityContext:
  readOnlyRootFilesystem: true
  allowPrivilegeEscalation: false
  runAsNonRoot: true
  runAsUser: 1000
```

### Never put secrets in image layers

Secrets embedded in `ENV` or `RUN` instructions are visible in `docker history` and anyone with image pull access. The only safe approaches:

```dockerfile
# BAD: secret visible in layer history forever
ENV DB_PASSWORD=hunter2
RUN curl -H "Authorization: Bearer mytoken" https://api.example.com

# GOOD: pass secrets at runtime as environment variables
# docker run -e DB_PASSWORD=$(aws secretsmanager get-secret-value ...) myapp

# GOOD: use Docker BuildKit secrets (not baked into layers)
# RUN --mount=type=secret,id=npm_token npm config set //registry.npmjs.org/:_authToken=$(cat /run/secrets/npm_token)
```

### Image scanning with Trivy

```bash
# Scan a local image for CVEs
trivy image myapp:latest

# Fail CI if HIGH or CRITICAL vulnerabilities found
trivy image --exit-code 1 --severity HIGH,CRITICAL myapp:latest

# Scan a Dockerfile for misconfigurations
trivy config Dockerfile
```

Integrate Trivy into your CI pipeline as a gate before pushing to any registry.

---

## Health Checks

Docker health checks let the daemon and orchestrators (Kubernetes, ECS) know whether a container is actually healthy, not just running.

```dockerfile
# Spring Boot Actuator health endpoint
HEALTHCHECK \
  --interval=30s \
  --timeout=5s \
  --start-period=60s \
  --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1
```

| Parameter | Meaning |
|---|---|
| `--interval` | Time between checks (default 30s) |
| `--timeout` | How long to wait for the check to complete |
| `--start-period` | Grace period on container start before failures count |
| `--retries` | Consecutive failures before marking `unhealthy` |

### Restart policies with health checks

```bash
# Restart automatically if the container becomes unhealthy
docker run \
  --health-cmd='curl -f http://localhost:8080/health || exit 1' \
  --health-interval=30s \
  --restart=unless-stopped \
  myapp:latest
```

---

## Logging and Resources

### Log to stdout — always

Containers should write logs to stdout and stderr, not to files. The container runtime captures stdout and forwards it to whatever log driver is configured — CloudWatch, Splunk, the local Docker log buffer, or anywhere else.

In Spring Boot:
```properties
# application.properties
logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss} %-5level [%thread] %logger{36} - %msg%n
```

### Log drivers

```bash
# JSON file (default) — logs stored on disk
docker run --log-driver json-file --log-opt max-size=10m --log-opt max-file=3 myapp

# CloudWatch Logs
docker run \
  --log-driver awslogs \
  --log-opt awslogs-region=us-east-1 \
  --log-opt awslogs-group=/docker/myapp \
  myapp

# No logging (use in ECS/K8s where the orchestrator handles logs)
docker run --log-driver none myapp
```

### CPU and memory limits

```bash
# Hard memory limit — container is OOM-killed if it exceeds this
docker run --memory 512m myapp

# Soft memory limit + hard limit
docker run --memory 512m --memory-reservation 256m myapp

# CPU limits
docker run --cpus 0.5 myapp          # 0.5 CPU cores
docker run --cpu-shares 512 myapp    # relative weight (default 1024)
```

> **Set memory limits on every production container**. Without a limit, one misbehaving container can consume all host memory, OOM-killing everything else on the host. Set the limit to approximately 1.25x your application's expected peak heap usage.

---

## Container Registry Management

### ECR lifecycle policies

Without lifecycle policies, your ECR repositories grow forever and generate unnecessary storage costs:

```bash
# Keep only the last 30 tagged images, delete untagged immediately
aws ecr put-lifecycle-policy \
  --repository-name myapp \
  --lifecycle-policy-text '{
    "rules": [
      {
        "rulePriority": 1,
        "description": "Remove untagged images older than 1 day",
        "selection": {
          "tagStatus": "untagged",
          "countType": "sinceImagePushed",
          "countUnit": "days",
          "countNumber": 1
        },
        "action": {"type": "expire"}
      },
      {
        "rulePriority": 2,
        "description": "Keep last 30 tagged images",
        "selection": {
          "tagStatus": "tagged",
          "tagPrefixList": ["v"],
          "countType": "imageCountMoreThan",
          "countNumber": 30
        },
        "action": {"type": "expire"}
      }
    ]
  }'
```

### Image signing with cosign

Image signing cryptographically proves that an image was built by your CI pipeline and has not been tampered with:

```bash
# Generate a signing key pair
cosign generate-key-pair

# Sign an image after pushing
cosign sign --key cosign.key 123456789.dkr.ecr.us-east-1.amazonaws.com/myapp:v1.0.0

# Verify before pulling in production
cosign verify --key cosign.pub 123456789.dkr.ecr.us-east-1.amazonaws.com/myapp:v1.0.0
```
