"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";
import { assertRole, requireRole } from "@/lib/auth";
import { getOrCreateDemoUser } from "@/lib/demo";
import { prisma } from "@/lib/prisma";

const jobEditors: Role[] = ["ADMIN", "RECRUITER", "HIRING_MANAGER"];

export async function createJob(formData: FormData) {
  const role = await requireRole();
  assertRole(role, jobEditors);
  const user = await getOrCreateDemoUser(role);

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const department = String(formData.get("department") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();

  if (!title || !description) {
    throw new Error("Job title and description are required.");
  }

  const job = await prisma.job.create({
    data: {
      title,
      description,
      department: department || null,
      location: location || null,
      createdById: user.id
    }
  });

  revalidatePath("/jobs");
  redirect(`/jobs/${job.id}`);
}

export async function closeJob(jobId: string) {
  const role = await requireRole();
  assertRole(role, jobEditors);

  await prisma.job.update({
    where: { id: jobId },
    data: {
      isOpen: false,
      closedAt: new Date()
    }
  });

  revalidatePath(`/jobs/${jobId}`);
  revalidatePath("/jobs");
}

export async function reopenJob(jobId: string) {
  const role = await requireRole();
  assertRole(role, jobEditors);

  await prisma.job.update({
    where: { id: jobId },
    data: {
      isOpen: true,
      closedAt: null
    }
  });

  revalidatePath(`/jobs/${jobId}`);
  revalidatePath("/jobs");
}

export async function editJob(formData: FormData) {
  const role = await requireRole();
  assertRole(role, jobEditors);

  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const department = String(formData.get("department") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();

  if (!id || !title || !description) {
    throw new Error("Job ID, title, and description are required.");
  }

  await prisma.job.update({
    where: { id },
    data: {
      title,
      description,
      department: department || null,
      location: location || null
    }
  });

  revalidatePath(`/jobs/${id}`);
  revalidatePath("/jobs");
}

export async function deleteJob(jobId: string) {
  const role = await requireRole();
  assertRole(role, jobEditors);

  await prisma.$transaction([
    prisma.interview.deleteMany({ where: { candidate: { jobId } } }),
    prisma.candidate.deleteMany({ where: { jobId } }),
    prisma.job.delete({ where: { id: jobId } })
  ]);

  revalidatePath("/jobs");
  redirect("/jobs");
}
