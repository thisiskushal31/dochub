# Stacks and Compose

[← Back to Docker Swarm deep dive](./README.md)

Deploying multi-service apps with stacks and the Compose file format. Links at the end are for further reading only.

## What is a stack?

A **stack** is a set of services (and optionally configs/secrets) defined in a Compose file and deployed with `docker stack deploy`. All services are named `<stack_name>_<service_name>`.

## Compose file for swarm

Use Compose v3 or the Compose Spec. Key: **image** (required; no build in swarm), **deploy** (replicas, placement, update_config), **ports**, **environment**, **networks**, **configs**, **secrets**. Example:

```yaml
services:
  web:
    image: nginx:alpine
    deploy:
      replicas: 3
    ports:
      - "8080:80"
  db:
    image: postgres:15
    deploy:
      replicas: 1
    environment:
      POSTGRES_PASSWORD: secret
networks:
  default:
    driver: overlay
```

## Deploy and remove

`docker stack deploy -c docker-compose.yml mystack`. Then: `docker stack ls`, `docker stack services mystack`, `docker stack ps mystack`, `docker stack rm mystack`. Re-run deploy to apply file changes (rolling update per service).

## Limitations

No build in swarm; build images first. No host bind mounts for arbitrary paths; use configs, secrets, or named volumes. See Docker docs for full supported options.

## References

- [Deploy a stack to a swarm](https://docs.docker.com/engine/swarm/stack-deploy/)
- [Compose file deploy](https://docs.docker.com/compose/compose-file/deploy/)

[← Back to Docker Swarm deep dive](./README.md)
