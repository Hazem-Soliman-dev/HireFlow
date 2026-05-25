import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { createJob } from "@/app/actions/jobs";
import JobCard from "@/components/jobs/JobCard";
import { NewJobForm } from "@/components/jobs/NewJobForm";
import { Briefcase, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function JobsPage() {
  const role = await requireRole();
  const canCreate = ["ADMIN", "RECRUITER", "HIRING_MANAGER"].includes(role);
  const jobs = await prisma.job.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          candidates: true
        }
      }
    }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 shadow-premium">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-indigo-500/5 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex items-center gap-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50/70 text-indigo-600 border border-indigo-100/30">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 font-display">Job Postings</h1>
            <p className="text-xs text-slate-500 mt-0.5 font-sans">
              Create, publish, and manage open roles with real-time AI matching.
            </p>
          </div>
        </div>
      </div>

      {/* Write Access Check */}
      {canCreate ? (
        <NewJobForm action={createJob} />
      ) : (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-100 bg-amber-50/40 p-5 text-xs text-amber-800 shadow-[inset_0_1px_2px_rgba(245,158,11,0.01)]">
          <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
          <p className="font-semibold leading-relaxed">
            You have read-only access to job postings in this role view. Switch perspectives to create new postings.
          </p>
        </div>
      )}

      {/* Grid List */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold tracking-wide uppercase text-slate-400">
          All Positions ({jobs.length})
        </h2>
        <div className="grid gap-5 md:grid-cols-2">
          {jobs.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
              No jobs yet. Create your first role to start screening candidates.
            </div>
          ) : null}
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} count={job._count.candidates} />
          ))}
        </div>
      </div>
    </div>
  );
}
