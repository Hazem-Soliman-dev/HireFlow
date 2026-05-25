import type { Interview } from "@prisma/client";
import { Calendar, Clock, User, Video, MapPin } from "lucide-react";

type InterviewItem = Interview & { candidate: { name: string } };

export default function InterviewList({
  interviews
}: {
  interviews: InterviewItem[];
}) {
  if (interviews.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/20 p-8 text-center text-xs font-semibold text-slate-400">
        No interviews scheduled yet for this role.
      </div>
    );
  }

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-emerald-50 text-emerald-600 border border-emerald-105";
      case "CANCELED":
        return "bg-rose-50 text-rose-650 border border-rose-105";
      default:
        return "bg-indigo-50 text-indigo-650 border border-indigo-105";
    }
  };

  return (
    <div className="max-h-[380px] overflow-y-auto pr-1 font-sans">
      <div className="grid gap-4 sm:grid-cols-2">
        {interviews.map((interview) => {
          const when = new Date(interview.scheduledAt).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short"
          });
          return (
            <div
              key={interview.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-premium transition-all duration-300 hover:-translate-y-1 hover:border-indigo-100/80 hover:shadow-card"
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-slate-900 font-display">
                    {interview.candidate.name}
                  </span>
                  <span className={`rounded-lg px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${getStatusStyles(interview.status)}`}>
                    {interview.status}
                  </span>
                </div>
                
                <div className="mt-4 space-y-2.5 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>{when}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>{interview.durationMinutes} minutes duration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-slate-400" />
                    <span>Interviewer: {interview.interviewerName}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t border-slate-50 pt-3.5">
                {interview.meetingLink ? (
                  <a
                    href={interview.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 hover:underline cursor-pointer"
                  >
                    <Video className="h-3.5 w-3.5" />
                    <span>Join Video Call</span>
                  </a>
                ) : (
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{interview.location || "Location TBD"}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
