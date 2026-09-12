# Production & Operations

[← Back to Kubernetes deep dive](./README.md)

This page summarizes production and operations topics: high availability with kubeadm, best practices (large clusters, multiple zones, Pod Security, PKI), and administration (adding nodes, upgrades, certificates). Everything you need to orient yourself is here; links at the end point to the full official procedures.

## Table of Contents

- [High availability (kubeadm)](#high-availability-kubeadm)
- [Best practices](#best-practices)
- [Administration (kubeadm)](#administration-kubeadm)
- [Reference and checklist](#reference-and-checklist)
- [References](#references)

---

## High availability (kubeadm)

A production control plane should tolerate the failure of one or more nodes. With **kubeadm** you can set up:

- **Multiple control-plane nodes** – Run `kubeadm init` on the first node, then `kubeadm join --control-plane` on additional nodes with a load balancer in front of the API servers. Each control-plane node runs the API server, scheduler, and controller manager; etcd can be stacked (on the same nodes) or external.
- **HA topology** – The official docs describe options: stacked (etcd on control-plane nodes) vs external etcd. Stacked is simpler; external etcd can scale and be managed separately.
- **etcd HA** – If you run etcd on the control-plane nodes, you run an etcd cluster (odd number of members, e.g. 3) and point kubeadm at it. The docs describe [setting up a HA etcd cluster with kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/).

You need a load balancer (or equivalent) for the kube-apiserver endpoints so nodes and clients talk to the cluster even when one control-plane node is down. Follow the official “Creating Highly Available Clusters with kubeadm” and “Options for Highly Available Topology” for step-by-step commands and topology diagrams.

---

## Best practices

- **Large clusters** – At scale, consider API request limits, etcd size and performance, node and Pod density, and quotas. The [considerations for large clusters](https://kubernetes.io/docs/setup/best-practices/cluster-large/) page outlines limits and tuning.
- **Multiple zones** – Spread nodes across availability zones so the cluster survives a zone failure. Use topology spread constraints and consider how PersistentVolumes and load balancers behave across zones. See [running in multiple zones](https://kubernetes.io/docs/setup/best-practices/multiple-zones/).
- **Pod Security Standards** – Enforce at least the **baseline** profile, and **restricted** where possible, via [Pod Security Admission](https://kubernetes.io/docs/setup/best-practices/enforcing-pod-security-standards/). This restricts privileged containers, host namespaces, and similar.
- **PKI and certificates** – Kubernetes uses certificates for API server, etcd, and kubelet. Understand [PKI certificates and requirements](https://kubernetes.io/docs/setup/best-practices/certificates/) and plan for rotation and renewal. kubeadm can manage certs; see [Certificate management with kubeadm](https://kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/).
- **Node conformance** – Validate that nodes meet requirements (e.g. container runtime, kernel parameters) with the [node conformance](https://kubernetes.io/docs/setup/best-practices/node-conformance/) test.

---

## Administration (kubeadm)

Common operational tasks when you run a kubeadm cluster:

- **Add worker nodes** – Use the `kubeadm join` command (with token and discovery hash) from the initial `kubeadm init` output. See [adding Linux worker nodes](https://kubernetes.io/docs/tasks/administer-cluster/kubeadm/adding-linux-nodes/) (and Windows if needed).
- **Upgrade** – Upgrade control-plane and node components (kubeadm, kubelet, kubectl) in the order the docs specify; upgrade the control plane first, then nodes. See [upgrading kubeadm clusters](https://kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/).
- **Certificates** – Renew or rotate API server and etcd certs; kubeadm has commands for checking and renewing. See [Certificate management with kubeadm](https://kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/).
- **Reconfigure** – Change cluster config (e.g. API server flags, kubelet config) following [reconfiguring a kubeadm cluster](https://kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure/).
- **Securing the cluster** – Restrict API access, use RBAC, lock down kubelet and etcd. See [securing a cluster](https://kubernetes.io/docs/tasks/administer-cluster/securing-a-cluster/) and [manage TLS certificates](https://kubernetes.io/docs/tasks/tls/).

The [Administration with kubeadm](https://kubernetes.io/docs/tasks/administer-cluster/kubeadm/) index links to all of these.

---

## Reference and checklist

- **kubeadm** – Bootstrap and manage the cluster; reference: [kubeadm](https://kubernetes.io/docs/reference/setup-tools/kubeadm/).
- **kubectl** – All object types and flags: [kubectl reference](https://kubernetes.io/docs/reference/kubectl/).

**Production checklist (self-managed):**

- [ ] Choose [learning](https://kubernetes.io/docs/setup/learning-environment/) vs [production](https://kubernetes.io/docs/setup/production-environment/) path; for production, use [kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/) or [turnkey solutions](https://kubernetes.io/docs/setup/production-environment/turnkey-solutions/).
- [ ] Install [kubectl](https://kubernetes.io/docs/tasks/tools/) and (for kubeadm) follow [install kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm/) and [create cluster](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/).
- [ ] For HA: follow [HA with kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/high-availability/) and [HA topology](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/ha-topology/).
- [ ] Apply [best practices](https://kubernetes.io/docs/setup/best-practices/) and [Pod Security Standards](https://kubernetes.io/docs/setup/best-practices/enforcing-pod-security-standards/).
- [ ] Plan [certificates](https://kubernetes.io/docs/setup/best-practices/certificates/) and [securing the cluster](https://kubernetes.io/docs/tasks/administer-cluster/securing-a-cluster/).

Use the references below only when you need the exact steps and latest wording from the official docs.

---

## References

Use these only if you want the full procedures from the official documentation.

- **HA:** [Creating HA clusters with kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/high-availability/), [HA topology options](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/ha-topology/), [Set up HA etcd with kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)
- **Best practices:** [Best practices](https://kubernetes.io/docs/setup/best-practices/), [Large clusters](https://kubernetes.io/docs/setup/best-practices/cluster-large/), [Multiple zones](https://kubernetes.io/docs/setup/best-practices/multiple-zones/), [Node conformance](https://kubernetes.io/docs/setup/best-practices/node-conformance/), [Pod Security Standards](https://kubernetes.io/docs/setup/best-practices/enforcing-pod-security-standards/), [PKI certificates](https://kubernetes.io/docs/setup/best-practices/certificates/)
- **Administration:** [Administration with kubeadm](https://kubernetes.io/docs/tasks/administer-cluster/kubeadm/), [Adding nodes](https://kubernetes.io/docs/tasks/administer-cluster/kubeadm/adding-linux-nodes/), [Upgrading](https://kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/), [Certificate management](https://kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/), [Reconfiguring](https://kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure/), [Securing a cluster](https://kubernetes.io/docs/tasks/administer-cluster/securing-a-cluster/), [TLS](https://kubernetes.io/docs/tasks/tls/)
- **Reference:** [kubeadm](https://kubernetes.io/docs/reference/setup-tools/kubeadm/), [kubectl](https://kubernetes.io/docs/reference/kubectl/)

[← Back to Kubernetes deep dive](./README.md)
