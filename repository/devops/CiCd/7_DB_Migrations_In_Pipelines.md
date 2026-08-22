# Database migrations in CI/CD pipelines

[← Back to CI/CD](./README.md)

*(Content TBD — stub created August 2026)*

## Planned coverage

- Why migrations are a deploy step, not a manual ssh-and-run
- Tools entry: Flyway, Liquibase, framework-native (Rails, Django, Alembic)
- Expand/contract pattern for zero-downtime schema changes
- Rollback limits (backward-compatible migrations)
- Secrets and connection strings in CI — never in logs

## Cross-links

- Data depth: [Entry-Points/Data_Messaging_And_Cache.md](../Entry-Points/Data_Messaging_And_Cache.md) → Databases-Deep-Dive
- Pipeline overview: [1_Pipelines_Build_Test_Deploy.md](./1_Pipelines_Build_Test_Deploy.md)

## Checklist before marking done

- [ ] Job ordering: migrate before app rollout (or init container pattern)
- [ ] Failure mode: migration failed → block deploy
