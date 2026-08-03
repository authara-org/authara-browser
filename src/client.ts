import { getCSRFToken } from "./cookies.js";

type QueryValue = string | number | boolean | Array<string | number | boolean>;

export type AutharaClientOptions = {
  /** Optional absolute Authara origin. Empty means same-origin requests. */
  baseUrl?: string;
  /** Optional fetch implementation for tests or custom transports. */
  fetch?: typeof globalThis.fetch;
};

export class AutharaApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly response: Response;

  constructor(
    status: number,
    response: Response,
    message = `Authara request failed (${status})`,
    code?: string,
  ) {
    super(message);
    this.name = "AutharaApiError";
    this.status = status;
    this.code = code;
    this.response = response;
  }
}

export class AutharaCSRFError extends Error {
  constructor() {
    super("Authara CSRF token is missing");
    this.name = "AutharaCSRFError";
  }
}

export class AutharaClient {
  private readonly baseUrl: string;
  private readonly fetchImpl?: typeof globalThis.fetch;

  constructor(options: AutharaClientOptions = {}) {
    this.baseUrl = options.baseUrl?.replace(/\/$/, "") ?? "";
    this.fetchImpl = options.fetch;
  }

  protected async request<T>(
    method: string,
    path: string,
    options: {
      query?: Record<string, QueryValue | undefined>;
      body?: unknown;
      csrf?: boolean;
    } = {},
  ): Promise<T> {
    const query = new URLSearchParams();
    for (const [name, value] of Object.entries(options.query ?? {})) {
      if (value === undefined) continue;
      if (Array.isArray(value)) {
        for (const item of value) query.append(name, String(item));
      } else {
        query.set(name, String(value));
      }
    }

    const queryString = query.toString();
    const requestPath = queryString ? `${path}?${queryString}` : path;
    const url = this.baseUrl
      ? new URL(requestPath, `${this.baseUrl}/`).toString()
      : requestPath;

    const headers: Record<string, string> = {};
    if (options.body !== undefined) {
      headers["Content-Type"] = "application/json";
    }
    if (options.csrf) {
      const csrf = getCSRFToken();
      if (!csrf) throw new AutharaCSRFError();
      headers["X-CSRF-Token"] = csrf;
    }

    const fetchImpl = this.fetchImpl ?? globalThis.fetch;
    if (!fetchImpl) throw new Error("fetch is not available");

    const response = await fetchImpl(url, {
      method,
      headers,
      credentials: "include",
      ...(options.body === undefined
        ? {}
        : { body: JSON.stringify(options.body) }),
    });

    if (!response.ok) {
      const payload = await this.readJSON(response);
      const error = payload?.error;
      throw new AutharaApiError(
        response.status,
        response,
        error?.message,
        error?.code,
      );
    }

    if (response.status === 204) return undefined as T;
    return (await this.readJSON(response)) as T;
  }

  private async readJSON(response: Response): Promise<any> {
    if (typeof response.json !== "function") return undefined;
    try {
      return await response.json();
    } catch {
      return undefined;
    }
  }
}
