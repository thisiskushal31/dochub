# Overview and concepts

[← Back to OpenShift deep dive](./README.md)

This page explains what OpenShift Container Platform is, its main concepts, how it relates to Kubernetes, and how to think about building and running workloads. Diagrams show the architecture and how traffic reaches your app. Everything you need to get oriented is here; the links at the end are for further reading only.

## Table of Contents

- [What is OpenShift Container Platform?](#what-is-openshift-container-platform)
- [Key capabilities](#key-capabilities)
- [Glossary of common terms](#glossary-of-common-terms)
- [How OpenShift works](#how-openshift-works)
- [Use cases](#use-cases)
- [Installation options](#installation-options)
- [OpenShift Local](#openshift-local)
- [Next steps by role](#next-steps-by-role)
- [References](#references)

---

## What is OpenShift Container Platform?

OpenShift Container Platform is a **cloud-based Kubernetes container platform**. Its foundation is Kubernetes, so it shares the same technology and APIs. It is designed so that applications and the data centers that support them can grow from a few machines and apps to thousands of machines serving many clients.

OpenShift is a platform for **developing and running containerized applications**. You get the same technology that powers large-scale telecommunications, streaming, gaming, banking, and similar applications, implemented in open Red Hat technologies so you can extend containerized applications beyond a single cloud to on-premises and multi-cloud environments.

---

## Key capabilities

OpenShift Container Platform enables you to:

- **Provide developers and IT** with cloud application platforms for deploying applications on secure, scalable resources.
- **Keep configuration and management overhead low** so teams can focus on applications.
- **Bring Kubernetes** to your own data centers and to the cloud.
- **Meet security, privacy, compliance, and governance** requirements for enterprise use.

---

## Glossary of common terms

This section defines the main Kubernetes and OpenShift terms you will see in the docs and in this guide.

**Kubernetes** – An open source container orchestration engine for automating deployment, scaling, and management of containerized applications. OpenShift is built on Kubernetes.

**Containers** – Application instances that run in OCI-compliant environments on compute (worker) nodes. A container is the runtime of an OCI-compliant image. A node can run many containers; its capacity is determined by memory and CPU of the underlying resources (cloud, physical, or virtual).

**Pod** – One or more containers deployed together on one host, with shared resources such as volumes and IP addresses. The pod is the smallest compute unit you define, deploy, and manage. In OpenShift, pods replace individual application containers as the smallest deployable unit. All containers in a pod run on the same node. Complex applications are made of many pods, each with their own containers, communicating with each other and with the outside world.

**ReplicaSet and ReplicationController** – Kubernetes objects that ensure the desired number of pod replicas are running. If pods fail or are deleted, these controllers create new ones; if there are more than needed, they scale down to match the desired count.

**Deployment and DeploymentConfig** – OpenShift supports both Kubernetes **Deployment** objects and OpenShift **DeploymentConfig** objects. A **Deployment** defines how an application is rolled out as pods: it specifies the container image, number of replicas, and labels for scheduling. It creates and manages a ReplicaSet and supports rollout strategies for updates. A **DeploymentConfig** adds **change triggers**: when a new container image version is available (or other defined changes occur), it can automatically create a new deployment version, so rollouts can be automated.

**Service** – A logical set of pods and the access policies for reaching them. A service provides a **stable internal IP address and hostname**, so other applications can reach your pods even as pods are created and destroyed. Services connect application components (e.g. front-end to database) and provide internal load balancing. OpenShift injects service information into running containers for discovery.

**Route** – A way to expose a service with an **externally reachable hostname** (e.g. `www.example.com`). A route has a name, a service selector, and optionally security configuration. A **router** processes routes and their service endpoints so external clients can reach your applications. Without the routing layer, traffic from outside the cluster cannot reach the application.

**Build** – The process of turning input (e.g. source code or parameters) into a runnable container image. A **BuildConfig** object defines the entire build workflow. OpenShift can create containers from build images and push them to the integrated container registry.

**Project** – OpenShift uses **projects** so groups of users or developers can work together; they provide isolation and collaboration. A project defines the scope of resources, manages user access, and enforces resource quotas and limits. A project is a Kubernetes **namespace** with additional annotations for RBAC and management. Each project has its own objects, policies, constraints, and service accounts.

**Operators** – The preferred way to package, deploy, and manage applications on OpenShift. An **Operator** encodes human operational knowledge into software that runs inside the cluster. It uses the Kubernetes API and concepts to perform **Day 1** operations (installation, configuration) and **Day 2** operations (scaling, updates, backups, failover, restores). Instead of treating an application as a loose set of pods and services, you manage it as a single logical object with application-specific options.

**Control plane** – The orchestration layer that exposes the API and interfaces to define, deploy, and manage the lifecycle of containers. Control plane machines run the API server, scheduler, controllers, and etcd.

**Installer-provisioned infrastructure (IPI)** – The installation program deploys and configures the infrastructure the cluster runs on (e.g. VMs, networks, load balancers on a cloud provider).

**User-provisioned infrastructure (UPI)** – You provide and maintain the infrastructure; you use the installation program to generate assets (e.g. Ignition configs), then you create the infrastructure and deploy the cluster onto it. Gives maximum control and is required for some platforms.

**Hosted control planes** – A feature that runs a control plane on the cluster using its data plane and workers. Benefits include lower control plane cost, faster cluster creation, and strong network segmentation between control plane and workloads.

**RHCOS (Red Hat Enterprise Linux CoreOS)** – The lightweight, immutable container host OS used by OpenShift nodes. Based on Red Hat Enterprise Linux with SELinux enabled by default. Includes the kubelet and CRI-O container runtime.

**Ignition** – The utility RHCOS uses during initial configuration to manipulate disks: partitioning, formatting, writing files, and configuring users. The installation program generates Ignition config files that define the exact state of each machine at first boot.

---

## How OpenShift works

The following diagram shows the main layers: a **control plane** (API server, etcd, scheduler, controllers, and OpenShift Operators such as the Cluster Network Operator, Machine Config Operator, OLM, and Cluster Version Operator), **worker nodes** running RHCOS with kubelet and CRI-O (where your pods, the router, registry, and builds run), and the **OpenShift layer** that adds Routes, BuildConfig, ImageStreams, Projects, OperatorHub, the integrated registry, and the Machine API on top of Kubernetes.

![OpenShift Container Platform stack: control plane, workers, and OpenShift layer](../../assets/oke-about-ocp-stack-image.png)

*Credit: Red Hat. Source: [About OpenShift Kubernetes Engine](https://docs.openshift.com/container-platform/4.17/welcome/oke_about.html) and [OpenShift Container Platform overview](https://docs.openshift.com/container-platform/4.17/getting_started/openshift-overview.html), OpenShift Container Platform documentation. Select your version from the [documentation index](https://docs.redhat.com/en/documentation/openshift_container_platform/).*

OpenShift Container Platform is a **Kubernetes environment** for managing the lifecycle of container-based applications and their dependencies on various platforms: bare metal, virtualized, on-premises, and cloud. It deploys, configures, and manages containers and is built for usability, stability, and customization.

- **Nodes** run a lightweight, secure OS: **Red Hat Enterprise Linux CoreOS (RHCOS)**. After a node boots and is configured, it gets a **container runtime** (CRI-O or Docker) to run the container workloads scheduled to it.

- The **kubelet** (Kubernetes node agent) on each node schedules container workloads, registers the node with the cluster, and receives workload details from the control plane.

- OpenShift **configures and manages** cluster networking, load balancing, and routing. It also runs cluster services for **monitoring**, **logging**, and **managing upgrades**.

- The **container image registry** and **software catalog** (including OperatorHub) provide Red Hat–certified and community software: application services, databases, frontends, runtimes, and developer tooling. You can manage applications by deploying containers from pre-built images or by using **Operators**. You can build custom images from base images and source code and store them in internal, private, or public registries.

- **Multicluster management** (e.g. with Red Hat Advanced Cluster Management) can manage multiple clusters—deployment, configuration, compliance, and workload distribution—from a single console.

### How a request reaches your application

External traffic does not hit pods directly. It flows **Route → Service → Pods**. The **Route** gives your Service an externally reachable hostname (e.g. `myapp.example.com`). The cluster **router** (ingress controller) watches Routes and, when it receives a request for that hostname, forwards it to the **Service** that the Route targets. The Service has a stable ClusterIP and a **label selector**; it load-balances across the **Pods** that match that selector. So: client → Route (hostname) → router → Service → one of the backing pods. For diagrams of traffic flow and networking, see [Understanding networking](https://docs.redhat.com/en/documentation/openshift_container_platform/html/networking/networking_overview/understanding-networking) in the official OpenShift Container Platform documentation.

---

## Use cases

OpenShift is widely used across industries. Common use cases include:

- **OpenShift Virtualization** – Run VMs and containers on one platform; scale VM workloads; security and compliance for VM environments. Supports migration from VMware, Red Hat Virtualization, OpenStack, and similar platforms.

- **Application modernization and AI/ML** – Containerize and refactor legacy applications; keep business logic while making apps cloud-ready; run model training and inference with standardized ML infrastructure; integrate with data science workflows.

- **Multi-cloud and hybrid cloud** – One consistent platform across on-premises and multiple public clouds; avoid vendor lock-in; optimize where workloads run.

- **DevOps** – Built-in CI/CD and GitOps; developer self-service to ship software faster.

- **Edge computing** – Run workloads closer to data sources (telco, retail, manufacturing); use lightweight patterns such as three-node clusters, single-node clusters, Red Hat Device Edge, or MicroShift.

- **Regulatory compliance** – Security and compliance features for financial services, healthcare, and government.

- **Microservices** – Cloud-native development with service mesh, API management, and serverless.

- **Enterprise SaaS** – Multi-tenant SaaS with consistent operations; options like Hosted Control Planes, cluster-as-a-service, and fleet management with Advanced Cluster Management and Advanced Cluster Security.

---

## Installation options

The OpenShift installation program is flexible. You can:

- Deploy a cluster on **infrastructure that the installation program provisions and the cluster maintains** (installer-provisioned infrastructure, IPI), or  
- Deploy on **infrastructure that you prepare and maintain** (user-provisioned infrastructure, UPI).

The installation **scope is intentionally narrow**: the program is designed for simplicity and success. Many configuration tasks (storage, authentication, operators, tuning) are done **after** installation. For the full installation process, supported platforms, and how to choose a method, see [2. Installation](./2-installation.md) and the official installation documentation.

---

## OpenShift Local

**OpenShift Local** is for rapid application development and getting started with OpenShift. It runs on your local computer (Linux, macOS, or Windows 10 or later) to simplify setup and testing and to emulate a cloud development environment with the tools needed for container-based applications.

OpenShift Local brings a minimal, preconfigured OpenShift cluster to your machine without server-based infrastructure. You can create microservices, turn them into images, and run them in containers locally. It is not for production; use it to learn and develop.

---

## Next steps by role

**Developers** – Work with projects and applications (Developer perspective and Topology view in the web console); use the developer CLI (`odo`); create CI/CD pipelines; deploy Helm charts; understand image builds and build strategies; create container images and deployments; use templates; install and use Operators; develop your own Operators. See [4. Develop and Operators](./4-develop-and-operators.md).

**Administrators** – Understand platform management (control plane, Machine API, Operators, etcd); manage users, groups, and authentication; manage networking (Cluster Network Operator, multiple networks, network policy); manage storage and Operators; use CRDs; set resource quotas; prune and reclaim resources; scale and tune clusters; use the OpenShift Update Service in disconnected environments; configure monitoring and remote health (Telemetry, Insights). See [3. Configure and manage](./3-configure-and-manage.md) and [5. Networking, security, and observability](./5-networking-security-observability.md).

**Additional topics** – For deeper coverage, see [6. Service Mesh](./6-service-mesh.md), [7. OpenShift Virtualization](./7-virtualization.md), [8. etcd and Hosted Control Planes](./8-etcd-hosted-control-planes.md), [9. Updating, registry, and API](./9-updating-registry-api.md), and [10. Windows, edge, AI, and hardware](./10-windows-edge-ai-hardware.md).

---

## References

Use these only when you want more or the latest from the official documentation. Links go to the OpenShift Container Platform documentation; select your release from the version selector on the docs site.

- [OpenShift Container Platform documentation](https://docs.redhat.com/en/documentation/openshift_container_platform/)
- [Introduction to OpenShift Container Platform](https://docs.redhat.com/en/documentation/openshift_container_platform/html/overview)
- [Architecture](https://docs.redhat.com/en/documentation/openshift_container_platform/html/architecture)
- [Glossary of common terms](https://docs.redhat.com/en/documentation/openshift_container_platform/html/welcome/glossary)
- [Learn more about OpenShift](https://docs.redhat.com/en/documentation/openshift_container_platform/html/welcome/learn_more_about_openshift)
- [Red Hat OpenShift Local](https://developers.redhat.com/products/openshift-local/overview)
- [Use cases](https://www.redhat.com/en/technologies/cloud-computing/openshift#use-cases)

[← Back to OpenShift deep dive](./README.md)
