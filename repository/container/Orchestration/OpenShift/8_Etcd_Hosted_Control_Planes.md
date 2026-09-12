# etcd and Hosted Control Planes

[← Back to OpenShift deep dive](./README.md)

This page covers two advanced topics: **etcd** (the cluster’s key-value store) and **Hosted Control Planes (HCP)** (control planes run as workloads on a management cluster). Everything you need to understand their role, operations, and when to use them is here; the links at the end are for further reading only.

## Table of Contents

- [Overview of etcd](#overview-of-etcd)
- [etcd backup and restore](#etcd-backup-and-restore)
- [etcd performance and scalability](#etcd-performance-and-scalability)
- [Hosted control planes overview](#hosted-control-planes-overview)
- [Benefits and architecture of HCP](#benefits-and-architecture-of-hcp)
- [When to use HCP and next steps](#when-to-use-hcp-and-next-steps)
- [References](#references)

---

## Overview of etcd

**etcd** (pronounced “et-see-dee”) is a **consistent, distributed key-value store** that holds small amounts of data across a cluster of machines, often entirely in memory. It is the **primary data store for Kubernetes** and thus for OpenShift: all cluster state (objects, configuration) is stored in etcd.

Benefits of etcd:

- **Consistent uptime** for cloud-native applications; the cluster keeps working even if individual servers fail.
- **Storage and replication** of all cluster state for Kubernetes.
- **Distribution of configuration** to offer redundancy and resiliency for node configuration.

The **default etcd configuration** in OpenShift is optimized for container orchestration; use it as designed for best results. How etcd works (leader election, log replication, quorum) is described in the official etcd documentation; the following sections summarize backup, restore, and performance.

---

## etcd backup and restore

etcd **persists the state of all resource objects**. Backing up and restoring etcd is part of control plane backup and restore and disaster recovery.

**Backup:**

- Back up etcd **regularly** and store backups in a **secure location**, ideally outside the OpenShift environment.
- **Do not** take an etcd backup before the **first certificate rotation** completes (about 24 hours after installation), or the backup will contain expired certificates.
- Prefer backups during **non-peak** hours; etcd snapshot has high I/O cost.
- **Before every update**, take an etcd backup. When restoring, you must use a backup from the **same z-stream release** (e.g. 4.17.x backup for a 4.17.x cluster).
- **Important:** Perform a **single** backup invocation on **one** control plane host. Do not back up each control plane host separately for the same cluster.

**Restore:** After you have an etcd backup, you can **restore to a previous cluster state** using the procedures in the control plane backup and restore and disaster recovery documentation. Restoring to a different z-stream is not supported; use a backup from the same release.

**Automation:** The docs describe how to create **automated (recurring)** etcd backups and how to perform a single manual backup. Use the official backup and restore documentation for your OpenShift version.

---

## etcd performance and scalability

Reliable etcd performance depends on several factors. The official documentation covers:

- **Leader election and log replication** – How etcd achieves consensus; failure modes and learner design.
- **Node scaling** – Adding or replacing control plane nodes; use assisted installer or documented procedures. Restoring to a previous cluster state may be required if a control plane node is lost.
- **Disk latency** – etcd is sensitive to disk I/O latency; use fast, durable storage for etcd data and follow sizing guidance.
- **Consensus latency** – Monitoring and understanding consensus latency between etcd members.
- **Moving etcd to a different disk** – Procedures when you need to relocate etcd data.
- **Defragmentation** – Defragmenting etcd data to reclaim space and maintain performance.
- **Tuning parameters** – Customizing etcd tuning (e.g. heartbeat interval, election timeout) via feature gates or documented tuning; use with care.
- **Database size** – Understanding and, when necessary, increasing the etcd database size limit.
- **Network** – Peer round-trip time and network jitter between control plane nodes affect etcd; the docs describe measuring and addressing latency.
- **Kubernetes API transaction rate** – Understanding the API transaction rate in your environment (e.g. with kube-burner) helps size and tune etcd.

Recommended practices for etcd (sizing, hardware, redundancy) are in the official etcd and scalability documentation. Follow them when planning and growing clusters.

---

## Hosted control planes overview

OpenShift can be deployed with two control plane configurations:

1. **Standalone (traditional)** – Dedicated virtual or physical machines host the control plane. The control plane and data plane (workers) form one cluster with a shared network.
2. **Hosted control planes (HCP)** – Control planes run as **pods on a management cluster** (a “hosting” or “management” cluster). There are **no dedicated VMs or physical machines** for each tenant cluster’s control plane. The **data plane** (worker machines) can be in a different network or cloud account.

Hosted control planes are enabled by default in OpenShift and are used with **Red Hat Advanced Cluster Management (ACM)** and the **Multicluster Engine (MCE)**. You do not need ACM to use HCP; MCE is part of ACM but can be used independently for HCP. HCP is supported on: bare metal (Agent), non–bare metal Agent (technology preview), OpenShift Virtualization, AWS, IBM Z, IBM Power, and OpenStack (e.g. 17.1 as technology preview). The official docs list current platform support.

---

## Benefits and architecture of HCP

**Benefits:**

- **Stronger security boundaries** – Control plane is decoupled and hosted on a dedicated management cluster. Credentials and infrastructure secrets are less likely to leak to tenant workloads; cluster infrastructure admins cannot accidentally delete control plane infrastructure from the tenant side.
- **Cost** – Many control planes can run on fewer nodes; clusters are more affordable.
- **Faster creation** – Control planes are pods; they start quickly. The same operational principles (monitoring, logging, autoscaling) apply to control planes as to other workloads.
- **Infrastructure isolation** – Registries, HAProxy, monitoring, storage nodes can be pushed to the tenant’s cloud account, isolating usage per tenant.
- **Centralized operations** – Multicluster management is more centralized; SREs have one place to debug and navigate to cluster data planes, which can shorten time to resolution.

**Architecture:** In the standalone model, the control plane (API, storage, scheduler, actuators) and data plane (compute, storage, networking) are **coupled** on dedicated nodes with a shared network. With HCP, the **data plane** is on a separate network domain and physical environment; the **control plane** is hosted using Kubernetes primitives (Deployments, StatefulSets) on the management cluster and is treated like any other workload. The official documentation includes an architecture diagram comparing the two models.

---

## When to use HCP and next steps

Use **hosted control planes** when you need:

- Many clusters with lower cost and faster provisioning.
- Strong separation between management and tenant workloads.
- Centralized multicluster operations (with or without full ACM).

Next steps include: preparing the management cluster (MCE/ACM, CLI, requirements, sizing), **deploying** HCP clusters (per platform: AWS, bare metal, Virtualization, IBM Z/Power, OpenStack), **managing** (nodes, machine config, networking, certificates, authentication, observability), **updating** HCP, **disconnected** installs, **backup and restore** (including etcd recovery for HCP), and **destroying** HCP clusters. Each platform has its own deploy, manage, and destroy procedures in the hosted control planes documentation.

---

## References

Use these only when you want more or the latest from the official documentation. Select your OpenShift version from the version selector on the docs site.

**etcd**

- [Overview of etcd](https://docs.redhat.com/en/documentation/openshift_container_platform/html/etcd/etcd-overview)
- [Backing up and restoring etcd data](https://docs.redhat.com/en/documentation/openshift_container_platform/html/etcd/etcd-backup-restore-etcd-backup)
- [etcd performance and scalability](https://docs.redhat.com/en/documentation/openshift_container_platform/html/etcd/etcd-performance)
- [Recommended etcd practices](https://docs.redhat.com/en/documentation/openshift_container_platform/html/etcd/etcd-practices)
- [Control plane backup and restore / Disaster recovery](https://docs.redhat.com/en/documentation/openshift_container_platform/html/backup_and_restore/)

**Hosted control planes**

- [Hosted control planes](https://docs.redhat.com/en/documentation/openshift_container_platform/html/hosted_control_planes/)
- [Hosted control planes overview](https://docs.redhat.com/en/documentation/openshift_container_platform/html/hosted_control_planes/hcp-overview)
- [Preparing to use hosted control planes](https://docs.redhat.com/en/documentation/openshift_container_platform/html/hosted_control_planes/hcp-prepare/)
- [Deploying hosted control planes](https://docs.redhat.com/en/documentation/openshift_container_platform/html/hosted_control_planes/hcp-deploy/)
- [Managing hosted control planes](https://docs.redhat.com/en/documentation/openshift_container_platform/html/hosted_control_planes/hcp-manage/)
- [Recovering an unhealthy etcd cluster (HCP)](https://docs.redhat.com/en/documentation/openshift_container_platform/html/hosted_control_planes/hcp_high_availability/hcp-recovering-etcd-cluster)

[← Back to OpenShift deep dive](./README.md)
