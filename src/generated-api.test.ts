import { beforeEach, describe, expect, it, vi } from "vitest";
import { AutharaApiError } from "./client";
import { AutharaBrowserClient } from "./generated/api";

describe("generated regular API", () => {
  beforeEach(() => {
    document.cookie = "authara_csrf=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  });

  it("serializes a typed request with browser credentials and CSRF", async () => {
    document.cookie = "authara_csrf=csrf-token";
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ challenge_id: "challenge-1" }),
    });
    const client = new AutharaBrowserClient({ fetch: fetchImpl });

    const result = await client.startSignupChallenge({
      audience: "app",
      body: { email: "user@example.com", password: "password" },
    });

    expect(result).toEqual({ challenge_id: "challenge-1" });
    expect(fetchImpl).toHaveBeenCalledWith(
      "/auth/api/v1/signup/challenges?audience=app",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": "csrf-token",
        },
        credentials: "include",
        body: JSON.stringify({
          email: "user@example.com",
          password: "password",
        }),
      },
    );
  });

  it("does not refresh unless automatic refresh is configured", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
    } as Response);
    const client = new AutharaBrowserClient({ fetch: fetchImpl });

    await expect(client.getCurrentUser()).rejects.toBeInstanceOf(
      AutharaApiError,
    );
    expect(fetchImpl).toHaveBeenCalledOnce();
  });

  it("refreshes and retries a generated call once after a 401", async () => {
    document.cookie = "authara_csrf=csrf-token";
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 401 } as Response)
      .mockResolvedValueOnce({ ok: true, status: 204 } as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ id: "user-1" }),
      } as Response);
    const client = new AutharaBrowserClient({
      fetch: fetchImpl,
      automaticRefresh: { audience: "admin" },
    });

    await expect(client.getCurrentUser()).resolves.toEqual({ id: "user-1" });
    expect(fetchImpl).toHaveBeenCalledTimes(3);
    expect(fetchImpl).toHaveBeenNthCalledWith(
      2,
      "/auth/api/v1/sessions/refresh?audience=admin",
      {
        method: "POST",
        headers: { "X-CSRF-Token": "csrf-token" },
        credentials: "include",
      },
    );
  });

  it("does not refresh a forbidden request", async () => {
    document.cookie = "authara_csrf=csrf-token";
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: false,
      status: 403,
    } as Response);
    const client = new AutharaBrowserClient({
      fetch: fetchImpl,
      automaticRefresh: { audience: "app" },
    });

    await expect(client.getCurrentUser()).rejects.toMatchObject({
      status: 403,
    });
    expect(fetchImpl).toHaveBeenCalledOnce();
  });

  it("does not refresh a public operation", async () => {
    document.cookie = "authara_csrf=csrf-token";
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
    } as Response);
    const client = new AutharaBrowserClient({
      fetch: fetchImpl,
      automaticRefresh: { audience: "app" },
    });

    await expect(
      client.loginWithPassword({
        audience: "app",
        body: { email: "user@example.com", password: "wrong" },
      }),
    ).rejects.toMatchObject({ status: 401 });
    expect(fetchImpl).toHaveBeenCalledOnce();
  });

  it("shares one refresh between parallel protected calls", async () => {
    document.cookie = "authara_csrf=csrf-token";
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 401 } as Response)
      .mockResolvedValueOnce({ ok: false, status: 401 } as Response)
      .mockResolvedValueOnce({ ok: true, status: 204 } as Response)
      .mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ id: "user-1" }),
      } as Response);
    const client = new AutharaBrowserClient({
      fetch: fetchImpl,
      automaticRefresh: { audience: "app" },
    });

    await Promise.all([
      client.getCurrentUser(),
      client.listCurrentUserOrganizations(),
    ]);

    expect(
      fetchImpl.mock.calls.filter(
        ([url]) => url === "/auth/api/v1/sessions/refresh?audience=app",
      ),
    ).toHaveLength(1);
  });
});
