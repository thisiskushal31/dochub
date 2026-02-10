# OpenShift Virtualization

[← Back to OpenShift deep dive](./README.md)

This page covers **OpenShift Virtualization** (Red Hat OpenShift Virtualization): the ability to run and manage **virtual machines (VMs)** on OpenShift alongside container workloads. You can create and manage Linux and Windows VMs, import and clone existing VMs, attach storage and networks, and perform live migration. Everything you need to understand and plan for virtualization is here; the links at the end are for further reading only.

## Table of Contents

- [What is OpenShift Virtualization?](#what-is-openshift-virtualization)
- [What you can do with OpenShift Virtualization](#what-you-can-do-with-openshift-virtualization)
- [Architecture and operators](#architecture-and-operators)
- [Creating and managing VMs](#creating-and-managing-vms)
- [Storage and networking for VMs](#storage-and-networking-for-vms)
- [Live migration](#live-migration)
- [Installation and compatibility](#installation-and-compatibility)
- [References](#references)

---

## What is OpenShift Virtualization?

OpenShift Virtualization provides **scalable, enterprise-grade virtualization** on OpenShift. You can manage VMs exclusively or run **pod and VM workloads alongside each other** in the same cluster. OpenShift Virtualization adds Kubernetes custom resources (CRs) to enable virtualization tasks: creating VMs, attaching disks and networks, connecting to consoles, and migrating VMs.

OpenShift Virtualization works with the **OVN-Kubernetes** network plugin (and other certified CNI plugins in self-managed OpenShift; check certified CNI documentation for your platform). You can use OpenShift Data Foundation (ODF) and other storage solutions for VM disks; the official docs describe storage requirements and best practices (e.g. dedicated storage class for Windows VM disks when using ODF).

---

## What you can do with OpenShift Virtualization

- **Create and manage Linux and Windows VMs** – Define VMs with VirtualMachine and related resources; start, stop, pause, and delete them.
- **Run pods and VMs together** – Same cluster runs both containerized and VM workloads; you schedule VMs onto nodes that support virtualization.
- **Connect to VMs** – Use the web console (Virtualization perspective), serial/console access, SSH, or the **virtctl** CLI to access VMs.
- **Import and clone existing VMs** – Migrate from VMware, Red Hat Virtualization, OpenStack, or other sources; clone from templates or existing disks.
- **Manage NICs and storage** – Attach network interfaces and persistent or ephemeral disks to VMs; use storage classes and DataVolumes for disk lifecycle.
- **Live migrate VMs between nodes** – Move running VMs to another node for maintenance or load balancing without downtime (within supported configurations).

You manage the cluster and virtualization resources from the **Virtualization** perspective in the OpenShift web console and with the `oc` and **virtctl** CLIs.

---

## Architecture and operators

OpenShift Virtualization is delivered as **Operators** installed via OLM:

- **Compute: virt-operator** – Core KubeVirt component; deploys virt-api, virt-controller, and virt-handler. The **KubeVirt** CR is created by the HyperConverged Operator and drives the virtualization control plane.
- **Storage: cdi-operator** – Containerized Data Importer (CDI); handles importing, cloning, and uploading VM disks (DataVolumes).
- **Network: cluster-network-addons-operator** – Provides network add-ons used by VMs (e.g. bridge, masquerade).
- **Scaling: ssp-operator** – Template and common tuning for VMs at scale.

The **HyperConverged Cluster Operator (HCO)** is the single entrypoint: you create a **HyperConverged** CR, and the HCO deploys and configures the other operators (KubeVirt, CDI, etc.) via its reconciliation loop. Additional components include the Hostpath Provisioner (HPP) Operator for local storage; you create a `hostpath-provisioner` CR to enable it.

VM workloads run as pods: each VM is backed by a **VMI (VirtualMachineInstance)** and supporting pods (virt-launcher, etc.). The official architecture documentation describes the component diagram and how the control plane and data plane interact.

---

## Creating and managing VMs

You create VMs by defining **VirtualMachine** and optionally **VirtualMachineInstance** resources. You specify CPU, memory, disks (from DataVolumes or PVCs), and networks. You can use the web console (Virtualization → Create Virtual Machine) or apply YAML. **DataVolumes** manage the lifecycle of VM disks: they can pull from a URL (import), clone from a PVC, or create empty PVCs. The CDI operator handles the import/clone workflow.

Once a VM is created, you can:

- **Control state** – Start, stop, restart, pause, migrate (where supported).
- **Edit** – Change resources, boot order, or add/remove disks/NICs within supported limits.
- **Access** – Console (VNC or serial), SSH (with guest agent), or virtctl (e.g. `virtctl console`, `virtctl ssh`).
- **Export** – Export VMs to external formats for backup or migration.
- **Delete** – Remove VMs and optionally associated storage; delete protection can be enabled to avoid accidental deletion.

The official documentation covers creating VMs (wizard and YAML), advanced VM management (templates, node placement, maintenance, failover), and troubleshooting.

---

## Storage and networking for VMs

**Storage** – VM disks are backed by **PersistentVolumeClaims**. You configure **StorageProfiles** and use **DataVolumes** for import, clone, or blank disks. OpenShift Virtualization supports various storage classes (e.g. ODF, vSphere, NFS, hostpath). Scratch space for CDI operations and FS overhead for PVCs are documented; use the storage configuration overview and provider-specific guides for your platform.

**Networking** – VMs use pod networking or dedicated VM networks. You can attach **bridge** or **masquerade** interfaces; for multi-network or SR-IOV, the multiple networks and networking documentation applies. VM networking docs cover default networks, secondary networks, and service exposure.

---

## Live migration

**Live migration** moves a running VM from one node to another with minimal downtime. You configure live migration (bandwidth, network) and then initiate migration from the console or CLI. Cross-cluster live migration (CCLM) is supported in some configurations with a replication repository and network setup; the docs describe prerequisites, configuring the migration network, and initiating migration. Use the official live migration and Migration Toolkit for Virtualization (MTV) provider documentation when planning migrations from VMware or other platforms.

---

## Installation and compatibility

Install OpenShift Virtualization by installing the **Red Hat OpenShift Virtualization Operator** from OperatorHub. After the Operator is installed, create the **HyperConverged** CR to deploy all components. The docs describe preparing the cluster (node requirements, feature gates if needed), installing, and uninstalling. OpenShift Virtualization is designed to work with specific OpenShift and ODF versions; check the supported cluster version and release notes for your release. On single-node OpenShift (SNO), some differences and limitations apply—see the SNO-specific virtualization documentation if you use that topology.

---

## References

Use these only when you want more or the latest from the official documentation. Select your OpenShift version from the version selector on the docs site.

- [OpenShift Container Platform – Virtualization](https://docs.redhat.com/en/documentation/openshift_container_platform/html/virt/)
- [About OpenShift Virtualization](https://docs.redhat.com/en/documentation/openshift_container_platform/html/virt/about_virt/about-virt)
- [OpenShift Virtualization architecture](https://docs.redhat.com/en/documentation/openshift_container_platform/html/virt/about_virt/virt-architecture)
- [Getting started with OpenShift Virtualization](https://docs.redhat.com/en/documentation/openshift_container_platform/html/virt/getting_started/virt-getting-started)
- [Creating VMs](https://docs.redhat.com/en/documentation/openshift_container_platform/html/virt/creating_vm/)
- [Managing VMs](https://docs.redhat.com/en/documentation/openshift_container_platform/html/virt/managing_vms/)
- [Storage configuration](https://docs.redhat.com/en/documentation/openshift_container_platform/html/virt/storage/)
- [Live migration](https://docs.redhat.com/en/documentation/openshift_container_platform/html/virt/live_migration/)
- [OpenShift Virtualization release notes](https://docs.redhat.com/en/documentation/openshift_container_platform/html/virt/release_notes/)
- [Red Hat Ecosystem Catalog – OpenShift Virtualization](https://red.ht/workswithvirt)

[← Back to OpenShift deep dive](./README.md)
