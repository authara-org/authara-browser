import { describe, expect, it, vi } from "vitest";
import { AutharaBrowserClient } from "./generated/api";

describe("generated regular API", () => {
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
});
