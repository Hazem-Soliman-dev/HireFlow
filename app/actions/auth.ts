"use server";

import { redirect } from "next/navigation";
import { setRole } from "@/lib/auth";
import type { Role } from "@prisma/client";

export async function setRoleAction(formData: FormData) {
  const role = formData.get("role") as Role | null;
  if (!role) {
    throw new Error("Role selection is required.");
  }
  await setRole(role);
  redirect("/");
}
