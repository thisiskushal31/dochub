# Concepts (architecture, workloads, networking, storage)

[← Back to Kubernetes deep dive](./README.md)

This page gives a concise overview of Kubernetes architecture (control plane and nodes), main workload types (Pods, Deployments, StatefulSets, Jobs, DaemonSets), networking (Services, Ingress, DNS), storage (Volumes, PersistentVolumes), and configuration (ConfigMaps, Secrets). Everything you need is in this file; the diagram and links at the end are for further reading only.

## Table of Contents

- [Architecture overview](#architecture-overview)
- [Control plane components](#control-plane-components)
- [Node components](#node-components)
- [Workloads](#workloads)
- [Networking](#networking)
- [Storage](#storage)
- [Configuration and secrets](#configuration-and-secrets)
- [References](#references)

---

## Architecture overview

A **Kubernetes cluster** has two kinds of machines: a **control plane** (one or more nodes that run the API and cluster logic) and **worker nodes** (where your Pods run). You talk to the cluster through the **API server** using `kubectl` or other clients.

![Components of a Kubernetes cluster: control plane and nodes](../../assets/components-of-kubernetes.svg)

---

## Control plane components

The control plane runs the cluster. Main components:

- **kube-apiserver** – Front end for the Kubernetes API. All create/update/delete and read operations go through it; `kubectl` talks to the API server.
- **etcd** – Consistent, highly available key-value store that holds all cluster state (object specs, status, etc.).
- **kube-scheduler** – Watches for Pods that don’t have a node yet and assigns each to a suitable node based on resource requests, constraints, and policies.
- **kube-controller-manager** – Runs the controllers that implement cluster behavior (e.g. ReplicaSet keeps the right number of Pods; Deployment manages rolling updates).
- **cloud-controller-manager** (optional) – Connects to the cloud provider for load balancers, nodes, storage, etc., when running in a cloud.

For high availability, you run multiple control-plane nodes (with etcd clustered and the API behind a load balancer).

---

## Node components

Every worker node runs:

- **kubelet** – Agent that ensures the containers for the Pods on that node are running. It talks to the API server and starts/restarts containers via the **container runtime** (e.g. containerd, CRI-O).
- **kube-proxy** – Maintains network rules on the node so that **Services** (cluster IP, NodePort, LoadBalancer) work and traffic reaches the right Pods.
- **Container runtime** – Software that runs containers (e.g. containerd). Must implement the **CRI** (Container Runtime Interface).

Pods are scheduled onto nodes; the kubelet and runtime run them; kube-proxy handles Service networking.

---

## Workloads

Workloads are the objects that run your containers.

### Pods

A **Pod** is the smallest deployable unit: one or more containers that share a network namespace and often storage. Usually you don’t create Pods directly; you use a **controller** that creates and manages Pods.

### Deployments

A **Deployment** declares a desired state for a replicated app (e.g. “3 replicas of this Pod template”). It creates a **ReplicaSet**, which creates the Pods. The Deployment handles rolling updates and rollbacks. Use Deployments for stateless services (web servers, APIs).

### StatefulSets

A **StatefulSet** is for stateful workloads that need stable identity and storage: ordered creation/scale-down, stable network identities (e.g. `pod-0`, `pod-1`), and per-Pod **PersistentVolume** binding. Use for databases, distributed systems with fixed members.

### Jobs and CronJobs

A **Job** runs one or more Pods until a task completes (e.g. a batch job). A **CronJob** runs Jobs on a schedule (e.g. daily backup).

### DaemonSet

A **DaemonSet** ensures every (or a subset of) node runs a copy of a Pod (e.g. log collector, node monitor). When you add a node, the DaemonSet schedules a Pod there automatically.

---

## Networking

- **Pod network** – Every Pod gets an IP. Pods can reach each other by IP; the cluster network plugin (e.g. Calico, Cilium) provides this.
- **Service** – Stable way to reach a set of Pods (e.g. by label selector). Types: **ClusterIP** (internal), **NodePort** (expose on node port), **LoadBalancer** (cloud LB). Services get a DNS name: `<service>.<namespace>.svc.cluster.local`.
- **Ingress** – HTTP(S) routing into the cluster (host/path to Services). Implemented by an Ingress controller (e.g. NGINX, Traefik).
- **DNS** – Built-in DNS gives Pods and Services names; Pods can resolve Services by name.

---

## Storage

- **Volumes** – A Pod can mount a **Volume** (many types: emptyDir, hostPath, cloud disk, NFS, etc.). Data in the volume outlives the container but is tied to the Pod’s lifecycle unless you use persistent storage.
- **PersistentVolume (PV)** and **PersistentVolumeClaim (PVC)** – **PV** is a piece of cluster storage; **PVC** is a request for storage by a Pod. The cluster binds a PVC to a PV so the Pod gets persistent storage. When the Pod is deleted, the PVC (and data) can remain.
- **StorageClass** – Defines *classes* of storage (e.g. “fast SSD”, “cheap HDD”). A PVC can request a StorageClass; the cluster may **provision** a new PV automatically (dynamic provisioning).

---

## Configuration and secrets

- **ConfigMap** – Holds non-sensitive configuration (e.g. config files, env vars). Pods mount it or get env vars from it.
- **Secret** – Holds sensitive data (passwords, tokens, keys). Stored encoded; Pods mount or get env vars from it. Prefer RBAC and encryption at rest so only authorized components can read secrets.

---

## References

Use these only if you want more detail or the latest wording from the official documentation.

- **Overview:** [Concepts overview](https://kubernetes.io/docs/concepts/overview/), [Kubernetes components](https://kubernetes.io/docs/concepts/overview/components/), [Cluster architecture](https://kubernetes.io/docs/concepts/architecture/)
- **Workloads:** [Workloads](https://kubernetes.io/docs/concepts/workloads/), [Pods](https://kubernetes.io/docs/concepts/workloads/pods/), [Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/), [StatefulSets](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/), [Jobs](https://kubernetes.io/docs/concepts/workloads/controllers/job/), [CronJobs](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/), [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/)
- **Networking:** [Services, Load Balancing, and Networking](https://kubernetes.io/docs/concepts/services-networking/), [Service](https://kubernetes.io/docs/concepts/services-networking/service/), [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/), [DNS for Services and Pods](https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/)
- **Storage:** [Storage](https://kubernetes.io/docs/concepts/storage/), [Volumes](https://kubernetes.io/docs/concepts/storage/volumes/), [Persistent Volumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/), [Storage Classes](https://kubernetes.io/docs/concepts/storage/storage-classes/)
- **Config:** [ConfigMaps](https://kubernetes.io/docs/concepts/configuration/configmap/), [Secrets](https://kubernetes.io/docs/concepts/configuration/secret/)
- **Security:** [Security](https://kubernetes.io/docs/concepts/security/), [Controlling access to the API](https://kubernetes.io/docs/concepts/security/controlling-access/)

[← Back to Kubernetes deep dive](./README.md)
