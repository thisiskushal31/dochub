# 18 — Classical host and web deploy

[← Previous](./17_Plugins_Update_Center_And_Hygiene.md) · [README](./README.md) · [Next: Managing →](./19_Managing_Tools_Nodes_Users_And_System.md)

---

## 1. Concepts

Jenkins still runs the **classical** industry path: Poll SCM → Maven/Gradle → archive WAR/JAR → copy to VM → restart Apache/Tomcat/systemd. That path is taught in depth in:

**[CiCd/20 — Classical Jenkins host and web deploy](../20_Classical_Jenkins_Host_And_Web_Deploy.md)**

This chapter is the door from the Jenkins product track into that lab — don’t duplicate the full host syllabus here.

| Pattern | Jenkins side |
|---------|----------------|
| Poll SCM | Trigger when webhooks unavailable |
| Permanent Linux agent | Labeled JDK/Maven host |
| Archive artifacts | WAR/JAR for deploy job |
| SSH publish / scripts | Deploy over SSH |
| Rolling on VMs | Serial host update ([CiCd/18](../18_VM_MIG_And_Host_Based_Deploy.md)) |

---

## 2. Advanced concepts

Prefer Pipeline even for classical deploys while keeping the same host mechanics. Promote by **immutable artifact** (fingerprint) rather than rebuilding on the deploy job ([15](./15_Artifacts_Fingerprints_And_Promotions.md)).

```groovy
pipeline {
  agent none
  stages {
    stage('Package') {
      agent { label 'linux && maven' }
      steps {
        sh 'mvn -B -DskipTests package'
        archiveArtifacts artifacts: 'target/*.war', fingerprint: true
      }
    }
    stage('Deploy') {
      when { branch 'main' }
      agent { label 'deploy' }
      steps {
        copyArtifacts projectName: env.JOB_NAME, filter: 'target/*.war',
                      selector: specific(env.BUILD_NUMBER)
        sshagent(credentials: ['prod-ssh']) {
          sh '''
            scp target/*.war deploy@app01:/opt/myapp/app.war
            ssh deploy@app01 'sudo systemctl restart myapp'
          '''
        }
      }
    }
  }
}
```

(`copyArtifacts` needs the Copy Artifact plugin — common in classical estates.) Full host/systemd lab: [CiCd/20](../20_Classical_Jenkins_Host_And_Web_Deploy.md). Stack map: [CiCd/23](../23_Classical_DevOps_Stack_Map.md).

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Learn classical CI/CD | Follow CiCd/20 end-to-end |
| Modernize without big-bang | Multibranch + same SSH deploy stage |

**Good:** classical ops with Pipeline-as-code. **Bad:** ignoring classical estates because “GitOps only.”

---

## References

- [Classical Jenkins host and web deploy](../20_Classical_Jenkins_Host_And_Web_Deploy.md)  
- [Using agents](https://www.jenkins.io/doc/book/using/using-agents/)  
- [Fingerprints](https://www.jenkins.io/doc/book/using/fingerprints/)  
