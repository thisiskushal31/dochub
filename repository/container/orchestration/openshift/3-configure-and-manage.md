# Configure and manage

[← Back to OpenShift deep dive](./README.md)

This page covers post-install configuration and day-2 operations: postinstallation tasks, backup and restore, storage, nodes and machine management, the CLI and web console, scalability and performance, disconnected environments, and the main cluster administrator tasks. Everything you need to operate the cluster is here; the links at the end are for further reading only.

## Table of Contents

- [Postinstallation configuration](#postinstallation-configuration)
- [Backup and restore](#backup-and-restore)
- [Storage](#storage)
- [Nodes and machine management](#nodes-and-machine-management)
- [Machine configuration](#machine-configuration)
- [CLI and web console](#cli-and-web-console)
- [Scalability and performance](#scalability-and-performance)
- [Disconnected environments](#disconnected-environments)
- [Cluster administrator task map](#cluster-administrator-task-map)
- [References](#references)

---

## Postinstallation configuration

After the cluster is installed, you perform **postinstallation configuration**. This includes enabling optional **cluster capabilities** (e.g. node tuning, bare metal provisioning), configuring authentication and identity providers, setting up the registry and image content, and applying cluster-wide customizations. The installation program delivers a working cluster; post-install is where you tailor it to your environment. Available customizations are documented under “Available cluster customizations” in the official docs—use them to configure resources, policies, and integrations without modifying the core install.

---

## Backup and restore

OpenShift provides procedures for **backing up and restoring** your cluster. Two main areas:

- **Control plane backup and restore** – Backing up and restoring the cluster’s control plane state (etcd, API server, etc.) so you can recover from control plane failure or restore to a previous cluster state. The docs describe scenarios (e.g. restoring to a previous cluster state) and step-by-step procedures.
- **Application backup and restore** – Backing up and restoring application data and state, often using the OpenShift API for Data Protection (OADP) and provider-specific plugins (e.g. for AWS, Azure, GCP). Use cases include disaster recovery, migration, and restoring 3scale or other applications.

Follow the official backup and restore documentation for your OpenShift version and storage/cloud provider.

---

## Storage

OpenShift supports many types of storage for on-premises and cloud. You manage container storage for **persistent** and **non-persistent (ephemeral)** data.

- **Persistent storage** – Storage that outlives pods. You configure **storage classes**, create **PersistentVolumeClaims (PVCs)**, and attach them to workloads. The cluster can dynamically provision **PersistentVolumes (PVs)** based on storage class. OpenShift and Red Hat offer operators and integrations for various back ends (e.g. OpenShift Data Foundation, cloud block and file storage).
- **Ephemeral storage** – Temporary storage tied to a pod’s lifecycle (e.g. emptyDir). Useful for caches and scratch space.

Understanding persistent storage, storage classes, and how to request and bind storage is essential for stateful applications. The official storage documentation covers storage types, dynamic provisioning, and provider-specific configuration.

---

## Nodes and machine management

**Nodes** are the machines (physical or virtual) that run your workloads. OpenShift distinguishes **control plane nodes** (running the API server, scheduler, controllers, etcd) and **compute (worker) nodes** (running application pods).

**Machine management** is done through the **Machine API**. You use **MachineSets** to add, remove, and manage worker machines (and in some setups, control plane machines). A MachineSet is a cluster-scoped resource that looks like a “replica set for machines”: you specify a template (provider spec: instance type, zone, subnet, etc.) and a replica count. The cluster creates or deletes machine objects to match. Example (conceptually): a MachineSet for AWS might specify `m5.xlarge` in `us-east-1a` with replicas `3`; the Machine API creates three Machine resources, and each Machine is provisioned by the cloud provider and joins the cluster as a node. You can deploy **machine health checks** so unhealthy machines are replaced automatically, and you can apply **autoscaling** (ClusterAutoscaler, or provider-specific) so the number of machines grows or shrinks based on demand. For infrastructure that should not run user workloads (e.g. ingress or monitoring), you can create **infrastructure machine sets** and taint those nodes so only specific workloads schedule there. List MachineSets with `oc get machinesets -A` and inspect a node’s machine with `oc describe node <name>`.

Control plane and worker nodes are updated and managed through the Machine API and Operators; the control plane is managed by OpenShift, and you scale or change worker nodes by editing MachineSets and related resources.

---

## Machine configuration

The **Machine Config Operator (MCO)** manages the base operating system and container runtime configuration of cluster machines. It applies configuration from **machine configs** and **machine config pools (MCPs)**. Machine config pools group machines by role (e.g. worker, master). You can change kernel arguments, add files, configure systemd units, or enable extensions (e.g. RHEL kernel modules) through machine configs. The **Machine Config Daemon (MCD)** runs on each node and applies the configuration; it also detects **configuration drift** (when the node’s state does not match what the machine config specifies). Only the installation program and the MCO should change machine configuration; this keeps nodes consistent and upgradeable.

---

## CLI and web console

**OpenShift CLI (`oc`)** – The primary command-line tool for OpenShift. You use `oc` to create and manage projects, deployments, services, routes, builds, and operators; to run and debug pods; and to perform cluster administration. Many commands are similar to `kubectl` (OpenShift embeds Kubernetes); `oc` adds OpenShift-specific resources (projects, routes, build configs, etc.). You log in with `oc login` (you will be prompted for server and credentials or use `--server` and `--token`). Common workflows:

- **Projects:** `oc new-project myapp`, `oc project myapp`, `oc get projects`
- **Workloads:** `oc get pods`, `oc get deploy`, `oc describe pod <name>`, `oc logs -f <pod>`, `oc exec -it <pod> -- /bin/sh`
- **Deploy from image or Git:** `oc new-app https://github.com/org/repo` or `oc new-app myimage:tag`
- **Expose a Service as a Route:** `oc expose svc/myapp --hostname=myapp.example.com`
- **Rollouts:** `oc rollout status deployment/myapp`, `oc rollout undo deployment/myapp`, `oc set image deployment/myapp myapp=myimage:newtag`
- **Builds:** `oc start-build mybuild`, `oc get builds`, `oc logs -f bc/mybuild`
- **Admin:** `oc get nodes`, `oc get machinesets -A`, `oc get clusteroperators`

**Developer CLI (`odo`)** – A developer-focused CLI for building and deploying applications on OpenShift. It abstracts many Kubernetes and OpenShift concepts so developers can work with components and applications without writing YAML by hand. Useful for iterative development and multi-component apps.

**Web console** – The OpenShift web UI. It has two main perspectives:
- **Administrator** – For cluster admins: nodes, machines, operators, monitoring, security, configuration, and cluster-wide settings.
- **Developer** – For developers: projects, applications, deployments, builds, topology view, and pipelines. You can deploy from Git, images, or the catalog; view and connect components in the Topology view; and manage resources visually.

Use the official CLI and web console documentation for command reference and UI workflows.

---

## Scalability and performance

OpenShift documentation covers **scalability and performance** for production:

- **Cluster limits** – Recommended limits for nodes, pods, and other objects so the cluster remains stable.
- **Control plane sizing** – Sizing and best practices for control plane nodes and etcd (I/O latency, disk, memory).
- **Node tuning** – The **Node Tuning Operator** lets you tune node-level settings (e.g. huge pages, CPU affinity) for workloads. You create Tuned custom resources that apply to specific nodes or pools.
- **Scaling cluster monitoring** – Adjusting the monitoring stack (Prometheus, etc.) for large clusters so scraping and storage remain within limits.
- **Networking, storage, and routes** – Tuning and best practices for network plugins, storage classes, and route sharding.

Recommended practices for infrastructure, control plane, and etcd are in the official scalability and performance section; follow them when planning and growing clusters.

---

## Disconnected environments

In **disconnected** (air-gapped) environments, cluster machines do not have direct access to the internet. You:

- **Mirror** OpenShift release images and operator catalogs into a **mirror registry** that the cluster can reach.
- Use that mirror registry for installs and for **updates**.
- Run the **OpenShift Update Service** in the disconnected environment so the cluster can receive update recommendations based on the mirrored graph.

The disconnected documentation explains how to mirror images and operators and how to configure the cluster and the update service. User-provisioned infrastructure and Agent-based or Assisted Installer flows are commonly used for disconnected installs.

---

## Cluster administrator task map

A useful way to organize day-2 work is by area:

- **Understand OpenShift management** – Control plane architecture, Machine API (machine sets, health checks, autoscaling), Operators (how they run and are updated), and etcd (redundancy, backup).
- **Enable cluster capabilities** – Optional capabilities (e.g. node tuning, bare metal provisioning) that you enable after install.
- **Manage cluster components** – Compute and control plane via machine sets; machine health checks; autoscaling; container registries; users, groups, and authentication; identity providers; certificates (ingress, API server, service-serving); networking (Cluster Network Operator, multiple networks, network policy); Operators; Windows containers if used.
- **Change cluster components** – **Updates** (via web console or CLI; in disconnected, via local OpenShift Update Service); **CRDs** (custom resource definitions) to extend the API and manage resources from Operators; **resource quotas** (per-project or across projects); **pruning** (reclaiming space by removing old builds, images, deployments, etc.); **scale and tune** (cluster monitoring, Node Tuning Operator, scalability and performance practices).

Each of these areas has detailed procedures in the official documentation; use the references below to find the right section.

---

## References

Use these only when you want more or the latest from the official documentation. Select your OpenShift release from the version selector on the docs site.

- [OpenShift Container Platform – Configure](https://docs.redhat.com/en/documentation/openshift_container_platform/)
- [Postinstallation configuration](https://docs.redhat.com/en/documentation/openshift_container_platform/html/post_installation_configuration/)
- [Backup and restore](https://docs.redhat.com/en/documentation/openshift_container_platform/html/backup_and_restore/)
- [Hosted control planes](https://docs.redhat.com/en/documentation/openshift_container_platform/html/hosted_control_planes/)
- [Storage](https://docs.redhat.com/en/documentation/openshift_container_platform/html/storage/)
- [Nodes](https://docs.redhat.com/en/documentation/openshift_container_platform/html/nodes/)
- [Machine management](https://docs.redhat.com/en/documentation/openshift_container_platform/html/machine_management/)
- [Machine configuration](https://docs.redhat.com/en/documentation/openshift_container_platform/html/machine_configuration/)
- [CLI tools](https://docs.redhat.com/en/documentation/openshift_container_platform/html/cli_tools/)
- [Web console](https://docs.redhat.com/en/documentation/openshift_container_platform/html/web_console/)
- [Scalability and performance](https://docs.redhat.com/en/documentation/openshift_container_platform/html/scalability_and_performance/)
- [Disconnected environments](https://docs.redhat.com/en/documentation/openshift_container_platform/html/disconnected_environments/)
- [Learn more about OpenShift – Cluster administrator](https://docs.redhat.com/en/documentation/openshift_container_platform/html/welcome/learn_more_about_openshift#cluster-administrator)

[← Back to OpenShift deep dive](./README.md)
