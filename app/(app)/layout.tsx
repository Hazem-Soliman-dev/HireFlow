import { requireRole } from "@/lib/auth";
import TopBar from "@/components/shell/TopBar";
import SideNav from "@/components/shell/SideNav";
import MobileFooterNav from "@/components/shell/MobileFooterNav";

export default async function AppLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const role = await requireRole();

  return (
    <div className="min-h-screen bg-slate-50/40">
      <TopBar role={role} />
      <div className="mx-auto flex max-w-7xl gap-8 px-6 pb-24 pt-8 lg:px-8">
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-24">
            <SideNav />
          </div>
        </aside>
        <main className="flex-1 space-y-8 min-w-0">{children}</main>
      </div>
      <MobileFooterNav />
    </div>
  );
}
