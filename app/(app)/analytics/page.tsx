import AnalyticsCharts from "@/components/analytics/AnalyticsCharts";
import StatCard from "@/components/dashboard/StatCard";
import { prisma } from "@/lib/prisma";
import { stageOrder } from "@/lib/roles";
import { BarChart3 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const [
    totalCandidates,
    hiredCount,
    rejectedCount,
    stageCounts,
    sourceCounts,
    hires
  ] = await Promise.all([
    prisma.candidate.count(),
    prisma.candidate.count({ where: { stage: "HIRED" } }),
    prisma.candidate.count({ where: { stage: "REJECTED" } }),
    prisma.candidate.groupBy({
      by: ["stage"],
      _count: { stage: true }
    }),
    prisma.candidate.groupBy({
      by: ["source"],
      _count: { source: true }
    }),
    prisma.candidate.findMany({
      where: { hiredAt: { not: null } },
      select: { appliedAt: true, hiredAt: true }
    })
  ]);

  const stageMap = new Map(
    stageCounts.map((stage) => [stage.stage, stage._count.stage])
  );
  const stageData = stageOrder.map((stage) => ({
    stage: stage.label,
    value: stageMap.get(stage.key) ?? 0
  }));

  const sourceData = sourceCounts
    .map((source) => ({
      source: source.source || "Unknown",
      value: source._count.source
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const avgTimeToHireDays = hires.length
    ? Math.round(
        (hires.reduce((sum, hire) => {
          const hiredAt = hire.hiredAt ?? new Date();
          return sum + (hiredAt.getTime() - hire.appliedAt.getTime());
        }, 0) /
          hires.length /
          (1000 * 60 * 60 * 24)) *
          10
      ) / 10
    : null;

  const hireRate =
    totalCandidates > 0 ? Math.round((hiredCount / totalCandidates) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Page Header */}
      <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-premium">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-650">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Analytics Insights</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Track conversion efficiency, time-to-hire velocity, and candidate source performance.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Time to hire"
          value={avgTimeToHireDays ? `${avgTimeToHireDays} days` : "—"}
          caption="Average duration from apply to hire stage"
        />
        <StatCard
          label="Hire rate"
          value={`${hireRate}%`}
          caption={`${hiredCount} hires out of ${totalCandidates} total applicants`}
        />
        <StatCard
          label="Rejected"
          value={rejectedCount}
          caption="Unmatched candidates removed from pipeline"
          tone="text-rose-600"
        />
      </div>

      {/* Visual Charting Blocks */}
      <AnalyticsCharts stageData={stageData} sourceData={sourceData} />
    </div>
  );
}
