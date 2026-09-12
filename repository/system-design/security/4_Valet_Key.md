# Valet Key

## What it is

A **valet key** is a **temporary, limited token** that grants the client direct access to a resource (e.g. a blob in object storage) without going through your application servers. Like a car valet key that only starts the car and limits what can be opened, the token is scoped (e.g. one object, read-only, short TTL).

## Why use it

- **Offload traffic** — Uploads and downloads go straight to storage (e.g. S3, GCS); your servers don’t stream the bytes. Saves bandwidth and CPU.
- **Limit exposure** — The token expires and is restricted to a specific resource and operation (e.g. PUT to one key, GET from one prefix). If leaked, impact is bounded.
- **No secrets on client** — The client never sees your main storage credentials; it only gets a time-limited, scoped URL or token.

## Flow

1. Client asks your backend for permission to upload or download a file (e.g. "I need to upload profile.jpg").
2. Backend checks auth and policy, then asks storage (or a token service) for a **signed URL** or **temporary credential** (valet key) with the right scope and TTL.
3. Backend returns the valet key to the client.
4. Client uses it to talk **directly** to storage. Your server does not see the bytes.

**Use case:** User uploads (images, documents), large downloads, or any flow where you want to avoid proxying bulk data. Combine with the **Gatekeeper** for issuing the key only to authenticated, authorized clients.
