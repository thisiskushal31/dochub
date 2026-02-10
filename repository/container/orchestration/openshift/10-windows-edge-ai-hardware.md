# Windows containers, edge, AI, and hardware

[← Back to OpenShift deep dive](./README.md)

This page covers **Windows containers**, **edge computing** (single-node, two-node, ZTP, image-based install), **AI workloads** (Kueue, JobSet, operators), **hardware accelerators** (GPUs, NPUs, RDMA), **single-node and two-node clusters**, the **Migration Toolkit for Containers**, and **Extensions**. Everything you need to understand these topics is here; the links at the end are for further reading only.

## Table of Contents

- [Windows containers](#windows-containers)
- [Edge computing and compact clusters](#edge-computing-and-compact-clusters)
- [AI workloads on OpenShift](#ai-workloads-on-openshift)
- [Hardware accelerators](#hardware-accelerators)
- [Single-node and two-node clusters](#single-node-and-two-node-clusters)
- [Migration Toolkit for Containers](#migration-toolkit-for-containers)
- [Extensions (OLM v1)](#extensions-olm-v1)
- [References](#references)

---

## Windows containers

OpenShift supports **Windows compute nodes** in a cluster so you can run **Windows Server containers** alongside Linux workloads. This is enabled by the **Red Hat Windows Machine Config Operator (WMCO)**.

- **Adding Windows nodes** – Create a **Windows MachineSet** (supported on AWS, Azure, GCP, vSphere, Nutanix) or use **Bring-Your-Own-Host (BYOH)** Windows instances via a configuration map. Compute machine sets for Windows are not supported on bare metal or provider-agnostic clusters.
- **Runtime** – Windows instances managed by WMCO use the **containerd** container runtime.
- **Workloads** – You schedule Windows workloads (Pods with Windows nodes) to Windows compute nodes. Use node selectors and taints/tolerations so Windows pods run only on Windows nodes.
- **Lifecycle** – You can upgrade the WMCO and Windows nodes, remove Windows nodes by deleting the machine, and disable Windows container workloads by uninstalling the WMCO and deleting its namespace.
- **BYOH** – Bring-your-own-host Windows instances let you repurpose existing Windows Server VMs and add them as nodes; useful for migration or to reduce disruption when a Windows server is offline. Supported on OpenShift 4.8 and later.

The official Windows containers documentation covers enabling/disabling workloads, creating machine sets per platform, scheduling, upgrades, and removal.

---

## Edge computing and compact clusters

**Edge computing** runs workloads closer to data sources (telco, retail, manufacturing). OpenShift supports several patterns:

- **Single-node OpenShift (SNO)** – One node runs both control plane and workloads. Used for edge, small sites, or development. Installation has specific requirements (CPU, memory, disk); the cluster is not highly available.
- **Two-node cluster** – Two nodes for control plane and optionally compute; documented topology for edge or small HA.
- **Three-node cluster** – Compact cluster with three nodes; some edge and telco use cases.
- **Zero Touch Provisioning (ZTP)** – Deploy and configure clusters at scale using GitOps and the Assisted Installer; you prepare a hub cluster, define site configs, and ZTP provisions and configures edge clusters (e.g. far-edge sites). Used with ACM and TALM (Topology Aware Lifecycle Manager) for day-2 updates.
- **Image-based install** – Install or upgrade using a pre-built disk image (factory or edge image-based install). Reduces dependency on the network during install and supports disconnected or restricted edge sites.
- **Red Hat Device Edge, MicroShift** – Lightweight options for very small footprints; see the product documentation for scope and support.

Edge documentation covers ZTP, image-based install, day-2 operations (observability, security, troubleshooting, updates), and telco/CNF use cases.

---

## AI workloads on OpenShift

OpenShift provides a **secure, scalable foundation** for AI workloads: training, inference, and data science workflows. Support is delivered in part through **Operators** and workload APIs.

- **Kueue** – A job queueing system for Kubernetes. You can use Kueue to manage batch and ML jobs: quotas, fair sharing, cohort-based scheduling, gang scheduling, and integration with custom resources. Install Kueue via the provided Operator; configure quotas, RBAC, and monitoring of pending workloads. Supports disconnected install.
- **JobSet** – Operator for managing groups of Jobs (e.g. multi-worker training jobs). Use the JobSet operator for ML training workloads that require coordinated Jobs.
- **Leader Worker Set** – Operator for leader/worker patterns; useful for distributed training or inference topologies.
- **Red Hat OpenShift AI** – Full AI platform (not covered in depth here); see the Red Hat OpenShift AI documentation for model development, delivery, and serving.

The official AI workloads documentation covers installing and configuring these operators and running AI workloads on OpenShift.

---

## Hardware accelerators

**Hardware accelerators** (GPUs, NPUs, ASICs, DPUs) are important for AI/ML: training and serving of large language and other foundational models. OpenShift supports specialized hardware through **device plugins** and **Operators**.

- **GPUs** – NVIDIA and AMD GPU Operators are available; they install device plugins and drivers (where applicable) so pods can request and use GPUs. Use node selectors and resource limits to schedule GPU workloads.
- **Other accelerators** – Documentation covers Intel Gaudi AI accelerators, RDMA (Remote Direct Memory Access), and the Dynamic Accelerator Slicer. Use the hardware accelerators documentation for your card and driver matrix.
- **Disconnected** – Some accelerators and drivers are designed for disconnected environments; check the docs for support and installation.

Red Hat combines OpenShift with Red Hat OpenShift AI for an enterprise AI platform; hardware Operators use the Kubernetes framework to expose accelerator resources to the cluster.

---

## Single-node and two-node clusters

- **Single-node OpenShift (SNO)** – A **single node** runs the entire cluster (control plane and workloads). Minimum CPU, memory, and disk are documented. Use for edge, small sites, or development; there is no HA. Installation is via the standard installer with a single-node topology; Agent-based and Assisted Installer support SNO. RHCOS and Machine Config Operator apply as in multi-node clusters; some features (e.g. OpenShift Virtualization) have SNO-specific behavior.
- **Two-node cluster** – A **two-node** topology (e.g. one control plane node and one compute node, or two nodes sharing roles) is documented for edge and resource-constrained environments. Check the “Installing a two-node cluster” documentation for requirements and steps.

See [2. Installation](./2-installation.md) and the official installing on single-node and two-node guides for details.

---

## Migration Toolkit for Containers

The **Migration Toolkit for Containers (MTC)** lets you **migrate stateful application workloads** between OpenShift 4 clusters at the **namespace** level. You can also migrate from **OpenShift 3 to 4** using a separate migration path and the legacy MTC Operator on the 3.x source.

- **Install** – Install the Migration Toolkit for Containers Operator via OLM (OpenShift 4.6 and later); configure **object storage** as a replication repository.
- **Migrate** – Use the MTC web console or CLI to create migration plans (MigPlan), run migrations, and move namespaces (including PVCs and images where supported). You can use hooks, exclude resources, and tune the migration controller for large migrations.
- **Advanced** – Direct image migration (registry route), proxies, API-based migration, state migration, and migration hooks are documented under advanced migration options.

Premigration checklists and troubleshooting guides are in the official Migration Toolkit for Containers documentation. For 3→4 migration, see “Migrating from OpenShift 3 to 4” in the docs.

---

## Extensions (OLM v1)

OpenShift is evolving how **extensions** (and in the future, some Operator lifecycle features) are managed. **OLM v1** and **Extensions** provide a model for discovering, installing, and managing extensions from a catalog. The exact feature set and UI depend on your OpenShift version; the official Extensions documentation describes the current approach. Use it together with the existing OperatorHub and OLM documentation for installing and managing Operators and extensions.

---

## References

Use these only when you want more or the latest from the official documentation. Select your OpenShift version from the version selector on the docs site.

**Windows containers**

- [Windows containers overview](https://docs.redhat.com/en/documentation/openshift_container_platform/html/windows_containers/)
- [Enabling Windows container workloads](https://docs.redhat.com/en/documentation/openshift_container_platform/html/windows_containers/enabling-windows-container-workloads)
- [Creating Windows machine sets](https://docs.redhat.com/en/documentation/openshift_container_platform/html/windows_containers/creating_windows_machinesets/)
- [Scheduling Windows workloads](https://docs.redhat.com/en/documentation/openshift_container_platform/html/windows_containers/scheduling-windows-workloads)

**Edge and compact clusters**

- [Edge computing](https://docs.redhat.com/en/documentation/openshift_container_platform/html/edge_computing/)
- [Installing on a single node](https://docs.redhat.com/en/documentation/openshift_container_platform/html/installing/installing_sno/)
- [Installing a two-node cluster](https://docs.redhat.com/en/documentation/openshift_container_platform/html/installing/installing_two_node_cluster/)
- [Zero Touch Provisioning (ZTP)](https://docs.redhat.com/en/documentation/openshift_container_platform/html/edge_computing/ztp-preparing-the-hub-cluster)
- [Image-based install](https://docs.redhat.com/en/documentation/openshift_container_platform/html/edge_computing/image_base_install/)

**AI and hardware**

- [AI workloads on OpenShift](https://docs.redhat.com/en/documentation/openshift_container_platform/html/ai_workloads/)
- [Kueue](https://docs.redhat.com/en/documentation/openshift_container_platform/html/ai_workloads/kueue/)
- [JobSet operator](https://docs.redhat.com/en/documentation/openshift_container_platform/html/ai_workloads/jobset_operator/)
- [Hardware accelerators](https://docs.redhat.com/en/documentation/openshift_container_platform/html/hardware_accelerators/)
- [Red Hat OpenShift AI](https://docs.redhat.com/en/documentation/red_hat_openshift_ai_self-managed/)

**Migration and extensions**

- [Migration Toolkit for Containers](https://docs.redhat.com/en/documentation/openshift_container_platform/html/migration_toolkit_for_containers/)
- [Migrating from OpenShift 3 to 4](https://docs.redhat.com/en/documentation/openshift_container_platform/html/migrating_from_ocp_3_to_4/)
- [Extensions (OLM v1)](https://docs.redhat.com/en/documentation/openshift_container_platform/html/extensions/)

[← Back to OpenShift deep dive](./README.md)
