import { requireRole } from "@/lib/auth";
import { getOrCreateDemoUser } from "@/lib/demo";
import { prisma } from "@/lib/prisma";
import StatCard from "@/components/dashboard/StatCard";
import { stageOrder } from "@/lib/roles";
import Link from "next/link";
import { Sparkles, ArrowRight, Layers, Briefcase, Calendar, Clock, Video, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const role = await requireRole();

  if (role === "CANDIDATE") {
    const user = await getOrCreateDemoUser(role);
    const myApplications = await prisma.candidate.findMany({
      where: {
        OR: [
          { createdById: user.id },
          { email: user.email }
        ]
      },
      include: {
        job: true,
        interviews: {
          orderBy: { scheduledAt: "asc" }
        }
      },
      orderBy: { appliedAt: "desc" }
    });

    const totalApps = myApplications.length;
    const activeApps = myApplications.filter(a => a.stage !== "REJECTED" && a.stage !== "HIRED").length;
    const myInterviews = myApplications.flatMap(a => a.interviews.map(i => ({ ...i, jobTitle: a.job.title })));

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-indigo-100/50 bg-gradient-to-br from-white via-white to-indigo-50/30 p-8 shadow-premium">
          {/* Glow */}
          <div className="absolute right-0 top-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-indigo-500/5 blur-2xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600 border border-indigo-100/50">
                <Sparkles className="h-3 w-3" />
                Candidate Portal
              </span>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                Hello, {user.name}
              </h1>
              <p className="max-w-xl text-sm leading-relaxed text-slate-500">
                Track your active applications, review personalized AI coach recommendations, and prepare for upcoming interviews.
              </p>
            </div>
            <Link
              href="/jobs"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-5 py-3 text-xs font-semibold text-white transition-all duration-200 hover:bg-indigo-600 shadow-sm hover:shadow-indigo-600/10 hover:-translate-y-0.5 active:scale-95 shrink-0"
            >
              <span>Explore open positions</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* KPI Stats Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="My Applications"
            value={totalApps}
            caption="Total roles applied to"
          />
          <StatCard
            label="Active Applications"
            value={activeApps}
            caption="Applications currently under review"
          />
          <StatCard
            label="Upcoming Interviews"
            value={myInterviews.length}
            caption="Scheduled assessment rounds"
          />
        </div>

        {/* Applications List & Status */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-5">
            <h2 className="text-sm font-bold tracking-wide uppercase text-slate-400">
              Application Tracker ({totalApps})
            </h2>

            {totalApps === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center text-sm text-slate-500 space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                  <Briefcase className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">No applications yet</h3>
                  <p className="text-xs text-slate-500 mt-1">Browse open roles and apply using your PDF resume.</p>
                </div>
                <Link
                  href="/jobs"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:underline pt-2"
                >
                  <span>View Open Jobs</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {myApplications.map((app) => {
                  const appliedDate = new Date(app.appliedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  });

                  // Color scheme for candidate stage display
                  const badgeColors: Record<string, string> = {
                    APPLIED: "bg-slate-50 text-slate-600 border-slate-100",
                    SCREENED: "bg-sky-50 text-sky-655 border-sky-100",
                    INTERVIEW: "bg-amber-50 text-amber-655 border-amber-100",
                    OFFER: "bg-purple-50 text-purple-655 border-purple-100",
                    HIRED: "bg-emerald-50 text-emerald-655 border-emerald-100",
                    REJECTED: "bg-rose-50 text-rose-655 border-rose-100",
                  };

                  return (
                    <div
                      key={app.id}
                      className="rounded-3xl border border-slate-100 bg-white p-6 shadow-premium space-y-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-1">
                          <h3 className="text-base font-bold text-slate-900">
                            {app.job.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                            <span>{app.job.department || "General"}</span>
                            <span>•</span>
                            <span>{app.job.location || "Flexible"}</span>
                            <span>•</span>
                            <span>Applied on {appliedDate}</span>
                          </div>
                        </div>
                        <span className={`rounded-xl border px-3 py-1 text-xs font-bold uppercase tracking-wider ${badgeColors[app.stage] || badgeColors.APPLIED}`}>
                          {app.stage}
                        </span>
                      </div>

                      {/* AI Feedback Section (Candidate Coach) */}
                      {app.aiScore !== null && (
                        <div className="rounded-2xl bg-indigo-50/30 p-4 border border-indigo-100/50 space-y-2">
                          <div className="flex items-center gap-1.5 text-indigo-600">
                            <Sparkles className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">AI Resume Feedback ({app.aiScore}% Match)</span>
                          </div>
                          <p className="text-xs leading-relaxed text-slate-600 italic">
                            "{app.aiFeedback || 'Your resume has been successfully scanned and is under review.'}"
                          </p>
                        </div>
                      )}

                      {/* Timeline status indicator */}
                      <div className="pt-2">
                        <div className="relative flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-slate-100 -z-10" />
                          <span className={`px-2 py-0.5 rounded-md bg-white border ${app.stage === 'APPLIED' ? 'text-indigo-650 border-indigo-200 bg-indigo-50/20' : 'border-slate-100'}`}>Applied</span>
                          <span className={`px-2 py-0.5 rounded-md bg-white border ${app.stage === 'SCREENED' ? 'text-indigo-650 border-indigo-200 bg-indigo-50/20' : 'border-slate-100'}`}>Screened</span>
                          <span className={`px-2 py-0.5 rounded-md bg-white border ${app.stage === 'INTERVIEW' ? 'text-indigo-650 border-indigo-200 bg-indigo-50/20' : 'border-slate-100'}`}>Interview</span>
                          <span className={`px-2 py-0.5 rounded-md bg-white border ${app.stage === 'OFFER' ? 'text-indigo-650 border-indigo-200 bg-indigo-50/20' : 'border-slate-100'}`}>Offer</span>
                          <span className={`px-2 py-0.5 rounded-md bg-white border ${['HIRED', 'REJECTED'].includes(app.stage) ? 'text-indigo-650 border-indigo-200 bg-indigo-50/20' : 'border-slate-100'}`}>Decided</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Upcoming Interviews Side Bar */}
          <div className="space-y-5">
            <h2 className="text-sm font-bold tracking-wide uppercase text-slate-400">
              My Interviews ({myInterviews.length})
            </h2>

            {myInterviews.length === 0 ? (
              <div className="rounded-3xl border border-slate-100 bg-white p-6 text-center text-xs font-semibold text-slate-400 space-y-2">
                <Calendar className="h-5 w-5 text-slate-300 mx-auto" />
                <p>No interviews scheduled at this time.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myInterviews.map((interview) => {
                  const when = new Date(interview.scheduledAt).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short"
                  });

                  return (
                    <div
                      key={interview.id}
                      className="rounded-2xl border border-slate-100 bg-white p-5 shadow-premium space-y-4"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-bold text-slate-900 leading-tight">
                            {interview.jobTitle}
                          </span>
                          <span className="shrink-0 rounded-lg bg-indigo-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-indigo-600 border border-indigo-100/50">
                            Active
                          </span>
                        </div>
                        <div className="mt-3.5 space-y-2 text-[11px] text-slate-500">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            <span>{when}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                            <span>{interview.durationMinutes} minutes</span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-slate-50 pt-3 flex justify-between items-center">
                        {interview.meetingLink ? (
                          <a
                            href={interview.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 hover:underline"
                          >
                            <Video className="h-3.5 w-3.5" />
                            <span>Join Video Call</span>
                          </a>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>{interview.location || "Location details TBD"}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Recruiter Dashboard View
  const [openJobs, totalCandidates, avgScore, stageCounts] = await Promise.all([
    prisma.job.count({ where: { isOpen: true } }),
    prisma.candidate.count(),
    prisma.candidate.aggregate({ _avg: { aiScore: true } }),
    prisma.candidate.groupBy({
      by: ["stage"],
      _count: { stage: true }
    })
  ]);

  const stageMap = new Map(
    stageCounts.map((stage) => [stage.stage, stage._count.stage])
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-indigo-100/50 bg-gradient-to-br from-white via-white to-indigo-50/30 p-8 shadow-premium">
        {/* Glow */}
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-indigo-500/5 blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600 border border-indigo-100/50">
              <Sparkles className="h-3 w-3" />
              Active System Overview
            </span>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              AI-ready pipeline overview
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-slate-500">
              Track active roles, screen candidates using custom resume intelligence scoring, and visualize overall applicant status in one cohesive space.
            </p>
          </div>
          <Link
            href="/jobs"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-5 py-3 text-xs font-semibold text-white transition-all duration-200 hover:bg-indigo-600 shadow-sm hover:shadow-indigo-600/10 hover:-translate-y-0.5 active:scale-95 shrink-0"
          >
            <span>View open roles</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Open roles"
          value={openJobs}
          caption="Active job postings accepting applicants"
        />
        <StatCard
          label="Candidates"
          value={totalCandidates}
          caption="Total application files scanned"
        />
        <StatCard
          label="Avg. AI fit"
          value={avgScore._avg.aiScore ? `${Math.round(avgScore._avg.aiScore)}%` : "—"}
          caption="Matching coefficient across pipeline"
        />
      </div>

      {/* Snapshot Card */}
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-premium">
        <div className="flex items-center gap-2 border-b border-slate-50 pb-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
            <Layers className="h-4 w-4" />
          </div>
          <h2 className="text-sm font-bold text-slate-950">
            Candidate Pipeline Distribution
          </h2>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stageOrder.map((stage) => {
            const count = stageMap.get(stage.key) ?? 0;
            // Map keys to custom visual dot color
            const dotColor: Record<string, string> = {
              APPLIED: "bg-slate-400",
              SCREENED: "bg-sky-400",
              INTERVIEW: "bg-amber-400",
              OFFER: "bg-purple-400",
              HIRED: "bg-emerald-400",
              REJECTED: "bg-rose-400",
            };
            return (
              <div
                key={stage.key}
                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/30 p-4 transition-all duration-200 hover:border-slate-200/80 hover:bg-slate-50/70"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`h-2 w-2 rounded-full ${dotColor[stage.key] || 'bg-slate-400'}`} />
                  <span className="text-xs font-semibold text-slate-600">{stage.label}</span>
                </div>
                <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-slate-900 border border-slate-100 shadow-sm">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
