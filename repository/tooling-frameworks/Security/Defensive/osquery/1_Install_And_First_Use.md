# osquery — install and first use

[← osquery](./README.md)

Expose OS state as SQL tables (processes, users, listening ports, …). **Lab / your hosts only.**

## Install

| OS | Typical |
|----|---------|
| macOS | `brew install osquery` |
| Linux | Packages from [osquery.io](https://osquery.io/downloads) |

Check: `osqueryi --version`

## First lab use

```bash
osqueryi
```

Inside the shell:

```sql
SELECT pid, name, path FROM processes LIMIT 20;
SELECT * FROM listening_ports LIMIT 20;
```

Fleet mode (osqueryd + scheduled queries) is a separate ops deployment — start interactive in lab first.

## Related

- EDR role context → [Defensive-Ops/6](https://github.com/thisiskushal31/Security-Deep-Dive/blob/main/Defensive-Ops/6_Network_And_Endpoint_Detection.md)  
