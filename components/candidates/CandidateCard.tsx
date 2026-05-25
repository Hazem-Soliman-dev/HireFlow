"use client";

import type { Candidate } from "@prisma/client";
import { Mail, Sparkles, Phone, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CandidateCard({ 
  candidate,
  isDraggable = false,
  onClick
}: { 
  candidate: Candidate;
  isDraggable?: boolean;
  onClick?: () => void;
}) {
  const getScoreStyles = (score: number) => {
    if (score >= 80) return "bg-emerald-50 text-emerald-600 border border-emerald-100";
    if (score >= 60) return "bg-indigo-50 text-indigo-600 border border-indigo-100";
    return "bg-slate-50 text-slate-500 border border-slate-100";
  };

  return (
    <div 
      onClick={onClick}
      className={cn(
        "rounded-2xl border border-slate-100 bg-white p-2.5 shadow-premium transition-all duration-200",
        isDraggable 
          ? "cursor-grab active:cursor-grabbing hover:border-slate-200 hover:shadow-card" 
          : "",
        onClick ? "cursor-pointer" : ""
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-0.5">
          <p className="text-xs font-bold text-slate-900 leading-tight">
            {candidate.name}
          </p>
          <div className="flex flex-col gap-0.5 text-[10px] text-slate-500">
            <span className="flex items-center gap-1 hover:text-slate-900 transition-colors">
              <Mail className="h-3 w-3 text-slate-400" />
              {candidate.email}
            </span>
            {candidate.phone && (
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3 text-slate-400" />
                {candidate.phone}
              </span>
            )}
          </div>
        </div>
        {candidate.aiScore !== null ? (
          <span className={cn(
            "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] font-extrabold tracking-wider shrink-0",
            getScoreStyles(candidate.aiScore)
          )}>
            <Sparkles className="h-2.5 w-2.5" />
            <span>{candidate.aiScore}%</span>
          </span>
        ) : null}
      </div>

      {candidate.source && (
        <div className="mt-2.5 flex items-center justify-between border-t border-slate-50 pt-2 text-[10px] font-semibold text-slate-400">
          <span className="flex items-center gap-1">
            <Compass className="h-3 w-3" />
            Source: {candidate.source}
          </span>
        </div>
      )}
    </div>
  );
}
