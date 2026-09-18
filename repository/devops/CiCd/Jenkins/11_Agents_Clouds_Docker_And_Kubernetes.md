# 11 — Agents, clouds, Docker, and Kubernetes

[← Previous](./10_Multibranch_And_Organization_Folders.md) · [README](./README.md) · [Next: Credentials →](./12_Credentials_Secrets_And_Binding.md)

## 1. Concepts

Agents execute work. Controllers schedule and show UI — they should not be your build farm ([03](./03_Architecture_Controller_Agents_Executors.md)).

| Style | Meaning | Typical config |
|-------|---------|----------------|
| **Permanent SSH** | Always-on labeled machine | Nodes → New Node; SSH launcher |
| **Inbound / WebSocket** | Agent connects out to controller | Agent jar / inbound protocol; proxy WebSocket |
| **Docker agent** (Pipeline) | Stage runs in a container image | `agent { docker { image '…' } }` |
| **Dockerfile agent** | Build image from repo then run | `agent { dockerfile { … } }` |
| **Cloud plugin** | Controller provisions ephemeral agents | Manage Jenkins → Clouds |
| **Kubernetes cloud** | Pod templates as agents | K8s cloud + pod template YAML |

```groovy
pipeline {
  agent {
    docker {
      image 'maven:3.9-eclipse-temurin-21'
      args '-v $HOME/.m2:/root/.m2'
      reuseNode true
    }
  }
  stages { stage('T') { steps { sh 'mvn -B test' } } }
}
```

Match **labels** (and label expressions) in Pipeline / “Restrict where this project can be run.”

```groovy
agent { label 'linux && jdk21' }

// Or build from the repo's Dockerfile:
agent {
  dockerfile {
    filename 'Dockerfile.ci'
    additionalBuildArgs '--build-arg JDK=21'
  }
}
```

Kubernetes: prefer pod templates configured on the cloud (UI/JCasC); Pipeline can also use `agent { kubernetes { … } }` when the Kubernetes plugin is installed — copy the snippet from your controller’s snippet generator for the exact syntax your plugin version expects.

## 2. Advanced concepts

### Cloud templates

Templates define image/AMI/pod spec, labels, remote FS root, idle timeout, instance caps, credentials. Treat as platform product — **JCasC** them when possible ([04](./04_Configuration_Surfaces_UI_JCasC_And_Init.md)).

| Knob | Why |
|------|-----|
| Instance / pod caps | Protect cloud bill and API limits |
| Idle timeout | Reap unused agents |
| Labels | Route only intended jobs |
| Retention strategy | Keep vs terminate |

### Kubernetes patterns

Separate docs cover scaling Jenkins on K8s (controller + agents). Watch: resource requests/limits, workspace volumes (emptyDir vs PVC), agent GC, and controller HA story ([20](./20_Scaling_HA_Backup_And_Monitoring.md)).

### Tool auto-install vs image bake

Global Tool Configuration can install JDKs/Maven on agents — or bake tools into images. Prefer immutable images for cattle agents; use tools install for sparse permanent nodes ([19](./19_Managing_Tools_Nodes_Users_And_System.md)).

### Trust and Docker socket

Giving PR jobs a privileged Docker socket is a common foot-gun. Prefer sibling containers, Kaniko/buildah patterns, or dedicated build nodes for image builds.

### Pluggable storage

At scale, externalizing build records/artifacts storage appears in using docs — plan before `$JENKINS_HOME` fills the disk ([15](./15_Artifacts_Fingerprints_And_Promotions.md)).

### Connectivity

Inbound agents behind NAT need correct reverse-proxy WebSocket / remoting settings ([20](./20_Scaling_HA_Backup_And_Monitoring.md)). Offline agents → queue starvation ([25](./25_Jenkinsfile_JCasC_And_Config_Catalog.md)).

## 3. Applications and use cases

| Need | Pattern |
|------|---------|
| Homogeneous Linux CI | Docker cloud or docker Pipeline agents |
| Special hardware / GPU | Permanent labeled agents |
| Burst CI | K8s cloud pods |
| Regulated / air-gap | Permanent agents; no public cloud plugins |

**Good:** ephemeral agents for untrusted code; labels owned by platform. **Bad:** privileged Docker socket on shared PR agents; builds on built-in node.

## References

- [Using agents](https://www.jenkins.io/doc/book/using/using-agents/)  
- [Using Docker with Pipeline](https://www.jenkins.io/doc/book/pipeline/docker/)  
- [Scaling Jenkins on Kubernetes](https://www.jenkins.io/doc/book/scaling/scaling-jenkins-on-kubernetes/)  
- [Administering Jenkins on Kubernetes](https://www.jenkins.io/doc/book/system-administration/administering-jenkins-on-kubernetes/)  
- [Managing nodes](https://www.jenkins.io/doc/book/managing/nodes/)  
