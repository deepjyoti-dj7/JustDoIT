---
title: Security
description: Secrets in pipelines, OIDC for keyless cloud auth, supply chain security with SBOM and cosign, and scanning strategies for dependencies and containers.
---

# Security

CI/CD pipelines are privileged systems. They have credentials to your cloud accounts, access to production clusters, and can deploy arbitrary code. A compromised pipeline is a compromised production environment. Pipeline security is not optional — it is the perimeter.

---

## Secrets in Pipelines

### Never commit secrets to source control

This should not need saying, but it does. Git history is permanent. Even a secret committed and immediately reverted is visible in the history and may have already been pulled by anyone watching the repository. Use tools like `git-secrets`, `truffleHog`, or `gitleaks` as pre-commit hooks.

### OIDC: keyless cloud authentication

Traditional CI/CD stores long-lived AWS/GCP/Azure credentials as pipeline secrets. If those credentials are leaked or over-permissioned, the damage can be enormous. **OIDC (OpenID Connect)** eliminates static credentials entirely.

How it works: the CI provider (GitHub Actions, GitLab CI) issues a short-lived JWT for each job run. The cloud provider verifies the JWT against the OIDC provider and issues temporary credentials valid only for that job.

```yaml
# GitHub Actions: OIDC-based AWS auth (no static access keys)
jobs:
  deploy:
    permissions:
      id-token: write    # request OIDC token
      contents: read
    steps:
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789:role/github-deploy
          aws-region: us-east-1
          # GitHub sends a JWT; AWS STS exchanges it for 1-hour credentials
          # No access key or secret key stored anywhere
```

```json
// IAM trust policy for the GitHub Actions role
{
  "Effect": "Allow",
  "Principal": {
    "Federated": "arn:aws:iam::123456789:oidc-provider/token.actions.githubusercontent.com"
  },
  "Action": "sts:AssumeRoleWithWebIdentity",
  "Condition": {
    "StringEquals": {
      "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
      "token.actions.githubusercontent.com:sub": "repo:myorg/myrepo:ref:refs/heads/main"
    }
  }
}
```

The `sub` condition locks the role to only be assumable from the `main` branch of a specific repository — not from any branch or fork.

### HashiCorp Vault integration

For on-premise or multi-cloud environments, Vault provides dynamic secrets — credentials generated on demand and auto-expired:

```yaml
# GitHub Actions with Vault
- uses: hashicorp/vault-action@v2
  with:
    url: https://vault.company.com
    method: jwt
    role: github-deploy
    secrets: |
      secret/data/prod/db password | DB_PASSWORD;
      secret/data/prod/api key | API_KEY
# DB_PASSWORD and API_KEY are now available as environment variables
```

---

## Supply Chain Security

Software supply chain attacks target the tools and processes used to build software, not the software itself. The SolarWinds and XZ Utils attacks demonstrated how devastating this vector can be.

### SBOM — Software Bill of Materials

An SBOM is a machine-readable list of every dependency in your software — direct and transitive. When a new CVE is published, you can instantly determine which of your applications are affected.

```bash
# Generate an SBOM for a Docker image with Syft
syft 123456789.dkr.ecr.us-east-1.amazonaws.com/myapp:v1.2.3 \
  -o spdx-json > sbom.json

# Generate for a directory
syft dir:./target -o cyclonedx-json > sbom.json

# Check SBOM for vulnerabilities with Grype
grype sbom:./sbom.json
```

### Image signing with cosign

`cosign` (from Sigstore) signs container images cryptographically. A signed image proves it was built by your CI pipeline and has not been tampered with. Kubernetes admission controllers can enforce that only signed images run in the cluster.

```yaml
# GitHub Actions: sign image after push
- name: Sign image
  env:
    COSIGN_EXPERIMENTAL: "true"  # keyless signing via Sigstore
  run: |
    cosign sign \
      --yes \
      --oidc-issuer https://token.actions.githubusercontent.com \
      123456789.dkr.ecr.us-east-1.amazonaws.com/myapp:${{ github.sha }}

# Verify in production before deploying
- name: Verify image signature
  run: |
    cosign verify \
      --certificate-identity-regexp='https://github.com/myorg/myrepo/.github/workflows/.*' \
      --certificate-oidc-issuer https://token.actions.githubusercontent.com \
      123456789.dkr.ecr.us-east-1.amazonaws.com/myapp:${{ github.sha }}
```

### SLSA framework

SLSA (Supply chain Levels for Software Artifacts) is a framework of security levels for software supply chains. Level 1–3 progressively strengthen provenance and build integrity:

| Level | Requirement |
|---|---|
| **SLSA 1** | Build process is documented and scripted |
| **SLSA 2** | Build is version-controlled, hosted CI with signed provenance |
| **SLSA 3** | Hermetic, reproducible build; build service is hardened |

---

## Scanning

Scanning in CI should be opinionated: **block on critical findings, warn on everything else**. Too many blocks cause teams to disable scanning entirely.

### Dependency scanning

```yaml
# GitHub Dependabot (automatic PRs for vulnerable dependencies)
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: maven
    directory: /
    schedule:
      interval: weekly
    reviewers:
      - security-team
```

```bash
# OWASP Dependency-Check in Maven
./mvnw org.owasp:dependency-check-maven:check \
  -DfailBuildOnCVSS=7   # fail on CVSS >= 7.0 (HIGH)
```

### Container scanning with Trivy

```yaml
# GitHub Actions: scan before push
- name: Scan Docker image
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: myapp:${{ github.sha }}
    format: sarif
    output: trivy-results.sarif
    severity: HIGH,CRITICAL
    exit-code: '1'    # fail the pipeline

- name: Upload scan results to GitHub Security tab
  uses: github/codeql-action/upload-sarif@v3
  if: always()
  with:
    sarif_file: trivy-results.sarif
```

### SAST with Semgrep

```yaml
- name: SAST scan
  uses: returntocorp/semgrep-action@v1
  with:
    config: >
      p/java
      p/owasp-top-ten
      p/secrets
  env:
    SEMGREP_APP_TOKEN: ${{ secrets.SEMGREP_APP_TOKEN }}
```

### Secret detection

```yaml
# Detect secrets committed accidentally
- name: Detect secrets
  uses: trufflesecurity/trufflehog@main
  with:
    path: ./
    base: ${{ github.event.repository.default_branch }}
    head: HEAD
    extra_args: --only-verified   # only flag confirmed, non-test secrets
```
