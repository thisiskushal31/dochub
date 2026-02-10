# Kubernetes Deep Dive

Hands-on notes for Kubernetes from setup to production. **Read each topic file fully**—concepts, commands, and procedures are explained here. Use the **References** at the end of each file only when you want more or the latest from the official Kubernetes docs.

## Topics

### [1. Getting started & install](./1-getting-started-install.md)

Getting started overview; learning vs production environments; installing kubectl; bootstrapping a cluster with kubeadm; best practices and production checklist.

### [2. Concepts (architecture, workloads, networking, storage)](./2-concepts.md)

Control plane and node components; workloads (Pods, Deployments, StatefulSets, Jobs, DaemonSets); Services, Ingress, DNS; Volumes, PersistentVolumes, StorageClasses; ConfigMaps and Secrets.

### [3. Tasks (run apps, expose, scale, manage)](./3-tasks.md)

Run a stateless app with a Deployment; expose with a Service (ClusterIP, NodePort, LoadBalancer); scale and rolling updates; managing objects (apply, Kustomize, imperative, patch).

### [4. Tutorials](./4-tutorials.md)

Create a learning cluster; deploy an app; explore Pods and nodes; expose with a Service; scale; rolling update. Full walkthrough so you can follow from this file.

### [5. Production & operations](./5-production-operations.md)

High availability with kubeadm; best practices (large clusters, multiple zones, Pod Security, PKI); administration (add nodes, upgrade, certificates, secure cluster); reference and checklist.

## Learning path

1. [Getting started & install](./1-getting-started-install.md)
2. [Concepts](./2-concepts.md)
3. [Tasks](./3-tasks.md)
4. [Tutorials](./4-tutorials.md)
5. [Production & operations](./5-production-operations.md)

## Quick reference (kubectl)

```bash
kubectl cluster-info
kubectl get nodes
kubectl get pods -A
kubectl apply -f deployment.yaml
kubectl expose deployment myapp --port=80 --type=LoadBalancer
kubectl scale deployment myapp --replicas=3
kubectl rollout status deployment/myapp
```

**Full reference:** [kubectl reference](https://kubernetes.io/docs/reference/kubectl/).

## Related

- **[Containerization basics](../../containerization-basic/README.md)** – concepts
- **[Docker](../../runtimes/docker/README.md)** – images and containers
- **[Swarm](../swarm/README.md)** – Docker’s built-in orchestration
- **[Managed services](../../managed-services/README.md)** – GKE, EKS, AKS, OpenShift

## References

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Getting started](https://kubernetes.io/docs/setup/)
- [Concepts](https://kubernetes.io/docs/concepts/)
- [Tasks](https://kubernetes.io/docs/tasks/)
- [Tutorials](https://kubernetes.io/docs/tutorials/)
- [Reference](https://kubernetes.io/docs/reference/)
