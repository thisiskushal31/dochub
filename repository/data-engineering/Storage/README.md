# Storage

[← README](../README.md)

*(Stub — fill this layer when you write it.)*

Roles of stores along the path — landing, system of record, analytical, serving — not a catalog of file formats first.

## Topic files

| # | Topic | Status |
|---|--------|--------|
| 1 | [Roles of stores](./1_Roles_Of_Stores.md) | stub |
| 2 | [File, table, log](./2_File_Table_Log.md) | stub |
| 3 | [Analytical and serving stores](./3_Analytical_And_Serving_Stores.md) | stub |

## Systems that implement this layer (table-on-files)

Database *engines* are not here — [Databases-Deep-Dive](../../Databases-Deep-Dive/README.md).

| System | Role here |
|--------|-----------|
| [Iceberg](../Systems/Iceberg/README.md) | Table-on-files |
| [Delta](../Systems/Delta/README.md) | Table-on-files |
| [Hudi](../Systems/Hudi/README.md) | Table-on-files (upsert-oriented) |

Spark/Flink *process* tables; they are not the table. See Transformation systems.

## Checklist before marking done (whole section)

- [ ] All topic files filled (no TBD)
- [ ] Examples of current tools are dated and replaceable
