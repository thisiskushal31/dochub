# Configure and manage

This topic maps **post-install configuration and day-2 operations** to the official OpenShift Container Platform documentation. All procedures and details are in the Red Hat docs; this file summarizes what each area covers and where to find it.

---

## Postinstallation configuration

The **Configure** section in the docs covers day-2 operations:

- **Postinstallation configuration** – tasks after the cluster is installed.
- **Backup and restore** – backing up and restoring OpenShift Container Platform clusters.
- **Hosted control planes** – using hosted control planes with OpenShift.
- **etcd** – redundancy and management of etcd.

Use the official postinstallation and backup/restore guides for step-by-step procedures.

---

## Storage

- **Storage** – configuring and managing persistent storage in OpenShift: understanding persistent storage, storage classes, persistent volume claims, and storage operators.

Details and examples are in the [Storage](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html/storage/) section of the 4.21 docs.

---

## Nodes and machines

- **Nodes** – configuring and managing nodes in OpenShift.
- **Machine management** – adding and maintaining cluster machines (e.g. via the Machine API, MachineSets).
- **Machine configuration** – managing base OS and container runtime configuration and updates (Machine Config Operator, machine config pools).

Control plane and worker nodes are managed and updated through the Machine API and Operators; the architecture and machine management docs describe this in depth.

---

## CLI and web console

- **CLI tools** – using the OpenShift CLI (`oc`) and related tools. The docs describe `oc` and the developer CLI (`odo`).
- **Web console** – getting started with the OpenShift web console, including the **Administrator** and **Developer** perspectives.

For daily operations you will use `oc` and/or the web console; the official docs are the reference for commands and UI workflows.

---

## Scalability and performance

- **Scalability and performance** – scaling the cluster and tuning for production: cluster limits, node tuning (Node Tuning Operator), scaling cluster monitoring, and optimizing networking, storage, and routes.

See the [Scalability and performance](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html/scalability_and_performance/) section for procedures and recommendations.

---

## Disconnected environments

- **Disconnected environments** – managing OpenShift clusters in air-gapped or disconnected environments, including the OpenShift Update Service for update recommendations.

---

## References

- [OpenShift Container Platform 4.21 – Configure](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/)
- [Postinstallation configuration](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html/postinstallation_configuration/)
- [Backup and restore](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html/backup_and_restore/)
- [Hosted control planes](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html/hosted_control_planes/)
- [Storage](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html/storage/)
- [Nodes](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html/nodes/)
- [Machine management](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html/machine_management/)
- [Machine configuration](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html/machine_configuration/)
- [CLI tools](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html/cli_tools/)
- [Web console](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html/web_console/)
- [Scalability and performance](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html/scalability_and_performance/)
- [Disconnected environments](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html/disconnected_environments/)
