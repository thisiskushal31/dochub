# Assets

Images and diagrams used in the DevOps Handbook. **Credit is given in the topic MD file** that uses each image.

**Priority:** When an image fits the context, use it first for visual understanding. In each topic, the flow is **text → image → code block** (only if more detail is needed). Download and store images here; do not hotlink.

## Structure

| Folder | Use for |
|--------|---------|
| `Operating-Systems/` | OS, kernel, process, memory, request flow, data transmission, RAID (e.g. GeeksforGeeks, ByteByteGo). |
| `Methodologies/` | DevOps culture, SRE, platform engineering (e.g. ByteByteGo DevOps vs SRE). |
| `CiCd/` | CI/CD pipelines, deployment strategies (e.g. ByteByteGo CI/CD, deployment guides). |
| `IAC/` | Terraform, CloudFormation, IaC diagrams (e.g. ByteByteGo Terraform). |
| `Cloud-Native/` | Docker, Kubernetes, service mesh, cloud-native (e.g. ByteByteGo Docker, K8s). |
| `Observability/` | Logging, tracing, metrics, dashboards (e.g. ByteByteGo logging/tracing/metrics). |
| `Security/` | Security and compliance visuals when added. |
| `Languages/` | Language and tooling diagrams (e.g. C++ OOP, STL; GeeksforGeeks C++). Use `Languages/C-C++/` for C/C++ images, `Languages/Objective-C/` for Objective-C, `Languages/Nim/` for Nim, etc. |

Create a section subfolder when you first add an image for that section.

## Image sources

When adding images, use these (and credit in the topic file):

- **GeeksforGeeks [Operating System Tutorial](https://www.geeksforgeeks.org/operating-systems/operating-systems/)** — Kernel, process states (two-, five-, seven-state), system call (intro and types), deadlock, paging, memory management, file systems, disk scheduling, and more. Many OS articles include diagrams; download from the article page (images are on `media.geeksforgeeks.org`), store under `Assets/Operating-Systems/` with a clear name (e.g. `gfg-kernel.webp`, `gfg-process-states-modified.png`), and credit in the topic (e.g. "Image: [GeeksforGeeks – Kernel in Operating System](URL)").
- **ByteByteGo [Computer Fundamentals](https://bytebytego.com/guides/computer-fundamentals/)** — Process vs thread, deadlock, paging vs segmentation, memory/storage, boot. For Operating-Systems and Fundamentals.
- **ByteByteGo [DevOps and CI/CD](https://bytebytego.com/guides/devops-cicd/)** — CI/CD, Docker, Kubernetes, deployment, observability, Terraform. For CiCd, Cloud-Native, IAC, Observability.
- **GeeksforGeeks [C++ (OOP, STL)](https://www.geeksforgeeks.org/cpp/object-oriented-programming-in-cpp/)** — OOP concepts (classes/objects, encapsulation, inheritance, polymorphism). Download from article pages (images on `media.geeksforgeeks.org`), store under `Assets/Languages/C-C++/` with names like `gfg-types-of-oops.gif`, `gfg-encapsulation.webp`, and credit in the topic (e.g. "Image: [GeeksforGeeks – Object Oriented Programming in C++](URL)").
- Other references as noted in topic files. (Tecmint RAID series is linked as **further reading** in RAID topics; use only substantive technical diagrams or screenshots from external sites, not article banners or generic thumbnails.)

## Rules

- **Download** the image from the original page; do not hotlink.
- **Store** under `Assets/<Section>/` with a clear filename (e.g. `bytebytego-cicd-pipeline.png`, `gfgo-intro-os-diagram.png`).
- **Reference** in the topic with a relative path (e.g. `![CI/CD pipeline](../Assets/CiCd/bytebytego-cicd-pipeline.png)`).
- **Credit** in the topic (e.g. "Image: [GeeksforGeeks – Kernel in Operating System](URL)" or "Image: [ByteByteGo – CI/CD Pipeline](URL)").
