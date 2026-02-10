# Updating, registry, and API

[← Back to OpenShift deep dive](./README.md)

This page covers **cluster updating** (how updates work, channels, and disconnected updates), the **integrated container registry** (configuration, storage, securing), and the **OpenShift REST API** for automation. Everything you need to operate and automate the platform is here; the links at the end are for further reading only.

## Table of Contents

- [How OpenShift updates work](#how-openshift-updates-work)
- [Update channels and release selection](#update-channels-and-release-selection)
- [Updating a cluster (connected and disconnected)](#updating-a-cluster-connected-and-disconnected)
- [Integrated container registry](#integrated-container-registry)
- [Configuring and securing the registry](#configuring-and-securing-the-registry)
- [OpenShift REST API](#openshift-rest-api)
- [References](#references)

---

## How OpenShift updates work

With OpenShift 4, you **update a cluster in a single operation** via the web console (*Administration* → *Cluster Settings*) or the CLI (`oc adm upgrade`). Red Hat hosts a public **OpenShift Update Service (OSUS)** that serves a **graph of update possibilities** based on release images. Clusters are configured to connect to OSUS by default; OSUS responds with **known update targets**.

An update starts when a cluster administrator (or an automatic update controller) **edits the Cluster Version Operator (CVO) custom resource** with a new version. The CVO retrieves the target release image from the image registry and **applies changes** to the cluster. The target release image contains **manifest files** for all cluster components that form that OCP version. The CVO applies manifests in **stages (Runlevels)**. Most manifests correspond to cluster Operators; as the CVO applies a manifest, the Operator performs update tasks to reconcile to the new version. The CVO **only proceeds** when all manifests and cluster Operators in the active Runlevel reach a stable condition. After the control plane is updated, the **Machine Config Operator (MCO)** updates the operating system and configuration on every node.

**Note:** Operators installed through OLM follow a **separate** update process; see the official documentation for updating installed Operators.

---

## Update channels and release selection

**Update channels** are the mechanism by which you declare the **minor version** you intend to update to and choose the **timing and support level** of updates. Channels include:

- **stable-&lt;version&gt;** – General availability; recommended for most clusters.
- **fast-&lt;version&gt;** – Earlier access to releases.
- **candidate-&lt;version&gt;** – Pre-release candidates.
- **eus-4.y** – Extended Update Support; facilitates updates between EUS versions when offered.

The **channel name** includes the target minor version (e.g. `stable-4.17`). The CVO uses the update graph for that channel (and other conditions) to recommend updates. Channels **do not** determine the version you install; the `openshift-install` binary for a given version always installs that version. You can set an **empty channel** (e.g. with `oc adm upgrade channel`) so the CVO does not fetch recommendations—useful for disconnected or restricted environments with a local update service.

**Important:** Red Hat recommends updating only to versions suggested by the OpenShift Update Service. For minor version updates, versions must be **contiguous**; non-contiguous updates are not tested or guaranteed.

---

## Updating a cluster (connected and disconnected)

**Connected:** Use the web console or `oc adm upgrade` to select and apply an update. The cluster pulls the release image from the configured registry (default: Red Hat's registry). You can perform **control-plane-only** updates in some scenarios; the docs describe when and how.

**Disconnected:** In air-gapped environments you **mirror** release images and operator catalogs to a **mirror registry**. You run the **OpenShift Update Service** locally (or use a pre-built graph) so the cluster receives update recommendations from the mirrored graph. The disconnected update documentation explains how to mirror content and configure the cluster and local update service.

**Preparation:** Before updating, prepare the cluster (e.g. ensure sufficient resources, resolve any upgrade-blocking conditions). The docs cover preparing for manual credential updates, multi-payload migration, and platform-specific steps (e.g. vSphere hardware). **Troubleshooting:** Use the "gathering data for cluster update" and update troubleshooting sections if an update fails or blocks.

---

## Integrated container registry

OpenShift provides a **built-in container image registry** that runs as a standard workload. It is configured and managed by an **infrastructure Operator** (Image Registry Operator). The registry:

- Runs on **existing cluster infrastructure**; no separate provisioning required.
- **Scales** like any other workload (scale up or down).
- **Integrates** with cluster authentication and authorization; image access is controlled by user permissions on image resources.
- Is used as the **publication target** for images built on the cluster and as a **source** for workloads. When you push a new image, a notification is sent so other components (e.g. ImageStreams, deployments) can react.

**Storage:** Image data is stored in a **configurable storage backend** (e.g. cloud storage, filesystem volume). Image **metadata** is exposed by the cluster APIs (images, image streams) and used for access control. You configure registry storage per platform (AWS, Azure, GCP, vSphere, bare metal, ODF, etc.) via the Image Registry Operator or custom resources. The official docs describe configuring registry storage for each supported platform.

**Pruning:** You can **prune** (delete) old images to reclaim space; see the image pruning documentation and use `oc adm prune images` with appropriate safeguards.

---

## Configuring and securing the registry

- **Configuring the Image Registry Operator** – Default configuration, storage, routes, and operator-level settings are documented under "Configuring the registry operator." You can expose the registry with a route, configure TLS, and tune for your environment.
- **Securing and exposing the registry** – The docs describe how to secure the registry (e.g. TLS, authentication) and expose it to users or CI/CD systems (routes, load balancers). Use the official "Securing and exposing the registry" section for steps.
- **Third-party registries** – OpenShift can pull from and push to external registries (Quay, other registries). You configure authentication (pull secrets, service accounts) as needed; see registry authentication and third-party registry documentation.

---

## OpenShift REST API

OpenShift (and Kubernetes) expose a **REST API** for all cluster resources. You can **automate** cluster and application management by calling the API from scripts, CI/CD pipelines, or custom tools.

- **API discovery** – The API is discoverable; you can query the API server for API groups, versions, and resources. Use the same authentication as `oc` (e.g. OAuth tokens, client certificates).
- **OpenShift and Kubernetes resources** – Pods, Deployments, Services, Routes, BuildConfigs, ImageStreams, Projects, Operators, and custom resources are all manageable via the API. The official REST API reference documents workload APIs, build APIs, and other resource types.
- **Authentication** – Authenticate with a bearer token (e.g. from `oc whoami -t`) or a client certificate; the same identity providers and RBAC apply as for the CLI and console.
- **CLI and API** – The `oc` CLI uses this API; you can achieve the same operations with `curl`, client libraries, or the Kubernetes/OpenShift API client. The CLI reference and API reference are in the official documentation.

Use the REST API when you need to automate provisioning, deployments, or custom tooling; see the OpenShift Container Platform API reference and CLI tools documentation for details.

---

## References

Use these only when you want more or the latest from the official documentation. Select your OpenShift version from the version selector on the docs site.

**Updating**

- [Introduction to OpenShift updates](https://docs.redhat.com/en/documentation/openshift_container_platform/html/updating/understanding_updates/intro-to-updates)
- [How cluster updates work](https://docs.redhat.com/en/documentation/openshift_container_platform/html/updating/understanding_updates/how-updates-work)
- [Understanding update channels and releases](https://docs.redhat.com/en/documentation/openshift_container_platform/html/updating/understanding_updates/understanding-update-channels-release)
- [Updating a cluster (CLI and web console)](https://docs.redhat.com/en/documentation/openshift_container_platform/html/updating/updating_a_cluster/)
- [Disconnected update (OpenShift Update Service)](https://docs.redhat.com/en/documentation/openshift_container_platform/html/disconnected/updating/)

**Registry**

- [Registry overview](https://docs.redhat.com/en/documentation/openshift_container_platform/html/registry/)
- [Configuring registry storage](https://docs.redhat.com/en/documentation/openshift_container_platform/html/registry/configuring_registry_storage/)
- [Configuring the Image Registry Operator](https://docs.redhat.com/en/documentation/openshift_container_platform/html/registry/configuring-registry-operator)
- [Securing and exposing the registry](https://docs.redhat.com/en/documentation/openshift_container_platform/html/registry/securing-exposing-registry)

**API**

- [OpenShift Container Platform API reference](https://docs.redhat.com/en/documentation/openshift_container_platform/html/rest_api/)
- [CLI tools](https://docs.redhat.com/en/documentation/openshift_container_platform/html/cli_tools/)

[← Back to OpenShift deep dive](./README.md)
