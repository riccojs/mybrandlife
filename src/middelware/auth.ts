import jwt from "jsonwebtoken";
import { Request, Response, NextFunction, CookieOptions } from "express";
import status from "../utils/status.js";
import response from "../utils/response.js";
const { ERROR_STATUS, SUCCESS_STATUS } = status;
const { UNAUTHORIZE_ERROR_MESSAGE, LOGOUT_SUCCESSFUL_MESSAGE } = response;

/**
 * Single auth module for every app that talks to this one API
 * (main site, user dashboard, admin dashboard, BPS, staff).
 *
 * Why sessions used to collide: cookies belong to the API host, not to the
 * frontend that called it. Every frontend that calls the API with
 * `credentials: "include"` sends every cookie the API ever set. BPS users
 * and staff both used a cookie named `token`, so one login overwrote the other.
 *
 * The fix:
 *   1. Each role has its own cookie name, so logins never overwrite each other.
 *   2. Each token carries a `role` claim, and that claim must match the cookie
 *      it came from, so a token can't be moved into another role's cookie.
 *   3. Each route says which roles it accepts: `authenticate(ROLES.ADMIN)`.
 *   4. Optional: AUTH_APP_ORIGINS maps a frontend origin to a role. A request
 *      from that origin then only uses that role's cookie. For example, the
 *      admin dashboard can't act with a user cookie that's in the same browser.
 */

export const ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
  BPS: "BPS",
  STAFF: "STAFF",
} as const;
export type Role = (typeof ROLES)[keyof typeof ROLES];

export const AUTH_COOKIES: Record<Role, string> = {
  USER: "userToken",
  ADMIN: "adminToken",
  BPS: "bpsToken",
  STAFF: "staffToken",
};

const TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60;

export interface AuthPayload {
  id: string;
  email?: string;
  role: Role;
}

declare module "express-serve-static-core" {
  interface Request {
    userId: string;
    auth?: AuthPayload;
  }
}

const getSecret = () => {
  const secret = process.env.SECRET_KEY;
  if (!secret) throw new Error("SECRET_KEY is not configured");
  return secret;
};

const isRole = (value: unknown): value is Role =>
  typeof value === "string" && value in AUTH_COOKIES;

// AUTH_APP_ORIGINS="USER=https://user.mybrandlife.me,ADMIN=https://admin.mybrandlife.me"
// Read on each request, so tests and env reloads pick up changes.
const originRoleMap = (): Map<string, Role> => {
  const map = new Map<string, Role>();
  for (const pair of (process.env.AUTH_APP_ORIGINS ?? "").split(",")) {
    const [role, ...rest] = pair.split("=");
    const origin = rest.join("=").trim().replace(/\/+$/, "");
    const key = role?.trim().toUpperCase();
    if (isRole(key) && origin) map.set(origin, key);
  }
  return map;
};

const cookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  // Set only if you need the cookie shared across subdomains, e.g. ".mybrandlife.me".
  ...(process.env.COOKIE_DOMAIN ? { domain: process.env.COOKIE_DOMAIN } : {}),
});

export function signAuthToken(payload: AuthPayload): string {
  return jwt.sign(payload, getSecret(), { expiresIn: TOKEN_TTL_SECONDS });
}

/** Signs a token for `role` and stores it in that role's cookie. Returns the token. */
export function setAuthCookie(
  res: Response,
  payload: AuthPayload,
): string {
  const token = signAuthToken(payload);
  res.cookie(AUTH_COOKIES[payload.role], token, {
    ...cookieOptions(),
    maxAge: TOKEN_TTL_SECONDS * 1000,
  });
  return token;
}

export function clearAuthCookie(res: Response, role: Role) {
  res.clearCookie(AUTH_COOKIES[role], cookieOptions());
}

const verify = (token: string, allowed: Role[]): AuthPayload | null => {
  try {
    const decoded = jwt.verify(token, getSecret()) as Partial<AuthPayload>;
    if (!decoded?.id || !isRole(decoded.role)) return null;
    if (!allowed.includes(decoded.role)) return null;
    return { id: decoded.id, email: decoded.email, role: decoded.role };
  } catch {
    return null;
  }
};

const bearerToken = (req: Request): string | undefined => {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) return header.slice(7).trim();
  return undefined;
};

/** Finds the caller's identity for the allowed roles, or returns null. */
export function resolveAuth(req: Request, allowed: Role[]): AuthPayload | null {
  // If the request comes from a known frontend, only that frontend's role counts.
  const origin = req.headers.origin?.replace(/\/+$/, "");
  const originRole = origin ? originRoleMap().get(origin) : undefined;
  const candidates = originRole
    ? allowed.filter((r) => r === originRole)
    : allowed;

  // 1. Cookies. A cookie is only valid for its own role.
  for (const role of candidates) {
    const token = req.cookies?.[AUTH_COOKIES[role]];
    if (!token) continue;
    const payload = verify(token, [role]);
    if (payload) return payload;
  }

  // 2. Authorization: Bearer <token> for non-browser clients (mobile, scripts).
  const bearer = bearerToken(req);
  if (bearer) return verify(bearer, candidates);

  return null;
}

/**
 * The one auth middleware. Pass the roles a route accepts:
 *   router.get("/x", authenticate(ROLES.ADMIN), handler)
 *   router.get("/y", authenticate(ROLES.BPS, ROLES.STAFF), handler)
 * If it passes, `req.auth` is { id, email, role } and `req.userId` is the id.
 */
export function authenticate(...roles: Role[]) {
  const allowed = roles.length ? roles : (Object.keys(AUTH_COOKIES) as Role[]);
  return (req: Request, res: Response, next: NextFunction) => {
    const payload = resolveAuth(req, allowed);
    if (!payload) {
      return res.status(401).json({
        status: ERROR_STATUS,
        message: UNAUTHORIZE_ERROR_MESSAGE,
      });
    }
    req.auth = payload;
    req.userId = payload.id;
    next();
  };
}

/** Generic logout handler: clears that role's cookie only. Other sessions are not touched. */
export const logoutRole = (role: Role) => (_req: Request, res: Response) => {
  clearAuthCookie(res, role);
  res.status(200).json({
    status: SUCCESS_STATUS,
    message: LOGOUT_SUCCESSFUL_MESSAGE,
  });
};

// Shortcut used by the main-app routes (user + admin dashboards).
const auth = authenticate(ROLES.USER, ROLES.ADMIN);
export default auth;
