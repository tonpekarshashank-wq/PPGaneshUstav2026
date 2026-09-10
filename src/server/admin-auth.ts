import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const cookieName = "ppg_admin_session";
const maxAgeSeconds = 60 * 60 * 8;

function adminEmail() {
  return process.env.ADMIN_EMAIL ?? "";
}

function adminPassword() {
  return process.env.ADMIN_PASSWORD ?? "";
}

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? process.env.BOOKING_MOBILE_HASH_SECRET ?? "local-dev-session-secret";
}

function sign(value: string) {
  return crypto.createHmac("sha256", sessionSecret()).update(value).digest("hex");
}

export function isAdminAuthConfigured() {
  return Boolean(adminEmail() && adminPassword());
}

export function verifyAdminCredentials(email: string, password: string) {
  return isAdminAuthConfigured() && email.trim().toLowerCase() === adminEmail().trim().toLowerCase() && password === adminPassword();
}

export async function createAdminSession() {
  const issuedAt = Date.now().toString();
  const value = `${issuedAt}.${sign(issuedAt)}`;
  const cookieStore = await cookies();
  cookieStore.set(cookieName, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: maxAgeSeconds
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
}

export async function hasAdminSession() {
  const cookieStore = await cookies();
  const value = cookieStore.get(cookieName)?.value;
  if (!value) return false;
  const [issuedAt, signature] = value.split(".");
  if (!issuedAt || !signature) return false;
  const ageMs = Date.now() - Number(issuedAt);
  if (!Number.isFinite(ageMs) || ageMs > maxAgeSeconds * 1000) return false;
  const expectedSignature = sign(issuedAt);
  if (signature.length !== expectedSignature.length) return false;
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
}

export async function requireAdminSession() {
  if (!(await hasAdminSession())) {
    redirect("/admin/login");
  }
}
