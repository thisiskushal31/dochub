# Networking, Storage, and Secrets

[← Back to Docker Swarm deep dive](./README.md)

Overlay networks, volumes, secrets, and configs in swarm. Links at the end are for further reading only.

## Overlay networks

Create: `docker network create --driver overlay --attachable mynet`. Attach to a service: `docker service create --network mynet --name web nginx:alpine`. Containers on the same overlay resolve service names via DNS. Stacks get a default overlay; you can define more in the Compose file.

## Storage and volumes

Use named volumes with `--mount type=volume,target=/data,source=mydata`. Each replica on a different node gets its own volume instance; replicated services do not share one volume. For stateful single-replica services, use a named volume or external storage; use placement constraints to pin the task to a node if needed.

## Secrets

Create: `echo "secret" | docker secret create db_password -`. Use in a service: `docker service create --secret db_password --name api myapi:1.0`. The container sees the secret at `/run/secrets/db_password`. In Compose: top-level `secrets:` and `secrets:` on the service. Secrets are read-only; remove only when no service uses them.

## Configs

Non-sensitive files: `docker config create nginx_conf ./nginx.conf`, then `docker service create --config nginx_conf --name web nginx:alpine`. In Compose use `configs` top-level and on the service. Mounted read-only in the container.

## References

- [Swarm networking](https://docs.docker.com/engine/swarm/networking/)
- [Secrets](https://docs.docker.com/engine/swarm/secrets/)
- [Configs](https://docs.docker.com/engine/swarm/configs/)

[← Back to Docker Swarm deep dive](./README.md)
