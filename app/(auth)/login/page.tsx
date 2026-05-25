import { setRoleAction } from "@/app/actions/auth";
import { roleDescriptions, roleLabels } from "@/lib/roles";
import type { Role } from "@prisma/client";
import { Briefcase, ClipboardCheck, Shield, UserRound, Sparkles, CheckCircle2, Award } from "lucide-react";

const roleIcons: Record<Role, React.ReactNode> = {
  ADMIN: <Shield className="h-5 w-5 text-indigo-600 group-hover:scale-110 transition-transform duration-250" />,
  RECRUITER: <Briefcase className="h-5 w-5 text-indigo-600 group-hover:scale-110 transition-transform duration-250" />,
  HIRING_MANAGER: <ClipboardCheck className="h-5 w-5 text-indigo-600 group-hover:scale-110 transition-transform duration-250" />,
  CANDIDATE: <UserRound className="h-5 w-5 text-indigo-600 group-hover:scale-110 transition-transform duration-250" />
};

const roles: Role[] = ["ADMIN", "RECRUITER", "HIRING_MANAGER", "CANDIDATE"];

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-slate-50/30">
      {/* Left side: Premium Brand & Intro Panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-slate-950 p-12 text-white lg:flex">
        {/* Glow Effects */}
        <div className="absolute -left-1/4 -top-1/4 h-[600px] w-[600px] rounded-full bg-indigo-500/15 blur-[130px] pointer-events-none animate-pulse-subtle" />
        <div className="absolute -bottom-1/4 -right-1/4 h-[500px] w-[500px] rounded-full bg-violet-650/15 blur-[110px] pointer-events-none animate-pulse-subtle" />

        {/* Top Branding Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-550/20 animate-float">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight text-white font-display">HireFlow</p>
            <p className="text-[9px] font-bold tracking-wider uppercase text-slate-400">Enterprise ATS</p>
          </div>
        </div>

        {/* Hero Copy */}
        <div className="relative z-10 my-auto max-w-lg space-y-6 animate-fade-in-up">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 px-3 py-1 text-xs font-bold text-indigo-300">
            <Award className="h-3.5 w-3.5" />
            Next-Gen Candidate Selection
          </span>
          <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl font-display">
            Streamline your hiring process with AI insights.
          </h1>
          <p className="text-base leading-relaxed text-slate-400 font-sans">
            HireFlow helps teams parse resumes, rate matching coefficients, schedule collaborative interviews, and manage visual pipelines.
          </p>

          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/15">
                <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" />
              </div>
              <span className="text-sm text-slate-300">Instant resume parsing & AI matching coefficients</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/15">
                <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" />
              </div>
              <span className="text-sm text-slate-300">Visual drag-and-drop candidate pipelines</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/15">
                <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" />
              </div>
              <span className="text-sm text-slate-300">Automated scheduling and email dispatch</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-slate-500">
          © 2026 HireFlow Inc. All rights reserved. Demo Environment.
        </div>
      </div>

      {/* Right side: Persona selector form */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-xl space-y-7">
          <div className="space-y-2 animate-fade-in-up">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
              Interactive Demo
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-display">
              Select a view to explore
            </h2>
            <p className="text-sm text-slate-500 font-sans">
              Switch roles to experience HireFlow from different perspectives. Permissions and interfaces adapt dynamically.
            </p>
          </div>

          <div className="grid gap-3.5 animate-fade-in-up [animation-delay:100ms]">
            {roles.map((role) => (
              <form
                key={role}
                action={setRoleAction}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-premium transition-all duration-250 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-glow-indigo"
              >
                <input type="hidden" name="role" value={role} />
                <div className="flex items-start gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50/70 border border-indigo-100/50 group-hover:bg-indigo-100/40 transition-colors">
                    {roleIcons[role]}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors font-display">
                        {roleLabels[role]}
                      </h3>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                        Role
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-550 font-sans">
                      {roleDescriptions[role]}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end border-t border-slate-50 mt-4 pt-3">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white transition-all duration-250 group-hover:bg-indigo-650 group-active:scale-[0.98] shadow-sm hover:shadow-indigo-600/10 cursor-pointer"
                  >
                    Enter Workspace
                  </button>
                </div>
              </form>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
