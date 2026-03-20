import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChart3, Upload, LayoutDashboard, FileText, Settings, ChevronLeft, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/upload", icon: Upload, label: "Upload Dataset" },
  { to: "/analysis", icon: BarChart3, label: "Analysis" },
  { to: "/report", icon: FileText, label: "Audit Report" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <aside
        className={cn(
          "flex flex-col border-r border-border bg-card transition-all duration-300",
          collapsed ? "w-16" : "w-60"
        )}
      >
        <div className="flex h-14 items-center gap-2 border-b border-border px-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
            <BarChart3 className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-semibold text-foreground tracking-tight">FairLens AI</span>
          )}
        </div>

        <nav className="flex-1 space-y-1 p-2">
          {navItems.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-2 space-y-1">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary transition-colors"
          >
            <ChevronLeft className={cn("h-4 w-4 shrink-0 transition-transform", collapsed && "rotate-180")} />
            {!collapsed && "Collapse"}
          </button>
          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary transition-colors"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && "Sign Out"}
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
