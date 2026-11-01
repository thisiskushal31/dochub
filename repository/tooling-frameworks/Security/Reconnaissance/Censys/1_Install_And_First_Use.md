# Censys — install and first use

[← Censys](./README.md)

Search an internet-wide exposure index (hosts, certs, services). **Query only assets you own or are authorized to assess.**

## Install / access

1. Create an account at [censys.io](https://search.censys.io/) (tiers/API change over time).  
2. Prefer the web search UI for first labs.  
3. Optional CLI/SDK: follow current docs at [Censys documentation](https://docs.censys.com/) — do not hard-code deprecated package names from memory.

Store API keys in a secrets manager / env — never commit them.

## First lab use

1. Search for **your** domain or ASN (Autonomous System Number).  
2. Note unexpected ports / products.  
3. Triage with inventory (expected vs shadow IT) per [Reconnaissance/5](https://github.com/thisiskushal31/Security-Deep-Dive/blob/main/Reconnaissance/5_Internet_Exposure_And_ASM.md).

## Related

- [Shodan](../Shodan/README.md)  
- [Reconnaissance/5](https://github.com/thisiskushal31/Security-Deep-Dive/blob/main/Reconnaissance/5_Internet_Exposure_And_ASM.md)  
