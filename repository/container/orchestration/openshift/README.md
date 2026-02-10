# OpenShift Container Platform

Hands-on notes for **OpenShift Container Platform** (OCP): Red Hat’s Kubernetes-based container platform for deploying and managing containerized applications. Content in this section is based on the [official Red Hat documentation](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/). Read each topic file for concepts and procedures; use the **References** at the end of each file for the latest and full detail from Red Hat.

## Topics

### [1. Overview and concepts](./1-overview-and-concepts.md)

What OpenShift Container Platform is; key capabilities; glossary (Pods, Services, Routes, Builds, Projects, Operators); how OCP works (nodes, RHCOS, container runtime, kubelet, networking, registry, OperatorHub); installation options; OpenShift Local; next steps for developers and administrators.

### [2. Installation](./2-installation.md)

Installation overview; supported platforms (AWS, Azure, GCP, bare metal, vSphere, and others); cluster installation types; links to official install procedures.

### [3. Configure and manage](./3-configure-and-manage.md)

Postinstallation configuration; backup and restore; storage, nodes, machine management; CLI (`oc`) and web console; scalability and performance.

### [4. Develop and Operators](./4-develop-and-operators.md)

Building applications; images and ImageStreams; registry; Operators and OperatorHub; builds (BuildConfig, Shipwright); deployments; GitOps and pipelines.

### [5. Networking, security, and observability](./5-networking-security-observability.md)

Networking overview; network operators; ingress and load balancing; authentication and authorization; security and compliance; monitoring, logging, and observability.

## Learning path

1. [Overview and concepts](./1-overview-and-concepts.md)
2. [Installation](./2-installation.md)
3. [Configure and manage](./3-configure-and-manage.md)
4. [Develop and Operators](./4-develop-and-operators.md)
5. [Networking, security, and observability](./5-networking-security-observability.md)

## Official documentation

- [OpenShift Container Platform 4.21](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/) – full documentation index
- [Overview](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html/overview)
- [Architecture](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html/architecture)
- [Installation overview](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html/installation_overview)
- [Getting started (4.17)](https://docs.redhat.com/en/documentation/openshift_container_platform/4.17/html/getting_started/) – OpenShift overview chapter used for concepts in this repo

## Related

- **[Containerization basics](../../containerization-basic/README.md)** – concepts
- **[Kubernetes](../kubernetes/README.md)** – upstream Kubernetes
- **[Managed services](../../managed-services/README.md)** – ROSA, ARO, and managed OpenShift offerings
