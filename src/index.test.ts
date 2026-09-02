import { describe, it, expect, beforeEach, vi } from "vitest";
import { getCSRFToken, authFetch } from "./index";

/* -------------------- getCSRFToken -------------------- */

describe("getCSRFToken", () => {
  beforeEach(() => {
    document.cookie = "authara_csrf=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  });

  it("returns csrf token if present", () => {
    document.cookie = "authara_csrf=token123";
    expect(getCSRFToken()).toBe("token123");
  });

  it("returns null if csrf token is missing", () => {
    expect(getCSRFToken()).toBeNull();
  });
});

/* -------------------- authFetch -------------------- */

describe("authFetch", () => {
  beforeEach(() => {
    document.cookie = "authara_csrf=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    vi.stubGlobal("fetch", vi.fn());
  });

  it("returns response if request succeeds", async () => {
    (fetch as any).mockResolvedValue({
      status: 200,
    } as Response);

    const res = await authFetch("/api/data");

    expect(fetch).toHaveBeenCalledOnce();
    expect(res.status).toBe(200);
  });

  it("returns 401 if refresh fails (default audience)", async () => {
    document.cookie = "authara_csrf=abc";

    (fetch as any)
      // initial request
      .mockResolvedValueOnce({ status: 401 } as Response)
      // refresh
      .mockResolvedValueOnce({ ok: false, status: 401 } as Response);

    const res = await authFetch("/api/data");

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenNthCalledWith(
      2,
      "/auth/api/v1/sessions/refresh?audience=app",
      expect.any(Object),
    );
    expect(res.status).toBe(401);
  });

  it("retries request once if refresh succeeds (default audience)", async () => {
    document.cookie = "authara_csrf=abc";

    (fetch as any)
      // initial request
      .mockResolvedValueOnce({ status: 401 } as Response)
      // refresh
      .mockResolvedValueOnce({ ok: true, status: 200 } as Response)
      // retry
      .mockResolvedValueOnce({ status: 200 } as Response);

    const res = await authFetch("/api/data");

    expect(fetch).toHaveBeenCalledTimes(3);
    expect(res.status).toBe(200);
  });

  it("refreshes with explicit admin audience", async () => {
    document.cookie = "authara_csrf=abc";

    (fetch as any)
      .mockResolvedValueOnce({ status: 401 } as Response)
      .mockResolvedValueOnce({ ok: true, status: 200 } as Response)
      .mockResolvedValueOnce({ status: 200 } as Response);

    const res = await authFetch("/admin/api/users", {}, { audience: "admin" });

    expect(fetch).toHaveBeenNthCalledWith(
      2,
      "/auth/api/v1/sessions/refresh?audience=admin",
      expect.any(Object),
    );
    expect(res.status).toBe(200);
  });
});
