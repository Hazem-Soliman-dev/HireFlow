import Link from "next/link";
import type { Role } from "@prisma/client";
import { roleLabels } from "@/lib/roles";
import { Sparkles, RefreshCw } from "lucide-react";

export default function TopBar({ role }: { role: Role }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100/80 bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-650 to-violet-650 text-white shadow-md shadow-indigo-600/10 animate-float">
            <Sparkles className="h-5 w-5" />
            <div className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 animate-pulse" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight text-slate-900 font-display">HireFlow</p>
            <p className="text-[9px] font-bold tracking-wider uppercase text-slate-400/90">AI-Powered ATS</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-2 rounded-full bg-indigo-50/50 border border-indigo-100/60 px-3.5 py-1.5 text-xs font-bold text-indigo-600 sm:inline-flex shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
            {roleLabels[role]} View
          </span>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 px-4 py-2 text-xs font-bold text-slate-650 bg-white shadow-sm transition-all hover:border-slate-350 hover:text-slate-900 hover:bg-slate-50/40 active:scale-95 duration-200"
          >
            <RefreshCw className="h-3 w-3 text-slate-400" />
            <span>Switch Role</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
