"use client";

import { useFormStatus } from "react-dom";
import { Plus, Briefcase } from "lucide-react";

export function NewJobForm({
  action
}: {
  action: (formData: FormData) => void;
}) {
  return (
    <form
      action={action}
      className="rounded-3xl border border-slate-100 bg-white p-6 shadow-premium space-y-5 animate-fade-in-up"
    >
      <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50/70 text-indigo-600 border border-indigo-100/30">
          <Briefcase className="h-4 w-4" />
        </div>
        <h2 className="text-sm font-bold text-slate-950 font-display">Post a New Position</h2>
      </div>

      <div className="grid gap-4.5 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Job Title
          </label>
          <input
            name="title"
            required
            placeholder="Senior Frontend Engineer"
            className="w-full rounded-xl border border-slate-200/80 px-3.5 py-2 text-sm placeholder:text-slate-400/70 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Department
          </label>
          <input
            name="department"
            placeholder="Product Engineering"
            className="w-full rounded-xl border border-slate-200/80 px-3.5 py-2 text-sm placeholder:text-slate-400/70 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Location
          </label>
          <input
            name="location"
            placeholder="Remote - EMEA"
            className="w-full rounded-xl border border-slate-200/80 px-3.5 py-2 text-sm placeholder:text-slate-400/70 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Job Description
        </label>
        <textarea
          name="description"
          required
          rows={3}
          placeholder="Outline roles, responsibilities, tech stack, and experience requirements..."
          className="w-full rounded-xl border border-slate-200/80 px-3.5 py-2 text-sm placeholder:text-slate-400/70 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none"
        />
      </div>
      <div className="flex justify-end pt-2 border-t border-slate-50">
        <SubmitButton />
      </div>
    </form>
  );
}

// Separate component for useFormStatus pending states
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-5.5 py-2.5 text-xs font-bold text-white transition-all duration-250 hover:bg-indigo-600 disabled:opacity-75 hover:shadow-lg hover:shadow-indigo-600/15 active:scale-95 cursor-pointer"
    >
      <Plus className="h-4 w-4" />
      <span>{pending ? "Creating Posting..." : "Create Position"}</span>
    </button>
  );
}
