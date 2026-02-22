# Monolithic vs Microservices Architecture

## What they are

- **Monolithic** — One deployable unit: all functionality (UI, business logic, data access) in a single codebase and process. One deployment; one scaling unit.
- **Microservices** — Functionality split into **many small services**, each deployable and scalable independently. Services communicate via APIs or messaging.

## Why choose one over the other

- **Monolith** — Simpler to develop, deploy, and debug early; good for small teams and well-bounded products.
- **Microservices** — Independent deploy and scale per service; team ownership; technology diversity; better fit for large, evolving systems.

## Comparison

| Aspect | Monolithic | Microservices |
|--------|------------|---------------|
| **Deployment** | One artifact; all-or-nothing | Deploy services independently |
| **Scaling** | Scale the whole app | Scale only the services that need it |
| **Data** | Single DB (or few); shared schema | Each service often has its own DB; data ownership per service |
| **Complexity** | Lower ops; simpler initially | More services, networking, observability, eventual consistency |
| **Team** | One codebase; coordination in one place | Teams own services; need clear boundaries and contracts |

## Trade-offs

- **Monolith advantages:** Simple deployment, transactions across "modules," easier debugging in one process.
- **Monolith disadvantages:** Large codebase, scaling is coarse, one bug can bring down everything.
- **Microservices advantages:** Independent deploy and scale, team autonomy, technology choice per service.
- **Microservices disadvantages:** Distributed system complexity, network failures, data consistency and operational overhead.

**When to use:** Start with a **monolith** when the domain is unclear or the team is small; consider **microservices** when you need independent scaling, multiple teams, or clear bounded contexts. See [Microservices](8-microservices.md) for more.
