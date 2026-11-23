# Docker and Kubernetes scenario bank

Scenario questions for [Containerization-Deep-Dive](../README.md). Numbered drills, not trivia. Each one is a situation you can be handed on call or in an interview: a symptom, a constraint, and a decision.

Public write-ups of this material are short. The lists people pass around are tens of questions, sometimes a few hundred mixed with definitions. This file turns those recurring incident shapes into **1639** numbered scenarios so the same muscle gets practice across services, namespaces, and wrong first fixes.

The shapes come from the official troubleshooting model and from production write-ups, rewritten here so the notes stand on their own:

- Kubernetes: [debug Pods](https://kubernetes.io/docs/tasks/debug/debug-application/debug-pods/), [debug Services](https://kubernetes.io/docs/tasks/debug/debug-application/debug-service/), [Horizontal Pod Autoscaler](https://kubernetes.io/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/)
- Docker: [Dockerfile best practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/), [storage](https://docs.docker.com/engine/storage/), [networking](https://docs.docker.com/engine/network/)
- Topic map also used: CKA / CKAD / CKS domains (workloads, scheduling, services, storage, troubleshooting, RBAC, admission, supply chain), plus production patterns from public scenario articles (Pending versus CrashLoopBackOff versus ImagePullBackOff, probe restarts during a dependency blip, HPA `<unknown>`, PDB blocking drain, overlay disk fill, multi-stage images, digest versus tag). Those articles are a map of failure shapes, not text copied into this file.

## How to answer one of these

Use the same loop every time. The scenario number does not change the loop.

1. Say what the status actually means. `CrashLoopBackOff`, `Pending`, and `ImagePullBackOff` are different layers.
2. Name the evidence you would read before changing anything: events, last termination, previous logs, endpoints, quota, or the Dockerfile stage that actually shipped.
3. Pick the cause that fits that evidence. Keep neighboring causes on the list until the event rules them out.
4. Change the smallest thing that matches the cause. Deleting a pod that a controller owns is not a change.
5. Say what would make this class of failure obvious or impossible next time: a probe split, a request, a digest pin, a PDB that matches the replica count, a log on stdout.

## How to use the numbers

Work a section until the answers feel repetitive, then move. Sections near the top are the core patterns. Sections whose titles say **incident drills**, **failed fixes**, or **on-call reads** repeat those patterns on different services on purpose, so a fix that only works for one app name gets caught.

| | |
|---|---|
| Scenarios in this file | **1639** |
| Where to start | [Core scenarios, worked](./Core_Scenarios_Worked.md) — the patterns the bank drills, written out in full |
| Docker notes | [Runtimes/Docker](../Runtimes/Docker/README.md) |
| Kubernetes notes | [Orchestration/Kubernetes](../Orchestration/Kubernetes/README.md) |

## Index

| # | Section | Questions |
|---:|---|---:|
| 1–53 | Docker — images and builds | 53 |
| 54–73 | Docker — registry, tags, and pull | 20 |
| 74–96 | Docker — process lifecycle | 23 |
| 97–113 | Docker — CPU, memory, and disk | 17 |
| 114–127 | Docker — storage | 14 |
| 128–144 | Docker — networking | 17 |
| 145–161 | Docker — Compose | 17 |
| 162–176 | Docker — security | 15 |
| 177–209 | Kubernetes — pod lifecycle | 33 |
| 210–235 | Kubernetes — scheduling | 26 |
| 236–255 | Kubernetes — probes and rollouts | 20 |
| 256–273 | Kubernetes — workloads | 18 |
| 274–297 | Kubernetes — Services, DNS, and ingress | 24 |
| 298–305 | Kubernetes — NetworkPolicy | 8 |
| 306–319 | Kubernetes — storage | 14 |
| 320–329 | Kubernetes — config and secrets | 10 |
| 330–344 | Kubernetes — RBAC, admission, and supply chain | 15 |
| 345–354 | Kubernetes — autoscaling | 10 |
| 355–366 | Kubernetes — nodes, pressure, and drain | 12 |
| 367–378 | Kubernetes — control plane, etcd, certificates, upgrades | 12 |
| 379–385 | Kubernetes — quotas, limits, and namespaces | 7 |
| 386–610 | Kubernetes — incident drills: scheduling and capacity | 225 |
| 611–760 | Kubernetes — incident drills: probes | 150 |
| 761–910 | Kubernetes — incident drills: data plane | 150 |
| 911–985 | Kubernetes — incident drills: storage | 75 |
| 986–1135 | Kubernetes — incident drills: identity | 150 |
| 1136–1210 | Kubernetes — incident drills: node pressure | 75 |
| 1211–1285 | Kubernetes — incident drills: release | 75 |
| 1286–1315 | Docker — incident drills: build and ship | 30 |
| 1316–1345 | Docker — incident drills: runtime | 30 |
| 1346–1375 | Docker — incident drills: data | 30 |
| 1376–1390 | Docker — incident drills: resources | 15 |
| 1391–1405 | Docker — incident drills: security | 15 |
| 1406–1485 | Kubernetes — failed fixes | 80 |
| 1486–1525 | Docker — failed fixes | 40 |
| 1526–1539 | Kubernetes — local clusters and managed clouds | 14 |
| 1540–1579 | Docker to Kubernetes — translation drills | 40 |
| 1580–1639 | On-call reads — what is the next command and why | 60 |

## Docker — images and builds

1. You own a Go API. The Dockerfile is FROM golang:1.22, then go build and CMD in that same stage. In CI, the image is 1.2 GB and every node pull blows the rollout deadline. Which stages do you split, what is the final base, and which files must not survive into it?

2. You own a Node service. The Dockerfile is npm install and npm run build happen after COPY . .. In CI, changing one source file rebuilds node_modules from scratch. What copy order and which BuildKit cache mount stop that?

3. You own a Java service. The Dockerfile is a JDK image is the runtime, and the fat jar is 80 MB of a 700 MB image. In CI, startup is slow and CVE count is dominated by the JDK. What do you copy into a JRE or distroless base, and what breaks if the app needs a shell for the probe?

4. You own a Python API. The Dockerfile is pip install is not pinned and the build is not locked. In CI, two builds a day apart produce different site-packages. What file do you commit, and which instruction must run before COPY of the rest of the tree?

5. You own a Rust worker. The Dockerfile is the build uses the default dynamic glibc link. In CI, the binary will not start on distroless/static. Which linker flags make it static, and how do you confirm with ldd before you switch the final FROM?

6. You own a frontend. The Dockerfile is the build stage emits /dist but the runtime stage copies the whole repo. In CI, nginx is serving .git and source maps you did not mean to ship. What do you COPY --from, and what belongs in .dockerignore?

7. You own a monorepo. The Dockerfile is one Dockerfile at the repo root sends the entire git history as context. In CI, builds take four minutes before the first instruction. What do you put in .dockerignore, and when would you rather set a smaller context path?

8. You own a private module. The Dockerfile is go mod download needs a token. In CI, someone baked the token into an ENV and it shows up in docker history. How do you pass it as a BuildKit secret so it is not in a layer?

9. You own a apt-based image. The Dockerfile is apt-get update and apt-get install are separate RUN lines. In CI, the install layer hits a stale index and fails halfway through CI. Why must they be one RUN, and what else do you delete in that same layer?

10. You own a healthcheck. The Dockerfile is the image HEALTHCHECK curls localhost but curl is not installed. In CI, the container is always unhealthy and Compose never starts dependents. What binary do you actually have, or which instruction should you drop because Kubernetes probes replace it?

11. You own a USER. The Dockerfile is the process runs as root because USER was never set. In CI, a writable-layer escape in a library becomes a root process on the node. Where do you add the user, and which files must be chowned in the same layer that creates them?

12. You own a ENTRYPOINT. The Dockerfile is ENTRYPOINT is the shell form. In CI, SIGTERM never reaches the app and Kubernetes waits the full terminationGracePeriodSeconds. What is the exec form, and what does PID 1 have to do with zombie reaping?

13. You own a CMD override. The Dockerfile is CMD ["node", "server.js"] and someone runs docker run IMAGE bash. In CI, bash replaces the whole command and the server never starts. When do you want ENTRYPOINT for the binary and CMD for default args instead?

14. You own a latest tag. The Dockerfile is CI tags every build :latest and also deploys :latest. In CI, a rollback pulls whatever was pushed last, not the previous release. What immutable reference do you deploy, and what is latest allowed to mean?

15. You own a cache bust. The Dockerfile is a RUN apt-get sits above COPY of a file that changes hourly. In CI, the apt layer reruns every build even though packages did not change. What order keeps the expensive layer cached?

16. You own a multi-arch. The Dockerfile is the image was built on an Apple Silicon laptop and pushed. In CI, the server is amd64 and the container exits exec format error. How do you build and push a manifest list for amd64 and arm64?

17. You own a scratch. The Dockerfile is the final stage is FROM scratch and the app needs CA certificates and /etc/passwd. In CI, TLS calls fail and the non-root user does not exist. What do you copy from the build stage besides the binary?

18. You own a npm ci. The Dockerfile is the Dockerfile runs npm install in production. In CI, devDependencies ship and the lockfile is ignored. Which command honors the lockfile, and which env var drops devDependencies?

19. You own a layer secret. The Dockerfile is a RUN echoes an API key into a file, then a later RUN deletes it. In CI, the key is still recoverable from the earlier layer. Why does deleting in a later layer not remove the secret, and what is the right mechanism?

20. You own a build context. The Dockerfile is docker build is run from $HOME. In CI, the context upload is 20 GB and the daemon times out. What directory should be the context, and how does COMPOSE_FILE or -f not fix the context by itself?

21. A reviewer flags this Dockerfile pattern: COPY package.json package-lock.json before COPY . . Why is that a problem (the lockfile layer stays cached when only application source changes)? What do you change, in which instruction?

22. A reviewer flags this Dockerfile pattern: COPY . . before RUN pip install -r requirements.txt. Why is that a problem (every source edit invalidates the dependency layer)? What do you change, in which instruction?

23. A reviewer flags this Dockerfile pattern: RUN apt-get update in one stage and apt-get install in a later stage. Why is that a problem (the install uses a stale package index)? What do you change, in which instruction?

24. A reviewer flags this Dockerfile pattern: a HEALTHCHECK that hits a remote dependency. Why is that a problem (the image is marked unhealthy whenever that dependency blips, even though the process is fine)? What do you change, in which instruction?

25. A reviewer flags this Dockerfile pattern: ADD https://example.com/app.tar.gz /. Why is that a problem (the remote tarball is baked in with no checksum and ADD also auto-extracts)? What do you change, in which instruction?

26. A reviewer flags this Dockerfile pattern: ENV DEBIAN_FRONTEND=noninteractive left in the final stage. Why is that a problem (every later interactive apt in a debug shell inherits it)? What do you change, in which instruction?

27. Production images use ubuntu:latest. A teammate treats that tag as stable. What actually happens (the digest moved under you and a CVE scan that passed yesterday fails today)? What reference do you pin instead?

28. Production images use node:current. A teammate treats that tag as stable. What actually happens (current is not a contract and the major Node version jumps on the next build)? What reference do you pin instead?

29. Production images use python:3. A teammate treats that tag as stable. What actually happens (the minor version floats and a wheel built last week no longer matches)? What reference do you pin instead?

30. Production images use alpine. A teammate treats that tag as stable. What actually happens (musl breaks a wheel that was built against glibc)? What reference do you pin instead?

31. Production images use scratch. A teammate treats that tag as stable. What actually happens (there is no shell, no package manager, and no CA bundle unless you copied them)? What reference do you pin instead?

32. Production images use distroless. A teammate treats that tag as stable. What actually happens (kubectl exec and docker exec have nothing to run, so probes must be in-process or you accept that)? What reference do you pin instead?

33. The build context includes .git. What is the risk (history and secrets in old commits)? Where do you exclude it, and what do you check with docker build --progress=plain to prove it was not sent?

34. The build context includes node_modules. What is the risk (a host-built tree that does not match the image libc)? Where do you exclude it, and what do you check with docker build --progress=plain to prove it was not sent?

35. The build context includes *.md and tests. What is the risk (context bloat with zero runtime value)? Where do you exclude it, and what do you check with docker build --progress=plain to prove it was not sent?

36. The build context includes .env. What is the risk (local secrets uploaded to the daemon and possibly into a layer)? Where do you exclude it, and what do you check with docker build --progress=plain to prove it was not sent?

37. The build context includes terraform state. What is the risk (cloud credentials sitting in the build context)? Where do you exclude it, and what do you check with docker build --progress=plain to prove it was not sent?

38. The build context includes coverage and dist from the host. What is the risk (stale artifacts copied over the in-image build)? Where do you exclude it, and what do you check with docker build --progress=plain to prove it was not sent?

39. CI builds with DOCKER_BUILDKIT=0: a RUN --mount=type=cache line fails. What has to be enabled, and what syntax directive belongs on line 1?

40. two stages are named build and the COPY --from=build is ambiguous: the wrong stage's binary is copied. How do you name stages so --from is deterministic?

41. the Dockerfile sets ARG VERSION and also ENV VERSION=$VERSION: VERSION is now in the image config and in every container's environment. When is ARG enough, and when is leaking it into ENV a bug?

42. a Windows developer uses CRLF in the entrypoint shell script: the container crashes with no such file or directory because of a hidden \r. How do you catch that in the image build?

43. the app writes logs to a file instead of stdout: docker logs is empty during an outage. What do you change in the process, not in a logging driver, so the platform can collect it?

44. WORKDIR is not set and COPY uses absolute and relative paths mixed: the binary lands in / and the runtime user cannot see it where CMD looks. What WORKDIR and which COPY destinations make the layout obvious?

45. you need a small debug image and a small prod image from one Dockerfile: prod is being rebuilt with apt-get install curl just for operators. How do you add a debug target stage without changing the default prod target?

46. BuildKit cache is shared across branches on one builder: a feature branch picks up another branch's go-mod cache and a private replace directive. When is a shared cache wrong, and what cache key or scope do you set?

47. the image runs as uid 1000 but the base image already uses 1000 for a different user: files are owned by an unexpected name and a volume init fails. How do you pick a uid and record it so Kubernetes runAsUser matches?

48. docker build --pull is not set: the base image is months old on the builder even though the registry has patches. When do you force a pull, and why is pinning by digest stronger than --pull?

49. a multi-stage build leaves the toolchain as the default target: the registry promotion job pushes the builder stage. What --target do you set in CI, and how do you check the pushed image has no compiler?

50. COPY --chown is omitted and the process drops privileges: the app cannot read its own config and exits 1. Where does the chown have to happen so it is in the layer the runtime user uses?

51. you squash layers in CI to hide a secret: the secret was in history on the registry already and squash is not a security control. What do you rotate, and how should the secret have been mounted?

52. the Dockerfile uses shell redirects in exec-form RUN: the build fails because exec form does not invoke a shell. Which form do you use when you need a pipe, and how do you keep it as one layer?

53. an ONBUILD instruction in a base image surprises a child build: a downstream Dockerfile triggers a copy the author did not write. Why do you avoid ONBUILD in shared bases?

## Docker — registry, tags, and pull

54. docker push fails with denied. the tag is still dockerhub user/app and the credential is for a private registry. What three names must agree: local tag, login host, and the repository path?

55. ECR pull works on your laptop and fails on the node. the node role has no ecr:GetAuthorizationToken. Why does a successful local pull prove nothing about the kubelet or containerd identity?

56. GHCR packages are private. Kubernetes ImagePullBackOff says pull access denied. What imagePullSecret or cloud identity has to exist in the pod namespace, not in your docker config?

57. you retag an image without pulling. the digest behind :1.4 changed and :1.4-rollback still points at the new digest. How do you record the digest at deploy time so a retag cannot move production?

58. Docker Hub rate-limits anonymous pulls. a node scale-out at 09:00 starts failing with toomanyrequests. What identity should the runtime use, and why is mirroring the base images onto your registry the durable fix?

59. two images share a tag in two regions. a failover cluster runs different bytes under the same tag. What do you replicate: the tag, or the manifest digest?

60. a CI job uses docker login in a shared builder. the next job from another repo pushes to your registry with your creds. How do you scope credentials to the job and wipe the config?

61. you delete a tag but not the digest. clusters that pin the digest keep running a image you thought you removed. What does deletion of a tag actually remove?

62. manifest list push succeeds but one platform is missing. arm nodes crash with exec format error while amd64 is fine. How do you inspect the index before you call the rollout done?

63. a registry mirror is configured on the daemon. builds still hit Docker Hub and the mirror logs are empty. Which daemon.json key is for pull-through, and which clients ignore it?

64. image was pushed with a cosign signature. the admission policy rejects it as unsigned. What identity signed it, and which identity is the policy expecting?

65. you promote by rebuilding in prod. the prod binary is not the bytes that passed CI. What do you promote instead of rebuilding?

66. latest and v1.2.0 diverge. the dashboard shows v1.2.0 but the node is running whatever latest was on Friday. Which reference is in the Deployment spec?

67. a short name nginx is pulled. one cluster resolves it to Docker Hub and another to a private mirror with a different nginx. Why do you always use a fully qualified registry host?

68. credentials are in a committed config.json. anyone with the repo can push. Where do those credentials live instead, and what do you revoke today?

69. Pull succeeds with a laptop docker login and fails with the containerd config on the node. What credential path is the runtime actually using, and which one did you test by mistake?

70. Pull succeeds with a GitHub Actions GITHUB_TOKEN and fails with a long-lived robot account in the cluster. What credential path is the runtime actually using, and which one did you test by mistake?

71. Pull succeeds with an ECR authorization token and fails with a token that expired after 12 hours during a slow rollout. What credential path is the runtime actually using, and which one did you test by mistake?

72. Pull succeeds with an imagePullSecret in namespace dev and fails with the same Deployment in namespace prod. What credential path is the runtime actually using, and which one did you test by mistake?

73. Pull succeeds with a daemon.json registry-mirrors entry and fails with a cri-o cluster that does not read the docker daemon file. What credential path is the runtime actually using, and which one did you test by mistake?

## Docker — process lifecycle

74. You see this: the container exits 0 immediately. the process was a shell script that finished its last command. Why is a container not a virtual machine that stays up, and what has to be the foreground process?

75. You see this: restart policy is always and the app crashes on a missing env var. the host is burning CPU restarting a container that can never succeed. Which restart policy fits a bad config, and what do you look at in docker inspect State.ExitCode before you raise replicas?

76. You see this: restart policy is no and a transient network blip killed the process. the container stays dead until a human notices. When is on-failure the better policy, and when should the orchestrator own restarts instead of the daemon?

77. You see this: docker stop takes 10 seconds and then SIGKILL. the app ignores SIGTERM. What is the default grace period, how do you change it, and what must PID 1 do with the signal?

78. You see this: a shell is PID 1. zombies accumulate and the container eventually wedges. Why does a shell not reap, and which init do people add when the app cannot be PID 1?

79. You see this: docker exec into a distroless container fails. there is no shell. How do you still get a thread dump or a filesystem listing without baking a shell into prod?

80. You see this: the app logs only after it daemonizes. docker thinks the container exited because the parent returned. Why must the process stay in the foreground?

81. You see this: stop sends SIGTERM to PID 1 but the worker is a child. jobs are cut mid-flight. How does the entrypoint have to forward signals?

82. You see this: OOM killer sends SIGKILL. no finally blocks run and the lock file is left behind. Why can you not catch exit 137, and what lock strategy survives an unclean death?

83. You see this: you set --init. signals and zombies improve but your custom entrypoint no longer sees the app as PID 1. When is tini worth it, and what changes in the process tree?

84. You see this: HEALTHCHECK fails three times. the daemon marks the container unhealthy but does not restart it unless you also set a restart policy or a Swarm/Compose condition. What does unhealthy mean by itself?

85. You see this: docker rm -f on a container with a named volume. the volume is still there. What did you delete, and what command actually removes the data?

86. You see this: docker rm -f on a container that wrote to the writable layer. the data is gone. Why was that data in the wrong place?

87. You see this: you update the image tag and docker start the old container. it keeps the old filesystem. Why does start not pick up a new image, and what command creates a new container from the new image?

88. You see this: two containers share a PID namespace. a kill in one can see processes of the other. When would you set pid: host or share a namespace, and why is that not the default?

89. A container exits 0. That usually means the process finished cleanly. What do you check next so you treat it as a job that ended, not a crash? What would be the wrong first move?

90. A container exits 1. That usually means the application returned a generic error. What do you check next so you read stdout and stderr before you touch the orchestrator? What would be the wrong first move?

91. A container exits 2. That usually means a shell builtin misuse or a missing file in a script. What do you check next so you check the entrypoint script and its interpreter? What would be the wrong first move?

92. A container exits 126. That usually means the file is not executable or a permission problem. What do you check next so you check the bit and the mount options? What would be the wrong first move?

93. A container exits 127. That usually means command not found. What do you check next so you the binary or the dynamic linker path is wrong for this base image? What would be the wrong first move?

94. A container exits 137. That usually means SIGKILL, often the OOM killer. What do you check next so you check memory limits and dmesg before you raise replicas? What would be the wrong first move?

95. A container exits 139. That usually means SIGSEGV. What do you check next so you this is an application bug, not a Docker networking bug? What would be the wrong first move?

96. A container exits 143. That usually means SIGTERM. What do you check next so you something stopped it on purpose; see who sent the signal? What would be the wrong first move?

## Docker — CPU, memory, and disk

97. a container with no --memory limit. one leak makes the host OOM and ssh dies before the container does. Which flag caps it, which cgroup file is that on cgroup v2, and why is --oom-kill-disable the wrong safety?

98. --memory 512m is set and the JVM sees the host's 64 GB in /proc/meminfo. the heap is sized to the host and the container is OOMKilled at 512m. Where does the process have to read the limit?

99. --cpus 0.5 is set. the container is throttled, not killed, and latency climbs. How is that different from a memory limit, and which metric shows throttling?

100. --cpu-shares 512 next to a neighbor at 1024. shares only matter when the CPU is contended. What do you tell someone who thinks shares are a hard cap?

101. pids-limit is unset and a fork bomb runs. the node PID table fills and docker itself cannot spawn. Which limit contains that?

102. the overlay2 directory fills the disk. pulls fail with no space left on device even though df on the data volume looks fine if you checked the wrong mount. Where does Docker store layers, and what do you prune versus what must you not prune on a node that is running containers?

103. log driver json-file with no rotation. one chatty container fills the disk. What max-size and max-file do you set, and why is logging to a volume still your problem?

104. memory reservation is 256m and the limit is 1g. under pressure the kernel reclaims above the reservation first. Which one is a hard kill line?

105. you set --memory-swap equal to --memory. the container cannot swap. When is that what you want for a latency-sensitive process?

106. two containers have no CPU limit on a CI runner. builds steal from the daemon and healthchecks time out. What budget do you put on the build container?

107. the host is on cgroup v1 and the docs you followed are v2 paths. you cannot find memory.max. How do you tell which hierarchy is mounted?

108. a container is OOMKilled but docker stats showed 40% of the host. the limit, not the host, was exhausted. Which number matters?

109. Someone asks what --memory actually programs in the kernel. Which cgroup v2 file is it (memory.max), and what is the user-visible effect (hard OOM kill at the cap)? What does the container see in /proc that lies about this?

110. Someone asks what --memory-reservation actually programs in the kernel. Which cgroup v2 file is it (memory.high), and what is the user-visible effect (soft reclaim before the hard cap)? What does the container see in /proc that lies about this?

111. Someone asks what --cpus actually programs in the kernel. Which cgroup v2 file is it (cpu.max), and what is the user-visible effect (throttle, do not kill)? What does the container see in /proc that lies about this?

112. Someone asks what --cpu-shares actually programs in the kernel. Which cgroup v2 file is it (cpu.weight), and what is the user-visible effect (relative weight only under contention)? What does the container see in /proc that lies about this?

113. Someone asks what --pids-limit actually programs in the kernel. Which cgroup v2 file is it (pids.max), and what is the user-visible effect (cap threads and processes)? What does the container see in /proc that lies about this?

## Docker — storage

114. MySQL data is under /var/lib/mysql inside the container. docker rm wipes the database. What mount do you add, and what survives rm versus what survives volume rm?

115. a bind mount of the source tree over /app. the anonymous volume or image's /app/node_modules disappears. Why does the mount hide the files that were built into the image?

116. a named volume is mounted into a non-root container. the data directory is root-owned from the first run and the app cannot write. When does Docker copy image contents into an empty volume, and as which uid?

117. two containers write the same bind-mounted file. you get torn writes and no locking from Docker itself. What does Docker not provide here?

118. you use tmpfs for a secret file. it vanishes on stop, which is what you wanted, until a process restarts and expects the file to still be there. Who has to rewrite it on every start?

119. the volume driver is local and you move the container to another host. the data is not on the new host. Why is a local volume not a network filesystem?

120. SELinux denies the container access to a bind mount. the app sees permission denied even though chmod is 777. What mount option labels the path for the container?

121. you docker cp a file in to hotfix prod. the next recreate loses it. Why is that not a release?

122. overlay2 shows a huge upper dir. the container is writing data that should have been a volume. How do you tell writable-layer growth from image size?

123. a volume is shared with :ro. the app's migration step fails to write. Where do you allow writes, and where do you keep the mount read-only?

124. You are choosing a named volume. When is it the right tool (database files that must outlive the container)? When is it the wrong tool (a path you need to edit from the host editor as yourself)?

125. You are choosing a bind mount. When is it the right tool (live source in development)? When is it the wrong tool (the only copy of production data on a laptop path)?

126. You are choosing a tmpfs. When is it the right tool (secrets and scratch that must not hit disk)? When is it the wrong tool (anything you need after a restart)?

127. You are choosing a anonymous volume. When is it the right tool (a mount the Dockerfile VOLUME created that you forgot about)? When is it the wrong tool (data you intend to back up, because you will not remember its id)?

## Docker — networking

128. two containers are on the default bridge and one tries to ping the other's name. DNS name resolution fails. Why does the default bridge not give service DNS, and what do you create instead?

129. a container listens on 127.0.0.1:8080. -p 8080:8080 still does not accept traffic from the host's LAN path the way you expect. Where did the process bind, and what address must it bind to inside the namespace?

130. -p 8080:80 is published. another container on the same bridge still cannot use localhost:8080 to reach it. What address is the published port on, and what DNS name should the other container use?

131. you use --network host. the app works and you have also given it the host's network namespace. What isolation did you drop, and which port conflict appears next?

132. a user-defined bridge has an MTU of 1500 on a cloud VPC that is 1460 or less. TLS handshakes hang while small pings work. What symptom is that, and where do you set MTU?

133. IPv6 is disabled and the app only binds v6. the port publish looks up but connections reset. What do you check with ss inside the container?

134. docker DNS is 127.0.0.11. a process that replaces resolv.conf with 8.8.8.8 can no longer resolve other compose service names. What did it break?

135. hairpin traffic to the published port from inside the same container fails. the app calls its own public URL. Why does that path differ from calling the other container by service name?

136. you open the container firewall with ufw on the host and forget Docker's iptables rules. published ports bypass the policy you thought you wrote. Where does Docker install its NAT rules relative to your host firewall?

137. --network none. the process cannot reach anything but loopback. When is that the right sandbox?

138. macvlan. the container has a LAN MAC and the host cannot ping it. What is the usual host-to-macvlan limitation?

139. a corporate proxy is required. apt inside the build fails and the running container also cannot reach the webhook. Which of build args, daemon config, and container env do you set? They are not the same knob.

140. Someone proposes the bridge network driver. When is it justified (single-host container-to-container with DNS on a user-defined network)? When is it a mistake (multi-host overlay or giving every container the host NIC)?

141. Someone proposes the host network driver. When is it justified (a packet-path tool that must see host interfaces and you accept the loss of isolation)? When is it a mistake (a normal API next to other APIs)?

142. Someone proposes the none network driver. When is it justified (a batch job that should have no network)? When is it a mistake (anything that must call a database)?

143. Someone proposes the overlay network driver. When is it justified (Swarm services across nodes)? When is it a mistake (a single-host compose file where a bridge is enough)?

144. Someone proposes the macvlan network driver. When is it justified (a legacy app that must be a first-class LAN citizen)? When is it a mistake (Kubernetes, which has its own CNI and will fight you)?

## Docker — Compose

145. depends_on without a healthcheck. the API starts before Postgres accepts connections and crash-loops. What condition do you wait for, and why is depends_on alone only start order?

146. both services use the default network and published ports to talk. the API is configured with localhost as the database host. What hostname must the API use from inside its own network namespace?

147. a compose file and a Dockerfile both set environment variables. the one you edited is not the one the process sees. What is the precedence of env_file, environment, and the image ENV?

148. profiles are used for a debug sidecar. docker compose up does not start it and someone thinks the file is broken. How do you turn a profile on, and why is it off by default?

149. you bind-mount over the image's entrypoint. a Windows checkout breaks the script. What did the mount hide?

150. compose project name differs between two directories. you get a second network and a second volume and the data looks 'lost'. What key isolates the project?

151. scale: 3 on a service that bind-mounts a single host port. the second replica fails to bind. What cannot be replicated that way?

152. a secret is passed with environment instead of secrets. it is visible in docker inspect and in the process environ. What compose secret mount keeps it out of the image and out of inspect config?

153. you docker compose down. named volumes survive. What flag deletes them, and why should that not be in the production muscle memory?

154. you docker compose down -v on a shared dev database volume. the team's data is gone. What should you have removed instead?

155. the compose file builds a different context than CI. local works and the pipeline image does not. What do you diff: the compose build section or the image that was actually pushed?

156. healthcheck interval is 30s and start_period is 0. a slow JVM is killed before it listens. Which timer has to cover startup?

157. A compose stack is flaky. The current setting is `docker compose up`. Why is `docker compose up -d --build --wait` the thing you switch to, and what incident does it prevent?

158. A compose stack is flaky. The current setting is `localhost in the app config`. Why is `the compose service name` the thing you switch to, and what incident does it prevent?

159. A compose stack is flaky. The current setting is `depends_on: db`. Why is `depends_on with condition service_healthy` the thing you switch to, and what incident does it prevent?

160. A compose stack is flaky. The current setting is `ports: 5432:5432 on the database`. Why is `expose only, and let the API use the compose network` the thing you switch to, and what incident does it prevent?

161. A compose stack is flaky. The current setting is `a restart: always on a migration container`. Why is `a one-shot service that must exit 0` the thing you switch to, and what incident does it prevent?

## Docker — security

162. the container is --privileged. a container breakout becomes host root. What narrower capability or device did you actually need?

163. cap_sys_admin is added. you have nearly privileged behavior with a friendlier flag. Why is that capability not a small grant?

164. the socket /var/run/docker.sock is mounted in. the container can start a privileged sibling and own the host. What API did you just hand over?

165. a root process in the container with no user namespace. files it writes on a bind mount are root on the host. What does rootless or userns-remap change?

166. seccomp is unconfined. syscalls the default profile would block are allowed. When, if ever, do you drop the default profile?

167. AppArmor or SELinux is disabled because it was noisy. the noise was a real denial. What do you change in the policy instead of disabling the LSM?

168. the image runs apt-get upgrade at container start. startup is nondeterministic and a mirror outage takes prod down. Where do patches belong?

169. trivy fails the build on a CVE in a package the app never uses. the base image is debian with a full userland. What smaller base removes the package instead of waiving the CVE?

170. read-only root filesystem. the app crashes because it writes /tmp. What tmpfs do you add, and what does the read-only root still buy you?

171. no-new-privileges is unset and a setuid binary is in the image. a user in the container can gain the file owner's privileges. Which flag blocks that transition?

172. You enable USER nonroot. What class of incident does it stop (accidental root writes and a class of privileged escapes)? What does it not stop (kernel exploits or a mounted docker socket)?

173. You enable --cap-drop ALL then add back. What class of incident does it stop (the default capability set)? What does it not stop (misconfiguration of the volume you mounted from the host)?

174. You enable read-only root. What class of incident does it stop (tampering with the image filesystem at runtime)? What does it not stop (a writable volume you also mounted)?

175. You enable default seccomp. What class of incident does it stop (many uncommon syscalls)? What does it not stop (a vulnerable app protocol on a normal syscall)?

176. You enable pinning by digest. What class of incident does it stop (a tag moving under you)? What does it not stop (a CVE that was already in that digest)?

## Kubernetes — pod lifecycle

177. A pod shows Pending for 20 minutes. That status means FailedScheduling. What is the first evidence you collect so you can read the event before you delete anything? What does deleting the pod fail to change?

178. A pod shows Pending with no FailedScheduling. That status means a PVC that is not bound, or an init container that has not finished, or a sandbox that cannot start. What is the first evidence you collect so you can decide whether this is the scheduler or something after bind? What does deleting the pod fail to change?

179. A pod shows ContainerCreating for a long time. That status means a volume attach or a secret projection or a CNI ADD that is stuck. What is the first evidence you collect so you can describe the pod and look at the event after Scheduled? What does deleting the pod fail to change?

180. A pod shows ImagePullBackOff. That status means name, tag, digest, or credentials. What is the first evidence you collect so you can separate a missing image from a missing identity? What does deleting the pod fail to change?

181. A pod shows ErrImagePull. That status means the first failure, before the backoff. What is the first evidence you collect so you can read it now; BackOff will hide the original message if you only skim status? What does deleting the pod fail to change?

182. A pod shows CrashLoopBackOff. That status means the process exits and the kubelet is waiting longer between tries. What is the first evidence you collect so you can logs --previous and the exit code? What does deleting the pod fail to change?

183. A pod shows Running but not Ready. That status means a readiness probe or a readiness gate. What is the first evidence you collect so you can traffic is withheld on purpose? What does deleting the pod fail to change?

184. A pod shows OOMKilled. That status means the cgroup limit, not 'the node is small' by itself. What is the first evidence you collect so you can exit 137 plus the memory limit? What does deleting the pod fail to change?

185. A pod shows Completed. That status means a Job succeeded or the process exited 0 under restartPolicy Never. What is the first evidence you collect so you can do not treat it as a failure? What does deleting the pod fail to change?

186. A pod shows Error. That status means restartPolicy is Never or OnFailure and the container exited non-zero. What is the first evidence you collect so you can this will not loop; CrashLoopBackOff is the other policy? What does deleting the pod fail to change?

187. A pod shows Unknown. That status means the node stopped reporting. What is the first evidence you collect so you can the kubelet or the node, not the app manifest? What does deleting the pod fail to change?

188. A pod shows Terminating for more than the grace period. That status means a finalizer or a volume detach or a process that ignores SIGTERM. What is the first evidence you collect so you can do not force-delete as the first move? What does deleting the pod fail to change?

189. The last termination state is exit code 0 (the process exited cleanly; with restartPolicy Always it still restarts, which surprises people). Which field in the pod status shows that, and which fix matches this code rather than a neighboring code?

190. The last termination state is exit code 1 (application error; read the previous logs). Which field in the pod status shows that, and which fix matches this code rather than a neighboring code?

191. The last termination state is exit code 137 (SIGKILL; on Kubernetes this is usually the memory cgroup or an explicit kill). Which field in the pod status shows that, and which fix matches this code rather than a neighboring code?

192. The last termination state is exit code 139 (segfault in the application). Which field in the pod status shows that, and which fix matches this code rather than a neighboring code?

193. The last termination state is exit code 143 (SIGTERM; a probe, a rollout, or a human stopped it). Which field in the pod status shows that, and which fix matches this code rather than a neighboring code?

194. The last termination state is exit code 127 (the command in the image was not found). Which field in the pod status shows that, and which fix matches this code rather than a neighboring code?

195. The last termination state is exit code 126 (the command is not executable). Which field in the pod status shows that, and which fix matches this code rather than a neighboring code?

196. kubectl describe shows Reason CreateContainerConfigError. That means a referenced ConfigMap or Secret key is missing. What object do you open next, and what change to the pod template actually addresses it?

197. kubectl describe shows Reason CreateContainerError. That means the runtime rejected the spec, often a bad mount or command. What object do you open next, and what change to the pod template actually addresses it?

198. kubectl describe shows Reason RunContainerError. That means the process could not be started after create. What object do you open next, and what change to the pod template actually addresses it?

199. kubectl describe shows Reason KillContainerError. That means the runtime could not kill; rare, look at the node. What object do you open next, and what change to the pod template actually addresses it?

200. kubectl describe shows Reason PreStartHookError. That means a lifecycle hook failed. What object do you open next, and what change to the pod template actually addresses it?

201. kubectl describe shows Reason PostStartHookError. That means a lifecycle hook failed after start. What object do you open next, and what change to the pod template actually addresses it?

202. kubectl describe shows Reason ImageInspectError. That means the runtime could not inspect a pulled image. What object do you open next, and what change to the pod template actually addresses it?

203. kubectl describe shows Reason InvalidImageName. That means the image string is not a valid reference. What object do you open next, and what change to the pod template actually addresses it?

204. kubectl describe shows Reason CrashLoopBackOff. That means repeated exits; the reason is the previous termination, not the backoff itself. What object do you open next, and what change to the pod template actually addresses it?

205. The pod uses an init container: an init container waits for a database TCP port. Where does that trap show up (the port is open before the database accepts logins, so the app still crashes)? How do you tell an init failure from an app failure in the describe output?

206. The pod uses an init container: an init container runs a migration. Where does that trap show up (two replicas run the migration at once)? How do you tell an init failure from an app failure in the describe output?

207. The pod uses an init container: an init container uses an image that is not pulled yet. Where does that trap show up (the app container looks Pending and people debug the app)? How do you tell an init failure from an app failure in the describe output?

208. The pod uses an init container: an init container exits 0 without doing the work because the command was a shell string in exec form. Where does that trap show up (the shell syntax was not executed)? How do you tell an init failure from an app failure in the describe output?

209. The pod uses an init container: an init container requests more memory than the namespace quota. Where does that trap show up (the pod stays Pending and the app image is never pulled)? How do you tell an init failure from an app failure in the describe output?

## Kubernetes — scheduling

210. A pod is Pending and the event says `0/6 nodes are available: insufficient cpu`. That means requests, not usage, do not fit. What is the fix (lower the request or add capacity; do not delete the pod)? Why is restarting the scheduler the wrong first action?

211. A pod is Pending and the event says `0/6 nodes are available: insufficient memory`. That means the memory request does not fit allocatable. What is the fix (same rule as CPU; usage being low is irrelevant)? Why is restarting the scheduler the wrong first action?

212. A pod is Pending and the event says `0/6 nodes are available: 6 node(s) had untolerated taint`. That means a taint such as NoSchedule on control-plane or a dedicated pool. What is the fix (add the toleration or pick a different pool)? Why is restarting the scheduler the wrong first action?

213. A pod is Pending and the event says `0/6 nodes are available: 6 node(s) didn't match Pod's node affinity/selector`. That means the selector names a label no node has. What is the fix (fix the label or the selector; do not remove all selectors blindly)? Why is restarting the scheduler the wrong first action?

214. A pod is Pending and the event says `0/6 nodes are available: 6 Insufficient ephemeral-storage`. That means the ephemeral request is larger than what nodes advertise. What is the fix (check emptyDir and the request)? Why is restarting the scheduler the wrong first action?

215. A pod is Pending and the event says `0/3 nodes are available: 3 node(s) didn't match pod topology spread constraints`. That means the skew would be violated. What is the fix (relax the constraint or add a domain)? Why is restarting the scheduler the wrong first action?

216. A pod is Pending and the event says `0/4 nodes are available: 4 node(s) had volume node affinity conflict`. That means the PV is pinned to a zone the pod's other rules exclude. What is the fix (the volume topology and the pod affinity disagree)? Why is restarting the scheduler the wrong first action?

217. A pod is Pending and the event says `preemption is not helping`. That means the priority is not higher, or PDB and other rules block the victims. What is the fix (priority is not a force-delete button)? Why is restarting the scheduler the wrong first action?

218. A pod is Pending and the event says `the pod is nominated but still Pending`. That means the nominated node has not actually accepted it yet. What is the fix (wait for the bind event before you reschedule by hand)? Why is restarting the scheduler the wrong first action?

219. A pod is Pending and the event says `a daemonset pod is Pending on one node only`. That means that node has a taint the daemonset does not tolerate. What is the fix (this is not a replica-count problem)? Why is restarting the scheduler the wrong first action?

220. Scheduling looks wrong for this resource setup: CPU request 2000m on a node with 2 allocatable CPUs and system reservations. What is the trap (allocatable is less than the cloud vCPU count)? Which number does the scheduler use?

221. Scheduling looks wrong for this resource setup: memory request equal to the limit on every pod. What is the trap (the node looks empty in metrics and still cannot schedule)? Which number does the scheduler use?

222. Scheduling looks wrong for this resource setup: no requests at all. What is the trap (BestEffort pods schedule, then get evicted first under pressure)? Which number does the scheduler use?

223. Scheduling looks wrong for this resource setup: a limit and no request. What is the trap (Kubernetes copies the limit into the request and you over-subscribe less than you think)? Which number does the scheduler use?

224. Scheduling looks wrong for this resource setup: Guaranteed class by accident. What is the trap (request equals limit for every container, including sidecars, and the node fills with idle guaranteed pods)? Which number does the scheduler use?

225. Scheduling looks wrong for this resource setup: Burstable with a huge limit and a tiny request. What is the trap (it schedules anywhere and then OOMs the node or gets evicted)? Which number does the scheduler use?

226. The taint `node-role.kubernetes.io/control-plane:NoSchedule` is on the node. The affected workload is an app pod with no toleration. Should this pod tolerate it? What breaks if you toleration-everything on every Deployment?

227. The taint `node.kubernetes.io/disk-pressure:NoSchedule` is on the node. The affected workload is any new pod, until the pressure clears. Should this pod tolerate it? What breaks if you toleration-everything on every Deployment?

228. The taint `node.kubernetes.io/unreachable:NoExecute` is on the node. The affected workload is pods that do not tolerate it, after the grace period. Should this pod tolerate it? What breaks if you toleration-everything on every Deployment?

229. The taint `dedicated=gpu:NoSchedule` is on the node. The affected workload is a GPU pod that forgot the toleration and a non-GPU pod that added it by copy-paste. Should this pod tolerate it? What breaks if you toleration-everything on every Deployment?

230. The taint `node.kubernetes.io/not-ready:NoExecute` is on the node. The affected workload is pods when the kubelet stops heartbeating. Should this pod tolerate it? What breaks if you toleration-everything on every Deployment?

231. The pod spec has requiredDuringSchedulingIgnoredDuringExecution node affinity on a label that exists only in dev. Why does that keep the pod Pending or packed into one place? What do you change, and what availability property were you trying to keep?

232. The pod spec has preferredDuringScheduling that everyone treats as required. Why does that keep the pod Pending or packed into one place? What do you change, and what availability property were you trying to keep?

233. The pod spec has pod anti-affinity required on hostname with replicas greater than the node count. Why does that keep the pod Pending or packed into one place? What do you change, and what availability property were you trying to keep?

234. The pod spec has pod affinity to a database pod that lives in one zone. Why does that keep the pod Pending or packed into one place? What do you change, and what availability property were you trying to keep?

235. The pod spec has topologySpreadConstraints on topology.kubernetes.io/zone with maxSkew 1 and only one zone currently up. Why does that keep the pod Pending or packed into one place? What do you change, and what availability property were you trying to keep?

## Kubernetes — probes and rollouts

236. Probe setup: liveness probe calls /health which queries the database. Effect: a two-minute database failover restarts every pod and the outage lasts ten. What is the rule (liveness must mean 'restart this process', not 'my dependency is down')? How do you confirm from events which probe is failing?

237. Probe setup: readiness probe hits the same deep dependency. Effect: pods leave the endpoints and traffic shifts, which may be what you want, until every pod is unready and the Service has no backends. What is the rule (decide whether a dependency failure should shed this pod or just error)? How do you confirm from events which probe is failing?

238. Probe setup: there is no startup probe and liveness failureThreshold is 3 with period 10s. Effect: a 45-second JVM boot is killed forever. What is the rule (startupProbe holds liveness off until the app has booted)? How do you confirm from events which probe is failing?

239. Probe setup: readiness and liveness share one handler that always returns 200 if the process is up. Effect: bad pods stay in rotation. What is the rule (readiness has to mean 'send me traffic')? How do you confirm from events which probe is failing?

240. Probe setup: the probe TCP-checks a port the admin interface listens on. Effect: the data port is dead and the pod stays Ready. What is the rule (probe the port you serve)? How do you confirm from events which probe is failing?

241. Probe setup: httpGet probe path is /healthz but the app only has /health. Effect: every pod is unready after a correct deploy. What is the rule (diff the path against the binary you actually shipped)? How do you confirm from events which probe is failing?

242. Probe setup: timeoutSeconds is 1 and the app is in a cold zone. Effect: spurious failures restart or unready the pod. What is the rule (timeout is not the same as period)? How do you confirm from events which probe is failing?

243. Probe setup: the probe uses https against a pod that is plain http. Effect: probe connection errors look like app crashes. What is the rule (scheme and port have to match the process)? How do you confirm from events which probe is failing?

244. Probe setup: initialDelaySeconds is 60 and startup is usually 5 seconds, and there is no startup probe. Effect: a deadlock in the first minute is invisible, or a slow day still gets killed after the delay. What is the rule (prefer a startup probe with a high failureThreshold)? How do you confirm from events which probe is failing?

245. Probe setup: exec probe runs a shell that is not in the distroless image. Effect: the probe fails closed and the pod is killed. What is the rule (the probe binary has to exist in the image)? How do you confirm from events which probe is failing?

246. During a rollout: maxUnavailable 0 and maxSurge 0. What you see: the rollout cannot move. What is the rule (at least one of them must allow a new pod or a missing pod)? What command shows whether the new ReplicaSet is the one failing?

247. During a rollout: maxSurge 100% and the cluster has no free CPU. What you see: new pods Pending and the rollout hits ProgressDeadlineExceeded. What is the rule (surge needs spare schedulable capacity)? What command shows whether the new ReplicaSet is the one failing?

248. During a rollout: maxUnavailable 50% on a two-replica service behind a PDB of minAvailable 2. What you see: the PDB and the strategy deadlock. What is the rule (the disruption budget and the rollout strategy have to agree)? What command shows whether the new ReplicaSet is the one failing?

249. During a rollout: the new pods fail readiness. What you see: the old pods stay, which is correct, and the rollout waits. What is the rule (do not delete the old ReplicaSet to 'unstick' it)? What command shows whether the new ReplicaSet is the one failing?

250. During a rollout: progressDeadlineSeconds is 60 and the image pull takes 90. What you see: the Deployment is marked failed even though it would have worked. What is the rule (the deadline has to cover pull plus startup probe)? What command shows whether the new ReplicaSet is the one failing?

251. During a rollout: you kubectl rollout undo. What you see: the previous ReplicaSet is scaled up, including its old env and probes. What is the rule (undo is only as good as the revision history)? What command shows whether the new ReplicaSet is the one failing?

252. During a rollout: revisionHistoryLimit is 0. What you see: undo has nothing to return to. What is the rule (keep enough revisions to roll back)? What command shows whether the new ReplicaSet is the one failing?

253. During a rollout: a shared ConfigMap is changed in place. What you see: pods do not restart, so some run old config in memory and the mount is eventually updated. What is the rule (decide how config rolls: new pod template, not a silent file swap)? What command shows whether the new ReplicaSet is the one failing?

254. During a rollout: you change only the image of a sidecar. What you see: the whole pod recreates and the app restarts too. What is the rule (a pod is the restart boundary)? What command shows whether the new ReplicaSet is the one failing?

255. During a rollout: blue/green by two Deployments and one Service selector. What you see: the selector matches both and traffic splits by accident. What is the rule (the selector has to be the color you mean)? What command shows whether the new ReplicaSet is the one failing?

## Kubernetes — workloads

256. a Deployment and a bare pod with the same labels. Effect: the ReplicaSet fights the bare pod or the Service selects both. What should you do (owned pods only; labels are not free)?

257. replicas: 1 and a PDB minAvailable: 1. Effect: drain never finishes. What should you do (a budget needs a spare)?

258. a StatefulSet with a RollingUpdate and a broken pod-1. Effect: pod-2 is never updated because order is strict. What should you do (partition or fix pod-1; do not delete pod-2 to hurry)?

259. a StatefulSet volumeClaimTemplate size is changed. Effect: existing PVCs do not resize just because the template changed. What should you do (know which fields are immutable)?

260. parallel pod management on a StatefulSet. Effect: you lose the ordered guarantee you chose StatefulSet for. What should you do (if you do not need order or identity, use a Deployment)?

261. a DaemonSet update strategy OnDelete. Effect: nodes keep the old agent until someone deletes the pod. What should you do (that is how you get a silent version skew)?

262. a DaemonSet with a resource request larger than a small node. Effect: that node never gets the agent and you lose logs or CNI there. What should you do (size the daemon for the smallest node)?

263. a Job with backoffLimit 6 and a bug that always fails. Effect: it retries six times and then stops. What should you do (look at the Job status, not a Deployment rollout)?

264. a Job with completions 10 and parallelism 10 that is not idempotent. Effect: double side effects. What should you do (what does the work item key have to be?)?

265. a CronJob with concurrencyPolicy Allow and a job that runs longer than the interval. Effect: overlapping jobs pile up. What should you do (Forbid or Replace, on purpose)?

266. startingDeadlineSeconds is short and the controller was down. Effect: missed runs are skipped or counted failed. What should you do (know which misses you still want)?

267. a bare pod on a node that is drained. Effect: it is gone and nothing recreates it. What should you do (that is why workloads exist)?

268. The team picked a Deployment for this workload. When is that the right object (stateless replicas behind a Service)? When is it the wrong object (stable network identity or per-replica disks)?

269. The team picked a StatefulSet for this workload. When is that the right object (stable DNS names and a PVC per ordinal)? When is it the wrong object (a stateless API)?

270. The team picked a DaemonSet for this workload. When is that the right object (one agent per node)? When is it the wrong object (a replicated API)?

271. The team picked a Job for this workload. When is that the right object (run to completion)? When is it the wrong object (a long-running server)?

272. The team picked a CronJob for this workload. When is that the right object (a schedule of Jobs)? When is it the wrong object (a queue consumer that should be a Deployment)?

273. The team picked a ReplicaSet by hand for this workload. When is that the right object (almost never; the Deployment owns it)? When is it the wrong object (day-to-day releases)?

## Kubernetes — Services, DNS, and ingress

274. the Service has no Endpoints. Effect: the selector matches nothing, or no pods are Ready. What do you check (compare selector to pod labels and Ready conditions)?

275. Endpoints exist but clients still time out. Effect: NetworkPolicy, the wrong containerPort, or the app bound to localhost. What do you check (the Service is not the only hop)?

276. containerPort is 80 and the app listens on 8080. Effect: the Endpoints port is the one clients use and it is forwarded to the wrong port. What do you check (targetPort has to be the process port)?

277. two Services select the same pods. Effect: you are splitting traffic by accident or double-counting metrics. What do you check (labels need a purpose)?

278. ClusterIP from outside the cluster. Effect: it is not routed there. What do you check (that type is in-cluster only)?

279. NodePort works on the node IP and not on localhost of your laptop. Effect: you are not on the node network. What do you check (use a port-forward or an Ingress for local dev, and know which one you are testing)?

280. LoadBalancer stays Pending. Effect: no cloud controller allocated an address. What do you check (on bare metal nothing will, unless you installed one)?

281. externalTrafficPolicy Local. Effect: nodes without a local pod drop the flow or the balancer only uses some nodes. What do you check (you kept the client IP and lost even spreading)?

282. a headless Service. Effect: clients get pod IPs, not a VIP, and must handle some of those IPs being down. What do you check (that is for StatefulSet identity, not for a simple HTTP API)?

283. sessionAffinity ClientIP. Effect: one NAT hides many clients behind one IP and pins them all. What do you check (affinity is a hint, not a transaction boundary)?

284. DNS: the app calls http://api and it works in one namespace and not another. Effect: short names only search the local namespace. What is going on (use api.other.svc.cluster.local or run it in the same namespace on purpose)?

285. DNS: ndots:5 and a name with fewer dots. Effect: every lookup tries cluster search domains first and adds latency. What is going on (know your search list)?

286. DNS: CoreDNS is CrashLooping. Effect: every Service name fails and people debug the application. What is going on (check kube-system DNS before the app)?

287. DNS: a pod sets dnsPolicy Default. Effect: it uses the node's resolver and not CoreDNS. What is going on (Service names stop resolving)?

288. DNS: stale DNS after a rollout. Effect: a client cached the old pod IP past the TTL. What is going on (who cached it, and for how long)?

289. DNS: ExternalName pointing at a third party. Effect: no proxying happens; the client connects directly and NetworkPolicy may not see what you think. What is going on (ExternalName is a CNAME, not a gateway)?

290. Ingress: Ingress returns 503. Effect: the backend Service has no ready endpoints. Where is the failure (the Ingress is telling the truth; debug the pods)?

291. Ingress: Ingress returns 404 from the controller. Effect: no rule matched the host or path. Where is the failure (the request never reached the app)?

292. Ingress: two Ingresses claim the same host and path. Effect: one wins by a controller-specific rule and the other looks 'broken'. Where is the failure (know which object is admitted)?

293. Ingress: path is /api and the app expects /. Effect: the app generates wrong redirects. Where is the failure (rewrite or teach the app its prefix)?

294. Ingress: TLS secret is in the wrong namespace. Effect: the controller serves the default cert and clients see a name mismatch. Where is the failure (secrets are namespace-local)?

295. Ingress: the Ingress class is unset and two controllers are installed. Effect: nothing or the wrong one picks it up. Where is the failure (set the class)?

296. Ingress: Gateway API and Ingress both exist. Effect: only one of them has the route. Where is the failure (know which data plane you are looking at)?

297. Ingress: proxy-body-size default. Effect: uploads fail at the controller and the app logs show nothing. Where is the failure (the failure is in front of the pod)?

## Kubernetes — NetworkPolicy

298. a deny-all ingress policy is applied and the allow rule selects the wrong pod labels. Effect: the Service has endpoints and every connection still times out. What is the rule (policy is on pods, not on Services)?

299. egress is default deny and DNS was not allowed. Effect: the app cannot resolve names and the error looks like a bad hostname. What is the rule (UDP and TCP 53 to the DNS pods have to be explicit)?

300. the policy allows the namespace and the client moves to a new namespace. Effect: traffic stops after a 'harmless' move. What is the rule (selectors are the contract)?

301. the CNI does not implement NetworkPolicy. Effect: the objects apply and enforce nothing. What is the rule (test a deny, do not trust the YAML)?

302. you allow ingress from the Ingress controller namespace. Effect: health checks from the controller work and pod-to-pod from the app namespace still fails. What is the rule (each caller needs a rule)?

303. a policy selects pods but the port is the Service port not the pod port. Effect: the allow does not match the packet. What is the rule (policies see the pod port)?

304. IPv6 and IPv4. Effect: you allowed only one family. What is the rule (dual stack needs both if you use ipBlock)?

305. a debug curl pod in the same namespace works. Effect: it matches a broad podSelector and production clients in another namespace do not. What is the rule (your test used a different identity)?

## Kubernetes — storage

306. Storage: PVC is Pending. Effect: no StorageClass, a class that does not match, or the provisioner is down. What do you change (describe the PVC, not just the pod)?

307. Storage: two pods mount one ReadWriteOnce volume. Effect: the second stays ContainerCreating or the attach fails. What do you change (RWO means one node)?

308. Storage: ReadWriteMany is requested and the class only offers RWO. Effect: the PVC stays Pending forever. What do you change (the access mode has to exist in the class)?

309. Storage: the pod is in zone A and the PV is in zone B. Effect: volume node affinity conflict. What do you change (topology is part of scheduling)?

310. Storage: a hostPath volume. Effect: it exists on one node and is empty or dangerous on another. What do you change (hostPath is not a PVC)?

311. Storage: emptyDir fills the node disk. Effect: the node gets DiskPressure and evicts unrelated pods. What do you change (set a sizeLimit)?

312. Storage: the Deployment template uses one PVC for many replicas. Effect: only one replica can attach, or they corrupt shared state. What do you change (that is a StatefulSet claim template or an RWX design, on purpose)?

313. Storage: you delete a PVC with a reclaim policy Delete. Effect: the cloud disk is deleted. What do you change (know the policy before you clean up)?

314. Storage: reclaim policy Retain. Effect: the PV sticks around Released and will not bind to a new claim. What do you change (you must recycle or replace it on purpose)?

315. Storage: fsGroup is unset and the volume is root-owned. Effect: the non-root process cannot write. What do you change (securityContext has to match the volume)?

316. Storage: a subPath mount. Effect: it does not get fsGroup the way a whole-volume mount does. What do you change (permissions surprise)?

317. Storage: CSI attach succeeds and mount fails. Effect: the filesystem is corrupt or the mount option is wrong. What do you change (attach and mount are different events)?

318. Storage: volume expansion is requested on a class that does not allow it. Effect: the PVC stays at the old size. What do you change (allowVolumeExpansion is a property of the class)?

319. Storage: a snapshot is restored over a running writer. Effect: the database sees a torn disk. What do you change (quiesce or use the database's own backup)?

## Kubernetes — config and secrets

320. Config: a pod references a Secret key that does not exist. Effect: CreateContainerConfigError. What is the actual rule (the key name, not the app code)?

321. Config: the Secret is in another namespace. Effect: the pod cannot see it. What is the actual rule (references do not cross namespaces)?

322. Config: you edit a ConfigMap and expect a restart. Effect: the process keeps its old env vars. What is the actual rule (env is a copy at start; a mounted file can update, and the app may still ignore it)?

323. Config: optional: false on a missing ConfigMap. Effect: the pod cannot start. What is the actual rule (optional is how you express a soft dependency)?

324. Config: a Secret is mounted and also passed as an env var. Effect: the env var is in the process list and in crash dumps. What is the actual rule (prefer a file if the app can read one)?

325. Config: the Secret is world-readable in the image instead. Effect: every node that pulled the image has it, and so does the registry. What is the actual rule (rotate it; the mount will not scrub the layer)?

326. Config: immutable ConfigMap is changed. Effect: the API rejects the update. What is the actual rule (that is the point; make a new one and roll the pod template)?

327. Config: two keys differ only by case. Effect: some clients collapse them. What is the actual rule (name keys so a case-insensitive consumer cannot mix them up)?

328. Config: a projected volume mixes a ConfigMap and a Secret. Effect: one bad key blocks the whole container create. What is the actual rule (describe shows which source)?

329. Config: you commit the Secret manifest with the data. Effect: the git history is the leak. What is the actual rule (seal it, use an external store, and rotate what leaked)?

## Kubernetes — RBAC, admission, and supply chain

330. Access control: a Deployment is forbidden. Effect: the deployer's Role cannot create pods/replicasets, or the namespace is wrong. What do you fix (whoami and auth can-i, in that namespace)?

331. Access control: the app's ServiceAccount is default. Effect: a compromised pod can do whatever default can, which may be nothing or may be too much if you bound roles to it. What do you fix (give the workload its own account)?

332. Access control: a RoleBinding points at a Role in another namespace. Effect: Role is namespace-local; that bind is wrong. What do you fix (ClusterRole plus a namespaced RoleBinding is the cross-namespace pattern)?

333. Access control: wildcard verbs on wildcard resources. Effect: you built cluster-admin by accident. What do you fix (list the verbs you need)?

334. Access control: PodSecurity is restricted and the pod is privileged. Effect: the API rejects it. What do you fix (the workload has to change, or it belongs in a different namespace on purpose)?

335. Access control: a validating webhook times out. Effect: depending on failurePolicy, all creates fail or the check is skipped. What do you fix (know which failure mode you chose)?

336. Access control: the webhook calls back into the API and deadlocks admission. Effect: creates hang. What do you fix (the webhook needs network and a timeout that fits)?

337. Access control: an image is signed by the CI robot and the policy expects the release robot. Effect: admission denies a good image. What do you fix (identities have to match the policy, not just 'someone signed it')?

338. Access control: latest is admitted. Effect: policy that only checks the tag exists is not a pin. What do you fix (require a digest)?

339. Access control: a privileged debug pod is allowed in prod. Effect: it is a host-admin console. What do you fix (separate the break-glass path from the default)?

340. Access control: automountServiceAccountToken is true and the pod does not call the API. Effect: a stolen token is still a credential. What do you fix (turn it off when unused)?

341. Access control: a ClusterRoleBinding to system:anonymous. Effect: unauthenticated users got rights. What do you fix (this should be rare and reviewed)?

342. The namespace Pod Security label is privileged. What does that allow and block (almost no restrictions; a namespace left here is a hole)? Which pod field will fail admission first?

343. The namespace Pod Security label is baseline. What does that allow and block (blocks known dangerous defaults but still allows root)? Which pod field will fail admission first?

344. The namespace Pod Security label is restricted. What does that allow and block (requires non-root, drops caps, and blocks privilege escalation; many vendor images fail it)? Which pod field will fail admission first?

## Kubernetes — autoscaling

345. Autoscaling: HPA shows targets unknown. Effect: metrics-server is down or the pod has no CPU request for a utilization target. What is the rule (utilization math needs a request)?

346. Autoscaling: HPA scales on CPU and the bottleneck is a database pool. Effect: you add pods that all wait on the same pool. What is the rule (the metric has to be the scarce resource)?

347. Autoscaling: minReplicas equals maxReplicas. Effect: the HPA is a no-op. What is the rule (the range has to be real)?

348. Autoscaling: scale-up works and new pods stay Pending. Effect: the cluster autoscaler cannot get nodes, or quota is exhausted, or affinity forbids them. What is the rule (pod autoscaling is not node autoscaling)?

349. Autoscaling: scale-down kills a pod mid-request. Effect: the grace period and the preStop hook are too short, or the app does not handle SIGTERM. What is the rule (draining a pod is an application concern)?

350. Autoscaling: VPA and HPA both change the same resource. Effect: they fight. What is the rule (do not let two controllers own the same knob)?

351. Autoscaling: KEDA scales to zero. Effect: the first request pays a cold start and a liveness probe may kill the cold pod. What is the rule (startup probe plus a trigger that is real)?

352. Autoscaling: a custom metric stays high after the backlog is gone. Effect: the scaler never scales down. What is the rule (look at the metric query, not just replicas)?

353. Autoscaling: cluster autoscaler will not remove a node. Effect: a pod with a local volume, a restrictive PDB, or kube-system pods that are not evictable. What is the rule (the blocker is on the node, in the autoscaler logs)?

354. Autoscaling: HPA on a DaemonSet. Effect: DaemonSets are not scaled by replica count this way. What is the rule (the object model does not work like a Deployment)?

## Kubernetes — nodes, pressure, and drain

355. Node: Node NotReady. Effect: kubelet stopped, or the node cannot reach the API, or the CNI is down. What do you do (do not reschedule blindly; find why the heartbeats stopped)?

356. Node: MemoryPressure. Effect: the kubelet is evicting pods. What do you do (find the cgroup that grew; requests decide eviction order)?

357. Node: DiskPressure. Effect: image GC and pod eviction. What do you do (overlay or container logs filled the filesystem)?

358. Node: PIDPressure. Effect: the node cannot fork. What do you do (a fork-heavy container or a missed pids limit)?

359. Node: drain hangs. Effect: a PDB allows zero disruptions, or a pod has an emptyDir you did not confirm, or a daemonset. What do you do (read the drain error; do not force as the first move)?

360. Node: you drain with --ignore-daemonsets and --delete-emptydir-data without looking. Effect: node-local caches and daemon-backed functions drop. What do you do (know what is local to the node)?

361. Node: cordon without drain. Effect: existing pods keep running and new ones are not scheduled. What do you do (that is useful, and it is not a restart)?

362. Node: the kubelet disk is full so it cannot update status. Effect: the node flips NotReady and pods look Unknown. What do you do (free the disk; the pods may still be alive)?

363. Node: clock skew. Effect: TLS and leases fail in odd ways. What do you do (time sync is a cluster dependency)?

364. Node: a node reboot without drain. Effect: every pod on it is killed at once and PDBs are not consulted. What do you do (the voluntary path is drain)?

365. Node: image GC removes an image a static pod needs. Effect: the static pod fails to start after a restart. What do you do (GC thresholds and the images you pin locally)?

366. Node: containerd and the kubelet disagree on the pause image. Effect: sandboxes fail to start. What do you do (the pause image has to be pullable and the runtime config has to match)?

## Kubernetes — control plane, etcd, certificates, upgrades

367. Control plane: kubectl times out and pods keep serving. Effect: the data plane can be fine while the control plane is not. What is the safe move (do not restart every workload)?

368. Control plane: etcd is out of quorum. Effect: the API becomes read-only or unavailable. What is the safe move (restore quorum from a member you still trust; do not wipe the data directory)?

369. Control plane: etcd database hits the quota. Effect: writes fail with a space error and compact/defrag is the recovery. What is the safe move (watch db size before the day it fills)?

370. Control plane: a certificate expires on the apiserver. Effect: clients fail TLS and a renewal path has to run before you rotate by hand in a panic. What is the safe move (know kubeadm certs or the managed equivalent)?

371. Control plane: the kubelet certificate expires. Effect: the node goes NotReady while workloads may still run. What is the safe move (renew the kubelet client cert)?

372. Control plane: you upgrade the kubelet before the control plane. Effect: skew is unsupported and odd refusals start. What is the safe move (control plane first, then nodes)?

373. Control plane: you skip minor versions. Effect: the supported path is one minor at a time. What is the safe move (step through)?

374. Control plane: a static pod manifest is invalid. Effect: that control plane component does not start and there is no Deployment to roll back. What is the safe move (the manifest on disk is the source)?

375. Control plane: you restore etcd over a cluster that has kept scheduling. Effect: the data plane and the restored state disagree. What is the safe move (stop the world you are restoring into)?

376. Control plane: audit logs are off. Effect: you cannot answer who deleted the namespace. What is the safe move (turn them on before the incident)?

377. Control plane: a leader election lease is stuck. Effect: a controller does nothing while replicas of it are up. What is the safe move (look at the lease holder and its logs)?

378. Control plane: aggregated APIService is down. Effect: kubectl get apiservice shows it and unrelated API calls can fail if it is required. What is the safe move (a broken extension can look like a broken cluster)?

## Kubernetes — quotas, limits, and namespaces

379. Quota: a namespace ResourceQuota on pods is exhausted. Effect: new pods stay Pending with a quota event. What do you change (the scheduler is not the blocker)?

380. Quota: a LimitRange injects a default request larger than the node. Effect: pods that set no resources become unschedulable. What do you change (defaults are not free)?

381. Quota: a LimitRange max is below the pod's request. Effect: the API rejects the pod. What do you change (admission, not scheduling)?

382. Quota: objects are created in default. Effect: a noisy neighbor shares the quota and the RBAC of a dumping ground. What do you change (give the app a namespace)?

383. Quota: you delete a namespace and it sticks in Terminating. Effect: a finalizer, often on a CRD whose controller is gone. What do you change (find the finalizer; do not patch it away until you know what it was protecting)?

384. Quota: ResourceQuota counts services and someone adds a LoadBalancer. Effect: the quota blocks it and the cloud bill is not the only limit. What do you change (quotas are part of the design)?

385. Quota: LimitRange default CPU is 100m and the JVM needs more just to start. Effect: it is throttled into a probe death. What do you change (defaults have to match the runtime)?

## Kubernetes — incident drills: scheduling and capacity

386. The checkout API in namespace prod: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

387. The checkout API in namespace payments: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

388. The checkout API in namespace edge: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

389. The checkout API in namespace batch: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

390. The checkout API in namespace identity: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

391. The invoice worker in namespace prod: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

392. The invoice worker in namespace payments: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

393. The invoice worker in namespace edge: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

394. The invoice worker in namespace batch: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

395. The invoice worker in namespace identity: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

396. The session service in namespace prod: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

397. The session service in namespace payments: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

398. The session service in namespace edge: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

399. The session service in namespace batch: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

400. The session service in namespace identity: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

401. The search indexer in namespace prod: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

402. The search indexer in namespace payments: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

403. The search indexer in namespace edge: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

404. The search indexer in namespace batch: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

405. The search indexer in namespace identity: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

406. The webhook receiver in namespace prod: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

407. The webhook receiver in namespace payments: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

408. The webhook receiver in namespace edge: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

409. The webhook receiver in namespace batch: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

410. The webhook receiver in namespace identity: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

411. The report exporter in namespace prod: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

412. The report exporter in namespace payments: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

413. The report exporter in namespace edge: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

414. The report exporter in namespace batch: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

415. The report exporter in namespace identity: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

416. The auth gateway in namespace prod: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

417. The auth gateway in namespace payments: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

418. The auth gateway in namespace edge: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

419. The auth gateway in namespace batch: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

420. The auth gateway in namespace identity: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

421. The image resizer in namespace prod: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

422. The image resizer in namespace payments: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

423. The image resizer in namespace edge: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

424. The image resizer in namespace batch: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

425. The image resizer in namespace identity: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

426. The billing consumer in namespace prod: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

427. The billing consumer in namespace payments: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

428. The billing consumer in namespace edge: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

429. The billing consumer in namespace batch: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

430. The billing consumer in namespace identity: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

431. The notification sender in namespace prod: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

432. The notification sender in namespace payments: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

433. The notification sender in namespace edge: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

434. The notification sender in namespace batch: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

435. The notification sender in namespace identity: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

436. The graphql gateway in namespace prod: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

437. The graphql gateway in namespace payments: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

438. The graphql gateway in namespace edge: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

439. The graphql gateway in namespace batch: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

440. The graphql gateway in namespace identity: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

441. The feature-flag service in namespace prod: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

442. The feature-flag service in namespace payments: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

443. The feature-flag service in namespace edge: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

444. The feature-flag service in namespace batch: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

445. The feature-flag service in namespace identity: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

446. The audit logger in namespace prod: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

447. The audit logger in namespace payments: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

448. The audit logger in namespace edge: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

449. The audit logger in namespace batch: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

450. The audit logger in namespace identity: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

451. The pdf renderer in namespace prod: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

452. The pdf renderer in namespace payments: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

453. The pdf renderer in namespace edge: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

454. The pdf renderer in namespace batch: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

455. The pdf renderer in namespace identity: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

456. The catalog API in namespace prod: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

457. The catalog API in namespace payments: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

458. The catalog API in namespace edge: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

459. The catalog API in namespace batch: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

460. The catalog API in namespace identity: pods stay Pending with insufficient memory. The memory request is 4Gi and the largest allocatable node has 3Gi after daemonsets. Usage graphs show the process at 400Mi. What do you change in the request, what capacity do you add only if the request is honest, and why is 'the graph shows 400Mi' not a scheduling input?

461. The checkout API in namespace prod: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

462. The checkout API in namespace payments: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

463. The checkout API in namespace edge: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

464. The checkout API in namespace batch: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

465. The checkout API in namespace identity: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

466. The invoice worker in namespace prod: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

467. The invoice worker in namespace payments: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

468. The invoice worker in namespace edge: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

469. The invoice worker in namespace batch: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

470. The invoice worker in namespace identity: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

471. The session service in namespace prod: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

472. The session service in namespace payments: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

473. The session service in namespace edge: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

474. The session service in namespace batch: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

475. The session service in namespace identity: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

476. The search indexer in namespace prod: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

477. The search indexer in namespace payments: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

478. The search indexer in namespace edge: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

479. The search indexer in namespace batch: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

480. The search indexer in namespace identity: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

481. The webhook receiver in namespace prod: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

482. The webhook receiver in namespace payments: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

483. The webhook receiver in namespace edge: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

484. The webhook receiver in namespace batch: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

485. The webhook receiver in namespace identity: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

486. The report exporter in namespace prod: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

487. The report exporter in namespace payments: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

488. The report exporter in namespace edge: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

489. The report exporter in namespace batch: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

490. The report exporter in namespace identity: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

491. The auth gateway in namespace prod: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

492. The auth gateway in namespace payments: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

493. The auth gateway in namespace edge: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

494. The auth gateway in namespace batch: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

495. The auth gateway in namespace identity: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

496. The image resizer in namespace prod: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

497. The image resizer in namespace payments: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

498. The image resizer in namespace edge: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

499. The image resizer in namespace batch: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

500. The image resizer in namespace identity: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

501. The billing consumer in namespace prod: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

502. The billing consumer in namespace payments: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

503. The billing consumer in namespace edge: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

504. The billing consumer in namespace batch: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

505. The billing consumer in namespace identity: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

506. The notification sender in namespace prod: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

507. The notification sender in namespace payments: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

508. The notification sender in namespace edge: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

509. The notification sender in namespace batch: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

510. The notification sender in namespace identity: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

511. The graphql gateway in namespace prod: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

512. The graphql gateway in namespace payments: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

513. The graphql gateway in namespace edge: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

514. The graphql gateway in namespace batch: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

515. The graphql gateway in namespace identity: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

516. The feature-flag service in namespace prod: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

517. The feature-flag service in namespace payments: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

518. The feature-flag service in namespace edge: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

519. The feature-flag service in namespace batch: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

520. The feature-flag service in namespace identity: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

521. The audit logger in namespace prod: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

522. The audit logger in namespace payments: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

523. The audit logger in namespace edge: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

524. The audit logger in namespace batch: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

525. The audit logger in namespace identity: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

526. The pdf renderer in namespace prod: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

527. The pdf renderer in namespace payments: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

528. The pdf renderer in namespace edge: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

529. The pdf renderer in namespace batch: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

530. The pdf renderer in namespace identity: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

531. The catalog API in namespace prod: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

532. The catalog API in namespace payments: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

533. The catalog API in namespace edge: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

534. The catalog API in namespace batch: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

535. The catalog API in namespace identity: pods stay Pending with a control-plane taint. Someone added a toleration for every taint to 'make it schedule'. Which toleration is legitimate here, and what lands on the control plane if you tolerate all taints?

536. The checkout API in namespace prod: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

537. The checkout API in namespace payments: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

538. The checkout API in namespace edge: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

539. The checkout API in namespace batch: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

540. The checkout API in namespace identity: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

541. The invoice worker in namespace prod: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

542. The invoice worker in namespace payments: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

543. The invoice worker in namespace edge: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

544. The invoice worker in namespace batch: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

545. The invoice worker in namespace identity: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

546. The session service in namespace prod: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

547. The session service in namespace payments: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

548. The session service in namespace edge: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

549. The session service in namespace batch: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

550. The session service in namespace identity: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

551. The search indexer in namespace prod: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

552. The search indexer in namespace payments: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

553. The search indexer in namespace edge: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

554. The search indexer in namespace batch: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

555. The search indexer in namespace identity: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

556. The webhook receiver in namespace prod: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

557. The webhook receiver in namespace payments: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

558. The webhook receiver in namespace edge: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

559. The webhook receiver in namespace batch: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

560. The webhook receiver in namespace identity: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

561. The report exporter in namespace prod: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

562. The report exporter in namespace payments: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

563. The report exporter in namespace edge: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

564. The report exporter in namespace batch: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

565. The report exporter in namespace identity: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

566. The auth gateway in namespace prod: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

567. The auth gateway in namespace payments: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

568. The auth gateway in namespace edge: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

569. The auth gateway in namespace batch: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

570. The auth gateway in namespace identity: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

571. The image resizer in namespace prod: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

572. The image resizer in namespace payments: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

573. The image resizer in namespace edge: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

574. The image resizer in namespace batch: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

575. The image resizer in namespace identity: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

576. The billing consumer in namespace prod: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

577. The billing consumer in namespace payments: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

578. The billing consumer in namespace edge: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

579. The billing consumer in namespace batch: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

580. The billing consumer in namespace identity: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

581. The notification sender in namespace prod: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

582. The notification sender in namespace payments: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

583. The notification sender in namespace edge: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

584. The notification sender in namespace batch: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

585. The notification sender in namespace identity: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

586. The graphql gateway in namespace prod: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

587. The graphql gateway in namespace payments: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

588. The graphql gateway in namespace edge: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

589. The graphql gateway in namespace batch: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

590. The graphql gateway in namespace identity: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

591. The feature-flag service in namespace prod: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

592. The feature-flag service in namespace payments: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

593. The feature-flag service in namespace edge: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

594. The feature-flag service in namespace batch: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

595. The feature-flag service in namespace identity: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

596. The audit logger in namespace prod: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

597. The audit logger in namespace payments: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

598. The audit logger in namespace edge: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

599. The audit logger in namespace batch: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

600. The audit logger in namespace identity: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

601. The pdf renderer in namespace prod: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

602. The pdf renderer in namespace payments: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

603. The pdf renderer in namespace edge: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

604. The pdf renderer in namespace batch: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

605. The pdf renderer in namespace identity: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

606. The catalog API in namespace prod: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

607. The catalog API in namespace payments: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

608. The catalog API in namespace edge: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

609. The catalog API in namespace batch: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

610. The catalog API in namespace identity: only one of three zones receives pods. topologySpreadConstraints maxSkew is 1 and one zone is cordoned. Why do the remaining pods Pending instead of packing into the live zones, and which constraint do you relax for a zone failure?

## Kubernetes — incident drills: probes

611. The checkout API in namespace prod: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

612. The checkout API in namespace payments: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

613. The checkout API in namespace edge: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

614. The checkout API in namespace batch: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

615. The checkout API in namespace identity: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

616. The invoice worker in namespace prod: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

617. The invoice worker in namespace payments: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

618. The invoice worker in namespace edge: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

619. The invoice worker in namespace batch: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

620. The invoice worker in namespace identity: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

621. The session service in namespace prod: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

622. The session service in namespace payments: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

623. The session service in namespace edge: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

624. The session service in namespace batch: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

625. The session service in namespace identity: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

626. The search indexer in namespace prod: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

627. The search indexer in namespace payments: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

628. The search indexer in namespace edge: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

629. The search indexer in namespace batch: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

630. The search indexer in namespace identity: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

631. The webhook receiver in namespace prod: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

632. The webhook receiver in namespace payments: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

633. The webhook receiver in namespace edge: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

634. The webhook receiver in namespace batch: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

635. The webhook receiver in namespace identity: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

636. The report exporter in namespace prod: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

637. The report exporter in namespace payments: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

638. The report exporter in namespace edge: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

639. The report exporter in namespace batch: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

640. The report exporter in namespace identity: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

641. The auth gateway in namespace prod: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

642. The auth gateway in namespace payments: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

643. The auth gateway in namespace edge: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

644. The auth gateway in namespace batch: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

645. The auth gateway in namespace identity: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

646. The image resizer in namespace prod: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

647. The image resizer in namespace payments: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

648. The image resizer in namespace edge: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

649. The image resizer in namespace batch: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

650. The image resizer in namespace identity: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

651. The billing consumer in namespace prod: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

652. The billing consumer in namespace payments: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

653. The billing consumer in namespace edge: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

654. The billing consumer in namespace batch: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

655. The billing consumer in namespace identity: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

656. The notification sender in namespace prod: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

657. The notification sender in namespace payments: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

658. The notification sender in namespace edge: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

659. The notification sender in namespace batch: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

660. The notification sender in namespace identity: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

661. The graphql gateway in namespace prod: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

662. The graphql gateway in namespace payments: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

663. The graphql gateway in namespace edge: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

664. The graphql gateway in namespace batch: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

665. The graphql gateway in namespace identity: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

666. The feature-flag service in namespace prod: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

667. The feature-flag service in namespace payments: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

668. The feature-flag service in namespace edge: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

669. The feature-flag service in namespace batch: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

670. The feature-flag service in namespace identity: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

671. The audit logger in namespace prod: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

672. The audit logger in namespace payments: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

673. The audit logger in namespace edge: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

674. The audit logger in namespace batch: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

675. The audit logger in namespace identity: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

676. The pdf renderer in namespace prod: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

677. The pdf renderer in namespace payments: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

678. The pdf renderer in namespace edge: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

679. The pdf renderer in namespace batch: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

680. The pdf renderer in namespace identity: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

681. The catalog API in namespace prod: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

682. The catalog API in namespace payments: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

683. The catalog API in namespace edge: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

684. The catalog API in namespace batch: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

685. The catalog API in namespace identity: every replica restarts together. The liveness probe depends on a shared database. Why did a dependency failure become a thundering herd of restarts, and which probe should have failed instead?

686. The checkout API in namespace prod: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

687. The checkout API in namespace payments: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

688. The checkout API in namespace edge: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

689. The checkout API in namespace batch: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

690. The checkout API in namespace identity: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

691. The invoice worker in namespace prod: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

692. The invoice worker in namespace payments: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

693. The invoice worker in namespace edge: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

694. The invoice worker in namespace batch: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

695. The invoice worker in namespace identity: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

696. The session service in namespace prod: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

697. The session service in namespace payments: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

698. The session service in namespace edge: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

699. The session service in namespace batch: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

700. The session service in namespace identity: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

701. The search indexer in namespace prod: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

702. The search indexer in namespace payments: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

703. The search indexer in namespace edge: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

704. The search indexer in namespace batch: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

705. The search indexer in namespace identity: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

706. The webhook receiver in namespace prod: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

707. The webhook receiver in namespace payments: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

708. The webhook receiver in namespace edge: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

709. The webhook receiver in namespace batch: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

710. The webhook receiver in namespace identity: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

711. The report exporter in namespace prod: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

712. The report exporter in namespace payments: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

713. The report exporter in namespace edge: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

714. The report exporter in namespace batch: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

715. The report exporter in namespace identity: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

716. The auth gateway in namespace prod: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

717. The auth gateway in namespace payments: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

718. The auth gateway in namespace edge: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

719. The auth gateway in namespace batch: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

720. The auth gateway in namespace identity: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

721. The image resizer in namespace prod: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

722. The image resizer in namespace payments: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

723. The image resizer in namespace edge: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

724. The image resizer in namespace batch: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

725. The image resizer in namespace identity: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

726. The billing consumer in namespace prod: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

727. The billing consumer in namespace payments: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

728. The billing consumer in namespace edge: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

729. The billing consumer in namespace batch: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

730. The billing consumer in namespace identity: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

731. The notification sender in namespace prod: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

732. The notification sender in namespace payments: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

733. The notification sender in namespace edge: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

734. The notification sender in namespace batch: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

735. The notification sender in namespace identity: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

736. The graphql gateway in namespace prod: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

737. The graphql gateway in namespace payments: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

738. The graphql gateway in namespace edge: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

739. The graphql gateway in namespace batch: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

740. The graphql gateway in namespace identity: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

741. The feature-flag service in namespace prod: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

742. The feature-flag service in namespace payments: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

743. The feature-flag service in namespace edge: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

744. The feature-flag service in namespace batch: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

745. The feature-flag service in namespace identity: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

746. The audit logger in namespace prod: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

747. The audit logger in namespace payments: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

748. The audit logger in namespace edge: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

749. The audit logger in namespace batch: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

750. The audit logger in namespace identity: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

751. The pdf renderer in namespace prod: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

752. The pdf renderer in namespace payments: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

753. The pdf renderer in namespace edge: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

754. The pdf renderer in namespace batch: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

755. The pdf renderer in namespace identity: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

756. The catalog API in namespace prod: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

757. The catalog API in namespace payments: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

758. The catalog API in namespace edge: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

759. The catalog API in namespace batch: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

760. The catalog API in namespace identity: the rollout never becomes ready. The new image listens on 8080 and the probe still uses 80. Which event text shows the probe port, and why is the old ReplicaSet still the one taking traffic?

## Kubernetes — incident drills: data plane

761. The checkout API in namespace prod: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

762. The checkout API in namespace payments: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

763. The checkout API in namespace edge: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

764. The checkout API in namespace batch: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

765. The checkout API in namespace identity: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

766. The invoice worker in namespace prod: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

767. The invoice worker in namespace payments: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

768. The invoice worker in namespace edge: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

769. The invoice worker in namespace batch: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

770. The invoice worker in namespace identity: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

771. The session service in namespace prod: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

772. The session service in namespace payments: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

773. The session service in namespace edge: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

774. The session service in namespace batch: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

775. The session service in namespace identity: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

776. The search indexer in namespace prod: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

777. The search indexer in namespace payments: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

778. The search indexer in namespace edge: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

779. The search indexer in namespace batch: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

780. The search indexer in namespace identity: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

781. The webhook receiver in namespace prod: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

782. The webhook receiver in namespace payments: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

783. The webhook receiver in namespace edge: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

784. The webhook receiver in namespace batch: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

785. The webhook receiver in namespace identity: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

786. The report exporter in namespace prod: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

787. The report exporter in namespace payments: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

788. The report exporter in namespace edge: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

789. The report exporter in namespace batch: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

790. The report exporter in namespace identity: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

791. The auth gateway in namespace prod: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

792. The auth gateway in namespace payments: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

793. The auth gateway in namespace edge: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

794. The auth gateway in namespace batch: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

795. The auth gateway in namespace identity: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

796. The image resizer in namespace prod: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

797. The image resizer in namespace payments: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

798. The image resizer in namespace edge: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

799. The image resizer in namespace batch: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

800. The image resizer in namespace identity: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

801. The billing consumer in namespace prod: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

802. The billing consumer in namespace payments: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

803. The billing consumer in namespace edge: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

804. The billing consumer in namespace batch: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

805. The billing consumer in namespace identity: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

806. The notification sender in namespace prod: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

807. The notification sender in namespace payments: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

808. The notification sender in namespace edge: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

809. The notification sender in namespace batch: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

810. The notification sender in namespace identity: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

811. The graphql gateway in namespace prod: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

812. The graphql gateway in namespace payments: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

813. The graphql gateway in namespace edge: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

814. The graphql gateway in namespace batch: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

815. The graphql gateway in namespace identity: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

816. The feature-flag service in namespace prod: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

817. The feature-flag service in namespace payments: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

818. The feature-flag service in namespace edge: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

819. The feature-flag service in namespace batch: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

820. The feature-flag service in namespace identity: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

821. The audit logger in namespace prod: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

822. The audit logger in namespace payments: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

823. The audit logger in namespace edge: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

824. The audit logger in namespace batch: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

825. The audit logger in namespace identity: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

826. The pdf renderer in namespace prod: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

827. The pdf renderer in namespace payments: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

828. The pdf renderer in namespace edge: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

829. The pdf renderer in namespace batch: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

830. The pdf renderer in namespace identity: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

831. The catalog API in namespace prod: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

832. The catalog API in namespace payments: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

833. The catalog API in namespace edge: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

834. The catalog API in namespace batch: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

835. The catalog API in namespace identity: the Service returns connection refused. Endpoints are empty even though pods are Running. What Ready condition and which containerPort do you compare?

836. The checkout API in namespace prod: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

837. The checkout API in namespace payments: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

838. The checkout API in namespace edge: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

839. The checkout API in namespace batch: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

840. The checkout API in namespace identity: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

841. The invoice worker in namespace prod: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

842. The invoice worker in namespace payments: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

843. The invoice worker in namespace edge: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

844. The invoice worker in namespace batch: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

845. The invoice worker in namespace identity: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

846. The session service in namespace prod: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

847. The session service in namespace payments: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

848. The session service in namespace edge: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

849. The session service in namespace batch: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

850. The session service in namespace identity: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

851. The search indexer in namespace prod: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

852. The search indexer in namespace payments: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

853. The search indexer in namespace edge: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

854. The search indexer in namespace batch: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

855. The search indexer in namespace identity: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

856. The webhook receiver in namespace prod: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

857. The webhook receiver in namespace payments: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

858. The webhook receiver in namespace edge: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

859. The webhook receiver in namespace batch: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

860. The webhook receiver in namespace identity: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

861. The report exporter in namespace prod: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

862. The report exporter in namespace payments: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

863. The report exporter in namespace edge: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

864. The report exporter in namespace batch: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

865. The report exporter in namespace identity: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

866. The auth gateway in namespace prod: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

867. The auth gateway in namespace payments: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

868. The auth gateway in namespace edge: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

869. The auth gateway in namespace batch: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

870. The auth gateway in namespace identity: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

871. The image resizer in namespace prod: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

872. The image resizer in namespace payments: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

873. The image resizer in namespace edge: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

874. The image resizer in namespace batch: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

875. The image resizer in namespace identity: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

876. The billing consumer in namespace prod: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

877. The billing consumer in namespace payments: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

878. The billing consumer in namespace edge: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

879. The billing consumer in namespace batch: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

880. The billing consumer in namespace identity: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

881. The notification sender in namespace prod: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

882. The notification sender in namespace payments: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

883. The notification sender in namespace edge: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

884. The notification sender in namespace batch: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

885. The notification sender in namespace identity: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

886. The graphql gateway in namespace prod: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

887. The graphql gateway in namespace payments: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

888. The graphql gateway in namespace edge: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

889. The graphql gateway in namespace batch: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

890. The graphql gateway in namespace identity: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

891. The feature-flag service in namespace prod: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

892. The feature-flag service in namespace payments: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

893. The feature-flag service in namespace edge: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

894. The feature-flag service in namespace batch: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

895. The feature-flag service in namespace identity: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

896. The audit logger in namespace prod: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

897. The audit logger in namespace payments: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

898. The audit logger in namespace edge: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

899. The audit logger in namespace batch: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

900. The audit logger in namespace identity: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

901. The pdf renderer in namespace prod: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

902. The pdf renderer in namespace payments: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

903. The pdf renderer in namespace edge: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

904. The pdf renderer in namespace batch: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

905. The pdf renderer in namespace identity: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

906. The catalog API in namespace prod: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

907. The catalog API in namespace payments: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

908. The catalog API in namespace edge: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

909. The catalog API in namespace batch: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

910. The catalog API in namespace identity: some clients get 503 and others do not. A rollout is half-finished and only the new pods fail readiness. Why is that the strategy working as designed, and when do you abort?

## Kubernetes — incident drills: storage

911. The checkout API in namespace prod: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

912. The checkout API in namespace payments: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

913. The checkout API in namespace edge: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

914. The checkout API in namespace batch: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

915. The checkout API in namespace identity: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

916. The invoice worker in namespace prod: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

917. The invoice worker in namespace payments: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

918. The invoice worker in namespace edge: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

919. The invoice worker in namespace batch: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

920. The invoice worker in namespace identity: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

921. The session service in namespace prod: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

922. The session service in namespace payments: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

923. The session service in namespace edge: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

924. The session service in namespace batch: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

925. The session service in namespace identity: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

926. The search indexer in namespace prod: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

927. The search indexer in namespace payments: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

928. The search indexer in namespace edge: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

929. The search indexer in namespace batch: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

930. The search indexer in namespace identity: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

931. The webhook receiver in namespace prod: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

932. The webhook receiver in namespace payments: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

933. The webhook receiver in namespace edge: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

934. The webhook receiver in namespace batch: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

935. The webhook receiver in namespace identity: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

936. The report exporter in namespace prod: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

937. The report exporter in namespace payments: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

938. The report exporter in namespace edge: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

939. The report exporter in namespace batch: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

940. The report exporter in namespace identity: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

941. The auth gateway in namespace prod: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

942. The auth gateway in namespace payments: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

943. The auth gateway in namespace edge: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

944. The auth gateway in namespace batch: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

945. The auth gateway in namespace identity: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

946. The image resizer in namespace prod: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

947. The image resizer in namespace payments: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

948. The image resizer in namespace edge: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

949. The image resizer in namespace batch: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

950. The image resizer in namespace identity: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

951. The billing consumer in namespace prod: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

952. The billing consumer in namespace payments: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

953. The billing consumer in namespace edge: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

954. The billing consumer in namespace batch: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

955. The billing consumer in namespace identity: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

956. The notification sender in namespace prod: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

957. The notification sender in namespace payments: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

958. The notification sender in namespace edge: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

959. The notification sender in namespace batch: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

960. The notification sender in namespace identity: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

961. The graphql gateway in namespace prod: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

962. The graphql gateway in namespace payments: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

963. The graphql gateway in namespace edge: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

964. The graphql gateway in namespace batch: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

965. The graphql gateway in namespace identity: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

966. The feature-flag service in namespace prod: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

967. The feature-flag service in namespace payments: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

968. The feature-flag service in namespace edge: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

969. The feature-flag service in namespace batch: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

970. The feature-flag service in namespace identity: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

971. The audit logger in namespace prod: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

972. The audit logger in namespace payments: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

973. The audit logger in namespace edge: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

974. The audit logger in namespace batch: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

975. The audit logger in namespace identity: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

976. The pdf renderer in namespace prod: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

977. The pdf renderer in namespace payments: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

978. The pdf renderer in namespace edge: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

979. The pdf renderer in namespace batch: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

980. The pdf renderer in namespace identity: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

981. The catalog API in namespace prod: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

982. The catalog API in namespace payments: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

983. The catalog API in namespace edge: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

984. The catalog API in namespace batch: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

985. The catalog API in namespace identity: a replica is stuck ContainerCreating. The PVC is RWO and already attached in another zone. What has to move, the pod or the disk, and which scheduler event says so?

## Kubernetes — incident drills: identity

986. The checkout API in namespace prod: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

987. The checkout API in namespace payments: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

988. The checkout API in namespace edge: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

989. The checkout API in namespace batch: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

990. The checkout API in namespace identity: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

991. The invoice worker in namespace prod: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

992. The invoice worker in namespace payments: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

993. The invoice worker in namespace edge: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

994. The invoice worker in namespace batch: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

995. The invoice worker in namespace identity: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

996. The session service in namespace prod: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

997. The session service in namespace payments: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

998. The session service in namespace edge: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

999. The session service in namespace batch: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1000. The session service in namespace identity: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1001. The search indexer in namespace prod: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1002. The search indexer in namespace payments: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1003. The search indexer in namespace edge: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1004. The search indexer in namespace batch: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1005. The search indexer in namespace identity: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1006. The webhook receiver in namespace prod: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1007. The webhook receiver in namespace payments: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1008. The webhook receiver in namespace edge: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1009. The webhook receiver in namespace batch: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1010. The webhook receiver in namespace identity: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1011. The report exporter in namespace prod: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1012. The report exporter in namespace payments: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1013. The report exporter in namespace edge: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1014. The report exporter in namespace batch: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1015. The report exporter in namespace identity: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1016. The auth gateway in namespace prod: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1017. The auth gateway in namespace payments: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1018. The auth gateway in namespace edge: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1019. The auth gateway in namespace batch: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1020. The auth gateway in namespace identity: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1021. The image resizer in namespace prod: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1022. The image resizer in namespace payments: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1023. The image resizer in namespace edge: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1024. The image resizer in namespace batch: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1025. The image resizer in namespace identity: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1026. The billing consumer in namespace prod: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1027. The billing consumer in namespace payments: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1028. The billing consumer in namespace edge: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1029. The billing consumer in namespace batch: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1030. The billing consumer in namespace identity: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1031. The notification sender in namespace prod: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1032. The notification sender in namespace payments: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1033. The notification sender in namespace edge: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1034. The notification sender in namespace batch: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1035. The notification sender in namespace identity: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1036. The graphql gateway in namespace prod: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1037. The graphql gateway in namespace payments: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1038. The graphql gateway in namespace edge: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1039. The graphql gateway in namespace batch: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1040. The graphql gateway in namespace identity: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1041. The feature-flag service in namespace prod: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1042. The feature-flag service in namespace payments: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1043. The feature-flag service in namespace edge: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1044. The feature-flag service in namespace batch: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1045. The feature-flag service in namespace identity: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1046. The audit logger in namespace prod: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1047. The audit logger in namespace payments: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1048. The audit logger in namespace edge: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1049. The audit logger in namespace batch: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1050. The audit logger in namespace identity: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1051. The pdf renderer in namespace prod: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1052. The pdf renderer in namespace payments: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1053. The pdf renderer in namespace edge: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1054. The pdf renderer in namespace batch: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1055. The pdf renderer in namespace identity: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1056. The catalog API in namespace prod: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1057. The catalog API in namespace payments: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1058. The catalog API in namespace edge: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1059. The catalog API in namespace batch: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1060. The catalog API in namespace identity: the workload cannot read its Secret after a namespace move. The manifest was applied in the new namespace and the Secret was not. Why did the reference not follow the Deployment?

1061. The checkout API in namespace prod: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1062. The checkout API in namespace payments: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1063. The checkout API in namespace edge: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1064. The checkout API in namespace batch: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1065. The checkout API in namespace identity: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1066. The invoice worker in namespace prod: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1067. The invoice worker in namespace payments: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1068. The invoice worker in namespace edge: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1069. The invoice worker in namespace batch: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1070. The invoice worker in namespace identity: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1071. The session service in namespace prod: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1072. The session service in namespace payments: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1073. The session service in namespace edge: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1074. The session service in namespace batch: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1075. The session service in namespace identity: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1076. The search indexer in namespace prod: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1077. The search indexer in namespace payments: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1078. The search indexer in namespace edge: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1079. The search indexer in namespace batch: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1080. The search indexer in namespace identity: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1081. The webhook receiver in namespace prod: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1082. The webhook receiver in namespace payments: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1083. The webhook receiver in namespace edge: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1084. The webhook receiver in namespace batch: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1085. The webhook receiver in namespace identity: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1086. The report exporter in namespace prod: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1087. The report exporter in namespace payments: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1088. The report exporter in namespace edge: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1089. The report exporter in namespace batch: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1090. The report exporter in namespace identity: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1091. The auth gateway in namespace prod: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1092. The auth gateway in namespace payments: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1093. The auth gateway in namespace edge: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1094. The auth gateway in namespace batch: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1095. The auth gateway in namespace identity: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1096. The image resizer in namespace prod: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1097. The image resizer in namespace payments: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1098. The image resizer in namespace edge: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1099. The image resizer in namespace batch: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1100. The image resizer in namespace identity: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1101. The billing consumer in namespace prod: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1102. The billing consumer in namespace payments: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1103. The billing consumer in namespace edge: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1104. The billing consumer in namespace batch: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1105. The billing consumer in namespace identity: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1106. The notification sender in namespace prod: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1107. The notification sender in namespace payments: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1108. The notification sender in namespace edge: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1109. The notification sender in namespace batch: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1110. The notification sender in namespace identity: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1111. The graphql gateway in namespace prod: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1112. The graphql gateway in namespace payments: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1113. The graphql gateway in namespace edge: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1114. The graphql gateway in namespace batch: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1115. The graphql gateway in namespace identity: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1116. The feature-flag service in namespace prod: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1117. The feature-flag service in namespace payments: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1118. The feature-flag service in namespace edge: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1119. The feature-flag service in namespace batch: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1120. The feature-flag service in namespace identity: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1121. The audit logger in namespace prod: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1122. The audit logger in namespace payments: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1123. The audit logger in namespace edge: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1124. The audit logger in namespace batch: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1125. The audit logger in namespace identity: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1126. The pdf renderer in namespace prod: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1127. The pdf renderer in namespace payments: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1128. The pdf renderer in namespace edge: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1129. The pdf renderer in namespace batch: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1130. The pdf renderer in namespace identity: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1131. The catalog API in namespace prod: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1132. The catalog API in namespace payments: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1133. The catalog API in namespace edge: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1134. The catalog API in namespace batch: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

1135. The catalog API in namespace identity: pods are admitted in dev and rejected in prod. prod is Pod Security restricted and the image runs as root. What field has to change in the pod template, and why is loosening prod the wrong fix?

## Kubernetes — incident drills: node pressure

1136. The checkout API in namespace prod: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1137. The checkout API in namespace payments: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1138. The checkout API in namespace edge: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1139. The checkout API in namespace batch: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1140. The checkout API in namespace identity: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1141. The invoice worker in namespace prod: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1142. The invoice worker in namespace payments: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1143. The invoice worker in namespace edge: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1144. The invoice worker in namespace batch: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1145. The invoice worker in namespace identity: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1146. The session service in namespace prod: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1147. The session service in namespace payments: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1148. The session service in namespace edge: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1149. The session service in namespace batch: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1150. The session service in namespace identity: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1151. The search indexer in namespace prod: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1152. The search indexer in namespace payments: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1153. The search indexer in namespace edge: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1154. The search indexer in namespace batch: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1155. The search indexer in namespace identity: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1156. The webhook receiver in namespace prod: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1157. The webhook receiver in namespace payments: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1158. The webhook receiver in namespace edge: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1159. The webhook receiver in namespace batch: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1160. The webhook receiver in namespace identity: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1161. The report exporter in namespace prod: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1162. The report exporter in namespace payments: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1163. The report exporter in namespace edge: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1164. The report exporter in namespace batch: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1165. The report exporter in namespace identity: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1166. The auth gateway in namespace prod: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1167. The auth gateway in namespace payments: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1168. The auth gateway in namespace edge: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1169. The auth gateway in namespace batch: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1170. The auth gateway in namespace identity: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1171. The image resizer in namespace prod: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1172. The image resizer in namespace payments: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1173. The image resizer in namespace edge: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1174. The image resizer in namespace batch: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1175. The image resizer in namespace identity: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1176. The billing consumer in namespace prod: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1177. The billing consumer in namespace payments: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1178. The billing consumer in namespace edge: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1179. The billing consumer in namespace batch: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1180. The billing consumer in namespace identity: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1181. The notification sender in namespace prod: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1182. The notification sender in namespace payments: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1183. The notification sender in namespace edge: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1184. The notification sender in namespace batch: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1185. The notification sender in namespace identity: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1186. The graphql gateway in namespace prod: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1187. The graphql gateway in namespace payments: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1188. The graphql gateway in namespace edge: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1189. The graphql gateway in namespace batch: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1190. The graphql gateway in namespace identity: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1191. The feature-flag service in namespace prod: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1192. The feature-flag service in namespace payments: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1193. The feature-flag service in namespace edge: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1194. The feature-flag service in namespace batch: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1195. The feature-flag service in namespace identity: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1196. The audit logger in namespace prod: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1197. The audit logger in namespace payments: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1198. The audit logger in namespace edge: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1199. The audit logger in namespace batch: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1200. The audit logger in namespace identity: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1201. The pdf renderer in namespace prod: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1202. The pdf renderer in namespace payments: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1203. The pdf renderer in namespace edge: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1204. The pdf renderer in namespace batch: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1205. The pdf renderer in namespace identity: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1206. The catalog API in namespace prod: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1207. The catalog API in namespace payments: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1208. The catalog API in namespace edge: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1209. The catalog API in namespace batch: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

1210. The catalog API in namespace identity: unrelated pods are evicted. One container writes logs to emptyDir without a sizeLimit and the node hits DiskPressure. Whose quota protects the node, and which pods does the kubelet prefer to evict?

## Kubernetes — incident drills: release

1211. The checkout API in namespace prod: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1212. The checkout API in namespace payments: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1213. The checkout API in namespace edge: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1214. The checkout API in namespace batch: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1215. The checkout API in namespace identity: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1216. The invoice worker in namespace prod: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1217. The invoice worker in namespace payments: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1218. The invoice worker in namespace edge: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1219. The invoice worker in namespace batch: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1220. The invoice worker in namespace identity: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1221. The session service in namespace prod: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1222. The session service in namespace payments: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1223. The session service in namespace edge: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1224. The session service in namespace batch: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1225. The session service in namespace identity: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1226. The search indexer in namespace prod: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1227. The search indexer in namespace payments: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1228. The search indexer in namespace edge: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1229. The search indexer in namespace batch: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1230. The search indexer in namespace identity: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1231. The webhook receiver in namespace prod: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1232. The webhook receiver in namespace payments: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1233. The webhook receiver in namespace edge: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1234. The webhook receiver in namespace batch: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1235. The webhook receiver in namespace identity: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1236. The report exporter in namespace prod: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1237. The report exporter in namespace payments: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1238. The report exporter in namespace edge: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1239. The report exporter in namespace batch: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1240. The report exporter in namespace identity: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1241. The auth gateway in namespace prod: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1242. The auth gateway in namespace payments: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1243. The auth gateway in namespace edge: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1244. The auth gateway in namespace batch: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1245. The auth gateway in namespace identity: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1246. The image resizer in namespace prod: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1247. The image resizer in namespace payments: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1248. The image resizer in namespace edge: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1249. The image resizer in namespace batch: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1250. The image resizer in namespace identity: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1251. The billing consumer in namespace prod: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1252. The billing consumer in namespace payments: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1253. The billing consumer in namespace edge: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1254. The billing consumer in namespace batch: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1255. The billing consumer in namespace identity: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1256. The notification sender in namespace prod: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1257. The notification sender in namespace payments: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1258. The notification sender in namespace edge: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1259. The notification sender in namespace batch: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1260. The notification sender in namespace identity: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1261. The graphql gateway in namespace prod: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1262. The graphql gateway in namespace payments: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1263. The graphql gateway in namespace edge: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1264. The graphql gateway in namespace batch: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1265. The graphql gateway in namespace identity: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1266. The feature-flag service in namespace prod: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1267. The feature-flag service in namespace payments: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1268. The feature-flag service in namespace edge: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1269. The feature-flag service in namespace batch: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1270. The feature-flag service in namespace identity: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1271. The audit logger in namespace prod: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1272. The audit logger in namespace payments: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1273. The audit logger in namespace edge: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1274. The audit logger in namespace batch: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1275. The audit logger in namespace identity: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1276. The pdf renderer in namespace prod: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1277. The pdf renderer in namespace payments: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1278. The pdf renderer in namespace edge: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1279. The pdf renderer in namespace batch: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1280. The pdf renderer in namespace identity: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1281. The catalog API in namespace prod: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1282. The catalog API in namespace payments: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1283. The catalog API in namespace edge: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1284. The catalog API in namespace batch: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

1285. The catalog API in namespace identity: a rollback does not restore the previous behavior. The bug was in a ConfigMap edited in place, and the Deployment revision only changed the image. What has to be in the pod template for undo to bring the old config back?

## Docker — incident drills: build and ship

1286. Service checkout API: CI and a laptop produce different image digests from the same commit. One of them is not sending the lockfile because of a different .dockerignore. How do you prove which context each build used, and what do you pin so the digest is a function of the commit?

1287. Service invoice worker: CI and a laptop produce different image digests from the same commit. One of them is not sending the lockfile because of a different .dockerignore. How do you prove which context each build used, and what do you pin so the digest is a function of the commit?

1288. Service session service: CI and a laptop produce different image digests from the same commit. One of them is not sending the lockfile because of a different .dockerignore. How do you prove which context each build used, and what do you pin so the digest is a function of the commit?

1289. Service search indexer: CI and a laptop produce different image digests from the same commit. One of them is not sending the lockfile because of a different .dockerignore. How do you prove which context each build used, and what do you pin so the digest is a function of the commit?

1290. Service webhook receiver: CI and a laptop produce different image digests from the same commit. One of them is not sending the lockfile because of a different .dockerignore. How do you prove which context each build used, and what do you pin so the digest is a function of the commit?

1291. Service report exporter: CI and a laptop produce different image digests from the same commit. One of them is not sending the lockfile because of a different .dockerignore. How do you prove which context each build used, and what do you pin so the digest is a function of the commit?

1292. Service auth gateway: CI and a laptop produce different image digests from the same commit. One of them is not sending the lockfile because of a different .dockerignore. How do you prove which context each build used, and what do you pin so the digest is a function of the commit?

1293. Service image resizer: CI and a laptop produce different image digests from the same commit. One of them is not sending the lockfile because of a different .dockerignore. How do you prove which context each build used, and what do you pin so the digest is a function of the commit?

1294. Service billing consumer: CI and a laptop produce different image digests from the same commit. One of them is not sending the lockfile because of a different .dockerignore. How do you prove which context each build used, and what do you pin so the digest is a function of the commit?

1295. Service notification sender: CI and a laptop produce different image digests from the same commit. One of them is not sending the lockfile because of a different .dockerignore. How do you prove which context each build used, and what do you pin so the digest is a function of the commit?

1296. Service graphql gateway: CI and a laptop produce different image digests from the same commit. One of them is not sending the lockfile because of a different .dockerignore. How do you prove which context each build used, and what do you pin so the digest is a function of the commit?

1297. Service feature-flag service: CI and a laptop produce different image digests from the same commit. One of them is not sending the lockfile because of a different .dockerignore. How do you prove which context each build used, and what do you pin so the digest is a function of the commit?

1298. Service audit logger: CI and a laptop produce different image digests from the same commit. One of them is not sending the lockfile because of a different .dockerignore. How do you prove which context each build used, and what do you pin so the digest is a function of the commit?

1299. Service pdf renderer: CI and a laptop produce different image digests from the same commit. One of them is not sending the lockfile because of a different .dockerignore. How do you prove which context each build used, and what do you pin so the digest is a function of the commit?

1300. Service catalog API: CI and a laptop produce different image digests from the same commit. One of them is not sending the lockfile because of a different .dockerignore. How do you prove which context each build used, and what do you pin so the digest is a function of the commit?

1301. Service checkout API: the running container does not contain the commit you think you deployed. The orchestrator pulled :latest and the registry tag moved after the deploy. Which reference should have been in the manifest, and how do you find the digest that is actually running?

1302. Service invoice worker: the running container does not contain the commit you think you deployed. The orchestrator pulled :latest and the registry tag moved after the deploy. Which reference should have been in the manifest, and how do you find the digest that is actually running?

1303. Service session service: the running container does not contain the commit you think you deployed. The orchestrator pulled :latest and the registry tag moved after the deploy. Which reference should have been in the manifest, and how do you find the digest that is actually running?

1304. Service search indexer: the running container does not contain the commit you think you deployed. The orchestrator pulled :latest and the registry tag moved after the deploy. Which reference should have been in the manifest, and how do you find the digest that is actually running?

1305. Service webhook receiver: the running container does not contain the commit you think you deployed. The orchestrator pulled :latest and the registry tag moved after the deploy. Which reference should have been in the manifest, and how do you find the digest that is actually running?

1306. Service report exporter: the running container does not contain the commit you think you deployed. The orchestrator pulled :latest and the registry tag moved after the deploy. Which reference should have been in the manifest, and how do you find the digest that is actually running?

1307. Service auth gateway: the running container does not contain the commit you think you deployed. The orchestrator pulled :latest and the registry tag moved after the deploy. Which reference should have been in the manifest, and how do you find the digest that is actually running?

1308. Service image resizer: the running container does not contain the commit you think you deployed. The orchestrator pulled :latest and the registry tag moved after the deploy. Which reference should have been in the manifest, and how do you find the digest that is actually running?

1309. Service billing consumer: the running container does not contain the commit you think you deployed. The orchestrator pulled :latest and the registry tag moved after the deploy. Which reference should have been in the manifest, and how do you find the digest that is actually running?

1310. Service notification sender: the running container does not contain the commit you think you deployed. The orchestrator pulled :latest and the registry tag moved after the deploy. Which reference should have been in the manifest, and how do you find the digest that is actually running?

1311. Service graphql gateway: the running container does not contain the commit you think you deployed. The orchestrator pulled :latest and the registry tag moved after the deploy. Which reference should have been in the manifest, and how do you find the digest that is actually running?

1312. Service feature-flag service: the running container does not contain the commit you think you deployed. The orchestrator pulled :latest and the registry tag moved after the deploy. Which reference should have been in the manifest, and how do you find the digest that is actually running?

1313. Service audit logger: the running container does not contain the commit you think you deployed. The orchestrator pulled :latest and the registry tag moved after the deploy. Which reference should have been in the manifest, and how do you find the digest that is actually running?

1314. Service pdf renderer: the running container does not contain the commit you think you deployed. The orchestrator pulled :latest and the registry tag moved after the deploy. Which reference should have been in the manifest, and how do you find the digest that is actually running?

1315. Service catalog API: the running container does not contain the commit you think you deployed. The orchestrator pulled :latest and the registry tag moved after the deploy. Which reference should have been in the manifest, and how do you find the digest that is actually running?

## Docker — incident drills: runtime

1316. Service checkout API: docker logs is empty while users see errors. The process writes to a file under /var/log inside the container. What has to change so the platform log collector sees the errors without a sidecar tailing a file you forget to rotate?

1317. Service invoice worker: docker logs is empty while users see errors. The process writes to a file under /var/log inside the container. What has to change so the platform log collector sees the errors without a sidecar tailing a file you forget to rotate?

1318. Service session service: docker logs is empty while users see errors. The process writes to a file under /var/log inside the container. What has to change so the platform log collector sees the errors without a sidecar tailing a file you forget to rotate?

1319. Service search indexer: docker logs is empty while users see errors. The process writes to a file under /var/log inside the container. What has to change so the platform log collector sees the errors without a sidecar tailing a file you forget to rotate?

1320. Service webhook receiver: docker logs is empty while users see errors. The process writes to a file under /var/log inside the container. What has to change so the platform log collector sees the errors without a sidecar tailing a file you forget to rotate?

1321. Service report exporter: docker logs is empty while users see errors. The process writes to a file under /var/log inside the container. What has to change so the platform log collector sees the errors without a sidecar tailing a file you forget to rotate?

1322. Service auth gateway: docker logs is empty while users see errors. The process writes to a file under /var/log inside the container. What has to change so the platform log collector sees the errors without a sidecar tailing a file you forget to rotate?

1323. Service image resizer: docker logs is empty while users see errors. The process writes to a file under /var/log inside the container. What has to change so the platform log collector sees the errors without a sidecar tailing a file you forget to rotate?

1324. Service billing consumer: docker logs is empty while users see errors. The process writes to a file under /var/log inside the container. What has to change so the platform log collector sees the errors without a sidecar tailing a file you forget to rotate?

1325. Service notification sender: docker logs is empty while users see errors. The process writes to a file under /var/log inside the container. What has to change so the platform log collector sees the errors without a sidecar tailing a file you forget to rotate?

1326. Service graphql gateway: docker logs is empty while users see errors. The process writes to a file under /var/log inside the container. What has to change so the platform log collector sees the errors without a sidecar tailing a file you forget to rotate?

1327. Service feature-flag service: docker logs is empty while users see errors. The process writes to a file under /var/log inside the container. What has to change so the platform log collector sees the errors without a sidecar tailing a file you forget to rotate?

1328. Service audit logger: docker logs is empty while users see errors. The process writes to a file under /var/log inside the container. What has to change so the platform log collector sees the errors without a sidecar tailing a file you forget to rotate?

1329. Service pdf renderer: docker logs is empty while users see errors. The process writes to a file under /var/log inside the container. What has to change so the platform log collector sees the errors without a sidecar tailing a file you forget to rotate?

1330. Service catalog API: docker logs is empty while users see errors. The process writes to a file under /var/log inside the container. What has to change so the platform log collector sees the errors without a sidecar tailing a file you forget to rotate?

1331. Service checkout API: docker stop hangs until SIGKILL and in-flight work is lost. PID 1 is a shell script that does not exec the app. What process tree do you want, and how do you test signal handling before the next release?

1332. Service invoice worker: docker stop hangs until SIGKILL and in-flight work is lost. PID 1 is a shell script that does not exec the app. What process tree do you want, and how do you test signal handling before the next release?

1333. Service session service: docker stop hangs until SIGKILL and in-flight work is lost. PID 1 is a shell script that does not exec the app. What process tree do you want, and how do you test signal handling before the next release?

1334. Service search indexer: docker stop hangs until SIGKILL and in-flight work is lost. PID 1 is a shell script that does not exec the app. What process tree do you want, and how do you test signal handling before the next release?

1335. Service webhook receiver: docker stop hangs until SIGKILL and in-flight work is lost. PID 1 is a shell script that does not exec the app. What process tree do you want, and how do you test signal handling before the next release?

1336. Service report exporter: docker stop hangs until SIGKILL and in-flight work is lost. PID 1 is a shell script that does not exec the app. What process tree do you want, and how do you test signal handling before the next release?

1337. Service auth gateway: docker stop hangs until SIGKILL and in-flight work is lost. PID 1 is a shell script that does not exec the app. What process tree do you want, and how do you test signal handling before the next release?

1338. Service image resizer: docker stop hangs until SIGKILL and in-flight work is lost. PID 1 is a shell script that does not exec the app. What process tree do you want, and how do you test signal handling before the next release?

1339. Service billing consumer: docker stop hangs until SIGKILL and in-flight work is lost. PID 1 is a shell script that does not exec the app. What process tree do you want, and how do you test signal handling before the next release?

1340. Service notification sender: docker stop hangs until SIGKILL and in-flight work is lost. PID 1 is a shell script that does not exec the app. What process tree do you want, and how do you test signal handling before the next release?

1341. Service graphql gateway: docker stop hangs until SIGKILL and in-flight work is lost. PID 1 is a shell script that does not exec the app. What process tree do you want, and how do you test signal handling before the next release?

1342. Service feature-flag service: docker stop hangs until SIGKILL and in-flight work is lost. PID 1 is a shell script that does not exec the app. What process tree do you want, and how do you test signal handling before the next release?

1343. Service audit logger: docker stop hangs until SIGKILL and in-flight work is lost. PID 1 is a shell script that does not exec the app. What process tree do you want, and how do you test signal handling before the next release?

1344. Service pdf renderer: docker stop hangs until SIGKILL and in-flight work is lost. PID 1 is a shell script that does not exec the app. What process tree do you want, and how do you test signal handling before the next release?

1345. Service catalog API: docker stop hangs until SIGKILL and in-flight work is lost. PID 1 is a shell script that does not exec the app. What process tree do you want, and how do you test signal handling before the next release?

## Docker — incident drills: data

1346. Service checkout API: a recreate after a new image loses uploads. Uploads were written to the container writable layer. Which mount should have held them, and what is already unrecoverable?

1347. Service invoice worker: a recreate after a new image loses uploads. Uploads were written to the container writable layer. Which mount should have held them, and what is already unrecoverable?

1348. Service session service: a recreate after a new image loses uploads. Uploads were written to the container writable layer. Which mount should have held them, and what is already unrecoverable?

1349. Service search indexer: a recreate after a new image loses uploads. Uploads were written to the container writable layer. Which mount should have held them, and what is already unrecoverable?

1350. Service webhook receiver: a recreate after a new image loses uploads. Uploads were written to the container writable layer. Which mount should have held them, and what is already unrecoverable?

1351. Service report exporter: a recreate after a new image loses uploads. Uploads were written to the container writable layer. Which mount should have held them, and what is already unrecoverable?

1352. Service auth gateway: a recreate after a new image loses uploads. Uploads were written to the container writable layer. Which mount should have held them, and what is already unrecoverable?

1353. Service image resizer: a recreate after a new image loses uploads. Uploads were written to the container writable layer. Which mount should have held them, and what is already unrecoverable?

1354. Service billing consumer: a recreate after a new image loses uploads. Uploads were written to the container writable layer. Which mount should have held them, and what is already unrecoverable?

1355. Service notification sender: a recreate after a new image loses uploads. Uploads were written to the container writable layer. Which mount should have held them, and what is already unrecoverable?

1356. Service graphql gateway: a recreate after a new image loses uploads. Uploads were written to the container writable layer. Which mount should have held them, and what is already unrecoverable?

1357. Service feature-flag service: a recreate after a new image loses uploads. Uploads were written to the container writable layer. Which mount should have held them, and what is already unrecoverable?

1358. Service audit logger: a recreate after a new image loses uploads. Uploads were written to the container writable layer. Which mount should have held them, and what is already unrecoverable?

1359. Service pdf renderer: a recreate after a new image loses uploads. Uploads were written to the container writable layer. Which mount should have held them, and what is already unrecoverable?

1360. Service catalog API: a recreate after a new image loses uploads. Uploads were written to the container writable layer. Which mount should have held them, and what is already unrecoverable?

1361. Service checkout API: two compose services cannot resolve each other. They are attached to different networks and one uses localhost in its config. What hostname and which shared network do you set?

1362. Service invoice worker: two compose services cannot resolve each other. They are attached to different networks and one uses localhost in its config. What hostname and which shared network do you set?

1363. Service session service: two compose services cannot resolve each other. They are attached to different networks and one uses localhost in its config. What hostname and which shared network do you set?

1364. Service search indexer: two compose services cannot resolve each other. They are attached to different networks and one uses localhost in its config. What hostname and which shared network do you set?

1365. Service webhook receiver: two compose services cannot resolve each other. They are attached to different networks and one uses localhost in its config. What hostname and which shared network do you set?

1366. Service report exporter: two compose services cannot resolve each other. They are attached to different networks and one uses localhost in its config. What hostname and which shared network do you set?

1367. Service auth gateway: two compose services cannot resolve each other. They are attached to different networks and one uses localhost in its config. What hostname and which shared network do you set?

1368. Service image resizer: two compose services cannot resolve each other. They are attached to different networks and one uses localhost in its config. What hostname and which shared network do you set?

1369. Service billing consumer: two compose services cannot resolve each other. They are attached to different networks and one uses localhost in its config. What hostname and which shared network do you set?

1370. Service notification sender: two compose services cannot resolve each other. They are attached to different networks and one uses localhost in its config. What hostname and which shared network do you set?

1371. Service graphql gateway: two compose services cannot resolve each other. They are attached to different networks and one uses localhost in its config. What hostname and which shared network do you set?

1372. Service feature-flag service: two compose services cannot resolve each other. They are attached to different networks and one uses localhost in its config. What hostname and which shared network do you set?

1373. Service audit logger: two compose services cannot resolve each other. They are attached to different networks and one uses localhost in its config. What hostname and which shared network do you set?

1374. Service pdf renderer: two compose services cannot resolve each other. They are attached to different networks and one uses localhost in its config. What hostname and which shared network do you set?

1375. Service catalog API: two compose services cannot resolve each other. They are attached to different networks and one uses localhost in its config. What hostname and which shared network do you set?

## Docker — incident drills: resources

1376. Service checkout API: the host becomes unreachable and only then does the container die. No memory limit was set, so the host OOM killer picked sshd's neighbors at random. What limit contains the blast radius, and why can the process still see the host's RAM in /proc/meminfo?

1377. Service invoice worker: the host becomes unreachable and only then does the container die. No memory limit was set, so the host OOM killer picked sshd's neighbors at random. What limit contains the blast radius, and why can the process still see the host's RAM in /proc/meminfo?

1378. Service session service: the host becomes unreachable and only then does the container die. No memory limit was set, so the host OOM killer picked sshd's neighbors at random. What limit contains the blast radius, and why can the process still see the host's RAM in /proc/meminfo?

1379. Service search indexer: the host becomes unreachable and only then does the container die. No memory limit was set, so the host OOM killer picked sshd's neighbors at random. What limit contains the blast radius, and why can the process still see the host's RAM in /proc/meminfo?

1380. Service webhook receiver: the host becomes unreachable and only then does the container die. No memory limit was set, so the host OOM killer picked sshd's neighbors at random. What limit contains the blast radius, and why can the process still see the host's RAM in /proc/meminfo?

1381. Service report exporter: the host becomes unreachable and only then does the container die. No memory limit was set, so the host OOM killer picked sshd's neighbors at random. What limit contains the blast radius, and why can the process still see the host's RAM in /proc/meminfo?

1382. Service auth gateway: the host becomes unreachable and only then does the container die. No memory limit was set, so the host OOM killer picked sshd's neighbors at random. What limit contains the blast radius, and why can the process still see the host's RAM in /proc/meminfo?

1383. Service image resizer: the host becomes unreachable and only then does the container die. No memory limit was set, so the host OOM killer picked sshd's neighbors at random. What limit contains the blast radius, and why can the process still see the host's RAM in /proc/meminfo?

1384. Service billing consumer: the host becomes unreachable and only then does the container die. No memory limit was set, so the host OOM killer picked sshd's neighbors at random. What limit contains the blast radius, and why can the process still see the host's RAM in /proc/meminfo?

1385. Service notification sender: the host becomes unreachable and only then does the container die. No memory limit was set, so the host OOM killer picked sshd's neighbors at random. What limit contains the blast radius, and why can the process still see the host's RAM in /proc/meminfo?

1386. Service graphql gateway: the host becomes unreachable and only then does the container die. No memory limit was set, so the host OOM killer picked sshd's neighbors at random. What limit contains the blast radius, and why can the process still see the host's RAM in /proc/meminfo?

1387. Service feature-flag service: the host becomes unreachable and only then does the container die. No memory limit was set, so the host OOM killer picked sshd's neighbors at random. What limit contains the blast radius, and why can the process still see the host's RAM in /proc/meminfo?

1388. Service audit logger: the host becomes unreachable and only then does the container die. No memory limit was set, so the host OOM killer picked sshd's neighbors at random. What limit contains the blast radius, and why can the process still see the host's RAM in /proc/meminfo?

1389. Service pdf renderer: the host becomes unreachable and only then does the container die. No memory limit was set, so the host OOM killer picked sshd's neighbors at random. What limit contains the blast radius, and why can the process still see the host's RAM in /proc/meminfo?

1390. Service catalog API: the host becomes unreachable and only then does the container die. No memory limit was set, so the host OOM killer picked sshd's neighbors at random. What limit contains the blast radius, and why can the process still see the host's RAM in /proc/meminfo?

## Docker — incident drills: security

1391. Service checkout API: a low-severity app bug becomes a host compromise. The container is privileged and the docker socket is mounted. Which of those two grants was sufficient on its own, and what do you remove first?

1392. Service invoice worker: a low-severity app bug becomes a host compromise. The container is privileged and the docker socket is mounted. Which of those two grants was sufficient on its own, and what do you remove first?

1393. Service session service: a low-severity app bug becomes a host compromise. The container is privileged and the docker socket is mounted. Which of those two grants was sufficient on its own, and what do you remove first?

1394. Service search indexer: a low-severity app bug becomes a host compromise. The container is privileged and the docker socket is mounted. Which of those two grants was sufficient on its own, and what do you remove first?

1395. Service webhook receiver: a low-severity app bug becomes a host compromise. The container is privileged and the docker socket is mounted. Which of those two grants was sufficient on its own, and what do you remove first?

1396. Service report exporter: a low-severity app bug becomes a host compromise. The container is privileged and the docker socket is mounted. Which of those two grants was sufficient on its own, and what do you remove first?

1397. Service auth gateway: a low-severity app bug becomes a host compromise. The container is privileged and the docker socket is mounted. Which of those two grants was sufficient on its own, and what do you remove first?

1398. Service image resizer: a low-severity app bug becomes a host compromise. The container is privileged and the docker socket is mounted. Which of those two grants was sufficient on its own, and what do you remove first?

1399. Service billing consumer: a low-severity app bug becomes a host compromise. The container is privileged and the docker socket is mounted. Which of those two grants was sufficient on its own, and what do you remove first?

1400. Service notification sender: a low-severity app bug becomes a host compromise. The container is privileged and the docker socket is mounted. Which of those two grants was sufficient on its own, and what do you remove first?

1401. Service graphql gateway: a low-severity app bug becomes a host compromise. The container is privileged and the docker socket is mounted. Which of those two grants was sufficient on its own, and what do you remove first?

1402. Service feature-flag service: a low-severity app bug becomes a host compromise. The container is privileged and the docker socket is mounted. Which of those two grants was sufficient on its own, and what do you remove first?

1403. Service audit logger: a low-severity app bug becomes a host compromise. The container is privileged and the docker socket is mounted. Which of those two grants was sufficient on its own, and what do you remove first?

1404. Service pdf renderer: a low-severity app bug becomes a host compromise. The container is privileged and the docker socket is mounted. Which of those two grants was sufficient on its own, and what do you remove first?

1405. Service catalog API: a low-severity app bug becomes a host compromise. The container is privileged and the docker socket is mounted. Which of those two grants was sufficient on its own, and what do you remove first?

## Kubernetes — failed fixes

1406. On checkout API, the first response was: deleted the pod. Result: the controller recreated the same unschedulable spec. The underlying fact: the pod was Pending with a node affinity that matches no node. Why did the delete change nothing, and which field do you edit instead?

1407. On invoice worker, the first response was: deleted the pod. Result: the controller recreated the same unschedulable spec. The underlying fact: the pod was Pending with a node affinity that matches no node. Why did the delete change nothing, and which field do you edit instead?

1408. On session service, the first response was: deleted the pod. Result: the controller recreated the same unschedulable spec. The underlying fact: the pod was Pending with a node affinity that matches no node. Why did the delete change nothing, and which field do you edit instead?

1409. On search indexer, the first response was: deleted the pod. Result: the controller recreated the same unschedulable spec. The underlying fact: the pod was Pending with a node affinity that matches no node. Why did the delete change nothing, and which field do you edit instead?

1410. On webhook receiver, the first response was: deleted the pod. Result: the controller recreated the same unschedulable spec. The underlying fact: the pod was Pending with a node affinity that matches no node. Why did the delete change nothing, and which field do you edit instead?

1411. On report exporter, the first response was: deleted the pod. Result: the controller recreated the same unschedulable spec. The underlying fact: the pod was Pending with a node affinity that matches no node. Why did the delete change nothing, and which field do you edit instead?

1412. On auth gateway, the first response was: deleted the pod. Result: the controller recreated the same unschedulable spec. The underlying fact: the pod was Pending with a node affinity that matches no node. Why did the delete change nothing, and which field do you edit instead?

1413. On image resizer, the first response was: deleted the pod. Result: the controller recreated the same unschedulable spec. The underlying fact: the pod was Pending with a node affinity that matches no node. Why did the delete change nothing, and which field do you edit instead?

1414. On billing consumer, the first response was: deleted the pod. Result: the controller recreated the same unschedulable spec. The underlying fact: the pod was Pending with a node affinity that matches no node. Why did the delete change nothing, and which field do you edit instead?

1415. On notification sender, the first response was: deleted the pod. Result: the controller recreated the same unschedulable spec. The underlying fact: the pod was Pending with a node affinity that matches no node. Why did the delete change nothing, and which field do you edit instead?

1416. On checkout API, the first response was: raised replicas from 3 to 10. Result: ten pods are now CrashLooping. The underlying fact: the process exits because a required env var is missing. Why does scale multiply a bad spec, and where must the env come from?

1417. On invoice worker, the first response was: raised replicas from 3 to 10. Result: ten pods are now CrashLooping. The underlying fact: the process exits because a required env var is missing. Why does scale multiply a bad spec, and where must the env come from?

1418. On session service, the first response was: raised replicas from 3 to 10. Result: ten pods are now CrashLooping. The underlying fact: the process exits because a required env var is missing. Why does scale multiply a bad spec, and where must the env come from?

1419. On search indexer, the first response was: raised replicas from 3 to 10. Result: ten pods are now CrashLooping. The underlying fact: the process exits because a required env var is missing. Why does scale multiply a bad spec, and where must the env come from?

1420. On webhook receiver, the first response was: raised replicas from 3 to 10. Result: ten pods are now CrashLooping. The underlying fact: the process exits because a required env var is missing. Why does scale multiply a bad spec, and where must the env come from?

1421. On report exporter, the first response was: raised replicas from 3 to 10. Result: ten pods are now CrashLooping. The underlying fact: the process exits because a required env var is missing. Why does scale multiply a bad spec, and where must the env come from?

1422. On auth gateway, the first response was: raised replicas from 3 to 10. Result: ten pods are now CrashLooping. The underlying fact: the process exits because a required env var is missing. Why does scale multiply a bad spec, and where must the env come from?

1423. On image resizer, the first response was: raised replicas from 3 to 10. Result: ten pods are now CrashLooping. The underlying fact: the process exits because a required env var is missing. Why does scale multiply a bad spec, and where must the env come from?

1424. On billing consumer, the first response was: raised replicas from 3 to 10. Result: ten pods are now CrashLooping. The underlying fact: the process exits because a required env var is missing. Why does scale multiply a bad spec, and where must the env come from?

1425. On notification sender, the first response was: raised replicas from 3 to 10. Result: ten pods are now CrashLooping. The underlying fact: the process exits because a required env var is missing. Why does scale multiply a bad spec, and where must the env come from?

1426. On checkout API, the first response was: turned liveness off. Result: deadlocked processes stay in the Service forever. The underlying fact: the original probe was failing only because it called the database. What probe do you keep, and what check do you remove from it?

1427. On invoice worker, the first response was: turned liveness off. Result: deadlocked processes stay in the Service forever. The underlying fact: the original probe was failing only because it called the database. What probe do you keep, and what check do you remove from it?

1428. On session service, the first response was: turned liveness off. Result: deadlocked processes stay in the Service forever. The underlying fact: the original probe was failing only because it called the database. What probe do you keep, and what check do you remove from it?

1429. On search indexer, the first response was: turned liveness off. Result: deadlocked processes stay in the Service forever. The underlying fact: the original probe was failing only because it called the database. What probe do you keep, and what check do you remove from it?

1430. On webhook receiver, the first response was: turned liveness off. Result: deadlocked processes stay in the Service forever. The underlying fact: the original probe was failing only because it called the database. What probe do you keep, and what check do you remove from it?

1431. On report exporter, the first response was: turned liveness off. Result: deadlocked processes stay in the Service forever. The underlying fact: the original probe was failing only because it called the database. What probe do you keep, and what check do you remove from it?

1432. On auth gateway, the first response was: turned liveness off. Result: deadlocked processes stay in the Service forever. The underlying fact: the original probe was failing only because it called the database. What probe do you keep, and what check do you remove from it?

1433. On image resizer, the first response was: turned liveness off. Result: deadlocked processes stay in the Service forever. The underlying fact: the original probe was failing only because it called the database. What probe do you keep, and what check do you remove from it?

1434. On billing consumer, the first response was: turned liveness off. Result: deadlocked processes stay in the Service forever. The underlying fact: the original probe was failing only because it called the database. What probe do you keep, and what check do you remove from it?

1435. On notification sender, the first response was: turned liveness off. Result: deadlocked processes stay in the Service forever. The underlying fact: the original probe was failing only because it called the database. What probe do you keep, and what check do you remove from it?

1436. On checkout API, the first response was: set resources.limits.memory to 64Gi. Result: one pod can now kill the node. The underlying fact: the process was OOMKilled at 512Mi because of a leak. Why is a bigger limit not a leak fix, and what eviction behavior did you just change?

1437. On invoice worker, the first response was: set resources.limits.memory to 64Gi. Result: one pod can now kill the node. The underlying fact: the process was OOMKilled at 512Mi because of a leak. Why is a bigger limit not a leak fix, and what eviction behavior did you just change?

1438. On session service, the first response was: set resources.limits.memory to 64Gi. Result: one pod can now kill the node. The underlying fact: the process was OOMKilled at 512Mi because of a leak. Why is a bigger limit not a leak fix, and what eviction behavior did you just change?

1439. On search indexer, the first response was: set resources.limits.memory to 64Gi. Result: one pod can now kill the node. The underlying fact: the process was OOMKilled at 512Mi because of a leak. Why is a bigger limit not a leak fix, and what eviction behavior did you just change?

1440. On webhook receiver, the first response was: set resources.limits.memory to 64Gi. Result: one pod can now kill the node. The underlying fact: the process was OOMKilled at 512Mi because of a leak. Why is a bigger limit not a leak fix, and what eviction behavior did you just change?

1441. On report exporter, the first response was: set resources.limits.memory to 64Gi. Result: one pod can now kill the node. The underlying fact: the process was OOMKilled at 512Mi because of a leak. Why is a bigger limit not a leak fix, and what eviction behavior did you just change?

1442. On auth gateway, the first response was: set resources.limits.memory to 64Gi. Result: one pod can now kill the node. The underlying fact: the process was OOMKilled at 512Mi because of a leak. Why is a bigger limit not a leak fix, and what eviction behavior did you just change?

1443. On image resizer, the first response was: set resources.limits.memory to 64Gi. Result: one pod can now kill the node. The underlying fact: the process was OOMKilled at 512Mi because of a leak. Why is a bigger limit not a leak fix, and what eviction behavior did you just change?

1444. On billing consumer, the first response was: set resources.limits.memory to 64Gi. Result: one pod can now kill the node. The underlying fact: the process was OOMKilled at 512Mi because of a leak. Why is a bigger limit not a leak fix, and what eviction behavior did you just change?

1445. On notification sender, the first response was: set resources.limits.memory to 64Gi. Result: one pod can now kill the node. The underlying fact: the process was OOMKilled at 512Mi because of a leak. Why is a bigger limit not a leak fix, and what eviction behavior did you just change?

1446. On checkout API, the first response was: added hostNetwork: true. Result: the pod binds the node's ports and collides with the CNI. The underlying fact: the Service had no endpoints because targetPort was wrong. What was the actual break, and what isolation did hostNetwork cost?

1447. On invoice worker, the first response was: added hostNetwork: true. Result: the pod binds the node's ports and collides with the CNI. The underlying fact: the Service had no endpoints because targetPort was wrong. What was the actual break, and what isolation did hostNetwork cost?

1448. On session service, the first response was: added hostNetwork: true. Result: the pod binds the node's ports and collides with the CNI. The underlying fact: the Service had no endpoints because targetPort was wrong. What was the actual break, and what isolation did hostNetwork cost?

1449. On search indexer, the first response was: added hostNetwork: true. Result: the pod binds the node's ports and collides with the CNI. The underlying fact: the Service had no endpoints because targetPort was wrong. What was the actual break, and what isolation did hostNetwork cost?

1450. On webhook receiver, the first response was: added hostNetwork: true. Result: the pod binds the node's ports and collides with the CNI. The underlying fact: the Service had no endpoints because targetPort was wrong. What was the actual break, and what isolation did hostNetwork cost?

1451. On report exporter, the first response was: added hostNetwork: true. Result: the pod binds the node's ports and collides with the CNI. The underlying fact: the Service had no endpoints because targetPort was wrong. What was the actual break, and what isolation did hostNetwork cost?

1452. On auth gateway, the first response was: added hostNetwork: true. Result: the pod binds the node's ports and collides with the CNI. The underlying fact: the Service had no endpoints because targetPort was wrong. What was the actual break, and what isolation did hostNetwork cost?

1453. On image resizer, the first response was: added hostNetwork: true. Result: the pod binds the node's ports and collides with the CNI. The underlying fact: the Service had no endpoints because targetPort was wrong. What was the actual break, and what isolation did hostNetwork cost?

1454. On billing consumer, the first response was: added hostNetwork: true. Result: the pod binds the node's ports and collides with the CNI. The underlying fact: the Service had no endpoints because targetPort was wrong. What was the actual break, and what isolation did hostNetwork cost?

1455. On notification sender, the first response was: added hostNetwork: true. Result: the pod binds the node's ports and collides with the CNI. The underlying fact: the Service had no endpoints because targetPort was wrong. What was the actual break, and what isolation did hostNetwork cost?

1456. On checkout API, the first response was: set imagePullPolicy: Never. Result: new nodes run nothing because they have never pulled the image. The underlying fact: ImagePullBackOff was an expired registry credential. What policy do you want in production, and where does the credential have to live?

1457. On invoice worker, the first response was: set imagePullPolicy: Never. Result: new nodes run nothing because they have never pulled the image. The underlying fact: ImagePullBackOff was an expired registry credential. What policy do you want in production, and where does the credential have to live?

1458. On session service, the first response was: set imagePullPolicy: Never. Result: new nodes run nothing because they have never pulled the image. The underlying fact: ImagePullBackOff was an expired registry credential. What policy do you want in production, and where does the credential have to live?

1459. On search indexer, the first response was: set imagePullPolicy: Never. Result: new nodes run nothing because they have never pulled the image. The underlying fact: ImagePullBackOff was an expired registry credential. What policy do you want in production, and where does the credential have to live?

1460. On webhook receiver, the first response was: set imagePullPolicy: Never. Result: new nodes run nothing because they have never pulled the image. The underlying fact: ImagePullBackOff was an expired registry credential. What policy do you want in production, and where does the credential have to live?

1461. On report exporter, the first response was: set imagePullPolicy: Never. Result: new nodes run nothing because they have never pulled the image. The underlying fact: ImagePullBackOff was an expired registry credential. What policy do you want in production, and where does the credential have to live?

1462. On auth gateway, the first response was: set imagePullPolicy: Never. Result: new nodes run nothing because they have never pulled the image. The underlying fact: ImagePullBackOff was an expired registry credential. What policy do you want in production, and where does the credential have to live?

1463. On image resizer, the first response was: set imagePullPolicy: Never. Result: new nodes run nothing because they have never pulled the image. The underlying fact: ImagePullBackOff was an expired registry credential. What policy do you want in production, and where does the credential have to live?

1464. On billing consumer, the first response was: set imagePullPolicy: Never. Result: new nodes run nothing because they have never pulled the image. The underlying fact: ImagePullBackOff was an expired registry credential. What policy do you want in production, and where does the credential have to live?

1465. On notification sender, the first response was: set imagePullPolicy: Never. Result: new nodes run nothing because they have never pulled the image. The underlying fact: ImagePullBackOff was an expired registry credential. What policy do you want in production, and where does the credential have to live?

1466. On checkout API, the first response was: cordoned every NotReady node. Result: you have cordoned the whole cluster and the control plane cannot place replacements. The underlying fact: the nodes were NotReady because CoreDNS was pending on them. What was the circular move, and which object do you recover first?

1467. On invoice worker, the first response was: cordoned every NotReady node. Result: you have cordoned the whole cluster and the control plane cannot place replacements. The underlying fact: the nodes were NotReady because CoreDNS was pending on them. What was the circular move, and which object do you recover first?

1468. On session service, the first response was: cordoned every NotReady node. Result: you have cordoned the whole cluster and the control plane cannot place replacements. The underlying fact: the nodes were NotReady because CoreDNS was pending on them. What was the circular move, and which object do you recover first?

1469. On search indexer, the first response was: cordoned every NotReady node. Result: you have cordoned the whole cluster and the control plane cannot place replacements. The underlying fact: the nodes were NotReady because CoreDNS was pending on them. What was the circular move, and which object do you recover first?

1470. On webhook receiver, the first response was: cordoned every NotReady node. Result: you have cordoned the whole cluster and the control plane cannot place replacements. The underlying fact: the nodes were NotReady because CoreDNS was pending on them. What was the circular move, and which object do you recover first?

1471. On report exporter, the first response was: cordoned every NotReady node. Result: you have cordoned the whole cluster and the control plane cannot place replacements. The underlying fact: the nodes were NotReady because CoreDNS was pending on them. What was the circular move, and which object do you recover first?

1472. On auth gateway, the first response was: cordoned every NotReady node. Result: you have cordoned the whole cluster and the control plane cannot place replacements. The underlying fact: the nodes were NotReady because CoreDNS was pending on them. What was the circular move, and which object do you recover first?

1473. On image resizer, the first response was: cordoned every NotReady node. Result: you have cordoned the whole cluster and the control plane cannot place replacements. The underlying fact: the nodes were NotReady because CoreDNS was pending on them. What was the circular move, and which object do you recover first?

1474. On billing consumer, the first response was: cordoned every NotReady node. Result: you have cordoned the whole cluster and the control plane cannot place replacements. The underlying fact: the nodes were NotReady because CoreDNS was pending on them. What was the circular move, and which object do you recover first?

1475. On notification sender, the first response was: cordoned every NotReady node. Result: you have cordoned the whole cluster and the control plane cannot place replacements. The underlying fact: the nodes were NotReady because CoreDNS was pending on them. What was the circular move, and which object do you recover first?

1476. On checkout API, the first response was: removed the PDB. Result: a voluntary drain now takes the service to zero. The underlying fact: the drain was blocked because minAvailable equaled replicas. What budget matches a three-replica Deployment that must keep two?

1477. On invoice worker, the first response was: removed the PDB. Result: a voluntary drain now takes the service to zero. The underlying fact: the drain was blocked because minAvailable equaled replicas. What budget matches a three-replica Deployment that must keep two?

1478. On session service, the first response was: removed the PDB. Result: a voluntary drain now takes the service to zero. The underlying fact: the drain was blocked because minAvailable equaled replicas. What budget matches a three-replica Deployment that must keep two?

1479. On search indexer, the first response was: removed the PDB. Result: a voluntary drain now takes the service to zero. The underlying fact: the drain was blocked because minAvailable equaled replicas. What budget matches a three-replica Deployment that must keep two?

1480. On webhook receiver, the first response was: removed the PDB. Result: a voluntary drain now takes the service to zero. The underlying fact: the drain was blocked because minAvailable equaled replicas. What budget matches a three-replica Deployment that must keep two?

1481. On report exporter, the first response was: removed the PDB. Result: a voluntary drain now takes the service to zero. The underlying fact: the drain was blocked because minAvailable equaled replicas. What budget matches a three-replica Deployment that must keep two?

1482. On auth gateway, the first response was: removed the PDB. Result: a voluntary drain now takes the service to zero. The underlying fact: the drain was blocked because minAvailable equaled replicas. What budget matches a three-replica Deployment that must keep two?

1483. On image resizer, the first response was: removed the PDB. Result: a voluntary drain now takes the service to zero. The underlying fact: the drain was blocked because minAvailable equaled replicas. What budget matches a three-replica Deployment that must keep two?

1484. On billing consumer, the first response was: removed the PDB. Result: a voluntary drain now takes the service to zero. The underlying fact: the drain was blocked because minAvailable equaled replicas. What budget matches a three-replica Deployment that must keep two?

1485. On notification sender, the first response was: removed the PDB. Result: a voluntary drain now takes the service to zero. The underlying fact: the drain was blocked because minAvailable equaled replicas. What budget matches a three-replica Deployment that must keep two?

## Docker — failed fixes

1486. On checkout API, the first response was: ran docker system prune -a on a live node. Result: running containers kept their mounts but the next restart could not find the image, and build cache was destroyed. The underlying fact: the disk was full of json-file logs. What should you have rotated, and what prune flags are unsafe on a shared builder versus a laptop?

1487. On invoice worker, the first response was: ran docker system prune -a on a live node. Result: running containers kept their mounts but the next restart could not find the image, and build cache was destroyed. The underlying fact: the disk was full of json-file logs. What should you have rotated, and what prune flags are unsafe on a shared builder versus a laptop?

1488. On session service, the first response was: ran docker system prune -a on a live node. Result: running containers kept their mounts but the next restart could not find the image, and build cache was destroyed. The underlying fact: the disk was full of json-file logs. What should you have rotated, and what prune flags are unsafe on a shared builder versus a laptop?

1489. On search indexer, the first response was: ran docker system prune -a on a live node. Result: running containers kept their mounts but the next restart could not find the image, and build cache was destroyed. The underlying fact: the disk was full of json-file logs. What should you have rotated, and what prune flags are unsafe on a shared builder versus a laptop?

1490. On webhook receiver, the first response was: ran docker system prune -a on a live node. Result: running containers kept their mounts but the next restart could not find the image, and build cache was destroyed. The underlying fact: the disk was full of json-file logs. What should you have rotated, and what prune flags are unsafe on a shared builder versus a laptop?

1491. On report exporter, the first response was: ran docker system prune -a on a live node. Result: running containers kept their mounts but the next restart could not find the image, and build cache was destroyed. The underlying fact: the disk was full of json-file logs. What should you have rotated, and what prune flags are unsafe on a shared builder versus a laptop?

1492. On auth gateway, the first response was: ran docker system prune -a on a live node. Result: running containers kept their mounts but the next restart could not find the image, and build cache was destroyed. The underlying fact: the disk was full of json-file logs. What should you have rotated, and what prune flags are unsafe on a shared builder versus a laptop?

1493. On image resizer, the first response was: ran docker system prune -a on a live node. Result: running containers kept their mounts but the next restart could not find the image, and build cache was destroyed. The underlying fact: the disk was full of json-file logs. What should you have rotated, and what prune flags are unsafe on a shared builder versus a laptop?

1494. On billing consumer, the first response was: ran docker system prune -a on a live node. Result: running containers kept their mounts but the next restart could not find the image, and build cache was destroyed. The underlying fact: the disk was full of json-file logs. What should you have rotated, and what prune flags are unsafe on a shared builder versus a laptop?

1495. On notification sender, the first response was: ran docker system prune -a on a live node. Result: running containers kept their mounts but the next restart could not find the image, and build cache was destroyed. The underlying fact: the disk was full of json-file logs. What should you have rotated, and what prune flags are unsafe on a shared builder versus a laptop?

1496. On checkout API, the first response was: added --restart always to a migrate container. Result: the migration runs forever and keeps taking locks. The underlying fact: the migration exited 1 on a SQL error. Why is a restart policy the wrong response to a failed migration?

1497. On invoice worker, the first response was: added --restart always to a migrate container. Result: the migration runs forever and keeps taking locks. The underlying fact: the migration exited 1 on a SQL error. Why is a restart policy the wrong response to a failed migration?

1498. On session service, the first response was: added --restart always to a migrate container. Result: the migration runs forever and keeps taking locks. The underlying fact: the migration exited 1 on a SQL error. Why is a restart policy the wrong response to a failed migration?

1499. On search indexer, the first response was: added --restart always to a migrate container. Result: the migration runs forever and keeps taking locks. The underlying fact: the migration exited 1 on a SQL error. Why is a restart policy the wrong response to a failed migration?

1500. On webhook receiver, the first response was: added --restart always to a migrate container. Result: the migration runs forever and keeps taking locks. The underlying fact: the migration exited 1 on a SQL error. Why is a restart policy the wrong response to a failed migration?

1501. On report exporter, the first response was: added --restart always to a migrate container. Result: the migration runs forever and keeps taking locks. The underlying fact: the migration exited 1 on a SQL error. Why is a restart policy the wrong response to a failed migration?

1502. On auth gateway, the first response was: added --restart always to a migrate container. Result: the migration runs forever and keeps taking locks. The underlying fact: the migration exited 1 on a SQL error. Why is a restart policy the wrong response to a failed migration?

1503. On image resizer, the first response was: added --restart always to a migrate container. Result: the migration runs forever and keeps taking locks. The underlying fact: the migration exited 1 on a SQL error. Why is a restart policy the wrong response to a failed migration?

1504. On billing consumer, the first response was: added --restart always to a migrate container. Result: the migration runs forever and keeps taking locks. The underlying fact: the migration exited 1 on a SQL error. Why is a restart policy the wrong response to a failed migration?

1505. On notification sender, the first response was: added --restart always to a migrate container. Result: the migration runs forever and keeps taking locks. The underlying fact: the migration exited 1 on a SQL error. Why is a restart policy the wrong response to a failed migration?

1506. On checkout API, the first response was: published the database port on 0.0.0.0. Result: the database is reachable from the LAN. The underlying fact: the API container could not resolve the database name. What network change was actually required, and what exposure did you add?

1507. On invoice worker, the first response was: published the database port on 0.0.0.0. Result: the database is reachable from the LAN. The underlying fact: the API container could not resolve the database name. What network change was actually required, and what exposure did you add?

1508. On session service, the first response was: published the database port on 0.0.0.0. Result: the database is reachable from the LAN. The underlying fact: the API container could not resolve the database name. What network change was actually required, and what exposure did you add?

1509. On search indexer, the first response was: published the database port on 0.0.0.0. Result: the database is reachable from the LAN. The underlying fact: the API container could not resolve the database name. What network change was actually required, and what exposure did you add?

1510. On webhook receiver, the first response was: published the database port on 0.0.0.0. Result: the database is reachable from the LAN. The underlying fact: the API container could not resolve the database name. What network change was actually required, and what exposure did you add?

1511. On report exporter, the first response was: published the database port on 0.0.0.0. Result: the database is reachable from the LAN. The underlying fact: the API container could not resolve the database name. What network change was actually required, and what exposure did you add?

1512. On auth gateway, the first response was: published the database port on 0.0.0.0. Result: the database is reachable from the LAN. The underlying fact: the API container could not resolve the database name. What network change was actually required, and what exposure did you add?

1513. On image resizer, the first response was: published the database port on 0.0.0.0. Result: the database is reachable from the LAN. The underlying fact: the API container could not resolve the database name. What network change was actually required, and what exposure did you add?

1514. On billing consumer, the first response was: published the database port on 0.0.0.0. Result: the database is reachable from the LAN. The underlying fact: the API container could not resolve the database name. What network change was actually required, and what exposure did you add?

1515. On notification sender, the first response was: published the database port on 0.0.0.0. Result: the database is reachable from the LAN. The underlying fact: the API container could not resolve the database name. What network change was actually required, and what exposure did you add?

1516. On checkout API, the first response was: switched the final stage to ubuntu and installed curl. Result: the image is large again and the CVE set is back. The underlying fact: the probe needed a shell in a distroless image. How do you probe without putting a package manager in the runtime image?

1517. On invoice worker, the first response was: switched the final stage to ubuntu and installed curl. Result: the image is large again and the CVE set is back. The underlying fact: the probe needed a shell in a distroless image. How do you probe without putting a package manager in the runtime image?

1518. On session service, the first response was: switched the final stage to ubuntu and installed curl. Result: the image is large again and the CVE set is back. The underlying fact: the probe needed a shell in a distroless image. How do you probe without putting a package manager in the runtime image?

1519. On search indexer, the first response was: switched the final stage to ubuntu and installed curl. Result: the image is large again and the CVE set is back. The underlying fact: the probe needed a shell in a distroless image. How do you probe without putting a package manager in the runtime image?

1520. On webhook receiver, the first response was: switched the final stage to ubuntu and installed curl. Result: the image is large again and the CVE set is back. The underlying fact: the probe needed a shell in a distroless image. How do you probe without putting a package manager in the runtime image?

1521. On report exporter, the first response was: switched the final stage to ubuntu and installed curl. Result: the image is large again and the CVE set is back. The underlying fact: the probe needed a shell in a distroless image. How do you probe without putting a package manager in the runtime image?

1522. On auth gateway, the first response was: switched the final stage to ubuntu and installed curl. Result: the image is large again and the CVE set is back. The underlying fact: the probe needed a shell in a distroless image. How do you probe without putting a package manager in the runtime image?

1523. On image resizer, the first response was: switched the final stage to ubuntu and installed curl. Result: the image is large again and the CVE set is back. The underlying fact: the probe needed a shell in a distroless image. How do you probe without putting a package manager in the runtime image?

1524. On billing consumer, the first response was: switched the final stage to ubuntu and installed curl. Result: the image is large again and the CVE set is back. The underlying fact: the probe needed a shell in a distroless image. How do you probe without putting a package manager in the runtime image?

1525. On notification sender, the first response was: switched the final stage to ubuntu and installed curl. Result: the image is large again and the CVE set is back. The underlying fact: the probe needed a shell in a distroless image. How do you probe without putting a package manager in the runtime image?

## Kubernetes — local clusters and managed clouds

1526. On kind: a LoadBalancer Service stays Pending. Why (kind has no cloud controller unless you add one; port mapping on the kind node is a different mechanism)? What do you tell someone who compares this to EKS or GKE?

1527. On minikube: the ingress addon and a second ingress controller both claim port 80. Why (you are running two controllers and one of them is the addon)? What do you tell someone who compares this to EKS or GKE?

1528. On k3d: images built on the host are invisible inside the cluster. Why (the cluster has its own containerd; you must import or push to a registry it can pull)? What do you tell someone who compares this to EKS or GKE?

1529. On Docker Desktop Kubernetes: the docker CLI and the cluster runtime do not share images the way people assume. Why (build and load into the cluster's runtime explicitly)? What do you tell someone who compares this to EKS or GKE?

1530. On a single-node kind cluster: pod anti-affinity on hostname cannot place two replicas. Why (the constraint is stronger than the cluster)? What do you tell someone who compares this to EKS or GKE?

1531. On minikube tunnel: a LoadBalancer address exists only while the tunnel process lives. Why (that address is not a cloud load balancer)? What do you tell someone who compares this to EKS or GKE?

1532. On EKS: the node IAM role can pull from ECR but the pod still gets ImagePullBackOff on a private GHCR image. Why (the node role is not a credential for every registry)? What did the cluster abstraction hide?

1533. On EKS: IRSA is annotated on the ServiceAccount and the SDK still uses the node role. Why (the app has to use a token-file credentials chain; the annotation alone does not swap credentials inside an old SDK)? What did the cluster abstraction hide?

1534. On GKE: Workload Identity is on and the pod uses the node pool's default service account in GCP. Why (the Kubernetes ServiceAccount was not bound to the Google service account)? What did the cluster abstraction hide?

1535. On GKE: Autopilot rejects a pod that sets a privileged sidecar. Why (the mode is an admission policy, not just a billing plan)? What did the cluster abstraction hide?

1536. On AKS: the pod uses a user-assigned identity that is attached to the VMSS and not to the pod identity add-on. Why (node identity and workload identity are different principals)? What did the cluster abstraction hide?

1537. On AKS: Azure CNI overlay plus a NetworkPolicy provider that was not installed. Why (the policy objects are inert)? What did the cluster abstraction hide?

1538. On a managed control plane: you cannot SSH to etcd to compact it. Why (you use the cloud API and you still alert on etcd size)? What did the cluster abstraction hide?

1539. On a managed node pool: you patched a node by hand and the pool replace wiped it. Why (node pools are cattle; the change belongs in the pool spec or in a DaemonSet)? What did the cluster abstraction hide?

## Docker to Kubernetes — translation drills

1540. The checkout API runs today from Compose using depends_on. What is the Kubernetes replacement (init container or a probe, not a Kubernetes equivalent of depends_on)? What incident do you get if you translate it literally?

1541. The billing consumer runs today from Compose using depends_on. What is the Kubernetes replacement (init container or a probe, not a Kubernetes equivalent of depends_on)? What incident do you get if you translate it literally?

1542. The auth gateway runs today from Compose using depends_on. What is the Kubernetes replacement (init container or a probe, not a Kubernetes equivalent of depends_on)? What incident do you get if you translate it literally?

1543. The catalog API runs today from Compose using depends_on. What is the Kubernetes replacement (init container or a probe, not a Kubernetes equivalent of depends_on)? What incident do you get if you translate it literally?

1544. The checkout API runs today from Compose using docker compose ports. What is the Kubernetes replacement (a Service plus containerPort, and the host port is not automatically the NodePort)? What incident do you get if you translate it literally?

1545. The billing consumer runs today from Compose using docker compose ports. What is the Kubernetes replacement (a Service plus containerPort, and the host port is not automatically the NodePort)? What incident do you get if you translate it literally?

1546. The auth gateway runs today from Compose using docker compose ports. What is the Kubernetes replacement (a Service plus containerPort, and the host port is not automatically the NodePort)? What incident do you get if you translate it literally?

1547. The catalog API runs today from Compose using docker compose ports. What is the Kubernetes replacement (a Service plus containerPort, and the host port is not automatically the NodePort)? What incident do you get if you translate it literally?

1548. The checkout API runs today from Compose using env_file. What is the Kubernetes replacement (a Secret or ConfigMap you have to create; Kubernetes will not read your .env)? What incident do you get if you translate it literally?

1549. The billing consumer runs today from Compose using env_file. What is the Kubernetes replacement (a Secret or ConfigMap you have to create; Kubernetes will not read your .env)? What incident do you get if you translate it literally?

1550. The auth gateway runs today from Compose using env_file. What is the Kubernetes replacement (a Secret or ConfigMap you have to create; Kubernetes will not read your .env)? What incident do you get if you translate it literally?

1551. The catalog API runs today from Compose using env_file. What is the Kubernetes replacement (a Secret or ConfigMap you have to create; Kubernetes will not read your .env)? What incident do you get if you translate it literally?

1552. The checkout API runs today from Compose using build: . What is the Kubernetes replacement (a registry image reference; the apiserver does not build)? What incident do you get if you translate it literally?

1553. The billing consumer runs today from Compose using build: . What is the Kubernetes replacement (a registry image reference; the apiserver does not build)? What incident do you get if you translate it literally?

1554. The auth gateway runs today from Compose using build: . What is the Kubernetes replacement (a registry image reference; the apiserver does not build)? What incident do you get if you translate it literally?

1555. The catalog API runs today from Compose using build: . What is the Kubernetes replacement (a registry image reference; the apiserver does not build)? What incident do you get if you translate it literally?

1556. The checkout API runs today from Compose using restart: always. What is the Kubernetes replacement (a controller's restartPolicy and replica count)? What incident do you get if you translate it literally?

1557. The billing consumer runs today from Compose using restart: always. What is the Kubernetes replacement (a controller's restartPolicy and replica count)? What incident do you get if you translate it literally?

1558. The auth gateway runs today from Compose using restart: always. What is the Kubernetes replacement (a controller's restartPolicy and replica count)? What incident do you get if you translate it literally?

1559. The catalog API runs today from Compose using restart: always. What is the Kubernetes replacement (a controller's restartPolicy and replica count)? What incident do you get if you translate it literally?

1560. The checkout API runs today from Compose using a named volume with the local driver. What is the Kubernetes replacement (a PVC and a StorageClass, and it will not be 'the same disk' on another node unless the class says so)? What incident do you get if you translate it literally?

1561. The billing consumer runs today from Compose using a named volume with the local driver. What is the Kubernetes replacement (a PVC and a StorageClass, and it will not be 'the same disk' on another node unless the class says so)? What incident do you get if you translate it literally?

1562. The auth gateway runs today from Compose using a named volume with the local driver. What is the Kubernetes replacement (a PVC and a StorageClass, and it will not be 'the same disk' on another node unless the class says so)? What incident do you get if you translate it literally?

1563. The catalog API runs today from Compose using a named volume with the local driver. What is the Kubernetes replacement (a PVC and a StorageClass, and it will not be 'the same disk' on another node unless the class says so)? What incident do you get if you translate it literally?

1564. The checkout API runs today from Compose using localhost between containers. What is the Kubernetes replacement (a Service DNS name)? What incident do you get if you translate it literally?

1565. The billing consumer runs today from Compose using localhost between containers. What is the Kubernetes replacement (a Service DNS name)? What incident do you get if you translate it literally?

1566. The auth gateway runs today from Compose using localhost between containers. What is the Kubernetes replacement (a Service DNS name)? What incident do you get if you translate it literally?

1567. The catalog API runs today from Compose using localhost between containers. What is the Kubernetes replacement (a Service DNS name)? What incident do you get if you translate it literally?

1568. The checkout API runs today from Compose using cap_add and privileged in compose. What is the Kubernetes replacement (a securityContext that Pod Security will reject in a restricted namespace)? What incident do you get if you translate it literally?

1569. The billing consumer runs today from Compose using cap_add and privileged in compose. What is the Kubernetes replacement (a securityContext that Pod Security will reject in a restricted namespace)? What incident do you get if you translate it literally?

1570. The auth gateway runs today from Compose using cap_add and privileged in compose. What is the Kubernetes replacement (a securityContext that Pod Security will reject in a restricted namespace)? What incident do you get if you translate it literally?

1571. The catalog API runs today from Compose using cap_add and privileged in compose. What is the Kubernetes replacement (a securityContext that Pod Security will reject in a restricted namespace)? What incident do you get if you translate it literally?

1572. The checkout API runs today from Compose using profiles for optional tools. What is the Kubernetes replacement (a separate Deployment or a debug namespace, not a compose profile)? What incident do you get if you translate it literally?

1573. The billing consumer runs today from Compose using profiles for optional tools. What is the Kubernetes replacement (a separate Deployment or a debug namespace, not a compose profile)? What incident do you get if you translate it literally?

1574. The auth gateway runs today from Compose using profiles for optional tools. What is the Kubernetes replacement (a separate Deployment or a debug namespace, not a compose profile)? What incident do you get if you translate it literally?

1575. The catalog API runs today from Compose using profiles for optional tools. What is the Kubernetes replacement (a separate Deployment or a debug namespace, not a compose profile)? What incident do you get if you translate it literally?

1576. The checkout API runs today from Compose using one compose file with prod and dev. What is the Kubernetes replacement (two namespaces or two overlays, with different resource and replica settings)? What incident do you get if you translate it literally?

1577. The billing consumer runs today from Compose using one compose file with prod and dev. What is the Kubernetes replacement (two namespaces or two overlays, with different resource and replica settings)? What incident do you get if you translate it literally?

1578. The auth gateway runs today from Compose using one compose file with prod and dev. What is the Kubernetes replacement (two namespaces or two overlays, with different resource and replica settings)? What incident do you get if you translate it literally?

1579. The catalog API runs today from Compose using one compose file with prod and dev. What is the Kubernetes replacement (two namespaces or two overlays, with different resource and replica settings)? What incident do you get if you translate it literally?

## On-call reads — what is the next command and why

1580. You are paged for the checkout API. kubectl get pods shows 0/1 Running and RESTARTS 0. That means it is not crashing; it is not ready. Why is the next check `describe the readiness probe and the endpoints` rather than a restart?

1581. You are paged for the invoice worker. kubectl get pods shows 0/1 Running and RESTARTS 0. That means it is not crashing; it is not ready. Why is the next check `describe the readiness probe and the endpoints` rather than a restart?

1582. You are paged for the auth gateway. kubectl get pods shows 0/1 Running and RESTARTS 0. That means it is not crashing; it is not ready. Why is the next check `describe the readiness probe and the endpoints` rather than a restart?

1583. You are paged for the catalog API. kubectl get pods shows 0/1 Running and RESTARTS 0. That means it is not crashing; it is not ready. Why is the next check `describe the readiness probe and the endpoints` rather than a restart?

1584. You are paged for the notification sender. kubectl get pods shows 0/1 Running and RESTARTS 0. That means it is not crashing; it is not ready. Why is the next check `describe the readiness probe and the endpoints` rather than a restart?

1585. You are paged for the checkout API. RESTARTS is 40 and STATUS is CrashLoopBackOff. That means the process is exiting. Why is the next check `logs --previous and lastState.terminated` rather than a restart?

1586. You are paged for the invoice worker. RESTARTS is 40 and STATUS is CrashLoopBackOff. That means the process is exiting. Why is the next check `logs --previous and lastState.terminated` rather than a restart?

1587. You are paged for the auth gateway. RESTARTS is 40 and STATUS is CrashLoopBackOff. That means the process is exiting. Why is the next check `logs --previous and lastState.terminated` rather than a restart?

1588. You are paged for the catalog API. RESTARTS is 40 and STATUS is CrashLoopBackOff. That means the process is exiting. Why is the next check `logs --previous and lastState.terminated` rather than a restart?

1589. You are paged for the notification sender. RESTARTS is 40 and STATUS is CrashLoopBackOff. That means the process is exiting. Why is the next check `logs --previous and lastState.terminated` rather than a restart?

1590. You are paged for the checkout API. STATUS is Pending and there are no events yet. That means the pod may not have been scheduled or the event TTL expired. Why is the next check `describe anyway and check quota and PVC` rather than a restart?

1591. You are paged for the invoice worker. STATUS is Pending and there are no events yet. That means the pod may not have been scheduled or the event TTL expired. Why is the next check `describe anyway and check quota and PVC` rather than a restart?

1592. You are paged for the auth gateway. STATUS is Pending and there are no events yet. That means the pod may not have been scheduled or the event TTL expired. Why is the next check `describe anyway and check quota and PVC` rather than a restart?

1593. You are paged for the catalog API. STATUS is Pending and there are no events yet. That means the pod may not have been scheduled or the event TTL expired. Why is the next check `describe anyway and check quota and PVC` rather than a restart?

1594. You are paged for the notification sender. STATUS is Pending and there are no events yet. That means the pod may not have been scheduled or the event TTL expired. Why is the next check `describe anyway and check quota and PVC` rather than a restart?

1595. You are paged for the checkout API. kubectl get endpoints shows <none>. That means no ready pod matches. Why is the next check `selector and Ready, in that order` rather than a restart?

1596. You are paged for the invoice worker. kubectl get endpoints shows <none>. That means no ready pod matches. Why is the next check `selector and Ready, in that order` rather than a restart?

1597. You are paged for the auth gateway. kubectl get endpoints shows <none>. That means no ready pod matches. Why is the next check `selector and Ready, in that order` rather than a restart?

1598. You are paged for the catalog API. kubectl get endpoints shows <none>. That means no ready pod matches. Why is the next check `selector and Ready, in that order` rather than a restart?

1599. You are paged for the notification sender. kubectl get endpoints shows <none>. That means no ready pod matches. Why is the next check `selector and Ready, in that order` rather than a restart?

1600. You are paged for the checkout API. kubectl top pod fails. That means metrics-server or auth, not the app. Why is the next check `do not conclude the app has no CPU` rather than a restart?

1601. You are paged for the invoice worker. kubectl top pod fails. That means metrics-server or auth, not the app. Why is the next check `do not conclude the app has no CPU` rather than a restart?

1602. You are paged for the auth gateway. kubectl top pod fails. That means metrics-server or auth, not the app. Why is the next check `do not conclude the app has no CPU` rather than a restart?

1603. You are paged for the catalog API. kubectl top pod fails. That means metrics-server or auth, not the app. Why is the next check `do not conclude the app has no CPU` rather than a restart?

1604. You are paged for the notification sender. kubectl top pod fails. That means metrics-server or auth, not the app. Why is the next check `do not conclude the app has no CPU` rather than a restart?

1605. You are paged for the checkout API. kubectl get hpa shows <unknown>. That means no metric. Why is the next check `requests and the metrics pipeline` rather than a restart?

1606. You are paged for the invoice worker. kubectl get hpa shows <unknown>. That means no metric. Why is the next check `requests and the metrics pipeline` rather than a restart?

1607. You are paged for the auth gateway. kubectl get hpa shows <unknown>. That means no metric. Why is the next check `requests and the metrics pipeline` rather than a restart?

1608. You are paged for the catalog API. kubectl get hpa shows <unknown>. That means no metric. Why is the next check `requests and the metrics pipeline` rather than a restart?

1609. You are paged for the notification sender. kubectl get hpa shows <unknown>. That means no metric. Why is the next check `requests and the metrics pipeline` rather than a restart?

1610. You are paged for the checkout API. a node is Ready,SchedulingDisabled. That means someone cordoned it. Why is the next check `see who, then decide whether to uncordon or keep it drained` rather than a restart?

1611. You are paged for the invoice worker. a node is Ready,SchedulingDisabled. That means someone cordoned it. Why is the next check `see who, then decide whether to uncordon or keep it drained` rather than a restart?

1612. You are paged for the auth gateway. a node is Ready,SchedulingDisabled. That means someone cordoned it. Why is the next check `see who, then decide whether to uncordon or keep it drained` rather than a restart?

1613. You are paged for the catalog API. a node is Ready,SchedulingDisabled. That means someone cordoned it. Why is the next check `see who, then decide whether to uncordon or keep it drained` rather than a restart?

1614. You are paged for the notification sender. a node is Ready,SchedulingDisabled. That means someone cordoned it. Why is the next check `see who, then decide whether to uncordon or keep it drained` rather than a restart?

1615. You are paged for the checkout API. a node is NotReady and pods are still listed. That means they may be terminated by the controller after the pod-eviction timeout. Why is the next check `do not start them by hand on another node without a controller` rather than a restart?

1616. You are paged for the invoice worker. a node is NotReady and pods are still listed. That means they may be terminated by the controller after the pod-eviction timeout. Why is the next check `do not start them by hand on another node without a controller` rather than a restart?

1617. You are paged for the auth gateway. a node is NotReady and pods are still listed. That means they may be terminated by the controller after the pod-eviction timeout. Why is the next check `do not start them by hand on another node without a controller` rather than a restart?

1618. You are paged for the catalog API. a node is NotReady and pods are still listed. That means they may be terminated by the controller after the pod-eviction timeout. Why is the next check `do not start them by hand on another node without a controller` rather than a restart?

1619. You are paged for the notification sender. a node is NotReady and pods are still listed. That means they may be terminated by the controller after the pod-eviction timeout. Why is the next check `do not start them by hand on another node without a controller` rather than a restart?

1620. You are paged for the checkout API. docker ps shows Up 2 seconds for the tenth time. That means a restart loop local to the daemon. Why is the next check `inspect State.Error and logs` rather than a restart?

1621. You are paged for the invoice worker. docker ps shows Up 2 seconds for the tenth time. That means a restart loop local to the daemon. Why is the next check `inspect State.Error and logs` rather than a restart?

1622. You are paged for the auth gateway. docker ps shows Up 2 seconds for the tenth time. That means a restart loop local to the daemon. Why is the next check `inspect State.Error and logs` rather than a restart?

1623. You are paged for the catalog API. docker ps shows Up 2 seconds for the tenth time. That means a restart loop local to the daemon. Why is the next check `inspect State.Error and logs` rather than a restart?

1624. You are paged for the notification sender. docker ps shows Up 2 seconds for the tenth time. That means a restart loop local to the daemon. Why is the next check `inspect State.Error and logs` rather than a restart?

1625. You are paged for the checkout API. docker stats memory is at the limit. That means throttle or imminent OOM. Why is the next check `the limit you set, not the host size` rather than a restart?

1626. You are paged for the invoice worker. docker stats memory is at the limit. That means throttle or imminent OOM. Why is the next check `the limit you set, not the host size` rather than a restart?

1627. You are paged for the auth gateway. docker stats memory is at the limit. That means throttle or imminent OOM. Why is the next check `the limit you set, not the host size` rather than a restart?

1628. You are paged for the catalog API. docker stats memory is at the limit. That means throttle or imminent OOM. Why is the next check `the limit you set, not the host size` rather than a restart?

1629. You are paged for the notification sender. docker stats memory is at the limit. That means throttle or imminent OOM. Why is the next check `the limit you set, not the host size` rather than a restart?

1630. You are paged for the checkout API. the Deployment condition ProgressDeadlineExceeded is True. That means the rollout gave up. Why is the next check `the new ReplicaSet's pods, not a cluster outage by default` rather than a restart?

1631. You are paged for the invoice worker. the Deployment condition ProgressDeadlineExceeded is True. That means the rollout gave up. Why is the next check `the new ReplicaSet's pods, not a cluster outage by default` rather than a restart?

1632. You are paged for the auth gateway. the Deployment condition ProgressDeadlineExceeded is True. That means the rollout gave up. Why is the next check `the new ReplicaSet's pods, not a cluster outage by default` rather than a restart?

1633. You are paged for the catalog API. the Deployment condition ProgressDeadlineExceeded is True. That means the rollout gave up. Why is the next check `the new ReplicaSet's pods, not a cluster outage by default` rather than a restart?

1634. You are paged for the notification sender. the Deployment condition ProgressDeadlineExceeded is True. That means the rollout gave up. Why is the next check `the new ReplicaSet's pods, not a cluster outage by default` rather than a restart?

1635. You are paged for the checkout API. PodReadyToStartContainers is False. That means the sandbox or the runtime is the problem. Why is the next check `CNI and containerd, before the app binary` rather than a restart?

1636. You are paged for the invoice worker. PodReadyToStartContainers is False. That means the sandbox or the runtime is the problem. Why is the next check `CNI and containerd, before the app binary` rather than a restart?

1637. You are paged for the auth gateway. PodReadyToStartContainers is False. That means the sandbox or the runtime is the problem. Why is the next check `CNI and containerd, before the app binary` rather than a restart?

1638. You are paged for the catalog API. PodReadyToStartContainers is False. That means the sandbox or the runtime is the problem. Why is the next check `CNI and containerd, before the app binary` rather than a restart?

1639. You are paged for the notification sender. PodReadyToStartContainers is False. That means the sandbox or the runtime is the problem. Why is the next check `CNI and containerd, before the app binary` rather than a restart?
