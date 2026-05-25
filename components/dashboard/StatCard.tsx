import { cn } from "@/lib/utils";
import { Briefcase, Users, Sparkles, Clock, TrendingUp, XCircle, BarChart2 } from "lucide-react";

const labelIcons: Record<string, { icon: React.ReactNode; bg: string; text: string }> = {
  "open roles": { icon: <Briefcase className="h-5 w-5" />, bg: "bg-indigo-50 border-indigo-100/50", text: "text-indigo-600" },
  "candidates": { icon: <Users className="h-5 w-5" />, bg: "bg-blue-50 border-blue-100/50", text: "text-blue-600" },
  "avg. ai fit": { icon: <Sparkles className="h-5 w-5" />, bg: "bg-amber-50 border-amber-100/50", text: "text-amber-600" },
  "time to hire": { icon: <Clock className="h-5 w-5" />, bg: "bg-emerald-50 border-emerald-100/50", text: "text-emerald-600" },
  "hire rate": { icon: <TrendingUp className="h-5 w-5" />, bg: "bg-violet-50 border-violet-100/50", text: "text-violet-600" },
  "rejected": { icon: <XCircle className="h-5 w-5" />, bg: "bg-rose-50 border-rose-100/50", text: "text-rose-600" },
};

export default function StatCard({
  label,
  value,
  caption,
  tone
}: {
  label: string;
  value: string | number;
  caption?: string;
  tone?: string;
}) {
  const normLabel = label.toLowerCase().trim();
  const iconConfig = labelIcons[normLabel] || {
    icon: <BarChart2 className="h-5 w-5" />,
    bg: "bg-slate-50 border-slate-100",
    text: "text-slate-600"
  };

  return (
    <div className="rounded-2xl border border-slate-100/80 bg-white p-6 shadow-premium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </p>
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl border", iconConfig.bg, iconConfig.text)}>
          {iconConfig.icon}
        </div>
      </div>
      <div className="mt-4 flex items-baseline justify-between">
        <p className={cn("text-3xl font-bold tracking-tight text-slate-900", tone)}>
          {value}
        </p>
      </div>
      {caption ? (
        <p className="mt-2 text-xs font-medium text-slate-500">{caption}</p>
      ) : null}
    </div>
  );
}
