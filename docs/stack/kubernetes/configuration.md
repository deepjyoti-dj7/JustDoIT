---
title: Configuration
description: Resource requests and limits, QoS classes, HPA/VPA/cluster autoscaler/KEDA, RBAC, and Helm for packaging and deploying Kubernetes applications.
---

# Configuration

Running pods is the easy part. Running them efficiently, securely, and reliably at scale requires tuning resource allocation, configuring autoscaling, enforcing access control, and managing application packages. This page covers the four configuration pillars every production Kubernetes team works with daily.

---

## Resource Management

Kubernetes schedules pods based on **resource requests** and enforces limits via cgroups.

```yaml
resources:
  requests:
    cpu: "250m"      # 250 millicores = 0.25 CPU cores
    memory: "256Mi"  # 256 mebibytes
  limits:
    cpu: "500m"
    memory: "512Mi"
```

**Requests** — what the pod is *guaranteed*. The scheduler uses requests to decide which node to place a pod on. A node will not accept a pod if it does not have enough unreserved capacity.

**Limits** — the *ceiling*. If a container exceeds its memory limit, it is OOM-killed. If it exceeds its CPU limit, it is throttled (not killed).

### QoS classes

Kubernetes assigns a Quality of Service class to each pod based on its resource spec:

| QoS class | Condition | Eviction priority |
|---|---|---|
| **Guaranteed** | Every container has equal requests and limits | Last to be evicted under memory pressure |
| **Burstable** | At least one container has requests, limits differ | Evicted before Guaranteed |
| **BestEffort** | No requests or limits set | First to be evicted |

> **Set requests and limits on every container.** Pods without resource specs are `BestEffort` and will be the first casualties when a node runs low on memory. Unset limits allow one runaway container to consume all node resources.

---

## Autoscaling

### Horizontal Pod Autoscaler (HPA)

HPA scales the number of pod replicas based on CPU utilisation, memory utilisation, or custom metrics.

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api
  minReplicas: 2
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 60   # scale up when avg CPU > 60%
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 70
```

```bash
# Check HPA status
kubectl get hpa
kubectl describe hpa api-hpa
```

### Vertical Pod Autoscaler (VPA)

VPA adjusts the CPU and memory requests of running pods. It is useful when you do not know the right resource requests upfront:

```yaml
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: api-vpa
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api
  updatePolicy:
    updateMode: "Auto"    # or "Off" for recommendation-only, "Initial" for new pods only
```

### Cluster Autoscaler

Cluster Autoscaler adds or removes nodes from the cluster based on pending pods (scale up) or underutilised nodes (scale down). On EKS, it integrates with Auto Scaling Groups.

```bash
# Install cluster autoscaler on EKS
helm repo add autoscaler https://kubernetes.github.io/autoscaler
helm install cluster-autoscaler autoscaler/cluster-autoscaler \
  --set autoDiscovery.clusterName=my-cluster \
  --set awsRegion=us-east-1
```

### KEDA — event-driven autoscaling

KEDA scales deployments to zero and back up based on external event sources — SQS queue depth, Kafka consumer lag, Redis queue length, Prometheus metrics:

```yaml
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: sqs-worker-scaler
spec:
  scaleTargetRef:
    name: sqs-worker
  minReplicaCount: 0      # scales to zero when idle
  maxReplicaCount: 50
  triggers:
    - type: aws-sqs-queue
      metadata:
        queueURL: https://sqs.us-east-1.amazonaws.com/123/orders
        awsRegion: us-east-1
        queueLength: "10"  # one pod per 10 messages in queue
```

---

## RBAC

Kubernetes Role-Based Access Control controls who can do what to which resources.

| Object | Scope | Purpose |
|---|---|---|
| **Role** | Namespace | Grant permissions within one namespace |
| **ClusterRole** | Cluster-wide | Grant permissions across all namespaces or cluster-scoped resources |
| **RoleBinding** | Namespace | Bind a Role or ClusterRole to a user/group/SA in a namespace |
| **ClusterRoleBinding** | Cluster-wide | Bind a ClusterRole to a user/group/SA cluster-wide |

```yaml
# Role: can read pods and logs in the payments namespace
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-reader
  namespace: payments
rules:
  - apiGroups: [""]
    resources: ["pods", "pods/log"]
    verbs: ["get", "list", "watch"]

---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods-binding
  namespace: payments
subjects:
  - kind: ServiceAccount
    name: monitoring-agent
    namespace: payments
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io
```

```bash
# Check what a service account can do
kubectl auth can-i list pods --as=system:serviceaccount:payments:monitoring-agent -n payments

# View all permissions for a role
kubectl describe role pod-reader -n payments
```

---

## Helm

Helm is the package manager for Kubernetes. Instead of managing 10+ individual YAML files for a single application, you define a **chart** with templates and a `values.yaml` file that customises the deployment.

### Chart structure

```
myapp/
  Chart.yaml          # chart metadata (name, version, appVersion)
  values.yaml         # default configuration values
  templates/
    deployment.yaml   # templated K8s manifests
    service.yaml
    ingress.yaml
    configmap.yaml
    _helpers.tpl      # reusable template snippets
```

### values.yaml and templating

```yaml
# values.yaml
replicaCount: 3
image:
  repository: myapp
  tag: "1.2.3"
service:
  port: 8080
resources:
  limits:
    cpu: 500m
    memory: 512Mi
```

```yaml
# templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Release.Name }}-{{ .Chart.Name }}
spec:
  replicas: {{ .Values.replicaCount }}
  template:
    spec:
      containers:
        - name: {{ .Chart.Name }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          resources: {{- toYaml .Values.resources | nindent 12 }}
```

### Core Helm commands

```bash
# Install a chart
helm install my-release ./myapp
helm install my-release ./myapp -f production-values.yaml
helm install my-release ./myapp --set image.tag=2.0.0

# Upgrade (or install if not exists)
helm upgrade --install my-release ./myapp -f production-values.yaml

# Check what will change before upgrading (helm-diff plugin)
helm diff upgrade my-release ./myapp -f production-values.yaml

# Rollback to previous release
helm rollback my-release
helm rollback my-release 2  # rollback to revision 2

# List releases
helm list -A

# Uninstall
helm uninstall my-release
```
