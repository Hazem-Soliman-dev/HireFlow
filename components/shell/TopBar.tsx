import Link from "next/link";
import type { Role } from "@prisma/client";
import { roleLabels } from "@/lib/roles";
import { Sparkles, RefreshCw } from "lucide-react";

export default function TopBar({ role }: { role: Role }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/10">
            <Sparkles className="h-5 w-5" />
            <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 animate-pulse" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight text-slate-900">HireFlow</p>
            <p className="text-[10px] font-medium tracking-wider uppercase text-slate-400">AI-Powered ATS</p>
          </div>
        </div>
        <div className="flex items-center gap-3.5">
          <span className="hidden items-center gap-1.5 rounded-lg bg-indigo-50/50 border border-indigo-100/50 px-3 py-1.5 text-xs font-semibold text-indigo-600 sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            {roleLabels[role]} View
          </span>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-950 hover:bg-slate-50/50 active:scale-95 duration-200"
          >
            <RefreshCw className="h-3 w-3" />
            Switch Role
          </Link>
        </div>
      </div>
    </header>
  );
}
