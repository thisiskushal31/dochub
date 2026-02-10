# Managed Services Overview and When to Use Which

[← Back to Managed services](./README.md)

This page gives an overview of managed Kubernetes and container platforms and when to choose which. Content is based on official product documentation; links at the end are for further reading only.

## Table of Contents

- [What are managed Kubernetes services?](#what-are-managed-kubernetes-services)
- [Comparison at a glance](#comparison-at-a-glance)
- [When to use which](#when-to-use-which)
- [Open source and turnkey Kubernetes](#open-source-and-turnkey-kubernetes)
- [References](#references)

---

## What are managed Kubernetes services?

**Managed Kubernetes** means a provider runs the **control plane** (API server, scheduler, controllers, etcd) for you. You get a Kubernetes API endpoint and deploy workloads; the provider handles control plane upgrades, availability, and often security hardening. In some offerings (e.g. GKE Autopilot, EKS Auto Mode), the provider also **manages the nodes** so you only define workloads and pay for what they use.

Benefits: less operational burden, faster time to production, integration with the provider's IAM, networking, storage, and monitoring. You still need to understand Kubernetes concepts (pods, services, deployments); see this repo's [Kubernetes deep dive](../orchestration/kubernetes/README.md).

---

## Comparison at a glance

| Service | Provider | Control plane | Nodes | Best for |
|---------|----------|---------------|-------|----------|
| **GKE** | Google Cloud | Managed | Managed (Autopilot) or you (Standard) | GCP workloads, Autopilot pay-per-Pod, Anthos hybrid |
| **EKS** | AWS | Managed | You (Standard) or managed (Auto Mode) | AWS workloads, IAM integration, EKS Anywhere |
| **AKS** | Microsoft Azure | Managed (no extra cost) | You (node pools) | Azure workloads, Entra ID, Windows containers |
| **ROSA / ARO** | Red Hat (AWS / Azure) | Managed OpenShift | Managed or you | OpenShift on cloud with Red Hat support |
| **Turnkey (k3s, etc.)** | Self-managed / vendor | You | You | On-prem, edge, dev; certified K8s |

---

## When to use which

- **GKE** – You are on or going to **Google Cloud**. Use **Autopilot** for minimal node management and pay-per-Pod; use **Standard** when you need full control of node pools. Good fit for data/ML, Cloud Build/Deploy, and multi-cluster with Anthos.
- **EKS** – You are on or going to **AWS**. Use **EKS Standard** with EC2/Fargate node groups, or **EKS Auto Mode** for managed nodes. Strong IAM integration, ECR, and AWS add-ons. Use **EKS Anywhere** for on-prem clusters with the same EKS experience.
- **AKS** – You are on or going to **Azure**. Managed control plane at no extra cost; you pay for nodes. Good integration with Entra ID, ACR, and Azure Monitor. **Azure Red Hat OpenShift (ARO)** if you want OpenShift on Azure.
- **OpenShift managed (ROSA, ARO)** – You want **OpenShift** (operators, routes, developer experience) with Red Hat support on AWS (ROSA) or Azure (ARO). See [5. OpenShift managed and turnkey Kubernetes](./5-openshift-managed-and-turnkey.md).
- **Open source / turnkey** – You need Kubernetes **on-premises**, at the **edge**, or for **local development** without a cloud provider. Options include k3s, k0s, RKE2, MicroK8s, Minikube, and Kind. See [5. OpenShift managed and turnkey Kubernetes](./5-openshift-managed-and-turnkey.md#turnkey-and-open-source-kubernetes).

For concepts and hands-on Kubernetes without a specific cloud, use the [Kubernetes docs](https://kubernetes.io/docs/) and this repo's [Kubernetes deep dive](../orchestration/kubernetes/README.md).

---

## Open source and turnkey Kubernetes

The Kubernetes project lists [certified conformant](https://kubernetes.io/docs/setup/production-environment/turnkey-solutions/) platforms. These include:

- **Managed clouds** – GKE, EKS, AKS, and many others.
- **Self-managed / turnkey** – Distributions you install yourself: k3s (lightweight), k0s (single binary), RKE2 (Rancher), MicroK8s (Canonical), OpenShift (Red Hat), and others.
- **Local / dev** – Minikube, Kind (Kubernetes in Docker), k3d (k3s in Docker).

Use turnkey solutions when you need a consistent Kubernetes API on your own hardware or in dev; use managed services when you want the provider to run and maintain the control plane (and optionally nodes). See [5. OpenShift managed and turnkey Kubernetes](./5-openshift-managed-and-turnkey.md) for details on ROSA, ARO, and popular turnkey options.

---

## References

- [Kubernetes: Turnkey solutions](https://kubernetes.io/docs/setup/production-environment/turnkey-solutions/)
- [GKE](https://cloud.google.com/kubernetes-engine/docs) · [EKS](https://docs.aws.amazon.com/eks/latest/userguide/) · [AKS](https://learn.microsoft.com/en-us/azure/aks/)
- [OpenShift](https://docs.openshift.com/) · [ROSA](https://docs.openshift.com/rosa/) · [ARO](https://docs.openshift.com/aro/)

[← Back to Managed services](./README.md)
