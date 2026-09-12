# Service Mesh

[← Back to OpenShift deep dive](./README.md)

This page covers **Red Hat OpenShift Service Mesh**: a platform for behavioral insight and operational control over networked microservices. It is based on the open source Istio project and adds a transparent layer on existing distributed applications without requiring application code changes. Everything you need to understand and plan for the service mesh is here; the links at the end are for further reading only.

## Table of Contents

- [What is OpenShift Service Mesh?](#what-is-openshift-service-mesh)
- [Core features](#core-features)
- [Architecture and components](#architecture-and-components)
- [Traffic management and security](#traffic-management-and-security)
- [Observability: Kiali and distributed tracing](#observability-kiali-and-distributed-tracing)
- [Installation and lifecycle](#installation-and-lifecycle)
- [References](#references)

---

## What is OpenShift Service Mesh?

**OpenShift Service Mesh** addresses common problems in microservice architectures by creating a centralized point of control. Microservice architectures split work into modular services, which can make scaling and maintenance easier, but as an application grows in size and complexity it becomes difficult to understand and manage. The service mesh captures or intercepts traffic between services and can modify, redirect, or create new requests.

OpenShift Service Mesh is based on the open source **Istio** project. It provides:

- A network of deployed services with **discovery**, **load balancing**, **service-to-service authentication**, **failure recovery**, **metrics**, and **monitoring**.
- More complex operational functionality: **A/B testing**, **canary releases**, **access control**, and **end-to-end authentication**.

Service Mesh releases on a different cadence from OpenShift Container Platform; the Service Mesh Operator can deploy multiple versions of the ServiceMeshControlPlane. Select your OpenShift and Service Mesh versions from the official documentation when following procedures.

---

## Core features

OpenShift Service Mesh provides these capabilities uniformly across the mesh:

- **Traffic management** – Control the flow of traffic and API calls between services, make calls more reliable, and make the network more robust in the face of adverse conditions.
- **Service identity and security** – Give services in the mesh a verifiable identity and protect service traffic as it flows over networks of varying trust (e.g. mutual TLS).
- **Policy enforcement** – Apply organizational policy to interactions between services; enforce access policies and fair resource distribution. Policy changes are made by configuring the mesh, not by changing application code.
- **Telemetry** – Understand dependencies between services and the nature and flow of traffic; quickly identify issues.

---

## Architecture and components

The mesh is implemented by **sidecar proxies** (Envoy) injected into application pods. Traffic to and from each service passes through the proxy, so the mesh can observe and control it without application changes. A **control plane** (Istio components) configures the proxies and collects telemetry.

Key concepts:

- **ServiceMeshControlPlane (SMCP)** – The main custom resource that defines the mesh deployment: which Istio control plane components to run, profiles (default, minimal, etc.), and configuration. You install the Service Mesh Operator, then create an SMCP to deploy the control plane.
- **Data plane** – Your application namespaces and pods; once you add them to the mesh (by labeling namespaces or using a mesh-wide policy), the Operator injects the sidecar into pods.
- **Gateways** – Ingress and egress points for traffic entering or leaving the mesh. You configure virtual services and destination rules to control routing and behavior.

The official documentation describes deployment models (e.g. single tenant, multi-tenant), profiles, and how to add applications to the mesh. **3scale** can be integrated for API management; the docs cover the 3scale Istio adapter and WebAssembly module.

---

## Traffic management and security

**Traffic management** – You use **VirtualService**, **DestinationRule**, and **Gateway** resources to control how traffic reaches services: route by header, weight-based splits (canary, A/B), retries, timeouts, and circuit breaking. Traffic stays within the mesh or goes through gateways for ingress/egress.

**Security** – The mesh can enforce **mutual TLS (mTLS)** between services so that traffic is encrypted and identities are verified. You configure peer authentication (strict, permissive, disable) and authorization policies so only allowed callers can reach specific services. This is applied at the mesh level without changing application code.

**Policy enforcement** – Organizational policies (who can call what, rate limits, etc.) are enforced by the mesh configuration; the official docs cover security and traffic management in detail.

---

## Observability: Kiali and distributed tracing

**Kiali** – Kiali provides visibility into the service mesh: it shows microservices and how they are connected. You get graph views of traffic flow, health, and configuration. Kiali is part of the Service Mesh control plane deployment when enabled in the SMCP.

**Distributed tracing** – When a user action triggers a request that crosses many services, **distributed tracing** follows the path of that request through the microservices. A **trace** is the end-to-end path; a **span** is a logical unit of work (operation name, start time, duration). Spans can be nested to model causal relationships. OpenShift Service Mesh integrates with the Red Hat build of **Jaeger** or **Tempo** (depending on version) so you can record and visualize traces. You instrument applications to emit trace data (or use automatic instrumentation where supported); the tracing backend stores and displays traces.

Use the observability and distributed tracing sections in the official Service Mesh documentation to configure and use these features.

---

## Installation and lifecycle

You install the **Red Hat OpenShift Service Mesh Operator** from the OperatorHub (or in disconnected environments from a mirrored catalog). Then you create a **ServiceMeshControlPlane** custom resource to deploy the control plane. You prepare namespaces and workloads (e.g. add labels), then add them to the mesh so the sidecar is injected. The docs describe preparation, installation, upgrading, and removal steps. Always use the official Red Hat OpenShift Service Mesh documentation for your OpenShift and Service Mesh versions; select your version from the documentation index.

---

## References

Use these only when you want more or the latest from the official documentation. Select your OpenShift and Service Mesh versions from the version selectors on the docs site.

- [Red Hat OpenShift Service Mesh](https://docs.redhat.com/en/documentation/red_hat_openshift_service_mesh/)
- [About OpenShift Service Mesh](https://docs.redhat.com/en/documentation/red_hat_openshift_service_mesh/latest/html/overview/about-openshift-service-mesh)
- [Understanding Service Mesh (architecture)](https://docs.redhat.com/en/documentation/red_hat_openshift_service_mesh/latest/html/overview/understanding-ossm)
- [Preparing to install](https://docs.redhat.com/en/documentation/red_hat_openshift_service_mesh/latest/html/installing/preparing-to-install-ossm)
- [Traffic management](https://docs.redhat.com/en/documentation/red_hat_openshift_service_mesh/latest/html/traffic_management/)
- [Security](https://docs.redhat.com/en/documentation/red_hat_openshift_service_mesh/latest/html/security/)
- [Kiali](https://docs.redhat.com/en/documentation/red_hat_openshift_service_mesh/latest/html/observability/ossm-reference-kiali)
- [Distributed tracing](https://docs.redhat.com/en/documentation/red_hat_openshift_service_mesh/latest/html/observability/ossm-distr-tracing)
- [Platform Life Cycle Policy (OpenShift Service Mesh)](https://access.redhat.com/support/policy/updates/openshift#ossm)

[← Back to OpenShift deep dive](./README.md)
