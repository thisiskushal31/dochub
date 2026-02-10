# Develop and Operators

This topic maps **application development, builds, images, and Operators** to the official OpenShift Container Platform documentation. All procedures and reference material are in the Red Hat docs; this file summarizes what each area covers and where to find it.

---

## Building applications

The **Develop** section covers creating and managing applications on OpenShift:

- **Understanding development** – types of containerized applications (simple containers, Kubernetes deployments, Operators).
- **Working with projects** – creating and using projects (namespaces) from the web console or `oc`.
- **Working with applications** – using the **Developer** perspective and **Topology** view to create, deploy, monitor, and connect components.
- **Deployments** – `Deployment` and `DeploymentConfig` objects; rollout strategies (rolling, recreate, custom); managing deployments via Workloads or `oc`.
- **Templates** – using and creating templates that describe how an application is built or deployed (images, parameters, replicas, ports, etc.).
- **Resource quotas** – setting per-project quotas (CPU, memory, and other resources).
- **Pruning** – reclaiming space by pruning Operators, groups, deployments, builds, images, registries, cron jobs.

The 4.17 overview also points to: using the developer CLI (`odo`) for single or multi-component apps; creating CI/CD pipelines (e.g. Tekton-based); deploying Helm charts; and the REST API reference.

---

## Images and ImageStreams

- **Images** – creating and managing images and ImageStreams. A container image is the basic building block; ImageStreams group multiple versions of an image. Source-to-Image (S2I) lets you inject source code into a base container for a given runtime (e.g. Ruby, Node.js, Python).
- **Registry** – configuring registries for OpenShift (integrated and external).

---

## Builds

- **Builds using BuildConfig** – understanding image builds; build strategies (Docker, S2I, custom, pipeline); source materials (Git, local binary, external artifacts); basic to advanced build examples.
- **Builds using Shipwright** – extensible build framework for building container images on the cluster.

Use the official build docs for step-by-step build types and strategies.

---

## Operators

- **Operators** – working with Operators in OpenShift. Operators are the preferred way to create on-cluster applications; they encode Day 1 and Day 2 operations in Kubernetes-native software.
- **Operator Lifecycle Manager (OLM)** – in 4.21 the docs reference **Extensions** and **OLM v1** for installing and managing extensions and Operators.
- **OperatorHub** – Red Hat, ISV, and community Operators; cluster admins can install Operators and then run, upgrade, and manage them. Applications can be created from installed Operators.
- **CRDs** – cluster features implemented with Operators are often configured via custom resource definitions (CRDs); the docs describe creating CRDs and managing resources from them.
- **Developing Operators** – building, testing, and deploying your own Operators (e.g. with Ansible or Helm, and Prometheus monitoring) via the Operator SDK.

---

## CI/CD

- **CI/CD overview** – continuous integration and deployment on OpenShift.
- **GitOps** – declarative continuous deployment for cloud-native applications.
- **Pipelines** – OpenShift Pipelines (Tekton-based); serverless, cloud-native CI/CD running in isolated containers.
- **Jenkins** – using Jenkins on OpenShift.
- **BuildConfig builds** – CI/CD that uses OpenShift build and deployment resources.

---

## Serverless and sandboxed containers

- **Serverless** – OpenShift Serverless installation, usage, and release notes.
- **OpenShift sandboxed containers** – sandboxed containers guide.

---

## References

- [OpenShift Container Platform 4.21 – Develop](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/)
- [Building applications](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html/building_applications/)
- [Images](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html/images/)
- [Registry](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html/registry/)
- [Builds using BuildConfig](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html/builds_using_buildconfig/)
- [Builds using Shipwright](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html/builds_using_shipwright/)
- [Operators](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html/operators/)
- [Extensions (OLM v1)](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html/extensions/)
- [CI/CD overview](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html/cicd_overview/)
- [GitOps](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html/gitops/)
- [Pipelines](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html/pipelines/)
- [Serverless](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html/serverless/)
- [OpenShift sandboxed containers](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/html/sandboxed_containers/)
- [Chapter 2. OpenShift Container Platform overview – Next steps (4.17)](https://docs.redhat.com/en/documentation/openshift_container_platform/4.17/html/getting_started/openshift-overview#openshift-next-steps_openshift-overview)
