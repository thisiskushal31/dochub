# BloodHound — install and first use

[← BloodHound](./README.md)

AD attack-path visualization (collectors + GUI/CE). **Lab / authorized targets only — never against systems you do not own.**

## Install

Follow current docs at [BloodHound docs](https://bloodhound.specterops.io/) (Community Edition / legacy). Install collector (SharpHound/AzureHound) **only** in lab AD.

## First lab use

1. Collect from lab domain with authorized account.
2. Ingest into BloodHound.
3. Mark owned nodes; study shortest paths to Domain Admin.
4. Fix paths as the blue team.

## For / not for

| For | Not for |
|-----|---------|
| AD path analysis in lab | Collecting from production AD without RoE |
