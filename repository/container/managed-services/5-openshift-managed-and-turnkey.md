# OpenShift Managed (ROSA, ARO) and Turnkey Kubernetes

[← Back to Managed services](./README.md)

Red Hat OpenShift managed offerings (ROSA, ARO) and open source / turnkey Kubernetes options: k3s, k0s, RKE2, MicroK8s, Minikube, Kind. Based on official and project documentation.

## Table of Contents

- [Red Hat OpenShift Service on AWS (ROSA)](#red-hat-openshift-service-on-aws-rosa)
- [Azure Red Hat OpenShift (ARO)](#azure-red-hat-openshift-aro)
- [Turnkey and open source Kubernetes](#turnkey-and-open-source-kubernetes)
- [References](#references)

---

## Red Hat OpenShift Service on AWS (ROSA)

**ROSA** is Red Hat's managed OpenShift on AWS. Red Hat and AWS operate the control plane and (in many offerings) the infrastructure. You get the OpenShift API, operators, routes, and developer experience with Red Hat support; you focus on workloads. Use when you want OpenShift on AWS without self-managing the platform. Create clusters via the Red Hat Hybrid Cloud Console, AWS Console, or CLI (rosa). See the official [ROSA documentation](https://docs.openshift.com/rosa/) for prerequisites, creation, and operations.

---

## Azure Red Hat OpenShift (ARO)

**ARO** is Red Hat's managed OpenShift on Azure. Red Hat and Microsoft operate the service; you get OpenShift with Red Hat support on Azure. Use when you want OpenShift on Azure. Create and manage clusters via the Azure Portal or Azure CLI. See the official [ARO documentation](https://docs.openshift.com/aro/) for installation and management.

---

## Turnkey and open source Kubernetes

When you need Kubernetes **on-premises**, at the **edge**, or for **local development** without a cloud provider, use a **turnkey** or **open source** distribution. The [Kubernetes certified conformant list](https://kubernetes.io/docs/setup/production-environment/turnkey-solutions/) includes many options. Common ones:

**k3s** – Lightweight, single binary, suitable for edge and resource-constrained environments. Quick to install; includes SQLite (default) or etcd. [k3s.io](https://k3s.io/).

**k0s** – Single binary, zero-friction Kubernetes; can run as a single node or multi-node. [k0sproject.io](https://k0sproject.io/).

**RKE2** – Rancher's Kubernetes distribution; security-focused, CIS benchmarked. Good for on-prem and edge. [Rancher RKE2](https://docs.rke2.io/).

**MicroK8s** – Canonical's low-ops Kubernetes; single node or cluster. Add-ons for storage, DNS, ingress. [microk8s.io](https://microk8s.io/).

**Minikube** – Local Kubernetes for development. Runs a single-node cluster in a VM or container. [minikube.sigs.k8s.io](https://minikube.sigs.k8s.io/).

**Kind** – Kubernetes in Docker. Runs nodes as Docker containers; good for CI and local testing. [kind.sigs.k8s.io](https://kind.sigs.k8s.io/).

**k3d** – k3s in Docker. Lightweight local clusters. [k3d.io](https://k3d.io/).

Choose by environment (cloud vs on-prem vs edge vs laptop), ops model, and certification needs. For production on your own hardware, prefer a certified distribution (k3s, k0s, RKE2, MicroK8s, OpenShift, etc.) and follow their hardening guides.

---

## References

- [ROSA](https://docs.openshift.com/rosa/) · [ARO](https://docs.openshift.com/aro/)
- [OpenShift deep-dive in this repo](../orchestration/openshift/README.md)
- [Kubernetes turnkey solutions](https://kubernetes.io/docs/setup/production-environment/turnkey-solutions/)
- [k3s](https://k3s.io/) · [k0s](https://k0sproject.io/) · [RKE2](https://docs.rke2.io/) · [MicroK8s](https://microk8s.io/)
- [Minikube](https://minikube.sigs.k8s.io/) · [Kind](https://kind.sigs.k8s.io/) · [k3d](https://k3d.io/)

[← Back to Managed services](./README.md)
