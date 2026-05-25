"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { UploadButton } from "@uploadthing/react";
import type { UploadRouter } from "@/lib/uploadthing";
import { createCandidate } from "@/app/actions/candidates";
import { UserPlus, Sparkles, Check, Paperclip } from "lucide-react";

export default function CandidateForm({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [resumeUrl, setResumeUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const submit = (formData: FormData) => {
    setError(null);
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const phone = String(formData.get("phone") ?? "");
    const source = String(formData.get("source") ?? "");

    startTransition(async () => {
      if (!resumeUrl) {
        setError("Please upload a resume PDF before submitting.");
        return;
      }
      try {
        await createCandidate({
          jobId,
          name,
          email,
          phone,
          source,
          resumeUrl
        });
        router.refresh();
        setResumeUrl("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to add candidate.");
      }
    });
  };

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-4 sm:p-6 shadow-premium space-y-6 font-sans">
      <div className="flex items-center gap-2 border-b border-slate-50 pb-4">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-50/70 text-indigo-600 border border-indigo-100/30">
          <UserPlus className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-slate-950 font-display">Add Candidate</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Upload a resume PDF to run the automated AI match score analysis.</p>
        </div>
      </div>

      <form action={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Full Name
          </label>
          <input
            name="name"
            required
            placeholder="Jordan Blake"
            className="w-full min-w-0 rounded-xl border border-slate-200/80 px-3.5 py-2 text-sm placeholder:text-slate-400/70 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Email Address
          </label>
          <input
            name="email"
            type="email"
            required
            placeholder="jordan@domain.com"
            className="w-full min-w-0 rounded-xl border border-slate-200/80 px-3.5 py-2 text-sm placeholder:text-slate-400/70 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Phone (optional)
          </label>
          <input
            name="phone"
            placeholder="+1 555 010 234"
            className="w-full min-w-0 rounded-xl border border-slate-200/80 px-3.5 py-2 text-sm placeholder:text-slate-400/70 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Referral Source
          </label>
          <input
            name="source"
            placeholder="LinkedIn"
            className="w-full min-w-0 rounded-xl border border-slate-200/80 px-3.5 py-2 text-sm placeholder:text-slate-400/70 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none"
          />
        </div>

        {/* Upload Button Block */}
        <div className="sm:col-span-2 lg:col-span-4 flex flex-col gap-2 rounded-2xl bg-slate-50/30 p-3.5 sm:p-4 border border-slate-100 mt-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Resume (PDF Format)
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 pt-1 w-full overflow-hidden">
            <div className="w-full sm:w-auto overflow-x-auto min-w-0">
              <UploadButton<UploadRouter, "resumeUploader">
                endpoint="resumeUploader"
                onClientUploadComplete={(res) => {
                  const url = res?.[0]?.url ?? "";
                  setResumeUrl(url);
                  setError(null);
                }}
                onUploadError={(uploadError) => {
                  setError(uploadError.message);
                }}
                appearance={{
                  button: "bg-indigo-600 hover:bg-indigo-700 rounded-xl px-5 py-2.5 text-xs font-bold transition-all duration-250 shadow-sm text-white w-full sm:w-auto cursor-pointer focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:outline-none",
                  allowedContent: "text-[10px] text-slate-400 mt-1",
                  container: "w-full sm:w-auto flex flex-col items-center sm:items-start"
                }}
              />
            </div>
            {resumeUrl ? (
              <span className="inline-flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-250/60 rounded-lg px-2.5 py-1.5 shadow-sm shadow-emerald-50 w-full sm:w-auto shrink-0">
                <Check className="h-3.5 w-3.5" />
                Resume Attached Successfully
              </span>
            ) : (
              <span className="inline-flex items-center justify-center sm:justify-start gap-1.5 text-[10px] font-bold text-slate-400 w-full sm:w-auto py-1">
                <Paperclip className="h-3.5 w-3.5" />
                No file attached yet
              </span>
            )}
          </div>
        </div>

        {error ? (
          <p className="text-xs font-bold text-rose-650 sm:col-span-2 lg:col-span-4">{error}</p>
        ) : null}

        <div className="sm:col-span-2 lg:col-span-4 flex justify-end border-t border-slate-50 pt-4 mt-1">
          <button
            type="submit"
            disabled={pending}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-bold text-white transition-all duration-250 hover:bg-indigo-600 disabled:opacity-75 hover:shadow-lg hover:shadow-indigo-600/15 active:scale-95 cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            <span>{pending ? "Analyzing Resume with AI..." : "Attach and Score"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
