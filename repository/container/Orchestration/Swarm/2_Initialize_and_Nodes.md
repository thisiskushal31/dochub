# Initialize a Swarm and Add Nodes

[← Back to Docker Swarm deep dive](./README.md)

How to initialize a swarm, add worker and manager nodes, manage nodes, and leave the swarm. Links at the end are for further reading only.

## Initialize the swarm

On the first machine: `docker swarm init`. Optionally set the address other nodes will use: `docker swarm init --advertise-addr 192.168.1.100`. The command prints join tokens for workers and managers.

## Add worker nodes

On each worker machine: `docker swarm join --token <worker-token> <manager-ip>:2377`. Get the token from a manager with `docker swarm join-token worker`.

## Add manager nodes (HA)

Use 3 or 5 managers for quorum. On the new machine: `docker swarm join --token <manager-token> <manager-ip>:2377`. Get the token with `docker swarm join-token manager`.

## List and manage nodes

From a manager: `docker node ls`. Drain a node: `docker node update --availability drain <node-id>`. Activate again: `docker node update --availability active <node-id>`. Promote/demote: `docker node promote <node-id>`, `docker node demote <node-id>`.

## Leave the swarm

On a node: `docker swarm leave`. Managers may need `docker swarm leave --force` in some cases. Remove a departed node from the list: from a manager, `docker node rm <node-id>`.

## References

- [Initialize a swarm](https://docs.docker.com/engine/swarm/init/)
- [Add nodes to a swarm](https://docs.docker.com/engine/swarm/join-nodes/)

[← Back to Docker Swarm deep dive](./README.md)
