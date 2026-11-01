# Wazuh — install and first use

[← Wazuh](./README.md)

Open-source security platform: **Wazuh agent** on endpoints plus central **server**, **indexer**, and **dashboard**. Use it in a **lab** to practice SIEM/XDR workflows — not against systems you do not own or have written authorization to monitor.

Official docs change with releases; prefer the live Quickstart / Docker pages linked below over memorizing flags.

## What you are standing up

| Piece | Role |
|-------|------|
| Agent | Collects endpoint events / FIM (file integrity monitoring) / config assessment signals |
| Server (manager) | Analyzes events, rules, agent management |
| Indexer | Stores searchable security data |
| Dashboard | Investigate, manage agents, view alerts |

## Lab path A — Linux Quickstart (all-in-one host)

Needs a supported 64-bit Linux VM with enough CPU/RAM/disk (see [Quickstart hardware table](https://documentation.wazuh.com/current/quickstart.html) — plan on the order of **4+ vCPU / 8+ GiB** for a small lab).

Copy the **exact** `curl` / `bash` lines from the [official Quickstart](https://documentation.wazuh.com/current/quickstart.html) (package path is versioned, e.g. `packages.wazuh.com/<version>/wazuh-install.sh` with `-a` for all-in-one). Do not invent an old version folder from memory.

The assistant prints the dashboard URL and `admin` password when finished.

Open `https://<WAZUH_DASHBOARD_IP>` (accept the lab self-signed cert warning only in lab).

## Lab path B — Docker single-node

For Docker Desktop / Engine labs, follow [Wazuh Docker deployment](https://documentation.wazuh.com/current/deployment-options/docker/wazuh-container.html): clone the tagged `wazuh-docker` repo, enter `single-node`, meet host `vm.max_map_count` and RAM requirements, then `docker compose up -d`. Dashboard at `https://<DOCKER_HOST_IP>` with credentials from that doc.

## First useful lab steps

1. Deploy a **Wazuh agent** on a second lab VM you own (UI instructions or [agent install docs](https://documentation.wazuh.com/current/installation-guide/wazuh-agent/index.html)).  
2. Confirm the agent appears as active in the dashboard.  
3. Trigger a **benign** lab event (e.g. create a watched file for FIM after enabling a test rule) and find the alert.  
4. Walk one alert → related events — then practice triage habits from Defensive-Ops ([alert triage](https://github.com/thisiskushal31/Security-Deep-Dive/blob/main/Defensive-Ops/12_Alert_Triage_And_Case_Management.md)).

Optional structured demos: [Proof of Concept guide](https://documentation.wazuh.com/current/proof-of-concept-guide/index.html).

## For / not for

| For | Not for |
|-----|---------|
| Lab SIEM/XDR practice; authorized monitoring of your estate | Silent agent rollout on third-party systems |
| Learning rules, FIM, agent ops | Replacing written IR playbooks / ownership |
| Feeding Defensive-Ops detection/triage drills | Storing production secrets in lab compose files committed to public git |

## Related

- Program: [Defensive-Ops/3 — SIEM](https://github.com/thisiskushal31/Security-Deep-Dive/blob/main/Defensive-Ops/3_SIEM_And_Detection_Platforms.md) · [Detection engineering](https://github.com/thisiskushal31/Security-Deep-Dive/blob/main/Defensive-Ops/4_Detection_Engineering_And_ATTCK.md)  
- Docs: [Wazuh documentation](https://documentation.wazuh.com/current/index.html) · [Getting started](https://documentation.wazuh.com/current/getting-started/index.html)  
