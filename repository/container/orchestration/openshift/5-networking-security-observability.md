# Networking, security, and observability

This topic maps **networking, security, and observability** to the official OpenShift Container Platform documentation. All procedures and reference material are in the Red Hat docs; this file summarizes what each area covers and where to find it.

---

## Networking

- **Networking overview** – fundamental networking concepts and general tasks in OpenShift.
- **Networking Operators** – managing networking-specific operators (e.g. Cluster Network Operator).
- **Network security** – securing network traffic and enforcing network policies. The Cluster Network Operator manages the cluster network; Multus adds multiple network interfaces to pods; network policy can isolate pods or allow selected traffic.
- **Multiple networks** – configuring multiple network interfaces and virtual routing (Multus).
- **OVN-Kubernetes network plugin** – in-depth configuration and troubleshooting for the OVN-Kubernetes plugin.
- **Ingress and load balancing** – exposing services and managing external traffic (routes, ingress controllers, load balancers).
- **Configuring network settings** – general networking configuration.
- **Advanced networking** – specialized and advanced topics.
- **Kubernetes NMState** – observing and updating node network state and configuration.

The 4.17 overview notes that services provide internal discovery and load balancing, and **routes** give services externally reachable hostnames so traffic from outside the cluster can reach applications.

---

## Security

- **Authentication and authorization** – configuring user authentication and access control for users and services. OpenShift supports multiple identity providers; the docs describe users, groups, and API authentication.
- **Security and compliance** – learning about and managing security for OpenShift: hardening, compliance, and security-related operators and features.

Use the official security docs for identity providers, RBAC, and compliance procedures.

---

## Observability

- **Observability overview** – observability in OpenShift.
- **Monitoring** – configuring and using the monitoring stack (Prometheus-based); monitoring dashboards in the web console; scraping metrics for your own services.
- **Power monitoring** – power monitoring for OpenShift.
- **Network Observability** – Network Observability Operator.
- **Logging** – configuring and using logging in OpenShift.
- **Cluster Observability Operator** – configuring and using the Cluster Observability Operator.
- **Red Hat build of OpenTelemetry** – OpenTelemetry in OpenShift.
- **Distributed tracing** – configuring and using distributed tracing.

The 4.17 overview also mentions **remote health monitoring**: OpenShift collects anonymized aggregated information (Telemetry, Insights Operator) that Red Hat uses to improve the platform; you can view what data is collected.

---

## Support

- **Support** – getting support for OpenShift Container Platform; remote health monitoring and data collection.

---

## References

- [OpenShift Container Platform 4.21 – Networking](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/)
- [Networking overview](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html/networking_overview/)
- [Networking Operators](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html/networking_operators/)
- [Network security](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html/network_security/)
- [Multiple networks](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html/multiple_networks/)
- [OVN-Kubernetes network plugin](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html/ovn_kubernetes_network_plugin/)
- [Ingress and load balancing](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html/ingress_and_load_balancing/)
- [Authentication and authorization](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html/authentication_and_authorization/)
- [Security and compliance](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html/security_and_compliance/)
- [Observability overview](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html/observability_overview/)
- [Monitoring](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html/monitoring/)
- [Logging](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html/logging/)
- [Support](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html/support/)
