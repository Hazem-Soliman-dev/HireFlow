import Link from "next/link";
import type { Job } from "@prisma/client";
import { Building2, MapPin, ArrowRight } from "lucide-react";

export default function JobCard({ job, count }: { job: Job; count: number }) {
  return (
    <Link
      href={`/jobs/${job.id}`}
      className="group flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-premium transition-all duration-250 hover:-translate-y-0.5 hover:border-indigo-150 hover:shadow-card active:scale-[0.99]"
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
            {job.title}
          </h3>
          <span
            className={`shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
              job.isOpen
                ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                : "bg-slate-50 text-slate-400 border border-slate-100"
            }`}
          >
            {job.isOpen ? "Active" : "Closed"}
          </span>
        </div>
        
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-450">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Building2 className="h-3.5 w-3.5 text-slate-400" />
            <span>{job.department || "General"}</span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-1.5 text-slate-500">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            <span>{job.location || "Flexible"}</span>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-50 pt-4">
        <span className="text-xs font-semibold text-slate-500">
          {count} candidate{count === 1 ? "" : "s"} applied
        </span>
        <div className="flex items-center gap-1 text-xs font-bold text-indigo-650 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span>Manage</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
