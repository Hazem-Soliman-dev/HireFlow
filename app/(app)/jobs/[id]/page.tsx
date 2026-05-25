import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { closeJob, reopenJob } from "@/app/actions/jobs";
import EditJobModal from "@/components/jobs/EditJobModal";
import DeleteJobButton from "@/components/jobs/DeleteJobButton";
import CandidateForm from "@/components/candidates/CandidateForm";
import PipelineBoard from "@/components/candidates/PipelineBoard";
import InterviewList from "@/components/interviews/InterviewList";
import ScheduleInterviewForm from "@/components/interviews/ScheduleInterviewForm";
import { stageOrder } from "@/lib/roles";
import { requireRole } from "@/lib/auth";
import { getOrCreateDemoUser } from "@/lib/demo";
import { Building2, MapPin, Briefcase, CalendarRange, Users2, XCircle, Calendar, Clock, Video, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function JobDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const role = await requireRole();
  const user = await getOrCreateDemoUser(role);
  const canClose = ["ADMIN", "RECRUITER", "HIRING_MANAGER"].includes(role);
  const canSchedule = ["ADMIN", "RECRUITER", "HIRING_MANAGER"].includes(role);

  const [job, interviews, myCandidate] = await Promise.all([
    prisma.job.findUnique({
      where: { id },
      include: {
        candidates: {
          include: {
            interviews: {
              orderBy: { scheduledAt: "asc" }
            }
          },
          orderBy: { appliedAt: "desc" }
        }
      }
    }),
    prisma.interview.findMany({
      where: {
        candidate: {
          jobId: id
        }
      },
      include: {
        candidate: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        scheduledAt: "asc"
      }
    }),
    role === "CANDIDATE"
      ? prisma.candidate.findFirst({
        where: {
          jobId: id,
          OR: [
            { createdById: user.id },
            { email: user.email }
          ]
        },
        include: {
          interviews: {
            orderBy: { scheduledAt: "asc" }
          }
        }
      })
      : Promise.resolve(null)
  ]);

  if (!job) {
    notFound();
  }

  if (role === "CANDIDATE") {
    const hasApplied = !!myCandidate;

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
        {/* Job Info Header Card */}
        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-premium">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4 w-full">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-655 shrink-0">
                  <Briefcase className="h-4.5 w-4.5" />
                </span>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  {job.title}
                </h1>
                <span
                  className={`rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${job.isOpen
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                    : "bg-slate-50 text-slate-500 border border-slate-100"
                    }`}
                >
                  {job.isOpen ? "Active" : "Closed"}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-slate-450" />
                  <span>{job.department || "General"}</span>
                </div>
                <span className="text-slate-350">•</span>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-slate-455" />
                  <span>{job.location || "Flexible"}</span>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50/50 p-4 border border-slate-100/50">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Role Description</h3>
                <p className="text-sm leading-relaxed text-slate-600">{job.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action / Stepper section */}
        {hasApplied ? (
          <div className="space-y-8">
            {/* Stepper Card */}
            <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-premium space-y-6">
              <h2 className="text-sm font-bold text-slate-950">Application Status</h2>

              <div className="relative">
                {/* Connection Line */}
                <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-100 -z-10 hidden md:block" />

                <div className="grid gap-6 md:grid-cols-5 text-center">
                  {stageOrder
                    .filter(s => s.key !== "REJECTED")
                    .map((stageItem, index) => {
                      const stagesList = ["APPLIED", "SCREENED", "INTERVIEW", "OFFER", "HIRED"];
                      const currentIdx = stagesList.indexOf(myCandidate.stage);
                      const itemIdx = stagesList.indexOf(stageItem.key);

                      const isCompleted = itemIdx < currentIdx;
                      const isActive = itemIdx === currentIdx;

                      let dotStyle = "bg-slate-50 border-slate-200 text-slate-400";
                      if (isCompleted) {
                        dotStyle = "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-550/20";
                      } else if (isActive) {
                        dotStyle = "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-650/20";
                      }

                      return (
                        <div key={stageItem.key} className="flex flex-col items-center gap-2">
                          <div className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-300 ${dotStyle}`}>
                            {isCompleted ? "✓" : index + 1}
                          </div>
                          <div>
                            <p className={`text-xs font-bold ${isActive ? 'text-indigo-600' : isCompleted ? 'text-emerald-650' : 'text-slate-400'}`}>
                              {stageItem.label}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Status Alert Coach Feedback */}
              <div className={`rounded-2xl p-5 border ${myCandidate.stage === "HIRED"
                ? "bg-emerald-50/50 border-emerald-100 text-emerald-800"
                : myCandidate.stage === "REJECTED"
                  ? "bg-rose-50/50 border-rose-100 text-rose-800"
                  : "bg-indigo-50/30 border-indigo-100/50 text-slate-800"
                }`}>
                <div className="flex items-start gap-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white shrink-0 mt-0.5">
                    {myCandidate.stage === "HIRED" ? (
                      <span className="text-xs text-emerald-600 font-bold">✓</span>
                    ) : myCandidate.stage === "REJECTED" ? (
                      <span className="text-xs text-rose-600 font-bold">✗</span>
                    ) : (
                      <span className="text-xs text-indigo-600 font-bold">i</span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider">
                      {myCandidate.stage === "HIRED" ? (
                        "Congratulations!"
                      ) : myCandidate.stage === "REJECTED" ? (
                        "Application Closed"
                      ) : (
                        "Application Under Review"
                      )}
                    </h4>
                    <p className="text-xs leading-relaxed text-slate-650 mt-1">
                      {myCandidate.stage === "HIRED" ? (
                        "You have been hired for this role! The HR team will contact you shortly with the onboarding package."
                      ) : myCandidate.stage === "REJECTED" ? (
                        "Thank you for your interest and the time you spent applying. We've decided to move forward with other candidates at this time, but we will keep your resume on file for future openings."
                      ) : (
                        "Your application has been received and is currently under review by our recruiting team. We will contact you if your profile matches the role requirements."
                      )}
                    </p>

                    {myCandidate.aiScore !== null && (
                      <div className="mt-3.5 pt-3 border-t border-slate-100/50 space-y-1">
                        <span className="text-[10px] font-bold text-indigo-650 uppercase tracking-widest flex items-center gap-1">
                          <Sparkles className="h-3.5 w-3.5" />
                          AI Fit Coach Feedback ({myCandidate.aiScore}% Match)
                        </span>
                        <p className="text-xs italic text-slate-600 mt-1">
                          "{myCandidate.aiFeedback || 'Your resume is a good fit for this role.'}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Interviews Card for Candidate */}
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-premium space-y-6">
              <h2 className="text-sm font-bold text-slate-950">My Scheduled Interviews</h2>
              {myCandidate.interviews.length === 0 ? (
                <div className="rounded-2xl border border-slate-100 bg-slate-50/20 p-8 text-center text-xs font-semibold text-slate-400">
                  No interview rounds scheduled yet.
                </div>
              ) : (
                <div className="grid gap-4.5 sm:grid-cols-2">
                  {myCandidate.interviews.map((interview) => {
                    const when = new Date(interview.scheduledAt).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short"
                    });

                    return (
                      <div
                        key={interview.id}
                        className="rounded-2xl border border-slate-100 bg-white p-5 shadow-premium space-y-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs font-bold text-slate-900">
                            Interview Round
                          </span>
                          <span className="rounded-lg bg-indigo-50 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-indigo-600 border border-indigo-100/50">
                            {interview.status}
                          </span>
                        </div>

                        <div className="space-y-2 text-xs text-slate-550">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            <span>{when}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                            <span>{interview.durationMinutes} minutes duration</span>
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
                              <span>Join Meeting</span>
                            </a>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
                              <MapPin className="h-3.5 w-3.5" />
                              <span>{interview.location || "Location TBD"}</span>
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
        ) : (
          /* Application Form / No Application Message */
          <div className="flex items-center gap-3 rounded-2xl border border-slate-250 bg-slate-50/50 p-5 text-sm text-slate-500 shadow-sm">
            <XCircle className="h-5 w-5 text-slate-400 shrink-0" />
            <p className="font-medium">No application found. Please contact the recruiting team to be added to this position.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Job Info Header Card */}
      <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-premium">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-650 shrink-0">
                <Briefcase className="h-4.5 w-4.5" />
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {job.title}
              </h1>
              <span
                className={`rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${job.isOpen
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                  : "bg-slate-50 text-slate-500 border border-slate-100"
                  }`}
              >
                {job.isOpen ? "Active" : "Closed"}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
              <div className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-slate-400" />
                <span>{job.department || "General"}</span>
              </div>
              <span className="text-slate-350">•</span>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span>{job.location || "Flexible"}</span>
              </div>
            </div>
          </div>

          {canClose && (
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <EditJobModal job={job} />
              {job.isOpen ? (
                <form action={closeJob.bind(null, job.id)}>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-950 active:scale-95 duration-200 cursor-pointer"
                  >
                    <XCircle className="h-4 w-4 text-slate-400" />
                    <span>Close Position</span>
                  </button>
                </form>
              ) : (
                <form action={reopenJob.bind(null, job.id)}>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-950 active:scale-95 duration-200 cursor-pointer"
                  >
                    <Sparkles className="h-4 w-4 text-emerald-500" />
                    <span>Reopen Position</span>
                  </button>
                </form>
              )}
              <DeleteJobButton jobId={job.id} />
            </div>
          )}
        </div>

        {/* Stage breakdown */}
        <div className="mt-8 border-t border-slate-50 pt-6">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Stage Counts</h4>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {stageOrder.map((stage) => {
              const count = job.candidates.filter((c) => c.stage === stage.key).length;
              return (
                <div
                  key={stage.key}
                  className="flex flex-col items-center gap-1 rounded-2xl border border-slate-100 bg-slate-50/20 py-3 text-center"
                >
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{stage.label}</span>
                  <span className="text-lg font-bold text-slate-900 mt-1">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Candidate Creation Form Section */}
      {job.isOpen ? (
        <CandidateForm jobId={job.id} />
      ) : (
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/50 p-5 text-sm text-slate-500 shadow-sm">
          <XCircle className="h-5 w-5 text-slate-400" />
          <p className="font-medium">This position is closed. Reopen the position to submit additional candidates.</p>
        </div>
      )}

      {/* Interview Coordinator Block */}
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-premium space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-50 pb-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-650">
            <CalendarRange className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-950">Interview Coordination</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">Schedule reviews and send calendar invites automatically.</p>
          </div>
        </div>

        {canSchedule ? (
          job.candidates.length > 0 ? (
            <ScheduleInterviewForm candidates={job.candidates} />
          ) : (
            <div className="rounded-2xl border border-slate-100 bg-slate-50/30 p-5 text-center text-sm text-slate-500">
              No candidates in pipeline. Add candidates below to schedule reviews.
            </div>
          )
        ) : (
          <div className="rounded-2xl border border-slate-100 bg-slate-50/30 p-5 text-center text-sm text-slate-500">
            You have read-only access to interview scheduling in this role.
          </div>
        )}

        <InterviewList interviews={interviews} />
      </div>

      {/* Candidate Pipeline Board Section */}
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-premium space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-50 pb-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-650">
            <Users2 className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-950">Visual Hiring Board</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">Drag-and-drop applicants to advance them through stages.</p>
          </div>
        </div>

        <PipelineBoard initialCandidates={job.candidates} />
      </div>
    </div>
  );
}
