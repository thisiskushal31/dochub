# Kubernetes Deep Dive

Hands-on notes for Kubernetes from setup to production. **Read each topic file fully**—concepts, commands, and procedures are explained here. Use the **References** at the end of each file only when you want more or the latest from the official Kubernetes docs.

## Topics

### [1. Getting started & install](./1_Getting_Started_Install.md)

Getting started overview; learning vs production environments; installing kubectl; bootstrapping a cluster with kubeadm; best practices and production checklist.

### [2. Concepts (architecture, workloads, networking, storage)](./2_Concepts.md)

Control plane and node components; workloads (Pods, Deployments, StatefulSets, Jobs, DaemonSets); Services, Ingress, DNS; Volumes, PersistentVolumes, StorageClasses; ConfigMaps and Secrets.

### [3. Tasks (run apps, expose, scale, manage)](./3_Tasks.md)

Run a stateless app with a Deployment; expose with a Service (ClusterIP, NodePort, LoadBalancer); scale and rolling updates; managing objects (apply, Kustomize, imperative, patch).

### [4. Tutorials](./4_Tutorials.md)

Create a learning cluster; deploy an app; explore Pods and nodes; expose with a Service; scale; rolling update. Full walkthrough so you can follow from this file.

### [5. Production & operations](./5_Production_Operations.md)

High availability with kubeadm; best practices (large clusters, multiple zones, Pod Security, PKI); administration (add nodes, upgrade, certificates, secure cluster); reference and checklist.

### [6. Self-managed Kubernetes](./6_Self_Managed.md)

You run the control plane (kubeadm / CAPI / kops / RKE2) on cloud VMs or metal. Managed SKUs (GKE/EKS/AKS) live in [Managed-Services](../../Managed-Services/README.md) and DevOps [Cloud/3](https://github.com/thisiskushal31/DevOps-Handbook/blob/main/Cloud/3_Managed_Kubernetes.md).

### [7. Vanilla Kubernetes on bare metal](./7_Vanilla_On_Bare_Metal.md)

kubeadm on physical servers in a hall or colo. The facility around the rack: DevOps [Datacenter/](https://github.com/thisiskushal31/DevOps-Handbook/blob/main/Datacenter/README.md).

## Learning path

1. [Getting started & install](./1_Getting_Started_Install.md)
2. [Concepts](./2_Concepts.md)
3. [Tasks](./3_Tasks.md)
4. [Tutorials](./4_Tutorials.md)
5. [Production & operations](./5_Production_Operations.md)
6. [Self-managed](./6_Self_Managed.md)
7. [Vanilla on bare metal](./7_Vanilla_On_Bare_Metal.md)

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

- **[Containerization basics](../../Containerization-Basic/README.md)** – concepts
- **[Docker](../../Runtimes/Docker/README.md)** – images and containers
- **[Swarm](../Swarm/README.md)** – Docker’s built-in orchestration
- **[Managed services](../../Managed-Services/README.md)** – GKE, EKS, AKS, OpenShift
- **[Rancher](../Rancher/README.md)** – multi-cluster manager, RKE2, k3s

## References

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Getting started](https://kubernetes.io/docs/setup/)
- [Concepts](https://kubernetes.io/docs/concepts/)
- [Tasks](https://kubernetes.io/docs/tasks/)
- [Tutorials](https://kubernetes.io/docs/tutorials/)
- [Reference](https://kubernetes.io/docs/reference/)
