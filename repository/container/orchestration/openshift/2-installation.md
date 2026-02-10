# Installation

[← Back to OpenShift deep dive](./README.md)

This page explains how OpenShift Container Platform installation works: the four installation methods, the role of the installation program, bootstrap and machine lifecycle, RHCOS, supported platforms, and what to do after install. Everything you need to plan and understand an install is here; the links at the end are for further reading only.

## Table of Contents

- [Four installation methods](#four-installation-methods)
- [About the installation program](#about-the-installation-program)
- [Bootstrap, control plane, and compute](#bootstrap-control-plane-and-compute)
- [RHCOS and Ignition](#rhcos-and-ignition)
- [Installation scope and post-install](#installation-scope-and-post-install)
- [Supported platforms](#supported-platforms)
- [Single-node and two-node clusters](#single-node-and-two-node-clusters)
- [Restricted and disconnected installs](#restricted-and-disconnected-installs)
- [Updating and migrating](#updating-and-migrating)
- [References](#references)

---

## Four installation methods

The OpenShift installation program supports four ways to deploy a cluster:

**1. Interactive (Assisted Installer)** – You deploy a cluster with the web-based Assisted Installer. This is ideal when your network is connected to the internet. The Assisted Installer provides smart defaults, runs pre-flight validations, and offers a REST API for automation and advanced scenarios. You create a cluster configuration in the UI (or via API), download a discovery image, and boot your machines with it. Supported with full integration on Nutanix, vSphere, and bare metal; other platforms are supported without full integration.

**2. Local Agent-based** – You deploy a cluster using the Agent-based Installer, which is well suited to **disconnected or restricted networks**. You download and configure the Agent-based Installer first; configuration is done via CLI. You can also deploy without an external registry using self-contained installation media with a simplified UI similar to the Assisted Installer. You boot machines with a discovery image; an agent on each machine communicates with the installer and handles provisioning.

**3. Automated (installer-provisioned infrastructure, IPI)** – The installation program provisions the infrastructure the cluster runs on. It uses each host’s baseboard management controller (BMC) where applicable for provisioning. You can deploy in connected or disconnected environments. For most clouds (e.g. AWS, Azure, GCP, vSphere), the program creates the VMs, networking, and load balancers. For bare metal, you still provide the physical machines, bootstrap, networking, load balancing, and storage; the program generates the assets and you deploy.

**4. Full control (user-provisioned infrastructure, UPI)** – You prepare and maintain all infrastructure. You use the installation program to generate the assets (e.g. Ignition configs, manifests) required to provision the cluster, then you create the infrastructure and deploy the cluster yourself. You manage and maintain control plane and compute machines, load balancers, cluster networking (DNS, subnets), and storage. This gives maximum customizability and is required on some platforms (e.g. IBM Power, IBM Z, OpenStack). You can run with full internet access, behind a proxy, or in a fully disconnected setup (mirror registry).

Each method produces a cluster with highly available infrastructure (no single points of failure by default) and lets administrators control when updates are applied.

---

## About the installation program

Except when using the Assisted Installer, you obtain the installation program from the Red Hat Hybrid Cloud Console (for OpenShift Container Platform). The installation program is a Go binary that performs a series of file transformations. It works with:

- An **installation configuration file** (`install-config.yaml`) – platform-specific settings, pull secret, cluster name, etc.
- **Kubernetes manifests** – generated from the install config.
- **Ignition config files** – one set per machine type (bootstrap, control plane, compute). These define the exact state of each machine at first boot.

The install config is transformed into Kubernetes manifests, and the manifests are wrapped into Ignition config files. The program uses these to create the cluster. **Important:** The installation program prunes the config files when it runs, so back up any files you want to reuse. You cannot change parameters set during installation; many cluster attributes can be changed only after installation.

For **installer-provisioned infrastructure**, the program acts as a wizard, prompting for values it cannot determine and providing defaults. You can install a standard cluster (minimum required details) or a customized one (e.g. number of control plane machines, VM types, service network CIDR). OpenShift then manages the cluster and the OS on each machine; updates are applied in place.

For **user-provisioned infrastructure**, you run the program to generate assets, then you create the infrastructure and deploy the cluster. You are responsible for the underlying infrastructure, load balancers, DNS, and storage.

---

## Bootstrap, control plane, and compute

When a cluster is provisioned, each machine needs information about the cluster. OpenShift uses a **temporary bootstrap machine** during initial configuration to provide that information to the **permanent control plane**. The sequence is:

1. The **bootstrap machine** boots from an Ignition config that describes how to create the cluster. It hosts the remote resources required for the control plane machines to boot.
2. The bootstrap machine starts a single-node etcd cluster and a **temporary Kubernetes control plane**.
3. The **control plane machines** fetch resources from the bootstrap machine and finish booting. The temporary control plane schedules the **production control plane** onto these machines.
4. The **Cluster Version Operator (CVO)** comes online and installs the etcd Operator, which scales etcd across all control plane nodes.
5. The temporary control plane shuts down; the **production control plane** takes over.
6. The bootstrap machine injects OpenShift components into the production control plane, then the installation program **destroys the bootstrap machine**.
7. The control plane sets up the **compute (worker) nodes** and installs additional services in the form of Operators.

The result is a running OpenShift cluster. The cluster then downloads and configures the rest of the day-to-day components, including creating compute machines in supported environments. The following diagram illustrates this process.

![Creating bootstrap, control plane, and compute machines](../../assets/create-nodes.png)

*Credit: Red Hat. Source: [Installation process](https://docs.openshift.com/container-platform/4.17/installing/overview/index.html) and [Installation overview](https://docs.redhat.com/en/documentation/openshift_container_platform/html/installation_overview), OpenShift Container Platform documentation. Select your version from the [documentation index](https://docs.redhat.com/en/documentation/openshift_container_platform/).*

**Important:** Ignition config files generated by the installer contain certificates that expire after 24 hours (then renewed). If the cluster is down for longer than that, certificate recovery may be needed. Use Ignition configs within about 12 hours of generation to avoid failures if the 24-hour rotation runs during install. When planning the cluster, follow recommended practices for etcd I/O latency and control plane node sizing.

**What you provide vs what the program does:** With **IPI** on a public cloud, the installer creates VMs, subnets, load balancers, and DNS entries; you run the installer binary and supply an `install-config.yaml` (pull secret, cluster name, base domain, platform credentials). With **UPI**, you create the VMs, DNS, and load balancers yourself and run the installer only to *generate* Ignition configs and manifests; you then copy those to the machines and boot them in the correct order (bootstrap first, then control plane, then compute). The installer does not touch your infrastructure.

---

## RHCOS and Ignition

After installation, every cluster machine uses **Red Hat Enterprise Linux CoreOS (RHCOS)** as the operating system. RHCOS is the immutable container host version of Red Hat Enterprise Linux, with a RHEL kernel and **SELinux enabled by default**. It includes the **kubelet** (Kubernetes node agent) and the **CRI-O** container runtime, tuned for Kubernetes.

Every control plane machine in an OpenShift cluster must use RHCOS. RHCOS uses **Ignition** for first-boot provisioning: Ignition manipulates disks (partitioning, formatting, writing files, configuring users). The installation program produces Ignition config files that set the exact state of each machine. After that, the **Machine Config Operator** applies further changes (e.g. new certificates, keys). OS updates are delivered as a bootable container image using **OSTree** as a backend and are applied across the cluster by the Machine Config Operator. Changes are applied in place on each machine as an atomic operation via **rpm-ostree**. So OpenShift manages the OS like any other application: in-place upgrades keep the platform updated. Only the installation program and the Machine Config Operator should change machine configuration; do not modify Ignition or Kubernetes manifests unless following documented procedures or Red Hat support instructions.

---

## Installation scope and post-install

The **scope of the installation program is intentionally narrow**. It is designed for simplicity and a high chance of success. Many configuration tasks are done **after** installation, including:

- Enabling optional **cluster capabilities** (e.g. node tuning, bare metal provisioning).
- Configuring **storage**, **networking**, **authentication**, **certificates**, and **Operators**.
- Setting **resource quotas**, **pruning** resources, and **scaling/tuning** the cluster.

See [3. Configure and manage](./3-configure-and-manage.md) for day-2 operations.

**OpenShift Local** is a separate option for local development: a minimal cluster on your laptop or desktop, not for production. See [Red Hat OpenShift Local](https://developers.redhat.com/products/openshift-local/overview).

---

## Supported platforms

Support depends on the installation method (IPI, UPI, Agent-based, Assisted). In summary:

- **AWS, Azure, GCP** – IPI and UPI.
- **Bare metal** – IPI, UPI, Agent-based, and Assisted (full integration).
- **vSphere** – IPI, UPI, Agent-based, and Assisted.
- **Nutanix** – IPI and Assisted.
- **OpenStack** – IPI and UPI.
- **Azure Stack Hub** – IPI and UPI.
- **IBM Cloud** (Classic and VPC) – IPI (and UPI where applicable).
- **IBM Power, IBM Z / LinuxONE** – UPI, Agent-based, and Assisted.
- **Oracle Cloud (OCI), Oracle Edge** – Agent-based and Assisted.
- **Single-node and two-node** – Special topologies with their own guides.

For IPI, all machines (including the one running the install) typically need direct internet access to pull images and send telemetry. Mixing cloud providers or their components (e.g. storage from one cloud on another) after install is not supported. For UPI, you can run with full internet, behind a proxy, or fully disconnected (mirror registry); on vSphere or bare metal, disconnected installs allow cluster machines to run without direct internet access. Check the [Tested Integrations](https://access.redhat.com/articles/4128421) and platform-specific docs for your exact combination.

---

## Single-node and two-node clusters

**Single-node OpenShift (SNO)** – A single machine runs both the control plane and workloads. There is no high availability: one node is the entire cluster. SNO is suited to **edge**, small remote sites, or development. The installer (IPI, UPI, Agent-based, or Assisted) supports a single-node topology; minimum CPU, memory, and disk are documented. RHCOS and the Machine Config Operator apply as in multi-node clusters; some features (e.g. OpenShift Virtualization) have SNO-specific behavior. See [10. Windows, edge, AI, and hardware](./10-windows-edge-ai-hardware.md#single-node-and-two-node-clusters) and the official “Installing on a single node” documentation for requirements and steps.

**Two-node cluster** – A two-node topology (e.g. one control plane and one compute node) is supported for **edge** or resource-constrained environments. Requirements and installation steps differ from standard multi-node; use the official “Installing a two-node cluster” guide for your platform.

---

## Restricted and disconnected installs

In **disconnected** (air-gapped) installations, you download the images required to install a cluster, place them in a **mirror registry**, and use that registry to install. You need internet access once to pull platform container images; with disconnected install on vSphere or bare metal, cluster machines do not need direct internet access. The docs describe how to mirror and install for each supported platform. The **OpenShift Update Service** can run in a disconnected environment to recommend updates; see the disconnected and updating documentation.

---

## Updating and migrating

After installation:

- **Updating clusters** – OpenShift supports over-the-air (OTA) updates. You can update via the web console or the CLI. The Cluster Version Operator and OpenShift Update Service determine valid update paths. In disconnected environments, you run a local OpenShift Update Service and mirror content.
- **Migrating from OpenShift 3 to 4** – A separate migration path and the Migration Toolkit for Containers are available; see the official migration documentation.

---

## References

Use these only when you want more or the latest from the official documentation.

- [OpenShift Container Platform – Install](https://docs.redhat.com/en/documentation/openshift_container_platform/)
- [Installation overview](https://docs.redhat.com/en/documentation/openshift_container_platform/html/installation_overview)
- [Selecting a cluster installation method and preparing](https://docs.redhat.com/en/documentation/openshift_container_platform/html/installing/overview/installing-preparing)
- [Installing on AWS](https://docs.redhat.com/en/documentation/openshift_container_platform/html/installing/installing_aws/)
- [Installing on Azure](https://docs.redhat.com/en/documentation/openshift_container_platform/html/installing/installing_azure/)
- [Installing on Google Cloud](https://docs.redhat.com/en/documentation/openshift_container_platform/html/installing/installing_gcp/)
- [Installing on bare metal](https://docs.redhat.com/en/documentation/openshift_container_platform/html/installing/installing_bare_metal/)
- [Installing on VMware vSphere](https://docs.redhat.com/en/documentation/openshift_container_platform/html/installing/installing_vsphere/)
- [Assisted Installer](https://access.redhat.com/documentation/en-us/assisted_installer_for_openshift_container_platform)
- [Agent-based Installer](https://docs.redhat.com/en/documentation/openshift_container_platform/html/installing/installing_with_agent_based_installer/)
- [Installing on a single node](https://docs.redhat.com/en/documentation/openshift_container_platform/html/installing/installing_sno/)
- [Installing a two-node cluster](https://docs.redhat.com/en/documentation/openshift_container_platform/html/installing/installing_two_node_cluster/)
- [Disconnected installation mirroring](https://docs.redhat.com/en/documentation/openshift_container_platform/html/disconnected_environments/)
- [Updating clusters](https://docs.redhat.com/en/documentation/openshift_container_platform/html/updating/)
- [Migrating from version 3 to 4](https://docs.redhat.com/en/documentation/openshift_container_platform/html/migrating_from_version_3_to_4/)
- [Validating an installation](https://docs.redhat.com/en/documentation/openshift_container_platform/html/installing/validation_and_troubleshooting/validating-an-installation)
- [Troubleshooting installation](https://docs.redhat.com/en/documentation/openshift_container_platform/html/installing/validation_and_troubleshooting/installing-troubleshooting)

[← Back to OpenShift deep dive](./README.md)
