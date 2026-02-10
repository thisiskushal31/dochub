# Develop and Operators

[← Back to OpenShift deep dive](./README.md)

This page covers application development on OpenShift: building applications, working with projects and deployments, images and ImageStreams, builds and build strategies, Operators and the Operator Lifecycle Manager, and CI/CD. Everything you need to develop and deploy apps is here; the links at the end are for further reading only.

## Table of Contents

- [Building applications overview](#building-applications-overview)
- [Projects and deployments](#projects-and-deployments)
- [Images and ImageStreams](#images-and-imagestreams)
- [Builds](#builds)
- [What are Operators?](#what-are-operators)
- [Operator Lifecycle Manager and OperatorHub](#operator-lifecycle-manager-and-operatorhub)
- [CI/CD, GitOps, and Pipelines](#cicd-gitops-and-pipelines)
- [Serverless and sandboxed containers](#serverless-and-sandboxed-containers)
- [References](#references)

---

## Building applications overview

OpenShift is a platform for **developing and deploying containerized applications**. You can:

- Deploy from **pre-built container images** (from the integrated registry or external registries).
- **Build** images from source code using OpenShift build resources (BuildConfig, or Shipwright).
- Use **templates** to define parameterized sets of objects (deployments, services, routes) and instantiate them.
- Package and deploy applications as **Operators** for full lifecycle management.

Development flows include: using the **Developer** perspective and **Topology** view in the web console to create, deploy, and connect components; using the **odo** CLI for iterative development; creating **Kubernetes manifests** (YAML/JSON) and storing them in Git; and using **Helm** charts. OpenShift works with basic units (pods), groups them with **services** for stable discovery, and supports **workloads** (Deployments, StatefulSets, etc.) based on your application type.

---

## Projects and deployments

**Projects** (Kubernetes namespaces with OpenShift annotations) are the unit of isolation and collaboration. You create projects to organize work; they define scope of resources, RBAC, and quotas. Users need access to projects from administrators (or the ability to create their own, if allowed). Work with projects from the web console or `oc` (e.g. `oc new-project`, `oc project`).

**Deployments** – You run applications using **Deployment** or **DeploymentConfig** objects. They define the pod template (image, env, resources), number of replicas, and rollout behavior. **Rollout strategies** include rolling (incremental replacement), recreate (stop then start), and custom. A **DeploymentConfig** can have **triggers**: for example an **imageChange** trigger so that when a new image is pushed to the ImageStream the deployment is updated automatically. Example (trigger section only):

```yaml
spec:
  triggers:
    - type: ImageChange
      imageChangeParams:
        automatic: true
        from:
          kind: ImageStreamTag
          name: myapp:latest
        containerNames:
          - myapp
```

You manage deployments via the Workloads page in the console or with `oc` (e.g. `oc rollout status deployment/myapp`, `oc set image deployment/myapp myapp=myimage:newtag`). **Resource quotas** can be set per project (CPU, memory, object counts) to limit how much a project can consume. **Pruning** (removing old builds, deployments, images, etc.) reclaims space: `oc adm prune images`, `oc adm prune builds`, etc., with appropriate flags and safeguards.

---

## Images and ImageStreams

A **container image** is the basic building block: a binary package containing the application and its dependencies. OpenShift provides an **integrated container registry**; you can also use external registries (public or private). **ImageStreams** are an abstraction over container images in registries: they let you refer to an image by a stable name, keep a history of referenced images, and react when a new version of an image is pushed (e.g. trigger a new deployment). **Source-to-Image (S2I)** is a build flow that takes your source code and injects it into a builder image (e.g. for Ruby, Node.js, Python) to produce a runnable image. You can create images from Dockerfiles, from S2I builders, or with custom build scripts; you manage and tag them with ImageStreams and the registry.

---

## Builds

A **build** is the process of turning input (source code, binaries, or other artifacts) into a runnable container image. A **BuildConfig** object defines the entire build workflow: what to use as input, which strategy to use, and where to push the output.

**Build strategies** include:

- **Docker** – Build using a Dockerfile (from Git or supplied inline).
- **Source-to-Image (S2I)** – Use a builder image that expects source code; the builder produces the application image. Good for standard runtimes (Java, Python, Node.js, etc.).
- **Custom** – Run a custom script or process inside a container to produce the image.
- **Pipeline** – Use a pipeline (e.g. Tekton) to run multiple steps; useful for CI/CD flows that run tests, multiple builds, or external tools.

**Source materials** can be Git repositories, local binary input, or external artifacts. Builds run in pods on the cluster; output is typically pushed to the integrated registry or an external registry. A minimal **BuildConfig** (Docker strategy, Git source) looks like this:

```yaml
apiVersion: build.openshift.io/v1
kind: BuildConfig
metadata:
  name: myapp
spec:
  source:
    git:
      uri: https://github.com/org/repo
      ref: main
  strategy:
    type: Docker
    dockerStrategy:
      dockerfilePath: Dockerfile
  output:
    to:
      kind: ImageStreamTag
      name: myapp:latest
  runPolicy: Serial
```

Trigger a build with `oc start-build myapp`; stream logs with `oc logs -f bc/myapp`. **Shipwright** is an alternative, extensible build framework that uses custom resources for defining and running builds on the cluster. Use the official build documentation for step-by-step examples and advanced options (e.g. build hooks, secrets, and multi-stage builds).

---

## What are Operators?

**Operators** take human operational knowledge and encode it into software that runs inside the cluster. Conceptually, they act like an extension of the vendor’s engineering team: they watch the Kubernetes environment and use its current state to make decisions in real time. They handle upgrades, react to failures, and avoid shortcuts (e.g. skipping backups). Technically, Operators are a **method of packaging, deploying, and managing a Kubernetes application** using the Kubernetes API and tools like `oc` and `kubectl`. They use **custom resource definitions (CRDs)** so your application appears as native-looking objects (e.g. a “MongoDB” or “PostgreSQL” resource) that you create and update like any other API object.

**Why use Operators?** They provide repeatable installation and upgrade, constant health checks, over-the-air updates for OpenShift and ISV content, and a way to spread operational knowledge to all users. Kubernetes (and OpenShift) already provides primitives for distributed systems—secrets, load balancing, service discovery, autoscaling—that work across on-premises and clouds. Operators use the same extension mechanism (CRDs) and integrate with the cluster’s RBAC and auditing. Unlike one-off install scripts or service brokers, Operators are **long-running** and can perform **Day 2** operations: scaling, failover, backup, restore, and reconfiguration as the cluster state changes.

---

## Operator Lifecycle Manager and OperatorHub

The **Operator Lifecycle Manager (OLM)** installs, upgrades, and manages the lifecycle of Operators in the cluster, including RBAC for Operator resources. It is deployed by default in OpenShift. OLM uses an **Operator Registry** (or catalog) that stores **Cluster Service Versions (CSVs)** and **CRDs** for each Operator, plus metadata about packages and channels. The registry runs in the cluster and provides this catalog data to OLM so it knows what can be installed and how to upgrade it.

The **Software Catalog** in the web console is where cluster administrators **discover and select Operators** to install. It is the main UI for browsing Red Hat, ISV, and community Operators, choosing a channel and approval strategy (e.g. automatic vs manual approval for upgrades), and installing them. After an Operator is installed, you create **instances** (custom resources defined by that Operator) to run the application—e.g. create a “PostgreSQL” or “Kafka” resource and the Operator provisions and manages it. Newer OpenShift releases also offer **Extensions** and **OLM v1** for managing extensions and Operators; the docs describe the current model for your release. Together, OLM, the registry, and the Software Catalog form the **Operator Framework** experience: not just writing Operators, but testing, delivering, and updating them in a consistent way.

---

## CI/CD, GitOps, and Pipelines

**CI/CD** on OpenShift can be implemented in several ways:

- **OpenShift Pipelines** (Tekton-based) – Serverless, cloud-native CI/CD that runs in isolated containers. You define pipelines and tasks using Tekton custom resources; they run on the cluster and can build images, run tests, and deploy applications. Good for decentralized teams and microservices.
- **BuildConfig and deployments** – Use BuildConfigs to build images from source and image change triggers to automatically start new deployments when new images are pushed. Combine with webhooks or external CI to trigger builds.
- **GitOps** – Declarative continuous deployment: you store desired cluster and application state in Git (manifests, Helm charts, or Kustomize), and a controller (e.g. Argo CD, OpenShift GitOps) reconciles the cluster to match that state. Changes are made by committing to Git; the cluster is the “source of truth” only as a reflection of the repo.
- **Jenkins** – Run Jenkins on OpenShift for traditional pipeline jobs; integrate with OpenShift builds and deployments.

Choose the approach that fits your team and tooling; the official CI/CD and GitOps documentation has detailed procedures.

---

## Serverless and sandboxed containers

**OpenShift Serverless** – Adds serverless (scale-to-zero, event-driven) workloads on OpenShift. You install the Serverless operator and use Knative resources (Services, Eventing) to run workloads that scale to zero when idle and scale up on demand or on events. The docs cover installation, usage, and release notes.

**OpenShift sandboxed containers** – Run workloads in lightweight VMs (microVMs) for stronger isolation than standard containers. Useful for multi-tenant or untrusted code. The sandboxed containers documentation describes how to enable and use them.

---

## References

Use these only when you want more or the latest from the official documentation. Select your OpenShift release from the version selector on the docs site.

- [OpenShift Container Platform – Develop](https://docs.redhat.com/en/documentation/openshift_container_platform/)
- [Building applications](https://docs.redhat.com/en/documentation/openshift_container_platform/html/applications/)
- [Understanding OpenShift development](https://docs.redhat.com/en/documentation/openshift_container_platform/html/architecture/understanding-development)
- [Working with projects](https://docs.redhat.com/en/documentation/openshift_container_platform/html/applications/projects/working-with-projects)
- [Deployments](https://docs.redhat.com/en/documentation/openshift_container_platform/html/applications/deployments/what-deployments-are)
- [Images and ImageStreams](https://docs.redhat.com/en/documentation/openshift_container_platform/html/openshift_images/)
- [Registry](https://docs.redhat.com/en/documentation/openshift_container_platform/html/registry/)
- [Understanding image builds](https://docs.redhat.com/en/documentation/openshift_container_platform/html/cicd/builds/understanding-image-builds)
- [Builds using BuildConfig](https://docs.redhat.com/en/documentation/openshift_container_platform/html/cicd/builds/)
- [Builds using Shipwright](https://docs.redhat.com/en/documentation/openshift_container_platform/html/cicd/builds_using_shipwright/)
- [What are Operators?](https://docs.redhat.com/en/documentation/openshift_container_platform/html/operators/understanding/olm-what-operators-are)
- [Operator Lifecycle Manager](https://docs.redhat.com/en/documentation/openshift_container_platform/html/operators/understanding/olm/olm-understanding-olm)
- [Creating applications from installed Operators](https://docs.redhat.com/en/documentation/openshift_container_platform/html/operators/user/olm-creating-apps-from-installed-operators)
- [Extensions (OLM v1)](https://docs.redhat.com/en/documentation/openshift_container_platform/html/extensions/)
- [CI/CD overview](https://docs.redhat.com/en/documentation/openshift_container_platform/html/cicd_overview/)
- [GitOps](https://docs.redhat.com/en/documentation/openshift_container_platform/html/gitops/)
- [Pipelines](https://docs.redhat.com/en/documentation/openshift_container_platform/html/cicd/pipelines/)
- [Serverless](https://docs.redhat.com/en/documentation/openshift_container_platform/html/serverless/)
- [OpenShift sandboxed containers](https://docs.redhat.com/en/documentation/openshift_container_platform/html/sandboxed_containers/)
- [Learn more about OpenShift – Developer](https://docs.redhat.com/en/documentation/openshift_container_platform/html/welcome/learn_more_about_openshift#Developer)

[← Back to OpenShift deep dive](./README.md)
