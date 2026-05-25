"use client";

import { useRef, useState, useTransition } from "react";
import type { Candidate } from "@prisma/client";
import { scheduleInterview } from "@/app/actions/interviews";
import { CalendarPlus, Send } from "lucide-react";

export default function ScheduleInterviewForm({
  candidates
}: {
  candidates: Candidate[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const submit = (formData: FormData) => {
    setError(null);
    const candidateId = String(formData.get("candidateId") ?? "");
    const scheduledAt = String(formData.get("scheduledAt") ?? "");
    const durationMinutes = Number(formData.get("durationMinutes") ?? 45);
    const interviewerName = String(formData.get("interviewerName") ?? "");
    const interviewerEmail = String(formData.get("interviewerEmail") ?? "");
    const meetingLink = String(formData.get("meetingLink") ?? "");
    const location = String(formData.get("location") ?? "");

    startTransition(async () => {
      try {
        await scheduleInterview({
          candidateId,
          scheduledAt,
          durationMinutes,
          interviewerName,
          interviewerEmail,
          meetingLink,
          location
        });
        formRef.current?.reset();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to schedule interview."
        );
      }
    });
  };

  return (
    <form
      ref={formRef}
      action={submit}
      className="rounded-3xl border border-slate-100 bg-slate-50/20 p-5 space-y-4"
    >
      <div className="grid gap-4.5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Select Candidate
          </label>
          <select
            name="candidateId"
            required
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
          >
            <option value="">Select candidate...</option>
            {candidates.map((candidate) => (
              <option key={candidate.id} value={candidate.id}>
                {candidate.name} ({candidate.stage.toLowerCase()})
              </option>
            ))}
          </select>
        </div>
        
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Scheduled Time
          </label>
          <input
            name="scheduledAt"
            type="datetime-local"
            required
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Duration
          </label>
          <select
            name="durationMinutes"
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
            defaultValue="45"
          >
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">60 minutes</option>
            <option value="90">90 minutes</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Interviewer Name
          </label>
          <input
            name="interviewerName"
            required
            placeholder="Morgan Reed"
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Interviewer Email
          </label>
          <input
            name="interviewerEmail"
            type="email"
            required
            placeholder="manager@company.com"
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Meeting Link / Room
          </label>
          <input
            name="meetingLink"
            placeholder="https://meet.google.com/..."
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
          />
        </div>

        <div className="sm:col-span-2 lg:col-span-3 space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Physical Location (optional)
          </label>
          <input
            name="location"
            placeholder="On-site • HQ Room 4A"
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
          />
        </div>
      </div>

      {error ? <p className="text-xs font-bold text-rose-600">{error}</p> : null}
      
      <div className="flex justify-end border-t border-slate-100 pt-4">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white transition-all duration-200 hover:bg-indigo-600 disabled:opacity-75 hover:shadow-lg hover:shadow-indigo-600/10 active:scale-95 cursor-pointer"
        >
          <CalendarPlus className="h-4 w-4" />
          <span>{pending ? "Sending Calendar Invite..." : "Send Invite"}</span>
        </button>
      </div>
    </form>
  );
}
