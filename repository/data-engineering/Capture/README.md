# Capture

[← README](../README.md)

*(Stub — fill this layer when you write it.)*

How facts enter the platform. Extracts, dumps, and change streams are patterns; connectors are instances.

## Topic files

| # | Topic | Status |
|---|--------|--------|
| 1 | [Sources and extract](./1_Sources_And_Extract.md) | stub |
| 2 | [Change data](./2_Change_Data.md) | stub |
| 3 | [Delivery guarantees](./3_Delivery_Guarantees.md) | stub |

## Systems that implement this layer

One folder each, like Languages in the handbook — [Systems/](../Systems/README.md).

| System | Role here |
|--------|-----------|
| [Debezium](../Systems/Debezium/README.md) | Log-based change |
| [Airbyte](../Systems/Airbyte/README.md) | Extract / connectors |
| [Kafka](../Systems/Kafka/README.md) (Connect) | Capture *role* of a log — primary folder is Movement |

## Checklist before marking done (whole section)

- [ ] All topic files filled (no TBD)
- [ ] Examples of current tools are dated and replaceable
