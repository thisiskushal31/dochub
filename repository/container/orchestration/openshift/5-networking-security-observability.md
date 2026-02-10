# Networking, security, and observability

[← Back to OpenShift deep dive](./README.md)

This page covers OpenShift networking (pod networking, Services, Routes, Cluster Network Operator, OVN-Kubernetes, ingress, network policy), authentication and authorization, security and compliance, and observability (monitoring, logging, distributed tracing, remote health). Everything you need to configure and operate these areas is here; the links at the end are for further reading only.

## Table of Contents

- [Networking overview](#networking-overview)
- [Pod networking and Services](#pod-networking-and-services)
- [Routes and ingress](#routes-and-ingress)
- [Cluster Network Operator and OVN-Kubernetes](#cluster-network-operator-and-ovn-kubernetes)
- [Multiple networks and network policy](#multiple-networks-and-network-policy)
- [Authentication and authorization](#authentication-and-authorization)
- [Security and compliance](#security-and-compliance)
- [Monitoring and observability](#monitoring-and-observability)
- [Logging and distributed tracing](#logging-and-distributed-tracing)
- [Remote health and support](#remote-health-and-support)
- [References](#references)

---

## Networking overview

To build resilient and secure applications on OpenShift, you configure the **networking infrastructure** for your cluster. Reliable pod-to-pod communication and clear traffic routing rules ensure that every application component works correctly. OpenShift networking is built on Kubernetes concepts (pods, Services) and adds OpenShift-specific components (Routes, Cluster Network Operator, optional multiple networks). The main layers are: **pod networking** (how pods get IPs and reach each other), **traffic within the cluster** (Services, DNS), **traffic entering and leaving** (ingress, Routes, load balancers), and **securing network traffic** (network policies, encryption). External traffic reaches your app via Route → Service → Pods (see [1. Overview](./1-overview-and-concepts.md#how-a-request-reaches-your-application)). For official diagrams of the cluster network and traffic flow, see [Understanding networking](https://docs.redhat.com/en/documentation/openshift_container_platform/html/networking/networking_overview/understanding-networking) in the Red Hat OpenShift Container Platform documentation.

---

## Pod networking and Services

**Pod network** – Every pod gets an IP address on a cluster-wide pod network. Pods can reach each other by IP; the **container network interface (CNI)** plugin (e.g. OVN-Kubernetes) provides this network. The pod network is separate from the host network; traffic is typically encrypted or isolated as per your plugin configuration.

**Services** – A **Service** defines a logical set of pods (usually by label selector) and provides a **stable internal IP and DNS name**. As pods are created and destroyed, the Service keeps the same cluster IP and name so other applications can rely on it. Services enable internal load balancing across the pods that back them. OpenShift injects service discovery information into running containers (e.g. environment variables or DNS) so applications can find each other. Kubernetes Services types (ClusterIP, NodePort, LoadBalancer) are supported; OpenShift also uses **Routes** to expose Services to the outside world with a hostname.

---

## Routes and ingress

**Routes** – OpenShift’s way to expose a Service with an **externally reachable hostname** (e.g. `www.example.com`). A Route has a name, a reference to a Service (and optionally a target port), and optionally TLS (edge, passthrough, or reencrypt) and other settings. The cluster **router** (ingress controller) watches Routes and configures a load balancer or proxy so that external traffic to that hostname is sent to the correct Service and its pods. Without a Route (or another ingress mechanism), traffic from outside the cluster cannot reach your application. Example Route (YAML):

```yaml
apiVersion: route.openshift.io/v1
kind: Route
metadata:
  name: myapp
spec:
  host: myapp.example.com
  to:
    kind: Service
    name: myapp
    weight: 100
  port:
    targetPort: 8080
  tls:
    termination: edge
    insecureEdgeTerminationPolicy: Redirect
```

Create from CLI: `oc expose svc/myapp --hostname=myapp.example.com`. List routes with `oc get routes`.

**Ingress** – OpenShift supports **Ingress** resources and **ingress controllers** for HTTP/HTTPS routing. You can use the default ingress controller (which also serves Routes) or configure additional ingress controllers for different domains or TLS requirements. Ingress and load balancing documentation covers how to expose services, configure TLS, and tune the ingress stack.

---

## Cluster Network Operator and OVN-Kubernetes

The **Cluster Network Operator (CNO)** manages the cluster network. It deploys and configures the CNI plugin and related components. The default pod network plugin is **OVN-Kubernetes**, which provides pod networking, network policies, and integration with OpenShift SDN features. OVN-Kubernetes supports single-stack (IPv4 or IPv6) and dual-stack networking, egress firewalling, and other advanced features. You configure the cluster network through the CNO and its operands; the docs describe how to change network type, MTU, and other settings. **Networking Operators** documentation covers the CNO and any additional operators (e.g. for multi-network or hardware offload).

---

## Multiple networks and network policy

**Multiple networks** – OpenShift can attach **multiple network interfaces** to a pod using **Multus** and the CNO. This is useful when a pod needs to be on a separate network (e.g. a dedicated storage or management network) in addition to the default pod network. You define **NetworkAttachmentDefinitions** and attach them to pods; the Multus CNI adds the extra interfaces. Use the multiple networks documentation when you need secondary networks or specific topology.

**Network policy** – **NetworkPolicy** resources restrict traffic between pods. You can isolate namespaces or allow only selected traffic (e.g. by pod label). For example, you might allow only pods with `role=frontend` to talk to pods with `role=db` and deny all other ingress to the db namespace. The policy is defined in the namespace that contains the pods you want to protect. OpenShift’s default CNI (OVN-Kubernetes) enforces network policies. Use network policy to implement segmentation and least-privilege networking. Create and edit with `oc apply -f policy.yaml` or the web console.

---

## Authentication and authorization

**Authentication** – To use the cluster, users must **authenticate** to the OpenShift API. Cluster administrators configure **identity providers** (e.g. HTPasswd, LDAP, OAuth, OpenID Connect, Keystone) so that users log in with corporate or external identities. You authenticate via the web console (login page) or the CLI (`oc login`); the API accepts **OAuth access tokens** or **X.509 client certificates**. After authentication, the API knows *who* the user is.

**Authorization** – **Role-based access control (RBAC)** determines what authenticated users and service accounts can do. OpenShift uses Kubernetes RBAC (Roles, RoleBindings, ClusterRoles, ClusterRoleBindings) and extends it with OpenShift-specific roles (e.g. cluster-admin, edit, view). You grant permissions by binding roles to users or groups. **Projects** are the main scope for application developers; project admins can manage resources within their project. The authentication and authorization documentation explains how to add users and groups, configure identity providers, and manage RBAC.

---

## Security and compliance

OpenShift provides multiple layers for **security and compliance**:

- **Container security** – Image scanning, trusted registries, and security context constraints (SCCs) that limit what containers can do (e.g. run as root, use host namespaces). You can enforce non-root, read-only filesystems, and drop capabilities.
- **Network security** – Network policies, encryption for pod-to-pod or ingress traffic where supported.
- **Certificates** – TLS for the API server, ingress, and service-serving certificates. You can replace default certificates with your own (e.g. enterprise CA).
- **Compliance** – Red Hat provides guidance and tooling (e.g. compliance operator, benchmarks) to help you meet regulatory and policy requirements (e.g. PCI-DSS, HIPAA). The security and compliance documentation covers hardening, scanning, and compliance operators.

Use the official security documentation to configure these features for your environment.

---

## Monitoring and observability

**Monitoring stack** – OpenShift includes a **monitoring stack** (Prometheus-based) that collects metrics from the cluster and from user-defined targets. You can view **dashboards** in the web console (Administrator perspective) to see cluster health, resource usage, and alerts. You can also **scrape metrics from your own services** by defining ServiceMonitors and PodMonitors. The monitoring stack is configurable (retention, resources) for large clusters; see scalability and performance guidance.

**Observability overview** – OpenShift groups monitoring, logging, tracing, and related topics under **observability**. You can add **Red Hat build of OpenTelemetry** to collect traces and metrics from your applications and send them to the cluster or external systems. **Network Observability** provides visibility into network flows and traffic. **Power monitoring** (where supported) tracks power consumption. The observability documentation describes how to install and configure these components.

---

## Logging and distributed tracing

**Logging** – OpenShift **logging** (e.g. Loki, or other back ends) lets you collect, store, and query logs from pods and the cluster. You configure log forwarding and storage; then you can query logs in the console or via the logging stack’s API. Useful for debugging and audit.

**Distributed tracing** – For microservices, **distributed tracing** (e.g. Tempo or Jaeger) tracks requests across services. You instrument applications to emit trace data; the tracing backend stores and visualizes traces. OpenShift documentation covers the Red Hat build of OpenTelemetry and the distributed tracing solution (release notes, architecture, configuration).

---

## Remote health and support

**Remote health monitoring** – OpenShift can send **telemetry** (anonymized, aggregated information about cluster size, health, and status) to Red Hat. The **Insights Operator** gathers data and, when enabled, sends it to Red Hat so you can see recommendations (e.g. for updates or issues) in the Red Hat Hybrid Cloud Console. You can view what data is collected and disable or limit telemetry if required by policy. This helps Red Hat improve the platform and helps you get proactive recommendations.

**Support** – The official documentation explains how to get **support** for OpenShift Container Platform (subscriptions, support cases, gathering cluster data for troubleshooting). Use the support section when you need to open a case or collect diagnostics.

---

## References

Use these only when you want more or the latest from the official documentation. Select your OpenShift release from the version selector on the docs site.

- [OpenShift Container Platform – Networking, security, observability](https://docs.redhat.com/en/documentation/openshift_container_platform/)
- [Understanding networking](https://docs.redhat.com/en/documentation/openshift_container_platform/html/networking/networking_overview/understanding-networking)
- [Networking Operators](https://docs.redhat.com/en/documentation/openshift_container_platform/html/networking/networking_operators/)
- [Network security](https://docs.redhat.com/en/documentation/openshift_container_platform/html/networking/network_security/)
- [Multiple networks](https://docs.redhat.com/en/documentation/openshift_container_platform/html/networking/multiple_networks/)
- [OVN-Kubernetes network plugin](https://docs.redhat.com/en/documentation/openshift_container_platform/html/networking/ovn_kubernetes_network_provider/)
- [Ingress and load balancing](https://docs.redhat.com/en/documentation/openshift_container_platform/html/networking/ingress_and_load_balancing/)
- [About network policy](https://docs.redhat.com/en/documentation/openshift_container_platform/html/networking/network_security/network-policy-apis)
- [Authentication and authorization](https://docs.redhat.com/en/documentation/openshift_container_platform/html/authentication/)
- [Security and compliance](https://docs.redhat.com/en/documentation/openshift_container_platform/html/security/)
- [Observability overview](https://docs.redhat.com/en/documentation/openshift_container_platform/html/observability/)
- [Monitoring (monitoring stack for Red Hat OpenShift)](https://docs.redhat.com/en/documentation/monitoring_stack_for_red_hat_openshift/html/about_monitoring/about-ocp-monitoring)
- [Logging](https://docs.redhat.com/en/documentation/openshift_container_platform/html/logging/)
- [Red Hat build of OpenTelemetry](https://docs.redhat.com/en/documentation/openshift_container_platform/html/observability/otel/)
- [Distributed tracing](https://docs.redhat.com/en/documentation/openshift_container_platform/html/observability/distr_tracing/)
- [Remote health monitoring](https://docs.redhat.com/en/documentation/openshift_container_platform/html/support/remote_health_monitoring/about-remote-health-monitoring)
- [Support](https://docs.redhat.com/en/documentation/openshift_container_platform/html/support/)
- [Learn more about OpenShift – Observe a cluster](https://docs.redhat.com/en/documentation/openshift_container_platform/html/welcome/learn_more_about_openshift#observe-cluster)

[← Back to OpenShift deep dive](./README.md)
