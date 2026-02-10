# Managed Kubernetes & container services

This section gives an overview of managed Kubernetes and container platforms. Use them when you want to run Kubernetes or container workloads without managing the control plane (or nodes) yourself. All descriptions below are drawn from the official product documentation; links are at the end of each service and in References.

**Kubernetes fundamentals:** Before using a managed service, it helps to understand [Kubernetes concepts](https://kubernetes.io/docs/concepts/) and [getting started](https://kubernetes.io/docs/setup/). This repo’s [Kubernetes deep dive](../orchestration/kubernetes/README.md) covers concepts, tasks, and operations.

---

## Google Kubernetes Engine (GKE)

**What it is:** GKE is a managed implementation of the Kubernetes open source container orchestration platform. Google Cloud manages the control plane and, in Autopilot mode, the worker nodes. You deploy and operate containerized applications at scale on Google Cloud infrastructure.

**Modes:**

- **Autopilot (recommended):** Google Cloud manages both the control plane and the nodes. You pay for the compute resources your running Pods request. Built-in hardening and best-practice configurations are applied; node auto-repair and automatic scaling are included.
- **Standard:** Google manages the control plane; you manage node pools. You pay for all resources on nodes. Use when you need to manually manage node pools or have specific infrastructure requirements.

**Benefits (from official docs):** Platform management (CI/CD with Cloud Build and Cloud Deploy, Config Sync, release channels, node auto-repair, maintenance windows); security (security posture dashboard, Policy Controller, Container-Optimized OS); cost optimization (Autopilot pay-per-Pod, Spot Pods for batch); reliability (highly available control plane and nodes in Autopilot and regional Standard, >99% monthly uptime SLO, Pod-level SLA in Autopilot).

**Use cases (from official docs):** Reliable applications under heavy load, scalable platforms, data processing at scale, AI/ML operations. GKE has a [free tier](https://cloud.google.com/kubernetes-engine/pricing#cluster_management_fee_and_free_tier) for getting started.

**Official documentation:**

- [GKE documentation](https://cloud.google.com/kubernetes-engine/docs)
- [GKE overview (concepts)](https://cloud.google.com/kubernetes-engine/docs/concepts)
- [Autopilot overview](https://cloud.google.com/kubernetes-engine/docs/concepts/autopilot-overview)
- [Quickstart: Create a cluster and deploy a workload](https://cloud.google.com/kubernetes-engine/docs/quickstarts/create-cluster)
- [GKE security](https://cloud.google.com/kubernetes-engine/docs/concepts/security-overview)
- [GKE networking](https://cloud.google.com/kubernetes-engine/docs/concepts/network-overview)
- [Pricing](https://cloud.google.com/kubernetes-engine/pricing)

---

## Amazon Elastic Kubernetes Service (EKS)

**What it is:** Amazon EKS is a fully managed Kubernetes service. AWS removes much of the operational complexity of running Kubernetes. You can run Kubernetes clusters in the AWS cloud and, with EKS Anywhere and EKS Hybrid Nodes, in your own data centers.

**Modes:**

- **EKS Standard:** AWS manages the Kubernetes control plane (API server, scheduler, controllers, etc.). You manage (or use tools to manage) worker nodes. You get certified Kubernetes-conformant APIs and can use standard Kubernetes tooling and plugins.
- **EKS Auto Mode:** AWS also manages the nodes. Infrastructure is provisioned automatically, compute is selected and scaled, costs are optimized, OS patching is done for you, and integration with AWS security services is included.

**Features (from official docs):** Management interfaces (Console, API/SDKs, CDK, CLI, eksctl, CloudFormation, Terraform); access control (Kubernetes RBAC and AWS IAM); compute (EC2 instance types, Nitro, Graviton; Fargate for serverless); storage (EBS, EFS, FSX, File Cache via CSI drivers; EKS Auto Mode creates storage classes with EBS); security (shared responsibility model, GuardDuty, best practices); monitoring (observability dashboard, Prometheus, CloudWatch, CloudTrail, ADOT). EKS Capabilities provide managed add-ons (e.g. Argo CD, AWS Controllers for Kubernetes, kro). EKS is certified Kubernetes-conformant and offers standard and extended support for Kubernetes versions.

**Related AWS services (from official docs):** EC2, EBS, ECR, CloudWatch, Managed Service for Prometheus, Elastic Load Balancing, GuardDuty, Resilience Hub.

**Pricing (from official docs):** Per-cluster pricing (version support), EKS Auto Mode pricing, and per vCPU for Hybrid Nodes. You also pay for the AWS resources used by worker nodes (e.g. EC2, EBS, Fargate). Savings Plans apply to compute used in EKS clusters.

**Official documentation:**

- [Amazon EKS User Guide](https://docs.aws.amazon.com/eks/latest/userguide/)
- [What is Amazon EKS?](https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html)
- [Get started with Amazon EKS](https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html)
- [EKS Capabilities](https://docs.aws.amazon.com/eks/latest/userguide/capabilities.html)
- [Amazon EKS Pricing](https://aws.amazon.com/eks/pricing/)

---

## Azure Kubernetes Service (AKS)

**What it is:** AKS is a managed Kubernetes service for deploying and managing containerized applications. Azure manages the control plane at no extra cost. You get a managed control plane and pay for the nodes that run your workloads. AKS is described as suitable when you need minimal container orchestration expertise and want reduced operational overhead. It is [CNCF-certified](https://www.cncf.io/training/certification/software-conformance/) and compliant with SOC, ISO, PCI DSS, and HIPAA (see [Azure compliance](https://azure.microsoft.com/explore/trusted-cloud/compliance/)).

**Container solutions in Azure (from official docs):** AKS (managed Kubernetes), Azure Red Hat OpenShift (managed Kubernetes), Azure Arc–enabled Kubernetes (unmanaged), Azure Container Instances (managed container instances), Azure Container Apps (managed Kubernetes-based). The docs recommend comparing service models and compute options for your scenario.

**When to use AKS (from official docs):** Lift-and-shift to containers; microservices with horizontal scaling, self-healing, load balancing, secret management; secure DevOps; bursting with ACI (virtual nodes); ML model training (e.g. TensorFlow, Kubeflow); data streaming; Windows Server containers on AKS.

**Features (from official docs):** Identity and security (Azure Policy, Kubernetes RBAC, Microsoft Entra ID); logging and monitoring (Container Insights, Advanced Container Networking Services); deployments (smart defaults, KEDA, Draft for AKS); clusters and nodes (multiple node pools, Windows Server containers, cluster autoscaler, horizontal pod autoscaler, confidential computing nodes); storage (Azure Disks and Files CSI drivers, Azure NetApp Files, Azure Container Storage); networking (CNI options, bring-your-own CNI, application routing add-on); development (Helm, VS Code Kubernetes extension, Istio-based service mesh add-on).

**Official documentation:**

- [AKS documentation](https://learn.microsoft.com/en-us/azure/aks/)
- [What is Azure Kubernetes Service (AKS)?](https://learn.microsoft.com/en-us/azure/aks/intro-kubernetes)
- [Quickstart: Deploy an AKS cluster (portal)](https://learn.microsoft.com/en-us/azure/aks/learn/quick-kubernetes-deploy-portal)
- [Core Kubernetes concepts for AKS](https://learn.microsoft.com/en-us/azure/aks/concepts-clusters-workloads)
- [Azure Well-Architected Framework for AKS](https://learn.microsoft.com/en-us/azure/well-architected/service-guides/azure-kubernetes-service)

---

## Red Hat OpenShift

**What it is:** OpenShift is Red Hat’s Kubernetes-based application platform. The official documentation describes OpenShift Container Platform as having layered offerings that add functionality and extend cluster capabilities (e.g. operators and operator life cycles). It runs on-premises and in the cloud; Red Hat also offers managed and hosted offerings such as Red Hat OpenShift Service on AWS (ROSA) and Azure Red Hat OpenShift (ARO).

**Platform deep-dive in this repo:** For OpenShift Container Platform concepts, installation, configuration, development, Operators, networking, security, and observability, see the [OpenShift deep-dive](../orchestration/openshift/README.md). That section is based on the official Red Hat documentation and links to it for full procedures.

**Official documentation:**

- [OpenShift documentation](https://docs.openshift.com/)
- [OpenShift Container Platform 4.21](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/)
- [Red Hat OpenShift](https://www.redhat.com/en/technologies/cloud-computing/openshift)

---

## Certified Kubernetes platforms

The [Kubernetes site](https://kubernetes.io/docs/setup/production-environment/turnkey-solutions/) lists **certified Kubernetes conformant** platforms (managed and self-managed). For the latest list and provider-specific details, see:

- [Turnkey Cloud Solutions (Kubernetes)](https://kubernetes.io/docs/setup/production-environment/turnkey-solutions/)

---

## When to use which

- **GKE:** Google Cloud workloads, integration with GCP (Cloud Build, Cloud Deploy, Artifact Registry, observability). Autopilot for minimal node management. Anthos for hybrid/multi-cloud.
- **EKS:** AWS workloads, integration with IAM, VPC, EC2, ECR, and other AWS services. EKS Auto Mode for fully managed nodes; EKS Anywhere for on-premises.
- **AKS:** Azure workloads, integration with Microsoft Entra ID, ACR, and Azure services. Azure Red Hat OpenShift (ARO) for OpenShift on Azure.
- **OpenShift:** Enterprise Kubernetes with Red Hat support, operator ecosystem, and layered platform features. ROSA (AWS), ARO (Azure), and other managed/hosted options.

For concepts and hands-on Kubernetes without a specific cloud, use the [Kubernetes documentation](https://kubernetes.io/docs/) and this repo’s [Kubernetes deep dive](../orchestration/kubernetes/README.md).

---

## Related

- **[Kubernetes](../orchestration/kubernetes/README.md)** – concepts, tasks, tutorials
- **[Containerization basics](../containerization-basic/README.md)** – containers, images, runtimes
- **[Container runtimes](../runtimes/README.md)** – Docker, Podman

---

## References (official only)

- [Kubernetes: Turnkey solutions](https://kubernetes.io/docs/setup/production-environment/turnkey-solutions/)
- [GKE documentation](https://cloud.google.com/kubernetes-engine/docs)
- [Amazon EKS User Guide](https://docs.aws.amazon.com/eks/latest/userguide/)
- [Azure AKS documentation](https://learn.microsoft.com/en-us/azure/aks/)
- [OpenShift documentation](https://docs.openshift.com/)
