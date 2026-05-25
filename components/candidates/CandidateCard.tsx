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
    if (score >= 80) return "bg-emerald-50 text-emerald-600 border border-emerald-200/60 shadow-glow-emerald font-extrabold";
    if (score >= 60) return "bg-indigo-50 text-indigo-600 border border-indigo-200/60 shadow-glow-indigo font-extrabold";
    return "bg-slate-50 text-slate-500 border border-slate-200/80 font-bold";
  };

  return (
    <div 
      onClick={onClick}
      className={cn(
        "rounded-2xl border border-slate-100 bg-white p-3.5 shadow-premium transition-all duration-300 font-sans",
        isDraggable 
          ? "cursor-grab active:cursor-grabbing hover:border-slate-200 hover:shadow-card hover:-translate-y-0.5" 
          : "",
        onClick ? "cursor-pointer" : ""
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-905 leading-tight font-display">
            {candidate.name}
          </p>
          <div className="flex flex-col gap-1 text-[10px] text-slate-500">
            <span className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
              <Mail className="h-3.5 w-3.5 text-slate-400" />
              {candidate.email}
            </span>
            {candidate.phone && (
              <span className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                {candidate.phone}
              </span>
            )}
          </div>
        </div>
        {candidate.aiScore !== null ? (
          <span className={cn(
            "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] tracking-wider shrink-0",
            getScoreStyles(candidate.aiScore)
          )}>
            <Sparkles className="h-2.5 w-2.5" />
            <span>{candidate.aiScore}%</span>
          </span>
        ) : null}
      </div>

      {candidate.source && (
        <div className="mt-3 flex items-center justify-between border-t border-slate-50 pt-2.5 text-[9px] font-bold text-slate-400">
          <span className="flex items-center gap-1">
            <Compass className="h-3.5 w-3.5 text-slate-400" />
            <span>Source: {candidate.source}</span>
          </span>
        </div>
      )}
    </div>
  );
}
