# Database migrations in CI/CD pipelines

[← Back to CI/CD](./README.md)

Application binaries are easy to roll back. **Data and schema** are not. Continuous Delivery requires treating migrations as **versioned, automated, tested** steps in the same change stream as code — not “SSH and run SQL on Friday.”

Foundations: Fowler/Sadalage **evolutionary database design**; Fowler **parallel change** (expand / migrate / contract); blue-green DB caveat on [Fowler’s blue-green note](https://martinfowler.com/bliki/BlueGreenDeployment.html).

Data-store depth: [Databases-Deep-Dive](https://github.com/thisiskushal31/Databases-Deep-Dive). Pipeline overview: [1](./1_Pipelines_Build_Test_Deploy.md).

## Why migrations belong in the pipeline

| Manual SSH migrations | Pipeline-managed migrations |
|-----------------------|----------------------------|
| Ordering fights between engineers | Ordered scripts in version control |
| “Works on my bastion” | Same runner/job against each env |
| Easy to forget on rollback night | Job fails → deploy blocked |
| Credentials in shells/history | Secrets via CI secret store / cloud IAM |

Store migration scripts **with** the application (or in a dedicated DB repo for shared databases — Fowler’s evolutionary DB guidance for shared DB integration). Apply **only** through automation.

## Tool literacy (examples)

| Approach | Examples | Role |
|----------|----------|------|
| Dedicated migrators | **Flyway**, **Liquibase** | Versioned SQL/changelog apply; common in JVM and polyglot shops |
| Framework-native | Rails migrations, Django migrations, Alembic (SQLAlchemy), EF migrations | Same idea: ordered revisions next to code |
| Raw ordered SQL | Numbered files + wrapper job | Fine if discipline matches tools above |

Pick one system per schema; do not mix ad-hoc SQL with a migrator for the same DB.

## Job ordering

```text
build app + run migration tests
  → publish app artifact
  → (deploy) apply pending migrations with migration identity
  → roll out app version that expects the new schema
  → verify
```

Patterns:

- **Migrate-then-rollout** job in CD (common).  
- **Init container / Job** that runs migrator before new pods take traffic (Kubernetes).  
- **Failure = stop**: if migration fails, do not continue app rollout.

Never “deploy app that requires column X” before “add column X” unless expand/contract already made both versions safe.

## Expand / migrate / contract (parallel change)

Fowler’s **parallel change** (aka expand and contract) for backward-incompatible interface/schema changes:

1. **Expand** — add new structures; keep old ones working.  
2. **Migrate** — dual-write / backfill / move clients to the new shape (often the long phase).  
3. **Contract** — remove the old structures only when nothing depends on them.

Zero-downtime and blue-green/rolling/canary all need this when old and new app versions **overlap** in production ([3](./3_Deployment_Strategies.md)).

Example rename column (conceptual):

```text
expand:  ADD new_column; backfill; app writes both
migrate: app reads new_column
contract: stop writing old_column; DROP old_column  (later release)
```

Destructive one-shot renames break rollback and blue-green switches.

## Rollback limits

| Change type | Rollback reality |
|-------------|------------------|
| Additive (new nullable column) | App rollback usually OK |
| Expand/contract mid-migrate | Roll back **app**; keep expanded schema until safe |
| Destructive DROP / type change without expand | Often **no** clean rollback — restore from backup or roll forward |
| Data backfill bugs | May need compensating scripts |

**Rule:** design each migration so the previous app version still runs (expand) until you intentionally contract. Treat “down” migrations as optional and often unsafe in prod — many teams prefer forward fixes.

## Secrets and safety in CI

- Connection strings via secret store / OIDC to cloud DB IAM — **never** commit passwords.  
- Redact credentials from job logs.  
- Use least-privilege migrator roles (DDL where required; not `superuser` by habit).  
- Run migrations against **realistic** staging data volume when lock risk matters (long `ALTER` on huge tables).

Lock/timeout behavior is database-specific — validate in staging; see Databases Deep Dive for engine detail.

## Checklist

- [ ] Migrations in VCS, applied only by automation  
- [ ] CI tests migrations on ephemeral DB where feasible  
- [ ] Deploy ordering: migrate (compatible) → app rollout → verify  
- [ ] Failed migration blocks release  
- [ ] Zero-downtime changes use expand → migrate → contract  
- [ ] Known-good app digests remain compatible with current schema during rollback window  

## Pitfalls

| Pitfall | Better |
|---------|--------|
| Hotfix SQL as the real process | Pipeline job is the only prod path |
| Expand without ever contracting | Schema debt and confusion (Fowler warns unfinished parallel change) |
| Auto-rollback app after destructive migration | Plan roll-forward; restore strategy documented |
| One giant migration per quarter | Small evolutionary steps (Sadalage/Fowler) |

## Next

- Full delivery loop: [1](./1_Pipelines_Build_Test_Deploy.md)  
- Deploy overlap strategies: [3](./3_Deployment_Strategies.md)

## Further reading

- [Martin Fowler — Evolutionary Database Design](https://martinfowler.com/articles/evodb.html)  
- [Martin Fowler — Parallel Change](https://martinfowler.com/bliki/ParallelChange.html)  
- [Martin Fowler — Continuous Integration](https://martinfowler.com/articles/continuousIntegration.html) (DB + expand-contract notes)  
- [Martin Fowler — Blue Green Deployment](https://martinfowler.com/bliki/BlueGreenDeployment.html) (schema separation)  
- Flyway / Liquibase / your framework migration docs  
