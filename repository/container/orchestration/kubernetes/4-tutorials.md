# Tutorials

[← Back to Kubernetes deep dive](./README.md)

This page summarizes the main Kubernetes tutorials so you can follow them from here: create a cluster, deploy an app, explore Pods and nodes, expose the app with a Service, scale it, and perform a rolling update. Do the steps in this file; use the links at the end only if you want the official tutorial pages.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Create a cluster (learning)](#create-a-cluster-learning)
- [Deploy an application](#deploy-an-application)
- [Explore the app (Pods and nodes)](#explore-the-app-pods-and-nodes)
- [Expose the app (Service)](#expose-the-app-service)
- [Scale the app](#scale-the-app)
- [Update the app (rolling update)](#update-the-app-rolling-update)
- [Other tutorials](#other-tutorials)
- [References](#references)

---

## Prerequisites

- **kubectl** installed and in your PATH.
- A **cluster** to talk to: either a learning cluster (minikube, kind, k3s) or a managed/production cluster with kubeconfig set (e.g. `~/.kube/config` or `KUBECONFIG`).

Verify:

```bash
kubectl cluster-info
kubectl get nodes
```

---

## Create a cluster (learning)

For learning, use a local cluster so you don’t need cloud or multiple machines.

**Minikube:**

```bash
# Install minikube (see https://minikube.sigs.k8s.io/docs/start/)
minikube start
kubectl get nodes
```

**kind (Kubernetes in Docker):**

```bash
# Install kind, then create a cluster
kind create cluster
kubectl cluster-info --context kind-kind
```

**k3d (k3s in Docker):**

```bash
k3d cluster create
kubectl get nodes
```

Once the cluster is running, the following sections use `kubectl` against it.

---

## Deploy an application

Deploy a simple app (e.g. the Kubernetes demo image) with a Deployment:

```bash
kubectl create deployment kubernetes-bootcamp --image=gcr.io/google-samples/kubernetes-bootcamp:v1
```

Check that the Deployment and Pod were created:

```bash
kubectl get deployments
kubectl get pods
```

The Pod runs a tiny HTTP server. You’ll expose it in the next step.

---

## Explore the app (Pods and nodes)

- **Pods** – List Pods and see which node each is on:
  ```bash
  kubectl get pods -o wide
  kubectl describe pod <pod-name>
  ```
- **Nodes** – List nodes and their status:
  ```bash
  kubectl get nodes
  kubectl describe node <node-name>
  ```
- **Logs** – Stream logs from a Pod (or from all Pods with a label):
  ```bash
  kubectl logs <pod-name>
  kubectl logs -l app=kubernetes-bootcamp -f
  ```
- **Exec** – Run a command in a running Pod:
  ```bash
  kubectl exec -it <pod-name> -- sh
  ```

---

## Expose the app (Service)

Pods get ephemeral IPs. A **Service** gives a stable name and load-balances to the Pods.

Create a Service that targets the Deployment’s Pods:

```bash
kubectl expose deployment kubernetes-bootcamp --type=NodePort --port=8080
kubectl get services
```

Get the NodePort (e.g. 3xxxx):

```bash
kubectl get svc kubernetes-bootcamp -o jsonpath='{.spec.ports[0].nodePort}'
```

With Minikube, open the app in the browser:

```bash
minikube service kubernetes-bootcamp
```

Or with kind/k3d, use the node IP and the NodePort: `http://<node-ip>:<nodeport>`. Alternatively, use port-forward:

```bash
kubectl port-forward svc/kubernetes-bootcamp 8080:8080
```

Then open [http://localhost:8080](http://localhost:8080).

---

## Scale the app

Increase the number of replicas:

```bash
kubectl scale deployment kubernetes-bootcamp --replicas=3
kubectl get pods
```

The Service load-balances across the three Pods. Scale back down if you like:

```bash
kubectl scale deployment kubernetes-bootcamp --replicas=1
```

---

## Update the app (rolling update)

Change the image to a new version; the Deployment performs a rolling update:

```bash
kubectl set image deployment/kubernetes-bootcamp kubernetes-bootcamp=gcr.io/google-samples/kubernetes-bootcamp:v2
kubectl rollout status deployment/kubernetes-bootcamp
```

Verify the new version (e.g. hit the Service and check the response). To roll back:

```bash
kubectl rollout undo deployment/kubernetes-bootcamp
```

You’ve now gone through: create cluster → deploy → explore → expose → scale → update. This is the same flow as the official “Learn Kubernetes Basics” tutorial, condensed here.

---

## Other tutorials

- **Hello Minikube** – Minimal app on Minikube; good first run.
- **Configuration** – ConfigMaps, Redis, sidecar patterns.
- **Security** – Pod Security Standards, AppArmor, seccomp.
- **Stateless / stateful apps** – WordPress+MySQL, Cassandra, ZooKeeper-style examples.
- **Services** – Connecting frontends to backends with Services.

Follow the same pattern: read the goal, run the commands in this repo or in the official pages, then use the references only when you want the full official tutorial.

---

## References

Use these only if you want the official tutorial pages.

- **Tutorials home:** [Kubernetes Tutorials](https://kubernetes.io/docs/tutorials/)
- **Hello Minikube:** [Hello Minikube](https://kubernetes.io/docs/tutorials/hello-minikube/)
- **Learn Kubernetes Basics:** [Overview](https://kubernetes.io/docs/tutorials/kubernetes-basics/), [Create a cluster](https://kubernetes.io/docs/tutorials/kubernetes-basics/create-cluster/), [Deploy an app](https://kubernetes.io/docs/tutorials/kubernetes-basics/deploy-app/), [Explore](https://kubernetes.io/docs/tutorials/kubernetes-basics/explore/), [Expose](https://kubernetes.io/docs/tutorials/kubernetes-basics/expose/), [Scale](https://kubernetes.io/docs/tutorials/kubernetes-basics/scale/), [Update](https://kubernetes.io/docs/tutorials/kubernetes-basics/update/)
- **Configuration, security, stateful:** [Configuration](https://kubernetes.io/docs/tutorials/configuration/), [Security](https://kubernetes.io/docs/tutorials/security/), [Stateless](https://kubernetes.io/docs/tutorials/stateless-application/), [Stateful](https://kubernetes.io/docs/tutorials/stateful-application/), [Services](https://kubernetes.io/docs/tutorials/services/connect-applications-service/)

[← Back to Kubernetes deep dive](./README.md)
