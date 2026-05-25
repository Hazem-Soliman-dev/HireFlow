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
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-premium space-y-6">
      <div className="flex items-center gap-2 border-b border-slate-50 pb-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-650">
          <UserPlus className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-950">Add Candidate</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Upload a resume PDF to run the automated AI match score analysis.</p>
        </div>
      </div>

      <form action={submit} className="grid gap-4.5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Full Name
          </label>
          <input
            name="name"
            required
            placeholder="Jordan Blake"
            className="w-full rounded-xl border border-slate-200/80 px-3.5 py-2 text-sm placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Email Address
          </label>
          <input
            name="email"
            type="email"
            required
            placeholder="jordan@domain.com"
            className="w-full rounded-xl border border-slate-200/80 px-3.5 py-2 text-sm placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Phone (optional)
          </label>
          <input
            name="phone"
            placeholder="+1 555 010 234"
            className="w-full rounded-xl border border-slate-200/80 px-3.5 py-2 text-sm placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Referral Source
          </label>
          <input
            name="source"
            placeholder="LinkedIn"
            className="w-full rounded-xl border border-slate-200/80 px-3.5 py-2 text-sm placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
          />
        </div>

        {/* Upload Button Block */}
        <div className="sm:col-span-2 lg:col-span-4 flex flex-col gap-2 rounded-2xl bg-slate-50/50 p-4 border border-slate-100/50 mt-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Resume (PDF Format)
          </label>
          <div className="flex flex-wrap items-center gap-4 pt-1">
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
              className="ut-button:bg-indigo-650 ut-button:hover:bg-indigo-700 ut-button:rounded-xl ut-button:px-4.5 ut-button:py-2.5 ut-button:text-xs ut-button:font-bold ut-button:transition-all ut-button:duration-200 ut-button:shadow-sm ut-allowed-content:text-[10px] ut-allowed-content:text-slate-400"
            />
            {resumeUrl ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg px-2.5 py-1.5 shadow-sm">
                <Check className="h-3.5 w-3.5" />
                Resume Attached Successfully
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400">
                <Paperclip className="h-3.5 w-3.5" />
                No file attached yet
              </span>
            )}
          </div>
        </div>

        {error ? (
          <p className="text-xs font-bold text-rose-600 sm:col-span-2 lg:col-span-4">{error}</p>
        ) : null}

        <div className="sm:col-span-2 lg:col-span-4 flex justify-end border-t border-slate-50 pt-4 mt-1">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white transition-all duration-200 hover:bg-indigo-600 disabled:opacity-75 hover:shadow-lg hover:shadow-indigo-600/10 active:scale-95 cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            <span>{pending ? "Analyzing Resume with AI..." : "Attach and Score"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
