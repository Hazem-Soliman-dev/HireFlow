"use server";

import { revalidatePath } from "next/cache";
import type { Role } from "@prisma/client";
import { assertRole, requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendInterviewEmail } from "@/lib/email";

const interviewEditors: Role[] = ["ADMIN", "RECRUITER", "HIRING_MANAGER"];

export async function scheduleInterview(input: {
  candidateId: string;
  scheduledAt: string;
  durationMinutes: number;
  interviewerName: string;
  interviewerEmail: string;
  meetingLink?: string | null;
  location?: string | null;
}) {
  const role = await requireRole();
  assertRole(role, interviewEditors);

  const scheduledAt = new Date(input.scheduledAt);
  if (!input.candidateId || Number.isNaN(scheduledAt.getTime())) {
    throw new Error("Candidate and valid schedule time are required.");
  }
  if (!input.interviewerName.trim() || !input.interviewerEmail.trim()) {
    throw new Error("Interviewer name and email are required.");
  }

  const candidate = await prisma.candidate.findUnique({
    where: { id: input.candidateId },
    include: { job: true }
  });
  if (!candidate) {
    throw new Error("Candidate not found.");
  }

  const now = new Date();
  const [interview] = await prisma.$transaction([
    prisma.interview.create({
      data: {
        candidateId: input.candidateId,
        scheduledAt,
        durationMinutes: input.durationMinutes || 45,
        interviewerName: input.interviewerName.trim(),
        interviewerEmail: input.interviewerEmail.trim(),
        meetingLink: input.meetingLink?.trim() || null,
        location: input.location?.trim() || null
      }
    }),
    prisma.candidate.update({
      where: { id: input.candidateId },
      data: {
        stage: "INTERVIEW",
        stageUpdatedAt: now
      }
    })
  ]);

  await sendInterviewEmail({
    candidateEmail: candidate.email,
    candidateName: candidate.name,
    interviewerEmail: input.interviewerEmail.trim(),
    interviewerName: input.interviewerName.trim(),
    jobTitle: candidate.job.title,
    scheduledAt: interview.scheduledAt,
    meetingLink: interview.meetingLink,
    location: interview.location,
    durationMinutes: interview.durationMinutes
  });

  revalidatePath(`/jobs/${candidate.jobId}`);
}
