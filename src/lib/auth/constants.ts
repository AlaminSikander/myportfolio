const secure = process.env.NODE_ENV === "production";

/** `__Host-` cookies must be Secure, so the prefix is only used in production. */
export const SESSION_COOKIE = secure ? "__Host-admin_session" : "admin_session";
export const SESSION_COOKIE_SECURE = secure;

export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
export const SESSION_RENEW_AFTER_MS = SESSION_TTL_MS / 2;

export const LOGIN_PATH = "/admin/login";
export const LOGIN_LOCKOUT = { windowMs: 15 * 60 * 1000, maxAttempts: 5 } as const;
