# Core Docker and Kubernetes scenarios, worked

[← Scenario bank](./Docker_Kubernetes_Scenario_Bank.md) · [← Containerization deep dive](../README.md)

The [scenario bank](./Docker_Kubernetes_Scenario_Bank.md) is the numbered drill list (1,639). This file is the first coverage pass: the incident shapes those numbers repeat, written out so you can answer them instead of only reading them.

Every answer below uses the same loop:

1. Say what the status means. It is a layer, not a root cause.
2. Read evidence before you change anything.
3. Name the cause that fits that evidence.
4. Change the smallest thing that matches the cause.
5. Name the guard that would catch the same class next time.

Bank numbers in parentheses are the matching questions.

---

## Docker

### A fat image blows the rollout (bank 1–53)

A Go (or Java, or Node) Dockerfile that compiles and runs in one stage ships the compiler. The image is about a gigabyte. Every node pulls it during a rollout, the pull exceeds `progressDeadlineSeconds`, and the Deployment is marked failed even though the binary is fine.

Split the Dockerfile. The first stage is the toolchain. The final stage is a minimal base (`distroless`, a slim JRE, or `scratch` for a static binary) and contains only what the process executes: the binary, CA certificates if it calls TLS, and a passwd entry if it must not run as root.

```dockerfile
# syntax=docker/dockerfile:1
FROM golang:1.22 AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o /out/api ./cmd/api

FROM gcr.io/distroless/static-debian12:nonroot
COPY --from=build /out/api /api
USER nonroot:nonroot
ENTRYPOINT ["/api"]
```

Copy the module files before the rest of the tree so a source-only change does not rerun the download. Put `.git`, `.env`, host `node_modules`, and local state in `.dockerignore`. A secret passed as `ENV` or written by `RUN` and deleted in a later layer is still in the earlier layer and in `docker history`. Pass it as a BuildKit secret mount, which is not stored in a layer.

Pin the base by digest when you care that a rebuild tomorrow is the same bytes. A tag such as `ubuntu:latest` or `node:current` is not a contract. Deploy the image by digest too. `:latest` is allowed to move, so it cannot be a rollback target.

Guard: CI publishes one digest, the manifest records that digest, and the runtime image has no compiler (`docker history` or a scan that fails when `go` or `javac` is present).

### The container exits, and the exit code is the clue (bank 74–96)

A container stays up only while PID 1 stays in the foreground. A script that runs a command and finishes will exit 0, and Docker will look like it "crashed" if you expected a VM that idles.

| Exit | Usual meaning |
|---:|---|
| 0 | Process finished. Fine for a Job. Surprising for a server. |
| 1 | Application error. Read logs before you touch the cluster. |
| 126 | Not executable, or a mount option blocked it. |
| 127 | Command not found. Wrong binary, or a dynamic linker the base image does not have. |
| 137 | SIGKILL. Often the cgroup OOM killer. You cannot catch it. |
| 139 | Segfault. Application bug. |
| 143 | SIGTERM. Something stopped it: a probe, a rollout, `docker stop`. |

`docker stop` sends SIGTERM to PID 1 and waits (10 seconds by default), then SIGKILL. A shell-form `ENTRYPOINT` or a script that does not `exec` the app never forwards that signal, so Kubernetes waits out `terminationGracePeriodSeconds` and then kills in-flight work. Use the exec form, and `exec` the real process from any wrapper.

A shell as PID 1 also does not reap zombies. If the app cannot be PID 1, run a tiny init (`docker run --init`, or `tini`) and accept that the app is no longer PID 1.

Guard: a test that starts the container, sends SIGTERM, and asserts it exits before the grace period with requests drained.

### Memory limits and a lying `/proc/meminfo` (bank 97–113)

`--memory 512m` writes the cgroup v2 hard cap `memory.max`. Cross it and the kernel OOM-kills a process in that cgroup. The container exits 137. `--cpus` is different: it throttles, it does not kill. CPU shares are a relative weight and matter only when the CPU is contended.

No memory limit means one leak is the host's problem. The host OOM killer can take sshd before it takes your container. `--oom-kill-disable` makes that worse.

The trap: `/proc/meminfo` and `os.cpu_count()` describe the host, not the cgroup. A JVM or a runtime that sizes its heap from the host will request tens of gigabytes inside a 512Mi limit and die immediately. The limit has to be read from the cgroup (`memory.max`), or the runtime flag has to be set explicitly (`-Xmx`).

On cgroup v2 the files live under the container's scope: `memory.max`, `memory.high` (the soft reservation), `cpu.max`, `pids.max`. `pids.max` is what contains a fork bomb. Disk fill is usually `overlay2` or json-file logs with no rotation, not "Docker is huge." Rotate logs (`max-size`, `max-file`) before you `docker system prune -a` on a machine that is serving traffic.

Guard: set the limit, set the runtime's own heap below it, and alert on OOMKilled rather than on host memory alone.

### Data that died with the container (bank 114–127)

The image is immutable. The container's writable layer is part of that container. `docker rm` deletes the layer. Anything that must survive (a database directory, uploads) has to be a mount.

| Mount | Use | Do not use for |
|---|---|---|
| Named volume | Data that must outlive the container | A path you casually edit on the host as yourself |
| Bind mount | Live source in development | The only copy of production data |
| tmpfs | Secrets and scratch that must not hit disk | Anything needed after restart |

`docker rm` does not remove a named volume. `docker volume rm` and `docker compose down -v` do. A bind mount hides whatever was at that path in the image, including a `node_modules` tree the image build just created. A named volume mounted into a non-root container is often root-owned from the first run, so the app cannot write until `fsGroup` or an init step fixes ownership.

A local volume does not follow the container to another host. That is a node disk, not a network filesystem.

Guard: the data directory in the image is empty, and the only bytes you would miss are on a volume you can name.

### Containers that cannot find each other (bank 128–161)

On the default bridge, containers do not get DNS names for each other. A user-defined bridge does. The name to dial is the Compose service name or the container name on that network, never `localhost`. `localhost` inside a container is the container itself.

`-p 8080:80` publishes on the host. Another container reaches the service by network and port 80, not by the host's published port. A process that binds `127.0.0.1` inside the container accepts only loopback in that namespace, so the publish looks up and connections still fail. Bind `0.0.0.0` in the container if the port should be reachable from the bridge.

`--network host` removes the network namespace. You get host performance and host port conflicts, and you have given up isolation. `--network none` is loopback only, which is what you want for a job that should not phone home.

`depends_on` without a healthcheck only orders process start. Postgres can be "up" and still refusing connections. Wait for `service_healthy`, or retry in the client. Do not publish the database port on `0.0.0.0` to "let the API reach it." That exposes the database to the LAN. Put both on the Compose network and leave the database unpublished.

Guard: from the API container, `getent hosts db` returns the Compose DNS answer, and the database port is not on the host.

### Privileged, and the Docker socket (bank 162–176)

`--privileged` and a mounted `/var/run/docker.sock` each hand the container the host. A socket mount is enough on its own: the container can start a privileged sibling. `CAP_SYS_ADMIN` is close to privileged. Drop capabilities (`--cap-drop ALL` and add back the few you need), keep the default seccomp profile, set `no-new-privileges`, and run as a non-root `USER`.

A read-only root filesystem stops runtime tampering of the image layers. The app will then need a tmpfs for `/tmp`. None of these stop a kernel bug, and none of them matter if the Docker socket is mounted.

Guard: the runtime config has no privileged flag, no docker socket, and a non-root user. A scanner that only checks the image and not the run flags will miss the socket.

---

## Kubernetes

### Pending is a scheduling sentence (bank 177–235, drills 386–610)

`Pending` means the pod does not have a node yet, or it has one and has not started the sandbox. `kubectl describe pod` events are the diagnosis. Deleting the pod does nothing if a Deployment owns it: the controller writes the same spec back.

Common `FailedScheduling` sentences and the matching change:

| Event fragment | Change |
|---|---|
| insufficient cpu / memory | The **request** does not fit **allocatable**. Usage graphs are not an input. Lower an honest request, or add nodes. |
| untolerated taint | Tolerate the taint you mean (a dedicated pool), or stop trying to land on that node. Tolerating every taint puts app pods on control planes and on disk-pressure nodes. |
| didn't match node affinity/selector | The label does not exist. Fix the selector or the label. |
| volume node affinity conflict | The disk is in another zone. The pod has to be schedulable where the volume is. |
| topology spread / anti-affinity | The rule is stricter than the cluster. A required anti-affinity on hostname cannot place two pods on one kind node. |

Resource class matters. No requests means BestEffort, which schedules easily and is evicted first under pressure. A limit with no request is copied into the request. Setting request equal to limit on every container, including sidecars, marks the pod Guaranteed and fills the node with idle reservations.

Also not the scheduler: a ResourceQuota event, a LimitRange that injected a default request bigger than any node, or a PVC that is still Pending. Those show up on describe as well, and they are not fixed by adding a toleration.

Guard: requests match measured steady state plus headroom, and a capacity alert fires on unschedulable pods.

### CrashLoopBackOff is a wait, not a cause (bank 177–209, drills 611–760)

The process is exiting. The kubelet waits longer between restarts, from short delays up to several minutes. Read `lastState.terminated` (exit code and reason) and `kubectl logs POD --previous`. Current logs may be empty if this attempt has not printed yet.

| What you find | What it is |
|---|---|
| Exit 1 and a stack trace | The app. Config, env, dependency, bug. |
| Exit 127 | Command or image layout. |
| `OOMKilled`, exit 137 | Memory limit. |
| Liveness probe failed | The kubelet killed it. See the probe section before you "fix the crash." |
| `CreateContainerConfigError` | A Secret or ConfigMap key the spec names is missing, or the object is in another namespace. |

Raising replicas multiplies a bad spec. Ten pods will crash the same way. Roll back if this image is what users are hitting (`kubectl rollout undo deployment/NAME`) and keep the failing pod's logs.

Empty logs usually mean the process died before it logged: bad exec form, missing binary, or a crash in static init. `kubectl debug` with an ephemeral container is how you look around a distroless image that has no shell.

Guard: the deploy pipeline fails if the new ReplicaSet cannot become Ready, and the previous revision is still in history (`revisionHistoryLimit`).

### ImagePullBackOff is the registry, not the scheduler (bank 54–73 and pod lifecycle)

`ErrImagePull` is the first failure. `ImagePullBackOff` is the retry wait. The event text says which:

- manifest unknown: the tag or digest is wrong, or the image was never pushed.
- pull access denied: the node identity cannot read that registry. A `docker login` on a laptop proves nothing about containerd on the node.
- `toomanyrequests`: anonymous Docker Hub pulls. Mirror base images and authenticate the runtime.

`imagePullPolicy: Never` "fixes" a laptop that already has the image and breaks every new node. `imagePullSecrets` are per namespace. ECR tokens expire; a long rollout can start succeeding and later fail. Pin the deploy to the digest you built, and give the kubelet or the cloud identity pull rights on that repository only.

Guard: admission rejects `:latest` and unsigned or unpinned images, and a pull test runs as the node identity.

### Liveness restarted the fleet because the database blinked (bank 236–255)

This is the scenario behind a lot of "the pods just restarted" outages.

Liveness answers one question: is this process stuck in a way only a restart fixes? Readiness answers a different one: should this pod receive traffic? A startup probe holds the other two off until the process has booted, which is what a slow JVM needs. `initialDelaySeconds` is a guess; a startup probe with a real `failureThreshold` is a budget.

If `/health` runs a database query and the database is down for two minutes, every pod fails liveness, every pod restarts, and the outage outlasts the database. Readiness failing would have removed pods from the Service, which is also bad if every pod fails, but it would not have killed the processes. A liveness handler should be local: the event loop is making progress, the port accepts, a trivial in-process check returns.

Other probe misses that show up as restarts or as a stuck rollout:

- Probe port 80, process listens on 8080.
- HTTP probe against a TLS port, or the reverse.
- Exec probe uses a shell the distroless image does not contain. The probe fails closed and kills a healthy process.
- `timeoutSeconds` of 1 on a cold node. Spurious failures.
- Readiness always returns 200 if the process is up, so a wedged app stays in the endpoints.

Events name the probe. `kubectl describe pod` is enough to see which one is failing.

Guard: liveness does not call dependencies. Startup covers boot. Readiness is the traffic gate. A test starts the container with the dependency down and asserts it is not restarted.

### The rollout is stuck, and the old pods are fine (bank 236–255, drills 1211–1285)

`ProgressDeadlineExceeded` means the Deployment stopped waiting. It does not mean the cluster is down. Look at the new ReplicaSet's pods.

Usual blockers: the new pods are not Ready (probe, image pull, pending because `maxSurge` asked for capacity you do not have), or `maxUnavailable: 0` and `maxSurge: 0` which cannot move at all. A PDB of `minAvailable: 2` on a Deployment of 2 replicas also deadlocks a rollout that needs to take one pod down.

The old pods staying Ready is the strategy working. Do not delete the old ReplicaSet to unstick it. `kubectl rollout undo` returns to the previous pod template, including that revision's env and probes. It does not restore a ConfigMap you edited in place, because that edit was not a new revision. Put config that must roll back into the pod template (a new ConfigMap name, or a hash annotation) so undo has something to undo.

Guard: surge capacity is reserved, the deadline is longer than pull plus startup, and config changes create a new pod template.

### Running, not Ready, and the Service has no endpoints (bank 274–297)

`Running` means the process is up. `Ready` means it may take traffic. A Service only puts Ready pods into its EndpointSlice.

Empty endpoints, in order:

1. Selector does not match the pod labels. A typo here is silent: the Service exists, the pods exist, nothing connects them.
2. Pods are not Ready. Probe, or a readiness gate.
3. `targetPort` is not the port the process listens on. `containerPort` is documentary; `targetPort` is what kube-proxy uses.

`ClusterIP` is only inside the cluster. `NodePort` is on the node IPs, not on your laptop's localhost. `LoadBalancer` stays `Pending` forever on bare metal unless a controller allocates an address. `externalTrafficPolicy: Local` keeps the client source IP and stops sending to nodes that have no local pod.

`503` from an Ingress with an empty backend is the Ingress telling the truth. `404` from the controller means no rule matched host or path, and the app never saw the request. A TLS secret in the wrong namespace is a certificate name mismatch, not an app bug. Two controllers and no ingress class means one of them, or neither, has the route.

Short DNS names search the local namespace. `http://api` from namespace `edge` does not find `api` in `payments`. CoreDNS down looks like every application breaking at once. A pod with `dnsPolicy: Default` uses the node's resolver and will not see Service names.

Guard: an alert on a Service whose ready endpoints are zero, and a probe path that matches the binary you shipped.

### NetworkPolicy dropped the traffic the Service still lists (bank 298–305)

Endpoints can be healthy while every connection times out. Policies select pods, not Services. A default-deny ingress with an allow rule on the wrong labels is this symptom.

Egress default-deny without DNS (UDP and TCP 53 to the DNS pods) looks like "bad hostname." Allowing the ingress-controller namespace does not allow pod-to-pod calls from the app namespace. The policy port is the pod port, not the Service port. If the CNI does not implement NetworkPolicy, the objects apply and enforce nothing. Test a deny before you trust the YAML.

A curl pod in the same namespace is a different identity from a client in another namespace. A test that only curls from inside the namespace will miss the rule you forgot.

Guard: one deny test and one allow test from the real client namespace, in CI, against a cluster whose CNI enforces policy.

### The volume is the thing that is Pending (bank 306–319)

A pod stuck in `ContainerCreating` after it has been scheduled is often storage, not the image. Describe the PVC and the pod events.

- PVC `Pending`: no StorageClass, the provisioner is down, or you asked for `ReadWriteMany` from a class that only offers `ReadWriteOnce`.
- `ReadWriteOnce` already attached: a second pod cannot mount it. A Deployment of many replicas all naming one RWO claim will not work. That pattern is a StatefulSet `volumeClaimTemplates` (one disk per ordinal) or a storage class that actually provides RWX.
- Zone conflict: the PV is pinned to zone A and the pod's rules only allow zone B.
- `hostPath` is a directory on one node. The next node has a different directory or an empty one. It is not a PVC.
- `emptyDir` with no `sizeLimit` can fill the node, trip `DiskPressure`, and get unrelated pods evicted.
- Reclaim `Delete` means deleting the PVC deletes the cloud disk. `Retain` leaves the PV `Released`, and it will not bind to a new claim until someone recycles it.
- The volume is root-owned and the container is non-root. Set `fsGroup`, or the process cannot write. `subPath` mounts do not get the same ownership treatment.

Attach succeeding and mount failing are different events. Look at which one the kubelet logged.

Guard: access mode and topology are part of the scheduling design, and a size limit exists on every emptyDir that can grow.

### The Secret did not move when the app did (bank 320–329)

`CreateContainerConfigError` on a missing key is admission of the container, not an application exception. The name and the key must exist in the same namespace. A reference does not follow a Deployment to a new namespace.

Env vars are copied at start. Editing a ConfigMap does not restart the process, and a process that already read the env will not see the file update either unless it re-reads. An immutable ConfigMap cannot be edited; that is why you make a new object and point the pod template at it.

A secret baked into the image is in the registry and on every node that pulled. Mounting a newer Secret does not scrub the layer. Rotate the credential. A secret in an env var shows up in the process environment and in crash dumps; a mounted file is the better default when the app can read a file.

Guard: the namespace is created with its config, and git never holds raw Secret `data`.

### HPA says `<unknown>` (bank 345–354)

A CPU utilization target is a percentage of the **request**. No request, no percentage, and the HPA shows `<unknown>` with `FailedGetResourceMetric`. The same display happens when metrics-server is absent or cannot be reached. `kubectl top` failing is that pipeline, not proof the app is idle.

If the HPA does add replicas and they stay `Pending`, pod autoscaling worked and node autoscaling, quota, or affinity did not. Scaling on CPU when the scarce resource is a database pool adds pods that all wait on the pool. `minReplicas == maxReplicas` is a no-op. HPA and VPA must not own the same resource. HPA does not scale a DaemonSet by replica count.

Scale-down is a SIGTERM. If the process ignores it, in-flight work dies. That is the same PID 1 issue as Docker, plus `terminationGracePeriodSeconds` and a `preStop` hook long enough to drain.

Guard: every scaled container has the request the metric is a percentage of, and the metric is the thing that is actually scarce.

### The drain hangs on a budget of zero (bank 256–273, 355–366)

`kubectl drain` is voluntary disruption. A PodDisruptionBudget with `minAvailable` equal to the replica count allows zero disruptions, so the drain waits. For three replicas that must keep two, `minAvailable: 2` (or `maxUnavailable: 1`) matches a rollout with `maxUnavailable: 1`. A single replica cannot satisfy a budget that requires one to stay up. Scale up, or do not pretend there is a spare.

Drain also stops on pods that would lose an emptyDir you have not confirmed, and DaemonSet pods are not evicted unless you say so. `--force` and deleting pods by hand skip the budget. A node reboot skips it too.

`Cordon` stops new pods and leaves the current ones. That is not a restart. `NotReady` means heartbeats stopped (kubelet, API connectivity, or the node is wedged). Workloads may keep serving while the node looks dead, until the eviction timeout. Do not cordon every NotReady node as a first move; if the reason is cluster DNS or the API, you can cordon yourself out of a recovery.

`DiskPressure`, `MemoryPressure`, and `PIDPressure` are the kubelet protecting the node. Eviction order prefers pods above their requests and BestEffort pods. One log volume without a size limit is enough to evict other people's pods.

Guard: every budget is strictly looser than the replica count, and a drain is how nodes are emptied before a reboot or an upgrade.

### Requests, limits, and who gets killed (bank 210–235, 97–113)

| | Scheduler | Kernel |
|---|---|---|
| CPU request | Reserves allocatable CPU | Sets the share under contention |
| CPU limit | | Throttles. Does not kill. |
| Memory request | Reserves allocatable memory | Under node pressure, usage above this request is evicted first |
| Memory limit | If you set only a limit, it becomes the request | OOM kill at the cap. Exit 137. |

Raising a memory limit to 64Gi so a leak "has room" lets one pod kill the node, and it hides the leak. Fix the leak or cap it and alert on OOMKilled.

In-place resize exists in current Kubernetes, so some request and limit changes no longer need a new pod. The meaning of the four numbers does not change.

### Control plane down is not the same as the site down (bank 367–378)

Pods keep serving when the API is unreachable, until they need something from it. Do not restart every workload because `kubectl` timed out.

etcd without quorum makes the API read-only or unavailable. Restore a member you still trust. Do not wipe the data directory, and do not restore a snapshot into a cluster that has kept making changes; stop writers first. Quota-full etcd fails writes until compact and defrag. Managed clouds hide the process and still need a size alert.

Upgrade the control plane before kubelets, one minor at a time. A kubelet client certificate expiring looks like `NotReady` while containers may still be running. A bad static-pod manifest has no Deployment rollback; the file on disk is the source.

Guard: certificate expiry and etcd db size are alerts, and upgrades have a written skew order.

### Compose translated literally (bank 1540–1579)

| Compose | Kubernetes |
|---|---|
| `build: .` | A registry image. The apiserver does not build. |
| `depends_on` | A probe or an init container, plus client retries. There is no depends_on. |
| `ports:` | A Service and the process port. The host port is not automatically a NodePort you can rely on. |
| `env_file` | A Secret or ConfigMap in the same namespace. |
| `localhost` between services | Service DNS. |
| Named local volume | A PVC. It is not the same disk on another node unless the StorageClass says so. |
| `restart: always` on a migration | A Job that exits 0, not a Deployment that restarts a failed SQL script forever. |
| `privileged` | A `securityContext` that a restricted Pod Security namespace will reject. |

Local kind, minikube, and k3d do not allocate a cloud load balancer. An image built by the host Docker daemon is not in the cluster's containerd until you load it or push it to a registry the cluster pulls. A managed node pool will wipe a package you ssh'd in and installed; that change belongs in the image, a DaemonSet, or the pool spec.

---

## What to drill next

The bank sections after item 385 repeat the shapes above on different service names, namespaces, and wrong first fixes (delete the pod, raise replicas, turn liveness off, mount the docker socket, publish the database). Use them once the matching section in this file feels obvious. If an answer depends on the app being called "checkout," it is not an answer yet.

## References

- [Debug Pods](https://kubernetes.io/docs/tasks/debug/debug-application/debug-pods/)
- [Debug Services](https://kubernetes.io/docs/tasks/debug/debug-application/debug-service/)
- [Pod lifecycle](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/)
- [Configure liveness, readiness, and startup probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)
- [Horizontal Pod Autoscaler](https://kubernetes.io/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/)
- [Resource management](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/)
- [Network policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/)
- [Disruptions](https://kubernetes.io/docs/concepts/workloads/pods/disruptions/)
- [Dockerfile best practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Docker storage overview](https://docs.docker.com/engine/storage/)
- [Docker network drivers](https://docs.docker.com/engine/network/)
- Docker notes in this repo: [Runtimes/Docker](../Runtimes/Docker/README.md)
- Kubernetes notes in this repo: [Orchestration/Kubernetes](../Orchestration/Kubernetes/README.md)
