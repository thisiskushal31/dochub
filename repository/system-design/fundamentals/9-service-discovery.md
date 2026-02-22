# Service Discovery

## What it does

Helps **services find each other** in a distributed system by maintaining:

- **Registered** names, addresses, and ports.
- **Health checks** (e.g. HTTP endpoint) to verify a service is up.

Examples: Consul, etcd, Zookeeper. Consul and etcd also provide a **key-value store** for config and shared data.

---

## Use case

In microservices or multi-instance setups, instances come and go. Service discovery keeps clients updated on **who is available** and **where** to send requests, so you don’t hardcode host:port.
