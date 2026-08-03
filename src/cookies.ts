/** Reads a browser cookie, or null when it is not available. */
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const prefix = `${name}=`;
  const cookie = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));

  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : null;
}

/** Returns the CSRF token issued by Authara for browser requests. */
export function getCSRFToken(): string | null {
  return getCookie("authara_csrf");
}
