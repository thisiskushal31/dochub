# OpenShift Container Platform

Hands-on notes for **OpenShift Container Platform** (OCP): Red Hat’s Kubernetes-based container platform for deploying and managing containerized applications. **Read each topic file fully**—concepts, architecture (with diagrams), installation, configuration, development, and operations are explained here. Content and links are **version-agnostic**; select your OpenShift release on the official docs site when you follow references. Use the **References** at the end of each file only when you want more or the latest from the [official Red Hat documentation](https://docs.redhat.com/en/documentation/openshift_container_platform/).

## Topics

### [1. Overview and concepts](./1-overview-and-concepts.md)

What OpenShift Container Platform is; key capabilities; glossary (Pods, Services, Routes, Builds, Projects, Operators, control plane, RHCOS); how OCP works; use cases; installation options; OpenShift Local; next steps for developers and administrators.

### [2. Installation](./2-installation.md)

Installation methods (interactive, Agent-based, automated IPI, full-control UPI); installation program and process; bootstrap, control plane, and compute machines; RHCOS and Ignition; supported platforms; post-install configuration; updating and migrating.

### [3. Configure and manage](./3-configure-and-manage.md)

Postinstallation configuration; backup and restore; storage, nodes, machine management and Machine Config Operator; CLI (`oc`) and web console; scalability and performance; disconnected environments; cluster administrator tasks.

### [4. Develop and Operators](./4-develop-and-operators.md)

Building applications; projects and deployments; images and ImageStreams; builds (BuildConfig, strategies, Shipwright); Operators, OLM, OperatorHub, and the Operator Framework; CI/CD, GitOps, Pipelines; serverless and sandboxed containers.

### [5. Networking, security, and observability](./5-networking-security-observability.md)

Networking (pod networking, Services, Routes, Cluster Network Operator, OVN-Kubernetes, ingress, network policy); authentication and authorization; security and compliance; monitoring, logging, observability, and remote health.

### [6. Service Mesh](./6-service-mesh.md)

Red Hat OpenShift Service Mesh (Istio-based): traffic management, service identity and security, policy enforcement, telemetry; Kiali and distributed tracing; installation and lifecycle.

### [7. OpenShift Virtualization](./7-virtualization.md)

Running and managing VMs on OpenShift: architecture (virt-operator, CDI, HCO), creating and managing VMs, storage and networking, live migration, installation and compatibility.

### [8. etcd and Hosted Control Planes](./8-etcd-hosted-control-planes.md)

etcd overview, backup and restore, performance and scalability; Hosted Control Planes (HCP) architecture, benefits, when to use, and next steps.

### [9. Updating, registry, and API](./9-updating-registry-api.md)

How OpenShift updates work (CVO, Runlevels, OSUS); update channels; connected and disconnected updates; integrated registry (config, storage, securing); OpenShift REST API for automation.

### [10. Windows, edge, AI, and hardware](./10-windows-edge-ai-hardware.md)

Windows containers (WMCO, MachineSets, BYOH); edge computing (single-node, two-node, ZTP, image-based install); AI workloads (Kueue, JobSet, Leader Worker Set); hardware accelerators (GPUs, NPUs, RDMA); Migration Toolkit for Containers; Extensions (OLM v1).

## Learning path

1. [Overview and concepts](./1-overview-and-concepts.md)
2. [Installation](./2-installation.md)
3. [Configure and manage](./3-configure-and-manage.md)
4. [Develop and Operators](./4-develop-and-operators.md)
5. [Networking, security, and observability](./5-networking-security-observability.md)
6. [Service Mesh](./6-service-mesh.md)
7. [OpenShift Virtualization](./7-virtualization.md)
8. [etcd and Hosted Control Planes](./8-etcd-hosted-control-planes.md)
9. [Updating, registry, and API](./9-updating-registry-api.md)
10. [Windows, edge, AI, and hardware](./10-windows-edge-ai-hardware.md)

## Related

- **[Containerization basics](../../containerization-basic/README.md)** – concepts
- **[Kubernetes](../kubernetes/README.md)** – upstream Kubernetes
- **[Managed services](../../managed-services/README.md)** – ROSA, ARO, and managed OpenShift offerings

## References

Use these only when you want more or the latest from the official documentation. Select your OpenShift release from the version selector on the docs site.

- [OpenShift Container Platform documentation](https://docs.redhat.com/en/documentation/openshift_container_platform/)
- [Introduction to OpenShift Container Platform](https://docs.redhat.com/en/documentation/openshift_container_platform/html/overview)
- [Architecture](https://docs.redhat.com/en/documentation/openshift_container_platform/html/architecture)
- [Learn more about OpenShift](https://docs.redhat.com/en/documentation/openshift_container_platform/html/welcome/learn_more_about_openshift) – task-based navigation
- [Red Hat OpenShift Service Mesh](https://docs.redhat.com/en/documentation/red_hat_openshift_service_mesh/)
- [OpenShift Virtualization](https://docs.redhat.com/en/documentation/openshift_container_platform/html/virt/)
- [etcd](https://docs.redhat.com/en/documentation/openshift_container_platform/html/etcd/) · [Hosted control planes](https://docs.redhat.com/en/documentation/openshift_container_platform/html/hosted_control_planes/)
- [Updating](https://docs.redhat.com/en/documentation/openshift_container_platform/html/updating/) · [Registry](https://docs.redhat.com/en/documentation/openshift_container_platform/html/registry/) · [REST API](https://docs.redhat.com/en/documentation/openshift_container_platform/html/rest_api/)
- [Windows containers](https://docs.redhat.com/en/documentation/openshift_container_platform/html/windows_containers/) · [Edge computing](https://docs.redhat.com/en/documentation/openshift_container_platform/html/edge_computing/) · [AI workloads](https://docs.redhat.com/en/documentation/openshift_container_platform/html/ai_workloads/) · [Hardware accelerators](https://docs.redhat.com/en/documentation/openshift_container_platform/html/hardware_accelerators/)
- [Migration Toolkit for Containers](https://docs.redhat.com/en/documentation/openshift_container_platform/html/migration_toolkit_for_containers/) · [Extensions](https://docs.redhat.com/en/documentation/openshift_container_platform/html/extensions/)

[← Back to Orchestration](../README.md)
