---
title: Core Objects
description: Pods, Deployments, Services, ConfigMaps, Secrets, Namespaces, DaemonSets, StatefulSets, Jobs, and CronJobs — the building blocks of every Kubernetes workload.
---

# Core Objects

Kubernetes workloads are defined through a set of declarative objects. Understanding each object, what it manages, and when to use it is the foundation of working effectively with Kubernetes.

---

## Pods

A **Pod** is the smallest deployable unit in Kubernetes. It is one or more containers that share a network namespace (same IP and ports) and can share storage volumes. Containers in the same pod communicate over `localhost`.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: api-pod
  labels:
    app: api
spec:
  containers:
    - name: api
      image: myapp:v1.2.3
      ports:
        - containerPort: 8080
      env:
        - name: SPRING_PROFILES_ACTIVE
          value: production
      resources:
        requests:
          cpu: "250m"
          memory: "256Mi"
        limits:
          cpu: "500m"
          memory: "512Mi"
```

### Pod lifecycle phases

`Pending` → `Running` → `Succeeded` | `Failed` | `Unknown`

### Init containers

Init containers run to completion before the main container starts. Use them for setup tasks — waiting for a database to be ready, running migrations, or seeding config files:

```yaml
spec:
  initContainers:
    - name: wait-for-db
      image: busybox
      command: ['sh', '-c', 'until nc -z db-service 5432; do sleep 2; done']
  containers:
    - name: api
      image: myapp:v1.2.3
```

### Sidecar pattern

Sidecars are additional containers in a pod that enhance the main container without modifying it — log shippers (Fluentd), service mesh proxies (Envoy/Istio), secrets syncing agents.

> **You rarely create Pods directly.** A standalone Pod has no self-healing — if the node it runs on fails, the pod is gone. Always use a Deployment (or StatefulSet for stateful apps) which manages pod lifecycle for you.

---

## Deployments

A **Deployment** manages a ReplicaSet, which manages pods. You tell the Deployment how many replicas you want and what the pod spec looks like, and it ensures that state is maintained.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1          # create 1 extra pod before terminating old ones
      maxUnavailable: 0    # never have fewer than desired replicas running
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
        - name: api
          image: myapp:v1.2.3
          readinessProbe:
            httpGet:
              path: /actuator/health
              port: 8080
            initialDelaySeconds: 30
            periodSeconds: 10
```

```bash
# Rolling update: just change the image tag
kubectl set image deployment/api api=myapp:v1.2.4

# Watch the rollout
kubectl rollout status deployment/api

# Rollback to previous version
kubectl rollout undo deployment/api

# Rollback to a specific revision
kubectl rollout history deployment/api
kubectl rollout undo deployment/api --to-revision=3
```

---

## Services

Pods are ephemeral — they get new IPs when restarted. A **Service** provides a stable DNS name and IP that load-balances across matching pods using label selectors.

| Service type | Accessibility | Use when |
|---|---|---|
| **ClusterIP** | Inside cluster only | Default; internal service-to-service communication |
| **NodePort** | Cluster + external via node IP:port (30000–32767) | Dev/testing; not for production external traffic |
| **LoadBalancer** | External; cloud provider creates a load balancer | Production external traffic on managed K8s (EKS, GKE, AKS) |
| **ExternalName** | Maps service name to an external DNS name | Referencing external services by a stable in-cluster name |

```yaml
apiVersion: v1
kind: Service
metadata:
  name: api-service
spec:
  selector:
    app: api             # routes to all pods with label app=api
  ports:
    - protocol: TCP
      port: 80           # port the Service is reachable on
      targetPort: 8080   # port on the pod
  type: ClusterIP
```

---

## ConfigMaps and Secrets

### ConfigMaps

ConfigMaps store non-sensitive configuration data as key-value pairs:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  LOG_LEVEL: INFO
  MAX_CONNECTIONS: "100"
  application.properties: |
    server.port=8080
    spring.datasource.url=jdbc:postgresql://db:5432/mydb
```

```yaml
# Inject as environment variables
envFrom:
  - configMapRef:
      name: app-config

# Or mount as a file
volumeMounts:
  - name: config
    mountPath: /app/config
volumes:
  - name: config
    configMap:
      name: app-config
```

### Secrets

Secrets hold sensitive data (base64-encoded, not encrypted by default unless encryption at rest is configured):

```bash
# Create a secret from literals
kubectl create secret generic db-credentials \
  --from-literal=username=admin \
  --from-literal=password='$up3rS3cr3t'

# Create from files
kubectl create secret generic tls-certs \
  --from-file=tls.crt=./server.crt \
  --from-file=tls.key=./server.key
```

```yaml
# Reference in a pod
env:
  - name: DB_PASSWORD
    valueFrom:
      secretKeyRef:
        name: db-credentials
        key: password
```

> **Never commit Secrets to Git.** Use Sealed Secrets (encrypted CRDs), External Secrets Operator (syncs from AWS Secrets Manager), or Vault Agent injection for GitOps workflows.

---

## Namespaces

Namespaces divide a cluster into virtual sub-clusters. Resources in one namespace are isolated from resources in another (by default).

```bash
# Create a namespace
kubectl create namespace payments

# Deploy to a specific namespace
kubectl apply -f deployment.yaml -n payments

# Set your default namespace for the session
kubectl config set-context --current --namespace=payments

# View resources across all namespaces
kubectl get pods -A
```

Namespaces are the scope for:
- **Resource quotas** — limit total CPU/memory/pod count per namespace
- **RBAC** — grant access to a namespace without cluster-wide access
- **Network policies** — isolate traffic between namespaces

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: payments-quota
  namespace: payments
spec:
  hard:
    requests.cpu: "4"
    requests.memory: 8Gi
    limits.cpu: "8"
    limits.memory: 16Gi
    count/pods: "20"
```

---

## DaemonSets and StatefulSets

### DaemonSets

A DaemonSet ensures one pod runs on **every node** (or a subset matching a selector). Used for cluster-wide infrastructure: log shippers, monitoring agents, CNI plugins, node-local proxies.

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: fluentd
spec:
  selector:
    matchLabels:
      app: fluentd
  template:
    metadata:
      labels:
        app: fluentd
    spec:
      tolerations:
        - key: node-role.kubernetes.io/control-plane
          effect: NoSchedule
      containers:
        - name: fluentd
          image: fluentd:v1.16
          volumeMounts:
            - name: varlog
              mountPath: /var/log
      volumes:
        - name: varlog
          hostPath:
            path: /var/log
```

### StatefulSets

StatefulSets are like Deployments but for stateful applications. They guarantee:
- **Stable pod identity**: `pod-0`, `pod-1`, `pod-2` — names never change
- **Stable network identity**: each pod gets a predictable DNS name
- **Ordered startup**: pods start `pod-0` → `pod-1` → `pod-2`
- **Ordered shutdown**: pods stop in reverse order
- **Per-pod PersistentVolumeClaims**: each pod gets its own dedicated volume

Use StatefulSets for databases, message brokers, and anything that requires stable identity or per-instance storage.

---

## Jobs and CronJobs

### Jobs

A Job runs one or more pods to completion. Unlike Deployments, Jobs are not meant to run forever — they succeed when the specified number of completions is reached.

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: db-migration
spec:
  completions: 1
  parallelism: 1
  backoffLimit: 3        # retry up to 3 times before marking failed
  template:
    spec:
      restartPolicy: OnFailure
      containers:
        - name: migrate
          image: myapp:v1.2.3
          command: ["java", "-jar", "app.jar", "--migrate"]
```

### CronJobs

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: nightly-report
spec:
  schedule: "0 2 * * *"    # 2 AM every night (standard cron syntax)
  concurrencyPolicy: Forbid  # do not run if previous run still going
  successfulJobsHistoryLimit: 3
  failedJobsHistoryLimit: 1
  jobTemplate:
    spec:
      template:
        spec:
          restartPolicy: Never
          containers:
            - name: reporter
              image: myapp:v1.2.3
              command: ["java", "-jar", "app.jar", "--report"]
```
