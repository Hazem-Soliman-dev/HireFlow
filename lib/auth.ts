import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";

const ROLE_COOKIE = "hf_role";

const allowedRoles: Role[] = ["ADMIN", "RECRUITER", "HIRING_MANAGER", "CANDIDATE"];

export async function getRole(): Promise<Role | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(ROLE_COOKIE)?.value ?? null;
  if (!cookie) return null;
  if (!allowedRoles.includes(cookie as Role)) return null;
  return cookie as Role;
}

export async function requireRole(): Promise<Role> {
  const role = await getRole();
  if (!role) redirect("/login");
  return role;
}

export function assertRole(role: Role, allowed: Role[]) {
  if (!allowed.includes(role)) {
    throw new Error("You do not have permission to perform this action.");
  }
}

export async function setRole(role: Role) {
  if (!allowedRoles.includes(role)) {
    throw new Error("Invalid role selection.");
  }

  const cookieStore = await cookies();
  cookieStore.set(ROLE_COOKIE, role, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/"
  });
}

export async function clearRole() {
  const cookieStore = await cookies();
  cookieStore.delete(ROLE_COOKIE);
}
