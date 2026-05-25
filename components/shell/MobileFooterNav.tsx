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

export default function MobileFooterNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-100 bg-white/90 backdrop-blur-md lg:hidden">
      <div className="mx-auto flex max-w-3xl items-center justify-around px-6 py-2.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === "/" 
            ? pathname === "/" 
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-semibold transition-all duration-200 active:scale-90",
                isActive ? "text-indigo-600" : "text-slate-500 hover:text-slate-800"
              )}
            >
              <Icon className={cn("h-4.5 w-4.5", isActive ? "text-indigo-600" : "text-slate-400")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
