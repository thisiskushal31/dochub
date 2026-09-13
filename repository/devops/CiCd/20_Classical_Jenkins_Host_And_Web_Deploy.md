# Classical Jenkins, host, and web-server delivery

[← Back to CI/CD](./README.md)

Training programs that teach “classical DevOps” (e.g. LinuxWorld-style specializations) spend heavy hours on **Jenkins + Git + Linux hosts + web/app servers** before Kubernetes. That path is still how many enterprises ship. This chapter is that adapter.

Related: [Jenkins/](./Jenkins/README.md), [18](./18_VM_MIG_And_Host_Based_Deploy.md), [Automation/](../Automation/README.md), [Servers/](../Servers/README.md), [Languages/Shell](../Languages/Shell/README.md). Spectrum: [19](./19_Delivery_Spectrum_Legacy_Through_Modern.md).

---

## Durable classical loop

```text
Git commit
  → Jenkins detects change (webhook or Poll SCM)
  → agent builds (Maven/Gradle/npm/make) on Linux (or Docker agent)
  → tests
  → artifact (WAR/JAR/tarball/deb)
  → deploy to Apache/Nginx/Tomcat/systemd service on VM(s)
  → smoke (curl) → notify
```

Same jobs as [1](./1_Pipelines_Build_Test_Deploy.md); different trigger and deploy adapters.

---

## Triggers: webhook vs Poll SCM

| Trigger | Meaning | Prefer when |
|---------|---------|-------------|
| **Webhook** | Git host pushes event to Jenkins | Default modern setup |
| **Poll SCM** | Jenkins cron-polls Git for new commits | Legacy networks, no inbound webhooks, air-gapped mirrors |

Poll SCM is slower and chatty; still common in classical labs and locked-down networks. Document interval and timezone; do not pretend it is “real-time CI.”

---

## Controller and agents (“master/slave” era → controller/agent)

Older docs say **master/slave**. Current Jenkins language is **controller** and **agents**.

| Pattern | Use |
|---------|-----|
| **Permanent Linux agent** | Labeled host with build tools (JDK, Maven, Node) |
| **Docker agent** | Job runs inside a container with a pinned image |
| **Dynamic agents** | Cloud/K8s plugin spins agents per build |

Classical LinuxWorld-style labs: install Jenkins on a cloud VM, attach a second Linux (or Docker) agent, build on the agent, deploy to a web VM. Harden: agents are as sensitive as CD credentials ([Security/5](../Security/5_OIDC_CI_And_Least_Privilege.md), [11](./11_Pipeline_As_Code_Runners_Caching_Matrix.md)).

---

## Freestyle → Pipeline as code

| Era | Shape |
|-----|--------|
| **Freestyle job** | UI clicks: SCM, build steps, post-actions — hard to review |
| **Pipeline (Jenkinsfile)** | Groovy Declarative/Scripted in Git — reviewable |

Migrate freestyle to Jenkinsfile when you can; keep freestyle only while bridging. Shared libraries encode org standards (pin versions).

Maven/Gradle “build step” plugins belong in the **build** stage; produce a versioned artifact ([4](./4_Artifacts_And_Registries.md), [12](./12_Release_Versioning_And_Changelogs.md)).

---

## When teams move from Jenkins to GitHub Actions

If the repo’s system of record is **GitHub** and you do not need a self-operated CI control plane, many teams replace freestyle/Jenkinsfile PR CI with **Actions workflows** — less controller/plugin/agent upkeep when using GitHub-hosted runners. Keep Jenkins when air-gap, custom agents, or a healthy shared platform already earns its keep.

Same *jobs* on Actions: PR CI, **scheduled** inventory/cost audits, **manual** RC→prod image promote ([24](./24_Workflow_Automation_Beyond_PR_CI.md), [GitHub_Actions/](./GitHub_Actions/README.md)).

---

## Practical deploy targets (non-K8s)

| Target | Pipeline action |
|--------|-----------------|
| **Apache / Nginx static or reverse proxy** | `rsync`/`scp` docroot or Ansible role; reload |
| **Tomcat / app server** | Deploy WAR; careful with sessions |
| **systemd service** | Install package/tarball; `systemctl restart`; health URL |
| **Multi-tier** | App tier + DB migrate job ([7](./7_DB_Migrations_In_Pipelines.md)); never “hope” schema matches |

Shell scripts that wrap `scp`, `systemctl`, and `curl` are valid **pipeline steps** — put them in Git, not only on the bastion ([Languages/Shell](../Languages/Shell/README.md)). Prefer Ansible for multi-host idempotence ([Automation/Ansible](../Automation/Ansible/README.md)).

---

## Rolling upgrades without Kubernetes

- Update **one host** behind LB → smoke → next (manual or Ansible serial)  
- Or bake **new AMI/image** → MIG/ASG roll ([18](./18_VM_MIG_And_Host_Based_Deploy.md))  
- Or blue-green two target groups ([3](./3_Deployment_Strategies.md))  

LinuxWorld-style “Docker image update + rolling” on VMs is the same idea: replace instances gradually with health checks.

---

## Illustrative freestyle-era shape (conceptual)

```text
Job: app-ci
  SCM: Git repo, Poll SCM H/5 * * * *
  Build: mvn -B clean verify
  Post: archive target/*.war
Job: app-deploy-staging
  Copy artifact from app-ci
  SSH to staging → install WAR → curl /healthz
```

Replace with Multibranch Pipeline + webhook when the network allows.

---

## Pitfalls

| Pitfall | Better |
|---------|--------|
| Only Poll SCM forever when webhooks work | Prefer push triggers |
| Build on the controller | Dedicated agents |
| Deploy by hand after green build | Scripted deploy job |
| One snowflake web VM | Config management + image |

## Next

- Compose/Swarm classical containers: [21](./21_Compose_And_Swarm_Delivery.md)  
- Jenkins primer: [Jenkins/](./Jenkins/README.md)

## Further reading

- [Jenkins — Distributed builds](https://www.jenkins.io/doc/book/using/using-agents/)  
- [Jenkins — Pipeline](https://www.jenkins.io/doc/book/pipeline/)  
