"use client";

import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { BarChart3, PieChart as PieIcon } from "lucide-react";

// Vibrant, harmonious SaaS color scheme (Indigo, Sky Blue, Emerald, Violet, Amber, Rose)
const COLORS = ["#4f46e5", "#0ea5e9", "#10b981", "#8b5cf6", "#f59e0b", "#f43f5e"];

export default function AnalyticsCharts({
  stageData,
  sourceData
}: {
  stageData: { stage: string; value: number }[];
  sourceData: { source: string; value: number }[];
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Bar Chart: Stage Conversion */}
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-premium">
        <div className="flex items-center gap-2 border-b border-slate-50 pb-4 mb-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-650">
            <BarChart3 className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-950">
            Stage Conversion
          </h3>
        </div>
        
        <div className="h-64 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="stage" 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
              />
              <YAxis 
                allowDecimals={false} 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
              />
              <Tooltip 
                cursor={{ fill: "#f8fafc", radius: 4 }} 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  borderColor: '#f1f5f9', 
                  borderRadius: '12px',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.03)',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#0f172a'
                }}
              />
              <Bar dataKey="value" fill="#4f46e5" radius={[6, 6, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart: Candidate Sources */}
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-premium">
        <div className="flex items-center gap-2 border-b border-slate-50 pb-4 mb-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-650">
            <PieIcon className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-950">
            Candidate Source Mix
          </h3>
        </div>

        {sourceData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-xs font-semibold text-slate-400 bg-slate-50/20 rounded-2xl border border-dashed border-slate-200">
            No source metrics tracked yet.
          </div>
        ) : (
          <div className="h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  dataKey="value"
                  nameKey="source"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={5}
                >
                  {sourceData.map((entry, index) => (
                    <Cell
                      key={entry.source}
                      fill={COLORS[index % COLORS.length]}
                      className="outline-none focus:outline-none"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderColor: '#f1f5f9', 
                    borderRadius: '12px',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.03)',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#0f172a'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
