# Authentication vs Authorization

## What they are

- **Authentication (Authn)** — Verifies **who** you are (identity). Answers: "Is this really the user or service claiming this identity?" Done via credentials (password, token, certificate, etc.).
- **Authorization (Authz)** — Decides **what** you are allowed to do (permissions). Answers: "Is this identity allowed to perform this action on this resource?" Done via policies, roles (RBAC), or attributes (ABAC).

## Why both matter

- **Authn** ensures the identity is real; **authz** ensures that identity is only allowed to do what’s permitted. Both are needed for secure access.
- **Order** — Authenticate first (establish identity), then authorize (check permission for the requested action).

## Comparison

| Aspect | Authentication | Authorization |
|--------|----------------|----------------|
| **Question** | Who are you? | What can you do? |
| **Input** | Credentials (password, token, cert) | Identity + resource + action |
| **Output** | Identity (user id, service id) | Allow or deny |
| **Examples** | Login, JWT validation, mTLS | RBAC, ABAC, API scope checks |

## In system design

- **API Gateway / service** — Validate token (authn), then check scope or role for the endpoint (authz). See [API Gateway](../fundamentals/13-api-gateway.md).
- **Federated identity** — Authn delegated to IdP (OAuth/OIDC); your app gets identity and possibly claims/roles for authz. See [Federated identity](2-federated-identity.md).
- **Principle of least privilege** — Grant only the permissions needed (authz); limit token scope and expiry (authn/authz). See [Security overview](1-security-overview.md).

**When to use:** Every protected API or resource should perform **authentication** (who) and **authorization** (allowed action). Implement both; do not rely on authn alone for access control.
