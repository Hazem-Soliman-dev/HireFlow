import type { Role, Stage } from "@prisma/client";

export const roleLabels: Record<Role, string> = {
  ADMIN: "HR Admin",
  RECRUITER: "Recruiter",
  HIRING_MANAGER: "Hiring Manager",
  CANDIDATE: "Candidate"
};

export const roleDescriptions: Record<Role, string> = {
  ADMIN: "Owns system settings, hiring policies, and approvals.",
  RECRUITER: "Manages job postings and candidate pipeline.",
  HIRING_MANAGER: "Reviews candidates and gives feedback.",
  CANDIDATE: "Applies to roles and tracks status."
};

export const stageOrder: { key: Stage; label: string; tone: string }[] = [
  { key: "APPLIED", label: "Applied", tone: "bg-slate-100 text-slate-700" },
  { key: "SCREENED", label: "Screened", tone: "bg-sky-100 text-sky-700" },
  { key: "INTERVIEW", label: "Interview", tone: "bg-amber-100 text-amber-700" },
  { key: "OFFER", label: "Offer", tone: "bg-violet-100 text-violet-700" },
  { key: "HIRED", label: "Hired", tone: "bg-emerald-100 text-emerald-700" },
  { key: "REJECTED", label: "Rejected", tone: "bg-rose-100 text-rose-700" }
];
