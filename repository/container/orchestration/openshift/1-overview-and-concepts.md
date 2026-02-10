# Overview and concepts

This topic summarizes what OpenShift Container Platform is, its main concepts, and how it fits with Kubernetes. The content is drawn from the [Red Hat OpenShift Container Platform documentation](https://docs.redhat.com/en/documentation/openshift_container_platform/4.17/html/getting_started/openshift-overview).

---

## What is OpenShift Container Platform?

OpenShift Container Platform is a **cloud-based Kubernetes container platform**. Its foundation is Kubernetes, so it shares the same technology. It is designed to scale from a few machines and applications to thousands of machines serving many clients.

OpenShift Container Platform enables you to:

- **Provide developers and IT** with cloud application platforms for deploying applications on secure, scalable resources.
- **Keep configuration and management overhead low.**
- **Bring Kubernetes** to customer data centers and the cloud.
- **Meet security, privacy, compliance, and governance** requirements.

With its Kubernetes foundation, OpenShift uses the same technology used in large-scale telecommunications, streaming, gaming, banking, and similar applications. Its implementation in open Red Hat technologies lets you extend containerized applications beyond a single cloud to on-premises and multi-cloud environments.

---

## Glossary of common terms

This glossary defines common Kubernetes and OpenShift Container Platform terms used in the docs.

| Term | Definition |
|------|------------|
| **Kubernetes** | Open source container orchestration engine for automating deployment, scaling, and management of containerized applications. |
| **Containers** | Application instances and components that run in OCI-compliant containers on worker nodes. A container is the runtime of an OCI-compliant image. A worker node can run many containers; node capacity is tied to memory and CPU of the underlying resources (cloud, hardware, or virtualized). |
| **Pod** | One or more containers deployed together on one host: a colocated group of containers with shared resources (e.g. volumes, IP). The smallest compute unit defined, deployed, and managed. In OpenShift, pods replace individual application containers as the smallest deployable unit. OpenShift schedules and runs all containers in a pod on the same node. Complex applications are made of many pods, each with their own containers, interacting with each other and externally. |
| **Replica set and replication controller** | Ensure the specified number of pod replicas are running. If pods exit or are deleted, more are started; if too many run, extras are removed to match the desired count. |
| **Deployment and DeploymentConfig** | OpenShift supports both Kubernetes `Deployment` objects and OpenShift `DeploymentConfig` objects. **Deployment** objects control how an application is rolled out as pods: they identify the container image, set replica count (creating a replica set), and use labels for scheduling. They can update pods based on version and rollout strategies. **DeploymentConfig** adds change triggers that can automatically create new versions when new container images are available or other changes occur. |
| **Service** | A logical set of pods and access policies. Provides stable internal IP addresses and hostnames so other applications can reach pods as they are created and destroyed. Services connect application components (e.g. front-end to database) and allow internal load balancing. OpenShift injects service information into running containers for discovery. |
| **Route** | Exposes a service with an externally reachable hostname (e.g. www.example.com). A route has a name, a service selector, and optionally security configuration. A router uses the route and the service’s endpoints to let external clients reach your applications. Without the routing layer, traffic from outside the cluster cannot reach the application. |
| **Build** | Process of transforming input (e.g. source code or parameters) into a resulting object; often used to produce a runnable image. A **BuildConfig** defines the entire build process. OpenShift builds containers from images and can push them to the integrated registry. |
| **Project** | OpenShift uses projects so groups of users or developers can work together; they provide isolation and collaboration. A project defines scope of resources, lets project admins manage resources, and applies quotas and limits. A project is a Kubernetes namespace with additional annotations and is the main way to manage access for regular users. Each project has its own objects, policies, constraints, and service accounts. *Projects are also known as namespaces.* |
| **Operators** | Kubernetes-native applications that encode operational knowledge in software (instead of only in admins’ heads or external scripts). They implement Day 1 (install, configure) and Day 2 (scale, reconfigure, update, backup, failover, restore) in software running inside the cluster, using Kubernetes concepts and APIs. Applications are treated as a single object with application-relevant options, not just as primitives (pods, deployments, services, etc.). |

---

## Understanding OpenShift Container Platform

OpenShift Container Platform is a **Kubernetes environment** for managing the lifecycle of container-based applications and their dependencies on various platforms: bare metal, virtualized, on-premises, and cloud. It deploys, configures, and manages containers and aims for usability, stability, and customization.

- **Nodes** use a lightweight, secure OS based on Red Hat Enterprise Linux: **Red Hat Enterprise Linux CoreOS (RHCOS)**.
- After boot and configuration, a node gets a **container runtime** (e.g. **CRI-O** or **Docker**) to run container workloads scheduled to it.
- The **Kubernetes agent (kubelet)** schedules container workloads on the node, registers the node with the cluster, and receives workload details.
- OpenShift **configures and manages** cluster networking, load balancing, and routing, plus cluster services for **monitoring**, **logging**, and **upgrades**.
- The **container image registry** and **OperatorHub** provide Red Hat–certified and community software for application services, databases, frontends, runtimes, and developer tooling.
- You can manage applications **manually** (deploying containers from pre-built images) or through **Operators**. You can build custom images from base images and source code and store them in internal, private, or public registries.
- **Multicluster Management** can manage multiple clusters—deployment, configuration, compliance, and workload distribution—from a single console.

---

## Installing OpenShift Container Platform

The OpenShift installation program is flexible. You can:

- Deploy a cluster on **infrastructure that the installation program provisions and the cluster maintains**, or  
- Deploy on **infrastructure that you prepare and maintain**.

For installation process, supported platforms, and how to choose an installation type, see the official **Install** section (e.g. [Installation overview](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html/installation_overview) for 4.21).

---

## OpenShift Local

**OpenShift Local** supports rapid application development and getting started with OpenShift. It runs on a local computer to simplify setup and testing and to emulate a cloud development environment locally with the tools needed for container-based applications.

OpenShift Local brings a minimal, preconfigured OpenShift Container Platform cluster to your PC without server-based infrastructure. On a hosted environment, it can create microservices, turn them into images, and run them in Kubernetes-hosted containers on Linux, macOS, or Windows 10 or later.

For details, see [Red Hat OpenShift Local Overview](https://developers.redhat.com/products/openshift-local/overview).

---

## Next steps

The official documentation organizes next steps by role.

**For developers:** Understand development on OpenShift, work with projects and applications (including the Developer perspective and Topology view in the web console), use the developer CLI (`odo`), create CI/CD pipelines, deploy Helm charts, understand image builds and build strategies, create container images and deployments, use templates, and work with Operators (including developing Operators).

**For administrators:** Understand platform management (control plane, Machine API, Operators), manage users and groups and authentication, manage networking (Cluster Network Operator, Multus, network policy), manage storage and Operators, use CRDs, set resource quotas, prune and reclaim resources, scale and tune clusters, use the OpenShift Update Service in disconnected environments, monitor clusters, and understand remote health monitoring (Telemetry, Insights Operator).

Each of these areas is covered in the official docs; the topic files in this repo point to the relevant sections.

---

## References

- [OpenShift Container Platform 4.21](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/)
- [Chapter 2. OpenShift Container Platform overview (4.17)](https://docs.redhat.com/en/documentation/openshift_container_platform/4.17/html/getting_started/openshift-overview) – source for this overview
- [Overview (4.21)](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html/overview)
- [Architecture (4.21)](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html/architecture)
- [Red Hat OpenShift Local Overview](https://developers.redhat.com/products/openshift-local/overview)
