# Federated Identity

## What it is

**Federated identity** delegates **authentication** to an external **identity provider (IdP)**. The application trusts the IdP to assert who the user is (and often basic attributes). The user signs in once at the IdP; the app receives a token or assertion and doesn’t manage passwords itself.

## Benefits

- **Less password handling** — No storing or verifying passwords; fewer credential leaks from your app.
- **Single sign-on (SSO)** — User logs in once; multiple apps (within the same org or across partners) can trust the same IdP.
- **Centralized user lifecycle** — Provisioning, MFA, and password policy live at the IdP.
- **Better UX** — Users may already be logged in (e.g. corporate IdP or social login).

## How it works

- User is redirected to the IdP (e.g. OAuth 2.0 / OpenID Connect).
- After login, the IdP redirects back with an **authorization code** or **tokens** (ID token, access token).
- The app validates the token (signature, issuer, audience) and uses the claims for identity and optionally authorization.

## Use case

Use when you want to avoid building and securing your own auth store, support SSO for enterprises, or allow "Login with Google/GitHub." Combine with the **Gatekeeper** pattern so only validated tokens reach your services.
