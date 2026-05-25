"use server";

import { revalidatePath } from "next/cache";
import type { Role, Stage } from "@prisma/client";
import { assertRole, requireRole } from "@/lib/auth";
import { getOrCreateDemoUser } from "@/lib/demo";
import { prisma } from "@/lib/prisma";
import { extractResumeText, scoreResume } from "@/lib/ai";

const candidateCreators: Role[] = [
  "ADMIN",
  "RECRUITER",
  "HIRING_MANAGER",
  "CANDIDATE"
];

const stageEditors: Role[] = [
  "ADMIN",
  "RECRUITER",
  "HIRING_MANAGER"
];

export async function createCandidate(input: {
  jobId: string;
  name: string;
  email: string;
  phone?: string | null;
  source?: string | null;
  resumeUrl: string;
}) {
  const role = await requireRole();
  assertRole(role, candidateCreators);
  const user = await getOrCreateDemoUser(role);

  const name = input.name.trim();
  const email = input.email.trim();
  const resumeUrl = input.resumeUrl.trim();

  if (!name || !email || !resumeUrl) {
    throw new Error("Name, email, and resume are required.");
  }

  const job = await prisma.job.findUnique({
    where: { id: input.jobId }
  });
  if (!job) {
    throw new Error("Job not found.");
  }

  const resumeText = await extractResumeText(resumeUrl);
  const ai = await scoreResume({
    jobTitle: job.title,
    jobDescription: job.description,
    resumeText
  });

  await prisma.candidate.create({
    data: {
      name,
      email,
      phone: input.phone?.trim() || null,
      source: input.source?.trim() || null,
      resumeUrl,
      resumeText,
      aiScore: ai.score,
      aiFeedback: ai.feedback,
      jobId: input.jobId,
      createdById: user.id
    }
  });

  revalidatePath(`/jobs/${input.jobId}`);
}

export async function updateCandidateStage(candidateId: string, stage: Stage) {
  const role = await requireRole();
  assertRole(role, stageEditors);

  const now = new Date();
  const data: {
    stage: Stage;
    stageUpdatedAt: Date;
    hiredAt?: Date | null;
    rejectedAt?: Date | null;
  } = {
    stage,
    stageUpdatedAt: now
  };

  if (stage === "HIRED") {
    data.hiredAt = now;
    data.rejectedAt = null;
  } else if (stage === "REJECTED") {
    data.rejectedAt = now;
    data.hiredAt = null;
  } else {
    data.hiredAt = null;
    data.rejectedAt = null;
  }

  const candidate = await prisma.candidate.update({
    where: { id: candidateId },
    data
  });

  revalidatePath(`/jobs/${candidate.jobId}`);
}
