# Tasks (run apps, expose, scale, manage)

[← Back to Kubernetes deep dive](./README.md)

This page walks through the main tasks: running a stateless app with a Deployment, exposing it with a Service, scaling and rolling updates, and managing objects (declarative and imperative). Everything you need is in this file; links at the end are for further reading only.

## Table of Contents

- [Run a stateless application (Deployment)](#run-a-stateless-application-deployment)
- [Expose the application (Service)](#expose-the-application-service)
- [Scale and rolling updates](#scale-and-rolling-updates)
- [Managing objects](#managing-objects)
- [Hands-on command reference](#hands-on-command-reference)
- [References](#references)

---

## Run a stateless application (Deployment)

A **Deployment** declares the desired state for a replicated, stateless workload: image, number of replicas, and Pod template. The controller keeps the right number of Pods running and supports rolling updates and rollbacks.

### Minimal Deployment YAML

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  labels:
    app: myapp
spec:
  replicas: 2
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
        - name: myapp
          image: nginx:alpine
          ports:
            - containerPort: 80
```

- **selector.matchLabels** must match **template.metadata.labels** so the Deployment can find its Pods.
- **replicas** is the desired number of Pods.

### Create the Deployment

```bash
# From a file
kubectl apply -f deployment.yaml

# Or create from a generated file
kubectl create deployment myapp --image=nginx:alpine --dry-run=client -o yaml > deployment.yaml
kubectl apply -f deployment.yaml
```

Check status and Pods:

```bash
kubectl get deployment myapp
kubectl get pods -l app=myapp
kubectl describe deployment myapp
```

---

## Expose the application (Service)

Pods get IPs that change when they are recreated. A **Service** gives a stable name and IP (and optional DNS) and load-balances to the Pods that match its selector.

### Create a Service

**ClusterIP (default)** – Internal only; other Pods in the cluster can reach it by name (e.g. `myapp`, `myapp.default.svc.cluster.local`).

```bash
kubectl expose deployment myapp --port=80
# Or with a name
kubectl expose deployment myapp --name=myapp-svc --port=80
```

**NodePort** – Exposes the Service on a port on every node (e.g. `http://<node-ip>:30080`).

```bash
kubectl expose deployment myapp --port=80 --type=NodePort
kubectl get svc myapp   # see NODE_PORT
```

**LoadBalancer** – On clouds, provisions an external load balancer; good for public-facing apps.

```bash
kubectl expose deployment myapp --port=80 --type=LoadBalancer
```

### Port forwarding (quick local access)

Without a NodePort or LoadBalancer, you can forward a local port to a Pod or Service:

```bash
# Forward local 8080 to Service port 80
kubectl port-forward svc/myapp 8080:80

# Or to a specific Pod
kubectl port-forward pod/myapp-xxxx 8080:80
```

Then open [http://localhost:8080](http://localhost:8080). Port-forward runs in the foreground; stop with Ctrl+C.

---

## Scale and rolling updates

### Scale replicas

```bash
# Scale to 3 replicas
kubectl scale deployment myapp --replicas=3

# Or edit the Deployment
kubectl edit deployment myapp   # set spec.replicas
```

Confirm with `kubectl get pods -l app=myapp`.

### Rolling update

When you change the Pod template (e.g. a new image), the Deployment performs a **rolling update**: new Pods are created and old ones are terminated gradually so availability is maintained.

```bash
# Set new image
kubectl set image deployment/myapp myapp=nginx:1.25-alpine

# Or apply an updated YAML that changes the image
kubectl apply -f deployment.yaml
```

Watch the rollout:

```bash
kubectl rollout status deployment/myapp
kubectl rollout history deployment/myapp
```

### Rollback

If something goes wrong, roll back to the previous revision:

```bash
kubectl rollout undo deployment/myapp
```

Or to a specific revision: `kubectl rollout undo deployment/myapp --to-revision=2`.

---

## Managing objects

### Declarative (apply)

Store desired state in YAML (or JSON) and apply it. Kubernetes reconciles the cluster to match the file. This is the recommended approach for version-controlled config.

```bash
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
# Or a directory
kubectl apply -f k8s/
```

Use `kubectl apply -f -` to read from stdin.

### Kustomize

**Kustomize** lets you customize base manifests (overlays, patches, common labels) without forking. Many clusters have it built in via `kubectl apply -k`:

```bash
kubectl apply -k overlays/production
```

### Imperative commands

For quick tests you can create objects without a file:

```bash
kubectl create deployment myapp --image=nginx:alpine
kubectl expose deployment myapp --port=80 --type=LoadBalancer
```

For production, prefer declarative `apply` and version-controlled YAML (or Kustomize/Helm).

### Patch and edit

Update a single field without rewriting the whole object:

```bash
kubectl patch deployment myapp -p '{"spec":{"replicas":5}}'
# Or edit in place (opens editor)
kubectl edit deployment myapp
```

---

## Hands-on command reference

```bash
# Deploy
kubectl apply -f deployment.yaml
kubectl get pods -l app=myapp

# Expose
kubectl expose deployment myapp --port=80 --type=LoadBalancer
kubectl get svc myapp

# Scale
kubectl scale deployment myapp --replicas=3

# Rollout
kubectl set image deployment/myapp myapp=nginx:1.25-alpine
kubectl rollout status deployment/myapp
kubectl rollout undo deployment/myapp

# Inspect
kubectl describe deployment myapp
kubectl logs -l app=myapp -f
```

Use the references below only when you want the full task docs from the official Kubernetes site.

---

## References

Use these only if you want more detail or the latest wording from the official documentation.

- **Run applications:** [Run a stateless application using a Deployment](https://kubernetes.io/docs/tasks/run-application/run-stateless-application-deployment/), [Stateful applications](https://kubernetes.io/docs/tasks/run-application/run-single-instance-stateful-application/), [HorizontalPodAutoscaler](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/), [Disruption budget](https://kubernetes.io/docs/tasks/run-application/configure-pdb/)
- **Access:** [Service to access an application](https://kubernetes.io/docs/tasks/access-application-cluster/service-access-application-cluster/), [Port forwarding](https://kubernetes.io/docs/tasks/access-application-cluster/port-forward-access-application-cluster/), [Dashboard](https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/)
- **Manage objects:** [Declarative config](https://kubernetes.io/docs/tasks/manage-kubernetes-objects/declarative-config/), [Kustomize](https://kubernetes.io/docs/tasks/manage-kubernetes-objects/kustomization/), [Imperative commands](https://kubernetes.io/docs/tasks/manage-kubernetes-objects/imperative-command/), [kubectl patch](https://kubernetes.io/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch/)
- **Administer cluster:** [Administer a cluster](https://kubernetes.io/docs/tasks/administer-cluster/), [kubeadm administration](https://kubernetes.io/docs/tasks/administer-cluster/kubeadm/), [Securing a cluster](https://kubernetes.io/docs/tasks/administer-cluster/securing-a-cluster/)

[← Back to Kubernetes deep dive](./README.md)
