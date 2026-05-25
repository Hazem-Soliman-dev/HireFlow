"use client";

import { useState, useTransition, useEffect } from "react";
import type { Candidate, Interview, Stage } from "@prisma/client";
import { updateCandidateStage } from "@/app/actions/candidates";
import { X, Mail, Phone, Compass, Sparkles, Calendar, Clock, Video, MapPin, FileText, UserCheck, AlertCircle } from "lucide-react";
import { stageOrder } from "@/lib/roles";
import { cn } from "@/lib/utils";

type CandidateWithInterviews = Candidate & { interviews: Interview[] };

export default function CandidateDrawer({
  candidate,
  isOpen,
  onClose,
  onStageUpdated
}: {
  candidate: CandidateWithInterviews | null;
  isOpen: boolean;
  onClose: () => void;
  onStageUpdated?: (candidateId: string, stage: Stage) => void;
}) {
  const [activeTab, setActiveTab] = useState<"assessment" | "resume">("assessment");
  const [pending, startTransition] = useTransition();
  const [currentStage, setCurrentStage] = useState<Stage | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (candidate) {
      setCurrentStage(candidate.stage);
      setError(null);
    }
  }, [candidate]);

  if (!candidate || !isOpen) return null;

  const handleStageChange = (newStage: Stage) => {
    setError(null);
    setCurrentStage(newStage);

    startTransition(async () => {
      try {
        await updateCandidateStage(candidate.id, newStage);
        if (onStageUpdated) {
          onStageUpdated(candidate.id, newStage);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update stage.");
        // Rollback stage on screen
        setCurrentStage(candidate.stage);
      }
    });
  };

  const getScoreStyles = (score: number) => {
    if (score >= 80) return "bg-emerald-50 text-emerald-600 border border-emerald-100";
    if (score >= 60) return "bg-indigo-50 text-indigo-600 border border-indigo-100";
    return "bg-slate-50 text-slate-500 border border-slate-100";
  };

  const appliedDate = new Date(candidate.appliedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-300">
      {/* Click outside overlay to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      {/* Drawer Container */}
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-500">
              Candidate Profile
            </span>
            <h2 className="text-xl font-bold text-slate-900 leading-tight">
              {candidate.name}
            </h2>
            <div className="flex flex-col gap-1.5 pt-1 text-xs text-slate-500">
              <a href={`mailto:${candidate.email}`} className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                {candidate.email}
              </a>
              {candidate.phone && (
                <a href={`tel:${candidate.phone}`} className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  {candidate.phone}
                </a>
              )}
              <div className="flex items-center gap-1.5">
                <Compass className="h-3.5 w-3.5 text-slate-400" />
                <span>Applied via {candidate.source || "Direct Apply"} on {appliedDate}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-100 bg-slate-50/30 px-6">
          <button
            onClick={() => setActiveTab("assessment")}
            className={cn(
              "py-3 text-xs font-bold border-b-2 px-1 mr-6 transition-all cursor-pointer",
              activeTab === "assessment"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            )}
          >
            AI Assessment
          </button>
          <button
            onClick={() => setActiveTab("resume")}
            className={cn(
              "py-3 text-xs font-bold border-b-2 px-1 transition-all cursor-pointer",
              activeTab === "resume"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            )}
          >
            Resume Source Text
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-100 p-3.5 text-xs font-bold text-rose-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {activeTab === "assessment" ? (
            <div className="space-y-6">

              {/* AI Fit Score Gauge */}
              {candidate.aiScore !== null ? (
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-premium flex items-center gap-5">
                  <div className={cn(
                    "flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-xl font-extrabold tracking-tight",
                    getScoreStyles(candidate.aiScore)
                  )}>
                    {candidate.aiScore}%
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                      AI Score fit coefficient
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      Matches keywords, skills, experience depth, and career trajectory against role requirements.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/20 p-5 text-center text-xs font-semibold text-slate-400">
                  No AI screening run for this candidate.
                </div>
              )}

              {/* Detailed AI feedback text */}
              {candidate.aiFeedback && (
                <div className="space-y-2.5">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Screen Summary</h3>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/30 p-4 leading-relaxed text-xs text-slate-600 italic">
                    "{candidate.aiFeedback}"
                  </div>
                </div>
              )}

              {/* Resume download Link */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Resume Attachment</h3>
                <a
                  href={candidate.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-2xl border border-slate-150 bg-white p-4 transition-all hover:bg-slate-50 hover:border-slate-350 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">View original resume document</p>
                      <p className="text-[10px] text-slate-450 mt-0.5">Uploaded file (PDF Format)</p>
                    </div>
                  </div>
                </a>
              </div>

              {/* Interview schedule history */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Scheduled Assessments ({candidate.interviews.length})</h3>
                {candidate.interviews.length === 0 ? (
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/20 p-5 text-center text-xs font-semibold text-slate-400">
                    No interviews scheduled.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {candidate.interviews.map((iv) => {
                      const when = new Date(iv.scheduledAt).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short"
                      });
                      return (
                        <div key={iv.id} className="rounded-xl border border-slate-100 bg-white p-4 space-y-3">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-slate-900">Interview Round</span>
                            <span className="rounded-lg bg-indigo-50/50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-indigo-650 border border-indigo-100/50">
                              {iv.status}
                            </span>
                          </div>
                          <div className="space-y-1.5 text-[11px] text-slate-550">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3.5 w-3.5 text-slate-400" />
                              <span>{when} ({iv.durationMinutes} min)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-3.5 w-3.5 text-slate-400" />
                              <span>Interviewer: {iv.interviewerName}</span>
                            </div>
                          </div>
                          <div className="border-t border-slate-50 pt-2 flex items-center justify-between text-[10px]">
                            {iv.meetingLink ? (
                              <a
                                href={iv.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 font-bold text-indigo-600 hover:underline cursor-pointer"
                              >
                                <Video className="h-3.5 w-3.5" />
                                Join Call
                              </a>
                            ) : (
                              <span className="inline-flex items-center gap-1 font-medium text-slate-400">
                                <MapPin className="h-3.5 w-3.5" />
                                {iv.location || "Location TBD"}
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
            /* Resume Monospace source text viewer */
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Monospace Source Text</h3>
              <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 font-mono text-[10px] leading-relaxed text-slate-600 h-[480px] overflow-y-auto whitespace-pre-wrap">
                {candidate.resumeText || "No source text extracted."}
              </div>
            </div>
          )}
        </div>

        {/* Footer controls: Stage Changer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Candidate Stage</span>
            <div className="flex items-center gap-1.5 text-slate-800 font-semibold text-sm">
              <UserCheck className="h-4 w-4 text-indigo-600" />
              <span>Advance Status</span>
            </div>
          </div>

          <select
            value={currentStage || ""}
            onChange={(e) => handleStageChange(e.target.value as Stage)}
            disabled={pending}
            className="rounded-xl border border-slate-205 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 cursor-pointer disabled:opacity-50"
          >
            {stageOrder.map((stage) => (
              <option key={stage.key} value={stage.key}>
                {stage.label}
              </option>
            ))}
          </select>
        </div>

      </div>
    </div>
  );
}
