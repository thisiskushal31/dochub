# DevOps Handbook

Comprehensive DevOps handbook covering methodologies, best practices, tooling guides, automation patterns, and real-world implementation notes — from CI/CD and infrastructure-as-code to cloud-native architectures, observability, and security.

**How we treat other topics (e.g. networking):** This handbook is about **DevOps**. Where we mention networking, security, or other domains, we keep it short and give enough context so you can move forward without leaving. If you want to go deeper, we point you to the right deep-dive repo (e.g. Networks-Deep-Dive for networking). Same idea applies for other deep dives — optional, not required to progress.

## Structure

This handbook is how software is **delivered**. Start at [Methodologies/0 — SE learning DevOps](./Methodologies/0_SE_Learning_DevOps_Start_Here.md) if you are new; jump a folder if you already know the job.

- **[`Methodologies/`](./Methodologies/)** — DevOps culture, practices, workflows, and team collaboration — **start at [0_SE_Learning_DevOps_Start_Here.md](./Methodologies/0_SE_Learning_DevOps_Start_Here.md)**
- **[`CiCd/`](./CiCd/)** — Continuous Integration and Continuous Delivery pipelines, practices, and tools
- **[`IAC/`](./IAC/)** — Infrastructure as Code: Terraform, CloudFormation, Pulumi, and best practices
- **[`Automation/`](./Automation/)** — Config-management automation (Ansible and kin), not app workflow tools
- **[`Cloud/`](./Cloud/)** — AWS / GCP / Azure literacy (shared concepts, not cert dumps)
- **[`Cloud-Native/`](./Cloud-Native/)** — Cloud-native architectures, patterns, and platform engineering
- **[`Servers/`](./Servers/)** — Web servers, reverse proxies, host lifecycle (nginx, Apache, …)
- **[`Observability/`](./Observability/)** — Monitoring, logging, tracing, SLO/SLI; one folder per tool (Prometheus, Grafana, OpenTelemetry, etc.)
- **[`Security/`](./Security/)** — Pipeline gates, secrets, compliance — not the full cyber program
- **[`Operating-Systems/`](./Operating-Systems/)** — **Fundamentals/** (OS-agnostic theory), **Linux/**, **Windows/**, **Unix/**, **MacOS/**
- **[`Languages/`](./Languages/)** — General-purpose and niche languages (syntax depth lives here)
- **[`Assets/`](./Assets/README.md)** — Images and diagrams (credited in the topic files)

**Application frameworks** live in [Tooling-and-Frameworks-Deep-Dive](https://github.com/thisiskushal31/Tooling-and-Frameworks-Deep-Dive). Do not duplicate them as `Frameworks/` here. Git and Make live in Tooling `Utility/`. What Docker and Kubernetes *are* lives in [Containerization-Deep-Dive](https://github.com/thisiskushal31/Containerization-Deep-Dive).

## Visual guides and images

We use **diagrams and images** where they help (stored under `Assets/<Section>/` and credited in each topic). For extra visual learning alongside the handbook:

- **[GeeksforGeeks — Operating System Tutorial](https://www.geeksforgeeks.org/operating-systems/operating-systems/)** — OS basics, kernel, process states, system call, deadlock, memory, file systems, disk scheduling, and more. Many articles include diagrams; we use and credit them in **Operating-Systems** topics (e.g. kernel, process and PCB, request flow).
- **[ByteByteGo — Computer Fundamentals](https://bytebytego.com/guides/computer-fundamentals/)** — Process vs thread, deadlock, paging vs segmentation, memory and storage, boot process. Great for **Operating Systems** and fundamentals.
- **[ByteByteGo — DevOps and CI/CD](https://bytebytego.com/guides/devops-cicd/)** — CI/CD pipelines, Docker, Kubernetes, deployment strategies, logging/tracing/metrics, Terraform, and more. Use as visual reference for **CiCd**, **Cloud-Native**, **IAC**, and **Observability** as we add content.
- **[Tecmint — RAID series](https://www.tecmint.com/?s=RAID)** — Introduction to RAID, RAID levels, and Linux **mdadm** tutorials (RAID 0/1/5/6/10, grow array, recover/rebuild). Linked as further reading in **Operating-Systems** RAID topics.

Images from these sources can be downloaded into the right `Assets/` subfolder and linked from topic files (with credit). This keeps the handbook engaging and consistent with our content guidelines.

## How to use

1. Start with [**Methodologies/0 — SE learning DevOps**](./Methodologies/0_SE_Learning_DevOps_Start_Here.md) or `Methodologies/` for culture
2. Use `Operating-Systems/` for OS fundamentals (theory first in **Fundamentals/**), then Linux, Windows, Unix, or macOS implementation and commands
3. Use `Languages/` when you need to read or write code (Python for automation, Go for K8s/Terraform, etc.)
4. Jump into [`CiCd/`](./CiCd/) or [`IAC/`](./IAC/) based on your immediate needs
5. Use `Servers/` for web tier; `Cloud/` for provider literacy; sister repos in the table below
6. Use `Automation/` for workflow and orchestration patterns
7. Reference `Observability/` and `Security/` for production operations
8. Keep checklists and commands handy — [Commands-and-Cheatsheets](https://github.com/thisiskushal31/Commands-and-Cheatsheets)

## Where to go deeper

When a topic here touches another domain, we give enough context to continue in this handbook. If you want full-depth coverage, see these repositories:

| Topic | Repository | What’s there |
|-------|------------|--------------|
| **Networking** | [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive) | Physical layer to cloud-native: foundations, transport, routing, security, observability, labs. |
| **Containers** | [Containerization-Deep-Dive](https://github.com/thisiskushal31/Containerization-Deep-Dive) | Runtimes (Docker, Podman), orchestration (Kubernetes, Swarm, OpenShift), managed (GKE, EKS, AKS). |
| **Databases & object storage** | [Databases-Deep-Dive](https://github.com/thisiskushal31/Databases-Deep-Dive) | Relational, NoSQL, analytical, vector; engines and managed services. For why S3, GCS, or similar object stores are used and how they fit in, see this repo. |
| **System design** | [System-Design-Concepts](https://github.com/thisiskushal31/System-Design-Concepts) | Patterns, components, trade-offs; fundamentals, caching, messaging, case studies. |
| **DSA** | [Datastructures-and-Algorithms](https://github.com/thisiskushal31/Datastructures-and-Algorithms) | Data structures and algorithms notes and solutions (GFG, Leetcode). |
| **Commands** | [Commands-and-Cheatsheets](https://github.com/thisiskushal31/Commands-and-Cheatsheets) | Essential commands and cheatsheets (languages, DevOps & cloud, databases). |
| **Data / messaging / cache (ops literacy)** | [Databases-Deep-Dive](https://github.com/thisiskushal31/Databases-Deep-Dive) · [System-Design-Concepts](https://github.com/thisiskushal31/System-Design-Concepts) · Kafka engine → [DE Systems](https://github.com/thisiskushal31/Data-Engineering-Deep-Dive) | Backups, connection strings; design-time Cache/queue choice. |
| **Local dev parity** | [Containerization-Deep-Dive `Local-Dev/`](https://github.com/thisiskushal31/Containerization-Deep-Dive) | kind, minikube, compose, Tilt. |
| **Data engineering** | [Data-Engineering-Deep-Dive](https://github.com/thisiskushal31/Data-Engineering-Deep-Dive) | How a fact becomes a table. |
| **Data science & AI** | [Data-Science-AI-Deep-Dive](https://github.com/thisiskushal31/Data-Science-AI-Deep-Dive) | Learning / retrieval jobs. |
| **Tooling & frameworks** | [Tooling-and-Frameworks-Deep-Dive](https://github.com/thisiskushal31/Tooling-and-Frameworks-Deep-Dive) | Frameworks (Django, FastAPI) and utilities (Git, Make). Not language syntax. |
| **Cybersecurity** | [Security-Deep-Dive](https://github.com/thisiskushal31/Security-Deep-Dive) | Full cyber program. Handbook `Security/` = delivery gates only. |

## Contributing — content guidelines

When adding content:

- **Flow in each topic:** **Text first** → **then image** (if it fits the context) → **code block** only if something more is needed (e.g. thought flow, step-by-step).
- **Images are first priority** when they fit: store under `Assets/<Section>/`, reference in the topic right after the text they illustrate, and **credit** the original source (e.g. "Image: [ByteByteGo – CI/CD Pipeline](URL)").
- If there’s no suitable image, use a **code block** for visual understanding (diagram, flow, or fundamentals).
- Content must be **standalone** (beginner-to-advanced) with references at the end of each topic. Be **factually correct**; verify when unsure.
- **External links:** Use only **GitHub repository URLs** for other repos. For a database or object store (e.g. S3, GCS) that has only a placeholder in Databases-Deep-Dive, link to that repo path (e.g. `.../Databases-Deep-Dive/tree/main/Relational/MySQL`).

## Contributing

- Prefer concise, copy/paste-ready commands and configurations
- Include real-world examples and common pitfalls
- Document trade-offs and when to use specific patterns
- Keep examples minimal and reproducible
