"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteJob } from "@/app/actions/jobs";

export default function DeleteJobButton({ jobId }: { jobId: string }) {
  const [pending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this job posting? This will remove all candidates and scheduled interviews associated with it. This action cannot be undone.")) {
      startTransition(async () => {
        try {
          await deleteJob(jobId);
        } catch (err) {
          alert(err instanceof Error ? err.message : "Unable to delete job.");
        }
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-xs font-bold text-rose-600 shadow-sm transition hover:border-rose-300 hover:text-rose-750 hover:bg-rose-50/20 active:scale-95 duration-200 cursor-pointer disabled:opacity-50"
    >
      <Trash2 className="h-4 w-4 text-rose-500" />
      <span>{pending ? "Deleting..." : "Delete Position"}</span>
    </button>
  );
}
