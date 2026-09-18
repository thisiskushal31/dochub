# 02 — Install the controller and LTS

[← Previous](./01_What_Is_Jenkins.md) · [README](./README.md) · [Next: Architecture →](./03_Architecture_Controller_Agents_Executors.md)

## 1. Concepts

Install a **controller** first (not a zoo of agents). Prefer **LTS** for production.

| Method | When |
|--------|------|
| Linux package (systemd) | Classic VM/bare metal |
| Windows installer / service | Windows controllers |
| macOS | Labs / small teams |
| Docker / Docker Compose | Labs and some prod patterns |
| Generic WAR + Java | Constrained / servlet-container literacy |
| Kubernetes (Helm / operator patterns) | Cloud-native controllers |
| Offline / air-gap | Vendored Update Center / plugins |
| Cloud marketplace images | Fast start — still harden |

Post-install **setup wizard**: admin password, plugins (**suggested** set is a starting point — audit what you keep), first user, instance security.

Also set **Jenkins URL** early (correct links in mail/webhooks) and prefer **0 executors** on the built-in node so builds land on agents ([03](./03_Architecture_Controller_Agents_Executors.md)).

Lab-shaped Docker controller (pin a current LTS tag from official install docs — do not copy an old tag forever):

```bash
docker run --name jenkins --rm -p 8080:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  jenkins/jenkins:lts
```

Open `http://localhost:8080`, complete the setup wizard, then set built-in executors to **0**. WAR path literacy: `java -jar jenkins.war` (see install docs for Java version).

## 2. Advanced concepts

### Initial settings that matter

| Setting | Why |
|---------|-----|
| URL / root URL | Correct links in notifications |
| Executors on built-in node | Prefer **0** on controller — build on agents |
| Security realm / authz | Never leave open anon admin |
| Update Center | How plugins are fetched |

### Kubernetes install

Helm charts and K8s-specific install docs exist — literacy; values encyclopedias stay upstream ([11](./11_Agents_Clouds_Docker_And_Kubernetes.md), [20](./20_Scaling_HA_Backup_And_Monitoring.md)).

### Platform information

Java/OS compatibility and “platform information” handbook pages — pin supported combinations before upgrading.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Lab | Docker LTS + one Docker agent |
| Enterprise VM | Package install + reverse proxy + backup day-0 |
| K8s platform | Helm controller + K8s cloud agents |

**Good:** LTS + documented install + backup before plugins. **Bad:** latest weekly in prod with no snapshot.

## References

- [Installing Jenkins](https://www.jenkins.io/doc/book/installing/)  
- [Docker](https://www.jenkins.io/doc/book/installing/docker/)  
- [Kubernetes](https://www.jenkins.io/doc/book/installing/kubernetes/)  
- [LTS changelog](https://www.jenkins.io/changelog-stable/)  
