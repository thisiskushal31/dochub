# Podman Concepts

[← Back to Podman deep dive](./README.md)

Core Podman concepts: containers, images, storage, registries, and pods. Links at the end are for further reading only.

## Containers

A container is a running instance of an image. Create with `podman run`. No daemon; each container has its own filesystem and network (unless in a pod).

```bash
podman run -d -p 8080:80 --name web nginx:alpine
podman ps
podman exec -it web sh
podman stop web && podman rm web
```

## Images

OCI images: pull with `podman pull`, build with `podman build`, list with `podman images`. Same format as Docker.

## Storage

Root: `/var/lib/containers/storage`. Rootless: under user home. `podman system reset` removes all data (destructive).

## Registries

`podman login docker.io` or `podman login quay.io`. Push with `podman push`. Config in containersregistries.conf and auth in auth.json.

## Pods

A pod is a group of containers sharing one network namespace (like Kubernetes pods). They communicate over localhost.

```bash
podman pod create --name mypod -p 8080:80
podman run -d --pod mypod --name web nginx:alpine
podman pod ps
```

See [5. Pods and rootless](./5-pods-and-rootless.md) for more.

## References

- [Podman documentation](https://docs.podman.io/)
- [Introduction to Podman](https://docs.podman.io/en/latest/Introduction.html)

[← Back to Podman deep dive](./README.md)
