"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Briefcase, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/",
    label: "Dashboard",
    icon: LayoutDashboard
  },
  {
    href: "/jobs",
    label: "Jobs",
    icon: Briefcase
  },
  {
    href: "/analytics",
    label: "Analytics",
    icon: BarChart3
  }
];

export default function SideNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1.5">
      {navItems.map((item) => {
        const Icon = item.icon;
        // Handle active state matching (exact for homepage, prefix for nested routes like /jobs/[id])
        const isActive = item.href === "/" 
          ? pathname === "/" 
          : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 group active:scale-[0.98]",
              isActive
                ? "bg-indigo-50/70 border border-indigo-100/50 text-indigo-600 shadow-sm"
                : "border border-transparent text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
            )}
          >
            <Icon className={cn(
              "h-4 w-4 transition-transform duration-200 group-hover:scale-110",
              isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
            )} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
