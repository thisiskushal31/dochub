# Classical DevOps stack map (LinuxWorld-aligned)

[← Back to CI/CD](./README.md)

Open curriculum check against widely taught **classical DevOps** specializations (e.g. [LinuxWorld Specialisation in DevOps](https://www.hash13.com/specialisation-devops/) / placement-oriented variants on hash13). Their hours skew to Git, Ansible, Jenkins, Docker/Compose/Swarm, Kubernetes, GitLab CI, Prometheus/Grafana, shell, AWS, Terraform. This handbook must not leave those topics as blind spots — either **here** or via an explicit related home.

Timeless guardrail: syllabus Part A rule 9. Spectrum: [19](./19_Delivery_Spectrum_Legacy_Through_Modern.md).

## Topic → handbook home

| Classical / LinuxWorld-style topic | Home in this ecosystem |
|------------------------------------|-------------------------|
| DevOps culture, CI/CD meanings | [Methodologies/](../Methodologies/README.md), [13 Continuous Everything](../Methodologies/13_Continuous_Everything.md) |
| Git / GitHub / PR / branching | [Methodologies/4](../Methodologies/4_Branching_And_PR_Practices.md); Git install → Tooling `Utility/` |
| Shell scripting for ops | [Languages/Shell](../Languages/Shell/README.md); OS context → [Operating-Systems/](../Operating-Systems/README.md) |
| Jenkins jobs, Poll SCM, controller/agents, Maven, Pipeline | [Jenkins/](./Jenkins/README.md), **[20](./20_Classical_Jenkins_Host_And_Web_Deploy.md)** |
| GitLab CI / runners / registry | [GitLab_CI/](./GitLab_CI/README.md), [2](./2_CI_CD_Tools.md) |
| Deploy to Apache/Nginx/Tomcat/systemd on VMs | [20](./20_Classical_Jenkins_Host_And_Web_Deploy.md), [18](./18_VM_MIG_And_Host_Based_Deploy.md), [Servers/](../Servers/README.md) |
| Ansible playbooks / Linux admin automation | [Automation/Ansible](../Automation/Ansible/README.md), [IAC/Ansible](../IAC/Ansible/README.md) |
| Docker images, Compose, multi-tier (web+DB) | Containerization Deep Dive; **delivery:** [21](./21_Compose_And_Swarm_Delivery.md) |
| Docker Swarm rolling / secrets | Containerization; **delivery:** [21](./21_Compose_And_Swarm_Delivery.md) |
| Docker Content Trust / image sign | Map to [6](./6_Supply_Chain_And_Signing.md) (Sigstore/cosign family) |
| Kubernetes CKA/CKAD depth | [Containerization-Deep-Dive](https://github.com/thisiskushal31/Containerization-Deep-Dive) |
| K8s deploy strategies / rollouts | [3](./3_Deployment_Strategies.md), [9](./9_Progressive_Delivery_Controllers.md) |
| Mirantis/MKE / UCP / MSR | Niche vendor — learn Swarm+registry concepts in Containerization; no separate MKE book required |
| Prometheus / Grafana | [Monitoring-And-Observability/](../Monitoring-And-Observability/README.md) |
| Terraform / CloudFormation / AWS IaC | [IAC/](../IAC/README.md), [Cloud/](../Cloud/README.md) |
| AWS EC2, ASG, ELB, S3, IAM | [Cloud/](../Cloud/README.md); VM delivery [18](./18_VM_MIG_And_Host_Based_Deploy.md); static/S3 [17](./17_Static_Sites_And_CDN_Deploy.md) |
| Static sites / CDN | [17](./17_Static_Sites_And_CDN_Deploy.md) |
| Legacy / mainframe-adjacent delivery | [Methodologies/9](../Methodologies/9_Maintenance_And_Legacy.md), [19](./19_Delivery_Spectrum_Legacy_Through_Modern.md) |
| MLOps / model & distributed AI delivery | **[22](./22_MLOps_And_AI_System_Delivery.md)** → DS-AI / DE related repos |
| Agentic / assisted coding on the loop | [Methodologies/19](../Methodologies/19_Durable_Mindsets_And_Evolving_Toolsets.md), [19](./19_Delivery_Spectrum_Legacy_Through_Modern.md) |

## What their syllabus emphasizes that we must keep visible

1. **Host-first CI** — Jenkins on Linux, agents, Poll SCM, deploy to web servers — not only Actions→GKE.  
2. **Compose + Swarm** — multi-tier containers without assuming Kubernetes.  
3. **Ansible + shell** — config and glue for fleets.  
4. **Metrics stack** — Prometheus/Grafana as day-2 after deploy.  
5. **Cloud VM primitives** — EC2/ASG/LB/S3 as first-class, not footnotes.  

AI/ML delivery ([22](./22_MLOps_And_AI_System_Delivery.md)) extends the same promote/verify discipline to **models** and **distributed** train/serve — beyond typical classical course outlines, required for an open modern handbook.

## Honesty check

| If a reader only studied… | They would miss… |
|---------------------------|------------------|
| Only K8s GitOps chapters | Classical Jenkins/VM/Compose path ([20](./20_Classical_Jenkins_Host_And_Web_Deploy.md), [21](./21_Compose_And_Swarm_Delivery.md)) |
| Only classical Jenkins labs | Progressive delivery, supply chain, MLOps ([9](./9_Progressive_Delivery_Controllers.md), [6](./6_Supply_Chain_And_Signing.md), [22](./22_MLOps_And_AI_System_Delivery.md)) |

This folder intentionally covers **both**.

## Next

- Classical path: [20](./20_Classical_Jenkins_Host_And_Web_Deploy.md) → [21](./21_Compose_And_Swarm_Delivery.md)  
- Modern path: [9](./9_Progressive_Delivery_Controllers.md)  
- AI systems: [22](./22_MLOps_And_AI_System_Delivery.md)  
