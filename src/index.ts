import { AutharaBrowserClient } from "./generated/api.js";
import { AutharaApiError } from "./client.js";
import { getCSRFToken } from "./cookies.js";
export * from "./generated/api.js";
export * from "./generated/types.js";
export { AutharaApiError, AutharaCSRFError, AutharaClient } from "./client.js";
export type { AutharaClientOptions } from "./client.js";
export { getCookie, getCSRFToken } from "./cookies.js";
import type * as API from "./generated/types.js";

const api = new AutharaBrowserClient();

/**
 * The result of a logout attempt.
 *
 * - `{ ok: true }` indicates that logout succeeded.
 * - `{ ok: false, reason }` indicates that logout failed for a known reason.
 */
export type LogoutResult =
  | { ok: true }
  | { ok: false; reason: "missing_csrf" | "request_failed" | "unauthorized" };

/**
 * Logs the user out by calling the Authara logout endpoint.
 *
 * This function:
 * - Reads the CSRF token from the browser cookies
 * - Sends a POST request to `/auth/api/v1/sessions/logout`
 * - Optionally redirects the browser on success
 *
 * Redirecting is a side-effect and does not define success. Applications
 * that need to react to logout programmatically (e.g. SPA state updates)
 * should inspect the returned result instead.
 *
 * @param opts.redirectTo Optional URL to redirect to after successful logout.
 * @returns A `LogoutResult` indicating whether logout succeeded or failed.
 */
export async function logout(opts?: {
  redirectTo?: string;
}): Promise<LogoutResult> {
  const csrf = getCSRFToken();

  if (!csrf) {
    return { ok: false, reason: "missing_csrf" };
  }

  try {
    await api.logout();
  } catch (error) {
    return {
      ok: false,
      reason:
        error instanceof AutharaApiError &&
        (error.status === 401 || error.status === 403)
          ? "unauthorized"
          : "request_failed",
    };
  }

  if (opts?.redirectTo) {
    window.location.href = opts.redirectTo;
  }

  return { ok: true };
}

/**
 * authFetch performs a fetch request with Authara-aware, refresh-once behavior
 * for a specific audience.
 *
 * Behavior:
 * - Always includes credentials
 * - Performs the initial request as-is
 * - If the response is NOT 401, returns it directly
 * - If the response IS 401:
 *   - Attempts POST /auth/api/v1/sessions/refresh with CSRF and the same requested audience
 *   - If refresh succeeds, retries the original request ONCE
 *   - If refresh fails, returns the original 401 response
 *
 * authFetch never redirects or mutates application state. Callers are expected
 * to handle authentication failures explicitly.
 *
 * @param input The resource to fetch (same as `fetch`).
 * @param init Optional fetch options. Credentials are always included.
 * @param opts Optional Authara options.
 * @param opts.audience The audience for which the request is made (e.g. "app", "admin").
 *        Defaults to "app".
 * @returns The final `Response` from the original request or the retried request.
 */
export async function authFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
  opts?: { audience?: string },
): Promise<Response> {
  const audience = opts?.audience ?? "app";

  const res = await fetch(input, withCredentials(init));
  if (res.status !== 401) {
    return res;
  }

  const refreshed = await refreshSession(audience);
  if (!refreshed) {
    return res;
  }

  return fetch(input, withCredentials(init));
}

function withCredentials(init: RequestInit): RequestInit {
  return {
    ...init,
    credentials: "include",
  };
}

/**
 * refreshSession attempts to refresh the current Authara session for a
 * specific audience.
 *
 * It performs:
 *   POST /auth/api/v1/sessions/refresh
 *   with CSRF protection, credentials, and an explicit audience declaration.
 *
 * The server validates the requested audience against the user's roles and
 * rejects the request if the audience is not permitted.
 *
 * @param audience The audience for which a new access token should be minted.
 *        Defaults to "app".
 * @returns `true` if the refresh succeeded, or `false` if refresh failed for
 *          any reason (unauthorized, expired session, or error).
 */
export async function refreshSession(
  audience: string = "app",
): Promise<boolean> {
  const csrf = getCSRFToken();
  if (!csrf) {
    return false;
  }

  try {
    await api.refreshSession({ audience: audience as "app" | "admin" });
    return true;
  } catch {
    return false;
  }
}

/**
 * Fetches the currently authenticated user's identity.
 *
 * Behavior:
 * - Calls GET /auth/api/v1/user using credentials (cookies)
 * - If the access token is expired, the helper attempts a single refresh
 * - If refresh succeeds, the request is retried once
 * - If the user is not authenticated, returns null
 *
 * This function never throws for authentication failures.
 *
 * @param opts Optional options.
 * @param opts.audience The audience for which authentication should be ensured
 *        (e.g. "app", "admin"). Defaults to "app".
 *
 * @returns The current user object if authenticated, or `null` otherwise.
 */
export async function getCurrentUser(opts?: {
  audience?: string;
}): Promise<API.CurrentUser | null> {
  try {
    return (await api.getCurrentUser()) ?? null;
  } catch (error) {
    if (!(error instanceof AutharaApiError) || error.status !== 401) {
      return null;
    }

    if (!(await refreshSession(opts?.audience ?? "app"))) return null;

    try {
      return (await api.getCurrentUser()) ?? null;
    } catch {
      return null;
    }
  }
}
