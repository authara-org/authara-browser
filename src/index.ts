import { AutharaBrowserClient } from "./generated/api.js";
export * from "./generated/api.js";
export * from "./generated/types.js";
export { AutharaApiError, AutharaCSRFError, AutharaClient } from "./client.js";
export type { AutharaAudience, AutharaClientOptions } from "./client.js";
export { getCookie, getCSRFToken } from "./cookies.js";

const api = new AutharaBrowserClient();

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
  opts?: { audience?: "app" | "admin" },
): Promise<Response> {
  const audience = opts?.audience ?? "app";

  const res = await fetch(input, withCredentials(init));
  if (res.status !== 401) {
    return res;
  }

  let refreshed = false;
  try {
    await api.refreshSession({ audience });
    refreshed = true;
  } catch {
    refreshed = false;
  }

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
