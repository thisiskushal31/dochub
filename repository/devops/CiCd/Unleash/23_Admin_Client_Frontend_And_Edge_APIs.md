# 23 — Admin, Client, Frontend, and Edge APIs

[← Previous](./22_Config_Catalog_Migrate_And_Spectrum.md) · [README](./README.md)

---

## 1. Concepts

This chapter is the **full HTTP surface** Unleash publishes (OpenAPI **v8.0.3** for server APIs; Edge **v20.4.0**). You do not need to install or open Swagger first: every documented endpoint is listed below with method, path, and purpose.

Auth reminder ([11](./11_API_Tokens_Keys_And_Service_Accounts.md)):

| API | Token |
|-----|-------|
| **Client** `/api/client` | Backend token (secret) |
| **Frontend** `/api/frontend` | Frontend token (not a secret) |
| **Admin** `/api/admin` | PAT or service-account token (admin tokens deprecated) |
| **Edge** | Same Client/Frontend shapes, plus Edge-only validate/issue/streaming |

Live spec on an instance: `/docs/openapi/` (UI) and `/docs/openapi.json` (OpenAPI enabled by default since v5.2). Dated schema fields stay in that file; **this chapter owns the endpoint list**.

SDK *methods* (what apps call) live in [09](./09_SDKs_Backend_Frontend_And_OpenFeature.md). Apps should not hit Admin from the request path.

### Counts (this scrape)

| Spec | Endpoints |
|------|-----------|
| Client API | 5 |
| Frontend API | 4 |
| Edge API | 14 |
| Admin API | 376 |

---

## 2. Advanced concepts

### Client API (backend SDKs / Edge upstream)

Base: `/api/client`. Returns **full** flag definitions for local evaluation.

#### Client (5)

| Method | Path | What it does |
|--------|------|----------------|
| `GET` | `/api/client/features/{featureName}` | Get a single feature flag |
| `GET` | `/api/client/features` | Get all flags (SDK) |
| `POST` | `/api/client/metrics` | Register client usage metrics |
| `POST` | `/api/client/metrics/custom` | Send custom metrics |
| `POST` | `/api/client/register` | Register a client SDK |

Custom metrics (`POST /api/client/metrics/custom`) feed **impact metrics** ([14](./14_Impression_Analytics_Impact_And_Playground.md)). Register once per SDK instance; poll features; flush metrics on the SDK interval.

### Frontend API (browser / mobile / Edge)

Base: `/api/frontend`. Returns **evaluated** flags for a context (query or POST body). POST avoids leaking context in URLs; the built-in Unleash Frontend API historically may not support POST — Edge does (`usePOSTrequests` on the JS SDK).

#### Frontend API (4)

| Method | Path | What it does |
|--------|------|----------------|
| `GET` | `/api/frontend` | Retrieve enabled feature flags for the provided context. |
| `POST` | `/api/frontend` | Retrieve enabled feature flags for the provided context, using POST. |
| `POST` | `/api/frontend/client/metrics` | Register client usage metrics |
| `POST` | `/api/frontend/client/register` | Register a client SDK |


### Edge API

Edge speaks Client + Frontend compatible routes, plus extras: POST features, frontend `/all`, per-flag frontend GET/POST, bulk metrics.

#### Client API (6)

| Method | Path | What it does |
|--------|------|----------------|
| `GET` | `/api/client/features` | get_features |
| `POST` | `/api/client/features` | post_features |
| `GET` | `/api/client/features/{feature_name}` | get_feature |
| `POST` | `/api/client/metrics` | post_metrics |
| `POST` | `/api/client/metrics/bulk` | post_bulk_metrics |
| `POST` | `/api/client/register` | register |

#### Frontend API (8)

| Method | Path | What it does |
|--------|------|----------------|
| `GET` | `/api/frontend` | frontend_get_enabled_features |
| `POST` | `/api/frontend` | frontend_post_enabled_features |
| `GET` | `/api/frontend/all` | frontend_get_all_features |
| `POST` | `/api/frontend/all` | frontend_post_all_features |
| `POST` | `/api/frontend/client/metrics` | frontend_post_metrics |
| `POST` | `/api/frontend/client/register` | frontend_register_client |
| `GET` | `/api/frontend/features/{feature_name}` | frontend_get_feature |
| `POST` | `/api/frontend/features/{feature_name}` | frontend_post_feature |


Edge-adjacent Admin/client routes also appear under Admin **Unleash Edge** (streaming, heartbeats, token issue/validate) — listed in the Admin catalog below.

### Admin API (full catalog)

Base: `/api/admin`. Powers the Admin UI and automation (Terraform, MCP, scripts). 376 operations grouped by OpenAPI tag. Edition/beta flags apply — 404 on OSS is expected for CR, SCIM, release templates, signals.

Tag index: API tokens (5) · Addons (6) · Admin UI (8) · Archive (4) · Auth (17) · Banners (6) · Change Requests (21) · Context (16) · Dependencies (6) · Environments (11) · Events (4) · Feature Types (2) · Features (48) · Import/Export (3) · Instance Admin (8) · Maintenance (2) · Metrics (28) · Notifications (4) · Operational (17) · Personal access tokens (3) · Playground (3) · Projects (40) · Public signup tokens (6) · Release Templates (25) · Search (1) · Segments (8) · Service Accounts (7) · Signup (2) · Strategies (10) · Tags (12) · Telemetry (1) · Unknown Flags (1) · Unleash Edge (7) · Users (34)

#### API tokens (5)

| Method | Path | What it does |
|--------|------|----------------|
| `GET` | `/api/admin/api-tokens` | Get API tokens |
| `POST` | `/api/admin/api-tokens` | Create API token |
| `GET` | `/api/admin/api-tokens/{name}` | Get API tokens by name |
| `PUT` | `/api/admin/api-tokens/{token}` | Update API token |
| `DELETE` | `/api/admin/api-tokens/{token}` | Delete API token |

#### Addons (6)

| Method | Path | What it does |
|--------|------|----------------|
| `GET` | `/api/admin/addons` | Get all addons and providers |
| `POST` | `/api/admin/addons` | Create a new addon |
| `GET` | `/api/admin/addons/{id}` | Get a specific addon |
| `PUT` | `/api/admin/addons/{id}` | Update an addon |
| `DELETE` | `/api/admin/addons/{id}` | Delete an addon |
| `GET` | `/api/admin/addons/{id}/events` | Get integration events for a specific integration configuration. |

#### Admin UI (8)

| Method | Path | What it does |
|--------|------|----------------|
| `GET` | `/api/admin/insights/lifecycle` | Get lifecycle trends |
| `GET` | `/api/admin/insights` | Get instance information |
| `POST` | `/api/admin/feedback` | Send Unleash feedback |
| `GET` | `/api/admin/ui-config` | Get UI configuration |
| `POST` | `/api/admin/ui-config/cors` | Sets allowed CORS origins |
| `PUT` | `/api/admin/feedback/{id}` | Update Unleash feedback |
| `POST` | `/api/admin/splash/{id}` | Update splash settings |
| `POST` | `/api/admin/record-ui-error` | Accepts errors from the UI client |

#### Archive (4)

| Method | Path | What it does |
|--------|------|----------------|
| `DELETE` | `/api/admin/archive/{featureName}` | Deletes an archived feature |
| `POST` | `/api/admin/archive/revive/{featureName}` | Revives a feature |
| `POST` | `/api/admin/projects/{projectId}/delete` | Deletes a list of features |
| `POST` | `/api/admin/projects/{projectId}/revive` | Revives a list of features |

#### Auth (17)

| Method | Path | What it does |
|--------|------|----------------|
| `GET` | `/api/admin/permissions` | Gets available permissions |
| `POST` | `/auth/simple/login` | Log in |
| `GET` | `/api/admin/auth/saml/settings` | Get SAML auth settings |
| `POST` | `/api/admin/auth/saml/settings` | Update SAML auth settings |
| `GET` | `/api/admin/auth/oidc/settings` | Get OIDC auth settings |
| `POST` | `/api/admin/auth/oidc/settings` | Set OIDC settings |
| `GET` | `/api/admin/auth/simple/settings` | Get Simple auth settings |
| `POST` | `/api/admin/auth/simple/settings` | Update Simple auth settings |
| `GET` | `/api/admin/service-account/{id}/permissions` | Returns the list of permissions for the service account. |
| `GET` | `/api/admin/access/overview` | Gets access overview |
| `GET` | `/api/admin/scim-settings` | Get SCIM settings. |
| `POST` | `/api/admin/scim-settings` | Set SCIM settings. |
| `POST` | `/api/admin/scim-settings/generate-new-token` | Generates a new SCIM API token. |
| `GET` | `/auth/reset/validate` | Validates a token |
| `POST` | `/auth/reset/password` | Changes a user password |
| `POST` | `/auth/reset/validate-password` | Validates password |
| `POST` | `/auth/reset/password-email` | Reset password |

#### Banners (6)

| Method | Path | What it does |
|--------|------|----------------|
| `GET` | `/api/admin/banners` | Get all banners. |
| `POST` | `/api/admin/banners` | Create a banner. |
| `PUT` | `/api/admin/banners/{id}` | Update a banner. |
| `DELETE` | `/api/admin/banners/{id}` | Delete a banner. |
| `POST` | `/api/admin/banners/{id}/on` | Enables a banner. |
| `POST` | `/api/admin/banners/{id}/off` | Disables a banner. |

#### Change Requests (21)

| Method | Path | What it does |
|--------|------|----------------|
| `GET` | `/api/admin/projects/{projectId}/change-requests/config` | Retrieves change request configuration for a project |
| `PUT` | `/api/admin/projects/{projectId}/environments/{environment}/change-requests/config` | Updates change request configuration for an environment in the project |
| `GET` | `/api/admin/projects/{projectId}/change-requests/scheduled` | Get scheduled change requests matching a query. |
| `POST` | `/api/admin/projects/{projectId}/environments/{environment}/change-requests` | Create/Add change to a change request |
| `GET` | `/api/admin/projects/{projectId}/change-requests/count` | Retrieves number of project change requests in each state |
| `GET` | `/api/admin/projects/{projectId}/change-requests/open` | Retrieves pending change requests in configured environments |
| `GET` | `/api/admin/projects/{projectId}/change-requests/pending` | Retrieves pending change requests in configured environments |
| `GET` | `/api/admin/projects/{projectId}/change-requests/actionable` | Get the number of change requests you can do something with |
| `GET` | `/api/admin/projects/{projectId}/change-requests` | Retrieves all change requests for a project |
| `GET` | `/api/admin/projects/{projectId}/change-requests/pending/{featureName}` | Retrieves all pending change requests referencing a feature in the project |
| `GET` | `/api/admin/projects/{projectId}/change-requests/{id}` | Retrieves one change request by id |
| `DELETE` | `/api/admin/projects/{projectId}/change-requests/{id}` | Deletes a change request by id |
| `DELETE` | `/api/admin/projects/{projectId}/change-requests/{changeRequestId}/changes/{changeId}` | Discards a change from a change request by change id |
| `PUT` | `/api/admin/projects/{projectId}/change-requests/{changeRequestId}/changes/{changeId}` | Edits a single change in a change request |
| `PUT` | `/api/admin/projects/{projectId}/change-requests/{id}/state` | This endpoint will update the state of a change request |
| `PUT` | `/api/admin/projects/{projectId}/change-requests/{id}/title` | This endpoint will update the custom title of a change request |
| `PUT` | `/api/admin/projects/{projectId}/change-requests/{id}/approvers` | This endpoint will update the reviewers of a change request |
| `GET` | `/api/admin/projects/{projectId}/change-requests/{id}/approvers` | This endpoint fetches the requested approvers of a change request |
| `POST` | `/api/admin/projects/{projectId}/change-requests/{id}/comments` | This endpoint will add a comment to a change request |
| `GET` | `/api/admin/projects/{projectId}/change-requests/available-reviewers/{environment}` | This endpoint will return users available to review/approve this change request |
| `GET` | `/api/admin/search/change-requests` | Search change requests |

#### Context (16)

| Method | Path | What it does |
|--------|------|----------------|
| `GET` | `/api/admin/context` | Gets configured context fields |
| `POST` | `/api/admin/context` | Create a context field |
| `GET` | `/api/admin/context/{contextField}` | Gets context field |
| `PUT` | `/api/admin/context/{contextField}` | Update an existing context field |
| `DELETE` | `/api/admin/context/{contextField}` | Delete an existing context field |
| `POST` | `/api/admin/context/{contextField}/legal-values` | Add or update legal value for the context field |
| `DELETE` | `/api/admin/context/{contextField}/legal-values/{legalValue}` | Delete legal value for the context field |
| `POST` | `/api/admin/context/validate` | Validate a context field |
| `GET` | `/api/admin/projects/{projectId}/context` | [BETA] Gets configured context fields |
| `POST` | `/api/admin/projects/{projectId}/context` | [BETA] Create a context field |
| `GET` | `/api/admin/projects/{projectId}/context/{contextField}` | [BETA] Gets context field |
| `PUT` | `/api/admin/projects/{projectId}/context/{contextField}` | [BETA] Update an existing context field |
| `DELETE` | `/api/admin/projects/{projectId}/context/{contextField}` | [BETA] Delete an existing context field |
| `POST` | `/api/admin/projects/{projectId}/context/{contextField}/legal-values` | [BETA] Add or update legal value for the context field |
| `DELETE` | `/api/admin/projects/{projectId}/context/{contextField}/legal-values/{legalValue}` | [BETA] Delete legal value for the context field |
| `POST` | `/api/admin/projects/{projectId}/context/validate` | [BETA] Validate a context field |

#### Dependencies (6)

| Method | Path | What it does |
|--------|------|----------------|
| `POST` | `/api/admin/projects/{projectId}/features/{child}/dependencies` | Add a feature dependency. |
| `DELETE` | `/api/admin/projects/{projectId}/features/{child}/dependencies` | Deletes feature dependencies. |
| `DELETE` | `/api/admin/projects/{projectId}/features/{child}/dependencies/{parent}` | Deletes a feature dependency. |
| `GET` | `/api/admin/projects/{projectId}/features/{child}/parents` | List parent options. |
| `GET` | `/api/admin/projects/{projectId}/features/{parent}/parent-variants` | List parent feature variants. |
| `GET` | `/api/admin/projects/{projectId}/dependencies` | Check dependencies exist. |

#### Environments (11)

| Method | Path | What it does |
|--------|------|----------------|
| `POST` | `/api/admin/environments` | Creates a new environment |
| `GET` | `/api/admin/environments` | Get all environments |
| `POST` | `/api/admin/environments/validate` | Validates if an environment name exists |
| `PUT` | `/api/admin/environments/update/{name}` | Updates an environment by name |
| `DELETE` | `/api/admin/environments/{name}` | Deletes an environment by name |
| `GET` | `/api/admin/environments/{name}` | Get the environment with `name` |
| `POST` | `/api/admin/environments/{name}/clone` | Clones an environment |
| `GET` | `/api/admin/environments/project/{projectId}` | Get the environments available to a project |
| `PUT` | `/api/admin/environments/sort-order` | Update environment sort orders |
| `POST` | `/api/admin/environments/{name}/on` | Toggle the environment with `name` on |
| `POST` | `/api/admin/environments/{name}/off` | Toggle the environment with `name` off |

#### Events (4)

| Method | Path | What it does |
|--------|------|----------------|
| `GET` | `/api/admin/events` | Get the most recent events from the Unleash instance or all events related to a project. |
| `GET` | `/api/admin/events/{featureName}` | Get all events related to a specific feature flag. |
| `GET` | `/api/admin/event-creators` | Get a list of all users that have created events |
| `GET` | `/api/admin/search/events` | Search for events |

#### Feature Types (2)

| Method | Path | What it does |
|--------|------|----------------|
| `GET` | `/api/admin/feature-types` | Get all feature types |
| `PUT` | `/api/admin/feature-types/{id}/lifetime` | Update feature type lifetime |

#### Features (48)

| Method | Path | What it does |
|--------|------|----------------|
| `POST` | `/api/admin/projects/{projectId}/features/{featureName}/changeProject` | Move feature to project |
| `PUT` | `/api/admin/projects/{project}/features/{featureName}/environments/{environment}/milestone-strategies/{strategyId}` | Update a milestone strategy |
| `GET` | `/api/client/delta` | [BETA] Get partial updates (SDK) |
| `PUT` | `/api/admin/projects/{project}/features/{featureName}/environments/{environment}/safeguards` | Change a feature environment safeguard |
| `DELETE` | `/api/admin/projects/{project}/features/{featureName}/environments/{environment}/safeguards/{safeguardId}` | Delete a feature environment safeguard |
| `POST` | `/api/admin/features/validate` | Validate a feature flag name. |
| `GET` | `/api/admin/features/{featureName}/tags` | Get all tags for a feature. |
| `POST` | `/api/admin/features/{featureName}/tags` | Adds a tag to a feature. |
| `PUT` | `/api/admin/features/{featureName}/tags` | Updates multiple tags for a feature. |
| `DELETE` | `/api/admin/features/{featureName}/tags/{type}/{value}` | Removes a tag from a feature. |
| `GET` | `/api/admin/projects/{projectId}/features/{featureName}/environments/{environment}` | Get a feature environment |
| `POST` | `/api/admin/projects/{projectId}/features/{featureName}/environments/{environment}/off` | Disable a feature flag |
| `POST` | `/api/admin/projects/{projectId}/features/{featureName}/environments/{environment}/on` | Enable a feature flag |
| `POST` | `/api/admin/projects/{projectId}/bulk_features/environments/{environment}/on` | Bulk enable a list of features |
| `POST` | `/api/admin/projects/{projectId}/bulk_features/environments/{environment}/off` | Bulk disable a list of features |
| `GET` | `/api/admin/projects/{projectId}/features/{featureName}/environments/{environment}/strategies` | Get feature flag strategies |
| `POST` | `/api/admin/projects/{projectId}/features/{featureName}/environments/{environment}/strategies` | Add a strategy to a feature flag |
| `GET` | `/api/admin/projects/{projectId}/features/{featureName}/environments/{environment}/strategies/{strategyId}` | Get a strategy configuration |
| `PUT` | `/api/admin/projects/{projectId}/features/{featureName}/environments/{environment}/strategies/{strategyId}` | Update a strategy |
| `PATCH` | `/api/admin/projects/{projectId}/features/{featureName}/environments/{environment}/strategies/{strategyId}` | Change specific properties of a strategy |
| `DELETE` | `/api/admin/projects/{projectId}/features/{featureName}/environments/{environment}/strategies/{strategyId}` | Delete a strategy from a feature flag |
| `POST` | `/api/admin/projects/{projectId}/features/{featureName}/environments/{environment}/strategies/set-sort-order` | Set strategy sort order |
| `GET` | `/api/admin/projects/{projectId}/features` | Get all features in a project |
| `POST` | `/api/admin/projects/{projectId}/features` | Add a new feature flag |
| `POST` | `/api/admin/projects/{projectId}/features/{featureName}/clone` | Clone a feature flag |
| `GET` | `/api/admin/projects/{projectId}/features/{featureName}` | Get a feature |
| `PUT` | `/api/admin/projects/{projectId}/features/{featureName}` | Update a feature flag |
| `PATCH` | `/api/admin/projects/{projectId}/features/{featureName}` | Modify a feature flag |
| `DELETE` | `/api/admin/projects/{projectId}/features/{featureName}` | Archive a feature flag |
| `POST` | `/api/admin/projects/{projectId}/stale` | Mark features as stale / not stale |
| `GET` | `/api/admin/projects/{projectId}/features/{featureName}/environments/{environment}/variants` | Get variants for a feature in an environment |
| `PATCH` | `/api/admin/projects/{projectId}/features/{featureName}/environments/{environment}/variants` | Patch a feature's variants in an environment |
| `PUT` | `/api/admin/projects/{projectId}/features/{featureName}/environments/{environment}/variants` | Create (overwrite) variants for a feature in an environment |
| `PUT` | `/api/admin/projects/{projectId}/features/{featureName}/variants-batch` | Create (overwrite) variants for a feature flag in multiple environments |
| `POST` | `/api/admin/projects/{projectId}/archive/validate` | Validates archive features |
| `POST` | `/api/admin/projects/{projectId}/archive` | Archives a list of features |
| `GET` | `/api/admin/projects/{projectId}/features/{featureName}/lifecycle` | Get feature lifecycle |
| `POST` | `/api/admin/projects/{projectId}/features/{featureName}/lifecycle/complete` | Set feature completed |
| `POST` | `/api/admin/projects/{projectId}/features/{featureName}/lifecycle/uncomplete` | Set feature uncompleted |
| `POST` | `/api/admin/projects/{projectId}/features/{featureName}/link` | Create a feature link |
| `PUT` | `/api/admin/projects/{projectId}/features/{featureName}/link/{linkId}` | Update a feature link |
| `DELETE` | `/api/admin/projects/{projectId}/features/{featureName}/link/{linkId}` | Delete a feature link |
| `GET` | `/api/admin/lifecycle/count` | Get all features lifecycle stage count |
| `POST` | `/api/admin/constraints/validate` | Validate constraint |
| `POST` | `/api/admin/projects/{projectId}/features/{featureName}/favorites` | Add feature to favorites |
| `DELETE` | `/api/admin/projects/{projectId}/features/{featureName}/favorites` | Remove feature from favorites |
| `POST` | `/api/admin/projects/{projectId}/favorites` | Add project to favorites |
| `DELETE` | `/api/admin/projects/{projectId}/favorites` | Remove project from favorites |

#### Import/Export (3)

| Method | Path | What it does |
|--------|------|----------------|
| `POST` | `/api/admin/features-batch/export` | Export feature flags from an environment |
| `POST` | `/api/admin/features-batch/validate` | Validate feature import data |
| `POST` | `/api/admin/features-batch/import` | Import feature flags |

#### Instance Admin (8)

| Method | Path | What it does |
|--------|------|----------------|
| `GET` | `/api/admin/logins` | Get all login events. |
| `GET` | `/api/admin/license/check` | Validates the Unleash license. |
| `GET` | `/api/admin/license` | Reads the Unleash license. |
| `POST` | `/api/admin/license` | Set a new Unleash license. |
| `GET` | `/api/admin/remote-mcp/settings` | Get remote MCP server settings. |
| `POST` | `/api/admin/remote-mcp/settings` | Toggle remote MCP server settings. |
| `GET` | `/api/admin/instance-admin/statistics/csv` | Instance usage statistics |
| `GET` | `/api/admin/instance-admin/statistics` | Instance usage statistics |

#### Maintenance (2)

| Method | Path | What it does |
|--------|------|----------------|
| `POST` | `/api/admin/maintenance` | Enabled/disabled maintenance mode |
| `GET` | `/api/admin/maintenance` | Get maintenance mode status |

#### Metrics (28)

| Method | Path | What it does |
|--------|------|----------------|
| `GET` | `/api/admin/metrics/rps` | Gets usage data |
| `GET` | `/api/admin/metrics/traffic` | Get aggregated traffic data for a given time period. |
| `GET` | `/api/admin/metrics/connection` | [BETA] Get aggregated metered connections for a given time period. |
| `GET` | `/api/admin/metrics/request` | [BETA] Get aggregated metered requests for a given time period. |
| `GET` | `/api/admin/impact-metrics/metadata` | Get available impact metrics |
| `GET` | `/api/admin/impact-metrics` | Query impact metrics time series data |
| `GET` | `/api/admin/impact-metrics/plausible` | Get Plausible analytics data |
| `POST` | `/api/admin/projects/{projectId}/features/{featureName}/impact-metrics/config` | Save flag level impact metrics configuration |
| `GET` | `/api/admin/projects/{projectId}/features/{featureName}/impact-metrics/config` | Get impact metrics configurations for a single feature |
| `POST` | `/api/admin/impact-metrics/config` | Save instance level impact metrics configuration |
| `GET` | `/api/admin/impact-metrics/config` | Get impact metrics configuration for the instance |
| `DELETE` | `/api/admin/projects/{projectId}/features/{featureName}/impact-metrics/config/{id}` | Delete flag level impact metric configuration |
| `DELETE` | `/api/admin/impact-metrics/config/{id}` | Delete instance level impact metric configuration |
| `POST` | `/api/admin/impact-metrics/register` | Register a new impact metric |
| `GET` | `/api/admin/impact-metrics/external-source` | Get the external impact-metrics source. |
| `POST` | `/api/admin/impact-metrics/external-source` | Set the external impact-metrics source. |
| `POST` | `/api/admin/impact-metrics/external-source/validate` | Validate an external impact-metrics source URL. |
| `POST` | `/api/admin/metrics/applications/{appName}` | Create an application to connect reported metrics |
| `DELETE` | `/api/admin/metrics/applications/{appName}` | Delete an application |
| `GET` | `/api/admin/metrics/applications/{appName}` | Get application data |
| `GET` | `/api/admin/metrics/applications` | Get all applications |
| `GET` | `/api/admin/metrics/applications/{appName}/overview` | Get application overview |
| `GET` | `/api/admin/metrics/instances/{appName}/environment/{environment}` | Get application environment instances (Last 24h) |
| `GET` | `/api/admin/metrics/sdks/outdated` | Get outdated SDKs |
| `GET` | `/api/admin/client-metrics/features/{name}/raw` | Get feature metrics |
| `GET` | `/api/admin/client-metrics/features/{name}` | Last hour of usage and a list of applications that have reported seeing this feature flag |
| `GET` | `/api/admin/custom-metrics` | Get stored custom metrics |
| `GET` | `/api/admin/custom-metrics/prometheus` | Get metrics in Prometheus format |

#### Notifications (4)

| Method | Path | What it does |
|--------|------|----------------|
| `GET` | `/api/admin/notifications` | Retrieves a list of notifications |
| `POST` | `/api/admin/notifications/read` | Mark notifications as read |
| `PUT` | `/api/admin/email-subscription/{subscription}` | [BETA] Subscribe to email subscription |
| `DELETE` | `/api/admin/email-subscription/{subscription}` | [BETA] Unsubscribe from email subscription |

#### Operational (17)

| Method | Path | What it does |
|--------|------|----------------|
| `GET` | `/api/admin/signal-endpoints` | [BETA] Get all signal endpoints. |
| `POST` | `/api/admin/signal-endpoints` | [BETA] Create a signal endpoint. |
| `PUT` | `/api/admin/signal-endpoints/{id}` | [BETA] Update a signal endpoint. |
| `DELETE` | `/api/admin/signal-endpoints/{id}` | [BETA] Delete a signal endpoint. |
| `POST` | `/api/admin/signal-endpoints/{id}/on` | [BETA] Enables a signal endpoint. |
| `POST` | `/api/admin/signal-endpoints/{id}/off` | [BETA] Disables a signal endpoint. |
| `GET` | `/api/admin/signal-endpoints/{signalEndpointId}/tokens` | [BETA] Get all signal endpoint tokens for a specific signal endpoint. |
| `POST` | `/api/admin/signal-endpoints/{signalEndpointId}/tokens` | [BETA] Create a signal endpoint token for a specific signal endpoint. |
| `PUT` | `/api/admin/signal-endpoints/{signalEndpointId}/tokens/{id}` | [BETA] Update a signal endpoint token. |
| `DELETE` | `/api/admin/signal-endpoints/{signalEndpointId}/tokens/{id}` | [BETA] Delete a signal endpoint token. |
| `GET` | `/api/admin/signal-endpoints/{signalEndpointId}/signals` | [BETA] Get signals originated from a specific signal endpoint. |
| `POST` | `/api/signal-endpoint/{name}` | [BETA] Call a signal endpoint. |
| `GET` | `/api/admin/signals` | [BETA] Get all signals that match the query parameter criteria. |
| `GET` | `/api/admin/invoices` | getInvoices |
| `GET` | `/api/admin/invoices/list` | getDetailedInvoices |
| `GET` | `/ready` | Get instance readiness status |
| `GET` | `/health` | Get instance operational status |

#### Personal access tokens (3)

| Method | Path | What it does |
|--------|------|----------------|
| `GET` | `/api/admin/user/tokens` | Get all personal access tokens (PATs) for the current user. |
| `POST` | `/api/admin/user/tokens` | Create a new personal access token (PAT) for the current user. |
| `DELETE` | `/api/admin/user/tokens/{id}` | Delete a personal access token (PAT) for the current user. |

#### Playground (3)

| Method | Path | What it does |
|--------|------|----------------|
| `POST` | `/api/admin/playground/change-request/{id}` | Evaluate an Unleash context against a change request preview. |
| `POST` | `/api/admin/playground` | Evaluate an Unleash context against a set of environments and projects. |
| `POST` | `/api/admin/playground/advanced` | Batch evaluate an Unleash context against a set of environments and projects. |

#### Projects (40)

| Method | Path | What it does |
|--------|------|----------------|
| `GET` | `/api/admin/projects` | Get a list of all projects. |
| `POST` | `/api/admin/projects` | Create project |
| `POST` | `/api/admin/projects/validate` | Validate project ID |
| `PUT` | `/api/admin/projects/{projectId}` | Update project |
| `DELETE` | `/api/admin/projects/{projectId}` | Delete project |
| `PUT` | `/api/admin/projects/{projectId}/settings` | Update project enterprise settings |
| `POST` | `/api/admin/projects/archive/{projectId}` | Archive project |
| `POST` | `/api/admin/projects/revive/{projectId}` | Revive project |
| `GET` | `/api/admin/projects/{projectId}/access` | Get users and groups in project |
| `PUT` | `/api/admin/projects/{projectId}/access` | Set users and groups to roles in the current project |
| `POST` | `/api/admin/projects/{projectId}/access` | Configure project access |
| `GET` | `/api/admin/projects/roles/{roleId}/access` | Get project-role mappings |
| `PUT` | `/api/admin/projects/{projectId}/users/{userId}/roles` | Sets roles for user |
| `DELETE` | `/api/admin/projects/{projectId}/users/{userId}/roles` | Remove project access for a user |
| `PUT` | `/api/admin/projects/{projectId}/groups/{groupId}/roles` | Sets roles for group |
| `DELETE` | `/api/admin/projects/{projectId}/groups/{groupId}/roles` | Remove project access for a group |
| `GET` | `/api/admin/projects/{projectId}/actions` | [BETA] List action sets. |
| `POST` | `/api/admin/projects/{projectId}/actions` | [BETA] Create an action set. |
| `PUT` | `/api/admin/projects/{projectId}/actions/{id}` | [BETA] Update an action set. |
| `DELETE` | `/api/admin/projects/{projectId}/actions/{id}` | [BETA] Delete an action set. |
| `POST` | `/api/admin/projects/{projectId}/actions/{id}/on` | [BETA] Enables an action set. |
| `POST` | `/api/admin/projects/{projectId}/actions/{id}/off` | [BETA] Disables an action set. |
| `GET` | `/api/admin/projects/{projectId}/actions/{id}/events` | [BETA] Get action events for a specific action set. |
| `GET` | `/api/admin/projects/{projectId}/actions/config` | [BETA] Configuration for the actions UI. |
| `GET` | `/api/admin/projects/{projectId}/overview` | Get an overview of a project. |
| `GET` | `/api/admin/projects/{projectId}/dora` | Get an overview project dora metrics. |
| `GET` | `/api/admin/projects/{projectId}/applications` | Get a list of all applications for a project. |
| `GET` | `/api/admin/projects/{projectId}/flag-creators` | Get a list of all flag creators for a project. |
| `GET` | `/api/admin/projects/{projectId}/sdks/outdated` | Get outdated project SDKs |
| `POST` | `/api/admin/projects/{projectId}/environments` | Add an environment to a project. |
| `DELETE` | `/api/admin/projects/{projectId}/environments/{environment}` | Remove an environment from a project. |
| `POST` | `/api/admin/projects/{projectId}/environments/{environment}/default-strategy` | Set environment-default strategy |
| `GET` | `/api/admin/projects/{projectId}/health-report` | Get a health report for a project. |
| `GET` | `/api/admin/projects/{projectId}/api-tokens` | Get api tokens for project. |
| `POST` | `/api/admin/projects/{projectId}/api-tokens` | Create a project API token. |
| `DELETE` | `/api/admin/projects/{projectId}/api-tokens/{token}` | Delete a project API token. |
| `GET` | `/api/admin/projects/{projectId}/insights` | Get an overview of a project insights. |
| `GET` | `/api/admin/projects/{projectId}/status` | Get project status |
| `GET` | `/api/admin/personal-dashboard` | Get personal dashboard |
| `GET` | `/api/admin/personal-dashboard/{projectId}` | Get personal project details |

#### Public signup tokens (6)

| Method | Path | What it does |
|--------|------|----------------|
| `GET` | `/invite/{token}/validate` | Validate signup token |
| `POST` | `/invite/{token}/signup` | Add a user via a signup token |
| `GET` | `/api/admin/invite-link/tokens` | Get public signup tokens |
| `POST` | `/api/admin/invite-link/tokens` | Create a public signup token |
| `GET` | `/api/admin/invite-link/tokens/{token}` | Retrieve a token |
| `PUT` | `/api/admin/invite-link/tokens/{token}` | Update a public signup token |

#### Release Templates (25)

| Method | Path | What it does |
|--------|------|----------------|
| `GET` | `/api/admin/release-plan-templates` | Get all release templates. |
| `POST` | `/api/admin/release-plan-templates` | Create a release template. |
| `GET` | `/api/admin/release-plan-templates/{templateId}` | Get a release template by its id. |
| `DELETE` | `/api/admin/release-plan-templates/{templateId}` | Deletes a release template by its id. |
| `PUT` | `/api/admin/release-plan-templates/{templateId}` | Updates a release template by its id. |
| `POST` | `/api/admin/release-plan-templates/archive/{templateId}` | Archives a release template by its id. |
| `POST` | `/api/admin/release-plan-templates/{templateId}/milestones` | Adds a milestone to a release template. |
| `PUT` | `/api/admin/release-plan-templates/{templateId}/milestones/{milestoneId}` | Updates existing milestone |
| `DELETE` | `/api/admin/release-plan-templates/{templateId}/milestones/{milestoneId}` | Removes an existing milestone |
| `POST` | `/api/admin/release-plan-templates/{templateId}/milestones/{milestoneId}/strategies` | Adds a strategy to a milestone. |
| `PUT` | `/api/admin/release-plan-templates/{templateId}/milestones/{milestoneId}/strategies/{strategyId}` | Updates a strategy attached to a milestone |
| `DELETE` | `/api/admin/release-plan-templates/{templateId}/milestones/{milestoneId}/strategies/{strategyId}` | Removes a strategy attached to a milestone |
| `GET` | `/api/admin/projects/{project}/features/{featureName}/environments/{environment}/release_plans` | Get release plans. |
| `POST` | `/api/admin/projects/{project}/features/{featureName}/environments/{environment}/release_plans` | Add a release plan. |
| `GET` | `/api/admin/projects/{project}/features/{featureName}/environments/{environment}/release-plans` | Get release plans. |
| `POST` | `/api/admin/projects/{project}/features/{featureName}/environments/{environment}/release-plans` | Add a release plan. |
| `DELETE` | `/api/admin/projects/{project}/features/{featureName}/environments/{environment}/release_plans/{planId}` | Remove a release plan. |
| `DELETE` | `/api/admin/projects/{project}/features/{featureName}/environments/{environment}/release-plans/{planId}` | Remove a release plan. |
| `POST` | `/api/admin/projects/{project}/features/{featureName}/environments/{environment}/release_plans/{planId}/milestones/{milestoneId}/start` | Start a release plan milestone. |
| `POST` | `/api/admin/projects/{project}/features/{featureName}/environments/{environment}/release-plans/{planId}/milestones/{milestoneId}/start` | Start a release plan milestone. |
| `PUT` | `/api/admin/projects/{project}/features/{featureName}/environments/{environment}/progressions/{id}` | Create or update a milestone progression |
| `DELETE` | `/api/admin/projects/{project}/features/{featureName}/environments/{environment}/progressions/{id}` | Delete a milestone progression |
| `POST` | `/api/admin/projects/{project}/features/{featureName}/environments/{environment}/progressions/{planId}/resume` | Resume paused milestone progressions |
| `PUT` | `/api/admin/projects/{project}/features/{featureName}/environments/{environment}/release-plans/{planId}/safeguards` | Change a release plan safeguard |
| `DELETE` | `/api/admin/projects/{project}/features/{featureName}/environments/{environment}/release-plans/{planId}/safeguards/{safeguardId}` | Delete a release plan safeguard |

#### Search (1)

| Method | Path | What it does |
|--------|------|----------------|
| `GET` | `/api/admin/search/features` | Search and filter features |

#### Segments (8)

| Method | Path | What it does |
|--------|------|----------------|
| `POST` | `/api/admin/segments/validate` | Validates if a segment name exists |
| `GET` | `/api/admin/segments/strategies/{strategyId}` | Get strategy segments |
| `GET` | `/api/admin/segments/{id}/strategies` | Get strategies that reference segment |
| `DELETE` | `/api/admin/segments/{id}` | Deletes a segment by id |
| `PUT` | `/api/admin/segments/{id}` | Update segment by id |
| `GET` | `/api/admin/segments/{id}` | Get a segment |
| `POST` | `/api/admin/segments` | Create a new segment |
| `GET` | `/api/admin/segments` | Get all segments |

#### Service Accounts (7)

| Method | Path | What it does |
|--------|------|----------------|
| `GET` | `/api/admin/service-account` | List service accounts. |
| `POST` | `/api/admin/service-account` | Create a service account. |
| `PUT` | `/api/admin/service-account/{id}` | Update a service account. |
| `DELETE` | `/api/admin/service-account/{id}` | Delete a service account. |
| `GET` | `/api/admin/service-account/{id}/token` | List all tokens for a service account. |
| `POST` | `/api/admin/service-account/{id}/token` | Create a token for a service account. |
| `DELETE` | `/api/admin/service-account/{id}/token/{tokenId}` | Delete a token for a service account. |

#### Signup (2)

| Method | Path | What it does |
|--------|------|----------------|
| `GET` | `/api/admin/signup` | Get signup data |
| `POST` | `/api/admin/signup` | Submit signup data. |

#### Strategies (10)

| Method | Path | What it does |
|--------|------|----------------|
| `GET` | `/api/admin/strategies` | Get all strategies |
| `POST` | `/api/admin/strategies` | Create a strategy |
| `GET` | `/api/admin/strategies/{name}` | Get a strategy definition |
| `DELETE` | `/api/admin/strategies/{name}` | Delete a strategy |
| `PUT` | `/api/admin/strategies/{name}` | Update a strategy type |
| `POST` | `/api/admin/strategies/{strategyName}/deprecate` | Deprecate a strategy |
| `POST` | `/api/admin/strategies/{strategyName}/reactivate` | Reactivate a strategy |
| `GET` | `/api/admin/context/{contextField}/strategies` | Get strategies that use a context field |
| `GET` | `/api/admin/projects/{projectId}/context/{contextField}/strategies` | [BETA] Get strategies that use a context field |
| `POST` | `/api/admin/segments/strategies` | Update strategy segments |

#### Tags (12)

| Method | Path | What it does |
|--------|------|----------------|
| `GET` | `/api/admin/tags` | List all tags. |
| `POST` | `/api/admin/tags` | Create a new tag. |
| `GET` | `/api/admin/tags/{type}` | List all tags of a given type. |
| `GET` | `/api/admin/tags/{type}/{value}` | Get a tag by type and value. |
| `DELETE` | `/api/admin/tags/{type}/{value}` | Delete a tag. |
| `GET` | `/api/admin/tag-types` | Get all tag types |
| `POST` | `/api/admin/tag-types` | Create a tag type |
| `POST` | `/api/admin/tag-types/validate` | Validate a tag type |
| `GET` | `/api/admin/tag-types/{name}` | Get a tag type |
| `PUT` | `/api/admin/tag-types/{name}` | Update a tag type |
| `DELETE` | `/api/admin/tag-types/{name}` | Delete a tag type |
| `PUT` | `/api/admin/projects/{projectId}/tags` | Adds a tag to the specified features |

#### Telemetry (1)

| Method | Path | What it does |
|--------|------|----------------|
| `GET` | `/api/admin/telemetry/settings` | Get telemetry settings |

#### Unknown Flags (1)

| Method | Path | What it does |
|--------|------|----------------|
| `GET` | `/api/admin/metrics/unknown-flags` | Get unknown flags |

#### Unleash Edge (7)

| Method | Path | What it does |
|--------|------|----------------|
| `POST` | `/api/client/metrics/edge` | Register Edge observability metrics. |
| `POST` | `/api/client/edge-licensing/heartbeat` | Heartbeat for Enterprise Edge instances. |
| `GET` | `/api/client/streaming` | [BETA] Connect to the streaming API. |
| `POST` | `/api/admin/streaming/disconnect-all` | [BETA] Disconnect all clients. |
| `POST` | `/api/client/metrics/bulk` | Send metrics in bulk |
| `POST` | `/edge/validate` | Check which tokens are valid |
| `POST` | `/edge/issue-token` | Get or create valid tokens for the requested environment |

#### Users (34)

| Method | Path | What it does |
|--------|------|----------------|
| `GET` | `/api/admin/licensed-users` | Retrieves all licensed users data. |
| `GET` | `/api/admin/groups` | Get a list of groups |
| `POST` | `/api/admin/groups` | Create a new group |
| `GET` | `/api/admin/groups/{groupId}` | Get a single group |
| `PUT` | `/api/admin/groups/{groupId}` | Update a group |
| `DELETE` | `/api/admin/groups/{groupId}` | Delete a single group |
| `DELETE` | `/api/admin/groups/scim-groups` | Delete all SCIM groups |
| `GET` | `/api/admin/roles` | Get a list of roles |
| `POST` | `/api/admin/roles` | Create a new role |
| `GET` | `/api/admin/roles/{roleId}` | Get a single role |
| `PUT` | `/api/admin/roles/{roleId}` | Update a role |
| `DELETE` | `/api/admin/roles/{roleId}` | Delete a custom role |
| `POST` | `/api/admin/roles/validate` | Validate a role |
| `GET` | `/api/admin/user-access-requests` | Get all pending user access requests. |
| `POST` | `/api/admin/user-access-requests/{id}/approve` | Approve a user access request. |
| `DELETE` | `/api/admin/user-access-requests/{id}` | Reject a user access request. |
| `GET` | `/api/admin/user` | Get your own user details |
| `GET` | `/api/admin/user/profile` | Get your own user profile |
| `POST` | `/api/admin/user/change-password` | Change your own password |
| `GET` | `/api/admin/user/roles` | Get roles for currently logged in user |
| `GET` | `/api/admin/user-admin/inactive` | Gets inactive users |
| `POST` | `/api/admin/user-admin/inactive/delete` | Deletes inactive users |
| `POST` | `/api/admin/user-admin/validate-password` | Validate password for a user |
| `POST` | `/api/admin/user-admin/{id}/change-password` | Change password for a user |
| `POST` | `/api/admin/user-admin/reset-password` | Reset user password |
| `GET` | `/api/admin/user-admin` | Get all users and root roles |
| `POST` | `/api/admin/user-admin` | Create a new user |
| `GET` | `/api/admin/user-admin/search` | Search users |
| `GET` | `/api/admin/user-admin/access` | Get basic user and group information |
| `GET` | `/api/admin/user-admin/admin-count` | Get total count of admin accounts |
| `GET` | `/api/admin/user-admin/{id}` | Get user |
| `PUT` | `/api/admin/user-admin/{id}` | Update a user |
| `DELETE` | `/api/admin/user-admin/{id}` | Delete a user |
| `DELETE` | `/api/admin/user-admin/scim-users` | Delete all SCIM users |


### What this is not

Request/response JSON schemas, error codes per status, and generated examples still live in OpenAPI — they drift every minor release. The **operation list** is the literacy you need before generating a client.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Write an SDK | Client + Frontend tables only |
| Terraform / MCP / bot | Admin families you need; service account |
| Debug SPA flags | Frontend GET/POST + Edge `/all` |
| Impact metrics | Client `metrics/custom` |
| Kill switch automation | Admin feature enable/disable or Signals/Actions |

**Staff checklist**

- Know which of the four APIs a caller is on  
- Never put Admin tokens in SPAs  
- Treat this list as the contract; confirm schema on `/docs/openapi.json` for your version  

**Good:** backend SDK on Client API; humans/automation on Admin. **Bad:** `curl` Admin from every microservice on each request.

---

## References

- [Admin API overview](https://docs.getunleash.io/api/admin-api-overview)  
- [Client API overview](https://docs.getunleash.io/api/client-api-overview)  
- [Frontend API overview](https://docs.getunleash.io/api/frontend-api-overview)  
- [Edge API overview](https://docs.getunleash.io/api/edge-api-overview)  
- [API tokens](https://docs.getunleash.io/concepts/api-tokens-and-client-keys)  
