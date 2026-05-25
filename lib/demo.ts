import type { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const demoProfiles: Record<Role, { name: string; email: string }> = {
  ADMIN: { name: "Jordan Lee", email: "admin@hireflow.demo" },
  RECRUITER: { name: "Avery Chen", email: "recruiter@hireflow.demo" },
  HIRING_MANAGER: { name: "Morgan Reed", email: "manager@hireflow.demo" },
  CANDIDATE: { name: "Taylor Quinn", email: "candidate@hireflow.demo" }
};

export async function getOrCreateDemoUser(role: Role) {
  const profile = demoProfiles[role];
  return prisma.user.upsert({
    where: { email: profile.email },
    update: { role },
    create: {
      name: profile.name,
      email: profile.email,
      role
    }
  });
}
