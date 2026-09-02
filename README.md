# @authara/browser

Minimal browser-side helpers for applications using **Authara**.

This package provides **explicit, framework-agnostic primitives** for integrating
browser-based UIs (SSR or SPA) with an Authara-backed authentication system.

It intentionally avoids hidden behavior, background state mutation, or
framework-specific abstractions.

---

## Design goals

- Explicit behavior (no magic, no background auth)
- Browser-only responsibility (cookies, CSRF, refresh)
- Framework-agnostic (React, Vue, Svelte, vanilla JS)
- Composable primitives + optional convenience helpers
- Zero dependencies

---

## Features

- Read Authara CSRF token from browser cookies
- Call every browser-facing Authara endpoint through the generated client
- Optional automatic session refresh **with audience selection**
- Optional `fetch` wrapper with **single-retry refresh semantics**
- No runtime dependencies

The regular JSON API client is generated from Authara's OpenAPI contract. It
includes the browser-facing `/auth/api/v1` endpoints and excludes internal
server-to-server endpoints.

---

## Installation

```bash
npm install @authara/browser
```

## Generated API client

```ts
import { AutharaBrowserClient } from "@authara/browser";

const authara = new AutharaBrowserClient();

const user = await authara.getCurrentUser();
await authara.updatePublicOrganization({
  organizationID: "organization-id",
  body: { name: "New name" },
});
```

The generated client uses browser cookies, includes credentials, attaches the
CSRF header when required by the contract, and throws `AutharaApiError` for
non-successful responses. By default, it does not refresh, retry, redirect, or
store tokens implicitly.

Every public and user operation under `/auth/api/v1` is generated. Internal
server-to-server operations under `/auth/internal/v1` are intentionally not
included in the browser SDK.

### Optional automatic refresh

Automatic refresh is enabled explicitly when constructing the client:

```ts
const authara = new AutharaBrowserClient({
  automaticRefresh: { audience: "app" },
});

const user = await authara.getCurrentUser();
```

With automatic refresh enabled, generated calls that receive `401 Unauthorized`
attempt one session refresh and retry once. A `403 Forbidden` response is not
refreshed because it represents insufficient permission, not an expired access
session. If refresh is disabled or unsuccessful, the generated call throws its
original `AutharaApiError`. Parallel protected calls share one in-flight refresh
per client instance.

The refresh and logout endpoints themselves are generated calls:

```ts
await authara.refreshSession({ audience: "app" });
await authara.logout();
```

---

## Usage

### Read CSRF token

```ts
import { getCSRFToken } from "@authara/browser";

const csrf = getCSRFToken();
```

Returns the value of the `authara_csrf` cookie, or `null` if not present.

This function only **reads** the CSRF token.
It does not generate or validate it.

---

## Fetch wrapper (optional convenience)

### `authFetch`

```ts
import { authFetch } from "@authara/browser";

const res = await authFetch("/api/data");
```

`authFetch` is an **optional convenience wrapper** around `fetch` with
Authara-aware refresh behavior.

### Behavior

1. Performs the request with credentials
2. If the response is **not `401`**, returns it directly
3. If the response **is `401`**:
   - Attempts `refreshSession()` with the same audience
   - If refresh succeeds, retries the original request **once**
   - Otherwise, returns the original `401` response

### Audience-aware requests

```ts
await authFetch("/admin/api/users", {}, { audience: "admin" });
```

- The same audience is used for the refresh attempt
- Unauthorized audiences fail cleanly without retry loops

### Important properties

- At most **one retry**
- No redirects
- No background refresh
- No swallowed failures

Applications remain fully in control of UX decisions.

---

## Example (React / SPA)

```ts
const res = await authFetch("/api/me");

if (res.status === 401) {
  setUser(null);
}
```

Admin request:

```ts
const res = await authFetch(
  "/admin/api/users",
  {},
  { audience: "admin" },
);
```

---

## Security model

- CSRF tokens are **not generated** by this package
- CSRF validation is **enforced by Authara**
- Refresh tokens are **never exposed to JavaScript**
- All authentication state is owned by Authara
- Audiences are **explicitly requested and server-validated**

This package only forwards existing browser state explicitly.

---

## What this package does NOT do

- No authentication logic
- No credential storage
- No background token refresh
- No session management
- No authorization or role handling
- No implicit redirects
- No framework-specific helpers

This package exists solely to reduce boilerplate and prevent integration mistakes
while preserving full application control.

---

## Compatibility

- Works with any backend protected by Authara
- Supports SSR, SPA, and hybrid architectures

---

## License
