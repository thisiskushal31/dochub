# Proxies, WebSockets, and Polling

## Forward proxy vs reverse proxy

A **forward proxy** sits between clients and the internet (client-side); a **reverse proxy** sits between clients and your servers (server-side). The table below summarizes the difference. The diagrams show where each proxy sits in the request path.

![Forward proxy: clients → proxy → internet](../assets/fundamentals/forward-proxy.png)  
![Reverse proxy: clients → proxy → your servers](../assets/fundamentals/reverse-proxy.png)

| | Forward proxy | Reverse proxy |
|--|----------------|----------------|
| **Sits** | Between **clients** and the internet | Between **clients** and **servers** (your backend) |
| **Represents** | The client (hides client identity) | The server (hides backend topology) |
| **Use** | Privacy, bypass restrictions, caching for clients | Load balancing, SSL termination, caching, single entry point |
| **Client knows** | Often knows it uses a proxy | Often thinks it talks directly to the server |

- **Forward proxy** — Client configures proxy; proxy fetches from origin (e.g. corporate proxy, VPN).
- **Reverse proxy** — Server-side; clients send requests to the proxy; proxy forwards to one or more backends (e.g. NGINX, HAProxy). Used for load balancing, CDN edge, API gateway.

## WebSockets

- **Full-duplex** connection over a single TCP connection; both sides can send at any time.
- **Persistent** — Connection stays open instead of many short HTTP requests.
- **Use case:** Real-time chat, live dashboards, notifications, collaborative apps.
- **Trade-off:** Stateful; scaling and failover need sticky sessions or shared state.

## Long polling vs short polling

- **Short polling** — Client repeatedly asks "any updates?" at intervals. Simple but wasteful if updates are rare.
- **Long polling** — Client asks once; server holds the request until there is an update or timeout, then responds. Reduces empty responses; still request/response per update.
- **WebSockets** — One connection; server can push anytime. Prefer over long polling when you need true real-time push.

**When to use:** Reverse proxy for almost every web backend (routing, SSL, LB). WebSockets for real-time push. Long polling when WebSockets are not possible; short polling only for very low-frequency checks.
